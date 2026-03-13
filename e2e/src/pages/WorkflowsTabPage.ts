import { FrameLocator } from '@playwright/test';
import { FoundryJsDemoPage } from './FoundryJsDemoPage';

/**
 * Workflows tab page object - operates within the app iframe
 */
export class WorkflowsTabPage {
  private frame: FrameLocator;

  constructor(private demoPage: FoundryJsDemoPage) {
    this.frame = demoPage.getAppFrame();
  }

  async navigateTo(): Promise<void> {
    await this.demoPage.clickTab('Workflows');
  }

  async verifyRendered(): Promise<void> {
    await this.frame.getByText('Workflows Demo').waitFor({ timeout: 10000 });
  }

  async setWorkflowName(name: string): Promise<void> {
    const input = this.frame.locator('input[placeholder*="MyWorkflowTemplate"]');
    await input.fill(name);
  }

  async executeWorkflow(): Promise<void> {
    const button = this.frame.getByRole('button', { name: 'Execute Workflow' });
    await button.click();
  }

  async setExecutionId(id: string): Promise<void> {
    const input = this.frame.locator('input[placeholder*="execution ID"]');
    await input.fill(id);
  }

  async getResults(): Promise<void> {
    const button = this.frame.getByRole('button', { name: 'Get Results' });
    await button.click();
  }

  async clearResults(): Promise<void> {
    const button = this.frame.getByRole('button', { name: 'Clear' });
    await button.click();
  }

  async hasResults(): Promise<boolean> {
    const count = await this.frame.getByText(/Workflow Triggered|Execution Results/i).count();
    return count > 0;
  }
}
