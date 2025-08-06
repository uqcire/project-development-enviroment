<!--
  Global Error Boundary Component
  
  This component catches errors from child components and displays
  user-friendly error messages instead of crashing the entire application.
  
  BEM Naming: COMPONENT__ERROR-BOUNDARY--GLOBAL
  - Block: COMPONENT (reusable UI component)
  - Element: ERROR-BOUNDARY (error handling functionality)
  - Modifier: GLOBAL (application-wide error boundary)
-->

<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-boundary__container">
      <div class="error-boundary__icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      
      <div class="error-boundary__content">
        <h2 class="error-boundary__title">
          {{ errorConfig.title }}
        </h2>
        
        <p class="error-boundary__message">
          {{ errorConfig.message }}
        </p>
        
        <div v-if="showDetails" class="error-boundary__details">
          <details class="error-boundary__technical">
            <summary>Technical Details</summary>
            <pre class="error-boundary__stack">{{ errorDetails.stack }}</pre>
            <div class="error-boundary__info">
              <p><strong>Component:</strong> {{ errorDetails.componentName }}</p>
              <p><strong>Time:</strong> {{ errorDetails.timestamp }}</p>
              <p><strong>User Agent:</strong> {{ errorDetails.userAgent }}</p>
            </div>
          </details>
        </div>
        
        <div class="error-boundary__actions">
          <button 
            @click="retry" 
            class="error-boundary__button error-boundary__button--primary"
            :disabled="retrying"
          >
            <span v-if="retrying">Retrying...</span>
            <span v-else>{{ errorConfig.retryText }}</span>
          </button>
          
          <button 
            @click="reload" 
            class="error-boundary__button error-boundary__button--secondary"
          >
            {{ errorConfig.reloadText }}
          </button>
          
          <button 
            @click="toggleDetails" 
            class="error-boundary__button error-boundary__button--ghost"
          >
            {{ showDetails ? 'Hide Details' : 'Show Details' }}
          </button>
          
          <button 
            @click="reportError" 
            class="error-boundary__button error-boundary__button--ghost"
            v-if="enableErrorReporting"
          >
            Report Issue
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Render children when no error -->
  <slot v-else />
</template>

<script setup>
import { ref, computed, onErrorCaptured, onMounted } from 'vue'

/**
 * Props for customizing error boundary behavior
 */
const props = defineProps({
  /**
   * Custom error configuration
   */
  errorConfig: {
    type: Object,
    default: () => ({
      title: 'Something went wrong',
      message: 'An unexpected error occurred. Please try again or reload the page.',
      retryText: 'Try Again',
      reloadText: 'Reload Page'
    })
  },
  
  /**
   * Enable error reporting functionality
   */
  enableErrorReporting: {
    type: Boolean,
    default: true
  },
  
  /**
   * Auto-retry functionality
   */
  autoRetry: {
    type: Boolean,
    default: false
  },
  
  /**
   * Auto-retry delay in milliseconds
   */
  autoRetryDelay: {
    type: Number,
    default: 3000
  },
  
  /**
   * Maximum number of auto-retries
   */
  maxRetries: {
    type: Number,
    default: 3
  },
  
  /**
   * Fallback component to render on error
   */
  fallback: {
    type: [String, Object],
    default: null
  }
})

/**
 * Emits for parent component communication
 */
const emit = defineEmits(['error', 'retry', 'reload'])

// Reactive state
const hasError = ref(false)
const errorMessage = ref('')
const errorDetails = ref({})
const showDetails = ref(false)
const retrying = ref(false)
const retryCount = ref(0)

/**
 * Enhanced error configuration with defaults
 */
const errorConfig = computed(() => ({
  title: 'Something went wrong',
  message: 'An unexpected error occurred. Please try again or reload the page.',
  retryText: 'Try Again',
  reloadText: 'Reload Page',
  ...props.errorConfig
}))

/**
 * Capture errors from child components
 */
