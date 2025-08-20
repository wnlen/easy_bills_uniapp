<template>
	<view class="" style="width: 100%; height: 10vh">
		<view class="anchor-text" style="width: 90%; text-align: center; background-color: #ffffff; margin-left: 5%; height: 7vh">
			<view class="mt18" style="margin-left: 40rpx; border-radius: 12.24rpx; display: flex; flex-direction: row; width: 90%; border-radius: 12.24rpx">
				<view class="flex-row justify-center" style="width: 95%; border-radius: 12.24rpx; background-color: #f8f8f8">
					<view class="flex-col justify-center" style="width: 5%; height: 100%; height: 5vh">
						<view class="mr10"><u-icon name="search" color="#01BB74" size="30rpx"></u-icon></view>
					</view>
					<view class="ml20" style="width: 90%; height: 100%">
						<u-input border="none"></u-input>
					</view>
				</view>

				<view class="ml10 flex-col justify-center" style="width: 5%; height: 5vh">
					<view class="ml10">
						<u-icon name="https://res-oss.elist.com.cn/wxImg/order/add.png" color="#01BB74" size="50"></u-icon>
					</view>
				</view>
			</view>
		</view>

		<u-index-list :scrollTop="scrollTop">
			<view class="ml48" v-for="(item2, index2) in list" :key="index2" @click="jump()" style="border-bottom: 2rpx solid #f7f7f7; width: 110vw">
				<u-collapse arrow-color="#ffffff">
					<u-collapse-item :title="item2" arrow="false" @change="jump(item2)"></u-collapse-item>
				</u-collapse>
			</view>
		</u-index-list>
	</view>
</template>
<script>
export default {
	data() {
		return {
			scrollTop: 0,
			indexList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
			list: []
		};
	},
	onShow() {
		if (this.pinia_userRole == 'R') {
			uni.setNavigationBarTitle({
				title: '供应商',
				success: function () {
					// 标题设置成功
				}
			});
		}

		this.$api.user.getMyOrderList(this.queryObj).then((res) => {
			var listName = [];
			for (let key in res) {
				listName.push(res[key].orderReceiving.customerName);
			}
			this.list = [...new Set(listName)];
			console.log(this.list);
		});
	},
	methods: {
		jump(e) {
			console.log('点击了', e);
			uni.setStorageSync('companyName', e);
			uni.navigateBack();
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	}
};
</script>
<style lang="scss" scoped>
.list-cell {
	display: flex;
	box-sizing: border-box;
	width: 100%;
	padding: 20rpx 24rpx;
	overflow: hidden;
	color: #323233;
	font-size: 28rpx;
	line-height: 48rpx;
	background-color: #fff;
}

.anchor-text {
	color: red;
}

.custom-style {
	// width: 13%;
	border-radius: 24rpx;
	text-align: center;
}
</style>
