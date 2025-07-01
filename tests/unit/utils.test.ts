import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import {
  normalizeEvent,
  getEventsInRange,
  formatEventTime,
  getEventColor,
  isToday,
  isWeekend
} from '@/utils/date'
import type { CalendarEvent, CalendarEventInternal } from '@/types'

describe('Date Utils', () => {
  describe('normalizeEvent', () => {
    it('normalizes event with string dates', () => {
      const event: CalendarEvent = {
        id: '1',
        title: 'Test Event',
        start: '2025-07-01T10:00:00',
        end: '2025-07-01T11:00:00'
      }

      const normalized = normalizeEvent(event)
      
      expect(normalized.startDate.isValid()).toBe(true)
      expect(normalized.endDate.isValid()).toBe(true)
      expect(normalized.isAllDay).toBe(false)
    })

    it('handles all-day events', () => {
      const event: CalendarEvent = {
        id: '1',
        title: 'All Day Event',
        start: '2025-07-01',
        allDay: true
      }

      const normalized = normalizeEvent(event)
      
      expect(normalized.isAllDay).toBe(true)
    })

    it('sets default end time when not provided', () => {
      const event: CalendarEvent = {
        id: '1',
        title: 'No End Event',
        start: '2025-07-01T10:00:00'
      }

      const normalized = normalizeEvent(event)
      
      expect(normalized.endDate.diff(normalized.startDate, 'hour')).toBe(1)
    })
  })

  describe('getEventsInRange', () => {
    it('filters events within date range', () => {
      const events: CalendarEventInternal[] = [
        {
          id: '1',
          title: 'Event 1',
          start: '2025-07-01T10:00:00',
          startDate: dayjs('2025-07-01T10:00:00'),
          endDate: dayjs('2025-07-01T11:00:00'),
          isAllDay: false
        },
        {
          id: '2',
          title: 'Event 2',
          start: '2025-07-05T10:00:00',
          startDate: dayjs('2025-07-05T10:00:00'),
          endDate: dayjs('2025-07-05T11:00:00'),
          isAllDay: false
        }
      ]

      const start = dayjs('2025-07-01')
      const end = dayjs('2025-07-03')
      
      const filtered = getEventsInRange(events, start, end)
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].id).toBe('1')
    })
  })

  describe('formatEventTime', () => {
    it('formats time for regular events', () => {
      const event: CalendarEventInternal = {
        id: '1',
        title: 'Test Event',
        start: '2025-07-01T10:00:00',
        startDate: dayjs('2025-07-01T10:00:00'),
        endDate: dayjs('2025-07-01T11:00:00'),
        isAllDay: false
      }

      const formatted = formatEventTime(event)
      
      expect(formatted).toBe('10:00 - 11:00')
    })

    it('formats all-day events', () => {
      const event: CalendarEventInternal = {
        id: '1',
        title: 'All Day Event',
        start: '2025-07-01',
        startDate: dayjs('2025-07-01'),
        endDate: dayjs('2025-07-01').endOf('day'),
        isAllDay: true
      }

      const formatted = formatEventTime(event)
      
      expect(formatted).toBe('All day')
    })
  })

  describe('getEventColor', () => {
    it('returns event color when specified', () => {
      const event: CalendarEventInternal = {
        id: '1',
        title: 'Colored Event',
        start: '2025-07-01T10:00:00',
        startDate: dayjs('2025-07-01T10:00:00'),
        endDate: dayjs('2025-07-01T11:00:00'),
        isAllDay: false,
        color: '#ff0000'
      }

      const color = getEventColor(event)
      
      expect(color).toBe('#ff0000')
    })

    it('returns status-based color when no color specified', () => {
      const event: CalendarEventInternal = {
        id: '1',
        title: 'Completed Event',
        start: '2025-07-01T10:00:00',
        startDate: dayjs('2025-07-01T10:00:00'),
        endDate: dayjs('2025-07-01T11:00:00'),
        isAllDay: false,
        status: 'completed'
      }

      const color = getEventColor(event)
      
      expect(color).toBe('#4caf50')
    })
  })

  describe('isToday', () => {
    it('returns true for today', () => {
      const today = dayjs()
      expect(isToday(today)).toBe(true)
    })

    it('returns false for other days', () => {
      const yesterday = dayjs().subtract(1, 'day')
      expect(isToday(yesterday)).toBe(false)
    })
  })

  describe('isWeekend', () => {
    it('returns true for Saturday', () => {
      // Create a Saturday
      const saturday = dayjs().day(6)
      expect(isWeekend(saturday)).toBe(true)
    })

    it('returns true for Sunday', () => {
      // Create a Sunday
      const sunday = dayjs().day(0)
      expect(isWeekend(sunday)).toBe(true)
    })

    it('returns false for weekdays', () => {
      // Create a Monday
      const monday = dayjs().day(1)
      expect(isWeekend(monday)).toBe(false)
    })
  })
})
