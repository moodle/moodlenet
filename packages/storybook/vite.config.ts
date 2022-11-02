import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

module.exports = {
  root: 'src',
  build: {
    outDir: '../lib',
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
})
