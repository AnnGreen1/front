import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: "0.0.0.0",
    port: 5080,
    open: true,
    proxy: {
      // 后端接口
      "/api": {
        // target: 'http://192.168.16.211:8080', //测试环境
        // target: 'http://192.168.16.139:8080', //刘庆 B环境
        // target: 'http://192.168.16.96:8080', //前台
        // target: "http://192.168.16.245:8080", //赵晨 ip
        // target: "http://192.168.16.168:8080", // 宋赛
        // target: 'http://192.168.16.253:8080', // 开发服务器
        // target: 'http://106.119.167.29:90',
        // target: 'http://192.168.16.151:8080', // 春成
        target: "http://192.168.16.154:8080", // 燕飞开发服务器
        // target: 'http://192.168.16.131:8080', // 袁燕飞
        // target: "http://192.168.16.174:8080",
        // target: "http://192.168.16.110:8080", // 周逸之
        changeOrigin: true, // 允许跨域
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      },
      // 阿里云tts
      "/ali-tts": {
        target: "https://nls-gateway-cn-shanghai.aliyuncs.com",
        changeOrigin: true, // 允许跨域
        rewrite: (path) => path.replace(/^\/ali-tts/, "")
      },
      // 后端llm
      "/ws": {
        // target: 'ws://192.168.16.245:8080', // 目标 WebSocket 服务器地址
        target: "ws://192.168.16.154:8080",
        // target: env.VITE_WS_URL || "ws://192.168.16.110:8080",
        changeOrigin: true,
        ws: true, // 开启 WebSocket 代理
        rewrite: (path) => path.replace(/^\/ws/, "")
      },
      // 阿里云流式ws
      "/ws-tts": {
        target: "wss://nls-gateway-cn-beijing.aliyuncs.com",
        changeOrigin: true,
        ws: true, // 开启 WebSocket 代理
        rewrite: (path) => path.replace(/^\/ws-tts/, "")
      }
    },
    hmr: {
      overlay: false
    }
  },
})
