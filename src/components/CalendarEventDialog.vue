<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card v-if="event">
      <v-card-title class="d-flex align-center">
        <v-icon
          v-if="event.icon"
          :icon="event.icon"
          :color="getEventColor(event)"
          class="mr-2"
        />
        <span>{{ event.title }}</span>
        <v-spacer />
        <v-chip
          :color="getStatusColor(event.status || 'open')"
          size="small"
        >
          {{ formatStatus(event.status || 'open') }}
        </v-chip>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" v-if="event.subtitle">
            <div class="text-subtitle-1">{{ event.subtitle }}</div>
          </v-col>

          <v-col cols="12" v-if="event.description">
            <div class="text-body-2">{{ event.description }}</div>
          </v-col>

          <v-col cols="6">
            <div class="text-caption">Start</div>
            <div>{{ formatDateTime(event.startDate) }}</div>
          </v-col>

          <v-col cols="6">
            <div class="text-caption">End</div>
            <div>{{ formatDateTime(event.endDate) }}</div>
          </v-col>

          <v-col cols="12" v-if="event.location">
            <div class="text-caption">Location</div>
            <div>{{ event.location }}</div>
          </v-col>

          <v-col cols="12" v-if="eventDuration">
            <div class="text-caption">Duration</div>
            <div>{{ eventDuration }}</div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="closeDialog"
        >
          Close
        </v-btn>
        <v-btn
          v-if="event.status !== 'completed'"
          color="success"
          variant="text"
          @click="markAsCompleted"
        >
          Mark Complete
        </v-btn>
        <v-btn
          v-if="event.status !== 'cancelled'"
          color="error"
          variant="text"
          @click="markAsCancelled"
        >
          Cancel Event
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-alert
      v-else
      type="error"
      dismissible
      class="ma-4"
    >
      No event data available.
    </v-alert>
  </v-dialog>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { CalendarEventInternal, CalendarEvent, EventStatus } from '@/types'
  import { getEventColor, getEventDuration } from '@/utils'

  export interface CalendarEventDialogProps {
    event: CalendarEventInternal | null
    open: boolean
  }

  export interface CalendarEventDialogEmits {
    (e: 'close'): void
    (e: 'update', eventId: string, updates: Partial<CalendarEvent>): void
  }

  const props = defineProps<CalendarEventDialogProps>()
  const emit = defineEmits<CalendarEventDialogEmits>()

  const dialog = computed({
    get: () => props.open,
    set: (value: boolean) => {
      if (!value) {
        emit('close')
      }
    }
  })

  const eventDuration = computed(() => {
    if (!props.event) return null
    const duration = getEventDuration(props.event)
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`
    } else if (hours > 0) {
      return `${hours}h`
    } else {
      return `${minutes}m`
    }
  })

  const getStatusColor = (status: EventStatus): string => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'cancelled':
        return 'error'
      case 'overdue':
        return 'warning'
      case 'planned':
        return 'info'
      case 'open':
      default:
        return 'default'
    }
  }

  const formatStatus = (status: EventStatus): string => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const formatDateTime = (date: any): string => {
    return date.format('ddd, MMM D, YYYY [at] h:mm A')
  }

  const closeDialog = () => {
    emit('close')
  }

  const markAsCompleted = () => {
    if (props.event) {
      emit('update', props.event.id, { status: 'completed' })
    }
  }

  const markAsCancelled = () => {
    if (props.event) {
      emit('update', props.event.id, { status: 'cancelled' })
    }
  }
</script>

<style scoped>
  .text-caption {
    color: rgba(0, 0, 0, 0.6);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
</style>
