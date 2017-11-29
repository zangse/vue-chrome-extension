<template>
    <div class="sidebar">
        <ul class="nav-list">
            <li class="item " :class="{'active':currentSelected=='-1'}"><span @click="targetItem(-1,historyNode)"><span class="iconfont icon-default font-18">&#xe6d1;</span><span>{{i18n.browsingHistory}}</span></span>
            </li>
            <li class="item" :class="{'active':currentSelected=='0'}"><span @click="targetItem(0,allNode)"><span class="iconfont icon-default">&#xe63a;</span><span>{{i18n.allBookmarks}}</span></span>
            </li>
            <li class="item" :class="{'active':currentSelected=='1'}"><span @click="targetItem(1,bookmarksNode)"> <span class="iconfont icon-default">&#xe650;</span><span>{{i18n.bookmarksBar}}</span></span>
            </li>
            <li class="item" v-for="item in folders" :class="{'active':currentSelected==item.id}" @click="targetItem(1,item)">
                <span v-if="!item.children">
                        <span class="icon"><img :src="'chrome://favicon/' + item.url" ></span>
                <span class="title">{{item.title}}</span>
                </span>
                <span v-if="item.children">
                        <span class="iconfont folder-icon">&#xe632;</span>
                <span class="title">{{item.title}}</span>
                </span>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'sidebar',
    data() {
        return {
            currentSelected: 0,
            historyNode: { id: -1 },
            allNode: { id: 0 },
            i18n: {
                browsingHistory: '',
                bookmarksBar: '',
                allBookmarks:''
            }
        }
    },
    props: {
        folders: Array,
        bookmarksNode: Object,
        currentSelected: String
    },
    created() {
        this.i18n.allBookmarks = chrome.i18n.getMessage("allBookmarks");
        this.i18n.browsingHistory = chrome.i18n.getMessage("browsingHistory");
        this.i18n.bookmarksBar = chrome.i18n.getMessage("bookmarksBar");
    },
    methods: {
        targetItem(type, item) {
            this.currentSelected = item.id;
            this.$emit('currentSelected', this.currentSelected);
            this.$emit('loadItem', type, item);
        },
    }
}
</script>
<style lang="scss" scoped>
@import "assets/style/mixin.scss";
.sidebar {
    display: block;
    position: fixed;
    width: 200px;
    left: 0;
    top: 54px;
    bottom: 0;
    background: white;
    box-shadow: 0 0 4px rgba(0, 0, 0, .14), 2px 4px 8px rgba(0, 0, 0, .28);
    color: #757575;
    font-family: Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 14px;
    height: calc(100% - 54px);
    overflow-y: auto;
    .nav-list {
        .item {
            cursor: pointer;
            display: flex;
            height: 45px;
            line-height: 45px;
            padding-left: 30px;
            white-space: nowrap;
            width: 100%;
            overflow: hidden;
            box-sizing: border-box;
            padding-right: 8px;
            &:hover {
                background: #f3f3f3;
            }
            &.active {
                background: #ece5e5;
            }
            .icon-default {
                width: 24px;
                height: 45px;
                line-height: 45px;
                text-align: center;
                color: #2790DE;
                font-size: 16px;
                margin-right: 5px;
                cursor: pointer;
                &.font-18 {
                    font-size: 18px;
                }
            }
            .folder-icon {
                width: 24px;
                height: 45px;
                line-height: 45px;
                text-align: center;
                color: rgb(255, 185, 39);
                font-size: 14px;
                margin-right: 5px;
                cursor: pointer;
            }
            .title {
                flex: 1;
                overflow: hidden;
                height: 45px;
                line-height: 45px;
                text-align: left;
                img {
                    width: 16px;
                    height: 16px;
                    display: block;
                    margin: 15px 4px 14px 4px;
                }
            }
            span {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
</style>