<template>
	<view class="content">
		<web-view :src="wzurl" @load="bindload" @error="binderror"></web-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			state: 9,
			wzurl: ''
		};
	},
	onLoad(option) {
		const appid = 'wxde4ec376ffacd0a8';
		const redirect_uri = encodeURIComponent('https://wxapi.elist.com.cn/edo/gzh/v1/setRedirect');
		const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=${this.pinia_user.phone}#wechat_redirect`;
		this.wzurl = url;
	},
	methods: {
		bindload(e) {
			// 验证是否成功
			var dx = {
				phoneNumber: this.pinia_user.phone
			};
			var that = this;
			uni.$api.gzh.getGzhVerificationCode(dx).then((res) => {
				console.log('结果', res.data.data);
				var resGzh = res.data.data;
				if (resGzh == '1') {
					uni.navigateBack();
				}
			});
		},
		binderror(e) {}
	}
};
</script>

<style scoped>
.content {
	width: 100vw;
	height: 100vh;
	background-color: antiquewhite;
}
</style>
