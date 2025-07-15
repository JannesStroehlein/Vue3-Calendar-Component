import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      include: ['src/plugin/locale/**/*'],
      outDir: 'dist/plugin',
      insertTypesEntry: false
    }),
  ],
  build: {
    outDir: 'dist/plugin',
    lib: {
      entry: {
        'locale/en': resolve(__dirname, 'src/plugin/locale/en.ts'),
        'locale/de': resolve(__dirname, 'src/plugin/locale/de.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        return `${entryName}.${format === 'es' ? 'js' : 'cjs'}`
      },
    },
    rollupOptions: {
      external: ['vue', 'vuetify', 'dayjs'],
    },
  },
})
