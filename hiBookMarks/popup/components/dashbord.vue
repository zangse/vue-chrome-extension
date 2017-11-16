<template>
    <div class="wrapper" @keyup.tab="tabCall($event)">
        <div class="header">
            <span class="search-input">
                    <input  class="search" type="text" v-model="searchItem" placeholder="搜索(输入内容，自动搜索)"  tabindex="0">
                    <i class="iconfont clear-icon" v-if="searchItem.length>0&&isSearch" @click.stop="cleanSearch">&#xe609;</i>
                     <i class="iconfont serach-icon" >&#xe60d;</i></span>
            <span @click="goHome" class="home"><i class="iconfont">&#xe601;</i></span>
        </div>
        <div class="main-content">
            <ul class="search-list" v-if="isSearch" @keyup.enter="openByTab($event)">
                <a v-for="(item,index) in searchList" class="list-item" v-if="searchList.length>0" @click.stop="openOnNewTab(item)" :class="{'selected':selectedId==item.id }" v-bind:tabindex="index+1">
                    <i class="icon"><img :src="'chrome://favicon/' + item.url" ></i>
                    <span class="title" v-if="item.title">{{item.title}}</span>
                    <span class="title" v-if="!item.title">{{item.url}}</span>
                </a>
                <li v-if="searchList.length==0">暂无匹配结果,换个关键词试试吧</li>
            </ul>
            <ul class="tree-list" v-if="!isSearch">
                <treeitem v-for="item in allNodes" class="folder-item" :folders="item" :key="item.id"></treeitem>
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
            isSearch: false,
            searchList: [],
            selectedId: null
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
            this.allNodes = [];
            chrome.bookmarks.getTree((treeNodes) => {
                console.log(treeNodes);
                this.allNodes = treeNodes[0].children;
                console.log(this.allNodes);
            });
        },
        goHome() {
            chrome.tabs.create({
                'url': 'index.html',
                'selected': true
            });
        },
        searchBookmarks() {
            if (this.searchItem == '') {
                return;
            }
            this.isSearch = true;
            chrome.bookmarks.search(this.searchItem, (data) => {
                console.log(data)
                this.searchList = data.filter(this.getTab);
            })
        },
        cleanSearch() {
            this.searchItem = '';
            this.isSearch = false;
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
        tabCall(e) {
            console.log(e.target)
            let tabIndex = e.target.tabIndex;
            if (!this.isSearch || this.searchList.length == 0) {
                return;
            }
            // console.log(tabIndex);
            if (this.searchList[tabIndex - 1]) {
                this.selectedId = this.searchList[tabIndex - 1].id;
            }
        },
        openByTab(e) {
            if (this.searchList.length == 0 || !this.selectedId) {
                return;
            }
            console.log('enter')
            console.log(e.target.tabIndex)
            let tabIndex = e.target.tabIndex;
            let newTab = this.searchList[tabIndex - 1];
            this.openOnNewTab(newTab);
        },
        getTab(item) {
            return item.url;
        }
    },
    watch: {
        searchItem: function(newVal) {
            if (newVal.length == 0) {
                console.log(newVal)
                this.selectedId = null;
                this.isSearch = false;
            } else {
                this.selectedId = null;
                this.searchBookmarks();
            }
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
        z-index: 500;
        .search-input {
            position: relative;
            .search {
                height: 24px;
                line-height: 24px;
                width: 340px;
                border: none;
                outline: none;
                padding: 3px 20px;
            }
            .serach-icon {
                position: absolute;
                left: 0;
                top: 0;
                color: #333;
                padding-left: 3px;
                cursor: pointer;
            }
            .clear-icon {
                position: absolute;
                right: 0;
                top: 0;
                color: #333;
                padding-right: 3px;
                cursor: pointer;
            }
        }
        .home {
            width: 30px;
            height: 30px;
            font-size: 20px;
            cursor: pointer;
        }
    }
    .main-content {
        width: 100%;
        height: auto;
        padding: 0 8px;
        padding-top: 40px;
        box-sizing: border-box;
        .search-list {
            margin: 0;
            transition: all 0.5s;
            .list-item {
                height: 28px;
                display: block;
                line-height: 28px;
                text-align: left;
                cursor: pointer;
                overflow: hidden;
                outline: none;
                padding-left: 15px;
                .icon {
                    width: 20px;
                    height: 28px;
                    line-height: 28px;
                    vertical-align: middle;
                    display: inline-block;
                    img {
                        padding-top: 5px;
                    }
                }
                .title {
                    padding-left: 5px;
                    height: 28px;
                    line-height: 28px;
                    color: #42b983;
                }
                &:hover {
                    background: #e4f1f9;
                }
                &.selected {
                    background: #e4f1f9;
                }
            }
        }
        .tree-list {
            margin: 0;
            transition: all 0.5s;
        }
    }
}
</style>