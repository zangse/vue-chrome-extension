<template>
    <div>
        <li>
            <div class="extension-body" :class="{'enable':extendItem.enabled,'disable':!extendItem.enabled}">
                <span class="extension-content" @click.stop="toggle(extendItem)">
                    <span class=" extension-icon">
                    <img :src="showIcon"  v-if="showIcon">
                    <!-- <i class="iconfont" v-if="showIcon">&#xe641;</i> -->
                    </span>
                <span class="item-title">{{ extendItem.name }}</span>
                <span class="version"><i class="iconfont ">&#xe601;</i><span>{{extendItem.version}}</span></span>
                </span>
                <span class="option">
             <!--    <i class="iconfont option-icon permission" @click.stop="showPermission(extendItem)">&#xe6b4;</i> -->
                <i class="iconfont option-icon view" :class="{'disabled':!extendItem.homepageUrl}" @click.stop="openOnNewTab(extendItem.homepageUrl)">&#xe619;</i>
                <i class="iconfont option-icon config " :class="{'disabled':!extendItem.optionsUrl}" @click.stop="openOnNewTab(extendItem.optionsUrl)">&#xe602;</i>
                <i class="iconfont option-icon uninstall" @click.stop="unInstall(extendItem)">&#xe642;</i>
            </span>
            </div>
        </li>
    </div>
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
                console.log('setEnabled')
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
        },
        // showPermission(item) {
        //     if (!item.id) {
        //         return
        //     }
        //     chrome.management.getPermissionWarningsById(item.id, (data) => {
        //         alert(data)
        //     })

        // }
    },
    computed: {
        showIcon: function() {
            let result = '';
            if (this.extendItem.icons && this.extendItem.icons.length > 0) {
                let length = this.extendItem.icons.length;
                result = this.extendItem.icons[length - 1].url;
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
        line-height: 40px;
        height: 40px;
        overflow: hidden;
        cursor: pointer;
        .extension-body {
            height: 28px;
            line-height: 28px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background: #ccc;
            padding: 4px 5px;
            display: flex;
            &.enable {
                background-color: #dff0d8;
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
                border-color: #f58500;
                background: #e5f0fb;
            }

            .extension-content {
                flex: 1;
                .extension-icon {
                    color: rgb(255, 185, 39);
                    width: 24px;
                    height: 28px;
                    line-height: 28px;
                    margin-right: 5px;
                    display: inline-block;
                    img {
                        display: block;
                        margin: 4px auto;
                        width: 20px;
                        height: 20px;
                    }
                }
                .item-title {
                    overflow: hidden;
                    height: 28px;
                    display: inline-block;
                    line-height: 28px;
                    font-size: 14px;
                    margin-right: 3px;
                }
                .version {
                    display: inline-block;
                    font-size: 12px;
                    height: 28px;
                    line-height: 28px;
                    color: #7d7a7a;
                    vertical-align: top;
                    i {
                        font-size: 14px;
                        margin-right: 3px;
                    }
                }
            }
            .option {
                width: 70px;
                .option-icon {
                    width: 20px;
                    height: 20px;
                    padding: 2px;
                    cursor: pointer;
                    color: #333;
                    &.disabled {
                        color: #ccc;
                    }
                    &.view {
                        font-size: 16px;
                    }
                    &.config {
                        font-size: 15px;
                    }
                    &.uninstall {
                        font-size: 18px;
                    }
                }
            }
        }
    }
}
</style>