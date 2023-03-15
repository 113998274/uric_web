<template>
<!--  v1版本 原始写法 vue2写法-->
  <h3>广东城市天气搜索</h3>
  <p>
<!--       4. v-model绑定city_id变量,把选中城市的value更新给city_id变量-->
        <select v-model="city_id">
<!--         3. for循环city_list,v-if设置默认广州为选中城市，赋值city.id给value属性-->
          <template v-for="city in city_list">
            <option selected v-if="city.name=='广州'" :value="city.id">{{ city.name }}</option>
            <option v-else :value="city.id">{{ city.name }}</option>
          </template>
        </select>
<!--   5. 搜索按钮绑定get_weather方法，点击则触发-->
    <button @click="get_weather">搜索</button>
  </p>

<!--  7. 如果weather_list有值，则创建下面表格-->
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

<script>
// vue2 写法
import axios from "axios"

export default {
  name: 'WeatherView',
  // 1. data中定义4个变量，未查询时默认为空内容
  data() {
    return {
      weather_list: [],
      city_list: [],
      city_id: '101280101',   // 默认广州
      default_province: 'guangdong'   // 默认搜索广东省
    }
  },
  // 2. mounted会在加载js时自动运行
  mounted() {
    // 查询广东省内的城市，赋值到city_list变量
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
  // methods中写自定义方法
  methods: {
    // 6. 触发请求7天天气数据，赋值给weather_list变量
    get_weather() {
      // 等同于https://devapi.qweather.com/v7/weather/7d?location=101010300&key=b6110978108049ebb397bf94ce523c91
      axios({
        url: this.$settings.weather_api_url + '/weather/7d',
        methods: 'get',
        // 参数为选中的city_id值
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
