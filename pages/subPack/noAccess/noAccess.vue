<template>
	<view class="noAccess">
		<up-navbar :autoBack="true" :placeholder="true" :border-bottom="false" :titleBold="true" title-color="#000000" title-size="34" bgColor="#ffffff"></up-navbar>

		<view class="flex-row justify-center items-center absolute" style="width: 100%; top: 30%">
			<!-- <up-image src="https://res-oss.elist.com.cn/wxImg/order/cw.svg" size="180rpx"></up-image> -->
			<wd-icon name="https://res-oss.elist.com.cn/wxImg/order/cw.svg" size="180"></wd-icon>
			<view class="absolute" style="bottom: -80rpx; color: #aaaaaa; font-size: 28rpx">您暂无权限~</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {}
};
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
