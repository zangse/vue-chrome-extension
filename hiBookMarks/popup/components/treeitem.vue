<template>
    <div>
        <li v-if="!folders.url" @click.stop="toggle($event,folders)">
            <div class="folder-body" :class="{'checked':isChecked}">
                <i class="iconfont expend-icon" v-if="!isOpen&&isFolder">&#xe60c;</i>
                <i class="iconfont expend-icon" v-if="isOpen&&isFolder">&#xe6b1;</i>
                <i class=" expend-icon" v-if="!isFolder"></i>
                <span class="iconfont folder-icon">&#xe632;</span>
                <span>{{ folders.title }}</span>
            </div>
            <ul v-show="folders.children&&isOpen" :class="{'expend':isOpen}">
                <treeitem v-for="child in folders.children" :folders="child" :key="child.id"></treeitem>
            </ul>
        </li>
        <li v-if="folders.url" @click.stop="openOnNewTab($event,folders)" @mouseup.middle="openOnNewTab($event,folders,true)">
            <div class="folder-body">
                <i class=" expend-icon"></i>
                <span class=" folder-icon"><img :src="'chrome://favicon/' + folders.url" alt=""></span>
                <span class="item-title">{{ folders.title }}</span>
            </div>
        </li>
    </div>
</template>
<script>
export default {
    name: 'treeitem',
    props: {
        folders: Array
    },
    data() {
        return {
            isOpen: false
        }
    },
    methods: {
        toggle(e, item) {
            if (e.type == 'mouseenter' && this.isOpen) {
                return
            } else {
                this.isOpen = !this.isOpen;
                this.selectedItem = item;
                // console.log('toggle item' + JSON.stringify(this.selectedItem))
            }
        },
        openOnNewTab(e, item, type) {
            console.log(e)
            if (!item.url) {
                return;
            }
            let newTab = {
                url: item.url,
                active: true
            }
            if (type) {
                newTab.active = false;
            }
            chrome.tabs.create(newTab, () => {
                // console.log('1111')
            })
        }
    },
    computed: {
        isFolder: function() {
            let result = false;
            if (this.folders.children && this.folders.children.length > 0) {
                result = true;
            }
            return this.isFolder = result
        }
    }
}
</script>
<style lang="scss" scoped>
ul {
    margin: 0;
    height: 0;
    transition: all 2s;
    &.expend {
        height: 100%;
    }
    li {
        display: block;
        text-align: left;
        line-height: 28px;
        padding-left: 15px;
        overflow: hidden;
        cursor: pointer;
        margin: 1px 0;
        overflow: hidden; // max-height: 28px;
        transition: all 2s;

        .folder-body {
            height: 28px;
            line-height: 28px;
            &:hover {
                background: #e5f0fb;
            }
            &.checked {
                background: #BBD4EF;
            }
        }
        .expend-icon {
            width: 14px;
            height: 14px;
            font-size: 14px;
            margin-right: 5px;
            cursor: pointer;
            display: inline-block;
        }
        .folder-icon {
            color: rgb(255, 185, 39);
            font-size: 14px;
            margin-right: 5px;
            cursor: pointer;
            position: relative;
            img {
                position: absolute;
                top: 2px;
                left: 0px;
            }
        }
        .item-title {
            padding-left: 18px;
            overflow: hidden;
            height: 28px;
            line-height: 28px;
            vertical-align: middle;
        }
    }
}
</style>