<template>
  <h3>testuser表</h3>
  <a-table :dataSource="table_list.data" :columns="table_list_columns.data"/>
</template>

<script setup>
import axios from "axios"
import {ref, reactive, onMounted} from 'vue'
import settings from '@/settings'
import router from "@/router";


let table_list_columns = reactive({
  data: [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '密码',
      dataIndex: 'password',
      key: 'password',
    },
    {
      title: '组织',
      dataIndex: 'organization',
      key: 'organization',
    },
    {
      title: '邮箱',
      dataIndex: 'usermail',
      key: 'usermail',
    },
  ]
})
let table_list = reactive({data: []})


function get_testuser() {
  // 读取用户jwt token
  let users
  if (localStorage.users) {
    users = JSON.parse(localStorage.users)  // 从本地获取用户数据信息
  } else {
    users = JSON.parse(sessionStorage.users)  // 从session获取用户数据信息
  }

  axios({
    url: settings.table_testuser_api,
    methods: 'get',
    headers: {
      'Authorization': 'JWT ' + users.useData.token  // 带token访问，注意：jwt后面有个空格
    },
    // params: {
    //   location: city_id.value,
    // }
  }).then((respone) => {
    table_list.data = respone.data;
    // console.log(table_list)
  }).catch((error) => {
    // jwt token 过期跳转至登录界面重新登录
    if (error.name === 'AxiosError' && error.response.data.detail === 'Signature has expired.') {
      router.push('/login')
    }
  })
}

onMounted(() => {
  get_testuser();
})
</script>