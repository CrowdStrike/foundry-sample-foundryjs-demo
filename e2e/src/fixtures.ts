import { test as baseTest } from '@playwright/test';
import {
  FoundryHomePage, AppManagerPage, AppCatalogPage, config,
} from '@crowdstrike/foundry-playwright';
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
  foundryHomePage: FoundryHomePage;
  appManagerPage: AppManagerPage;
  appCatalogPage: AppCatalogPage;
  foundryJsDemoPage: FoundryJsDemoPage;
  eventsTabPage: EventsTabPage;
  collectionsTabPage: CollectionsTabPage;
  apiIntegrationsTabPage: ApiIntegrationsTabPage;
  cloudFunctionsTabPage: CloudFunctionsTabPage;
  workflowsTabPage: WorkflowsTabPage;
  logScaleTabPage: LogScaleTabPage;
  modalsTabPage: ModalsTabPage;
  navigationTabPage: NavigationTabPage;
  appName: string;
};

export const test = baseTest.extend<FoundryFixtures>({
  foundryHomePage: async ({ page }, use) => { await use(new FoundryHomePage(page)); },
  appManagerPage: async ({ page }, use) => { await use(new AppManagerPage(page)); },
  appCatalogPage: async ({ page }, use) => { await use(new AppCatalogPage(page)); },
  foundryJsDemoPage: async ({ page }, use) => { await use(new FoundryJsDemoPage(page)); },
  eventsTabPage: async ({ foundryJsDemoPage }, use) => { await use(new EventsTabPage(foundryJsDemoPage)); },
  collectionsTabPage: async ({ foundryJsDemoPage }, use) => { await use(new CollectionsTabPage(foundryJsDemoPage)); },
  apiIntegrationsTabPage: async ({ foundryJsDemoPage }, use) => { await use(new ApiIntegrationsTabPage(foundryJsDemoPage)); },
  cloudFunctionsTabPage: async ({ foundryJsDemoPage }, use) => { await use(new CloudFunctionsTabPage(foundryJsDemoPage)); },
  workflowsTabPage: async ({ foundryJsDemoPage }, use) => { await use(new WorkflowsTabPage(foundryJsDemoPage)); },
  logScaleTabPage: async ({ foundryJsDemoPage }, use) => { await use(new LogScaleTabPage(foundryJsDemoPage)); },
  modalsTabPage: async ({ foundryJsDemoPage }, use) => { await use(new ModalsTabPage(foundryJsDemoPage)); },
  navigationTabPage: async ({ foundryJsDemoPage }, use) => { await use(new NavigationTabPage(foundryJsDemoPage)); },
  appName: async ({}, use) => { await use(config.appName); },
});

export { expect } from '@playwright/test';
