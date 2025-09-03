<template>
	<view class="pl48 pr48 pb38 vw100">
		<view class="sign" style="color: #333333">企业信息</view>
		<u-form class="vw100" :model="formDataFirm" ref="uFormQy" labelPosition="left" :label-style="{ 'line-height': 1 }" :error-type="['toast']">
			<u-form-item borderBottom label="姓名" prop="formDataFirm" required label-width="170rpx">
				<uv-input border="none" v-model="formDataFirm.userName" placeholder="请输入姓名" maxlength="50"></uv-input>
			</u-form-item>
			<u-form-item borderBottom label="企业名称" required label-width="170rpx">
				<uv-input border="none" v-model="formDataFirm.enterpriseName" placeholder="请输入企业名称" maxlength="50"></uv-input>
			</u-form-item>
			<!-- <u-form-item borderBottom label="企业简称"  required label-width="170rpx">
				<uv-input border="none" v-model="formDataFirm.abbreviation" placeholder="请输入企业简称" />
			</u-form-item> -->
			<u-form-item borderBottom label="企业地址" required label-width="170rpx">
				<uv-input border="none" v-model="formDataFirm.businessSite" placeholder="请输入企业地址"></uv-input>
			</u-form-item>
		</u-form>

		<view class="sign" style="color: #333333">签收管理</view>
		<u-form class="vw100" :model="formData" ref="uForm" labelPosition="left" :label-style="{ 'line-height': 1 }" :error-type="['toast']">
			<u-form-item borderBottom label="签收人姓名" prop="signeeName" required label-width="170rpx">
				<uv-input border="none" v-model="formData.signeeName" placeholder="请输入签收人姓名" maxlength="50"></uv-input>
			</u-form-item>
			<!-- <u-form-item borderBottom label="签收密码"  required label-width="170rpx">
				<uv-input border="none" v-model="formData.password" type="number" placeholder="请设置密码" maxlength="4"></uv-input>
			</u-form-item> -->
			<u-form-item label="手写签名" required prop="signeeImage" labelPosition="top" label-width="170rpx">
				<view v-if="formData.signeeImage" class="text-center width100 mt30 signeeBox">
					<image
						@click="goPath('/pages/subSignature/signature')"
						style="transform: rotate(-90deg); height: 50vw; width: 100%"
						:src="formData.signeeImage"
						mode="heightFix"
					></image>
				</view>
				<view v-else class="bg-white pd20 text-center width100 mt30 signeeBox flex-row items-center justify-center" @click="goPath('/pages/subSignature/signature')">
					<u-icon label="点击去签名" labelColor="#eee" name="edit-pen" color="#eee"></u-icon>
				</view>
				<!-- <view v-if="formData.signeeImage" class="text-center width100" style="height: 50vw; border: 4rpx dashed #eee">
					<image
						@click="goPath('/pages/subSignature/signature')"
						style="transform: rotate(-90deg); height: 50vw; width: 100%"
						:src="formData.signeeImage"
						mode="heightFix"
					></image>
				</view>
				<view v-else class="bg-white pd20 text-center width100" @click="goPath('/pages/subSignature/signature')">
					<u-icon label="点击去签名" name="edit-pen"></u-icon>
				</view> -->
			</u-form-item>
		</u-form>
		<view class="mt60">
			<u-button @click="submit" hover-class="none" color="#01BB74" shape="circle" type="primary">{{ formData.id ? '修改' : '提交' }}</u-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			formDataFirm: {
				id: '',
				enterpriseName: '', //企业全称
				abbreviation: '',
				userName: '',
				phone: '',
				state: '1',
				user: '',
				businessSite: '',
				businessLicenseFront: ''
			},
			formData: {
				id: '', //签收人记录ID，新增时此值传空
				signeeName: '', //签收人姓名
				phoneNumer: '',
				ifDefault: 'N', //是否默认 Y | N
				signeeImage: '', //签名图
				remark: '',
				// password: '',
				cEnterpriseVerification: {}
			},
			switchVal: false,
			rules: {
				signeeName: [
					{
						required: true,
						message: '请输入签收人姓名',
						trigger: ['change', 'blur']
					},
					{
						min: 1,
						max: 50,
						message: '签收人姓名不能超过50个字',
						trigger: 'change'
					}
				],
				phoneNumer: [
					{
						required: true,
						message: '请输入手机号',
						trigger: ['change', 'blur']
					},
					{
						max: 11,
						message: '请输入手机号',
						trigger: ['change', 'blur']
					},
					{
						validator: (rule, value, callback) => {
							if (!value) return true;
							return this.$u.test.mobile(value);
						},
						message: '手机号码不正确',
						trigger: ['change', 'blur']
					}
				],
				qsrList: [],
				qyList: []
			}
		};
	},
	onLoad(options) {
		var that = this;
		uni.$api.sign
			.getSignature({
				phone: this.pinia_user.phone
			})
			.then((res) => {
				var json = res.data.data[0];
				this.formData.id = json.id;
				this.formData.phoneNumer = json.phone;
				this.formData.signeeName = json.name;
				this.formData.signeeImage = json.signatureImg;
				// this.formData.password = json.password;
				this.switchVal = this.formData.ifDefault == 'Y' ? true : false;
			});

		uni.$api.order
			.getAccountStatistics({
				user: this.pinia_user.phone
			})
			.then((res) => {
				var json = res.data.data;
				this.formDataFirm.id = json.id;
				this.formDataFirm.enterpriseName = json.enterpriseName;
				this.formDataFirm.abbreviation = json.abbreviation;
				this.formDataFirm.userName = json.userName;
				this.formDataFirm.phone = json.phone;
				this.formDataFirm.state = json.state;
				this.formDataFirm.user = json.user;
				this.formDataFirm.businessSite = json.businessSite;
				this.formDataFirm.businessLicenseFront = json.businessLicenseFront;
			});
	},
	onShow() {
		// 获取签名图片
		let that = this;
		uni.$on('getSignImg', function (data) {
			that.$set(that.formData, 'signeeImage', data);
		});
	},
	// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		loadData() {
			console.log('用户信息实时更新 ', this.pinia_user);
		},
		switchChange(val) {
			console.log(val);
			this.formData.ifDefault = val ? 'Y' : 'N';
		},
		submit() {
			this.formDataFirm.phone = this.pinia_user.phone;
			this.formDataFirm.user = this.pinia_user.phone;

			var dx = {
				id: this.formData.id,
				name: this.formData.signeeName,
				phone: this.pinia_user.phone,
				signatureImg: this.formData.signeeImage,
				// password: this.formData.password,
				password: 1111,
				state: '1',
				cEnterpriseVerification: this.formDataFirm
			};

			console.log(this.formData);

			//this.formDataFirm

			if (this.formDataFirm.userName.length == 0) {
				this.$u.toast('请填写姓名');
				return;
			}

			if (this.formDataFirm.enterpriseName.length == 0) {
				this.$u.toast('请填写企业名称');
				return;
			}

			if (this.formDataFirm.enterpriseName.length > 14) {
				this.$u.toast('请输入不超过14个字的企业名称');
				return;
			}

			// if (this.formDataFirm.abbreviation.length == 0) {
			// 	this.$u.toast("请填写企业简称");
			// 	return;
			// }

			// if (this.formDataFirm.abbreviation.length > 5) {
			// 	this.$u.toast("企业简称不能超过5个字");
			// 	return;
			// }

			if (this.formDataFirm.businessSite.length == 0) {
				this.$u.toast('请填写企业地址');
				return;
			}

			if (this.formDataFirm.businessSite.length > 14) {
				this.$u.toast('企业地址不能超过14个字');
				return;
			}

			//this.formData

			if (this.formData.signeeImage.length == 0) {
				this.$u.toast('请绘制签名图片');
				return;
			}

			// if (this.formData.password.length == 0) {
			// 	this.$u.toast('请设置4位签名密码');
			// 	return;
			// }

			// if (this.formData.password.length != 4) {
			// 	this.$u.toast('请设置4位签名密码');
			// 	return;
			// }

			if (this.formData.signeeName.length == 0) {
				this.$u.toast('请设置签收姓名');
				return;
			}

			uni.$api.sign.mergeSignature(dx).then((res) => {
				this.$u.toast(res.data.message);
				if (rea.data.code == 200) {
					this.$u.setPinia({
						user: {
							user: {
								password: 1111
							}
						}
					});
					setTimeout(function () {
						uni.navigateBack();
					}, 1500);
				}
			});
		}
	}
};
</script>

<style lang="scss">
.sign {
	font-family: Source Han Sans;
	font-size: 30rpx;
	font-weight: bold;
	text-align: left;
	letter-spacing: 0rpx;
	padding-top: 24rpx;
	padding-bottom: 24rpx;
}
::v-deep .u-form-item__body__left__content__required {
	left: -25rpx !important;
	top: -2rpx !important;
}
.signeeBox {
	height: 50vw;
	border: 4rpx dashed #eee;
}
</style>
