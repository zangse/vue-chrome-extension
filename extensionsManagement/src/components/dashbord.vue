<template>
    <div class="wrapper">
        <div class="header">
            <div class="header-content">
                <span class="tabs">
                <span class="iconfont icon extension" :class="{'active':currentActive===1}" @click.stop="setTab(1)">&#xe62b;</span>
                <span class="iconfont icon link" :class="{'active':currentActive===2}" @click.stop="setTab(2)">&#xe612;</span>
                <!--        <span class="iconfont icon setting" :class="{'active':currentActive===3}" @click.stop="setTab(3)">&#xe63b;</span> -->
                </span>
                <span class="switch" :class="{'enabled':!disabledAll,'disabled':disabledAll}" @click.stop="toggleDisable" v-if="currentActive===1">
                    <i class="icon-i"></i>
                    <i class="icon-o"></i>
                    <span class="icon-round" :class="{'enabled':!disabledAll,'disabled':disabledAll}"></span>
                </span>
            </div>
        </div>
        <div class="main-content ">
            <ul class="tree-list" v-show="currentActive===1">
                <treeitem v-for="item in allNodes" class="folder-item" :extendItem="item" :key="item.id" @setEnabled="setEnabledHandler"></treeitem>
            </ul>
            <ul class="shortcut-list" v-show="currentActive===2">
                <li class="list-item">
                    <div class="item" @click.stop="newTab('chrome://downloads/')"><i class="iconfont icon">&#xe60f;</i><span class="title">下载管理</span></div>
                </li>
                <li class="list-item">
                    <div class="item" @click.stop="newTab('chrome://history/')"><i class="iconfont icon">&#xe7d8;</i><span class="title">历史记录</span></div>
                </li>
                <li class="list-item">
                    <div class="item" @click.stop="newTab('chrome://extensions/')"><i class="iconfont icon">&#xe641;</i><span class="title">扩展程序</span></div>
                </li>
                <li class="list-item">
                    <div class="item" @click.stop="newTab('chrome://settings/')"><i class="iconfont icon">&#xe63b;</i><span class="title">设置</span></div>
                </li>
                <li class="list-item">
                    <div class="item remove" @click.stop="newTab('chrome://settings/clearBrowserData')"><i class="iconfont icon">&#xe642;</i><span class="title">清除浏览数据</span></div>
                </li>
                 <li class="list-item">
                    <div class="item " @click.stop="newTab('https://chrome.google.com/webstore/category/extensions')"><i class="iconfont icon">&#xe62f;</i><span class="title">应用商店</span></div>
                </li>
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
            allNodes: [],
            disabledAll: true,
            selfId: null,
            currentActive: 1
        }
    },
    components: {
        treeitem: treeitem
    },
    created() {
        this.getSelfInfo();
    },
    methods: {
        getSelfInfo() {
            chrome.management.getSelf((data) => {
                this.selfId = data.id;
                this.loadAllNodes();
            })
        },
        loadAllNodes() {
            this.allNodes.length = 0;
            chrome.management.getAll((data) => {
                let nodes = data.filter((item) => {
                    return item.id !== this.selfId;
                })
                let enabledCount = 0;
                nodes.forEach((item) => {
                    if (item.enabled) {
                        enabledCount += 1;
                    }
                })
                this.disabledAll = enabledCount > 0 ? false : true;
                this.allNodes = nodes;
                console.log(JSON.stringify(this.allNodes));
            });
        },
        setEnabledHandler() {
            this.loadAllNodes();
        },
        toggleDisable() {
            this.allNodes.forEach((item) => {
                chrome.management.setEnabled(item.id, this.disabledAll, (data) => {})
            })
            this.loadAllNodes();
        },
        setTab(tab) {
            this.currentActive = tab;
        },
        newTab(url) {
            if (!url) {
                return;
            }
            let newTab = {
                url: url,
                active: true
            }
            chrome.tabs.create(newTab, () => {})
        }
    }
}
</script>
<style lang="scss" scoped>
.wrapper {
    .header {
        display: flex;
        height: 45px;
        line-height: 45px;
        padding: 0 10px;
        background: #f5f5f5;
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid #ddd;
        .header-content {
            display: flex;
            width: 100%;
            text-align: left;
            .tabs {
                display: inline-block;
                flex: 1;
                position: relative;
                .icon {
                    position: absolute;
                    top: 0;
                    font-size: 22px;
                    cursor: pointer;
                    width: 45px;
                    height: 45px;
                    text-align: center;
                    box-sizing: border-box;
                    border: 1px solid #f5f5f5;
                    border-top-left-radius: 3px;
                    border-top-right-radius: 3px;
                    border-bottom-color: #ddd;
                    &.extension {
                        left: 0;
                    }
                    &.link {
                        left: 45px;
                    }
                    &.setting {
                        left: 90px;
                    }
                    &.active {
                        border-color: #ddd;
                        border-bottom-color: #fff;
                        background: #fff;
                        color: #f58500;
                    }
                    &:hover {
                        border-color: #f58500;
                        border-bottom-color: #fff;
                        background: #e5f0fb;
                    }
                }
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
                margin-top: 10px;
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
        background: #fff;
        .tree-list {
            margin-bottom: 0;
            margin-top: 0;
            overflow: hidden;
        }
        .shortcut-list {
            margin-bottom: 0;
            margin-top: 0;
            overflow: hidden;
            .list-item {
                display: block;
                text-align: center;
                cursor: pointer;
                overflow: hidden;
                float: left;
                width: 25%;
                background: #fff;
                .item {
                    margin: 8px;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    text-align: center;
                    background: #f5f5f5;
                    .icon {
                        display: block;
                        height: 40px;
                        font-size: 40px;
                        vertical-align: middle;
                    }
                    .title {
                        display: block;
                        margin-top: 8px;
                        height: 24px;
                        line-height: 24px;
                        color: #42b983;
                    }
                    &.remove {
                        .icon {
                            font-size: 54px;
                        }
                        .title {
                            width: 72px;
                        }
                    }
                    &:hover {
                        background: #e4f1f9;
                        .icon {
                            color: #f58500;
                        }
                    }
                }
            }
        }
    }
}
</style>