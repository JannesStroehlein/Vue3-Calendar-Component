<h1 align="center">
  Vue 3 Calendar Component
</h1>
<p align="center">
<p align="center">
A comprehensive Vue 3 Calendar component with Vuetify 3, TypeScript, and advanced features including drag & drop, lazy loading, filtering, and multiple view modes.
</p>
</p>

<h4 align="center">
  <a href="https://github.com/JannesStroehlein/Vue3-Calendar-Component/blob/main/LICENSE.md">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Vue3 Calendar Component is released under the MIT license" />
  </a>
  <a href="https://github.com/JannesStroehlein/Vue3-Calendar-Component/actions/workflows/ci.yml">
    <img src="https://github.com/JannesStroehlein/Vue3-Calendar-Component/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI Status" />
  </a>
</h4>

<img src="/assets/banner.png" width="100%" alt="Banner" />

## Features

- 🗓️ **Multiple Views**: Month, Week, and Day/Agenda views
- 🎨 **Customizable Events**: Configurable colors, icons, and status indicators
- 🌍 **Localization**: Full i18n support using Vuetify & dayjs
- 📱 **Responsive**: Mobile-friendly design with TailwindCSS
- 🔍 **Filtering**: Text search, status filters, and custom filter methods
- 🎯 **Drag & Drop**: Easy event rescheduling with customizable callbacks
- ⚡ **Lazy Loading**: Load data on-demand for optimal performance
- 🔒 **Type Safe**: Full TypeScript support

## Installation

```bash
npm install vue3-calendar-component
# or
yarn add vue3-calendar-component
# or
bun add vue3-calendar-component
```

## Quick Start

The following code snippets show a sample usage of the calendar component. If you want to see a more comprehensive example, please refer to the [demo project](src/demo/).

### Vue Plugin Installation

To use this component you need to register it as a Vue plugin.

```typescript
import '@mdi/font/css/materialdesignicons.css'
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

import 'vue3-calendar-component/styles' // Import the styles
import Vue3CalendarComponent from 'vue3-calendar-component'
import locale_de from 'vue3-calendar-component/locale/de' // (Optional) Import a localization

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
  // Set the default locale
  locale: locale_de,
  // Set the default calendar config
  calendarConfig: {
    firstDayOfWeek: 'monday',
    showWeekNumbers: true,
    maxTime: '22:00',
    minTime: '8:00',
    showTimeGrid: false,
    timeSlotDuration: 60,
  },
})

app.mount('#app')
```

### Basic Usage

```vue
<template>
  <CalendarComponent view="month" :events="events" />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { CalendarComponent, type CalendarEvent } from 'vue3-calendar-component'

  const events = ref<CalendarEvent[]>([
    {
      id: '1',
      title: 'Meeting',
      start: '2025-07-01T10:00:00',
      end: '2025-07-01T11:00:00',
      status: 'planned',
      color: '#1976d2',
    },
  ])
</script>
```

## Documentation

For detailed documentation, examples, and API reference, see the [docs](./docs) folder.

## Troubleshooting

### "Failed to resolve component: v-icon" Error

If you encounter this error, ensure that:

1. **Vuetify is properly installed and configured:**

```bash
npm install vuetify @mdi/font
```

2. **Icons are properly configured in your Vuetify setup:**

```typescript
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi', // This is important!
  },
})

app.use(vuetify)
```

3. **All required dependencies are peer dependencies:**
   Make sure `vue`, `vuetify`, and optionally `pinia` are installed in your project as they are peer dependencies.

The calendar component has been updated to properly import Vuetify components for library usage, but proper Vuetify configuration is still required in the consuming application.

## Contributing

We use [Conventional Commits](https://www.conventionalcommits.org/) for automated semantic versioning and changelog generation.

### Quick Start for Contributors

```bash
# Clone and setup
git clone https://github.com/JannesStroehlein/Vue3-Calendar-Component
cd vue3-calendar-component
npm install

# Make changes and commit with conventional commits
npm run commit  # Interactive commit helper

# Or commit manually
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
```

For detailed contributing guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT License - see [LICENSE.md](./LICENSE.md) for details.
