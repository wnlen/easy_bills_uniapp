<template>
	<view class="viewTabbar">
		<!-- 自定义tab -->
		<u-tabbar :value="tabIndex" activeColor="#01BB74" @change="changeTab" :placeholder="true" :fixed="true" :safeAreaInsetBottom="true">
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
			messNum: 0,
			isDsabled: false
		};
	},
	created() {
		this.tabbar = this.$u.getPinia('global.tabbar');
		this.getMessNum();
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
			console.log(e);
			uni.switchTab({
				url: this.tabbar[e].pagePath
			});
			if (e != 2) {
				this.getMessNum();
			}
		}
	}
};
</script>

<style lang="scss">
::v-deep .u-badge--error {
	transform: translateY(-20rpx);
	background-color: #e52829 !important;
}
.viewTabbar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
}
</style>
