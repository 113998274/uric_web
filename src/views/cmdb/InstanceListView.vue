<template>
  <div>
    <a-tabs
        v-model:activeKey="activeKey"
        tab-position="left"
    >
      <a-tab-pane key="aliyun-ecs" tab="阿里云-ecs">
        <a-layout>
          <a-layout-header style="background: #fff">
            <a-row justify="space-between">
              <a-col :span="4">
              </a-col>
              <a-col :span="4" :offset="5">
                <h2>Instance表</h2>
              </a-col>
              <a-col :span="4">
              </a-col>
              <a-col :span="4">
              </a-col>
            </a-row>
          </a-layout-header>

          <a-layout-content style="background: #fff">
            <a-row justify="space-between">
              <a-col :span="1">
                <a-popconfirm
                    title="从阿里云更新数据"
                    :visible="visible"
                    ok-text="Yes"
                    cancel-text="No"
                    @visibleChange="handleVisibleChange"
                    @confirm="confirm"
                    @cancel="cancel"
                >
                  <a-button class="editable-add-btn" type="primary">更新</a-button>
                </a-popconfirm>
              </a-col>
              <a-col :span="4">
              </a-col>
              <a-col :span="4" :offset="8">
                <span style="float: right">
                </span>
              </a-col>
              <a-col :span=4>
                <a-input-search
                    v-model:value="search_value"
                    placeholder="search"
                    enter-button
                    @search="onSearch"
                />
              </a-col>
            </a-row>

            <br/>
            <a-table sticky :columns="table_list_columns.data" :data-source="table_list.data" row-key="instance_id" :pagination="pagination"
                     :scroll="{ x: 1500 }">
              <template #bodyCell="{ column }">
                <template v-if="column.key === 'operation'"><a>action</a></template>
              </template>
              <template #summary>
                <a-table-summary :fixed="fixedTop ? 'top' : 'bottom'">
                  <a-table-summary-row>
                    <a-table-summary-cell :index="0" :col-span="2">
                      <a-switch
                          v-model:checked="fixedTop"
                          checked-children="Fixed Top"
                          un-checked-children="Fixed Top"
                      ></a-switch>
                    </a-table-summary-cell>
                    <a-table-summary-cell :index="2" :col-span="8">Scroll Context</a-table-summary-cell>
                    <a-table-summary-cell :index="10">Total: {{ conut }}</a-table-summary-cell>
                  </a-table-summary-row>
                </a-table-summary>
              </template>
            </a-table>

          </a-layout-content>

          <a-layout-footer style="text-align: left; background: #fff">
          </a-layout-footer>

        </a-layout>

      </a-tab-pane>
      <a-tab-pane key="tengxunyun" tab="腾讯云">腾讯云</a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import {reactive, ref, onMounted} from 'vue';
import {message, notification} from 'ant-design-vue';
import axios from "axios";
import settings from "@/settings";
import router from "@/router";


const activeKey = ref('aliyun-ecs');
let table_list_columns = reactive({
  data: [
    {
      title: '实例ID',
      dataIndex: 'instance_id',
      key: 'instance_id',
      width: 100,
      fixed: 'left',
    },
    {
      title: '区域ID',
      dataIndex: 'zone_id',
      key: 'zone_id',
      width: 110,
    },
    {
      title: '主机名',
      dataIndex: 'hostname',
      key: 'hostname',
    },
    {
      title: '外网IP',
      dataIndex: 'eipaddress',
      key: 'eipaddress',
      width: 130,
    },
    {
      title: '内网IP',
      dataIndex: 'ipaddress',
      key: 'ipaddress',
      width: 130,
    },
    {
      title: 'CPU',
      dataIndex: 'cpu',
      key: 'cpu',
      width: 80,
    },
    {
      title: '内存',
      dataIndex: 'memory',
      key: 'memory',
      width: 80,
    },
    {
      title: '实例规格',
      dataIndex: 'instance_type',
      key: 'instance_type',
    },
    {
      title: '操作系统类型',
      dataIndex: 'sys_type',
      key: 'sys_type',
    },
    {
      title: '实例状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '标签',
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: '创建时间',
      dataIndex: 'creationtime',
      key: 'creationtime',
      width: 120,
    },
    {
      title: '开始时间',
      dataIndex: 'starttime',
      key: 'starttime',
      width: 120,
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 100,
    }
  ]
})
let table_list = reactive({data: []})
let conut = ref('')
let fixedTop = ref(false)
let current = ref(6)
// 搜索框
let search_value = ref('');
let onSearch = () => {
  // console.log('or use this.value', search_value.value);
  get_instancelist(search_value.value);
};

// 右侧通知弹框
let openNotificationWithIcon = (type, message, description = '') => {
  notification[type]({
    message: message,
    description: description,
  });
};
// 更新数据框
const visible = ref(false); // visible值为更新确认框是否弹出
const confirm = () => {
  // 异步关闭，请求响应前处于loading状态
  return new Promise(resolve => {
    setTimeout(() => resolve(true), 30000);
    update_all_instancelist();
  });
};
const cancel = () => {
  visible.value = false;
};
const handleVisibleChange = bool => {
  if (!bool) {
    visible.value = false;
    return;
  }
  visible.value = true;
};


// 读取用户jwt token
function get_userid() {
  let users
  if (localStorage.users) {
    users = JSON.parse(localStorage.users)  // 从本地获取用户数据信息
  } else {
    users = JSON.parse(sessionStorage.users)  // 从session获取用户数据信息
  }
  return users
}


// 获取instance列表
function get_instancelist(search) {
  let users
  if (localStorage.users) {
    users = JSON.parse(localStorage.users)  // 从本地获取用户数据信息
  } else {
    users = JSON.parse(sessionStorage.users)  // 从session获取用户数据信息
  }
  let url = settings.table_instance_api
  if (search) {
    url += '?search=' + search
  }

  axios({
    url: url,
    method: 'get',
    headers: {
      'Authorization': 'JWT ' + users.useData.token  // 带token访问，注意：jwt后面有个空格
    },
  }).then((respone) => {
    table_list.data = respone.data;
    conut = respone.data.length
  }).catch((error) => {
    // jwt token 过期跳转至登录界面重新登录
    if (error.name === 'AxiosError' && error.response.data.detail === 'Signature has expired.') {
      router.push('/login')
    } else {
      message.error(error.response.status + ' ' + error.response.statusText)
    }
  })
}

function update_all_instancelist() {
  let users
  if (localStorage.users) {
    users = JSON.parse(localStorage.users)  // 从本地获取用户数据信息
  } else {
    users = JSON.parse(sessionStorage.users)  // 从session获取用户数据信息
  }
  axios({
    url: settings.table_instance_api_update_all_instance,
    method: 'get',
    headers: {
      'Authorization': 'JWT ' + users.useData.token  // 带token访问，注意：jwt后面有个空格
    },
  }).then((respone) => {
    visible.value = false;
    if (respone.data.status === 0) {
      openNotificationWithIcon('success', respone.data.msg, 'instance表更新成功')
    } else {
      openNotificationWithIcon('error', respone.data.msg, 'instance表更新失败')
    }
  }).catch((error) => {
    message.error(error.response.status + ' ' + error.response.statusText)
  })
}


onMounted(() => {
  get_instancelist();
})
</script>

<style scoped>
#components-table-demo-summary tfoot th,
#components-table-demo-summary tfoot td {
  background: #fafafa;
}

[data-theme='dark'] #components-table-demo-summary tfoot th,
[data-theme='dark'] #components-table-demo-summary tfoot td {
  background: #1d1d1d;
}
</style>