<template>
    <div class="model-wrapper" :class="{'show':showModel}">
        <div class="model-mask"></div>
        <transition name="fade">
            <div class="model-body" v-if="showModel">
                <div class="model-header">
                    <span class="header-title">{{i18n.moveTo}}</span>
                    <span class=" float-r" @click="cancel"><i class="iconfont close-icon">&#xe622;</i></span> </div>
                <div class="model-content">
                    <ul class="folder-list">
                        <treeitem v-for="item in allFolder" class="folder-item" :folders="item" :key="item.id" :selectedItem.sync="selectedItem" @update:selectedItem="handleUpdate" :isAdding="isAdding" v-on:updateAdding="handleAddUpdate"></treeitem>
                    </ul>
                </div>
                <div class="model-footer">
                    <span class="btn-md float-l" @click="addFolder"><i class="iconfont new-folder">&#xe632;</i></span>
                    <span class="btn-md float-r confirm" @click="move">{{i18n.confirm}}</span>
                    <span class="btn-md float-r" @click="cancel">{{i18n.close}}</span>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import treeitem from '../../components/common/treeitem.vue'
export default {
    name: 'model',
    data() {
        return {
            allFolder: [],
            isAdding: false,
            showModel: false,
            i18n: {
                moveTo: '',
                confirm: '',
                colse: ''
            }
        }
    },
    props: {
        value: Boolean,
        selectedItem: Object
    },
    components: {
        treeitem
    },
    created() {
        this.i18n.moveTo = chrome.i18n.getMessage("moveTo");
        this.i18n.confirm = chrome.i18n.getMessage("confirm");
        this.i18n.close = chrome.i18n.getMessage("close");
        this.isAdding = false;
        this.selectedItem = {};
        this.allFolder = [];
        this.loadALlFolder();
    },
    methods: {
        loadALlFolder() {
            this.allFolder = [];
            chrome.bookmarks.getTree((treeNodes) => {
                this.allFolder = treeNodes[0].children;
            });
        },
        addFolder() {
            if (!this.selectedItem) {
                return;
            }
            if (this.isAdding) {
                return;
            }
            this.isAdding = true;
            let newFolder = {
                title: '新建文件夹',
                parentId: this.selectedItem.id,
                type: 'new'
            }
            if (!this.selectedItem.children) {
                this.selectedItem.children = [];
            }
            this.selectedItem.children.push(newFolder);
        },
        cancel() {
            this.$emit('updateShow');
        },
        move() {
            this.$emit('updateMove');
        },
        handleAddUpdate() {
            this.isAdding = false;
        },
        handleUpdate(val) {
            this.$emit('update:selectedItem', val)
        },
    },
    watch: {
        value(newVal) {
            this.showModel = newVal
        }
    }
}
</script>
<style lang="scss" scoped>
.model-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    opacity: 0;
    display: none;
    &.show {
        display: block;
        opacity: 1;
        z-index: 400;
    }
    .model-mask {
        position: fixed;
        z-index: 400;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .35);
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
    .model-body {
        width: 500px;
        height: 380px;
        background: #f8f8f8;
        z-index: 501;
        position: fixed;
        margin-top: -190px;
        top: 50%;
        left: 50%;
        border-radius: 5px;
        margin-left: -250px;
        overflow: hidden;
        .btn-md {
            width: 48px;
            height: 28px;
            display: inline-block;
            line-height: 28px;
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
            font-size: 12px;
            border-radius: 4px;
            margin: 5px;
            &.confirm {
                color: #fff;
                background-color: #409eff;
                border-color: #409eff;
            }
        }
        .float-l {
            float: left;
        }
        .float-r {
            float: right;
        }
        .model-header {
            height: 40px;
            line-height: 40px;
            background: #f1f1f1;
            text-align: left;
            .header-title {
                padding-left: 10px;
                border-radius: 5px;
                color: #333;
                font-size: 14px;
            }
            .close-icon {
                padding: 4px;
                font-size: 18px;
                margin-right: 5px;
                cursor: pointer;
                color: #878d99;
                &:hover {
                    color: #409eff;
                }
            }
        }
        .model-content {
            width: 500px;
            padding: 5px 10px;
            height: 300px;
            box-sizing: border-box;
            overflow-y: auto;
            .folder-list {
                margin: 0;
            }
        }
        .model-footer {
            height: 40px;
            line-height: 40px;
            background: #f1f1f1;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            .new-folder {
                color: #ffb927;
                font-size: 16px;
                cursor: pointer;
            }
        }
    }
}
</style>