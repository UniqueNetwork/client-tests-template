# App tests

## Install
Init [polkadot.js extension](https://github.com/polkadot-js/extension) directory by running `npm run init-extension`. Install playwright using `npm i`. 

Set your account seed for testing in `config/local.ts`, for example:
```typescript
export default {
  accountSeed: 'high olive ...'
}
```
You can also overwrite defaults from `config/global.ts` if you need.

## Run test
Run application from `../app` directory. Run test using `npm run test`.
