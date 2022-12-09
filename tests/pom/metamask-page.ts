import { Locator, Page } from '@playwright/test';

import { config } from '../config';

export class MetamaskPage {
  readonly page: Page;
  readonly connectUrlInput: Locator;
  readonly connectButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.connectButton = page.locator('#connect');
    this.connectUrlInput = page.locator('#network');
  }

  async connect(url: string) {
    if (url) {
      this.connectUrlInput.fill(url);
    }

    this.connectButton.click();
  }

  async navigate() {
    await this.page.goto(`${config.appHost}/metamask.html`);
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

}
