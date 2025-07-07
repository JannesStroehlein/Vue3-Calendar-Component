import { inject } from 'vue'
import { CalendarLocale } from '../types'

export function useLocale() {
  return inject<CalendarLocale>('calendarLocale')!
}
