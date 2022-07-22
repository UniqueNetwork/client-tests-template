import { Locator, Page } from '@playwright/test';

import { config } from '../config';

export class AppPage {
  readonly page: Page;
  readonly selector: Locator;
  readonly transferButton: Locator;
  readonly reloadAccountButton: Locator;
  readonly wsEndpointInput: Locator;
  readonly accountFromInput: Locator;
  readonly accountToInput: Locator;
  readonly amountInput: Locator;
  readonly loader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.transferButton = page.locator('#transfer-balance');
    this.reloadAccountButton = page.locator('#reload-accounts');
    this.wsEndpointInput = page.locator('#network');
    this.accountFromInput = page.locator('#account');
    this.accountToInput = page.locator('#receiver');
    this.amountInput = page.locator('#amount');
    this.loader = page.locator('#loader');
  }

  async navigate() {
    await this.page.goto(config.appHost);
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

  async waitTransferButtonText(expectedText: string) {
    while (await this.transferButton.innerText() !== expectedText) {
      await this.page.waitForTimeout(1000);
    }
  }
}
