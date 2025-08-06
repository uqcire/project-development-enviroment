/**
 * Unified Vite Plugins Configuration
 * 
 * This file consolidates all Vite plugins and provides a single source
 * for plugin configuration with detailed explanations of each plugin's purpose.
 */

import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

/**
 * Creates and configures all Vite plugins for the application
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.isDev - Whether running in development mode
 * @param {boolean} options.enableAutoImport - Enable automatic imports
 * @param {Array} options.componentResolvers - Component library resolvers
 * @param {boolean} options.enableCompression - Enable file compression
 * @param {boolean} options.enableBundleAnalysis - Enable bundle analysis
 * @returns {Array} Array of configured Vite plugins
 */
export function createVitePlugins(options = {}) {
  const {
    isDev = true,
    enableAutoImport = true,
    componentResolvers = [],
    enableCompression = true,
    enableBundleAnalysis = true
  } = options

  const plugins = [
    // =============================================================================
    // CORE VUE PLUGIN
    // =============================================================================
    
    /**
     * @vitejs/plugin-vue
     * 
     * PURPOSE: Core Vue 3 support for Vite
     * 
     * WHAT IT DOES:
     * - Compiles .vue Single File Components (SFC)
     * - Handles Vue 3 Composition API and script setup syntax
     * - Processes Vue templates, scripts, and styles
     * - Enables hot module replacement (HMR) for Vue components
     * - Supports Vue-specific optimizations
     * 
     * BENEFITS:
     * - Fast development with instant component updates
     * - Modern Vue 3 features support
     * - Optimized build output
     */
    vue({
      // Include files to be processed as Vue components
      include: [/\.vue$/],
      
      // Enable reactive transform (experimental)
      reactivityTransform: false,
      
      // Script setup options
      script: {
        // Enable defining props, emits, etc. in script setup
        defineModel: true,
        // Enable props destructuring
        propsDestructure: true
      },
      
      // Template compilation options
      template: {
        // Compile template with optimized mode
        compilerOptions: {
          // Remove comments in production
          comments: isDev
        }
      }
    }),

    // =============================================================================
    // AUTO IMPORT PLUGIN
    // =============================================================================
    
    /**
     * unplugin-auto-import
     * 
     * PURPOSE: Automatically import frequently used functions and composables
     * 
     * WHAT IT DOES:
     * - Automatically imports Vue composables (ref, reactive, computed, etc.)
     * - Auto-imports Vue Router functions (useRouter, useRoute)
     * - Auto-imports Pinia store functions (defineStore, storeToRefs)
     * - Eliminates need for manual import statements
     * - Generates TypeScript declarations for better IDE support
     * 
     * BEFORE (Manual imports):
     * import { ref, computed, onMounted } from 'vue'
     * import { useRouter } from 'vue-router'
     * import { useAuthStore } from '@/stores/auth'
     * 
     * AFTER (Auto-imported):
     * // No imports needed! Just use directly:
     * const count = ref(0)
     * const router = useRouter()
     * const authStore = useAuthStore()
     * 
     * BENEFITS:
     * - Cleaner, more concise code
     * - Reduced boilerplate
     * - Better developer experience
     * - Automatic TypeScript support
     */
    ...(enableAutoImport ? [
      AutoImport({
        // File types to process for auto-imports
        include: [
          /\.[tj]sx?$/,    // .ts, .tsx, .js, .jsx files
          /\.vue$/,        // .vue files
          /\.vue\?vue/,    // .vue files with query
          /\.md$/          // .md files (for documentation)
        ],
        
        // What to auto-import
        imports: [
          // Vue 3 core functions
          'vue',
          
          // Vue Router functions
          'vue-router',
          
          // Pinia store functions
          'pinia',
          
          // Custom auto-imports
          {
            // Import specific functions from HTTP client
            '@/utils/HTTP-CLIENT__API--UNIFIED': [
              'get',
              'post',
              'put',
              'del',
              'patch',
              'upload',
              'download',
              'isString',
              'isArray',
              'isObject',
              'isEmpty',
              'ifNull'
            ],
            
            // Import commonly used stores
            '@/stores/auth': ['useAuthStore'],
            '@/stores/ui': ['useUIStore']
          }
        ],
        
        // Generate TypeScript declaration file
        dts: false,
                
        // Custom resolvers for special cases
        resolvers: [
          // Add custom resolvers here if needed
        ],
        
        // Directories to scan for auto-imports
        dirs: [
          './src/composables/**',
          './src/utils/**'
        ],
        
        // Development-only imports
        ...(isDev && {
          imports: [
            {
              // Development helpers
              'console': [['log', 'console.log'], ['error', 'console.error']]
            }
          ]
        })
      })
    ] : []),

    // =============================================================================
    // COMPONENT AUTO-REGISTRATION PLUGIN
    // =============================================================================
    
    /**
     * unplugin-vue-components
     * 
     * PURPOSE: Automatically import and register Vue components
     * 
     * WHAT IT DOES:
     * - Scans your components directory
     * - Automatically imports components when used in templates
     * - Registers components globally without manual registration
     * - Supports component libraries (Element Plus, Ant Design, etc.)
     * - Generates TypeScript declarations for components
     * 
     * BEFORE (Manual component registration):
     * import Button from '@/components/COMPONENT__BUTTON--PRIMARY.vue'
     * import Modal from '@/components/COMPONENT__MODAL--DIALOG.vue'
     * 
     * export default {
     *   components: { Button, Modal }
     * }
     * 
     * AFTER (Auto-registered):
     * // Just use components directly in template:
     * <template>
     *   <Button type="primary">Click me</Button>
     *   <Modal v-model="showModal">Content</Modal>
     * </template>
     * 
     * BENEFITS:
     * - Zero import boilerplate for components
     * - Automatic tree-shaking (unused components excluded)
     * - Better developer experience
     * - TypeScript support for component props
     * - Support for component libraries
     */
    Components({
      // Directories to scan for components
      dirs: [
        'src/components',
        'src/views'
      ],
      
      // File extensions to include
      extensions: ['vue', 'tsx', 'jsx'],
      
      // Include subdirectories
      deep: true,
      
      // Component naming convention
      // Uses BEM naming: COMPONENT__NAME--VARIANT.vue
      resolvers: [
        // Add component library resolvers here
        // Example: ElementPlusResolver(), AntDesignVueResolver()
        ...componentResolvers
      ],
      
      // Generate TypeScript declarations
      dts: true,
      
      // Transform component names
      // COMPONENT__BUTTON--PRIMARY.vue → ComponentButtonPrimary
      directoryAsNamespace: false,
      
      // Global component registration
      globalNamespaces: ['global'],
      
      // Include/exclude patterns
      include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/, /\.jsx$/],
      exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
      
      // Custom component transformation
      transformer: 'vue3',
      
      // Allow overrides
      allowOverrides: true
    }),

    // =============================================================================
    // BUILD OPTIMIZATION PLUGINS
    // =============================================================================
    
    /**
     * vite-plugin-compression
     * 
     * PURPOSE: Compress build files to reduce bundle size
     * 
     * WHAT IT DOES:
     * - Compresses JavaScript, CSS, and other assets using gzip/brotli
     * - Creates compressed versions alongside original files
     * - Reduces file sizes by 60-80% typically
     * - Improves loading performance for production
     * - Works with web server gzip/brotli support
     * 
     * BENEFITS:
     * - Faster page load times
     * - Reduced bandwidth usage
     * - Better user experience
     * - Lower hosting costs
     * 
     * EXAMPLE:
     * main.js (100KB) → main.js.gz (25KB)
     * styles.css (50KB) → styles.css.gz (12KB)
     */
    ...(enableCompression && !isDev ? [
      viteCompression({
        // Compression algorithm
        algorithm: 'gzip',
        
        // File extension for compressed files
        ext: '.gz',
        
        // Only compress files larger than this threshold (10KB)
        threshold: 10240,
        
        // Don't delete original files after compression
        deleteOriginFile: false,
        
        // Show compression results in console
        verbose: true,
        
        // Compression level (1-9, 9 is highest compression)
        compressionOptions: {
          level: 9
        },
        
        // File types to compress
        filter: /\.(js|mjs|json|css|html|svg)$/i
      }),
      
      // Optional: Brotli compression (better than gzip)
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 10240,
        deleteOriginFile: false,
        verbose: true,
        compressionOptions: {
          level: 11 // Brotli compression level (0-11)
        },
        filter: /\.(js|mjs|json|css|html|svg)$/i
      })
    ] : []),

    /**
     * rollup-plugin-visualizer
     * 
     * PURPOSE: Analyze and visualize bundle composition
     * 
     * WHAT IT DOES:
     * - Generates an interactive HTML report showing bundle contents
     * - Displays file sizes, dependencies, and import relationships
     * - Shows which libraries take up the most space
     * - Helps identify optimization opportunities
     * - Provides treemap and sunburst visualizations
     * 
     * BENEFITS:
     * - Identify large dependencies
     * - Find duplicate code
     * - Optimize bundle splitting
     * - Monitor bundle size changes
     * - Make informed optimization decisions
     * 
     * GENERATES:
     * - dist/stats.html - Interactive bundle analysis
     * - Shows gzip and brotli compressed sizes
     * - Treemap view of all modules
     */
    ...(enableBundleAnalysis && !isDev ? [
      visualizer({
        // Output file location
        filename: 'dist/stats.html',
        
        // Auto-open analysis page after build
        open: true,
        
        // Analyze gzip compressed sizes
        gzipSize: true,
        
        // Analyze brotli compressed sizes  
        brotliSize: true,
        
        // Template type for visualization
        template: 'treemap', // Options: treemap, sunburst, network
        
        // Include source map information
        sourcemap: true,
        
        // Project root for relative paths
        projectRoot: process.cwd(),
        
        // Title for the analysis page
        title: 'Bundle Analysis - Project Development Environment'
      })
    ] : [])
  ]

  return plugins
}

