<template>
	<view class="detailsPage">
		<u-navbar :border-bottom="false" :titleBold="true" title-color="#000000" :title="detailsHeadline"
			title-size="34" bgColor="#ffffff"></u-navbar>

		<view class="flex-row justify-center items-center mt70">
			<u-avatar :src="userData.id?userData.headPortrait:'/static/img/obj/wzc.svg'" size="150"></u-avatar>
		</view>

		<view class="ml24 mr24 mt30" style="background-color: #ffffff;border-radius: 6px;padding: 24rpx;">
			<view class="hang">
				<text class="headline">公司名称</text>
				<text
					class="content">{{userData.map?userData.map.enterpriseName?userData.map.enterpriseName:"未完善":"未完善"}}</text>
			</view>
			<view class="hang">
				<text class="headline">公司地址</text>
				<text class="content">{{userData.map?userData.map.site?userData.map.site:"未完善":"未完善"}}</text>
			</view>
			<view class="hang">
				<text class="headline">手机号</text>
				<text class="content">{{userData.phoneNumber?userData.phoneNumber:""}}</text>
			</view>
			<view class="hang">
				<!-- 	<text class="headline">备注</text>
				<text class="content">
					{{userData.map?(vuex_userRole == "R"?userData.map.remarkR?userData.map.remarkR:"无":userData.map.remarkD?userData.map.remarkD:"无"):"无"}}
				</text> -->
				<text class="headline">备注</text>
				<view class="flex-row justify-end items-center flex-1" @click="editRemarkFocus">
					<input v-if="vuex_userRole=='D'" v-model="up.remarkD" type="text" maxlength="20"
						class="text-right ft29 mr3" placeholder="设置备注" @blur="editRemark"
						:focus="editRemarkFocusClick" />
					<input v-if="vuex_userRole=='R'" v-model="up.remarkR" type="text" maxlength="20"
						class="text-right ft29 mr3" placeholder="设置备注" @blur="editRemark"
						:focus="editRemarkFocusClick" />
					<u-icon name="arrow-right" color="#ccc"></u-icon>
				</view>
			</view>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				detailsHeadline: "客户信息",
				phone: "",
				state: 0,

				userData: {},
				remark: "",
				up: {
					sBossNumber: "",
					eBossNumber: "",
					remarkD: "",
					remarkR: "",
					port: ""
				},
				editRemarkFocusClick: false,
				port: false,
				type: false
			}
		},
		onLoad(option) {
			this.phone = option.phone
			this.state = option.select
			this.type = option.type
			if (this.state === "9") {

				this.userData.phoneNumber = this.phone
				this.getUnregisteredUser(this.phone)
			} else {
				this.getUserData(this.phone)
			}

		},
		onShow() {
			var ifWorkPort = this.vuex_userRole == "R"
			this.port = ifWorkPort
			if (ifWorkPort) {
				// uni.setNavigationBarTitle({
				// 	title: "供应商信息"
				// })
				this.detailsHeadline = "供应商信息"
			} else {
				// uni.setNavigationBarTitle({
				// 	title: "客户信息"
				// })
				this.detailsHeadline = "客户信息"
			}


		},
		methods: {
			getUnregisteredUser(eBossNumber) {
				var ifWorkPort = this.vuex_userRole == "D"
				var work = this.vuex_user.data.work == "0"
				var sBossNumber = work ? this.vuex_user.phone : this.vuex_user.workData.bossNumber
				var dx = {
					sBossNumber: sBossNumber,
					eBossNumber: eBossNumber
				}
				this.$u.post('/edo/delivery/searchUser', dx).
				then(res => {
					console.log("===未注册用户===>", res);
					var wzcUser = res.data.data;
					this.remark = ifWorkPort ? wzcUser.remarkD : wzcUser.remarkR
					var dx = {
						phoneNumber: ""
					}
					dx.phoneNumber = wzcUser.eBossNumber
					this.userData = dx
					if (this.port) {
						this.up.remarkR = this.remark
					} else {
						this.up.remarkD = this.remark
					}
					console.log(this.userData);
				});
			},
			getUserData(phone) {
				var ifwork = this.vuex_user.data.work == "0"
				var boss = ""
				if (ifwork) {
					boss = this.vuex_user.phone
				} else {
					boss = this.vuex_user.workData.bossNumber;
				}

				var url = ""
				if (this.type) {
					url = '/edo/user/searchMarket?phone='
				} else {
					url = '/edo/user/search?phone='
				}

				this.$u.post(url + phone + "&boss=" + boss + "&port=" + this.vuex_userRole).
				then(res => {
					this.userData = res.data.data
					this.remark = res.data.data.map.remark

					if (this.port) {
						this.up.remarkR = this.remark ? this.remark : null
					} else {
						this.up.remarkD = this.remark ? this.remark : null
					}
					console.log("===获取个人信息===>", this.userData);
					console.log("===获取个人备注===>", this.userData.map.remark);
					console.log("===保存备注===>", this.remark);
				});
			},
			editRemarkFocus() {
				this.editRemarkFocusClick = this.editRemarkFocusClick ? false : true
			},
			editRemark() {
				var ifwork = this.vuex_user.data.work == "0"
				var boss = ""
				if (ifwork) {
					boss = this.vuex_user.phone
				} else {
					boss = this.vuex_user.workData.bossNumber;
				}
				this.up.sBossNumber = boss
				this.up.eBossNumber = this.userData.phoneNumber
				var ifWorkPort = this.vuex_userRole == "R"


				if (ifWorkPort) {
					console.log("===remark===>", this.remark);
					console.log("===remarkR===>", this.up.remarkR);
					console.log("===this.remark === this.up.remarkR===>", this.remark === this.up.remarkR);

					if (this.up.remarkR != null && this.up.remarkR != "") {
						this.up.remarkR = this.up.remarkR.trim();
					}


					if (this.up.remarkR == null || this.up.remarkR == undefined || this.up.remarkR == "") {
						console.log("===备注不符合规范===>", this.remark);
						return;
					}
					if (this.remark == this.up.remarkR) {
						console.log("===备注不符合规范===>", this.remark);
						return;
					}
				} else {
					console.log("===remark===>", this.remark);
					console.log("===remarkD===>", this.up.remarkD);
					console.log("===this.remark === this.up.remarkD===>", this.remark === this.up.remarkD);

					if (this.up.remarkD != null && this.up.remarkD != "") {
						this.up.remarkD = this.up.remarkD.trim();
					}
					if (this.up.remarkD == null || this.up.remarkD == undefined || this.up.remarkD == "") {
						console.log("===备注不符合规范===>", this.remark);
						return;
					}

					if (this.remark == this.up.remarkD) {
						console.log("===备注不符合规范===>", this.remark);
						return;
					}
				}


				this.up.port = ifWorkPort ? "R" : "D"
				// if (ifWorkPort) {
				// 	this.up.remarkR = this.remark
				// } else {
				// 	this.up.remarkD = this.remark
				// }
				console.log("===修改备注===>", this.up);
				console.log("===修改备注===>", ifWorkPort);
				console.log("===修改备注===>", this.up.remarkR);
				console.log("===修改备注===>", this.up.remarkD);


				this.$u.post('/edo/delivery/remark', this.up).
				then(res => {
					console.log("res------------->", res);
					console.log("res------------->", res.data.data === 1);
					var me = res.data.message
					this.$u.toast(me);
					if (res.data.data === 1) {
						this.remark = this.port ? this.up.remarkR : this.up.remarkD
						// setTimeout(() => {
						// 	uni.navigateBack()
						// }, 1200)
					}
				});

			}
		},
	}
</script>

<style scoped lang="scss">
	.detailsPage {
		width: 100vw;
		height: 100vh;
		background-color: #F4F4F4;
	}

	.hang {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position: relative;
		width: 100%;
		height: 60px;

		.headline {
			position: absolute;
			left: 0;
		}

		.content {
			position: absolute;
			right: 0;
		}
	}
</style>