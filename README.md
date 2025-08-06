# Project Development Environment

## Overview
This project provides a modern development environment for building web applications using Vue 3, Vite, and Pinia. It follows **BEM naming conventions** and implements **conventional commit standards** with automated workflows for consistent code quality and team collaboration.

## 🎯 Current Status (Updated: August 6th, 2025)
- ✅ **Development Environment**: Fully functional with fixed startup issues
- ✅ **BEM Naming Conventions**: Implemented across all Vue components and files
- ✅ **GitHub Workflows**: Automated commit validation and PR templates
- ✅ **Simplified Architecture**: Consolidated router structure for better maintainability
- ✅ **Documentation**: Comprehensive guides and daily changelog

## Features

### Core Framework
- **Modern Frameworks**: Built with Vue 3, Vite, and Vue Router
- **State Management**: Uses Pinia for efficient and scalable state management
- **Component Architecture**: Follows BEM methodology for consistent naming

### Code Quality & Standards
- **BEM Naming**: All components follow `BLOCK__ELEMENT--MODIFIER` structure
- **Conventional Commits**: Enforced through GitHub Actions and commitlint
- **Code Linting**: ESLint with automatic fixing capabilities
- **Error Handling**: Explicit error raising with specific error types

### Development Tools
- **Automatic Imports**: Vue, Vue Router, and Pinia auto-imports
- **Type Safety**: Strict typing enforcement
- **Functional Programming**: Pure functions with clear input/output

## Installation
Ensure you have [pnpm](https://pnpm.io/) installed before proceeding.

```sh
pnpm install
```

## Usage

### Development
Start the development server:
```sh
pnpm dev
```

### Build for Production
Generate a production-ready build:
```sh
pnpm build
```

### Preview Production Build
Preview the build locally:
```sh
pnpm preview
```

### Commit Guidelines
Use conventional commit format:
```sh
git commit -m "feat: add new feature"
git commit -m "fix(component): resolve styling issue"
git commit -m "docs: update README"
```

## Project Structure (Updated)
```
/project-development-environment
├── src/
│   ├── components/          # Vue components (BEM naming)
│   ├── views/
│   │   └── PAGE__HOME--DEFAULT.vue  # Home page component
│   ├── router/
│   │   └── index.js         # Consolidated routing (simplified)
│   ├── store/              # Pinia state management
│   ├── styles/             # Global styles
│   ├── utils/              # Utility functions
│   └── main.js            # Application entry point
├── APP__ROOT--MAIN.vue     # Main application component (BEM naming)
├── CHANGELOG__PROJECT--DAILY.md  # Daily development log
├── package.json           # Project dependencies and scripts
├── pnpm-lock.yaml        # Dependency lock file
├── vite.config.js        # Vite configuration
├── eslint.config.js      # ESLint configuration
└── README.md            # This documentation
```

## BEM Naming Conventions

### Vue Components
- **Page Components**: `PAGE__[name]--[variant].vue`
  - Example: `PAGE__HOME--DEFAULT.vue`
- **App Components**: `APP__[level]--[type].vue`
  - Example: `APP__ROOT--MAIN.vue`
- **Feature Components**: `COMPONENT__[feature]--[variant].vue`

### CSS Classes
```css
.block { }                    /* Block */
.block__element { }           /* Element */
.block--modifier { }          /* Modifier */
.block__element--modifier { } /* Element with modifier */
```

### File Naming
- Use **UPPERCASE** with BEM structure
- Format: `BLOCK__ELEMENT--MODIFIER.extension`
- Examples: `CHANGELOG__PROJECT--DAILY.md`, `PROJECT-RULES__CONVENTIONS--COMPLETE.md`

## Commit Types
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

## Development Guidelines

### Code Style
- Prefer **functional programming** over OOP
- Use **pure functions** with clear input/output
- **Never modify** input parameters or global state
- Use **strict typing** in all languages
- Follow **DRY, KISS, and YAGNI** principles

### Error Handling
- Always **raise errors explicitly**
- Use **specific error types**
- Provide **clear, actionable error messages**
- **Log errors** with appropriate context

### Component Development
- Follow **BEM naming** for all new components
- Use **scoped styles** in Vue components
- Implement **proper prop validation**
- Write **reusable, modular** components

## GitHub Integration

### Automated Workflows
- **Commit Validation**: Automatic checking of commit message format
- **PR Templates**: Standardized pull request guidelines
- **Branch Protection**: Quality checks on main and develop branches

### Pull Request Process
1. Follow BEM naming for any new components
2. Use conventional commit messages
3. Fill out the PR template completely
4. Ensure all tests pass
5. Document any breaking changes

## Recent Changes (August 6th, 2025)
- ✅ **Fixed Development Server**: Resolved vite config issues
- ✅ **Implemented BEM Naming**: All components renamed with BEM conventions
- ✅ **Simplified Router**: Consolidated from 2 files to 1 file
- ✅ **Added GitHub Workflows**: Automated commit validation
- ✅ **Enhanced Documentation**: Added comprehensive guides and changelog

See `CHANGELOG__PROJECT--DAILY.md` for detailed change history.

## Contributing

### Before Contributing
1. Read the **BEM naming conventions** guide
2. Understand the **conventional commit** format
3. Review the **project structure** and existing patterns
4. Check the **Cursor rules** for AI assistance guidelines

### Contribution Steps
1. Fork the repository
2. Create a feature branch with descriptive name
3. Follow BEM naming for new components
4. Use conventional commit messages
5. Fill out the PR template
6. Ensure all automated checks pass

## Troubleshooting

### Common Issues
- **Development server won't start**: Check for missing dependencies with `pnpm install`
- **Commit rejected**: Ensure commit message follows conventional format
- **Import errors**: Verify component paths after BEM renaming
- **Build failures**: Check ESLint errors with `pnpm lint`

### Getting Help
- Check the `CHANGELOG__PROJECT--DAILY.md` for recent changes
- Review error messages for specific guidance
- Ensure all dependencies are installed
- Verify file paths match BEM naming conventions

## License
This project is licensed under the **MIT License**.

## Repository
- **GitHub**: [project-development-enviroment](https://github.com/uqcire/project-development-enviroment.git)
- **Latest Commit**: `b342898` - BEM naming and architecture simplification
- **Branch**: `main`

---

**Last Updated**: August 6th, 2025  
**Status**: ✅ Active Development with BEM Standards  
**Maintainers**: Open to contributions following established conventions

