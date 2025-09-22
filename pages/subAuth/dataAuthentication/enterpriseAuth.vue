<template>
	<view class="pt30 pl24 pr24 page-bg pb150">
		<view class="bg-white radius12 pl24 pb48 mb30">
			<view class="title">组织类型</view>
			<view class="flex-row items-center titleBox">
				<text :class="actBtn == 0 ? 'actBtn' : ''" @click="actBtn = 0">企业</text>
				<text :class="actBtn == 1 ? 'actBtn' : ''" @click="actBtn = 1">个体工商户</text>
			</view>
			<view class="title title1">认证方式</view>
			<view class="titleBox flex-row items-center">
				<text class="actBtn">法定代表人</text>
			</view>
		</view>
		<view class="bg-white radius12 pb48 mb36">
			<view class="pl24">
				<view class="pt36 pb15 ft30">营业执照</view>
				<view class="ft-lightgray ft24 mb24">请上传彩色原件或加盖公司公章的复印件</view>
				<wd-upload auto-upload v-model:file-list="fileList1" image-mode="aspectFill" :action="action"></wd-upload>
			</view>
			<view class="pr24">
				<wd-form ref="form" :model="model">
					<wd-cell-group border>
						<wd-input
							label="组织名称"
							placeholder="请输入组织名称"
							:rules="[{ required: true, message: '请输入组织名称' }]"
							label-width="230rpx"
							clearable
							prop="value1"
							v-model="model.value1"
						/>
						<wd-input
							label="统一社会信用代码"
							label-width="230rpx"
							prop="value2"
							clearable
							v-model="model.value2"
							placeholder="请输入统一社会信用代码"
							:rules="[{ required: true, message: '请输入统一社会信用代码' }]"
						/>
						<wd-input
							v-if="actBtn == 1"
							label="经营者"
							label-width="230rpx"
							prop="value2"
							clearable
							type="idcard"
							v-model="model.value2"
							placeholder="请输入经营者"
							:rules="[{ required: true, message: '请输入经营者' }]"
						/>
						<wd-input
							v-else
							label="法定代表人"
							label-width="230rpx"
							prop="value2"
							clearable
							type="idcard"
							v-model="model.value2"
							placeholder="请输入法定代表人"
							:rules="[{ required: true, message: '请输入法定代表人' }]"
						/>
					</wd-cell-group>
				</wd-form>
			</view>

			<view class="flex-row justify-center mb36">
				<wd-checkbox v-model="value" checked-color="#01bb74">
					<text>我已阅读并同意</text>
					<text class="ft-green" @click.stop="">《隐私政策》</text>
					<text class="ft-green" @click.stop="">《数字证书使用协议》</text>
				</wd-checkbox>
			</view>
		</view>
		<view class="subBtn" @click="handleSubmit">提交</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			actBtn: 0,
			fileList1: [],
			value: false,
			model: {
				value1: '',
				value2: ''
			}
		};
	},
	methods: {
		handleSubmit() {
			this.$refs.form.validate().then(({ valid, errors }) => {
				console.log(valid, errors);
				if (valid) {
					console.log('验证成功');
					uni.navigateTo({
						url: '/pages/subUser/invoice/invoiceSucess?type=3'
					});
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
::v-depp .wd-input,
::v-depp .uni-input-input {
	text-align: right !important;
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
	position: fixed;
	left: 24rpx;
	bottom: 40rpx;
}
::v-deep .wd-checkbox__label,
::v-deep .wd-checkbox__check {
	font-size: 24rpx !important;
}
.title {
	padding: 36rpx 0 32rpx;
	font-size: 30rpx;
}
.title1 {
	padding-top: 46rpx !important;
}
.titleBox > text {
	min-width: 93px;
	border-radius: 5px;
	padding: 12rpx 30rpx;
	box-sizing: border-box;
	border: 1rpx solid #cccccc;
	font-size: 26rpx;
	text-align: center;
	margin-right: 40rpx;
	&.actBtn {
		color: #01bb74;
		border: 1rpx solid #01bb74;
		background: #f7fdfa;
	}
}
</style>
