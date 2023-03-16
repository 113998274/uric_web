<template>
  <nav>
    <router-link type="link" to="/">Home</router-link> |
    <router-link to="/study/weather">Weather</router-link> |
    <router-link to="/study/weather2">Weather2</router-link> |
    <router-link to="/study/weather3">Weather3</router-link> |
    <router-link to="/study/weather4">Weather4</router-link> |
    <router-link to="/echarts">echarts</router-link>
  </nav>
  <nav>
    子路由配置 |
    <router-link to="/study/parent">parent</router-link> |
    <router-link to="/study/parent/children1">children1</router-link>
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 5px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
