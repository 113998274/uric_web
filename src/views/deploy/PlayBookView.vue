<template>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="列表">
      <a-layout>
        <a-layout-header style="background: #fff">
          <a-row justify="space-between">
            <a-col :span="4">
            </a-col>
            <a-col :span="4" :offset="5">
            </a-col>
            <a-col :span="4">
            </a-col>
            <a-col :span="4">
            </a-col>
          </a-row>
        </a-layout-header>
        <a-layout-content style="background: #fff">
          <a-row>
            <a-col :span="8">
              <!--              必须设置row-key指向返回数据的id，不然record（每条数据）取不了值，不设置默认="key"这个属性-->
              <a-table :columns="columns" :data-source="data" row-key="id">
                <template #headerCell="{ column }">
                  <template v-if="column.key === 'name'">
                    <span>
                      Name
                    </span>
                  </template>
                </template>
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'created_at'">
                    <span>
<!--                      后端的时间格式很难看，在这里转一下-->
                      {{ parseDate.parseDate(record.created_at) }}
                    </span>
                  </template>
                  <template v-if="column.key === 'updated_at'">
                    <span>
                      {{ parseDate.parseDate(record.updated_at) }}
                    </span>
                  </template>
                  <template v-else-if="column.key === 'action'">
                    <a @click="onEdit(record)">Edit</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm
                        v-if="data.length"
                        title="Sure to delete?"
                        @confirm="onDelete(record.id)"
                    >
                      <a>Delete</a>
                    </a-popconfirm>
                  </template>
                </template>
              </a-table>
            </a-col>

            <a-col :span="16">
              <a-form
                  :model="editformState"
                  v-bind="layout"
                  name="nest-messages"
                  :validate-messages="validateMessages"
                  @finish="editonFinish"
                  style="float: left; width: 80%"
              >
                <a-form-item :name="['playbook', 'id']" label="Id" :rules="[]">
                  <a-input disabled style="float: left; width: 200px" v-model:value="editformState.playbook.id"/>
                </a-form-item>
                <a-form-item :name="['playbook', 'name']" label="Name" :rules="[{ required: true }]">
                  <a-input style="float: left; width: 200px" v-model:value="editformState.playbook.name"/>
                </a-form-item>
                <a-form-item :name="['playbook', 'description']" label="说明" :rules="[]">
                  <a-input style="float: left" v-model:value="editformState.playbook.description"/>
                </a-form-item>
                <a-form-item :name="['playbook', 'variables']" label="变量"
                             :rules="[{ required: true, types: 'variables' }]">
                  <base-codemirror
                      ref="editvarsyamlRef"
                      v-model="editformState.playbook.variables"
                      mode="javascript"
                      style="height: 300px; text-align: left"
                      :lint="true"
                  ></base-codemirror>
                </a-form-item>
                <a-form-item :name="['playbook', 'content']" label="内容"
                             :rules="[{ required: true, types: 'content' }]">
                  <base-codemirror
                      ref="edityamlRef"
                      v-model="editformState.playbook.content"
                      mode="yaml"
                      style="height: 700px; text-align: left"
                      :lint="true"
                  ></base-codemirror>
                </a-form-item>

                <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
                  <a-button style="float: left" type="primary" html-type="submit">提交</a-button>
                </a-form-item>
              </a-form>
            </a-col>
          </a-row>

        </a-layout-content>
        <a-layout-footer style="text-align: left; background: #fff">
        </a-layout-footer>
      </a-layout>
    </a-tab-pane>
    <a-tab-pane key="2" tab="新建">
      <a-layout>
        <a-layout-header style="background: #fff">
          <a-row justify="space-between">
            <a-col :span="4">
            </a-col>
            <a-col :span="4" :offset="5">
            </a-col>
            <a-col :span="4">
            </a-col>
            <a-col :span="4">
            </a-col>
          </a-row>
        </a-layout-header>
        <a-layout-content style="background: #fff">
          <a-row justify="start">
            <a-col :span="16">
              <div style="height: 25px"></div>
              <a-form
                  :model="formState"
                  v-bind="layout"
                  name="nest-messages"
                  :validate-messages="validateMessages"
                  @finish="onFinish"
              >
                <a-form-item :name="['playbook', 'name']" label="Name" :rules="[{ required: true }]">
                  <a-input style="float: left; width: 200px" v-model:value="formState.playbook.name"/>
                </a-form-item>
                <a-form-item :name="['playbook', 'description']" label="说明" :rules="[]">
                  <a-input style="float: left" v-model:value="formState.playbook.description"/>
                </a-form-item>
                <a-form-item :name="['playbook', 'variables']" label="变量"
                             :rules="[{ required: true, types: 'variables' }]">
                  <base-codemirror
                      ref="yamlRef"
                      v-model="formState.playbook.variables"
                      mode="javascript"
                      style="height: 300px; text-align: left"
                      :lint="true"
                  ></base-codemirror>
                </a-form-item>
                <a-form-item :name="['playbook', 'content']" label="内容"
                             :rules="[{ required: true, types: 'content' }]">
                  <base-codemirror
                      ref="yamlRef"
                      v-model="formState.playbook.content"
                      mode="yaml"
                      style="height: 700px; text-align: left"
                      :lint="true"
                  ></base-codemirror>
                </a-form-item>

                <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
                  <a-button type="primary" html-type="submit">创建</a-button>
                </a-form-item>
              </a-form>
            </a-col>
          </a-row>

        </a-layout-content>
        <a-layout-footer style="text-align: left; background: #fff">
        </a-layout-footer>
      </a-layout>

    </a-tab-pane>
  </a-tabs>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue';
