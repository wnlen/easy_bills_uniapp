<template>
	<view class="receiptFrom">
		<view class="FROMBill" v-if="FROMBShow">
			<view class="HandFrom">
				<view class="FromTitle">开具信息</view>
				<view class="FromInput u-border-bottom">
					<text class="textcolor">订单编号:</text>
					<view class="ml15 flex-1 u-line-1 endcolor" :style="{ color: '#F76565' }">
						{{ billFrom.billNumber }}
					</view>
				</view>
				<view class="FromInput u-border-bottom">
					<text class="textcolor" v-if="pinia_userRole == 'D'">客户名称:</text>
					<text class="textcolor" v-if="pinia_userRole == 'R'">供应商名称:</text>
					<view class="ml15 flex-1 u-line-1 endcolor" :style="{ color: '#333333' }">
						{{ billEnterprise }}
					</view>
				</view>
				<view class="FromInput">
					<text class="textcolor">开具日期:</text>
					<view class="ml15 flex-1 u-line-1 endcolor" :style="{ color: '#333333' }">
						{{ billFrom.billTime }}
					</view>
				</view>
			</view>
			<view class="FromPrice">
				<view class="FromTitle">开具金额</view>
				<view class="FromInput u-border-bottom">
					<text class="textcolor">总金额:</text>
					<input
						:value="parseFloat(billFrom.billPrice).toFixed(2)"
						disabled
						placeholder-class="placeholder_class"
						type="text"
						:style="{ color: '#333333' }"
						maxlength="11"
						placeholder="请获取总金额"
						class="ml15 flex-1 u-line-1 endcolor"
					/>
					<text>元</text>
				</view>
				<view class="FromInput u-border-bottom" v-if="pinia_userRole == 'D'">
					<text class="textcolor">折扣率:</text>
					<input
						placeholder-class="placeholder_class"
						@input="billAfterPriceCount"
						type="number"
						v-model="billFrom.billDiscountPrice"
						:style="{ color: '#333333' }"
						maxlength="3"
						placeholder="请输入折扣率"
						class="ml15 flex-1 u-line-1 endcolor"
					/>
					<text>%</text>
				</view>
				<view class="FromInput">
					<text class="textcolor" v-if="pinia_userRole == 'D'">应收金额:</text>
					<text class="textcolor" v-if="pinia_userRole == 'R'">应付金额:</text>
					<input
						placeholder-class="placeholder_class"
						type="number"
						disabled
						v-model="billFrom.billAfterPrice"
						:style="{ color: '#333333' }"
						maxlength="11"
						placeholder="请输入折扣计算金额"
						class="ml15 flex-1 u-line-1 endcolor"
					/>
					<text>元</text>
				</view>
			</view>

			<view class="FromFile">
				<view class="FromFileTitle">添加图片</view>
				<view class="recently-cat flex-row flex-wrap" style="width: 95%">
					<up-upload
						autoDelete
						autoUploadDriver="local"
						v-model:fileList="imgFileList"
						:maxSize="10485760"
						:maxCount="3"
						width="100"
						height="100"
						multiple
						:previewFullImage="true"
						@afterRead="handleUpload"
					>
						<up-icon :name="ImgUrl + '/wxImg/order/down.png'" size="200rpx"></up-icon>
					</up-upload>
					<!-- <up-upload
						:custom-btn="true"
						:action="action"
						:show-retry="false"
						:file-list="imgFileList"
						:show-tips="false"
						:before-upload="handleUpload"
						max-size="10485760"
						max-count="3"
						multiple
						@on-remove="moveImgFileList"
						del-bg-color="#e9e9e9"
					>
						<view slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">
							<up-icon :name="ImgUrl + '/wxImg/order/down.png'" size="200"></up-icon>
						</view>
					</up-upload> -->
				</view>
				<view class="FromFileTitle">上传附件</view>
				<view class="FilePdfList">
					<pop-file :fileList="fileList"></pop-file>
				</view>

				<!-- #ifdef MP-WEIXIN -->
				<view v-if="fileList.length < 3" class="uploadView" @click="uploadFile">
					<up-icon labelColor="#01BB74" labelPos="bottom" label="点击上传" :name="ImgUrl + '/wxImg/order/fjUpload.svg'" size="100rpx"></up-icon>
				</view>
				<!-- #endif -->
				<!-- #ifdef APP -->
				<view class="uploadView" @click="chooseFile">
					<up-icon labelColor="#01BB74" labelPos="bottom" label="点击上传" :name="ImgUrl + '/wxImg/order/fjUpload.svg'" size="100rpx"></up-icon>
				</view>
				<!-- #endif -->

				<view class="FromFileTitle">备注说明</view>
				<view class="FromFileTitleRemark" style="height: 100%">
					<!-- <uv-input
						type="textarea"
						border="none"
						placeholder="请填写备注，字数不超过50字"
						v-model="billFrom.billRemark"
						placeholderClass="placeholder_class"
						maxlength="50"
					></uv-input> -->
					<u-textarea border="none" v-model="billFrom.billRemark" placeholder="请填写备注，字数不超过50字" autoHeight></u-textarea>
				</view>
			</view>

			<view class="FromOwn">
				<view class="OwnText">
					<view class="OwnTextFromTitle">企业名称</view>
					<text class="OwnTextFromText" v-if="pinia_user.data.work == '0'">
						{{ pinia_user.ac?.enterpriseName || pinia_user.phone }}
					</text>
					<text class="OwnTextFromText" v-else>
						{{ pinia_user.ac?.enterpriseName || pinia_user.workData.bossNumber }}
					</text>
				</view>
				<view class="OwnText">
					<view class="OwnTextFromTitle">联系人</view>
					<text class="OwnTextFromText">{{ pinia_user.data.name || pinia_user.phone || pinia_user.data.phone }}</text>
				</view>
				<view class="OwnText">
					<view class="OwnTextFromTitle">联系电话</view>
					<text class="OwnTextFromText">{{ pinia_user.phone || pinia_user.data.phone }}</text>
				</view>
			</view>

			<view class="sendBill">
				<!-- #ifdef MP-WEIXIN -->
				<up-button type="primary" class="form-btn-big" hover-class="none" color="#01BB74" @click="sendOrder(true)" shape="circle">
					{{ pinia_userRole == 'D' ? '发送收款单' : '发送付款单' }}
				</up-button>
				<!-- #endif -->
				<!-- #ifdef APP -->
				<up-button type="primary" class="form-btn-big" hover-class="none" color="#01BB74" @click="sendOrder(false)" shape="circle">
					{{ pinia_userRole == 'D' ? '发送收款单' : '发送付款单' }}
				</up-button>
				<!-- #endif -->
			</view>
		</view>

		<view class="BillSuccess" v-if="!FROMBShow">
			<view class="" style="width: 60vw; height: 21vh">
				<up-image style="" width="100%" height="100%" :show-menu-by-longpress="false" src="https://res-oss.elist.com.cn/wxImg/order/fscg.png"></up-image>
			</view>
			<view class="text-center mt20" style="color: #01bb74; font-size: 34rpx; font-weight: bold; width: 100%">发送成功!</view>
			<view class="text-center mt10" style="color: #aaaaaa; font-size: 26rpx; font-weight: normal">
				{{ pinia_userRole == 'R' ? '付款单已发送给发货人' : '收款单已发送给收货人' }}
			</view>
			<view class="flex-row justify-center items-center mt40">
				<button style="" class="BillReturnBtn" @click="ContinueBilling">返回列表</button>
			</view>
		</view>
	</view>
