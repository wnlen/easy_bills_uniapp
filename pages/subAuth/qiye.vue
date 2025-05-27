<template>
	<view style="position: relative;height: 100vh;">
		<view v-if="show=='0'" class="ml20 mr48 pd30 bg-white mt10">
			<view class="" style="color: #333333;">
				企业信息
			</view>
			<view class="flex-row pt30 pb30 u-border-bottom items-center justify-between">
				<text style="color: red;">*<text class="ft-gray ml5">姓名</text></text>
				<view class="flex-row justify-center items-center flex-1">
					<input v-model="nameID" type="text" maxlength="50" class="text-left ft29 ml55"
						placeholder="请填写您的姓名" />
				</view>
			</view>
			<view class="flex-row pt30 pb30 u-border-bottom items-center justify-between">
				<text style="color: red;">*<text class="ft-gray ml5">企业名称</text></text>
				<view class="flex-row justify-center items-center flex-1">
					<input v-model="userInfo.accountSubject.simpleNameQ" type="text" maxlength="50"
						class="text-left ft29" placeholder="请输入企业名称" />
				</view>
			</view>
			<!-- 			<view class="flex-row pt30 pb30 u-border-bottom items-center justify-between">
				<text style="color: red;">*<text class="ft-gray ml5">企业简称</text></text>
				<view class="flex-row justify-center items-center flex-1">
					<input v-model="userInfo.accountSubject.simpleName" type="text" maxlength="50"
						class="text-left ft29" placeholder="请输入企业简称（5个字内)" />
				</view>
			</view> -->
			<!-- 			<view class="flex-row pt30 pb30 u-border-bottom items-center justify-between">
				<text style="color: red;">*<text class="ft-gray ml5">联系人</text></text>
				<view class="flex-row justify-center items-center flex-1">
					<input v-model="userInfo.accountSubject.contact" type="text" maxlength="20" class="text-left ft29"
						placeholder="请输入联系人姓名" />
				</view>
			</view> -->
			<!-- 			<view class="flex-row pt30 pb30 u-border-bottom items-center justify-between">
				<text style="color: red;">*<text class="ft-gray ml5">联系电话</text></text>
				<view class="flex-row justify-center items-center flex-1">
					<input v-model="userInfo.accountSubject.contactPhone" type="number" maxlength="11"
						class="text-left ft29" placeholder="请输入联系人手机号" />
				</view>
			</view> -->
			<view class="flex-row pt30 pb30">
				<text style="color: red;">*<text class="ft-gray ml5">企业地址</text></text>
				<view class="flex-row justify-center items-center flex-1">
					<input v-model="userInfo.accountSubject.address" type="text" maxlength="50" class="text-left ft29"
						placeholder="请输入企业地址" />
				</view>
			</view>
			<!-- 			<view class="" style="color: #333333;">
				营业执照
			</view>
			<view class="mt30 ml20" @click="upOrderLogo">
				<u-image width="100%" height="300rpx" :src="license"></u-image>
			</view> -->
		</view>

		<view v-if="show==0" class="flex-col justify-center pl60 pr60 pb60 pt60 vw100"
			style="position: absolute;bottom: 0;">
			<u-button hover-class="none" :custom-style="{backgroundColor:'#01BB74'}" shape="circle" type="primary"
				@click="updateInfo">{{up?'提交信息':'更新信息'}} </u-button>
		</view>


		<view v-if="show!=0" class="flex-col mt60 ml48 mr48">
			<view class="flex-row justify-between items-center pl20 pr20 pt30 pb30 radius mb10">
				<view class="flex-row items-center">
					<u-image width="120" height="120" shape="circle"
						:src="vuex_user.data.headPortrait||'/static/img/obj/defind.svg'"
						:show-menu-by-longpress="false"></u-image>
					<view class="ml30" style="max-width: 100px;font-weight: bold;font-size: 16px;">
						{{vuex_user.data.name}}</view>
					<u-image class="ml15" width="100" height="40" src="/static/img/obj/yrz.svg"
						:show-menu-by-longpress="false"></u-image>
				</view>
				<u-button size="mini" v-if="vuex_user.workData.id==null" @click="authRefresh" shape="circle"
					type="success">更新信息</u-button>
			</view>
			<view class="flex-row items-center  pd20">
				<text class="ft-gray mr30 width120">企业名称</text>
				<text class="flex-1">{{vuex_user.ac?vuex_user.ac.enterpriseName:""}}</text>
			</view>
			<!-- 			<view class="flex-row items-center  pd20">
				<text class="ft-gray mr30 width120">企业简称</text>
				<text class="flex-1">{{vuex_user.ac.abbreviation||'未填写'}}</text>
			</view> -->
			<!-- 	<view class="flex-row items-center  pd20">
				<text class="ft-gray mr30 width120">联系人</text>
				<text class="flex-1">{{vuex_user.ac.userName||'未填写'}}</text>
			</view>
			<view class="flex-row items-center  pd20">
				<text class="ft-gray mr30 width120">联系电话</text>
				<text class="flex-1">{{vuex_user.ac.phone||'未填写'}}</text>
			</view> -->
			<view class="flex-row items-center  pd20">
				<text class="ft-gray mr30 width120">联系人</text>
				<text class="flex-1">{{vuex_user.data.name||'未填写'}}</text>
			</view>
			<view class="flex-row items-center  pd20">
				<text class="ft-gray mr30 width120">联系电话</text>
				<text class="flex-1">{{vuex_user.phone||'未填写'}}</text>
			</view>
			<view class="flex-row items-center  pd20">
				<text class="ft-gray mr30 width120">企业地址</text>
				<text class="flex-1">{{vuex_user.ac?vuex_user.ac.businessSite:'未填写'}}</text>
			</view>
			<!-- 			<view class="flex-col justify-left  pd20" v-if="vuex_user.ac.businessLicenseFront">
				<view class="ft-gray mr30 width120" style="font-weight: bold;">营业执照</view>
				<view class="" @click="showImg = true">
					<image v-if="vuex_user.ac.businessLicenseFront" :src="vuex_user.ac.businessLicenseFront"
						style="width: 300rpx;" class="mt20 ml20" mode="widthFix"></image>
				</view>
			</view>
			<u-popup v-model="showImg" mode="center" height="600rpx" width="600rpx">
				<image v-if="vuex_user.ac.businessLicenseFront" :src="vuex_user.ac.businessLicenseFront"
					style="width: 550rpx;" class="mt20 ml20" mode="widthFix"></image>
			</u-popup> -->
			<!-- <view class="flex-row pd20">
				<text class="ft-gray mr30 width120">收款码</text>
				<image v-if="vuex_user.accountSubject.collectionCode" :src="vuex_user.accountSubject.collectionCode"
					style="width: 300rpx;" class="mt20 ml20" mode="widthFix"></image>
				<text v-else class="flex-1">未上传</text>
			</view> -->
		</view>






	</view>
