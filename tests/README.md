# App tests

## Prepare
0. Install node modules 
    ```shell
    npm i
    ```
1. Init [polkadot.js extension](https://github.com/polkadot-js/extension) directory by running 
    ```shell
    npm run init-polkadot-extension
    ```
2. Init [metamask](https://github.com/MetaMask/metamask-extension/) extension 
   
    Run the following command in the terminal: 

    ```shell
    npm run init-metamask-extension
    ```
3. Create `config/local.ts` and update the values for testing if required. You can leave them as is since all default values allow tests to run successfully.   

**NOTE:** it is recommended to create `config/local.ts` however, you can also overwrite defaults from `config/global.ts` if you need.

## Run test
1. Make sure the application is running ([How to run application](../app/README.md))
2. For each extension separated `.test.ts` file is added: `polkadot.test.ts` and `metamask.test.ts`
   
   Run both using:
    ```shell
    npm run test
    ```

    Also you can run polkadot\metamask tests by running appropriate commands:
     ```shell
    npx playwright test polkadot.test.ts
    ```
    or
    ```shell
    npx playwright test metamask.test.ts
    ```
## Update extensions

1. To test the latest version of the `Polkadot.js`, run:
    ```shell
    npm run update-extension
    ```
2. To test the latest version of the `Metamask` extension:
   - Go to the [link](https://github.com/MetaMask/metamask-extension/releases/) and check the latest version of the extension. 
   - Update the version for `init-metamask-extension` script in the `package.json`. For example, current version is v10.23.**1**, so when the next version is released (e.g. v10.23.**2**) update the version in the script as follows `...download/v10.23.2/metamask-chrome-10.23.2.zip...` 
