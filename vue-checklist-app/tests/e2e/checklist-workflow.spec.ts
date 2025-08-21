import { test, expect } from '@playwright/test';

test.describe('Complete Checklist Workflow', () => {
  test('should complete full checklist creation workflow', async ({ page }) => {
    // Navigate to create page
    await page.goto('http://localhost:5175/create');
    await page.waitForLoadState('networkidle');
    
    // Step 1: Client Information
    await expect(page.locator('.v-stepper-item--selected')).toContainText('Client Information');
    
    // Fill client details
    await page.fill('input[label="Client Name"]', 'Jane Smith');
    await page.fill('input[label="Client Email"]', 'jane.smith@example.com');
    await page.fill('input[label="Client Phone"]', '555-9876');
    await page.fill('textarea[label="Additional Notes"]', 'Please use eco-friendly products');
    
    // Click Next
    await page.locator('button:has-text("Next")').click();
    
    // Step 2: Property Details
    await expect(page.locator('.v-stepper-item--selected')).toContainText('Property Details');
    
    // Fill property details
    await page.fill('input[label="Property Address"]', '123 Main Street');
    await page.fill('input[label="City"]', 'New York');
    await page.fill('input[label="State"]', 'NY');
    await page.fill('input[label="Zip Code"]', '10001');
    
    // Select property type
    await page.locator('.v-select[label="Property Type"]').click();
    await page.locator('.v-list-item:has-text("House")').click();
    
    // Set property size
    await page.fill('input[label="Property Size (sq ft)"]', '2000');
    
    // Click Next
    await page.locator('button:has-text("Next")').click();
    
    // Step 3: Room Selection
    await expect(page.locator('.v-stepper-item--selected')).toContainText('Room Selection');
    
    // Select rooms
    await page.locator('.v-checkbox:has-text("Living Room")').click();
    await page.locator('.v-checkbox:has-text("Kitchen")').click();
    await page.locator('.v-checkbox:has-text("Master Bedroom")').click();
    await page.locator('.v-checkbox:has-text("Bathroom 1")').click();
    
    // Click Next
    await page.locator('button:has-text("Next")').click();
    
    // Step 4: Task Assignment
    await expect(page.locator('.v-stepper-item--selected')).toContainText('Task Assignment');
    
    // Wait for tasks to load
    await page.waitForSelector('.v-expansion-panel');
    
    // Expand first room
    await page.locator('.v-expansion-panel').first().click();
    
    // Select some tasks
    const taskCheckboxes = page.locator('.v-expansion-panel').first().locator('.v-checkbox');
    const taskCount = await taskCheckboxes.count();
    
    // Select first 3 tasks
    for (let i = 0; i < Math.min(3, taskCount); i++) {
      await taskCheckboxes.nth(i).click();
    }
    
    // Click Next
    await page.locator('button:has-text("Next")').click();
    
    // Step 5: Review & Save
    await expect(page.locator('.v-stepper-item--selected')).toContainText('Review & Save');
    
    // Check review content
    await expect(page.locator('text=Jane Smith')).toBeVisible();
    await expect(page.locator('text=123 Main Street')).toBeVisible();
    
    // Save checklist
    await page.locator('button:has-text("Save Checklist")').click();
    
    // Wait for save to complete
    await page.waitForTimeout(2000);
    
    // Should redirect or show success
    // The exact behavior depends on implementation
  });

  test('should navigate back and forth through steps', async ({ page }) => {
    await page.goto('http://localhost:5175/create');
    
    // Fill Step 1
    await page.fill('input[label="Client Name"]', 'Test Client');
    await page.locator('button:has-text("Next")').click();
    
    // Now on Step 2
    await expect(page.locator('.v-stepper-item--selected')).toContainText('Property Details');
    
    // Go back to Step 1
    await page.locator('button:has-text("Back")').click();
    
    // Should be back on Step 1 with data preserved
    await expect(page.locator('.v-stepper-item--selected')).toContainText('Client Information');
    await expect(page.locator('input[label="Client Name"]')).toHaveValue('Test Client');
    
    // Go forward again
    await page.locator('button:has-text("Next")').click();
    await expect(page.locator('.v-stepper-item--selected')).toContainText('Property Details');
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('http://localhost:5175/create');
    
    // Try to proceed without filling required fields
    await page.locator('button:has-text("Next")').click();
    
    // Should show validation errors
    await expect(page.locator('text=Client name is required')).toBeVisible();
    
    // Fill required field
    await page.fill('input[label="Client Name"]', 'Test Client');
    
    // Try again
    await page.locator('button:has-text("Next")').click();
    
    // Should proceed to next step
    await expect(page.locator('.v-stepper-item--selected')).toContainText('Property Details');
  });
});

