<template>
    <li v-if="!folders.url" @click.stop="toggle(folders)">
        <div class="folder-body" :class="{'checked':isChecked}" v-if="!folders.type">
            <i class="iconfont expend-icon" v-if="!isOpen&&isFolder">&#xe60c;</i>
            <i class="iconfont expend-icon" v-if="isOpen&&isFolder">&#xe6b1;</i>
            <i class=" expend-icon" v-if="!isFolder"></i>
            <span class="iconfont folder-icon">&#xe632;</span>
            <span>{{ folders.title }}</span>
        </div>
        <div v-if="folders.type=='new'">
            <i class=" expend-icon"></i>
            <span class="iconfont folder-icon">&#xe632;</span>
            <input type="text" v-model="folders.title">
            <span class="iconfont cancel-icon" @click.stop="cancel(folders)">&#xe609;</span>
            <span class="iconfont confirm-icon" @click.stop="create(folders)">&#xe6a7;</span>
        </div>
        <ul v-if="folders.children&&isOpen">
            <treeitem v-for="child in folders.children" :folders="child" :key="child.id" :selectedItem.sync="selectedItem" @update:selectedItem="handleUpdate" :isAdding="isAdding" v-on:updateAdding="handleAddUpdate"></treeitem>
        </ul>
    </li>
</template>
<script>
export default {
    name: 'treeitem',
    props: {
        folders: Array,
        selectedItem: Object,
        isAdding: Boolean
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
            this.$emit('update:selectedItem', this.selectedItem);
        },
        handleUpdate(val) {
            this.$emit('update:selectedItem', val)
        },
        cancel(item) {
            let index = this.selectedItem.children.indexOf(item);
            this.selectedItem.children.splice(index, 1);
            this.isAdding = false;
            this.$emit('updateAdding', this.isAdding);
        },
        create(item) {
            let newFolder = {
                title: item.title,
                parentId: item.parentId
            }
            chrome.bookmarks.create(newFolder, (data) => {
                this.cancel(item);
                this.selectedItem.children.push(data);
                this.selectedItem = data;
                this.$emit('update:selectedItem', this.selectedItem);
                // console.log('data= new folder' + JSON.stringify(data))
            })
        },
        handleAddUpdate() {
            // console.log('adding update handle' + this.isAdding);
            this.$emit('updateAdding', this.isAdding);
        }
    },
    computed: {
        isFolder: function() {
            let result = false;
            if (this.folders.children && this.folders.children.length > 0) {
                this.folders.children.forEach((item) => {
                    if (item.dateGroupModified) {
                        result = true;
                    }
                })
            }
            return this.isFolder = result
        },
        isChecked: function() {
            return this.selectedItem.id === this.folders.id ? true : false
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
        line-height: 28px;
        padding-left: 15px;
        overflow: hidden;
        cursor: pointer;
        margin: 1px 0;
        .folder-body {
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
            color: #535558;
            display: inline-block;
        }
        .folder-icon {
            color: rgb(255, 185, 39);
            font-size: 14px;
            margin-right: 5px;
            cursor: pointer;
        }
        .cancel-icon {
            color: red;
            font-size: 18px;
            margin-right: 5px;
            cursor: pointer;
            margin-left: 5px;
            vertical-align: middle;
        }
        .confirm-icon {
            color: green;
            font-size: 16px;
            margin-right: 5px;
            cursor: pointer;
        }
    }
}
</style>