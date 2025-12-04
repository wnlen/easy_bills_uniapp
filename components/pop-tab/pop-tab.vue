<template>
	<!-- <view> -->
	<!-- 自定义tab -->
	<up-tabbar :value="tabIndex" activeColor="#01BB74" @change="changeTab" :placeholder="true" :fixed="true" :safeAreaInsetBottom="true">
		<up-tabbar-item :text="item.text" v-for="(item, index) in tabbar" :key="index" :badge="index == 2 ? messNum : 0" badgeStyle="background-color:#FA5151;">
			<template #active-icon>
				<image :src="item.selectedIconPath" v-if="tabIndex === index" :class="tabIndex === index ? 'uni-tabbar-icon' : ''"></image>
			</template>
			<template #inactive-icon>
				<view :id="index == 1 ? 'box4' : ''">
					<image :src="item.iconPath"></image>
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
					boss: this.pinia_user.work == '1' ? this.pinia_user.workData.bossNumber : this.pinia_user.phone,
					staff: this.pinia_user.phone,
					work: this.pinia_user.work
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
			// 1. 切换 Tab 页面（先跳转，再触发动画，避免页面切换卡顿）
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

<style scoped lang="scss">
image {
	width: 40rpx;
	height: 40rpx;
}
/* App.vue中全局样式 */
/* 找到TabBar图标的类名，不同平台类名可能不同 */
.uni-tabbar-icon {
	/* 核心动画：ease-out 时间曲线（先快后慢），duration 800ms（适中不急促） */
	animation: tabPulse 0.5s ease-out 1 forwards;
	-webkit-animation: tabPulse 0.5s ease-out 1 forwards; /* 适配 iOS/Android */
}

/* 动画关键帧：优化细节，更丝滑 */
@keyframes tabPulse {
	0% {
		transform: scale(1) translateY(0);
		opacity: 0.8; /* 初始略暗，增强过渡感 */
	}
	50% {
		transform: scale(1.2) translateY(-3px); /* 轻微上浮，更生动 */
		opacity: 1;
	}
	100% {
		transform: scale(1) translateY(0); /* 回归原位置，不残留偏移 */
		opacity: 1;
	}
}

/* 兼容webkit内核（iOS/部分Android） */
@-webkit-keyframes tabPulse {
	0% {
		transform: scale(1) translateY(0);
		opacity: 0.8;
	}
	50% {
		transform: scale(1.1) translateY(-3px);
		opacity: 1;
	}
	100% {
		transform: scale(1) translateY(0);
		opacity: 1;
	}
}
</style>
