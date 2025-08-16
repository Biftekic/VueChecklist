import { test, expect } from '@playwright/test'

test.describe('Checklist Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/checklists')
    await page.waitForLoadState('networkidle')
  })

  test('should display list of checklists', async ({ page }) => {
    // Should show checklists page
    await expect(page.locator('h1')).toContainText('Checklists')
    
    // Should have at least one checklist (if any exist)
    const checklistCards = page.locator('[data-testid="checklist-card"]')
    const count = await checklistCards.count()
    
    if (count > 0) {
      // Verify checklist card structure
      const firstCard = checklistCards.first()
      await expect(firstCard.locator('[data-testid="checklist-client-name"]')).toBeVisible()
      await expect(firstCard.locator('[data-testid="checklist-date"]')).toBeVisible()
      await expect(firstCard.locator('[data-testid="checklist-status"]')).toBeVisible()
    }
  })

  test('should search and filter checklists', async ({ page }) => {
    // Search functionality
    await page.fill('[data-testid="search-input"]', 'John')
    await page.waitForTimeout(500) // Wait for debounce
    
    // Only matching checklists should be visible
    const visibleCards = await page.locator('[data-testid="checklist-card"]:visible').count()
    const allCards = await page.locator('[data-testid="checklist-card"]').count()
    
    if (allCards > 0) {
      expect(visibleCards).toBeLessThanOrEqual(allCards)
    }
    
    // Clear search
    await page.fill('[data-testid="search-input"]', '')
    await page.waitForTimeout(500)
    
    // Filter by status
    await page.selectOption('[data-testid="status-filter"]', 'completed')
    const completedCards = await page.locator('[data-testid="checklist-status"]:has-text("Completed")').count()
    const visibleAfterFilter = await page.locator('[data-testid="checklist-card"]:visible').count()
    
    if (completedCards > 0) {
      expect(visibleAfterFilter).toBe(completedCards)
    }
  })

  test('should open checklist details', async ({ page }) => {
    const checklistCards = page.locator('[data-testid="checklist-card"]')
    const count = await checklistCards.count()
    
    if (count > 0) {
      // Click first checklist
      await checklistCards.first().click()
      
      // Should navigate to detail page
      await expect(page).toHaveURL(/\/checklists\/[\w-]+/)
      
      // Should show checklist details
      await expect(page.locator('[data-testid="checklist-detail-header"]')).toBeVisible()
      await expect(page.locator('[data-testid="task-list"]')).toBeVisible()
    }
  })

  test('should edit checklist', async ({ page }) => {
    const checklistCards = page.locator('[data-testid="checklist-card"]')
    const count = await checklistCards.count()
    
    if (count > 0) {
      // Click edit button on first checklist
      await checklistCards.first().locator('[data-testid="edit-checklist-btn"]').click()
      
      // Should navigate to edit page
      await expect(page).toHaveURL(/\/checklists\/[\w-]+\/edit/)
      
      // Edit client name
      await page.fill('[data-testid="client-name"]', 'Jane Smith')
      
      // Save changes
      await page.click('[data-testid="save-checklist-btn"]')
      
      // Should redirect back to checklists
      await expect(page).toHaveURL('/checklists')
      
      // Updated name should be visible
      await expect(page.locator('[data-testid="checklist-card"]').first()).toContainText('Jane Smith')
    }
  })

  test('should delete checklist with confirmation', async ({ page }) => {
    const checklistCards = page.locator('[data-testid="checklist-card"]')
    const initialCount = await checklistCards.count()
    
    if (initialCount > 0) {
      // Click delete button on first checklist
      await checklistCards.first().locator('[data-testid="delete-checklist-btn"]').click()
      
      // Confirmation dialog should appear
      await expect(page.locator('[data-testid="delete-confirmation-dialog"]')).toBeVisible()
      await expect(page.locator('[data-testid="delete-confirmation-text"]')).toContainText('Are you sure')
      
      // Cancel deletion
      await page.click('[data-testid="cancel-delete-btn"]')
      await expect(page.locator('[data-testid="delete-confirmation-dialog"]')).not.toBeVisible()
      
      // Count should remain the same
      expect(await checklistCards.count()).toBe(initialCount)
      
      // Try delete again and confirm
      await checklistCards.first().locator('[data-testid="delete-checklist-btn"]').click()
      await page.click('[data-testid="confirm-delete-btn"]')
      
      // Should show success notification
      await expect(page.locator('[data-testid="notification"]')).toContainText('deleted')
      
      // Count should decrease
      await page.waitForTimeout(500)
      expect(await checklistCards.count()).toBe(initialCount - 1)
    }
  })

  test('should export checklist as PDF', async ({ page }) => {
    const checklistCards = page.locator('[data-testid="checklist-card"]')
    const count = await checklistCards.count()
    
    if (count > 0) {
      // Open first checklist
      await checklistCards.first().click()
      
      // Click export button
      const downloadPromise = page.waitForEvent('download')
      await page.click('[data-testid="export-pdf-btn"]')
      
      const download = await downloadPromise
      
      // Verify download
      expect(download.suggestedFilename()).toMatch(/checklist.*\.pdf/)
    }
  })

  test('should handle bulk operations', async ({ page }) => {
    const checklistCards = page.locator('[data-testid="checklist-card"]')
    const count = await checklistCards.count()
    
    if (count >= 2) {
      // Enter selection mode
      await page.click('[data-testid="bulk-select-btn"]')
      
      // Select first two checklists
      await page.check('[data-testid="checklist-checkbox-0"]')
      await page.check('[data-testid="checklist-checkbox-1"]')
      
      // Bulk actions should be visible
      await expect(page.locator('[data-testid="bulk-actions"]')).toBeVisible()
      await expect(page.locator('[data-testid="selected-count"]')).toContainText('2 selected')
      
      // Perform bulk export
      await page.click('[data-testid="bulk-export-btn"]')
      
      // Should show success notification
      await expect(page.locator('[data-testid="notification"]')).toContainText('Exported 2 checklists')
    }
  })
})