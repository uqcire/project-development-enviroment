import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      exclude: ['node_modules', '.git', '.github', '.husky', '.vscode', 'build', 'dist', 'mock', 'public', './stats.html']
    }
  },
  presets: [
    presetUno(), presetIcons(), presetAttributify(),
  ],
})
