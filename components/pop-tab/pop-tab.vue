<template>
	<view>
		<!-- 自定义tab -->
		<u-tabbar :value="tabIndex" activeColor="#01BB74" @change="changeTab">
			<up-tabbar-item :text="item.text" v-for="(item, index) in tabbar" :key="index">
				<template #active-icon>
					<image style="width: 40rpx; height: 40rpx" class="u-page__item__slot-icon" :src="item.selectedIconPath"></image>
				</template>
				<template #inactive-icon>
					<image :id="index == 1 ? 'box4' : ''" style="width: 40rpx; height: 40rpx" class="u-page__item__slot-icon" :src="item.iconPath"></image>
				</template>
			</up-tabbar-item>
		</u-tabbar>
	</view>
</template>

<script>
export default {
	name: 'uni-tab',
	props: {
		tabIndex: {
			type: Number, // 设置数据类型为 Number
			default: 0 // 设置默认值
		}
	},
	data() {
		return {
			tabbar: []
		};
	},
	created() {
		console.log('底部导航', this.$u.getPinia('global.tabbar'));
		this.tabbar = this.$u.getPinia('global.tabbar');
	},
	methods: {
		changeTab(e) {
			uni.switchTab({
				url: this.tabbar[e].pagePath
			});
		}
	}
};
</script>

<style></style>
