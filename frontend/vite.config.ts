import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // The manifest lives here now instead of public/manifest.webmanifest —
      // the plugin generates and injects it, keeping the service worker and
      // manifest in sync automatically.
      manifest: {
        name: 'AutomationHub — Free Industrial Automation Learning',
        short_name: 'AutomationHub',
        description:
          'Free learning platform for PLC programming, HMI, SCADA, VFD, servo systems, sensors, pneumatics, robotics, and industrial networking.',
        theme_color: '#12151A',
        background_color: '#12151A',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // Precache the built app shell (JS/CSS/HTML) for offline navigation.
        globPatterns: ['**/*.{js,css,html,svg}'],
        // Runtime caching for API GET requests: network-first so content
        // stays fresh when online, falling back to cache when offline —
        // appropriate for a content site where staleness is a much smaller
        // problem than a blank screen with no connection.
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/') ,
            handler: 'NetworkFirst',
            method: 'GET',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 }, // 1 day
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
        navigateFallback: '/index.html',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
