<template>
	<view>
		<!-- #ifndef MP-WEIXIN -->
		<up-popup :show="show" mode="bottom" @close="handleClose">
			<view class="top1 flex-row items-center">
				<albb-icon v-if="iconName == 'share-square'" icon="ydj-zhuanfa" size="30rpx" color="#666666"></albb-icon>
				<wd-icon v-else name="share" size="30rpx" color="#666666"></wd-icon>
				<text class="ml20">{{ iconName == 'share-square' ? '转发至' : '分享至' }}</text>
			</view>
			<view class="flex-row justify-around items-center">
				<view v-for="(item, index) in shareList" :key="index" class="shareBox flex-col justify-center items-center" @click="toShare(index)">
					<image :src="item.imgurl" mode=""></image>
					<text>{{ item.name }}</text>
				</view>
			</view>
		</up-popup>
		<!-- #endif -->
	</view>
</template>

<script>
import { string } from '../../uni_modules/uview-plus/libs/function/test';

export default {
	name: 'pop-share',
	props: {
		show: {
			type: Boolean, // 设置数据类型为 Number
			default: false // 设置默认值
		},
		iconName: {
			type: String,
			default: 'share-square'
		},
		imageUrl: {
			type: String,
			default: '/static/share.png'
		},
		sharePath: {
			type: String,
			default: '/pages/index/index'
		},
		shareTitle: {
			type: String,
			default: '打开易单据小程序，极速管理您的货单~'
		}
	},
	data() {
		return {
			shareList: []
		};
	},
	created() {
		if (this.iconName == 'share-square') {
			this.shareList = [
				{
					name: '客户',
					imgurl: '/static/app/img/share/kh.svg'
				},
				{
					name: '微信好友',
					imgurl: '/static/app/img/share/wx.svg'
				}
			];
		} else {
			this.shareList = [
				{
					name: '客户',
					imgurl: '/static/app/img/share/kh.svg'
				},
				{
					name: '微信好友',
					imgurl: '/static/app/img/share/wx.svg'
				},
				{
					name: '邮箱',
					imgurl: '/static/app/img/share/yx.svg'
				}
			];
		}
	},
	methods: {
		handleClose() {
			this.$emit('closeShare');
		},
		toShare(index) {
			if (index == 1) {
				uni.getProvider({
					service: 'share',
					success: (res) => {
						if (res.provider.includes('weixin')) {
							uni.share({
								provider: 'weixin',
								scene: 'WXSceneSession', // 好友
								// scene: 'WXSceneTimeline', // 朋友圈（朋友圈不支持文本，仅支持图片或链接）
								type: 5, // 0 表示链接类型,5	小程序
								title: this.shareTitle, // 标题
								href: 'https://www.example.com', // 跳转链接
								imageUrl: this.imageUrl, // 分享图片（本地路径或网络图片）
								miniProgram: {
									id: 'gh_65335aa354af',
									path: this.sharePath,
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
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.top1 {
	font-size: 32rpx;
	padding: 40rpx 0 70rpx 26rpx;
}
.shareBox {
	padding-bottom: 68rpx;
	image {
		width: 110rpx;
		height: 110rpx;
	}
	text {
		font-size: 28rpx;
		color: #999;
		margin-top: 10rpx;
	}
}
</style>
