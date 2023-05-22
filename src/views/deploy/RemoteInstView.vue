<template>
  <div>
    <a-tabs
        v-model:activeKey="activeKey"
        tab-position="top"
    >
      <a-tab-pane key="1" tab="主机" style="height: 800px">
        <a-layout>
                    <a-layout-header style="background: #fff; height: 80px">
                      <i style="float: left">注意：默认情况使用远程主机上ztadmin用户作为远程登录用户，并且该用户需要配置无密码sudo权限</i>
<!--                                  <a-row justify="space-between">-->
<!--                                    <a-col :span="4">-->
<!--                                      12ewadfsadsa-->
<!--                                    </a-col>-->
<!--                                    <a-col :span="4" :offset="5">-->
<!--                                    </a-col>-->
<!--                                    <a-col :span="4">-->
<!--                                    </a-col>-->
<!--                                    <a-col :span="4">-->
<!--                                    </a-col>-->
<!--                                  </a-row>-->
                    </a-layout-header>

          <a-layout-content style="background: #fff">
            <a-row>
              <a-col :span="8">
                <span style="float: left"><desktop-outlined/> 云主机</span>
                <a-tree-select
                    v-model:value="formState.remote_hosts"
                    show-search
                    style="width: 100%"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    placeholder="选择主机"
                    allow-clear
                    multiple
                    :show-checked-strategy="SHOW_ALL"
                    tree-default-expand-all
                    :tree-data="treeData"
                >
                  <template #tagRender="{ label, closable, onClose, option }">
                    <a-tag :closable="closable" :color="option.color" style="margin-right: 3px" @close="onClose">
                      {{ label }}&nbsp;&nbsp;
                    </a-tag>
                  </template>
                  <template #title="{ value, title, color: col, id }">
                    <b v-if="col === 'Silver'" style="color: Silver">{{ value }} - {{ id }}</b>
                    <b v-else-if="col === 'MediumSeaGreen'" style="color: MediumSeaGreen">{{ value }} - {{ id }}</b>
                    <template v-else>{{ title }}</template>
                  </template>
                </a-tree-select>

                <div style="height: 25px"></div>
                <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-form-item name="remote_user_passwd" label="remote_user_passwd">
                    <a-input-password v-model:value="formState.remote_user_passwd" placeholder="首次配置则需要输入密码"/>
                  </a-form-item>
                  <a-form-item label="gather_facts">
                    <a-switch v-model:checked="formState.gather_facts"/>
                  </a-form-item>
                  <a-form-item label="local_user">
                    <a-radio-group value="root">
                      <a-radio checked="checked" value="root">root</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="remote_user">
                    <a-radio-group v-model:value="formState.remote_user">
                      <a-radio disabled value="root">root</a-radio>
                      <a-radio value="ztadmin">ztadmin</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item label="nopass_ssh_user">
                    <a-radio-group v-model:value="formState.nopass_ssh_user">
                      <a-radio value="ztadmin">ztadmin</a-radio>
                      <a-radio value="root">root</a-radio>
                      <a-radio value="3">
                        More...
                        <a-input v-if="formState.nopass_ssh_user === '3'"
                                 v-model:value="formState.nopass_ssh_user_custom"
                                 style="width: 100px; margin-left: 10px"/>
                      </a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item :wrapper-col="{ span: 18, offset: 1 }">
                    <a-button type="primary" @click="create_func">Create</a-button>
                    <a-button @click="cancel_func" style="margin-left: 10px">Cancel</a-button>
                    <a-button @click="clear_func" style="margin-left: 10px">Clear</a-button>
                  </a-form-item>
                </a-form>
              </a-col>

              <a-col :span="14" :offset="1">
                <base-codemirror
                    ref="edityamlRef"
                    v-model="response_msg"
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
      <a-tab-pane key="2" tab="主机组" style="height: 800px">
        <a-layout>
          <!--          <a-layout-header style="background: #fff">-->
          <!--            <a-row>-->
          <!--              <a-col :span="1">-->
          <!--                -->
          <!--              </a-col>-->
          <!--              <a-col :span="6" :offset="5">-->
          <!--              </a-col>-->
          <!--              <a-col :span="4">-->
          <!--              </a-col>-->
          <!--              <a-col :span="4">-->
          <!--              </a-col>-->
          <!--            </a-row>-->
          <!--          </a-layout-header>-->

          <a-layout-content style="background: #fff">
            <!-- <a-button style="float: left" id="group_create_btn" type="primary" @click="">创建</a-button> -->
            <a-button style="float: left" type="primary" @click="showDrawer">
              <template #icon>
                <PlusOutlined/>
              </template>
              创建
            </a-button>
            <a-drawer
                title="Create a new account"
                :width="720"
                :visible="visible"
                :body-style="{ paddingBottom: '80px' }"
                :footer-style="{ textAlign: 'right' }"
                @close="onClose"
            >
              <a-form :model="create_group_form" :rules="create_group_rules" layout="vertical">
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="Name" name="groupname">
                      <a-input v-model:value="create_group_form.groupname" placeholder="group name"/>
                    </a-form-item>
                  </a-col>

                </a-row>
                <a-row :gutter="16">
                  <a-col :span="24">
                    <a-form-item label="Description" name="description">
                      <a-textarea
                          v-model:value="create_group_form.description"
                          :rows="2"
                          placeholder="group description"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
              <template #extra>
                <a-space>
                  <a-button @click="onClose">Cancel</a-button>
                  <a-button type="primary" @click="create_group_func">Submit</a-button>
                </a-space>
              </template>
            </a-drawer>


            <div style="height: 25px"></div>
            <a-divider/>
            <a-row>
              <a-col :span="8">
                <a-table :columns="group_columns" :data-source="group_data" row-key="id">
                  <template #headerCell="{ column }">
                    <template v-if="column.key === 'name'">
                    <span>
                      Name
                    </span>
                    </template>
                  </template>
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'description'">
                    <span>
                      {{ record.description }}
                    </span>
                    </template>
                    <template v-else-if="column.key === 'action'">
                      <a-popover placement="rightTop">
                        <template #content>
                          <p style="height: 8px" v-for="inst in record.instances">{{ inst.ipaddress }}</p>
                        </template>
                        <template #title>
                          <span></span>
                        </template>
                        <a>Members</a>
                      </a-popover>
                      <!--                      <a @click="groupShow(record)">Show</a>-->
                      <a-divider type="vertical"/>
                      <a @click="grouponEdit(record)">Edit</a>
                      <a-divider type="vertical"/>
                      <a-popconfirm
                          v-if="group_data.length"
                          title="Sure to delete?"
                          @confirm="groupDelete(record.id)"
                      >
                        <a>Delete</a>
                      </a-popconfirm>
                    </template>
                  </template>
                </a-table>

              </a-col>

              <a-col :span="14" :offset="1">
                <a-transfer
                    v-model:target-keys="targetKeys"
                    :data-source="mockData"
                    :one-way="true"
                    show-search
                    :list-style="{width: '350px', height: '300px',}"
                    :titles=mock_groupname
                    :filter-option="filterOption"
                    :render="item => item.title"
                    @change="handleChange"
                    @search="handleSearch"
                />
                <div style="height: 25px"></div>
                <!--                <a-button style="float: left" class="editable-add-btn" type="primary">更新</a-button>-->
                <a-form-item :wrapper-col="{ span: 2, offset: 1 }">
                  <a-button type="primary" :disabled="group_update_btn_show" @click="group_update_btn()">更新</a-button>
                </a-form-item>
              </a-col>
            </a-row>

          </a-layout-content>

          <a-layout-footer style="text-align: left; background: #fff">
          </a-layout-footer>
        </a-layout>
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
const SHOW_ALL = TreeSelect.SHOW_ALL
let inst_data = ref([])
let remote_inst_data = ref([])
const treeData = ref([])
// const treeData = ref([
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
  remote_hosts: [],
  remote_user_passwd: '',
  gather_facts: false,
  remote_user: "ztadmin",
  nopass_ssh_user: "ztadmin",
  nopass_ssh_user_custom: '',
});
const response_msg = ref('')
const edityamlRef = ref(null)


