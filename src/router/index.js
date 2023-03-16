import {createRouter, createWebHistory} from 'vue-router'
import WeatherView from '../views/study/WeatherView.vue'
import WeatherView2 from '../views/study/WeatherView2.vue'
import WeatherView3 from '../views/study/WeatherView3.vue'
import WeatherView4 from '../views/study/WeatherView4.vue'
import Parent from '../views/study/parent/Parent.vue'
import Children1 from '../views/study/parent/Children.vue'
import EchartsView from '../views/study/EchartsView.vue'

const routes = [
    {
        path: '/',
        name: 'layout',
        component: () => import('../views/Layout.vue'),     // Layout 导航栏布局页
        children: [
            {
                path: '',
                name: 'Index_page',
                component: WeatherView4,
                meta: {
                    title: '主页',
                },
            },
            {
                path: 'echarts',
                name: 'echarts',
                component: EchartsView,
                meta: {
                    title: 'echarts图形测试',
                }
            },
        ]
    },
    // login不写在/的children里面，因为login登录页面独立一整个html，不使用Layout.vue模板
    {
        path: '/login',
        name: 'login',
        component: WeatherView4,
        meta: {
            title: 'v2版本 vue3写法 添加ant-design-vue前端框架做润色',
        }
    },
    {
        path: '/study',
        name: 'study',
        component: () => import('../views/StudyBaseView.vue'),
        children: [
            {
                path: '',
                alias: 'weather',
                name: 'weather',
                component: WeatherView,
                meta: {
                    title: 'v1版本 原始写法 vue2写法',
                }
            },
            {
                path: 'weather2',
                name: 'weather2',
                component: WeatherView2,
                meta: {
                    title: 'v1版本 原始写法 vue2写法 添加ant-design-vue前端框架做润色',
                }
            },
            {
                path: 'weather3',
                name: 'weather3',
                component: WeatherView3,
                meta: {
                    title: 'v2版本 vue3写法',
                }
            },
            {
                path: 'weather4',
                name: 'weather4',
                component: WeatherView4,
                meta: {
                    title: 'v2版本 vue3写法 添加ant-design-vue前端框架做润色',
                }
            },
            {
                // 访问父路径的时候，返回Parent_base.vue，这是一个父路由base.vue，作用只有放一个<template><router-view/></template>，用作子路由嵌套用
                // 除非子路由的内容需要嵌套到父路由的内容中，则这个父路径应该指向一个有内容的html，如果相互独立，就可以按这方法实现
                path: 'parent',
                name: 'Parent_base',
                component: () => import('../views/study/Parent_base.vue'),
                children: [
                    {
                        // 定义一个空路径子路由，让Parent代码块填充到Parent_base的<router-view/>中
                        path: '',
                        name: 'Parent',
                        component: Parent,
                        meta: {
                            title: '子路由配置：主路径',
                        },
                    },
                    {
                        // 定义一个自定义子路由，让children1代码块填充到Parent_base的<router-view/>中
                        path: 'children1',
                        name: 'children1',
                        component: Children1,
                        meta: {
                            title: '子路由配置：主路径',
                        },
                    },
                ]
            },

        ]
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

// 路由发生变化修改页面title
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})

export default router
