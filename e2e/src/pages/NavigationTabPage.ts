import { FrameLocator } from '@playwright/test';
import { FoundryJsDemoPage } from './FoundryJsDemoPage';

/**
 * Navigation tab page object - operates within the app iframe
 */
export class NavigationTabPage {
  private frame: FrameLocator;

  constructor(private demoPage: FoundryJsDemoPage) {
    this.frame = demoPage.getAppFrame();
  }

  async navigateTo(): Promise<void> {
    await this.demoPage.clickTab('Navigation');
  }

  async verifyRendered(): Promise<void> {
    // Navigation tab shows navigation-related content
    await this.frame.getByText(/Navigation/i).first().waitFor({ timeout: 10000 });
  }
}
