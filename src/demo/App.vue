<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Vue 3 Calendar Component Demo</v-app-bar-title>
      <v-spacer />
      <v-select
        v-model="selectedLocale"
        :items="localeOptions"
        item-title="label"
        item-value="value"
        label="Language"
        dense
        hide-details
        style="max-width: 150px; margin-right: 16px"
      />
      <v-btn icon @click="toggleTheme">
        <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-4">
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                <span class="text-h5">Calendar Demo</span>
                <v-spacer />
                <v-btn color="primary" @click="addSampleEvent"> Add Sample Event </v-btn>
                <v-btn color="secondary" @click="testDateFormats"> Test Date Formats </v-btn>
              </v-card-title>

              <v-card-text>
                <CalendarFilters :filters="filters" class="mb-4" @filters-change="handleFiltersChange" />

                <div style="height: 600px">
                  <CalendarComponent
                    v-model:current-date="currentDate"
                    :events="events"
                    :view="currentView"
                    :config="calendarConfig"
                    :read-only="currentReadOnly"
                    :filters="filters"
                    :lazy-load="loadEvents"
                    @event-click="handleEventClick"
                    @event-drop="handleEventDrop"
                    @date-click="handleDateClick"
                    @view-change="handleViewChange"
                    @date-change="handleDateChange"
                  >
                    <template #eventMenu="{ event }">
                      <v-list>
                        <v-list-item>
                          <v-list-item-title>{{ event.title }}</v-list-item-title>
                          <v-list-item-subtitle>{{ event.description }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                          <v-btn color="primary">Button</v-btn>
                        </v-list-item>
                      </v-list>
                    </template>
                  </CalendarComponent>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Stats Card -->
        <v-row class="mt-4">
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>Statistics</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>Total Events:</v-list-item-title>
                    <v-list-item-subtitle>{{ events.length }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Completed Events:</v-list-item-title>
                    <v-list-item-subtitle>{{ completedEvents }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Pending Events:</v-list-item-title>
                    <v-list-item-subtitle>{{ pendingEvents }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>Configuration</v-card-title>
              <v-card-text>
                <v-select
                  v-model="calendarConfig.firstDayOfWeek"
                  :items="[
                    { title: 'Sunday', value: 'sunday' },
                    { title: 'Monday', value: 'monday' },
                  ]"
                  label="First Day of Week"
                />
                <v-select
                  v-model="calendarConfig.timeSlotDuration"
                  :items="[15, 30, 60, 120]"
                  label="Time Slot Duration (minutes)"
                />
                <v-switch v-model="calendarConfig.showTimeGrid" label="Show Time Grid" />
                <v-switch v-model="currentReadOnly" label="Read Only" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import CalendarComponent from '@/plugin/components/CalendarComponent.vue'
  import CalendarFilters from '@/plugin/components/CalendarFilters.vue'
  import { useLocale } from '@/plugin/composables/useLocale'
  import locale_de from '@/plugin/locale/de'
  import locale_en from '@/plugin/locale/en'
  import {
    type CalendarConfig,
    type CalendarEvent,
    type CalendarEventInternal,
    type CalendarView,
    type EventClickData,
    type EventDropData,
    type FilterOptions,
    type FiltersChangeData,
    type LazyLoadData,
    type ViewChangeData,
  } from '@/plugin/types'
  import type { Dayjs } from 'dayjs'
  import dayjs from 'dayjs'
  import { computed, ref, watch } from 'vue'
  import { useTheme } from 'vuetify'
  const { setLocale } = useLocale()

  const theme = useTheme()
  const isDark = computed(() => theme.global.current.value.dark)

  // State
  const events = ref<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Standup',
      start: dayjs().hour(9).minute(0).toISOString(),
      end: dayjs().hour(9).minute(30).toISOString(),
      status: 'planned',
      color: '#1976d2',
      icon: 'mdi-account-group',
      description: 'Daily team synchronization meeting',
    },
    {
      id: '2',
      title: 'Project Review',
      start: dayjs().add(1, 'day').hour(14).minute(0).toISOString(),
      end: dayjs().add(1, 'day').hour(15).minute(30).toISOString(),
      status: 'open',
      color: '#f44336',
      icon: 'mdi-clipboard-check',
      description: 'Quarterly project review with stakeholders',
    },
    {
      id: '3',
      title: 'Lunch Break',
      start: dayjs().hour(12).minute(0).toISOString(),
      end: dayjs().hour(13).minute(0).toISOString(),
      status: 'completed',
      color: '#4caf50',
      icon: 'mdi-food',
      description: 'Daily lunch break',
    },
  ])

  const currentView = ref<CalendarView>('month')
  const currentDate = ref<Date | string | Dayjs>(dayjs())
  const currentReadOnly = ref<boolean>(false)

  // Locale options
  const localeOptions = ref([
    { label: 'English', value: 'en' },
    { label: 'Deutsch', value: 'de' },
  ])

  const selectedLocale = ref('en')

  const filters = ref<FilterOptions>({})
  const selectedEvent = ref<CalendarEventInternal | null>(null)
  const showEventDialog = ref(false)

  const calendarConfig = ref<CalendarConfig>({
    firstDayOfWeek: 'monday',
    timeSlotDuration: 60,
    minTime: '00:00',
    maxTime: '24:00',
    showTimeGrid: true,
  })

  // Computed
  const completedEvents = computed(() => events.value.filter((e) => e.status === 'completed').length)

  const pendingEvents = computed(
    () => events.value.filter((e) => e.status !== 'completed' && e.status !== 'cancelled').length
  )

  const toggleTheme = () => {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  }

  // Watch for locale changes
  watch(selectedLocale, (newLocale) => {
    const localeObj = newLocale === 'de' ? locale_de : locale_en
    setLocale(localeObj)
  })

  const addSampleEvent = () => {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: `New Event ${events.value.length + 1}`,
      start: dayjs()
        .hour(Math.floor(Math.random() * 8) + 9)
        .minute(0)
        .toISOString(),
      end: dayjs()
        .hour(Math.floor(Math.random() * 8) + 9)
        .minute(30)
        .toISOString(),
      status: ['open', 'planned', 'completed'][Math.floor(Math.random() * 3)] as any,
      color: ['#1976d2', '#f44336', '#4caf50'][Math.floor(Math.random() * 3)],
    }
    events.value.push(newEvent)
  }

  const loadEvents = async (data: LazyLoadData) => {
    // Simulate API call
    console.log('Loading events for range:', data.start, 'to', data.end)

    // Create a few sample events for the requested range

    const start = dayjs(data.start)
    const end = dayjs(data.end)
    const newEvents: CalendarEvent[] = []
    for (let i = 0; i < 10; i++) {
      const randomStart = start.add(Math.floor(Math.random() * (end.diff(start, 'day') + 1)), 'day')
      const randomEnd = randomStart.add(Math.floor(Math.random() * 3) + 1, 'hour')
      newEvents.push({
        id: `lazy-${Date.now()}-${i}`,
        title: `Lazy Loaded Event ${i + 1}`,
        start: randomStart.toISOString(),
        end: randomEnd.toISOString(),
        status: ['open', 'planned', 'completed'][Math.floor(Math.random() * 3)] as any,
        color: ['#1976d2', '#f44336', '#4caf50'][Math.floor(Math.random() * 3)],
        icon: 'mdi-calendar',
        description: `Lazy loaded event ${i + 1} from ${randomStart.format('YYYY-MM-DD')} to ${randomEnd.format('YYYY-MM-DD')}`,
      })
    }
    return newEvents
  }

  const handleEventClick = (data: EventClickData) => {
    console.log('Event clicked:', data)
    selectedEvent.value = data.event
    showEventDialog.value = true
  }

  const handleEventDrop = async (data: EventDropData) => {
    console.log('Event dropped:', data)

    // Update the event in our local state
    const eventIndex = events.value.findIndex((e) => e.id === data.event.id)
    if (eventIndex !== -1) {
      events.value[eventIndex] = {
        ...events.value[eventIndex],
        start: data.newStart.toISOString(),
        end: data.newEnd.toISOString(),
      }
    }
  }

  const handleFiltersChange = (data: FiltersChangeData) => {
    console.log('Filters changed:', data)
    filters.value = data.filters
  }

  const handleDateClick = (date: any) => {
    console.log('Date clicked:', date.format('YYYY-MM-DD'))
    currentDate.value = date
  }

  const handleViewChange = (data: ViewChangeData) => {
    console.log('View changed:', data.newView, data.currentDate.format('YYYY-MM-DD'))
    currentView.value = data.newView
    currentDate.value = data.currentDate.toISOString()
  }

  const handleDateChange = (date: any) => {
    console.log('Date changed:', date.format('YYYY-MM-DD'))
    currentDate.value = date
  }

  const testDateFormats = () => {
    // Test different date input formats
    const formats = [
      new Date(), // Date object
      '2025-07-15', // ISO string
      dayjs().add(2, 'days'), // Dayjs object
      dayjs().subtract(1, 'week').toDate(), // Date from Dayjs
      '2025-08-01T10:00:00Z', // Full ISO datetime string
    ]

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < formats.length) {
        currentDate.value = formats[currentIndex]
        console.log(`Testing format ${currentIndex + 1}:`, formats[currentIndex])
        currentIndex++
      } else {
        clearInterval(interval)
        // Reset to original
        currentDate.value = dayjs()
        console.log('Date format test completed')
      }
    }, 2000)
  }
</script>

<style scoped>
  .v-application {
    font-family: 'Roboto', sans-serif;
  }
</style>
