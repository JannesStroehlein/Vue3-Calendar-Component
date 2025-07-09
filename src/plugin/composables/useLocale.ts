import dayjs from 'dayjs'
import 'dayjs/locale/de' // Import German locale for dayjs
import 'dayjs/locale/en'
import { computed, ref } from 'vue'
import { locale } from '../locale/en'
import { CalendarLocale } from '../types'

const localeState = ref<CalendarLocale>(locale)

export function useLocale() {
  const setLocale = (newLocale: CalendarLocale) => {
    localeState.value = newLocale
    if (newLocale.dayJsLocale) {
      dayjs.locale(newLocale.dayJsLocale)
    } else {
      dayjs.locale('en') // Fallback to English if no locale is specified
    }

    console.log(dayjs().format('MMMM D, YYYY')) // Ensure dayjs is initialized with the new locale
  }

  // Helper function to create dayjs instances with current locale
  const createLocalizedDayjs = (date?: string | Date | dayjs.Dayjs) => {
    const instance = date ? dayjs(date) : dayjs()
    return localeState.value.dayJsLocale ? instance.locale(localeState.value.dayJsLocale) : instance
  }

  // Reactive computed that returns a dayjs factory with current locale
  const localizedDayjs = computed(() => {
    return (date?: string | Date | dayjs.Dayjs) => {
      const instance = date ? dayjs(date) : dayjs()
      return localeState.value.dayJsLocale ? instance.locale(localeState.value.dayJsLocale) : instance
    }
  })

  return {
    current: localeState,
    setLocale,
    createLocalizedDayjs,
    localizedDayjs,
  }
}
