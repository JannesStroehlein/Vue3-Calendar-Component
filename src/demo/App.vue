<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Vue 3 Calendar Copilot Demo</v-app-bar-title>
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
                <v-btn
                  color="primary"
                  @click="addSampleEvent"
                >
                  Add Sample Event
                </v-btn>
              </v-card-title>
              
              <v-card-text>
                <div style="height: 600px;">
                  <CalendarComponent
                    :events="events"
                    :view="currentView"
                    :current-date="currentDate"
                    :config="calendarConfig"
                    :filters="filters"
                    :lazy-load="loadEvents"
                    show-filters
                    @event-click="handleEventClick"
                    @event-drop="handleEventDrop"
                    @date-click="handleDateClick"
                    @view-change="handleViewChange"
                    @date-change="handleDateChange"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Event Details Dialog -->
        <v-dialog v-model="showEventDialog" max-width="500">
          <v-card v-if="selectedEvent">
            <v-card-title>
              <v-icon v-if="selectedEvent.icon" :icon="selectedEvent.icon" class="mr-2" />
              {{ selectedEvent.title }}
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item>
                  <v-list-item-title>Start:</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDateTime(selectedEvent.startDate) }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>End:</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDateTime(selectedEvent.endDate) }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item v-if="selectedEvent.description">
                  <v-list-item-title>Description:</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedEvent.description }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn @click="showEventDialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

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
                    { title: 'Sunday', value: 0 },
                    { title: 'Monday', value: 1 }
                  ]"
                  label="First Day of Week"
                />
                <v-select
                  v-model="calendarConfig.timeSlotDuration"
                  :items="[15, 30, 60, 120]"
                  label="Time Slot Duration (minutes)"
                />
                <v-switch
                  v-model="calendarConfig.showTimeGrid"
                  label="Show Time Grid"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import dayjs from 'dayjs'
import type {
  CalendarEvent,
  CalendarView,
  CalendarConfig,
  FilterOptions,
  EventDropData,
  LazyLoadData,
  CalendarEventInternal
} from '../types'

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
    description: 'Daily team synchronization meeting'
  },
  {
    id: '2',
    title: 'Project Review',
    start: dayjs().add(1, 'day').hour(14).minute(0).toISOString(),
    end: dayjs().add(1, 'day').hour(15).minute(30).toISOString(),
    status: 'open',
    color: '#f44336',
    icon: 'mdi-clipboard-check',
    description: 'Quarterly project review with stakeholders'
  },
  {
    id: '3',
    title: 'Lunch Break',
    start: dayjs().hour(12).minute(0).toISOString(),
    end: dayjs().hour(13).minute(0).toISOString(),
    status: 'completed',
    color: '#4caf50',
    icon: 'mdi-food',
    description: 'Daily lunch break'
  }
])

const currentView = ref<CalendarView>('month')
const currentDate = ref(dayjs())
const filters = ref<FilterOptions>({})
const selectedEvent = ref<CalendarEventInternal | null>(null)
const showEventDialog = ref(false)

const calendarConfig = ref<CalendarConfig>({
  firstDayOfWeek: 1,
  timeSlotDuration: 60,
  minTime: '08:00',
  maxTime: '18:00',
  showTimeGrid: true,
  locale: 'en'
})

// Computed
const completedEvents = computed(() => 
  events.value.filter(e => e.status === 'completed').length
)

const pendingEvents = computed(() => 
  events.value.filter(e => e.status !== 'completed' && e.status !== 'cancelled').length
)

// Methods
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const addSampleEvent = () => {
  const newEvent: CalendarEvent = {
    id: Date.now().toString(),
    title: `New Event ${events.value.length + 1}`,
    start: dayjs().add(Math.floor(Math.random() * 7), 'day').hour(10).minute(0).toISOString(),
    end: dayjs().add(Math.floor(Math.random() * 7), 'day').hour(11).minute(0).toISOString(),
    status: 'open',
    color: '#9c27b0',
    icon: 'mdi-star',
    description: 'Dynamically added sample event'
  }
  
  events.value.push(newEvent)
}

const loadEvents = async (data: LazyLoadData) => {
  // Simulate API call
  console.log('Loading events for range:', data.start.format('YYYY-MM-DD'), 'to', data.end.format('YYYY-MM-DD'))
  
  // Return empty array for demo (events are already loaded)
  return []
}

const handleEventClick = (event: CalendarEventInternal, nativeEvent: MouseEvent) => {
  console.log('Event clicked:', event, nativeEvent)
  selectedEvent.value = event
  showEventDialog.value = true
}

const handleEventDrop = async (data: EventDropData) => {
  console.log('Event dropped:', data)
  
  // Update the event in our local state
  const eventIndex = events.value.findIndex(e => e.id === data.event.id)
  if (eventIndex !== -1) {
    events.value[eventIndex] = {
      ...events.value[eventIndex],
      start: data.newStart.toISOString(),
      end: data.newEnd.toISOString()
    }
  }
}

const handleDateClick = (date: any) => {
  console.log('Date clicked:', date.format('YYYY-MM-DD'))
  currentDate.value = date
}

const handleViewChange = (view: CalendarView, date: any) => {
  console.log('View changed:', view, date.format('YYYY-MM-DD'))
  currentView.value = view
  currentDate.value = date
}

const handleDateChange = (date: any) => {
  console.log('Date changed:', date.format('YYYY-MM-DD'))
  currentDate.value = date
}

const formatDateTime = (date: any) => {
  return date.format('ddd, MMM D, YYYY [at] h:mm A')
}
</script>

<style scoped>
.v-application {
  font-family: 'Roboto', sans-serif;
}
</style>
