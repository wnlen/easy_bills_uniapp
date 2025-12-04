<template>
	<view>
		<up-navbar title="开送货单" :placeholder="true" bgColor="#ffffff" :autoBack="true"></up-navbar>
		<view class="flex-row justify-center items-center absolute" style="width: 100%; top: 30%">
			<up-image src="https://res-oss.elist.com.cn/wxImg/order/cw.svg" width="600rpx" height="400rpx"></up-image>
			<view class="absolute" style="bottom: -80rpx; color: #aaaaaa; font-size: 28rpx">无开单权限~</view>
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

<style></style>
