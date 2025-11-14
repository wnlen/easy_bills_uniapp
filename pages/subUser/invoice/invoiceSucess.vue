<template>
	<view class="content">
		<up-navbar
			:placeholder="true"
			@leftClick="jump"
			:border-bottom="false"
			:titleBold="true"
			title-color="#000000"
			:title="type == 1 ? '发票审核' : type == 2 ? '实名认证审核' : type == 3 ? '企业认证审核' : ''"
			title-size="34"
			bgColor="#ffffff"
		></up-navbar>
		<view class="w100 box" v-if="type == 4">
			<view class="mb36">
				<wd-icon name="https://res-oss.elist.com.cn/wxImg/commodity/xdcg.svg" size="240rpx"></wd-icon>
			</view>
			<view class="success1">下单成功！</view>
			<view class="ts mt10 flex-col justify-center">
				<text>供应商将快马加鞭为您开送货单，</text>
				<text>请您到货后进行货品签收~</text>
			</view>
			<view class="backBtn" @click="jump">继续下单</view>
		</view>
		<view class="w100 box" v-else>
			<view class="mb36">
				<wd-icon name="https://res-oss.elist.com.cn/wxImg/user/invoic.png" size="200rpx"></wd-icon>
			</view>
			<view class="success">申请提交成功</view>
			<view class="ts mt10 flex-col justify-center">
				<text v-if="type == 1">发票正在审核中，工作人员将</text>
				<text v-else-if="type == 2">实名认证正在审核中，工作人员将</text>
				<text v-else>企业认证正在审核中，工作人员将</text>
				<text>会在三个工作日内审核您的提交</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			type: 1 //1.发票审核 2.个人认证，3.企业认证，4商城下单成功
		};
	},
	onLoad(e) {
		this.type = e.type;
	},
	methods: {
		jump() {
			if (this.type == 4) {
				uni.navigateBack({
					delta: 1 // 返回的页面数，默认为1（上一级）
				});
				return;
			}
			uni.navigateBack({
				delta: 2 // 返回的页面数，默认为1（上一级）
			});
		}
	}
};
</script>

<style>
.content {
	background-color: white;
	width: 100vw;
	height: 80vh;
}

.box {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 50%;
	margin-top: 10vh;
}

.success {
	font-size: 32rpx;
	color: #333333;
	font-weight: 500;
}
.success1 {
	font-size: 36rpx;
}
.ts {
	width: 100%;
	font-family: Source Han Sans;
	font-size: 32rpx;
	font-weight: normal;
	line-height: 48rpx;
	text-align: center;
	letter-spacing: 0px;

	font-variation-settings: 'opsz' auto;
	font-feature-settings: 'kern' on;
	color: #aaaaaa;
}
.backBtn {
	width: 300rpx;
	height: 76rpx;
	border-radius: 376rpx;
	background: #ecfff9;
	border: 1px solid #01bb74;
	font-size: 32rpx;
	font-weight: 500;
	color: #01bb74;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 106rpx;
}
</style>
