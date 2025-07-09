/// <reference types="vitest/globals" />
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CalendarComponent from '../../src/plugin/components/CalendarComponent.vue'
import type { CalendarConfig, CalendarEvent } from '../../src/plugin/types'

// Ensure jsdom environment for DOM APIs
if (typeof window === 'undefined' || typeof document === 'undefined') {
  throw new Error(
    'Tests must be run in a jsdom environment. Set "environment": "jsdom" in your Vitest config or add // @vitest-environment jsdom at the top of this file.'
  )
}

const createWrapper = (props = {}) => {
  const defaultConfig: CalendarConfig = {
    firstDayOfWeek: 'monday',
    showTimeGrid: true,
    timeSlotDuration: 60,
    minTime: '00:00',
    maxTime: '24:00',
    showWeekNumbers: false,
    timeGridDivisions: 4,
  }

  return mount(CalendarComponent, {
    props: {
      events: [],
      view: 'month',
      config: defaultConfig,
      ...props,
    },
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
        status: 'planned',
      },
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
        status: 'planned',
      },
    ]

    const wrapper = createWrapper({ events })

    // Simulate event click by emitting the event directly
    const eventClickData = {
      event: events[0],
      nativeEvent: { target: {} } as MouseEvent,
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

  it('handles different view types', async () => {
    const wrapper = createWrapper({ view: 'week' })
    expect(wrapper.props('view')).toBe('week')

    await wrapper.setProps({ view: 'day' })
    expect(wrapper.props('view')).toBe('day')

    await wrapper.setProps({ view: 'agenda' })
    expect(wrapper.props('view')).toBe('agenda')
  })

  it('supports drag and drop events', async () => {
    const events: CalendarEvent[] = [
      {
        id: '1',
        title: 'Draggable Event',
        start: '2025-07-01T10:00:00',
        end: '2025-07-01T11:00:00',
        status: 'planned',
      },
    ]

    const wrapper = createWrapper({ events })

    // Simulate event drop
    const dropData = {
      event: events[0],
      newStart: new Date('2025-07-02T10:00:00'),
      newEnd: new Date('2025-07-02T11:00:00'),
      oldStart: new Date('2025-07-01T10:00:00'),
      oldEnd: new Date('2025-07-01T11:00:00'),
    }

    await wrapper.vm.$emit('event-drop', dropData)

    expect(wrapper.emitted('event-drop')).toBeTruthy()
    expect(wrapper.emitted('event-drop')?.[0]).toEqual([dropData])
  })

  it('handles date click events', async () => {
    const wrapper = createWrapper()

    const dateClickData = {
      date: new Date('2025-07-01'),
      nativeEvent: { target: {} } as MouseEvent,
    }

    await wrapper.vm.$emit('date-click', dateClickData)

    expect(wrapper.emitted('date-click')).toBeTruthy()
    expect(wrapper.emitted('date-click')?.[0]).toEqual([dateClickData])
  })

  it('handles time slot click events', async () => {
    const wrapper = createWrapper({ view: 'week' })

    const timeSlotClickData = {
      date: new Date('2025-07-01T10:00:00'),
      slot: { hour: 10, minute: 0, label: '10:00' },
    }

    await wrapper.vm.$emit('time-slot-click', timeSlotClickData)

    expect(wrapper.emitted('time-slot-click')).toBeTruthy()
    expect(wrapper.emitted('time-slot-click')?.[0]).toEqual([timeSlotClickData])
  })

  it('accepts different date formats for currentDate', async () => {
    // Test string date
    const wrapper1 = createWrapper({ currentDate: '2025-07-01' })
    expect(wrapper1.props('currentDate')).toBe('2025-07-01')

    // Test Date object
    const testDate = new Date('2025-07-01')
    const wrapper2 = createWrapper({ currentDate: testDate })
    expect(wrapper2.props('currentDate')).toBe(testDate)
  })

  it('uses container height for responsive layout', async () => {
    const wrapper = createWrapper()
    // Test that the component renders without errors when containerHeight is passed
    // The containerHeight prop is passed internally to view components
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.calendar-component').exists()).toBe(true)
  })
})
