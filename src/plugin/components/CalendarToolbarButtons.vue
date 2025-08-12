<template>
  <v-toolbar density="compact" class="calendar-toolbar">
    <v-tooltip :text="locale.current.value.toolbar.buttons.previous || 'Previous'">
      <template #activator="{ props: toolTipProps }">
        <v-btn v-bind="toolTipProps" icon :disabled="loading" @click="$emit('navigate-previous')">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <v-tooltip :text="locale.current.value.toolbar.buttons.next || 'Next'">
      <template #activator="{ props: toolTipProps }">
        <v-btn v-bind="toolTipProps" icon :disabled="loading" @click="$emit('navigate-next')">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <v-btn variant="text" :disabled="loading" class="mx-2" @click="$emit('navigate-today')">
      {{ locale.current.value.toolbar.buttons.today || 'Today' }}
    </v-btn>

    <v-spacer />

    <div class="calendar-title">
      <h2 class="text-h6">
        {{ formattedDate }}
      </h2>
    </div>

    <v-spacer />

    <v-btn-toggle
      :model-value="currentView"
      mandatory
      variant="outlined"
      divided
      class="view-toggle"
      @update:model-value="handleViewChange"
    >
      <v-btn value="month" size="small">
        {{ locale.current.value.toolbar.buttons.month || 'Month' }}
      </v-btn>
      <v-btn value="week" size="small">
        {{ locale.current.value.toolbar.buttons.week || 'Week' }}
      </v-btn>
      <v-btn value="day" size="small">
        {{ locale.current.value.toolbar.buttons.day || 'Day' }}
      </v-btn>
      <v-btn value="agenda" size="small">
        {{ locale.current.value.toolbar.buttons.agenda || 'Agenda' }}
      </v-btn>
    </v-btn-toggle>

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      class="position-absolute"
      style="bottom: 0; left: 0; right: 0"
    />
  </v-toolbar>
</template>

<script setup lang="ts">
  import type {
    CalendarToolbarEmits as CalendarToolbarButtonsEmits,
    CalendarToolbarButtonsProps,
    CalendarView,
  } from '@/plugin/types'
  import { computed } from 'vue'
  import { VBtn, VBtnToggle, VIcon, VProgressLinear, VSpacer, VToolbar } from 'vuetify/components'
  import { useLocale } from '../composables/useLocale'

  const locale = useLocale()
  const { localizedDayjs } = locale

  // Component registration for library usage
  defineOptions({
    components: {
      VBtn,
      VIcon,
      VToolbar,
      VSpacer,
      VBtnToggle,
      VProgressLinear,
    },
  })

  const props = withDefaults(defineProps<CalendarToolbarButtonsProps>(), {
    loading: false,
  })

  const emit = defineEmits<CalendarToolbarButtonsEmits>()

  const formattedDate = computed(() => {
    const localizedCurrentDate = localizedDayjs.value(props.currentDate)

    switch (props.currentView) {
      case 'week': {
        const startOfWeek = localizedDayjs
          .value(localizedCurrentDate.startOf('week'))
          .format(locale.current.value.formats.startOfWeek ?? 'MMM D')
        const endOfWeek = localizedDayjs
          .value(localizedCurrentDate.endOf('week'))
          .format(locale.current.value.formats.endOfWeek ?? 'MMM D, YYYY')
        return `${startOfWeek} - ${endOfWeek}`
      }
      case 'day':
      case 'agenda':
        return localizedCurrentDate.format(locale.current.value.formats.day ?? 'dddd, MMMM D, YYYY')

      case 'month':
      default:
        return localizedCurrentDate.format(locale.current.value.formats.month ?? 'MMMM YYYY')
    }
  })

  const handleViewChange = (view: CalendarView) => {
    if (view && view !== props.currentView) {
      emit('view-change', { oldView: props.currentView, newView: view, currentDate: props.currentDate })
    }
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
