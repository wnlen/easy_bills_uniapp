<template>
	<view class="c bg-gray">
		<view class="card mt30" v-for="(item, index) in InformList" :key="index">
			<view class="hand">
				{{ fjTime(item.time) }}
			</view>

			<u-swipe-action>
				<u-swipe-action-item bg-color="#f5f5f5" :show="item.show" :name="index" @click="delclick" :options="options">
					<view class="body">
						<view class="body_hand">
							{{ item.type }}
						</view>
						<view class="body_body" v-html="item.content" @click="jump(item)"></view>
					</view>
				</u-swipe-action-item>
			</u-swipe-action>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			InformList: [],
			options: [
				{
					text: '已读',
					style: {
						backgroundColor: '#FFD54E'
					}
				}
			]
		};
	},
	onShow() {
		this.getInformList();
	},
	methods: {
		delclick(item) {
			this.del(this.InformList[item.name]);
			this.InformList.splice(item.name, 1);
		},
		del(item) {
			this.$api.inform
				.deleteSystemInform(item)
				.then((res) => {
					var del = res.data.data;
					var count = Number(this.$u.getPinia('global.tabbar.2.count'));
					if (count > 0) {
						this.$u.setPinia({
							global: {
								tabbar: [
									{},
									{},
									{
										count: count - 1
									}
								]
							}
						});
					} else {
						this.$u.setPinia({
							global: {
								tabbar: [
									{},
									{},
									{
										count: 0
									}
								]
							}
						});
					}

					var that = this;
					setTimeout(function () {
						let result = that.InformList.length == 0;
						if (result) {
							uni.navigateBack();
						}
					}, 500);
				})
				.catch((res) => {
					this.$u.toast(this.message);
				});
		},
		open(index) {
			this.InformList[index].show = true;
			this.InformList.map((val, idx) => {
				if (index != idx) this.InformList[idx].show = false;
			});
		},
		jump(item) {
			console.log(item);
			if (item.jump != '0') {
				uni.navigateTo({
					url: '/pages/subPack/handbook/webpage?url=' + item.jump
				});
			}
		},
		fjTime(isoString) {
			const date = new Date(isoString);
			const dayOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()];
			const month = date.getMonth() + 1;
			const dayOfMonth = date.getDate();
			var Hours = date.getHours();
			var Minutes = date.getMinutes();
			var FullYear = date.getFullYear();

			var timIf = this.isInCurrentWeek(isoString);
			if (timIf) {
				return `${dayOfWeek} ${Hours}:${Minutes}`;
			} else {
				return `${FullYear}-${month}-${dayOfMonth}`;
			}
		},
		isInCurrentWeek(timestamp) {
			// 获取当前日期
			const currentDate = new Date();
			// 获取当前日期的星期几，0代表星期日，1代表星期一，以此类推
			const currentDay = currentDate.getDay();
			// 获取当前日期的时间戳（不包含时间部分）
			const currentTimestamp = currentDate.setHours(0, 0, 0, 0);
			// 获取给定时间的日期对象
			const givenDate = new Date(timestamp);
			// 获取给定日期的时间戳（不包含时间部分）
			const givenTimestamp = givenDate.setHours(0, 0, 0, 0);
			// 如果给定时间戳的日期与当前日期相同，且给定日期是当前星期内的，则返回true
			return givenTimestamp === currentTimestamp && givenDate.getDay() <= currentDay;
		},
		getInformList() {
			var dx = {
				state: '1',
				phone: this.pinia_user.phone
			};
			this.$api.inform
				.getSystemInformList(dx)
				.then((res) => {
					this.InformList = res.data.data.map((obj) => ({
						...obj,
						show: false
					}));
					console.log('系统通知：', this.InformList);
				})
				.catch((res) => {
					this.$u.toast(this.message);
				});
		}
	}
};
</script>

<style lang="scss">
.c {
	width: 100vw;
	height: 100vh;
	overflow-y: auto;
	// padding: 24px;

	.card {
		margin-left: 24rpx;
		margin-right: 24rpx;
		height: 18vh;
		// width: 100%;

		.hand {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: #999999;
			font-size: 12px;
			padding-bottom: 5px;
		}

		.body {
			border-radius: 6px;
			background-color: #ffffff;
			// width: 100%;
			height: 17vh;
			// padding: 8px;
			padding-left: 24rpx;
			padding-right: 24rpx;
			padding-top: 24rpx;
			// padding-bottom: 24rpx;

			.body_hand {
				font-size: 15px;
				font-weight: 600;
				line-height: 22px;
				letter-spacing: 0px;
				color: #333333;
				margin-top: 5px;
			}

			.body_body {
				color: #999999;
				padding-top: 8px;
				letter-spacing: 1rpx;
				// background-color: #01BB74;
			}

			.body_end {
				position: absolute;
				bottom: 0;
				display: flex;
				flex-direction: row;
				justify-content: left;
				align-items: center;
				height: 5vh;
				width: 95%;
				border-top: 1px solid #f4f4f4;

				.title {
					position: absolute;
					color: #01bb74;
					left: 0;
				}

				.icon {
					position: absolute;
					right: 0;
				}
			}
		}
	}
}
</style>
