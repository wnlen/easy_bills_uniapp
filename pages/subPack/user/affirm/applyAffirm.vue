<template>
	<view class="applyAffirm">
		<up-icon size="250rpx" :name="ImgUrl + '/wxImg/user/unsubscribeApplyImg02.png'"></up-icon>

		<view class="applyAffirmTitle">账号注销中</view>
		<text class="applyAffirmText">账户预计在7天内完成数据清除，完</text>
		<text class="applyAffirmText">成注销后，您可重新注册新账号</text>

		<view class="applyAffirm_btn">
			<view class="withdraw" @click="withdraw">
				{{ withdrawText }}
			</view>
			<view class="relation">
				<up-button hover-class="none" :hair-line="false" open-type="contact" :customStyle="buttonStyle">联系客服</up-button>
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
				content: '您是否确认撤销注销申请？撤回后账号将恢复正常状态',
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

	padding-top: 44rpx;

	padding-bottom: 24rpx;
}

.applyAffirmText {
	font-family: Source Han Sans;
	font-size: 32rpx;
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

	margin-top: 70rpx;

	.withdraw {
		width: 155rpx;
		height: 71rpx;
		border-radius: 188px;
		opacity: 1;

		box-sizing: border-box;
		border: 1px solid #00b578;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

		font-family: Source Han Sans;
		font-size: 14px;
		font-weight: 500;
		line-height: 21.12px;
		text-align: center;
		letter-spacing: 0px;

		font-variation-settings: 'opsz' auto;
		font-feature-settings: 'kern' on;
		color: #01bb74;
	}

	.relation {
		width: 255rpx;
		height: 71rpx;
		border-radius: 188px;
		opacity: 1;

		background: #01bb74;

		margin-left: 40rpx;

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
