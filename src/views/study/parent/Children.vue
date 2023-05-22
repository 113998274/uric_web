<template>
<h3>{{ msg }}</h3>
  <a-button @click="test1">test1</a-button>
  <p>msg1: {{ msg1 }}</p>
  <p>msg2: {{ msg2 }}</p>
  <p>{{ msg3 }}</p>
</template>

<script setup>
import {ref} from 'vue'
let msg = ref('子路由配置：子路径')
let msg1 = ref(2)
let msg2 = ref(3)
let msg3 = msg1.value + msg2.value

function test1(){
  msg2.value++
}
</script>

<style scoped>

</style>