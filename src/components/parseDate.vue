<template>

</template>

<script>
export default {
  parseDate
}
import dayjs from "dayjs"
// import utc from 'dayjs/plugin/utc'
// import timezone from 'dayjs/plugin/timezone'

//时间格式转换
function parseDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  // 改timezone时用
  // dayjs.extend(utc)
  // dayjs.extend(timezone)
  // return dayjs(date).tz('Asia/Shanghai').format(format)
  return dayjs(date).format(format)
}
</script>

<style scoped>

</style>