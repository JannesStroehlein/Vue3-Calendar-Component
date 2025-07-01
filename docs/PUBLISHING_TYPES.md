# Publishing Type Definitions Guide

This guide explains how the package is configured to publish TypeScript type definitions along with the JavaScript bundle.

## 📁 Package Structure

When built, the package will have this structure:

```
dist/
├── index.js              # ES module bundle
├── index.umd.cjs         # UMD bundle for CDN/browser
├── index.d.ts            # Main type definitions
├── style.css             # Component styles
└── types/                # Additional type files
    ├── calendar.d.ts
    ├── index.d.ts
    └── ...
```

## 🔧 Configuration Files

### 1. package.json Export Configuration

```json
{
  "main": "dist/index.js",
  "module": "dist/index.js", 
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.umd.cjs", 
      "types": "./dist/index.d.ts"
    },
    "./dist/style.css": "./dist/style.css"
  },
  "files": ["dist", "README.md", "LICENSE.md"]
}
```

### 2. TypeScript Build Configuration (tsconfig.build.json)

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true, 
    "emitDeclarationOnly": false,
    "outDir": "dist"
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.test.ts", "**/*.spec.ts"]
}
```

### 3. Vite Configuration (vite.config.ts)

```typescript
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*'],
      exclude: ['**/*.test.ts'],
      staticImport: true,
      insertTypesEntry: true,
      rollupTypes: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'umd'],
      fileName: (format) => \`index.\${format === 'es' ? 'js' : \`\${format}.cjs\`}\`
    }
  }
})
```

## 📦 Build Process

### Build Script
```bash
npm run build
```

This runs:
1. `vite build` - Creates JS bundles and basic type definitions
2. `vue-tsc --project tsconfig.build.json --emitDeclarationOnly` - Generates comprehensive type definitions

### Output Files
- **index.js** - ES module bundle
- **index.umd.cjs** - UMD bundle for browsers/CDN
- **index.d.ts** - Main type definition file
- **style.css** - Component styles
- **Additional .d.ts files** - Individual type definitions

## 🚀 Publishing

### Automatic Publishing (Recommended)
Semantic Release handles publishing automatically:

```bash
git commit -m "feat: add new calendar feature"
git push origin main
# → Triggers automatic build, version bump, and NPM publish
```

### Manual Publishing
```bash
npm run build        # Build the package
npm publish         # Publish to NPM
```

## 💡 Usage Examples

### ES Modules (TypeScript/Modern JS)
```typescript
import Vue3CalendarComponent, { 
  CalendarComponent, 
  type CalendarEvent,
  type CalendarConfig 
} from 'vue3-calendar-component'

// Types are automatically available
const event: CalendarEvent = {
  id: '1',
  title: 'Meeting',
  start: new Date(),
  end: new Date()
}
```

### CommonJS (Node.js)
```javascript
const { CalendarComponent } = require('vue3-calendar-component')
// Type definitions still available in TypeScript projects
```

### CDN/Browser (UMD)
```html
<script src="https://unpkg.com/vue3-calendar-component/dist/index.umd.cjs"></script>
<link rel="stylesheet" href="https://unpkg.com/vue3-calendar-component/dist/style.css">
```

## 🔍 Type Definition Features

### 1. Complete Type Coverage
- All component props with descriptions
- Event interfaces and enums
- Utility function signatures
- Store types and actions

### 2. Vue Component Types
```typescript
// Component is properly typed for Vue
import { CalendarComponent } from 'vue3-calendar-component'

// Props are type-checked
<CalendarComponent 
  :events="events"           // CalendarEvent[]
  view="month"              // 'month' | 'week' | 'day' | 'agenda'
  :config="config"          // CalendarConfig
  @event-click="handler"    // (event: CalendarEvent) => void
/>
```

### 3. Type Augmentation
```typescript
// Extends Vue app types when using the plugin
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $calendar: CalendarStore
  }
}
```

## 🐛 Troubleshooting

### Types Not Found
1. **Check TypeScript version**: Requires TypeScript 4.5+
2. **Verify import path**: Use exact package name
3. **Clear node_modules**: `rm -rf node_modules && npm install`

### Build Issues
1. **Missing vite-plugin-dts**: `npm install vite-plugin-dts --save-dev`
2. **Type conflicts**: Check tsconfig.build.json excludes test files
3. **Vue component types**: Ensure @vitejs/plugin-vue is configured

### Runtime vs Build Types
- **Runtime**: Development and testing
- **Build**: Production bundle generation
- Use separate configs to avoid conflicts

## 📚 Best Practices

### 1. Export Strategy
```typescript
// src/index.ts - Main entry point
export { default } from './plugin'           // Default Vue plugin
export { CalendarComponent } from './components'  // Individual components  
export type * from './types'                 // All types
export * from './utils'                      // Utility functions
```

### 2. Type Organization
```
src/types/
├── index.ts          # Re-export all types
├── calendar.ts       # Calendar-specific types
├── events.ts         # Event-related types
└── config.ts         # Configuration types
```

### 3. Documentation
- Use JSDoc comments for type descriptions
- Provide usage examples in type definitions
- Document breaking changes in types

### 4. Version Management
- Follow semantic versioning for type changes
- Breaking type changes = major version bump
- New optional properties = minor version bump
- Bug fixes in types = patch version bump

## ✅ Verification

After publishing, verify types work:

```bash
# Create test project
mkdir test-types && cd test-types
npm init -y
npm install typescript vue vue3-calendar-component
npx tsc --init

# Test import
echo "import { CalendarComponent } from 'vue3-calendar-component'" > test.ts
npx tsc test.ts --noEmit
```

The package is now properly configured to publish comprehensive TypeScript type definitions! 🎉
