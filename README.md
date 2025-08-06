# Project Boilerplate

## Overview
A **production-ready project boilerplate template** featuring enterprise-grade error handling, modern development tools, and comprehensive build optimizations. Built with Vue 3, Vite, Pinia, and following **BEM naming conventions** with **conventional commit standards** for consistent code quality and team collaboration.

## 🎯 Current Status (Updated: August 6th, 2025)
- ✅ **Enterprise Error Handling**: Comprehensive error boundary and notification system
- ✅ **Production Ready**: Optimized builds with compression and monitoring
- ✅ **Modern Architecture**: Vue 3 + Vite + Pinia with auto-imports
- ✅ **BEM Conventions**: Consistent naming across all components and files
- ✅ **Developer Experience**: Enhanced debugging, statistics, and recovery systems
- ✅ **Build Optimization**: Plugin system with environment-specific configurations

## 🚀 Key Features

### 🛡️ Enterprise Error Handling
- **Global Error Boundary**: Catches component errors and prevents app crashes
- **Notification System**: Professional toast notifications with multiple types
- **Error Recovery**: Automatic retry mechanisms with user-friendly fallbacks
- **Error Monitoring**: Comprehensive tracking with statistics and reporting
- **HTTP Integration**: Seamless error handling for API calls

### ⚡ Modern Development Stack
- **Vue 3.5.18**: Latest Vue with Composition API
- **Vite 7.0.6**: Lightning-fast build tool with HMR
- **Pinia 3.0.3**: Modern state management
- **Vue Router 4.5.1**: File-based routing with auto-imports
- **Axios 1.11.0**: HTTP client with unified error handling

### 🔧 Production Optimizations
- **Build Compression**: Gzip and Brotli compression enabled
- **Code Splitting**: Intelligent chunking for optimal loading
- **Bundle Analysis**: Built-in bundle size visualization
- **Environment Processing**: Type-safe environment variable handling
- **Plugin System**: Modular and configurable build plugins

### 📋 Code Quality & Standards
- **BEM Naming**: All components follow `BLOCK__ELEMENT--MODIFIER` structure
- **Conventional Commits**: Enforced through GitHub Actions and commitlint
- **ESLint Integration**: Automatic code quality checks
- **Error Boundaries**: Component-level error isolation
- **Type Safety**: Strict typing enforcement throughout

### 🛠️ Developer Experience
- **Auto Imports**: Vue, Vue Router, and Pinia APIs automatically imported
- **Error Statistics**: `window.globalErrorHandler.getStatistics()` for debugging
- **Hot Reload**: Instant feedback during development
- **Debugging Tools**: Enhanced error logging with context and stack traces
- **Documentation**: Comprehensive inline documentation and examples

