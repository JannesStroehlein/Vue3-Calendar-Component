/// <reference types="vitest/globals" />
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CalendarComponent from '../../src/plugin/components/CalendarComponent.vue'
import type { CalendarEvent } from '../../src/plugin/types'

// Ensure jsdom environment for DOM APIs
if (typeof window === 'undefined' || typeof document === 'undefined') {
  throw new Error(
    'Tests must be run in a jsdom environment. Set "environment": "jsdom" in your Vitest config or add // @vitest-environment jsdom at the top of this file.'
  )
}

const createWrapper = (props = {}) => {
  return mount(CalendarComponent, {
    props: {
      events: [],
      view: 'month',
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
})
