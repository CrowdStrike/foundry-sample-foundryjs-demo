import { Page, FrameLocator } from '@playwright/test';
import { BasePage } from './BasePage';
import { config } from '../config/TestConfig';

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
   * Retries with page refresh if Custom apps menu or app button doesn't appear.
   */
  async navigateToApp(): Promise<void> {
    this.logger.step('Navigate to Foundry-JS Demo app');

    const appName = config.appName;

    // Navigate to Foundry home first
    await this.navigateToPath('/foundry/home', 'Foundry home page');
    await this.page.waitForLoadState('networkidle');

    // Retry with page refresh if Custom apps menu or app button doesn't appear
    let appFound = false;
    for (let attempt = 1; attempt <= 5; attempt++) {
      const menuButton = this.page.getByTestId('nav-trigger');
      await menuButton.waitFor({ state: 'visible', timeout: 30000 });
      await menuButton.click();
      await this.page.waitForLoadState('networkidle');

      const customAppsButton = this.page.getByRole('button', { name: 'Custom apps' });
      try {
        await customAppsButton.waitFor({ state: 'visible', timeout: 20000 });
        await customAppsButton.click();
        await this.waiter.delay(1500);
        this.logger.info(`Custom apps button found on attempt ${attempt}`);
      } catch (e) {
        this.logger.warn(`Custom apps not visible on attempt ${attempt}, refreshing page...`);
        await this.page.reload();
        await this.page.waitForLoadState('networkidle');
        await this.waiter.delay(3000);
        continue;
      }

      // Check if the app button appears in the submenu
      const appButton = this.page.getByRole('button', { name: appName, exact: true });
      try {
        await appButton.waitFor({ state: 'visible', timeout: 10000 });
        appFound = true;
        this.logger.info(`App '${appName}' found in Custom apps menu on attempt ${attempt}`);
        break;
      } catch (e) {
        this.logger.warn(`App '${appName}' not in Custom apps on attempt ${attempt}, refreshing page...`);
        await this.page.reload();
        await this.page.waitForLoadState('networkidle');
        await this.waiter.delay(3000);
        continue;
      }
    }
    if (!appFound) {
      throw new Error(`App '${appName}' not found in Custom apps menu after 5 attempts with page refresh`);
    }

    // Expand the app menu only if not already expanded
    const appButton = this.page.getByRole('button', { name: appName, exact: true });
    await appButton.waitFor({ state: 'visible', timeout: 10000 });
    const isExpanded = await appButton.getAttribute('aria-expanded');
    if (isExpanded !== 'true') {
      await appButton.click();
      await this.waiter.delay(1500);
    }

    // Click the first page link inside the expanded app section.
    // The link text is the PAGE name (from manifest), not the app name,
    // so we locate the list labeled by the app button and click its first link.
    const appList = this.page.getByRole('list', { name: appName });
    const pageLink = appList.getByRole('link').first();
    await pageLink.waitFor({ state: 'visible', timeout: 20000 });
    await pageLink.click();

    // Wait for the iframe to load
    await this.page.waitForLoadState('networkidle');
    await this.waiter.delay(2000);

    this.logger.success('Navigated to Foundry-JS Demo app');
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
