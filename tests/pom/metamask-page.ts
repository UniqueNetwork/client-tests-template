import { Locator, Page } from '@playwright/test';

import { config } from '../config';

export class MetamaskPage {
  readonly page: Page;
  readonly connectUrlInput: Locator;
  readonly connectButton: Locator;
  readonly selectAccountDropdown: Locator;
  readonly noneCollectionAddressText: Locator;
  readonly createCollectionFromMetamaskButton: Locator;
  readonly pendingButton: Locator;
  readonly collectionAddressText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.connectButton = page.locator('//button[@id="connect"]');
    this.connectUrlInput = page.locator('//input[@id="network"]');
    this.selectAccountDropdown = page.locator('//*[@id="account"]');
    this.noneCollectionAddressText = page.locator('//span[@id="new-collection-address" and text()="none"]');
    this.collectionAddressText = page.locator('//span[@id="new-collection-address" and starts-with(text(), "0x")]');
    this.createCollectionFromMetamaskButton = page.locator('//button[@id="create-collection" and text()="Create collection from metamask"]');
    this.pendingButton = page.locator('//button[@id="create-collection" and text()="Pending..."]');
  }

  async connect(url: string) {
    if (url) {
      this.connectUrlInput.fill(url);
    }

    await this.connectButton.click();
  }

  async navigate() {
    await this.page.goto(`${config.appHost}/metamask.html`);
    await this.page.waitForLoadState();
  }

  async reload() {
    await this.page.reload();
  }

  async close() {
    await this.page.close();
  }

  async focus() {
    await this.page.bringToFront();
  }

  async selectAccount(account: string) {
    await this.selectAccountDropdown.selectOption(account);
  }

  async wait() {
    await this.page.waitForTimeout(8000);
  }

  async createCollection() {
    await this.noneCollectionAddressText.waitFor({ state: 'visible', timeout: 60000 });
    await this.createCollectionFromMetamaskButton.click();
    await this.pendingButton.waitFor({ state: 'visible', timeout: 60000 });
  }

  async checkCollectionCreated() {
    await this.collectionAddressText.waitFor({ state: 'visible', timeout: 60000 });
    await this.createCollectionFromMetamaskButton.waitFor({ state: 'visible', timeout: 60000 });
  }

}
