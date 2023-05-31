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
                <div style="height: 30px"></div>

                <span style="float: left"> remote_user</span>
                <a-radio-group v-model:value="formState.remote_user">
                  <a-radio disabled value="root">root</a-radio>
                  <a-radio value="ztadmin">ztadmin</a-radio>
                </a-radio-group>
                <div style="height: 20px"></div>

                <span style="float: left"> module</span>
                <a-select
                    ref="select"
                    v-model:value="formState.select_module"
                    style="width: 100%"
                    :options="select_module_options"
                    @select="select_module_handleSelect"
                >
                </a-select>
                <div style="height: 20px"></div>

                <a-form
                    :model="formState"
                    v-bind="layout"
                    name="nest-messages"
                    :validate-messages="validateMessages"
                    @finish="onFinish"
                    style="float: left; width: 100%"
                >
                  <template v-if="formState.select_module=='ping'">
                  </template>
                  <template v-if="formState.select_module=='yum'">
                    <a-form-item :name="['select_module_field', 'name']" label="安装包" :rules="[{ required: true }]">
                      <a-input v-model:value="formState.select_module_field.name"/>
                    </a-form-item>
                    <a-form-item :name="['select_module_field', 'set_state']" label="操作" :rules="[{ required: true }]">
                      <a-select v-model:value="formState.select_module_field.set_state" placeholder="Please select ">
                        <a-select-option v-for="(val, key) in formState.select_module_field.state" :value="val">{{
                            key
                          }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </template>
                  <template v-if="formState.select_module=='systemd'">
                    <a-form-item :name="['select_module_field', 'name']" label="程序名" :rules="[{ required: true }]">
                      <a-input v-model:value="formState.select_module_field.name"/>
                    </a-form-item>
                    <a-form-item :name="['select_module_field', 'set_state']" label="操作" :rules="[{ required: true }]">
                      <a-select v-model:value="formState.select_module_field.set_state" placeholder="Please select ">
                        <a-select-option v-for="(val, key) in formState.select_module_field.state" :value="val">{{
                            key
                          }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </template>
                  <template v-if="formState.select_module=='user'">
                    <a-form-item :name="['select_module_field', 'name']" label="用户名" :rules="[{ required: true }]">
                      <a-input v-model:value="formState.select_module_field.name"/>
                    </a-form-item>
                    <a-form-item :name="['select_module_field', 'set_state']" label="操作" :rules="[{ required: true }]">
                      <a-select v-model:value="formState.select_module_field.set_state" placeholder="Please select ">
                        <a-select-option v-for="(val, key) in formState.select_module_field.state" :value="val">{{
                            key
                          }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item
                        v-if="formState.select_module_field.set_state=='present' || formState.select_module_field.set_state=='update_password'"
                        :name="['select_module_field', 'password']" label="密码">
                      <a-input-password v-model:value="formState.select_module_field.password"/>
                    </a-form-item>
                    <a-form-item v-if="formState.select_module_field.set_state=='present'"
                                 :name="['select_module_field', 'create_home']" label="创建home">
                      <a-radio-group v-model:value="formState.select_module_field.create_home">
                        <a-radio value=true>是</a-radio>
                        <a-radio value=false>否</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item v-if="formState.select_module_field.set_state=='present'"
                                 :name="['select_module_field', 'select_shell']" label="是否禁止登录">
                      <a-select v-model:value="formState.select_module_field.select_shell" placeholder="Please select ">
                        <a-select-option v-for="val in formState.select_module_field.shell" :value="val">{{
                            val
                          }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item v-if="formState.select_module_field.set_state=='present'"
                                 :name="['select_module_field', 'comment']" label="备注">
                      <a-input v-model:value="formState.select_module_field.comment"
                               placeholder="example: Develop user"/>
                    </a-form-item>

                    <a-form-item v-if="formState.select_module_field.set_state=='absent'"
                                 :name="['select_module_field', 'remove_home']" label="删除home">
                      <a-radio-group v-model:value="formState.select_module_field.remove_home">
                        <a-radio value=true>是</a-radio>
                        <a-radio value=false>否</a-radio>
                      </a-radio-group>
                    </a-form-item>
                  </template>
                  <template v-if="formState.select_module=='shell'">
                    <a-form-item :name="['select_module_field', 'select_name']" label="command"
                                 :rules="[{ required: true }]">
                      <a-select v-model:value="formState.select_module_field.select_name" placeholder="command ">
                        <a-select-option v-for="val in formState.select_module_field.name" :value="val">{{
                            val
                          }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item label="参数">
                      <base-codemirror
                          ref="varsyamlRef"
                          v-model="formState.select_module_field.argv"
                          mode="shell"
                          style="height: 200px; text-align: left"
                          :lint="true"
                      ></base-codemirror>
                    </a-form-item>
                  </template>
                  <template v-if="formState.select_module=='synchronize'">
                    <a-form-item :name="['select_module_field', 'src']" label="源文件" :rules="[{ required: true }]">
                      <a-input v-model:value="formState.select_module_field.src"/>
                    </a-form-item>
                    <a-form-item :name="['select_module_field', 'dest']" label="目标文件" :rules="[{ required: true }]">
                      <a-input v-model:value="formState.select_module_field.dest"/>
                    </a-form-item>
                    <a-form-item :name="['select_module_field', 'rsync_opts']" label="额外参数">
                      <base-codemirror
                          ref="varsyamlRef"
                          v-model="formState.select_module_field.rsync_opts"
                          mode="shell"
                          style="height: 200px; text-align: left"
                          :lint="true"
                      ></base-codemirror>
                    </a-form-item>
                  </template>

                  <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 0 }">
                    <a-button type="primary" html-type="submit">创建</a-button>
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
let modules_data = ref([])
let remote_inst_dict_data = reactive({})
const treeData = ref([])
const select_module_options = ref([])

// form表单相关
const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
}
const validateMessages = {
  required: '${label} 是必填项',
  types: {
    content: '${label} 是必填项',
  },
}
let formState = reactive({
  selected_inst: [],
  remote_user: "ztadmin",
  select_module: '',
  select_module_field: '',
  content: '',
});
const edityamlRef = ref(null)
const varsyamlRef = ref(null)

// 获取远程主机、主机组和module列表
function get_remote_inst() {
  let users = user_token()

  let remote_group_url = settings.table_deploy_group_api
  let remote_inst_url = settings.table_deploy_api
  let modules_url = settings.deploy_modules_get_api

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
      url: modules_url,
      method: 'get',
      headers: {
        'Authorization': 'JWT ' + users.useData.token
      },
    })
  ]).then(axios.spread((remote_group_res, remote_inst_res, modules_res) => {
    remote_group_data.value = remote_group_res.data;
    remote_inst_data.value = remote_inst_res.data;
    modules_data.value = modules_res.data.data;

    for (let m in modules_data.value) {
      select_module_options.value.push({
        value: m,
        label: m,
      })
    }

    // console.log('group: ', remote_group_data.value)
    // console.log('inst', remote_inst_data.value)
    // console.log('modules', modules_data.value)


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

function select_module_handleSelect(value) {
  // console.log(`selected ${value}`);
  formState.select_module_field = modules_data.value[value]
  console.log(formState.select_module_field)

}

// 提交
function onFinish() {
  let hide = message.loading('loading..', 300)
  let users = user_token()
  let url = settings.deploy_modules_post_api

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
    formState.content = respone.data.data.host_all_res_format;
    // console.log(respone.data)
    if (respone.data.status === 0) {
      message.success(respone.data.msg);
    } else {
      message.error(respone.data.msg);
    }
  }).catch((error) => {
    setTimeout(hide, 0);
    // console.log(error)
    message.error(error.response.status + ' ' + error.response.statusText);
  })
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