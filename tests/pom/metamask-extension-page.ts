import { Locator, Page } from '@playwright/test';

export class MetamaskExtensionPage {
  readonly page: Page;
  readonly metamaskExtensionCard: Locator;
  readonly firstTimeFlowButton: Locator;
  readonly cancelButton: Locator;
  readonly importWalletButton: Locator;
  readonly newPasswordField: Locator;
  readonly repeatPasswordField: Locator;
  readonly agreementCheckbox: Locator;
  readonly confirmButton: Locator;
  readonly completeButton: Locator;
  readonly selectNetworkDropdown: Locator;
  readonly addNetworkButton: Locator;
  readonly addNetworkManuallyButton: Locator;
  readonly networkNameField: Locator;
  readonly rpcURLField: Locator;
  readonly chainIdField: Locator;
  readonly currencyField: Locator;
  readonly networkAddedAlert: Locator;
  readonly saveButton: Locator;
  readonly accountOnConnectPage: Locator;
  readonly connectNetworkNextButton: Locator;
  readonly connectNetworkCompleteButton: Locator;
  readonly opalTestnetIconText: Locator;
  readonly rpcUrlData: Locator;
  readonly confirmCreateCollectionButton: Locator;
  readonly transactionDetails: Locator;
  extensionId: string;

  constructor(page: Page) {
    this.page = page;
    this.metamaskExtensionCard = page.locator('#detailsButton');
    this.firstTimeFlowButton = page.locator('[data-testid="first-time-flow__button"]');
    this.cancelButton = page.locator('[data-testid="page-container-footer-cancel"]');
    this.importWalletButton = page.locator('[data-testid="import-wallet-button"]');
    this.newPasswordField = page.locator('#password');
    this.repeatPasswordField = page.locator('#confirm-password');
    this.agreementCheckbox = page.locator('[data-testid="create-new-vault__terms-checkbox"]');
    this.confirmButton = page.locator('//button[contains(@class, "create-new-vault__submit-button")]');
    this.completeButton = page.locator('[data-testid="EOF-complete-button"]');
    this.selectNetworkDropdown = page.locator('[data-testid="network-display"]');
    this.addNetworkButton = page.locator('//div[@class="network__add-network-button"]');
    this.addNetworkManuallyButton = page.locator('[data-testid="add-network-manually"]');
    this.confirmButton = page.locator('//button[contains(@class, "create-new-vault__submit-button")]');
    this.networkNameField = page.locator('(//div[@class="networks-tab__add-network-form-body"]//input)[1]');
    this.rpcURLField = page.locator('(//div[@class="networks-tab__add-network-form-body"]//input)[2]');
    this.chainIdField = page.locator('(//div[@class="networks-tab__add-network-form-body"]//input)[3]');
    this.currencyField = page.locator('(//div[@class="networks-tab__add-network-form-body"]//input)[4]');
    this.networkAddedAlert = page.locator('//div[@class="actionable-message actionable-message--success home__new-network-notification"]');
    this.saveButton = page.locator('//button[@class="button btn--rounded btn-primary"]');
    this.accountOnConnectPage = page.locator('//div[@class="choose-account-list__account__label" and contains(text(), "Account 1")]');
    this.connectNetworkNextButton = page.locator('//button[@class="button btn--rounded btn-primary"]');
    this.connectNetworkCompleteButton = page.locator('[data-testid="page-container-footer-next"]');
    this.rpcUrlData = page.locator('//*[starts-with(@class, "box box") and contains(text(), "https://rpc-opal.unique.network")]');
    this.opalTestnetIconText = page.locator('//*[starts-with(@class, "box box") and contains(text(), "Opal testnet")]');
    this.confirmCreateCollectionButton = page.locator('[data-testid="page-container-footer-next"]');
    this.transactionDetails = page.locator('//div[@class="confirm-page-container-content__details"]');

  }

  async firstOpen() {
    await this.navigate();
  }

  async reload() {
    await this.page.reload();
    await this.page.waitForLoadState();
  }

  async navigate() {
    if (!this.extensionId) {
      await this.retrieveExtensionId();
    }
    await this.page.goto(`chrome-extension://${this.extensionId}/notification.html`);
    await this.page.waitForLoadState();
  }

  async retrieveExtensionId() {
    await this.page.goto('chrome://extensions/');
    await this.metamaskExtensionCard.click();
    await this.page.waitForLoadState();
    this.extensionId = new URL(this.page.url()).searchParams.get('id');
  }

  async connectAccountByExtension(mnemonic: string, password: string) { 
    await this.retrieveExtensionId();
    await this.page.goto(`chrome-extension://${this.extensionId}/home.html#initialize/welcome`);
    await this.firstTimeFlowButton.waitFor({ state: 'visible' });
    await this.firstTimeFlowButton.click();
    await this.cancelButton.click();
    await this.importWalletButton.click();
    await this.fillFieldsWithMnemonic(mnemonic);
    await this.newPasswordField.fill(password);
    await this.repeatPasswordField.fill(password);
    await this.agreementCheckbox.click();
    await this.confirmButton.click();
    await this.completeButton.waitFor({ state: 'visible' });
    await this.completeButton.click();
  }

  async selectNetwork(name: string, rpcUrl: string, chainId: string, currency: string) {
    await this.selectNetworkDropdown.waitFor({ state: 'visible' });
    await this.selectNetworkDropdown.click();
    await this.addNetworkButton.click();
    await this.addNetworkManuallyButton.waitFor({ state: 'visible' });
    await this.addNetworkManuallyButton.click();
    await this.networkNameField.waitFor({ state: 'visible' });
    await this.networkNameField.fill(name);
    await this.rpcURLField.fill(rpcUrl);
    await this.chainIdField.fill(chainId);
    await this.currencyField.fill(currency);
    await this.saveButton.click();
    await this.networkAddedAlert.waitFor({ state: 'visible' });
  }

  async fillFieldsWithMnemonic(mnemonic: string) {
    const arr = mnemonic.split(' ');
    for (let i = 0; i < 12; i++) {
      await this.page.locator(`[id="import-srp__srp-word-${i}"]`).fill(arr[i]);
    }
  }

  async connectToTheSite() { 
    await this.accountOnConnectPage.waitFor({ state: 'visible' });
    await this.connectNetworkNextButton.click();
    await this.connectNetworkCompleteButton.waitFor({ state: 'visible' });
    await this.connectNetworkCompleteButton.click();
  }

  async confirmTransaction() { 
    for (let i = 0; i < 6; i++) {
      try {
        await this.transactionDetails.waitFor({ state: 'visible', timeout: 5000 });
      } catch (err) {
        console.log('Reloading...')
        await this.page.reload();
      }
    }
    await this.confirmCreateCollectionButton.click();
  }
}
