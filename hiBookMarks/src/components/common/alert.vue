<template>
    <div class="alert-wrapper" :class="{'show':showAlert}">
        <div class="alert-mask"></div>
        <div class="alert-body">
            <div class="alert-header">
                <span class="header-title">移动到</span>
                <span class=" float-r" @click="cancle"><i class="iconfont close-icon">&#xe622;</i></span> </div>
            <div class="alert-content">
                <ul class="folder-list">
                    <treeitem v-for="item in allFolder" class="folder-item" :folders="item" :key="item.id" :selectedItem.sync="selectedItem" @update:selectedItem="handleUpdate" :isAdding="isAdding" v-on:updateAdding="handleAddUpdate"></treeitem>
                </ul>
            </div>
            <div class="alert-footer">
                <span class="btn-md float-l" @click="addFolder"><i class="iconfont new-folder">&#xe62d;</i></span>
                <span class="btn-md float-r" @click="move">确定</span>
                <span class="btn-md float-r" @click="cancle">关闭</span>
            </div>
        </div>
    </div>
</template>
<script>
import treeitem from '../../components/common/treeitem.vue'
export default {
    name: 'alert',
    data() {
        return {
            allFolder: [],
            isAdding: false
        }
    },
    props: {
        showAlert: Boolean,
        selectedItem: Object
    },
    components: {
        treeitem
    },
    created() {
        this.isAdding = false;
        this.selectedItem = {};
        this.allFolder = [];
        this.loadALlFolder();
    },
    methods: {
        loadALlFolder() {
            this.allFolder = [];
            chrome.bookmarks.getTree((treeNodes) => {
                // console.log(treeNodes);
                this.allFolder = treeNodes[0].children;
                // console.log(this.allFolder);
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
            // console.log('selectedItem:' + this.selectedItem)
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
        cancle() {
            this.showAlert = false;
            this.$emit('updateShow', this.showAlert);
        },
        move() {
            this.showAlert = false;
            this.$emit('updateMove', this.showAlert);
        },
        handleAddUpdate() {
            // console.log('adding update handle')
            this.isAdding = false;
        },
        handleUpdate(val) {
            this.$emit('update:selectedItem', val)
        },
    },
    watch: {
        isAdding: function(newVal) {
            // console.log('adding update watch' + newVal)
        }
    }
}
</script>
<style lang="scss" scoped>
.alert-wrapper {
    display: none;
    position: fixed;
    top: 0px;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    &.show {
        display: block;
        z-index: 400;
    }
    .alert-mask {
        position: absolute;
        z-index: 500;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.35);
    }
    .alert-body {
        position: relative;
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
            box-sizing: border-box;
            padding: 4px 8px;
            height: 28px;
            line-height: 20px;
            margin: 4px;
            background: #5e9dda;
            border-radius: 5px;
            color: #fff;
            font-size: 13px;
            cursor: pointer;
        }
        .float-l {
            float: left;
        }
        .float-r {
            float: right;
        }
        .alert-header {
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
                font-size: 20px;
                margin-right: 5px;
                cursor: pointer;
            }
        }
        .alert-content {
            width: 500px;
            padding: 5px 10px;
            height: 300px;
            box-sizing: border-box;
            overflow-y: auto;
            .folder-list {
                margin: 0;
            }
        }
        .alert-footer {
            height: 40px;
            line-height: 40px;
            background: #f1f1f1;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            .new-folder {
                font-size: 22px;
                cursor: pointer;
            }
        }
    }
}
</style>