<template>
    <view class="" style="width: 100%; height: 100vh; overflow-x: hidden">
        <up-overlay :show="showSF" @click="showSF = false">
            <div
                @tap.stop
                v-if="showSF"
                class="flex-col relative"
                :style="{ height: heig }"
                style="background-color: white; width: 75%; margin-top: 70%; border-radius: 13.74rpx; margin-left: 92rpx"
            >
                <view class="flex-col justify-center items-center" style="font-size: 32rpx; height: 5vh">添加好友</view>

                <view class="flex-row text-center justify-center items-center" style="width: 100%; height: 8vh">
                    <view class="flex-col text-center justify-center items-center" style="color: #999999; font-size: 32rpx">申请添加对方为</view>
                    <view
                        @click="
                            showChecked = showChecked == true ? false : true;
                            !showChecked ? (heig = '20vh') : (heig = '29vh');
                        "
                        class="ml15 flex-col text-center justify-center items-center"
                        style="box-sizing: border-box; border: 1.14rpx solid #999999; border-radius: 13.74rpx; width: 159.16rpx; height: 60.46rpx"
                    >
                        {{ role == 0 ? '客户' : '供应商' }}
                    </view>
                    <view class="ml10">
                        <u-icon v-if="!showChecked" name="arrow-down-fill" color="#000000" size="15rpx"></u-icon>
                        <u-icon v-if="showChecked" name="arrow-up-fill" color="#000000" size="15rpx"></u-icon>
                    </view>
                </view>
                <view v-if="!showChecked" class="u-border-top flex-row" style="width: 100%; height: 7vh" @tap.stop>
                    <view
                        @click="
                            showSF = false;
                            state = 0;
                        "
                        class="onsm u-border-right flex-col text-center justify-center items-cente"
                        style="width: 50%; height: 100%"
                    >
                        取消
                    </view>
                    <view @click="addFriend(sm)" class="oksm flex-col text-center justify-center items-center" style="width: 50%; height: 100%">确认</view>
                </view>

                <view v-if="showChecked" class="u-border-top flex-col justify-center items-center" style="width: 100%; height: 16vh" @tap.stop>
                    <view
                        @click="
                            role = 0;
                            showChecked = false;
                            heig = '20vh';
                        "
                        class="flex-row items-center pl20 relative"
                        style="height: 70rpx; width: 510rpx; border-radius: 6rpx"
                        :style="{
                            backgroundColor: role == 0 ? '#ECFAF4' : '#FBFBFB',
                            color: role == 0 ? '#01BB74' : '#333333'
                        }"
                    >
                        <view>客户</view>
                        <view v-if="role == 0" class="absolute" style="right: 20rpx">
                            <u-icon name="https://res-oss.elist.com.cn/wxImg/code/check.svg" size="28rpx"></u-icon>
                        </view>
                    </view>
                    <view
                        @click="
                            role = 1;
                            showChecked = false;
                            heig = '20vh';
                        "
                        class="flex-row items-center mt10 pl20 relative"
                        style="height: 70rpx; width: 510rpx; border-radius: 6rpx"
                        :style="{
                            backgroundColor: role == 1 ? '#ECFAF4' : '#FBFBFB',
                            color: role == 1 ? '#01BB74' : '#333333'
                        }"
                    >
                        <view>供应商</view>
                        <view v-if="role == 1" class="absolute" style="right: 20rpx">
                            <u-icon name="https://res-oss.elist.com.cn/wxImg/code/check.svg" size="28rpx"></u-icon>
                        </view>
                    </view>
                </view>
            </div>
        </up-overlay>

        <view class="flex-row" style="width: 100%; display: flex">
            <view class="ml5 mr5" style="flex: 1">
                <u-button openType="share" :custom-style="SearchCustomStyleWechat" hover-class="none" shape="circle" :plain="true">
                    <view class="pr10"><u-icon name="weixin-fill" color="#01BB74" size="30rpx"></u-icon></view>
                    微信邀请
                </u-button>
            </view>
            <!-- <view class="ml5 mr5" style="flex: 1">
				<u-button :custom-style="SearchCustomStyle" hover-class="none" shape="circle"
					@click="goPath('/pages/subIndex/add_friend/add_friend')">
					<view class=></view><u-icon  "pr10" name="phone-fill" color="#ffffff" size="30rpx"></u-icon>
					手机号邀请
				</u-button>
			</view> -->
            <view class="ml5 mr5" style="flex: 1">
                <u-button :custom-style="SearchCustomStyle" hover-class="none" shape="circle" @click="establish">
                    <view class="pr10">
                        <u-icon name="plus" color="#ffffff" size="30rpx"></u-icon>
                    </view>
                    创建{{ vuex_userRole == 'D' ? '客户' : '供应商' }}
                </u-button>
            </view>
        </view>
        <view class="anchorText">
            <view class="SearchTablePage">
                <view class="SearchTablePageIcon">
                    <u-icon name="search" color="#01BB74" size="30rpx"></u-icon>
                </view>
                <view class="SearchTablePageInput">
                    <u-input placeholder="请输入关键字进行查找" border="none" @change="search"></u-input>
                </view>
            </view>
        </view>

        <u-empty v-if="isEmptyObject(client)" icon="https://res-oss.elist.com.cn/wxImg/order/empty.svg" iconSize="200rpx" text="暂无好友~" mode="search" margin-top="200"></u-empty>
        <view v-for="(item, index) in client" :key="index">
            <view class="ml20" style="border-bottom: 2rpx solid #f7f7f7; width: 110vw" v-show="show == 1">
                <u-collapse arrow-color="#ffffff">
                    <u-collapse-item v-if="!ifZX(index)" :title="getCompanyName(item)" arrow="false">
                        <view
                            v-for="(item2, index2) in item"
                            :key="index2"
                            style="border-bottom: 2rpx solid #f4f4f4; width: 85%; padding-top: 10rpx; padding-bottom: 10rpx"
                            class="anchor-text ml48"
                            :style="{ color: item.state == '2' ? '#FA5151' : '#333333' }"
                        >
                            <view
                                class=""
                                style="display: flex; flex-direction: row; padding-top: 10rpx; color: black"
                                :style="{
                                    color: item2.identity == '3' ? '#AAAAAA' : '#333333'
                                }"
                                @click="jump(index, item2, item)"
                            >
                                {{ item2.name || item2.staffNumber }}
                                <view
                                    class="custom-style ml10"
                                    :style="{
                                        backgroundColor: item2.identity == '0' ? '#648AFF' : item2.identity == '1' ? '#FF8C8C' : '#FFE387',
                                        color: '#ffffff',
                                        width: item2.identity == '1' || item2.identity == '0' ? '100rpx' : '80rpx'
                                    }"
                                >
                                    {{ item2.identity == '0' ? '主账号' : item2.identity == '1' ? '合伙人' : item2.identity == '3' ? '财务' : '员工' }}
                                </view>
                            </view>
                        </view>
                    </u-collapse-item>
                </u-collapse>
            </view>
            <view class="ml20 clickBack" v-show="show == 0" style="border-bottom: 2rpx solid #f7f7f7; width: 110vw">
                <view @click="jumpShow(item)" style="border-bottom: 2rpx solid #f4f4f4; width: 85%; padding-top: 10rpx; padding-bottom: 10rpx" class="anchor-text ml24">
                    <view class="" style="display: flex; flex-direction: row; padding-top: 10rpx; color: black">
                        {{ ifZX(index) ? index.replace("zx-'", '') : getCompanyName(item) }}
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            client: {},
            scrollTop: 0,
            indexList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
            scanResult: '',
            showAl: false,
            show: 1,
            spply: {
                aNumber: '',
                aCompany: '',
                aBossNumber: '',
                aName: '',
                aJobNumber: '',
                bNumber: '',
                aImg: '',
                bImg: '',
                state: 0
            },
            clientCopy: {},
            showSF: false,
            checked: '供应商',
            showChecked: false,
            heig: '20vh',
            role: 0,
            sm: '',
            SearchCustomStyle: {
                width: '200rpx',
                height: '60rpx',
                padding: '12rpx',
                fontSize: '24rpx',
                backgroundColor: '#FFAF38',
                color: '#ffffff'
            },
            SearchCustomStyleWechat: {
                width: '200rpx',
                height: '60rpx',
                padding: '12rpx',
                fontSize: '24rpx',
                color: '#01BB74'
            }
        };
    },
    onLoad(option) {
        console.log('option.show:', option.show);
        this.show = option.show ? option.show : 1;
    },
    onShow() {
        if (this.vuex_userRole == 'R') {
            uni.setNavigationBarTitle({
                title: '供应商列表',
                success: function () {
                    // 标题设置成功
                }
            });
        }
        console.log(111111, this.vuex_userRole);
        this.loadData();
    },
    onShareAppMessage(ops) {
        let title = '',
            imageUrl = '';
        if (this.vuex_userRole == 'D') {
            title = '邀请您成为他的客户~';
            imageUrl = 'https://res-oss.elist.com.cn/wxImg/message/shareD.png';
        } else {
            title = '邀请您成为他的供应商~';
            imageUrl = 'https://res-oss.elist.com.cn/wxImg/message/shareR.png';
        }
        if (ops.from === 'button') {
            var phone = this.vuex_user.data.work == '0' ? this.vuex_user.phone : this.vuex_user.workData.bossNumber;
            return {
                title: title,
                path: '/pages/subMessage/friend_apply_for/shareFriend?phone=' + phone + '&invitationRole=' + this.vuex_userRole,
                imageUrl: imageUrl
                // imageUrl: 'https://res-oss.elist.com.cn/wxImg/message/share.png'
            };
        }
    },
    methods: {
        getCompanyName(item) {
            var boss = item.filter((res) => res.identity == '0');
            var zx = this.ifZX(boss[0].companyName);
            return zx ? boss[0].companyName.replace("zx-'", '') : boss[0].companyName;
        },
        establish() {
            console.log('establish');
            uni.navigateTo({
                url: '/pages/subIndex/establish/establish'
            });
        },
        isEmptyObject(obj) {
            return Object.keys(obj).length === 0;
        },
        ifZX(val) {
            return val.includes('zx-');
        },
        search(e) {
            console.log('输入的关键字: ', e);
            console.log('数据: ', this.client);
            this.client = this.clientCopy;
            var dx = this.client;
            let filteredKeys = Object.keys(dx).filter((key) => key.includes(e));
            let filteredObj = {};
            filteredKeys.forEach((key) => {
                filteredObj[key] = dx[key];
            });
            this.client = filteredObj;
        },
        scanQRcodesAddFriend() {
            //查询该用户信息
        },
        scanQRcodes() {
            const that = this;
            uni.scanCode({
                success: (res) => {
                    that.scanResult = res.result;
                    var json = JSON.parse(that.scanResult);
                    console.log('扫码:', json);
                    that.sm = json;
                    that.showSF = true;

                    // that.addFriend(json);
                },
                fail: (err) => {
                    console.error('扫码失败:', err);
                    this.$u.toast('扫码失败~');
                }
            });
        },
        loadData() {
            var that = this;
            var port = this.vuex_userRole == 'R' ? '1' : '0';
            var phone = this.vuex_work == 'Y' ? this.vuex_user.workData.bossNumber : this.vuex_user.phone;
            this.$api.order
                .getDeliveryList({
                    sBossNumber: phone,
                    eBossNumber: phone,
                    port: port
                })
                .then((res) => {
                    console.log(res.data.data);
                    that.client = res.data.data;
                    that.clientCopy = res.data.data;
                });
        },
        jumpShow(item) {
            console.log('item：', item);
            var boss = item.filter((res) => res.identity == '0');
            var zx = this.ifZX(boss[0].companyName);
            var json = {
                company: zx ? boss[0].companyName.replace("zx-'", '') : boss[0].companyName,
                data: item
            };
            console.log('点击了', json);
            uni.setStorageSync('companyNameJSON', JSON.stringify(json));
            uni.navigateBack();
        },
        jump(index, item, list) {
            console.log(index, item);

            var zx = this.ifZX(index);

            var listBoss = list.filter((res) => res.identity == '0');

            item.remarkInbox = listBoss[0].remarkInbox;

            var json = {
                company: listBoss[0].companyName,
                data: item
            };
            if (zx) {
                json = {
                    company: zx ? item.companyName.replace("zx-'", '') : item.companyName,
                    data: {
                        identity: '1'
                    }
                };

                uni.setStorageSync('companyNameJSON', JSON.stringify(json));
                uni.navigateBack();
            } else {
                var iden = item.identity == '3';

                if (!iden) {
                    console.log('点击了', json);
                    uni.setStorageSync('companyNameJSON', JSON.stringify(json));
                    uni.navigateBack();
                } else {
                    this.$u.toast('不能给财务开单~');
                }
            }
        },
        postGetList(url) {},
        compare(a, b) {
            if (a.length === b.length) {
                return 0;
            } else if (a.length < b.length) {
                return -1;
            } else {
                return 1;
            }
        },
        addFriend(json) {
            var addPhone = json.phone;
            var phone = this.vuex_user.phone;
            var work = this.vuex_user.data.work == '1';
            var img = this.vuex_user.data.headPortrait;
            var aName = this.vuex_user.data.nickName || phone;
            var identy = '';
            var aBossNumber = phone;

            if (addPhone == phone) {
                this.showSF = false;
                this.$u.toast('请勿添加自己~');
                return;
            }

            if (work) {
                identy = this.vuex_user.workData.identity;
                aBossNumber = this.vuex_user.workData.bossNumber;
                if (aBossNumber == phone) {
                    this.showSF = false;
                    this.$u.toast('请勿添加自己老板~');
                    return;
                }
            }

            var dx = {
                aNumber: phone,
                aBossNumber: aBossNumber,
                bBossNumber: '',
                aJobBumber: '',
                bNumber: '',
                aImg: img,
                bImg: '',
                state: '0',
                aName: '',
                port: '',
                aCompany: ''
            };

            this.$u.post('edo/user/search?phone=' + addPhone).then((res) => {
                console.log('(检索添加人)： ', JSON.stringify(res.data.data.map));
                var addUser = res.data.data;
                var bossAdd = addPhone;

                if (addUser.map.boss !== undefined) {
                    bossAdd = addUser.map.boss;
                }
                var bImg = addUser.headPortrait;

                if (bossAdd == phone) {
                    this.showSF = false;
                    this.$u.toast('请勿添加自己~');
                    return;
                }

                dx.bImg = bImg;
                dx.bNumber = addPhone;
                dx.bBossNumber = bossAdd;

                dx.port = this.role == 1 ? 'D' : 'R';

                this.$api.user.addClient(dx).then.then((res) => {
                    console.log('添加申请： ' + res.data.data);
                    var resAddFriend = res.data;
                    this.addResAlert(resAddFriend);
                });
            });
        },
        addResAlert(data) {
            console.log('tab' + data);
            this.$u.toast(data.message);
            this.showSF = false;
        }
    },
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
    }
};
</script>
<style lang="scss" scoped>
.list-cell {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: 20rpx 24rpx;
    overflow: hidden;
    color: #323233;
    font-size: 28rpx;
    line-height: 48rpx;
    background-color: #fff;
}

.anchorText {
    // background-color: #ffaaff;
    height: 7vh;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    // margin-left: 24rpx;
    margin-right: 24rpx;

    padding-left: 24rpx;

    .SearchTablePage {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        border-radius: 12.24rpx;
        background: #f4f4f4;

        .SearchTablePageIcon {
            height: 100%;
            width: 10%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
        }

        .SearchTablePageInput {
            height: 100%;
            width: 90%;
            display: flex;
            flex-direction: row;
            justify-content: left;
        }
    }

    .SearchTablePageADD {
        width: 10%;
        padding-left: 12rpx;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
}

.custom-style {
    // width: 200rpx;
    border-radius: 24rpx;
    text-align: center;
    padding: 4rpx;
    font-size: 24rpx;
}

.clickBack:hover {
    background-color: #f2f2f5;
}
</style>
