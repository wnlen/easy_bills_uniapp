<template>
	<view class="content">
		<view class="">
			<web-view :src="wzurl" :fullscreen="false"></web-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: "",
				webviewStyles: {
					progress: {
						fontSize: "24px"
					}
				},
				webView: false,
				wzurl: "https://mp.weixin.qq.com/s?__biz=MzkxNjcyNTQwNw==&mid=2247483753&idx=1&sn=43290d7c375eb6a2372426a2f8d9cadc&chksm=c14aca99f63d438f5550abf444487fd63657e703b850b0d941e451a5ef5f5a8c5c1977295a61#rd",
			}
		},
		onLoad(option) {
			this.getGZHUrl();
			this.authorization();
		},
		methods: {
			getGZHUrl(){
				this.$u.post('edo/gzh/article').then(res => {
					this.wzurl=res.data.data.path
				});
			},
			authorization() {
				// 验证是否成功
				var dx = {
					phoneNumber: this.vuex_user.phone
				}
				var that = this;
				this.$u.post('edo/gzh/v1/verificationCode', dx).then(res => {
					console.log("结果", res.data.data);
					var resGzh = res.data.data;
					if (resGzh!="1") {
						uni.navigateTo({
							url: "/pages/subUser/OfficialAccounts/OfficialBack"
						})
					}
				});

			},
			message(e) {},
			bindload(e) {
				//验证是否成功
				// var dx = {
				// 	phoneNumber: this.vuex_user.phone
				// }
				// var that = this;
				// this.$u.post('edo/gzh/v1/verificationCode', dx).then(res => {
				// 	console.log("结果", res.data.data);
				// 	var resGzh = res.data.data;
				// 	uni.navigateTo({
				// 		url: "/pages/subUser/OfficialAccounts/OfficialBack"
				// 	})
				// });
			},
			binderror(e) {}
		},
	}
</script>

<style>
	.content {
		width: 100vw;
		height: 100vh;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>