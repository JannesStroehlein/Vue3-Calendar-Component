<template>
  <v-toolbar density="compact" class="calendar-toolbar">
    <v-btn
      icon
      @click="$emit('navigate-previous')"
      :disabled="loading"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>

    <v-btn
      icon
      @click="$emit('navigate-next')"
      :disabled="loading"
    >
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>

    <v-btn
      variant="text"
      @click="$emit('navigate-today')"
      :disabled="loading"
      class="mx-2"
    >
      Today
    </v-btn>

    <v-spacer />

    <div class="calendar-title">
      <h2 class="text-h6">{{ formattedDate }}</h2>
    </div>

    <v-spacer />

    <v-btn-toggle
      :model-value="currentView"
      @update:model-value="handleViewChange"
      mandatory
      variant="outlined"
      divided
    >
      <v-btn value="month" size="small">
        Month
      </v-btn>
      <v-btn value="week" size="small">
        Week
      </v-btn>
      <v-btn value="day" size="small">
        Day
      </v-btn>
      <v-btn value="agenda" size="small">
        Agenda
      </v-btn>
    </v-btn-toggle>

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      class="position-absolute"
      style="bottom: 0; left: 0; right: 0;"
    />
  </v-toolbar>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { Dayjs } from 'dayjs'
  import type { CalendarView } from '@/types'

  export interface CalendarToolbarProps {
    currentDate: Dayjs
    currentView: CalendarView
    loading?: boolean
  }

  export interface CalendarToolbarEmits {
    (e: 'view-change', view: CalendarView, date: Dayjs): void
    (e: 'date-change', date: Dayjs): void
    (e: 'navigate-previous'): void
    (e: 'navigate-next'): void
    (e: 'navigate-today'): void
  }

  const props = withDefaults(defineProps<CalendarToolbarProps>(), {
    loading: false
  })

  const emit = defineEmits<CalendarToolbarEmits>()

  const formattedDate = computed(() => {
    switch (props.currentView) {
      case 'month':
        return props.currentDate.format('MMMM YYYY')
      case 'week':
        const start = props.currentDate.startOf('week')
        const end = props.currentDate.endOf('week')
        return `${start.format('MMM D')} - ${end.format('MMM D, YYYY')}`
      case 'day':
      case 'agenda':
        return props.currentDate.format('dddd, MMMM D, YYYY')
      default:
        return props.currentDate.format('MMMM YYYY')
    }
  })

  const handleViewChange = (view: CalendarView) => {
    emit('view-change', view, props.currentDate)
  }
</script>

<style scoped>
  .calendar-toolbar {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  .calendar-title {
    text-align: center;
    min-width: 200px;
  }
</style>
