import { FrameLocator } from '@playwright/test';
import { FoundryJsDemoPage } from './FoundryJsDemoPage';

/**
 * Collections tab page object - operates within the app iframe
 */
export class CollectionsTabPage {
  private frame: FrameLocator;

  constructor(private demoPage: FoundryJsDemoPage) {
    this.frame = demoPage.getAppFrame();
  }

  async navigateTo(): Promise<void> {
    await this.demoPage.clickTab('Collections');
  }

  async verifyRendered(): Promise<void> {
    await this.frame.getByText('Collections CRUD Demo').waitFor({ timeout: 10000 });
  }

  async createItem(name: string, description: string): Promise<void> {
    // Click "Create New" to reset the form
    const createNewButton = this.frame.getByRole('button', { name: 'Create New' });
    await createNewButton.click();

    // Fill in the form fields
    const nameInput = this.frame.locator('input[placeholder*="name" i]').first();
    await nameInput.fill(name);

    const descInput = this.frame.locator('textarea, input[placeholder*="description" i]').first();
    await descInput.fill(description);

    // Click "Create Item"
    const createButton = this.frame.getByRole('button', { name: 'Create Item' });
    await createButton.click();

    // Wait for success message
    await this.frame.getByText(/created successfully|success/i).first().waitFor({ timeout: 15000 });
  }

  async refreshItems(): Promise<void> {
    const refreshButton = this.frame.getByRole('button', { name: /refresh/i });
    await refreshButton.click();
  }

  async deleteItem(): Promise<void> {
    const deleteButton = this.frame.getByRole('button', { name: /delete/i });
    await deleteButton.click();
  }

  async hasSuccessMessage(): Promise<boolean> {
    const count = await this.frame.getByText(/success/i).count();
    return count > 0;
  }
}
