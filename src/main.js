import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.css'
import 'ant-design-vue/dist/antd.less'
// 暗黑模式
// import 'ant-design-vue/dist/antd.dark.css'
// import 'ant-design-vue/dist/antd.dark.less'
import pinia from '@/store'


const app = createApp(App)

// 动态注册icon
import * as Icons from '@ant-design/icons-vue'
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key])
})

app
    .use(router)
    .use(Antd)
    .use(pinia)
    .mount('#app')
