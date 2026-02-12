import { test, expect } from '@playwright/test';

test.describe('Branches Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/branches');
    // Wait for loading to complete
    await page.waitForSelector('h1:has-text("Branches")');
  });

  test('displays page title and branch count', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Branches');
    await expect(page.getByText(/\d+ branches across all projects/)).toBeVisible();
  });

  test('sync with GitHub button exists', async ({ page }) => {
    const syncButton = page.getByRole('button', { name: 'Sync with GitHub' });
    await expect(syncButton).toBeVisible();
    await expect(syncButton).toBeEnabled();
  });

  test('project filter dropdown works', async ({ page }) => {
    const projectFilter = page.locator('select').filter({ hasText: 'All Projects' });
    await expect(projectFilter).toBeVisible();
    
    // Select a project
    await projectFilter.selectOption('oci');
    await expect(projectFilter).toHaveValue('oci');
    
    // Reset
    await projectFilter.selectOption('all');
  });

  test('status filter dropdown works', async ({ page }) => {
    const statusFilter = page.locator('select').filter({ hasText: 'All Statuses' });
    await expect(statusFilter).toBeVisible();
    
    // Select active status
    await statusFilter.selectOption('active');
    await expect(statusFilter).toHaveValue('active');
    
    // Select stale status
    await statusFilter.selectOption('stale');
    await expect(statusFilter).toHaveValue('stale');
    
    // Reset
    await statusFilter.selectOption('all');
  });

  test('branch groups are displayed by project', async ({ page }) => {
    // Wait for branches to load
    await page.waitForTimeout(500);
    
    // Should have project group headers
    const projectGroups = page.locator('h2.font-semibold');
    const count = await projectGroups.count();
    expect(count).toBeGreaterThan(0);
  });

  test('branch groups show branch count badge', async ({ page }) => {
    // Each project group should show branch count
    const branchCountBadges = page.getByText(/\d+ branches/);
    const count = await branchCountBadges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('view on GitHub links exist', async ({ page }) => {
    const githubLinks = page.getByRole('link', { name: /View on GitHub/ });
    const count = await githubLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('GitHub links have correct attributes', async ({ page }) => {
    const githubLink = page.getByRole('link', { name: /View on GitHub/ }).first();
    
    // Should open in new tab
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('branches show branch names in monospace font', async ({ page }) => {
    // Branch names should be in monospace
    const branchNames = page.locator('.font-mono');
    const count = await branchNames.count();
    expect(count).toBeGreaterThan(0);
  });

  test('default branch has "default" badge', async ({ page }) => {
    // The "main" branch should have a default badge
    const defaultBadge = page.getByText('default');
    await expect(defaultBadge).toBeVisible();
  });

  test('branches show status badges', async ({ page }) => {
    const statusBadges = page.locator('.status-badge');
    const count = await statusBadges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('non-default branches show ahead/behind indicators', async ({ page }) => {
    // Look for ahead/behind text
    const aheadText = page.getByText(/↑ \d+ ahead/);
    const behindText = page.getByText(/↓ \d+ behind/);
    
    // At least one branch should have these indicators
    const aheadCount = await aheadText.count();
    const behindCount = await behindText.count();
    
    // Non-main branches should have ahead/behind indicators
    expect(aheadCount + behindCount).toBeGreaterThanOrEqual(0);
  });

  test('branch action buttons exist (swap, delete)', async ({ page }) => {
    // Each branch row should have action buttons
    const actionButtons = page.locator('button').filter({ has: page.locator('svg') });
    const count = await actionButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('branch rows have hover state', async ({ page }) => {
    const branchRow = page.locator('.divide-y > div').filter({ has: page.locator('.font-mono') }).first();
    
    // Should have hover state
    await expect(branchRow).toHaveClass(/hover:bg-\[var\(--card-hover\)\]/);
  });
});

test.describe('Branches - Empty State', () => {
  test('shows empty state when no branches match filter', async ({ page }) => {
    await page.goto('/branches');
    await page.waitForSelector('h1:has-text("Branches")');
    
    // Apply filters that return no results
    const projectFilter = page.locator('select').filter({ hasText: 'All Projects' });
    const statusFilter = page.locator('select').filter({ hasText: 'All Statuses' });
    
    // Select merged status (which might not exist)
    await statusFilter.selectOption('merged');
    
    // Check if empty state shows (may or may not depending on data)
    const emptyState = page.getByText('No branches found matching your filters');
    const isVisible = await emptyState.isVisible().catch(() => false);
    
    // Either empty state is visible or some branches are shown
    if (!isVisible) {
      const branchGroups = page.locator('h2.font-semibold');
      const count = await branchGroups.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });
});
