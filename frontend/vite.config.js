import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Performance optimizations
  build: {
    // Enable source maps for production debugging
    sourcemap: false,
    
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-avatar'],
          utils: ['axios', 'redux', 'redux-persist']
        }
      }
    },
    
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000
  },
  
  // Development server optimizations
  server: {
    port: 5173,
    host: true,
    // Enable HMR for faster development
    hmr: {
      overlay: false
    }
  },
  
  // Preview server optimizations
  preview: {
    port: 4173,
    host: true
  },
  
  // Resolve aliases for better imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@redux': resolve(__dirname, 'src/redux'),
      '@hooks': resolve(__dirname, 'src/hooks')
    }
  },
  
  // CSS optimizations
  css: {
    // Enable CSS source maps in development
    devSourcemap: true
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'redux',
      'redux-persist'
    ]
  },
  
  // Performance hints
  define: {
    // Remove console.log in production
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  }
})
