import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import visualizer from 'rollup-plugin-visualizer'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import unplugin from './unplugin'

export function createVitePlugins() {
  const plugins = [
    vue(),
    UnoCSS(),
    ...unplugin,
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
  ]

  return plugins
}
