/**
 * Global Error Handler System
 * 
 * This module provides comprehensive error handling capabilities for the entire application,
 * including unhandled promise rejections, JavaScript errors, and Vue component errors.
 * 
 * BEM Naming: ERROR-HANDLER__GLOBAL--SYSTEM
 * - Block: ERROR-HANDLER (main functionality)
 * - Element: GLOBAL (application-wide handling)
 * - Modifier: SYSTEM (complete error management system)
 */

/**
 * Error types classification
 */
export const ErrorTypes = {
  COMPONENT_ERROR: 'component_error',
  NETWORK_ERROR: 'network_error',
  JAVASCRIPT_ERROR: 'javascript_error',
  PROMISE_REJECTION: 'promise_rejection',
  AUTHENTICATION_ERROR: 'authentication_error',
  PERMISSION_ERROR: 'permission_error',
  VALIDATION_ERROR: 'validation_error',
  UNKNOWN_ERROR: 'unknown_error'
}

/**
 * Error severity levels
 */
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

/**
 * Global Error Handler Class
 */
export class GlobalErrorHandler {
  constructor(options = {}) {
    this.options = {
      enableConsoleLogging: true,
      enableUserNotifications: true,
      enableErrorReporting: true,
      enableRecovery: true,
      maxRetries: 3,
      retryDelay: 1000,
      reportingEndpoint: '/api/errors',
      excludeErrors: [
        'Script error',
        'Network Error',
        'ChunkLoadError'
      ],
      ...options
    }
    
    this.errorCount = 0
    this.errorHistory = []
    this.retryAttempts = new Map()
    this.listeners = []
    this.isInitialized = false
    
    // Bind methods to preserve context
    this.handleUnhandledRejection = this.handleUnhandledRejection.bind(this)
    this.handleGlobalError = this.handleGlobalError.bind(this)
    this.handleVueError = this.handleVueError.bind(this)
  }

  /**
   * Initialize global error handlers
   */
  initialize() {
    if (this.isInitialized) {
      console.warn('GlobalErrorHandler is already initialized')
      return
    }

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection)
    
    // Handle general JavaScript errors
    window.addEventListener('error', this.handleGlobalError)
    
    // Vue error handler integration
    if (window.Vue || (typeof app !== 'undefined' && app.config)) {
      this.setupVueErrorHandler()
    }
    
