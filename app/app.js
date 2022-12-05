const { ApiPromise, WsProvider } = require('@polkadot/api');
const { web3Enable, web3Accounts, web3FromAddress } = require('@polkadot/extension-dapp');

const { ethers } = require('ethers');


const sleep = async (time) => {
  await new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
}

const getAccounts = async () => {
  const appName = 'Example app';
  let allInjected = [];
  for(let i = 5; i--;) {
    allInjected = await web3Enable(appName);
    if(allInjected.length) break;
    await sleep(1000);
  }
  if(!allInjected.length) return [];

  return await web3Accounts();
}

const connect = async (wsEndpoint) => {
  const api = new ApiPromise({
    provider: new WsProvider(wsEndpoint)
  });

  await api.isReady;

  return api;
}

const transfer = async (api, signer, subReceiver, amount) => {
  const injector = await web3FromAddress(signer);
  return await signTransaction(signer, injector, api.tx.balances.transfer(subReceiver, amount), 'api.tx.balances.transfer');
}

const transactionStatus = {
  NOT_READY: 'NotReady',
  FAIL: 'Fail',
  SUCCESS: 'Success'
}

const getTransactionStatus = ({events, status}) => {
  if (status.isReady) {
    return transactionStatus.NOT_READY;
  }
  if (status.isBroadcast) {
    return transactionStatus.NOT_READY;
  }
  if (status.isInBlock || status.isFinalized) {
    const errors = events.filter(e => e.event.data.method === 'ExtrinsicFailed');
    if(errors.length > 0) {
      return transactionStatus.FAIL;
    }
    if(events.filter(e => e.event.data.method === 'ExtrinsicSuccess').length > 0) {
      return transactionStatus.SUCCESS;
    }
  }

  return status.FAIL;
}

const signTransaction = (sender, injector, transaction, label='transaction') => {
  return new Promise(async (resolve, reject) => {
    try {
      let unsub = await transaction.signAndSend(sender, {signer: injector.signer}, result => {
        const status = getTransactionStatus(result);

        if (status === transactionStatus.SUCCESS) {
          console.log(`${label} successful`);
          resolve({result, status});
          unsub();
        } else if (status === transactionStatus.FAIL) {
          console.error(`Something went wrong with ${label}. Status: ${status}`);
          console.error(result.toHuman());
          reject({result, status});
          unsub();
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
}


const switchMetamaskNetwork = async (rpcEndpoint) => {
  const chainId = `0x${Number(await getChainId(rpcEndpoint)).toString(16)}`;
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainId }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code !== 4902) {
      console.error(switchError);
      return;
    }
    try {
      window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: chainId,
          rpcUrls: [rpcEndpoint],
          chainName: 'Opal testnet',
          nativeCurrency: {
            name: 'OPAL',
            symbol: 'OPL',
            decimals: 18
          }
        }]
      });
    } catch (addError) {
      console.error(addError);
    }
  }
}

const getChainId = async (rpcEndpoint) => {
  const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint);
  return (await provider.getNetwork()).chainId;
}


const connectMetamask = async (rpcEndpoint) => {
  await switchMetamaskNetwork(rpcEndpoint);

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const accounts = await provider.send('eth_requestAccounts', []);

  return {provider, accounts};
}

const createCollectionFromEth = async (account, provider, collection) => {
  let result = null;
  const signer = provider.getSigner(account);
  const collectionHelper = new ethers.Contract('0x6c4e9fe1ae37a41e93cee429e8e1881abdcbb54f', ['function createNFTCollection(string memory name, string memory description, string memory tokenPrefix) external payable returns (address)'], signer);
  const logReader = new ethers.utils.Interface(['event CollectionCreated(address indexed owner, address indexed collectionId)']);

  try {
    const tx = await collectionHelper.createNFTCollection(collection.name, collection.description, collection.tokenPrefix, {value: ethers.utils.parseEther('2')});
    const txResult = await tx.wait();
    const log = txResult.logs.map(x => logReader.parseLog(x))[0];
    result = log.args.collectionId;
  } catch(e) {
    console.error(e);
    return;
  }
  return result;
};

module.exports = {
  getAccounts, transfer, connect, switchMetamaskNetwork, getChainId, connectMetamask, createCollectionFromEth
}
