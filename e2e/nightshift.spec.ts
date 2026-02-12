import { test, expect } from '@playwright/test';

test.describe('NightShift Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/nightshift');
    // Wait for loading to complete
    await page.waitForSelector('h1:has-text("NightShift")');
  });

  test('displays page title and description', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('NightShift');
    await expect(page.getByText('Autonomous work while you sleep')).toBeVisible();
  });

  test('shows active status indicator', async ({ page }) => {
    const activeIndicator = page.getByText('Active');
    await expect(activeIndicator).toBeVisible();
  });

  test('displays all navigation tabs', async ({ page }) => {
    const tabs = ['Overview', 'Work Queue', 'Strategies', 'Monitoring', 'Ralph Loop'];
    
    for (const tab of tabs) {
      const tabButton = page.getByRole('button', { name: new RegExp(tab) });
      await expect(tabButton).toBeVisible();
    }
  });

  test('overview tab is active by default', async ({ page }) => {
    const overviewTab = page.getByRole('button', { name: /Overview/ });
    await expect(overviewTab).toHaveClass(/bg-accent-600/);
  });

  test('clicking tabs switches content', async ({ page }) => {
    // Click Work Queue tab
    await page.getByRole('button', { name: /Work Queue/ }).click();
    await expect(page.getByText('tasks queued for tonight')).toBeVisible();
    
    // Click Strategies tab
    await page.getByRole('button', { name: /Strategies/ }).click();
    await expect(page.getByText('NightShift Strategies')).toBeVisible();
    
    // Click Monitoring tab
    await page.getByRole('button', { name: /Monitoring/ }).click();
    await expect(page.getByText('Monitoring Targets')).toBeVisible();
    
    // Click Ralph Loop tab
    await page.getByRole('button', { name: /Ralph Loop/ }).click();
    await expect(page.getByText('The Ralph Wiggum Loop')).toBeVisible();
  });
});

test.describe('NightShift - Overview Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/nightshift');
    await page.waitForSelector('h1:has-text("NightShift")');
  });

  test('displays stat cards', async ({ page }) => {
    const stats = ['Queued', 'In Progress', 'Completed', 'Active Strategies', 'Needs Attention'];
    
    for (const stat of stats) {
      await expect(page.getByText(stat)).toBeVisible();
    }
  });

  test('displays NightShift Context section', async ({ page }) => {
    await expect(page.getByText('NightShift Context')).toBeVisible();
    await expect(page.getByText('Primary Mission')).toBeVisible();
    await expect(page.getByText('Operating Hours')).toBeVisible();
    await expect(page.getByText('Key Constraints')).toBeVisible();
    await expect(page.getByText('Focus Areas')).toBeVisible();
  });

  test('displays quick action cards', async ({ page }) => {
    const actions = ['Add to Queue', 'Check Leads', 'Run Ralph Loop'];
    
    for (const action of actions) {
      await expect(page.getByText(action)).toBeVisible();
    }
  });

  test('quick action cards have action buttons', async ({ page }) => {
    const actionButtons = ['Add Task', 'Check Now', 'Start Loop'];
    
    for (const button of actionButtons) {
      await expect(page.getByRole('button', { name: new RegExp(button) })).toBeVisible();
    }
  });

  test('displays recent activity section', async ({ page }) => {
    await expect(page.getByText('Recent NightShift Activity')).toBeVisible();
  });
});

test.describe('NightShift - Work Queue Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/nightshift');
    await page.waitForSelector('h1:has-text("NightShift")');
    await page.getByRole('button', { name: /Work Queue/ }).click();
  });

  test('displays queue header with add button', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Work Queue' })).toBeVisible();
    await expect(page.getByRole('button', { name: '+ Add Task' })).toBeVisible();
  });

  test('displays task list with columns', async ({ page }) => {
    const columns = ['Type', 'Task', 'Project', 'Priority', 'Status', 'Est. Time'];
    
    for (const column of columns) {
      await expect(page.getByText(column, { exact: false })).toBeVisible();
    }
  });

  test('tasks have Start button', async ({ page }) => {
    const startButtons = page.getByRole('button', { name: /Start →/ });
    const count = await startButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('displays recurring tasks section', async ({ page }) => {
    await expect(page.getByText('Recurring Tasks')).toBeVisible();
  });
});

