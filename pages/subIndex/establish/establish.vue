<template>
	<view>
		<view class="list">
			<text style="color: #FA3534;">*</text>手机号
		</view>
		<view class="flex-row justify-center items-center ml24 mr24 mt24 pl20 pr20 pt24 pb24"
			style="background-color: rgba(244, 244, 244, 0.5);;border-radius: 6px;">

			<view style="width: 100%;">
				<input class="input" placeholder-class="placeholder_class_establish" type="number"
					@input="searchPhoneInput" v-model="submitUser.searchPhone" style="color:'#333333'" maxlength="20"
					placeholder="请输入手机号" />
			</view>
		</view>
		<view class="list">
			{{user.port=='D'?"客户备注":"供应商备注"}}
		</view>
		<view class="flex-row justify-center items-center ml24 mr24 mt24 pl20 pr20 pt24 pb24"
			style="background-color: rgba(244, 244, 244, 0.5);;border-radius: 6px;">

			<view style="width: 100%;" v-if="user.port=='D'">
				<input class="input" placeholder-class="placeholder_class_establish" type="text" @input="changeText"
					v-model="submitUser.remarkD" style="color:'#333333'" maxlength="20" placeholder="请输入客户备注" />
			</view>
			<view style="width: 100%;padding-right: 20rpx;" v-if="user.port=='R'">
				<input class="input" placeholder-class="placeholder_class_establish" type="text" @input="changeText"
					v-model="submitUser.remarkR" style="color:'#333333'" maxlength="20" placeholder="请输入供应商备注" />
			</view>
		</view>


		<view class="mt60 pl20 pr20 pb30 absolute" style="bottom: 24rpx;width: 100%;" v-if="user.port=='D'">
			<u-button type="primary" class="form-btn-big" hover-class="none" :custom-style="{backgroundColor:'#01BB74'}"
				@click="establishFriend" shape="circle">创建客户</u-button>
		</view>
		<view class="mt60 pl20 pr20 pb30 absolute" style="bottom: 24rpx;width: 100%;" v-if="user.port=='R'">
			<u-button type="primary" class="form-btn-big" hover-class="none" :custom-style="{backgroundColor:'#01BB74'}"
				@click="establishFriend" shape="circle">创建供应商</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: {
					work: false,
					port: "D",
					identity: 0,
					bossNumber: "",
					phone: ""
				},
				placeholderStyle: {
					textAlign: "right",
					color: "#D8D8D8"
				},
				labelStyle: {
					color: "red",
					paddingLeft: "12px"
				},
				submitUser: {
					sBossNumber: "",
					eBossNumber: "",
					sourceNumber: "",
					port: "",
					searchPhone: "",
					remarkD: "",
					remarkR: ""
				}
			}
		},
		onShow() {
			this.Init();
		},
		methods: {
			changeText(e) {
				// console.log(e);
			},
			searchPhoneInput(e) {
				this.submitUser.eBossNumber = e.target.value;
				this.remark = e.target.value;
			},
			Init() {
				var ifWorkPort = this.vuex_userRole == "R"
				if (ifWorkPort) {
					uni.setNavigationBarTitle({
						title: "创建供应商"
					})
					this.title = "供应商"
				} else {
					uni.setNavigationBarTitle({
						title: "创建新客户"
					})
				}
				this.user.work = this.vuex_user.data.work == "0"
				this.user.port = this.vuex_userRole
				this.submitUser.port = this.vuex_userRole
				if (!this.user.work) {
					this.user.identity = this.vuex_user.workData.identity;
					this.user.bossNumber = this.vuex_user.workData.bossNumber;
					this.submitUser.sBossNumber = this.vuex_user.workData.bossNumber;
				} else {
					this.user.bossNumber = this.vuex_user.phone;
					this.submitUser.sBossNumber = this.user.bossNumber
				}
				this.user.phone = this.vuex_user.phone;
			},
			establishFriend() {
				var ver = this.verification()
				console.log("添加", ver);
				if (ver) {
					console.log("添加", this.submitUser);
					this.$api.order.directDelivery(this.submitUser).then(res => {
						console.log("===添加结果===>", res);
						var mes = res.data
						this.$u.toast(mes.message);
						if (mes.data >= 1) {
							setTimeout(function() {
								uni.navigateBack()
							}, 500)
						}

					});
				}
			},
			verification() {

				console.log("eBossNumber-searchPhone====>", this.submitUser.eBossNumber == this.submitUser.searchPhone);
				console.log("eBossNumber===>", this.submitUser.eBossNumber);
				console.log("searchPhone===>", this.submitUser.searchPhone);
				console.log("remarkD===>", this.user.port == "D" ? this.submitUser.remarkD : this.submitUser.remarkR);
				console.log("remark===>", remark != null && remark != "");
				console.log("submitUser===>", this.submitUser);

				var search = this.submitUser.searchPhone;
				var remark = this.user.port == "D" ? this.submitUser.remarkD : this.submitUser.remarkR;

				if (remark != null && remark != "") {
					remark = remark.trim()
				}


				if (remark != null && remark.length <= 0) {
					remark = null
				}

				if (search == "" || search == null || search == undefined) {
					this.$u.toast("请输入要添加的手机号码！");
					return false;
				}

				if (remark == "" || remark == null || remark == undefined) {
					this.submitUser.remarkD = null
					this.submitUser.remarkR = null
				} else {
					if (remark.length > 14) {
						this.$u.toast("备注最大长度为14！");
						return false;
					}
				}

				if (search.length != 11) {
					this.$u.toast("号码固定位数11位！");
					return false;
				}

				if (this.submitUser.sBossNumber == this.submitUser.searchPhone) {
					this.$u.toast("同一组织请勿添加！");
					return false;
				}


				const regex = /^1[3-9]\d{9}$/;
				var zz = regex.test(search);
				console.log("===手机号码验证===>", zz);
				if (!zz) {
					this.$u.toast("请输入11位数字手机号码！");
					return false;
				}



				return true;
			}
		}
	}
</script>

<style>
	.placeholder_class_establish {
		color: #D8D8D8;
		text-align: left;
	}

	.input {
		text-align: left;
	}

	.list {
		margin-left: 30rpx;
		margin-top: 30rpx;
	}
</style>