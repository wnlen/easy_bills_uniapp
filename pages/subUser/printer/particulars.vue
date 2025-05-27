<template>
	<view class="content bg-gray">
		<view class="" style="width: 100%;height: 45%;background-color: white;">
			<view class="items-center" style="height: 80%;width: 100%;">
				<u-image width="100%" height="100%" :src="imageUrl[2]"></u-image>
			</view>
			<view class="flex-row justify-left items-center relative">
				<view class="">
					<u-icon class="ml30" :name="imageUrl[1]" size="100"></u-icon>
					<u-icon class="ml30" :name="imageUrl[1]" size="100"></u-icon>
				</view>
				<view class="absolute" style="right: 10px;">
					<view class="flex-row justify-center items-center"
						style="width: 120px;height: 25px;border-radius: 2px;background: rgba(187, 144, 99, 0.1);color: #BB9063;font-size: 12px;">
						赠品：A5打印纸×2
					</view>
				</view>
			</view>
		</view>
		<view class="mt20 flex-col items-center" style="height: 54%;width: 100%;background-color: white;">
			<view class="mt20 items-center flex-row justify-left"
				style="height: 30px;width: 95%;font-size: 16px;font-weight: normal;">
				商品属性
			</view>
			<view class="mt10 pt10 flex-col justify-center items-baseline"
				style="background: rgba(216, 216, 216, 0.1);width: 95%;height: 30%;color: #666666;">
				<view class="" style="height: 25%;">
					名称：无墨复印打印机
				</view>
				<view class="" style="height: 25%;">
					型号：A4mini 287×126×69 mm
				</view>
				<view class="" style="height: 25%;">
					重量：1.45KG
				</view>
				<view class="" style="height: 25%;">
					打印纸：A5 210×148 mm
				</view>
			</view>

			<view class="mt20 items-center flex-row justify-left"
				style="height: 30px;width: 95%;font-size: 16px;font-weight: normal;">
				打印示例
			</view>
			<view class="mt10 ml55" style="height: 80%;width: 100%;">
				<u-image class="" width="60%" height="60%" :src="imageUrl[0]"></u-image>
			</view>


		</view>

		<view class="flex-col justify-center pl60 pr60 vw100 fixed-bar" style="background-color: transparent;">
			<u-button hover-class="none" :custom-style="{backgroundColor:'#47506C'}" shape="circle" type="primary"
				open-type="contact">购买咨询</u-button>
			<!-- @click="jump" -->
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				imageUrl: [
					"https://res-oss.elist.com.cn/wxImg/user/particulars/order.png",
					"https://res-oss.elist.com.cn/wxImg/user/particulars/paper.png",
					"https://res-oss.elist.com.cn/wxImg/user/particulars/print.png"
				]
			}
		},
		onLoad(option) {

		},
		methods: {
			jump() {
				uni.navigateTo({
					url: "/pages/subMessage/chitchat/chat"
				})
			}
		}
	}
</script>

<style>
	.content {
		width: 100vw;
		height: 100vh;

		overflow-x: hidden;
	}
</style>