/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@mdi/js' {
  export const mdiChevronLeft: string
  export const mdiChevronRight: string
  export const mdiCalendarBlank: string
  export const mdiClockOutline: string
  export const mdiMapMarker: string
  export const mdiMagnify: string
  export const mdiAccountGroup: string
  export const mdiFlag: string
  export const mdiStar: string
}
