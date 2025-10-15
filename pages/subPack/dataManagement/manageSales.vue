<template>
	<view>
		<sales-ranking-list :isEmpty="isEmpty" :showCharts="showCharts"></sales-ranking-list>
		<up-empty
			v-if="isEmpty"
			icon="https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/role/dbsx.svg"
			iconSize="400rpx"
			:text="`暂无销售数据~`"
			marginTop="340rpx"
		></up-empty>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showCharts: false,
			isEmpty: false
		};
	},
	methods: {}
};
</script>

<style></style>
