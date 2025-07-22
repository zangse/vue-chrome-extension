<template>
  <div id="app">
    <Dashboard />
    <!-- <span class="home">home</span> -->
  </div>
</template>

<script setup>
import Dashboard from './components/dashboard/dashboard.vue'

// 引入样式文件
import '../assets/style/reset.scss'
import '../assets/style/icon.scss'
</script>

<style lang="scss" scoped>
#app {
  width: 420px;
  min-height: 120px;
  font-family: "Avenir", "Helvetica", "Arial", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333;
  background: #fff;
}
</style>