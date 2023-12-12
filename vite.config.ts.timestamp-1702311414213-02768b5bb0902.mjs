// vite.config.ts
import { defineConfig } from "file:///C:/Users/xxy/Desktop/xianyu/schub/node_modules/.pnpm/vite@5.0.0_sass@1.69.5/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/xxy/Desktop/xianyu/schub/node_modules/.pnpm/@vitejs+plugin-vue@4.5.0_vite@5.0.0_vue@3.3.8/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
import { VitePWA } from "file:///C:/Users/xxy/Desktop/xianyu/schub/node_modules/.pnpm/vite-plugin-pwa@0.17.0_vite@5.0.0_workbox-build@7.0.0_workbox-window@7.0.0/node_modules/vite-plugin-pwa/dist/index.js";
import AutoImport from "file:///C:/Users/xxy/Desktop/xianyu/schub/node_modules/.pnpm/unplugin-auto-import@0.16.7_rollup@2.79.1/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///C:/Users/xxy/Desktop/xianyu/schub/node_modules/.pnpm/unplugin-vue-components@0.25.2_rollup@2.79.1_vue@3.3.8/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///C:/Users/xxy/Desktop/xianyu/schub/node_modules/.pnpm/unplugin-vue-components@0.25.2_rollup@2.79.1_vue@3.3.8/node_modules/unplugin-vue-components/dist/resolvers.mjs";
var __vite_injected_original_dirname = "C:\\Users\\xxy\\Desktop\\xianyu\\schub";
var vite_config_default = defineConfig({
  // base: '/com/',
  plugins: [
    vue(),
    VitePWA({
      manifest: {
        // 安装应用后显示的应用名
        name: "\u751F\u5B58\u6218\u4E89\u4E2D\u6587\u793E\u533A",
        short_name: "\u751F\u5B58\u6218\u4E89\u4E2D\u6587\u793E\u533A",
        description: "\u751F\u5B58\u6218\u4E89\u4E2D\u6587\u793E\u533A",
        // 至少配置一个图标
        icons: [
          {
            // 注意如果应用不是部署在站点根目录则需要相对路径，图片文件放在项目/public/pwa/192x192.png
            src: "./pwa/icon.svg",
            sizes: "192x192",
            type: "image/svg+xml"
          }
        ],
        background_color: "#ffffff",
        theme_color: "#42b883"
      },
      registerType: "autoUpdate",
      workbox: {
        // 对所有匹配的静态资源进行缓存
        globPatterns: ["**/*.{js,css,html,ico,png,jpeg,jpg,svg}"]
      }
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src"),
      "@comps": resolve(__vite_injected_original_dirname, "src", "components"),
      "@style": resolve(__vite_injected_original_dirname, "src", "styles"),
      "@img": resolve(__vite_injected_original_dirname, "public", "imgs")
    }
  }
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       implementation: require('sass'),
  //     },
  //   },
  // },
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx4eHlcXFxcRGVza3RvcFxcXFx4aWFueXVcXFxcc2NodWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHh4eVxcXFxEZXNrdG9wXFxcXHhpYW55dVxcXFxzY2h1YlxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMveHh5L0Rlc2t0b3AveGlhbnl1L3NjaHViL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJ1xuXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIC8vIGJhc2U6ICcvY29tLycsXG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICBWaXRlUFdBKHtcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIC8vIFx1NUI4OVx1ODhDNVx1NUU5NFx1NzUyOFx1NTQwRVx1NjYzRVx1NzkzQVx1NzY4NFx1NUU5NFx1NzUyOFx1NTQwRFxuICAgICAgICBuYW1lOiAnXHU3NTFGXHU1QjU4XHU2MjE4XHU0RTg5XHU0RTJEXHU2NTg3XHU3OTNFXHU1MzNBJyxcbiAgICAgICAgc2hvcnRfbmFtZTogJ1x1NzUxRlx1NUI1OFx1NjIxOFx1NEU4OVx1NEUyRFx1NjU4N1x1NzkzRVx1NTMzQScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU3NTFGXHU1QjU4XHU2MjE4XHU0RTg5XHU0RTJEXHU2NTg3XHU3OTNFXHU1MzNBJyxcbiAgICAgICAgLy8gXHU4MUYzXHU1QzExXHU5MTREXHU3RjZFXHU0RTAwXHU0RTJBXHU1NkZFXHU2ODA3XG4gICAgICAgIGljb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgLy8gXHU2Q0U4XHU2MTBGXHU1OTgyXHU2NzlDXHU1RTk0XHU3NTI4XHU0RTBEXHU2NjJGXHU5MEU4XHU3RjcyXHU1NzI4XHU3QUQ5XHU3MEI5XHU2ODM5XHU3NkVFXHU1RjU1XHU1MjE5XHU5NzAwXHU4OTgxXHU3NkY4XHU1QkY5XHU4REVGXHU1Rjg0XHVGRjBDXHU1NkZFXHU3MjQ3XHU2NTg3XHU0RUY2XHU2NTNFXHU1NzI4XHU5ODc5XHU3NkVFL3B1YmxpYy9wd2EvMTkyeDE5Mi5wbmdcbiAgICAgICAgICAgIHNyYzogJy4vcHdhL2ljb24uc3ZnJyxcbiAgICAgICAgICAgIHNpemVzOiAnMTkyeDE5MicsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2Uvc3ZnK3htbCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICB0aGVtZV9jb2xvcjogJyM0MmI4ODMnLFxuICAgICAgfSxcbiAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxuICAgICAgd29ya2JveDoge1xuICAgICAgICAvLyBcdTVCRjlcdTYyNDBcdTY3MDlcdTUzMzlcdTkxNERcdTc2ODRcdTk3NTlcdTYwMDFcdThENDRcdTZFOTBcdThGREJcdTg4NENcdTdGMTNcdTVCNThcbiAgICAgICAgZ2xvYlBhdHRlcm5zOiBbJyoqLyoue2pzLGNzcyxodG1sLGljbyxwbmcsanBlZyxqcGcsc3ZnfSddLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXG4gICAgfSksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldLFxuICAgIH0pLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcbiAgICAgICdAY29tcHMnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycsICdjb21wb25lbnRzJyksXG4gICAgICAnQHN0eWxlJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnLCAnc3R5bGVzJyksXG4gICAgICAnQGltZyc6IHJlc29sdmUoX19kaXJuYW1lLCAncHVibGljJywgJ2ltZ3MnKSxcbiAgICB9LFxuICB9LFxuICAvLyBjc3M6IHtcbiAgLy8gICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gIC8vICAgICBzY3NzOiB7XG4gIC8vICAgICAgIGltcGxlbWVudGF0aW9uOiByZXF1aXJlKCdzYXNzJyksXG4gIC8vICAgICB9LFxuICAvLyAgIH0sXG4gIC8vIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFpUyxTQUFTLG9CQUFvQjtBQUM5VCxPQUFPLFNBQVM7QUFDaEIsU0FBUyxlQUFlO0FBQ3hCLFNBQVMsZUFBZTtBQUV4QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLDJCQUEyQjtBQVBwQyxJQUFNLG1DQUFtQztBQVN6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQTtBQUFBLEVBRTFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLFFBQVE7QUFBQSxNQUNOLFVBQVU7QUFBQTtBQUFBLFFBRVIsTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osYUFBYTtBQUFBO0FBQUEsUUFFYixPQUFPO0FBQUEsVUFDTDtBQUFBO0FBQUEsWUFFRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFFBQ0Y7QUFBQSxRQUNBLGtCQUFrQjtBQUFBLFFBQ2xCLGFBQWE7QUFBQSxNQUNmO0FBQUEsTUFDQSxjQUFjO0FBQUEsTUFDZCxTQUFTO0FBQUE7QUFBQSxRQUVQLGNBQWMsQ0FBQyx5Q0FBeUM7QUFBQSxNQUMxRDtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsV0FBVyxDQUFDLG9CQUFvQixDQUFDO0FBQUEsSUFDbkMsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsV0FBVyxDQUFDLG9CQUFvQixDQUFDO0FBQUEsSUFDbkMsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsTUFDN0IsVUFBVSxRQUFRLGtDQUFXLE9BQU8sWUFBWTtBQUFBLE1BQ2hELFVBQVUsUUFBUSxrQ0FBVyxPQUFPLFFBQVE7QUFBQSxNQUM1QyxRQUFRLFFBQVEsa0NBQVcsVUFBVSxNQUFNO0FBQUEsSUFDN0M7QUFBQSxFQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
