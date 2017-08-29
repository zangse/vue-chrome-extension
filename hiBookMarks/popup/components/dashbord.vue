<template>
    <div class="wrapper">
        <div class="header">
            <span class="search-input">
                    <input  class="search" type="text" v-model="searchItem" placeholder="搜索(输入内容，回车搜索)" v-on:change="searchBookmarks" @keyup.enter="searchBookmarks">
                    <i class="iconfont clear-icon" v-if="searchItem.length>0&&isSearch" @click.stop="cleanSearch">&#xe609;</i>
                     <i class="iconfont serach-icon" >&#xe60d;</i></span>
            <span @click="goHome" class="home"><i class="iconfont">&#xe601;</i></span>
        </div>
        <div class="main-content ">
            <ul class="search-list" v-if="isSearch">
                <li v-for="item in searchList" class="list-item" v-if="searchList.length>0" @click.stop="openOnNewTab(item)">
                    <i class="icon"><img :src="'chrome://favicon/' + item.url" ></i><span class="title">{{item.title}}</span>
                </li>
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
            isSearching: false,
            isSearch: false,
            searchList: []
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
            console.log('search')
            if (this.searchItem == '') {
                this.isSearch = false;
                return;
            }
            this.isSearching = true;
            this.isSearch = true;
            chrome.bookmarks.search(this.searchItem, (data) => {
                this.searchList = data;
                console.log('searchList' + JSON.stringify(this.searchList))
                this.isSearching = false;
            })
        },
        cleanSearch() {
            this.searchItem = '';
            this.isSearch = false;
            // this.getChildren(this.bookmarksNode);
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
        padding: 5px 10px;
        padding-top: 30px;
        .search-list {
            padding-top: 5px;
            .list-item {
                height: 28px;
                display: block;
                line-height: 28px;
                text-align: left;
                cursor: pointer;
                overflow: hidden;
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
                    display: inline-block;
                }
                &:hover {
                    background: #e4f1f9;
                }
            }
        }
    }
}
</style>