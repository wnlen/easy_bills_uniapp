<template>
	<view class="relative flex-col items-center" style="width: 100vw; height: 100vh">
		<view class="" style="background-color: transparent">
			<!-- 		<up-navbar :custom-back="customBack" :border-bottom="false" title-color="#333333" title="注销账号"
				title-size="28" background="{background:transparent,color:white,fontSize: 28rpx;}"></up-navbar> -->

			<up-navbar
				:autoBack="true"
				:placeholder="true"
				:custom-back="customBack"
				:border-bottom="false"
				:titleBold="true"
				title-color="#000000"
				title="注销账号"
				title-size="34"
				bgColor="#ffffff"
			></up-navbar>
		</view>
		<view class="flex-col justify-center items-center mt30">
			<view class="">
				<wd-icon name="https://res-oss.elist.com.cn/wxImg/user/del.svg" size="200rpx"></wd-icon>
			</view>
			<view class="" style="font-size: 36rpx; font-weight: 700; text-align: center; letter-spacing: 0rpx">注销账号将永久失效且不可恢复</view>
		</view>
		<view class="ml24 mr24 mt30 pd30" style="background-color: #f9f9f9; width: 94%; border-radius: 12rpx">
			<view class="flex-col items-baseline pt25 pb30">
				<view class="flex-row items-center">
					<wd-icon name="https://res-oss.elist.com.cn/wxImg/user/dian.svg" size="15rpx"></wd-icon>
					<view class="title ml15 pb15 mt10">订单信息确认</view>
				</view>
				<view class="text">您在发货端和收货端内的所有订单将会被清空，请确保您已处理完收发端的所有单据。</view>
			</view>
			<view class="flex-col items-baseline pb30">
				<view class="flex-row items-center">
					<wd-icon name="https://res-oss.elist.com.cn/wxImg/user/dian.svg" size="15rpx"></wd-icon>
					<text class="title ml15 pb15 mt10">账号信息</text>
				</view>
				<view class="text">个人信息、公司信息、签收人信息、好友信息等将会被清空。</view>
			</view>
			<view class="flex-col items-baseline pb30">
				<view class="flex-row items-center">
					<wd-icon name="https://res-oss.elist.com.cn/wxImg/user/dian.svg" size="15rpx"></wd-icon>
					<text class="title ml15 pb15 mt10">虚拟权益</text>
				</view>
				<view class="text">您平台的虚拟权益如您在【我的订购】中已购买的全部内容，将视为您自动放弃无法恢复。</view>
			</view>
		</view>

		<view class="absolute flex-col justify-center items-center" style="bottom: 140rpx">
			<view class="flex-row justify-center items-center mr24 ml24 mb20">
				<uv-checkbox-group>
					<uv-checkbox @change="radiochange" shape="circle" active-color="#01BB74" icon-size="10" class="flex-row justify-center" style="text-align: center">
						<view class="">
							<text style="color: #aaaaaa; font-size: 24rpx">同意并遵行易单据</text>
							<text style="color: #01bb74; font-size: 24rpx" @tap.stop="jumpWord()">《账号注销须知》</text>
						</view>
					</uv-checkbox>
				</uv-checkbox-group>
			</view>

			<view class="flex-col justify-center items-center" style="width: 100%">
				<view
					@click="logout"
					class="flex-row justify-center items-center ml24 mr24"
					style="background: #01bb74; width: 701.84rpx; height: 104rpx; border-radius: 376rpx; font-size: 36rpx; font-weight: bold; color: white"
				>
					确认注销
				</view>
			</view>
		</view>

		<up-popup :show="showAddPhone" mode="center" round="14" :mask-close-able="false" :safeAreaInsetBottom="false">
			<view class="showAddPhoneCard" style="">
				<view class="hand">注销审核</view>
				<view class="text">稍后易单据客服会给您来电回访，</view>
				<view class="text">请输入回访号码</view>
				<view class="number">
					<up-code-input size="50rpx" space="15rpx" :v-model="addPhone" fontSize="50rpx" @change="change" @finish="finish" maxlength="11"></up-code-input>
				</view>
				<view class="flex-row items-center absolute u-border-top" style="width: 100%; bottom: 0; height: 25%">
					<view @click="cancel()" style="width: 50%; height: 100%" class="titlePas flex-col justify-center items-center">取消</view>
					<view @click="confirm()" style="width: 50%; height: 100%" class="titlePasOK flex-col justify-center items-center u-border-left">确认</view>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			disabled: false,
			wordUrl: "https://docs.google.com/gview?url='https://res-oss.elist.com.cn/excel/ydj.docx'",
			showAddPhone: false,
			addPhone: ''
		};
	},
	methods: {
		finish() {},
		change(e) {
			this.addPhone = e;
		},
		cancel(phone) {
			this.addPhone = '';
			this.showAddPhone = false;
		},
		confirm() {
			var mobileRegex = /^1(3|4|5|6|7|8|9)\d{9}$/;
			var fixedLineRegex = /^(0\d{2,3})?[\s-]?(\d{7,8})$/;
			var phoneRegex = /^1(3|4|5|6|7|8|9)\d{9}$|^(0\d{2,3})?[\s-]?(\d{7,8})$/;

			if (mobileRegex.test(this.addPhone) || fixedLineRegex.test(this.addPhone) || phoneRegex.test(this.addPhone)) {
				this.showAddPhone = false;
				this.okPhone(this.addPhone);
			} else {
				this.showAddPhone = false;
				this.$u.toast('请输入正确手机号码');
				this.addPhone = '';
			}
		},
		okPhone(fillPhone) {
			//账号注销接口
			uni.$api.user.unsubscribeUser().then((res) => {
				var resD = res.data.data.data;

				if (resD == 1) {
					this.$u.setPinia({
						user: {
							userRole: this.pinia_userRole,
							token: '',
							user: { phone: undefined }
						},
						guide: {
							guidanceD: null,
							guidanceR: null,
							guidanceGoods: null,
							unreceivedReminder: null, //未签收提醒弹窗
							guidance: 0,
							draft: false
						}
					});
					uni.reLaunch({
						url: '/pages/index/index'
					});
				} else {
					this.$u.toast(res.data.data.message);
				}
			});
		},
		customBack() {
			uni.switchTab({
				url: '/pages/user/index'
			});
		},
		jumpWord() {
			console.log('点击');
			uni.navigateTo({
				url: '/pages/subPack/user/affirm/word?url=' + 'https://upbill.cn/h5/notice/AccountCancellationNotice-v1.htm'
			});
		},
		ClearVuexCash() {
			this.$u.setPinia({
				user: {
					token: '',
					userRole: '',
					user: { nickname: '请注册~' }
				}
			});

			setTimeout(() => {
				uni.navigateTo({
					url: '/pages/subUser/login'
				});
			}, 1000);
		},
		logout() {
			if (!this.disabled) {
				this.$u.toast('请勾选账号注销须知协议');
				return;
			}
			this.okPhone(this.pinia_user.phone);
			// this.showAddPhone = true;
		},
		radiochange(e) {
			this.disabled = e;
		}
	}
};
</script>

<style scoped lang="scss">
::v-deep .uv-checkbox__icon-wrap {
	width: 28rpx !important;
	height: 28rpx !important;
}
.title {
	font-size: 32rpx;
	font-weight: 500;
}

.text {
	font-size: 30rpx;
	font-weight: normal;
	line-height: 46rpx;
	letter-spacing: 1rpx;
	padding-left: 30rpx;
}

.showAddPhoneCard {
	margin-left: 24rpx;
	margin-right: 24rpx;
	height: 30vh;
	overflow: hidden;

	.hand {
		color: #333333;
		font-family: Source Han Sans;
		font-size: 36rpx;
		font-weight: 500;
		line-height: 50.36rpx;
		text-align: center;
		letter-spacing: 0rpx;
		margin-top: 60rpx;
	}

	.text {
		text-align: center;
		margin-top: 12rpx;
		font-family: Source Han Sans;
		font-size: 28rpx;
		font-weight: normal;
		line-height: 50.36rpx;
		text-align: center;
		letter-spacing: 0rpx;

		font-feature-settings: 'kern' on;
		color: #999999;
	}

	.number {
		text-align: center;
		height: 25%;
		background-color: transparent;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
}

.titlePasOK {
	color: #01bb74;
}
</style>
