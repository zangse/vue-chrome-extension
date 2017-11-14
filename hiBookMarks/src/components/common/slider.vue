<template>
    <ul class="slider-warpper" :class="{'show':selectedNode.length==1,'hide':selectedNode.length!==1}">
        <li class="item"><span class="title">书签编辑</span></li>
        <li class="item">
            <div class="icon-wrapper">
                <span class="icon-content">
             <img :src="nodeIcon" class="icon-item">
             </span>
            </div>
        </li>
        <li class="item  input-group">
            <span class="input-label">标题:</span>
            <input type="text" class="input-edit " v-model="currentNode.title">
        </li>
        <li class="item input-group" v-if="!currentNode.dateGroupModified">
            <span class="input-label">地址:</span>
            <input type="text" class="input-edit " v-model="currentNode.url">
        </li>
        <li class="item">
            <span class="btn cancle" @click="cancle">取消</span>
            <span class="btn save" @click="save">保存</span>
        </li>
    </ul>
</template>
<script>
export default {
    name: 'slider',
    data() {
        return {
            isShow: false,
            currentNode: {},
            nodeIcon: ''
        }
    },
    props: {
        isShow: Boolean,
        selectedNode: Array
    },
    watch: {
        selectedNode: function(newVal) {
            if (newVal.length == 1) {
                this.loadCurrent(newVal);
            }
        }
    },
    methods: {
        loadCurrent(data) {
            chrome.bookmarks.get(data, (res) => {
                if (res && res.length >= 1) {
                    this.currentNode = res[0];
                    console.log(this.currentNode)
                    this.nodeIcon = `chrome://favicon/${this.currentNode.url}`
                }
            })
        },
        cancle() {
            this.selectedNode.length = 0;
            this.$emit('editNode');
            this.$emit('toast-show', 'cancle', '取消编辑');
        },
        save() {
            let node = {
                url: this.currentNode.url,
                title: this.currentNode.title
            }
            chrome.bookmarks.update(this.currentNode.id, node, (res) => {
                console.log(res)
                this.$emit('editNode');
                this.$emit('toast-show', 'success', '编辑成功');
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import "assets/style/mixin.scss";
.slider-warpper {
    width: 200px;
    height: 100%;
    background: #f5f5f5;
    position: fixed;
    left: 0;
    top: 54px;
    padding: 0 3px;
    margin: 0;
    box-sizing: border-box;
    overflow: hidden;
    @include transition( all .5s ease);
    &.show {
        -webkit-transform: translateX(0px);
        z-index: 201;
        opacity: 1;
    }
    &.hide {
        -webkit-transform: translateX(-200px);
        z-index: 0;
        opacity: 0;
    }
    .item {
        display: block;
        margin: 10px 0;
        .title {
            font-size: 18px;
        }
        .icon-wrapper {
            position: relative;
            margin: 10px auto;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 1px dashed #ccc;
            .icon-content {
                width: 32px;
                height: 32px;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -16px;
                margin-left: -16px;
                background: #fff;
                border-radius: 50%;
                box-sizing: border-box;
                padding: 8px;
                .icon-item {
                    width: 16px;
                    height: 16px;
                }
            }
        }
        &.input-group {
            display: flex;
            .input-label {
                width: 30px;
                display: inline-block;
                height: 28px;
                line-height: 28px;
            }
            .input-edit {
                flex: 1;
                width: 100%;
                display: inline-block;
                height: 28px;
                line-height: 28px;
                border: none;
                outline: none;
                background: #fff;
                padding: 4px;
                box-sizing: border-box;
            }
        }
        .btn {
            cursor: pointer;
            display: inline-block;
            padding: 0 8px;
            height: 28px;
            line-height: 28px;
            border-radius: 5px;
            font-weight: 500;
            color: #fff;
            &.cancle {
                background: #b8b9c3;
            }
            &.save {
                background: #4250dc;
            }
        }
    }
}
</style>