<template>
    <li class="extension-item" :class="{'enable':extendItem.enabled,'disable':!extendItem.enabled}">
        <div class="extension-content" @click.stop="toggle(extendItem)">
            <span class=" extension-icon">
                    <img :src="showIcon"  v-if="showIcon">
                    </span>
            <div class="extension-body">
                <p class="item-title">{{ extendItem.name }}</p>
                <p class="version">
                    <i class="iconfont ">&#xe601;</i><span>{{extendItem.version}}</span>
                </p>
            </div>
            <span class="option">
                <i class="iconfont option-icon view" :class="{'disabled':!extendItem.homepageUrl}" @click.stop="openOnNewTab(extendItem.homepageUrl)">&#xe619;</i>
                <i class="iconfont option-icon config " :class="{'disabled':!extendItem.optionsUrl}" @click.stop="openOnNewTab(extendItem.optionsUrl)">&#xe602;</i>
                <i class="iconfont option-icon uninstall" @click.stop="unInstall(extendItem)">&#xe642;</i>
            </span>
        </div>
    </li>
</template>
<script>
export default {
    name: 'treeitem',
    props: {
        extendItem: Array
    },
    data() {},
    methods: {
        toggle(item) {
            item.enabled = !item.enabled;
            chrome.management.setEnabled(item.id, item.enabled, (data) => {
                this.$emit('setEnabled');
            })
        },
        openOnNewTab(url) {
            if (!url) {
                return;
            }
            let newTab = {
                url: url,
                active: true
            }
            chrome.tabs.create(newTab, () => {})
        },
        unInstall(item) {
            chrome.management.uninstall(item.id, { showConfirmDialog: true }, () => {

            })
        }
    },
    computed: {
        showIcon: function() {
            let result = '';
            if (this.extendItem.icons && this.extendItem.icons.length > 0) {
                let length = this.extendItem.icons.length;
                result = this.extendItem.icons[length - 1].url;
            }
            console.log(result)
            return result
        }
    }
}
</script>
<style lang="scss" scoped>
.extension-item {
    display: block;
    text-align: left;
    overflow: hidden;
    cursor: pointer;
    border-radius: 6px;
    background: #ccc;
    padding: 6px;
    margin: 12px 15px;
    box-sizing: border-box;
    box-shadow: 2px 2px 8px #3b3a49;
    &.enable {
        background-color: #fff;
        border-color: #d6e9c6;
        .extension-content {
            .item-title {
                color: #3c763d;
            }
        }
    }
    &.disable {
        background-color: #EAE8E8;
        border-color: #D2D2D2;
        .extension-content {
            .item-title {
                color: #949494;
            }
        }
    }
    &:hover {
        background: #e5f0fb;
    }
    .extension-content {
        display: flex;
        height: 48px;
        .extension-icon {
            width: 40px;
            height: 40px;
            margin: 4px;
            display: inline-block;
            border-radius: 50%;
            background: #f5f5f5;
            img {
                display: block;
                margin: 4px auto;
                width: 32px;
                height: 32px;
            }
        }
        .extension-body {
            flex: 1;
            padding-left: 8px;
            .item-title {
                overflow: hidden;
                height: 24px;
                display: block;
                line-height: 24px;
                font-size: 14px;
                margin-right: 3px;
                color: #3b3a49;
                margin: 0;
            }
            .version {
                display: block;
                font-size: 12px;
                height: 24px;
                line-height: 24px;
                color: #949494;
                vertical-align: top;
                margin: 0;
                i {
                    font-size: 14px;
                    margin-right: 3px;
                }
            }
        }

        .option {
            line-height: 48px;
            .option-icon {
                margin: 2px 3px;
                cursor: pointer;
                color: #555;
                font-weight: 500;
                display: inline-block;
                vertical-align: top;
                &.disabled {
                    color: #c3c3c3;
                    font-weight: 400;
                }
                &.view {
                    font-size: 19px;
                }
                &.config {
                    font-size: 17px;
                }
                &.uninstall {
                    font-size: 23px;
                }
            }
        }
    }
}
</style>