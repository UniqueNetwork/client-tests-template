// @ts-ignore
import path from 'path';

import { chromium, test } from '@playwright/test';
import { MetamaskPage, MetamaskExtensionPage } from './pom';
import { config } from './config';

const metamaskExtensionPath = path.join(__dirname, 'extensions', 'metamask-ext');

const metamaskAccount = {
  mnemonic: config.accountSeed,
  password: '1234qwerty',
  ethAddress: config.accountEthAddress
};

const baseUiTest = test.extend({
  context: async ({}, use) => {
    const launchOptions = {
      devtools: false,
      headless: false,
      args: [
        `--disable-extensions-except=${metamaskExtensionPath}`,
        `--load-extension=${metamaskExtensionPath}`,
      ]
    };
    const context = await chromium.launchPersistentContext('', launchOptions);
    await use(context);
  }
});

baseUiTest.describe('App test', () => {
  baseUiTest('Test creation a collection with metamask extension', async ({context}) => {
    const metamaskPage = new MetamaskPage(await context.newPage());
    await metamaskPage.navigate();
    await metamaskPage.wait(); // Wait until 'Welcome' page of the metamask extension is loaded. Please read the comment below. 
    context.pages()[2].close(); // TO DO. Think how to launch the browser with no tabs. Currently this step is required because on first opening the browser with metamask extension 'Welcome' page is automatically opened.
    const extensionPage = new MetamaskExtensionPage(await context.newPage());
    await extensionPage.connectAccountByExtension(metamaskAccount.mnemonic, metamaskAccount.password);
    await extensionPage.selectNetwork(config.networkName, config.rpcURL, config.chainId, config.currency);
    await metamaskPage.connect(config.rpcURL);
    await extensionPage.reload();
    await extensionPage.connectToTheSite();
    await metamaskPage.selectAccount(metamaskAccount.ethAddress);
    await metamaskPage.createCollection();
    await extensionPage.confirmTransaction();
    await metamaskPage.checkCollectionCreated();
  })
});
