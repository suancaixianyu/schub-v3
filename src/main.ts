import { createApp } from 'vue'
import App from './App.vue'

// element 导入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/theme-chalk/display.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 富文本编辑器
import 'md-editor-v3/lib/style.css'

// 导入路由
import router from './router/index.ts'

// 瀑布流样式
import 'vue-waterfall-plugin-next/dist/style.css'

// css动画库
import 'animate.css/animate.min.css'

// 后引入自定义样式以覆盖预设
import './styles/style.scss'

const app = createApp(App)

app.use(router)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus, {
  locale: zhCn,
})

app.mount('#app')
