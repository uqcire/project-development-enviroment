/**
 * Environment Variable Processor for Vite
 * 
 * This module processes and transforms environment variables loaded by Vite's loadEnv()
 * function to ensure proper type conversion and availability in both build and runtime.
 * 
 * BEM Naming: ENV-PROCESSOR__VITE--WRAPPER
 * - Block: ENV-PROCESSOR (main functionality)
 * - Element: VITE (specific to Vite environment handling)  
 * - Modifier: WRAPPER (wraps/processes env variables)
 */

/**
 * Processes and transforms environment variables from Vite's loadEnv
 * 
 * WHAT THIS FUNCTION DOES:
 * 1. Takes raw environment variables (all strings) from process.env
 * 2. Converts string values to appropriate JavaScript types
 * 3. Handles boolean conversion ('true'/'false' → true/false)
 * 4. Handles numeric conversion for specific variables (VITE_PORT)
 * 5. Sets processed values back to process.env for consistency
 * 6. Returns a clean object with properly typed values
 * 
 * WHY THIS IS NEEDED:
 * - Environment variables are always strings by default
 * - Vite needs proper types for configuration (numbers, booleans)
 * - Ensures consistency between build-time and runtime env access
 * - Prevents common type-related configuration errors
 * 
 * @param {Object} envOptions - Raw environment variables object from loadEnv()
 * @returns {Object} Processed environment variables with proper types
 * 
 * @example
 * // Input from .env file:
 * // VITE_PORT=3000
 * // VITE_ENABLE_MOCK=true
 * // VITE_API_URL=https://api.example.com
 * 
 * const env = loadEnv('development', process.cwd())
 * const processedEnv = wrapperEnv(env)
 * 
 * // Output:
 * // {
 * //   VITE_PORT: 3000,           // ← Converted to number
 * //   VITE_ENABLE_MOCK: true,    // ← Converted to boolean
 * //   VITE_API_URL: 'https://api.example.com'  // ← Remains string
 * // }
 */
export function wrapperEnv(envOptions) {
  // Guard clause: return empty object if no env options provided
  if (!envOptions || typeof envOptions !== 'object') {
    console.warn('wrapperEnv: No environment options provided or invalid input')
    return {}
  }

  const processedEnv = {}
  
  // Process each environment variable
  for (const key in envOptions) {
    // Skip inherited properties from prototype chain
    if (!envOptions.hasOwnProperty(key)) continue
    
    let value = envOptions[key]
    
    // Skip undefined or null values
    if (value === undefined || value === null) {
      console.warn(`wrapperEnv: Skipping ${key} - value is ${value}`)
      continue
    }
    
    // Convert string value to appropriate type
    value = convertEnvValue(key, value)
    
    // Store in result object
    processedEnv[key] = value
    
    // Update process.env for consistency
    updateProcessEnv(key, value)
  }
  
  return processedEnv
}

/**
 * Converts environment variable value to appropriate JavaScript type
 * 
 * @param {string} key - Environment variable name
 * @param {string} value - Raw string value from environment
 * @returns {string|number|boolean} Converted value
 */
function convertEnvValue(key, value) {
  // Ensure value is a string for processing
  const stringValue = String(value).trim()
  
  // Boolean conversion: 'true'/'false' strings → boolean
  if (isBooleanEnvVar(stringValue)) {
    return stringValue.toLowerCase() === 'true'
  }
  
  // Numeric conversion: specific environment variables that should be numbers
  if (isNumericEnvVar(key, stringValue)) {
    const numValue = Number(stringValue)
    if (!isNaN(numValue)) {
      return numValue
    }
    console.warn(`wrapperEnv: Failed to convert ${key}="${stringValue}" to number, keeping as string`)
  }
  
  // Default: return as string
  return stringValue
}

/**
 * Checks if a value should be converted to boolean
 * 
 * @param {string} value - String value to check
 * @returns {boolean} Whether value represents a boolean
 */
function isBooleanEnvVar(value) {
  const lowerValue = value.toLowerCase()
  return ['true', 'false'].includes(lowerValue)
}

/**
 * Checks if an environment variable should be converted to number
 * 
 * @param {string} key - Environment variable name
 * @param {string} value - String value to check
 * @returns {boolean} Whether this variable should be numeric
 */
function isNumericEnvVar(key, value) {
  // List of environment variables that should be numbers
  const numericEnvVars = [
    'VITE_PORT',
    'VITE_PROXY_PORT', 
    'VITE_API_TIMEOUT',
    'VITE_MAX_RETRIES',
    'VITE_CHUNK_SIZE_LIMIT',
    'PORT' // Common for deployment platforms
  ]
  
  // Check if key matches numeric variables and value is numeric
  return numericEnvVars.includes(key) && /^\d+$/.test(value)
}

