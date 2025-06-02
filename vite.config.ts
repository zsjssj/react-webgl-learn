import {reactRouter} from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import {defineConfig} from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    proxy: {
      '/.well-known': {
        target: 'http://localhost:5173', // 代理到自身（静默处理）
        rewrite: (path) => '' // 返回空内容
      }
    }
  }
})
