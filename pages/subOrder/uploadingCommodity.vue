<template>
	<view class="uploadingCommodity">
		<up-navbar :autoBack="true" :placeholder="true" :titleBold="true" title="添加商品"></up-navbar>
		<view class="uploadingCommodityImg">
			<u-upload
				v-model:fileList="imgList"
				autoUpload
				autoDelete
				:autoUploadApi="action"
				autoUploadDriver="local"
				:maxCount="1"
				:maxSize="9999999"
				:showPreviewImage="true"
				:previewFullImage="true"
				:deletable="true"
				:showRetry="false"
				height="16vh"
				width="34vw"
			>
				<view class="">
					<u-icon name="plus-circle-fill" space="16rpx" color="#01BB74" size="50rpx" label="添加图片" labelPos="bottom" />
				</view>
			</u-upload>
		</view>

		<view class="uploadingCommodityFrom">
			<view class="uploadingCommodityFromCardRow">
				<text class="sign">
					<text>*</text>
					<text class="name">品名</text>
				</text>
				<view class="uploadingCommodityFromCardRowInput" style="width: 400rpx">
					<uv-input
						type="text"
						v-model="uploadingCommodity.description"
						:customStyle="customStyle"
						inputAlign="right"
						border="none"
						:clearable="true"
						placeholder="请您填写商品名称"
					></uv-input>
				</view>
			</view>
			<view class="uploadingCommodityFromCardRow">
				<text class="sign">
					<text>*</text>
					<text class="name">规格</text>
				</text>
				<view class="uploadingCommodityFromCardRowInput" style="width: 400rpx">
					<uv-input
						type="text"
						v-model="uploadingCommodity.specification"
						placeholder="请输入"
						:customStyle="customStyle"
						border="none"
						inputAlign="right"
						:clearable="true"
					></uv-input>
				</view>
			</view>
			<view class="uploadingCommodityFromCardRow">
				<text class="sign">
					<text>*</text>
					<text class="name">单位</text>
				</text>
				<view class="uploadingCommodityFromCardRowInput" style="width: 400rpx">
					<uv-input
						type="text"
						v-model="uploadingCommodity.unit"
						maxlength="10"
						placeholder="请输入"
						:customStyle="customStyle"
						border="none"
						inputAlign="right"
						:clearable="true"
					></uv-input>
				</view>
			</view>
			<view class="uploadingCommodityFromCardRow">
				<text class="sign">
					<text>*</text>
					<text class="name">单价</text>
				</text>
				<view class="uploadingCommodityFromCardRowInput" style="width: 400rpx">
					<uv-input
						v-model="uploadingCommodity.unitPrice"
						type="digit"
						maxlength="10"
						placeholder="请输入"
						:customStyle="customStyle"
						border="none"
						inputAlign="right"
						:clearable="true"
					></uv-input>
				</view>
			</view>
			<view class="uploadingCommodityFromCard">
				<text class="name">备注说明</text>
				<u-textarea v-model="uploadingCommodity.explainRemark" placeholder="请您在此处填写备注说明" border="none"></u-textarea>
			</view>
			<view class="flex-row justify-end items-center pr24 pt48" style="width: 100%">
				<text class="name mr24">置于商品库顶部</text>
				<u-switch size="25" active-color="#01BB74" v-model="uploadingCommodity.top"></u-switch>
			</view>
		</view>

		<view class="" style="position: absolute; bottom: 40rpx; width: 94%; justify-content: center; left: 3%">
			<u-button type="primary" hover-class="none" color="#01BB74" class="form-btn-big" @click="uploadingCommodityAdd" shape="circle">保存</u-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			checked: false,
			presentPicture: 'https://res-oss.elist.com.cn/wxImg/cs.png',
			action: '',
			imgList: [],
			uploadingCommodity: {
				description: '',
				specification: '',
				unit: '',
				quantity: 0,
				unitPrice: '',
				top: false,
				phone: '',
				staffNumber: '',
				imgId: '',
				img: 'definde',
				explainRemark: '',
				id: ''
			},
			type: true,
			check: true
		};
	},
	onShow() {
		this.action = uni.$http.config.baseURL + 'order/imgA';
	},
	methods: {
		uploadingCommodityAdd() {
			console.log('添加', this.uploadingCommodity);

			if (this.uploadingCommodity.description == '') {
				this.$u.toast('请填写品名');
				return;
			}

			if (this.uploadingCommodity.description.length > 7) {
				this.$u.toast('品名不能超过7位');
				return;
			}

			if (this.uploadingCommodity.specification == '') {
				this.$u.toast('请填写规格');
				return;
			}

			if (this.uploadingCommodity.specification.length > 12) {
				this.$u.toast('规格不能超过12位');
				return;
			}

			if (this.uploadingCommodity.unit == '') {
				this.$u.toast('请填写单位');
				return;
			}

			if (this.uploadingCommodity.unitPrice <= 0 || this.uploadingCommodity.unitPrice == '') {
				this.$u.toast('请填写单价');
				return;
			}

			const strValue = String(this.uploadingCommodity.unitPrice);
			const regex = /^\d+(\.\d+)?$/;
			var num = regex.test(strValue);
			if (!num) {
				this.$u.toast('请填写正确单价');
				return;
			}

			if (this.uploadingCommodity.unit.length > 5) {
				this.$u.toast('单位不能超过5位');
				return;
			}

			var work = this.pinia_user.data.work == '0';
			if (work) {
				//没工作
				this.uploadingCommodity.phone = this.pinia_user.phone;
				this.uploadingCommodity.staffNumber = this.pinia_user.phone;
			} else {
				this.uploadingCommodity.phone = this.pinia_user.workData.bossNumber;
				this.uploadingCommodity.staffNumber = this.pinia_user.phone;
			}

			this.addMerchandiseInventory(this.type);
		},
		addMerchandiseInventory(type) {
			if (!type) {
				//修改
				this.$u.toast('修改');
			}

			var that = this;

			if (this.imgList.length > 0) {
				if (this.check) {
					this.check = false;
					this.addMerchandiseInventoryYes(that);
				} else {
					that.$u.toast('请勿重复点击');
					return;
				}
			} else {
				if (this.check) {
					this.check = false;
					uni.$api.library
						.addCommodity(this.uploadingCommodity)
						.then((res) => {
							console.log(res);
							this.$u.toast(res.data.message);
							if (res.data.data > 0) {
								this.uploadingCommodity.id = res.data.data;
								this.$u.toast('添加成功');
								setTimeout(function () {
									// this.check = true
									uni.navigateBack();
								}, 500);
							} else {
								this.$u.toast(res.data.message);
								this.check = true;
							}
						})
						.catch((res) => {
							this.$u.toast('获取失败');
						});
				} else {
					this.$u.toast('请勿重复点击');
					return;
				}
			}
		},
		addMerchandiseInventoryYes(that) {
			this.uploadingCommodity.imgId = 'QD' + new Date().getTime();
			console.log('this.imgList', this.imgList);
			uni.uploadFile({
				url: uni.$http.config.baseURL + 'uploading/img',
				header: {
					phone: this.uploadingCommodity.staffNumber,
					orderNumber: this.uploadingCommodity.imgId,
					jobNumber: this.uploadingCommodity.staffNumber,
					token: this.pinia_token
				},
				// filePath: this.imgList[0].file.path,
				filePath: this.imgList[0].url,
				name: 'file',
				formData: {
					imageType: '1'
				},
				success: (uploadFileRes) => {
					console.log(uploadFileRes.data);
					that.uploadingCommodity.img = uploadFileRes.data;
					that.$api.library
						.addCommodity(that.uploadingCommodity)
						.then((res) => {
							console.log(res);
							that.$u.toast(res.data.message);
							if (res.data.data > 0) {
								that.uploadingCommodity.id = res.data.data;
								that.$u.toast('添加成功');
								setTimeout(function () {
									uni.navigateBack();
								}, 500);
							} else {
								that.$u.toast(res.data.message);
								this.check = true;
							}
							this.check = true;
						})
						.catch((res) => {
							that.$u.toast('获取失败');
						});
				}
			});
		}
	}
};
</script>

