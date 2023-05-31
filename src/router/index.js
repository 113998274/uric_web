import {createRouter, createWebHistory} from 'vue-router'
import useUsersStore from '@/store/users'

import LoginView from '../views/LoginView.vue'
import WeatherView from '../views/study/WeatherView.vue'
import WeatherView2 from '../views/study/WeatherView2.vue'
import WeatherView3 from '../views/study/WeatherView3.vue'
import WeatherView4 from '../views/study/WeatherView4.vue'
import TestUserView from '../components/TestUserView'
import Parent from '../views/study/parent/Parent.vue'
import Children1 from '../views/study/parent/Children.vue'
import EchartsView from '../views/study/EchartsView.vue'

// cmdb
import InstanceListView from '../views/cmdb/InstanceListView.vue'
// deploy
import RemoteInstView from '../views/deploy/RemoteInstView.vue'
import PlayBookView from '../views/deploy/PlayBookView.vue'
import PlayBookRunView from '../views/deploy/PlayBookRunView.vue'
import AdHocView from '../views/deploy/AdHocView.vue'

const routes = [
    {
        path: '/',
        name: 'layout',
        component: () => import('../views/Layout.vue'),     // Layout 导航栏布局页
        children: [
            {
                path: '',
                name: 'Index_page',
                component: TestUserView,
                meta: {
                    title: '主页',
                    authenticated: true,
                },
            },
            {
                path: 'echarts',
                name: 'echarts',
                component: EchartsView,
                meta: {
                    title: 'echarts图形测试',
                    authenticated: true,
                    is_superuser: true,
                }
            },
            {
                path: 'cmdb',
                name: 'cmdb',
                // component: TestUserView,
                meta: {
                    title: '资产列表总览',
                    authenticated: true,
                },
                children: [
                    {
                        path: 'instance-list',
                        name: 'instance-list',
                        component: InstanceListView,
                        meta: {
                            title: '资产列表-服务器列表',
                            authenticated: true,
                        },
                    },
                ]
            },
            {
                path: 'deploy',
                name: 'deploy',
                // component: TestUserView,
                meta: {
                    title: '部署工具',
                    authenticated: true,
                    is_superuser: true,
                },
                children: [
                    {
                        path: 'remote-inst',
                        name: 'remote-inst',
                        component: RemoteInstView,
                        meta: {
                            title: '部署工具-远程主机管理',
                            authenticated: true,
                            is_superuser: true,
                        },
                    },
                    {
                        path: 'playbook',
                        name: 'playbook',
                        component: PlayBookView,
                        meta: {
                            title: '部署工具-playbook管理',
                            authenticated: true,
                            is_superuser: true,
                        },
                    },
                    {
                        path: 'playbook-run',
                        name: 'playbook-run',
                        component: PlayBookRunView,
                        meta: {
                            title: '部署工具-playbook运行',
                            authenticated: true,
                            is_superuser: true,
                        },
                    },
                    {
                        path: 'ad-hoc',
                        name: 'ad-hoc',
                        component: AdHocView,
                        meta: {
                            title: '部署工具-ad-hoc运行',
                            authenticated: true,
                            is_superuser: true,
                        },
                    },

                ]
            },
        ]
    },
    // login不写在/的children里面，因为login登录页面独立一整个html，不使用Layout.vue模板
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: {
            title: 'Login登录页',
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
                    authenticated: true,
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


// 全局前置路由守卫，路由跳转前触发
router.beforeEach((to, from, next) => {
    // 实例化user store
    const UsersStore = useUsersStore()
    // console.log(3214, UsersStore.useData)

    // 路由守卫：限制登录与管理员权限页面
    if (to.meta.is_superuser) {     // 判断该页面是否需要管理员权限
        if (UsersStore.useData.is_superuser === 'true') {  // 判断是否管理员，是则正常路由，注意这里返回是字符串
            next();
        } else {    // 否则弹出提示，并路由至主页
            alert('无访问权限');
            next({
                path: from.fullPath,
            });
        }
    } else if (to.meta.authenticated) {     // 判断该页面是否需要登录权限
        if (UsersStore.isLoggedIn) {     // 判断是否已登录，是则正常路由
            next();
        } else {    // 否则路由至登录页
            next({
                name: 'login',
                query: {redirect: to.fullPath}    // 用于登录成功后返回跳转到登录页前的路由的配置
            });
        }
    } else {    // 无限制则正常路由
        next();
    }

    // 路由发生变化修改页面title
    if (to.meta.title) {
        document.title = to.meta.title
    }
})

export default router