</template>

<script>
	export default {
		data() {
			return {
				nameID: "",
				showImg: false,
				show: 0,
				up: true,
				userInfo: {
					'eorderLogo': '', //单据Logo地址
					'accountSubject': {
						"simpleNameQ": "",
						"simpleName": "", //简称
						"address": "",
						"contact": "",
						"contactPhone": "",
						"collectionCode": "",
						"businessLicenseFront": ""
					} //在有变化的情况下修改供应商或客户的收件信息，无变化则不用传
				},
				license: "https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/auth/upload.svg"
			};
		},
		onShow() {
			this.loadData();
		},
		onLoad(a) {
			this.show = a.btn
			console.log(this.show);
		},
		methods: {
			authRefresh() {
				this.up = false
				this.show = 0;
				this.nameID = this.vuex_user.data.name
				this.userInfo.accountSubject.simpleNameQ = this.vuex_user.ac.enterpriseName //企业全称
				this.userInfo.accountSubject.simpleName = this.vuex_user.ac.abbreviation
				this.userInfo.accountSubject.contact = this.vuex_user.ac.user
				this.userInfo.accountSubject.contactPhone = this.vuex_user.ac.phone
				this.userInfo.accountSubject.address = this.vuex_user.ac.businessSite
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
							that.$u.toast("图片大小不能超过1M")
							return;
						}
						that.license = tempFilePaths;
						console.log(tempFilePaths);
						var bossNumber = that.vuex_work == "Y" ? that.vuex_user.workData.bossNumber : that
							.vuex_user.phone || that
							.vuex_user.data.phoneNumber
						uni.uploadFile({
							url: that.$u.http.config.baseUrl + '/edo/user/modifyImage',
							header: {
								phone: bossNumber,
								token: that.vuex_token
							},
							filePath: tempFilePaths,
							name: 'imageFile',
							formData: {
								'imageType': "2"
							},
							success: (uploadFileRes) => {
								console.log(uploadFileRes);
								that.userInfo.businessLicenseFront = uploadFileRes.data
								// that.receipts.picturesId.push(uploadFileRes.data)
							}
						});

					}
				})
			},
			updateInfo() {

				let that = this;
				console.log('==== that.userInfo :', that.userInfo);
				let userInfos = that.$u.deepClone(that.userInfo); //深度克隆
				console.log(this.vuex_user.ac);
				let id = ""
				if (this.vuex_user.ac != null) {
					id = this.vuex_user.ac.id
				} else {
					id = ""
				}
				let dx = {
					"id": id,
					"enterpriseName": that.userInfo.accountSubject.simpleNameQ, //企业全称
					"abbreviation": that.userInfo.accountSubject.simpleName,
					"userName": that.vuex_user.data.name,
					"phone": that.vuex_user.phone,
					"state": "1",
					"user": this.vuex_user.phone,
					"businessSite": that.userInfo.accountSubject.address,
					"businessLicenseFront": that.userInfo.businessLicenseFront
				}

				console.log(dx);
				dx.enterpriseName = dx.enterpriseName.trim()
				if (dx.enterpriseName.length <= 0 || dx.enterpriseName.length >= 14) {
					this.$u.toast("请输入不超过14个字的企业名称")
					return;
				}

				dx.businessSite = dx.businessSite.trim()
				if (dx.businessSite.length <= 0) {
					this.$u.toast("请输入企业地址")
					return;
				}

				if (dx.businessSite.length >= 14) {
					this.$u.toast("企业地址不能超过14位")
					return;
				}

				// if (dx.abbreviation.length > 5 || dx.abbreviation.length <= 0) {
				// 	this.$u.toast("请输入五位企业简称")
				// 	return;
				// }
				if (dx.enterpriseName.length <= 0) {
					this.$u.toast("请输入企业名称")
					return;
				}


				var send = {
					id: this.vuex_user.data.id,
					name: this.nameID,
					phoneNumber: this.vuex_user.phone,
					work: this.vuex_user.data.work,
					boss: this.vuex_user.data.work == "0" ? this.vuex_user.phone : this.vuex_user.workData.bossNumber
				}
				send.name = send.name.trim()
				if (send.name.length <= 0) {
					this.$u.toast("请输入姓名")
					return;
				}

				this.$u.post('edo/user/up', send).then(res => {
					console.log("修改状态：", res.data);

					this.$u.post('edo/ac/add', dx).then(res => {
						console.log("认证更新：", res.data);
						if (res.data.data == '1') {
							uni.navigateBack()
						}
					})
				})

			}
		},
	}
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
		background-color: transparent !important
	}

	.addr-box {
		width: 100%;
		max-width: 100%;
		box-sizing: border-box;
		background: #fcfcfc;
		border: 1rpx solid #f3f1f1;
	}
</style>