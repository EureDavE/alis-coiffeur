import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    sourcemap: false,
    cssMinify: true,
    reportCompressedSize: false,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        preise: fileURLToPath(new URL('./preise.html', import.meta.url)),
      },
    },
  },
})
