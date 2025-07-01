import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts';
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*'],
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Vue3CalendarComponent',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format === 'es' ? 'js' : `${format}.cjs`}`
    },
    rollupOptions: {
      external: ['vue', 'vuetify', 'pinia', 'dayjs'],
      output: {
        globals: {
          vue: 'Vue',
          vuetify: 'Vuetify',
          pinia: 'Pinia',
          dayjs: 'dayjs'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.ts'],
    exclude: ['tests/e2e/**/*'],
    globals: true,
    css: false, // Disable CSS processing in tests
    server: {
      deps: {
        inline: ['vuetify'] // Force Vuetify to be processed by Vite
      }
    }
  }
})
