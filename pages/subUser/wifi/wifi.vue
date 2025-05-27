<template>
	<view class="page">
		<button open-type="share" @click="setShareMenu">获取当前连接wifi</button>
		<!-- <view class="gc-box">
      <button @click="getConnectedWifi">获取当前连接wifi</button>
    </view>
    <view class="gc-box">
      <button @click="getWifiList">获取周围 WiFi</button>
    </view>

    <view class="gc-box">已连接：{{ connectedWifi.SSID }} </view>

    <view class="gc-box">默认连接密码：<input v-model="password" /> </view>

    <view class="gc-box">
      <view v-for="item in wifiList" :key="item.BSSID" class="item">
        <text class="title">{{ item.SSID }}</text>
        <button class="btn" @click="connectWifi(item)">连接</button>
      </view>
    </view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				wifiList: [], // 存储WiFi列表
				connectedWifi: {
					SSID: ''
				}, // 存储当前已连接wifi
				password: '', // 密码
			}
		},

		onLoad() {
			this.onWifiConnected()
			this.onGetWifiList()
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {
				// 来自页面内转发按钮  
				console.log(res.target)
			}
			console.log(res)
			return {
				title: '自定义分享标题',
				path: '/pages/index/index?refer=share',
				imageUrl: 'https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/edo/19108696232/19108696232/order/ED241012463615/details_img/tmp_fd2dc1754333bafa22748584b78ac1dd10e581dbd81b617c.jpg', // 可选  
				success: function(res) {
					// 转发成功  
				},
				fail: function(err) {
					// 转发失败  
				}
			}
		},
		methods: {
			setShareMenu() {
				// 发起微信公众号分享
				
			},
			/** 启动wifi */
			startWifi() {
				return new Promise((resolve, reject) => {
					uni.startWifi({
						success: (res) => {
							console.log('启动wifi 成功', res)
							resolve(true)
						},
						fail: (err) => {
							console.error('启动wifi 失败', err)
							uni.showModal({
								content: err.errMsg,
								showCancel: false
							})
							reject(new Error(err))
						},
					})
				})
			},

			/** 获取wifi列表， ios和android 各不相同，具体看顶部资料 */
			async getWifiList() {
				const hasStart = await this.startWifi()
				if (hasStart !== true) return
				uni.getWifiList({
					success: (res1) => {
						console.log('获取wifi列表命令发送 成功', res1)
					},
					fail: (err) => {
						console.error('获取wifi列表 失败', err)
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						})
					},
				})
			},

			/** 监听获取wifi列表 */
			onGetWifiList() {
				uni.onGetWifiList((res) => {
					console.log('监听获取wifi列表', res)
					const {
						wifiList
					} = res
					// 过滤同名WiFi信号
					const filterList = wifiList.reduce((result, item) => {
						const index = result.findIndex((v) => {
							return v.SSID === item.SSID
						})
						if (index < 0) {
							result.push(item)
						} else if (item.signalStrength > result[index].signalStrength) {
							result[index] = item
						}
						return result
					}, [])
					console.log('过滤同名后', filterList)
					this.wifiList = filterList
				})
			},

			/** 连接某个 Wi-Fi */
			connectWifi(wifi) {
				console.log('选中的wifi:', wifi)
				this.connectedWifi = {
					SSID: ''
				}
				uni.connectWifi({
					SSID: wifi.SSID,
					password: this.password,
					success: (res) => {
						console.log('wifi连接命令发送 成功:', res)
					},
					fail: (err) => {
						console.error('wifi连接 失败:', err)
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						})
					},
				})
			},

			/**  监听wifi连接状态 */
			onWifiConnected() {
				uni.onWifiConnected((res) => {
					console.log('监听wifi连接状态', res)
					this.connectedWifi = res.wifi
				})
			},

			/** 获取当前连接的wifi */
			async getConnectedWifi() {
				this.connectedWifi = {
					SSID: ''
				}
				const hasStart = await this.startWifi()
				if (hasStart !== true) return
				uni.getConnectedWifi({
					success: (res) => {
						console.log('获取当前连接的wifi 成功', res)
						this.connectedWifi = res.wifi // 当前连接的wifi的信息
						// this.connectedWifiSSID = res.wifi.SSID
					},
					fail: (err) => {
						console.error('获取当前连接的wifi 失败:', err)
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						})
					},
				})
			},
		},
	}
</script>

<style>
	.item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		border-bottom: 2rpx solid #ddd;
		padding: 16rpx 0;
	}

	.item .title {
		flex: 1;
	}

	input {
		border-bottom: 2rpx solid #ddd;
	}
</style>