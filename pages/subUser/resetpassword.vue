<template>
	<view class="vh100 vw100 flex-col items-center" style="background-size: cover; background-image: url('https://res-oss.elist.com.cn/wxImg/user/unsubscribe.png')">
		<u-navbar :autoBack="true" :placeholder="true" bgColor="transparent"></u-navbar>

		<view
			class="flex-row justify-center items-center"
			style="margin-top: 10%; font-size: 38rpx; font-weight: 600; line-height: 42.24rpx; text-align: center; letter-spacing: 0rpx; color: #333333; width: 100%; height: 10vh"
		>
			找回密码身份验证
		</view>
		<view class="" style="margin-top: 0%; background-color: #ffffff; border-radius: 12rpx; padding: 40rpx; padding-bottom: 140rpx">
			<view class="mt45">
				<view class="">手机号</view>
				<view class="flex-row justify-center items-center u-border-bottom relative mt30">
					<u-input border="none" v-model="userPhone" disabledColor="#fff" type="text" disabled="true" placeholder="请输入手机号">
						<template #prefix>
							<u-text text="+86" margin="0 3px 0 0" type="tips"></u-text>
							<!-- <u-text mode="phone" :text="$u.getPinia('user.user.phone')" format="encrypt"></u-text> -->
						</template>
					</u-input>
				</view>
			</view>
			<view class="mt30">
				<view class="">验证码</view>
				<view class="flex-row justify-center items-center u-border-bottom relative mt30 pb20" style="width: 100%; height: 60rpx">
					<view class="absolute my-input" style="left: 0">
						<u-input border="none" v-model="form.code" type="text" placeholder="请输入您的验证码"></u-input>
					</view>
					<text
						class="absolute"
						style="font-size: 24rpx; font-weight: normal; line-height: 42.24rpx; text-align: center; letter-spacing: 0rpx; color: #01bb74; right: 20rpx"
						type="primary"
						@click="getCode"
					>
						{{ codeText == 0 ? '获取验证码' : '已发送（' + interval + ')' }}
					</text>
				</view>
			</view>
			<view class="flex-col justify-center items-center mt60">
				<view
					@click="comparisonCode"
					class="flex-row justify-center items-center"
					style="width: 537.52rpx; height: 104rpx; border-radius: 376rpx; opacity: 1; background: #01bb74; color: #ffffff"
				>
					下一步
				</view>
				<view class="relative" style="width: 100%">
					<u-button hover-class="none" :hair-line="false" :customStyle="buttonStyle" open-type="contact">人工找回密码</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				code: ''
			},
			timer: null, // 用于存储计时器
			interval: 70, // 验证码倒计时，单位秒
			codeText: 0,
			codeClick: true,
			signature: [],
			buttonStyle: {
				backgroundColor: 'transparent',
				border: 'none',
				appearance: 'none',
				outline: 'none',
				boxShadow: 'none',
				textAlign: 'right',
				height: '80rpx',
				width: '200rpx',
				padding: '0',
				fontSize: '24rpx',
				color: '#666666',
				position: 'absolute',
				top: 0,
				right: 0
			},
			userPhone: ''
		};
	},
	onShareAppMessage(ops) {},
	onShow() {
		this.loadData();
		this.userPhone = this.maskPhoneNumber(this.$u.getPinia('user.user.phone'));
	},
	methods: {
		loadData() {
			var that = this;
			this.$api.sign
				.getSignature({
					phone: this.vuex_user.phone
				})
				.then((res) => {
					console.log(res);
					this.signature = res.data.data;
				});
		},
		comparisonCode() {
			var code = this.form.code;
			if (code != '') {
				this.$api.user
					.verifyUnsubscribeCode({
						phone: this.vuex_user.phone,
						code: code
					})
					.then((res) => {
						if (res.data.code == 200) {
							console.log(this.signature);
							uni.redirectTo({
								url: '/pages/subPack/user/signee/add?item=' + JSON.stringify(this.signature[0])
							});
						} else {
							this.$u.toast('请填写正常验证码');
						}
					});
			} else {
				this.$u.toast('请填写验证码');
			}
		},
		// 获取验证码
		getCode() {
			if (this.codeClick) {
				this.codeClick = false;
				this.$api.user
					.getUnsubscribeCode({
						phone: this.vuex_user.phone,
						type: 1
					})
					.then((res) => {
						if (res.data.code === 200) {
							if (this.timer) {
								uni.showToast({
									title: '请勿重复发送',
									icon: 'none'
								});
								return;
							}

							this.codeText = 1;
							this.timer = setInterval(() => {
								if (this.interval > 0) {
									this.interval--;
								} else {
									clearInterval(this.timer);
									this.interval = 60;
									this.timer = null;
									this.codeText = 0;
									this.codeClick = true;
								}
							}, 1000);

							uni.showToast({
								title: '验证码已发送',
								icon: 'success'
							});
						} else {
							this.$u.toast(res.data.message || '发送失败');
						}
					});
			} else {
				this.$u.toast('请勿重复获取');
			}
		},
		maskPhoneNumber(phoneNumber) {
			if (!phoneNumber || phoneNumber.length < 10) {
				return phoneNumber; // 如果电话号码无效或长度不足，直接返回原号码
			}

			// 提取前三位和后四位
			const firstPart = phoneNumber.substring(0, 3);
			const lastPart = phoneNumber.substring(7);

			// 生成中间四位星号
			const middlePart = '*'.repeat(4);

			// 组合成新的电话号码
			const maskedPhoneNumber = `${firstPart}${middlePart}${lastPart}`;
			console.log(11111, maskedPhoneNumber);
			return maskedPhoneNumber;
		}
	}
};
</script>

<style>
.my-input .u-input-clear {
	/* 调整清除按钮的样式，比如 margin 或 padding */
	margin-right: 20rpx;
	/* 或者其他你想要的样式 */
}
</style>