## Installation
Ensure you have [pnpm](https://pnpm.io/) installed before proceeding.

```sh
pnpm install
```

## Usage

### Development
Start the development server with hot reload:
```sh
pnpm dev
```

### Build for Production
Generate an optimized production build:
```sh
pnpm build
```

### Preview Production Build
Preview the production build locally:
```sh
pnpm preview
```

### Error Handling Testing
Test the error handling system:
```javascript
// Component errors
throw new Error('Test component error')

// Network errors
fetch('/non-existent-endpoint')

// Promise rejections
Promise.reject(new Error('Test promise rejection'))

// View error statistics
console.log(window.globalErrorHandler.getStatistics())
```

## Project Structure

```
/vue3-boilerplate-template
├── src/
│   ├── components/
│   │   ├── COMPONENT__ERROR-BOUNDARY--GLOBAL.vue    # Error boundary
│   │   └── COMPONENT__NOTIFICATION--CONTAINER.vue   # Notification system
│   ├── views/
│   │   └── PAGE__HOME--DEFAULT.vue                  # Home page (BEM naming)
│   ├── router/
│   │   └── index.js                                 # Consolidated routing
│   ├── store/
│   │   └── index.js                                 # Pinia store setup
│   ├── utils/
│   │   ├── ERROR-HANDLER__GLOBAL--SYSTEM.js         # Error management
│   │   ├── HTTP-CLIENT__API--UNIFIED.js             # HTTP client
│   │   ├── ENV-PROCESSOR__VITE--WRAPPER.js          # Environment processing
│   │   └── PLUGINS__VITE--UNIFIED.js                # Build plugins
│   ├── styles/
│   │   └── global.css                               # Global styles
│   └── main.js                                      # Application entry point
├── APP__ROOT--MAIN.vue                              # Root component (BEM naming)
├── CHANGELOG__PROJECT--DAILY.md                     # Development history
├── package.json                                     # Dependencies and scripts
├── vite.config.js                                  # Vite configuration
├── eslint.config.js                                # ESLint configuration
└── README.md                                       # This documentation
```

## 🛡️ Error Handling System

### Error Boundary Component
- **Purpose**: Catches Vue component errors and prevents application crashes
- **Features**: Retry mechanisms, technical details toggle, error reporting
- **Usage**: Automatically wraps the entire application

### Global Error Handler
- **Classification**: 8 error types with 4 severity levels
- **Recovery**: Automatic retry strategies for transient errors
- **Monitoring**: Error statistics, history tracking, and reporting
- **Integration**: Works seamlessly with HTTP client and Vue components

### Notification System
- **Types**: Success, error, warning, info notifications
- **Features**: Auto-dismiss, action buttons, responsive design
- **Styling**: Dark theme support with smooth animations
- **Accessibility**: ARIA labels and keyboard navigation

## 🎨 BEM Naming Conventions

### Vue Components
- **Pages**: `PAGE__[name]--[variant].vue`
  - Example: `PAGE__HOME--DEFAULT.vue`
- **Components**: `COMPONENT__[feature]--[variant].vue`
  - Example: `COMPONENT__ERROR-BOUNDARY--GLOBAL.vue`
- **App Structure**: `APP__[level]--[type].vue`
  - Example: `APP__ROOT--MAIN.vue`

### Utility Files
- **Format**: `MODULE__FUNCTION--TYPE.js`
- **Examples**: 
  - `ERROR-HANDLER__GLOBAL--SYSTEM.js`
  - `HTTP-CLIENT__API--UNIFIED.js`
  - `ENV-PROCESSOR__VITE--WRAPPER.js`

### CSS Classes
```css
.block { }                    /* Block */
.block__element { }           /* Element */
.block--modifier { }          /* Modifier */
.block__element--modifier { } /* Element with modifier */
```

## 📦 Build System

### Vite Configuration
- **Plugins**: Auto-imports, component resolution, compression
- **Optimization**: Code splitting, bundle analysis, tree shaking
- **Environment**: Development vs production configurations
- **Aliases**: Path shortcuts for clean imports

### Plugin System
```javascript
// Environment-specific plugin loading
createVitePlugins({
  isDev: mode === 'development',
  enableAutoImport: true,
  enableCompression: mode === 'production',
  enableBundleAnalysis: mode === 'production'
})
```

## 🔧 Development Guidelines

### Commit Types
Use these conventional commit types:

| Type | Emoji | Description |
|------|-------|-------------|
| `feat` | 🆕 | A new feature |
| `fix` | 🐛 | A bug fix |
| `docs` | 📝 | Documentation only changes |
| `style` | 💄 | Code formatting, missing semi-colons, etc. |
| `refactor` | ♻️ | Code change that neither fixes a bug nor adds a feature |
| `perf` | ⚡ | Performance improvements |
| `test` | ✅ | Adding or updating tests |
| `build` | 📦 | Build system or external dependencies |
| `ci` | 🎡 | CI configuration files and scripts |
| `chore` | 🔨 | Other changes that don't modify src or test files |
| `revert` | ⏪ | Reverts a previous commit |

### Code Style
- **Functional Programming**: Prefer pure functions over OOP
- **Error Handling**: Always raise errors explicitly with specific types
- **Type Safety**: Use strict typing throughout the application
- **Immutability**: Never modify input parameters or global state
- **Modularity**: Write reusable, single-responsibility components

### Component Development
- **BEM Naming**: Follow naming conventions for all new components
- **Scoped Styles**: Use scoped CSS in Vue components
- **Prop Validation**: Implement proper prop validation
- **Error Boundaries**: Components are protected by global error boundary

## 🧪 Testing the System

### Error Handling Tests
```javascript
// Test component errors (in Vue component)
throw new Error('Test component error')

// Test HTTP errors
try {
  await fetch('/api/non-existent')
} catch (error) {
  console.log('HTTP error handled')
}

// Test promise rejections
Promise.reject(new Error('Test rejection'))

// View error statistics
console.table(window.globalErrorHandler.getStatistics())
```

### Performance Monitoring
```javascript
// Built-in performance tracking
window.globalErrorHandler.addEventListener((errorInfo) => {
  console.log('Error event:', errorInfo)
})
```

## 🚀 Production Deployment

### Build Optimizations
- **Compression**: Automatic gzip and brotli compression
- **Code Splitting**: Vendor chunks separated for optimal caching
- **Tree Shaking**: Unused code elimination
- **Minification**: ES build minification for smaller bundles

### Environment Configuration
```bash
# .env.example
VITE_API_BASE_URL=https://api.yourapp.com
VITE_APP_NAME=Your App Name
VITE_APP_VERSION=2.0.0
VITE_PORT=5173
```

### Build Analysis
```sh
# Analyze bundle size
pnpm build
# Opens stats.html with bundle visualization
```

## 📊 Monitoring & Analytics

### Error Statistics
```javascript
// Get comprehensive error statistics
const stats = window.globalErrorHandler.getStatistics()
console.log({
  totalErrors: stats.totalErrors,
  errorTypes: stats.typeBreakdown,
  severity: stats.severityBreakdown,
  retryAttempts: stats.retryAttempts
})
```

### Performance Metrics
- **Bundle Size**: Optimized for web performance
- **Load Time**: Fast initial page load with code splitting
- **Error Recovery**: Automatic retry mechanisms
- **User Experience**: Professional error handling and notifications

## 🔮 Future Enhancements

This boilerplate provides a solid foundation. Optional enhancements you can add:

1. **Testing Framework**: Vitest, Vue Test Utils, Cypress
2. **UI Library**: Element Plus, Naive UI, Quasar
3. **TypeScript**: Full TypeScript implementation
4. **CSS Framework**: Tailwind CSS, UnoCSS
5. **Internationalization**: Vue I18n
6. **PWA Features**: Service workers, offline support
7. **State Persistence**: Pinia persistence plugin

## Contributing

### Before Contributing
1. Read the **BEM naming conventions** guidelines
2. Understand the **conventional commit** format
3. Review the **error handling system** architecture
4. Test your changes with the built-in error testing tools

### Contribution Steps
1. Fork the repository
2. Create a feature branch with descriptive name
3. Follow BEM naming for new components
4. Test error handling scenarios
5. Use conventional commit messages
6. Ensure all automated checks pass

## Troubleshooting

### Common Issues
- **Development server won't start**: Check dependencies with `pnpm install`
- **Component errors**: Check error boundary console output
- **Build failures**: Run `pnpm build` and check for errors
- **Import errors**: Verify BEM naming and path aliases

### Error System Help
- **View error statistics**: `window.globalErrorHandler.getStatistics()`
- **Test error handling**: Use provided error testing snippets
- **Check error history**: Last 50 errors are tracked automatically
- **Monitor recovery**: Retry attempts are logged and tracked

## Recent Updates (August 6th, 2025)

### Major Enhancements
- ✅ **Enterprise Error Handling**: Complete error boundary and notification system
- ✅ **Production Optimization**: Compression, code splitting, bundle analysis
- ✅ **Enhanced Architecture**: Unified HTTP client with error integration
- ✅ **Developer Tools**: Error statistics, debugging helpers, performance monitoring
- ✅ **Build System**: Optimized Vite configuration with plugin system

### Technical Improvements
- ✅ **Error Resilience**: App no longer crashes from component errors
- ✅ **User Experience**: Professional error messages and notifications
- ✅ **Performance**: Optimized builds with intelligent chunking
- ✅ **Monitoring**: Comprehensive error tracking and analytics
- ✅ **Documentation**: Complete guides and examples

See `CHANGELOG__PROJECT--DAILY.md` for detailed change history.

## License
This project is licensed under the **MIT License**.

## Repository
- **GitHub**: [project-development-enviroment](https://github.com/uqcire/project-development-enviroment.git)
- **Template Purpose**: Production-ready Vue 3 boilerplate for web applications
- **Branch**: `main`

---

## 🎯 Quick Start

```bash
# Clone the template
git clone https://github.com/uqcire/project-development-enviroment.git my-project
cd my-project

# Install dependencies
pnpm install

# Start development
pnpm dev

# Test error handling (in browser console)
window.globalErrorHandler.getStatistics()
```

**Status**: ✅ **Production Ready** - Enterprise-grade boilerplate template  
**Last Updated**: August 6th, 2025  
**Maintainers**: Open to contributions following established conventions

---

**🚀 Ready to build amazing Vue 3 applications with confidence!**

