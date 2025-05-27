<template>
	<u-popup mode="center" v-model="show" :border-radius="10">
		<view class="bossCiew" style="width: 100%;height: 100%;">
			<scroll-view scroll-y="true" class="detail">
				<view class="detailTitleHand"> {{popupShowText.headline}}</view>
				<view class="detailTitle" style="" v-for="(item,index) in popupShowText.bodyList" :key="index">
					{{item}}
				</view>
			</scroll-view>
		</view>
	</u-popup>

</template>

<script>
	export default {
		props: {},
		name: "pop-details",
		data() {
			return {
				show: false,
				popupShowText: {},
				type: 1
			};
		},
		methods: {

		}

	}
</script>

<style scoped lang="scss">
	// 隐藏滚动条 vue3写法
	::v-deep ::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
	}

	.detail {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		// background-color: red;

		width: 250px;
		height: 350px;

		padding-left: 24rpx;
		padding-right: 24rpx;


		.detailTitleHand {
			font-size: 17px;
			color: #333333;
			text-align: center;
			margin-bottom: 24rpx;
			margin-top: 24rpx;
		}

		.detailTitle {
			font-size: 14px;
			font-weight: normal;
			line-height: 23px;
			letter-spacing: 0px;
			color: #999999;
			margin-bottom: 12rpx;
		}

		.detailEnd {
			font-size: 14px;
			color: #999999;
			letter-spacing: 0.1em;
			padding-bottom: 24rpx;
		}
	}
</style>