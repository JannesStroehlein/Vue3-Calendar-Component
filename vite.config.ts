import vue from '@vitejs/plugin-vue'
import vuetify from "vite-plugin-vuetify";
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import pkg from './package.json';

export default defineConfig({
  plugins: [
    vue({
      template: {
      }
    }),
    vuetify({
      autoImport: false,
      styles: "none"
    }),
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
      external: [
        ...Object.keys(pkg.dependencies || {}),
				/^vuetify($|\/.+)/,
      ],
      output: {
        exports: 'named',
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
