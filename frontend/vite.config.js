import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/items': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    server: {
      deps: {
        inline: ['html-encoding-sniffer']
      }
    }
  }
})