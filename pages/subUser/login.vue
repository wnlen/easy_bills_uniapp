<template>
	<view
		class="vh100 vw100 flex-col items-center justify-center no-scroll"
		style="background-size: cover; background-image: url('https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/user/login.png')"
	>
		<!-- #ifdef MP-WEIXIN -->
		<view class="absolute" style="left: 48rpx; top: 120rpx; color: #333333" @click="experience">暂不登录</view>
		<view class="form-wrap width60 flex-col items-center" style="top: 400rpx">
			<up-image class="login-logo" width="400rpx" src="https://res-oss.elist.com.cn/wxImg/user/logoLogin.svg" mode="widthFix"></up-image>
			<view class="width100 pb60 login_box">
				<view class="login_btn1" v-if="ischeck">
					<wd-button :customStyle="{ width: '100%' }" open-type="getPhoneNumber" @getphonenumber="(e) => getPhoneNumber(e)">
						<text class="ft-white ft32">手机号快捷登录</text>
					</wd-button>
				</view>
				<view class="login_btn2" v-else>
					<wd-button :customStyle="{ width: '100%' }" @click="wxmp_login">
						<text class="ft-white ft32">手机号快捷登录</text>
					</wd-button>
				</view>
				<view class="width100 justify-center items-center flex-row pt30" style="font-size: 20rpx">
					<view
						class="flex-col justify-center items-center"
						:style="{ backgroundColor: ischeck ? '#01BB74' : '#ffffff' }"
						@click="radioGroupChange"
						style="border-radius: 100rpx; height: 30rpx; width: 30rpx; border: 2rpx solid #aaaaaa"
					>
						<wd-icon name="check" color="#ffffff" size="16rpx"></wd-icon>
					</view>
					<view class="ml15">
						<text style="color: #aaaaaa; font-size: 24rpx">同意并遵行易单据</text>
						<text style="color: #01bb74; font-size: 24rpx" @tap.stop="jump(0)">《用户服务协议》</text>
						<text style="color: #aaaaaa; font-size: 24rpx">和</text>
						<text style="color: #01bb74; font-size: 24rpx" @tap.stop="jump(1)">《隐私政策》</text>
					</view>
				</view>
			</view>
		</view>

		<up-popup :show="roleShow" mode="bottom" round="14" height="800rpx" :closeable="true" :mask-close-able="false">
			<view class="pd36 flex-col justify-center items-center">
				<text class="ft30 ft-bold ft-green mb10" style="color: #01bb74; font-size: 40rpx; font-weight: bold">切换用户角色</text>
				<text class="ft-gray pb48">随时切换您的收发货角色，快速收发单</text>
				<view class="vw100 flex-row" style="height: 400rpx">
					<view class=""></view>
					<view class="" style="height: 500rpx; width: 40%; margin-left: 8%; margin-right: 2%; border: 2rpx solid #01bb74; border-radius: 24rpx" @click="roleQH(0)">
						<!-- <up-image v-show="role==0" border-radius="20" width="100%" height="100%"
							src="/static/images/role01.svg"></up-image> -->
						<!-- <up-image v-show="role!=0" border-radius="20" width="100%" height="100%"
							src="/static/images/role00.svg"></up-image> -->
					</view>
					<view class="" style="height: 500rpx; width: 40%; border: 2rpx solid #01bb74; border-radius: 24rpx" @click="roleQH(1)">
						<!-- <up-image v-show="role==1" border-radius="20" width="100%" height="100%"
							src="/static/images/role03.svg"></up-image>
						<up-image v-show="role!=1" border-radius="20" width="100%" height="100%"
							src="/static/images/role02.svg"></up-image> -->
					</view>
				</view>
				<view class="" style="margin-top: 8vh; width: 80vw">
					<wd-button :customStyle="{ width: '100%' }" @click="submitRole">确定</wd-button>
				</view>
			</view>
		</up-popup>
		<!-- #endif -->

		<!-- #ifndef MP-WEIXIN -->
		<view class="flex-col justify-center items-center pb350" style="width: 100%">
			<view class="head">
				<view class="headline">欢迎登录</view>
			</view>
			<view class="pt48">
				<view class="InputTab">
					<view class="headlineInput">手机号</view>
					<view class="Input">
						<input
							placeholder-class="placeholder_class"
							v-model="fromLogin.phoneNumber"
							type="number"
							maxlength="11"
							placeholder="请输入手机号"
							class="u-line-1 ml15 endcolor"
							@focus="phoneNumberFocusInput"
						/>
					</view>
					<text class="err ml24" v-if="phoneNumberErr">请输入手机号码</text>
				</view>
				<view class="InputTab">
					<view class="headlineInput">验证码</view>
					<view class="Input">
						<input
							placeholder-class="placeholder_class"
							v-model="fromLogin.smsCode"
							maxlength="10"
							placeholder="请输入验证码"
							@focus="smsCodeFocusInput"
							class="u-line-1 ml15 endcolor"
						/>
						<wd-count-down ref="countDown" style="display: none" :time="60 * 1000" :auto-start="false" @finish="codeFinish" @change="codeChange" />
						<text v-if="!isValidPhone" class="ft-lightgray mr48">{{ tips }}</text>
						<text v-else class="ft-green mr48" @click="getCode">{{ tips }}</text>
					</view>
					<text class="err ml24" v-if="smsCodeErr">请输入验证码</text>
					<view class="headlineEnd mb36" v-if="err">
						<text class="ts" @click="ZC">手机号或验证码错误，请重新输入!!!</text>
					</view>
					<!-- <view class="headlineEnd">
						<text class="left" @click="ZC">立即注册</text>
						<text class="right" @click="wjPassword">忘记密码?</text>
					</view> -->
				</view>
			</view>
			<view class="buttonTab">
				<view class="button" @click="LoginImport">立即登录</view>
			</view>
			<view class="yszc" style="font-size: 20rpx">
				<view class="flex-col justify-center items-center list1" :style="{ backgroundColor: ischeck ? '#01BB74' : '#ffffff' }" @click="radioGroupChange">
					<wd-icon name="check" color="#ffffff" size="16rpx"></wd-icon>
				</view>
				<view class="ml15">
					<text style="color: #aaaaaa; font-size: 24rpx">同意并遵行易单据</text>
					<text style="color: #01bb74; font-size: 24rpx" @top.stop @click="jump(0)">《用户服务协议》</text>
					<text style="color: #aaaaaa; font-size: 24rpx">和</text>
					<text style="color: #01bb74; font-size: 24rpx" @top.stop @click="jump(1)">《隐私政策》</text>
				</view>
			</view>

			<view class="module">
				<view class="yjdl" @click="$univerify()">本机号码一键登录</view>
				<view class="mt20" style="color: #aaaaaa; font-size: 24rpx; text-align: center">第三方登录</view>
				<view class="mt10 flex-row justify-center items-center" style="text-align: center">
					<view class="flex-row justify-center items-center mr30" style="background-color: #01bb74; height: 96rpx; width: 96rpx; border-radius: 50%">
						<albb-icon icon="ydj-weixin-fill" color="#fff" size="80rpx" @active="wxloginInit"></albb-icon>
					</view>
					<!-- #ifdef APP-IOS -->
					<wd-icon name="apple-filled" size="96rpx"></wd-icon>
					<!-- #endif -->
				</view>
			</view>
		</view>
		<!-- #endif -->
		<!-- 微信小程序隐私弹窗 -->

		<up-popup :show="yinsi_show" :safeAreaInsetBottom="false" mode="center" @close="yinsi_close" @open="yinsi_open" :customStyle="yisi_customStyle">
			<view class="yinsi_box">
				<view class="yinsi_title">用户协议及隐私政策</view>
				<view class="pl20 pr20" style="text-align: justify">
					<text>请详细阅读并同意</text>
					<text style="color: #01bb74" @top.stop @click="jump(0)">《用户服务协议》</text>
					<text>和</text>
					<text style="color: #01bb74" @top.stop @click="jump(1)">《隐私政策》</text>
					<text>，同意授权后未注册的手机号码将自动注册易单据账号</text>
				</view>
				<view class="btn_l" @click="yinsi_close">不同意</view>
				<view @click="yinsi_agree" class="btn_r">
					<wd-button class="btn_r" open-type="getPhoneNumber" @getphonenumber="(e) => getPhoneNumber(e)">同意并继续</wd-button>
				</view>
			</view>
		</up-popup>

		<!-- <lq-privacy-dialog ref="privacyDialog" /> -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			tips: '获取验证码',
			xy: ['https://upbill.cn/h5/notice/ServiceAgreement-v1.htm', 'https://upbill.cn/h5/notice/ApplicationPrivacyAgreement-v1.htm'],
			role: 0,
			yisi_customStyle: {
				width: '560rpx',
				height: '558rpx',
				padding: '94rpx 40rpx 0',
				background: 'url(https://res-oss.elist.com.cn/wxImg/user/yinsibg.png) no-repeat',
				backgroundSize: '100% 100%'
			},
			yinsi_show: false,
			ischeck: false,
			value: 'orange',
			pageroute: '', //存入页面来源url
			wxLoginCode: '',
			roleShow: false,
			isApp: false,
			message: '',
			items: [
				{
					value: 'D',
					name: '我要发货'
				},
				{
					value: 'R',
					name: '我要收货'
				}
			],
			eyePassword: true,
			fromLogin: {
				phoneNumber: '',
				smsCode: '',
				type: 0
			},
			err: false,
			phoneNumberErr: false,
			smsCodeErr: false,
			sharePath: null
		};
	},
	computed: {
		// 计算属性判断是否手机号
		isValidPhone() {
			const value = String(this.fromLogin.phoneNumber).trim();
			return /^1[3-9]\d{9}$/.test(value);
		}
	},
	onLoad(option) {
		//使用微信登录获取登录code
		// this.getSystemInfoSyncInit();

		//接收分享参数
		if (option && option.sharePath) {
			this.sharePath = option.sharePath;
		}
	},
	onShow() {
		// this.fromLogin.phoneNumber = '15143483363';
		// #ifdef MP-WEIXIN
		// this.refreshCode();
		// #endif
	},
	onShareAppMessage(ops) {
		return {
			title: '打开易单据小程序，极速管理您的货单~',
			path: '/pages/index/index',
			imageUrl: '/static/share.png'
		};
	},
	onBackPress(options) {
		// console.log('from:' + options.from);
	},
	methods: {
		codeFinish() {
			this.$refs.countDown.reset();
			this.tips = '重新获取';
		},
		codeChange(e) {
			this.tips = `${e.seconds}s后重新获取`;
		},
		getCode() {
			if (this.tips != '获取验证码' || this.tips != '重新获取') {
				uni.$api.sms
					.getSmsCode({
						phone: this.fromLogin.phoneNumber,
						scene: 'login'
					})
					.then((res) => {
						this.$refs.countDown.start();
					})
					.catch((err) => {
						console.error('短信接口失败', err);
					});
			}
		},
		yinsi_open() {
			this.yinsi_show = true;
		},
		yinsi_close() {
			this.yinsi_show = false;
		},
		yinsi_agree() {
			this.ischeck = true;
			this.yinsi_close();
		},
		//隐私协议弹窗
		wxmp_login() {
			if (!this.ischeck) {
				this.yinsi_show = true;
			} else {
			}
		},
		getSystemInfoSyncInit() {
			const systemInfo = uni.getSystemInfoSync();
			if (systemInfo.platform === 'android' || systemInfo.platform === 'ios') {
				this.isApp = true;
				console.log('app');
			} else {
				this.isApp = false;
				console.log('小程序');
			}
		},
		experience() {
			console.log('立即体验');
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
		jump(i) {
			uni.navigateTo({
				url: '/pages/subUser/webpage?url=' + this.xy[i]
			});
		},
		roleQH(i) {
			this.role = i;
		},
		radioChange(e) {
			console.log(e + '1');
		},
		radioGroupChange(e) {
			this.ischeck = !this.ischeck;
		},
		//微信小程序登录和获取手机号
		getPhoneNumber(e) {
			if (e.errMsg != 'getPhoneNumber:ok') {
				this.$u.toast('您已拒绝授权 请重新点击并授权');
				return;
			}
			var that = this;
			uni.login({
				provider: 'weixin',
				onlyAuthorize: true,
				success: function (res) {
					const inviterId = uni.getStorageSync('inviterId') || null; // 登录前保存过
					uni.$api.user
						.loginMpWX({
							loginCode: res.code, //登录code
							phoneCode: e.code, //手机号code
							inviterId: inviterId || null //邀请id
						})
						.then((res) => {
							var resDate = res.data.data;
							that.message = res.data.message;
							if (resDate.data == null || resDate.data.work == null) {
								that.$u.toast(that.message);
								return;
							}

							uni.$u.setPinia({
								user: {
									userRole: 'D',
									token: resDate.loginToken,
									user: resDate,
									work: resDate.data.work != '1' ? 'N' : 'Y'
								}
							});
							console.log('亘古不变', that.$u.getPinia('user.user'));

							if (resDate.phone != '' && resDate.data.work != null) {
								that.$loadUser(that);
								console.log('授权完', that.sharePath);
								// 接收分享参数
								if (that.sharePath) {
									uni.navigateBack();
									// console.log('接收分享参数', that.share_data);
									// uni.redirectTo({
									// 	url:
									// 		'/pages/subOrder/detailsShare?share_id=' +
									// 		that.share_data.id +
									// 		'&phone=' +
									// 		that.share_data.phone +
									// 		'&port=' +
									// 		that.share_data.port +
									// 		'&type=' +
									// 		that.share_data.type +
									// 		'&versions=' +
									// 		that.share_data.versions
									// });
								} else {
									uni.switchTab({
										url: '/pages/index/index'
									});
									// that.roleShow = true;
								}
							} else {
								that.$u.toast(that.message);
							}
						})
						.catch((res) => {
							that.$u.toast('服务器异常,请联系官方客服');
						});
				}
			});
		},
		queryParams(data, isPrefix = false) {
			let prefix = isPrefix ? '?' : '';
			let _result = [];
			for (let key in data) {
				let value = data[key];
				// 去掉为空的参数
				if (['', undefined, null].includes(value)) {
					continue;
				}
				if (value.constructor === Array) {
					value.forEach((_value) => {
						_result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value));
					});
				} else {
					_result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
				}
			}
			return _result.length ? prefix + _result.join('&') : '';
		},
		radioChange(e) {
			this.$u.setPinia({
				user: {
					userRole: e.detail.value
				}
			});
		},
		submitRole() {
			if (this.role == 0) {
				this.$u.setPinia({
					user: {
						userRole: 'D'
					}
				});
			} else {
				this.$u.setPinia({
					user: {
						userRole: 'R'
					}
				});
			}
			this.roleShow = false;
			uni.reLaunch({
				url: '/pages/index/index'
			});
		},
		phoneNumberFocusInput() {
			console.log('对焦');
			this.phoneNumberErr = false;
		},
		smsCodeFocusInput() {
			console.log('对焦');
			this.smsCodeErr = false;
		},
		ZC() {
			uni.navigateTo({
				url: '/pages/subUser/register/register'
			});
		},
		wjPassword() {
			var fromLogin = this.fromLogin;
			uni.navigateTo({
				url: '/pages/subUser/login/verificationCodeLogin/verificationCodeLogin?fromLogin=' + JSON.stringify(fromLogin)
			});
		},
		LoginPhone(phone) {
			console.log('手机号码：', phone);
			this.fromLogin.phoneNumber = phone;
			// uni.$api.user.loginWithAppPhone(this.fromLogin).then.then((res) => {
			// 	console.log(res);
			// 	var mess = res.data;
			// 	this.$u.toast(mess.message);
			// 	setTimeout(() => {
			// 		uni.closeAuthView(); //关闭一键登录弹出窗口
			// 	}, 500);
			// 	if (mess.data.type == 1) {
			// 		this.$u.setPinia({
			// 			user: {
			// 				user: mess.data,
			// 				token: mess.data.loginToken
			// 			}
			// 		});

			// 		this.$loadUser(this);
			// 		uni.switchTab({
			// 			url: '/pages/index/index'
			// 		});
			// 	}
			// });
		},
		LoginImport() {
			if (!this.ischeck) {
				this.$u.toast('请勾选用户协议～');
				return;
			}

			if (this.fromLogin.phoneNumber == '' && this.fromLogin.phoneNumber.length < 11) {
				this.$u.toast('请输入手机号码～');
				this.phoneNumberErr = true;
				return;
			}

			if (this.fromLogin.smsCode == '') {
				this.$u.toast('请输入验证码～');
				this.smsCodeErr = true;
				return;
			}

			uni.$api.user
				.loginAppPhone({
					phoneNumber: String(this.fromLogin.phoneNumber || ''),
					smsCode: String(this.fromLogin.smsCode || '')
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
					console.log('报错', res);
					this.$u.toast(res.data.data);
				});
		},
		wxloginInit() {
			var _this = this;
			console.log('点击');
			uni.login({
				provider: 'weixin',
				onlyAuthorize: true,
				success: function (loginRes) {
					console.log('app------>', loginRes);
					// loginWXVerifyId
					var dx = {
						code: loginRes.code
					};
					uni.$api.user.verifyLoginWXIdentity(dx).then((res) => {
						console.log('后台获取=====>', res);
						var data = res.data.data;
						if (data.id) {
							//登录成功
						} else {
							var unionId = data.unionId;
							var openIdApp = data.openIdApp;
							this.getUserInfo(unionId, openIdApp);
						}
					});
					// this.getUserInfo(loginRes.authResult.access_token, loginRes.authResult.openid);
				}.bind(this),
				fail: function (err) {
					// 显示失败提示
					uni.showToast({
						title: '登录失败：' + err.errMsg,
						icon: 'none',
						duration: 2000
					});
					console.error('登录失败：', err);
				}
			});
		},
		getUserInfo(unionid, openIdApp) {
			if (this.isValid(unionid)) {
				// 所有变量都有有效值的处理逻辑
				var dx = {
					unionId: unionid,
					openIdApp: openIdApp,
					phone: '',
					code: ''
				};

				uni.navigateTo({
					url: '/pages/subUser/bindingPhone/bindingPhone?data=' + JSON.stringify(dx)
				});
			} else {
				// 存在变量值为 null、空字符串或者 undefined 的处理逻辑
				this.$u.toast('微信拉取失败~');
				console.log('存在变量值为 null、空字符串或者 undefined');
			}
		},
		isValid(value) {
			return value !== null && value !== '' && value !== undefined;
		}
	}
};
</script>

