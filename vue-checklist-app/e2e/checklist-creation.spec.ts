import { test, expect } from '@playwright/test'

test.describe('Checklist Creation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should create a new residential checklist', async ({ page }) => {
    // Navigate to create page
    await page.click('[data-testid="create-checklist-btn"]')
    await expect(page).toHaveURL('/create')
    
    // Step 1: Property Details
    await expect(page.locator('h2')).toContainText('Property Details')
    await page.fill('[data-testid="property-size"]', '2000')
    await page.selectOption('[data-testid="property-type"]', 'residential')
    await page.selectOption('[data-testid="cleaning-frequency"]', 'weekly')
    await page.click('[data-testid="next-step-btn"]')
    
    // Step 2: Room Selection
    await expect(page.locator('h2')).toContainText('Room Selection')
    await page.check('[data-testid="room-kitchen"]')
    await page.check('[data-testid="room-master-bedroom"]')
    await page.check('[data-testid="room-bathroom-1"]')
    await page.click('[data-testid="next-step-btn"]')
    
    // Step 3: Task Selection
    await expect(page.locator('h2')).toContainText('Task Selection')
    // Should have tasks auto-selected based on rooms
    const tasks = await page.locator('[data-testid^="task-"]').count()
    expect(tasks).toBeGreaterThan(0)
    await page.click('[data-testid="next-step-btn"]')
    
    // Step 4: Client Information
    await expect(page.locator('h2')).toContainText('Client Information')
    await page.fill('[data-testid="client-name"]', 'John Doe')
    await page.fill('[data-testid="client-address"]', '123 Main St')
    await page.fill('[data-testid="client-phone"]', '555-1234')
    await page.fill('[data-testid="client-email"]', 'john@example.com')
    await page.click('[data-testid="next-step-btn"]')
    
    // Step 5: Review
    await expect(page.locator('h2')).toContainText('Review')
    await expect(page.locator('[data-testid="review-client-name"]')).toContainText('John Doe')
    await expect(page.locator('[data-testid="review-property-type"]')).toContainText('Residential')
    
    // Create checklist
    await page.click('[data-testid="create-checklist-submit"]')
    
    // Should redirect to checklists page
    await expect(page).toHaveURL('/checklists')
    
    // New checklist should be visible
    await expect(page.locator('[data-testid="checklist-card"]').first()).toContainText('John Doe')
  })

  test('should validate required fields', async ({ page }) => {
    await page.click('[data-testid="create-checklist-btn"]')
    
    // Try to proceed without filling required fields
    await page.click('[data-testid="next-step-btn"]')
    
    // Should show validation errors
    await expect(page.locator('[data-testid="property-size-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="property-size-error"]')).toContainText('required')
  })

  test('should save draft and restore on refresh', async ({ page }) => {
    await page.click('[data-testid="create-checklist-btn"]')
    
    // Fill some data
    await page.fill('[data-testid="property-size"]', '1500')
    await page.selectOption('[data-testid="property-type"]', 'office')
    
    // Refresh page
    await page.reload()
    
    // Data should be restored
    await expect(page.locator('[data-testid="property-size"]')).toHaveValue('1500')
    await expect(page.locator('[data-testid="property-type"]')).toHaveValue('office')
  })

  test('should handle network errors gracefully', async ({ page, context }) => {
    // Simulate offline mode
    await context.setOffline(true)
    
    await page.click('[data-testid="create-checklist-btn"]')
    
    // Fill out form
    await page.fill('[data-testid="property-size"]', '2000')
    await page.click('[data-testid="next-step-btn"]')
    
    // Should show offline notification
    await expect(page.locator('[data-testid="offline-notification"]')).toBeVisible()
    
    // Go back online
    await context.setOffline(false)
    
    // Should hide offline notification
    await expect(page.locator('[data-testid="offline-notification"]')).not.toBeVisible()
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.click('[data-testid="create-checklist-btn"]')
    
    // Tab through form fields
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="property-size"]')).toBeFocused()
    
    await page.keyboard.type('2500')
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="property-type"]')).toBeFocused()
    
    // Use arrow keys to select option
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    
    // Use Enter to submit
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    
    // Should move to next step
    await expect(page.locator('h2')).toContainText('Room Selection')
  })
})