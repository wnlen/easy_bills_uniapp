<template>
    <view class="">
        <view class="FilePdf" v-for="(item, index) in fileList" :key="index">
            <view class="typeIcon" @click="LookFile(item)">
                <u-icon :name="ImgUrl + fileIcon[item.type]" size="65rpx"></u-icon>
            </view>
            <view class="FileDetailed" @click="LookFile(item)">
                <view class="name ml24">
                    {{ sliceLen(item.name) }}
                </view>
                <view class="FileSize ml24">{{ (item.size / 1024).toFixed(1) }}kb</view>
            </view>
            <view class="delIcon" @click="delFile(index, item)" v-if="delShow">
                <u-icon name="trash" color="#A8A8A8" size="30rpx"></u-icon>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        fileList: {
            type: Array,
            default: []
        },
        type: {
            type: Number,
            default: 0
        },
        delShow: {
            type: Boolean,
            default: true
        }
    },
    name: 'pop-file',
    data() {
        return {
            fileIcon: ['/wxImg/icon/file/pdf.svg', '/wxImg/icon/file/word.svg', '/wxImg/icon/file/excel.svg', '/wxImg/icon/file/img.svg']
        };
    },
    methods: {
        sliceLen(name) {
            var str = String(name);
            return str.length > 20 ? '...' + str.slice(-20) : str;
        },
        LookFile(file) {
            var path = file.path;
            var type = file.type;
            var name = file.name;
            var http = file.http;
            console.log(file);
            if (http) {
                uni.downloadFile({
                    url: path, // 下载资源的 url
                    success: (res) => {
                        if (res.statusCode === 200) {
                            // 下载成功，res.tempFilePath 是文件的本地临时路径
                            console.log('下载成功:', res.tempFilePath);

                            if (type != 3) {
                                uni.openDocument({
                                    filePath: res.tempFilePath,
                                    // fileType: type == 0 ? 'pdf' : type == 1 ? 'doc' : type == 2 ?
                                    // 	'xlsx' : '',
                                    fileType: this.getUrlExtension(res.tempFilePath),
                                    success: function (res) {
                                        console.log('打开文档成功');
                                    },
                                    fail: function (err) {
                                        console.log('打开文档失败', err);
                                    }
                                });
                            } else {
                                uni.previewImage({
                                    current: res.tempFilePath,
                                    urls: [res.tempFilePath]
                                });
                            }
                        }
                    }
                });
            } else {
                if (type != 3) {
                    uni.openDocument({
                        filePath: path,
                        // fileType: type == 0 ? 'pdf' : type == 1 ? 'doc' : type == 2 ? 'xlsx' : '',
                        fileType: name.split('.')[1],
                        success: function (res) {
                            console.log('打开文档成功');
                        },
                        fail: function (err) {
                            console.log('打开文档失败', err);
                        }
                    });
                } else {
                    uni.previewImage({
                        urls: [path]
                    });
                    // uni.navigateTo({
                    // 	url: "/pages/subStatistics/receipt/preview?path=" + path
                    // })
                }
            }
        },
        getUrlExtension(url) {
            const extension = url.split('.')[1];
            return extension;
        },
        delFile(index, item) {
            if (item.id != undefined && item.id != null) {
                this.$parent.delFileList.push(item.id);
            }
            var that = this;
            uni.showModal({
                title: '提示',
                content: '是否确认删除该附件？',
                success: function (res) {
                    if (res.confirm) {
                        that.$parent.fileList.splice(index, 1);
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                }
            });
        }
    }
};
</script>

<style scoped lang="scss">
.FilePdf {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    height: 60px;

    margin-top: 24rpx;
    background: #f4f4f4;

    border-radius: 6px;

    // padding: 30rpx;
    padding: 24rpx;

    position: relative;

    .typeIcon {
        height: 100%;
        width: 10%;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .delIcon {
        height: 100%;
        width: 10%;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .FileDetailed {
        height: 100%;
        width: 80%;
        background-color: transparent;

        display: flex;
        flex-direction: column;
        justify-content: left;
        align-items: left;
    }
}
</style>
