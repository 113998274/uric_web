<template>
<!--  1. 定义ref值，让getCurrentInstance获取，记得style展开大小才看到图-->
  <div ref="mymain" style='width:500px; height:300px'>

  </div>
</template>

<script setup>
import axios from "axios"
// 在setup中因为生命周期问题，无法使用this，所以需要getCurrentInstance方法
import {onMounted, getCurrentInstance} from 'vue'
import * as echarts from 'echarts';
import settings from '@/settings'


function showorders() {
  const instance = getCurrentInstance();
  // console.log('::::', instance)
  // instance.refs包含所有页面中具有ref属性的元素，instance.refs.mymain即定位到ref="mymain"的元素
  let myChart = echarts.init(instance.refs.mymain)
  // 图形数据源
  let option = {
    series: [
      {
        type: 'pie',
        radius: '100%',
        data: [
          {
            value: 335,
            name: '直接访问'
          },
          {
            value: 234,
            name: '联盟广告'
          },
          {
            value: 1548,
            name: '搜索引擎'
          }
        ]
      }
    ]
  }
  // 数据加载给图形
  myChart.setOption(option)
}


onMounted(() => {
  showorders();
})
</script>

<style scoped>

</style>