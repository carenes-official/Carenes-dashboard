import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '69.62.117.207',
    // host: '0.0.0.0',
    allowedHosts: ['admin.carenes.de'],
  },
  preview: {
    allowedHosts: ['admin.carenes.de'],
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Long-lived vendor chunks so app deploys don't bust library caches.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('jodit')) return 'vendor-editor'
          if (id.includes('chart.js') || id.includes('react-chartjs-2')) return 'vendor-charts'
          if (
            id.includes('node_modules/antd') ||
            id.includes('@ant-design') ||
            id.includes('node_modules/rc-') ||
            id.includes('@rc-component')
          )
            return 'vendor-antd'
          if (id.includes('react-icons')) return 'vendor-icons'
          return 'vendor'
        },
      },
    },
  },
})
