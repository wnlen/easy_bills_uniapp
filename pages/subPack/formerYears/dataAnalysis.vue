<template>
	<view class="content">
		<web-view :src="srcView"></web-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			srcView: ''
		};
	},
	mounted() {},
	onLoad(option) {
		var work = this.pinia_user.data.work != '0';
		var phone = this.pinia_user.phone;
		var port = this.pinia_userRole;
		console.log('!this.pinia_token', !this.pinia_token);
		console.log('phone', this.phone);
		console.log('port', port);
		console.log('option', option);
		var href = 'https://www.upbill.cn/echarts/statistics?phone=' + phone + '&year=' + option.year + '&port=' + port + '&token=' + !this.pinia_token;
		this.srcView = href;
		console.log(href);
	},
	methods: {}
};
</script>

<style lang="scss" scoped></style>
