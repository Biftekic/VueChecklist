import { test, expect } from '@playwright/test';

test.describe('Quick Validation Tests', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('http://localhost:5175/');
    await expect(page).toHaveTitle(/Vue Checklist/i);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to templates page', async ({ page }) => {
    await page.goto('http://localhost:5175/templates');
    await expect(page.locator('h1')).toContainText('Templates');
    await expect(page.locator('.template-card')).toHaveCount(6);
  });

  test('should navigate to edit template page', async ({ page }) => {
    await page.goto('http://localhost:5175/template/1/edit');
    await expect(page.locator('.v-card-title').first()).toContainText('Edit Template');
    // Check if the template name is loaded
    const nameInput = page.locator('input').first();
    await expect(nameInput).toHaveValue('Standard House Cleaning');
  });

  test('should navigate to create checklist page', async ({ page }) => {
    await page.goto('http://localhost:5175/create');
    await expect(page.locator('.v-stepper')).toBeVisible();
    await expect(page.locator('text=Client Information')).toBeVisible();
  });

  test('should navigate to checklists page', async ({ page }) => {
    await page.goto('http://localhost:5175/checklists');
    await expect(page.locator('h1')).toContainText('Checklists');
    await expect(page.locator('button:has-text("New Checklist")')).toBeVisible();
  });
});