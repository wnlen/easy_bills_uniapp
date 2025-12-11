<template>
	<view class="page-container">
		<up-toast ref="toast"></up-toast>
		<up-navbar title="分享给好友" :autoBack="true" :placeholder="true"></up-navbar>
		<view class="top-img">
			<image class="banner" src="https://res-oss.elist.com.cn/share/bannerT.png" mode="widthFix"></image>
		</view>
		<view class="page-list">
			<view class="banner_t">
				<image class="banner_text" src="https://res-oss.elist.com.cn/share/banner_center.png" mode="widthFix"></image>
			</view>
			<view class="list-box">
				<view class="box-line"></view>
				<view class="qrcode_img">
					<up-image :src="qrCodeUrl" :lazy-load="true" :fade="true" duration="450" width="162rpx" height="162rpx"></up-image>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<button class="btn_1" open-type="share">分享好友</button>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<button class="btn_1" @click="toShareApp">分享好友</button>
				<!-- #endif -->
				<button class="btn_2" @click="saveQr">下载</button>
				<view class="box-text">注:邀请新好友注册登录累计一个人数</view>
			</view>
			<view class="page-list-jindu">
				<image class="jindu_img" src="https://res-oss.elist.com.cn/share/yaoqingjindutiao.png" mode="widthFix"></image>
				<view class="jindu_text">
					<up-line-progress height="18" :percentage="15 + ((inviteCount * 100) / 15) * 0.85" activeColor="#FE962A">
						<text class="uv-percentage-slot">
							<text v-show="inviteCount > 2">邀请人数</text>
							<text>{{ inviteCount }}/15</text>
						</text>
					</up-line-progress>
				</view>
			</view>
			<view class="page-list-ddtj">
				<image class="ddtj_icon" src="https://res-oss.elist.com.cn/share/dingdanicon.png" mode="widthFix"></image>
				<view class="ddtj_text1">统计对账 近三月</view>
				<view class="ddtj_text2">需要邀请5人即可领取</view>
				<view class="ddtj_btn_disabled" v-if="claimed3Month">已领取</view>
				<view class="ddtj_btn" v-else-if="canClaim3Month" @click="claimReward('invitation3month')">领取</view>
				<view class="ddtj_btn_disabled" v-else>领取</view>
			</view>

			<view class="page-list-ddtj">
				<image class="ddtj_icon" src="https://res-oss.elist.com.cn/share/dingdanicon.png" mode="widthFix"></image>
				<view class="ddtj_text1">统计对账 近一年</view>
				<view class="ddtj_text2">需要邀请15人即可领取</view>
				<view class="ddtj_btn_disabled" v-if="claimed12Month">已领取</view>
				<view class="ddtj_btn" v-else-if="canClaim12Month" @click="claimReward('invitation12month')">领取</view>
				<view class="ddtj_btn_disabled" v-else>领取</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			shareLink: '',
			qrCodeUrl: '',
			inviteCount: 0,
			canClaim3Month: false, //能不能领
			canClaim12Month: false,
			claimed3Month: false, //领没领过
			claimed12Month: false
		};
	},
	onLoad() {
		this.getData();
	},
	methods: {
		toShareApp() {
			uni.getProvider({
				service: 'share',
				success: (res) => {
					if (res.provider.includes('weixin')) {
						uni.share({
							provider: 'weixin',
							scene: 'WXSceneSession', // 好友
							// scene: 'WXSceneTimeline', // 朋友圈（朋友圈不支持文本，仅支持图片或链接）
							type: 5, // 0 表示链接类型,5	小程序
							title: '邀你体验易单据', // 标题
							href: 'https://www.example.com', // 跳转链接
							imageUrl: 'https://res-oss.elist.com.cn/share/share.png', // 分享图片（本地路径或网络图片）
							miniProgram: {
								id: 'gh_65335aa354af',
								path: `/pages/index/index?inviterId=${this.pinia_user.data.id}`,
								type: 0,
								webUrl: 'https://www.example.com'
							},
							success: () => {
								console.log('分享成功');
							},
							fail: (err) => {
								console.log('分享失败', err);
							}
						});
					} else {
						uni.showToast({ title: '未安装微信', icon: 'none' });
					}
				}
			});
		},
		getData() {
			uni.$api.user.getInviteOverview().then((res) => {
				const data = res.data.data;
				this.shareLink = data.shareLink;
				this.qrCodeUrl = data.qrCodeUrl;
				this.inviteCount = data.inviteCount;

				// 是否可以领取
				this.canClaim3Month = data.canClaim3Month;
				this.canClaim12Month = data.canClaim12Month;

				// 是否已经领取过
				this.claimed3Month = data.claimed3Month;
				this.claimed12Month = data.claimed12Month;

				console.log('邀请数据：', data);
			});
		},
		saveQr() {
			uni.downloadFile({
				url: this.qrCodeUrl,
				success: (res) => {
					if (res.statusCode === 200) {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => uni.showToast({ title: '已保存', icon: 'none' }),
							fail: () => uni.showToast({ title: '保存失败', icon: 'none' })
						});
					}
				}
			});
		},
		copyLink() {
			uni.setClipboardData({
				data: this.inviteData.shareLink,
				success: () => uni.showToast({ title: '已复制' })
			});
		},
		claimReward(type) {
			console.log('领取');
			uni.$api.user
				.claimInviteReward({ type })
				.then((res) => {
					if (res.data.code == 200) {
						this.$refs.toast.show({
							type: 'success',
							message: res.data.data
						});
					} else {
						this.$refs.toast.show({
							type: 'error',
							message: res.data.message
						});
					}
					this.getData();
				})
				.catch((err) => {
					uni.showToast({ title: err.message || '领取失败', icon: 'none' });
				});
		}
	},
	onShareAppMessage() {
		const inviterId = this.pinia_user.data.id || '';
		console.log('分享', inviterId);
		return {
			title: '邀你体验易单据',
			path: `/pages/index/index?inviterId=${inviterId}`, // 邀请路径
			imageUrl: 'https://res-oss.elist.com.cn/share/share.png' // 分享卡片的封面图
		};
	}
};
</script>

