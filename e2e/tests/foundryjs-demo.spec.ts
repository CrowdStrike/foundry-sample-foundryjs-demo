import { test, expect } from '../src/fixtures';

test.describe.configure({ mode: 'serial' });

test.describe('Foundry-JS Demo - E2E Tests', () => {
  test.beforeEach(async ({ foundryJsDemoPage }) => {
    await foundryJsDemoPage.navigateToApp();
    await foundryJsDemoPage.verifyAppLoaded();
  });

  test('should render app and display sidebar navigation', async ({ foundryJsDemoPage }) => {
    // App loaded verified in beforeEach — verify the sidebar is present
    const frame = foundryJsDemoPage.getAppFrame();
    await frame.getByText('Events').first().waitFor({ timeout: 10000 });
  });

  test('should render Events tab with stats', async ({ eventsTabPage }) => {
    await eventsTabPage.navigateTo();
    await eventsTabPage.verifyRendered();
  });

  test('should trigger and clear events', async ({ eventsTabPage }) => {
    await eventsTabPage.navigateTo();
    await eventsTabPage.verifyRendered();

    await eventsTabPage.triggerTestEvent();
    expect(await eventsTabPage.hasEventInLog('test')).toBeTruthy();

    await eventsTabPage.clearEvents();
    expect(await eventsTabPage.hasNoEventsMessage()).toBeTruthy();
  });

  test('should navigate between all tabs', async ({ foundryJsDemoPage }) => {
    const tabs = [
      { name: 'Events', heading: 'Events Handling Demo' },
      { name: 'Collections', heading: 'Collections CRUD Demo' },
      { name: 'API Integrations', heading: 'API Integration Demo' },
      { name: 'Cloud Functions', heading: 'Function Configuration' },
      { name: 'Workflows', heading: 'Workflows Demo' },
      { name: 'LogScale', heading: 'LogScale Integration Demo' },
      { name: 'Modals', heading: 'Modal Configuration' },
      { name: 'Navigation', heading: 'Navigation' },
    ];

    for (const tab of tabs) {
      await foundryJsDemoPage.clickTab(tab.name);
      await foundryJsDemoPage.verifyTabContent(tab.heading);
    }
  });

  test('should create a collection item', async ({ collectionsTabPage }) => {
    await collectionsTabPage.navigateTo();
    await collectionsTabPage.verifyRendered();

    const itemName = `test-item-${Date.now()}`;
    await collectionsTabPage.createItem(itemName, 'E2E test item');
    expect(await collectionsTabPage.hasSuccessMessage()).toBeTruthy();
  });

  test('should execute an API integration preset', async ({ apiIntegrationsTabPage }) => {
    await apiIntegrationsTabPage.navigateTo();
    await apiIntegrationsTabPage.verifyRendered();

    await apiIntegrationsTabPage.clickPreset('Get Posts');
    await apiIntegrationsTabPage.executeApiCall();
  });

  test('should render Cloud Functions tab', async ({ cloudFunctionsTabPage }) => {
    await cloudFunctionsTabPage.navigateTo();
    await cloudFunctionsTabPage.verifyRendered();
  });

  test('should render Workflows tab', async ({ workflowsTabPage }) => {
    await workflowsTabPage.navigateTo();
    await workflowsTabPage.verifyRendered();
  });

  test('should render LogScale sub-tabs', async ({ logScaleTabPage }) => {
    await logScaleTabPage.navigateTo();
    await logScaleTabPage.verifyRendered();

    await logScaleTabPage.clickSubTab('Write Events');
    await logScaleTabPage.verifyWriteEventsTab();

    await logScaleTabPage.clickSubTab('Dynamic Query');
    await logScaleTabPage.verifyDynamicQueryTab();

    await logScaleTabPage.clickSubTab('Saved Query');
    await logScaleTabPage.verifySavedQueryTab();
  });

  test('should populate modal form from presets', async ({ modalsTabPage }) => {
    await modalsTabPage.navigateTo();
    await modalsTabPage.verifyRendered();

    await modalsTabPage.clickPreset('User Profile Modal');
    expect(await modalsTabPage.hasFormPopulated()).toBeTruthy();
  });

  test('should render Navigation tab', async ({ navigationTabPage }) => {
    await navigationTabPage.navigateTo();
    await navigationTabPage.verifyRendered();
  });
});
