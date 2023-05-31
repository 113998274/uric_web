<template>
  <a-layout>
    <a-layout-header class="header">
      <div class="logo"/>
      <a-row>
        <a-col :span="18">
          <a-menu
              v-model:selectedKeys="selectedKeys1"
              theme="dark"
              mode="horizontal"
              :style="{ lineHeight: '64px' }"
          >
            <a-menu-item key="1">
              <router-link to="/">
                <span>主页</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="2">展示</a-menu-item>
          </a-menu>
        </a-col>
        <a-col :span="1" :offset="5">
          <a-dropdown-button type="link">
            <template #overlay>
              <a-menu @click="userMenuClick">
                <a-menu-item key="1" disabled>
                  <edit-outlined/>
                  编辑
                </a-menu-item>
                <a-menu-item key="2">
                  <logout-outlined/>
                  登出
                </a-menu-item>
              </a-menu>
            </template>
            <template #icon>
              <UserOutlined :style="{fontSize: '20px'}"/>
            </template>
          </a-dropdown-button>
          <!--            <a-space style="color: #9b9b9b">-->
          <!--              <user-outlined :style="{fontSize: '20px'}"/>-->
          <!--            </a-space>-->
        </a-col>
      </a-row>


    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <!--      <a-breadcrumb style="margin: 16px 0">-->
      <!--        <a-breadcrumb-item>Home</a-breadcrumb-item>-->
      <!--        <a-breadcrumb-item>List</a-breadcrumb-item>-->
      <!--        <a-breadcrumb-item>App</a-breadcrumb-item>-->
      <!--      </a-breadcrumb>-->
      <a-layout style="padding: 24px 0; background: #fff">
        <a-layout-sider width="200" style="background: #fff">

          <a-menu
              v-model:selectedKeys="selectedKeys2"
              v-model:openKeys="openKeys"
              mode="inline"
              style="height: 100%"
          >
            <template v-for="menu in menu_list">
              <a-menu-item v-if="menu.children.length===0" :key="menu.key">

                <router-link :to="menu.path">
                  <span>
                    <component :is="menu.icon"></component>
                    {{ menu.title }}
                  </span>
                </router-link>
              </a-menu-item>
              <a-sub-menu v-else :key="menu.key">
                <template #title>
                <span>
<!--                  <UserOutlined/>-->
                  <component :is="menu.icon"></component>
                  {{ menu.title }}
                </span>
                </template>
                <a-menu-item v-for="menu_c in menu.children" :key="menu_c.key">
                  <router-link :to="menu_c.path">{{ menu_c.title }}</router-link>
                </a-menu-item>
              </a-sub-menu>
            </template>
          </a-menu>

        </a-layout-sider>
        <a-layout-content :style="{ padding: '0 24px', minHeight: '280px' }">
          <!--          <router-view/>-->
          <router-view v-slot="{ Component }">
            <transition name="fade">
              <component :is="Component"/>
            </transition>
          </router-view>
        </a-layout-content>
      </a-layout>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Ant Design ©2018 Created by Ant UED
    </a-layout-footer>
  </a-layout>
</template>
<script setup>
// import {
//   UserOutlined,
//   LaptopOutlined,
//   NotificationOutlined,
//   HomeOutlined,
//   SettingFilled,
//   SmileOutlined,
//   SyncOutlined,
//   LoadingOutlined,
//   MessageOutlined,
//   LoginOutlined,
//   DownOutlined,
//   EditOutlined,
//   LogoutOutlined
// } from '@ant-design/icons-vue';   // 全局动态注册代替
import {useUsersStore} from '@/store/users'
import {ref} from 'vue';


let menu_list = ref([
  {
    key: 'sub1', icon: "user-outlined", title: 'LDAP管理', tube: '', path: '/study/weather', children: [
      {key: 1, title: '用户', path: '/study/weather2'},
      {key: 2, title: '组', path: '/study/weather3'},
      {key: 3, title: '组织', path: '/echarts'}
    ]
  },
  {
    key: 'sub2', icon: 'laptop-outlined', title: '资产管理', path: '/cmdb', children: [
      {key: 4, title: '服务器列表', path: '/cmdb/instance-list'},
    ]
  },
  {
    key: 'sub3', icon: 'HomeOutlined', title: '部署工具', children: [
      {key: 5, title: '远程主机管理', path: '/deploy/remote-inst'},
      {key: 6, title: 'playbook管理', path: '/deploy/playbook'},
      {key: 7, title: 'playbook执行', path: '/deploy/playbook-run'},
      {key: 8, title: '模块执行', path: '/deploy/ad-hoc'},
    ]
  }
])

let selectedKeys1 = ref(['1'])
let selectedKeys2 = ref(['5'])
let openKeys = ref(['sub3'])  // 默认展开的下来框

// 实例化store
const UsersStore = useUsersStore()
const userMenuClick = () => {
  UsersStore.logout();
};


</script>
<style>
#components-layout-demo-top-side .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>