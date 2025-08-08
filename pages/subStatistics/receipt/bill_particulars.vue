<template>
    <view class="receiptFrom">
        <view class="FROMBill">
            <view class="FromOwn">
                <view class="OwnText">
                    <view class="OwnTextFromTitle">订单编号</view>
                    <text class="OwnTextFromText">
                        {{ billFrom.billNumber }}
                    </text>
                </view>
                <view class="OwnText">
                    <view class="OwnTextFromTitle" v-if="vuex_userRole == 'D'">客户名称</view>
                    <view class="OwnTextFromTitle" v-if="vuex_userRole == 'R'">供应商名称</view>

                    <text
                        class="OwnTextFromText"
                        v-if="vuex_user.data.work == '0' ? vuex_user.phone == billFrom.sourcePhone : vuex_user.workData.bossNumber == billFrom.sourcePhone"
                    >
                        {{ billFrom.billEnterpriseE }}
                    </text>
                    <text class="OwnTextFromText" v-else>{{ billFrom.billEnterpriseS }}</text>
                </view>
                <view class="OwnText">
                    <view class="OwnTextFromTitle">开具日期</view>
                    <text class="OwnTextFromText">{{ billFrom.billTime }}</text>
                </view>
            </view>

            <view class="FromOwn">
                <view class="OwnText">
                    <view class="OwnTextFromTitle">总金额</view>
                    <text class="OwnTextFromText">￥{{ billFrom.billPrice.toFixed(2) }}</text>
                </view>
                <view
                    class="OwnText"
                    v-if="
                        (vuex_user.data.work == '0'
                            ? billFrom.sourcePhone == vuex_user.phone && vuex_userRole == 'D'
                            : billFrom.sourcePhone == vuex_user.workData.bossNumber && vuex_userRole == 'D') ||
                        (vuex_user.data.work == '0'
                            ? billFrom.receptionPhone == vuex_user.phone && vuex_userRole == 'R'
                            : billFrom.receptionPhone == vuex_user.workData.bossNumber && vuex_userRole == 'R')
                    "
                >
                    <view class="OwnTextFromTitle">折扣率</view>
                    <text class="OwnTextFromText">{{ billFrom.billDiscountPrice }}%</text>
                </view>
                <view class="OwnText">
                    <view class="OwnTextFromTitle">应收金额</view>
                    <text class="OwnTextFromText">￥{{ parseFloat(billFrom.billAfterPrice).toFixed(2) }}</text>
                </view>
            </view>

            <view class="FromFile">
                <view class="FromFileTitle" v-if="billFrom.cBillFolderList.length > 0">图片</view>
                <view class="recently-cat flex-row flex-wrap" style="width: 95%">
                    <view class="ImgView">
                        <u-image
                            class="ml24"
                            v-for="(item, index) in billFrom.cBillFolderList"
                            :key="index"
                            v-if="item.type == '0'"
                            width="150rpx"
                            height="150rpx"
                            :src="item.file"
                            @click="LookImg(billFrom.cBillFolderList)"
                        ></u-image>
                    </view>
                </view>
                <view class="FromFileTitle" v-if="FileList.length > 0">附件</view>
                <view class="FilePdfList">
                    <pop-file :fileList="FileList" :delShow="false"></pop-file>
                </view>
                <view class="FromFileTitle">备注说明</view>
                <view class="FromFileTitleRemark" style="">
                    <u-input
                        disabled
                        type="textarea"
                        border="none"
                        placeholder="(无备注)"
                        v-model="billFrom.billRemark"
                        placeholderClass="placeholder_class"
                        maxlength="50"
                        height="100%"
                    ></u-input>
                </view>
            </view>

            <view class="FromOwn">
                <view class="OwnText">
                    <view class="OwnTextFromTitle">企业名称</view>
                    <text class="OwnTextFromText">
                        <text v-if="vuex_user.ac != null">
                            {{ vuex_user.ac.enterpriseName || vuex_user.phone }}
                        </text>
                        <text v-else>
                            <text class="" v-if="vuex_user.data.work == '0' ? vuex_user.phone == billFrom.sourcePhone : vuex_user.workData.bossNumber == billFrom.sourcePhone">
                                {{ billFrom.billEnterpriseS }}
                            </text>
                            <text class="" v-else>{{ billFrom.billEnterpriseE }}</text>
                        </text>
                    </text>
                </view>
                <view class="OwnText">
                    <view class="OwnTextFromTitle">联系人</view>
                    <text class="OwnTextFromText">
                        {{ vuex_user.data.work == '0' ? vuex_user.data.name || vuex_user.phone || vuex_user.data.phone : vuex_user.workData.name }}
                    </text>
                </view>
                <view class="OwnText">
                    <view class="OwnTextFromTitle">联系电话</view>
                    <text class="OwnTextFromText">{{ vuex_user.data.work == '0' ? vuex_user.phone || vuex_user.data.phone : vuex_user.workData.bossNumber }}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            billFrom: {
                billPrice: 0,
                cBillFolderList: []
            },
            billEnterprise: '',
            action: '',
            fileList: [],
            imgFileList: [],
            consignee: {},
            FileList: [],
            edit: false
            // FROMBShow: true
        };
    },
    onLoad(option) {
        console.log('单个详情：', option);
        var idNumber = Number(option.id);
        var edit = option.edit;
        if (edit) {
            this.edit = edit;
        }

        var dx = {
            id: idNumber
        };
        this.$api.bills.getBillById(dx).then((res) => {
            console.log('单个详情：', res);
            this.billFrom = res.data.data;

            this.billFrom.billTime = this.$u.timeFormat(new Date(), 'yyyy-mm-dd');

            var port = this.vuex_userRole == 'R';
            if (port) {
                this.billEnterprise = this.billFrom.billEnterpriseS;
            } else {
                this.billEnterprise = this.billFrom.billEnterpriseE;
            }

            var list = [];
            this.billFrom.cBillFolderList.forEach((res) => {
                if (res.type == '1') {
                    var split = res.file.split('-');
                    var name = split[split.length - 1];
                    var type = this.FileTypeName(res.file);
                    var dx = {
                        type: type,
                        name: name,
                        size: res.size,
                        path: res.file,
                        http: true
                    };
                    list.push(dx);
                }
            });

            this.FileList = list;
        });
    },
    onShow() {
        if (this.vuex_userRole == 'D') {
            uni.setNavigationBarTitle({
                title: '收款单详情'
            });
        } else {
            uni.setNavigationBarTitle({
                title: '付款单详情'
            });
        }
    },
    methods: {
        selectOrder() {
            console.log(this.billFrom.orders);
            console.log(this.billFrom.searchJson);
            uni.navigateTo({
                url: `upd_receipt?searchJson=${this.billFrom.searchJson}&ids=${this.billFrom.orders}`
            });
        },
        LookImg(list) {
            var look = list.filter((res) => res.type == '0');
            const fileList = look.map((res) => res.file);
            uni.previewImage({
                current: 0,
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
        handleUpload(e, list) {
            this.imgFileList = list;
        },
        uploadFile() {
            console.log('上传');
            var that = this;
            uni.chooseMessageFile({
                count: 3,
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
                            path: file.path
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
		UploadFilePdf(fileAvatar, billNumber, type) {
			return new Promise((resolve, reject) => {
				let that = this;
				uni.uploadFile({
					url: uni.$http.config.baseURL + '/edo/bills/file',
					header: {
						token: that.vuex_token,
						phone: that.vuex_user.phone,
						number: billNumber
					},
					filePath: fileAvatar,
					name: 'file',
					success: (uploadFileRes) => {
						if (type) {
							// that.billFrom.fileAliList.push()
							resolve(uploadFileRes.data);
						} else {
							resolve(uploadFileRes.data);
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
    padding-bottom: 24rpx;

    height: auto;

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
            color: #666666;
            font-size: 28rpx;
        }

        .OwnTextFromText {
            padding-right: 24rpx;
            font-weight: 500;
            position: absolute;
            right: 0;
            color: #333333;
            font-size: 28rpx;
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
        font-weight: 500;
        padding-top: 48rpx;
        margin-bottom: 24rpx;
        color: #666666;
        font-size: 28rpx;
    }

    .FromFileTitleRemark {
        background-color: #f9f9f9;
        border-radius: 12rpx;
        margin-bottom: 24rpx;
        padding-left: 24rpx;
        padding-bottom: 12rpx;
        padding-top: 12rpx;
        // height: 100rpx;
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
