<template>
	<view class="page-bg pl24 pr24 pt35">
		<view class="pb150">
			<view v-for="(item, index) in 2" :key="index" class="bg-white radius12 pt20 pb20 pl24 pr24 mb30">
				<view class="ft24">{{ index == 0 ? '系统签名' : '个人签名' }}</view>
				<view class="">
					<image style="transform: rotate(-90deg); height: 20vw; width: 100%" mode="heightFix"></image>
				</view>
				<view class="flex-row justify-end"><wd-checkbox v-model="value" checked-color="#01BB74">默认签收人</wd-checkbox></view>
			</view>
		</view>

		<view class="height157"></view>
		<view
			class="addButton"
			@click="
				uni.navigateTo({
					url: '/pages/subSignature/signature'
				})
			"
		>
			创建签名
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			value: false
		};
	},
	onShow() {},
	methods: {}
};
</script>

<style lang="scss" scoped>
.addButton {
	position: fixed;
	width: 702rpx;
	height: 104rpx;
	border-radius: 188px;
	background: #01bb74;
	bottom: 100rpx;
	left: 24rpx;
	font-size: 36rpx;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
}
</style>
