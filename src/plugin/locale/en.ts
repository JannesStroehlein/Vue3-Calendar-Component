import { CalendarLocale } from '../types'

export const locale: CalendarLocale = {
  dayJsLocale: 'en',
  status: {
    open: 'Open',
    planned: 'Planned',
    overdue: 'Overdue',
    completed: 'Completed',
    cancelled: 'Cancelled',
  },
  views: {
    agenda: {
      noEvents: 'No events scheduled for this day',
      buttons: {
        markEventCompleted: 'Mark as Completed',
        cancelEvent: 'Cancel Event',
      },
    },
  },
  toolbar: {
    buttons: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      agenda: 'Agenda',
      today: 'Today',
      previous: 'Previous',
      next: 'Next',
    },
    filters: {
      statusLabel: 'Filter by status',
      filterByCategory: 'Filter by category',
    },
    searchPlaceholder: 'Search events...',
    clearFilters: 'Clear Filters',
    activeFilters: function (activeFilterCount: number): string {
      return `${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active`
    },
  },
  formats: {
    date: 'MM/DD/YYYY',
    time: 'HH:mm',
    day: 'dddd, MMMM D, YYYY',
    startOfWeek: 'MMM D',
    endOfWeek: 'MMM D, YYYY',
    month: 'MMMM YYYY',
    duration(days, hours, minutes) {
      const parts = []
      if (days > 0) parts.push(`${days} d`)
      if (hours > 0) parts.push(`${hours} h`)
      if (minutes > 0) parts.push(`${minutes} m`)
      return parts.join(', ')
    },
  },
}
