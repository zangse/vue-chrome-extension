<template>
    <div id="app">
        <dashbord></dashbord>
        <!-- <span class="home">home</span> -->
    </div>
</template>
<script>
require('../assets/style/reset.scss')
require('../assets/style/icon.scss')
import dashbord from './components/dashbord.vue';
export default {
    name: 'app',
    components: {
        dashbord
    }
}
</script>
<style lang="scss" scoped>
#app {
    width: 420px;
    height: auto;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #333;
    background: #f5f5f5;
}
</style>