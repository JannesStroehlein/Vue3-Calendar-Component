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
  },
}