    this.isInitialized = true
    this.log('GlobalErrorHandler initialized successfully')
  }

  /**
   * Cleanup error handlers
   */
  cleanup() {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection)
    window.removeEventListener('error', this.handleGlobalError)
    this.isInitialized = false
    this.log('GlobalErrorHandler cleaned up')
  }

  /**
   * Handle unhandled promise rejections
   */
  handleUnhandledRejection(event) {
    const error = this.normalizeError(event.reason)
    
    // Skip axios errors (they should be handled by HTTP client)
    if (this.isAxiosError(error)) {
      return
    }
    
    const errorInfo = this.createErrorInfo(error, {
      type: ErrorTypes.PROMISE_REJECTION,
      severity: ErrorSeverity.HIGH,
      context: 'Unhandled Promise Rejection',
      source: 'window.unhandledrejection'
    })
    
    this.processError(errorInfo)
    
    // Prevent default browser behavior
    event.preventDefault()
  }

  /**
   * Handle global JavaScript errors
   */
  handleGlobalError(event) {
    const error = event.error || new Error(event.message || 'Unknown error')
    
    const errorInfo = this.createErrorInfo(error, {
      type: ErrorTypes.JAVASCRIPT_ERROR,
      severity: this.determineSeverity(error),
      context: 'Global JavaScript Error',
      source: 'window.error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    })
    
    this.processError(errorInfo)
  }

  /**
   * Handle Vue component errors
   */
  handleVueError(error, componentInstance, errorInfo) {
    const normalizedError = this.normalizeError(error)
    
    const errorInfoObj = this.createErrorInfo(normalizedError, {
      type: ErrorTypes.COMPONENT_ERROR,
      severity: ErrorSeverity.MEDIUM,
      context: 'Vue Component Error',
      source: 'vue.errorHandler',
      componentName: componentInstance?.$options?.name || 'Unknown Component',
      componentInfo: errorInfo
    })
    
    this.processError(errorInfoObj)
  }

  /**
   * Setup Vue error handler
   */
  setupVueErrorHandler() {
    if (typeof app !== 'undefined' && app.config) {
      const originalErrorHandler = app.config.errorHandler
      
      app.config.errorHandler = (error, componentInstance, errorInfo) => {
        // Call original handler first if it exists
        if (originalErrorHandler) {
          originalErrorHandler(error, componentInstance, errorInfo)
        }
        
        // Handle with our system
        this.handleVueError(error, componentInstance, errorInfo)
      }
    }
  }

  /**
   * Process error through the complete handling pipeline
   */
  processError(errorInfo) {
    // Skip if error should be excluded
    if (this.shouldExcludeError(errorInfo)) {
      return
    }
    
    // Increment error count
    this.errorCount++
    
    // Add to error history
    this.addToHistory(errorInfo)
    
    // Log error
    if (this.options.enableConsoleLogging) {
      this.logError(errorInfo)
    }
    
    // Show user notification
    if (this.options.enableUserNotifications) {
      this.showUserNotification(errorInfo)
    }
    
    // Report error to external service
    if (this.options.enableErrorReporting) {
      this.reportError(errorInfo)
    }
    
    // Attempt recovery if enabled
    if (this.options.enableRecovery) {
      this.attemptRecovery(errorInfo)
    }
    
    // Notify listeners
    this.notifyListeners(errorInfo)
  }

  /**
   * Create standardized error information object
   */
  createErrorInfo(error, additionalInfo = {}) {
    return {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      message: error.message || 'Unknown error',
      stack: error.stack || 'No stack trace available',
      name: error.name || 'Error',
      type: ErrorTypes.UNKNOWN_ERROR,
      severity: ErrorSeverity.MEDIUM,
      context: 'Unknown',
      source: 'unknown',
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      buildVersion: this.getBuildVersion(),
      ...additionalInfo,
      originalError: error
    }
  }

  /**
   * Normalize different error types to standard Error object
   */
  normalizeError(error) {
    if (error instanceof Error) {
      return error
    }
    
    if (typeof error === 'string') {
      return new Error(error)
    }
    
    if (error && typeof error === 'object') {
      const message = error.message || error.toString() || 'Unknown error'
      const normalizedError = new Error(message)
      
      // Preserve additional properties
      Object.keys(error).forEach(key => {
        if (key !== 'message') {
          normalizedError[key] = error[key]
        }
      })
      
      return normalizedError
    }
    
    return new Error('Unknown error occurred')
  }

  /**
   * Determine error severity based on error characteristics
   */
  determineSeverity(error) {
    // Critical errors
    if (error.name === 'ChunkLoadError' || 
        error.message.includes('Loading chunk') ||
        error.message.includes('Script error')) {
      return ErrorSeverity.CRITICAL
    }
    
    // High severity errors
    if (error.name === 'TypeError' && error.message.includes('Cannot read prop')) {
      return ErrorSeverity.HIGH
    }
    
    // Network errors
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return ErrorSeverity.MEDIUM
    }
    
    // Default to medium
    return ErrorSeverity.MEDIUM
  }

  /**
   * Check if error should be excluded from handling
   */
  shouldExcludeError(errorInfo) {
    return this.options.excludeErrors.some(excludePattern => {
      if (typeof excludePattern === 'string') {
        return errorInfo.message.includes(excludePattern)
      }
      if (excludePattern instanceof RegExp) {
        return excludePattern.test(errorInfo.message)
      }
      return false
    })
  }

  /**
   * Check if error is from Axios HTTP client
   */
  isAxiosError(error) {
    return error && (
      error.isAxiosError ||
      error.config ||
      (error.response && error.request)
    )
  }

  /**
   * Add error to history with size limit
   */
  addToHistory(errorInfo) {
    this.errorHistory.unshift(errorInfo)
    
    // Keep only last 50 errors
    if (this.errorHistory.length > 50) {
      this.errorHistory = this.errorHistory.slice(0, 50)
    }
  }

  /**
   * Log error to console with formatting
   */
  logError(errorInfo) {
    const style = this.getConsoleStyle(errorInfo.severity)
    
    console.group(`%c🚨 ${errorInfo.severity.toUpperCase()} ERROR`, style)
    console.error('Message:', errorInfo.message)
    console.error('Type:', errorInfo.type)
    console.error('Context:', errorInfo.context)
    console.error('Stack:', errorInfo.stack)
    console.error('Full Error Info:', errorInfo)
    console.groupEnd()
  }

  /**
   * Get console styling based on severity
   */
  getConsoleStyle(severity) {
    const styles = {
      [ErrorSeverity.LOW]: 'color: #f59e0b; font-weight: bold;',
      [ErrorSeverity.MEDIUM]: 'color: #ef4444; font-weight: bold;',
      [ErrorSeverity.HIGH]: 'color: #dc2626; font-weight: bold; background: #fef2f2;',
      [ErrorSeverity.CRITICAL]: 'color: #ffffff; font-weight: bold; background: #dc2626; padding: 2px 6px; border-radius: 3px;'
    }
    
    return styles[severity] || styles[ErrorSeverity.MEDIUM]
  }

  /**
   * Show user-friendly notification
   */
  showUserNotification(errorInfo) {
    try {
      // Try to use UI store notification system
      if (window.useUIStore) {
        const uiStore = window.useUIStore()
        uiStore.addNotification({
          type: 'error',
          title: this.getUserFriendlyTitle(errorInfo),
          message: this.getUserFriendlyMessage(errorInfo),
          duration: this.getNotificationDuration(errorInfo.severity)
        })
        return
      }
      
      // Fallback to simple alert for critical errors
      if (errorInfo.severity === ErrorSeverity.CRITICAL) {
        alert(`Error: ${this.getUserFriendlyMessage(errorInfo)}`)
      }
      
    } catch (notificationError) {
      console.error('Failed to show error notification:', notificationError)
    }
  }

  /**
   * Get user-friendly error title
   */
  getUserFriendlyTitle(errorInfo) {
    const titles = {
      [ErrorTypes.NETWORK_ERROR]: 'Connection Error',
      [ErrorTypes.AUTHENTICATION_ERROR]: 'Authentication Required',
      [ErrorTypes.PERMISSION_ERROR]: 'Access Denied',
      [ErrorTypes.VALIDATION_ERROR]: 'Invalid Input',
      [ErrorTypes.COMPONENT_ERROR]: 'Display Error',
      [ErrorTypes.JAVASCRIPT_ERROR]: 'Application Error',
      [ErrorTypes.PROMISE_REJECTION]: 'Operation Failed'
    }
    
    return titles[errorInfo.type] || 'Error Occurred'
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage(errorInfo) {
    // Custom messages based on error patterns
    if (errorInfo.message.includes('Network Error')) {
      return 'Please check your internet connection and try again.'
    }
    
    if (errorInfo.message.includes('Loading chunk')) {
      return 'Failed to load application resources. Please refresh the page.'
    }
    
    if (errorInfo.message.includes('Cannot read prop')) {
      return 'Some data is temporarily unavailable. Please try again.'
    }
    
    if (errorInfo.type === ErrorTypes.AUTHENTICATION_ERROR) {
      return 'Your session has expired. Please log in again.'
    }
    
    // Default message based on severity
    const messages = {
      [ErrorSeverity.CRITICAL]: 'A critical error occurred. Please refresh the page.',
      [ErrorSeverity.HIGH]: 'An error occurred. The page will attempt to recover automatically.',
      [ErrorSeverity.MEDIUM]: 'A minor error occurred. You can continue using the application.',
      [ErrorSeverity.LOW]: 'A minor issue was detected and resolved automatically.'
    }
    
    return messages[errorInfo.severity] || 'An unexpected error occurred.'
  }

  /**
   * Get notification duration based on severity
   */
  getNotificationDuration(severity) {
    const durations = {
      [ErrorSeverity.LOW]: 3000,
      [ErrorSeverity.MEDIUM]: 5000,
      [ErrorSeverity.HIGH]: 8000,
      [ErrorSeverity.CRITICAL]: 0 // Don't auto-hide critical errors
    }
    
    return durations[severity] || 5000
  }

  /**
   * Report error to external monitoring service
   */
  async reportError(errorInfo) {
    try {
      // Report to browser's error tracking if available
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: errorInfo.message,
          fatal: errorInfo.severity === ErrorSeverity.CRITICAL
        })
      }
      
      // Report to custom endpoint
      if (this.options.reportingEndpoint) {
        await fetch(this.options.reportingEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...errorInfo,
            // Remove circular references and large objects
            originalError: undefined
          })
        })
      }
      
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }

  /**
   * Attempt automatic error recovery
   */
  attemptRecovery(errorInfo) {
    const errorKey = `${errorInfo.type}-${errorInfo.context}`
    const retryCount = this.retryAttempts.get(errorKey) || 0
    
    if (retryCount >= this.options.maxRetries) {
      return
    }
    
    // Increment retry count
    this.retryAttempts.set(errorKey, retryCount + 1)
    
    // Attempt recovery based on error type
    setTimeout(() => {
      switch (errorInfo.type) {
        case ErrorTypes.NETWORK_ERROR:
          this.recoverFromNetworkError(errorInfo)
          break
          
        case ErrorTypes.COMPONENT_ERROR:
          this.recoverFromComponentError(errorInfo)
          break
          
        case ErrorTypes.JAVASCRIPT_ERROR:
          this.recoverFromJavaScriptError(errorInfo)
          break
          
        default:
          this.genericRecovery(errorInfo)
      }
    }, this.options.retryDelay * (retryCount + 1))
  }

  /**
   * Recovery strategies for different error types
   */
  recoverFromNetworkError(errorInfo) {
    // Could trigger a retry of the failed network request
    this.log('Attempting network error recovery')
  }

  recoverFromComponentError(errorInfo) {
    // Could trigger a component re-render
    this.log('Attempting component error recovery')
  }

  recoverFromJavaScriptError(errorInfo) {
    // Could clear problematic state
    this.log('Attempting JavaScript error recovery')
  }

  genericRecovery(errorInfo) {
    // Generic recovery strategy
    this.log('Attempting generic error recovery')
  }

  /**
   * Add error event listener
   */
  addEventListener(listener) {
    this.listeners.push(listener)
  }

  /**
   * Remove error event listener
   */
  removeEventListener(listener) {
    const index = this.listeners.indexOf(listener)
    if (index > -1) {
      this.listeners.splice(index, 1)
    }
  }

  /**
   * Notify all listeners of error
   */
  notifyListeners(errorInfo) {
    this.listeners.forEach(listener => {
      try {
        listener(errorInfo)
      } catch (listenerError) {
        console.error('Error in error listener:', listenerError)
      }
    })
  }

  /**
   * Utility methods
   */
  generateErrorId() {
    return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  getCurrentUserId() {
    // Get from auth store or storage
    try {
      const authData = localStorage.getItem('auth-store')
      if (authData) {
        const parsed = JSON.parse(authData)
        return parsed.user?.id || 'anonymous'
      }
    } catch (e) {
      // Ignore
    }
    return 'anonymous'
  }

  getSessionId() {
    // Generate or retrieve session ID
    let sessionId = sessionStorage.getItem('session-id')
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('session-id', sessionId)
    }
    return sessionId
  }

  getBuildVersion() {
    return import.meta.env.VITE_APP_VERSION || '1.0.0'
  }

  log(message) {
    if (this.options.enableConsoleLogging) {
      console.log(`[GlobalErrorHandler] ${message}`)
    }
  }

  /**
   * Get error statistics
   */
  getStatistics() {
    const typeStats = {}
    const severityStats = {}
    
    this.errorHistory.forEach(error => {
      typeStats[error.type] = (typeStats[error.type] || 0) + 1
      severityStats[error.severity] = (severityStats[error.severity] || 0) + 1
    })
    
    return {
      totalErrors: this.errorCount,
      recentErrors: this.errorHistory.length,
      typeBreakdown: typeStats,
      severityBreakdown: severityStats,
      retryAttempts: Object.fromEntries(this.retryAttempts)
    }
  }

  /**
   * Clear error history
   */
  clearHistory() {
    this.errorHistory = []
    this.retryAttempts.clear()
    this.errorCount = 0
  }
}

// Create singleton instance
export const globalErrorHandler = new GlobalErrorHandler()

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  globalErrorHandler.initialize()
}

// Export convenience functions
export function handleError(error, context = {}) {
  const errorInfo = globalErrorHandler.createErrorInfo(error, context)
  globalErrorHandler.processError(errorInfo)
}

export function reportError(error, additionalInfo = {}) {
  const errorInfo = globalErrorHandler.createErrorInfo(error, {
    ...additionalInfo,
    type: ErrorTypes.UNKNOWN_ERROR,
    severity: ErrorSeverity.MEDIUM
  })
  globalErrorHandler.reportError(errorInfo)
}

export function getErrorStatistics() {
  return globalErrorHandler.getStatistics()
}

export default globalErrorHandler 