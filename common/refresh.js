// plugins/userLoader.js  
export default {
	install(Vue, options) {
		Vue.prototype.$loadUser = function(thia) {
			console.log("--------->全局刷新个人信息<-------------");
			try {
				let role = thia.vuex_user.data.work == "1" ? 1 : 2;
				var that = thia;
				thia.$u.post('edo/user/renewal?phone=' + thia.vuex_user.phone + '&role=' + role).then(res => {
					let localData = that.vuex_user
					var getNowData = res.data.data;
					localData.ac = getNowData.ac
					localData.data = getNowData.data
					localData.workData = getNowData.workData;
					localData.vuex_password = getNowData.password
					that.vuex_user.jurisdiction = getNowData.jurisdiction
					that.$u.vuex('guidanceD', getNowData.data.guidanceD);
					that.$u.vuex('guidanceR', getNowData.data.guidanceR);
					that.$u.vuex('announcement', getNowData.announcement);
					// console.log(getNowData.announcement);
					// console.log(that.announcement);
					that.$u.vuex('vuex_user', localData);
					if (getNowData.data.work == "1") {
						that.$u.vuex('vuex_work', 'Y');
					} else {
						that.$u.vuex('vuex_work', 'N');
					}
				})

				var freezeState = thia.vuex_user.data.state == "0";
				if (freezeState) {
					uni.reLaunch({
						url: "/pages/subPack/user/affirm/applyAffirm"
					})
				}


				if (thia.vuex_user.phone == undefined) {
					uni.navigateTo({
						url: '/pages/subUser/login'
					})
				}

				console.log("--------->全局刷新个人信息更新成功<-------------");
			} catch (e) {
				thia.vuex_user.phone = undefined;
				console.log("--------->全局刷新个人信息更新异常<-------------");
				thia.$u.vuex('vuex_user', {
					workData: {
						bossNumber: null,
						endTime: null,
						id: null,
						identity: null,
						img: null,
						jc: null,
						jobNumber: null,
						jurisdictionCode: null,
						name: null,
						staffNumber: null,
						state: null,
					},
					data: {
						work: null
					},
					ac: {
						enterpriseName: null
					},
					phone: null
				});

			}
		};


		Vue.prototype.$inform = function(thia, list) {
			console.log("------------------通知----------------");
			thia.$u.post('/edo/rw/start?list=' + list).
			then(res => {
				console.log("通知结果：", res);
			}).catch(res => {
				console.log("通知失败：", res);
			})
		}



		Vue.prototype.$record = function(thia) {
			const pages = getCurrentPages();
			// 获取当前页面实例，即页面栈的最后一个元素
			const currentPage = pages[pages.length - 1];
			// 获取当前页面的路径
			const currentPagePath = currentPage.route;

			var dx = {
				phone: thia.vuex_user.phone,
				pages: currentPagePath,
				type: 0,
				createTime: new Date(),
				state: 1
			}

			console.log(dx);
			thia.$u.post('/edo/behavior/add', dx).
			then(res => {
				console.log("记录结果：", res);
			}).catch(res => {
				console.log("记录失败：", res);
			})
		}


		Vue.prototype.$getRecord = function(thia) {
			var dx = {
				phone: thia.vuex_user.phone,
			}
			console.log(dx);
			thia.$u.post('/edo/behavior/get', dx).
			then(res => {
				console.log("记录结果：", res);
				if (res.data.data) {
					thia.$refs.popLetter.show = true
					thia.$refs.popLetter.letter()
					thia.$record(thia)
				}
			}).catch(res => {
				console.log("记录失败：", res);
			})
		}





		const videoList = [
			"export/UzFfAgtgekIEAQAAAAAAxJYlyJg3FgAAAAstQy6ubaLX4KHWvLEZgBPE_KFcQGI6MYyJzNPgMJotuHr8u0KB2xfY4RN8QuoS", /**发货端订单统计**/
			"export/UzFfAgtgekIEAQAAAAAAP-EjEVINjQAAAAstQy6ubaLX4KHWvLEZgBPExaF0MGY1MIyJzNPgMJp9aViioFslDPj5E1FlonlH", /**收货端如何对账**/
			"export/UzFfAgtgekIEAQAAAAAAvGY07g_ulQAAAAstQy6ubaLX4KHWvLEZgBPEx6EAbgBXMoyJzNPgMJrhNSRp3beWs3QsBOqn-goU", /**开单**/
			"export/UzFfAgtgekIEAQAAAAAA5MwzpLcNFgAAAAstQy6ubaLX4KHWvLEZgBPEjqI0EiobM4yJzNPgMJpb1yCwlhD4QRwrvoYqs0B-", /**发货端查单**/
			"export/UzFfAgtgekIEAQAAAAAAX2oFdu691QAAAAstQy6ubaLX4KHWvLEZgBPEg6IQWgpvNoyJzNPgMJrKnYd0jvBZgEVah9xutq1n", /**收货端查单**/
			"export/UzFfAgtgekIEAQAAAAAA6yIo7s1fGwAAAAstQy6ubaLX4KHWvLEZgBPEmKI0Y3kwb_WIzNPgMJo3gU7o4yvLyUBCv6_PHqnv", /**发货端添加好友**/
			"export/UzFfAgtgekIEAQAAAAAAiqAQev895gAAAAstQy6ubaLX4KHWvLEZgBPE9aEYTicfb_WIzNPgMJoCTVYyAZhh_KYBsLEYwend" /**收货端添加好友**/
			// "export/UzFfAgtgekIEAQAAAAAAM50D-egxYAAAAAstQy6ubaLX4KHWvLEZgBPE26F8ZyV2MIyJzNPgMJrXd6cQcLDboKUxo0Rsgicj", /**发货端添加好友**/
			// "export/UzFfAgtgekIEAQAAAAAAoZsGIyJRPgAAAAstQy6ubaLX4KHWvLEZgBPEyaFURgl0MYyJzNPgMJq_A5F-Nc1R82d-ll1XsXQ_" /**收货端添加好友**/
		]

		Vue.prototype.$openVideo = function(that, index) {
			uni.openChannelsActivity({
				finderUserName: "sphgIVBwvsJcDEZ", // 视频号ID（以sph开头）
				feedId: videoList[index], // 视频唯一标识
				success(res) {
					console.log("跳转成功", res)
				},
				fail(err) {
					console.log("跳转失败", err)
				}
			})
		}



		// 创建一个 Map 来存储手机型号和对应的值
		const modelMap = new Map([
			["iPhone 15 Pro Max", "55px"],
			["iPhone 15 Pro", "50px"],
			["iPhone 14 Pro Max", "55px"],
			["iPhone 14 Pro", "50px"],
			["iPhone 14 Plus", "50px"],
			["iPhone 14", "50px"],
			["iPhone 13 Pro Max", "55px"],
			["iPhone 13 Pro", "50px"],
			["iPhone 13", "50px"],
			["iPhone 13 Mini", "50px"],
			["iPhone 12 Pro Max", "50px"],
			["iPhone 12 Pro", "50px"],
			["iPhone 12", "50px"],
			["iPhone 12 Mini", "50px"],
			
			["iPhone 15 pro Max", "55px"],
			["iPhone 15 pro max", "55px"],
			["iPhone 15 pro", "50px"],
			["iPhone 14 pro Max", "55px"],
			["iPhone 14 pro max", "55px"],
			["iPhone 14 pro", "50px"],
			["iPhone 14 plus", "50px"],
			["iPhone 14", "50px"],
			["iPhone 13 pro Max", "55px"],
			["iPhone 13 pro max", "55px"],
			["iPhone 13 pro", "50px"],
			["iPhone 13", "50px"],
			["iPhone 13 mini", "50px"],
			["iPhone 12 pro Max", "50px"],
			["iPhone 12 pro max", "50px"],
			["iPhone 12 pro", "50px"],
			["iPhone 12", "50px"],
			["iPhone 12 mini", "50px"]
			// 可以继续添加其他型号
		]);



		// 将获取型号对应值的方法挂载到 Vue 原型上
		Vue.prototype.$getModel = function(callback) {
			uni.getSystemInfo({
				success: function(res) {
					console.log("===设备信息====>", res);
					console.log("===设备信息====>", res.model);
					const model = res.model;
					var val = modelMap.has(model)
					console.log("===设备TAB尺寸====>", val);
					if (val) {
						var value = modelMap.get(model)
						callback(value);
						return;
					} else {
						const hasLessThan = model.includes("<");
						if (hasLessThan) {
							const result = model.split("<")[0];
							var valt = modelMap.has(result)
							if (valt) {
								//包含
								var value = modelMap.get(model)
								console.log("===设备TAB切割尺寸====>", value);
								callback(value);
							} else {
								callback("50px");
							}
							callback(value);
						}
						callback("50px");
						return;
					}
					if (typeof callback === 'function') {
						callback("50px");
					}
				},
				fail: function(err) {
					console.error("===获取设备信息失败====>", err);
					if (typeof callback === 'function') {
						callback("50px");
					}
				}
			});
		};


	}
};