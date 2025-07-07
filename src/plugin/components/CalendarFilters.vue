<template>
  <v-card class="calendar-filters pa-4 mb-4">
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
v-model="searchText" :label="locale?.toolbar.searchPlaceholder ?? 'Search events...'"
          prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" clearable @input="handleSearchChange" />
      </v-col>

      <v-col cols="12" md="4">
        <v-select
v-model="selectedStatuses" :items="statusOptions"
          :label="locale?.toolbar.filters.statusLabel ?? 'Filter by status'" multiple variant="outlined"
          density="compact" chips closable-chips @update:model-value="handleStatusChange">
          <template #chip="{ props, item }">
            <v-chip v-bind="props" :color="getStatusColor(item.value)" size="small">
              {{ item.title }}
            </v-chip>
          </template>
        </v-select>
      </v-col>

      <v-col cols="12" md="4">
        <div class="d-flex align-center">
          <v-btn variant="outlined" size="small" @click="clearFilters">
            {{ locale?.toolbar.clearFilters ?? 'Clear Filters' }}
          </v-btn>

          <v-spacer />

          <v-chip v-if="activeFilterCount > 0" color="primary" size="small">
            <span v-if="locale?.toolbar.activeFilters">
              {{ locale.toolbar.activeFilters(activeFilterCount) }}
            </span>
            <span v-else> {{ activeFilterCount }} filter{{ activeFilterCount > 1 ? 's' : '' }} </span>
          </v-chip>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
  import type { CalendarFiltersEmits, CalendarFiltersProps, EventStatus, FilterOptions } from '@/plugin/types'
  import { debounce } from '@/plugin/utils'
  import { computed, ref, watch } from 'vue'
  import {
    VBtn,
    VCard,
    VChip,
    VCol,
    VRow,
    VSelect,
    VSpacer,
    VTextField
  } from 'vuetify/components'
  import { useLocale } from '../composables/useLocale'

  // Component registration for library usage
  defineOptions({
    components: {
      VCard,
      VRow,
      VCol,
      VTextField,
      VSelect,
      VChip,
      VBtn,
      VSpacer
    }
  })

  const locale = useLocale()

  const props = defineProps<CalendarFiltersProps>()
  const emit = defineEmits<CalendarFiltersEmits>()

  const searchText = ref(props.filters.search || '')
  const selectedStatuses = ref<EventStatus[]>(props.filters.statuses || [])

  const statusOptions: { title?: string; value: EventStatus }[] = [
    { title: locale.status.open, value: 'open' as EventStatus },
    { title: locale.status.planned, value: 'planned' as EventStatus },
    { title: locale.status.completed, value: 'completed' as EventStatus },
    { title: locale.status.overdue, value: 'overdue' as EventStatus },
    { title: locale.status.cancelled, value: 'cancelled' as EventStatus },
  ]

  const activeFilterCount = computed(() => {
    let count = 0
    if (searchText.value) count++
    if (selectedStatuses.value.length > 0) count++
    return count
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

  const debouncedEmitFilters = debounce(() => {
    const filters: FilterOptions = {}

    if (searchText.value) {
      filters.search = searchText.value
    }

    if (selectedStatuses.value.length > 0) {
      filters.statuses = selectedStatuses.value
    }

    emit('filters-change', { filters })
  }, 300)

  const handleSearchChange = () => {
    debouncedEmitFilters()
  }

  const handleStatusChange = () => {
    debouncedEmitFilters()
  }

  const clearFilters = () => {
    searchText.value = ''
    selectedStatuses.value = []
    emit('filters-change', { filters: {} })
  }

  // Watch for external filter changes
  watch(
    () => props.filters,
    (newFilters) => {
      searchText.value = newFilters.search || ''
      selectedStatuses.value = newFilters.statuses || []
    },
    { deep: true }
  )
</script>

<style scoped>
  .calendar-filters {
    border: 1px solid rgba(0, 0, 0, 0.12);
  }
</style>
