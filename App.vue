<script>
import SocketManager from '@/utils/socketManager.js';

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
			}
		};
	},
	onLaunch(options) {
		console.log('options', options);

		if (options.query?.share_id && !this.vuex_token) {
			uni.navigateTo({
				url: `/pages/subUser/login?share_id=${options.query.share_id}&phone=${options.query.type}&versions=${options.query.versions}`
			});
		}

		this.initUpdateManager();

		if (uni.getStorageSync("1003") === "0") {
			uni.removeStorage({ key: "1003" });
		}

		uni.removeStorage({ key: "details" });
		uni.setStorageSync("auth", "0");
	},
	onShow(options) {
		console.log("Scene:", options);
		this.$getCid?.();
		this.$monitorPushMessage?.();

		if (options.scene !== 1007 && this.vuex_user?.phone) {
			// 👉 使用封装模块连接 WebSocket
			SocketManager.connect(this.vuex_user.phone, (data) => {
				if (data.type) {
					this.updateMessageCounts();
					this.$store.commit('updateFlush', data.type);
				}
			});

			this.updateMessageCounts();
			this.redirectToIndexIfNeeded();
		}
	},
	onHide() {
		SocketManager.close(); // 👉 页面隐藏时清理 WebSocket
		this.$u.vuex('guidance', 0);
	},
	onUnload() {
		uni.setStorageSync("auth", "0");
		SocketManager.close(); // 👉 页面卸载时清理 WebSocket
	},
	methods: {
		updateMessageCounts() {
			this.getPendingTasks();
			this.getNotifications();
		},
		getPendingTasks() {
			this.$u.post('edo/orderDel/get', { bUser: this.vuex_user.phone }).then(res => {
				const isDirector = this.vuex_userRole === "D";
				const tasks = res.data.data.filter(item =>
				isDirector ? item.port === "1" || item.port === "f" : item.port === "0"
				);
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
				const count = res.data.data;
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