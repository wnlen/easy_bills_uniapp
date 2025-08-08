<template>
    <view class="bg-gray vh100 vw100" style="background-color: #f4f4f4">
        <scroll-view scroll-y="true" :scroll-top="scrollTop" style="height: 85vh">
            <view
                class="chatMessage ml30 mt30"
                style="position: relative; height: 10%"
                :style="{
                    height: item.message.length > 20 ? 10 + item.message.length / 5 + '%' : '10%'
                }"
                v-for="(item, index) in messageList"
                :key="index"
            >
                <view class="" v-if="item.formUserId != vuex_user.phone">
                    <view class="" style="position: absolute; left: 0; top: 0">
                        <u-icon :name="item.img" size="80"></u-icon>
                    </view>
                    <view class="mt30" style="font-size: 24rpx; height: 100%; margin-left: 12vw">
                        <view class="">
                            <text>{{ item.name }}</text>
                            <text class="ml10" style="color: #f1bf7b">{{ item.type }}</text>
                        </view>

                        <view
                            class="mt15 pd10 pl10 pr10 pb10 pt10"
                            style="
                                background-color: #ffffff;
                                width: auto;
                                float: left;
                                border-radius: 0rpx 12rpx 12rpx 12rpx;
                                max-width: 50vw;
                                white-space: normal;
                                word-wrap: break-word;
                                font-size: 28rpx;
                            "
                        >
                            {{ item.message }}
                        </view>
                    </view>
                </view>

                <view class="mt45 mr30" v-if="item.formUserId == vuex_user.phone">
                    <view class="" style="position: absolute; right: 20rpx; top: 0">
                        <u-icon :name="item.img" size="80"></u-icon>
                    </view>
                    <view class="" style="font-size: 24rpx; height: 100%; margin-right: 12vw"></view>
                    <view
                        class="pd10 pr10 pb10 pt10 mt40"
                        v-if="item.message.img == undefined"
                        style="
                            background-color: #01bb74;
                            color: white;
                            width: auto;
                            float: right;
                            border-radius: 12rpx 0rpx 12rpx 12rpx;
                            max-width: 50vw;
                            white-space: normal;
                            word-wrap: break-word;
                            margin-right: 12vw;
                            font-size: 28rpx;
                        "
                    >
                        {{ item.message }}
                    </view>
                    <view
                        class="pd10 pr10 pb10 pt10 mt40"
                        v-if="item.message.img"
                        style="
                            background-color: #ffffff;
                            color: white;
                            width: auto;
                            float: right;
                            border-radius: 12rpx 0rpx 12rpx 12rpx;
                            max-width: 50vw;
                            white-space: normal;
                            word-wrap: break-word;
                            margin-right: 12vw;
                            font-size: 28rpx;
                        "
                    >
                        <u-image :src="item.message.img" width="60rpx" height="100rpx"></u-image>
                    </view>
                </view>
            </view>

            <view class="flex-row justify-center items-center" style="width: 100%" v-if="messageList.length > 20">
                <u-icon name="close-circle" label="清空" color="#4c4c4c" size="28" label-siz="20" @click="clearMessage"></u-icon>
            </view>
        </scroll-view>

        <view class="inpMess bg-white vw100 pt25" style="height: 14vh; background-color: #ffffff">
            <view class="flex-row ml20 bg-white" style="width: 95%; height: 40%" v-if="showTag == 1">
                <view class="ml10" v-for="(item, index) in tagList" :key="index" @click="copyIteam(item)">
                    <u-tag :text="item" bg-color="#ffffff" border-color="#ccc" color="#ccc" mode="light" shape="circle" closeable :show="show" @close="tagClick(item)" />
                </view>
            </view>

            <view class="flex-row mt10 mb20 ml20" style="height: 60%">
                <view class="mt10" style="height: 100%; align-items: center">
                    <view class="mic"><u-icon size="50"></u-icon></view>
                </view>
                <view :style="{ width: showFile == 1 ? '70%' : '80%' }">
                    <u-input type="text" placeholde="输入您想咨询的问题" v-model="message" border="bottom"></u-input>
                </view>

                <view class="mt10 ml10" style="height: 100%; align-items: center">
                    <view :style="{ display: showFile == 0 ? 'block' : 'none' }" class="mr10 ml10"><u-icon name="plus-circle" size="50" @click="sendImg"></u-icon></view>

                    <button @click="send" :style="{ display: showFile == 1 ? 'block' : 'none' }" class="fsbtm">发送</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            scrollTop: 0,
            show: true,
            tagList: ['官方联系电话', '如何签收', '物流问题'],
            showFile: 0,
            showTag: 1,
            messageList: [],
            userNmae: uni.getStorageSync('name'),
            socketTask: null,
            // 确保websocket是打开状态
            is_open_socket: false,
            support: {},
            message: '',
            socketOpen: false,
            socketMessage: ''
        };
    },
    onLoad(option) {
        console.log(option);
        var that = this;
        if (option.type == '9') {
            uni.setNavigationBarTitle({
                title: '客服咨询',
                success: function () {
                    that.getKf('/support/get');
                }
            });
        }
    },
    mounted() {
        var that = this;
        setTimeout(function a() {
            that.scrollTop = that.scrollTop + 999999;
        }, 1000);
    },
    onShow(e) {
        var mes = uni.getStorageSync(this.vuex_user.phone);
        if (mes == '') {
            var lt = {
                user: this.vuex_user.phone,
                message: [],
                data: ''
            };
            uni.setStorageSync(this.vuex_user.phone, JSON.stringify(lt));
        } else {
            var mes = uni.getStorageSync(this.vuex_user.phone);
            // console.log("缓存聊天：",mes);
            this.messageList = JSON.parse(mes).message;
        }
    },
    onUnload() {
        uni.closeSocket();
        uni.offSocketMessage();
        uni.offSocketOpen();
        uni.offSocketClose();
        uni.offSocketError();
    },
    methods: {
        sendImg() {
            var that = this;
            uni.chooseImage({
                count: 1, // 默认9，这里选择1张图片
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album'], // 从相册选择
                success: function (res) {
                    // 选择的图片路径列表，tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths;
                    // 假设tempFilePaths[0]是我们要处理的图片路径
                    const imagePath = tempFilePaths[0];
                    const fs = uni.getFileSystemManager();
                    const fileContent = fs.readFileSync(imagePath, 'base64'); // 读取为base64字符串
                    console.log(fileContent);

                    var dx = {
                        formUserId: that.vuex_user.phone,
                        toUserId: that.support.phone,
                        message: JSON.parse(JSON.stringify({ img: imagePath })),
                        img: that.vuex_user.data.headPortrait,
                        name: that.vuex_user.data.name,
                        userData: that.vuex_user.data
                    };
                    that.messageList.push(dx);
                    that.SAVE(dx, 2);
                    uni.sendSocketMessage({
                        data: JSON.stringify({
                            formUserId: that.vuex_user.phone,
                            toUserId: that.support.phone,
                            message: fileContent,
                            img: that.vuex_user.data.headPortrait,
                            name: that.vuex_user.data.name,
                            userData: that.vuex_user.data
                        })
                    });
                }
            });
        },
        clearMessage() {
            var mes = uni.getStorageSync(this.vuex_user.phone);
            var mesjson = JSON.parse(mes);
            mesjson.message = [];
            this.messageList = mesjson.message;
            uni.setStorageSync(this.vuex_user.phone, JSON.stringify(mesjson));
        },
        SAVE(MES, type) {
            var mes = uni.getStorageSync(this.vuex_user.phone);
            if (type == 1) {
                var jsonadd = JSON.parse(mes);
                jsonadd.data = JSON.stringify(MES);
                uni.setStorageSync(this.vuex_user.phone, JSON.stringify(jsonadd));
            } else if (type == 2) {
                var jsonadd = JSON.parse(mes);
                jsonadd.message.push(MES);
                uni.setStorageSync(this.vuex_user.phone, JSON.stringify(jsonadd));
            }
        },
        copyIteam(e) {
            this.message = e;
            this.messageChange('');
        },
        getKf(url) {
            this.$u
                .post('/edo' + url)
                .then((res) => {
                    console.log(res.data.data);
                    this.support = res.data.data;
                    this.connectSocketInit(this.support.phone, res.data.data);
                    this.SAVE(res.data.data, 1);
                })
                .catch((res) => {
                    console.log(res);
                });
        },
        connectSocketInit(support, obj) {
            console.log(support);
            var jsons = JSON.stringify(obj);
            var json = JSON.parse(jsons);
            if (!this.socketOpen && uni.getSocketTask) {
                uni.connectSocket({
                    url: 'wss://wxapi.elist.com.cn/edo/send/' + this.vuex_user.phone, // 你的 WebSocket 服务器地址
                    success: () => {
                        this.socketOpen = true;
                        console.log('WebSocket 连接已打开');
                    },
                    fail: (err) => {
                        console.error('WebSocket 连接失败', err);
                    }
                });

                // 监听消息事件
                uni.onSocketMessage((res) => {
                    console.log('收到服务器内容：' + res.data);
                    // this.socketMessage = res.data;
                    try {
                        try {
                            this.scrollTop = 999999 + 100;
                        } catch (e) {
                            //TODO handle the exception
                            this.scrollTop = 999999;
                        }

                        var mes = JSON.parse(res.data);
                        var dx = {
                            formUserId: support,
                            toUserId: this.vuex_user.phone,
                            message: mes.message,
                            img: this.support.img,
                            name: mes.name,
                            time: this.$u.timeFormat(new Date(), 'yyyy-mm-dd mm:ss')
                        };
                        this.messageList.push(dx);
                        this.SAVE(dx, 2);
                    } catch (e) {
                        //TODO handle the exception
                    }
                });

                var dx = {
                    formUserId: this.vuex_user.phone,
                    toUserId: support,
                    message: '会话连接',
                    img: json.img,
                    type: json.type,
                    name: json.name
                };
                // this.messageList.push(dx)
                // this.SAVE(dx, 2)
                // 监听连接打开事件
                uni.onSocketOpen(() => {
                    console.log('WebSocket 连接已打开');
                    // 可以在这里发送数据给服务器
                    uni.sendSocketMessage({
                        data: JSON.stringify(dx)
                    });
                });

                // 监听连接关闭事件
                uni.onSocketClose(() => {
                    console.log('WebSocket 连接已关闭');
                    this.socketOpen = false;
                    if (!this.is_open_socket) {
                        this.getKf('/support/get');
                    }
                });

                // 监听连接错误事件
                uni.onSocketError((err) => {
                    console.error('WebSocket 连接错误', err);
                });
            }
        },
        tagClick(index) {
            // this.show = false;
            this.tagList = this.tagList.filter((res) => res != index);
        },
        messageChange(event) {
            console.log(event);
            // this.message=event
            if (this.showFile == 0) {
                this.showFile = 1;
            }
        },
        send() {
            try {
                this.scrollTop = 999999 + 100;
            } catch (e) {
                //TODO handle the exception
                this.scrollTop = 999999;
            }

            if (this.showFile == 1) {
                this.showFile = 0;

                var dx = {
                    formUserId: this.vuex_user.phone,
                    toUserId: this.support.phone,
                    message: this.message,
                    img: this.vuex_user.data.headPortrait,
                    name: this.vuex_user.data.name,
                    userData: this.vuex_user.data
                };

                this.messageList.push(dx);
                this.SAVE(dx, 2);
                if (this.socketOpen) {
                    uni.sendSocketMessage({
                        data: JSON.stringify({
                            formUserId: this.vuex_user.phone,
                            toUserId: this.support.phone,
                            message: this.message,
                            img: this.vuex_user.data.headPortrait,
                            name: this.vuex_user.data.name,
                            userData: this.vuex_user.data
                        }),
                        async success() {
                            console.log('消息发送成功');
                            this.message = '';
                            if (this.showFile == 0) {
                                this.showFile = 1;
                            }
                        }
                    });
                } else {
                    console.error('WebSocket 连接未打开');
                }
                this.message = '';
            }
        }
    }
};
</script>

<style>
.inpMess {
    position: fixed;
    bottom: 0;
}

.fsbtm {
    background-color: #01bb74;
    width: 120rpx;
    height: 60rpx;
    border-radius: 370rpx;
    font-size: 24rpx;
    color: white;
}
</style>
