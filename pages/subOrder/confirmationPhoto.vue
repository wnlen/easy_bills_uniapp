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
			action: '',
			orderNumber: '',
			orderId: '',
			post: {},
			qsrList: [] //签收人列表
		};
	},
	onLoad(option) {
		this.orderId = option.orderId;
		this.orderNumber = option.orderNumber;
		this.getDetail();
		this.action = uni.$http.config.baseURL + 'order/imgA';
	},
	methods: {
		getDetail() {
			uni.$api.order
				.getOrderById({
					orderId: this.orderId
				})
				.then((res) => {
					this.post = res.data.data.post;
				})
				.catch((res) => {});
			uni.$api.sign
				.getSignature({
					phone: this.pinia_user.phone
				})
				.then((res) => {
					this.qsrList = res.data.data;
				});
		},
		onConfirm() {
			if (!this.imgList.length) {
				return uni.showToast({
					icon: 'none',
					title: '请上传照片'
				});
			}
			uni.showLoading({
				mask: true,
				title: '加载中'
			});
			// 上传单子图片
			uni.uploadFile({
				url: uni.$http.config.baseURL + 'uploading/uploadImage', //新上传接口
				header: {
					Authorization: `Bearer ${this.pinia_token}`
				},
				filePath: this.imgList[0].url,
				name: 'file',
				formData: {
					imageType: 'order_selfie',
					orderNumber: this.orderNumber
				},
				success: (uploadFileRes) => {
					// 单子绑定图片
					uni.$api.customization
						.customizationOrderSelfie({ orderId: this.orderId, selfieUrl: uploadFileRes.data })
						.then((res) => {
							if (res.data.code == 200) {
								// 确认收货
								this.updateOrder();
							}
						})
						.catch((res) => {
							uni.hideLoading();
							that.$u.toast('获取失败');
						});
				}
			});
		},
		updateOrder() {
			var that = this;
			var send = this.post;
			var qm = this.qsrList[0];
			send.signatureImg = qm.signatureImg;
			send.signaturePhone = qm.phone;
			send.signatureName = qm.name;
			send.paymentState = '1';

			uni.$api.order
				.signForOrder(send)
				.then((res) => {
					uni.hideLoading();
					if (res.data == '9') {
						this.$u.toast('该单据已签收');
					} else if (res.data.code == 200) {
						this.$u.toast(res.data.message);
						setTimeout(() => {
							if (res.data.code == 200) {
								uni.navigateBack();
							}
						}, 1000);
					}
				})
				.catch((res) => {
					uni.hideLoading();
					this.$u.toast('签收失败~');
				});
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
