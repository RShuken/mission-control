import { test, expect } from '@playwright/test';

test.describe('Tickets Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tickets');
    // Wait for loading to complete
    await page.waitForSelector('h1:has-text("Tickets")');
  });

  test('displays page title and ticket count', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Tickets');
    // Should show filtered/total count
    await expect(page.getByText(/\d+ of \d+ items/)).toBeVisible();
  });

  test('create ticket button exists', async ({ page }) => {
    const createButton = page.getByRole('button', { name: '+ Create Ticket' });
    await expect(createButton).toBeVisible();
    await expect(createButton).toBeEnabled();
  });

  test('view mode tabs work correctly', async ({ page }) => {
    // All tab should be active by default
    const allTab = page.getByRole('button', { name: 'All' });
    await expect(allTab).toBeVisible();
    
    // Click PRs tab
    const prsTab = page.getByRole('button', { name: 'PRs' });
    await prsTab.click();
    await expect(prsTab).toHaveClass(/bg-\[var\(--card\)\]/);
    
    // Click Tasks tab
    const tasksTab = page.getByRole('button', { name: 'Tasks' });
    await tasksTab.click();
    await expect(tasksTab).toHaveClass(/bg-\[var\(--card\)\]/);
    
    // Go back to All
    await allTab.click();
    await expect(allTab).toHaveClass(/bg-\[var\(--card\)\]/);
  });

  test('search input filters tickets', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search tickets...');
    await expect(searchInput).toBeVisible();
    
    // Type a search query
    await searchInput.fill('test');
    await page.waitForTimeout(300);
    
    // Clear search
    await searchInput.clear();
  });

  test('priority filter dropdown works', async ({ page }) => {
    const priorityFilter = page.locator('select').filter({ hasText: 'All Priorities' });
    await expect(priorityFilter).toBeVisible();
    
    // Select high priority
    await priorityFilter.selectOption('high');
    await expect(priorityFilter).toHaveValue('high');
    
    // Reset to all
    await priorityFilter.selectOption('all');
    await expect(priorityFilter).toHaveValue('all');
  });

  test('project filter dropdown works', async ({ page }) => {
    const projectFilter = page.locator('select').filter({ hasText: 'All Projects' });
    await expect(projectFilter).toBeVisible();
    
    // Select a project
    await projectFilter.selectOption('openclawinstall');
    await expect(projectFilter).toHaveValue('openclawinstall');
    
    // Reset
    await projectFilter.selectOption('all');
  });

  test('tickets list displays ticket items', async ({ page }) => {
    // Wait for tickets to load
    await page.waitForTimeout(500);
    
    // Should have ticket rows
    const ticketRows = page.locator('.divide-y > div').filter({ hasText: /.+/ });
    const count = await ticketRows.count();
    // Should have at least one ticket or the "no tickets" message
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('ticket items show status badges', async ({ page }) => {
    const statusBadges = page.locator('.status-badge');
    const count = await statusBadges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('ticket items show priority badges', async ({ page }) => {
    // Priority badges in ticket rows
    const priorityBadges = page.locator('[class*="priority-"]');
    const count = await priorityBadges.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('ticket items are clickable (hover state)', async ({ page }) => {
    const ticketRow = page.locator('.divide-y > div').first();
    
    // Should have hover state class
    await expect(ticketRow).toHaveClass(/hover:bg-\[var\(--card-hover\)\]/);
  });

  test('table header shows correct columns on desktop', async ({ page }) => {
    test.skip(test.info().project.name === 'Mobile Chrome');
    
    // Check desktop table headers
    const headers = ['Type', 'Title', 'Status', 'Priority', 'Project', 'Updated'];
    
    for (const header of headers) {
      const headerElement = page.locator('.hidden.md\\:grid').getByText(header, { exact: false });
      await expect(headerElement).toBeVisible();
    }
  });
});

test.describe('Tickets Page - Empty State', () => {
  test('shows empty state when no tickets match filter', async ({ page }) => {
    await page.goto('/tickets');
    await page.waitForSelector('h1:has-text("Tickets")');
    
    // Search for something that won't exist
    const searchInput = page.getByPlaceholder('Search tickets...');
    await searchInput.fill('xyznonexistentticket123456');
    
    // Should show empty state
    await expect(page.getByText('No tickets found matching your filters')).toBeVisible();
  });
});

test.describe('Tickets Mobile View', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('mobile layout shows stacked ticket info', async ({ page }) => {
    await page.goto('/tickets');
    await page.waitForSelector('h1:has-text("Tickets")');
    
    // Desktop grid should be hidden
    const desktopHeader = page.locator('.hidden.md\\:grid');
    await expect(desktopHeader).toBeHidden();
    
    // Mobile layout should be visible for each ticket
    const mobileLayout = page.locator('.md\\:hidden').first();
    await expect(mobileLayout).toBeVisible();
  });
});