/**
 * Updates process.env with the converted value
 * 
 * @param {string} key - Environment variable name
 * @param {string|number|boolean|object} value - Converted value
 */
function updateProcessEnv(key, value) {
  try {
    if (typeof value === 'string') {
      process.env[key] = value
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      process.env[key] = String(value)
    } else if (typeof value === 'object') {
      process.env[key] = JSON.stringify(value)
    } else {
      console.warn(`wrapperEnv: Unknown type for ${key}, converting to string`)
      process.env[key] = String(value)
    }
  } catch (error) {
    console.error(`wrapperEnv: Failed to update process.env.${key}:`, error)
  }
}

/**
 * Validates environment variables for common issues
 * 
 * @param {Object} processedEnv - Processed environment variables
 * @returns {Object} Validation result with warnings/errors
 */
export function validateEnvironment(processedEnv) {
  const warnings = []
  const errors = []
  
  // Check for required Vite variables
  const requiredViteVars = ['VITE_API_BASE_URL']
  for (const varName of requiredViteVars) {
    if (!processedEnv[varName]) {
      warnings.push(`Missing recommended environment variable: ${varName}`)
    }
  }
  
  // Validate port numbers
  if (processedEnv.VITE_PORT) {
    const port = processedEnv.VITE_PORT
    if (port < 1 || port > 65535) {
      errors.push(`VITE_PORT must be between 1 and 65535, got: ${port}`)
    }
  }
  
  // Validate URLs
  const urlVars = Object.keys(processedEnv).filter(key => 
    key.includes('URL') || key.includes('ENDPOINT')
  )
  
  for (const urlVar of urlVars) {
    const url = processedEnv[urlVar]
    if (url && typeof url === 'string' && !isValidUrl(url)) {
      warnings.push(`${urlVar} does not appear to be a valid URL: ${url}`)
    }
  }
  
  return {
    isValid: errors.length === 0,
    warnings,
    errors
  }
}

/**
 * Simple URL validation
 * 
 * @param {string} url - URL to validate
 * @returns {boolean} Whether URL is valid
 */
function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Debug helper to log environment processing results
 * 
 * @param {Object} original - Original environment variables
 * @param {Object} processed - Processed environment variables
 */
export function debugEnvironment(original, processed) {
  if (process.env.NODE_ENV !== 'development') return
  
  console.group('🌍 Environment Variable Processing')
  console.log('Original:', original)
  console.log('Processed:', processed)
  
  // Show type conversions
  for (const key in processed) {
    const originalValue = original[key]
    const processedValue = processed[key]
    const originalType = typeof originalValue
    const processedType = typeof processedValue
    
    if (originalType !== processedType) {
      console.log(`🔄 ${key}: ${originalType}("${originalValue}") → ${processedType}(${processedValue})`)
    }
  }
  
  console.groupEnd()
}

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/*
// Basic usage in vite.config.js:
import { defineConfig, loadEnv } from 'vite'
import { wrapperEnv, validateEnvironment, debugEnvironment } from './src/build/ENV-PROCESSOR__VITE--WRAPPER'

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd())
  
  // Process and type-convert variables
  const viteEnv = wrapperEnv(env)
  
  // Validate environment (optional)
  const validation = validateEnvironment(viteEnv)
  if (!validation.isValid) {
    console.error('Environment validation errors:', validation.errors)
    process.exit(1)
  }
  
  // Debug in development (optional)
  debugEnvironment(env, viteEnv)
  
  // Extract typed variables
  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_API_BASE_URL } = viteEnv
  
  return {
    server: {
      port: VITE_PORT, // Now properly typed as number
    },
    base: VITE_PUBLIC_PATH || '/',
    define: {
      __API_URL__: JSON.stringify(VITE_API_BASE_URL)
    }
  }
})

// Example .env file:
// VITE_PORT=3000
// VITE_PUBLIC_PATH=/my-app/
// VITE_API_BASE_URL=https://api.example.com
// VITE_ENABLE_MOCK=true
// VITE_DEBUG=false

// Result after processing:
// {
//   VITE_PORT: 3000,                    // number
//   VITE_PUBLIC_PATH: '/my-app/',       // string  
//   VITE_API_BASE_URL: 'https://api.example.com', // string
//   VITE_ENABLE_MOCK: true,             // boolean
//   VITE_DEBUG: false                   // boolean
// }
*/

// Export as default for backward compatibility
export default wrapperEnv 