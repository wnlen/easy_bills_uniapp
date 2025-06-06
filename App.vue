<script>
export default {
	data() {
		return {
			todoCount: 0,
			messageCount: 0,
			size: {
				message: 0,
				todo: 0,
				contact: 0,
				emp: 0,
				notice: 0
			},
			systemSocket: null,
			systemSocketOpen: false,
			heartbeatTimer: null
		};
	},
	onLaunch() {
		
		this.initUpdateManager();
		if (uni.getStorageSync("1003") === "0") {
			uni.removeStorage({ key: "1003" });
			console.log("Removed marker 1003");
		}
		uni.removeStorage({ key: "details" });
		uni.setStorageSync("auth", "0");
	},
	onShow(options) {
		console.log("Scene:", options);
		this.$getCid();
		this.$monitorPushMessage();

		if (options.scene !== 1007 && this.vuex_user?.phone) {
			this.initSystemSocket();
			this.updateMessageCounts();
			this.redirectToIndexIfNeeded();
		}
	},
	onHide() {
		if (uni.getStorageSync("1003") === "0") {
			console.log("Cleaning up 1003");
			uni.removeStorage({ key: "1003" });
		}
		clearInterval(this.heartbeatTimer);
		this.$u.vuex('guidance', 0);
	},
	onUnload() {
		uni.setStorageSync("auth", "0");
	},
	methods: {
		initSystemSocket() {
			if (this.systemSocketOpen) {
				console.log("Socket already open");
				return;
			}

			this.systemSocket = uni.connectSocket({
				url: `wss://wxapi.elist.com.cn/edo/login/${this.vuex_user.phone}`,
				success: () => {
					console.log("Socket connection opened");
					this.systemSocketOpen = true;
				},
				fail: (err) => {
					console.log("Socket connection failed", err);
					this.systemSocketOpen = false;
				}
			});

			this.heartbeatTimer = setInterval(() => {
				this.systemSocket.send({
					data: JSON.stringify({
						type: "0",
						fromUserId: this.vuex_user.phone,
						toUserId: this.vuex_user.phone,
						time: new Date()
					})
				});
			}, 15000);

			this.handleSocketMessages();
		},
		handleSocketMessages() {
			this.systemSocket.onMessage((res) => {
				let data = JSON.parse(res.data);
				if (data.type && this.vuex_user?.phone) {
					this.updateMessageCounts();
					this.$store.commit('updateFlush', data.type);
				}
			});
		},
		updateMessageCounts() {
			this.getPendingTasks();
			this.getNotifications();
		},
		getPendingTasks() {
			this.$u.post('edo/orderDel/get', { bUser: this.vuex_user.phone })
				.then(res => {
					let isDirector = this.vuex_userRole === "D";
					let tasks = res.data.data.filter(item => isDirector ? item.port === "1" || item.port === "f" : item.port === "0");
					this.todoCount = tasks.length;
					this.vuex_tabbar[0].counts = tasks.length;
					console.log("Pending tasks:", tasks);
				});
		},
		getNotifications() {
			const user = this.vuex_user;
			const dx = {
				boss: user.data.work === "1" ? user.workData.bossNumber : user.phone,
				staff: user.phone,
				work: user.data.work
			};
			this.$u.post('/edo/inform/all', dx).then(res => {
				let count = res.data.data;
				if (this.vuex_tabbar[2].count !== count) {
					this.vuex_tabbar[2].count = count;
				}
			}).catch(() => {
				this.$u.toast(this.messageCount);
			});
		},
		redirectToIndexIfNeeded() {
			if (uni.getStorageSync("details") === "1") {
				uni.removeStorage({ key: "details" });
				uni.switchTab({ url: '/pages/index/index' });
			}
		},
		initUpdateManager() {
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(res => {
				if (res.hasUpdate) {
					uni.showModal({
						content: '新版本已准备好，点击确定更新',
						showCancel: false,
						confirmText: '确定',
						success: res => {
							if (res.confirm) {
								updateManager.onUpdateReady(() => updateManager.applyUpdate());
								updateManager.onUpdateFailed(() => {
									uni.showModal({
										content: '下载失败，请删除当前小程序后重装',
										showCancel: false,
										confirmText: '我知道了'
									});
								});
							}
						}
					});
				}
			});
		}
	}
};
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
</style>