// =============================================================================
// PLUGIN CONFIGURATIONS FOR DIFFERENT ENVIRONMENTS
// =============================================================================

/**
 * Development-specific plugins configuration
 * Includes all plugins with development optimizations
 */
export function createDevPlugins() {
  return createVitePlugins({
    isDev: true,
    enableAutoImport: true,
    componentResolvers: [],
    enableCompression: false, // No compression in dev
    enableBundleAnalysis: false // No analysis in dev
  })
}

/**
 * Production-specific plugins configuration
 * Optimized for build performance and bundle size
 */
export function createProdPlugins() {
  return createVitePlugins({
    isDev: false,
    enableAutoImport: true,
    componentResolvers: [],
    enableCompression: true, // Enable compression in production
    enableBundleAnalysis: true // Enable analysis in production
  })
}

/**
 * Testing-specific plugins configuration
 * Minimal plugins for faster test execution
 */
export function createTestPlugins() {
  return createVitePlugins({
    isDev: true,
    enableAutoImport: false, // Disable for explicit imports in tests
    componentResolvers: [],
    enableCompression: false, // No compression in tests
    enableBundleAnalysis: false // No analysis in tests
  })
}

// =============================================================================
// PLUGIN UTILITIES
// =============================================================================

/**
 * Get plugin information for debugging
 */
