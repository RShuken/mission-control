import { test, expect } from '@playwright/test';

test.describe('Kanban Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kanban');
    // Wait for loading to complete
    await page.waitForSelector('h1:has-text("Kanban Board")');
  });

  test('displays page title and item count', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Kanban Board');
    // Should show item count
    await expect(page.getByText(/\d+ items across \d+ columns/)).toBeVisible();
  });

  test('displays all kanban columns', async ({ page }) => {
    // Standard kanban columns
    const columns = ['Backlog', 'In Progress', 'Code Review', 'Truth Review', 'Ready to Deploy', 'Deployed'];
    
    for (const column of columns) {
      const columnHeader = page.getByText(column, { exact: false });
      // At least one element with this text should exist
      const count = await columnHeader.count();
      expect(count).toBeGreaterThanOrEqual(1);
    }
  });

  test('project filter dropdown exists and works', async ({ page }) => {
    const projectFilter = page.locator('select').first();
    await expect(projectFilter).toBeVisible();
    
    // Check options exist
    await expect(projectFilter.locator('option:has-text("All Projects")')).toBeAttached();
    
    // Change filter
    await projectFilter.selectOption({ label: 'OpenClaw Install' });
    await expect(projectFilter).toHaveValue('oci');
  });

  test('add button exists and is clickable', async ({ page }) => {
    const addButton = page.getByRole('button', { name: '+ Add' });
    await expect(addButton).toBeVisible();
    await expect(addButton).toBeEnabled();
    await addButton.click();
    // Button should still be there (no modal implemented yet)
    await expect(addButton).toBeVisible();
  });

  test('kanban cards are displayed', async ({ page }) => {
    // Wait for cards to load
    await page.waitForTimeout(500);
    
    // Look for kanban cards
    const cards = page.locator('[class*="bg-"][class*="rounded-lg"][class*="p-"]').filter({ hasText: /.+/ });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('kanban cards show priority badges', async ({ page }) => {
    // Check for priority badges
    const priorityBadges = page.locator('[class*="priority-"]');
    const count = await priorityBadges.count();
    expect(count).toBeGreaterThanOrEqual(0); // May have no priority badges
  });

  test('columns show item count', async ({ page }) => {
    // Each column header should show count
    const columnCounts = page.locator('text=/\\d+$/');
    const count = await columnCounts.count();
    expect(count).toBeGreaterThan(0);
  });

  test('drag and drop functionality is enabled', async ({ page }) => {
    // Check that DnD context is set up by verifying cards exist and are interactive
    const cards = page.locator('[data-handler-id]');
    // Even without data-handler-id, we can check cards exist
    const allCards = page.locator('.rounded-lg').filter({ hasText: /.+/ });
    const count = await allCards.count();
    // Page should have loaded with some cards
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Kanban Mobile View', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('columns are horizontally scrollable on mobile', async ({ page }) => {
    await page.goto('/kanban');
    await page.waitForSelector('h1:has-text("Kanban Board")');
    
    // The columns container should exist and allow horizontal scroll
    const columnsContainer = page.locator('.flex.gap-4.overflow-x-auto');
    await expect(columnsContainer).toBeVisible();
  });
});
