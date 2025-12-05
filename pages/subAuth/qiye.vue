<template>
	<view style="position: relative; height: 100vh">
		<view v-if="show == '0'" class="ml20 mr48 pd30 bg-white mt10">
			<view class="ft-bold" style="color: #333333">企业信息</view>
			<view class="flex-row pt30 pb30 u-border-bottom items-center justify-between">
				<text style="color: red">
					*
					<text class="ft-gray ml5">姓名</text>
				</text>
				<view class="flex-row justify-center items-center flex-1">
					<input v-model="nameID" type="text" maxlength="50" class="text-left ft29 ml55" placeholder="请填写您的姓名" />
				</view>
			</view>
			<view class="flex-row pt30 pb30 u-border-bottom items-center justify-between">
				<text style="color: red">
					*
					<text class="ft-gray ml5">企业名称</text>
				</text>
				<view class="flex-row justify-center items-center flex-1">
					<input v-model="userInfo.accountSubject.simpleNameQ" type="text" maxlength="50" class="text-left ft29" placeholder="请输入企业名称" />
				</view>
			</view>
			<view class="flex-row pt30 pb30 u-border-bottom">
				<text style="color: red">
					*
					<text class="ft-gray ml5">企业地址</text>
				</text>
				<view class="flex-row justify-center items-center flex-1">
					<input v-model="userInfo.accountSubject.address" type="text" maxlength="50" class="text-left ft29" placeholder="请输入企业地址" />
				</view>
			</view>
		</view>
		<view v-if="show == 0" class="flex-col justify-center pl60 pr60 pb60 pt60 vw100" style="position: absolute; bottom: 0">
			<wd-button :customStyle="{ width: '100%' }" @click="updateInfo">{{ up ? '提交信息' : '更新信息' }}</wd-button>
		</view>

		<view v-if="show != 0" class="flex-col mt20 ml48 mr48">
			<view class="flex-row justify-between items-center pl20 pt30 pb30 radius mb10">
				<view class="flex-row items-center">
					<up-image
						width="60"
						height="60"
						shape="circle"
						:src="pinia_user.data.headPortrait || 'https://res-oss.elist.com.cn/wxImg/obj/defind.svg'"
						:show-menu-by-longpress="false"
					></up-image>
					<view class="ml30 mr20" style="max-width: 100px; font-weight: bold; font-size: 16px">
						{{ pinia_user.data.name }}
					</view>
					<up-image class="ml15" width="50" height="20" src="https://res-oss.elist.com.cn/wxImg/obj/yrz.svg" :show-menu-by-longpress="false"></up-image>
				</view>
				<wd-button
					v-if="pinia_user.workData.id == null"
					size="small"
					:customStyle="{ width: '154rpx', height: '54rpx', margin: 0, fontSize: '24rpx' }"
					@click="authRefresh"
				>
					更新信息
				</wd-button>
			</view>
			<view class="flex-row items-center pd20">
				<text class="ft-gray mr30 width120">企业名称</text>
				<text class="flex-1">{{ pinia_user.ac ? pinia_user.ac.enterpriseName : '' }}</text>
			</view>
			<view class="flex-row items-center pd20">
				<text class="ft-gray mr30 width120">联系人</text>
				<text class="flex-1">{{ pinia_user.data.name || '未填写' }}</text>
			</view>
			<view class="flex-row items-center pd20">
				<text class="ft-gray mr30 width120">联系电话</text>
				<text class="flex-1">{{ pinia_user.phone || '未填写' }}</text>
			</view>
			<view class="flex-row items-center pd20">
				<text class="ft-gray mr30 width120">企业地址</text>
				<text class="flex-1">{{ pinia_user.ac ? pinia_user.ac.businessSite : '未填写' }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			nameID: '',
			showImg: false,
			show: 0,
			up: true,
			userInfo: {
				eorderLogo: '', //单据Logo地址
				accountSubject: {
					simpleNameQ: '',
					simpleName: '', //简称
					address: '',
					contact: '',
					contactPhone: '',
					collectionCode: '',
					businessLicenseFront: ''
				} //在有变化的情况下修改供应商或客户的收件信息，无变化则不用传
			},
			license: 'https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/auth/upload.svg'
		};
	},
	onShow() {},
	onLoad(a) {
		this.show = a.btn;
		console.log(this.show);
	},
	methods: {
		authRefresh() {
			this.up = false;
			this.show = 0;
			this.nameID = this.pinia_user.data.name;
			this.userInfo.accountSubject.simpleNameQ = this.pinia_user.ac.enterpriseName; //企业全称
			this.userInfo.accountSubject.simpleName = this.pinia_user.ac.abbreviation;
			this.userInfo.accountSubject.contact = this.pinia_user.ac.user;
			this.userInfo.accountSubject.contactPhone = this.pinia_user.ac.phone;
			this.userInfo.accountSubject.address = this.pinia_user.ac.businessSite;
		},
		// loadData(a) {
		// 	let that = this;
		// },
		// 上传订单logo
		upOrderLogo() {
			var that = this;
			uni.chooseMedia({
				count: 1,
				mediaType: ['image'],
				sourceType: ['album', 'camera'],
				camera: 'back',
				success(res) {
					console.log('==== res :', res);
					const tempFilePaths = res.tempFiles[0].tempFilePath;
					if (res.tempFiles[0].size > 1048576) {
						that.$u.toast('图片大小不能超过1M');
						return;
					}
					that.license = tempFilePaths;
					console.log(tempFilePaths);
					var bossNumber = that.pinia_work == 'Y' ? that.pinia_user.workData.bossNumber : that.pinia_user.phone || that.pinia_user.data.phoneNumber;
					uni.uploadFile({
						url: uni.$http.config.baseURL + 'user/modifyImage',
						header: {
							phone: bossNumber,
							Authorization: `Bearer ${that.pinia_token}`
						},
						filePath: tempFilePaths,
						name: 'imageFile',
						formData: {
							imageType: '2'
						},
						success: (uploadFileRes) => {
							console.log(uploadFileRes);
							that.userInfo.businessLicenseFront = uploadFileRes.data;
							// that.receipts.picturesId.push(uploadFileRes.data)
						}
					});
				}
			});
		},
		updateInfo() {
			let that = this;
			let userInfos = that.$u.deepClone(that.userInfo); //深度克隆

			let id = '';
			if (this.pinia_user.ac != null) {
				id = this.pinia_user.ac.id;
			} else {
				id = '';
			}
			let dx = {
				id: id,
				enterpriseName: that.userInfo.accountSubject.simpleNameQ, //企业全称
				abbreviation: that.userInfo.accountSubject.simpleName,
				userName: this.nameID,
				phone: that.pinia_user.phone,
				state: '1',
				user: this.pinia_user.phone,
				businessSite: that.userInfo.accountSubject.address,
				businessLicenseFront: that.userInfo.businessLicenseFront
			};

			console.log(dx);
			dx.enterpriseName = dx.enterpriseName.trim();
			if (dx.enterpriseName.length <= 0 || dx.enterpriseName.length > 14) {
				this.$u.toast('请输入不超过14个字的企业名称');
				return;
			}

			dx.businessSite = dx.businessSite.trim();
			if (dx.businessSite.length <= 0) {
				this.$u.toast('请输入企业地址');
				return;
			}

			if (dx.businessSite.length > 14) {
				this.$u.toast('企业地址不能超过14位');
				return;
			}

			// if (dx.abbreviation.length > 5 || dx.abbreviation.length <= 0) {
			// 	this.$u.toast("请输入五位企业简称")
			// 	return;
			// }
			if (dx.enterpriseName.length <= 0) {
				this.$u.toast('请输入企业名称');
				return;
			}

			if (this.nameID <= 0) {
				this.$u.toast('请输入姓名');
				return;
			}
			uni.showLoading({
				mask: true,
				title: '加载中'
			});
			var send = {
				id: this.pinia_user.data.id,
				name: this.nameID,
				phoneNumber: this.pinia_user.phone,
				work: this.pinia_user.user.work,
				boss: this.pinia_user.user.work == '0' ? this.pinia_user.phone : this.pinia_user.workData.bossNumber
			};
			send.name = send.name.trim();

			uni.$api.order.addAccountRecord(dx).then((res) => {
				//更新用户信息
				if (res.data.data == '1') {
					uni.navigateBack();
					this.$u.setPinia({
						user: {
							user: {
								ac: {
									enterpriseName: dx.enterpriseName,
									businessSite: dx.businessSite,
									userName: dx.userName
								},
								data: {
									name: dx.userName
								}
							}
						}
					});
					uni.hideLoading();
					//完整重新加载当前页面
					// const pages = getCurrentPages();
					// const current = pages[pages.length - 1];
					// const currentRoute = '/' + current.route;
					// const currentOptions = current.options; // 参数

					// let query = '';
					// if (currentOptions) {
					// 	const params = Object.entries(currentOptions)
					// 		.map(([key, val]) => `${key}=${val}`)
					// 		.join('&');
					// 	query = params ? `?${params}` : '';
					// }

					// uni.redirectTo({
					// 	url: `${currentRoute}${query}`
					// });
				}
			});
		}
	}
};
</script>

<style lang="scss">
.box {
	border: 1px solid #f6f6f6;
	box-shadow: 0 6rpx 15rpx rgba(0, 0, 0, 0.05);
	min-height: 100rpx;
	border-radius: 14rpx;
}

.avatar-area button::after {
	border: none;
	background: none;
}

.avatar-area button {
	background-color: transparent !important;
}

.addr-box {
	width: 100%;
	max-width: 100%;
	box-sizing: border-box;
	background: #fcfcfc;
	border: 1rpx solid #f3f1f1;
}
</style>