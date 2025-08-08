<template>
    <view @tap.stop v-show="roleShow" class="flex-col justify-center items-center pop-renew">
        <view class="relative flex-col justify-center items-center" style="height: 100%; width: 100%">
            <u-image class="" :lazy-load="true" :showLoading="true" :src="src" width="360px" height="360px"></u-image>

            <u-icon @click="close" class="absolute" style="top: 5%; right: 10%" name="close-circle" color="#ffffff" size="40"></u-icon>

            <view class="absolute flex-row justify-center items-center mt30" style="width: 100%; height: 120px">
                <view class="mr15 tab flex-col justify-center items-center" :style="{ backgroundColor: year == 1 ? '#FDF7ED' : '#FFFFFF' }" @click="orderInit('A1')">
                    <u-text class="t1">{{ productCode[0] ? productCode[0].product : '' }}</u-text>
                    <u-text class="t2">￥{{ orderPriceBDiscount }}</u-text>
                    <u-text class="t3">￥{{ orderPriceB }}</u-text>
                    <view class="iconPeople flex-col justify-center items-center mt10">低至{{ (orderPriceBDiscount / 365).toFixed(2) }}元/天</view>
                </view>
                <view class="ml15 tab flex-col justify-center items-center" :style="{ backgroundColor: year == 2 ? '#FDF7ED' : '#FFFFFF' }" @click="orderInit('A2')">
                    <u-image :lazy-load="true" style="position: absolute; top: 0" src="https://res-oss.elist.com.cn/wxImg/order/tj.png" width="60px" height="15px"></u-image>
                    <u-text class="t1">{{ productCode[1] ? productCode[1].product : '' }}</u-text>
                    <u-text class="t2">￥{{ orderPriceQDiscount }}</u-text>
                    <u-text class="t3">￥{{ orderPriceQ }}</u-text>
                    <view class="iconPeople flex-col justify-center items-center mt10">低至{{ (orderPriceQDiscount / 365).toFixed(2) }}元/天</view>
                </view>
            </view>

            <view @click="buyRenew" class="absolute flex-row justify-center items-center buttonRenew" style="bottom: 50px">
                <u-text class="te">￥{{ year == 1 ? orderPriceBDiscount : orderPriceQDiscount }}</u-text>
                <u-text class="te">/年</u-text>
                <u-text class="te ml10">立即购买</u-text>
            </view>
            <view
                class="absolute flex-row justify-center items-center"
                style="bottom: -5px; color: #ffffff; opacity: 1; font-size: 14.3px"
                @click="goPath('/pages/subPack/user/my_order/my_order')"
            >
                进入我的订购 >
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'pop-database',
    props: {
        img: {
            type: String,
            default: 'https://res-oss.elist.com.cn/wxImg/vip/ygxf.svg'
        },
        item: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            productCode: [],
            roleShow: false,
            src: '',
            orderPriceB: 0,
            orderPriceQ: 0,
            orderPriceBDiscount: 0,
            orderPriceQDiscount: 0,
            year: 2,
            order: {},
            KEY: 1,
            time: {}
        };
    },
    onShow() {
        console.log('续费页面');
        var Renew = uni.getStorageSync('Renew');
        console.log('续费页面:', Renew);
    },
    methods: {
        close() {
            this.$parent.$parent.roleShow = false;
            this.roleShow = false;
        },
        orderInit(type) {
            this.year = type == 'A1' ? 1 : 2;
            var order = this.order;
            var KEY = this.KEY;

            var a1 = {};
            var a2 = {};

            var a1k = 0;
            var a2k = 0;
            this.productCode.forEach((res) => {
                if (res.code == type) {
                    KEY = res.key;
                }
                if (res.code == 'A1') {
                    a1 = res;
                    a1k = res.key;
                }
                if (res.code == 'A2') {
                    a2 = res;
                    a2k = res.key;
                }
            });

            console.log('订单：', order);
            console.log('KEY：', KEY);
            console.log('productCode：', this.productCode);

            this.order.description = KEY == '1' ? '订单续费' : '订单购买';

            this.order.price = type == 'A1' ? this.orderPriceBDiscount : this.orderPriceQDiscount;
            this.order.payment = type == 'A1' ? (this.orderPriceBDiscount * 100).toFixed(0) : (this.orderPriceQDiscount * 100).toFixed(0);

            var code = type == 'A1' ? ['A1'] : ['A1', 'A2'];
            var productCode = {
                totalPrice: this.order.price,
                CODE: code,
                peopleRenew: [],
                price: {
                    A1: this.orderPriceBDiscount,
                    A2: this.orderPriceQDiscount
                },
                time: {
                    A1: a1k == 2 ? new Date().toISOString() : a1.endTime,
                    A2: a2k == 2 ? new Date().toISOString() : a2.endTime
                }
            };

            this.order.productCode = JSON.stringify(productCode);

            this.order = this.order;
            console.log('选择后的订单：', this.order);
        },
        buyRenew() {
            console.log('orderPriceB', this.orderPriceB);
            console.log('orderPriceQ', this.orderPriceQ);
            console.log('orderPriceBDiscount', this.orderPriceBDiscount);
            console.log('orderPriceQDiscount', this.orderPriceQDiscount);
            var timeKey = new Date().getTime();
            console.log('订单key：', timeKey.toString());
            uni.setStorageSync(timeKey.toString(), JSON.stringify(this.order));
            uni.navigateTo({
                url: '/pages/subPack/user/my_order/pay?order=' + timeKey.toString()
            });
        }
    }
};
</script>

<style>
.te {
    font-size: 13px;
    font-weight: 600;
    line-height: 18.12px;
    text-align: center;
    letter-spacing: 0px;
}

.buttonRenew {
    background: linear-gradient(270deg, #41404f -38%, #47506c 36%);
    border-radius: 85px;
    opacity: 1;
    width: 200px;
    height: 40px;
    color: #f7d8b8;
}

.pop-renew {
    /* 设置为块级元素，以便可以设置宽度和高度 */
    display: block;

    /* 设置宽度和高度 */
    /* 	width: 80%;
		height: 40%; */

    /* 设置为绝对定位，以便可以相对于最近的已定位祖先元素（或视口）进行定位 */
    position: fixed;

    /* 居中元素 - 使用 transform 而不是 margin: auto，因为 margin: auto 不适用于绝对定位的元素 */
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);

    /* 设置 z-index 以确保它显示在其他元素之上 */
    z-index: 9999;

    /* 添加背景色和其他样式，如边框、阴影等 */
    background-color: transparent;
    /* background-color: antiquewhite; */
    /* 半透明白色背景 */
    /* border: 1px solid #ccc; */
    /* 边框 */
    /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */
    /* 阴影 */

    /* 其他样式，如 padding、overflow 等 */
    padding: 20px;
    overflow: auto;
    /* 如果内容过多，允许滚动 */
}

.tab {
    border-radius: 8.8px;
    box-sizing: border-box;
    border: 1.73px solid #d6ae83;
    height: 100%;
    width: 100px;
}

.iconPeople {
    height: 15px;
    width: 60px;
    border-radius: 4.34px 0.87px 4.34px 0.87px;
    opacity: 1;
    background: linear-gradient(270deg, #d0a373 0%, #fdd39e 100%);
    font-size: 8.67px;
    color: #ffffff;
}

.t1 {
    font-size: 15px;
    font-weight: 600;
    color: #8f6c38;
}

.t2 {
    font-size: 27px;
    font-weight: 600;
    color: #8f6c38;
}

.t3 {
    font-size: 12px;
    font-weight: 400;
    text-decoration: line-through;
    color: #dac7b2;
}
</style>
