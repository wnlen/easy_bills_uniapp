// utils/socketManager.js

let socket = null;
let isConnected = false;
let heartbeatTimer = null;
let reconnectTimer = null;
let currentUserId = null;
let messageCallback = null;

const SOCKET_URL_BASE = 'wss://wxapi.elist.com.cn/edo/login/';
const HEARTBEAT_INTERVAL = 15000;
const RECONNECT_INTERVAL = 5000;

const SocketManager = {
	connect(userId, onMessage) {
		if (!userId || isConnected) return;

		currentUserId = userId;
		messageCallback = onMessage;

		const url = SOCKET_URL_BASE + userId;

		// #ifdef APP-PLUS
		socket = new WebSocket(url);

		socket.onopen = () => {
			console.log('[WS] App连接成功');
			isConnected = true;
			this.startHeartbeat();
			this.bindMessageListener();
		};

		socket.onclose = () => {
			console.warn('[WS] App连接关闭');
			isConnected = false;
			this.reconnect();
		};

		socket.onerror = (err) => {
			console.error('[WS] App连接错误', err);
			isConnected = false;
			this.reconnect();
		};
		// #endif

		// #ifdef MP-WEIXIN
		uni.connectSocket({ url });
		console.log('phone', url);
		uni.onSocketOpen(() => {
			console.log('[WS] 小程序连接成功');
			isConnected = true;
			this.startHeartbeat();
			this.bindMessageListener();
		});

		uni.onSocketClose(() => {
			console.warn('[WS] 小程序连接关闭');
			isConnected = false;
			this.reconnect();
		});

		uni.onSocketError((err) => {
			console.error('[WS] 小程序连接错误', err);
			isConnected = false;
			this.reconnect();
		});
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

			// #ifdef APP-PLUS
			if (socket && socket.readyState === 1) {
				socket.send(msg);
				console.log('[WS] App心跳发送');
			}
			// #endif

			// #ifdef MP-WEIXIN
			uni.sendSocketMessage({ data: msg });
			// console.log('[WS] 小程序心跳发送');
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
		// #ifdef APP-PLUS
		socket.onmessage = (res) => {
			this.handleMessage(res.data);
		};
		// #endif

		// #ifdef MP-WEIXIN
		uni.onSocketMessage((res) => {
			this.handleMessage(res.data);
		});
		// #endif
	},

	handleMessage(raw) {
		try {
			const data = JSON.parse(raw);
			messageCallback && messageCallback(data);
		} catch (e) {
			console.error('[WS] 消息解析失败', raw);
		}
	},

	send(data) {
		const msg = JSON.stringify(data);

		// #ifdef APP-PLUS
		if (socket && socket.readyState === 1) {
			socket.send(msg);
		} else {
			console.warn('[WS] App连接不可用，消息未发送');
		}
		// #endif

		// #ifdef MP-WEIXIN
		uni.sendSocketMessage({ data: msg });
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
		clearTimeout(reconnectTimer);
		reconnectTimer = null;
		isConnected = false;

		// #ifdef APP-PLUS
		if (socket) {
			socket.close();
			socket = null;
		}
		// #endif

		// #ifdef MP-WEIXIN
		uni.closeSocket();
		uni.offSocketMessage();
		uni.offSocketOpen();
		uni.offSocketClose();
		uni.offSocketError();
		// #endif
	}
};

export default SocketManager;
