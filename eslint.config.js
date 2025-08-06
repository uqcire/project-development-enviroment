// eslint.config.js
import stylistic from '@stylistic/eslint-plugin'

export default [
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      // Stylistic rules
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      
      // Vue specific rules
      'vue/multi-word-component-names': 'off', // Allow single word components for boilerplate
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/no-unused-vars': 'error',
      'vue/no-unused-components': 'warn',
      
      // General rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'warn',
      'prefer-const': 'error',
      'no-var': 'error'
    }
  }
]