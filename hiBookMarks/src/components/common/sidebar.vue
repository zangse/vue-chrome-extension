<template>
    <div class="sidebar">
        <ul class="nav-list">
            <li class="item"><span @click="targetItem(2)">最近浏览</span></li>
            <li class="item"><span @click="targetItem(0)">所有书签</span></li>
            <li class="item"><span @click="targetItem(1,bookmarksNode)">书签栏</span></li>
            <li class="item" v-for="item in folders" @click="targetItem(1,item)">
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
        return {}
    },
    props: {
        folders: Array,
        bookmarksNode: Object
    },
    methods: {
        targetItem(type, item) {
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
            width: 150px;
            overflow: hidden;
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
        }
    }
}
</style>