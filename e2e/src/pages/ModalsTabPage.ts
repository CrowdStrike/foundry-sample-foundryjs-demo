import { FrameLocator } from '@playwright/test';
import { FoundryJsDemoPage } from './FoundryJsDemoPage';

/**
 * Modals tab page object - operates within the app iframe
 */
export class ModalsTabPage {
  private frame: FrameLocator;

  constructor(private demoPage: FoundryJsDemoPage) {
    this.frame = demoPage.getAppFrame();
  }

  async navigateTo(): Promise<void> {
    await this.demoPage.clickTab('Modals');
  }

  async verifyRendered(): Promise<void> {
    await this.frame.getByRole('heading', { name: 'Modal Configuration' }).waitFor({ timeout: 10000 });
  }

  async clickPreset(presetName: string): Promise<void> {
    const button = this.frame.getByRole('button', { name: presetName });
    await button.click();
  }

  async getPageIdValue(): Promise<string> {
    const input = this.frame.locator('input').first();
    return await input.inputValue();
  }

  async getModalTitleValue(): Promise<string> {
    const input = this.frame.locator('input[placeholder="Modal Title"]');
    return await input.inputValue();
  }

  async hasFormPopulated(): Promise<boolean> {
    const title = await this.getModalTitleValue();
    return title.length > 0;
  }
}
