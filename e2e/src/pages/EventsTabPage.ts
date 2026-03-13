import { FrameLocator } from '@playwright/test';
import { FoundryJsDemoPage } from './FoundryJsDemoPage';

/**
 * Events tab page object - operates within the app iframe
 */
export class EventsTabPage {
  private frame: FrameLocator;

  constructor(private demoPage: FoundryJsDemoPage) {
    this.frame = demoPage.getAppFrame();
  }

  async navigateTo(): Promise<void> {
    await this.demoPage.clickTab('Events');
  }

  async verifyRendered(): Promise<void> {
    await this.frame.getByText('Events Handling Demo').waitFor({ timeout: 10000 });
  }

  async triggerTestEvent(): Promise<void> {
    const button = this.frame.getByRole('button', { name: 'Trigger Test Event' });
    await button.click();
  }

  async clearEvents(): Promise<void> {
    const button = this.frame.getByRole('button', { name: 'Clear Events' });
    await button.click();
  }

  async getEventCount(): Promise<string> {
    // The "Total Events" stat card shows the count
    const totalEventsCard = this.frame.getByText('Total Events').locator('..');
    return await totalEventsCard.locator('div').first().textContent() || '0';
  }

  async hasEventInLog(eventType: string): Promise<boolean> {
    const count = await this.frame.getByText(eventType).count();
    return count > 0;
  }

  async hasNoEventsMessage(): Promise<boolean> {
    const count = await this.frame.getByText(/No events captured yet/i).count();
    return count > 0;
  }
}
