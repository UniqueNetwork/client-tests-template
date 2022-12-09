import { Locator, Page } from '@playwright/test';

export class MetamaskExtensionPage {
  readonly page: Page;
  readonly metamaskExtensionCard: Locator;
  extensionId: string;

  constructor(page: Page) {
    this.page = page;
    this.metamaskExtensionCard = page.locator('#detailsButton').nth(0);
  }

  async firstOpen() {
    await this.navigate();
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
}
