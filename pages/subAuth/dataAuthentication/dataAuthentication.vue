<template>
	<view class="vh100 attestation" :style="{ backgroundImage: 'url(' + ImgUrl + '/wxImg/user/back.svg' + ')' }">
		<up-navbar
			:autoBack="true"
			:placeholder="true"
			:border-bottom="false"
			back-icon-color="#000000"
			:titleBold="true"
			title-color="#000000"
			title="资料认证"
			title-size="34"
			bgColor="transparent"
		></up-navbar>
		<view class="content">
			<view class="">
				<view class="title">个人资料</view>
				<view class="content1">
					<view
						class="flex-row justify-between items-center pt36 pb36 border-bottom"
						@click="
							uni.navigateTo({
								url: '/pages/subUser/userinfo'
							})
						"
					>
						<view class="flex-row items-start">
							<image src="https://res-oss.elist.com.cn/app/img/grxx.svg" class="smallImg"></image>
							<view class="flex-col">
								<text class="ft30">个人信息</text>
								<text class="ft-lightgray mt10 ft24">普通开单，无法律效益</text>
							</view>
						</view>
						<wd-icon name="arrow-right" size="30rpx" color="#CDCABA"></wd-icon>
					</view>
					<view class="flex-row justify-between items-center pt36 pb36">
						<view class="flex-row items-start">
							<image src="https://res-oss.elist.com.cn/app/img/grsmrz.svg" class="smallImg"></image>
							<view class="flex-col">
								<text class="ft30">个人实名</text>
								<text class="ft-lightgray mt10 tisp ft24">配合法律签署包使用</text>
							</view>
						</view>
						<view
							class="flex-row items-center justify-center toBtn"
							@click="
								uni.navigateTo({
									url: '/pages/subAuth/dataAuthentication/personalAuth'
								})
							"
						>
							<text>去实名</text>
							<wd-icon name="arrow-right" size="20rpx" color="#fff"></wd-icon>
						</view>
						<!-- <view class="ft-green">已实名✓</view> -->
					</view>
				</view>
			</view>
			<view class="">
				<view class="title">公司资料</view>
				<view class="content1">
					<view class="flex-row justify-between items-center pt36 pb36 border-bottom" @click="jump">
						<view class="flex-row items-start">
							<image src="https://res-oss.elist.com.cn/app/img/gsxx.svg" class="smallImg"></image>
							<view class="flex-col">
								<text class="ft30">公司信息</text>
								<text class="ft-lightgray mt10 ft24">普通开单，无法律效益</text>
							</view>
						</view>
						<wd-icon name="arrow-right" size="30rpx" color="#CDCABA"></wd-icon>
					</view>
					<view class="flex-row justify-between items-center pt36 pb36">
						<view class="flex-row items-start">
							<image src="https://res-oss.elist.com.cn/app/img/qyrz.svg" class="smallImg"></image>
							<view class="flex-col">
								<text class="ft30">企业认证</text>
								<text class="ft-lightgray mt10 tisp ft24">配合法律签署包使用</text>
							</view>
						</view>
						<view
							class="flex-row items-center justify-center toBtn"
							@click="
								uni.navigateTo({
									url: '/pages/subAuth/dataAuthentication/enterpriseAuth'
								})
							"
						>
							<text>去认证</text>
							<wd-icon name="arrow-right" size="20rpx" color="#fff"></wd-icon>
						</view>
						<!-- <view class="ft-green">已认证✓</view> -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		jump() {}
	}
};
</script>

<style lang="scss" scoped>
.attestation {
	background-size: cover;
}
.content {
	padding: 6rpx 24rpx 0;
	position: absolute;
	left: 24rpx;
	bottom: 40rpx;
	width: 701rpx;
	min-height: 64vh;
	border-radius: 12rpx;
	background: #ffffff;
	.title {
		font-size: 32rpx;
		font-weight: 500;
		padding: 40rpx 0;
	}
	.smallImg {
		width: 32rpx;
		height: 26rpx;
		margin-top: 8rpx;
		margin-right: 10rpx;
	}
	.tisp {
		color: #de843c;
	}
	.content1 {
		padding: 0 32rpx;
		border-radius: 12rpx;
		background: #fffef9;
		box-shadow: 0px 1px 3px 0px rgba(205, 202, 186, 0.3);
		margin-bottom: 20rpx;
		.toBtn {
			width: 138rpx;
			height: 56rpx;
			border-radius: 629rpx;
			background: linear-gradient(90deg, #ea943d 0%, #fbb451 59%, #ffe367 118%);
			font-size: 26rpx;
			font-weight: 500;
			color: #fff;
		}
	}
}
</style>
