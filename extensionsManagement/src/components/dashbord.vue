<template>
    <div class="wrapper">
        <div class="header">
            <div class="header-content">
                <span class="tabs">
                <span class="iconfont"></span>
                <span class="iconfont">&#xe612;</span>
                <span class="iconfont">&#xe63b;</span>
                </span>
                <span class="switch" :class="{'enabled':!disabledAll,'disabled':disabledAll}" @click.stop="toggleDisable">
                    <i class="icon-i"></i>
                    <i class="icon-o"></i>
                    <span class="icon-round" :class="{'enabled':!disabledAll,'disabled':disabledAll}"></span>
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
            allNodes: [],
            disabledAll: false
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
        },
        toggleDisable() {
            this.disabledAll = !this.disabledAll;
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
        padding: 5px 10px;
        background: #f5f5f5;
        width: 100%;
        box-sizing: border-box;
        .header-content {
            display: flex;
            width: 100%;
            text-align: left;
            height: 28px;
            line-height: 28px;
            .tabs {
                display: inline-block;
                flex: 1;
            }
            .switch {
                width: 50px;
                display: inline-block;
                height: 18px;
                position: relative;
                border-radius: 18px;
                border: 1px solid #ccc;
                background-color: #fff;
                z-index: 10;
                transition: all 0.5s;
                cursor: pointer;
                .icon-i {
                    width: 1px;
                    height: 10px;
                    display: inline-block;
                    background: #f5f5f5;
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
                    width: 16px;
                    position: absolute;
                    display: block;
                    top: 0;
                    left: 32px;
                    height: 16px;
                    background: #fff;
                    border: 1px solid #ccc;
                    position: relative;
                    border-radius: 50%;
                    transition: all 0.5s;
                    z-index: 100;
                    &.disabled {
                        left: 0px;
                    }
                    &.enabled {
                        left: 32x;
                    }
                }
                &.disabled {
                    background: #fff;
                }
                &.enabled {
                    background: #64cc0c;
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