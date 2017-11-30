<template>
    <div>
        <div class="header">
            <div class="header-default">
                <div class="row-left">
                    <span class="logo"></span>
                </div>
                <div class="row-center">
                    <span class="search-input">
                    <i class="iconfont serach-icon">&#xe60d;</i>
                    <input  class="search" v-model="searchItem" type="text" v-bind:placeholder="i18n.searchPlaceholder" @keyup.enter="searchBookmarks"   v-autofocus="autofocus">
                    <i class="iconfont clear-icon" v-if="searchItem.length>0" @click="cleanSearch">&#xe609;</i></span>
                </div>
                <div class="row-right">
                    <span class="action-icon" @click.stop="toggleMode">
                    <i class="iconfont" v-if="showMode==1">&#xe63c;</i>
                    <i class="iconfont" v-if="showMode==2">&#xe600;</i>
                </span>
                    <span class="action-icon" @click.stop="toggleColor">
                    <i class="iconfont dark" v-if="isColorful">&#xe65e;</i>
                    <i class="iconfont  colorful" v-if="!isColorful"> &#xe638;</i>
                </span>
                </div>
            </div>
            <div class="header-action" :class="{'show':selectedNode.length>=1,'hide':selectedNode.length==0}" v-if="!isHistory">
                <div class="row-left">
                    <span class="sleected-num">{{i18n.selected}}<span class="num">{{selectedNode.length}}</span>{{i18n.unitName}}</span>
                </div>
                <div class="row-center">
                    <span class="action-btn" @click="selectALL()"><i></i>
                    <span >{{i18n.selectALL}}</span>
                    </span>
                    <span class="action-btn" @click="unSelect()"><i></i><span>{{i18n.unSelect}}</span></span>
                    <span class="action-btn" @click="moveTo()"><i></i><span>{{i18n.moveTo}}</span></span>
                </div>
                <div class="row-right">
                    <span class="action-btn" @click="cancelSelected()"><i></i><span>{{i18n.cancel}}</span></span>
                    <span class="action-btn" @click="openSelected()"><i></i><span>{{i18n.open}}</span></span>
                    <span class="action-btn" @click="removeSelected()"><i></i><span>{{i18n.delete}}</span></span>
                </div>
            </div>
        </div>
        <model class="model" v-model="showModel" @updateShow="onCloseHandler" @updateMove="onMoveHandler" :selectedItem.sync="selectedItem"></model>
        <confirm v-model="showConfirm" :confirmMsg="confirmMsg" @on-confirm="onConfirmHandler"></confirm>
    </div>
