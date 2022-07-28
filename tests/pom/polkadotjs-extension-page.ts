import { Locator, Page } from '@playwright/test';

export class PolkadotjsExtensionPage {
  readonly page: Page;
  readonly confirmButton: Locator;
  readonly acceptButton: Locator;
  readonly importAccountFromSeedRow: Locator;
  readonly importAccountInput: Locator;
  readonly addAccountIcon: Locator;
  readonly fullAddress: Locator;
  readonly nextStepButton: Locator;
  readonly nameInput: Locator;
  readonly passwordInput: Locator;
  readonly repeatPasswordInput: Locator;
  readonly polkadotExtensionCard: Locator;
  readonly selectAllCheckbox: Locator;
  extensionId: string;

  constructor(page: Page) {
    this.page = page;
    this.confirmButton = page.locator('//button');
    this.acceptButton = page.locator('//button[contains(@class, "acceptButton")]');
    this.addAccountIcon = page.locator('//div[contains(@class, "popupToggle")][1]');
    this.importAccountFromSeedRow = page.locator('//span[text()="Import account from pre-existing seed"]');
    this.importAccountInput = page.locator('//textarea');
    this.fullAddress = page.locator('//div[@class="fullAddress"]');
    this.nextStepButton = page.locator('//button[contains(@class, "NextStepButton")]');
    this.nameInput = page.locator('//label[text()="A descriptive name for your account"]/../input');
    this.passwordInput = page.locator('//label[text()="A new password for this account"]/../input');
    this.repeatPasswordInput = page.locator('//label[text()="Repeat password for verification"]/../input');
    this.polkadotExtensionCard = page.locator('#detailsButton');
    this.selectAllCheckbox = page.locator('Select all');
  }

  async firstOpen() {
    await this.navigate();
    await this.clickConfirm();
    await this.clickAccept();
  }

  async clickConfirm() {
    await this.confirmButton.click({ force: true });
  }

  async clickAccept() {
    await this.acceptButton.click({ force: true });
  }

  async navigate() {
    if (!this.extensionId) {
      await this.retrieveExtensionId();
    }
    await this.page.goto(`chrome-extension://${this.extensionId}/notification.html`);
    await this.page.waitForLoadState();
  }

  async fillPassword(password: string) {
    await this.page.locator('[class*="InputWithLabel"] > input').fill(password);
    await this.page.locator('//div[contains(text(), "Sign the")]').click();
  }

  async retrieveExtensionId() {
    await this.page.goto('chrome://extensions/');
    await this.polkadotExtensionCard.click();
    await this.page.waitForLoadState();
    this.extensionId = new URL(this.page.url()).searchParams.get('id');
  }

  async connectAccountByExtension(mnemonic: string, password: string, accountName: string) {
    await this.addAccountIcon.click();
    await this.importAccountFromSeedRow.click();
    await this.importAccountInput.fill(mnemonic);
    await this.nextStepButton.click();
    await this.nameInput.fill(accountName);
    await this.passwordInput.fill(password);
    await this.repeatPasswordInput.fill(password);
    await this.nextStepButton.click();
  }

  async connectAccountToHost() {
    await this.page.locator('text=Select all').click();
    await this.page.locator('button').click()
  }

  async close() {
    await this.page.close();
  }
}
