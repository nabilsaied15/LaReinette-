import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-512x512.png'],
      workbox: {
        // Bundle JS principal ~2.25 Mo : limite Workbox par défaut = 2 Mo
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff2}'],
      },
      manifest: {
        name: 'La Reinette - Transport Seniors',
        short_name: 'La Reinette',
        description: 'Service de transport à la demande pour les seniors de Bourg-la-Reine',
        theme_color: '#155724',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 2500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('pdf-lib')) return 'pdf-lib'
          if (id.includes('docx')) return 'docx'
          if (id.includes('jspdf')) return 'jspdf'
          if (id.includes('three') || id.includes('@react-three')) return 'three'
          if (id.includes('@supabase')) return 'supabase'
          if (id.includes('framer-motion')) return 'framer-motion'
          if (id.includes('lucide-react')) return 'lucide'
          if (id.includes('@emailjs')) return 'emailjs'

          return 'vendor'
        },
      },
    },
  },
})
