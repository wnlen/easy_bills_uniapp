<template>
	<view class="c bg-gray pb150">

		<!-- <u-swipe-action bg-color="#f5f5f5" :show="item.show" :index="index" v-for="(item,index) in renewInformList" :key="index"
			@click="click" @open="open" :options="options"> -->
		<view class="card mt30" v-for="(item,index) in renewInformList" :key="index">
			<view class="hand">
				{{fjTime(item.createTime)}}
			</view>

			<u-swipe-action :btn-width="140" bg-color="#f5f5f5" :show="item.show" :index="index" @click="click"
				@open="open" :options="options">
				<view class="body">
					<view class="body_hand">
						{{item.type}}
					</view>
					<view class="body_body" v-if="ifCharA(item.path)">
						您购买的权益{{item.type}}（{{item.content}}）仅剩一个月到期，请您尽快续费
					</view>
					<view class="body_body" v-if="ifCharB(item.path)">
						您购买的权益{{item.type}}（{{item.content}}）仅剩一个月到期，请您尽快续费
					</view>
					<view class="body_body" v-if="ifCharC(item.path)">
						您购买的权益{{item.path=="C1"?"财务":(item.path=="C3")?"合伙人":"员工"}}帐号仅剩一个月到期，请您尽快续费
					</view>
					<view class="body_end" @click="jump(item)">
						<view class="title">
							立即续费
						</view>
						<view class="icon">
							<u-icon name="arrow-right" color="#b7b7b7" size="28"></u-icon>
						</view>
					</view>
				</view>
			</u-swipe-action>
		</view>
		<!-- </u-swipe-action> -->


	</view>
</template>

<script>
	export default {
		data() {
			return {
				renewInformList: [],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#ff6e55'
					}
				}]
			}
		},
		onShow() {
			this.getRenewInformList()
		},
		methods: {
			ifCharA(char) {
				return char.includes('A');
			},
			ifCharB(char) {
				return char.includes('B');
			},
			ifCharC(char) {
				return char.includes('C');
			},
			click(index, index1) {
				if (index1 == 0) {
					this.del(this.renewInformList[index])
					this.renewInformList.splice(index, 1);
				}
			},
			del(item) {
				this.$api.inform.deleteInformItem(item).then(res => {
					var del = res.data.data;
					console.log(del);
					this.$u.toast(`删除成功`);
					var count = Number(this.$u.getPinia('global.tabbar.2.count'));
					if (count > 0) {
						this.$u.setPinia({
							global: {
								tabbar: [
									{},
									{},
									{
										count: count-1
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
					setTimeout(function() {
						let result = that.renewInformList.length == 0;
						if (result) {
							uni.navigateBack()
						}
					}, 500)

				}).catch(res => {
					this.$u.toast(this.message)
				})

			},
			open(index) {
				this.renewInformList[index].show = true;
				this.renewInformList.map((val, idx) => {
					if (index != idx) this.renewInformList[idx].show = false;
				})
			},
			jump(item) {
				uni.navigateTo({
					url: "/pages/subPack/user/my_order/my_order"
				})
			},
			fjTime(isoString) {
				const date = new Date(isoString);
				const dayOfWeek = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][date.getDay()];
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const dayOfMonth = String(date.getDate()).padStart(2, '0');
				const hours = String(date.getHours()).padStart(2, '0');
				const minutes = String(date.getMinutes()).padStart(2, '0');
				const fullYear = date.getFullYear();

				var timIf = this.isInCurrentWeek(isoString);
				if (timIf) {
					return `${dayOfWeek} ${hours}:${minutes}`;
				} else {
					return `${fullYear}-${month}-${dayOfMonth}`;
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
			getRenewInformList() {
				var dx = {
					state: "1",
					phone: this.vuex_user.phone
				}
				this.$api.inform.refreshInformStatus(dx).then(res => {
					this.renewInformList = res.data.data.map(obj => ({
						...obj,
						show: false
					}));
					console.log("续费通知：", this.renewInformList);
				}).catch(res => {
					this.$u.toast(this.message)
				})
			}
		}
	}
</script>

<style lang="scss">
	.c {
		width: 100vw;
		height: 100vh;
		overflow-y: auto;
		// padding: 24px;

		.card {
			height: 23vh;
			// width: 100%;

			margin-left: 24rpx;
			margin-right: 24rpx;
			// background-color: #01BB74;
			// padding-top: 15px;

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
				height: 20vh;
				// padding: 8px;
				padding-left: 24rpx;
				padding-right: 24rpx;
				padding-top: 24rpx;

				position: relative;

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
				}

				.body_end {
					position: absolute;
					bottom: 0;
					display: flex;
					flex-direction: row;
					justify-content: left;
					align-items: center;
					height: 5vh;
					width: 94%;
					// background-color: #01BB74;
					border-top: 1px solid #F4F4F4;
					left: 3%;

					.title {
						position: absolute;
						color: #01BB74;
						left: 0;
					}

					.icon {
						position: absolute;
						right: -4px;
					}
				}
			}
		}
	}
</style>