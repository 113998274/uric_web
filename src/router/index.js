import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WeatherView from '../views/WeatherView.vue'
import WeatherView2 from '../views/WeatherView2.vue'
import WeatherView3 from '../views/WeatherView3.vue'
import WeatherView4 from '../views/WeatherView4.vue'
import Parent from '../views/parent/Parent.vue'
import Children1 from '../views/parent/Children.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    },
    {
        path: '/weather',
        name: 'weather',
        component: WeatherView,
        meta: {
            title: 'v1版本 原始写法 vue2写法',
        }
    },
    {
        path: '/weather2',
        name: 'weather2',
        component: WeatherView2,
        meta: {
            title: 'v1版本 原始写法 vue2写法 添加ant-design-vue前端框架做润色',
        }
    },
    {
        path: '/weather3',
        name: 'weather3',
        component: WeatherView3,
        meta: {
            title: 'v2版本 vue3写法',
        }
    },
    {
        path: '/weather4',
        name: 'weather4',
        component: WeatherView4,
        meta: {
            title: 'v2版本 vue3写法 添加ant-design-vue前端框架做润色',
        }
    },
    // 子路由配置
    {
        // 访问父路径的时候，返回Parent_base.vue，这是一个父路由base.vue，作用只有放一个<template><router-view/></template>，用作子路由嵌套用
        // 除非子路由的内容需要嵌套到父路由的内容中，则这个父路径应该指向一个有内容的html，如果相互独立，就可以按这方法实现
        path: '/parent',
        name: 'Parent_base',
        component: () => import('../views/Parent_base.vue'),
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
