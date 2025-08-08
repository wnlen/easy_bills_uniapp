<template>
    <view class="vw100 flex-col w100 justify-center items-center">
        <!-- 	<u-navbar :custom-back="payBack" :border-bottom="false" title-color="#333333" title="支付订单" title-size="28"
			background="{background:transparent,color:white,fontSize: 28rpx;}"></u-navbar> -->

        <u-navbar
            :placeholder="true"
            :custom-back="payBack"
            :border-bottom="false"
            :titleBold="true"
            title-color="#000000"
            title="支付订单"
            title-size="34"
            bgColor="#ffffff"
        ></u-navbar>

        <view class="flex-col w100 justify-center items-center mt120 ml24 mr24">
            <view class="flex-col justify-center items-center hander">付款给易单据</view>
            <view class="price mt30">￥{{ order.price }}</view>

            <view class="flex-row justify-center items-center hander mt30">
                支付剩余时间
                <u-count-down :end="end" format="mm:ss" :timestamp="1800000" :show-days="false" :show-hours="false"></u-count-down>
            </view>
        </view>

        <view class="justify-start mt120 ml24 mr24" style="width: 94%">选择支付方式</view>

        <view class="ml24 mr24 mt30" style="width: 94%">
            <view class="relative flex-row justify-center items-center height48 w100" @click="index = index == 0 ? 1 : 0">
                <view class="absolute flex-row justify-center items-center" style="left: 0">
                    <u-icon name="https://res-oss.elist.com.cn/wxImg/user/wx.svg" size="40rpx"></u-icon>
                    <u-text class="ml10">微信支付</u-text>
                </view>
                <view class="absolute flex-row justify-center items-center" style="right: 0; width: 0">
                    <u-radio-group>
                        <u-radio @change="checkboxChange" size="25" active-color="#07C160" :disabled="index == 0" shape="circle"></u-radio>
                    </u-radio-group>
                </view>
            </view>
        </view>

        <view class="fixed-bar" style="background: none">
            <view class="pl30 pr30 pb30 flex-row justify-between items-center">
                <view class="flex-row flex-1 items-center">
                    <u-button hover-class="none" :custom-style="{ backgroundColor: '#01BB74' }" @click="ply" class="width100" type="primary" shape="circle">确认支付</u-button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            index: 1,
            order: {},
            nonceStr: ''
        };
    },
    onLoad(option) {
        console.log('option', option);
        var order = option.order;
        var order = uni.getStorageSync(order);
        this.order = JSON.parse(order);
    },
    methods: {
        end() {
            this.$u.toast('超时停留,已取消支付~');
            uni.switchTab({
                url: '/pages/user/index'
            });
        },
        payBack() {
            var number = this.nonceStr;
            var phone = this.vuex_user.phone;

            if (number == '') {
                uni.navigateBack();
                return;
            }
            //查询订单 状态
            //关闭订单
            //删除订单
            var dx = {
                phone: phone,
                orderNumber: number
            };
            this.$api.pay
                .verifyPayRecord(dx)
                .then((res) => {
                    var yz = res.data.data;
                    if (yz == 1) {
                        //支付成功
                        this.$u.toast('支付成功~');
                    } else {
                        //已取消支付
                        this.$u.toast('已取消支付~');
                    }
                    setTimeout(function () {
                        uni.reLaunch({
                            url: '/pages/subPack/user/my_order/my_order'
                        });
                    }, 1500);
                })
                .catch((res) => {});
        },
        ply() {
            var order = this.order;
            console.log('支付：', order);
            this.$api.pay
                .buyVip(order)
                .then((res) => {
                    this.playWX(res.data.data);
                })
                .catch((res) => {});
        },
        playWX(wx) {
            var that = this;
            this.nonceStr = wx.nonceStr;
            uni.requestPayment({
                provider: 'wxpay',
                timeStamp: wx.timeStamp, // 字符串，时间戳，从1970年1月1日00:00:00至今的秒数,即当前的时间(String)
                nonceStr: wx.nonceStr, // 字符串，随机串，长度要求在32位内
                package: wx.packageStr, // 字符串，统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=***）
                signType: wx.signType, // 字符串，签名方式：MD5/HMAC-SHA256
                paySign: wx.paySign, // 字符串，签名，见附录-JS-SDK使用权限签名算法
                success: function (res) {
                    // 支付成功后的回调函数
                    console.log('支付成功后的回调函数:', res);
                    uni.navigateBack();
                },
                fail: function (err) {
                    // 支付失败后的回调函数
                    console.log('支付失败后的回调函数:', err);
                }
            });
        },
        checkboxChange() {}
    }
};
</script>

<style>
.hander {
    font-family: Source Han Sans;
    font-size: 26rpx;
    font-weight: normal;
    line-height: 44rpx;
    text-align: center;
    letter-spacing: 0rpx;
    color: #999999;
}

.price {
    font-family: Source Han Sans;
    font-size: 80rpx;
    font-weight: 600;
    line-height: 42.24rpx;
    text-align: center;
    letter-spacing: 0rpx;
    color: #3d3d3d;
}
</style>
