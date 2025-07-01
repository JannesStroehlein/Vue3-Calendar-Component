# Vue 3 Calendar Copilot

A comprehensive Vue 3 Calendar component with Vuetify 3, TypeScript, and advanced features including drag & drop, lazy loading, filtering, and multiple view modes.

## Features

- 🗓️ **Multiple Views**: Month, Week, and Day/Agenda views
- 🎨 **Customizable Events**: Configurable colors, icons, and status indicators
- 🌍 **Localization**: Full i18n support using Vuetify & dayjs
- 📱 **Responsive**: Mobile-friendly design with TailwindCSS
- 🔍 **Filtering**: Text search, status filters, and custom filter methods
- 🎯 **Drag & Drop**: Easy event rescheduling with customizable callbacks
- ⚡ **Lazy Loading**: Load data on-demand for optimal performance
- 🔒 **Type Safe**: Full TypeScript support
- 🧪 **Well Tested**: Comprehensive unit and E2E tests

## Installation

```bash
npm install vue3-calendar-copilot
# or
yarn add vue3-calendar-copilot
# or
bun add vue3-calendar-copilot
```

## Quick Start

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import Vue3CalendarComponent from 'vue3-calendar-copilot'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
const vuetify = createVuetify()

app.use(pinia)
app.use(vuetify)
app.use(Vue3CalendarComponent)

app.mount('#app')
```

## Basic Usage

```vue
<template>
  <CalendarComponent
    :events="events"
    view="month"
    @event-click="handleEventClick"
    @event-drop="handleEventDrop"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CalendarEvent } from 'vue3-calendar-copilot'

const events = ref<CalendarEvent[]>([
  {
    id: '1',
    title: 'Meeting',
    start: '2025-07-01T10:00:00',
    end: '2025-07-01T11:00:00',
    status: 'planned',
    color: '#1976d2'
  }
])

const handleEventClick = (event: CalendarEvent) => {
  console.log('Event clicked:', event)
}

const handleEventDrop = (event: CalendarEvent, newDate: Date) => {
  console.log('Event dropped:', event, 'New date:', newDate)
}
</script>
```

## Documentation

For detailed documentation, examples, and API reference, see the [docs](./docs) folder.

## Contributing

We use [Conventional Commits](https://www.conventionalcommits.org/) for automated semantic versioning and changelog generation.

### Quick Start for Contributors

```bash
# Clone and setup
git clone <repository-url>
cd vue3-calendar-copilot
npm install

# Make changes and commit with conventional commits
npm run commit  # Interactive commit helper

# Or commit manually
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
```

### Commit Types
- `feat`: New features → Minor version bump
- `fix`: Bug fixes → Patch version bump  
- `docs`: Documentation changes
- `test`: Adding tests
- `refactor`: Code refactoring
- `chore`: Maintenance tasks

For detailed contributing guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

### Automated Releases

Releases are automatically created when commits are pushed to the `main` branch:
- Semantic versioning based on commit messages
- Automatic changelog generation
- GitHub releases with release notes
- NPM package publishing

## Development

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Run tests
bun test

# Run E2E tests
bun test:e2e

# Build for production
bun build

# Lint code
bun lint

# Format code
bun format
```

## License

MIT License - see [LICENSE.md](./LICENSE.md) for details.