onErrorCaptured((error, componentInstance, errorInfo) => {
  console.error('Error captured by boundary:', error)
  console.error('Component instance:', componentInstance)
  console.error('Error info:', errorInfo)
  
  // Set error state
  hasError.value = true
  errorMessage.value = error.message || 'An unexpected error occurred'
  
  // Collect detailed error information
  errorDetails.value = {
    message: error.message,
    stack: error.stack,
    componentName: componentInstance?.$options?.name || componentInstance?.$options?.__name || 'Unknown Component',
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    errorInfo: errorInfo
  }
  
  // Emit error event for parent handling
  emit('error', {
    error,
    componentInstance,
    errorInfo,
    details: errorDetails.value
  })
  
  // Auto-retry if enabled
  if (props.autoRetry && retryCount.value < props.maxRetries) {
    setTimeout(() => {
      autoRetryHandler()
    }, props.autoRetryDelay)
  }
  
  // Report error to external service if enabled
  if (props.enableErrorReporting) {
    reportErrorToService(error, errorDetails.value)
  }
  
  // Prevent error from bubbling up
  return false
})

/**
 * Retry functionality
 */
const retry = async () => {
  retrying.value = true
  retryCount.value++
  
  try {
    // Wait a moment for any cleanup
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Reset error state
    hasError.value = false
    errorMessage.value = ''
    errorDetails.value = {}
    showDetails.value = false
    
    emit('retry', retryCount.value)
    
  } catch (error) {
    console.error('Retry failed:', error)
  } finally {
    retrying.value = false
  }
}

/**
 * Auto-retry handler
 */
const autoRetryHandler = async () => {
  console.log(`Auto-retry attempt ${retryCount.value + 1}/${props.maxRetries}`)
  await retry()
}

/**
 * Reload page functionality
 */
const reload = () => {
  emit('reload')
  window.location.reload()
}

/**
 * Toggle error details visibility
 */
const toggleDetails = () => {
  showDetails.value = !showDetails.value
}

/**
 * Report error to external service
 */
const reportError = () => {
  // In a real application, this would send error details to an error tracking service
  console.log('Reporting error:', errorDetails.value)
  
  // Example: Send to error tracking service
  reportErrorToService(new Error(errorMessage.value), errorDetails.value)
  
  // Show confirmation to user
  alert('Error report sent. Thank you for helping us improve the application!')
}

/**
 * Report error to external monitoring service
 */
const reportErrorToService = (error, details) => {
  // This would integrate with services like Sentry, LogRocket, etc.
  try {
    // Example implementation
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false
      })
    }
    
    // Example: Send to custom logging endpoint
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     message: error.message,
    //     stack: error.stack,
    //     details: details,
    //     timestamp: new Date().toISOString()
    //   })
    // }).catch(err => console.error('Failed to report error:', err))
    
  } catch (reportingError) {
    console.error('Failed to report error:', reportingError)
  }
}

/**
 * Reset error state (useful for programmatic reset)
 */
const reset = () => {
  hasError.value = false
  errorMessage.value = ''
  errorDetails.value = {}
  showDetails.value = false
  retryCount.value = 0
}

/**
 * Setup global error handlers on mount
 */
onMounted(() => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', handleUnhandledRejection)
  
  // Handle general JavaScript errors
  window.addEventListener('error', handleGlobalError)
})

/**
 * Handle unhandled promise rejections
 */
const handleUnhandledRejection = (event) => {
  console.error('Unhandled promise rejection:', event.reason)
  
  // Don't show error boundary for network errors in HTTP client
  // (those should be handled by the HTTP client itself)
  if (event.reason?.isAxiosError) {
    return
  }
  
  hasError.value = true
  errorMessage.value = 'A network or server error occurred'
  errorDetails.value = {
    message: event.reason?.message || 'Unhandled promise rejection',
    stack: event.reason?.stack || 'No stack trace available',
    componentName: 'Global Promise Handler',
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    type: 'unhandled_promise_rejection'
  }
  
  event.preventDefault()
}

