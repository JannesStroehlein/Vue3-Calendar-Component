import '@mdi/font/css/materialdesignicons.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import './style.css'

import Vue3CalendarComponent from '../plugin/index'
import App from './App.vue'

const pinia = createPinia()
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
  },
})

const app = createApp(App)

app.use(pinia)
app.use(vuetify)
app.use(Vue3CalendarComponent, {
  calendarConfig: {
    firstDayOfWeek: 'monday',
    minTime: '00:00',
    maxTime: '24:00',
    timeSlotDuration: 60,
    showWeekNumbers: false,
    showTimeGrid: true,
    timeGridDivisions: 4,
    startOfWeekFormat: 'MMM D',
    endOfWeekFormat: 'MMM D, YYYY',
    dayFormat: 'dddd, MMMM D, YYYY',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    monthFormat: 'MMMM YYYY',
  },
})

app.mount('#app')
