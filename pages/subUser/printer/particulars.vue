<template>
	<view class="content bg-gray">
		<view class="" style="width: 100%; height: 45%; background-color: white">
			<view class="flex-row justify-center">
				<up-image :src="imageUrl[2]"></up-image>
			</view>
			<view class="flex-row justify-left items-center relative">
				<view class="flex-row">
					<view class="ml30">
						<wd-icon :name="imageUrl[1]" size="100rpx"></wd-icon>
					</view>
					<view class="ml30">
						<wd-icon class="ml30" :name="imageUrl[1]" size="100rpx"></wd-icon>
					</view>
				</view>
				<view class="absolute" style="right: 10px">
					<view
						class="flex-row justify-center items-center"
						style="width: 120px; height: 25px; border-radius: 2px; background: rgba(187, 144, 99, 0.1); color: #bb9063; font-size: 12px"
					>
						赠品：A5打印纸×2
					</view>
				</view>
			</view>
		</view>
		<view class="mt20 flex-col items-center" style="width: 100%; background-color: white">
			<view class="mt20 items-center flex-row justify-left" style="height: 30px; width: 95%; font-size: 16px; font-weight: normal">商品属性</view>
			<view class="mt10 pt10 flex-col justify-around items-baseline pl30" style="background: rgba(216, 216, 216, 0.1); width: 95%; color: #666666">
				<view class="pt20 pb20">名称：无墨复印打印机</view>
				<view class="pb20">型号：A4mini 287×126×69 mm</view>
				<view class="pb20">重量：1.45KG</view>
				<view class="pb20">打印纸：A5 210×148 mm</view>
			</view>

			<view class="mt20 items-center flex-row justify-left" style="height: 30px; width: 95%; font-size: 16px; font-weight: normal">打印示例</view>
			<view class="mt10 ml55">
				<up-image class="" :src="imageUrl[0]"></up-image>
			</view>
		</view>
		<view class="pt180"></view>
		<view class="flex-col justify-center pl60 pr60 vw100 fixed-bar" style="background-color: transparent">
			<wd-button :customStyle="{ background: '#47506C' }" open-type="contact">购买咨询</wd-button>
			<!-- @click="jump" -->
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			imageUrl: [
				'https://res-oss.elist.com.cn/wxImg/user/particulars/order.png',
				'https://res-oss.elist.com.cn/wxImg/user/particulars/paper.png',
				'https://res-oss.elist.com.cn/wxImg/user/particulars/print.png'
			]
		};
	},
	onLoad(option) {},
	methods: {
		jump() {
			uni.navigateTo({
				url: '/pages/subMessage/chitchat/chat'
			});
		}
	}
};
</script>

<style>
.content {
	width: 100vw;
	height: 100vh;

	overflow-x: hidden;
}
</style>
