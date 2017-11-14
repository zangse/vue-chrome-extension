<template>
    <div class="wrapper">
        <bookheader :allNodes="allNodes" :selectedNode="selectedNode" @isSearching="isSearchingHandler" @cleanSearch="cleanSearchHandler" @cancleSelected="cancleSelectedHandler" @reloadCurrent="reloadCurrentHandler" :showMode="showMode" @toggleMode="toggleModeHandler" :isColorful="isColorful" @toggleColor="toggleColorHandler" :isHistory="isHistory" :autofocus="autofocus" @toast-show="toastShowHandler"></bookheader>
        <sidebar :folders="allFolder" @loadALL="loadALLHandler" :currentSelected="currentSelected" @currentSelected="currentSelectedHandler" @loadItem="loadItemHandler" :bookmarksNode="bookmarksNode"></sidebar>
        <div class="content">
            <div class="topbar">
                <div class="tag-name">
                    {{currentNode.title}}
                </div>
                <ul class="tag-list" v-if="topbarList.length>0">
                    <li v-for="(item,index) in topbarList" class="tag-item" :class="{'current':currentNode.id==item.id}" :style="{'z-index':100-index}" @click="getChildren(item,index)">
                        {{item.title}}
                    </li>
                </ul>
            </div>
            <ul class="bookmarks-list">
                <bookmarkitem :bookmarkitem="item" v-for="item in allNodes" :key="item.id" :selectedNode="selectedNode" @updateSelected="updateSelected" @click.native="getChildren(item)" :showMode="showMode" :isColorful="isColorful" :isHistory="isHistory"></bookmarkitem>
            </ul>
            <div v-if="isSearching&&allNodes.length===0">无匹配结果</div>
        </div>
        <slider :selectedNode="selectedNode" @editNode="editNodeHandler" @toast-show="toastShowHandler"></slider>
        <toast v-model="showToast" :toastMsg="toastMsg" @toast-hide="toastHideHandler"> </toast>
    </div>
