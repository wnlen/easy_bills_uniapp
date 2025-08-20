<template>
	<view>
		<!-- 自定义tab -->
		<u-tabbar :value="tabIndex" activeColor="#01BB74" @change="changeTab">
			<u-tabbar-item :text="item.text" v-for="(item, index) in tabbar" :key="index">
				<template #active-icon>
					<u-icon size="40rpx" :name="item.selectedIconPath"></u-icon>
				</template>
				<template #inactive-icon>
					<view :id="index == 1 ? 'box4' : ''">
						<u-icon size="40rpx" :name="item.iconPath"></u-icon>
					</view>
				</template>
			</u-tabbar-item>
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
