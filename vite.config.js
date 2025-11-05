import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-redirects',
      closeBundle() {
        const source = '_redirects'
        const destination = 'dist/_redirects'
        if (fs.existsSync(source)) {
          fs.copyFileSync(source, destination)
          console.log(`✅ Copied _redirects to ${destination}`)
        } else {
          console.warn('⚠️ No _redirects file found to copy.')
        }
      },
    },
  ],
})