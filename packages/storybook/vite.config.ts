import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vite'

console.log('sono da vite config')
process.exit()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
})
