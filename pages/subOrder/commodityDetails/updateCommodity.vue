<template>
	<view class="uploadingCommodity">
		<up-navbar :autoBack="true" :placeholder="true" :titleBold="true" :title="navbarTitle"></up-navbar>
		<view class="uploadingCommodityImg">
			<up-upload
				v-model:fileList="imgList"
				autoUpload
				autoDelete
				:autoUploadApi="action"
				autoUploadDriver="local"
				:maxCount="1"
				:maxSize="10485760"
				:showPreviewImage="true"
				:previewFullImage="true"
				:deletable="true"
				:showRetry="false"
				height="16vh"
				width="34vw"
			>
				<view class="flex-col items-center justify-center">
					<wd-icon name="add-circle1" color="#01BB74" size="50rpx" />
					<view class="mt15">添加图片</view>
				</view>
			</up-upload>
		</view>

		<view class="uploadingCommodityFrom">
			<view class="uploadingCommodityFromCardRow">
				<text class="sign">
					<text>*</text>
					<text class="name">品名</text>
				</text>
				<view class="uploadingCommodityFromCardRowInput">
					<uv-input type="text" v-model="uploadingCommodity.description" border="none" placeholder="请您填写商品名称" inputAlign="right"></uv-input>
				</view>
			</view>
			<view class="uploadingCommodityFromCardRow">
				<text class="sign">
					<text>*</text>
					<text class="name">规格</text>
				</text>
				<view class="uploadingCommodityFromCardRowInput">
					<uv-input type="text" v-model="uploadingCommodity.specification" border="none" placeholder="请输入" inputAlign="right"></uv-input>
				</view>
			</view>
			<view class="" v-if="!uni.$u.getPinia('user.customized')">
				<view class="uploadingCommodityFromCardRow">
					<text class="sign">
						<text>*</text>
						<text class="name">单位</text>
					</text>
					<view class="uploadingCommodityFromCardRowInput">
						<uv-input type="text" v-model="uploadingCommodity.unit" border="none" maxlength="10" placeholder="请输入" inputAlign="right"></uv-input>
					</view>
				</view>
				<view class="uploadingCommodityFromCardRow">
					<text class="sign">
						<text>*</text>
						<text class="name">单价</text>
					</text>
					<view class="uploadingCommodityFromCardRowInput">
						<uv-input type="digit" v-model="uploadingCommodity.unitPrice" border="none" maxlength="10" placeholder="请输入" inputAlign="right"></uv-input>
					</view>
				</view>
			</view>
			<view class="" v-if="uni.$u.getPinia('user.customized')">
				<view class="uploadingCommodityFromCardRow">
					<text class="sign">
						<text>*</text>
						<text class="name">型号</text>
					</text>
					<view class="uploadingCommodityFromCardRowInput">
						<uv-input type="text" v-model="uploadingCommodity.modelNo" border="none" placeholder="请输入" inputAlign="right"></uv-input>
					</view>
				</view>
				<view class="uploadingCommodityFromCardRow">
					<text class="sign">
						<text>*</text>
						<text class="name">长度(毫米)</text>
					</text>
					<view class="uploadingCommodityFromCardRowInput">
						<uv-input type="digit" v-model="uploadingCommodity.lengthMm" border="none" placeholder="请输入" inputAlign="right"></uv-input>
					</view>
				</view>
				<view class="uploadingCommodityFromCardRow">
					<text class="sign">
						<text>*</text>
						<text class="name">单重(kg/件)</text>
					</text>
					<view class="uploadingCommodityFromCardRowInput">
						<uv-input type="digit" v-model="uploadingCommodity.unitWeightKg" border="none" maxlength="10" placeholder="请输入" inputAlign="right"></uv-input>
					</view>
				</view>
			</view>
			<view class="uploadingCommodityFromCard">
				<text class="name">备注说明</text>
				<up-textarea v-model="uploadingCommodity.explainRemark" placeholder="请您在此处填写备注说明" border="none"></up-textarea>
			</view>
			<view class="flex-row justify-end items-center pr24 pt48" style="width: 100%">
				<text class="name mr24">置于商品库顶部</text>
				<up-switch size="20" active-color="#01BB74" v-model="uploadingCommodity.top"></up-switch>
			</view>
		</view>

		<view class="" style="position: fixed; bottom: 40rpx; width: 94%; justify-content: center; left: 3%; z-index: 10">
			<wd-button :customStyle="{ width: '100%' }" @click="uploadingCommodityAdd">保存</wd-button>
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
				modelNo: '', //型号
				lengthMm: '', //长度(毫米)
				unitWeightKg: '' //单重(kg/件)
			},
			getByID: {
				id: null,
				phone: '',
				staffNumber: ''
			},
			fileList: [],
			navbarTitle: '添加商品'
		};
	},
	onLoad(option) {
		if (option.id) {
			this.getByID.id = option.id;
			this.getCommodityDetails();
			this.navbarTitle = '修改商品';
		}
		if (uni.$u.getPinia('user.customized')) {
			this.uploadingCommodity.unit = '无';
			this.uploadingCommodity.unitPrice = 0;
		}
	},
	onShow() {
		this.action = uni.$http.config.baseURL + 'order/imgA';
	},
	methods: {
		getCommodityDetails(id) {
			this.getByID.staffNumber = this.pinia_user.phone;
			if (this.pinia_user.data.work == '0') {
				this.getByID.phone = this.pinia_user.phone;
			} else {
				this.getByID.phone = this.pinia_user.workData.bossNumber;
			}

			uni.$api.library
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

						this.imgList.push({
							url: this.uploadingCommodity.img === 'definde' ? 'https://res-oss.elist.com.cn/wxImg/order/emptyView.png' : this.uploadingCommodity.img,
							uploading: false,
							status: 'success',
							type: 'image'
						});
					}
				})
				.catch((res) => {
					console.log(res);
					this.$u.toast('获取失败');
				});
		},
		uploadingCommodityAdd() {
			console.log('添加', this.uploadingCommodity);

			if (this.uploadingCommodity.description == '') {
				this.$u.toast('请填写品名');
				return;
			}

			if (this.uploadingCommodity.description.length > 12) {
				this.$u.toast('品名不能超过12位');
				return;
			}

			if (this.uploadingCommodity.specification == '') {
				this.$u.toast('请填写规格');
				return;
			}
			if (this.uploadingCommodity.specification.length > 16) {
				this.$u.toast('规格不能超过16位');
				return;
			}

			if (!uni.$u.getPinia('user.customized')) {
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
			}

			// 定制化
			if (uni.$u.getPinia('user.customized')) {
				if (!this.uploadingCommodity.modelNo) {
					this.$u.toast('请填写型号');
					return;
				}
				if (!this.uploadingCommodity.lengthMm) {
					this.$u.toast('请填写长度');
					return;
				}
				if (!this.uploadingCommodity.unitWeightKg) {
					this.$u.toast('请填写单重');
					return;
				}
			}
			uni.showLoading({
				mask: true,
				title: '加载中'
			});
			var work = this.pinia_user.data.work == '0';
			if (work) {
				//没工作
				this.uploadingCommodity.phone = this.pinia_user.phone;
				this.uploadingCommodity.staffNumber = this.pinia_user.phone;
			} else {
				this.uploadingCommodity.phone = this.pinia_user.workData.bossNumber;
				this.uploadingCommodity.staffNumber = this.pinia_user.phone;
			}

			this.updMerchandiseInventory();
		},
		updMerchandiseInventory() {
			var that = this;
			if (this.imgList.length) {
				if (this.imgList[0].size) {
					this.updMerchandiseInventoryYes(that);
					return;
				} else {
					this.uploadingCommodity.img = this.imgList[0].url;
				}
			} else {
				this.uploadingCommodity.img = 'definde';
			}
			let subUrl = '';
			if (that.uploadingCommodity.id) {
				subUrl = uni.$api.library.updateCommodity; //编辑商品
			} else {
				subUrl = uni.$api.library.addCommodity; //添加商品
			}
			subUrl(that.uploadingCommodity)
				.then((res) => {
					uni.hideLoading();
					console.log('res', res);
					that.$u.toast(res.data.message);
					if (!that.uploadingCommodity.id) {
						that.setTip();
					}
					setTimeout(() => {
						if (res.data.code == 200) {
							uni.navigateBack();
						}
					}, 1000);
				})
				.catch((res) => {
					uni.hideLoading();
					that.$u.toast('获取失败');
				});
		},
		// 设置上个页面首次添加提示弹窗
		setTip() {
			// 获取上一个页面的值
			// 在当前页面中获取并修改上一页数据
			let pages = getCurrentPages(); // 获取当前页面栈
			console.log('pages', pages);
			if (pages.length > 1) {
				// 获取上一个页面实例
				let prevPage = pages[pages.length - 2];
				console.log('prevPage', prevPage);
				if (!prevPage.$vm.orderList.length) {
					// 修改上一页的数据
					prevPage.$vm.$set(prevPage.$vm, 'showTip', true);
					// 如果需要强制更新视图（某些特殊情况）
					prevPage.$vm.$forceUpdate();
				}
			}
		},
		updMerchandiseInventoryYes(that) {
			this.uploadingCommodity.imgId = 'QD' + new Date().getTime();

			uni.uploadFile({
				// url: uni.$http.config.baseURL + 'uploading/img',
				url: uni.$http.config.baseURL + 'uploading/uploadImage', //新上传接口
				header: {
					// phone: this.uploadingCommodity.staffNumber,
					// orderNumber: this.uploadingCommodity.imgId,
					// jobNumber: this.uploadingCommodity.staffNumber,
					Authorization: `Bearer ${this.pinia_token}`
				},
				filePath: this.imgList[0].url,
				name: 'file',
				formData: {
					imageType: 'goods',
					orderNumber: this.uploadingCommodity.imgId
				},
				success: (uploadFileRes) => {
					console.log('uploadFileRes.data', uploadFileRes.data);
					that.uploadingCommodity.img = uploadFileRes.data;
					let subUrl = '';
					if (that.uploadingCommodity.id) {
						subUrl = uni.$api.library.updateCommodity; //编辑商品
					} else {
						subUrl = uni.$api.library.addCommodity; //添加商品
					}
					subUrl(that.uploadingCommodity)
						.then((res) => {
							uni.hideLoading();
							that.$u.toast(res.data.message);
							if (!that.uploadingCommodity.id) {
								that.setTip();
							}
							setTimeout(() => {
								if (res.data.code == 200) {
									uni.navigateBack();
								}
							}, 1000);
						})
						.catch((res) => {
							uni.hideLoading();
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
	min-height: 100vh;
	padding-bottom: 150rpx;
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
