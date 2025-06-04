<script>
	export default {
		data() {
			return {
				dbsx: 0,
				message: 0,
				size: {
					mess: 0,
					dbsx: 0,
					hy: 0,
					yg: 0,
					xftz: 0
				},
				systemSocket: null,
				systemSocketOpen: false,
				heart: 0
			}
		},
		globalData: {
			appname: '易单据'
		},
		onLaunch() {

			this.UpdateManager();

			// 上线后全局关闭console.log打印
			// if (uni.getSystemInfoSync().platform !== "devtools") {
			// 	console.log = () => {};
			// 	console.info= () => {};
			// }


			if (uni.getStorageSync("1003") == "0") {
				uni.removeStorage({
					key: "1003"
				})

				console.log("删除标记");
			}
			uni.removeStorage({
				key: "details"
			})
			uni.setStorageSync("auth", "0")

		},
		onLoad() {
			
		},
		onShow(options) {
			console.log("场景值------------->", options.scene);
			// this.$pushMessage("312312");
			 this.$getCid()
			 this.$monitorPushMessage()
			 
			if (options.scene != 1007) {

				if (this.vuex_user.phone != undefined) {
					this.opensyStemSocket()
					this.getTaberMessage();
					this.getPage()
				} else {
					console.log("未登录");
				}

				var launchOptions = wx.getLaunchOptionsSync();


				if (launchOptions.query && launchOptions.query.open === '1') {
					console.log('小程序是通过带有open=1的启动参数进入的');
				} else {
					console.log('小程序不是通过带有open=1的启动参数进入的');
				}
			}

		},
		onHide() {
			if (uni.getStorageSync("1003") == "0") {
				console.log("删除标记1003------------->", uni.getStorageSync("1003"));
				uni.removeStorage({
					key: "1003"
				})
			}

			this.$u.vuex('guidance', 0);
			// uni.removeStorage({
			// 	key: "details"
			// })
			// clearInterval(this.heart)
		},
		onUnload() {
			uni.setStorageSync("auth", "0")
		},
		methods: {
			opensyStemSocket() {

				if (this.systemSocketOpen) {
					console.log("------------->socket处于开启状态");
					return;
				}

				this.$on('globalDataChange', (key, value) => {
					if (key === 'flush') {
						this.globalData.flush = value;
					}
				});

				this.systemSocket = uni.connectSocket({
					url: "wss://wxapi.elist.com.cn/edo/login/" + this.vuex_user.phone,
					success: () => {
						console.log("------------->系统 连接已打开");
						this.systemSocketOpen = true;
					},
					fail: (err) => {
						console.log("------------->'系统 连接失败", err);
						this.systemSocketOpen = false;
					}
				});


				var that = this;
				setInterval(function() {

					var dx = {
						"type": "0",
						"fromUserId": that.vuex_user.phone,
						"toUserId": that.vuex_user.phone,
						"time": new Date()
					};
					that.systemSocket.send({
						data: JSON.stringify(dx)
					})
				}, 15000)


				this.receptionSocket();

			},
			getPage() {
				if (uni.getStorageSync("details") == "1") {
					uni.removeStorage({
						key: "details"
					})
					uni.switchTab({
						url: '/pages/index/index'
					})
				}
			},
			receptionSocket() {
				this.systemSocket.onMessage((res) => {
					console.log("------------->系统SOCKE通信", res);
					var json = JSON.parse(JSON.stringify(res)).data
					if (JSON.parse(json).type != "") {
						if (this.vuex_user.phone != undefined) {
							this.getTaberMessage();
						} else {
							console.log("------------->退出断开SOCKET");
						}
					}
					this.someMethod(JSON.parse(json).type)
				})
			},
			getTaberMessage() {
				console.log("------------->系统实时更新消息 待办事项", this.dbsx);
				this.$on('globalDataChange', (key, value) => {
					if (key === 'flush') {
						this.globalData.flush = value;
					}
				});
				this.getIndexSJDB();
				this.getAllNum();

			},
			getIndexSJDB() {
				//获取事件代办
				var that = this;
				this.$u.post('edo/orderDel/get', {
					"bUser": this.vuex_user.phone
				}).then(res => {
					var filer = this.vuex_userRole == "D" ? "1" : "0"
					if (filer == "1") {
						var len = res.data.data.filter(res => res.port == "1" || res.port == "f")
						that.dbsx = len.length;
						that.vuex_tabbar[0].counts = len.length
						console.log("------------->待办事项数据 待办事项", len);
					} else {
						var len = res.data.data.filter(res => res.port == "0")
						that.dbsx = len.length;
						that.vuex_tabbar[0].counts = len.length
						console.log("------------->待办事项数据 待办事项", len);
					}

				})
			},
			getAllNum() {
				var dx = {
					"boss": this.vuex_user.data.work == "1" ? this.vuex_user.workData.bossNumber : this.vuex_user
						.phone,
					"staff": this.vuex_user.phone,
					"work": this.vuex_user.data.work
				}
				this.$u.post('/edo/inform/all', dx).
				then(res => {
					console.log("------------->通知 加标 是否通知", res.data.data);
					console.log("------------->通知 加标 是否通知", this.vuex_tabbar[2].count != res.data.data);
					if (this.vuex_tabbar[2].count != res.data.data) {
						this.vuex_tabbar[2].count = 0
						this.vuex_tabbar[2].count = res.data.data
					}
				}).catch(res => {
					this.$u.toast(this.message)
				})
			},
			someMethod(type) {
				this.$store.commit('updateFlush', type); // 提交 mutation 来更新状态  
			},
			UpdateManager() {
				const updateManager = uni.getUpdateManager()
				updateManager.onCheckForUpdate(res => {
					if (res.hasUpdate) {
						uni.showModal({
							content: '小程序新版本已经准备好，点击确定重启应用后使用~',
							showCancel: false,
							confirmText: '确定',
							confirmColor: '#0FB076',
							success: res => {
								if (res.confirm) {
									updateManager.onUpdateReady(res => {
										updateManager.applyUpdate()
									})
									updateManager.onUpdateFailed(res => {
										uni.showModal({
											content: '下载失败，请删除当前小程序后重新搜索打开~',
											showCancel: false,
											confirmText: '我知道了',
											confirmColor: '#0FB076'
										})
									})
								}
							}
						})
					}
				})
			},
		},
		globalData: {
			websocket: null,
			flush: 0 // 需要更新的数据
		}
	}
</script>


<style lang="scss">
	@import "uni_modules/vk-uview-ui/index.scss";
	@import 'static/common/css/base.scss';

	@font-face {
		font-family: "ddbh";
		src: url('https://cdn.elist.com.cn/uniapp/font/DDBH.ttf') format('truetype');
	}

	@font-face {
		font-family: "ysdzt";
		src: url('https://cdn.elist.com.cn/uniapp/font/YSDZT.ttf') format('truetype');
	}

	@font-face {
		font-family: "syst";
		src: url('https://cdn.elist.com.cn/uniapp/font/syst.ttf') format('truetype');
	}

	// .u-line-1{
	// 	font-size: 12px;
	// }
</style>