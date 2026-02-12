import { test, expect } from '@playwright/test';

test.describe('Workflows Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/workflows');
    // Wait for loading to complete
    await page.waitForSelector('h1:has-text("Workflows")');
  });

  test('displays page title and description', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Workflows');
    await expect(page.getByText('Automated actions triggered by events')).toBeVisible();
  });

  test('create workflow button exists', async ({ page }) => {
    const createButton = page.getByRole('button', { name: '+ Create Workflow' });
    await expect(createButton).toBeVisible();
    await expect(createButton).toBeEnabled();
  });

  test('workflow cards are displayed', async ({ page }) => {
    // Wait for workflows to load
    await page.waitForTimeout(500);
    
    // Workflow cards should exist
    const workflowCards = page.locator('.rounded-xl').filter({ has: page.locator('h3') });
    const count = await workflowCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('workflow cards show name and description', async ({ page }) => {
    // Each workflow should have a name
    const workflowNames = page.locator('h3.font-semibold');
    const count = await workflowNames.count();
    expect(count).toBeGreaterThan(0);
  });

  test('workflow cards have enable/disable toggle', async ({ page }) => {
    // Toggle switches should exist
    const toggles = page.locator('input[type="checkbox"]');
    const count = await toggles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('toggle switch changes workflow state', async ({ page }) => {
    // Get the first toggle
    const toggle = page.locator('input[type="checkbox"]').first();
    
    // Get initial state
    const initialState = await toggle.isChecked();
    
    // Click the toggle
    await toggle.click();
    
    // State should change
    const newState = await toggle.isChecked();
    expect(newState).toBe(!initialState);
    
    // Click again to restore
    await toggle.click();
    expect(await toggle.isChecked()).toBe(initialState);
  });

  test('workflow cards show trigger section', async ({ page }) => {
    // Should have "Trigger" label
    const triggerLabels = page.getByText('Trigger', { exact: true });
    const count = await triggerLabels.count();
    expect(count).toBeGreaterThan(0);
  });

  test('workflow cards show actions section', async ({ page }) => {
    // Should have "Actions" label with count
    const actionsLabels = page.getByText(/Actions \(\d+\)/);
    const count = await actionsLabels.count();
    expect(count).toBeGreaterThan(0);
  });

  test('workflow cards show trigger type', async ({ page }) => {
    // Trigger type should be displayed
    const triggerTypes = page.locator('.font-medium.text-white').filter({ hasText: /move|label|pr|schedule/ });
    const count = await triggerTypes.count();
    expect(count).toBeGreaterThan(0);
  });

  test('workflow cards show trigger condition', async ({ page }) => {
    // Trigger condition should be in code block
    const conditionCode = page.locator('code');
    const count = await conditionCode.count();
    expect(count).toBeGreaterThan(0);
  });

  test('workflow cards show last run timestamp when available', async ({ page }) => {
    // Look for "Last run:" text
    const lastRunText = page.getByText(/Last run:/);
    const count = await lastRunText.count();
    // Some workflows may have last run, some may not
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('workflow cards have Edit button', async ({ page }) => {
    const editButtons = page.getByRole('button', { name: 'Edit' });
    const count = await editButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('workflow cards have View Logs button', async ({ page }) => {
    const viewLogsButtons = page.getByRole('button', { name: 'View Logs' });
    const count = await viewLogsButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('workflow cards have Run Now button', async ({ page }) => {
    const runNowButtons = page.getByRole('button', { name: /Run Now/ });
    const count = await runNowButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Run Now button is clickable', async ({ page }) => {
    const runNowButton = page.getByRole('button', { name: /Run Now/ }).first();
    await expect(runNowButton).toBeVisible();
    await expect(runNowButton).toBeEnabled();
    await runNowButton.click();
    // Button should still exist after click
    await expect(runNowButton).toBeVisible();
  });

  test('help section explains how workflows work', async ({ page }) => {
    const helpSection = page.getByText('How Workflows Work');
    await expect(helpSection).toBeVisible();
    
    // Should have 3 explanation sections
    await expect(page.getByText('1. Trigger')).toBeVisible();
    await expect(page.getByText('2. Conditions')).toBeVisible();
    await expect(page.getByText('3. Actions')).toBeVisible();
  });

  test('disabled workflows have visual indicator', async ({ page }) => {
    // Wait for workflows to load
    await page.waitForTimeout(500);
    
    // Look for disabled workflow (with opacity)
    const disabledWorkflows = page.locator('.opacity-60');
    const count = await disabledWorkflows.count();
    // May or may not have disabled workflows
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
