<template>
	<view class="vh100 vw100 flex-col items-center justify-center"
		style="background-size: cover;background-image: url('https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/user/login.png');">
		<!-- #ifdef MP-WEIXIN -->
		<view class="absolute" style="left: 48rpx;top: 120rpx;color: #333333;" @click="experience">
			暂不登录
		</view>
		<view class="form-wrap width60 flex-col items-center">
			<u-image class="login-logo" width="400rpx" src="https://res-oss.elist.com.cn/wxImg/user/logoLogin.svg"
				mode="widthFix"></u-image>
			<view class="width100 pt100 pb60">
				<u-button type="primary" hover-class="none" :custom-style="{backgroundColor:'#01BB74'}"
					class="form-btn-big" shape="circle" size="default" open-type="getPhoneNumber"
					@getphonenumber="getPhoneNumber" @click="">
					<u-icon name="" size="50" label="手机号快捷登录" label-color="#fff" label-size="32"></u-icon>
				</u-button>
				<view class="width100 justify-center items-center flex-row pt30" style="font-size: 10px;">
					<view class="flex-col justify-center items-center"
						:style="{backgroundColor:disabled?'#01BB74':'#ffffff'}" @click="radioGroupChange"
						style="border-radius: 50px;height: 20px;width: 20px;border: 1px solid #AAAAAA;">
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
		</view>

		<u-popup v-model="roleShow" mode="bottom" border-radius="14" height="800rpx" :closeable="true"
			:mask-close-able="false">
			<view class="pd36 flex-col justify-center items-center">
				<text class="ft30 ft-bold ft-green mb10"
					style="color: #01BB74;font-size: 20px;font-weight: bold;">切换用户角色</text>
				<text class="ft-gray pb48">随时切换您的收发货角色，快速收发单</text>
				<view class="vw100 flex-row" style="height: 200px;">
					<view class="">

					</view>
					<view class=""
						style="height: 250px;width: 40%;margin-left: 8%;margin-right: 2%;border: 1px solid #01BB74;border-radius: 12px;"
						@click="roleQH(0)">
						<u-image v-show="role==0" border-radius="20" width="100%" height="100%"
							src="/static/images/role01.svg"></u-image>
						<u-image v-show="role!=0" border-radius="20" width="100%" height="100%"
							src="/static/images/role00.svg"></u-image>
					</view>
					<view class="" style="height: 250px;width: 40%;border: 1px solid #01BB74;border-radius: 12px;"
						@click="roleQH(1)">
						<u-image v-show="role==1" border-radius="20" width="100%" height="100%"
							src="/static/images/role03.svg"></u-image>
						<u-image v-show="role!=1" border-radius="20" width="100%" height="100%"
							src="/static/images/role02.svg"></u-image>
					</view>
				</view>
				<view class="" style="margin-top: 8vh;width: 80vw;">
					<u-button class="width100" type="primary" shape="circle" @click="submitRole">确定</u-button>
				</view>
			</view>
		</u-popup>
		<!-- #endif -->

		<!-- #ifdef APP -->
		<view class="flex-col justify-center items-center pb350" style="width: 100%;">
			<view class="head">
				<view class="headline">欢迎登录</view>
			</view>
			<view class="InputTab">
				<view class="headlineInput">手机号</view>
				<view class="Input">
					<input placeholder-class="placeholder_class" v-model="fromLogin.phoneNumber" type="number"
						maxlength="11" placeholder="请输入手机号" class="u-line-1 ml15 endcolor"
						@focus="phoneNumberFocusInput" />
				</view>
				<text class="err ml24" v-if="phoneNumberErr">请输入手机号码</text>
			</view>
			<view class="InputTab">
				<view class="headlineInput">密码</view>
				<view class="Input">
					<input placeholder-class="placeholder_class" v-model="fromLogin.password"
						:type="eyePassword?'password':'text'" maxlength="10" placeholder="请输入密码"
						@focus="passsswordFocusInput" class="u-line-1 ml15 endcolor" />
					<u-icon v-if="eyePassword" @click="eyePassword=!eyePassword" name="eye-off" color="#01BB74"
						size="35"></u-icon>
					<u-icon v-if="!eyePassword" @click="eyePassword=!eyePassword" name="eye-fill" color="#01BB74"
						size="35"></u-icon>
				</view>
				<text class="err ml24" v-if="passsswordErr">请输入密码</text>
				<view class="headlineEnd mb36" v-if="err">
					<u-text class="ts" @click="ZC">手机号或密码错误，请重新输入!!!</u-text>
				</view>
				<view class="headlineEnd">
					<u-text class="left" @click="ZC">立即注册</u-text>
					<u-text class="right" @click="wjPassword">忘记密码?</u-text>
				</view>
			</view>
			<view class="buttonTab">
				<view class="button" @click="LoginImport">立即登录</view>
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


			<view class="module">
				<view class="yjdl" @click="oneKeyLogin">
					本机号码一键登录
				</view>
				<view class="mt20" style="color: #AAAAAA;font-size: 12px;text-align: center;">
					第三方登录
				</view>
				<view class="mt10 flex-row justify-center items-center" style="text-align: center;">
					<view class="flex-row justify-center items-center"
						style="background-color: #20C300;height: 60px;width: 60px;border-radius: 50%;"
						@click="wxloginInit">
						<u-icon name="weixin-fill" color="#ffffff" size="100"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<!-- #endif -->
		<!-- 切换角色 -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				xy: [
					"https://res-oss.elist.com.cn/notice/ServiceAgreement-v1.htm",
					"https://res-oss.elist.com.cn/notice/ApplicationPrivacyAgreement-v1.htm"
				],
				role: 0,
				disabled: false,
				value: 'orange',
				pageroute: '', //存入页面来源url
				wxLoginRes: '',
				roleShow: false,
				isApp: false,
				message: "",
				items: [{
						value: 'D',
						name: '我要发货'
					},
					{
						value: 'R',
						name: '我要收货'
					}
				],
				disabled: false,
				eyePassword: true,
				fromLogin: {
					phoneNumber: "",
					password: "",
					type: 0
				},
				err: false,
				phoneNumberErr: false,
				passsswordErr: false
			};
		},
		onShow() {
			// #ifdef MP-WEIXIN 
			this.refreshCode()
			// #endif
		},
		onLoad(option) {
			//使用微信登录获取登录code
			this.getSystemInfoSyncInit();
			if (this.isApp) {
				console.log("app");
				// var that = this;
				// uni.login({
				// 	provider: 'weixin',
				// 	success: function(loginRes) {
				// 		that.wxLoginRes = loginRes.code;
				// 		console.log(loginRes, "app------>");
				// 	}
				// });
			} else {
				var that = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						that.wxLoginRes = loginRes.code;
						console.log(loginRes.code, "------CQL");
					}
				});
				// 返回上一页
				if (option.url) {
					that.pageroute = option.url
					console.log(option.url);
				} else {

					let page = that.$hao.prePage().$mp.page;
					that.pageroute = encodeURIComponent(`/${page.route}?${that.queryParams(page.options)}`);
					console.log(page);
				}
			}

		},
		onShareAppMessage(ops) {
			return {
				title: '打开易单据小程序，极速管理您的货单~',
				path: '/pages/index/index',
				imageUrl: '/static/share.png'
			}
		},
		methods: {
			getSystemInfoSyncInit() {
				const systemInfo = uni.getSystemInfoSync();
				if (systemInfo.platform === 'android' || systemInfo.platform === 'ios') {
					this.isApp = true;
					console.log("app");
				} else {
					this.isApp = false;
					console.log("小程序");
				}
			},
			experience() {
				console.log("立即体验");
				uni.switchTab({
					url: "/pages/index/index"
				})
			},
			jump(i) {
				uni.navigateTo({
					url: "/pages/subUser/webpage?url=" + this.xy[i]
				})
			},
			refreshCode() {
				var that = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						that.wxLoginRes = loginRes.code;
						console.log("loginRes.code======>", loginRes.code, "------CQL");
						console.log("loginRes======>", loginRes);
					}
				});
			},
			roleQH(i) {
				this.role = i;
			},
			radioChange(e) {
				console.log(e + "1");
			},
			radioGroupChange(e) {
				console.log("点击");
				if (this.disabled) {
					this.disabled = false
				} else {
					this.disabled = true
				}
			},
			getPhoneNumber(e) {
				if (this.disabled) {
					console.log('获取手机号：', e);
					var that = this;
					if (!e.detail.code) {
						that.$u.toast("请授权手机号进行登录~")
						return
					}

					console.log("that.wxLoginRes", that.wxLoginRes);
					if (that.wxLoginRes) {
						this.refreshCode()
						that.$u.post('/edo/rest/v1/login', {
							'loginCode': that.wxLoginRes,
							'phoneCode': e.detail.code
						}).
						then(res => {

							var resDate = res.data.data;

							console.log("resDate", resDate);
							that.message = resDate.loginState

							if (resDate.data == null || resDate.data.work == null) {
								that.$u.toast(that.message)
								return;
							}

							if (resDate.data.work == "" || resDate.data.work != '1') {
								this.$u.vuex('vuex_work', "N");
								console.log("N");
							} else {
								this.$u.vuex('vuex_work', "Y");
								console.log("Y");
							}

							this.$u.vuex('vuex_userRole', "D");
							this.$u.vuex('vuex_token', resDate.loginToken);
							this.$u.vuex('vuex_user', resDate);
							this.$u.vuex('guidanceD', resDate.data.guidanceD);
							this.$u.vuex('guidanceR', resDate.data.guidanceR);

							console.log('vuex_token', this.vuex_token);
							console.log('vuex_user', this.vuex_user);
							console.log('vuex_userRole', this.vuex_userRole);
							console.log("vuex_work", this.vuex_work);

							if (resDate.phone != "" && resDate.data.work != null) {
								this.$loadUser(this);
								uni.switchTab({
									url: '/pages/index/index'
								})
								this.roleShow = true;
							} else {

								that.$u.toast(that.message)
							}



						}).catch(res => {
							console.log(res);
							that.$u.toast("服务器异常,请联系官方客服")
							// that.$u.toast(that.message)
						})
					} else {
						this.$u.toast(that.wxLoginRes)
					}
				} else {
					this.$u.toast("请同意用户协议~")
				}


			},
			queryParams(data, isPrefix = false) {
				let prefix = isPrefix ? '?' : ''
				let _result = []
				for (let key in data) {
					let value = data[key]
					// 去掉为空的参数
					if (['', undefined, null].includes(value)) {
						continue
					}
					if (value.constructor === Array) {
						value.forEach(_value => {
							_result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value))
						})
					} else {
						_result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
					}
				}
				return _result.length ? prefix + _result.join('&') : ''
			},
			radioChange(e) {
				this.$u.vuex('vuex_userRole', e.detail.value);
			},
			submitRole() {
				if (this.role == 0) {
					this.$u.vuex('vuex_userRole', "D");
				} else {
					this.$u.vuex('vuex_userRole', "R");
				}
				this.roleShow = false;
				uni.reLaunch({
					url: '/pages/index/index'
				});
			},
			phoneNumberFocusInput() {
				console.log("对焦");
				this.phoneNumberErr = false;
			},
			passsswordFocusInput() {
				console.log("对焦");
				this.passsswordErr = false;
			},
			ZC() {
				uni.navigateTo({
					url: "/pages/subUser/register/register"
				})
			},
			wjPassword() {
				var fromLogin = this.fromLogin;
				uni.navigateTo({
					url: "/pages/subUser/login/verificationCodeLogin/verificationCodeLogin?fromLogin=" + JSON
						.stringify(fromLogin)
				})
			},
			oneKeyLogin() {
				console.log("设备")
				var that = this;

				// uni.preLogin({
				// 	provider: 'univerify',
				// 	success: function(res) {
				// 		console.log('预登录成功', res);
				// 	},
				// 	fail: function(err) {
				// 		console.error('预登录失败', err);
				// 	},
				// 	complete: function() {
				// 		console.log('预登录操作结束');
				// 	}
				// });
				var _this = this;
				uni.preLogin({
					provider: 'univerify',
					univerifyStyle: {
						"fullScreen": true, // 是否全屏显示，默认值： false
						"title": '快速登录',
						"backgroundColor": "#ffffff", // 授权页面背景颜色，默认值：#ffffff
						"icon": {
							"path": "/static/img/logo/logo-r.png", // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
							"width": "60px", //图标宽度 默认值：60px
							"height": "60px" //图标高度 默认值：60px
						},
					},
					success() { //预登录成功
						// 显示一键登录选项
						uni.login({
							provider: 'univerify',
							univerifyStyle: {
								// 自定义登录框样式
								//参考`univerifyStyle 数据结构`
								//具体样式设计请去uni-app文档查看
								//不填写任何自定义登录框样式的话就会采取默认样式
								"fullScreen": true, // 是否全屏显示，默认值： false
								"title": '快速登录',
								"backgroundColor": "#ffffff", // 授权页面背景颜色，默认值：#ffffff
								"icon": {
									"path": "/static/img/logo/logo-r.png", // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
									"width": "60px", //图标宽度 默认值：60px
									"height": "60px" //图标高度 默认值：60px
								},
							},
							success(res) { // 登录成功
								console.log(res.authResult.access_token);
								console.log(res.authResult.openid);
								// 此处获取了openid和access_token
								// {openid:'登录授权唯一标识',access_token:'接口返回的 token'}
								// 通过uniCloud.callFunction函数实现前端获取手机号
								uniCloud.callFunction({
										name: "cloudServe", // 填写你自己的云函数名称
										//传入上面获取的openid和access_token获取手机号
										data: {
											access_token: res.authResult
												.access_token, // 客户端一键登录接口返回的access_token
											openid: res.authResult.openid // 客户端一键登录接口返回的openid
										}
									})
									.then((dataRes) => {
										//此处已经成功获取手机号等信息
										console.log("云函数返回的参数", dataRes)
										let phone = dataRes.result.data.phoneNumber
										// 获取手机号后根据自己的需求做后面的登录操作即可
										that.LoginPhone(phone);

									})
									.catch((err) => {
										console.log(err);
										console.log("云函数报错", err)
										uni.showToast({
											title: err.errMsg,
											icon: "none"
										})
										this_ = this
										setTimeout(() => {
											uni.closeAuthView() //关闭一键登录弹出窗口
											this_.onClickMsgLogin()
										}, 500)
									})
							},
							fail(res) { // 登录失败
								console.log(res.errCode)
								console.log(res.errMsg)
							}
						})
					},
					fail(res) {
						// 预登录失败
						// 不显示一键登录选项（或置灰）
						// 根据错误信息判断失败原因，如有需要可将错误提交给统计服务器
						console.log(res);
						console.log(res.errCode)
						console.log(res.errMsg)
						var code = res.errCode
						switch (code) {
							case 30005:
								_this.$u.toast("请检查数据网络是否开启~");
								break;
							default:
								_this.$u.toast("获取失败~");
						}

					}
				})
			},
			LoginPhone(phone) {
				console.log("手机号码：", phone);
				this.fromLogin.phoneNumber = phone
				this.$u.post('/edo/rest/app/v1/loginAppPhone', this.fromLogin).then(res => {
					console.log(res);
					var mess = res.data;
					this.$u.toast(mess.message);
					setTimeout(() => {
						uni.closeAuthView() //关闭一键登录弹出窗口
					}, 500)
					if (mess.data.type == 1) {
						this.$u.vuex('vuex_user', mess.data);
						this.$u.vuex('vuex_token', mess.data.loginToken);
						this.$loadUser(this);
						uni.switchTab({
							url: "/pages/index/index"
						})
					}

				})
			},
			LoginImport() {

				if (!this.disabled) {
					this.$u.toast("请勾选用户协议～");
					return;
				}

				if (this.fromLogin.phoneNumber == "" && this.fromLogin.phoneNumber.length < 11) {
					this.$u.toast("请输入手机号码～");
					this.phoneNumberErr = true;
					return;
				}

				if (this.fromLogin.passssword == "") {
					this.$u.toast("请输入密码～");
					this.passsswordErr = true;
					return;
				}



				this.$u.post('/edo/rest/app/v1/loginApp', this.fromLogin).then(res => {
					var code = res.data.data;
					console.log(code);
					if (code.type == 1) {
						this.$u.vuex('vuex_user', code);
						this.$u.vuex('vuex_token', code.loginToken);
						this.$loadUser(this);
						uni.switchTab({
							url: "/pages/index/index"
						})
					} else {
						this.$u.toast("密码错误~")
					}
				});
			},
			wxloginInit() {
				var _this = this;
				console.log("点击");
				uni.login({
					provider: 'weixin',
					onlyAuthorize: true,
					success: function(loginRes) {
						console.log("app------>", loginRes);
						// loginWXVerifyId
						var dx = {
							code: loginRes.code
						}
						this.$u.post('edo/rest/app/v1/loginWXVerifyId', dx).then(
							res => {
								console.log("后台获取=====>", res);
								var data = res.data.data;
								if (data.id) {
									//登录成功

								} else {
									var unionId = data.unionId
									var openIdApp = data.openIdApp
									this.getUserInfo(unionId, openIdApp);
								}
							});
						// this.getUserInfo(loginRes.authResult.access_token, loginRes.authResult.openid);
					}.bind(this),
					fail: function(err) {
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
						phone: "",
						code: ""
					}

					uni.navigateTo({
						url: "/pages/subUser/bindingPhone/bindingPhone?data=" +
							JSON.stringify(dx)
					})

				} else {
					// 存在变量值为 null、空字符串或者 undefined 的处理逻辑
					this.$u.toast("微信拉取失败~")
					console.log("存在变量值为 null、空字符串或者 undefined");
				}
			},
			loginWX(code) {
				var dx = {
					code: code
				}
				this.$u.post('/edo/rest/app/v1/loginWX', dx).then(res => {
					var code = res.data.data;
					console.log(res);
					uni.navigateTo({
						url: "/pages/subUser/bindingPhone/bindingPhone?openid=123"
					})
				});
			},
			isValid(value) {
				return value !== null && value !== "" && value !== undefined;
			}
		},

	};
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

		.ts {
			color: #F53F3F;
		}
	}

	.InputTab {
		margin-bottom: 20px;
	}

	.buttonTab {
		margin-top: 10px;
	}

	.err {
		color: #F53F3F;
		font-size: 12px;
	}
</style>