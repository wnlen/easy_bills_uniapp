<template>
	<view
		class="vh100 vw100 flex-col items-center"
		style="background-size: cover; background-image: url('https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/user/login.png')"
	>
		<view class="" style="background-color: transparent">
			<up-navbar :placeholder="true" autoBack :border-bottom="false" title="" bgColor="transparent"></up-navbar>
		</view>
		<view class="relative width100">
			<view class="headline">绑定手机号</view>
		</view>
		<view v-if="hint" class="flex-col justify-center items-center" style="margin-top: 20%; width: 100%">
			<view class="InputTab">
				<view class="headlineInput">手机号</view>
				<view class="Input">
					<input placeholder-class="placeholder_class" v-model="fromCode.phone" type="number" maxlength="11" placeholder="请输入手机号" class="u-line-1 ml15 endcolor" />
				</view>
			</view>
			<view class="InputTab">
				<view class="headlineInput">验证码</view>
				<view class="Input">
					<input
						placeholder-class="placeholder_class"
						v-model="fromCode.code"
						type="number"
						maxlength="10"
						placeholder="请输入验证码"
						class="u-line-1 ml15 endcolor codeInput"
					/>
					<wd-count-down ref="countDown" style="display: none" :time="60 * 1000" :auto-start="false" @finish="codeFinish" @change="codeChange" />
					<text v-if="!isValidPhone" class="ft-lightgray mr48">{{ interval }}</text>
					<text v-else class="ft-green mr48" @click="getCode">{{ interval }}</text>
				</view>
			</view>

			<view class="buttonTab">
				<view class="button" @click="OKUSER_APP">确认</view>
			</view>
		</view>
		<view v-else class="flex-row justify-center items-center">
			{{ hintMe }}
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			openid: '',
			fromCode: {
				phone: '',
				code: '',
				unionId: '',
				openIdApp: '',
				bindTicket: ''
			},
			timer: null,
			interval: '获取验证码',
			hint: true,
			hintMe: ''
		};
	},
	computed: {
		// 计算属性判断是否手机号
		isValidPhone() {
			const value = String(this.fromCode.phone).trim();
			return /^1[3-9]\d{9}$/.test(value);
		}
	},
	onLoad(option) {
		console.log('节后', option);
		this.fromCode.bindTicket = option.bindTicket;
		// this.fromCode.phone = '17364080435';
		// this.openid = option.openid
		// this.fromCode = JSON.parse(option.data);
	},
	onReady(option) {
		console.log('onReady');
	},
	onShow(option) {},
	methods: {
		codeFinish() {
			this.$refs.countDown.reset();
			this.interval = '重新获取';
		},
		codeChange(e) {
			this.interval = `${e.seconds}s后重新获取`;
		},
		getCode() {
			if (this.interval != '获取验证码' || this.interval != '重新获取') {
				console.log('重新获取');
				uni.$api.sms
					.getSmsCode({
						phone: this.fromCode.phone,
						scene: 'bind'
					})
					.then((res) => {
						this.$refs.countDown.start();
					})
					.catch((err) => {
						console.error('短信接口失败', err);
					});
			}
		},
		verification() {
			if (this.fromCode.phone == '') {
				this.$u.toast('请输入手机号码');
				return false;
			}

			if (this.fromCode.code == '') {
				this.$u.toast('请输入验证码');
				return false;
			}
		},
		OKUSER_APP() {
			this.verification();
			console.log('this.fromCode.bindTicket', this.fromCode.bindTicket);
			uni.$api.user
				.loginAppWXBindPhone({
					bindTicket: this.fromCode.bindTicket,
					phone: this.fromCode.phone,
					smsCode: this.fromCode.code
				})
				.then((res) => {
					var resDate = res.data.data;
					uni.$u.setPinia({
						user: {
							userRole: 'D',
							token: resDate.loginToken,
							user: resDate,
							work: resDate.data.work != '1' ? 'N' : 'Y'
						}
					});

					this.$loadUser(this);
					uni.switchTab({
						url: '/pages/index/index'
					});
				})
				.catch((res) => {
					console.log('登录失败', res);
				});
		}
	}
};
</script>

<style scoped lang="scss">
.module {
	position: fixed;
	bottom: 0;
	height: 20vh;
}
.headline {
	font-family: Source Han Sans;
	font-size: 52rpx;
	font-weight: 500;
	line-height: 42.24rpx;
	letter-spacing: 0rpx;
	font-feature-settings: 'kern' on;
	color: #333333;
	position: absolute;
	top: 50rpx;
	left: 40rpx;
	display: block;
}
.yjdl {
	width: 380rpx;
	height: 100rpx;
	border-radius: 376rpx;
	opacity: 1;
	background: #f5fcf9;

	font-family: Source Han Sans;
	font-size: 30rpx;
	font-weight: 500;
	line-height: 42.24rpx;
	text-align: center;
	letter-spacing: 0rpx;

	font-feature-settings: 'kern' on;
	color: #01bb74;

	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}

.placeholder_class {
	color: #999999;
	font-family: Source Han Sans;
	font-size: 28rpx;
	font-weight: normal;
	line-height: 42.24rpx;
	letter-spacing: 0rpx;

	margin-left: 0rpx;

	text-align: left;
}

.yszc {
	display: flex;
	flex-direction: row;
	align-items: center;
	padding-top: 30rpx;
}

.head {
	margin-bottom: 160rpx;
	width: 100%;
	position: relative;
}

.headline {
	font-family: Source Han Sans;
	font-size: 52rpx;
	font-weight: 500;
	line-height: 42.24rpx;
	letter-spacing: 0rpx;
	font-feature-settings: 'kern' on;
	color: #333333;
	position: absolute;

	left: 40rpx;
}

.headlineInput {
	font-family: Source Han Sans;
	font-size: 32rpx;
	font-weight: normal;
	line-height: 42.24rpx;
	text-align: center;
	letter-spacing: 0rpx;
	font-feature-settings: 'kern' on;
	color: #333333;

	display: flex;
	flex-direction: row;
	justify-content: left;
	align-items: center;

	margin-bottom: 20rpx;
}

.Input {
	width: 578.22rpx;
	height: 96rpx;
	border-radius: 376rpx;
	opacity: 1;

	display: flex;
	flex-direction: row;
	justify-content: left;
	align-items: center;

	background: #f5fcf9;
}

input {
	text-align: left;
	// background-color: #01BB74;
	height: 100%;
	width: 80%;
	text-indent: 40rpx;
}

.codeInput {
	width: 70%;
}

.button {
	width: 580rpx;
	height: 100rpx;
	border-radius: 376rpx;
	opacity: 1;
	background: #01bb74;

	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;

	font-size: 36rpx;
	font-weight: 500;
	color: #ffffff;

	margin-top: 80rpx;
	box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.1), 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
}

.button:hover {
	background-color: #01bb74;
	/* 悬停时改变背景颜色 */
}

.button:active {
	background-color: #00d382;
	/* 按下时改变背景颜色 */
	transform: translateY(2rpx);
	/* 按下时稍微向下移动一点，增加反馈 */
}

.headlineEnd {
	display: flex;
	flex-direction: row;
	margin-top: 10rpx;
	font-size: 24rpx;
	font-weight: normal;
	position: relative;

	.left {
		position: absolute;
		left: 0;
	}

	.right {
		position: absolute;
		right: 0;
	}
}

.InputTab {
	margin-bottom: 40rpx;
}

.buttonTab {
	margin-top: 20rpx;
}
</style>
