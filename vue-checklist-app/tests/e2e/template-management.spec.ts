import { test, expect } from '@playwright/test';

test.describe('Template Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5175/templates');
    await page.waitForLoadState('networkidle');
  });

  test('should display templates page with existing templates', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Templates');
    
    // Check create template button
    await expect(page.locator('button:has-text("Create Template")')).toBeVisible();
    
    // Check template cards exist
    const templateCards = page.locator('.template-card');
    await expect(templateCards).toHaveCount(6); // Based on sample data
    
    // Check first template card content
    const firstCard = templateCards.first();
    await expect(firstCard.locator('.v-card-title')).toContainText('Standard House Cleaning');
    await expect(firstCard.locator('.v-card-subtitle')).toContainText('Residential');
  });

  test('should filter templates by category', async ({ page }) => {
    // Click on a category chip
    await page.locator('.v-chip:has-text("Deep Clean")').click();
    
    // Check filtered results
    const templateCards = page.locator('.template-card');
    await expect(templateCards).toHaveCount(2); // Deep Clean category has 2 templates
    
    // Verify all visible templates are in Deep Clean category
    const subtitles = await templateCards.locator('.v-card-subtitle').allTextContents();
    subtitles.forEach(subtitle => {
      expect(subtitle).toBe('Deep Clean');
    });
  });

  test('should navigate to edit template page when clicking edit button', async ({ page }) => {
    // Click edit button on first template
    await page.locator('.template-card').first().locator('button:has(.mdi-pencil)').click();
    
    // Wait for navigation
    await page.waitForURL('**/template/1/edit');
    
    // Check if edit page loaded
    await expect(page.locator('h1')).toContainText('Edit Template');
    
    // Check if form fields are populated
    await expect(page.locator('input[label="Template Name"]')).toHaveValue('Standard House Cleaning');
  });

  test('should create new template', async ({ page }) => {
    // Click create template button
    await page.locator('button:has-text("Create Template")').click();
    
    // Should navigate to create page with template flag
    await expect(page.url()).toContain('/create?saveAsTemplate=true');
  });

  test('should use template for new checklist', async ({ page }) => {
    // Click "Use Template" button on first card
    await page.locator('.template-card').first().locator('button:has-text("Use Template")').click();
    
    // Should navigate to create page with template ID
    await expect(page.url()).toContain('/create?template=1');
  });

  test('should show confirmation dialog when deleting template', async ({ page }) => {
    // Set up dialog handler
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('Are you sure you want to delete this template?');
      dialog.accept();
    });
    
    // Click delete button on first template
    await page.locator('.template-card').first().locator('button:has(.mdi-delete)').click();
    
    // Wait for card to be removed
    await expect(page.locator('.template-card')).toHaveCount(5);
  });
});

test.describe('Template Edit Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5175/template/1/edit');
    await page.waitForLoadState('networkidle');
  });

  test('should load template data correctly', async ({ page }) => {
    // Check page title
    await expect(page.locator('.v-card-title').first()).toContainText('Edit Template');
    
    // Check form fields are populated
    const nameInput = page.locator('input').first();
    await expect(nameInput).toHaveValue('Standard House Cleaning');
    
    // Check category is selected
    const categorySelect = page.locator('.v-select').first();
    await expect(categorySelect).toContainText('Residential');
    
    // Check rooms count
    const roomsInput = page.locator('input[type="number"]').first();
    await expect(roomsInput).toHaveValue('8');
    
    // Check estimated time
    const timeInput = page.locator('input[type="number"]').nth(1);
    await expect(timeInput).toHaveValue('120');
  });

  test('should add new room with tasks', async ({ page }) => {
    // Add new room
    await page.fill('input[label="Add Room"]', 'Garage');
    await page.locator('button:has-text("Add Room")').click();
    
    // Check room was added to expansion panels
    await expect(page.locator('.v-expansion-panel:has-text("Garage")')).toBeVisible();
    
    // Expand the new room panel
    await page.locator('.v-expansion-panel:has-text("Garage")').click();
    
    // Add task to the new room
    await page.fill('input[label*="Add task to Garage"]', 'Sweep floor');
    await page.keyboard.press('Enter');
    
    // Check task was added
    await expect(page.locator('.v-list-item:has-text("Sweep floor")')).toBeVisible();
  });

  test('should remove room', async ({ page }) => {
    // Expand first room
    await page.locator('.v-expansion-panel').first().click();
    
    // Click remove room button
    await page.locator('button:has-text("Remove Room")').first().click();
    
    // Check room count decreased
    const panels = page.locator('.v-expansion-panel');
    const initialCount = await panels.count();
    await expect(panels).toHaveCount(initialCount - 1);
  });

  test('should validate required fields', async ({ page }) => {
    // Clear template name
    const nameInput = page.locator('input').first();
    await nameInput.clear();
    
    // Try to save
    await page.locator('button:has-text("Save Template")').click();
    
    // Check validation message appears
    await expect(page.locator('text=Template name is required')).toBeVisible();
    
    // Save button should be disabled
    await expect(page.locator('button:has-text("Save Template")')).toBeDisabled();
  });

  test('should cancel editing and return to templates page', async ({ page }) => {
    // Click cancel button
    await page.locator('button:has-text("Cancel")').click();
    
    // Should navigate back to templates page
    await expect(page).toHaveURL('http://localhost:5175/templates');
  });

  test('should save template changes', async ({ page }) => {
    // Modify template name
    const nameInput = page.locator('input').first();
    await nameInput.clear();
    await nameInput.fill('Updated House Cleaning');
    
    // Modify description
    const descriptionTextarea = page.locator('textarea');
    await descriptionTextarea.clear();
    await descriptionTextarea.fill('Updated description for testing');
    
    // Save template
    await page.locator('button:has-text("Save Template")').click();
    
    // Should navigate back to templates page
    await expect(page).toHaveURL('http://localhost:5175/templates');
  });
});