<style lang="scss" scoped>
.page-container {
	display: flex;
	flex-direction: column;
	background-color: #fbeeda;
	width: 100vw;
}

/* 顶部图片区域 */
.top-img {
	width: 100%;
	overflow: hidden;
}

.banner {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

/* 列表区域 */
.page-list {
	position: relative;
	top: -180rpx;
	padding: 10rpx 10rpx;
	box-sizing: border-box;
	border-radius: 15rpx;
	margin: 10rpx 20rpx;
	background-color: #fff9f8;
	text-align: center;
	.banner_t {
		position: absolute;
		top: -20rpx;
		margin: 0 auto;
		width: 100%;
		text-align: center;
		// z-index: 99;
		.banner_text {
			width: 68.5%;
		}
	}
	.list-box {
		position: relative;
		width: 588rpx;
		height: 276rpx;
		margin: 0 auto;
		margin-top: 60rpx;
		border-radius: 16rpx;
		box-shadow: 0rpx 8rpx 10rpx 0rpx rgba(147, 147, 147, 0.3);
		color: #7b240d;
		font-size: 28rpx;
		.box-line {
			position: absolute;
			left: 16rpx;
			top: 12rpx;
			width: 558rpx;
			height: 252rpx;
			border-radius: 16rpx;
			border: 2rpx solid #ffc0aa;
		}
		.qrcode_img {
			position: absolute;
			left: 58rpx;
			top: 40rpx;
			width: 162rpx;
			height: 162rpx;
			opacity: 1;
		}
		.btn_1 {
			position: absolute;
			left: 318rpx;
			top: 36rpx;
			width: 172rpx;
			height: 56rpx;
			line-height: 56rpx;
			border-radius: 408rpx;
			opacity: 1;
			background: linear-gradient(180deg, #fff3e0 0%, #ffca77 100%);
			border: none;
			color: #7b240d;
			font-size: 28rpx;
			&::after {
				border: none;
			}
		}
		.btn_2 {
			position: absolute;
			left: 318rpx;
			top: 122rpx;
			width: 172rpx;
			height: 56rpx;
			line-height: 56rpx;
			border-radius: 408rpx;
			opacity: 1;
			background: linear-gradient(180deg, #fff3e0 0%, #ffca77 100%);
			color: #7b240d;
			font-size: 28rpx;
			&::after {
				border: none;
			}
		}
		.box-text {
			position: absolute;
			width: 326rpx;
			left: 115rpx;
			top: 220rpx;
			margin: 0 auto;
			font-size: 20rpx;
		}
	}
	.page-list-jindu {
		position: relative;
		width: 100%;
		margin: 70rpx 0;
		height: 44rpx;
		.jindu_img {
			position: absolute;
			top: 4rpx;
			left: 24rpx;
			width: 158rpx;
			height: 44rpx;
		}
		.jindu_text {
			position: absolute;
			left: 212rpx;
			width: 466rpx;
			height: 44rpx;
			.uv-percentage-slot {
				padding: 2rpx 10rpx;
				// background-color: #f9ae3d;
				color: #fff;
				border-radius: 200rpx;
				font-size: 20rpx;
				margin: 0 auto;
			}
		}
	}
	.page-list-ddtj {
		width: 100%;
		height: 80rpx;
		position: relative;
		margin-bottom: 80rpx;
		.ddtj_icon {
			position: absolute;
			left: 24rpx;
			width: 80rpx;
			height: 80rpx;
		}
		.ddtj_text1 {
			position: absolute;
			left: 120rpx;
			font-size: 28rpx;
			color: #7b240d;
		}
		.ddtj_text2 {
			position: absolute;
			left: 120rpx;
			top: 48rpx;
			font-size: 24rpx;
			color: #c56858;
		}
		.ddtj_btn {
			position: absolute;
			top: 20rpx;
			right: 24rpx;
			width: 124rpx;
			height: 46rpx;
			line-height: 46rpx;
			color: #fff;
			font-size: 28rpx;
			border-radius: 258rpx;
			background: linear-gradient(180deg, #e6564c 0%, #ff38a5 100%);
		}
		.ddtj_btn_disabled {
			position: absolute;
			top: 20rpx;
			right: 24rpx;
			width: 124rpx;
			height: 46rpx;
			line-height: 46rpx;
			color: #fff;
			font-size: 28rpx;
			border-radius: 258rpx;
			opacity: 0.5;
			background: linear-gradient(180deg, #e6564c 0%, #ff38a5 100%);
		}
	}
}
</style>
