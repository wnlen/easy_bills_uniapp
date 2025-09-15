<template>
	<view class="receiptFrom">
		<view class="FROMBill">
			<view class="HandFrom">
				<view class="FromTitle">开具信息</view>
				<view class="FromInput u-border-bottom">
					<text class="textcolor">订单编号:</text>
					<input
						placeholder-class="placeholder_class"
						type="number"
						v-model="billFrom.billNumber"
						:style="{ color: '#F76565' }"
						maxlength="18"
						disabled
						placeholder="请获取单据编号"
						class="ml15 flex-1 u-line-1 endcolor"
					/>
				</view>
				<view class="FromInput u-border-bottom">
					<text v-if="pinia_userRole == 'D'" class="textcolor">客户名称:</text>
					<text v-if="pinia_userRole == 'R'" class="textcolor">供应商名称:</text>
					<input
						v-if="pinia_user.data.work == '0' ? pinia_user.phone == billFrom.sourcePhone : pinia_user.workData.bossNumber == billFrom.sourcePhone"
						placeholder-class="placeholder_class"
						type="number"
						v-model="billFrom.billEnterpriseE"
						:style="{ color: '#333333' }"
						maxlength="20"
						disabled
						placeholder="请获取客户名称"
						class="ml15 flex-1 u-line-1 endcolor"
					/>
					<input
						v-else
						placeholder-class="placeholder_class"
						type="number"
						v-model="billFrom.billEnterpriseS"
						:style="{ color: '#333333' }"
						maxlength="20"
						disabled
						placeholder="请获取客户名称"
						class="ml15 flex-1 u-line-1 endcolor"
					/>
				</view>
				<view class="FromInput">
					<text class="textcolor">开具日期:</text>
					<input
						placeholder-class="placeholder_class"
						disabled
						type="number"
						v-model="billFrom.billTime"
						:style="{ color: '#333333' }"
						maxlength="11"
						placeholder="请选择开具日期"
						class="ml15 flex-1 u-line-1 endcolor"
					/>
				</view>
			</view>

			<view class="FromPrice">
				<view class="FromInput u-border-bottom relative flex flex-row justify-left items-center">
					<view class="" style="font-weight: bold; padding-top: 12rpx">修改订单</view>
					<view class="absolute" style="right: 12rpx">
						<!-- <up-button class="form-btn-big" hover-class="none" size="mini"
							:customStyle="{backgroundColor:'#01BB74',color:'#ffffff'}" @click="selectOrder"
							shape="circle">选择&gt;</up-button> -->
						<view
							@click="selectOrder"
							class="flex-row justify-center items-center"
							style="width: 124rpx; height: 48rpx; border-radius: 90rpx; background: #01bb74; color: #ffffff; font-size: 24rpx"
						>
							选择&nbsp;&gt;
						</view>
					</view>
				</view>
				<view class="FromTitle" style="padding-top: 12rpx">开具金额</view>
				<view class="FromInput u-border-bottom">
					<text class="textcolor">总金额:</text>
					<input
						placeholder-class="placeholder_class"
						type="number"
						v-model="billFrom.billPrice"
						:style="{ color: '#333333' }"
						maxlength="11"
						disabled
						placeholder="请获取总金额"
						class="ml15 flex-1 u-line-1 endcolor"
					/>
					<text>元</text>
				</view>
				<view class="FromInput u-border-bottom" v-if="pinia_userRole == 'D'">
					<text class="textcolor">折扣率:</text>
					<input
						placeholder-class="placeholder_class"
						:disabled="!edit"
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
					<text class="textcolor">应收金额:</text>
					<input
						v-model="billFrom.billAfterPrice"
						type="number"
						:style="{ color: '#333333' }"
						maxlength="11"
						placeholder="请输入折扣计算应收金额"
						class="ml15 flex-1 u-line-1 endcolor"
						placeholder-class="placeholder_class"
					/>
					<text>元</text>
				</view>
			</view>

			<view class="FromFile">
				<view class="FromFileTitle">图片</view>
				<view class="recently-cat flex-row flex-wrap" style="width: 100%">
					<view class="recently-cat flex-row flex-wrap mt24" style="width: 95%">
						<up-upload
							autoUploadDriver="local"
							v-model:fileList="imgFileList"
							:maxSize="10485760"
							:maxCount="3"
							multiple
							:previewFullImage="true"
							width="200rpx"
							height="200rpx"
							@delete="deleteimg"
							@afterRead="afterRead"
						>
							<up-icon :name="ImgUrl + '/wxImg/order/down.png'" size="200rpx"></up-icon>
						</up-upload>
					</view>
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
				<view class="FromFileTitleRemark" style="height: '100%'">
					<uv-input
						type="textarea"
						border="none"
						placeholder="请填写备注，字数不超过50字"
						v-model="billFrom.billRemark"
						placeholderClass="placeholder_class"
						maxlength="50"
					></uv-input>
				</view>
			</view>

			<view class="FromOwn">
				<view class="OwnText">
					<view class="OwnTextFromTitle">企业名称</view>
					<text :style="{ color: '#333333' }" class="ml15 endcolor OwnTextFromText" v-if="pinia_user.data.work == '0'">
						{{ pinia_user.ac?.enterpriseName || pinia_user.phone }}
					</text>
					<text :style="{ color: '#333333' }" class="ml15 endcolor OwnTextFromText" v-else>
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
					{{ pinia_userRole == 'D' ? '修改收款单' : '修改付款单' }}
				</up-button>
				<!-- #endif -->
				<!-- #ifdef APP -->
				<up-button type="primary" class="form-btn-big" hover-class="none" color="#01BB74" @click="sendOrder(false)" shape="circle">
					{{ pinia_userRole == 'D' ? '修改收款单' : '修改付款单' }}
				</up-button>
				<!-- #endif -->
			</view>
		</view>

		<!-- 		<view class="BillSuccess" v-if="!FROMBShow">
			<view class="" style="width: 60vw;height: 20vh;">
				<up-image style="" width="100%" height="100%"
					src="https://res-oss.elist.com.cn/wxImg/order/fscg.png"></up-image>
			</view>
			<view class="text-center mt20" style="color:#01BB74;font-size: 34rpx;font-weight: bold;width: 100%;">
				发送成功!
			</view>
			<view class="text-center mt10" style="color:#AAAAAA;font-size: 26rpx;font-weight: normal;">
				电子单据已发送给收货人
			</view>
			<view class="flex-row justify-center items-center mt40">
				<button style="" class="BillReturnBtn" @click="ContinueBilling">返回首页</button>
			</view>
		</view> -->
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
				searchJson: '',
				ids: [],
				oldId: [],
				nowId: [],
				check: false,
				cBillFolderList: [],
				updFileAliList: [],
				delFileList: [],
				updImgAliList: [],
				delImgFolderIdList: [],
				uplImgFolderIdList: [],
				oldFileAliList: []
			},
			billEnterprise: '',
			action: '',
			fileList: [],
			delFileList: [],
			imgFileList: [],
			consignee: {},
			edit: false,
			updImgFile: [],
			updAttachmentFile: [],
			removeList: [],
			loadList: [],
			urlList: [],
			checkSend: true
		};
	},
	onLoad(option) {
		var port = this.pinia_userRole == 'D';
		if (port) {
			uni.setNavigationBarTitle({
				title: '收款单修改'
			});
		} else {
			uni.setNavigationBarTitle({
				title: '付款单修改'
			});
		}
		var idNumber = Number(option.id);
		var edit = option.edit;
		if (edit) {
			this.edit = edit;
		}

		var dx = {
			id: idNumber
		};
		uni.$api.bills.getBillById(dx).then((res) => {
			this.billFrom = res.data.data;
			// this.billFrom.billPrice = this.formatAmount(this.billFrom.billPrice);
			this.billFrom.billTime = this.$u.timeFormat(this.billFrom.billTime, 'yyyy-mm-dd');

			var port = this.pinia_userRole == 'R';
			if (port) {
				this.billEnterprise = this.billFrom.billEnterpriseS;
			} else {
				this.billEnterprise = this.billFrom.billEnterpriseE;
			}

			var list = [];

			var imgList = this.billFrom.cBillFolderList.filter((rs) => rs.type == '0');
			var fileList = this.billFrom.cBillFolderList.filter((rs) => rs.type == '1');

			this.updImgFile = imgList;
			this.updAttachmentFile = fileList;
			this.billFrom.oldFileAliList = fileList;

			this.updImgFile.forEach((res) => {
				var dx = {
					url: res.file,
					id: res.id,
					size: res.size,
					billId: res.billId,
					status: 'success', //上传成功图标
					type: 'image' //预览必须要保留type为image才能预览
				};
				this.imgFileList.push(dx);
			});

			this.updAttachmentFile.forEach((res) => {
				var split = res.file.split('-');
				var name = split[split.length - 1];
				var type = this.FileTypeName(res.file);
				var dx = {
					type: type,
					name: name,
					size: res.size,
					path: res.file,
					http: true,
					billId: res.billId,
					id: res.id
				};
				this.fileList.push(dx);
			});
		});
	},
	onShow() {
		var bill = uni.getStorageSync('bill');

		if (bill != null && bill != undefined && bill != '') {
			var jo = JSON.parse(bill);

			this.billFrom.billPrice = jo.priceNumber;
			this.billFrom.searchJson = JSON.stringify(JSON.parse(JSON.stringify(jo.searchJson)));
			this.billFrom.billAfterPrice = (this.billFrom.billPrice * (1 - this.billFrom.billDiscountPrice / 100)).toFixed(2);
			this.billFrom.orders = jo.ids.join(',');
			this.billFrom.oldId = jo.oldId;
			this.billFrom.nowId = jo.nowIds;
			this.billFrom.check = jo.check;
			uni.removeStorageSync('bill');
		}
		this.action = uni.$http.config.baseURL + 'order/imgA';
	},
	methods: {
		deleteimg(res) {
			this.removeList.push(res.file);
			this.imgFileList.splice(res.index, 1);
		},
		afterRead(res) {
			console.log('res.file[0]', res);
			res.file.forEach((el) => {
				this.loadList.push(el);
				const res1 = el;
				const dx = {
					url: el.url,
					id: el.id,
					size: el.size,
					billId: el.billId,
					status: 'success',
					type: 'image'
				};
				this.imgFileList.push(dx);
			});

			console.log('this.imgFileList', this.imgFileList);
		},
		async sendOrder(app) {
			if (this.checkSend) {
				this.checkSend = false;
				//要删除的
				const uniqueIds = [...new Set(this.removeList.map((item) => item.id))];

				var ifWorkPort = this.pinia_userRole == 'R';
				this.billFrom.type = ifWorkPort ? 0 : 1;

				for (const res of this.fileList) {
					if (res.id == null) {
						const url = await this.UploadFilePdf(res.path, this.billFrom.billNumber, true, res.size, app);
						this.updAttachmentFile.push({
							file: url.url,
							size: url.size,
							id: null
						});
					}
				}

				// 图片文件上传
				for (const res of this.loadList) {
					if (res.url != undefined) {
						const url = await this.UploadFilePdf(res.url, this.billFrom.billNumber, false, res.size, app);

						var dx = {
							file: url.url,
							size: url.size,
							id: null
						};
						this.urlList.push(dx);
					} else {
					}
				}

				this.billFrom.delImgFolderIdList = uniqueIds;
				this.billFrom.uplImgFolderIdList = this.urlList;
				this.billFrom.updFileAliList = this.updAttachmentFile;
				this.billFrom.delFileList = this.delFileList;
				const param = uni.$u.deepClone(this.billFrom);
				param.billTime = param.billTime + ' 00:00:00';
				uni.$api.bills.updateBill(param).then((res) => {
					this.checkSend = true;
					this.$u.toast(res.data.message);
					setTimeout(function () {
						uni.navigateBack();
					}, 300);
				});
			} else {
				this.$u.toast('请勿重复点击~');
			}
		},
		selectOrder() {
			uni.navigateTo({
				url: `upd_receipt?searchJson=${this.billFrom.searchJson}&ids=${this.billFrom.orders}&start=${this.billFrom.sourcePhone}&end=${this.billFrom.receptionPhone}`
			});
		},
		LookImg(list) {
			var look = list.filter((res) => res.type == '1');
			const fileList = look.map((res) => res.file);
			uni.previewImage({
				current: fileList[0],
				urls: fileList
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
		moveImgFileList(index, lists) {
			if (this.updImgFile[index] != undefined) {
				this.removeList.push(this.updImgFile[index]);
			}
			this.loadList = lists;
		},
		chooseFile() {
			chooseFile((path) => {
				uni.getFileInfo({
					//读取文件大小
					filePath: path,
					success: (res) => {
						const binSize = res.size;

						var dx = {
							type: path.split('.')[path.split('.').length - 1],
							name: path,
							size: binSize,
							path: path,
							http: false
						};
						this.fileList.push(dx);
					},
					fail: (err) => {}
				});
			});
		},
		uploadFile() {
			var that = this;
			uni.chooseMessageFile({
				count: 1,
				sizeType: ['original', 'compressed'],
				extension: ['doc', 'docx', 'pdf', 'pptx', 'ppt', 'xls', 'xlsx'],
				sourceType: ['album'],
				success(res) {
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
						//size  name  path
						var file = res.tempFiles[0];
						var dx = {
							type: that.FileType(res),
							name: file.name,
							size: file.size,
							path: file.path,
							id: null
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
		UploadFileVerifCyHttp(name) {
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
			var suffix = name.split('.')[1];
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
		FileTypeName(name) {
			var split = name.split('.');
			var suffix = split[split.length - 1];
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
							url: '',
							size: size
						};

						if (type) {
							// that.billFrom.fileAliList.push()
							dx.url = uploadFileRes.data;
							resolve(dx);
						} else {
							dx.url = uploadFileRes.data;
							resolve(dx);
							// that.billFrom.imgAliList.push(uploadFileRes.data)
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

		padding-bottom: 20%;

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
		// padding: 24rpx;
		padding-left: 24rpx;
		padding-right: 24rpx;
	}

	.FromPrice {
		width: 100%;
		height: 20%;
		// padding: 24rpx;
		padding-left: 24rpx;
		padding-right: 24rpx;
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

		padding-bottom: 30rpx;
		padding-top: 35rpx;
		margin-left: 30rpx;

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

.ImgView {
	display: flex;
	flex-direction: row;
	justify-content: left;
	align-items: center;
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
		padding-bottom: 48rpx;
		background-color: #f4f4f4;
		border-radius: 12rpx;
		margin-bottom: 24rpx;
		padding-left: 24rpx;
		padding-top: 24rpx;
		height: 200rpx;
	}
}

.sendBill {
	position: fixed;
	z-index: 55;
	bottom: 20rpx;
	width: 100%;
	padding: 24rpx;
}
</style>
