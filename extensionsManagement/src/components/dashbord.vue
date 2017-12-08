<template>
    <div class="wrapper">
        <div class="header">
            <div class="header-content">
                <span class="tabs">
                <span class="iconfont icon extension" :class="{'active':currentActive===1}" @click.stop="setTab(1)">&#xe62b;</span>
                <span class="iconfont icon link" :class="{'active':currentActive===2}" @click.stop="setTab(2)">&#xe612;</span>
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
                    <div class="item download" @click.stop="newTab('chrome://downloads/')"><i class="iconfont icon">&#xe60f;</i><span class="title">{{i18n.downloads}}</span></div>
                </li>
                <li class="list-item">
                    <div class="item" @click.stop="newTab('chrome://history/')"><i class="iconfont icon">&#xe7d8;</i><span class="title">{{i18n.history}}</span></div>
                </li>
                <li class="list-item">
                    <div class="item" @click.stop="newTab('chrome://extensions/')"><i class="iconfont icon">&#xe641;</i><span class="title">{{i18n.extensions}}</span></div>
                </li>
                <li class="list-item">
                    <div class="item" @click.stop="newTab('chrome://settings/')"><i class="iconfont icon">&#xe63b;</i><span class="title">{{i18n.settings}}</span></div>
                </li>
                <li class="list-item">
                    <div class="item remove" @click.stop="newTab('chrome://settings/clearBrowserData')"><i class="iconfont icon">&#xe642;</i><span class="title">{{i18n.clearBrowserData}}</span></div>
                </li>
                <li class="list-item">
                    <div class="item shop" @click.stop="newTab('https://chrome.google.com/webstore/category/extensions')"><i class="iconfont icon">&#xe62f;</i><span class="title">{{i18n.webstore}}</span></div>
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
            currentActive: 1,
            i18n: {
                downloads: '',
                history: '',
                extensions: '',
                settings: '',
                clearBrowserData: '',
                webstore: ''
            }
        }
    },
    components: {
        treeitem: treeitem
    },
    created() {
        this.i18n.downloads = chrome.i18n.getMessage("downloads");
        this.i18n.history = chrome.i18n.getMessage("history");
        this.i18n.extensions = chrome.i18n.getMessage("extensions");
        this.i18n.settings = chrome.i18n.getMessage("settings");
        this.i18n.clearBrowserData = chrome.i18n.getMessage("clearBrowserData");
        this.i18n.webstore = chrome.i18n.getMessage("webstore");
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
                // console.log(JSON.stringify(this.allNodes));
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
    background: #D6D7DE;
    .header {
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        height: 60px;
        line-height: 60px;
        padding: 0 10px;
        background: #3B3A49;
        width: 100%;
        box-sizing: border-box;
        z-index: 100;
        box-shadow: 2px 2px 8px #333;
        .header-content {
            display: flex;
            width: 100%;
            text-align: left;
            .tabs {
                display: inline-block;
                flex: 1;
                position: relative;
                overflow: hidden;
                .icon {
                    position: absolute;
                    top: 0;
                    font-size: 24px;
                    cursor: pointer;
                    width: 30px;
                    height: 58px;
                    text-align: center;
                    color: #fff;
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
                        border-bottom: 2px solid #64F8E4;
                    }
                }
            }
            .switch {
                width: 50px;
                display: inline-block;
                height: 20px;
                position: relative;
                border-radius: 20px;
                background-color: #fff;
                z-index: 10;
                transition: all 0.5s;
                cursor: pointer;
                margin-top: 20px;
                .icon-i {
                    width: 1px;
                    height: 10px;
                    display: inline-block;
                    background: #f5f5f5;
                    position: absolute;
                    left: 9px;
                    top: 5px;
                    z-index: 50;
                }
                .icon-o {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    display: inline-block;
                    background: #fff;
                    border: 1px solid #ccc;
                    position: absolute;
                    right: 6px;
                    top: 4px;
                    z-index: 50;
                }
                .icon-round {
                    width: 16px;
                    position: absolute;
                    display: block;
                    top: 0;
                    height: 18px;
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
                        left: 32px;
                    }
                }
                &.disabled {
                    background: #fff;
                }
                &.enabled {
                    background: #3fab7a;
                }
            }
        }
    }
    .main-content {
        width: 420px;
        min-height: 60px;
        margin-top: 60px;
        padding: 10px 0;
        background: #D6D7DE;
        box-sizing: border-box;
        overflow: hidden;
        .tree-list {
            height: 100%;
            margin-bottom: 0;
            margin-top: 0;
            overflow-x: hidden;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            &::-webkit-scrollbar {
                width: 12px
            }

            &::-webkit-scrollbar-track {
                background-color: #607d9b;
            }

            &::-webkit-scrollbar-thumb {
                width: 10px;
                border-radius: 5px;
                background-color: #486f96;
            }
        }
        .shortcut-list {
            margin-bottom: 0;
            margin-top: 0;
            overflow: hidden;
            padding: 15px;
            .list-item {
                display: block;
                text-align: center;
                cursor: pointer;
                overflow: hidden;
                float: left;
                width: 25%;
                .item {
                    margin: 8px;
                    padding: 8px;
                    border-radius: 8px;
                    text-align: center;
                    background: #fff;
                    box-shadow: 3px 3px 6px #3b3a49;
                    .icon {
                        color: #F98168;
                        display: block;
                        height: 40px;
                        line-height: 40px;
                        font-size: 32px;
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
                            font-size: 44px;
                            padding-top: 4px;
                            box-sizing: border-box;
                        }
                        .title {
                            width: 72px;
                        }
                    }
                    &.download {
                        .icon {
                            font-size: 28px;
                        }
                    }
                    &.shop {
                        .icon {
                            font-size: 28px;
                        }
                    }
                    &:hover {
                        background: #e5f0fb;
                    }
                }
            }
        }
    }
}
</style>