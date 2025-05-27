<template>
	<view class="vh100 vw100 flex-col items-center justify-center"
		style="background-size: cover;background-image: url('https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/user/login.png');">

		<view class="absolute" style="left: 48rpx;top: 120rpx;color: #333333;" @click="experience">
			暂不登录
		</view>

		<view class="form-wrap width60 flex-col items-center">
			<u-image class="login-logo" width="400rpx" src="https://res-oss.elist.com.cn/wxImg/user/logoLogin.svg"
				mode="widthFix"></u-image>
			<view class="width100 pt100 pb60">
				<!-- #ifdef MP-WEIXIN -->
				<u-button type="primary" hover-class="none" :custom-style="{backgroundColor:'#01BB74'}"
					class="form-btn-big" shape="circle" size="default" open-type="getPhoneNumber"
					@getphonenumber="getPhoneNumber" @click="">
					<u-icon name="" size="50" label="手机号快捷登录" label-color="#fff" label-size="32"></u-icon>
				</u-button>
				<!-- #endif -->
				<!-- #ifdef APP -->
				<u-button class="form-btn-big" type="primary" shape="circle" size="default">
					<u-icon name="weixin-fill" size="50" label="app" label-color="#fff" label-size="32"></u-icon>
				</u-button>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<u-button class="form-btn-big" type="primary" shape="circle" size="default">
					<u-icon name="weixin-fill" size="50" label="仅支持小程序" label-color="#fff" label-size="32"></u-icon>
				</u-button>
				<!-- #endif -->
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
				]
			};
		},
		onShow() {
			const systemInfo = uni.getSystemInfoSync();
			if (systemInfo.platform === 'android' || systemInfo.platform === 'ios') {
				this.isApp = true;
				console.log("app");
			} else {
				this.isApp = false;
				console.log("小程序");
			}
		},
		onLoad(option) {
			//使用微信登录获取登录code
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
		},
		onShareAppMessage(ops) {
			return {
				title: '打开易单据小程序，极速管理您的货单~',
				path: '/pages/index/index',
				imageUrl: '/static/share.png'
			}
		},
		methods: {
			experience() {
				console.log("立即体验");
				uni.switchTab({
					url:"/pages/index/index"
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
						console.log(loginRes.code, "------CQL");
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
					if (that.wxLoginRes) {
						this.refreshCode()
						that.$u.post('/edo/rest/v1/login', {
							'loginCode': that.wxLoginRes,
							'phoneCode': e.detail.code
						}).
						then(res => {
							
							var resDate = res.data.data;

							console.log(resDate);
							that.message = resDate.loginState
							
							if (resDate.data.work==null) {
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
			}
		},

	};
</script>

<style>

</style>