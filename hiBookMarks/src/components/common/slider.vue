<template>
    <ul class="slider-warpper" :class="{'show':selectedNode.length==1,'hide':selectedNode.length!==1}">
        <li class="item"><span class="title">{{i18n.bookmarksEdit}}</span></li>
        <li class="item">
            <div class="icon-wrapper">
                <span class="icon-content">
             <img :src="nodeIcon" class="icon-item">
             </span>
            </div>
        </li>
        <li class="item  input-group">
            <span class="input-label">{{i18n.title}}:</span>
            <input type="text" class="input-edit " v-model="currentNode.title">
        </li>
        <li class="item input-group" v-if="!currentNode.dateGroupModified">
            <span class="input-label">{{i18n.url}}:</span>
            <input type="text" class="input-edit " v-model="currentNode.url">
        </li>
        <li class="item">
            <span class="btn cancel" @click="cancel">{{i18n.cancel}}</span>
            <span class="btn save" @click="save">{{i18n.save}}</span>
        </li>
    </ul>
</template>
<script>
export default {
    name: 'slider',
    data() {
        return {
            isShow: false,
            currentNode: {},
            nodeIcon: '',
            i18n: {
                bookmarksEdit: '',
                title: '',
                url: '',
                cancel: '',
                save: '',
                editCancel: '',
                editSuccess: ''
            }
        }
    },
    props: {
        isShow: Boolean,
        selectedNode: Array
    },
    watch: {
        selectedNode: function(newVal) {
            if (newVal.length == 1) {
                this.loadCurrent(newVal);
            }
        }
    },
    created() {
        this.i18n.bookmarksEdit = chrome.i18n.getMessage("bookmarksEdit");
        this.i18n.title = chrome.i18n.getMessage("title");
        this.i18n.url = chrome.i18n.getMessage("url");
        this.i18n.cancel = chrome.i18n.getMessage("cancel");
        this.i18n.save = chrome.i18n.getMessage("save");
        this.i18n.editCancel = chrome.i18n.getMessage("editCancel");
        this.i18n.editSuccess = chrome.i18n.getMessage("editSuccess");
    },
    methods: {
        loadCurrent(data) {
            chrome.bookmarks.get(data, (res) => {
                if (res && res.length >= 1) {
                    this.currentNode = res[0];
                    console.log(this.currentNode)
                    this.nodeIcon = `chrome://favicon/${this.currentNode.url}`
                }
            })
        },
        cancel() {
            this.selectedNode.length = 0;
            this.$emit('editNode');
            const data = {
                type: 'cancel',
                text: this.i18n.editCancel
            }
            this.$emit('toast-show', data);
        },
        save() {
            let node = {
                url: this.currentNode.url,
                title: this.currentNode.title
            }
            chrome.bookmarks.update(this.currentNode.id, node, (res) => {
                console.log(res)
                const data = {
                    type: 'success',
                    text: this.i18n.editSuccess
                }
                this.$emit('editNode');
                this.$emit('toast-show', data);
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import "assets/style/mixin.scss";
.slider-warpper {
    width: 200px;
    height: 100%;
    background: #f5f5f5;
    position: fixed;
    left: 0;
    top: 54px;
    padding: 0 3px;
    margin: 0;
    box-sizing: border-box;
    overflow: hidden;
    @include transition( all .5s ease);
    &.show {
        -webkit-transform: translateX(0px);
        z-index: 201;
        opacity: 1;
    }
    &.hide {
        -webkit-transform: translateX(-200px);
        z-index: 0;
        opacity: 0;
    }
    .item {
        display: block;
        margin: 10px 0;
        .title {
            font-size: 18px;
        }
        .icon-wrapper {
            position: relative;
            margin: 10px auto;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 1px dashed #ccc;
            .icon-content {
                width: 32px;
                height: 32px;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -16px;
                margin-left: -16px;
                background: #fff;
                border-radius: 50%;
                box-sizing: border-box;
                padding: 8px;
                .icon-item {
                    width: 16px;
                    height: 16px;
                }
            }
        }
        &.input-group {
            display: flex;
            .input-label {
                width: 30px;
                display: inline-block;
                height: 28px;
                line-height: 28px;
            }
            .input-edit {
                flex: 1;
                width: 100%;
                display: inline-block;
                height: 28px;
                line-height: 28px;
                border: none;
                outline: none;
                background: #fff;
                padding: 4px;
                box-sizing: border-box;
            }
        }
        .btn {
            cursor: pointer;
            display: inline-block;
            padding: 0 8px;
            height: 28px;
            line-height: 28px;
            border-radius: 4px;
            font-weight: 500;
            color: #fff;
            &.cancel {
                background: #c8c8ca;
            }
            &.save {
                background: #409eff;
            }
        }
    }
}
</style>