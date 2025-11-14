<!-- 隐私授权对话框 -->
<template>
	<view class="comp-container" v-if="visible">
		<view class="dialog">
			<view class="title">用户隐私保护提示</view>
			<view class="desc">
				感谢您使用本小程序，在使用前您应当阅读并同意<text class="privacy"
					@click="handleOpenPrivacyContract">《用户隐私保护指引》</text>，当点击同意，即表示您已理解并同意该条款内容，该条款将对您产生法律约束力；如您不同意，将无法继续使用小程序相关功能。
			</view>
			<view class="footer">
				<button type="default" class="btn disagree" @click="handleDisagree">不同意</button>
				<button type="default" open-type="agreePrivacyAuthorization" class="btn agree"
					@agreeprivacyauthorization="handleAgree">同意</button>

			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				visible: false,
				agreeCallBack: null, //同意回调函数
				disAgreeCallBack: null, //不同意回调函数
				completeCallBack: null //完成回调函数
			}
		},
		methods: {
			//检查根据是否需要并弹出隐私窗口
			check(options = {}) {
				let {
					agree,
					disAgree,
					complete
				} = options
				if (uni.getPrivacySetting) {
					if (typeof complete === 'function') {
						this.completeCallBack = complete
					}
					uni.getPrivacySetting({
						success: res => {
							if (typeof agree === 'function') {
								this.agreeCallBack = agree
							}
							if (typeof disAgree === 'function') {
								this.disAgreeCallBack = disAgree
							}
							//需要隐私同意显示对话框
							if (res.needAuthorization) {
								this.visible = true
							} else {
								this.handleAgree()
							}
						},
						fail: () => {
							this.handleComplete()
						}
					})
				}

			},
			//隐藏对话框
			hide() {
				this.visible = false
			},
			//不同意
			handleDisagree() {
				this.visible = false
				if (typeof this.disAgreeCallBack === 'function') {
					this.disAgreeCallBack()
				}
				this.handleComplete()
			},
			//同意
			handleAgree() {
				this.visible = false;
				if (typeof this.agreeCallBack === 'function') {
					this.agreeCallBack()
				}
				this.handleComplete()

			},
			//完成
			handleComplete() {
				if (typeof this.completeCallBack === 'function') {
					this.completeCallBack()
				}
			},
			//打开隐私政策页面
			handleOpenPrivacyContract() {
				uni.openPrivacyContract()
			}
		}


	};
</script>
<style lang="scss" scoped>
	.comp-container {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 999;
	}

	.dialog {
		color: #333;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		border-radius: 20rpx;
		padding: 50rpx 40rpx;
		width: 560rpx;
		box-sizing: border-box;

		.title {
			width: 100%;
			color: #000;
			text-align: center;
			font-size: 32rpx;
			font-weight: 650;
			box-sizing: border-box;
		}

		.desc {
			line-height: 40rpx;
			box-sizing: border-box;
			margin-top: 50rpx;
			font-size: 26rpx;

			.privacy {
				color: #2f80ed;
			}
		}

		.footer {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 30rpx;

			.btn {
				display: flex;
				align-items: center;
				color: #FFF;
				font-size: 28rpx;
				font-weight: 500;
				line-height: 80rpx;
				text-align: center;
				height: 80rpx;
				border-radius: 10rpx;
				border: none;
				background: #07c160;
				flex: 1;
				justify-content: center;

				&:nth-last-child(1) {
					margin-left: 30rpx;
				}

				&.disagree {
					color: #333;
					background: #f2f2f2;
				}
			}
		}

	}
</style>