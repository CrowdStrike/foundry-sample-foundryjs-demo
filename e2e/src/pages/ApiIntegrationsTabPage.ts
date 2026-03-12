import { FrameLocator } from '@playwright/test';
import { FoundryJsDemoPage } from './FoundryJsDemoPage';

/**
 * API Integrations tab page object - operates within the app iframe
 */
export class ApiIntegrationsTabPage {
  private frame: FrameLocator;

  constructor(private demoPage: FoundryJsDemoPage) {
    this.frame = demoPage.getAppFrame();
  }

  async navigateTo(): Promise<void> {
    await this.demoPage.clickTab('API Integrations');
  }

  async verifyRendered(): Promise<void> {
    await this.frame.getByText('API Integration Demo').waitFor({ timeout: 10000 });
  }

  async clickPreset(presetName: string): Promise<void> {
    const button = this.frame.getByRole('button', { name: presetName });
    await button.click();
  }

  async executeApiCall(): Promise<void> {
    const button = this.frame.getByRole('button', { name: /Execute API Call/i });
    await button.click();
  }

  async hasResults(): Promise<boolean> {
    // Check for response display (status code or response data)
    const count = await this.frame.getByText(/status|response/i).count();
    return count > 0;
  }
}
