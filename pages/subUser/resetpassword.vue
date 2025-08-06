<template>
	<view class="vh100 vw100 flex-col items-center" style="background-size: cover; background-image: url('https://res-oss.elist.com.cn/wxImg/user/unsubscribe.png')">
		<view class="absolute">
			<u-navbar background="transparent" :border-bottom="false"></u-navbar>
		</view>

		<view
			class="flex-row justify-center items-center"
			style="margin-top: 20%; font-size: 19px; font-weight: 600; line-height: 21.12px; text-align: center; letter-spacing: 0px; color: #333333; width: 100%; height: 10vh"
		>
			找回密码身份验证
		</view>
		<view class="" style="margin-top: 0%; background-color: #ffffff; border-radius: 6px; padding: 20px; padding-bottom: 70px">
			<view class="mt45">
				<view class="">手机号</view>
				<view class="flex-row justify-center items-center u-border-bottom relative">
					<text type="primary" class="absolute" style="left: 0">+86</text>
					<u-input :value="maskPhoneNumber(vuex_user.phone)" type="text" disabled="true" placeholder="请输入手机号"></u-input>
				</view>
			</view>
			<view class="mt30">
				<view class="">验证码</view>
				<view class="flex-row justify-center items-center u-border-bottom relative mt30 pb20" style="width: 100%; height: 30px">
					<u-input class="absolute my-input" style="left: 0" v-model="form.code" type="text" placeholder="请输入您的验证码"></u-input>
					<text
						class="absolute"
						style="font-size: 12px; font-weight: normal; line-height: 21.12px; text-align: center; letter-spacing: 0px; color: #01bb74; right: 10px"
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
					style="width: 268.76px; height: 52px; border-radius: 188px; opacity: 1; background: #01bb74; color: #ffffff"
				>
					下一步
				</view>
				<view @click="comparisonCode" class="flex-row justify-end items-center" style="background: transparent; width: 100%; text-align: right; margin-right: 24rpx">
					<u-button hover-class="none" :hair-line="false" :custom-style="buttonStyle" open-type="contact">人工找回密码</u-button>
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
				height: '100%',
				width: '100%',
				padding: '0',
				fontSize: '12px',
				color: '#666666'
			}
		};
	},
	onShareAppMessage(ops) {},
	onShow() {
		this.loadData();
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

			return maskedPhoneNumber;
		}
	}
};
</script>

<style>
.my-input .u-input-clear {
	/* 调整清除按钮的样式，比如 margin 或 padding */
	margin-right: 10px;
	/* 或者其他你想要的样式 */
}
</style>
