import { test, expect } from '@playwright/test'

test.describe('Task Completion Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a checklist detail page
    await page.goto('/checklists')
    await page.waitForLoadState('networkidle')
    
    // Open first checklist if available
    const checklistCards = page.locator('[data-testid="checklist-card"]')
    const count = await checklistCards.count()
    
    if (count > 0) {
      await checklistCards.first().click()
      await page.waitForLoadState('networkidle')
    }
  })

  test('should complete individual tasks', async ({ page }) => {
    const tasks = page.locator('[data-testid^="task-item-"]')
    const taskCount = await tasks.count()
    
    if (taskCount > 0) {
      // Get initial completed count
      const initialCompleted = await page.locator('[data-testid="completed-count"]').textContent()
      
      // Complete first task
      const firstTask = tasks.first()
      await firstTask.locator('[data-testid="task-checkbox"]').check()
      
      // Task should be marked as completed
      await expect(firstTask).toHaveClass(/completed/)
      
      // Completed count should increase
      const newCompleted = await page.locator('[data-testid="completed-count"]').textContent()
      expect(parseInt(newCompleted || '0')).toBeGreaterThan(parseInt(initialCompleted || '0'))
      
      // Progress bar should update
      const progress = await page.locator('[data-testid="progress-bar"]').getAttribute('aria-valuenow')
      expect(parseInt(progress || '0')).toBeGreaterThan(0)
    }
  })

  test('should add notes to tasks', async ({ page }) => {
    const tasks = page.locator('[data-testid^="task-item-"]')
    const taskCount = await tasks.count()
    
    if (taskCount > 0) {
      const firstTask = tasks.first()
      
      // Open task details
      await firstTask.locator('[data-testid="task-expand-btn"]').click()
      
      // Add note
      await firstTask.locator('[data-testid="task-note-input"]').fill('This area needs extra attention')
      await firstTask.locator('[data-testid="save-note-btn"]').click()
      
      // Note should be saved and visible
      await expect(firstTask.locator('[data-testid="task-note-display"]')).toContainText('extra attention')
      
      // Note indicator should appear
      await expect(firstTask.locator('[data-testid="has-note-indicator"]')).toBeVisible()
    }
  })

  test('should track time for tasks', async ({ page }) => {
    const tasks = page.locator('[data-testid^="task-item-"]')
    const taskCount = await tasks.count()
    
    if (taskCount > 0) {
      const firstTask = tasks.first()
      
      // Start timer
      await firstTask.locator('[data-testid="start-timer-btn"]').click()
      
      // Timer should be running
      await expect(firstTask.locator('[data-testid="timer-display"]')).toBeVisible()
      await expect(firstTask.locator('[data-testid="timer-display"]')).toContainText('00:0')
      
      // Wait a bit
      await page.waitForTimeout(2000)
      
      // Stop timer
      await firstTask.locator('[data-testid="stop-timer-btn"]').click()
      
      // Time should be recorded
      await expect(firstTask.locator('[data-testid="task-time"]')).toBeVisible()
      await expect(firstTask.locator('[data-testid="task-time"]')).not.toContainText('00:00')
    }
  })

  test('should handle task priority updates', async ({ page }) => {
    const tasks = page.locator('[data-testid^="task-item-"]')
    const taskCount = await tasks.count()
    
    if (taskCount > 0) {
      const firstTask = tasks.first()
      
      // Open task options
      await firstTask.locator('[data-testid="task-options-btn"]').click()
      
      // Set high priority
      await page.click('[data-testid="set-priority-high"]')
      
      // Task should show high priority indicator
      await expect(firstTask.locator('[data-testid="priority-indicator"]')).toHaveClass(/high-priority/)
      await expect(firstTask.locator('[data-testid="priority-indicator"]')).toContainText('High')
      
      // Task should move to top of list (if sorting by priority)
      await page.selectOption('[data-testid="sort-tasks"]', 'priority')
      await page.waitForTimeout(500)
      
      const firstTaskAfterSort = page.locator('[data-testid^="task-item-"]').first()
      await expect(firstTaskAfterSort.locator('[data-testid="priority-indicator"]')).toContainText('High')
    }
  })

  test('should complete all tasks in a room', async ({ page }) => {
    const rooms = page.locator('[data-testid^="room-section-"]')
    const roomCount = await rooms.count()
    
    if (roomCount > 0) {
      const firstRoom = rooms.first()
      
      // Click complete all for room
      await firstRoom.locator('[data-testid="complete-all-room-tasks"]').click()
      
      // All tasks in room should be completed
      const roomTasks = firstRoom.locator('[data-testid^="task-item-"]')
      const taskCount = await roomTasks.count()
      
      for (let i = 0; i < taskCount; i++) {
        await expect(roomTasks.nth(i).locator('[data-testid="task-checkbox"]')).toBeChecked()
      }
      
      // Room should show as completed
      await expect(firstRoom.locator('[data-testid="room-status"]')).toContainText('Completed')
    }
  })

  test('should validate required tasks before completion', async ({ page }) => {
    // Try to complete checklist without required tasks
    await page.click('[data-testid="complete-checklist-btn"]')
    
    // Should show validation message
    await expect(page.locator('[data-testid="validation-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="validation-message"]')).toContainText('required tasks')
    
    // Complete required tasks
    const requiredTasks = page.locator('[data-testid^="task-item-"][data-required="true"]')
    const requiredCount = await requiredTasks.count()
    
    for (let i = 0; i < requiredCount; i++) {
      await requiredTasks.nth(i).locator('[data-testid="task-checkbox"]').check()
    }
    
    // Try to complete again
    await page.click('[data-testid="complete-checklist-btn"]')
    
    // Should proceed to completion
    await expect(page.locator('[data-testid="completion-dialog"]')).toBeVisible()
    await expect(page.locator('[data-testid="completion-summary"]')).toBeVisible()
  })

  test('should generate completion report', async ({ page }) => {
    // Complete some tasks
    const tasks = page.locator('[data-testid^="task-item-"]')
    const taskCount = Math.min(await tasks.count(), 3)
    
    for (let i = 0; i < taskCount; i++) {
      await tasks.nth(i).locator('[data-testid="task-checkbox"]').check()
    }
    
    // Generate report
    await page.click('[data-testid="generate-report-btn"]')
    
    // Report dialog should open
    await expect(page.locator('[data-testid="report-dialog"]')).toBeVisible()
    
    // Report should show summary
    await expect(page.locator('[data-testid="report-completed-tasks"]')).toContainText(taskCount.toString())
    await expect(page.locator('[data-testid="report-completion-rate"]')).toBeVisible()
    
    // Export report
    const downloadPromise = page.waitForEvent('download')
    await page.click('[data-testid="export-report-btn"]')
    
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/report.*\.(pdf|csv)/)
  })
})