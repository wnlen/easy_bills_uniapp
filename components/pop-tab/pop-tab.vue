<template>
	<view>
		<!-- 自定义tab -->
		<u-tabbar :value="tabIndex" activeColor="#01BB74" @change="changeTab">
			<u-tabbar-item :text="item.text" v-for="(item, index) in tabbar" :key="index" :badge="index == 2 ? messNum : 0">
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
			tabbar: [],
			messNum: 0
		};
	},
	created() {
		this.tabbar = this.$u.getPinia('global.tabbar');
		this.getMessNum();
	},
	methods: {
		getMessNum() {
			this.messNum = 0;
			if (this.$u.getPinia('user.token')) {
				var dx = {
					boss: this.pinia_user.data.work == '1' ? this.pinia_user.workData.bossNumber : this.pinia_user.phone,
					staff: this.pinia_user.phone,
					work: this.pinia_user.data.work
				};
				this.$api.inform
					.getAllMessages(dx)
					.then((res) => {
						res.data.data.forEach((el) => {
							this.messNum += el;
						});
					})
					.catch((res) => {
						this.$u.toast(this.message);
					});
			}
		},
		changeTab(e) {
			uni.switchTab({
				url: this.tabbar[e].pagePath
			});
			this.getMessNum();
		}
	}
};
</script>

<style lang="scss">
::v-deep .u-badge--error {
	transform: translateY(-20rpx);
	background-color: #e52829 !important;
}
</style>