// group列表相关
const group_columns = [{
  title: '组名',
  name: 'GroupName',
  dataIndex: 'groupname',
  key: 'groupname',
}, {
  title: '说明',
  dataIndex: 'description',
  key: 'description',
}, {
  title: 'Action',
  key: 'action',
}];
const group_data = ref([])

// group 穿梭框相关
const mock_groupname = ref(['  远程主机', '  主机组']);
const mockData = ref([]);
const targetKeys = ref([]);
const getMock = () => {
  // 当前组ip列表
  let src_group_list = []
  // for (let a in obj.instances) {
  //   src_group_list.push(obj.instances[a].ipaddress)
  // }
  // console.log(456, remote_inst_data.value)

  let remote_inst_data_iplist = []
  for (let i in remote_inst_data.value) {
    remote_inst_data_iplist.push({
      instance_id: remote_inst_data.value[i].instance_id,
      ipaddress: remote_inst_data.value[i].ipaddress,
    })
  }

  const mkeys = [];
  const mData = [];


  for (let c in remote_inst_data_iplist) {
    let data = {
      key: remote_inst_data_iplist[c]['ipaddress'].toString(),
      title: remote_inst_data_iplist[c]['ipaddress'] + ' - ' + remote_inst_data_iplist[c]['instance_id'],
      description: `description of ${remote_inst_data_iplist[c]['ipaddress']}`,
    };
    // for (let d in src_group_list) {
    //   if (d === c) {
    //     mkeys.push(data.key);
    //   }
    // }
    mData.push(data);
  }

  mockData.value = mData;
  targetKeys.value = mkeys;
};
const filterOption = (inputValue, option) => {
  return option.description.indexOf(inputValue) > -1;
};
const handleChange = (mkeys, direction, moveKeys) => {
  // console.log(222, mkeys, direction, moveKeys);
};
const handleSearch = (dir, value) => {
  // console.log('search:', dir, value);
};
const group_update_btn_show = ref(true);

