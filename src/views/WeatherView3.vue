<template>
  <title></title>
  <h3>广东城市天气搜索</h3>
  <p>
    <select v-model="city_id">
      <template v-for="city in city_list">
        <option selected v-if="city.name=='广州'" :value="city.id">{{ city.name }}</option>
        <option v-else :value="city.id">{{ city.name }}</option>
      </template>
    </select>
    <button @click="get_weather">搜索</button>
  </p>

  <table v-if="weather_list.length > 0">
    <thead>
    <tr>
      <td>预测日期</td>
      <td>最高气温</td>
      <td>最低气温</td>
      <td>白天天气</td>
      <td>晚间天气</td>
    </tr>
    </thead>
    <tbody>
    <tr v-for="weather in weather_list">
      <td>{{ weather.fxDate }}</td>
      <td>{{ weather.tempMax }}°C</td>
      <td>{{ weather.tempMin }}°C</td>
      <td>{{ weather.textDay }}</td>
      <td>{{ weather.textNight }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script setup>
import axios from "axios"
import {ref, reactive, onMounted} from 'vue'
import settings from '@/settings'

let weather_list = ref([])
let city_list = ref([])
let city_id = ref('101280101')   // 默认广州
let default_province = ref('guangdong')   // 默认搜索广东省

function get_weather() {
  // 等同于https://devapi.qweather.com/v7/weather/7d?location=101010300&key=b6110978108049ebb397bf94ce523c91
  axios({
    url: settings.weather_api_url + '/weather/7d',
    // url: 'https://devapi.qweather.com/v7/weather/7d',
    methods: 'get',
    params: {
      location: city_id.value,
      key: "b6110978108049ebb397bf94ce523c91"
    }
  }).then((respone) => {
    weather_list.value = respone.data.daily;
    // console.log(weather_list)
  })
}

onMounted(() => {
  axios({
    url: settings.geoapi_url + '/city/lookup',
    // url: 'https://geoapi.qweather.com/v2/city/lookup',
    methods: 'get',
    params: {
      location: default_province.value,
      key: "b6110978108049ebb397bf94ce523c91"
    }
  }).then((respone) => {
    // console.log(321, respone.data.location)
    city_list.value = respone.data.location
  })
})
</script>