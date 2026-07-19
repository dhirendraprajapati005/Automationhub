import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { initAnalytics } from '@/lib/analytics'
import './index.css'
import App from './App.tsx'

// autoUpdate: the service worker checks for a new build in the background
// and swaps it in silently on the next navigation — no "reload to update"
// prompt needed for a content site like this.
registerSW({ immediate: true })
initAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
