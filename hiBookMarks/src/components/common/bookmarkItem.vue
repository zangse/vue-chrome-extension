<template>
    <li class="item-wrapper " :class="{'wra-col-5':showMode==2,'no-color':!isColorful}">
        <div class="item" :class="{'folder-item':!bookmarkitem.url}">
            <div class="mask" :class="{'checked':isSelected(bookmarkitem)}" v-if="!isHistory">
            </div>
            <span class="check-icon iconfont" :class="{'folder':!bookmarkitem.url}" @click.stop="checkItem(bookmarkitem)" v-if="!isSelected(bookmarkitem)&&!isHistory">&#xe637;</span>
            <span class="icon-checked iconfont" @click.stop="checkItem(bookmarkitem)" v-if="isSelected(bookmarkitem)&&!isHistory">&#xe614;</span>
            <span class="visited-count" v-if="isHistory">{{bookmarkitem.visitCount}}</span>
            <i class="item-light"></i>
            <div class="item-content">
                <div class="item-body">
                    <div class="folder iconfont" v-if="!bookmarkitem.url"> &#xe632;</div>
                    <div class="link" v-if="bookmarkitem.url">
                        <span class="icon-wrapper">
                                    <img :src="'chrome://favicon/' + bookmarkitem.url" class="icon-item">
                                </span>
                    </div>
                </div>
                <div class="item-footer">
                    <span v-if="!bookmarkitem.url" class="title" :title="bookmarkitem.tiutle">
                      {{bookmarkitem.title}}
                    </span>
                    <a v-if="bookmarkitem.url" class="title" :title="bookmarkitem.url">
                      <span v-if="bookmarkitem.title">{{bookmarkitem.title }}</span>
                    <span v-if="!bookmarkitem.title">{{bookmarkitem.url }}</span></a>
                </div>
            </div>
        </div>
    </li>
