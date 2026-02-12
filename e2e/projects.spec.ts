import { test, expect } from '@playwright/test';

test.describe('Projects Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
    // Wait for loading to complete
    await page.waitForSelector('h1:has-text("Projects")');
  });

  test('displays page title and project count', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Projects');
    await expect(page.getByText(/\d+ active projects/)).toBeVisible();
  });

  test('add project button exists', async ({ page }) => {
    const addButton = page.getByRole('button', { name: '+ Add Project' });
    await expect(addButton).toBeVisible();
    await expect(addButton).toBeEnabled();
  });

  test('project cards are displayed', async ({ page }) => {
    // Wait for projects to load
    await page.waitForTimeout(500);
    
    // Project cards should exist
    const projectCards = page.locator('.grid.grid-cols-1.md\\:grid-cols-2 > div');
    const count = await projectCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('project cards show project name and repo', async ({ page }) => {
    // Each project card should have name and repo
    const projectNames = page.locator('h3.font-semibold');
    const count = await projectNames.count();
    expect(count).toBeGreaterThan(0);
  });

  test('project cards show status badge', async ({ page }) => {
    const statusBadges = page.locator('.status-badge');
    const count = await statusBadges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('project cards show branch list', async ({ page }) => {
    // Look for "Branches" label
    const branchesLabel = page.getByText('Branches', { exact: false }).first();
    await expect(branchesLabel).toBeVisible();
  });

  test('project cards show stats (branches, open PRs, type)', async ({ page }) => {
    // Stats row should show branches count
    await expect(page.getByText('Branches:').first()).toBeVisible();
    
    // Stats row should show open PRs count
    await expect(page.getByText('Open PRs:').first()).toBeVisible();
    
    // Stats row should show type
    await expect(page.getByText('Type:').first()).toBeVisible();
  });

  test('project cards have external URL links when available', async ({ page }) => {
    // Check for Live URL sections
    const liveUrlLabel = page.getByText('Live URL');
    const count = await liveUrlLabel.count();
    
    if (count > 0) {
      // If there are live URLs, they should have external link icons
      const externalLinks = page.locator('a[target="_blank"]');
      const linkCount = await externalLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    }
  });

  test('project cards show last activity timestamp', async ({ page }) => {
    // Should show "Last activity:" text
    const lastActivity = page.getByText('Last activity:');
    const count = await lastActivity.count();
    expect(count).toBeGreaterThan(0);
  });

  test('view details link navigates to project detail page', async ({ page }) => {
    const viewDetailsLink = page.getByRole('link', { name: 'View Details →' }).first();
    await expect(viewDetailsLink).toBeVisible();
    
    // Click and check navigation
    await viewDetailsLink.click();
    await expect(page).toHaveURL(/\/projects\/.+/);
  });

  test('project type icons are displayed', async ({ page }) => {
    // Type icons should be visible (🌐, ⚡, 📝, 🔧)
    const iconContainer = page.locator('.text-2xl').first();
    await expect(iconContainer).toBeVisible();
  });
});

test.describe('Projects Mobile View', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('project cards stack vertically on mobile', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForSelector('h1:has-text("Projects")');
    
    // Grid should exist but show single column on mobile
    const grid = page.locator('.grid.grid-cols-1');
    await expect(grid).toBeVisible();
  });
});
