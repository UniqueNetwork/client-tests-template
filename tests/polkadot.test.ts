import {chromium, test} from "@playwright/test";
import path from "path";
import {PolkadotjsExtensionPage} from "./pom/polkadotjs-extension-page";
import {ExamplePage} from "./pom/example-page";

const extensionPath = path.join(__dirname, './extension/packages/extension/build');
const accountFrom = {
  mnemonic: 'high olive stay belt voyage option release train alarm crowd exist broom',
  password: '1234qwe',
  name: 'TestUser'
};

const baseUiTest = test.extend({
  context: async ({}, use) => {
    const launchOptions = {
      devtools: true,
      headless: false,
      args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
    };
    const context = await chromium.launchPersistentContext('', launchOptions);
    await use(context);
  }
});

baseUiTest.describe('Token tests', () => {
  baseUiTest('Test polkadot extension', async ({context}) => {
    const examplePage = new ExamplePage(await context.newPage());
    await examplePage.navigate();
    if (!await examplePage.loader.isVisible()) {
      await examplePage.reloadAccountButton.click();
    }

    const polkadotjsExtensionPage = await new PolkadotjsExtensionPage(await context.newPage())
    await polkadotjsExtensionPage.firstOpen();
    await polkadotjsExtensionPage.connectAccountByExtension(accountFrom.mnemonic, accountFrom.password, accountFrom.name)

    if (await examplePage.loader.isVisible()) {
      await examplePage.reload()
    }
    await examplePage.reloadAccountButton.click();

    await polkadotjsExtensionPage.connectAccountToHost()

    await examplePage.accountFromInput.selectOption({label: accountFrom.name});
    await examplePage.accountToInput.fill('5FEfvRD16zKWk5Gga5gD2ZT3k9EYUHV2pzJAjFBPgjm24dZT');
    await examplePage.transferButton.click();

    await polkadotjsExtensionPage.navigate();
    await polkadotjsExtensionPage.fillPassword(accountFrom.password);

    await examplePage.waitTransferButtonText('Pending...')
    await examplePage.waitTransferButtonText('Transfer balance')
  })
});