export function getPluginInfo() {
  return {
    vue: {
      name: '@vitejs/plugin-vue',
      purpose: 'Vue 3 Single File Component support',
      features: ['SFC compilation', 'HMR', 'Template processing']
    },
    autoImport: {
      name: 'unplugin-auto-import',
      purpose: 'Automatic function and composable imports',
      features: ['Vue composables', 'Router functions', 'Store functions', 'TypeScript support']
    },
    components: {
      name: 'unplugin-vue-components',
      purpose: 'Automatic component registration',
      features: ['Component scanning', 'Auto-registration', 'Library resolvers', 'TypeScript declarations']
    },
    compression: {
      name: 'vite-plugin-compression',
      purpose: 'File compression for production builds',
      features: ['Gzip compression', 'Brotli compression', 'Size reduction', 'Performance optimization']
    },
    bundleAnalysis: {
      name: 'rollup-plugin-visualizer',
      purpose: 'Bundle analysis and visualization',
      features: ['Bundle composition', 'Size analysis', 'Dependency tracking', 'Optimization insights']
    }
  }
}

/**
 * Validate plugin configuration
 */
export function validatePluginConfig(options = {}) {
  const errors = []
  
  if (options.componentResolvers && !Array.isArray(options.componentResolvers)) {
    errors.push('componentResolvers must be an array')
  }
  
  if (typeof options.enableAutoImport !== 'undefined' && typeof options.enableAutoImport !== 'boolean') {
    errors.push('enableAutoImport must be a boolean')
  }
  
  if (typeof options.enableCompression !== 'undefined' && typeof options.enableCompression !== 'boolean') {
    errors.push('enableCompression must be a boolean')
  }
  
  if (typeof options.enableBundleAnalysis !== 'undefined' && typeof options.enableBundleAnalysis !== 'boolean') {
    errors.push('enableBundleAnalysis must be a boolean')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// =============================================================================
// EXPORT DEFAULT FOR BACKWARD COMPATIBILITY
// =============================================================================

export default createVitePlugins

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/*
// Basic usage in vite.config.js:
import { createVitePlugins } from './src/build/PLUGINS__VITE--UNIFIED'

export default defineConfig({
  plugins: createVitePlugins()
})

// Advanced usage with options:
export default defineConfig({
  plugins: createVitePlugins({
    isDev: process.env.NODE_ENV === 'development',
    enableAutoImport: true,
    componentResolvers: [ElementPlusResolver()]
  })
})

// Environment-specific usage:
import { createDevPlugins, createProdPlugins } from './src/build/PLUGINS__VITE--UNIFIED'

export default defineConfig(({ mode }) => ({
  plugins: mode === 'development' ? createDevPlugins() : createProdPlugins()
}))

// In your Vue components, you can now use:
<template>
  <div>
    <!-- Components auto-imported -->
    <ComponentButtonPrimary @click="handleClick">Click me</ComponentButtonPrimary>
    
    <!-- Functions auto-imported -->
    <p>Count: {{ count }}</p>
  </div>
</template>

<script setup>
// All these are auto-imported, no need for manual imports:
const count = ref(0)              // from 'vue'
const router = useRouter()        // from 'vue-router'
const authStore = useAuthStore()  // from '@/stores/auth'

// HTTP functions auto-imported:
const users = await get('/users') // from '@/utils/HTTP-CLIENT__API--UNIFIED'

const handleClick = () => {
  count.value++
}

// Type checking functions auto-imported:
if (isString(someValue)) {        // from '@/utils/HTTP-CLIENT__API--UNIFIED'
  console.log('It is a string!')
}
</script>
*/ 