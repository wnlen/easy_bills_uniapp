<template>
	<view v-show="authShow" class="flex-col justify-center items-center pop-wrap">
		<view
			class="radius flex-col justify-center items-center relative"
			style="height: 488rpx; background: url('https://res-oss.elist.com.cn/wxImg/order/wskdxx.png') no-repeat; background-size: 100% 100%; width: 540rpx; margin-top: 400rpx"
		>
			<view class="absolute" style="right: 0; top: 10rpx">
				<up-icon @click="close" name="https://res-oss.elist.com.cn/wxImg/order/cha.png" size="40rpx"></up-icon>
			</view>

			<view class="flex-col justify-center items-center absolute" style="bottom: 30rpx">
				<!-- <view class="color">完善开单信息</view> -->
				<view class="title ml60 mr60 mb20">您还未填写公司信息，为保证单据信息的完整性，请您填写信息</view>

				<view
					class="flex-col justify-center items-center mt20"
					style="
						background: url(https://res-oss.elist.com.cn/wxImg/order/wskdxx-btn.png) no-repeat;
						background-size: 100% 100%;
						width: 360rpx;
						height: 100rpx;
						color: #ffffff;
						font-size: 30rpx;
						font-weight: bold;
						line-height: normal;
						letter-spacing: 0em;
						box-sizing: border-box;
						padding-bottom: 10rpx;
					"
					@click="jump"
				>
					立即完善
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'pop-auth',
	data() {
		return {
			authShow: false
		};
	},
	methods: {
		// popClose() {
		// 	this.authShow=false;
		// },
		getiAuth() {},
		qiyeAuth() {
			const that = this;
		},
		jump() {
			uni.setStorageSync('auth', '1');
			uni.navigateTo({
				url: '/pages/subAuth/auth?open=1'
			});
		},
		close() {
			this.authShow = false;
			uni.setStorageSync('auth', '1');
		}
	}
};
</script>

<style lang="scss">
.pop-wrap {
	position: fixed;
	top: -440rpx;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 10000000000000;
	background: rgba(0, 0, 0, 0.5);
	opacity: 1;
	transition: all 0.5s ease;

	&.hides {
		opacity: 0;
	}
}

.color {
	color: #333333;
	font-size: 40rpx;
	font-weight: 500;
	line-height: normal;
	text-align: center;
	letter-spacing: 0em;
}

.title {
	font-family: Source Han Sans;
	font-size: 28rpx;
	font-weight: normal;
	line-height: normal;
	text-align: center;
	letter-spacing: 0em;
	// color: #999999;
}
</style>
