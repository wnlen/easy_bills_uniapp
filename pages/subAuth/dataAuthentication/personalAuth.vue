<template>
	<view class="bg-white">
		<!-- 第一步 -->
		<view class="pd24" v-show="step == 0">
			<view class="flex-row justify-center">
				<image src="https://res-oss.elist.com.cn/app/img/grsmrzNext.svg" class="topimg"></image>
			</view>
			<view class="flex-col ft32 ft-500 pl24">
				<text class="line60">您正在进行个人认证,</text>
				<text class="line60">认证过程中将收集您的如下信息：</text>
			</view>
			<view class="custom-dot-list flex-col">
				<text class="mb10">姓名、证件号</text>
				<text class="">本人开户的手机号(仅手机号认证获取)</text>
			</view>
			<view class="flex-row justify-center mb36 mt120">
				<wd-checkbox v-model="value" checked-color="#01bb74">
					<text>我已阅读并同意</text>
					<text class="ft-green" @click.stop="">《隐私政策》</text>
					<text class="ft-green" @click.stop="">《数字证书使用协议》</text>
				</wd-checkbox>
			</view>
			<view class="subBtn" @click="step = 1">开始认证</view>
		</view>
		<!-- 第二步 -->
		<view class="" v-show="step == 1">
			<wd-form ref="form" :model="model">
				<wd-cell-group border>
					<wd-input label="认证方式" readonly label-width="168rpx" prop="value1" v-model="model.value1" />
					<wd-input
						label="姓名"
						label-width="168rpx"
						prop="value2"
						clearable
						v-model="model.value2"
						placeholder="请输入您的姓名"
						:rules="[{ required: true, message: '请输入您的姓名' }]"
					/>
					<wd-input
						label="证件号"
						label-width="168rpx"
						prop="value2"
						clearable
						type="idcard"
						suffix-icon="scan"
						v-model="model.value2"
						placeholder="请输入身份证号码"
						:rules="[{ required: true, message: '请输入身份证号码' }]"
						@clicksuffixicon="toscan"
					/>
					<wd-input label="手机号" custom-input-class="ft-green" readonly label-width="168rpx" v-model="model.phone" />
					<wd-input
						label="验证码"
						label-width="168rpx"
						prop="value2"
						clearable
						type="number"
						v-model="model.value2"
						placeholder="请输入验证码"
						:rules="[{ required: true, message: '请输入验证码' }]"
					>
						<template #suffix>
							<wd-count-down ref="countDown" style="display: none" :time="60 * 1000" :auto-start="false" @finish="codeFinish" @change="codeChange" />
							<text class="ft-green" @click="getCode">{{ tips }}</text>
						</template>
					</wd-input>
				</wd-cell-group>
				<view class="footer">
					<view class="subBtn subBtn1" @click="handleSubmit">提交</view>
				</view>
			</wd-form>
		</view>
		<!-- 安全提示 -->
		<view class="safe ft-lightgray flex-row items-center justify-center">
			<image src="https://res-oss.elist.com.cn/app/img/safe.svg"></image>
			<text class="ft24">信息安全保护中</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tips: '获取验证码',
			step: 0,
			value: false,
			model: {
				value1: '手机号认证',
				value2: '',
				phone: '138****9027'
			}
		};
	},
	methods: {
		codeFinish() {
			this.$refs.countDown.reset();
			this.tips = '重新获取';
		},
		codeChange(e) {
			this.tips = `${e.seconds}s后重新获取`;
		},
		getCode() {
			if (this.tips != '获取验证码' || this.tips != '重新获取') {
				this.$refs.countDown.start();
				// 获取验证码逻辑
			}
		},
		handleSubmit() {
			this.$refs.form.validate().then(({ valid, errors }) => {
				console.log(valid, errors);
				if (valid) {
					console.log('验证成功');
					uni.navigateTo({
						url: '/pages/subUser/invoice/invoiceSucess?type=2'
					});
				}
			});
		},
		toscan() {
			console.log('扫描身份证');
		}
	}
};
</script>

<style lang="scss" scoped>
.subBtn1 {
	position: fixed;
	left: 24rpx;
	bottom: 288rpx;
}
.subBtn {
	border-radius: 188px;
	background: #01bb74;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 36rpx;
	font-weight: bold;
	width: 700rpx;
	height: 104rpx;
	margin: 0 auto;
}
::v-deep .wd-checkbox__label,
::v-deep .wd-checkbox__check {
	font-size: 24rpx !important;
}
.topimg {
	width: 200rpx;
	height: 200rpx;
	margin: 130rpx 0 110rpx;
}
.custom-dot-list {
	border-radius: 12rpx;
	background: #f7fdfa;
	padding: 40rpx 0 40rpx 42rpx;
	margin-top: 40rpx;
	> text {
		line-height: 42rpx;
		padding-left: 30rpx;
		position: relative; /* 为伪元素定位 */
		&::before {
			content: '•'; /* 用圆点符号作为伪元素内容 */
			position: absolute; /* 绝对定位到列表项左侧 */
			top: -4rpx;
			left: 0rpx; /* 调整圆点位置 */
			color: #01bb74; /* 单独设置圆点颜色（绿色） */
			font-size: 20px; /* 圆点大小 */
		}
	}
}
.safe {
	position: fixed;
	width: 100%;
	bottom: 16rpx;
	left: 0;
	image {
		width: 32rpx;
		height: 32rpx;
		margin-right: 14rpx;
	}
}
</style>
