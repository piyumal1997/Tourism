import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite' 

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',     // ← Backend port
        changeOrigin: true,
        secure: false,
      }
    }
  }
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, './src'),
  //     '@assets': path.resolve(__dirname, './src/assets'),
  //     '@components': path.resolve(__dirname, './src/components'),
  //     '@features': path.resolve(__dirname, './src/features'),
  //     '@pages': path.resolve(__dirname, './src/pages'),
  //     '@services': path.resolve(__dirname, './src/services'),
  //   }
  // },
  // css: {
  //   modules: {
  //     localsConvention: 'camelCaseOnly'
  //   }
  // },
  // build: {
  //   rollupOptions: {
  //     external: ['react', 'react-dom', 'react-router-dom'] // Try adding this if all else fails
  //   }
  // }
})
