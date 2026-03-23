import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // Desativa o sourcemap que pode causar o eval
  },
  css: {
    devSourcemap: false, // Também desativa para o CSS
  }
})