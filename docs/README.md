# Vue 3 Calendar Component Documentation

## Overview

Vue 3 Calendar Component is a comprehensive calendar component library built with Vue 3, Vuetify 3, and TypeScript. It provides multiple view modes, event management, drag & drop functionality, and extensive customization options.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Events](#events)
- [Views](#views)
- [Filtering](#filtering)
- [Drag & Drop](#drag--drop)
- [Lazy Loading](#lazy-loading)
- [Localization](#localization)
- [API Reference](#api-reference)
  - [Slots](#component-slots)
- [Examples](#examples)

## Installation

### NPM

```bash
npm install vue3-calendar-component
```

### Yarn

```bash
yarn add vue3-calendar-component
```

### Bun

```bash
bun add vue3-calendar-component
```

## Quick Start

### 1. Install and Configure

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import Vue3CalendarComponent from 'vue3-calendar-component'
import 'vuetify/styles'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
const vuetify = createVuetify()

app.use(pinia)
app.use(vuetify)
app.use(Vue3CalendarComponent, {
  globalConfig: {
    firstDayOfWeek: 1, // Monday
    timeSlotDuration: 60, // 1 hour slots
    showTimeGrid: true,
  },
})

app.mount('#app')
```

### 2. Basic Usage

```vue
<template>
  <div style="height: 600px;">
    <CalendarComponent :events="events" view="month" @event-click="handleEventClick" @event-drop="handleEventDrop" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import type { CalendarEvent } from 'vue3-calendar-component'

  const events = ref<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Meeting',
      start: '2025-07-01T10:00:00',
      end: '2025-07-01T11:00:00',
      status: 'planned',
      color: '#1976d2',
      icon: 'mdi-account-group',
    },
    {
      id: '2',
      title: 'Project Deadline',
      start: '2025-07-05T09:00:00',
      end: '2025-07-05T17:00:00',
      status: 'open',
      color: '#f44336',
      icon: 'mdi-flag',
    },
  ])

  const handleEventClick = (event: CalendarEvent, nativeEvent: MouseEvent) => {
    console.log('Event clicked:', event)
  }

  const handleEventDrop = (data: EventDropData) => {
    console.log('Event dropped:', data)
    // Update event in your data store
  }
</script>
```

## Configuration

### Global Configuration

Configure default behavior when installing the plugin:

```typescript
app.use(Vue3CalendarComponent, {
  globalConfig: {
    firstDayOfWeek: 0, // Sunday = 0, Monday = 1
    timeSlotDuration: 30, // 30-minute intervals
    minTime: '06:00',
    maxTime: '22:00',
    showTimeGrid: true,
    timeGridDivisions: 4,
    locale: 'en',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
  },
})
```

### Component-Level Configuration

Override global settings per component:

```vue
<CalendarComponent
  :config="{
    firstDayOfWeek: 1,
    timeSlotDuration: 60,
    showTimeGrid: false,
  }"
  :events="events"
/>
```

## Events

### Event Object Structure

```typescript
interface CalendarEvent {
  id: string // Unique identifier
  title: string // Event title
  start: string | Date | Dayjs // Start date/time
  end?: string | Date | Dayjs // End date/time (optional)
  allDay?: boolean // All-day event flag
  color?: string // Primary color
  backgroundColor?: string // Background color
  borderColor?: string // Border color
  textColor?: string // Text color
  icon?: string // Material Design Icon
  status?: EventStatus // Event status
  subtitle?: string // Secondary text
  description?: string // Detailed description
  location?: string // Event location
  data?: Record<string, any> // Custom data
}
```

### Event Status

Events can have the following statuses:

- `open` - Default status
- `planned` - Scheduled event
- `completed` - Finished event
- `overdue` - Past due event
- `cancelled` - Cancelled event

### Event Styling

Events can be styled in multiple ways:

```typescript
const styledEvent: CalendarEvent = {
  id: '1',
  title: 'Important Meeting',
  start: '2025-07-01T10:00:00',
  end: '2025-07-01T11:00:00',
  color: '#e91e63', // Primary color
  backgroundColor: '#fce4ec', // Background
  borderColor: '#ad1457', // Border
  textColor: '#880e4f', // Text
  icon: 'mdi-star', // Icon
  status: 'planned',
}
```

## Views

### Month View

Displays a traditional monthly calendar grid:

```vue
<CalendarComponent view="month" :events="events" />
```

Features:

- Full month grid
- Up to 3 events per day
- Click to view day details
- Drag & drop between dates

### Week View

Shows a weekly timeline with hourly slots:

```vue
<CalendarComponent view="week" :events="events" />
```

Features:

- 7-day timeline
- Configurable time slots
- Event positioning by time
- Detailed event information

### Day View

Focuses on a single day with detailed scheduling:

```vue
<CalendarComponent view="day" :events="events" />
```

Features:

- Single day focus
- Hourly time slots
- Full event details
- Time slot clicking

### Agenda View

List-based view for detailed event information:

```vue
<CalendarComponent view="agenda" :events="events" />
```

Features:

- List format
- Complete event details
- Event actions
- Status management

## Filtering

### Text Search

Filter events by title, subtitle, or description:

```vue
<CalendarComponent :filters="{ search: 'meeting' }" :events="events" show-filters />
```

### Status Filtering

Show only events with specific statuses:

```vue
<CalendarComponent :filters="{ statuses: ['planned', 'open'] }" :events="events" show-filters />
```

### Date Range Filtering

Filter events within a date range:

```vue
<CalendarComponent
  :filters="{
    dateRange: {
      start: dayjs('2025-07-01'),
      end: dayjs('2025-07-31'),
    },
  }"
  :events="events"
/>
```

### Custom Filtering

Implement custom filter logic:

```vue
<CalendarComponent
  :filters="{
    customFilter: (event) => event.data?.priority === 'high',
  }"
  :events="events"
/>
```

## Drag & Drop

### Basic Drag & Drop

Enable drag and drop for easy event rescheduling:

```vue
<CalendarComponent :events="events" @event-drop="handleEventDrop" />
```

### Custom Drop Handler

Implement custom logic when events are dropped:

```typescript
const handleEventDrop = async (data: EventDropData) => {
  const { event, newStart, newEnd, oldStart, oldEnd } = data

  try {
    // Validate the new time
    if (isTimeSlotAvailable(newStart, newEnd)) {
      // Update event in your backend
      await updateEvent(event.id, {
        start: newStart.toISOString(),
        end: newEnd.toISOString(),
      })

      // Update local state
      updateLocalEvent(event.id, { start: newStart, end: newEnd })
    } else {
      // Revert the change
      console.warn('Time slot not available')
    }
  } catch (error) {
    console.error('Failed to update event:', error)
  }
}
```

## Lazy Loading

### Setup Lazy Loading

Load events dynamically based on the visible date range:

```vue
<CalendarComponent :lazy-load="loadEvents" view="month" />
```

```typescript
const loadEvents = async (data: LazyLoadData) => {
  const { start, end, view } = data

  try {
    const response = await fetch(`/api/events?start=${start.toISOString()}&end=${end.toISOString()}`)
    const events = await response.json()
    return events
  } catch (error) {
    console.error('Failed to load events:', error)
    return []
  }
}
```

### Loading States

The component automatically shows loading indicators during data fetching.

## Localization

### Dayjs Localization

Configure locale for date formatting:

```typescript
import dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')

app.use(Vue3CalendarComponent, {
  globalConfig: {
    locale: 'es',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
  },
})
```

### Vuetify Localization

Use Vuetify's localization system:

```typescript
import { createVuetify } from 'vuetify'
import { es } from 'vuetify/locale'

const vuetify = createVuetify({
  locale: {
    locale: 'es',
    messages: { es },
  },
})
```

## API Reference

### Component Slots

| Name      | Props                  | Supported Views  | Description                                                                                  |
| --------- | ---------------------- | ---------------- | -------------------------------------------------------------------------------------------- |
| eventMenu | `event: CalendarEvent` | Month, Week, Day | Content specified in this slot will be displayed in a flyout when the user clicks on a event |

### Component Props

```typescript
interface CalendarComponentProps {
  events?: CalendarEvent[] // Array of events
  view?: CalendarView // Current view mode
  currentDate?: string | Date | Dayjs // Currently displayed date
  config?: Partial<CalendarConfig> // Component configuration
  filters?: FilterOptions // Active filters
  showFilters?: boolean // Show filter UI
  lazyLoad?: LazyLoadHandler // Lazy loading function
}
```

### Component Events

```typescript
interface CalendarComponentEmits {
  'event-click': (event: CalendarEvent, nativeEvent: MouseEvent) => void
  'event-drop': (data: EventDropData) => void
  'date-click': (date: Dayjs) => void
  'view-change': (view: CalendarView, date: Dayjs) => void
  'date-change': (date: Dayjs) => void
}
```

## Examples

### Complete Example

```vue
<template>
  <v-app>
    <v-main>
      <v-container fluid>
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
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import dayjs from 'dayjs'
  import type {
    CalendarEvent,
    CalendarView,
    CalendarConfig,
    FilterOptions,
    EventDropData,
    LazyLoadData,
  } from 'vue3-calendar-component'

  const events = ref<CalendarEvent[]>([])
  const currentView = ref<CalendarView>('month')
  const currentDate = ref(dayjs())
  const filters = ref<FilterOptions>({})

  const calendarConfig: CalendarConfig = {
    firstDayOfWeek: 1,
    timeSlotDuration: 60,
    minTime: '08:00',
    maxTime: '18:00',
    showTimeGrid: true,
    locale: 'en',
  }

  const loadEvents = async (data: LazyLoadData) => {
    // Simulate API call
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Team Standup',
        start: data.start.add(1, 'day').hour(9).minute(0).toISOString(),
        end: data.start.add(1, 'day').hour(9).minute(30).toISOString(),
        status: 'planned',
        color: '#1976d2',
      },
    ]

    return mockEvents
  }

  const handleEventClick = (event: CalendarEvent, nativeEvent: MouseEvent) => {
    console.log('Event clicked:', event)
  }

  const handleEventDrop = async (data: EventDropData) => {
    console.log('Event dropped:', data)
    // Update event in your backend and local state
  }

  const handleDateClick = (date: any) => {
    console.log('Date clicked:', date.format('YYYY-MM-DD'))
  }

  const handleViewChange = (view: CalendarView, date: any) => {
    currentView.value = view
    currentDate.value = date
  }
</script>
```
