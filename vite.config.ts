import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this repository at /rs-porfolio/ rather than the domain root.
  base: '/rs-porfolio/',
  plugins: [react()],
})
