import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { 
    historyApiFallback: true,
    watch: {
      usePolling: true,
    }
  },
  preview: { port: 4173, historyApiFallback: true },
})