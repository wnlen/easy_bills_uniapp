<template>
	<!-- <view> -->
	<!-- 自定义tab -->
	<up-tabbar :value="tabIndex" activeColor="#01BB74" @change="changeTab" :placeholder="true" :fixed="true" :safeAreaInsetBottom="true">
		<up-tabbar-item :text="item.text" v-for="(item, index) in tabbar" :key="index" :badge="index == 2 ? messNum : 0" badgeStyle="background-color:#FA5151;">
			<template #active-icon>
				<up-icon size="40rpx" :name="item.selectedIconPath"></up-icon>
			</template>
			<template #inactive-icon>
				<view :id="index == 1 ? 'box4' : ''">
					<up-icon size="40rpx" :name="item.iconPath"></up-icon>
				</view>
			</template>
		</up-tabbar-item>
	</up-tabbar>
	<!-- </view> -->
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
			tabbar: [],
			messNum: 0,
			isDsabled: false
		};
	},
	created() {
		this.tabbar = this.$u.getPinia('global.tabbar');
	},
	methods: {
		getMessNum() {
			if (this.isDsabled) {
				return;
			}
			this.isDsabled = true;
			this.messNum = 0;
			if (this.$u.getPinia('user.token')) {
				var dx = {
					boss: this.pinia_user.data.work == '1' ? this.pinia_user.workData.bossNumber : this.pinia_user.phone,
					staff: this.pinia_user.phone,
					work: this.pinia_user.data.work
				};
				uni.$api.inform
					.getAllMessages(dx)
					.then((res) => {
						res.data.data.forEach((el) => {
							this.messNum += el;
						});
						this.isDsabled = false;
					})
					.catch((err) => {
						this.isDsabled = false;
					});
			}
		},
		changeTab(e) {
			if (e == 1) {
				uni.$emit('switchTabToList');
			}
			uni.switchTab({
				url: this.tabbar[e].pagePath,
				success: () => {}
			});
			if (e != 2) {
				this.getMessNum();
			}
		}
	}
};
</script>

<style lang="scss"></style>
