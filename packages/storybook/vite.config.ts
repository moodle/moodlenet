import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import reactSvg from 'vite-plugin-react-svg'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), reactSvg()]
})
