<template>
	<view @tap.stop v-show="roleShow" class="flex-col justify-center items-center pop-renew">
		<view class="relative flex-col justify-center items-center" style="height: 100%; width: 100%; margin-top: 200rpx">
			<up-image class="" :showLoading="true" :src="src" width="720rpx" height="720rpx"></up-image>
			<view class="absolute" style="top: 5%; right: 10%">
				<up-icon @click="close" name="close-circle" color="#ffffff" size="40rpx"></up-icon>
			</view>

			<view class="absolute flex-row justify-center items-center mt30" style="width: 100%; height: 240rpx">
				<view
					class="mr15 tab flex-col justify-center items-center"
					v-for="(ite, index) in item"
					:key="index"
					:style="{ backgroundColor: year == index ? '#FDF7ED' : '#FFFFFF' }"
					@click="orderInit(ite, index)"
				>
					<text class="t1">{{ ite.product }}</text>
					<text class="t2">￥{{ ite.priceDiscount }}</text>
					<text class="t3">￥{{ ite.price }}</text>
					<text class="iconPeople flex-col justify-center items-center mt10" v-if="ite.priceDiscount">低至{{ (ite.priceDiscount / 365).toFixed(2) }}元/天</text>
				</view>
			</view>
			<view class="absolute btn flex-col justify-center items-center" style="bottom: 80rpx">
				<view class="ts mb10 mt10">新用户半年内免费使用，购买后继续开单</view>
				<view @click="buyRenew" class="flex-row justify-center items-center buttonRenew">
					<text class="te">￥{{ pay }}</text>
					<text class="te">/年</text>
					<text class="te ml10">立即购买</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'pop-order',
	props: {
		img: {
			type: String,
			default: 'https://res-oss.elist.com.cn/wxImg/vip/ygxf.svg'
		},
		item: {
			type: Object,
			default: []
		}
	},
	data() {
		return {
			productCode: [],
			roleShow: true,
			src: 'https://res-oss.elist.com.cn/wxImg/order/yjkd.png',
			year: 1,
			order: {
				description: '开单购买',
				orderNumber: '',
				particulars: '细节',
				payment: '1',
				phone: '19108696232',
				price: 0.01,
				productCode: '',
				state: '',
				type: ''
			},
			KEY: 1,
			time: {},
			pay: 0
		};
	},
	methods: {
		close() {
			this.$parent.$parent.showOrderPly = false;
			this.roleShow = false;
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
		orderInit(item, year) {
			this.year = year;
			this.pay = item.priceDiscount;
			console.log(item);

			var productCode = {
				totalPrice: item.priceDiscount,
				CODE: [item.type],
				peopleRenew: [],
				price: {},
				time: {}
			};

			productCode.price[item.type] = item.priceDiscount;
			productCode.time[item.type] = item.orderRenewTime;

			this.order.phone = this.pinia_user.phone;
			this.order.price = item.priceDiscount;
			this.order.productCode = JSON.stringify(productCode);
			this.order.state = '1';
			this.order.type = '1';

			console.log(this.order);
		},
		buyRenew() {
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

<style scoped>
.te {
	font-size: 26rpx;
	font-weight: 600;
	line-height: 36.24rpx;
	text-align: center;
	letter-spacing: 0rpx;
}

.buttonRenew {
	background: linear-gradient(270deg, #41404f -38%, #47506c 36%);
	border-radius: 170rpx;
	opacity: 1;
	width: 400rpx;
	height: 80rpx;
	color: #f7d8b8;
}

.ts {
	font-size: 20rpx;
	font-weight: 500;
	line-height: 30rpx;
	text-align: center;
	letter-spacing: 0.02em;

	font-variation-settings: 'opsz' auto;
	font-feature-settings: 'kern' on;
	color: #8f6c38;
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
	/* border: 2rpx solid #ccc; */
	/* 边框 */
	/* box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1); */
	/* 阴影 */

	/* 其他样式，如 padding、overflow 等 */
	padding: 40rpx;
	overflow: auto;
	/* 如果内容过多，允许滚动 */
}

.tab {
	border-radius: 17.6rpx;
	box-sizing: border-box;
	border: 3.46rpx solid #d6ae83;
	height: 100%;
	width: 200rpx;
}

.iconPeople {
	height: 30rpx;
	width: 120rpx;
	border-radius: 8.68rpx 1.74rpx 8.68rpx 1.74rpx;
	opacity: 1;
	background: linear-gradient(270deg, #d0a373 0%, #fdd39e 100%);
	font-size: 14rpx;
	color: #ffffff;
}

.t1 {
	font-size: 32rpx;
	font-weight: 600;
	color: #8f6c38;
}

.t2 {
	font-size: 40rpx;
	font-weight: 600;
	color: #8f6c38;
}

.t3 {
	font-size: 24rpx;
	font-weight: 400;
	text-decoration: line-through;
	color: #dac7b2;
}
</style>
