import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { historyApiFallback: true },       // fixes reload in dev
  preview: { port: 4173, historyApiFallback: true }, // fixes reload in preview
})