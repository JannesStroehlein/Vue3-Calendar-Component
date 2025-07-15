import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*'],
      exclude: ['src/demo/**/*']
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Vue3CalendarComponent',
      formats: ['es', 'umd'],
      cssFileName: 'styles',
      fileName: (format) => `index.${format === 'es' ? 'js' : `${format}.cjs`}`,
    },
    rollupOptions: {
      external: ['vue', 'vuetify', 'dayjs'],
      output: {
        globals: {
          vue: 'Vue',
          vuetify: 'Vuetify',
          dayjs: 'dayjs',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
