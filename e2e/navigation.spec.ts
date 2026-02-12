import { test, expect } from '@playwright/test';

test.describe('Navigation & Sidebar', () => {
  test('sidebar shows all navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Check all main nav links exist in sidebar
    const navLinks = [
      { name: 'Dashboard', href: '/' },
      { name: 'NightShift', href: '/nightshift' },
      { name: 'Kanban', href: '/kanban' },
      { name: 'Tickets', href: '/tickets' },
      { name: 'Projects', href: '/projects' },
      { name: 'Branches', href: '/branches' },
      { name: 'Work Log', href: '/worklog' },
      { name: 'Workflows', href: '/workflows' },
    ];

    for (const link of navLinks) {
      const navItem = page.locator(`aside a[href="${link.href}"]`).first();
      await expect(navItem).toBeVisible();
      await expect(navItem).toContainText(link.name);
    }
  });

  test('sidebar project links exist', async ({ page }) => {
    await page.goto('/');
    
    const projectLinks = [
      '/projects/openclawinstall',
      '/projects/denveraitraining',
      '/projects/mc-leads',
      '/projects/mission-control',
    ];

    for (const href of projectLinks) {
      const projectLink = page.locator(`aside a[href="${href}"]`);
      await expect(projectLink).toBeVisible();
    }
  });

  test('clicking nav links navigates to correct pages', async ({ page }) => {
    await page.goto('/');

    // Test each navigation link
    const routes = [
      { selector: 'aside a[href="/kanban"]', expectedUrl: '/kanban', expectedText: 'Kanban Board' },
      { selector: 'aside a[href="/tickets"]', expectedUrl: '/tickets', expectedText: 'Tickets' },
      { selector: 'aside a[href="/projects"]', expectedUrl: '/projects', expectedText: 'Projects' },
      { selector: 'aside a[href="/branches"]', expectedUrl: '/branches', expectedText: 'Branches' },
      { selector: 'aside a[href="/worklog"]', expectedUrl: '/worklog', expectedText: 'Work Log' },
      { selector: 'aside a[href="/workflows"]', expectedUrl: '/workflows', expectedText: 'Workflows' },
      { selector: 'aside a[href="/nightshift"]', expectedUrl: '/nightshift', expectedText: 'NightShift' },
    ];

    for (const route of routes) {
      await page.goto('/');
      await page.locator(route.selector).first().click();
      await expect(page).toHaveURL(route.expectedUrl);
      // Use main content area heading
      await expect(page.locator('main h1')).toContainText(route.expectedText);
    }
  });

  test('active nav link is highlighted', async ({ page }) => {
    await page.goto('/kanban');
    
    const kanbanLink = page.locator('aside a[href="/kanban"]').first();
    await expect(kanbanLink).toHaveClass(/text-accent-400/);
  });

  test('logo links to home', async ({ page }) => {
    await page.goto('/kanban');
    
    const logo = page.locator('aside').getByText('Mission Control').first();
    // Logo should be visible
    await expect(logo).toBeVisible();
  });

  test('footer shows agent info', async ({ page }) => {
    await page.goto('/');
    
    const footer = page.locator('aside').getByText('Molty');
    await expect(footer).toBeVisible();
    
    const agentLabel = page.locator('aside').getByText('AI Agent');
    await expect(agentLabel).toBeVisible();
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('mobile menu button toggles sidebar', async ({ page }) => {
    await page.goto('/');
    
    // Sidebar should be hidden initially on mobile
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveClass(/-translate-x-full/);
    
    // Click hamburger menu
    const menuButton = page.locator('.lg\\:hidden.fixed button').first();
    await menuButton.click();
    
    // Sidebar should be visible now
    await expect(sidebar).toHaveClass(/translate-x-0/);
  });

  test('mobile overlay closes sidebar when clicking outside', async ({ page }) => {
    await page.goto('/');
    
    // Open sidebar
    const menuButton = page.locator('.lg\\:hidden.fixed button').first();
    await menuButton.click();
    
    // Wait for sidebar to open
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveClass(/translate-x-0/);
    
    // Click the close button (X) instead of overlay
    const closeButton = page.locator('.lg\\:hidden.fixed button').first();
    await closeButton.click();
    
    // Sidebar should be hidden again
    await expect(sidebar).toHaveClass(/-translate-x-full/);
  });

  test('clicking nav item closes mobile menu', async ({ page }) => {
    await page.goto('/');
    
    // Open sidebar
    const menuButton = page.locator('.lg\\:hidden.fixed button').first();
    await menuButton.click();
    
    // Click a nav link
    await page.locator('aside a[href="/kanban"]').first().click();
    
    // Should navigate and close sidebar
    await expect(page).toHaveURL('/kanban');
  });
});