<style scoped lang="scss">
.module {
	position: fixed;
	bottom: 40rpx;
}

.no-scroll {
	touch-action: none;
	overscroll-behavior: contain;
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
	.list1 {
		border-radius: 100rpx;
		height: 30rpx;
		width: 30rpx;
		border: 2rpx solid #aaaaaa;
	}
}

.head {
	margin-bottom: 210rpx;
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
	top: 150rpx;
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
	background-color: #01bb74;
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

	.ts {
		color: #f53f3f;
	}
}

.InputTab {
	margin-bottom: 40rpx;
}

.buttonTab {
	margin-top: 20rpx;
}

.err {
	color: #f53f3f;
	font-size: 24rpx;
}
.yinsi_box {
	position: relative;
	height: 372rpx;
	.yinsi_title {
		font-size: 36rpx;
		font-weight: bold;
		text-align: center;
		margin-bottom: 52rpx;
	}
	.btn_l {
		position: absolute;
		width: 220rpx;
		height: 70rpx;
		bottom: 0;
		left: 0;
		border-radius: 750.62rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #aaaaaa;
		background: #f0f0f0;
	}
	.btn_r {
		font-size: 28rpx;
		position: absolute;
		width: 220rpx;
		height: 70rpx;
		bottom: 0;
		right: 0;
		background-color: #00d081;
		color: #fff;
		border-radius: 750.62rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		&::after {
			border: none;
		}
	}
}
.login_box {
	padding-top: 200rpx;
	position: relative;
	.login_btn1 {
		position: absolute;
		top: 100rpx;
		width: 100%;
		z-index: 1;
	}
	.login_btn2 {
		position: absolute;
		top: 100rpx;
		width: 100%;
		z-index: 2;
	}
}
</style>
