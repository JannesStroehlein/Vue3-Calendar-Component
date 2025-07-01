import { test, expect } from '@playwright/test'

test.describe('Calendar Copilot E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to your test page
    await page.goto('/') // Adjust URL as needed
  })

  test('displays calendar in month view', async ({ page }) => {
    await expect(page.locator('.calendar-copilot')).toBeVisible()
    await expect(page.locator('.month-view')).toBeVisible()
  })

  test('switches between calendar views', async ({ page }) => {
    // Start in month view
    await expect(page.locator('.month-view')).toBeVisible()

    // Switch to week view
    await page.click('button:has-text("Week")')
    await expect(page.locator('.week-view')).toBeVisible()

    // Switch to day view
    await page.click('button:has-text("Day")')
    await expect(page.locator('.day-view')).toBeVisible()

    // Switch to agenda view
    await page.click('button:has-text("Agenda")')
    await expect(page.locator('.agenda-view')).toBeVisible()
  })

  test('navigates between months', async ({ page }) => {
    // Click next month button
    await page.click('[data-test="next-month"]')
    
    // Check that the month changed
    await expect(page.locator('.calendar-title')).not.toHaveText(/January 2025/)

    // Click previous month button
    await page.click('[data-test="prev-month"]')
    
    // Should go back to original month
    await expect(page.locator('.calendar-title')).toHaveText(/January 2025/)
  })

  test('displays events correctly', async ({ page }) => {
    // Assuming events are loaded
    await expect(page.locator('.month-event').first()).toBeVisible()
    await expect(page.locator('.month-event').first()).toContainText('Test Event')
  })

  test('opens event dialog on click', async ({ page }) => {
    // Click on an event
    await page.click('.month-event')
    
    // Event dialog should open
    await expect(page.locator('.v-dialog')).toBeVisible()
    await expect(page.locator('.v-dialog')).toContainText('Test Event')
    
    // Close dialog
    await page.click('button:has-text("Close")')
    await expect(page.locator('.v-dialog')).not.toBeVisible()
  })

  test('filters events by search', async ({ page }) => {
    // Open filters (if not already visible)
    if (await page.locator('.calendar-filters').isHidden()) {
      await page.click('[data-test="toggle-filters"]')
    }

    // Type in search box
    await page.fill('input[label="Search events"]', 'meeting')
    
    // Wait for filtering to take effect
    await page.waitForTimeout(500)
    
    // Only events with 'meeting' should be visible
    const visibleEvents = page.locator('.month-event')
    const count = await visibleEvents.count()
    
    for (let i = 0; i < count; i++) {
      const eventText = await visibleEvents.nth(i).textContent()
      expect(eventText?.toLowerCase()).toContain('meeting')
    }
  })

  test('drag and drop events', async ({ page }) => {
    // Get the first event
    const sourceEvent = page.locator('.month-event').first()
    const targetDay = page.locator('.month-day').nth(10) // Different day
    
    // Perform drag and drop
    await sourceEvent.dragTo(targetDay)
    
    // Verify event moved (this depends on your implementation)
    // You might need to check for specific UI feedback or data changes
  })

  test('shows no events message in agenda view', async ({ page }) => {
    // Switch to agenda view
    await page.click('button:has-text("Agenda")')
    
    // Navigate to a day without events
    await page.click('[data-test="next-month"]')
    await page.click('.month-day:has-text("15")')
    
    // Should show no events message
    await expect(page.locator('.no-events')).toBeVisible()
    await expect(page.locator('.no-events')).toContainText('No events scheduled')
  })

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Calendar should still be functional
    await expect(page.locator('.calendar-copilot')).toBeVisible()
    
    // Navigation should work
    await page.click('[data-test="next-month"]')
    await page.click('[data-test="prev-month"]')
    
    // View switching should work
    await page.click('button:has-text("Week")')
    await expect(page.locator('.week-view')).toBeVisible()
  })

  test('keyboard navigation works', async ({ page }) => {
    // Focus on calendar
    await page.focus('.calendar-copilot')
    
    // Use arrow keys to navigate (if implemented)
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowDown')
    
    // Enter key should select date (if implemented)
    await page.keyboard.press('Enter')
  })

  test('event status changes work', async ({ page }) => {
    // Click on an event to open dialog
    await page.click('.month-event')
    
    // Mark as completed
    await page.click('button:has-text("Mark Complete")')
    
    // Dialog should close and event should show as completed
    await expect(page.locator('.v-dialog')).not.toBeVisible()
    await expect(page.locator('.event-completed')).toBeVisible()
  })
})
