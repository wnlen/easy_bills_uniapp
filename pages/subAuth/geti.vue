<template>
	<view class="flex-col justify-center ml15 mr15">
		<view class="ml24 mt30 mr24">
			<view class="" style="font-size: 20px;font-weight: bold;">
				请拍摄您身份证正面
			</view>
			<view class="" style="font-size:14px;color: #AAAAAA;">
				请保持身份证正面完整清晰
			</view>
			<view class="mt15">
				<u-image width="100%" mode="widthFix"
					:src="formData.front||'https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/geti/fromt.svg'"
					@click="imgUpdate(0)"></u-image>
			</view>

		</view>
		<view class="ml24 mt40 mr24">
			<view class="" style="font-size: 20px;font-weight: bold;">
				请拍摄您身份证正面
			</view>
			<view class="" style="font-size: 14px;color: #AAAAAA;">
				请保持身份证正面完整清晰
			</view>
			<view class="mt15">
				<u-image width="100%" mode="widthFix"
					:src="formData.rear||'https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/geti/rear.svg'"
					@click="imgUpdate(1)"></u-image>
			</view>

		</view>
		<view class="ml24 width100 justify-center items-center flex-row pt30 mr24" style="font-size: 10px;">
			<view class="ml10" @click="radioGroupChange">
				<u-radio-group>
					<u-radio :disabled="disabled" active-color="#01BB74" icon-size="12" class="flex-row justify-center items-center"
						style="text-align: center;">
						<view class="">
							<text style="color: #AAAAAA;font-size: 12px;" @click="radioGroupChange">我已阅读并同意</text>
							<text style="color: #01BB74;font-size: 12px;">《身份证认证协议》</text>
						</view>
					</u-radio>
				</u-radio-group>
			</view>
		</view>

		<view class="flex-row justify-center items-center mr24 mt20">
			<view @click="submit" class="text-wrapper_2 flex-col justify-center items-center"
				style="display: flex;flex-direction: column;width: 350px;height: 52px;border-radius: 188px;color: white;"
				:style="{backgroundColor:btnColor}">
				<text class="text_9">立即认证</text>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				btnColor: "#5AD3A4",
				disabled: true,
				formData: {
					front: "",
					rear: ""
				}
			}
		},
		onShow() {

		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {

		},
		methods: {
			submit() {
				if (this.disabled) {
					this.$u.toast("请同意用户协议~")
				}
			},
			radioGroupChange() {
				if (this.disabled) {
					this.disabled = false;
					this.btnColor = "#01BB74"
				}else{
					this.disabled = true;
					this.btnColor = "#5AD3A4"
				}


			},
			imgUpdate(index) {
				console.log(index);
				uni.chooseImage({
					count: 1, // 选择图片数量
					sizeType: ['original', 'compressed'], // 选择图片的大小类型
					sourceType: ['album', 'camera'], // 选择图片的来源类型
					success: (res) => {
						const image = res.tempFiles[0];
						console.log(image.path);
						// 在这里可以处理选择的图片信息
						if (index == 0) {
							this.formData.front = image.path
						} else {
							this.formData.rear = image.path
						}

					}
				});
			}
		},
	}
</script>

<style lang="scss">

</style>