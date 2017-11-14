<template>
    <div class="toast-wrapper" v-show="show">
        <div class="toast-mask"></div>
        <div class="toast-content" :style="{padding:toastPadding}">
            <i class="toast-icon iconfont success" v-if="this.toastMsg.type=='success'">&#xe62e;</i>
            <i class="toast-icon iconfont error" v-if="this.toastMsg.type=='error'">&#xe60e;</i>
            <i class="toast-icon iconfont cancle" v-if="this.toastMsg.type=='cancle'">&#xe60e;</i>
            <i class="toast-icon iconfont wraning" v-if="this.toastMsg.type=='wraning'">&#xe6d5;</i>
            <p class="toast-text">{{toastMsg.text}}</p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'toast',
    data() {
        return {
            time: 2000,
            show: false,
            iconUnicode: '&#xe62e;',
            toastPadding: '22px 8px'
        }
    },
    props: {
        value: Boolean,
        toastMsg: Object
    },
    created() {
        if (this.toastMsg.padding) {
            console.log(this.toastMsg.padding)
            this.toastPadding = `${this.toastMsg.padding} 8px`;
        }
        if (this.value) {
            this.time = 2000;
            this.show = true;
        }

    },
    watch: {
        show(val) {
            if (val) {
                // setTimeout(() => {
                //     this.show = false;
                //     this.$emit('toast-hide');
                // }, this.time)
            }
        },
        value(val) {
            this.show = val;
        }
    }
}
</script>
<style lang="scss" scoped>
.toast-wrapper {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 400;
    .toast-mask {
        position: fixed;
        z-index: 400;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: rgba(17, 17, 17, 0.35);
    }
    .toast-content {
        position: fixed;
        z-index: 999;
        width: 120px;
        min-height: 120px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        text-align: center;
        border-radius: 5px;
        color: #333;
        padding: 22px 8px;
        box-sizing: border-box;
        .toast-icon {
            width: 40px;
            height: 40px;
            line-height: 40px;
            display: block;
            text-align: center;
            margin: 5px auto;
            font-size: 32px;
            &.success {
                color: #4ba033;
            }
            &.cancle {
                color: #afabab;
            }
            &.error {
                color: #afabab;
            }
            &.wraning {
                color: #ffb927;
            }
        }
        .toast-text {
            padding: 8px;
            font-size: 14px;
            text-align: center;
            margin: 0 auto;
        }
    }
}
</style>