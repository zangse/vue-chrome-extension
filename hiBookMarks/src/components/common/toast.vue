<template>
    <div class="toast-wrapper" :class="{'show':show}">
        <div class="toast-content">
            <i class="toast-icon iconfont success" v-if="this.toastMsg.type=='success'">&#xe62e;</i>
            <i class="toast-icon iconfont error" v-if="this.toastMsg.type=='error'">&#xe60e;</i>
            <i class="toast-icon iconfont cancel" v-if="this.toastMsg.type=='cancel'">&#xe60e;</i>
            <i class="toast-icon iconfont wraning" v-if="this.toastMsg.type=='wraning'">&#xe6d5;</i>
            <span class="toast-text" :class="this.toastMsg.type">{{toastMsg.text}}</span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'toast',
    data() {
        return {
            time: 2000,
            show: false
        }
    },
    props: {
        value: Boolean,
        toastMsg: Object
    },
    created() {
        if (this.value) {
            this.time = 2000;
            this.show = true;
        }
    },
    watch: {
        show(val) {
            if (val) {
                setTimeout(() => {
                    this.show = false;
                    this.$emit('toast-hide');
                }, this.time)
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
    position: fixed;
    top: 60px;
    right: 10px;
    z-index: 400;
    width: 280px;
    padding: 14px 26px 14px 13px;
    border-radius: 8px;
    box-sizing: border-box;
    border: 1px solid #e6ebf5;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    transition: all 0.3s;
    overflow: hidden;
    opacity: 0;
    transform: translateX(100%);
    &.show {
        display: block;
        opacity: 1;
        transform: translateX(0);
    }
    .toast-content {
        display: flex;
        text-align: left;
        .toast-icon {
            display: inline-block;
            text-align: center;
            font-size: 22px;
            line-height: 28px;
            vertical-align: center;
            &.success {
                color: #4ba033;
            }
            &.cancel {
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
            padding-left: 8px;
            line-height: 28px;
            height: 28px;
            font-size: 14px;
            text-align: left;
            &.success {
                color: #4ba033;
            }
            &.cancel {
                color: #afabab;
            }
            &.error {
                color: #afabab;
            }
            &.wraning {
                color: #ffb927;
            }
        }
    }
}
</style>