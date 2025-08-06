<template>
	<view class="content">
		<u-navbar :placeholder="true" :custom-back="jump" :border-bottom="false" :titleBold="true" title-color="#000000" title="发票审核"
				title-size="34" bgColor="#ffffff">
		</u-navbar>
		<view class="w100 box">
			<view class="mt20">
				<u-icon name="https://res-oss.elist.com.cn/wxImg/user/invoic.png" size="200"></u-icon>
			</view>
			<view class="success">
				申请提交成功
			</view>
			<view class="ts mt10 flex-col justify-center">
				<text>发票正在审核中，工作人员将会在</text>
				<text>三个工作日内审核您的提交</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods:{
			jump(){
				uni.redirectTo({
					url:"/pages/subPack/user/my_order/my_order?tab=1"
				})
			}
		}
	}
</script>

<style>
	.content {
		background-color: white;
		width: 100vw;
		height: 80vh;

	}

	.box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 50%;
		margin-top: 10vh;
	}

	.success {
		font-size: 16px;
		color: #333333;
		font-weight: 500;
	}

	.ts {

		width: 100%;
		font-family: Source Han Sans;
		font-size: 16px;
		font-weight: normal;
		line-height: 24px;
		text-align: center;
		letter-spacing: 0px;
		
		font-variation-settings: "opsz" auto;
		font-feature-settings: "kern" on;
		color: #AAAAAA;
	}
</style>