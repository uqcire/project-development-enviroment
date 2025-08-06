import axios from 'axios'
import qs from 'qs'

// =============================================================================
// TYPE CHECKING UTILITIES
// =============================================================================

const toString = Object.prototype.toString

/**
 * Generic type checker using Object.prototype.toString
 * @param {any} val - Value to check
 * @param {string} type - Type name (e.g., 'String', 'Object')
 * @returns {boolean}
 */
export function is(val, type) {
  return toString.call(val) === `[object ${type}]`
}

// Basic type checkers
export function isDef(val) {
  return typeof val !== 'undefined'
}

export function isUndef(val) {
  return typeof val === 'undefined'
}

export function isNull(val) {
  return val === null
}

export function isWhitespace(val) {
  return val === ''
}

export function isObject(val) {
  return !isNull(val) && is(val, 'Object')
}

export function isArray(val) {
  return val && Array.isArray(val)
}

export function isString(val) {
  return is(val, 'String')
}

export function isNumber(val) {
  return is(val, 'Number')
}

export function isBoolean(val) {
  return is(val, 'Boolean')
}

export function isDate(val) {
  return is(val, 'Date')
}

export function isRegExp(val) {
  return is(val, 'RegExp')
}

export function isFunction(val) {
  return typeof val === 'function'
}

export function isPromise(val) {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

export function isElement(val) {
  return isObject(val) && !!val.tagName
}

export function isWindow(val) {
  return typeof window !== 'undefined' && isDef(window) && is(val, 'Window')
}

// Composite type checkers
export function isNullOrUndef(val) {
  return isNull(val) || isUndef(val)
}

export function isNullOrWhitespace(val) {
  return isNullOrUndef(val) || isWhitespace(val)
}

export function isEmpty(val) {
  if (isArray(val) || isString(val))
    return val.length === 0

  if (val instanceof Map || val instanceof Set)
    return val.size === 0

  if (isObject(val))
    return Object.keys(val).length === 0

  return false
}

/**
 * Similar to MySQL's IFNULL function
 * Returns default value if first parameter is null/undefined/empty string
 * @param {number | boolean | string} val - Value to check
 * @param {number | boolean | string} def - Default value
 * @returns {number | boolean | string}
 */
export function ifNull(val, def = '') {
  return isNullOrWhitespace(val) ? def : val
}

// URL validation
export function isUrl(path) {
  const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-]*)?\??[-+=&;%@.\w]*(?:#\w*)?)?)$/
  return reg.test(path)
}

/**
 * Check if path is external (starts with protocol)
 * @param {string} path - Path to check
 * @returns {boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// Environment detection
export const isServer = typeof window === 'undefined'
export const isClient = !isServer

// =============================================================================
// AUTHENTICATION UTILITIES
// =============================================================================

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'user_info'

/**
 * Get authentication token from storage
 * @returns {string | null}
 */
export function getToken() {
  try {
    if (isServer) return null
    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
    return token
  } catch (error) {
    console.error('Error getting token:', error)
    return null
  }
}

/**
 * Set authentication token in storage
 * @param {string} token - JWT token
 * @param {boolean} remember - Whether to use localStorage (true) or sessionStorage (false)
 */
export function setToken(token, remember = false) {
  try {
    if (isServer) return
    
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token)
      sessionStorage.removeItem(TOKEN_KEY)
    } else {
      sessionStorage.setItem(TOKEN_KEY, token)
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch (error) {
    console.error('Error setting token:', error)
  }
}

/**
 * Remove authentication token from storage
 */
