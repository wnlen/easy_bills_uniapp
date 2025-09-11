<template>
	<view class="vh100 bg-gray">
		<view class="bg-white">
			<up-cell-group :border="false">
				<up-cell :titleStyle="{ color: '#666666' }" :title="item.name" v-for="(item, index) in num" :isLink="true" :key="index" @click="jump(item)">
					<text slot="right-icon" class="ft-lightgray"></text>
				</up-cell>
			</up-cell-group>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			num: [
				{
					name: '公众号通知授权',
					jump: '/pages/subUser/OfficialAccounts/OfficialAccounts',
					type: false
				},
				{
					name: '关于我们',
					jump: 'https://res-oss.elist.com.cn/notice/AboutUs-v1.htm',
					type: true
				}
			]
		};
	},
	methods: {
		jump(item) {
			if (item.type) {
				uni.navigateTo({
					url: '/pages/subUser/webpage?url=' + item.jump
				});
			} else {
				this.GZH();
			}
		},
		GZH() {
			uni.navigateTo({
				url: '/pages/subUser/OfficialAccounts/OfficialAccounts'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
::v-deep .u-line {
	border-color: #f4f4f4 !important;
}
</style>
