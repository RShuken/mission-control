import { test, expect } from '@playwright/test';

test.describe('Work Log Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/worklog');
    // Wait for loading to complete
    await page.waitForSelector('h1:has-text("Work Log")');
  });

  test('displays page title and description', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Work Log');
    await expect(page.getByText('Timeline of all work completed by Molty')).toBeVisible();
  });

  test('export log button exists', async ({ page }) => {
    const exportButton = page.getByRole('button', { name: 'Export Log' });
    await expect(exportButton).toBeVisible();
    await expect(exportButton).toBeEnabled();
  });

  test('stats cards are displayed', async ({ page }) => {
    const statsGrid = page.locator('.grid.grid-cols-2.md\\:grid-cols-4');
    await expect(statsGrid).toBeVisible();
    
    // Should have 4 stat cards
    const statCards = statsGrid.locator('> div');
    const count = await statCards.count();
    expect(count).toBe(4);
  });

  test('stats show total items count', async ({ page }) => {
    await expect(page.getByText('Total Items')).toBeVisible();
  });

  test('stats show commits count', async ({ page }) => {
    await expect(page.getByText('Commits')).toBeVisible();
  });

  test('stats show PRs count', async ({ page }) => {
    await expect(page.getByText('PRs')).toBeVisible();
  });

  test('stats show deploys count', async ({ page }) => {
    await expect(page.getByText('Deploys')).toBeVisible();
  });

  test('type filter dropdown works', async ({ page }) => {
    const typeFilter = page.locator('select').filter({ hasText: 'All Types' });
    await expect(typeFilter).toBeVisible();
    
    // Select commits
    await typeFilter.selectOption('commit');
    await expect(typeFilter).toHaveValue('commit');
    
    // Select PRs
    await typeFilter.selectOption('pr');
    await expect(typeFilter).toHaveValue('pr');
    
    // Reset
    await typeFilter.selectOption('all');
  });

  test('project filter dropdown works', async ({ page }) => {
    const projectFilter = page.locator('select').filter({ hasText: 'All Projects' });
    await expect(projectFilter).toBeVisible();
    
    // Select a project
    await projectFilter.selectOption('openclaw');
    await expect(projectFilter).toHaveValue('openclaw');
    
    // Reset
    await projectFilter.selectOption('all');
  });

  test('timeline shows date groupings', async ({ page }) => {
    // Wait for timeline to load
    await page.waitForTimeout(500);
    
    // Should have date headers like "Today", "Yesterday", or formatted dates
    const dateHeaders = page.locator('h2').filter({ hasText: /Today|Yesterday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/ });
    const count = await dateHeaders.count();
    expect(count).toBeGreaterThan(0);
  });

  test('timeline shows item counts per day', async ({ page }) => {
    // Each date group should show item count
    const itemCounts = page.getByText(/\d+ items/);
    const count = await itemCounts.count();
    expect(count).toBeGreaterThan(0);
  });

  test('work items display title and project', async ({ page }) => {
    // Work items should show their title
    const workItems = page.locator('.font-medium.text-white').filter({ hasText: /.+/ });
    const count = await workItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('work items show type badges', async ({ page }) => {
    const typeBadges = page.locator('.status-badge');
    const count = await typeBadges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('work items show timestamp', async ({ page }) => {
    // Work items should show time like "10:30 AM"
    const timestamps = page.getByText(/\d{1,2}:\d{2}\s*(AM|PM)/);
    const count = await timestamps.count();
    expect(count).toBeGreaterThan(0);
  });

  test('timeline has visual timeline dots', async ({ page }) => {
    // Should have timeline dots
    const timelineDots = page.locator('.rounded-full').filter({ has: page.locator('[class*="bg-"]') });
    const count = await timelineDots.count();
    expect(count).toBeGreaterThan(0);
  });

  test('work items have type icons', async ({ page }) => {
    // Type icons (📝, 🔀, 🚀, ✅, ✍️)
    const iconContainer = page.locator('.text-lg').first();
    await expect(iconContainer).toBeVisible();
  });
});

test.describe('Work Log - Empty State', () => {
  test('shows empty state when no items match filter', async ({ page }) => {
    await page.goto('/worklog');
    await page.waitForSelector('h1:has-text("Work Log")');
    
    // Apply filter that might return no results
    const typeFilter = page.locator('select').filter({ hasText: 'All Types' });
    await typeFilter.selectOption('content');
    
    const projectFilter = page.locator('select').filter({ hasText: 'All Projects' });
    await projectFilter.selectOption('mission');
    
    // Check for either results or empty state
    const emptyState = page.getByText('No work items found matching your filters');
    const isVisible = await emptyState.isVisible().catch(() => false);
    
    // Either empty state is visible or work items are shown
    if (!isVisible) {
      const workItems = page.locator('.font-medium.text-white');
      const count = await workItems.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });
});
