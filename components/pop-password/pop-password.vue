<template>
	<u-popup class="flex-col justify-center items-center" round="15" :safeAreaInsetBottom="false" mode="center" v-model="showMask" width="600rpx" height="400rpx">
		<view class="flex-col justify-center items-center relative" style="height: 100%; width: 100%">
			<view class="absolute pt20" style="width: 100%; top: 0; height: 75%">
				<view class="flex-row items-center justify-center passwordTitle">请输入签收密码</view>
				<view class="flex-col items-center justify-center mt20" style="width: 100%; height: 35%">
					<u-message-input
						active-color="#01BB74"
						:bold="false"
						@change="changeList"
						@finish="finishList"
						:dot-fill="true"
						:v-model="password"
						mode="box"
						maxlength="4"
					></u-message-input>
					<view class="mt20 err" v-show="err">密码错误，请重新输入</view>
				</view>
				<view @click="goPath('/pages/subUser/resetpassword')" class="ft12 pr30 flex-row justify-end pt15" style="color: #999; width: 100%">找回密码</view>
			</view>
			<view class="flex-row items-center absolute u-border-top" style="width: 100%; bottom: 0; height: 25%">
				<view @click="cancel(password)" style="width: 50%; height: 100%" class="titlePas flex-col justify-center items-center">取消</view>
				<view @click="confirm(password)" style="width: 50%; height: 100%" class="titlePasOK flex-col justify-center items-center u-border-left">确认</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
export default {
	name: 'pop-password',
	props: {},
	data() {
		return {
			showMask: true,
			password: '',
			err: false
		};
	},
	methods: {
		cancel() {
			this.$parent.showPassVerify = false;
		},
		confirm(password) {
			var db_pass = this.pinia_user.password;
			var sr_pass = this.password;
			console.log(db_pass === sr_pass, db_pass, sr_pass);
			if (db_pass === sr_pass) {
				this.password = '';
				this.$parent.showPassVerify = false;
				this.$parent.confirmPassword();
				console.log('通过');
			} else {
				this.password = '';
				this.err = true;
			}
		},
		changeList(e) {
			this.password = e;
		},
		finishList() {
			console.log(this.password);
		}
	}
};
</script>

<style scoped lang="scss">
.passwordTitle {
	width: 100%;
	height: 40%;
	color: #333333;
	font-size: 18px;
	font-weight: 600;
}

.err {
	font-family: Source Han Sans;
	font-size: 13px;
	font-weight: normal;
	line-height: 22.46px;
	letter-spacing: 0.65px;

	font-feature-settings: 'kern' on;
	color: #f53f3f;
}
</style>