</template>
<script>
export default {
    name: 'bookmarkItem',
    data() {
        return {}
    },
    props: {
        bookmarkitem: Object,
        selectedNode: Array,
        showMode: Number,
        isColorful: Boolean,
        isHistory: Boolean
    },
    methods: {
        checkItem(item) {
            let index = this.selectedNode.indexOf(item.id)
            if (index >= 0) {
                this.selectedNode.splice(index, 1);
            } else if (index == -1) {
                this.selectedNode.push(item.id)
            }
            this.$emit('updateSelected', this.selectedNode);
        },
        isSelected(item) {
            return this.selectedNode.indexOf(item.id) == -1 ? false : true;
        }
    }
}
</script>
<style lang="scss" scoped>
@import "assets/style/mixin.scss";
.item-wrapper {
    padding: 8px;
    box-sizing: border-box;
    .item {
        position: relative;
        cursor: pointer;
        height: auto;
        overflow: hidden;
        border: none;
        border-radius: 5px;
        z-index: 1;
        transition: all 0.3s ease;
        padding: 8px;
        .item-light {
            cursor: pointer;
            position: absolute;
            left: -100%;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: -webkit-linear-gradient(0deg, hsla(0, 0%, 100%, 0), hsla(0, 0%, 100%, .5), hsla(0, 0%, 100%, 0));
            @include transform(skewx(-25deg));
        }
        &:hover {
            border-color: #5bc2e4;
            // @include transform( translateY(-6px));
            @include box-shadow(0 26px 40px -24px rgba(0, 36, 100, .5));
            .item-light {
                @include transition( all .3s ease);
                left: 100%
            }
            .check-icon {
                display: block;
            }
        }
        .item-content {
            width: 100px;
            text-align: center;
            z-index: 1;
            .item-body {
                width: 50px;
                height: 50px;
                margin: auto;
                .folder {
                    margin: auto;
                    text-align: center;
                    color: rgb(255, 185, 39);
                    font-size: 40px;
                }
                .link {
                    margin: auto;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    position: relative;
                    .icon-wrapper {
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
            }
            .item-footer {
                padding-top: 10px;
                text-align: center;
                height: 40px;
                line-height: 20px;
                overflow: hidden;
                border-top: 1px dashed #fff;
                .title {
                    color: #fff;
                    text-decoration: none !important;
                    font-size: 14px;
                    font-weight: 400;
                    &:hover {
                        color: #00a8ff;
                    }
                }
            }
        }
        .mask {
            position: absolute;
            width: 100%;
            height: 58px;
            border-radius: 5px;
            top: 0;
            right: 0;
            z-index: 0; // transition: all 0.5s;
            &.checked {
                height: 100%;
                z-index: 99;
                background-color: rgba(77, 144, 254, 0.38);
            }
        }
        .check-icon {
            display: none;
            font-size: 20px;
            position: absolute;
            top: 3px;
            right: 5px;
            z-index: 100;
            color: #fff;
            &.folder {
                color: #333;
            }
        }
        .visited-count {
            position: absolute;
            top: 3px;
            right: 5px;
            color: #fff;
        }
        .icon-checked {
            display: block;
            position: absolute;
            top: 3px;
            right: 5px;
            font-size: 20px;
            z-index: 100;
            color: #fff;
        }
        &.folder-item {
            background: #fff !important;
            .item-content {
                .item-body {
                    .folder {
                        width: 50px;
                        height: 50px;
                    }
                }
            }
            .item-footer {
                .title {
                    color: #333 !important;
                }
            }
        }
    }
    &:nth-child(7n+1) .item {
        background: #70c3ff;
    }
    &:nth-child(7n+2) .item {
        background: #15d8ad;
    }
    &:nth-child(7n+3) .item {
        background: #b8bdf1;
    }
    &:nth-child(7n+4) .item {
        background: #f9bc80;
    }
    &:nth-child(7n+5) .item {
        background: #ef9e9e;
    }
    &:nth-child(7n+6) .item {
        background: #d05f5f;
    }
    &:nth-child(7n+7) .item {
        background: #f9bc80;
    }
    &.wra-col-5 {
        width: 20%;
        &:nth-child(7n+1) .item {
            border-left-color: #70c3ff;
        }
        &:nth-child(7n+2) .item {
            border-left-color: #15d8ad;
        }
        &:nth-child(7n+3) .item {
            border-left-color: #b8bdf1;
        }
        &:nth-child(7n+4) .item {
            border-left-color: #f9bc80;
        }
        &:nth-child(7n+5) .item {
            border-left-color: #ef9e9e;
        }
        &:nth-child(7n+6) .item {
            border-left-color: #d05f5f;
        }
        &:nth-child(7n+7) .item {
            border-left-color: #f9bc80;
        }
        .item {
            height: 50px;
            border-left: 4px solid;
            .item-content {
                width: 100%;
                display: flex;
                .item-footer {
                    flex: 1;
                    text-align: left;
                    border: none;
                    height: 40px;
                    padding-top: 8px;
                    border-top: none;
                    border-left: 1px dashed #fff;
                    padding-left: 8px;
                }
            }
            .mask {
                height: 68px;
            }
            &.folder-item {
                .item-content {
                    .item-body {
                        .folder {
                            font-size: 36px;
                            margin-top: 5px;
                        }
                    }
                    .item-footer {
                        line-height: 40px;
                    }
                }
            }
        }
    }
    &.no-color {
        .item {
            background: #fff !important;
            border-radius: 0;
            .icon-checked {
                color: #70c3ff;
            }
            .check-icon {
                color: #ccc;
            }
            .visited-count {
                color: #333;
            }
            .item-content {
                .item-body {
                    width: 50px;
                    height: 50px;
                    margin: auto;
                    .link {
                        width: 50px;
                        height: 50px;
                        .icon-wrapper {
                            width: 50px;
                            height: 50px;
                            margin-top: -25px;
                            margin-left: -25px;
                            border: 1px dashed #cec4c4;
                            padding: 17px;
                        }
                    }
                }
                .item-footer {
                    border-top: none;
                    .title {
                        color: #757575;
                    }
                }
            }
        }
        &.wra-col-5 {
            &:nth-child(7n+1) .item {
                border-left-color: #70c3ff;
            }
            &:nth-child(7n+2) .item {
                border-left-color: #15d8ad;
            }
            &:nth-child(7n+3) .item {
                border-left-color: #b8bdf1;
            }
            &:nth-child(7n+4) .item {
                border-left-color: #f9bc80;
            }
            &:nth-child(7n+5) .item {
                border-left-color: #ef9e9e;
            }
            &:nth-child(7n+6) .item {
                border-left-color: #d05f5f;
            }
            &:nth-child(7n+7) .item {
                border-left-color: #f9bc80;
            }
            .item {
                &:hover {
                    border-top: none;
                    border-right: none;
                    border-bottom: none;
                }
                .item-content {
                    .item-body {
                        .link {
                            .icon-wrapper {
                                top: 0;
                                left: 0;
                                margin-top: 0;
                                margin-left: 0;
                            }
                        }
                    }
                }
                &.folder-item {
                    .item-content {
                        .item-body {
                            .folder {
                                width: 40px;
                                font-size: 36px;
                                margin-top: 5px;
                            }
                        }
                        .item-footer {
                            line-height: 40px;
                        }
                    }
                }
            }
        }
    }
}
</style>