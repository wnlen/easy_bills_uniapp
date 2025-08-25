<template>
	<view class="fixed-bar-height">
		<view class="flex-col items-center pt100">
			<image class="logo" src="@/static/icon/appMain.png" mode="widthFix"></image>
			<view class="ml48 mr48 mt60">
				<text class="ft29 ft-lighgray">{{ infos.aboutIntroduction }}</text>
			</view>
		</view>

		<view class="ml48 mr48 mt40 flex-col">
			<view class="flex-row justify-between items-center u-border-top u-border-bottom pt20 pb20">
				<text class="ft29">联系号码</text>
				<view class="ft29 flex-row items-center" @click="qiyeAuth(infos.contactPhoneNumber)">
					<text class="mr10">{{ infos.contactPhoneNumber }}</text>
					<u-icon name="arrow-right" color="#ddd"></u-icon>
				</view>
			</view>
			<view class="flex-row justify-between items-center u-border-bottom pt20 pb20">
				<text class="ft29">公司地址</text>
				<view class="ft29 flex-row items-center flex-1 pl48">
					<text class="flex-1 pr10 pl30">{{ infos.companyAddress }}</text>
					<u-icon name="arrow-right" color="#ddd"></u-icon>
				</view>
			</view>
		</view>

		<view class="fixed-bar flex-col justify-center items-center pb20">
			<view class="mb20 ft25">
				<text @tap="goPath('/pages/user/agreement')">《用户协议》</text>
				<text class="ft-lighgray">和</text>
				<text @tap="goPath('/pages/user/privacy')">《隐私权保护声明》</text>
			</view>
			<view class="ft22 flex-col justify-center items-center ft-lighgray">
				<text>Copyright@2023 易单据</text>
				<text>All Rights Reserved.</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			infos: {}
		};
	},
	onShow() {
		uni.$api.config.queryProgramConfig().then((res) => {
			this.infos = res;
		});
	},
	methods: {
		qiyeAuth(phone) {
			uni.makePhoneCall({
				phoneNumber: phone
			});
		}
	}
};
</script>

<style lang="scss">
.logo {
	height: 215rpx;
	width: 256rpx;
}
</style>
