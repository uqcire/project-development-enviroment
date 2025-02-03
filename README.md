# Project Development Environment

## Overview
This project provides a development environment for building modern web applications using Vue 3, Vite, and Pinia. It is equipped with essential development tools, including ESLint, Commitlint, and Husky, to ensure code quality and consistency.

## Features
- **Modern Frameworks**: Built with Vue 3, Vite, and Vue Router.
- **State Management**: Uses Pinia for efficient and scalable state management.
- **Code Linting and Formatting**: Includes ESLint and lint-staged to enforce code quality.
- **Git Hooks**: Configured with Husky to automate pre-commit linting and commit message validation.
- **Commit Standardization**: Uses Commitlint and Commitizen for structured commit messages.
- **Automatic Imports**: Leverages unplugin-auto-import and unplugin-vue-components for streamlined development.
- **Performance Optimization**: Includes rollup-plugin-visualizer and vite-plugin-compression.

## Installation
Ensure you have [pnpm](https://pnpm.io/) installed before proceeding.

```sh
pnpm install
```

## Usage
### Development
Start the development server with:
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

### Linting
Run ESLint to check for issues:
```sh
pnpm lint
```

Automatically fix lint issues:
```sh
pnpm lint:fix
```

### Commit Standardization
To ensure commit messages follow the conventional format, use:
```sh
pnpm cz
```

## Project Structure
```
/project-development-environment
│── src/             # Source code
│── public/          # Static assets
│── .eslintrc.js     # ESLint configuration
│── commitlint.config.js  # Commitlint configuration
│── package.json     # Project metadata and dependencies
│── pnpm-lock.yaml   # Dependency lock file
│── README.md        # Project documentation
```

## License
This project is licensed under the **MIT License**.

## Contributors
Contributions are welcome! Please follow the commit guidelines and submit a pull request.

