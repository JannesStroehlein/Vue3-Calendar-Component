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
  AgendaView: true,
  // Stub Vuetify components to avoid CSS import issues
  VIcon: true,
  VBtn: true,
  VCard: true,
  VCardTitle: true,
  VCardText: true,
  VCardActions: true,
  VDialog: true,
  VChip: true
}

// Mock CSS imports
vi.mock('*.css', () => ({}))
vi.mock('*.scss', () => ({}))

// Mock Vuetify components to prevent CSS loading issues
vi.mock('vuetify/components', () => ({
  VIcon: { name: 'VIcon', template: '<div class="v-icon-mock"><slot /></div>' },
  VBtn: { name: 'VBtn', template: '<button class="v-btn-mock"><slot /></button>' },
  VCard: { name: 'VCard', template: '<div class="v-card-mock"><slot /></div>' },
  VCardTitle: { name: 'VCardTitle', template: '<div class="v-card-title-mock"><slot /></div>' },
  VCardText: { name: 'VCardText', template: '<div class="v-card-text-mock"><slot /></div>' },
  VCardActions: { name: 'VCardActions', template: '<div class="v-card-actions-mock"><slot /></div>' },
  VDialog: { name: 'VDialog', template: '<div class="v-dialog-mock"><slot /></div>' },
  VChip: { name: 'VChip', template: '<div class="v-chip-mock"><slot /></div>' }
}))

vi.mock('vuetify/components/VIcon', () => ({
  VIcon: { name: 'VIcon', template: '<div class="v-icon-mock"><slot /></div>' }
}))

vi.mock('vuetify/components/VBtn', () => ({
  VBtn: { name: 'VBtn', template: '<button class="v-btn-mock"><slot /></button>' }
}))
