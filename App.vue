<script>
import SocketManager from '@/utils/socketManager.js';
import { ensureFontsReady } from '@/utils/font-loader.js';

export default {
	data() {
		return {
			todoCount: 0
		};
	},
	onLaunch(options) {
		//加载字体
		this.loadfont();
		this.onNetworkStatusChange();

		uni.$on('switchTabToList', (e) => {
			console.log('监听到isFromSwitchTab');
		});

		//缓存邀请码
		const inviterId = options?.query?.inviterId;
		if (inviterId) {
			uni.setStorageSync('inviterId', inviterId);
		} else {
			uni.removeStorageSync('inviterId');
		}

		//程序更新
		this.initUpdateManager();

		// if (uni.getStorageSync('1003') === '0') {
		// 	uni.removeStorage({ key: '1003' });
		// }

		// uni.removeStorage({ key: 'details' });
		uni.setStorageSync('auth', '0');
		if (!uni.getStorageSync('wzc_img')) {
			uni.setStorageSync('wzc_img', 'https://res-oss.elist.com.cn/wxImg/obj/wzc' + (Math.floor(Math.random() * 3) + 1) + '.svg');
		}
		// 如果存在且不是线上图片重新替换
		else if (uni.getStorageSync('wzc_img').indexOf('https://res-oss.elist.com.cn/wxImg/obj/wzc') == -1) {
			uni.setStorageSync('wzc_img', 'https://res-oss.elist.com.cn/wxImg/obj/wzc' + (Math.floor(Math.random() * 3) + 1) + '.svg');
		}
	},
	// onShow(options) {
	// 	this.$getCid?.();
	// 	this.$monitorPushMessage?.();

	// 	if (options.scene !== 1007 && this.pinia_user?.phone) {
	// 		// 使用封装模块连接 WebSocket
	// 		SocketManager.connect(this.pinia_user.phone, (data) => {
	// 			if (this.pinia_user?.phone) {
	// 				this.updateMessageCounts();
	// 				uni.$u.setPinia({
	// 					system: {
	// 						flush: data
	// 					}
	// 				});
	// 			}
	// 		});

	// 		this.redirectToIndexIfNeeded();
	// 	}
	// },
	onHide() {
		SocketManager.close(); // 页面隐藏时清理 WebSocket
	},
	onUnload() {
		uni.setStorageSync('auth', '0');
		SocketManager.close(); // 页面卸载时清理 WebSocket
	},
	methods: {
		onNetworkStatusChange() {
			// 初始化网络状态
			uni.getNetworkType({
				success(res) {
					const connected = res.networkType !== 'none';
					uni.$u.setPinia({
						system: {
							NET_CONNECTED: connected
						}
					});
				}
			});

			// 实时监听
			uni.onNetworkStatusChange((res) => {
				uni.$u.setPinia({
					system: {
						NET_CONNECTED: res.isConnected
					}
				});
			});
		},
		async loadfont() {
			try {
				await ensureFontsReady();
				// 字体已全局可用，后续各页面无需再 loadFontFace
			} catch (e) {
				console.error('font init failed', e);
			}
		},
		updateMessageCounts() {
			this.getPendingTasks();
			this.getNotifications();
		},
		getPendingTasks() {
			const param = {
				bUser: this.pinia_user.phone,
				port: this.pinia_userRole
			};
			uni.$api.order.getOrderDraftList(param).then((res) => {
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
			// #ifdef MP
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate((res) => {
				if (res.hasUpdate) {
					uni.showModal({
						content: '新版本已准备好，点击确定更新',
						showCancel: false,
						confirmText: '确定',
						confirmColor: '#01bb74',
						success: (res) => {
							if (res.confirm) {
								updateManager.onUpdateReady(() => updateManager.applyUpdate());
								updateManager.onUpdateFailed(() => {
									uni.showModal({
										content: '下载失败，请删除当前小程序后重装',
										showCancel: false,
										confirmText: '我知道了',
										confirmColor: '#01bb74'
									});
								});
							}
						}
					});
				}
			});
			// #endif
		}
	}
};
</script>

<style lang="scss">
@import '@/uni_modules/uview-plus/index.scss';
@import 'static/common/css/base.scss';
/* #ifdef APP */
/* 全局样式，穿透到隐私政策弹窗 */
/* 针对rich-text组件中的a标签 */
rich-text a {
	color: #000000 !important; /* 自定义颜色 */
	text-decoration: none !important; /* 去掉下划线 */
}

/* 针对web-view中的a标签（如果是加载外部页面） */
web-view a {
	color: #000000 !important;
}

/* 兼容不同组件的类名（部分版本UniApp的隐私弹窗有特定类名） */
.privacy-popup a,
.android-privacy a {
	color: #000000 !important;
}
/* #endif */
</style>
