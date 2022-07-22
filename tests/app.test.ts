import path from 'path';

import { chromium, test } from '@playwright/test';
import { AppPage, PolkadotjsExtensionPage } from './pom';
import { config } from './config';

const extensionPath = path.join(__dirname, 'extension', 'packages', 'extension', 'build');

const polkaAccount = {
  mnemonic: config.accountSeed,
  password: '1234qwe',
  name: 'ExtensionUser'
};

const baseUiTest = test.extend({
  context: async ({}, use) => {
    const launchOptions = {
      devtools: false,
      headless: false,
      args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
    };
    const context = await chromium.launchPersistentContext('', launchOptions);
    await use(context);
  }
});

baseUiTest.describe('App test', () => {
  baseUiTest('Test transfer token with polkadot extension', async ({context}) => {
    const appPage = new AppPage(await context.newPage());
    await appPage.navigate();
    if (!await appPage.loader.isVisible()) {
      await appPage.reloadAccountButton.click();
    }

    const extensionPage = await new PolkadotjsExtensionPage(await context.newPage());
    await extensionPage.firstOpen();
    await extensionPage.connectAccountByExtension(polkaAccount.mnemonic, polkaAccount.password, polkaAccount.name);

    await appPage.focus();

    if (await appPage.loader.isVisible()) {
      await appPage.reload();
    }

    if (!await appPage.loader.isVisible()) {
      await appPage.reloadAccountButton.click();
    }

    await extensionPage.connectAccountToHost();

    await appPage.wsEndpointInput.fill(config.wsEndpoint);
    await appPage.accountFromInput.selectOption({label: polkaAccount.name});
    await appPage.accountToInput.fill('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
    await appPage.transferButton.click();

    await extensionPage.navigate();
    await extensionPage.fillPassword(polkaAccount.password);

    await appPage.waitTransferButtonText('Pending...');
    await appPage.waitTransferButtonText('Transfer balance');
  });
});
