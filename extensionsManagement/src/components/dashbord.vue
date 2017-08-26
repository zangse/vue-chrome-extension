<template>
    <div class="wrapper">
        <div class="header">
            <div class="header-content">
                <span class="tabs">
                <span class="iconfont"></span>
                <span class="iconfont">&#xe612;</span>
                <span class="iconfont">&#xe63b;</span>
                </span>
                <span class="switch">
                    <i class="icon-i"></i>
                    <i class="icon-o"></i>
                    <span class="icon-round"></span>
                </span>
            </div>
        </div>
        <div class="main-content ">
            <ul class="search-list" v-if="isSearch">
            </ul>
            <ul class="tree-list" v-if="!isSearch">
                <treeitem v-for="item in allNodes" class="folder-item" :extendItem="item" :key="item.id" @setEnabled="setEnabledHandler"></treeitem>
            </ul>
        </div>
    </div>
</template>
<script>
import treeitem from '../components/treeitem.vue'
export default {
    name: 'dashbord',
    data() {
        return {
            searchItem: '',
            allNodes: []
        }
    },
    components: {
        treeitem: treeitem
    },
    created() {
        this.loadAllNodes();
    },
    methods: {
        loadAllNodes() {
            this.allNodes.length = 0;
            chrome.management.getAll((treeNodes) => {
                this.allNodes = treeNodes;
                console.log(this.allNodes);
            });
        },
        openOnNewTab(item) {
            if (!item.url) {
                return;
            }
            let newTab = {
                url: item.url,
                active: true
            }
            chrome.tabs.create(newTab, () => {
                console.log('1111')
            })
        },
        setEnabledHandler() {
            this.loadAllNodes();
        }
    }
}
</script>
<style lang="scss" scoped>
.wrapper {
    .header {
        display: flex;
        height: 30px;
        line-height: 30px;
        position: fixed;
        top: 0;
        padding: 5px;
        background: #f5f5f5;
        .header-content {
            .switch {
                width: 50px;
                display: block;
                height: 18px;
                position: relative;
                border-radius: 18px;
                border: 1px solid #333;
                background-color: #fff;
                z-index: 10;
                .icon-i {
                    width: 1px;
                    height: 8px;
                    display: inline-block;
                    background: #ccc;
                    position: absolute;
                    left: 9px;
                    top: 4px;
                    z-index: 50;
                }
                .icon-o {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    display: inline-block;
                    background: #fff;
                    border: 1px solid #ccc;
                    position: absolute;
                    right: 9px;
                    top: 4px;
                    z-index: 50;
                }
                .icon-round {
                    width: 17px;
                    position: absolute;
                    display: block;
                    top: 0;
                    left: 0;
                    height: 17px;
                    background: #fff;
                    border: 1px solid #333;
                    position: relative;
                    border-radius: 50%;
                    transition: all 1s;
                    z-index: 100;
                    &.disabled {
                        left: 41px;
                    }
                }
                &.disabled {
                    background: #fff;
                }
            }
        }
    }
    .main-content {
        width: 100%;
        height: auto;
        padding: 5px 0;
        padding-top: 30px;
        .tree-list {
            margin-bottom: 0;
        }
        .search-list {
            .list-item {
                height: 24px;
                display: block;
                line-height: 24px;
                text-align: left;
                cursor: pointer;
                overflow: hidden;
                .icon {
                    height: 24px;
                    line-height: 24px;
                    vertical-align: middle;
                }
                .title {
                    padding-left: 5px;
                    height: 24px;
                    line-height: 24px;
                    color: #42b983;
                }
                &:hover {
                    background: #e4f1f9;
                }
            }
        }
    }
}
</style>