// 创建组抽屉弹框相关
const create_group_form = reactive({
  groupname: '',
  description: '',
});
const create_group_rules = {
  groupname: [{
    required: true,
    message: 'group name',
  }],
  description: [{
    required: false,
    message: 'group description',
  }],
};
const visible = ref(false);
const showDrawer = () => {
  visible.value = true;
  group_update_btn_show.value = true
};
const onClose = () => {
  visible.value = false;
};
const update_inst = ref({})


// 获取远程主机状态列表
function get_remote_inst() {
  let users = user_token()

  let inst_url = settings.table_instance_api + '?tag=zt&sys_type=linux'
  let remote_inst_url = settings.table_deploy_api

  // 一次调用多个api, 调用all()方法，在里面传入数组，在数组里写上想要发送的请求，然后then(results => )拿到最终请求 进行统一相关处理
  axios.all([
    axios({
      url: inst_url,
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
    })
  ]).then(axios.spread((inst_res, remote_inst_res) => {
    inst_data.value = inst_res.data;
    remote_inst_data.value = remote_inst_res.data;
    // console.log(remote_inst_data.value)

    treeData.value = []
    for (var inst = 0; inst < inst_data.value.length; inst++) {
      // console.log(inst_data.value[inst])
      let _disable = true
      let _color = 'Silver'
      if (inst_data.value[inst].status === 'Running') {
        _disable = false
      }
      for (var remote_inst = 0; remote_inst < remote_inst_data.value.length; remote_inst++) {
        if (remote_inst_data.value[remote_inst].instance_id === inst_data.value[inst].instance_id && remote_inst_data.value[remote_inst].set_ssh) {
          _color = 'MediumSeaGreen'
        }
      }

      treeData.value.push({
        title: inst_data.value[inst].ipaddress,
        value: inst_data.value[inst].ipaddress,
        id: inst_data.value[inst].instance_id,
        color: _color,
        disabled: _disable,
      })
    }
    // console.log(232, treeData.value)

    getMock()
  })).catch((error) => {
    // jwt token 过期跳转至登录界面重新登录
    if (error.name === 'AxiosError' && error.response.data.detail === 'Signature has expired.') {
      router.push('/login')
    } else {
      message.error(error.response.status + ' ' + error.response.statusText)
    }
  })
}

// 创建按钮
function create_func() {
  let hide = message.loading('loading..', 180)
  let users = user_token()
  let url = settings.table_deploy_api_post_remote_setssh

  axios({
    url: url,
    method: 'post',
    headers: {
      'Authorization': 'JWT ' + users.useData.token  // 带token访问，注意：jwt后面有个空格
    },
    data: {
      "sshaddkey_inst": formState,
    }
  }).then((respone) => {
    setTimeout(hide, 0);
    response_msg.value = respone.data.data.host_all_res_format;
    // console.log(respone.data)
    if (respone.data.status === 0) {
      message.success(respone.data.msg);
    } else {
      message.error(respone.data.msg);
    }
    // 执行完成后重新请求列表获取新数据
    get_remote_inst()
  }).catch((error) => {
    setTimeout(hide, 0);
    message.error(error.response.status + ' ' + error.response.statusText);
  })
}

// 取消按钮
function cancel_func() {
  formState.remote_hosts = []
  formState.remote_user_passwd = ''
  formState.gather_facts = false
  formState.remote_user = 'ztadmin'
  formState.nopass_ssh_user = 'ztadmin'
  formState.nopass_ssh_user_custom = ''
}

// 清除输出按钮
function clear_func() {
  response_msg.value = ''
}

