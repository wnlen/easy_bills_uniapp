<template>
    <view class="pt60">
        <view class="flex-row justify-center pt30 mb20 avatar-area">
            <button @chooseavatar="onChooseAvatar" open-type="chooseAvatar" type="default" mode="circle">
                <view class="relative" style="">
                    <u-avatar :level-icon="camera" size="150" :src="userInfo.avatarUrl"></u-avatar>
                    <!-- camera -->
                    <view
                        class="absolute flex-col justify-center items-center"
                        style="border-radius: 50%; width: 60rpx; height: 60rpx; background-color: #f4f4f4; z-index: 9999; right: 0; bottom: 20rpx"
                    >
                        <u-icon name="camera" color="#333333" size="30rpx"></u-icon>
                    </view>
                </view>
            </button>
        </view>
        <!-- <view class="box ml48 mr48 pd30 bg-white"> -->
        <view class="ml32 mr32 bg-white">
            <view class="flex-row pb35 u-border-bottom items-center justify-between" @click="userInfoNickNameFocus = true">
                <text class="ft-gray">姓名</text>
                <view class="flex-row justify-end items-center flex-1">
                    <!-- <input v-model="userInfo.nickName" type="nickname" maxlength="20" class="text-right ft29 mr3"
						placeholder="获取姓名" @blur="onNickname" /> -->
                    <input
                        :focus="userInfoNickNameFocus"
                        v-model="userInfo.nickName"
                        type="text"
                        maxlength="20"
                        class="text-right ft29 mr3"
                        placeholder="获取姓名"
                        @blur="onNickname"
                    />
                    <u-icon name="arrow-right" color="#ccc" @click="userInfoNickNameFocus = true"></u-icon>
                </view>
            </view>
            <view class="flex-row pt35 pb35 u-border-bottom items-center justify-between">
                <text class="ft-gray">账号</text>
                <view class="flex-row justify-end items-center flex-1">
                    <text>{{ vuex_user.phone }}</text>
                </view>
            </view>
            <view class="flex-row pt35 pb35 items-center justify-between u-border-bottom">
                <text class="ft-gray">性别</text>
                <view class="flex-row justify-end items-center flex-1">
                    <picker @change="bindPickerChange" :value="Number(vuex_user.data.gender)" :range="array">
                        <text>{{ array[gender] || '请选择' }}</text>
                        <view class="ml3">
                            <u-icon name="arrow-right" color="#ccc"></u-icon>
                        </view>
                    </picker>
                </view>
            </view>
            <view class="flex-row pt35 pb35 items-center u-border-bottom justify-between">
                <text class="ft-gray">状态</text>
                <view class="flex-row justify-end items-center flex-1" @click="jump">
                    <u-tag v-if="ac ? ac.id != undefined : false" text="已完善" mode="plain" type="success" />
                    <u-tag v-if="ac ? ac.id == undefined : true" text="未完善" mode="plain" type="error" />
                </view>
            </view>
            <view class="flex-row pt35 pb35 u-border-bottom items-center justify-between">
                <text class="ft-gray">注册时间</text>
                <view class="flex-row justify-end items-center flex-1">
                    <text>{{ $u.timeFormat(new Date(time).getTime(), 'yyyy-mm-dd') }}</text>
                </view>
            </view>
        </view>
        <view class="flex-col pl60 pr60 pb60 pt60 vw100" style="position: fixed; bottom: 40rpx; text-align: center">
            <u-button shape="circle" hover-class="none" color="#01BB74" type="primary" @click="updateInfo">保存信息</u-button>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            gender: 0,
            userInfo: {
                nickName: '', //必填
                gender: '', //性别：0-男 1-女
                avatarUrl: ''
            },
            array: ['男', '女'],
            subjectRole: {
                1: '老板',
                2: '财务',
                3: '现场管理',
                4: '合伙人'
            },
            ac: '',
            camera: 'camera',
            time: '',
            userInfoNickNameFocus: false
        };
    },
    onLoad() {
        // this.loadData();
        // this.loadDataFlush();
    },
    onShow() {
        this.userInfo = this.$u.getPinia('user.user.data');
        this.ac = this.userInfo.ac;
        this.time = this.userInfo.registrationDate;
        console.log('uni.$http.config.baseURL', uni.$http.config.baseURL);
    },
    methods: {
        jump() {
            uni.navigateTo({
                url: '/pages/subAuth/auth'
            });
        },
        loadDataFlush() {
            let role = this.vuex_user.data.work == '1' ? 1 : 2;
            console.log(this.vuex_user.data.work);
            var that = this;
            this.$api.user
                .refreshUser({
                    phone: this.vuex_user.phone,
                    role: role
                })
                .then((res) => {
                    let a = that.vuex_user;
                    a.ac = res.data.data.ac;
                    a.data = res.data.data.data;
                    a.workData = res.data.data.workData;
                    that.$u.vuex('vuex_user', a);
                    this.ac = a.ac;
                    if (res.data.data.data.work == '1') {
                        that.$u.vuex('vuex_work', 'Y');
                    } else {
                        that.$u.vuex('vuex_work', 'N');
                    }
                });

            console.log('用户信息实时更新 ', this.vuex_user);
        },
        loadData() {
            var that = this;
            this.userInfo.avatarUrl = this.vuex_user.data.headPortrait;
            let role = this.vuex_work == 'Y' ? 1 : 2;
            this.$api.user
                .refreshUser({
                    phone: this.vuex_user.phone,
                    role: role
                })
                .then((res) => {
                    let a = this.vuex_user;
                    a.data = res.data.data.data;
                    a.workData = res.data.workData;
                    a.ac = res.data.ac;
                    that.$u.vuex('vuex_user', a);
                });
        },
        bindPickerChange(e) {
            this.gender = e.detail.value;
            this.userInfo.gender = parseInt(e.detail.value);
        },
        onChooseAvatar(e) {
            let that = this,
                fileAvatar = e.detail.avatarUrl;

            uni.uploadFile({
                url: uni.$http.config.baseURL + '/edo/user/modifyImage',
                header: {
                    phone: that.vuex_user.phone
                },
                filePath: fileAvatar,
                name: 'imageFile',
                formData: {
                    imageType: '0'
                },
                success: (uploadFileRes) => {
                    console.log('uploadFileResuploadFileRes', uploadFileRes);
                    if (uploadFileRes.statusCode == '200') {
                        that.userInfo.avatarUrl = uploadFileRes.data;
                        var data = {
                            id: that.vuex_user.data.id,
                            headPortrait: that.userInfo.avatarUrl,
                            name: that.userInfo.nickName,
                            work: this.vuex_user.data.work,
                            boss: this.vuex_user.data.work == '0' ? this.vuex_user.phone : this.vuex_user.workData.bossNumber
                        };
                        this.$api.user
                            .updateUserUp(data)
                            .then((res) => {
                                if (res.data.data == 1) {
                                    that.$u.toast('修改成功');
                                }
                            })
                            .catch((res) => {
                                that.$u.toast(res.data.message);
                            });
                    }
                },
                complete: (mess) => {
                    console.log('mess', mess);
                }
            });
        },
        onNickname(e) {
            this.userInfoNickNameFocus = false;
            // this.userInfo.nickName = e.detail.value;
            //console.log("修改", this.userInfo);
        },
        updateInfo() {
            let that = this;
            this.userInfo.nickName = this.userInfo.nickName.trim();
            var ifempty = this.userInfo.nickName != '';
            if (ifempty) {
                //console.log("修改", this.userInfo);
                var send = {
                    id: this.vuex_user.data.id,
                    name: this.userInfo.nickName,
                    gender: this.userInfo.gender,
                    phoneNumber: this.vuex_user.phone,
                    work: this.vuex_user.data.work,
                    boss: this.vuex_user.data.work == '0' ? this.vuex_user.phone : this.vuex_user.workData.bossNumber
                };
                this.$api.user.updateUserUp(send).then((res) => {
                    if (res.data.data == '1') {
                        uni.navigateBack();
                    }
                });
            } else {
                this.$u.toast('请填写昵称~');
            }
        }
    }
};
</script>

<style lang="scss">
.box {
    border: 2rpx solid #f6f6f6;
    box-shadow: 0 6rpx 15rpx rgba(0, 0, 0, 0.05);
    min-height: 100rpx;
    border-radius: 14rpx;
}

.avatar-area button::after {
    border: none;
    background: none;
}

.avatar-area button {
    background-color: transparent !important;
}

.addr-box {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    background: #fcfcfc;
    border: 1rpx solid #f3f1f1;
}
</style>
