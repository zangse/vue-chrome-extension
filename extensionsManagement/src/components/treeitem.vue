<template>
    <div>
        <li @click.stop="openOnNewTab(folders)">
            <div class="extension-body">
                <span class=" extension-icon"><img :src="showIcon" alt=""></span>
                <span class="item-title">{{ folders.name }}</span>
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
        toggle(item) {
            this.isOpen = !this.isOpen;
            this.selectedItem = item;
            console.log('toggle item' + JSON.stringify(this.selectedItem))
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
    },
    computed: {
        showIcon: function() {
            let result = '';
            if (this.folders.icons && this.folders.icons.length > 0) {
                let length = this.folders.icons.length;
                result = this.folders.icons[length - 1].url;
            }
            return result
        }
    }
}
</script>
<style lang="scss" scoped>
ul {
    margin: 0;
    li {
        display: block;
        text-align: left;
        line-height: 32px;
        padding-left: 15px;
        overflow: hidden;
        cursor: pointer;
        margin: 1px 0;
        overflow: hidden;
        .extension-body {
            &:hover {
                background: #e5f0fb;
            }
            &.checked {
                background: #BBD4EF;
            }
        }
        .extension-icon {
            color: rgb(255, 185, 39);
            font-size: 14px;
            margin-right: 5px;
            cursor: pointer;
            position: relative;
            img {
                position: absolute;
                top: 2px;
                left: 0px;
                width: 24px;
                height: 24px;
            }
        }
        .item-title {
            padding-left: 28px;
            max-width: 300px;
            overflow: hidden;
            height: 32px;
            display: inline-block;
            line-height: 32px;
            vertical-align: middle;
        }
    }
}
</style>