<template>
	<view style="width: 100vw; height: 100vh">
		<u-popup :show="shoppingTrolley" mode="bottom">
			<u-swipe-action>
				<u-swipe-action-item :show="item.show" :name="index" v-for="(item, index) in list" :key="item.id" @click="delclick" :options="options">
					<view class="item u-border-bottom">
						<image mode="aspectFill" :src="item.images" />
						<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
						<view class="title-wrap">
							<text class="title u-line-2">{{ item.title }}</text>
						</view>
					</view>
				</u-swipe-action-item>
			</u-swipe-action>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [
				{
					id: 1,
					title: '长安回望绣成堆，山顶千门次第开，一骑红尘妃子笑，无人知是荔枝来',
					images: 'https://cdn.uviewui.com/uview/common/logo.png',
					show: false
				},
				{
					id: 2,
					title: '新丰绿树起黄埃，数骑渔阳探使回，霓裳一曲千峰上，舞破中原始下来',
					images: 'https://cdn.uviewui.com/uview/common/logo.png',
					show: false
				},
				{
					id: 3,
					title: '登临送目，正故国晚秋，天气初肃。千里澄江似练，翠峰如簇',
					images: 'https://cdn.uviewui.com/uview/common/logo.png',
					show: false
				}
			],
			disabled: false,
			btnWidth: 180,
			show: false,
			options: [
				{
					text: '收藏',
					style: {
						backgroundColor: '#007aff'
					}
				},
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			],
			shoppingTrolley: true
		};
	},
	methods: {
		delclick(item) {
			if (item.index == 1) {
				this.list.splice(item.name, 1);
				this.$u.toast(`删除了第${item.name}个cell`);
			} else {
				this.list[item.name].show = false;
				this.$u.toast(`收藏成功`);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.item {
	display: flex;
	padding: 20rpx;
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
	font-size: 28rpx;
	color: $u-content-color;
	margin-top: 20rpx;
}
</style>
