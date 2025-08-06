<template>
	<view class="noAccess">
		<u-navbar :autoBack="true" :placeholder="true" :border-bottom="false" :titleBold="true" title-color="#000000"  title-size="34"
			bgColor="#ffffff"></u-navbar>

		<view class="flex-row justify-center items-center absolute" style="width: 100%;top: 30%;">
			<u-image src="https://res-oss.elist.com.cn/wxImg/order/cw.svg" width="600rpx" height="400rpx"></u-image>
			<view class="absolute" style="bottom: -80rpx;color: #AAAAAA;font-size: 28rpx;">
				您暂无权限~
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
		methods: {

		}
	}
</script>

<style lang="scss">
	.noAccess {
		width: 100vw;
		height: 100vh;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		padding-bottom: 200rpx;
	}
</style>