/**
 * Handle global JavaScript errors
 */
const handleGlobalError = (event) => {
  console.error('Global error:', event.error)
  
  hasError.value = true
  errorMessage.value = 'An unexpected error occurred'
  errorDetails.value = {
    message: event.error?.message || event.message || 'Global JavaScript error',
    stack: event.error?.stack || 'No stack trace available',
    componentName: 'Global Error Handler',
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    type: 'global_javascript_error'
  }
}

// Expose methods for parent components
defineExpose({
  retry,
  reload,
  reset,
  hasError: () => hasError.value,
  errorDetails: () => errorDetails.value
})
</script>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: var(--space-6, 1.5rem);
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-radius: var(--radius-lg, 0.5rem);
  border: 1px solid #fecaca;
}

.error-boundary__container {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.error-boundary__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: var(--space-4, 1rem);
  background: #fee2e2;
  border-radius: 50%;
  color: #dc2626;
}

.error-boundary__icon svg {
  width: 32px;
  height: 32px;
}

.error-boundary__content {
  text-align: center;
}

.error-boundary__title {
  margin: 0 0 var(--space-3, 0.75rem) 0;
  font-size: var(--font-size-2xl, 1.5rem);
  font-weight: 600;
  color: #dc2626;
}

.error-boundary__message {
  margin: 0 0 var(--space-6, 1.5rem) 0;
  font-size: var(--font-size-base, 1rem);
  color: #6b7280;
  line-height: 1.6;
}

.error-boundary__details {
  margin-bottom: var(--space-6, 1.5rem);
  text-align: left;
}

.error-boundary__technical {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: var(--radius-base, 0.25rem);
  padding: var(--space-4, 1rem);
}

.error-boundary__technical summary {
  cursor: pointer;
  font-weight: 500;
  color: #374151;
  margin-bottom: var(--space-3, 0.75rem);
}

.error-boundary__stack {
  background: #1f2937;
  color: #f9fafb;
  padding: var(--space-3, 0.75rem);
  border-radius: var(--radius-base, 0.25rem);
  font-family: var(--font-family-mono, 'JetBrains Mono', monospace);
  font-size: var(--font-size-sm, 0.875rem);
  overflow-x: auto;
  white-space: pre;
  margin-bottom: var(--space-3, 0.75rem);
}

.error-boundary__info {
  font-size: var(--font-size-sm, 0.875rem);
  color: #6b7280;
}

.error-boundary__info p {
  margin: var(--space-1, 0.25rem) 0;
}

.error-boundary__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3, 0.75rem);
  justify-content: center;
}

.error-boundary__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
  border-radius: var(--radius-base, 0.25rem);
  font-size: var(--font-size-sm, 0.875rem);
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  min-width: 120px;
}

.error-boundary__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-boundary__button--primary {
  background: #dc2626;
  color: white;
}

.error-boundary__button--primary:hover:not(:disabled) {
  background: #b91c1c;
}

.error-boundary__button--secondary {
  background: #6b7280;
  color: white;
}

.error-boundary__button--secondary:hover {
  background: #4b5563;
}

.error-boundary__button--ghost {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.error-boundary__button--ghost:hover {
  background: #f9fafb;
  color: #374151;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .error-boundary {
    padding: var(--space-4, 1rem);
  }
  
  .error-boundary__actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .error-boundary__button {
    width: 100%;
  }
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .error-boundary {
    background: linear-gradient(135deg, #1f1f1f 0%, #2d2d2d 100%);
    border-color: #444;
  }
  
  .error-boundary__title {
    color: #ef4444;
  }
  
  .error-boundary__message {
    color: #a3a3a3;
  }
  
  .error-boundary__technical {
    background: #2d2d2d;
    border-color: #444;
  }
  
  .error-boundary__technical summary {
    color: #e5e5e5;
  }
}
</style> 