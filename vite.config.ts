import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // base: '/com/',
  plugins: [
    vue(),
    VitePWA({
      manifest: {
        // 安装应用后显示的应用名
        name: '生存战争中文社区',
        short_name: '生存战争中文社区',
        description: '生存战争中文社区',
        // 至少配置一个图标
        icons: [
          {
            // 注意如果应用不是部署在站点根目录则需要相对路径，图片文件放在项目/public/pwa/192x192.png
            src: './pwa/icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
        ],
        background_color: '#ffffff',
        theme_color: '#42b883',
      },
      registerType: 'autoUpdate',
      workbox: {
        // 对所有匹配的静态资源进行缓存
        globPatterns: ['**/*.{js,css,html,ico,png,jpeg,jpg,svg}'],
      },
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@comps': resolve(__dirname, 'src', 'components'),
      '@style': resolve(__dirname, 'src', 'styles'),
      '@img': resolve(__dirname, 'public', 'imgs'),
    },
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       implementation: require('sass'),
  //     },
  //   },
  // },
})