test.describe('NightShift - Strategies Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/nightshift');
    await page.waitForSelector('h1:has-text("NightShift")');
    await page.getByRole('button', { name: /Strategies/ }).click();
  });

  test('displays strategies header with new button', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'NightShift Strategies' })).toBeVisible();
    await expect(page.getByRole('button', { name: '+ New Strategy' })).toBeVisible();
  });

  test('strategy cards have toggle switches', async ({ page }) => {
    const toggles = page.locator('input[type="checkbox"]');
    const count = await toggles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('strategy toggles change state', async ({ page }) => {
    const toggle = page.locator('input[type="checkbox"]').first();
    const initialState = await toggle.isChecked();
    
    await toggle.click();
    expect(await toggle.isChecked()).toBe(!initialState);
    
    // Restore
    await toggle.click();
  });

  test('strategies show success rate when available', async ({ page }) => {
    const successRates = page.getByText(/\d+% success rate/);
    const count = await successRates.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('NightShift - Monitoring Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/nightshift');
    await page.waitForSelector('h1:has-text("NightShift")');
    await page.getByRole('button', { name: /Monitoring/ }).click();
  });

  test('displays monitoring header with add button', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Monitoring Targets' })).toBeVisible();
    await expect(page.getByRole('button', { name: '+ Add Target' })).toBeVisible();
  });

  test('monitoring cards show check interval', async ({ page }) => {
    const checkIntervals = page.getByText(/Check every \d+ min/);
    const count = await checkIntervals.count();
    expect(count).toBeGreaterThan(0);
  });

  test('monitoring cards have Check Now button', async ({ page }) => {
    const checkNowButtons = page.getByRole('button', { name: 'Check Now' });
    const count = await checkNowButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('monitoring cards show last checked time', async ({ page }) => {
    const lastChecked = page.getByText(/Last checked:/);
    const count = await lastChecked.count();
    expect(count).toBeGreaterThan(0);
  });

  test('monitoring cards show status badges', async ({ page }) => {
    const statusBadges = page.locator('.status-badge');
    const count = await statusBadges.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('NightShift - Ralph Loop Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/nightshift');
    await page.waitForSelector('h1:has-text("NightShift")');
    await page.getByRole('button', { name: /Ralph Loop/ }).click();
  });

  test('displays Ralph Wiggum Loop header', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'The Ralph Wiggum Loop' })).toBeVisible();
    await expect(page.getByText("I'm helping!")).toBeVisible();
  });

  test('displays the 5-step loop diagram', async ({ page }) => {
    const steps = ['Observe', 'Attempt', 'Ship', 'Learn', 'Repeat'];
    
    for (const step of steps) {
      await expect(page.getByText(step, { exact: true })).toBeVisible();
    }
  });

  test('displays active Ralph loops', async ({ page }) => {
    await expect(page.getByText('Active Ralph Loops')).toBeVisible();
  });

  test('active loops show iteration count', async ({ page }) => {
    const iterationBadges = page.getByText(/Iteration #\d+/);
    const count = await iterationBadges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('displays start new loop form', async ({ page }) => {
    await expect(page.getByText('Start a New Ralph Loop')).toBeVisible();
    
    // Project selector
    const projectSelect = page.locator('select').last();
    await expect(projectSelect).toBeVisible();
    
    // Improvement target input
    const targetInput = page.getByPlaceholder('e.g., Increase mobile conversion');
    await expect(targetInput).toBeVisible();
    
    // Start Loop button
    const startButton = page.getByRole('button', { name: /Start Loop/ });
    await expect(startButton).toBeVisible();
  });

  test('displays philosophy section', async ({ page }) => {
    await expect(page.getByText('The Philosophy')).toBeVisible();
    await expect(page.getByText('Small Bets')).toBeVisible();
    await expect(page.getByText('Document Everything')).toBeVisible();
    await expect(page.getByText('Keep Moving')).toBeVisible();
  });
});

test.describe('NightShift Mobile View', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('tabs are scrollable on mobile', async ({ page }) => {
    await page.goto('/nightshift');
    await page.waitForSelector('h1:has-text("NightShift")');
    
    // Tabs container should be scrollable
    const tabsContainer = page.locator('.overflow-x-auto');
    await expect(tabsContainer).toBeVisible();
  });

  test('tab icons show on mobile', async ({ page }) => {
    await page.goto('/nightshift');
    await page.waitForSelector('h1:has-text("NightShift")');
    
    // Tab icons (emoji) should be visible
    const tabEmojis = page.locator('button').filter({ hasText: /🌙|📋|🎯|👁️|🔄/ });
    const count = await tabEmojis.count();
    expect(count).toBe(5);
  });
});
