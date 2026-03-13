import { FrameLocator } from '@playwright/test';
import { FoundryJsDemoPage } from './FoundryJsDemoPage';

/**
 * Cloud Functions tab page object - operates within the app iframe
 */
export class CloudFunctionsTabPage {
  private frame: FrameLocator;

  constructor(private demoPage: FoundryJsDemoPage) {
    this.frame = demoPage.getAppFrame();
  }

  async navigateTo(): Promise<void> {
    await this.demoPage.clickTab('Cloud Functions');
  }

  async verifyRendered(): Promise<void> {
    await this.frame.getByText('Function Configuration').waitFor({ timeout: 10000 });
  }

  async setFunctionName(name: string): Promise<void> {
    const input = this.frame.locator('input[placeholder="greeting_function"]');
    await input.fill(name);
  }

  async setFunctionPath(path: string): Promise<void> {
    const input = this.frame.locator('input[placeholder="/greet"]');
    await input.fill(path);
  }

  async setHttpMethod(method: string): Promise<void> {
    const select = this.frame.locator('select').first();
    await select.selectOption(method);
  }

  async setRequestBody(body: string): Promise<void> {
    const textarea = this.frame.locator('textarea').first();
    await textarea.fill(body);
  }

  async executeRequest(): Promise<void> {
    const button = this.frame.getByRole('button', { name: /Execute.*Request/i });
    await button.click();
  }

  async clearResults(): Promise<void> {
    const button = this.frame.getByRole('button', { name: 'Clear Results' });
    await button.click();
  }

  async hasResults(): Promise<boolean> {
    const count = await this.frame.getByText(/Function Response/i).count();
    return count > 0;
  }

  async hasError(): Promise<boolean> {
    const count = await this.frame.getByText(/Error/i).count();
    return count > 0;
  }
}
