import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './style.css'

import Vue3CalendarComponent from '../index'
import App from './App.vue'

const pinia = createPinia()
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light'
  }
})

const app = createApp(App)

app.use(pinia)
app.use(vuetify)
app.use(Vue3CalendarComponent, {
  globalConfig: {
    firstDayOfWeek: 1,
    timeSlotDuration: 60,
    minTime: '08:00',
    maxTime: '18:00',
    showTimeGrid: true,
    locale: 'en'
  }
})

app.mount('#app')