export function removeToken() {
  try {
    if (isServer) return
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    sessionStorage.removeItem(USER_KEY)
  } catch (error) {
    console.error('Error removing token:', error)
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  const token = getToken()
  return !isNullOrWhitespace(token)
}

/**
 * Handle authentication failure - redirect to login
 */
export function reLogIn() {
  removeToken()
  
  // Custom event for components to listen to
  if (!isServer) {
    window.dispatchEvent(new CustomEvent('auth:logout', {
      detail: { reason: 'session_expired' }
    }))
    
    // Redirect to login page if we're in a browser
    if (window.location && !window.location.pathname.includes('/login')) {
      window.location.href = '/login'
    }
  }
}

/**
 * Show user-friendly alerts using the global notification system
 * @param {Object} options - Alert options
 * @param {string} options.text - Alert message
 * @param {string} options.type - Alert type (info, error, success, warning)
 * @param {string} options.title - Alert title
 * @param {number} options.duration - Duration in milliseconds (optional)
 */
export function showAlert({ text, type = 'info', title = 'Notice', duration }) {
  if (isServer) {
    console.log(`[${type.toUpperCase()}] ${title}: ${text}`)
    return
  }

  // Try to use global notification system first
  if (window.notifications) {
    const notificationMethod = {
      error: 'error',
      warning: 'warning', 
      success: 'success',
      info: 'info'
    }[type] || 'info'
    
    window.notifications[notificationMethod](text, {
      title,
      duration: duration !== undefined ? duration : (type === 'error' ? 0 : 5000)
    })
    return
  }
  
  // Try Element Plus if available
  if (window.ElMessage) {
    window.ElMessage({
      message: text,
      type: type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'info',
      duration: type === 'error' ? 0 : 3000,
      showClose: type === 'error'
    })
    return
  }
  
  // Try Vue global message
  if (window.Vue && window.Vue.prototype && window.Vue.prototype.$message) {
    window.Vue.prototype.$message({
      message: text,
      type: type
    })
    return
  }
  
  // Dispatch custom event for components to handle
  window.dispatchEvent(new CustomEvent('app:alert', {
    detail: { text, type, title }
  }))
  
  // Fallback to console and browser alert for errors
  console.log(`[${type.toUpperCase()}] ${title}: ${text}`)
  
  // Show browser alert only for critical errors as last resort
  if (type === 'error' && !window.notifications && !window.ElMessage) {
    window.alert(`${title}: ${text}`)
  }
}

// =============================================================================
// HTTP STATUS MESSAGES
// =============================================================================

const HTTP_STATUS_MESSAGES = {
  200: 'Request successful',
  201: 'Created successfully',
  202: 'Request accepted and queued for processing',
  204: 'Deleted successfully',
  400: 'Bad request - please check your input',
  401: 'Unauthorized - please log in',
  403: 'Forbidden - insufficient permissions',
  404: 'Resource not found',
  406: 'Request format not acceptable',
  410: 'Resource permanently deleted',
  422: 'Validation error',
  500: 'Internal server error',
  502: 'Bad gateway',
  503: 'Service unavailable',
  504: 'Gateway timeout',
}

// =============================================================================
// AXIOS INSTANCE CONFIGURATION
// =============================================================================

/**
 * Create configured Axios instance
 */
const createHttpInstance = () => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 60000, // 60 seconds
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'indices' })
    },
  })

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add authentication token
      const token = getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Add request timestamp for debugging
      config.metadata = { startTime: Date.now() }

      return config
    },
    (error) => {
      console.error('Request interceptor error:', error)
      return Promise.reject(error)
    }
  )

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      // Log response time for debugging
      if (response.config.metadata) {
        const duration = Date.now() - response.config.metadata.startTime
        console.log(`API call to ${response.config.url} took ${duration}ms`)
      }

      // Check HTTP status
      if (response.status < 200 || response.status >= 300) {
        const errorText = HTTP_STATUS_MESSAGES[response.status] || response.statusText
        const error = new Error(errorText)
        error.name = 'HttpError'
        error.status = response.status
        error.response = response
        throw error
      }

      // Check business logic codes
      if (response.data && typeof response.data === 'object') {
        const { code, message } = response.data

        if (code === 10002 || code === 10004) {
          // Authentication expired
          showAlert({
            text: 'Your session has expired. Please log in again.',
            type: 'warning',
            title: 'Session Expired'
          })
          reLogIn()
          return Promise.reject(new Error('Authentication expired'))
        }

        if (code === -1) {
          // Operation failed
          showAlert({
            text: message || 'Operation failed',
            type: 'error',
            title: 'Error'
          })
          return Promise.reject(new Error(message || 'Operation failed'))
        }
      }

      return response
    },
    (error) => {
      // Mark error as coming from HTTP client to prevent double handling
      error.isAxiosError = true
      error.isHttpClientError = true
      
      // Handle network errors
      if (error.code === 'ECONNABORTED') {
        showAlert({
          text: 'Request timeout. Please try again.',
          type: 'error',
          title: 'Timeout',
          duration: 8000
        })
        
        // Report to global error handler for tracking
        if (window.globalErrorHandler) {
          window.globalErrorHandler.processError(
            window.globalErrorHandler.createErrorInfo(error, {
              type: 'network_error',
              severity: 'medium',
              context: 'HTTP Request Timeout'
            })
          )
        }
      } else if (error.response) {
        // Server responded with error status
        const status = error.response.status
        const message = HTTP_STATUS_MESSAGES[status] || 'An error occurred'
        
        if (status === 401) {
          showAlert({
            text: 'Your session has expired. Redirecting to login...',
            type: 'warning',
            title: 'Authentication Required',
            duration: 3000
          })
          reLogIn()
        } else if (status >= 500) {
          // Server errors
          showAlert({
            text: 'Server error occurred. Please try again later.',
            type: 'error',
            title: 'Server Error',
            duration: 8000
          })
          
          // Report server errors to global handler
          if (window.globalErrorHandler) {
            window.globalErrorHandler.processError(
              window.globalErrorHandler.createErrorInfo(error, {
                type: 'network_error',
                severity: 'high',
                context: `HTTP ${status} Error`,
                url: error.config?.url,
                method: error.config?.method?.toUpperCase()
              })
            )
          }
        } else if (status >= 400) {
          // Client errors (except 401 which is handled above)
          showAlert({
            text: message,
            type: 'warning',
            title: 'Request Error',
            duration: 5000
          })
        }
      } else if (error.request) {
        // Network error (no response received)
        showAlert({
          text: 'Network error. Please check your connection and try again.',
          type: 'error',
          title: 'Connection Error',
          duration: 8000
        })
        
        // Report network errors to global handler
        if (window.globalErrorHandler) {
          window.globalErrorHandler.processError(
            window.globalErrorHandler.createErrorInfo(error, {
              type: 'network_error',
              severity: 'high',
              context: 'Network Connection Error'
            })
          )
        }
      } else {
        // Something else happened
        showAlert({
          text: error.message || 'An unexpected error occurred',
          type: 'error',
          title: 'Error',
          duration: 5000
        })
      }

      console.error('HTTP Client Error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method,
        stack: error.stack
      })
      
      return Promise.reject(error)
    }
  )

  return instance
}

