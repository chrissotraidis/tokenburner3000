import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { liveApiVitePlugin } from './server/live-api.mjs'

export default defineConfig({
  plugins: [liveApiVitePlugin(), react(), tailwindcss()],
})
