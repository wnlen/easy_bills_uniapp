<template>
	<view class="content">
		<web-view style="width: 100%" :src="url"></web-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			url: ''
		};
	},
	onLoad(option) {
		console.log('地址：', option.url);
		this.url = option.url;
	},
	methods: {}
};
</script>

<style>
.content {
	width: 100vw;
	height: 100vh;
}
</style>
