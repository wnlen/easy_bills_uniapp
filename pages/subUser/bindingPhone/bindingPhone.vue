<template>
	<view class="vh100 vw100 flex-col items-center"
		style="background-size: cover;background-image: url('https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/user/login.png');">
		<view class="" style="background-color: transparent;">
			<u-navbar :custom-back="customBack" :border-bottom="false" title-color="#333333" title="" title-size="28"
				:background="{background:'transparent',color:'white',fontSize: '14px'}"></u-navbar>
		</view>
		<view v-if="hint" class="flex-col justify-center items-center" style="margin-top: 10%;width: 100%;">
			<view class="InputTab">
				<view class="headlineInput">手机号</view>
				<view class="Input">
					<input placeholder-class="placeholder_class" v-model="fromCode.phone" type="number" maxlength="11"
						placeholder="请输入手机号" class="u-line-1 ml15 endcolor" />
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


			<view class="buttonTab">
				<view class="button" @click="OKUSER_APP">确认</view>
			</view>

		</view>
		<view v-else class="flex-row justify-center items-center">
			{{hintMe}}
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				openid: "",
				fromCode: {
					phone: "",
					code: "",
					unionId: "",
					openIdApp: ""
				},
				timer: null,
				interval: 70,
				hint: true,
				hintMe: ""
			}
		},
		onLoad(option) {
			// this.openid = option.openid
			this.fromCode = JSON.parse(option.data)
		},
		onReady(option) {
			console.log("onReady");
		},
		onShow(option) {

		},
		methods: {
			getCode() {
				console.log("获取验证码");
				var phone = this.fromCode.phone
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
					phoneNumber: this.fromCode.phone,
					type: 0
				}

				this.$u.post('edo/rest/app/v1/passwordResetGetCode', dx).then(
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
			verification() {
				if (this.fromCode.phone == "") {
					this.$u.toast("请输入手机号码");
					return false;
				}

				if (this.fromCode.code == "") {
					this.$u.toast("请输入验证码");
					return false;
				}

				return true;
			},
			OKUSER_APP() {
				var verif = this.verification();
				if (!verif) {
					return;
				}
				this.$u.post('edo/rest/app/v1/loginWX', this.fromCode).then(
					res => {
						console.log("===登陆结果===>", res);
						var data = res.data;
						if (data.data == "6") {
							console.log("666");
							this.$u.toast(data.message);
							this.hint = false
							this.hintMe = data.message
						} else if (data.data == "0") {
							this.$u.toast(data.message);
						}
					});
			},
			customBack() {
				uni.navigateBack()
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