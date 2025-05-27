<template>
	<view class="shareFriend">
		<view class="absolute" style="left: 24rpx;top: 120rpx;">
			<u-icon name="arrow-left" color="#333333" size="45" @click="close"></u-icon>
		</view>
		<view class="shareFriendBottom">
			<view class="shareFriendBottomButton">
				<u-button hover-class="none" shape="circle" :custom-style="customStyle" open-type="getPhoneNumber"
					@getphonenumber="getPhoneNumber">
					加入好友
				</u-button>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				customStyle: {
					background: "#FFAF38",
					width: "220px",
					height: "47px",
					border: "#FFAF38",
					color: "#ffffff"
				},
				wxLoginRes: "",
				requestPhone: "",
				deliveryOrder: {
					sBossNumber: "",
					eBossNumber: ""
				}
			}
		},
		onLoad(option) {
			this.requestPhone = option.phone;
			console.log("请求者=========》", option);
			console.log("请求者=========》", option.phone);
		},
		onShow() {
			var that = this;
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					that.wxLoginRes = loginRes.code;
				}
			});
		},
		methods: {
			close() {
				wx.exitMiniProgram({
					success: function() {
						console.log('成功退出小程序');
					},
					fail: function(err) {
						console.error('退出小程序失败', err);
					}
				});
			},
			addFriend(phone) {
				this.deliveryOrder.sBossNumber = this.requestPhone
				this.deliveryOrder.eBossNumber = phone
				
				if (this.deliveryOrder.sBossNumber === this.deliveryOrder.eBossNumber) {
					this.$u.toast("请勿添加自己哦~");
					return;
				}

				this.$u.post('/edo/delivery/share', this.deliveryOrder).
				then(res => {
					this.$u.toast(res.data.message);
					if (res.data.data == 1) {
						setTimeout(function() {
							uni.switchTab({
								url: "/pages/index/index"
							})
						}, 500)
					}
				})
			},
			getPhoneNumber(e) {

				var loginPhone = this.vuex_user.phone;

				console.log(loginPhone);

				if (loginPhone != undefined) {
					if (this.requestPhone == loginPhone) {
						this.$u.toast("请勿添加自己哦~");
						return;
					}

					//添加
					var work = this.vuex_user.data.work;
					if (work == "0") {
						//没有工作加他
						this.addFriend(loginPhone)

					} else {
						var bossPhone = this.vuex_user.workData.bossNumber;
						if (bossPhone==loginPhone) {
							this.$u.toast("请勿添加自己哦~");
							return;
						}
						
						if (bossPhone==this.requestPhone) {
							this.$u.toast("请勿添加自己哦~");
							return;
						}
						
						//工作加老板
						this.addFriend(bossPhone)

					}


				} else {
					var that = this;
					console.log(e);
					that.$u.post('/edo/rest/v1/phone', {
						'loginCode': that.wxLoginRes,
						'phoneCode': e.detail.code
					}).
					then(res => {
						console.log('===/edo/rest/v1/phone===>',res);
						var getPhone = res.data.data.phone;
						console.log('===getPhone===>',getPhone);
						console.log('===this.requestPhone===>',this.requestPhone);
						if (this.requestPhone === getPhone) {
							this.$u.toast("请勿添加自己哦~");
							return;
						}

						if (res.data.work) {
							//工作加老板
							this.addFriend(res.data.bossPhone)
						} else {
							//没有工作加他
							this.addFriend(res.data.phone)
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.shareFriend {
		width: 100vw;
		height: 100vh;
		background-image: url("https://res-oss.elist.com.cn/wxImg/message/shareFriendBackgroundImage.png");
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

			background-image: url("https://res-oss.elist.com.cn/wxImg/message/shareFriend.png");
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