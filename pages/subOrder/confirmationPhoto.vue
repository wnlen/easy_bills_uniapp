<template>
	<view class="contents">
		<view class="radius12 bg-white upBox">
			<view class="ft30 mb30 ft-bold">上传照片</view>
			<view class="">
				<wd-upload v-model:file-list="imgList" :upload-text="'请您上传一张照片'" :show-limit-num="false" :limit="1" image-mode="aspectFill" :action="action"></wd-upload>
			</view>
		</view>
		<wd-button :customStyle="{ width: '100%' }" @click="onConfirm">确认</wd-button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			imgList: [],
			action: ''
		};
	},
	onLoad() {
		this.action = uni.$http.config.baseURL + 'order/imgA';
	},
	methods: {
		onConfirm() {
			console.log(this.imgList);
		}
	}
};
</script>

<style lang="scss" scoped>
.contents {
	background: #f6f7f7;
	min-height: 100vh;
	padding: 30rpx 24rpx 0 24rpx;
}

.upBox {
	padding: 36rpx 24rpx 72rpx 24rpx;
	margin-bottom: 50rpx;
}

::v-deep .wd-upload__evoke,
::v-deep .wd-upload__preview {
	border-radius: 6px !important;
	width: 400rpx !important;
	height: 400rpx !important;
}
::v-deep .wd-upload__picture {
	border-radius: 6px !important;
}
</style>
