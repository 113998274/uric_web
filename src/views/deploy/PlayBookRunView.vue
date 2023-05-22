<template>
  <div>
    <a-tabs
        v-model:activeKey="activeKey"
        tab-position="top"
    >
      <a-tab-pane key="1" tab="运行" style="height: 800px">
        <a-layout>
          <a-layout-header style="background: #fff; height: 80px">
          </a-layout-header>

          <a-layout-content style="background: #fff">
            <a-row>
              <a-col :span="8">
                <span style="float: left"><desktop-outlined/> host or group</span>

                <a-tree-select
                    v-model:value="formState.selected_inst"
                    show-search
                    style="width: 100%"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    placeholder="Please select"
                    allow-clear
                    multiple
                    :tree-data="treeData"
                >
                  <template #title="{ value: val, title, type, disabled }">
                    <b v-if="type === 'host' && !disabled" style="color: Silver">{{ title }}</b>
                    <b v-else-if="type === 'group'" style="color: MediumSeaGreen">group - {{ title }}</b>
                    <template v-else>{{ title }}</template>
                  </template>
                </a-tree-select>

                <div style="height: 25px"></div>
                <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-form-item name="selected_pb" label="playbook">
                    <a-select v-model:value="formState.selected_pb" placeholder="Please select a playbook"
                              @select="pb_selectd_func">
                      <a-select-option v-for="pb in playbook_data" :value="pb.id" :content="pb.content" :name="pb.name"
                                       :variables="pb.variables">{{
                          pb.name
                        }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="remote_user">
                    <a-radio-group v-model:value="formState.remote_user">
                      <a-radio disabled value="root">root</a-radio>
                      <a-radio value="ztadmin">ztadmin</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="pb_vars">
                    <base-codemirror
                        ref="varsyamlRef"
                        v-model="formState.variables"
                        mode="javascript"
                        style="height: 300px; text-align: left"
                        :lint="true"
                    ></base-codemirror>
                  </a-form-item>
                  <a-form-item :wrapper-col="{ span: 18, offset: 1 }">
                    <a-button type="primary" @click="run_func" :disabled="run_click_disable">Run</a-button>
                    <a-button @click="clear_func" style="margin-left: 10px">Clear</a-button>
                  </a-form-item>
                </a-form>
              </a-col>

              <a-col :span="14" :offset="1">
                <base-codemirror
                    ref="edityamlRef"
                    v-model="formState.content"
                    mode="shell"
                    readonly="true"
                    style="height: 700px; text-align: left"
                    :lint="true"
                ></base-codemirror>
              </a-col>
            </a-row>

          </a-layout-content>

          <a-layout-footer style="text-align: left; background: #fff">
          </a-layout-footer>

        </a-layout>
      </a-tab-pane>
      <a-tab-pane key="2" tab="运行记录" style="height: 800px">
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import {ref, reactive, watch, toRaw, onMounted} from 'vue';
import {message, notification, TreeSelect} from 'ant-design-vue';
import settings from "@/settings";
import axios from "axios";
import BaseCodemirror from '@/components/BaseCodemirror'
import parseDate from '@/components/parseDate'
import router from "@/router";


const activeKey = ref("1")
const value = ref([])
let remote_group_data = ref([])
let remote_inst_data = ref([])
let playbook_data = ref([])
let remote_inst_dict_data = reactive({})
const treeData = ref([])
// const treeData = ref([
//   {
//     title: 'parent 1',
//     value: 'parent 1',
//     children: [{
//       title: 'parent 1-0',
//       value: 'parent 1-0',
//     },{
//       title: 'parent 2-0',
//       value: 'parent 2-0',
//     }]
//   },
//   {
//     title: '192.168.10.1',
//     value: '192.168.10.1',
//     color: 'Silver',
//     inst: 'i-6weg5eqmrlpaias7xxx',
//     disabled: true,
//   },
//   {
//     title: '192.168.10.2',
//     value: '192.168',
//     inst: 'i-6weg5eqmrlpaias7evdj',
//     color: 'Silver',
//   },
// ]);
// watch(remote_hosts, () => {
//   // 监控选中值的变化，变化即触发，此处用不上
//   console.log('select', remote_hosts.value);
// });

// form表单相关
const formState = reactive({
  selected_inst: [],
  selected_pb: '',
  name: '',
  remote_user: "ztadmin",
  variables: "",
  content: "",
});
const edityamlRef = ref(null)
const varsyamlRef = ref(null)
const run_click_disable = ref(false)


// 获取远程主机、主机组和playbook列表
function get_remote_inst() {
  let users = user_token()

  let remote_group_url = settings.table_deploy_group_api
  let remote_inst_url = settings.table_deploy_api
  let playbook_url = settings.table_deploy_playbook_api

  axios.all([
    axios({
      url: remote_group_url,
      method: 'get',
      headers: {
        'Authorization': 'JWT ' + users.useData.token
      },
    }),
    axios({
      url: remote_inst_url,
      method: 'get',
      headers: {
        'Authorization': 'JWT ' + users.useData.token
      },
    }),
    axios({
      url: playbook_url,
      method: 'get',
      headers: {
        'Authorization': 'JWT ' + users.useData.token
      },
    })
  ]).then(axios.spread((remote_group_res, remote_inst_res, playbook_res) => {
    remote_group_data.value = remote_group_res.data;
    remote_inst_data.value = remote_inst_res.data;
    playbook_data.value = playbook_res.data;
    // console.log('group: ', remote_group_data.value)
    // console.log('inst', remote_inst_data.value)
    // console.log('pb', playbook_data.value)


    for (let inst in remote_inst_data.value) {
      remote_inst_dict_data[remote_inst_data.value[inst].instance_id] = remote_inst_data.value[inst].ipaddress
      treeData.value.push({
        title: remote_inst_data.value[inst].ipaddress,
        value: remote_inst_data.value[inst].ipaddress,
        type: 'host',
      })
    }

    for (let group in remote_group_data.value) {
      let inst_list = []
      if (remote_group_data.value[group].instances.length !== 0) {
        for (let inst_id in remote_group_data.value[group].instances) {
          inst_list.push({
            title: remote_inst_dict_data[remote_group_data.value[group].instances[inst_id]],
            value: remote_group_data.value[group].groupname + '_' + remote_group_data.value[group].instances[inst_id],
            type: 'host',
            disabled: true,
          })
        }
        treeData.value.push({
          title: remote_group_data.value[group].groupname,
          value: remote_group_data.value[group].groupname,
          type: 'group',
          children: inst_list,
        })
      }
    }
    treeData.value = treeData.value.reverse()
    // console.log(232, treeData.value)
  })).catch((error) => {
    // jwt token 过期跳转至登录界面重新登录
    if (error.name === 'AxiosError' && error.response.data.detail === 'Signature has expired.') {
      router.push('/login')
    } else {
      message.error(error.response.status + ' ' + error.response.statusText)
    }
  })
}

// 选中playbook, 获取pb context和变量参数
function pb_selectd_func(pb_id, option) {
  run_click_disable.value = false
  formState.name = option.name
  formState.content = option.content
  formState.variables = option.variables
}

// 执行pb
function run_func() {
  let hide = message.loading('loading..', 180)
  let users = user_token()
  let url = settings.table_deploy_api_post_run_pb
  // console.log(343, formState)

  axios({
    url: url,
    method: 'post',
    headers: {
      'Authorization': 'JWT ' + users.useData.token
    },
    data: {
      "formState": formState,
    }
  }).then((respone) => {
    setTimeout(hide, 0);
    run_click_disable.value = true
    formState.content = respone.data.data.host_all_res_format;
    // console.log(respone.data)
    if (respone.data.status === 0) {
      message.success(respone.data.msg);
    } else {
      message.error(respone.data.msg);
    }
  }).catch((error) => {
    // console.log(error)
    setTimeout(hide, 0);
    run_click_disable.value = true
    message.error(error.response.status + ' ' + error.response.statusText);
  })
}

function clear_func() {
  run_click_disable.value = false
  formState.selected_pb = ''
  formState.variables = ''
  formState.content = ''
}

function user_token() {
  let users
  if (localStorage.users) {
    users = JSON.parse(localStorage.users)  // 从本地获取用户数据信息
  } else {
    users = JSON.parse(sessionStorage.users)  // 从session获取用户数据信息
  }
  return users
}


onMounted(() => {
  get_remote_inst()
})


</script>

<style scoped>

</style>