<template>
	<view class="vh100 vw100 flex-col items-center"
		style="background-size: cover;background-image: url('https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/user/login.png');">
		<view class="" style="background-color: transparent;">
			<u-navbar :custom-back="customBack" :border-bottom="false" title-color="#333333" title="" title-size="28"
				:background="{background:'transparent',color:'white',fontSize: '14px'}"></u-navbar>
		</view>
		<view class="flex-col justify-center items-center" style="margin-top: 10%;width: 100%;">
			<view class="head">
				<view class="headline">{{passwordState?"重置密码":"设置密码"}}</view>
			</view>
			<view class="InputTab">
				<view class="headlineInput">手机号</view>
				<view class="Input">
					<input placeholder-class="placeholder_class" v-model="fromCode.phoneNumber" type="number"
						maxlength="11" placeholder="请输入手机号" class="u-line-1 ml15 endcolor" />
				</view>
			</view>
			<view class="InputTab">
				<view class="headlineInput">验证码</view>
				<view class="Input">
					<input placeholder-class="placeholder_class" v-model="fromCode.code" type="number" maxlength="10"
						placeholder="请输入验证码" class="u-line-1 ml15 endcolor codeInput" />
					<u-text @click="getCode"
						style="font-size: 12px;color: #01BB74;">{{interval==70?"获取验证码":"倒计时 "+interval}}</u-text>
				</view>
			</view>
			<view class="InputTab">
				<view class="headlineInput">新密码</view>
				<view class="Input">
					<input placeholder-class="placeholder_class" v-model="fromCode.password"
						:type="eyePassword?'password':'text'" maxlength="10" placeholder="请输入密码"
						class="u-line-1 ml15 endcolor" />
					<u-icon v-if="eyePassword" @click="eyePassword=!eyePassword" name="eye-off" color="#01BB74"
						size="35"></u-icon>
					<u-icon v-if="!eyePassword" @click="eyePassword=!eyePassword" name="eye-fill" color="#01BB74"
						size="35"></u-icon>
				</view>
			</view>
			<view class="InputTab">
				<view class="headlineInput">确认密码</view>
				<view class="Input">
					<input placeholder-class="placeholder_class" v-model="fromCode.okPassword"
						:type="eyePassword?'password':'text'" maxlength="10" placeholder="请输入密码"
						class="u-line-1 ml15 endcolor" />
					<u-icon v-if="eyePassword" @click="eyePassword=!eyePassword" name="eye-off" color="#01BB74"
						size="35"></u-icon>
					<u-icon v-if="!eyePassword" @click="eyePassword=!eyePassword" name="eye-fill" color="#01BB74"
						size="35"></u-icon>
				</view>
			</view>
			<view class="buttonTab">
				<view class="button" @click="OKPASSWORD">确认</view>
			</view>
			<view class="yszc" style="font-size: 10px;">
				<view class="flex-col justify-center items-center"
					:style="{backgroundColor:disabled?'#01BB74':'#ffffff'}" @click="radioGroupChange"
					style="border-radius: 50px;height: 15px;width: 15px;border: 1px solid #AAAAAA;">
					<u-icon name="checkbox-mark" color="#ffffff" size="28"></u-icon>
				</view>
				<view class="ml15">
					<text style="color: #AAAAAA;font-size: 12px;">同意并遵行易单据</text>
					<text style="color: #01BB74;font-size: 12px;" @top.stop @click="jump(0)">《用户服务协议》</text>
					<text style="color: #AAAAAA;font-size: 12px;">和</text>
					<text style="color: #01BB74;font-size: 12px;" @top.stop @click="jump(1)">《隐私政策》</text>
				</view>
			</view>

		</view>
		<!-- <view class="module">
			<view class="yjdl" @click="oneKeyLogin">
				本机号码一键登录
			</view>
			<view class="mt20" style="color: #AAAAAA;font-size: 12px;text-align: center;">
				第三方登录
			</view>
			<view class="mt10 flex-row justify-center items-center" style="text-align: center;">
				<view class="flex-row justify-center items-center"
					style="background-color: #20C300;height: 60px;width: 60px;border-radius: 50%;">
					<u-icon name="weixin-fill" color="#ffffff" size="100"></u-icon>
				</view>

			</view>
		</view> -->
	</view>
