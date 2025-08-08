<template>
	<view style="position: relative; height: 100vh">
		<view v-if="show == '0'" class="ml20 mr48 pd30 bg-white mt10">
			<view class="" style="color: #333333">企业信息</view>
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
			<view class="flex-row pt30 pb30">
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
			<u-button :customStyle="custom_style" shape="circle" type="primary" @click="updateInfo">{{ up ? '提交信息' : '更新信息' }}</u-button>
		</view>

		<view v-if="show != 0" class="flex-col mt60 ml48 mr48">
			<view class="flex-row justify-between items-center pl20 pr20 pt30 pb30 radius mb10">
				<view class="flex-row items-center">
					<u-image width="60" height="60" shape="circle" :src="vuex_user.data.headPortrait || '/static/img/obj/defind.svg'" :show-menu-by-longpress="false"></u-image>
					<view class="ml30" style="max-width: 100px; font-weight: bold; font-size: 16px">
						{{ vuex_user.data.name }}
					</view>
					<u-image class="ml15" width="50" height="20" src="/static/img/obj/yrz.svg" :show-menu-by-longpress="false"></u-image>
				</view>
				<u-button size="mini" v-if="vuex_user.workData.id == null" @click="authRefresh" shape="circle" type="success">更新信息</u-button>
			</view>
			<view class="flex-row items-center pd20">
				<text class="ft-gray mr30 width120">企业名称</text>
				<text class="flex-1">{{ vuex_user.ac ? vuex_user.ac.enterpriseName : '' }}</text>
			</view>
			<view class="flex-row items-center pd20">
				<text class="ft-gray mr30 width120">联系人</text>
				<text class="flex-1">{{ vuex_user.data.name || '未填写' }}</text>
			</view>
			<view class="flex-row items-center pd20">
				<text class="ft-gray mr30 width120">联系电话</text>
				<text class="flex-1">{{ vuex_user.phone || '未填写' }}</text>
			</view>
			<view class="flex-row items-center pd20">
				<text class="ft-gray mr30 width120">企业地址</text>
				<text class="flex-1">{{ vuex_user.ac ? vuex_user.ac.businessSite : '未填写' }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			custom_style: {
				backgroundColor: '#01BB74',
				width: '200rpx'
			},
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
	onShow() {
		this.loadData();
	},
	onLoad(a) {
		this.show = a.btn;
		console.log(this.show);
	},
	methods: {
		authRefresh() {
			this.up = false;
			this.show = 0;
			this.nameID = this.vuex_user.data.name;
			this.userInfo.accountSubject.simpleNameQ = this.vuex_user.ac.enterpriseName; //企业全称
			this.userInfo.accountSubject.simpleName = this.vuex_user.ac.abbreviation;
			this.userInfo.accountSubject.contact = this.vuex_user.ac.user;
			this.userInfo.accountSubject.contactPhone = this.vuex_user.ac.phone;
			this.userInfo.accountSubject.address = this.vuex_user.ac.businessSite;
		},
		loadData(a) {
			let that = this;
		},
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
					var bossNumber = that.vuex_work == 'Y' ? that.vuex_user.workData.bossNumber : that.vuex_user.phone || that.vuex_user.data.phoneNumber;
					uni.uploadFile({
						url: uni.$http.config.baseURL + '/edo/user/modifyImage',
						header: {
							phone: bossNumber,
							token: that.vuex_token
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
			console.log('==== that.userInfo :', that.userInfo);
			let userInfos = that.$u.deepClone(that.userInfo); //深度克隆
			console.log(this.vuex_user.ac);
			let id = '';
			if (this.vuex_user.ac != null) {
				id = this.vuex_user.ac.id;
			} else {
				id = '';
			}
			let dx = {
				id: id,
				enterpriseName: that.userInfo.accountSubject.simpleNameQ, //企业全称
				abbreviation: that.userInfo.accountSubject.simpleName,
				userName: that.vuex_user.data.name,
				phone: that.vuex_user.phone,
				state: '1',
				user: this.vuex_user.phone,
				businessSite: that.userInfo.accountSubject.address,
				businessLicenseFront: that.userInfo.businessLicenseFront
			};

			console.log(dx);
			dx.enterpriseName = dx.enterpriseName.trim();
			if (dx.enterpriseName.length <= 0 || dx.enterpriseName.length >= 14) {
				this.$u.toast('请输入不超过14个字的企业名称');
				return;
			}

			dx.businessSite = dx.businessSite.trim();
			if (dx.businessSite.length <= 0) {
				this.$u.toast('请输入企业地址');
				return;
			}

			if (dx.businessSite.length >= 14) {
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

			var send = {
				id: this.vuex_user.data.id,
				name: this.nameID,
				phoneNumber: this.vuex_user.phone,
				work: this.vuex_user.data.work,
				boss: this.vuex_user.data.work == '0' ? this.vuex_user.phone : this.vuex_user.workData.bossNumber
			};
			send.name = send.name.trim();
			if (send.name.length <= 0) {
				this.$u.toast('请输入姓名');
				return;
			}
			this.$api.order.addAccountRecord(dx).then((res) => {
				//更新用户信息
				if (res.data.data == '1') {
					this.$u.setPinia({
						user: {
							user: {
								ac: {
									enterpriseName: dx.enterpriseName,
									businessSite: dx.businessSite
									// userName: dx.userName
								}
							}
						}
					});

					//完整重新加载当前页面
					const pages = getCurrentPages();
					const current = pages[pages.length - 1];
					const currentRoute = '/' + current.route;
					const currentOptions = current.options; // 参数

					let query = '';
					if (currentOptions) {
						const params = Object.entries(currentOptions)
							.map(([key, val]) => `${key}=${val}`)
							.join('&');
						query = params ? `?${params}` : '';
					}

					uni.redirectTo({
						url: `${currentRoute}${query}`
					});
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