<style lang="scss">
.u-upload__wrap {
	justify-content: center !important;
}
.u-textarea {
	background-color: transparent !important;
	padding: 20rpx 0 !important;
}
.uploadingCommodity {
	width: 100vw;
	height: 100vh;

	.uploadingCommodityImg {
		position: relative;
		background: rgba(244, 244, 244, 0.5);
		margin-left: 24rpx;
		margin-top: 24rpx;
		height: 248rpx;
		width: 248rpx;
		border-radius: 12rpx;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		text-align: center;

		.slot-btn {
			position: absolute;
			width: 248rpx;
			height: 248rpx;
			top: 0rpx;
			display: flex;
			justify-content: center;
			border-radius: 12rpx;
		}
		.slot-btn__hover {
			background-color: #e8f5f0;
		}
	}

	.uploadingCommodityFrom {
		display: flex;
		flex-direction: column;
		width: 100%;

		.uploadingCommodityFromCard {
			background: rgba(244, 244, 244, 0.5);
			margin-left: 24rpx;
			margin-right: 24rpx;
			padding: 24rpx;
			margin-top: 24rpx;
		}

		.uploadingCommodityFromCardRow {
			display: flex;
			flex-direction: row;
			align-items: center;
			background: rgba(244, 244, 244, 0.5);
			margin-left: 24rpx;
			margin-right: 24rpx;
			padding: 24rpx;
			margin-top: 24rpx;

			position: relative;

			.uploadingCommodityFromCardRowInput {
				position: absolute;
				right: 24rpx;
			}
		}
	}
}

.sign {
	color: red;

	.name {
		color: black;
		margin-left: 6rpx;
	}
}
</style>
