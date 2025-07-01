import type { App } from 'vue'
import CalendarComponent from './components/CalendarComponent.vue'
import type { CalendarConfig } from './types'

export interface Vue3CalendarComponentOptions {
  globalConfig?: Partial<CalendarConfig>
  componentName?: string
}

export default {
  install(app: App, options: Vue3CalendarComponentOptions = {}) {
    const componentName = options.componentName || 'CalendarComponent'
    
    // Register the main component
    app.component(componentName, CalendarComponent)

    // Provide global config if specified
    if (options.globalConfig) {
      app.provide('calendarGlobalConfig', options.globalConfig)
    }
  }
}

// Export components for manual registration
export { CalendarComponent }

// Export all types
export type * from './types'

// Export utilities
export * from './utils'

// Export stores
export * from './stores'

// Export composables
export * from './composables'
