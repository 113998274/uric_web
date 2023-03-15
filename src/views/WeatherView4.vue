<template>
  <!--  v2版本 vue3写法 添加ant-design-vue前端框架做润色-->
  <!--  标签用法查询官网https://www.antdv.com/components/overview-cn  -->
  <h3>广东城市天气搜索</h3>
  <p>
    <!--    改用下列标签<a-xxx></a-xxx>标签，都是ant-design-vue封装的写法-->
    <!--    注意 v-model:value="xxx" 用法-->
    <a-select v-model:value="city_id" style="width: 90px">
      <template v-for="city in city_list.data">
        <a-select-option selected v-if="city.name=='广州'" :value="city.id">{{ city.name }}</a-select-option>
        <a-select-option v-else :value="city.id">{{ city.name }}</a-select-option>
      </template>
    </a-select>
    <a-button @click="get_weather" type="primary">搜索</a-button>
  </p>

  <!--  table用法，直接从data中获取数据源列表weather_list，和字段列表weather_list_columns-->
  <a-table :dataSource="weather_list.data" :columns="weather_list_columns.data"/>
</template>

<!-- <script setup> 语法糖写法，vue3写法，更加方便，已经把setup(), data(), methods() return() 都在里面实现，不需要再另外写方法 -->
<script setup>
import axios from "axios"
// ref和reactive都为了实现响应式数据，onMounted类似之前的mounted，在加载页面时自动执行代码
import {ref, reactive, onMounted} from 'vue'
// vue3语法糖写法的生命周期早(setup()),所以是没有产生this，而且加载全局变量也不行，所以直接在本地引入settings.js
import settings from '@/settings.js'

// ref: 一般定义str、int、数组（py列表）都用ref,js中调用需要添加.value，html中直接调用
// reactive: 用于定义对象（py字典）和方法，js和html中直接调用名称.元素名称调用
// 这里为了测试reactive，也可以用它定义数组，只需用对象包裹起来
let weather_list_columns = reactive({data: [
  {
    title: '预测日期',
    dataIndex: 'fxDate',
    key: 'fxDate',
  },
  {
    title: '最高气温',
    dataIndex: 'tempMax',
    key: 'tempMax',
  },
  {
    title: '最低气温',
    dataIndex: 'tempMin',
    key: 'tempMin',
  },
  {
    title: '白天天气',
    dataIndex: 'textDay',
    key: 'textDay',
  },
  {
    title: '晚间天气',
    dataIndex: 'textNight',
    key: 'textNight',
  },
]})
let weather_list = reactive({data: []})
let city_list = reactive({data: []})
let city_id = ref('101280101')   // 默认广州
let default_province = ref('guangdong')   // 默认搜索广东省

function get_weather() {
  // 等同于https://devapi.qweather.com/v7/weather/7d?location=101010300&key=b6110978108049ebb397bf94ce523c91
  axios({
    url: settings.weather_api_url + '/weather/7d',
    methods: 'get',
    params: {
      location: city_id.value,
      key: "b6110978108049ebb397bf94ce523c91"
    }
  }).then((respone) => {
    weather_list.data = respone.data.daily;
    // console.log(weather_list)
  })
}

onMounted(() => {
  axios({
    url: settings.geoapi_url + '/city/lookup',
    methods: 'get',
    params: {
      // default_province为ref方法，js调用需要.value
      location: default_province.value,
      key: "b6110978108049ebb397bf94ce523c91"
    }
  }).then((respone) => {
    // city_list为reactive方法，js、html中调用需要.元素名
    city_list.data = respone.data.location;
    // console.log(123, city_list)
  })
})
</script>