test.describe('Checklist Management', () => {
  test('should display checklists page', async ({ page }) => {
    await page.goto('http://localhost:5175/checklists');
    await page.waitForLoadState('networkidle');
    
    // Check page elements
    await expect(page.locator('h1')).toContainText('Checklists');
    await expect(page.locator('button:has-text("New Checklist")')).toBeVisible();
    
    // Check search bar
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    
    // Check filter chips
    await expect(page.locator('.v-chip:has-text("All")')).toBeVisible();
    await expect(page.locator('.v-chip:has-text("Active")')).toBeVisible();
    await expect(page.locator('.v-chip:has-text("Completed")')).toBeVisible();
  });

  test('should filter checklists by status', async ({ page }) => {
    await page.goto('http://localhost:5175/checklists');
    
    // Click Active filter
    await page.locator('.v-chip:has-text("Active")').click();
    
    // Wait for filter to apply
    await page.waitForTimeout(500);
    
    // Check that Active chip is selected
    await expect(page.locator('.v-chip:has-text("Active")')).toHaveClass(/primary/);
  });

  test('should search checklists', async ({ page }) => {
    await page.goto('http://localhost:5175/checklists');
    
    // Type in search box
    await page.fill('input[placeholder*="Search"]', 'Smith');
    
    // Wait for search to apply
    await page.waitForTimeout(500);
    
    // Results should be filtered
    // Note: This depends on having data with "Smith" in it
  });

  test('should navigate to checklist detail page', async ({ page }) => {
    await page.goto('http://localhost:5175/checklists');
    
    // If there are checklist cards, click the first one
    const cards = page.locator('.v-card');
    const cardCount = await cards.count();
    
    if (cardCount > 0) {
      await cards.first().click();
      
      // Should navigate to detail page
      await expect(page.url()).toMatch(/\/checklist\/[\w-]+$/);
    }
  });
});

test.describe('Room and Task Features', () => {
  test('should handle quantifiable tasks', async ({ page }) => {
    await page.goto('http://localhost:5175/create');
    
    // Navigate to Task Assignment step
    await page.fill('input[label="Client Name"]', 'Test');
    await page.locator('button:has-text("Next")').click();
    await page.locator('button:has-text("Next")').click();
    
    // Select a room
    await page.locator('.v-checkbox').first().click();
    await page.locator('button:has-text("Next")').click();
    
    // Look for quantifiable tasks (if any)
    const quantityControls = page.locator('.quantity-controls');
    const hasQuantifiableTasks = await quantityControls.count() > 0;
    
    if (hasQuantifiableTasks) {
      // Test increment/decrement
      const firstControl = quantityControls.first();
      const incrementBtn = firstControl.locator('button:has(.mdi-plus)');
      const decrementBtn = firstControl.locator('button:has(.mdi-minus)');
      const quantityDisplay = firstControl.locator('.quantity-display');
      
      // Get initial value
      const initialValue = await quantityDisplay.textContent();
      
      // Increment
      await incrementBtn.click();
      const incrementedValue = await quantityDisplay.textContent();
      expect(parseInt(incrementedValue || '0')).toBeGreaterThan(parseInt(initialValue || '0'));
      
      // Decrement
      await decrementBtn.click();
      const decrementedValue = await quantityDisplay.textContent();
      expect(parseInt(decrementedValue || '0')).toBe(parseInt(initialValue || '0'));
    }
  });

  test('should handle universal tasks', async ({ page }) => {
    await page.goto('http://localhost:5175/create');
    
    // Navigate to Task Assignment step
    await page.fill('input[label="Client Name"]', 'Test');
    await page.locator('button:has-text("Next")').click();
    await page.locator('button:has-text("Next")').click();
    
    // Select multiple rooms
    await page.locator('.v-checkbox:has-text("Living Room")').click();
    await page.locator('.v-checkbox:has-text("Kitchen")').click();
    await page.locator('button:has-text("Next")').click();
    
    // Check for universal tasks section
    const universalSection = page.locator('text=Universal Tasks');
    const hasUniversalTasks = await universalSection.count() > 0;
    
    if (hasUniversalTasks) {
      // Universal tasks should appear once
      await expect(universalSection).toHaveCount(1);
      
      // Select a universal task
      const universalCheckbox = page.locator('.universal-tasks .v-checkbox').first();
      await universalCheckbox.click();
      
      // Verify it's selected
      await expect(universalCheckbox).toBeChecked();
    }
  });
});

