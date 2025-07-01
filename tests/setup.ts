import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock dayjs - use actual dayjs but mock the extend method
vi.mock('dayjs', async () => {
  const actual = await vi.importActual('dayjs') as any
  const actualDayjs = actual.default
  
  // Create a wrapper that preserves all dayjs functionality
  const mockDayjs = (...args: any[]) => actualDayjs(...args)
  
  // Copy all static methods and properties from actual dayjs
  Object.setPrototypeOf(mockDayjs, actualDayjs)
  Object.assign(mockDayjs, actualDayjs)
  
  // Mock the extend method to prevent plugin loading issues in tests
  mockDayjs.extend = vi.fn()
  
  return {
    default: mockDayjs,
    ...actual
  }
})

// Configure Vue Test Utils to stub complex components
config.global.stubs = {
  CalendarToolbar: true,
  MonthView: true,
  WeekView: true,
  DayView: true,
  AgendaView: true
}