</template>
<script>
import model from '../common/model.vue'
import confirm from '../common/confirm.vue'
export default {
    name: 'bookheader',
    data() {
        return {
            searchItem: '',
            showModel: false,
            selectedItem: {},
            showConfirm: false,
            confirmMsg: {},
            i18n: {
                searchPlaceholder: '',
                selected: '',
                unitName: '',
                selectALL: '',
                unSelect: '',
                moveTo: '',
                cancel: '',
                open: '',
                delete: '',
                operateSuccess: '',
                operateCancel: '',
                deleteSuccess: '',
                wraningFiveWindows: '',
                deleteConfirm: ''
            }
        }
    },
    components: {
        model,
        confirm
    },
    directives: {
        autofocus: {
            inserted: function(el) {
                el.focus();
            },
            update: function(el) {
                el.focus();
            }
        }
    },
    props: {
        allNodes: Array,
        selectedNode: Array,
        isSearching: Boolean,
        isColorful: Boolean,
        showMode: Number,
        isHistory: Boolean,
        autofocus: Boolean
    },
    created() {
        this.i18n.searchPlaceholder = chrome.i18n.getMessage("searchPlaceholder");
        this.i18n.selected = chrome.i18n.getMessage("selected");
        this.i18n.unitName = chrome.i18n.getMessage("unitName");
        this.i18n.selectALL = chrome.i18n.getMessage("selectALL");
        this.i18n.unSelect = chrome.i18n.getMessage("unSelect");
        this.i18n.moveTo = chrome.i18n.getMessage("moveTo");
        this.i18n.cancel = chrome.i18n.getMessage("cancel");
        this.i18n.open = chrome.i18n.getMessage("open");
        this.i18n.delete = chrome.i18n.getMessage("delete");
        this.i18n.operateSuccess = chrome.i18n.getMessage("operateSuccess");
        this.i18n.operateCancel = chrome.i18n.getMessage("operateCancel");
        this.i18n.deleteSuccess = chrome.i18n.getMessage("deleteSuccess");
        this.i18n.wraningFiveWindows = chrome.i18n.getMessage("wraningFiveWindows");
        this.i18n.deleteConfirm = chrome.i18n.getMessage("deleteConfirm");
    },
    methods: {
        selectALL() {
            if (this.selectedNode.length == this.allNodes.length) {
                return;
            }
            let index;
            this.allNodes.forEach((item) => {
                index = this.selectedNode.indexOf(item.id);
                if (index == -1) {
                    this.selectedNode.push(item.id);
                }
            })
        },
        unSelect() {
            let index;
            this.allNodes.forEach((item) => {
                index = this.selectedNode.indexOf(item.id);
                if (index > -1) {
                    this.selectedNode.splice(index, 1);
                } else if (index == -1) {
                    this.selectedNode.push(item.id);
                }
            })
        },
        moveTo() {
            this.showModel = true;
        },
        onCloseHandler() {
            this.showModel = false;
        },
        onMoveHandler() {
            this.showModel = false;
            let folder = {
                parentId: this.selectedItem.id
            }
            this.selectedNode.forEach((item) => {
                chrome.bookmarks.move(item, folder, null)
            })
            this.selectedNode = [];
            const data = {
                type: 'success',
                text: this.i18n.operateSuccess
            }
            this.$emit('toast-show', data);
            this.$emit('reloadCurrent');
        },
        cancelSelected() {
            this.selectedNode = [];
            const data = {
                type: 'cancel',
                text: this.i18n.operateCancel
            }
            this.$emit('toast-show', data);
            this.$emit('cancelSelected');
        },
        openSelected() {
            chrome.bookmarks.get(this.selectedNode, (nodes) => {
                if (nodes.length > 5) {
                    const data = {
                        type: 'wraning',
                        text: this.i18n.wraningFiveWindows,
                        padding: '4px'
                    }
                    return this.$emit('toast-show', data);
                }
                nodes.forEach((item) => {
                    this.openOnNewTab(item);
                })
            })
        },
        removeSelected() {
            this.confirmMsg.text = this.i18n.deleteConfirm;
            this.showConfirm = true;
        },
        searchBookmarks() {
            if (this.searchItem == '') {
                return;
            }
            this.isSearching = true;
            if (!this.isHistory) {
                chrome.bookmarks.search(this.searchItem, (data) => {
                    this.allNodes = data;
                    // this.isSearching = false;
                    this.$emit('isSearching', this.allNodes);
                })
            } else {
                chrome.history.search({ text: this.searchItem }, (data) => {
                    data.sort(this.sortRule);
                    // this.isSearching = false;
                    this.allNodes = data;
                    this.$emit('isSearching', this.allNodes);
                })
            }

        },
        sortRule(a, b) {
            return b.visitCount - a.visitCount
        },
        cleanSearch() {
            this.searchItem = '';
            this.$emit('cleanSearch');
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

            })
        },
        toggleMode() {
            this.$emit('toggleMode');
        },
        toggleColor() {
            this.$emit('toggleColor');
        },
        onConfirmHandler(data) {
            this.showConfirm = false;
            if (data == 1) {
                this.cancelSelected();
            } else if (data == 2) {
                chrome.bookmarks.get(this.selectedNode, (nodes) => {
                    nodes.forEach((item) => {
                        item.url ? chrome.bookmarks.remove(item.id, null) : chrome.bookmarks.removeTree(item.id, null);
                    })
                    const data = {
                        type: 'success',
                        text: this.i18n.operateSuccess
                    }
                    this.$emit('toast-show', data);
                    this.$emit('reloadCurrent');
                })
            }
        }
    },
    watch: {
        searchItem: function(newVal) {
            if (newVal.length == 0) {
                console.log(newVal)
                this.cleanSearch();
            } else {
                this.searchBookmarks();
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import "assets/style/mixin.scss";
.header {
    position: fixed;
    top: 0;
    box-sizing: border-box;
    width: 100%;
    height: 54px;
    line-height: 54px;
    color: #fff;
    background-color: #4285f4;
    z-index: 200;
    text-align: left;
    box-shadow: 0 0 4px rgba(0, 0, 0, .14), 2px 4px 8px rgba(0, 0, 0, .28);
    .header-action {
        display: flex;
        height: 54px;
        width: 100%;
        background-color: #4d90fe;
        @include transition( all .5s ease);
        font-size: 16px;
        color: #fff;
        &.show {
            -webkit-transform: translateY(-54px);
            z-index: 201;
            opacity: 1;
        }
        &.hide {
            -webkit-transform: translateY(-108px);
            z-index: 0;
            opacity: 0;
        }
        .row-left {
            width: 200px;
            text-align: center;
            font-weight: bold;
            .num {
                padding: 0 3px;
            }
        }
        .row-center {
            flex: 1;
            text-align: left;
        }
        .row-right {
            width: 300px;
            text-align: left;
        }
        .action-btn {
            cursor: pointer;
            display: inline-block;
            padding: 0 15px;
            background: #4250dc;
            margin: 10px 0;
            height: 34px;
            line-height: 34px;
            border-radius: 5px;
            font-weight: 500;
        }
    }
    .header-default {
        display: flex;
        height: 54px;
        width: 100%;
        background-color: #70c3ff;
        z-index: 200;
        font-size: 16px;
        color: #fff;
        .row-left {
            width: 200px;
            text-align: center;
            font-weight: bold;
            background: #fff;
            border-bottom: 1px solid #f7f2f2;
            .logo {
                display: block;
                width: 200px;
                height: 54px;
                background-image: url('../../../assets/images/logo.png');
                background-repeat: no-repeat;
            }
        }
        .row-center {
            padding-left: 15px;
            flex: 1;
            text-align: left;
            .search-input {
                position: relative;
                .search {
                    height: 24px;
                    line-height: 24px;
                    width: 350px;
                    border: none;
                    outline: none;
                    padding: 3px 20px;
                }
                .serach-icon {
                    position: absolute;
                    left: 0;
                    color: #333;
                    padding-left: 3px;
                }
                .clear-icon {
                    position: absolute;
                    right: 0;
                    color: #333;
                    padding-right: 3px;
                    cursor: pointer;
                }
            }
        }
        .row-right {
            width: 300px;
            text-align: left;
            .action-icon {
                cursor: pointer;
                display: inline-block;
                padding: 0 15px;
                margin: 10px 0;
                height: 34px;
                line-height: 34px;
                font-weight: 500;
                .colorful {
                    color: #d05f5f;
                }
                .dark {
                    color: #333;
                }
            }
        }
        .action-btn {
            cursor: pointer;
            display: inline-block;
            padding: 0 15px;
            background: #4250dc;
            margin: 10px 0;
            height: 34px;
            line-height: 34px;
            border-radius: 5px;
            font-weight: 500;
        }
    }
}
</style>