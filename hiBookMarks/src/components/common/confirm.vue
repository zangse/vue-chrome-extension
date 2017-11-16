<template>
    <div class="confirm-wrapper" :class="{'show':show}">
        <div class="confirm-mask"></div>
        <transition name="fade">
            <div class="confirm-body" :style="confirmPadding" v-if="show">
                <div class="confirm-header">
                    <span class="title">提示</span>
                </div>
                <div class="confirm-content">
                    <span class="confirm-icon iconfont wraning">&#xe6d5;</span>
                    <span class="confirm-text">{{confirmMsg.text}}</span>
                </div>
                <div class="confirm-footer">
                    <span class="btn cancle" @click="onConfirm(1)">取消</span>
                    <span class="btn confirm" @click="onConfirm(2)">确定</span>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    name: 'confirm',
    data() {
        return {
            show: false
        }
    },
    props: {
        value: Boolean,
        confirmMsg: Object
    },
    created() {
        if (this.value) {
            this.show = true;
        }
    },
    methods: {
        onConfirm(type) {
            if (!this.show) {
                return
            }
            this.$emit('on-confirm', type)
        },
    },
    watch: {
        value(val) {
            this.show = val;
        }
    }
}
</script>
<style lang="scss" scoped>
.confirm-wrapper {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    &.show {
        display: block;
        opacity: 1;
        z-index: 399;
    }
    .confirm-mask {
        position: fixed;
        z-index: 400;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: rgba(17, 17, 17, 0.25);
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: all 0.5s cubic-bezier(.36, .66, .04, 1);
    }
    .fade-enter-to,
    .fade-leave {
        opacity: 1;
        transform: translateY(0);
    }
    .fade-enter,
    .fade-leave-to {
        opacity: 0;
        transform: translateY(-100%);
    }
    .confirm-body {
        position: fixed;
        z-index: 999;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 5px;
        color: #333;
        box-sizing: border-box;
        display: inline-block;
        width: 420px;
        padding-bottom: 10px;
        vertical-align: middle;
        background-color: #fff;
        border: 1px solid #e6ebf5;
        font-size: 18px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        text-align: left;
        overflow: hidden;
        backface-visibility: hidden;
        .confirm-header {
            position: relative;
            padding: 15px;
            padding-bottom: 10px;
            .title {
                padding-left: 0;
                margin-bottom: 0;
                font-size: 18px;
                line-height: 1;
                color: #2d2f33;
            }
        }
        .confirm-content {
            position: relative;
            padding: 10px 15px;
            color: #5a5e66;
            font-size: 14px;
            .confirm-icon {
                line-height: 32px;
                font-size: 24px!important;
                &.wraning {
                    color: #ffb927;
                }
            }
            .confirm-text {
                margin: 0;
                padding-left: 8px;
                padding-right: 12px;
                font-size: 14px;
                line-height: 32px;
                text-align: center;
            }
        }
        .confirm-footer {
            padding: 5px 15px 0;
            text-align: right;
            .btn {
                display: inline-block;
                line-height: 1;
                white-space: nowrap;
                cursor: pointer;
                background: #fff;
                border: 1px solid #d8dce5;
                border-color: #d8dce5;
                color: #5a5e66;
                -webkit-appearance: none;
                text-align: center;
                box-sizing: border-box;
                outline: none;
                margin: 0;
                transition: .1s;
                font-weight: 500;
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
                padding: 9px 15px;
                font-size: 12px;
                border-radius: 3px;
                &.confirm {
                    color: #fff;
                    background-color: #409eff;
                    border-color: #409eff;
                }
            }
        }
    }
}
</style>