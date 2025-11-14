// utils/socketManager.js

let socket = null; // 仅 H5 用
let socketTask = null; // APP-PLUS / MP-WEIXIN 用
let isConnected = false;
let heartbeatTimer = null;
let reconnectTimer = null;
let currentUserId = null;
let messageCallback = null;

// 兼容标记
let useGlobalHandlers = false; // true 表示采用全局 onSocket* 方式
let supportsTaskApi = false; // 当前 socketTask 是否具备 onOpen/send/close

// 发送队列：未连上/暂不可发时先入队，onOpen 后统一发送
const pendingQueue = [];

const SOCKET_URL_BASE = 'wss://wxapi.elist.com.cn/edo/login/';
const HEARTBEAT_INTERVAL = 15000;
const RECONNECT_INTERVAL = 5000;

function flushPending() {
	if (!isConnected || pendingQueue.length === 0) return;

	while (pendingQueue.length) {
		const msg = pendingQueue.shift();

		// #ifdef H5
		if (socket && socket.readyState === 1) {
			try {
				socket.send(msg);
			} catch (e) {
				console.warn('[WS] H5 flush 发送失败', e);
			}
			continue;
		}
		// #endif

		// #ifdef APP-PLUS || MP-WEIXIN
		if (!useGlobalHandlers && supportsTaskApi && socketTask && typeof socketTask.send === 'function') {
			try {
				socketTask.send({
					data: msg
				});
			} catch (e) {
				console.warn('[WS] SocketTask flush 发送失败', e);
			}
		} else {
			try {
				uni.sendSocketMessage({
					data: msg
				});
			} catch (e) {
				console.warn('[WS] global flush 发送失败', e);
			}
		}
		// #endif
	}
}

function createSocketTask(url) {
	try {
		// 注意：若不传 success/fail/complete，可能返回 Promise 而非 SocketTask
		return uni.connectSocket({
			url,
			// 可按需加 header / protocols / method
			complete: () => {} // 确保返回的是 SocketTask
		});
	} catch (e) {
		console.error('[WS] connectSocket 调用异常', e);
		return null;
	}
}

