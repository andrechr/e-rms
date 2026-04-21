import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    force: command === 'serve'
  },
  server: {
    watch: {
      usePolling: true
    }
  }
}))
