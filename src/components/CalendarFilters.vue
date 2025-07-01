<template>
  <v-card class="calendar-filters pa-4 mb-4">
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="searchText"
          label="Search events"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          @input="handleSearchChange"
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-select
          v-model="selectedStatuses"
          :items="statusOptions"
          label="Filter by status"
          multiple
          variant="outlined"
          density="compact"
          chips
          closable-chips
          @update:model-value="handleStatusChange"
        >
          <template #chip="{ props, item }">
            <v-chip
              v-bind="props"
              :color="getStatusColor(item.value)"
              size="small"
            >
              {{ item.title }}
            </v-chip>
          </template>
        </v-select>
      </v-col>

      <v-col cols="12" md="4">
        <div class="d-flex align-center">
          <v-btn
            variant="outlined"
            size="small"
            @click="clearFilters"
          >
            Clear Filters
          </v-btn>
          
          <v-spacer />
          
          <v-chip
            v-if="activeFilterCount > 0"
            color="primary"
            size="small"
          >
            {{ activeFilterCount }} filter{{ activeFilterCount > 1 ? 's' : '' }}
          </v-chip>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import type { FilterOptions, EventStatus } from '@/types'
  import { debounce } from '@/utils'

  export interface CalendarFiltersProps {
    filters: FilterOptions
  }

  export interface CalendarFiltersEmits {
    (e: 'filters-change', filters: FilterOptions): void
  }

  const props = defineProps<CalendarFiltersProps>()
  const emit = defineEmits<CalendarFiltersEmits>()

  const searchText = ref(props.filters.search || '')
  const selectedStatuses = ref<EventStatus[]>(props.filters.statuses || [])

  const statusOptions = [
    { title: 'Open', value: 'open' as EventStatus },
    { title: 'Planned', value: 'planned' as EventStatus },
    { title: 'Completed', value: 'completed' as EventStatus },
    { title: 'Overdue', value: 'overdue' as EventStatus },
    { title: 'Cancelled', value: 'cancelled' as EventStatus },
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

    emit('filters-change', filters)
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
    emit('filters-change', {})
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