const SocketManager = {
	connect(userId, onMessage) {
		if (!userId || isConnected) return;

		currentUserId = userId;
		messageCallback = onMessage;
		const url = SOCKET_URL_BASE + userId;

		// ---------- H5：浏览器才有原生 WebSocket ----------
		// #ifdef H5
		// 关闭旧连接（防御）
		if (socket) {
			try {
				socket.close();
			} catch (e) {}
			socket = null;
		}
		try {
			socket = new WebSocket(url);
		} catch (e) {
			console.error('[WS] H5 创建 WebSocket 失败', e);
		}

		if (socket) {
			socket.onopen = () => {
				console.log('[WS] H5连接成功');
				isConnected = true;
				this.startHeartbeat();
				this.bindMessageListener();
				flushPending();
			};

			socket.onclose = () => {
				console.warn('[WS] H5连接关闭');
				isConnected = false;
				this.reconnect();
			};

			socket.onerror = (err) => {
				console.error('[WS] H5连接错误', err);
				isConnected = false;
				this.reconnect();
			};
		}
		// #endif

		// ---------- App & 微信小程序：用 uni.connectSocket ----------
		// #ifdef APP-PLUS || MP-WEIXIN
		// 关闭旧连接
		if (socketTask && typeof socketTask.close === 'function') {
			try {
				socketTask.close({
					code: 1000,
					reason: 'reconnect'
				});
			} catch (e) {}
		}
		socketTask = null;
		supportsTaskApi = false;
		useGlobalHandlers = false;

		socketTask = createSocketTask(url);

		// 能力探测：必须同时具备 onOpen/send/close 才视为标准 SocketTask
		supportsTaskApi = !!(socketTask &&
			typeof socketTask.onOpen === 'function' &&
			typeof socketTask.send === 'function' &&
			typeof socketTask.close === 'function');

		useGlobalHandlers = !supportsTaskApi;

		if (supportsTaskApi) {
			socketTask.onOpen(() => {
				console.log('[WS] 连接成功 (app/mp via SocketTask)');
				isConnected = true;
				this.startHeartbeat();
				this.bindMessageListener(); // 走 socketTask.onMessage
				flushPending();
			});

			socketTask.onClose(() => {
				console.warn('[WS] 连接关闭 (app/mp via SocketTask)');
				isConnected = false;
				this.reconnect();
			});

			socketTask.onError((err) => {
				console.error('[WS] 连接错误 (app/mp via SocketTask)', err);
				isConnected = false;
				this.reconnect();
			});
		} else {
			// 退回全局事件方案（部分端/版本需要用全局）
			// 先清理旧的全局监听，避免重复
			try {
				uni.offSocketOpen && uni.offSocketOpen();
				uni.offSocketClose && uni.offSocketClose();
				uni.offSocketError && uni.offSocketError();
				uni.offSocketMessage && uni.offSocketMessage();
			} catch (e) {}

			uni.onSocketOpen(() => {
				console.log('[WS] 连接成功 (app/mp via global)');
				isConnected = true;
				this.startHeartbeat();
				this.bindMessageListener(); // 走 global onSocketMessage
				flushPending();
			});

			uni.onSocketClose(() => {
				console.warn('[WS] 连接关闭 (app/mp via global)');
				isConnected = false;
				this.reconnect();
			});

			uni.onSocketError((err) => {
				console.error('[WS] 连接错误 (app/mp via global)', err);
				isConnected = false;
				this.reconnect();
			});
		}
		// #endif
	},

	startHeartbeat() {
		this.stopHeartbeat();

		heartbeatTimer = setInterval(() => {
			const msg = JSON.stringify({
				type: '0',
				fromUserId: currentUserId,
				toUserId: currentUserId,
				time: new Date()
			});

			// #ifdef H5
			if (socket && socket.readyState === 1) {
				try {
					socket.send(msg);
				} catch (e) {
					console.warn('[WS] H5心跳发送失败', e);
				}
			}
			// #endif

			// #ifdef APP-PLUS || MP-WEIXIN
			if (!isConnected) {
				// 未连上则排队
				pendingQueue.push(msg);
				return;
			}

			if (supportsTaskApi && socketTask && typeof socketTask.send === 'function') {
				socketTask.send({
					data: msg
				});
			} else {
				try {
					uni.sendSocketMessage({
						data: msg
					});
				} catch (e) {
					console.warn('[WS] app/mp 心跳发送失败（global）', e);
				}
			}
			// #endif
		}, HEARTBEAT_INTERVAL);
	},

	stopHeartbeat() {
		if (heartbeatTimer) {
			clearInterval(heartbeatTimer);
			heartbeatTimer = null;
		}
	},

	bindMessageListener() {
		// #ifdef H5
		if (socket) {
			socket.onmessage = (res) => this.handleMessage(res.data);
		}
		// #endif

		// #ifdef APP-PLUS || MP-WEIXIN
		if (supportsTaskApi && socketTask && typeof socketTask.onMessage === 'function') {
			socketTask.onMessage((res) => this.handleMessage(res.data));
		} else {
			// 全局监听兜底（注意：全局监听是累加的，上面已做 off 清理）
			uni.onSocketMessage((res) => this.handleMessage(res.data));
		}
		// #endif
	},

	handleMessage(raw) {
		try {
			const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
			messageCallback && messageCallback(data);
		} catch (e) {
			console.error('[WS] 消息解析失败', raw);
		}
	},

	send(data) {
		const msg = JSON.stringify(data);

		// #ifdef H5
		if (socket && socket.readyState === 1) {
			try {
				socket.send(msg);
			} catch (e) {
				console.warn('[WS] H5发送失败', e);
			}
		} else {
			console.warn('[WS] H5连接未就绪，入队等待发送');
			pendingQueue.push(msg);
		}
		// #endif

		// #ifdef APP-PLUS || MP-WEIXIN
		if (!isConnected) {
			pendingQueue.push(msg);
			return;
		}

		if (supportsTaskApi && socketTask && typeof socketTask.send === 'function') {
			socketTask.send({
				data: msg
			});
		} else {
			// 走全局 API
			try {
				uni.sendSocketMessage({
					data: msg
				});
			} catch (e) {
				console.warn('[WS] global sendSocketMessage 发送失败，入队等待', e);
				pendingQueue.push(msg);
			}
		}
		// #endif
	},

	reconnect() {
		this.stopHeartbeat();
		if (reconnectTimer) return;

		reconnectTimer = setTimeout(() => {
			reconnectTimer = null;
			console.log('[WS] 正在尝试重连...');
			this.connect(currentUserId, messageCallback);
		}, RECONNECT_INTERVAL);
	},

	close() {
		this.stopHeartbeat();
		if (reconnectTimer) {
			clearTimeout(reconnectTimer);
			reconnectTimer = null;
		}
		isConnected = false;
		pendingQueue.length = 0; // 清空待发送

		// #ifdef H5
		if (socket) {
			try {
				socket.close();
			} catch (e) {}
			socket = null;
		}
		// #endif

		// #ifdef APP-PLUS || MP-WEIXIN
		if (supportsTaskApi && socketTask && typeof socketTask.close === 'function') {
			try {
				socketTask.close({
					code: 1000,
					reason: 'manual close'
				});
			} catch (e) {}
			socketTask = null;
		} else {
			// 全局关闭 + 清理全局监听
			try {
				uni.closeSocket();
			} catch (e) {}
			try {
				uni.offSocketOpen && uni.offSocketOpen();
				uni.offSocketClose && uni.offSocketClose();
				uni.offSocketError && uni.offSocketError();
				uni.offSocketMessage && uni.offSocketMessage();
			} catch (e) {}
		}
		// #endif
	}
};

export default SocketManager;