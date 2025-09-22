<template>
	<view class="content">
		<up-navbar
			:placeholder="true"
			@leftClick="jump"
			:border-bottom="false"
			:titleBold="true"
			title-color="#000000"
			:title="type == 1 ? '发票审核' : type == 2 ? '实名认证审核' : '企业认证审核'"
			title-size="34"
			bgColor="#ffffff"
		></up-navbar>
		<view class="w100 box">
			<view class="mb36">
				<up-icon name="https://res-oss.elist.com.cn/wxImg/user/invoic.png" size="200rpx"></up-icon>
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
			type: 1 //1.发票审核 2.个人认证，3.企业认证
		};
	},
	onLoad(e) {
		this.type = e.type;
	},
	methods: {
		jump() {
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
	font-size: 16px;
	color: #333333;
	font-weight: 500;
}

.ts {
	width: 100%;
	font-family: Source Han Sans;
	font-size: 16px;
	font-weight: normal;
	line-height: 24px;
	text-align: center;
	letter-spacing: 0px;

	font-variation-settings: 'opsz' auto;
	font-feature-settings: 'kern' on;
	color: #aaaaaa;
}
</style>
