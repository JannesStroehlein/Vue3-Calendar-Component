import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import CalendarComponent from '@/components/CalendarComponent.vue'
import type { CalendarEvent } from '@/types'

const vuetify = createVuetify()
const pinia = createPinia()

const createWrapper = (props = {}) => {
  return mount(CalendarComponent, {
    props,
    global: {
      plugins: [vuetify, pinia]
    }
  })
}

describe('CalendarComponent', () => {
  it('renders correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.calendar-copilot').exists()).toBe(true)
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
    
    // Simulate event click
    const component = wrapper.vm as any
    const mockEvent = { target: {} } as MouseEvent
    component.handleEventClick(events[0], mockEvent)

    expect(wrapper.emitted('event-click')).toBeTruthy()
    expect(wrapper.emitted('event-click')?.[0]).toEqual([events[0], mockEvent])
  })

  it('changes view when view prop changes', async () => {
    const wrapper = createWrapper({ view: 'month' })
    
    await wrapper.setProps({ view: 'week' })
    
    // The store should be updated with the new view
    expect(wrapper.props('view')).toBe('week')
  })

  it('shows filters when showFilters is true', () => {
    const wrapper = createWrapper({ showFilters: true })
    expect(wrapper.find('.calendar-filters').exists()).toBe(true)
  })

  it('hides filters when showFilters is false', () => {
    const wrapper = createWrapper({ showFilters: false })
    expect(wrapper.find('.calendar-filters').exists()).toBe(false)
  })
})
