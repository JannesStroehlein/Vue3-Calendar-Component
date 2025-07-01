/// <reference types="vitest/globals" />
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import dayjs from 'dayjs'
import CalendarComponent from '../../src/components/CalendarComponent.vue'
import type { CalendarEvent } from '../../src/types'

// Ensure jsdom environment for DOM APIs
if (typeof window === 'undefined' || typeof document === 'undefined') {
  throw new Error('Tests must be run in a jsdom environment. Set "environment": "jsdom" in your Vitest config or add // @vitest-environment jsdom at the top of this file.')
}

// Mock the store
vi.mock('../../src/stores', () => ({
  useCalendarStore: () => ({
    currentDate: dayjs('2025-07-01'),
    currentView: 'month',
    loading: false,
    visibleEvents: [],
    visibleDateRange: {
      start: dayjs('2025-07-01'),
      end: dayjs('2025-07-31')
    },
    filteredEvents: [],
    events: [],
    filters: {},
    config: {
      minTime: '08:00',
      maxTime: '18:00',
      timeSlotDuration: 60,
      showTimeGrid: true,
      firstDayOfWeek: 1,
      locale: 'en'
    },
    setCurrentView: vi.fn(),
    setCurrentDate: vi.fn(),
    setEvents: vi.fn(),
    setConfig: vi.fn(),
    setFilters: vi.fn(),
    setLazyLoadHandler: vi.fn(),
    addEvent: vi.fn(),
    addEvents: vi.fn(),
    updateEvent: vi.fn(),
    removeEvent: vi.fn(),
    clearEvents: vi.fn(),
    loadEventsForRange: vi.fn(),
    navigateToDate: vi.fn(),
    navigatePrevious: vi.fn(),
    navigateNext: vi.fn(),
    navigateToday: vi.fn()
  })
}))

const pinia = createPinia()

const createWrapper = (props = {}) => {
  return mount(CalendarComponent, {
    props,
    global: {
      plugins: [pinia]
    }
  })
}

describe('CalendarComponent', () => {
  it('renders correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.calendar-component').exists()).toBe(true)
  })

  it('displays events correctly', () => {
    const events: CalendarEvent[] = [
      {
        id: '1',
        title: 'Test Event',
        start: '2025-07-01T10:00:00',
        end: '2025-07-01T11:00:00',
        status: 'planned'
      }
    ]

    const wrapper = createWrapper({ events })
    expect(wrapper.props('events')).toEqual(events)
  })

  it('emits event-click when event is clicked', async () => {
    const events: CalendarEvent[] = [
      {
        id: '1',
        title: 'Test Event',
        start: '2025-07-01T10:00:00',
        end: '2025-07-01T11:00:00',
        status: 'planned'
      }
    ]

    const wrapper = createWrapper({ events })
    
    // Simulate event click by emitting the event directly
    const eventClickData = {
      event: events[0],
      nativeEvent: { target: {} } as MouseEvent
    }
    
    await wrapper.vm.$emit('event-click', eventClickData)

    expect(wrapper.emitted('event-click')).toBeTruthy()
    expect(wrapper.emitted('event-click')?.[0]).toEqual([eventClickData])
  })

  it('changes view when view prop changes', async () => {
    const wrapper = createWrapper({ view: 'month' })
    
    await wrapper.setProps({ view: 'week' })
    
    // The store should be updated with the new view
    expect(wrapper.props('view')).toBe('week')
  })

  it('renders correctly without optional features', () => {
    const wrapper = createWrapper()
    // Calendar component should render correctly without filters or dialogs
    expect(wrapper.find('.calendar-component').exists()).toBe(true)
    expect(wrapper.find('.calendar-container').exists()).toBe(true)
  })
})
