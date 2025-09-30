// common/plugins/univerify.js
export default {
	install(app) {
		// #ifdef APP
		app.config.globalProperties.$univerify = function(data) {
			console.log('手机号一键登录')
			uni.preLogin({
				provider: 'univerify',
				success() { //预登录成功
					console.log('预登录成功')
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
								"list": [{
										"provider": "apple",
										"iconPath": "/static/app/img/login/apple.png" // 图标路径仅支持本地图片
									},
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
										"url": "https://", // 点击跳转的协议详情页面
										"title": "用户服务协议" // 协议名称
									}
								]
							},

						},
						success(res) {
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
							console.log('点击的按钮', res)
							if (res.code == "30002") {
								uni.navigateTo({
									url: '/pages/subUser/login'
								});
							}
							if (res.code == "30008") {

							}
						}
					})
				},
				fail(res) { // 预登录失败
					// 不显示一键登录选项（或置灰）
					// 根据错误信息判断失败原因，如有需要可将错误提交给统计服务器
					console.log('预登录失败')
					console.log(res)
				}
			})
		};
		// #endif
	}
};