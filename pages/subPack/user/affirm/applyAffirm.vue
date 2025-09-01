<template>
	<view class="applyAffirm">
		<u-icon size="250" :name="ImgUrl + '/wxImg/user/unsubscribeApplyImg02.png'"></u-icon>

		<view class="applyAffirmTitle">注销审核中</view>
		<text class="applyAffirmText">请注意接听来电回访，回访成功后</text>
		<text class="applyAffirmText">账号会在3-5个工作日内完成注销</text>

		<view class="applyAffirm_btn">
			<view class="withdraw" @click="withdraw">
				{{ withdrawText }}
			</view>
			<view class="relation">
				<u-button hover-class="none" :hair-line="false" open-type="contact" :customStyle="buttonStyle">联系客服</u-button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			url: '',
			withdrawText: '撤销',
			buttonStyle: {
				backgroundColor: 'transparent',
				border: 'none',
				appearance: 'none',
				outline: 'none',
				boxShadow: 'none',
				padding: '0',
				width: '100%',
				height: '100%',
				color: '#FFFFFF'
			}
		};
	},
	onLoad(option) {},
	onShow() {},
	methods: {
		relation() {
			uni.navigateTo({
				url: '/pages/subMessage/chitchat/chat'
			});
		},
		withdraw() {
			uni.showModal({
				title: '撤销提示',
				content: '您是否确认撤销注销申请？撤回后账号将恢复正常状态。',
				showCancel: true,
				cancelText: '取消',
				confirmText: '确定',
				success: (res) => {
					var okif = res.confirm;
					if (okif) {
						console.log('---撤销---');
						uni.$api.user
							.revokeUnsubscribe({
								phone: this.pinia_user.phone
							})
							.then((res) => {
								var code = res.data.data == 1;
								if (code) {
									this.$loadUser(this);
									console.log(this.pinia_user.data.state);
									var freezeState = this.pinia_user.data.state == '0';
									if (!freezeState) {
										uni.switchTab({
											url: '/pages/index/index'
										});
									}
								} else {
									this.$u.toast(res.data.data);
								}
							});
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.applyAffirm {
	width: 100vw;
	height: 100vh;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	padding-bottom: 100px;
}

.applyAffirmTitle {
	font-family: Source Han Sans;
	font-size: 18px;
	font-weight: 500;
	line-height: 22px;
	text-align: center;
	letter-spacing: 0px;

	font-variation-settings: 'opsz' auto;
	font-feature-settings: 'kern' on;
	color: #333333;

	padding-top: 24rpx;

	padding-bottom: 24rpx;
}

.applyAffirmText {
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

.applyAffirm_btn {
	width: 100%;

	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;

	padding: 24rpx;

	margin-top: 48rpx;

	.withdraw {
		width: 97.12px;
		height: 44.43px;
		border-radius: 188px;
		opacity: 1;

		box-sizing: border-box;
		border: 1px solid #00b578;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

		font-family: Source Han Sans;
		font-size: 18px;
		font-weight: 500;
		line-height: 21.12px;
		text-align: center;
		letter-spacing: 0px;

		font-variation-settings: 'opsz' auto;
		font-feature-settings: 'kern' on;
		color: #01bb74;
	}

	.relation {
		width: 159.62px;
		height: 44.43px;
		border-radius: 188px;
		opacity: 1;

		background: #01bb74;

		margin-left: 24rpx;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

		font-family: Source Han Sans;
		font-size: 18px;
		font-weight: 500;
		line-height: 21.12px;
		text-align: center;
		letter-spacing: 0px;

		font-variation-settings: 'opsz' auto;
		font-feature-settings: 'kern' on;
		color: #ffffff;
	}
}
</style>
