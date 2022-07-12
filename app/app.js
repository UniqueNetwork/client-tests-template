const { ApiPromise, WsProvider } = require('@polkadot/api');
const { web3Enable, web3Accounts, web3FromAddress } = require('@polkadot/extension-dapp');

const getAccounts = async () => {
  const allInjected = await web3Enable('Example app');
  if(!allInjected.length) {
    return [];
  }
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


module.exports = {
  getAccounts, transfer, connect
}
