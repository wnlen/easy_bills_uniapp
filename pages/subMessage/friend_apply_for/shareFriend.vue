<template>
	<view class="shareFriend">
		<view class="absolute" style="left: 24rpx; top: 120rpx">
			<up-icon name="arrow-left" color="#333333" size="45rpx" @click="close"></up-icon>
		</view>
		<view
			class="shareFriendBottom"
			:style="
				invitationRole == 'D'
					? 'background-image: url(https://res-oss.elist.com.cn/wxImg/message/shareFriendD.png)'
					: 'background-image: url(https://res-oss.elist.com.cn/wxImg/message/shareFriendR.png)'
			"
		>
			<view class="shareFriendBottomButton">
				<up-button hover-class="none" shape="circle" :customStyle="customStyle" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
					{{ invitationRole == 'D' ? '成为客户' : '成为供应商' }}
				</up-button>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			customStyle: {
				background: '#FFAF38',
				width: '440rpx',
				height: '94rpx',
				border: '#FFAF38',
				color: '#ffffff'
			},
			wxLoginRes: '',
			requestPhone: '',
			deliveryOrder: {
				sBossNumber: '',
				eBossNumber: ''
			},
			invitationRole: 'D' //邀请者的角色
		};
	},
	onLoad(option) {
		this.requestPhone = option.phone;
		this.invitationRole = option.invitationRole;
		console.log('请求者=========》', option);
		console.log('请求者=========》', option.phone);
	},
	onShow() {
		var that = this;
		uni.login({
			provider: 'weixin',
			success: function (loginRes) {
				that.wxLoginRes = loginRes.code;
			}
		});
	},
	methods: {
		close() {
			wx.exitMiniProgram({
				success: function () {
					console.log('成功退出小程序');
				},
				fail: function (err) {
					console.error('退出小程序失败', err);
				}
			});
		},
		addFriend(phone) {
			this.deliveryOrder.sBossNumber = this.invitationRole == 'R' ? phone : this.requestPhone;
			this.deliveryOrder.eBossNumber = this.invitationRole == 'R' ? this.requestPhone : phone;
			this.deliveryOrder.port = this.invitationRole;

			if (this.deliveryOrder.sBossNumber === this.deliveryOrder.eBossNumber) {
				this.$u.toast('请勿添加自己哦~');
				return;
			}

			uni.$api.order.shareDeliveryOrder(this.deliveryOrder).then((res) => {
				this.$u.toast(res.data.message);
				if (res.data.data == 1) {
					setTimeout(function () {
						uni.switchTab({
							url: '/pages/index/index'
						});
					}, 500);
				}
			});
		},
		getPhoneNumber(e) {
			var loginPhone = this.pinia_user.phone;

			console.log(loginPhone);

			if (loginPhone != undefined) {
				if (this.requestPhone == loginPhone) {
					this.$u.toast('请勿添加自己哦~');
					return;
				}

				//添加
				var work = this.pinia_user.data.work;
				if (work == '0') {
					//没有工作加他
					this.addFriend(loginPhone);
				} else {
					var bossPhone = this.pinia_user.workData.bossNumber;
					if (bossPhone == loginPhone) {
						this.$u.toast('请勿添加自己哦~');
						return;
					}

					if (bossPhone == this.requestPhone) {
						this.$u.toast('请勿添加自己哦~');
						return;
					}

					//工作加老板
					this.addFriend(bossPhone);
				}
			} else {
				var that = this;
				console.log(e);
				uni.$api.user
					.bindPhoneNumber({
						loginCode: that.wxLoginRes,
						phoneCode: e.detail.code
					})
					.then((res) => {
						var getPhone = res.data.data.phone;
						console.log('===getPhone===>', getPhone);
						console.log('===this.requestPhone===>', this.requestPhone);
						if (this.requestPhone === getPhone) {
							this.$u.toast('请勿添加自己哦~');
							return;
						}

						if (res.data.work) {
							//工作加老板
							this.addFriend(res.data.bossPhone);
						} else {
							//没有工作加他
							this.addFriend(res.data.phone);
						}
					});
			}
		}
	}
};
</script>

<style lang="scss">
.shareFriend {
	width: 100vw;
	height: 100vh;
	background-image: url('https://res-oss.elist.com.cn/wxImg/message/shareFriendBackgroundImageD.png');
	background-size: cover;
	position: relative;

	.shareFriendBottom {
		position: absolute;
		bottom: 5vh;
		padding: 10rpx;
		width: 90%;
		height: 40vh;
		margin-left: 5%;
		border-radius: 12px;

		display: flex;
		justify-content: center;
		flex-direction: row;
		align-items: center;

		background-image: url('https://res-oss.elist.com.cn/wxImg/message/shareFriend.png');
		background-size: cover;

		.shareFriendBottomButton {
			position: absolute;

			display: flex;
			justify-content: center;
			flex-direction: row;
			align-items: center;

			// font-size: 19px;
			// font-weight: 500;
			// line-height: 13.23px;
			// text-align: center;
			// letter-spacing: 0.03em;
			// color: #FFFFFF;

			// width: 220px;
			// height: 47px;
			// border-radius: 493px;
			// opacity: 1;
			// background: #FFAF38;
			bottom: 48rpx;
		}
	}
}
</style>
