import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import { wrapperEnv } from './src/utils/ENV-PROCESSOR__VITE--WRAPPER'
import { createVitePlugins } from './src/utils/PLUGINS__VITE--UNIFIED'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load and process environment variables
  const env = loadEnv(mode, process.cwd())
  const viteEnv = wrapperEnv(env)
  const { VITE_PORT, VITE_PUBLIC_PATH } = viteEnv

  return {
    plugins: createVitePlugins({
      isDev: mode === 'development',
      enableAutoImport: true,
      componentResolvers: [],
      enableCompression: mode === 'production',
      enableBundleAnalysis: mode === 'production'
    }),
    
    base: VITE_PUBLIC_PATH || '/',
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '~': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@views': path.resolve(__dirname, 'src/views'),
        '@stores': path.resolve(__dirname, 'src/stores'),
        '@utils': path.resolve(__dirname, 'src/utils')
      },
      // File extensions to omit when importing files
      extensions: [
        '.mjs',
        '.js',
        '.ts',
        '.jsx',
        '.tsx',
        '.json',
      ],
    },
    
    server: {
      host: true, // Specify server hostname - allows access from any host
      port: VITE_PORT, // Specify server port number
      open: false, // Automatically open application in browser when server starts
      strictPort: false, // Set to false to try next available port if current port is occupied
      https: false, // Whether to enable HTTPS protocol
      cors: true, // Configure CORS for development server - enabled by default and allows any origin
    },
    
    build: {
      target: 'esnext',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'utils-vendor': ['axios']
          }
        }
      }
    },
    
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'axios']
    }
  }
})