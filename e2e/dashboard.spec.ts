import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for loading to complete
    await page.waitForSelector('h1:has-text("Mission Control")');
  });

  test('displays page title and subtitle', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Mission Control');
    await expect(page.getByText('Overview of all projects, PRs, and work')).toBeVisible();
  });

  test('displays all stat cards', async ({ page }) => {
    const stats = ['Active Projects', 'Open PRs', 'Work Items Today', 'Pending Workflows'];
    
    for (const stat of stats) {
      await expect(page.getByText(stat)).toBeVisible();
    }
  });

  test('stat cards show numeric values', async ({ page }) => {
    // Each stat card should have a number
    const statCards = page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div');
    const count = await statCards.count();
    expect(count).toBe(4);
    
    for (let i = 0; i < count; i++) {
      const card = statCards.nth(i);
      const value = card.locator('.text-3xl.font-bold');
      await expect(value).toBeVisible();
    }
  });

  test('refresh button exists and is clickable', async ({ page }) => {
    const refreshButton = page.getByRole('button', { name: 'Refresh' });
    await expect(refreshButton).toBeVisible();
    await expect(refreshButton).toBeEnabled();
    await refreshButton.click();
    // Button should still be there after click
    await expect(refreshButton).toBeVisible();
  });

  test('kanban link button navigates to kanban page', async ({ page }) => {
    const kanbanLink = page.getByRole('link', { name: 'Kanban →' });
    await expect(kanbanLink).toBeVisible();
    await kanbanLink.click();
    await expect(page).toHaveURL('/kanban');
  });

  test('projects section displays projects', async ({ page }) => {
    const projectsSection = page.locator('text=Projects >> xpath=ancestor::div[contains(@class, "rounded-xl")]').first();
    await expect(projectsSection).toBeVisible();
    
    // Should have "View all" link
    const viewAllLink = page.getByRole('link', { name: 'View all →' }).first();
    await expect(viewAllLink).toBeVisible();
  });

  test('view all projects link navigates correctly', async ({ page }) => {
    const viewAllLink = page.locator('h2:has-text("Projects")').locator('..').getByRole('link', { name: 'View all →' });
    await viewAllLink.click();
    await expect(page).toHaveURL('/projects');
  });

  test('open PRs section exists', async ({ page }) => {
    const prsSection = page.getByRole('heading', { name: 'Open PRs' });
    await expect(prsSection).toBeVisible();
  });

  test('view all PRs link navigates correctly', async ({ page }) => {
    const viewAllLink = page.locator('h2:has-text("Open PRs")').locator('..').getByRole('link', { name: 'View all →' });
    await viewAllLink.click();
    await expect(page).toHaveURL(/\/tickets/);
  });

  test('recent work section displays work items', async ({ page }) => {
    const recentWorkSection = page.getByRole('heading', { name: 'Recent Work' });
    await expect(recentWorkSection).toBeVisible();
    
    // Should have view full log link
    const viewLogLink = page.getByRole('link', { name: 'View full log →' });
    await expect(viewLogLink).toBeVisible();
  });

  test('view full log link navigates to worklog', async ({ page }) => {
    const viewLogLink = page.getByRole('link', { name: 'View full log →' });
    await viewLogLink.click();
    await expect(page).toHaveURL('/worklog');
  });

  test('project status badges display correctly', async ({ page }) => {
    // Check for status badges in projects section
    const statusBadges = page.locator('.status-badge');
    const count = await statusBadges.count();
    expect(count).toBeGreaterThan(0);
  });
});