</template>
<script>
	export default {
		data() {
			return {
				passwordState: true,
				disabled: false,
				xy: [
					"https://res-oss.elist.com.cn/notice/yhfwxy-v2.htm",
					"https://res-oss.elist.com.cn/notice/ydj-yhysxy-v2.htm"
				],
				message: "",
				eyePassword: true,
				fromCode: {
					phoneNumber: "",
					code: "",
					password: "",
					okPassword: ""
				},
				timer: null,
				interval: 70
			}
		},
		onLoad(option) {
			console.log("option", option);
			var json = JSON.parse(option.fromLogin)
			this.fromCode.phoneNumber = json.phoneNumber
		},
		onReady(option) {
			console.log("onReady");
		},
		onShow(option) {

		},
		methods: {
			getCode() {
				console.log("获取验证码");
				var phone = this.fromCode.phoneNumber
				if (phone == "" || phone == undefined) {
					this.$u.toast("请填写手机号码～");
					return;
				}


				if (this.timer) {
					// 如果已经有倒计时，则不重复发送验证码  
					uni.showToast({
						title: '请勿重复获取',
						icon: 'none'
					});
					return;
				}
				var dx = {
					phoneNumber: this.fromCode.phoneNumber,
					type: 0
				}

				this.$api.user.getPasswordResetCode(dx).then(
					res => {
						var data = res.data
						var rescode = data.data == "1"
						if (rescode) {
							this.$u.toast(data.message);
							var that = this;
							this.timer = setInterval(() => {
								this.interval = this.interval - 1;
								if (that.interval <= 0) {
									clearInterval(that.timer);
									that.interval = 70;
									console.log("停止");
								}
							}, 1000);
						} else {
							this.$u.toast(data.message);
						}
					});
			},
			OKPASSWORD() {


				var password = this.fromCode.password
				var okPassword = this.fromCode.okPassword
				var code = this.fromCode.code
				var phoneNumber = this.fromCode.phoneNumber
				if (!this.disabled) {
					this.$u.toast("请勾选用户协议～");
					return;
				}

				if (password == "" || okPassword == "" || okPassword != okPassword || phoneNumber == "" || code == "") {
					this.$u.toast("信息不完整～");
				}

				console.log(this.fromCode);

				if (password == okPassword) {
					this.$api.user.getPasswordResetCode(dx).then(
						res => {
							var data = res.data
							var rescode = res.data.data == "1"
							if (rescode) {
								this.$u.toast(data.message);
								setTimeout(function() {
									uni.navigateBack()
								}, 500)
							} else {
								this.$u.toast(data.message);
							}
						});
				} else {
					this.$u.toast("两次密码输入不一样～");
				}
			},
			radioGroupChange() {
				this.disabled = this.disabled ? false : true
			},
			customBack() {
				uni.navigateBack()
			},
			jump(i) {
				uni.navigateTo({
					url: "/pages/subUser/webpage?url=" + this.xy[i]
				})
			}
		}

	}
</script>

<style scoped lang="scss">
	.module {
		position: fixed;
		bottom: 0;
		height: 20vh;
	}

	.yjdl {
		width: 190px;
		height: 50px;
		border-radius: 188px;
		opacity: 1;
		background: #F5FCF9;

		font-family: Source Han Sans;
		font-size: 15px;
		font-weight: 500;
		line-height: 21.12px;
		text-align: center;
		letter-spacing: 0px;

		font-feature-settings: "kern" on;
		color: #01BB74;

		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.placeholder_class {
		color: #999999;
		font-family: Source Han Sans;
		font-size: 14px;
		font-weight: normal;
		line-height: 21.12px;
		letter-spacing: 0px;

		margin-left: 0px;

		text-align: left;

	}

	.yszc {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-top: 30rpx;
	}

	.head {
		margin-bottom: 80px;
		width: 100%;
		position: relative;
	}

	.headline {
		font-family: Source Han Sans;
		font-size: 26px;
		font-weight: 500;
		line-height: 21.12px;
		letter-spacing: 0px;
		font-feature-settings: "kern" on;
		color: #333333;
		position: absolute;

		left: 20px;

	}

	.headlineInput {
		font-family: Source Han Sans;
		font-size: 16px;
		font-weight: normal;
		line-height: 21.12px;
		text-align: center;
		letter-spacing: 0px;
		font-feature-settings: "kern" on;
		color: #333333;

		display: flex;
		flex-direction: row;
		justify-content: left;
		align-items: center;

		margin-bottom: 10px;
	}


	.Input {
		width: 289.11px;
		height: 48px;
		border-radius: 188px;
		opacity: 1;

		display: flex;
		flex-direction: row;
		justify-content: left;
		align-items: center;


		background: #F5FCF9;
	}

	input {
		text-align: left;
		// background-color: #01BB74;
		height: 100%;
		width: 80%;
		text-indent: 20px;
	}

	.codeInput {
		width: 70%;
	}

	.button {
		width: 290px;
		height: 50px;
		border-radius: 188px;
		opacity: 1;
		background: #01BB74;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

		font-size: 18px;
		font-weight: 500;
		color: #FFFFFF;

		margin-top: 40px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.2);
	}

	.button:hover {
		background-color: #01BB74;
		/* 悬停时改变背景颜色 */
	}

	.button:active {
		background-color: #00d382;
		/* 按下时改变背景颜色 */
		transform: translateY(1px);
		/* 按下时稍微向下移动一点，增加反馈 */
	}

	.headlineEnd {
		display: flex;
		flex-direction: row;
		margin-top: 5px;
		font-size: 12px;
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
		margin-bottom: 20px;
	}

	.buttonTab {
		margin-top: 10px;
	}
</style>