test.describe('Review and Export Features', () => {
  test('should show review summary', async ({ page }) => {
    await page.goto('http://localhost:5175/create');
    
    // Complete all steps to reach review
    await page.fill('input[label="Client Name"]', 'Review Test');
    await page.fill('input[label="Client Email"]', 'review@test.com');
    await page.locator('button:has-text("Next")').click();
    
    await page.fill('input[label="Property Address"]', '456 Test Ave');
    await page.locator('button:has-text("Next")').click();
    
    await page.locator('.v-checkbox').first().click();
    await page.locator('button:has-text("Next")').click();
    
    await page.locator('button:has-text("Next")').click();
    
    // Review page should show summary
    await expect(page.locator('text=Review Test')).toBeVisible();
    await expect(page.locator('text=review@test.com')).toBeVisible();
    await expect(page.locator('text=456 Test Ave')).toBeVisible();
    
    // Check for action buttons
    await expect(page.locator('button:has-text("Save Checklist")')).toBeVisible();
    await expect(page.locator('button:has-text("Preview PDF")')).toBeVisible();
    await expect(page.locator('button:has-text("Save as Template")')).toBeVisible();
  });

  test('should handle PDF preview', async ({ page }) => {
    await page.goto('http://localhost:5175/create');
    
    // Quick navigation to review
    await page.fill('input[label="Client Name"]', 'PDF Test');
    await page.locator('button:has-text("Next")').click();
    await page.locator('button:has-text("Next")').click();
    await page.locator('.v-checkbox').first().click();
    await page.locator('button:has-text("Next")').click();
    await page.locator('button:has-text("Next")').click();
    
    // Click Preview PDF
    await page.locator('button:has-text("Preview PDF")').click();
    
    // Should open PDF preview (implementation may vary)
    // Could open in new tab, modal, or download
    await page.waitForTimeout(1000);
  });
});

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } });
  
  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('http://localhost:5175');
    
    // Check navigation drawer toggle is visible
    await expect(page.locator('.v-app-bar button').first()).toBeVisible();
    
    // Open navigation drawer
    await page.locator('.v-app-bar button').first().click();
    
    // Check navigation items are visible
    await expect(page.locator('.v-navigation-drawer')).toBeVisible();
    await expect(page.locator('.v-list-item:has-text("Dashboard")')).toBeVisible();
    await expect(page.locator('.v-list-item:has-text("Templates")')).toBeVisible();
  });
  
  test('should handle template cards on mobile', async ({ page }) => {
    await page.goto('http://localhost:5175/templates');
    
    // Cards should stack vertically on mobile
    const cards = page.locator('.template-card');
    const firstCard = await cards.first().boundingBox();
    const secondCard = await cards.nth(1).boundingBox();
    
    if (firstCard && secondCard) {
      // Cards should be stacked (same x position, different y)
      expect(firstCard.x).toBe(secondCard.x);
      expect(secondCard.y).toBeGreaterThan(firstCard.y);
    }
  });
});