<template>
	<view class="uploadingCommodity">
		<up-navbar :autoBack="true" :placeholder="true" :titleBold="true" title="修改商品"></up-navbar>
		<view class="uploadingCommodityImg">
			<u-upload
				v-model:fileList="fileList"
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
			>
				<template #trigger>
					<view class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">
						<up-icon name="plus-circle-fill" color="#01BB74" size="50rpx" label="添加图片" label-pos="bottom" />
					</view>
				</template>
			</u-upload>
		</view>
		<view class="uploadingCommodityImg">
			<u-upload
				:custom-btn="true"
				:action="action"
				:file-list="fileList"
				:show-tips="false"
				@on-remove="onRemove"
				:before-upload="handleUpload"
				max-size="5242880"
				max-count="1"
				multiple
				del-bg-color="#565C62"
			>
				<view slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">
					<u-icon :marginTop="15" name="plus-circle-fill" color="#01BB74" size="50" label-pos="bottom" label="添加图片"></u-icon>
				</view>
			</u-upload>
		</view>

		<view class="uploadingCommodityFrom">
			<view class="uploadingCommodityFromCard">
				<text class="sign">
					*
					<text class="name">品名</text>
				</text>
				<u-input type="text" :modelValue="uploadingCommodity.description" border="none" placeholder="请您填写商品名称" />
			</view>
			<view class="uploadingCommodityFromCardRow">
				<text class="sign">
					*
					<text class="name">规格</text>
				</text>
				<view class="uploadingCommodityFromCardRowInput" style="width: 600rpx">
					<u-input type="text" :modelValue="uploadingCommodity.specification" border="none" placeholder="请输入" :custom-style="customStyle" />
				</view>
			</view>
			<view class="uploadingCommodityFromCardRow">
				<text class="sign">
					*
					<text class="name">单位</text>
				</text>
				<view class="uploadingCommodityFromCardRowInput" style="width: 600rpx">
					<u-input type="text" :modelValue="uploadingCommodity.unit" border="none" maxlength="10" placeholder="请输入" :custom-style="customStyle" />
				</view>
			</view>
			<view class="uploadingCommodityFromCardRow">
				<text class="sign">
					*
					<text class="name">单价</text>
				</text>
				<view class="uploadingCommodityFromCardRowInput" style="width: 600rpx">
					<u-input type="digit" :modelValue="uploadingCommodity.unitPrice" border="none" maxlength="10" placeholder="请输入" :custom-style="customStyle" />
				</view>
			</view>
			<view class="uploadingCommodityFromCard">
				<text class="name">备注说明</text>
				<u-input :modelValue="uploadingCommodity.explainRemark" type="textarea" border="none" placeholder="请输入" />
			</view>
			<view class="flex-row justify-end items-center pr24 pt48" style="width: 100%">
				<text class="name mr24">置于商品库顶部</text>
				<u-switch size="35" active-color="#01BB74" v-model="uploadingCommodity.top"></u-switch>
			</view>
		</view>

		<view class="" style="position: absolute; bottom: 40rpx; width: 94%; justify-content: center; left: 3%">
			<u-button type="primary" hover-class="none" :custom-style="{ backgroundColor: '#01BB74' }" class="form-btn-big" @click="uploadingCommodityAdd" shape="circle">
				保存
			</u-button>
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
			fileList: [],
			imgList: [],
			uploadingCommodity: {
				description: '',
				specification: '',
				unit: '',
				quantity: 0,
				unitPrice: 0,
				top: false,
				phone: '',
				staffNumber: '',
				imgId: '',
				img: 'definde'
			},
			customStyle: {
				textAlign: 'right'
			},
			getByID: {
				id: null,
				phone: '',
				staffNumber: ''
			}
		};
	},
	onLoad(option) {
		this.getByID.id = option.id;
		this.getCommodityDetails();
	},
	onShow() {
		this.action = this.$u.http.config.baseUrl + '/edo/order/imgA';
	},
	methods: {
		onRemove(e, list) {
			console.log('===e===>', e);
			console.log('===list===>', list);
			this.fileList = list;
		},
		getCommodityDetails(id) {
			this.getByID.staffNumber = this.vuex_user.phone;
			if (this.vuex_user.data.work == '0') {
				this.getByID.phone = this.vuex_user.phone;
			} else {
				this.getByID.phone = this.vuex_user.workData.bossNumber;
			}

			this.$api.library
				.getCommodityById(this.getByID)
				.then((res) => {
					this.uploadingCommodity = res.data.data;
					if (this.uploadingCommodity.unitPrice <= 0) {
						this.uploadingCommodity.unitPrice = '';
					}

					if (this.uploadingCommodity.img != null && this.uploadingCommodity.img != undefined && this.uploadingCommodity.img != 'definde') {
						if (this.uploadingCommodity.top == null) {
							this.uploadingCommodity.top = false;
						}

						this.fileList.push({
							url: this.uploadingCommodity.img === 'definde' ? 'https://res-oss.elist.com.cn/wxImg/order/emptyView.png' : this.uploadingCommodity.img,
							uploading: false
						});
					}
				})
				.catch((res) => {
					console.log(res);
					this.$u.toast('获取失败');
				});
		},
		handleUpload(e, list) {
			this.imgList = list;
			console.log(this.imgList);
		},
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

			if (this.uploadingCommodity.unit == '') {
				this.$u.toast('请填写单位');
				return;
			}

			if (this.uploadingCommodity.unitPrice == '') {
				this.$u.toast('请填写单价');
				return;
			}

			if (this.uploadingCommodity.unitPrice <= 0) {
				this.$u.toast('单价要大于0');
				return;
			}

			const strValue = String(this.uploadingCommodity.unitPrice);
			const regex = /^\d+(\.\d+)?$/;
			var num = regex.test(strValue);
			if (!num) {
				this.$u.toast('请填写正确单价');
				return;
			}

			var work = this.vuex_user.data.work == '0';
			if (work) {
				//没工作
				this.uploadingCommodity.phone = this.vuex_user.phone;
				this.uploadingCommodity.staffNumber = this.vuex_user.phone;
			} else {
				this.uploadingCommodity.phone = this.vuex_user.workData.bossNumber;
				this.uploadingCommodity.staffNumber = this.vuex_user.phone;
			}

			this.updMerchandiseInventory();
		},
		updMerchandiseInventory() {
			var that = this;

			if ((this.imgList.uploading == undefined && this.imgList.length > 0) || (this.imgList.uploading == null && this.imgList.length > 0)) {
				this.updMerchandiseInventoryYes(that);
			} else {
				if (this.imgList.length <= 0 && this.uploadingCommodity.img != 'definde' && this.fileList.length <= 0) {
					this.uploadingCommodity.img = 'definde';
				}

				that.$api.library
					.updateCommodity(that.uploadingCommodity)
					.then((res) => {
						console.log(res);
						that.$u.toast(res.data.message);
						if (res.data.data == '1') {
							uni.navigateBack();
						}
					})
					.catch((res) => {
						that.$u.toast('获取失败');
					});
			}
		},
		updMerchandiseInventoryYes(that) {
			this.uploadingCommodity.imgId = 'QD' + new Date().getTime();

			uni.uploadFile({
				url: this.$u.http.config.baseUrl + '/edo/uploading/img',
				header: {
					phone: this.uploadingCommodity.staffNumber,
					orderNumber: this.uploadingCommodity.imgId,
					jobNumber: this.uploadingCommodity.staffNumber,
					token: this.vuex_user.loginToken
				},
				filePath: this.imgList[0].file.path,
				name: 'file',
				formData: {
					imageType: '1'
				},
				success: (uploadFileRes) => {
					console.log(uploadFileRes.data);
					that.uploadingCommodity.img = uploadFileRes.data;
					that.$api.library
						.updateCommodity(that.uploadingCommodity)
						.then((res) => {
							console.log(res);
							that.$u.toast(res.data.message);
							if (res.data.data == '1') {
								uni.navigateBack();
							}
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
.uploadingCommodity {
	width: 100vw;
	height: 100vh;

	.uploadingCommodityImg {
		background: rgba(244, 244, 244, 0.5);
		margin-left: 24rpx;
		// margin-right: 24rpx;
		margin-top: 24rpx;
		height: 16vh;
		width: 34vw;
		border-radius: 12rpx;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
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
