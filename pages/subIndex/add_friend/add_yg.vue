<template>
    <view class="bg-gray vh100 vw100" style="overflow: hidden">
        <view class="ml24 mr24" style="padding-top: 20rpx">
            <u-search
                search-icon-color="#01bb74"
                :show-action="false"
                placeholder="请输入电话号码"
                :animation="true"
                @change="SearchFriend"
                @search="SearchFriend"
                maxlength="11"
                shape="square"
                class="u-search"
                height="90rpx"
                bg-color="#ffffff"
                v-model="searchNumber"
            ></u-search>
        </view>
        <view class="vw100" style="height: 80vh">
            <view
                v-for="(item, index) in searchUser"
                :key="index"
                class="card ml24 mr24 bg-white flex-row justify-left items-center"
                style="height: 10vh; width: 93vw; margin-top: 2vh; border-radius: 6px"
            >
                <view class="flex-col justify-center items-center" style="width: 13vw">
                    <u-image class="ml20" width="50px" height="50px" shape="circle" :src="item.headPortrait || defaultImg"></u-image>
                </view>
                <view class="ml10 flex-col justify-left items-baseline" style="width: 60vw; height: 100%">
                    <!-- 			<view class="flex-row" style="height: 50%;"
						:style="{height:item.work?'50%':'100%',alignItems: item.work?'flex-end':'center'}">
						<text class="ml5" style="color:#01BB74;">{{item.phoneNumber}}</text> <text class="ml10"
							style="">{{userName(item.name)||"用户"}}</text>
					</view> -->
                    <view
                        class="flex-row"
                        style="height: 50%"
                        :style="{
                            height: item.map.boss ? '50%' : '100%',
                            alignItems: item.map.boss ? 'flex-end' : 'center'
                        }"
                    >
                        <text class="ml5" style="color: #01bb74">{{ item.phoneNumber }}</text>
                        <text class="ml10" style="">{{ userName(item.name) || '用户' }}</text>
                    </view>
                    <view v-show="item.map != '' && item.map.boss" class="flex-row justify-start items-center" style="width: 60vw; font-size: 12px; height: 50%">
                        <u-icon name="https://res-oss.elist.com.cn/wxImg/user/yrz-s.svg" size="100"></u-icon>
                        <text class="ml10" style="color: #333333">
                            {{ item.map.enterpriseName != undefined ? item.map.enterpriseName : '该用户已进入其他账户' }}
                        </text>
                    </view>
                    <!-- 					<view v-show="item.work=='1'" class="flex-row justify-start items-center"
						style="width: 60vw;font-size: 12px;height: 50%;">
						<u-icon name="https://res-oss.elist.com.cn/wxImg/user/yrz-s.svg" size="100"></u-icon>
						<text class="ml10" style="color:#333333;">
							{{item.map.enterpriseName!=undefined?item.map.enterpriseName:"该用户已进入其他账户"}}</text>
					</view> -->
                </view>
                <view class="mr48" style="float: right; width: 10vw">
                    <button
                        :style="{ display: state == 0 ? 'none' : 'block' }"
                        v-if="(item.work == '0' && item.work != '1') || !showYQZ"
                        class="items-center flex-col justify-left pr35"
                        @click="addFriend(item.phoneNumber, item.headPortrait)"
                        style="background-color: #01bb74; border-radius: 396px; width: 60px; height: 30.43px; font-size: 12px; color: white"
                    >
                        添加
                    </button>
                    <view v-if="showYQZ" style="width: 100px; font-size: 13px; color: #01bb74" class="flex-row">邀请中</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            showYQZ: false,
            state: 1,
            searchNumber: '',
            searchUser: [],
            defaultImg: '/static/img/obj/defind.svg',
            phone: '',
            spply: {
                aNumber: '',
                aCompany: '',
                aBossNumber: '',
                aName: '',
                aJobNumber: '',
                bNumber: '',
                aImg: '',
                bImg: '',
                state: 0,
                port: ''
            },
            addstaff: uni.getStorageSync('addstaff'),
            showSF: false,
            checked: '供应商',
            showChecked: false,
            heig: '20vh',
            role: 0,
            sm: ''
        };
    },
    onShow() {},
    onLoad() {
        this.loadData();
    },

    onUnload() {
        uni.removeStorageSync('invite');
        uni.removeStorageSync('addstaff');
    },
    methods: {
        showToast(text, type) {
            this.$refs.uToast.show({
                title: text,
                type: type
            });
        },
        addFriend(e, img) {
            var invite = uni.getStorageSync('invite');
            console.log('invite不为空执行添员工:', invite);
            this.addFriendYG(e, img, invite);
            this.state = 0;
        },
        addFriendYG(e, img, invite) {
            var work = this.searchUser[0].work == '1';
            if (work) {
                this.$u.toast('该人员已经加入其他公司~');
                return;
            }

            if (e == this.vuex_user.phone) {
                this.$u.toast('请勿添加自己~');
            } else {
                var yg = {
                    aUser: this.vuex_user.phone,
                    bUser: e,
                    aName: this.vuex_user.data.name,
                    workNumber: '',
                    ifType: invite,
                    img: this.vuex_user.data.headPortrait
                };

                if (this.addstaff != '') {
                    var json = JSON.parse(this.addstaff);
                    yg.workNumber = json.jobNumber;
                    uni.removeStorageSync('addstaff');
                }

                console.log(yg);
                this.$api.bills.addApply(JSON.stringify(yg)).then((res) => {
                    console.log(res.data.data);

                    if (res.data.data == 1) {
                        this.showYQZ = true;
                        this.flushDBSX(yg.bUser);
                    }

                    this.$u.toast(res.data.message);
                });
            }
        },
        loadData() {},
        SearchFriend() {
            this.showYQZ = false;
            this.state = 1;
            this.searchUser = [];
            var that = this;
            if (this.searchNumber.length == 11) {
                this.$api.user
                    .searchUser({
                        phone: this.searchNumber,
                        state: 1,
                        port: this.vuex_userRole
                    })
                    .then((res) => {
                        console.log('更具电话号码检索： ' + res.data);

                        try {
                            if (res.data.data.phone != '') {
                                that.searchUser.push(res.data.data);
                            }
                        } catch {
                            this.$u.toast('没有该用户');
                        }

                        console.log(that.searchUser);
                    });
            }
        },
        flushDBSX(val) {
            var list = [val];
            this.$api.task
                .startRWFlow({ list: list })
                .then((res) => {
                    console.log('请求结果：' + res);
                })
                .catch((res) => {});
        },
        postGetFriend(phone, my) {
            console.log('验证：', phone, my);
        },
        userName(str) {
            if (str.length > 7) {
                return str.slice(0, 7) + '...';
            } else {
                return str;
            }
        }
    }
};
</script>

<style></style>
