import { FrameLocator } from '@playwright/test';
import { FoundryJsDemoPage } from './FoundryJsDemoPage';

/**
 * LogScale tab page object - operates within the app iframe
 */
export class LogScaleTabPage {
  private frame: FrameLocator;

  constructor(private demoPage: FoundryJsDemoPage) {
    this.frame = demoPage.getAppFrame();
  }

  async navigateTo(): Promise<void> {
    await this.demoPage.clickTab('LogScale');
  }

  async verifyRendered(): Promise<void> {
    await this.frame.getByText('LogScale Integration Demo').waitFor({ timeout: 10000 });
  }

  async clickSubTab(tabName: 'Write Events' | 'Dynamic Query' | 'Saved Query'): Promise<void> {
    const button = this.frame.getByRole('button', { name: tabName, exact: true });
    await button.click();
  }

  async verifyWriteEventsTab(): Promise<void> {
    await this.frame.getByText('Event Data (JSON)').waitFor({ timeout: 5000 });
  }

  async verifyDynamicQueryTab(): Promise<void> {
    await this.frame.locator('textarea[placeholder*="event_type"]').waitFor({ timeout: 5000 });
  }

  async verifySavedQueryTab(): Promise<void> {
    await this.frame.locator('input[placeholder*="saved query ID"]').waitFor({ timeout: 5000 });
  }
}