// Create the HTTP instance
const httpInstance = createHttpInstance()

// =============================================================================
// HTTP CLIENT METHODS
// =============================================================================

/**
 * Generic HTTP request method
 * @param {Object} config - Axios request config
 * @returns {Promise<any>}
 */
export async function request(config) {
  try {
    const response = await httpInstance(config)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET request
 * @param {string} url - Request URL
 * @param {Object} config - Additional axios config
 * @returns {Promise<any>}
 */
export async function get(url, config = {}) {
  try {
    const response = await httpInstance.get(url, config)
    return response.data
  } catch (error) {
    console.error('GET request error:', error)
    throw error
  }
}

/**
 * POST request
 * @param {string} url - Request URL
 * @param {any} data - Request data
 * @param {Object} config - Additional axios config
 * @returns {Promise<any>}
 */
export async function post(url, data = {}, config = {}) {
  try {
    const response = await httpInstance.post(url, data, config)
    return response.data
  } catch (error) {
    console.error('POST request error:', error)
    throw error
  }
}

/**
 * PUT request
 * @param {string} url - Request URL
 * @param {any} data - Request data
 * @param {Object} config - Additional axios config
 * @returns {Promise<any>}
 */
export async function put(url, data = {}, config = {}) {
  try {
    const response = await httpInstance.put(url, data, config)
    return response.data
  } catch (error) {
    console.error('PUT request error:', error)
    throw error
  }
}

/**
 * DELETE request
 * @param {string} url - Request URL
 * @param {Object} config - Additional axios config
 * @returns {Promise<any>}
 */
export async function del(url, config = {}) {
  try {
    const response = await httpInstance.delete(url, config)
    return response.data
  } catch (error) {
    console.error('DELETE request error:', error)
    throw error
  }
}

/**
 * PATCH request
 * @param {string} url - Request URL
 * @param {any} data - Request data
 * @param {Object} config - Additional axios config
 * @returns {Promise<any>}
 */
export async function patch(url, data = {}, config = {}) {
  try {
    const response = await httpInstance.patch(url, data, config)
    return response.data
  } catch (error) {
    console.error('PATCH request error:', error)
    throw error
  }
}

// =============================================================================
// CONVENIENCE METHODS
// =============================================================================

/**
 * Upload file
 * @param {string} url - Upload URL
 * @param {FormData} formData - File data
 * @param {Object} config - Additional config
 * @returns {Promise<any>}
 */
export async function upload(url, formData, config = {}) {
  const uploadConfig = {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...config.headers,
    },
  }
  
  return post(url, formData, uploadConfig)
}

/**
 * Download file
 * @param {string} url - Download URL
 * @param {string} filename - File name
 * @param {Object} config - Additional config
 * @returns {Promise<void>}
 */
export async function download(url, filename, config = {}) {
  try {
    const response = await httpInstance.get(url, {
      ...config,
      responseType: 'blob',
    })

    if (isServer) {
      console.log('Download initiated on server side')
      return response.data
    }

    // Create download link
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('Download error:', error)
    throw error
  }
}

// =============================================================================
// EXPORT DEFAULT INSTANCE
// =============================================================================

export default httpInstance

// =============================================================================
// EXAMPLE USAGE
// =============================================================================

/*
// Type checking
import { isString, isArray, ifNull } from './HTTP-CLIENT__API--UNIFIED'

if (isString(data.name)) {
  console.log('Name is valid')
}

// Authentication
import { setToken, isAuthenticated, getToken } from './HTTP-CLIENT__API--UNIFIED'

// Login
const loginResponse = await post('/auth/login', { email, password })
setToken(loginResponse.token, true) // Save to localStorage

// Check auth status
if (isAuthenticated()) {
  console.log('User is logged in')
}

// HTTP requests
import { get, post, put, del } from './HTTP-CLIENT__API--UNIFIED'

// Simple requests
const users = await get('/users')
const newUser = await post('/users', { name: 'John', email: 'john@example.com' })
const updatedUser = await put('/users/1', { name: 'Jane' })
await del('/users/1')

// File operations
await upload('/files', formData)
await download('/files/document.pdf', 'my-document.pdf')

// Error handling is automatic via interceptors
// Auth failures automatically trigger logout
// Network errors show user-friendly messages
*/ 