import react from '@vitejs/plugin-react'
import * as path from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr({include: '../**/*.svg'})],
  resolve: {
    alias: {"@/Components": path.resolve(__dirname, "../src/components")},
   },
})
