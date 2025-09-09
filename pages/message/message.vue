<template>
	<view class="content bg-white">
		<z-paging
			ref="paging"
			:refresher-enabled="false"
			use-virtual-list
			:force-close-inner-list="true"
			cell-height-mode="dynamic"
			@virtualListChange="virtualListChange"
			@query="queryList"
		>
			<template #top>
				<u-navbar title="消息" :placeholder="true">
					<template #left></template>
				</u-navbar>
				<view>
					<u-notice-bar direction="column" :text="list2"></u-notice-bar>
				</view>

				<view class="vw100" style="margin-top: 50%; height: 200rpx" v-if="!ifShow()">
					<u-empty
						icon="https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/role/dbsx.svg"
						iconSize="400rpx"
						text="暂无消息~"
						mode="search"
						marginTop="200rpx"
					></u-empty>
				</view>
				<view class="">
					<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in list" :key="index" @click="click" disabled :options="options">
						<view class="item u-border-bottom relative" v-show="item.number > 0" v-if="item.ifwork && showMess && ifShow()">
							<view class="mr30"><u-icon :name="ImgUrl + item.images" size="100rpx"></u-icon></view>

							<view class="title-wrap flex-col" style="background-color: #ffffff; width: 80%" @click="jumpChat(item.name, item.images, item)">
								<view class="flex-row" style="width: 100%">
									<view class="" style="width: 60%; font-size: 32rpx; margin-top: 4rpx">
										<text>{{ item.name }}</text>
									</view>
									<view class="" style="width: 40%">
										<text class="" style="font-size: 24rpx; color: #cccccc; margin-right: 0; width: 20%">
											{{ item.time }}
										</text>
									</view>
								</view>
								<view class="title-wrap">
									<text class="title u-line-2">{{ item.title }}</text>
									<u-badge size="default" :offset="['10rpx', '20rpx']" absolute bgColor="#FA5151" v-show="item.right" :value="item.number"></u-badge>
								</view>
							</view>
						</view>
					</u-swipe-action>
				</view>
			</template>
		</z-paging>
		<!-- 自定义tab -->
		<pop-tab :tabIndex="2" ref="popTab"></pop-tab>
		<!-- <u-tabbar :list="vuex_tabbar" :height="tabHight" iconSize="40" active-color="#0FB076"></u-tabbar> -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			tabHight: '100rpx',
			backText: '选择客户',
			showMess: false,
			list: [
				{
					id: 2,
					name: '账号邀请',
					title: '您有新的账号邀请',
					images: '/wxImg/message/1%20%284%29.png',
					show: false,
					time: '',
					number: 0,
					ifwork: true,
					path: '/pages/subMessage/friend_apply_for/yg_apply_for',
					type: '1',
					right: true
				},
				{
					id: 2,
					name: '好友申请',
					title: '您有新的好友申请',
					images: '/wxImg/message/1%20%282%29.png',
					show: false,
					time: '',
					number: 0,
					ifwork: true,
					path: '/pages/subMessage/friend_apply_for/friend_apply_for',
					type: '1',
					right: true
				},
				{
					id: 3,
					name: '续费提醒',
					title: '您有仅剩一个月到期的产品，请您尽快...',
					images: '/wxImg/message/1%20%285%29.png',
					show: false,
					time: '',
					number: 0,
					ifwork: true,
					path: '/pages/subMessage/renewInform/renewInform',
					type: '1',
					right: true
				},
				{
					id: 4,
					name: '系统通知',
					title: '您有新的系统通知',
					images: '/wxImg/message/17.png',
					show: false,
					time: '',
					number: 0,
					ifwork: true,
					path: '/pages/subMessage/systemInform/systemInform',
					type: '0',
					right: true
				}
			],
			disabled: false,
			btnWidth: 180,
			show: false,
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#ff6e55'
					}
				}
			],
			list2: ['欢迎使用易单据', '目前上线版本3.0', '欢迎用户提出建议', '共同创建完美平台'],
			phone: ''
		};
	},
	onLoad() {
		// this.$getModel((value) => {
		// 	if (value) {
		// 		this.tabHight = value;
		// 		// 在这里可以根据获取到的值进行其他操作
		// 	} else {
		// 		this.tabHight = value;
		// 	}
		// });
	},
	onShow() {
		if (this.pinia_user.phone != undefined) {
			this.getAllNum();
			this.$refs.popTab.getMessNum();
		} else {
			this.$u.toast('登录了解更多');
		}
	},
	onPullDownRefresh() {
		console.log('下拉');
		if (this.pinia_user.phone != undefined) {
			this.getAllNum();
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		} else {
			this.$u.toast('登录了解更多');
		}
	},
	methods: {
		virtualListChange() {},
		queryList() {
			if (this.pinia_user.phone != undefined) {
				this.showMess = false;
				this.loadData();
				// this.SOCKETfLUSH();
				this.getAllNum();
				this.$refs.popTab.getMessNum();
			} else {
				this.$u.toast('登录了解更多');
			}
		},
		getAllNum() {
			var dx = {
				boss: this.pinia_user.data.work == '1' ? this.pinia_user.workData.bossNumber : this.pinia_user.phone,
				staff: this.pinia_user.phone,
				work: this.pinia_user.data.work
			};
			uni.$api.inform
				.getAllMessages(dx)
				.then((res) => {
					var list = res.data.data;
					var sum = 0;
					this.list.forEach((item, index) => {
						let role = this.pinia_user.data.work == '1';
						item.ifwork = list[index] > 0;
						item.number = list[index];
						sum = sum + list[index];
					});

					console.log(this.list);

					if (this.$u.getPinia('global.tabbar.2.count') != sum) {
						this.$u.setPinia({
							global: {
								tabbar: [
									{},
									{},
									{
										count: sum
									}
								]
							}
						});
					}

					this.showMess = true;
				})
				.catch((res) => {
					this.$u.toast(this.message);
				});
		},
		loadData() {
			this.$loadUser(this);
			console.log('用户信息实时更新 ', this.pinia_user);
		},
		SOCKETfLUSH() {
			this.unwatchFlush = this.$watch(
				(state) => state.flush, // 监听状态
				(newVal, oldVal) => {
					this.flushIndex = newVal; // 当状态变化时，更新本地数据
					console.log('message flush 改变:', newVal);
					this.getAllNum();
				}
			);
		},
		ifShow() {
			if (this.pinia_user.phone != undefined) {
				var a = 0;
				if (this.pinia_user.data.work != '0') {
					return this.list[2].number + this.list[1].number + this.list[3].number > 0;
				} else {
					this.list.forEach((res) => {
						var num = res.number > 0;
						if (num) {
							a++;
						}
					});

					return a > 0;
				}
			}
		},
		handleBackClick() {
			console.log('点击了');
			uni.navigateTo({
				url: '/pages/subOrder/table'
			});
		},
		getPhone() {},
		jumpChat(name, image, item) {
			console.log(name, image, item);
			this.getAllNum();
			let role = this.pinia_user.data.work == '1';
			if (role) {
				this.list[0].ifwork = false;
				this.list[2].ifwork = false;
			}
			var jump = item.ifwork;
			if (jump) {
				uni.navigateTo({
					url: item.path
				});
			}

			// if (name == "好友申请") {
			// 	uni.setStorageSync("name", name)
			// 	uni.navigateTo({
			// 		url: '/pages/subMessage/friend_apply_for/friend_apply_for'
			// 	})
			// } else if (name == "账号邀请") {
			// 	uni.setStorageSync("zhyq", "1")
			// 	uni.navigateTo({
			// 		url: '/pages/subMessage/friend_apply_for/yg_apply_for'
			// 	})
			// } else if (name == "系统消息") {
			// 	uni.setStorageSync("name", name)
			// 	uni.navigateTo({
			// 		url: '/pages/subMessage/systematic _notification/systematic _notification'
			// 	})
			// } else if (name == "支付消息") {
			// 	uni.setStorageSync("name", name)
			// 	uni.navigateTo({
			// 		url: '/pages/subMessage/payment/payment'
			// 	})
			// } else if (name == "交易提醒") {
			// 	uni.setStorageSync("name", name)
			// 	uni.navigateTo({
			// 		url: '/pages/subMessage/deal/deal'
			// 	})
			// } else {
			// 	uni.setStorageSync("name", name)
			// 	uni.navigateTo({
			// 		url: '/pages/subMessage/chitchat/chitchat?name=' + name + '&' + 'image=' + image
			// 	})
			// }
		},
		click(index, index1) {
			if (index1 == 1) {
				this.list.splice(index, 1);
				this.$u.toast(`删除了第${index}个cell`);
			} else {
				this.list[index].show = false;
				this.$u.toast(`不可被删除`);
			}
		},
		// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
		open(index) {
			// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
			// 原本为'false'，再次设置为'false'会无效
			this.list[index].show = true;
			this.list.map((val, idx) => {
				if (index != idx) this.list[idx].show = false;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	width: 100vw;
	height: 100vw;
	// background-color: aqua;
}

.item {
	// display: flex;
	// padding: 20rpx;

	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;

	// width: 95;
	margin-left: 24rpx;
	margin-right: 24rpx;

	padding-top: 20rpx;
	padding-bottom: 20rpx;

	// background-color: aqua;
}

image {
	width: 120rpx;
	flex: 0 0 120rpx;
	height: 120rpx;
	margin-right: 20rpx;
	border-radius: 12rpx;
}

.title {
	text-align: left;
	font-size: 27rpx;
	color: #999999;
	margin-top: 6rpx;
	letter-spacing: 1rpx;
}

// .header {
// 	display: flex;
// 	justify-content: space-between;
// 	align-items: flex-end;
// 	height: 170rpx;
// 	width: 100vw;
// 	background-color: #ffffff;
// 	border-bottom: 2rpx solid #eee;
// }

// .header-left {
// 	font-size: 30rpx;
// 	color: #333;
// }

// .header-title {
// 	font-size: 32rpx;
// 	color: #333;
// 	margin-right: 160rpx;
// }

// .header-message {
// 	font-size: 28rpx;
// 	color: #999;
// }

.custom-refresh {
	height: 20rpx;
	line-height: 100rpx;
	text-align: center;
}
</style>
