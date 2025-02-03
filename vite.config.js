import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'
import viteCompression from 'vite-plugin-compression'
import { wrapperEnv } from './src/build/utils'


// https://vitejs.dev/config/
export default defineConfig((mode) => {
  // Your code here
  const env = loadEnv(mode, process.cwd())
  const viteEnv = wrapperEnv(env)
  const { VITE_PORT, VITE_PUBLIC_PATH } = viteEnv

  return {

    plugins: [
      vue(),
      viteCompression({
        deleteOriginFile: false, // 压缩后是否删除源文件
      }),
      visualizer({
        open: true, // build后，是否自动打开分析页面，默认false
        gzipSize: true, // 是否分析gzip大小
        brotliSize: true, // 是否分析brotli大小
      // filename: 'stats.html'//分析文件命名
      }),

    ],
    base: VITE_PUBLIC_PATH || '/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      // 导入文件时省略的扩展名列表
      extensions: [
        '.mjs',
        '.js',
        '.ts',
        '.jsx',
        '.tsx',
        '.json',
      ],
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
