import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import '@/styles/global.css'
import { createApp } from 'vue'
import App from '/APP__ROOT--MAIN.vue'
import { globalErrorHandler } from '@/utils/ERROR-HANDLER__GLOBAL--SYSTEM'

const app = createApp(App)

// Initialize global error handling before everything else
globalErrorHandler.initialize()

// Make global error handler accessible globally for HTTP client and other utilities
window.globalErrorHandler = globalErrorHandler

// Setup Vue error handler integration
app.config.errorHandler = (error, componentInstance, errorInfo) => {
  globalErrorHandler.handleVueError(error, componentInstance, errorInfo)
}

// Setup application
setupRouter(app)
setupStore(app)

// Mount application
app.mount('#app')

// Log successful initialization
console.log('🚀 Application started with comprehensive error handling')
console.log('📊 Error statistics available at: window.globalErrorHandler.getStatistics()')
