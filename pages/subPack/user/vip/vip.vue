<template>
	<view>
		<view @click="play">支付</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		play() {
			uni.$api.pay
				.buyVip({})
				.then((res) => {
					console.log(res.data.data);
					this.playWX(res.data.data);
				})
				.catch((res) => {});
		},
		playWX(wx) {
			uni.requestPayment({
				provider: 'wxpay',
				timeStamp: wx.timeStamp, // 字符串，时间戳，从1970年1月1日00:00:00至今的秒数,即当前的时间(String)
				nonceStr: wx.nonceStr, // 字符串，随机串，长度要求在32位内
				package: wx.packageStr, // 字符串，统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=***）
				signType: wx.signType, // 字符串，签名方式：MD5/HMAC-SHA256
				paySign: wx.paySign, // 字符串，签名，见附录-JS-SDK使用权限签名算法
				success: function (res) {
					// 支付成功后的回调函数
					console.log(res);
				},
				fail: function (err) {
					// 支付失败后的回调函数
				}
			});
		}
	}
};
</script>

<style></style>