test.describe('Checklist Creation with Templates', () => {
  test('should create checklist from template', async ({ page }) => {
    // Start from templates page
    await page.goto('http://localhost:5175/templates');
    
    // Use first template
    await page.locator('.template-card').first().locator('button:has-text("Use Template")').click();
    
    // Should be on create page with template
    await expect(page.url()).toContain('/create?template=1');
    
    // Wait for form to load
    await page.waitForSelector('.v-stepper');
    
    // Fill client info (Step 1)
    await page.fill('input[label="Client Name"]', 'John Doe');
    await page.fill('input[label="Client Email"]', 'john@example.com');
    await page.fill('input[label="Client Phone"]', '555-1234');
    
    // Navigate to next step
    await page.locator('button:has-text("Next")').click();
    
    // Property Details (Step 2) should have template data
    await expect(page.locator('text=Property Details')).toBeVisible();
    
    // Continue through the wizard
    await page.locator('button:has-text("Next")').click();
    
    // Room Selection (Step 3)
    await expect(page.locator('text=Room Selection')).toBeVisible();
    
    // Continue to Task Assignment (Step 4)
    await page.locator('button:has-text("Next")').click();
    await expect(page.locator('text=Task Assignment')).toBeVisible();
    
    // Continue to Review (Step 5)
    await page.locator('button:has-text("Next")').click();
    await expect(page.locator('text=Review & Save')).toBeVisible();
    
    // Save checklist
    await page.locator('button:has-text("Save Checklist")').click();
    
    // Should show success message or redirect
    await page.waitForTimeout(2000);
  });
});

test.describe('Room and Task Management', () => {
  test('should manage rooms and tasks in edit mode', async ({ page }) => {
    await page.goto('http://localhost:5175/template/2/edit');
    await page.waitForLoadState('networkidle');
    
    // Expand Kitchen room
    await page.locator('.v-expansion-panel:has-text("Kitchen")').click();
    
    // Count initial tasks
    const initialTasks = await page.locator('.v-expansion-panel:has-text("Kitchen") .v-list-item').count();
    
    // Add new task
    await page.fill('input[label*="Add task to Kitchen"]', 'Clean windows');
    await page.keyboard.press('Enter');
    
    // Verify task was added
    await expect(page.locator('.v-list-item:has-text("Clean windows")')).toBeVisible();
    const newTaskCount = await page.locator('.v-expansion-panel:has-text("Kitchen") .v-list-item').count();
    expect(newTaskCount).toBe(initialTasks + 1);
    
    // Remove a task
    await page.locator('.v-list-item:has-text("Clean windows") button:has(.mdi-delete)').click();
    
    // Verify task was removed
    await expect(page.locator('.v-list-item:has-text("Clean windows")')).not.toBeVisible();
  });
});

test.describe('Template Categories', () => {
  test('should show all categories and filter correctly', async ({ page }) => {
    await page.goto('http://localhost:5175/templates');
    
    // Check all category chips are visible
    const categories = ['All', 'Residential', 'Deep Clean', 'Commercial', 'Special'];
    
    for (const category of categories) {
      await expect(page.locator(`.v-chip:has-text("${category}")`)).toBeVisible();
    }
    
    // Test each category filter
    await page.locator('.v-chip:has-text("Residential")').click();
    let cards = await page.locator('.template-card').count();
    expect(cards).toBeGreaterThan(0);
    
    await page.locator('.v-chip:has-text("Commercial")').click();
    cards = await page.locator('.template-card').count();
    expect(cards).toBeGreaterThan(0);
    
    // Test "All" category shows all templates
    await page.locator('.v-chip:has-text("All")').click();
    cards = await page.locator('.template-card').count();
    expect(cards).toBe(6); // Total templates in sample data
  });
});

test.describe('Template Icon and Color Selection', () => {
  test('should change template icon and color', async ({ page }) => {
    await page.goto('http://localhost:5175/template/1/edit');
    await page.waitForLoadState('networkidle');
    
    // Open icon selector
    await page.locator('.v-select').nth(1).click(); // Icon selector is second select
    
    // Select a different icon
    await page.locator('.v-list-item:has-text("Office")').click();
    
    // Verify icon changed
    await expect(page.locator('.v-select').nth(1)).toContainText('Office');
    
    // Open color selector
    await page.locator('.v-select').nth(2).click(); // Color selector is third select
    
    // Select a different color
    await page.locator('.v-list-item:has-text("Blue")').click();
    
    // Verify color changed
    await expect(page.locator('.v-select').nth(2)).toContainText('Blue');
  });
});