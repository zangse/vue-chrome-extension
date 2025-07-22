<template>
  <div id="app">
    <Dashboard />
  </div>
</template>

<script setup>
import '../assets/style/reset.scss'
import '../assets/style/icon.scss'
import Dashboard from './components/pages/dashboard/index.vue'
</script>

<style lang="scss" scoped>
#app {
  font-family: "Avenir", "Helvetica", "Arial", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333;
  background: #f5f5f5;
}
</style>