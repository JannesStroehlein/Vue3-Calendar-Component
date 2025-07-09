import { CalendarLocale } from '../types'

export const locale: CalendarLocale = {
  dayJsLocale: 'de',
  status: {
    open: 'Offen',
    planned: 'Geplant',
    overdue: 'Überfällig',
    completed: 'Abgeschlossen',
    cancelled: 'Abgebrochen',
  },
  views: {
    agenda: {
      noEvents: 'Keine Ereignisse für diesen Tag geplant',
      buttons: {
        markEventCompleted: 'Abgeschlossen markieren',
        cancelEvent: 'Absagen',
      },
    },
  },
  toolbar: {
    buttons: {
      month: 'Monat',
      week: 'Woche',
      day: 'Tag',
      agenda: 'Agenda',
      today: 'Heute',
      previous: 'Vorherige',
      next: 'Nächste',
    },
    filters: {
      statusLabel: 'Nach Status filtern',
      filterByCategory: 'Nach Kategorie filtern',
    },
    searchPlaceholder: 'Suchen nach Ereignissen...',
    clearFilters: 'Filter zurücksetzen',
    activeFilters: function (activeFilterCount: number): string {
      return `${activeFilterCount} Filter aktiv`
    },
  },
  formats: {
    date: 'DD.MM.YYYY',
    time: 'HH:mm',
    day: 'dddd, D. MMMM YYYY',
    startOfWeek: 'D. MMM',
    endOfWeek: 'D. MMM YYYY',
    month: 'MMMM YYYY',
    duration: (days: number, hours: number, minutes: number): string => {
      const parts = []
      if (days > 0) parts.push(`${days} t`)
      if (hours > 0) parts.push(`${hours} h`)
      if (minutes > 0) parts.push(`${minutes} m`)
      return parts.join(', ')
    },
  },
}
