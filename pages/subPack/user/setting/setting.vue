<template>
	<view class="card flex-row bg-white mt25 ml30 mr30" style="border-radius: 12px; width: 92vw; height: auto">
		<up-cell-group :border="false" style="width: 100%">
			<up-cell title="检查更新" :arrow="false" arrow-direction="right" @click="menuClick(1)" border-bottom>
				<text slot="right-icon" class="ft-lightgray">已经是最新版本</text>
			</up-cell>
			<up-cell title="接受消息提醒" :arrow="false" arrow-direction="right" @click="menuClick(2)" border-bottom>
				<up-switch v-model="checked1" active-color="#01BB74"></up-switch>
			</up-cell>
			<up-cell title="个性化服务推荐" :arrow="false" arrow-direction="right" @click="menuClick(3)" border-bottom>
				<up-switch v-model="checked2" active-color="#01BB74"></up-switch>
			</up-cell>
			<up-cell title="关于我们" :isLink="true" arrow-direction="right" @click="menuClick(4)" border-bottom></up-cell>
		</up-cell-group>
	</view>
</template>

<script>
export default {
	data() {
		return {
			checked1: false,
			checked2: true,
			menus: [
				{
					name: '认证',
					icon: '/static/img/user/rz.svg',
					url: '/pages/auth/auth'
				},
				{
					name: '操作手册',
					icon: '/static/img/user/wh.svg',
					url: 'https://upbill.cn/tutorial/index.html'
				},
				{
					name: '系统设置',
					icon: '/static/img/user/setting.svg',
					url: '/pages/user/setting/setting'
				},
				{
					name: '打印机配置',
					icon: '/static/img/user/dyj.svg',
					url: ''
				},
				{
					name: '账号管理',
					icon: '/static/img/user/suo.svg',
					url: ''
				}
			]
		};
	},
	methods: {
		menuClick(i) {}
	}
};
</script>

<style scoped lang="scss">
.u-card-wrap {
	background-color: $u-bg-color;
	padding: 1px;
}

.u-body-item {
	font-size: 32rpx;
	color: #333;
	padding: 20rpx 10rpx;
}

.u-body-item image {
	width: 120rpx;
	flex: 0 0 120rpx;
	height: 120rpx;
	border-radius: 8rpx;
	margin-left: 12rpx;
}
</style>