// 获取远程主机组状态列表
function get_remote_group() {
  let users = user_token()
  let url = settings.table_deploy_group_detail_api

  // console.log(123, inst_data)
  axios({
    url: url,
    method: 'get',
    headers: {
      'Authorization': 'JWT ' + users.useData.token  // 带token访问，注意：jwt后面有个空格
    },
  }).then((respone) => {
    group_data.value = respone.data
    // console.log(232, group_data.value)
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

// 创建组
function create_group_func() {
  let users = user_token()
  let url = settings.table_deploy_group_api

  axios({
    url: url,
    method: 'post',
    headers: {
      'Authorization': 'JWT ' + users.useData.token  // 带token访问，注意：jwt后面有个空格
    },
    data: {
      "groupname": create_group_form.groupname,
      "description": create_group_form.description,
    }
  }).then((respone) => {
    onClose()
    notification['success']({
      message: respone.status + ': ' + respone.statusText,
    });
    get_remote_group()
  }).catch((error) => {
    // jwt token 过期跳转至登录界面重新登录
    if (error.name === 'AxiosError' && error.response.data.detail === 'Signature has expired.') {
      router.push('/login')
    } else {
      console.log(error)
      notification['error']({
        message: error.response.data.name,
      });
    }
  })
}

// 编辑组显示
function grouponEdit(obj) {
  group_update_btn_show.value = false
  update_inst.value = obj
  mock_groupname.value[mock_groupname.value.length - 1] = '  组：' + obj.groupname
  // 当前组ip列表
  let src_group_list = []
  for (let a in obj.instances) {
    src_group_list.push(obj.instances[a].ipaddress)
  }

  let remote_inst_data_iplist = []
  for (let i in remote_inst_data.value) {
    remote_inst_data_iplist.push({
      instance_id: remote_inst_data.value[i].instance_id,
      ipaddress: remote_inst_data.value[i].ipaddress,
    })
  }

  // console.log('src_group_list', src_group_list)
  // console.log('remote_inst_data_iplist', remote_inst_data_iplist)

  const mkeys = [];
  const mData = [];

  for (let c in remote_inst_data_iplist) {
    let data = {
      key: remote_inst_data_iplist[c]['ipaddress'].toString(),
      title: remote_inst_data_iplist[c]['ipaddress'] + ' - ' + remote_inst_data_iplist[c]['instance_id'],
      description: `description of ${remote_inst_data_iplist[c]['ipaddress']}`,
    };
    for (let d in src_group_list) {
      if (d === c) {
        mkeys.push(data.key);
      }
    }
    mData.push(data);
  }

  mockData.value = mData;
  targetKeys.value = mkeys;
}

// 编辑组提交
function group_update_btn() {
  let users = user_token()
  let url = settings.table_deploy_group_api + update_inst.value.id + '/'

  let id_list = []
  for (let ip in targetKeys.value) {
    for (let inst in remote_inst_data.value) {
      if (targetKeys.value[ip] === remote_inst_data.value[inst].ipaddress) {
        id_list.push(remote_inst_data.value[inst].instance_id)
      }
    }
  }
  // console.log('id_list ', id_list)

  axios({
    url: url,
    method: 'put',
    headers: {
      'Authorization': 'JWT ' + users.useData.token  // 带token访问，注意：jwt后面有个空格
    },
    data: {
      'groupname': update_inst.value.groupname,
      "instances": id_list,
    }
  }).then((respone) => {
    // console.log(1122, respone)
    notification['success']({
      message: respone.status + ': ' + respone.statusText,
    });
    get_remote_group()
  }).catch((error) => {
    console.log(error)
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

// 删除组
function groupDelete(objid) {
  let users = user_token()
  let url = settings.table_deploy_group_api + objid + '/'

  axios({
    url: url,
    method: 'delete',
    headers: {
      'Authorization': 'JWT ' + users.useData.token  // 带token访问，注意：jwt后面有个空格
    },
  }).then((respone) => {
    notification['success']({
      message: respone.status + ': ' + 'Deleted',
    });
    get_remote_group()
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

//////// 工具func
// 取两个数组的差集
// function subSet(arr1, arr2) {
//   var set1 = new Set(arr1);
//   var set2 = new Set(arr2);
//   var subset = [];
//   for (let item of set1) {
//     if (!set2.has(item)) {
//       subset.push(item);
//     }
//   }
//   return subset;
// }

////////
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
  get_remote_group()
  // 需要get_remote_inst 执行完成返回的数据，写在get_remote_inst的.then中
  // getMock()
})


</script>

<style scoped>

</style>