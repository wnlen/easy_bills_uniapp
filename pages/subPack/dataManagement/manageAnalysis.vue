<template>
	<view>
		<data-analysis ref="dataAnalysis" :showCalendar="showCalendar"></data-analysis>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showCalendar: true
		};
	},
	onLoad() {
		this.$nextTick(() => {
			this.$refs.dataAnalysis.getServerData();
		});
	},
	methods: {}
};
</script>

<style></style>
