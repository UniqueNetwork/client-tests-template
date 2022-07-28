# App tests

## Prepare
0. Install node modules 
    ```shell
    npm i
    ```
1. Init [polkadot.js extension](https://github.com/polkadot-js/extension) directory by running 
    ```shell
    npm run init-extension
    ```

2. Set your account seed for testing in `config/local.ts`, for example:
    ```typescript
    export default {
      accountSeed: 'high olive ...'
    }
    ```

You can also overwrite defaults from `config/global.ts` if you need.

## Run test
1. Make sure the application is running ([How to run application](../app/README.md))
2. Run autotests using
    ```shell
    npm run test
    ```

## Update extension

1. To test the latest version of the application, run:
    ```shell
    npm run update-extension
    ```