import {notification} from 'ant-design-vue';
import settings from "@/settings";
import axios from "axios";
import BaseCodemirror from '@/components/BaseCodemirror'
import parseDate from '@/components/parseDate'
import router from "@/router";


// 表单相关
const activeKey = ref('1')
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}
const validateMessages = {
  required: '${label} 是必填项',
  types: {
    content: '${label} 是必填项',
  },
}
const formState = reactive({
  playbook: {
    name: '',
    description: '',
    variables: ``,
    content: ``,
  },
})
const editformState = reactive({
  playbook: {
    id: '',
    name: '',
    description: '',
    variables: ``,
    content: ``,
  },
})


// codemorror相关
const yamlRef = ref(null)
const onFinish = values => {
  // console.log(values.playbook.content)
  if (!yamlRef.value.checkYaml(values.playbook.content).then(() => {
    notification['success']({
      message: 'yaml格式正确',
    });
    post_func(values)
  }).catch(() => {
    notification['error']({
      message: 'yaml格式错误',
    });
  })) ;
}
const edityamlRef = ref(null)
const editonFinish = values => {
  // console.log(values.playbook.name)
  if (!edityamlRef.value.checkYaml(values.playbook.content).then(() => {
    notification['success']({
      message: 'yaml格式正确',
    });
    put_func(values)
  }).catch(() => {
    notification['error']({
      message: 'yaml格式错误',
    });
  })) ;
}
const editvarsyamlRef = ref(null)

// 列表相关
const columns = [{
  name: 'Name',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '创建时间',
  dataIndex: 'created_at',
  key: 'created_at',
}, {
  title: '更新时间',
  dataIndex: 'updated_at',
  key: 'updated_at',
}, {
  title: '说明',
  dataIndex: 'description',
  key: 'description',
}, {
  title: 'Action',
  key: 'action',
}];
// const data = [{
//   key: '1',
//   name: 'John Brown',
//   created_at: 32,
//   updated_at: 'New York No. 1 Lake Park',
// }, {
//   key: '2',
//   name: 'Jim Green',
//   created_at: 42,
//   updated_at: 'London No. 1 Lake Park',
// }, {
//   key: '3',
//   name: 'Joe Black',
//   created_at: 32,
//   updated_at: 'Sidney No. 1 Lake Park',
// }];
const data = ref([])


function post_func(values) {
  let users = user_token()
  let url = settings.table_deploy_playbook_api

  axios({
    url: url,
    method: 'post',
    headers: {
      'Authorization': 'JWT ' + users.useData.token  // 带token访问，注意：jwt后面有个空格
    },
    data: {
      "name": values.playbook.name,
      "content": values.playbook.content,
      "variables": values.playbook.variables,
      "description": values.playbook.description,
    }
  }).then((respone) => {
    // console.log(respone)
    notification['success']({
      message: respone.status + ': ' + respone.statusText,
    });
    get_func();
  }).catch((error) => {
    notification['error']({
      message: error.response.data.name,
    });
  })
}

function put_func(values) {
  let users = user_token()
  let url = settings.table_deploy_playbook_api + values.playbook.id + '/'

  axios({
    url: url,
    method: 'put',
    headers: {
      'Authorization': 'JWT ' + users.useData.token  // 带token访问，注意：jwt后面有个空格
    },
    data: {
      "name": values.playbook.name,
      "content": values.playbook.content,
      "variables": values.playbook.variables,
      "description": values.playbook.description,
    }
  }).then((respone) => {
    // console.log(respone)
    notification['success']({
      message: respone.status + ': ' + respone.statusText,
    });
    get_func();
  }).catch((error) => {
    notification['error']({
      message: error.response.data.name,
    });
  })
}

function get_func() {
  let users = user_token()
  let url = settings.table_deploy_playbook_api

  axios({
    url: url,
    method: 'get',
    headers: {
      'Authorization': 'JWT ' + users.useData.token  // 带token访问，注意：jwt后面有个空格
    },
  }).then((respone) => {
    // console.log(3232, respone.data)
    data.value = respone.data
  }).catch((error) => {
    // jwt token 过期跳转至登录界面重新登录
    if (error.name === 'AxiosError' && error.response.data.detail === 'Signature has expired.') {
      router.push('/login')
    } else {
      notification['error']({
        message: error.response.data.name,
      });
    }
  })
}

function onEdit(obj) {
  editformState.playbook.id = obj.id
  editformState.playbook.name = obj.name
  editformState.playbook.description = obj.description
  editformState.playbook.variables = obj.variables
  editformState.playbook.content = obj.content
  // console.log(editformState)
}

function onDelete(id) {
  let users = user_token()
  let url = settings.table_deploy_playbook_api + id + '/'

  axios({
    url: url,
    method: 'delete',
    headers: {
      'Authorization': 'JWT ' + users.useData.token  // 带token访问，注意：jwt后面有个空格
    },
  }).then((respone) => {
    // console.log(respone)
    notification['success']({
      message: 'OK ' + respone.status,
    });
    get_func();
  }).catch((error) => {
    notification['error']({
      message: error.response.data.name,
    });
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
  get_func();
})
</script>

<style scoped>

</style>