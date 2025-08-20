<template>
	<view>
		<y-chat
			:userId="userId"
			:value="val"
			:messageList="messageList"
			:updateList="updateList"
			:defaultOptions="defaultOptions"
			:tagOptions="tagOptions"
			:sheetList="sheetList"
			@onRefresh="getNext"
			@playPhoto="playPhoto"
			@playCamera="playCamera"
			@send="send"
			@tapAvator="tapAvator"
			@redPacket="redPacket"
			:OperatingSystem="OperatingSystem"
		>
			<view slot="hander">
				<u-navbar
					:custom-back="customBack"
					:background="{ background: 'transparent' }"
					:border-bottom="false"
					:titleBold="true"
					title-color="#000000"
					title="客服咨询"
					title-size="34"
					bgColor="#ffffff"
				></u-navbar>
				<view class="">
					<text>工作时间 09:00-18:00</text>
					<!-- <text :style="{color:support.work?'#01BB74':'#F76565'}">{{support.work?"(在线)":"(离线)"}}</text> -->
				</view>
			</view>
		</y-chat>
	</view>
</template>

<script>
import data from '../../../components/y-chat/data';
// 用来获取随机id的, 正式项目不需要
function getRandomNum() {
	return Math.floor(Math.random() * 1000).toString() + Math.floor(Math.random() * 1000).toString();
}
export default {
	data() {
		return {
			val: '',
			userId: 1,
			state: false,
			tagOptions: {
				lin: {
					text: '山园小梅·其一',
					bgColor: '#ffffff',
					color: '#fff'
				}
			},
			defaultOptions: {
				userId: 'userId',
				msgId: 'id',
				name: 'name',
				message: 'message',
				img: 'img',
				time: 'time',
				avator: 'avator',
				tagLabel: 'tagLabel'
			},
			messageList: [],
			updateList: [],
			sheetList: [],
			// sheetList: [{
			// 	img: '',
			// 	icon: 'red-packet-fill',
			// 	name: '红包',
			// 	funLabel: 'redPacket'
			// }],
			socketOpen: false,
			chatSocket: null,
			OperatingSystem: false,
			support: {},
			defAtr: 'https://res-oss.elist.com.cn/wxImg/index/mr.svg'
		};
	},
	onLoad(options) {
		this.SocketMessage();
		this.getKf();
		this.OperatingSystem = this.getOperatingSystem();
	},
	onShow() {
		if (this.pinia_user.phone == undefined) {
			uni.navigateTo({
				url: '/pages/subUser/login'
			});
		}
	},
	onHide() {
		// uni.closeSocket();
	},
	onUnload() {
		this.chatSocket.close();
	},
	methods: {
		customBack() {
			console.log('聊天返回');
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
		getOperatingSystem() {
			let systemInfo = uni.getSystemInfoSync();
			console.log('systemInfo:', systemInfo);
			if (systemInfo.system.toLowerCase().includes('ios')) {
				return true;
			}
			// iOS detection from: http://stackoverflow.com/a/9039885/177710
			if (systemInfo.system.toLowerCase().includes('android')) {
				return false;
			}
		},
		getCurrentDate(str) {
			const date = new Date(str);
			const year = date.getFullYear();
			const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based, add leading zero if necessary
			const day = ('0' + date.getDate()).slice(-2); // Add leading zero if necessary
			const hours = ('0' + date.getHours()).slice(-2);

			// 获取分钟，并添加前导零
			const minutes = ('0' + date.getMinutes()).slice(-2);

			// 获取秒，并添加前导零
			const seconds = ('0' + date.getSeconds()).slice(-2);
			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		},
		getChatMes() {
			var dx = {
				fromUser: this.support.phone,
				toUser: this.pinia_user.phone,
				phone: this.pinia_user.phone
			};
			this.$u
				.post('edo/chatting/get', dx)
				.then((res) => {
					console.log('聊天记录：', res);
					var mesList = res.data.data[this.pinia_user.phone];
					var mesListPush = [];
					mesList.forEach((res) => {
						var mes = {};
						if (this.isImageUrl(res.message)) {
							mes = {
								userId: res.userId,
								id: res.id,
								name: res.name,
								img: res.message,
								time: new Date(this.getCurrentDate(res.time)).getTime(),
								avator: res.avator,
								tagLabel: 'jiang'
							};
						} else {
							mes = {
								userId: res.userId,
								id: res.id,
								name: res.name,
								message: res.message,
								time: new Date(this.getCurrentDate(res.time)).getTime(),
								avator: res.avator,
								tagLabel: 'jiang'
							};
						}

						mesListPush.push(mes);
					});

					this.messageList = mesListPush;
				})
				.catch((res) => {
					console.log('异常');
				});
		},
		isImageUrl(url) {
			// 使用正则表达式检查URL是否包含常见的图片扩展名
			// 这里只列出了几个常见的扩展名，你可以根据需要添加更多
			const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;

			// 检查URL是否以常见的协议开头
			// 这里只检查了http和https，你可以根据需要添加更多
			const protocolPattern = /^(http|https):\/\//;

			// 首先检查URL是否以常见的协议开头
			if (!protocolPattern.test(url)) {
				return false;
			}

			// 然后检查URL是否包含图片扩展名
			return imageExtensions.test(url);
		},
		SocketMessage() {
			console.debug('创建socket');
			this.chatSocket = uni.connectSocket({
				url: 'wss://wxapi.elist.com.cn/edo/send/' + this.pinia_user.phone, // 你的 WebSocket 服务器地址
				// url: 'ws://localhost:8183/edo/send/' + this.pinia_user.phone,
				success: () => {
					this.socketOpen = true;
					console.log('WebSocket 连接已打开');
				},
				fail: (err) => {
					console.error('WebSocket 连接失败', err);
				}
			});

			this.chatSocket.onMessage((res) => {
				try {
					console.log('收到服务器内容：' + res.data);
					this.getChatMes();
					// var jsonStr = res.data;
					// var json = JSON.parse(jsonStr)
					// var mesStr = JSON.parse(json.message);
					// console.log('收到服务器内容mesStr：' + mesStr);
					// var dx = mesStr
					// dx.id = getRandomNum()
					// dx.userId = 2
					// this.messageList.push(dx)
				} catch {
					console.log('收到服务器 别的内容：' + res.data);
				}
			});

			this.chatSocket.onOpen(() => {
				console.log('WebSocket 连接已打开');
			});

			// 监听连接关闭事件
			this.chatSocket.onClose(() => {
				console.log('WebSocket 连接已关闭');
				this.socketOpen = false;
			});

			// 监听连接错误事件
			this.chatSocket.onError((err) => {
				console.error('WebSocket 连接错误', err);
				this.socketOpen = false;
			});
		},
		getKf() {
			this.$u
				.post('/edo/support/get')
				.then((res) => {
					console.log('获取客服：', res);
					this.support = res.data.data;
					this.getChatMes();
				})
				.catch((res) => {});
		},
		sendMessage(mes) {
			const chatRecord = {
				fromUser: this.pinia_user.phone, // 发送者，不能为空
				toUser: this.support.phone, // 被发送者，可以为空
				message: mes.message, // 消息内容，可以为空
				type: '1', // 消息所属类型，可以为空
				genre: 'str', // 消息类型，可以为空
				state: 1, // 状态，可以为空
				createTime: new Date(), // 创建时间，可以为空（但通常应该是日期时间格式）
				readTime: '', // 读取时间，可以为空（但通常应该是日期时间格式）
				withdraw: '1', // 撤回状态，可以为空
				avator: mes.avator, // 发起者头像，可以为空
				name: mes.name // 发起者名称，可以为空
			};

			//存入数据库
			this.$u.post('/edo/chatting/add', chatRecord).then((res) => {
				console.log(res.data.data.data);
				var dx = {
					formUserId: this.pinia_user.phone,
					toUserId: this.support.phone,
					message: JSON.stringify(res.data.data.id)
				};

				if (res.data.data.data == 1) {
					this.messageList.push(mes);
					//通知
					if (this.socketOpen) {
						this.chatSocket.send({
							data: JSON.stringify(dx),
							async success() {
								console.log('消息发送成功');
							}
						});
					} else {
						console.debug('socket处于关闭 激活发送');
						this.SocketMessage();
						if (this.socketOpen) {
							this.chatSocket.send({
								data: JSON.stringify(dx),
								async success() {
									console.log('消息发送成功');
								}
							});
						}
					}
				} else {
					this.$u.toast('发送失败，请重新尝试');
				}
			});
		},
		tapAvator(e) {
			console.log(e, 'ee');
		},
		getNext(stop) {
			// 请求接口 || ... 之后调用stop方法停止动画
			setTimeout(() => {
				this.getList();
				stop();
			}, 100);
		},
		getList() {},
		get(e) {
			console.log(e, 'ee');
		},
		playPhoto(file) {
			//#ifdef MP-WEIXIN
			var phone = this.pinia_user.phone;
			// #endif
			// #ifdef APP
			var phone = this.pinia_user.phone + '-app';
			// #endif

			var that = this;
			uni.uploadFile({
				url: uni.$http.config.baseURL + '/edo/uploading/chat',
				header: {
					phone: phone,
					token: !this.pinia_token
				},
				filePath: file.tempFilePaths[0],
				name: 'file',
				formData: {
					phone: this.pinia_user.phone,
					imageType: '1'
				},
				success: (uploadFileRes) => {
					var url = uploadFileRes.data;
					console.log('图片地址：', url);
					//存数据库  刷新
					const chatRecord = {
						fromUser: that.pinia_user.phone, // 发送者，不能为空
						toUser: that.support.phone, // 被发送者，可以为空
						message: url, // 消息内容，可以为空
						type: '1', // 消息所属类型，可以为空
						genre: 'img', // 消息类型，可以为空
						state: 1, // 状态，可以为空
						createTime: new Date().getTime(), // 创建时间，可以为空（但通常应该是日期时间格式）
						readTime: '', // 读取时间，可以为空（但通常应该是日期时间格式）
						withdraw: '1', // 撤回状态，可以为空
						avator: that.pinia_user.data.headPortrait ? that.pinia_user.data.headPortrait : this.defAtr, // 发起者头像，可以为空
						name: that.pinia_user.data.name // 发起者名称，可以为空
					};

					console.log('图片发送：', chatRecord);
					this.$u.post('/edo/chatting/add', chatRecord).then((res) => {
						if (res.data.data.data == 1) {
							var dxc = {
								userId: 1,
								id: 1,
								name: '白',
								message: '',
								time: new Date().getTime(),
								avator: that.pinia_user.data.headPortrait ? that.pinia_user.data.headPortrait : this.defAtr,
								img: file.tempFilePaths[0]
							};

							this.messageList.push(dxc);
							var dx = {
								userId: 1,
								id: getRandomNum(), // id必须是唯一值
								name: this.pinia_user.data.name,
								message: res.data.data.id,
								time: new Date().getTime(),
								avator: that.pinia_user.data.headPortrait ? that.pinia_user.data.headPortrait : this.defAtr,
								tagLabel: 'jiang'
							};
							this.sendImg(dx);
						}
					});
				}
			});
		},
		sendImg(dx) {
			var send = {
				formUserId: this.pinia_user.phone,
				fromUserId: this.pinia_user.phone,
				message: JSON.stringify(dx),
				toUserId: this.support.phone
			};

			if (this.socketOpen) {
				this.chatSocket.send({
					data: JSON.stringify(send),
					async success() {
						console.log('消息发送成功');
					}
				});
			} else {
				this.SocketMessage();
				if (this.socketOpen) {
					this.chatSocket.send({
						data: JSON.stringify(send),
						async success() {
							console.log('消息发送成功');
						}
					});
				}
			}
		},
		playCamera(file) {
			var dxc = {
				userId: 1,
				id: 1,
				name: '白',
				message: '',
				time: new Date().getTime(),
				avator: this.pinia_user.data.headPortrait,
				img: file.tempFilePaths[0]
			};

			this.messageList.push(dxc);

			//#ifdef MP-WEIXIN
			var phone = this.pinia_user.phone;
			// #endif
			// #ifdef APP
			var phone = this.pinia_user.phone + '-app';
			// #endif

			var that = this;
			uni.uploadFile({
				url: uni.$http.config.baseURL + '/edo/uploading/chat',
				header: {
					phone: phone,
					token: !this.pinia_token
				},
				filePath: file.tempFilePaths[0],
				name: 'file',
				formData: {
					phone: this.pinia_user.phone,
					imageType: '1'
				},
				success: (uploadFileRes) => {
					var url = uploadFileRes.data;
					// console.log("图片地址：", url);
					// var dx = {
					// 	userId: 1,
					// 	id: getRandomNum(), // id必须是唯一值
					// 	name: this.pinia_user.data.name,
					// 	message: url,
					// 	time: new Date().getTime(),
					// 	avator: that.pinia_user.data.headPortrait ? that.pinia_user.data.headPortrait :this.defAtr,
					// 	tagLabel: 'jiang'
					// }
					// this.sendImg(dx);
					const chatRecord = {
						fromUser: that.pinia_user.phone, // 发送者，不能为空
						toUser: that.support.phone, // 被发送者，可以为空
						message: url, // 消息内容，可以为空
						type: '1', // 消息所属类型，可以为空
						genre: 'img', // 消息类型，可以为空
						state: 1, // 状态，可以为空
						createTime: new Date().getTime(), // 创建时间，可以为空（但通常应该是日期时间格式）
						readTime: '', // 读取时间，可以为空（但通常应该是日期时间格式）
						withdraw: '1', // 撤回状态，可以为空
						avator: that.pinia_user.data.headPortrait ? that.pinia_user.data.headPortrait : this.defAtr, // 发起者头像，可以为空
						name: that.pinia_user.data.name // 发起者名称，可以为空
					};

					this.$u.post('/edo/chatting/add', chatRecord).then((res) => {
						if (res.data.data.data == 1) {
							// 		var dxc = {
							// 			userId: 1,
							// 			id: 1,
							// 			name: '白',
							// 			message: '',
							// 			time: new Date().getTime(),
							// 			avator: that.pinia_user.data.headPortrait ? that.pinia_user.data
							// 				.headPortrait : this.defAtr,
							// 			img: file.tempFilePaths[0]

							// 		}

							// 		this.messageList.push(dxc)
							var dx = {
								userId: 1,
								id: getRandomNum(), // id必须是唯一值
								name: this.pinia_user.data.name,
								message: res.data.data.id,
								time: new Date().getTime(),
								avator: that.pinia_user.data.headPortrait ? that.pinia_user.data.headPortrait : this.defAtr,
								tagLabel: 'jiang'
							};
							this.sendImg(dx);
						}
					});
				}
			});
		},
		send(val) {
			console.log('消息：', val);
			//两种方式
			//方式一: 把数据以对象形式赋值给updateList即可自动发送(推荐)
			var dx = {
				userId: 1,
				id: getRandomNum(), // id必须是唯一值
				name: this.pinia_user.data.name,
				message: val,
				time: new Date().getTime(),
				avator: this.pinia_user.data.headPortrait || 'https://res-oss.elist.com.cn/wxImg/index/mr.svg',
				tagLabel: 'jiang'
			};

			this.sendMessage(dx);

			//方式二: 自己操作messageList => 可以通过push, 也可以messageList整个重新赋值
			// this.messageList.push({
			// 	userId: 2,
			// 	id: 1, // id必须是唯一值
			// 	name: '白',
			// 	message: val,
			// 	time: new Date().getTime(),
			// 	avator: 'https://tva3.sinaimg.cn/large/9bd9b167gy1g4lhmt4zm5j21hc0xcnhs.jpg',
			// 	tagLabel: 1
			// })
		},
		redPacket() {}
	}
};
</script>

<style></style>
