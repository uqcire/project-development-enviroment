import vue from '@vitejs/plugin-vue'

import Components from 'unplugin-vue-components/vite'

import unplugin from './unplugin'

export function createVitePlugins() {
  const plugins = [
    vue(),

    ...unplugin,
    Components({
      resolvers: [],
    }),
  ]

  return plugins
}
