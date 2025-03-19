import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
 
  plugins: [react(),],
  resolve: {
    alias: {
      Modules: "/src/Modules",
      routes: "/src/routes",
      Shared: "/src/Shared",
      assets: "/src/assets",
      data: "/src/data",
      config: "/src/config",
        
    },
  },
})
