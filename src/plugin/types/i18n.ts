export interface CalendarLocale {
  /**
   * This is passed to dayjs for localization.
   * It should be a valid locale string supported by dayjs.
   * @link https://github.com/iamkun/dayjs/tree/dev/src/locale
   */
  dayJsLocale: string
  status: {
    open: string
    planned: string
    overdue: string
    completed: string
    cancelled: string
  }
  views: {
    agenda: {
      noEvents: string
      buttons: {
        markEventCompleted: string
        cancelEvent: string
      }
    }
  }
  toolbar: {
    buttons: {
      month: string
      week: string
      day: string
      agenda: string
      today: string
      previous: string
      next: string
    }
    filters: {
      statusLabel: string
      filterByCategory: string
    }

    searchPlaceholder: string
    clearFilters: string
    activeFilters: (activeFilterCount: number) => string
  }
  /**
   * Formats used for displaying dates & time in the calendar.
   */
  formats: {
    date?: string
    time?: string
    day?: string
    /**
     * If the week view is selected both the start and end of the week will be formatted using these formats.
     */
    startOfWeek?: string
    /**
     * If the week view is selected both the start and end of the week will be formatted using these formats.
     */
    endOfWeek?: string
    month?: string
    /**
     * Short format for displaying durations in days, hours and minutes.
     */
    duration: (days: number, hours: number, minutes: number) => string
  }
}