</template>

<script>
import chooseFile from '@/common/file.js';
export default {
	data() {
		return {
			billFrom: {
				billList: [],
				billNumber: '',
				sourcePhone: '',
				receptionPhone: '',
				billTime: '',
				billPrice: 0,
				billDiscountPrice: null,
				billAfterPrice: 0,
				billFile: '',
				billRemark: '',
				billVoucher: '1',
				billOperator: '32',
				billState: '0',
				billEnterpriseS: '',
				billEnterpriseE: '',
				billLinkman: '33',
				billPhone: '',
				orders: '',
				type: '0',
				createTime: '',
				updateTime: '',
				fileAliList: [],
				imgAliList: [],
				imgUploading: [],
				fileUploading: [],
				searchJson: '',
				workPhone: ''
			},
			billEnterprise: '',
			action: '',
			fileList: [],
			imgFileList: [],
			consignee: {},
			FROMBShow: true,
			searchJson: {},
			checkSend: true
		};
	},
	onLoad(option) {
		console.log('参数：', option);
		var data = JSON.parse(option.data);
		var searchJson = JSON.parse(option.searchJson);

		this.consignee = data;
		this.searchJson = searchJson;

		this.billFrom.billPrice = data.price;
		this.billFrom.billAfterPrice = data.price.toFixed(2);

		var port = this.pinia_userRole == 'R';
		if (port) {
			this.billFrom.billEnterpriseS = data.nameE;
			this.billFrom.billEnterpriseE = data.nameS;
			this.billEnterprise = this.billFrom.billEnterpriseE;
			this.billFrom.receptionPhone = data.phoneS;
			this.billFrom.sourcePhone = data.phoneE;
		} else {
			this.billFrom.billEnterpriseS = data.nameS;
			this.billFrom.billEnterpriseE = data.nameE;
			this.billEnterprise = this.billFrom.billEnterpriseE;
			this.billFrom.receptionPhone = data.phoneE;
			this.billFrom.sourcePhone = data.phoneS;
		}
		this.billFrom.orders = JSON.stringify(data.list);
		this.billFrom.billList = data.list;

		this.billFrom.workPhone = this.pinia_user.phone;
	},
	onShow() {
		if (this.pinia_userRole == 'D') {
			uni.setNavigationBarTitle({
				title: '收款单开具'
			});
		} else {
			uni.setNavigationBarTitle({
				title: '付款单开具'
			});
		}
		this.Init();
	},
	methods: {
		chooseFile() {
			chooseFile((path) => {
				console.log('111111111', path);
				uni.getFileInfo({
					//读取文件大小
					filePath: path,
					success: (res) => {
						console.log('11111111', res);
						const binSize = res.size;
						console.log('size', binSize);
						console.log('size', path.split('.')[path.split('.').length - 1]);
						var dx = {
							type: path.split('.')[path.split('.').length - 1],
							name: path,
							size: binSize,
							path: path,
							http: false
						};
						this.fileList.push(dx);
						console.log(this.fileList);
					},
					fail: (err) => {
						console.log('222222222', err);
					}
				});
			});
		},
		ContinueBilling() {
			uni.navigateBack();
		},
		moveImgFileList(index, lists) {
			console.log(index, lists);
			this.imgFileList = lists;
		},
		Init() {
			this.action = uni.$http.config.baseURL + 'order/imgA';
			this.billFrom.billTime = this.$u.timeFormat(new Date(), 'yyyy-mm-dd');
			this.getOrderNumber();

			var ifwork = this.pinia_user.data.work == '0';
			var ifWorkPort = this.pinia_userRole == 'R';
			if (!ifwork) {
				var boss = this.pinia_user.workData.bossNumber;
				this.billFrom.billPhone = boss;
			} else {
				this.billFrom.billPhone = this.pinia_user.phone;
			}
		},
		async sendOrder(app) {
			//文件上传
			// this.fileList.forEach(res => {
			// 	this.UploadFilePdf(res.path, this.billFrom.billNumber, true)
			// })

			// this.imgFileList.forEach(res => {
			// 	this.UploadFilePdf(res.url, this.billFrom.billNumber, false)
			// })

			// console.log(this.fileList);
			// console.log(this.imgFileList);
			if (this.billFrom.billRemark > 50) {
				return this.$u.toast('备注内容不能超过50字');
			}

			if (this.checkSend) {
				this.checkSend = false;
				for (const res of this.fileList) {
					const url = await this.UploadFilePdf(res.path, this.billFrom.billNumber, true, res.size, app);
					this.billFrom.fileUploading.push({
						file: url.file,
						size: url.size
					});
				}

				// 图片文件上传
				for (const res of this.imgFileList) {
					const url = await this.UploadFilePdf(res.url, this.billFrom.billNumber, false, res.size, app);
					this.billFrom.imgUploading.push({
						file: url.file,
						size: url.size
					});
				}

				if (this.billFrom.billDiscountPrice == null) {
					this.billFrom.billDiscountPrice = 0;
				}

				this.billFrom.searchJson = JSON.stringify(this.searchJson);

				this.billFrom.type = this.pinia_userRole == 'D' ? 1 : 0;

				console.log('this.billFrom:', this.billFrom);
				let billFromData = JSON.parse(JSON.stringify(this.billFrom));
				billFromData.billTime = billFromData.billTime + ' 00:00:00';
				uni.$api.bills.addBill(billFromData).then((res) => {
					this.checkSend = true;
					this.$u.toast(res.data.message);
					if (res.data.code == 200) {
						setTimeout(() => {
							uni.navigateBack();
						}, 1200);
					} else {
						// var data = res.data.data;
						// var mes = res.data.message;
						// this.$u.toast(mes);
						// this.FROMBShow = false;
					}
				});
			} else {
				this.$u.toast('请勿频繁点击~');
			}

			// UploadFilePdf
			//订单保存
			//结果反馈 实时刷新
		},
		getOrderNumber() {
			// billNumber
			uni.$api.bills.generateBillNumber().then((res) => {
				console.log('编号', res);
				this.billFrom.billNumber = res.data.data;
			});
		},
		billAfterPriceCount(e) {
			var prc = Number(e.detail.value);

			if (prc > 50) {
				this.billFrom.billAfterPrice = 0;
				this.billFrom.billDiscountPrice = null;
				this.billFrom.billAfterPrice = this.billFrom.billPrice;
				uni.showToast({
					title: '折扣率不能超过50%',
					icon: 'none'
				});
				return;
			}

			this.billFrom.billAfterPrice = (this.billFrom.billPrice * (1 - prc / 100)).toFixed(2);
		},
		handleUpload(res) {
			console.log('this.imgFileList', res);
			this.imgFileList = res.file;
		},
		uploadFile() {
			console.log('上传');
			var that = this;
			// #ifdef MP-WEIXIN
			uni.chooseMessageFile({
				count: 1,
				sizeType: ['original', 'compressed'],
				extension: ['doc', 'docx', 'pdf', 'pptx', 'ppt', 'xls', 'xlsx'],
				sourceType: ['album'],
				success(res) {
					console.log('选择的文件', res);

					var FileVerify = that.UploadFileVerify(res);
					var FileVerifySize = that.FileVerifySize(res);
					if (FileVerifySize) {
						uni.showToast({
							title: '单个文件不能超过5M',
							icon: 'none'
						});
						return;
					}
					if (FileVerify) {
						console.log();
						//size  name  path
						var file = res.tempFiles[0];
						var dx = {
							type: that.FileType(res),
							name: file.name,
							size: file.size,
							path: file.path,
							http: false
						};
						that.fileList.push(dx);
						// that.UploadFilePdf(res);
					} else {
						uni.showToast({
							title: '格式错误',
							icon: 'none'
						});
					}

					//  //选择成功之后上传
				}
			});
			// #endif

			// #ifdef APP
			this.appGetFile();
			// #endif
		},
		appGetFile() {
			uni.uploadFile();
		},
		UploadFileVerify(res) {
			var name = res.tempFiles[0].name;
			var suffix = name.split('.')[1];
			var file =
				suffix == 'xls' ||
				suffix == 'xlsx' ||
				suffix == 'et' ||
				suffix == 'doc' ||
				suffix == 'docx' ||
				suffix == 'pdf' ||
				suffix == 'jpg' ||
				suffix == 'jpeg' ||
				suffix == 'png' ||
				suffix == 'gif';
			return file;
		},
		FileVerifySize(res) {
			var file = res.tempFiles[0].size;
			if (file > 5242880) {
				return true;
			}
			return false;
		},
		FileType(res) {
			var name = res.tempFiles[0].name;
			var suffix = name.split('.')[name.split('.').length - 1];
			if (suffix == 'pdf') {
				return 0;
			} else if (suffix == 'doc' || suffix == 'docx') {
				return 1;
			} else if (suffix == 'xls' || suffix == 'xlsx') {
				return 2;
			} else if (suffix == 'jpg' || suffix == 'jpeg' || suffix == 'png' || suffix == 'gif') {
				return 3;
			} else {
				return 3;
			}
		},
		UploadFilePdf(fileAvatar, billNumber, type, size, app) {
			return new Promise((resolve, reject) => {
				let that = this;
				uni.uploadFile({
					url: uni.$http.config.baseURL + 'bills/file',
					header: {
						token: that.pinia_token,
						phone: app ? that.pinia_user.phone : that.pinia_user.phone + '-app',
						number: billNumber
					},
					filePath: fileAvatar,
					name: 'file',
					success: (uploadFileRes) => {
						var dx = {
							file: '',
							size: size
						};
						if (type) {
							dx.file = uploadFileRes.data;
							resolve(dx);
						} else {
							dx.file = uploadFileRes.data;
							resolve(dx);
						}
					}
				});
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.receiptFrom {
	width: 100vw;
	height: 100vh;
	background-color: #f4f4f4;

	.FROMBill {
		width: 100%;
		height: auto;
		background-color: #f4f4f4;
	}

	.BillSuccess {
		width: 100%;
		height: 100%;
		background-color: #ffffff;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		padding-bottom: 30%;

		.BillReturnBtn {
			width: 378.24rpx;
			height: 88.86rpx;
			border-radius: 376rpx;
			background-color: #01bb74;
			color: white;
		}
	}

	.HandFrom {
		background-color: white;
		width: 100%;
		height: 20%;
		padding: 24rpx;
	}

	.FromPrice {
		width: 100%;
		height: 20%;
		padding: 24rpx;
		background-color: white;
		margin-top: 24rpx;
	}

	.uploadView {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

		margin-top: 24rpx;

		// padding: 30rpx;
		padding-bottom: 60rpx;
		padding-top: 30rpx;
		border-style: dashed;
		border-color: #d8d8d8;
		border-width: 2rpx;
		border-radius: 12rpx;
	}

	.FilePdfList {
		width: 100%;
		height: auto;
		// padding: 24rpx;
	}

	.FromTitle {
		font-weight: bold;
		// margin: 24rpx;
		margin-top: 24rpx;
	}

	.FromInput {
		display: flex;
		flex-direction: row;
		justify-content: left;
		align-items: center;
		align-content: center;

		padding-bottom: 24rpx;
		padding-top: 24rpx;
		padding-right: 24rpx;

		.textcolor {
			color: #666666;
		}
	}
}

.FromOwn {
	display: flex;
	flex-direction: column;
	justify-content: left;
	margin-top: 24rpx;

	height: 600rpx;

	background-color: white;

	.OwnText {
		display: flex;
		flex-direction: row;
		justify-content: left;

		padding-bottom: 48rpx;
		padding-top: 48rpx;
		margin-left: 24rpx;

		// padding: 24rpx;

		position: relative;

		.OwnTextFromTitle {
			font-weight: 500;
			position: absolute;
			left: 0;
		}

		.OwnTextFromText {
			padding-right: 24rpx;
			font-weight: 500;
			position: absolute;
			right: 0;
		}
	}
}

.FromFile {
	display: flex;
	flex-direction: column;
	justify-content: left;

	margin-top: 24rpx;
	padding-left: 24rpx;
	padding-right: 24rpx;

	background-color: white;

	.FromFileTitle {
		padding-top: 48rpx;
		margin-bottom: 24rpx;
		font-weight: bold;
	}

	.FromFileTitleRemark {
		background-color: #f9f9f9;
		border-radius: 12rpx;
		margin-bottom: 24rpx;
		::v-deep .u-textarea {
			background-color: transparent !important;
		}
	}
}

.sendBill {
	position: fixed;
	z-index: 55;
	bottom: 0;
	width: 100%;
	padding: 24rpx;
}
</style>
