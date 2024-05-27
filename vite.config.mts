import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import { createVitePlugins } from './src/build/plugin'
import { wrapperEnv } from './src/build/utils'

// https://vitejs.dev/config/
export default defineConfig((mode) => {
  const env = loadEnv(mode, process.cwd())
  const viteEnv = wrapperEnv(env)
  const { VITE_PORT, VITE_PUBLIC_PATH } = viteEnv

  return {
    plugins: createVitePlugins(),
    base: VITE_PUBLIC_PATH || '/',
    resolve: {
      alias: {
        '@': path.join(process.cwd(), 'src'),
      },
    },
    server: {
      host: true, // 指定服务器主机名
      port: VITE_PORT, // 指定服务器端口
      open: false, // 在服务器启动时自动在浏览器中打开应用程序
      strictPort: false, // 设为 false 时，若端口已被占用则会尝试下一个可用端口,而不是直接退出
      https: false, // 是否开启 https
      cors: true, // 为开发服务器配置 CORS。默认启用并允许任何源
    },
  }
})
