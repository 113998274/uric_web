import {ref, reactive} from 'vue'
import axios from 'axios'
// import { useRoute, useRouter } from 'vue-router' // vue3文件中用法，js文件需要用下面import
import router from '@/router'
import {defineStore} from 'pinia'
import {message} from 'ant-design-vue';
import settings from '@/settings'


// 创建store
export const useUsersStore = defineStore(
    'users',    // store id
    {
        // 定义数据，等同于data()
        state: () => ({
            isLoggedIn: false,  // 登录状态
            useData: {},    // 用户数据
        }),

        // 定义getters，等同于compute()
        getters: {
            hello: state => 'hello,' + state.username  // 第一个state是绑定上面的state,第二个state是引用当前的，hello值跟随state而变化
        },

        // 定义actions，等同于method()
        actions: {
            async login(postData) {  // 异步action处理异步逻辑
                const result = await axios({    // post请求后端认证
                    url: settings.login_url,
                    method: 'post',
                    data: postData,
                })
                    .then((response) => {   // 成功
                        this.isLoggedIn = true;
                        this.useData = response.data;   // 用户信息
                        // console.log(this.useData)
                        redirectToPreviousRoute();

                    })
                    .catch((error) => {     // 失败
                        for (let i in error.response.data) {
                            console.log(i, error.response.data[i])
                            message.error(i + ': ' + error.response.data[i])
                        }
                        // this.$message.error('用户名或者密码有误，请重新输入！');
                        // console.log('用户名或者密码有误，请重新输入！');
                        // console.log(error);
                    })
            },
            // 登出
            logout() {
                this.isLoggedIn = false
                this.useData = {}
                router.push('/login')
            }
        },
        // 持久化到客户端
        persist: {
            // key: 'users',    // key，默认对应上面defineStore的id，即users
            storage: localStorage,  // 默认localStorage存在本地。sessionStorage存在session，关闭浏览器会重置
            // storage: Remember.value ? localStorage : sessionStorage,  // true则localStorage存在本地。否则存在sessionStorage，关闭浏览器会重置
            // 本插件测试多次希望通过remeber me修改storage存储，但发现在defineStore的时候就已经固定，没有找到方法
            // paths: ['isLoggedIn', 'useData']    // 定义只上报哪些values,默认全部上报，对应上面state
        }
    })

// 登录成功后，调用该方法跳转回之前的路由地址
function redirectToPreviousRoute() {
    const redirect = router.currentRoute.value.query.redirect
    if (redirect && redirect !== '/login') {  // 如果有之前的路由地址并且不是/login，则跳转到之前，否则跳转到根目录
        router.push(redirect)
    } else {
        router.push('/')
    }
}

export default useUsersStore