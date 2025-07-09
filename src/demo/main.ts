import '@mdi/font/css/materialdesignicons.css'
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import './style.css'

import { locale } from '@/plugin/locale/en'
import Vue3CalendarComponent from '../plugin/index'
import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
  },
})

const app = createApp(App)

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
  },
  locale: locale,
})

app.mount('#app')
