<template>
  <!--  v1版本 原始写法 vue2写法 添加ant-design-vue前端框架做润色-->
  <!--  标签用法查询官网https://www.antdv.com/components/overview-cn  -->
  <h3>广东城市天气搜索</h3>
  <p>
<!--    改用下列标签<a-xxx></a-xxx>标签，都是ant-design-vue封装的写法-->
<!--    注意 v-model:value="xxx" 用法-->
    <a-select v-model:value="city_id" style="width: 90px">
      <template v-for="city in city_list">
        <a-select-option selected v-if="city.name=='广州'" :value="city.id">{{ city.name }}</a-select-option>
        <a-select-option v-else :value="city.id">{{ city.name }}</a-select-option>
      </template>
    </a-select>
    <a-button @click="get_weather" type="primary">搜索</a-button>
  </p>

<!--  table用法，直接从data中获取数据源列表weather_list，和字段列表weather_list_columns-->
  <a-table :dataSource="weather_list" :columns="weather_list_columns" />
</template>

<script>
import axios from "axios"

export default {
  name: 'WeatherView',
  data() {
    return {
      weather_list_columns: [
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
        ],
      weather_list: [],
      city_list: [],
      city_id: '101280101',   // 默认广州
      default_province: 'guangdong'   // 默认搜索广东省
    }
  },
  mounted() {
    axios({
      url: this.$settings.geoapi_url + '/city/lookup',
      methods: 'get',
      params: {
        location: this.default_province,
        key: "b6110978108049ebb397bf94ce523c91"
      }
    }).then((respone) => {
      // console.log(respone.data.location)
      this.city_list = respone.data.location
    })
  },
  methods: {
    get_weather() {
      // 等同于https://devapi.qweather.com/v7/weather/7d?location=101010300&key=b6110978108049ebb397bf94ce523c91
      axios({
        url: this.$settings.weather_api_url + '/weather/7d',
        methods: 'get',
        params: {
          location: this.city_id,
          key: "b6110978108049ebb397bf94ce523c91"
        }
      }).then((respone) => {
        this.weather_list = respone.data.daily;
        // console.log(this.weather_list)
      })
    }
  }
}
</script>
