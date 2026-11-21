import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { SITE_URL } from './site-config.mjs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'school-site-url',
      transformIndexHtml(html) {
        return html.replaceAll('__SITE_URL__', SITE_URL)
      },
    },
  ],
  build: {
    outDir: 'dist/client',
  },
})
