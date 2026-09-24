import { test as baseTest } from '@playwright/test';
import { AuthFile } from '@crowdstrike/foundry-playwright';
import { FoundryJsDemoPage } from './pages/FoundryJsDemoPage';
import { EventsTabPage } from './pages/EventsTabPage';
import { CollectionsTabPage } from './pages/CollectionsTabPage';
import { ApiIntegrationsTabPage } from './pages/ApiIntegrationsTabPage';
import { CloudFunctionsTabPage } from './pages/CloudFunctionsTabPage';
import { WorkflowsTabPage } from './pages/WorkflowsTabPage';
import { LogScaleTabPage } from './pages/LogScaleTabPage';
import { ModalsTabPage } from './pages/ModalsTabPage';
import { NavigationTabPage } from './pages/NavigationTabPage';

type FoundryFixtures = {
  eventsTabPage: EventsTabPage;
  collectionsTabPage: CollectionsTabPage;
  apiIntegrationsTabPage: ApiIntegrationsTabPage;
  cloudFunctionsTabPage: CloudFunctionsTabPage;
  workflowsTabPage: WorkflowsTabPage;
  logScaleTabPage: LogScaleTabPage;
  modalsTabPage: ModalsTabPage;
  navigationTabPage: NavigationTabPage;
};

type FoundryWorkerFixtures = {
  foundryJsDemoPage: FoundryJsDemoPage;
};

export const test = baseTest.extend<FoundryFixtures, FoundryWorkerFixtures>({
  // One browser page is shared by every test in the worker, so the app is opened
  // once and each test switches tabs inside it instead of reloading the console.
  foundryJsDemoPage: [async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: AuthFile });
    const page = await context.newPage();
    await use(new FoundryJsDemoPage(page));
    await context.close();
  }, { scope: 'worker' }],
  eventsTabPage: async ({ foundryJsDemoPage }, use) => { await use(new EventsTabPage(foundryJsDemoPage)); },
  collectionsTabPage: async ({ foundryJsDemoPage }, use) => { await use(new CollectionsTabPage(foundryJsDemoPage)); },
  apiIntegrationsTabPage: async ({ foundryJsDemoPage }, use) => { await use(new ApiIntegrationsTabPage(foundryJsDemoPage)); },
  cloudFunctionsTabPage: async ({ foundryJsDemoPage }, use) => { await use(new CloudFunctionsTabPage(foundryJsDemoPage)); },
  workflowsTabPage: async ({ foundryJsDemoPage }, use) => { await use(new WorkflowsTabPage(foundryJsDemoPage)); },
  logScaleTabPage: async ({ foundryJsDemoPage }, use) => { await use(new LogScaleTabPage(foundryJsDemoPage)); },
  modalsTabPage: async ({ foundryJsDemoPage }, use) => { await use(new ModalsTabPage(foundryJsDemoPage)); },
  navigationTabPage: async ({ foundryJsDemoPage }, use) => { await use(new NavigationTabPage(foundryJsDemoPage)); },
});

export { expect } from '@playwright/test';
