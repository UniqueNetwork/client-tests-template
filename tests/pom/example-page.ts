import {Locator, Page} from "@playwright/test";

export class ExamplePage {
  readonly page: Page;
  readonly selector: Locator;
  readonly transferButton: Locator;
  readonly reloadAccountButton: Locator;
  readonly accountFromInput: Locator;
  readonly accountToInput: Locator;
  readonly amountInput: Locator;
  readonly loader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.transferButton = page.locator('#transfer-balance');
    this.reloadAccountButton = page.locator('#reload-accounts')
    this.accountFromInput = page.locator('#account');
    this.accountToInput = page.locator('#receiver');
    this.amountInput = page.locator('#amount');
    this.loader = page.locator('#loader')
  }

  async navigate() {
    await this.page.goto('http://localhost:8000');
  }

  async reload() {
    await this.page.reload();
  }

  async close() {
    await this.page.close();
  }

  async waitTransferButtonText(expectedText: string) {
    while (await this.transferButton.innerText() !== expectedText) {
      await this.page.waitForTimeout(1000);
    }
  }
}
