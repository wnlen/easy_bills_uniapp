<template>
	<view @tap.stop v-show="roleShow" class="flex-col justify-center items-center pop-renew">
		<view class="relative flex-col justify-center items-center" style="height: 100%;width: 100%;">
			<u-image class="" :showLoading="true" :src="src" width="360px" height="360px"></u-image>
			
			 <u-icon @click="close"  class="absolute" style="top: 5%;right: 10%;" name="close-circle" color="#ffffff" size="40"></u-icon>
			
			<view @click="buyRenew" class="absolute flex-row justify-center items-center buttonRenew"
				style="bottom: 50px;">
				<u-text class="te">￥{{orderPrice}}</u-text>
				<u-text class="te">/年</u-text>
				<u-text class="te ml10">立即购买</u-text>
			</view>
			
			<view class="absolute flex-row justify-center items-center"
				style="bottom: -5px;color: #FFFFFF;opacity: 1;font-size: 14.3px;"
				@click="goPath('/pages/subPack/user/my_order/my_order')">
				进入我的订购 >
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "pop-renew",
		props: {
			img: {
				type: String,
				default: "https://res-oss.elist.com.cn/wxImg/vip/ygxf.svg"
			},
			item: {
				type: Object,
				default: {}
			},
		},
		data() {
			return {
				roleShow: false,
				src: "",
				orderPrice: 0
			};
		},
		onShow() {
			console.log("续费页面");
			var Renew = uni.getStorageSync("Renew")
			console.log(Renew);
		},
		methods: {
			close(){
				this.$parent.$parent.roleShow=false
				this.roleShow=false
			},
			buyRenew() {
				var Renew = uni.getStorageSync("Renew")
				console.log(Renew);
				var order = JSON.parse(Renew)
				var timeKey = new Date().getTime();
				console.log("订单key：", timeKey.toString());
				uni.setStorageSync(timeKey.toString(), JSON.stringify(order))
				uni.navigateTo({
					url: "/pages/subPack/user/my_order/pay?order=" + timeKey.toString()
				})
			}
		}
	}
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
		background: linear-gradient(270deg, #41404F -38%, #47506C 36%);
		border-radius: 85px;
		opacity: 1;
		width: 200px;
		height: 40px ;
		color: #F7D8B8;
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
</style>