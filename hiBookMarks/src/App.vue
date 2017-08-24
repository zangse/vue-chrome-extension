<template>
    <div id="app">
        <dashbord></dashbord>
    </div>
</template>
<script>
require('../assets/style/reset.scss')
require('../assets/style/icon.scss')
import dashbord from './components/pages/dashbord.vue';
export default {
    name: 'app',
    components: {
        dashbord
    }
}
</script>
<style lang="scss" scoped>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #333;
    background: #f5f5f5;
}
</style>