</template>
<script>
import bookmarkitem from '../../components/common/bookmarkItem.vue'
import sidebar from '../../components/common/sidebar.vue'
import bookheader from '../../components/common/header.vue'
import slider from '../../components/common/slider.vue'
import toast from '../../components/common/toast.vue'
export default {
    name: 'app',
    data() {
        return {
            allNodes: [],
            allFolder: [],
            currentNode: {},
            currentSelected: 0,
            rootNode: {
                title: '所有书签',
                id: '0'
            },
            bookmarksNode: {},
            topbarList: [],
            selectedNode: [],
            isSearching: false,
            isHistory: false,
            showMode: 2,
            isColorful: false,
            maxResults: 10000,
            startTime: null,
            endTime: null,
            autofocus: true,
            showToast: false,
            toastMsg: {
                text: '操作成功',
                type: 'wraning',
                padding: '22px'
            }
        }
    },
    components: {
        bookmarkitem,
        sidebar,
        bookheader,
        slider,
        toast
    },
    created() {
        this.loadBookmarks();
    },
    methods: {
        loadBookmarks() {
            this.allNodes = [];
            this.isHistory = false;
            chrome.bookmarks.getTree((treeNodes) => {
                this.allFolder = treeNodes[0].children[0].children;
                this.bookmarksNode = treeNodes[0].children[0];
                this.currentNode = JSON.parse(JSON.stringify(this.rootNode));
                this.topbarList = [];
                this.topbarList.push(this.rootNode);
                this.excuTree(this.allFolder);
            });
        },
        loadHistory() {
            this.isHistory = true;
            this.allNodes = [];
            let nodes = [];
            this.startTime = null
            console.log(this.startTime);
            let searchObj = {
                text: '',
                startTime: this.startTime,
                maxResults: this.maxResults
            }
            chrome.history.search(searchObj, (data) => {
                nodes = data.filter((item) => {
                    return item
                })
                nodes.sort(this.sortRule);
                console.log(nodes)
                this.currentNode = {
                    title: "浏览历史"
                }
                this.topbarList = [];
                this.allNodes = nodes;
            })
        },
        getTimeStamp(day) {
            let date = new Date();
            let timeStamp = date.getTime();
            return (timeStamp - 24 * 3600 * 1000 * day) / 1000
        },
        sortRule(a, b) {
            return b.visitCount - a.visitCount
        },
        excuTree(treeNodes) {
            let self = this
            treeNodes.forEach(function(item) {
                if (item.children) {
                    self.excuTree(item.children)
                } else {
                    item.icon = 'chrome://favicon/' + item.url
                    self.allNodes.push(item)
                }
            })
        },
        getChildren(item, index) {
            this.isSearching = false;
            this.isHistory = false;
            // 如果有 文件夹或书签被选中，则不跳转或打开
            if (this.selectedNode.length > 0) {
                return;
            }
            let treeNodes = [];
            let node = JSON.parse(JSON.stringify(item));
            if (node.id == '0') {
                this.loadBookmarks();
            } else if (node.url) {
                this.openOnNewTab(node)
            } else {
                this.selectedNode = [];
                delete node.children;
                this.currentNode = node;
                if (index !== null && index !== undefined) {
                    this.currentSelected = item.id;
                    if (index >= 0) {
                        this.topbarList = this.topbarList.slice(0, index + 1);
                    }
                } else {
                    let length = this.topbarList.length;
                    if (length == 0) {
                        this.topbarList = [];
                        this.topbarList.push(this.rootNode);
                        this.topbarList.push(this.bookmarksNode);
                        if (this.bookmarksNode.id !== node.id) {
                            this.topbarList.push(node);
                        }
                    } else {
                        if (node.id == 1 && length >= 2) {
                            this.topbarList = this.topbarList.slice(0, 2);
                        } else if (node.id == 1 && length == 1) {
                            this.topbarList = [];
                            this.topbarList.push(this.rootNode);
                            this.topbarList.push(this.bookmarksNode);
                        } else if (this.topbarList[length - 1].id === node.parentId) {
                            this.topbarList.push(node);
                        } else if (this.topbarList[length - 1].parentId === node.parentId) {
                            this.topbarList.splice(length - 1, 1, node);
                        } else {
                            this.topbarList = [];
                            this.topbarList.push(this.rootNode);
                            this.topbarList.push(this.bookmarksNode);
                            this.topbarList.push(node);
                        }
                    }
                }
                treeNodes = chrome.bookmarks.getChildren(item.id, (nodes) => {
                    console.log(nodes)
                    this.allNodes = nodes.sort(this.listSort);
                });
            }
        },
        listSort(x, y) {
            // console.log(x, y)
            if (x.url && !y.url) {
                return 1
            } else if (!x.url && y.url) {
                return -1
            } else if ((x.url && y.url) || (!x.url && !y.url)) {
                // 按照首字母顺序排序
                return x.title.localeCompare(y.title, 'zh-Hans-CN')
            }
        },
        openOnNewTab(item) {
            if (!item.url) {
                return;
            }
            let newTab = {
                url: item.url,
                active: true
            }
            chrome.tabs.create(newTab)
        },
        updateSelected(selectedNode) {
            this.selectedNode = selectedNode;
            console.log(this.selectedNode)
        },
        loadALLHandler() {
            this.loadBookmarks();
        },
        loadItemHandler(type, item) {
            if (type == 0) {
                this.loadBookmarks();
            } else if (type == 1) {
                return item.url ? this.openOnNewTab(item) : this.getChildren(item);
            } else if (type == -1) {
                this.loadHistory();
            }
        },
        isSearchingHandler(data) {
            this.isSearching = true;
            this.allNodes = data.sort(this.listSort);
            this.currentNode.title = '搜索';
            this.topbarList = [];
        },
        cleanSearchHandler() {
            this.selectedNode = [];
            this.currentSelected = 0;
            this.getChildren(this.bookmarksNode);
        },
        cancleSelectedHandler() {
            this.selectedNode = [];
        },
        // 删除，移动操作，刷新当前节点
        reloadCurrentHandler() {
            this.selectedNode = [];
            if (this.isSearching) {
                this.isSearching = false;
                this.currentSelected = 0;
                this.getChildren(this.bookmarksNode);
            } else {
                this.getChildren(this.currentNode);
            }

        },
        toggleModeHandler() {
            this.showMode = this.showMode == 1 ? 2 : 1;
        },
        toggleColorHandler() {
            this.isColorful = !this.isColorful;
        },
        currentSelectedHandler(data) {
            this.currentSelected = data;
            this.selectedNode = [];
        },
        editNodeHandler() {
            this.selectedNode = [];
            this.getChildren(this.currentNode);
        },
        toastHideHandler() {
            console.log('toastHideHandler')
            this.showToast = false;
        },
        toastShowHandler(type, text, padding) {
            console.log('toastHideHandler')
            this.toastMsg.type = type ? type : 'success';
            this.toastMsg.text = text ? text : '操作成功';
            this.toastMsg.padding = padding ? padding : '22px';
            this.showToast = true;
        }
    }
}
</script>
<style lang="scss" scoped>
@import "assets/style/mixin.scss";
.wrapper {
    position: relative;
    .content {
        margin-left: 200px;
        margin-top: 54px;
        .topbar {
            padding: 15px 0 15px 25px;
            text-align: left;
            cursor: pointer;
            .tag-name {
                color: #4A4A4A;
                font-size: 22px;
                font-weight: 700;
                height: 32px;
                line-height: 32px;
                max-width: 507px;
                padding-right: 6px !important;
                white-space: nowrap;
            }
            .tag-list {
                border-left: #E5E5E5;
                clear: both;
                display: block;
                height: 40px;
                margin-top: 15px 0 0 4px;
                padding: 0;
                white-space: nowrap;
                width: auto;
                .tag-item {
                    background: #f1f1f1;
                    border-top-left-radius: 2px;
                    border-bottom-left-radius: 2px;
                    border-left: #E5E5E5 1px solid;
                    border-top: #E5E5E5 1px solid;
                    border-bottom: #E5E5E5 1px solid;
                    box-sizing: border-box;
                    color: #4a4a4a;
                    cursor: pointer;
                    display: inline-block;
                    height: 40px;
                    line-height: 40px;
                    text-align: left;
                    font-size: 12px;
                    font-weight: bold;
                    padding-left: 35px;
                    padding-right: 21px;
                    position: relative;
                    margin-left: -4px;
                    -webkit-transition: all .3s;
                    width: auto;
                    &:first-child {
                        padding-left: 26px;
                    }
                    &:after {
                        background: #f1f1f1;
                        border-right: #E5E5E5 1px solid;
                        border-top: #E5E5E5 1px solid;
                        content: "";
                        display: block;
                        height: 27px;
                        margin-top: 0;
                        position: absolute;
                        right: -14px;
                        top: 5px;
                        -webkit-transform: rotate(45deg);
                        -webkit-transition: all .3s;
                        width: 27px;
                    }
                    &.current {
                        background-color: #f8f8f8;
                        &:after {
                            background-color: #f8f8f8;
                        }
                    }
                }
            }
        }
        .bookmarks-list {
            text-align: left;
            padding: 0 20px;
            margin-top: 0;
        }
    }
}
</style>