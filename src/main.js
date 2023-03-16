import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import settings from '@/settings'
import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.css'
import 'ant-design-vue/dist/antd.less'
// 暗黑模式
// import 'ant-design-vue/dist/antd.dark.css'
// import 'ant-design-vue/dist/antd.dark.less'


const app = createApp(App)
app.use(router).use(Antd).mount('#app')
app.config.globalProperties.$settings = settings;