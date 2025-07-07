<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Vue 3 Calendar Component Demo</v-app-bar-title>
      <v-spacer />
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
              </v-card-title>

              <v-card-text>
                <CalendarFilters :filters="filters" class="mb-4" @filters-change="handleFiltersChange" />

                <div style="height: 600px">
                  <CalendarComponent
:current-date="currentDate" :events="events" :view="currentView"
                    :config="calendarConfig" :filters="filters" :lazy-load="loadEvents" @event-click="handleEventClick"
                    @event-drop="handleEventDrop" @date-click="handleDateClick" @view-change="handleViewChange"
                    @date-change="handleDateChange" />
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
v-model="calendarConfig.firstDayOfWeek" :items="[
                  { title: 'Sunday', value: 0 },
                  { title: 'Monday', value: 1 },
                ]" label="First Day of Week" />
                <v-select
v-model="calendarConfig.timeSlotDuration" :items="[15, 30, 60, 120]"
                  label="Time Slot Duration (minutes)" />
                <v-switch v-model="calendarConfig.showTimeGrid" label="Show Time Grid" />
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
  import type {
    CalendarConfig,
    CalendarEvent,
    CalendarEventInternal,
    CalendarView,
    EventClickData,
    EventDropData,
    FilterOptions,
    FiltersChangeData,
    LazyLoadData,
    ViewChangeData
  } from '@/plugin/types'
  import dayjs from 'dayjs'
  import { computed, ref } from 'vue'
  import { useTheme } from 'vuetify'

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
  const currentDate = ref(dayjs())
  const filters = ref<FilterOptions>({})
  const selectedEvent = ref<CalendarEventInternal | null>(null)
  const showEventDialog = ref(false)

  const calendarConfig = ref<CalendarConfig>({
    firstDayOfWeek: 'monday',
    timeSlotDuration: 60,
    minTime: '08:00',
    maxTime: '18:00',
    showTimeGrid: true
  })

  // Computed
  const completedEvents = computed(() => events.value.filter((e) => e.status === 'completed').length)

  const pendingEvents = computed(
    () => events.value.filter((e) => e.status !== 'completed' && e.status !== 'cancelled').length
  )

  const toggleTheme = () => {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  }

  const addSampleEvent = () => {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: `New Event ${events.value.length + 1}`,
      start: dayjs()
        .add(Math.floor(Math.random() * 7), 'day')
        .hour(10)
        .minute(0)
        .toISOString(),
      end: dayjs()
        .add(Math.floor(Math.random() * 7), 'day')
        .hour(11)
        .minute(0)
        .toISOString(),
      status: 'open',
      color: '#9c27b0',
      icon: 'mdi-star',
      description: 'Dynamically added sample event',
    }

    events.value.push(newEvent)
  }

  const loadEvents = async (data: LazyLoadData) => {
    // Simulate API call
    console.log('Loading events for range:', data.start, 'to', data.end)

    // Return empty array for demo (events are already loaded)
    return []
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
    currentDate.value = data.currentDate
  }

  const handleDateChange = (date: any) => {
    console.log('Date changed:', date.format('YYYY-MM-DD'))
    currentDate.value = date
  }
</script>

<style scoped>
  .v-application {
    font-family: 'Roboto', sans-serif;
  }
</style>
