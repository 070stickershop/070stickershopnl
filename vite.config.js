import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-redirects',
      closeBundle() {
        const source = path.resolve('_redirects')
        const destinationDir = path.resolve('dist')
        const destination = path.join(destinationDir, '_redirects')

        // ✅ Maak dist/ aan als die nog niet bestaat
        if (!fs.existsSync(destinationDir)) {
          fs.mkdirSync(destinationDir, { recursive: true })
        }

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
