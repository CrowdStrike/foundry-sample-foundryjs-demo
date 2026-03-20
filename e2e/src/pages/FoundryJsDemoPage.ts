import { Page, FrameLocator } from '@playwright/test';
import { BasePage } from './BasePage';
import { config } from '../config/TestConfig';
import { RetryHandler } from '../utils/SmartWaiter';

/**
 * Main page object for the Foundry-JS Demo app.
 * Handles navigation to the app and provides the iframe FrameLocator
 * that all tab page objects use for their interactions.
 */
export class FoundryJsDemoPage extends BasePage {
  private appFrame: FrameLocator | null = null;

  constructor(page: Page) {
    super(page, 'FoundryJsDemoPage');
  }

  protected getPagePath(): string {
    return '/foundry/home';
  }

  protected async verifyPageLoaded(): Promise<void> {
    // Verify we're on a Foundry page
    await this.waiter.waitForPageLoad('Foundry page');
  }

  /**
   * Navigate to the app via the sidebar Custom Apps section.
   * Sidebar flow: Menu → Custom apps → App name (expands) → Page link
   */
  async navigateToApp(): Promise<void> {
    this.logger.step('Navigate to Foundry-JS Demo app');

    const appName = config.appName;

    return RetryHandler.withPlaywrightRetry(
      async () => {
        // Navigate to Foundry home first
        await this.navigateToPath('/foundry/home', 'Foundry home page');

        // Open the global sidebar via the hamburger menu
        const menuButton = this.page.getByTestId('nav-trigger');
        await this.smartClick(menuButton, 'Menu button');

        // Click "Custom apps" in the sidebar to expand the section
        const customAppsButton = this.page.getByRole('button', { name: 'Custom apps' });
        await this.smartClick(customAppsButton, 'Custom apps button');

        // Click the app name button to expand its pages list
        const appButton = this.page.getByRole('button', { name: appName, exact: false }).first();
        if (await this.elementExists(appButton, 3000)) {
          await this.smartClick(appButton, `App '${appName}' button`);
          await this.waiter.delay(1000);
        } else {
          throw new Error(`App '${appName}' not found in Custom Apps menu`);
        }

        // Click the page link inside the expanded app section
        const pageLink = this.page.getByRole('link', { name: appName });
        await this.smartClick(pageLink, `App '${appName}' page link`);

        // Wait for the iframe to load
        await this.page.waitForLoadState('networkidle');
        await this.waiter.delay(2000);

        this.logger.success('Navigated to Foundry-JS Demo app');
      },
      'Navigate to Foundry-JS Demo app'
    );
  }

  /**
   * Get the app's iframe FrameLocator.
   * The foundryjs-demo app renders entirely inside an iframe in the Falcon Console.
   */
  getAppFrame(): FrameLocator {
    if (!this.appFrame) {
      this.appFrame = this.page.frameLocator('iframe').first();
    }
    return this.appFrame;
  }

  /**
   * Verify the app loaded inside the iframe
   */
  async verifyAppLoaded(): Promise<void> {
    this.logger.step('Verify app loaded in iframe');

    const frame = this.getAppFrame();
    await frame.getByText('Foundry-JS SDK').waitFor({ timeout: 30000 });

    this.logger.success('App loaded - "Foundry-JS SDK" header visible');
  }

  /**
   * Click a sidebar navigation tab within the iframe
   */
  async clickTab(tabLabel: string): Promise<void> {
    this.logger.step(`Click tab: ${tabLabel}`);

    const frame = this.getAppFrame();
    // Tab buttons may have badge text appended (e.g. "Events 1"), so use substring match
    const tabButton = frame.getByRole('button', { name: tabLabel }).first();
    await tabButton.click();

    // Brief wait for route transition
    await this.waiter.delay(500);

    this.logger.success(`Clicked tab: ${tabLabel}`);
  }

  /**
   * Verify a specific tab is rendered by checking for its heading text
   */
  async verifyTabContent(headingText: string): Promise<void> {
    const frame = this.getAppFrame();
    await frame.getByText(headingText).first().waitFor({ timeout: 10000 });
  }
}
