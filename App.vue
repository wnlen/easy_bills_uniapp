<script>
import SocketManager from '@/utils/socketManager.js';

export default {
	data() {
		return {
			// todoCount: 0,
			// messageCount: 0,
			// size: {
			//     message: 0,
			//     todo: 0,
			//     contact: 0,
			//     emp: 0,
			//     notice: 0
			// }
		};
	},
	onLaunch(options) {
		const inviterId = options?.query?.inviterId;
		//缓存邀请码
		if (inviterId) {
			uni.setStorageSync('inviterId', inviterId);
		} else {
			uni.removeStorageSync('inviterId');
		}

		this.initUpdateManager();

		if (uni.getStorageSync('1003') === '0') {
			uni.removeStorage({ key: '1003' });
		}

		// uni.removeStorage({ key: 'details' });
		uni.setStorageSync('auth', '0');
		if (!uni.getStorageSync('wzc_img')) {
			uni.setStorageSync('wzc_img', '/static/img/obj/wzc' + (Math.floor(Math.random() * 3) + 1) + '.svg');
		}
	},
	onShow(options) {
		this.$getCid?.();
		this.$monitorPushMessage?.();

		if (options.scene !== 1007 && this.pinia_user?.phone) {
			// 使用封装模块连接 WebSocket
			SocketManager.connect(this.pinia_user.phone, (data) => {
				if (data.success == 'ok') {
					this.updateMessageCounts();
					this.$u.setPinia({
						system: {
							Flush: data.success
						}
					});
				}
			});

			this.redirectToIndexIfNeeded();
		}
	},
	onHide() {
		SocketManager.close(); // 页面隐藏时清理 WebSocket

		this.$u.setPinia({
			guide: {
				guidance: 0
			}
		});
	},
	onUnload() {
		uni.setStorageSync('auth', '0');
		SocketManager.close(); // 页面卸载时清理 WebSocket
	},
	methods: {
		updateMessageCounts() {
			this.getPendingTasks();
			this.getNotifications();
		},
		getPendingTasks() {
			uni.$api.order.getOrderDraftList({ bUser: this.pinia_user.phone }).then((res) => {
				const isDirector = this.pinia_userRole === 'D';
				const tasks = res.data.data.filter((item) => (isDirector ? item.port === '1' || item.port === 'f' : item.port === '0'));
				this.todoCount = tasks.length;

				this.$u.setPinia({
					global: {
						tabbar: [
							{
								count: tasks.length
							}
						]
					}
				});
			});
		},
		getNotifications() {
			const user = this.pinia_user;
			const dx = {
				boss: user.data.work === '1' ? user.workData.bossNumber : user.phone,
				staff: user.phone,
				work: user.data.work
			};
			uni.$api.inform.getAllInformList(dx).then((res) => {
				const count = res.data.data;
				if (this.$u.getPinia('global.tabbar.2.count') !== count) {
					this.$u.setPinia({
						global: {
							tabbar: [
								{},
								{},
								{
									count: count
								}
							]
						}
					});
				}
			});
		},
		redirectToIndexIfNeeded() {
			if (uni.getStorageSync('details') === '1') {
				uni.removeStorage({ key: 'details' });
				uni.switchTab({ url: '/pages/index/index' });
			}
		},
		initUpdateManager() {
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate((res) => {
				if (res.hasUpdate) {
					uni.showModal({
						content: '新版本已准备好，点击确定更新',
						showCancel: false,
						confirmText: '确定',
						success: (res) => {
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
@import '@/uni_modules/uview-plus/index.scss';
@import 'static/common/css/base.scss';

@font-face {
	font-family: 'ddbh';
	src: url('https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/font/DDBH.ttf') format('truetype');
}

@font-face {
	font-family: 'ysdzt';
	src: url('https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/font/YSDZT.ttf') format('truetype');
}

@font-face {
	font-family: 'syst';
	src: url('https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/font/syst.ttf') format('truetype');
}
</style>
