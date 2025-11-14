import {
	isEmpty
} from "../../components/y-chat/common";

// common/plugins/univerify.js
export default {
	install(app) {
		// #ifdef APP
		app.config.globalProperties.$univerify = (data) => {
			uni.showLoading({
				title: '加载中...', // 提示文字
				mask: true // 是否显示透明蒙层，防止触摸穿透
			});
			uni.login({
				provider: 'univerify',
				univerifyStyle: { // 自定义登录框样式
					//参考`univerifyStyle 数据结构`
					"fullScreen": true, // 是否全屏显示，默认值： false
					"title": '快速登录',
					"backgroundColor": "#ffffff", // 授权页面背景颜色，默认值：#ffffff
					"icon": {
						"path": "/static/app/img/logo/logo-r.png", // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
						"width": "60px", //图标宽度 默认值：60px
						"height": "60px" //图标高度 默认值：60px
					},
					"phoneNum": {
						"color": "#000000", // 手机号文字颜色 默认值：#000000
						"fontSize": "18" // 手机号字体大小 默认值：18
					},
					"slogan": {
						"color": "#8a8b90", //  slogan 字体颜色 默认值：#8a8b90
						"fontSize": "12" // slogan 字体大小 默认值：12
					},
					// 一键登录按钮样式
					"authButton": {
						"normalColor": "#01BB74", // 授权按钮正常状态背景颜色 默认值：#3479f5
						"highlightColor": "#009a5f", // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）
						"disabledColor": "#8af0a4", // 授权按钮不可点击时背景颜色 默认值：#73aaf5（仅ios支持）
						"textColor": "#ffffff", // 授权按钮文字颜色 默认值：#ffffff
						"title": "本机号码一键登录" // 授权按钮文案 默认值：“本机号码一键登录”
					},
					// 自定义页面下方按钮仅全屏模式生效（3.1.14+ 版本支持）
					"buttons": {
						"iconWidth": "45px", // 图标宽度（高度等比例缩放） 默认值：45px
						"list": [
							// #ifdef APP-IOS
							{
								"provider": "apple",
								"iconPath": "/static/app/img/login/apple.png" // 图标路径仅支持本地图片
							},
							// #endif
							{
								"provider": "weixin",
								"iconPath": "/static/app/img/login/wechat.png" // 图标路径仅支持本地图片
							}
						]
					},
					// 其他登录方式
					"otherLoginButton": {
						"visible": "true", // 是否显示其他登录按钮，默认值：true
						"normalColor": "#f8f8f8", // 其他登录按钮正常状态背景颜色 默认值：#f8f8f8
						"highlightColor": "#dedede", // 其他登录按钮按下状态背景颜色 默认值：#dedede
						"textColor": "#000000", // 其他登录按钮文字颜色 默认值：#000000
						"title": "其他手机号登录", // 其他登录方式按钮文字 默认值：“其他登录方式”
						"borderWidth": "1px", // 边框宽度 默认值：1px（仅ios支持）
						"borderColor": "#c5c5c5" //边框颜色 默认值： #c5c5c5（仅ios支持）
					},
					"privacyTerms": {
						"defaultCheckBoxState": "false", // 条款勾选框初始状态 默认值： true
						"isCenterHint": true, //未勾选服务条款时点击登录按钮的提示是否居中显示 默认值: false (3.7.13+ 版本支持)
						"uncheckedImage": "/static/app/img/login/uncheckedImage.png", // 可选 条款勾选框未选中状态图片（仅支持本地图片 建议尺寸 24x24px）(3.2.0+ 版本支持)
						"checkedImage": "/static/app/img/login/checkedImage.png", // 可选 条款勾选框选中状态图片（仅支持本地图片 建议尺寸24x24px）(3.2.0+ 版本支持)
						"checkBoxSize": 12, // 可选 条款勾选框大小
						"textColor": "#8a8b90", // 文字颜色 默认值：#8a8b90
						"termsColor": "#01BB74", //  协议文字颜色 默认值： #1d4788
						"prefix": "我已阅读并同意", // 条款前的文案 默认值：“我已阅读并同意”
						"suffix": "并使用本机号码登录", // 条款后的文案 默认值：“并使用本机号码登录”
						"fontSize": "12", // 字体大小 默认值：12,
						"privacyItems": [
							// 自定义协议条款，最大支持2个，需要同时设置url和title. 否则不生效 
							{
								"url": "https://upbill.cn/h5/notice/ServiceAgreement-v1.htm", // 点击跳转的协议详情页面
								"title": "用户服务协议" // 协议名称
							}
						]
					},

				},
				success(res) {
					uni.hideLoading();
					let openid = res.authResult.openid; //拿到openid
					let access_token = res.authResult.access_token; //拿到access_token
					console.log('openid', openid)
					console.log('access_token', access_token)
					const appid = plus.runtime.appid;

					//APP手机号一键登录
					uni.$api.user.loginAppYJ({
						'openId': openid,
						'accessToken': access_token,
						'appid': appid
					}).then(res => {
						console.log('登录成功', res.statusCode)
						if (res.statusCode == 200) {
							var resDate = res.data.data;
							const work = resDate.data.work == '1' ? 'Y' : 'N'
							console.log('q1')
							uni.$u.setPinia({
								user: {
									userRole: 'D',
									token: resDate.loginToken,
									user: resDate,
									work: work
								}
							});
							uni.closeAuthView()
							uni.switchTab({
								url: '/pages/index/index'
							});
							that.roleShow = true;
						}
					})
				},
				// 当用户点击自定义按钮时，会触发uni.login的fail回调[点击其他登录方式，可以跳转页面，或执行事件]
				fail(res) {
					uni.hideLoading();
					const pages = getCurrentPages();
					const currentPage = pages[pages.length - 1];
					const route = currentPage.route; // 获取本页路径

					console.log('一键登录失败', res)

					if (route == 'pages/subUser/login') {
						if (res.metadata?.msg != undefined) {
							uni.$u.toast(res.metadata.msg);
						}
						return;
					}

					if (res.code == "30002") {
						uni.navigateTo({
							url: '/pages/subUser/login'
						});
					} else if (res.code == "30003") {
						console.log('主动关闭')
					} else if (res.code == "30005") {
						uni.navigateTo({
							url: '/pages/subUser/login'
						});
					} else if (res.code == "30006") {
						console.log('主动关闭')
					} else if (res.code == "30008") {
						uni.getProvider({
							service: 'oauth',
							success: function(res) {
								console.log('登录服务商', res)
								uni.login({
									provider: 'weixin',
									onlyAuthorize: true,
									success: function(event) {
										console.log('666666666666666666', event)
										const {
											code
										} = event
										// uni.getUserInfo({
										// 	provider: 'weixin',
										// 	success(res) {
										// 		console.log('微信用户信息', res)
										//app微信登录
										uni.$api.user
											.loginAppWX({
												loginCode: code
											})
											.then((res) => {
												console.log(
													'ressssssssssss',
													res)
												var resDate =
													res.data
													.data;

												if (resDate.data
													.state ==
													"NEED_BIND"
												) {
													console.log(
														2222222222222
													)
													uni.navigateTo({
														url: "/pages/subUser/bindingPhone/bindingPhone?bindTicket=" +
															resDate
															.data
															.bindTicket
													})
												} else {
													uni.$u
														.setPinia({
															user: {
																userRole: 'D',
																token: resDate
																	.data
																	.loginToken,
																user: resDate
																	.data,
																work: resDate
																	.data
																	.work !=
																	'1' ?
																	'N' :
																	'Y'
															}
														});
													console.log(
														'亘古不变',
														that
														.$u
														.getPinia(
															'user.user'
														)
													);

													if (resDate
														.data
														.phone !=
														'' &&
														resDate
														.data
														.work !=
														null) {
														that.$loadUser(
															that
														);
														console
															.log(
																'授权完',
																that
																.sharePath
															);
														// 接收分享参数
														if (that
															.sharePath
														) {
															uni
																.navigateBack();
														} else {
															uni.switchTab({
																url: '/pages/index/index'
															});
															that.roleShow =
																true;
														}
													} else {
														that.$u
															.toast(
																that
																.message
															);
													}
												}
											})
											.catch((res) => {
												that.$u.toast(
													'服务器异常,请联系官方客服'
												);
											});
										// 	},
										// 	fail(err) {
										// 		console.log('失败', err)
										// 	}
										// })

									},
									fail: function(err) {
										console.log('登录授权失败', err)
									}
								})
							}
						});
					}
				}
			});
		}
		// #endif
	}
}