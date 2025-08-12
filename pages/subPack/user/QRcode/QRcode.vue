<template>
	<view class="root">
		<view>
			<u-navbar
				:autoBack="true"
				:placeholder="true"
				:border-bottom="false"
				back-icon-color="#FFFFFF"
				:titleBold="true"
				title-color="#FFFFFF"
				title="我的二维码"
				title-size="34"
				background="transparent"
			></u-navbar>
		</view>
		<view class="card">
			<view class="cardCode">
				<view class="icon flex-col justify-center items-center absolute" style="position: relative; top: -80rpx">
					<u-avatar :src="vuex_user.data.headPortrait" size="150rpx" mode="circle"></u-avatar>
				</view>
				<view class="absolute" style="position: relative; width: 100%; top: -100rpx">
					<view
						class="flex-col justify-center items-center width100 mb54"
						style="font-family: Source Han Sans; font-size: 38.4rpx; font-weight: bold; line-height: 48rpx; text-align: center; letter-spacing: 0rpx; height: 80rpx"
					>
						{{ vuex_user.data.name }}
						<view class="width100 flex-row justify-center items-center">
							<view class="flex-row justify-center items-center">
								<u-icon name="phone" color="#AAAAAA" size="28rpx"></u-icon>
							</view>
							<view class="ml2 ft14" style="color: #aaaaaa; font-weight: 400">
								{{ vuex_user.phone }}
							</view>
						</view>
					</view>

					<view class="width100 absolute" style="width: 100%; top: 120rpx">
						<view v-if="!showSF" class="flex-col justify-center items-center" style="width: 100%">
							<canvas ref="content" id="qrcode" canvas-id="qrcode" style="width: 400rpx; height: 400rpx"></canvas>
						</view>
					</view>
				</view>
			</view>
			<view class="cardThree">
				<view class="flex-row justify-center items-center" style="">
					<view class="icon">
						<u-icon
							name="https://res-oss.elist.com.cn/wxImg/user/bc.svg"
							size="130rpx"
							label="保存"
							margin-top="20"
							labelPos="bottom"
							labelColor="#ffffff"
							@click="uiconGet('1')"
						></u-icon>
					</view>
					<view class="icon">
						<u-icon
							name="https://res-oss.elist.com.cn/wxImg/user/sys.svg"
							size="130rpx"
							label="扫一扫"
							margin-top="20"
							labelPos="bottom"
							labelColor="#ffffff"
							@click="uiconGet('2')"
						></u-icon>
					</view>
					<view class="icon">
						<u-icon
							name="https://res-oss.elist.com.cn/wxImg/user/fx.svg"
							size="130rpx"
							label="分享"
							margin-top="20"
							labelPos="bottom"
							labelColor="#ffffff"
							@click="uiconGet('3')"
						></u-icon>
					</view>
				</view>
			</view>
		</view>

		<up-overlay :show="showSF" @click="showSF = false">
			<div
				@tap.stop
				v-if="showSF"
				class="flex-col justify-center items-center relative"
				:style="{ height: heig }"
				style="background-color: white; position: absolute; width: 75%; height: 20vh; margin-top: 70%; border-radius: 13.74rpx; margin-left: 92rpx"
			>
				<view class="absolute mt60" style="font-size: 36rpx; top: 0; height: 60rpx">添加好友</view>
				<view class="flex-row text-center justify-center items-center absolute" style="width: 100%; height: 80rpx; top: 110rpx">
					<view class="flex-col text-center justify-center items-center" style="color: #999999; font-size: 36rpx">申请添加对方为</view>
					<view
						@click="
							showChecked = showChecked == true ? false : true;
							!showChecked ? (heig = '20vh') : (heig = '25vh');
						"
						class="ml15 flex-col text-center justify-center items-center"
						style="box-sizing: border-box; border: 1.14rpx solid #999999; border-radius: 13.74rpx; width: 159.16rpx; height: 60.46rpx"
					>
						{{ role == 1 ? '客户' : '供应商' }}
					</view>
					<view class="ml10">
						<u-icon v-if="!showChecked" name="arrow-down-fill" color="#000000" size="15"></u-icon>
						<u-icon v-if="showChecked" name="arrow-up-fill" color="#000000" size="15"></u-icon>
					</view>
				</view>
				<view v-if="!showChecked" class="u-border-top flex-row absolute" style="width: 100%; height: 104rpx; bottom: 0" @tap.stop>
					<view
						@click="
							showSF = false;
							init();
						"
						class="onsm u-border-right flex-col text-center justify-center items-cente"
						style="width: 50%; height: 100%"
					>
						取消
					</view>
					<view @click="addFriend(sm)" class="oksm flex-col text-center justify-center items-center" style="width: 50%; height: 100%">确认</view>
				</view>
				<view v-if="showChecked" class="u-border-top flex-col absolute mt20" style="width: 100%; height: 200rpx; bottom: 0" @tap.stop>
					<view
						@click="
							role = 1;
							showChecked = false;
							heig = '20vh';
						"
						class="flex-row items-center ml36 mt25 pl20 relative"
						style="height: 70rpx; width: 510rpx; border-radius: 6rpx"
						:style="{
							backgroundColor: role == 1 ? '#ECFAF4' : '#FBFBFB',
							color: role == 1 ? '#01BB74' : '#333333'
						}"
					>
						<view>客户</view>
						<view v-if="role == 1" class="absolute" style="right: 20rpx">
							<u-icon name="https://res-oss.elist.com.cn/wxImg/code/check.svg" size="28rpx"></u-icon>
						</view>
					</view>
					<view
						@click="
							role = 0;
							showChecked = false;
							heig = '20vh';
						"
						class="flex-row items-center ml36 mt10 pl20 relative"
						style="height: 70rpx; width: 510rpx; border-radius: 6rpx"
						:style="{
							backgroundColor: role == 0 ? '#ECFAF4' : '#FBFBFB',
							color: role == 0 ? '#01BB74' : '#333333'
						}"
					>
						<view>供应商</view>
						<view v-if="role == 0" class="absolute" style="right: 20rpx">
							<u-icon name="https://res-oss.elist.com.cn/wxImg/code/check.svg" size="28rpx"></u-icon>
						</view>
					</view>
				</view>
			</div>
		</up-overlay>
	</view>
</template>

<script>
import UQRCode from '@/components/uqrcode.js';
import html2canvas from 'html2canvas';
export default {
	data() {
		return {
			scanQRcodesData: {
				phone: ''
			},
			showSF: false,
			checked: '供应商',
			showChecked: false,
			heig: '20vh',
			role: 0,
			sm: ''
		};
	},
	mounted() {},
	onShow() {
		var role = this.vuex_userRole == 'R';
		if (role) {
			this.checked = '供应商';
		} else {
			this.checked = '客户';
		}
		var workIF = this.vuex_user.data.work != '0';

		this.scanQRcodesData.phone = this.vuex_user.phone;

		this.init();
	},
	methods: {
		scanQRcodes() {
			const that = this;
			uni.scanCode({
				success: (res) => {
					that.scanResult = res.result;
					console.log('扫码:', res);
					var json = JSON.parse(that.scanResult);
					console.log('扫码:', json);
					that.sm = json;
					that.showSF = true;
				},
				fail: (err) => {
					console.error('扫码失败:', err);
				}
			});
		},
		addFriend(json) {
			var addPhone = json.phone;
			var phone = this.vuex_user.phone;
			var work = this.vuex_user.data.work == '1';
			var img = this.vuex_user.data.headPortrait;
			var aName = this.vuex_user.data.nickName || phone;
			var identy = '';
			var aBossNumber = phone;

			if (addPhone == phone) {
				this.showSF = false;
				this.$u.toast('请勿添加自己~');
				this.init();
				return;
			}

			if (work) {
				identy = this.vuex_user.workData.identity;
				aBossNumber = this.vuex_user.workData.bossNumber;
				if (aBossNumber == phone) {
					this.showSF = false;
					this.$u.toast('请勿添加自己老板~');
					this.init();
					return;
				}
				var boss = this.vuex_user.workData.bossNumber;
				if (boss == dx.aBossNumber) {
					this.showSF = false;
					this.$u.toast('请勿添加自己老板~');
					return;
				}
			}

			var dx = {
				aNumber: phone,
				aBossNumber: aBossNumber,
				bBossNumber: '',
				aJobBumber: '',
				bNumber: '',
				aImg: img,
				bImg: '',
				state: '0',
				aName: '',
				port: '',
				aCompany: ''
			};

			this.$api.user.searchUser({ phone: addPhone }).then((res) => {
				console.log('(检索添加人)： ', JSON.stringify(res.data.data.map));
				var addUser = res.data.data;
				var bossAdd = addPhone;

				if (addUser.map.boss !== undefined) {
					bossAdd = addUser.map.boss;
				}
				var bImg = addUser.headPortrait;

				if (bossAdd == phone) {
					this.showSF = false;
					this.$u.toast('请勿添加自己~');
					this.init();
					return;
				}

				dx.bImg = bImg;
				dx.bNumber = addPhone;
				dx.bBossNumber = bossAdd;

				dx.port = this.role == 1 ? 'D' : 'R';

				this.$api.user.addClient(dx).then.then((res) => {
					console.log('添加申请： ' + res.data.data);
					var resAddFriend = res.data;
					this.addResAlert(resAddFriend);
				});
			});
		},
		addResAlert(data) {
			this.$u.toast(data.message);
			this.showSF = false;
			this.init();
		},
		init() {
			// 获取uQRCode实例
			var qr = new UQRCode();
			// 设置二维码内容
			qr.data = JSON.stringify(this.scanQRcodesData);
			// 设置二维码大小，必须与canvas设置的宽高一致
			qr.size = 200;
			// 调用制作二维码方法
			qr.make();
			// 获取canvas上下文
			var canvasContext = uni.createCanvasContext('qrcode', this); // 如果是组件，this必须传入
			// 设置uQRCode实例的canvas上下文
			qr.canvasContext = canvasContext;
			// 调用绘制方法将二维码图案绘制到canvas上
			qr.drawCanvas();
		},

		uiconGet(e) {
			if (e == '1') {
				uni.canvasToTempFilePath({
					canvasId: 'qrcode',
					fileType: 'png',
					quality: 1, //图片质量
					success(res) {
						console.log(res.tempFilePath, 'canvas生成图片地址');
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								uni.showToast({
									title: '图片已保存到相册'
								});
							},
							fail: (err) => {
								console.log(err);
								uni.showToast({
									title: '保存失败',
									icon: 'none'
								});
							}
						});
					}
				});
			} else if (e == '2') {
				this.scanQRcodes();
			} else if (e == '3') {
				// const canvas = html2canvas();
				//  console.log(canvas);
			}
		}
	}
};
</script>

<style scoped lang="scss">
/* 样式 */
.root {
	background-color: #01bb74;
	width: 100vw;
	height: 100vh;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	overflow: hidden;
}

.card {
	width: 100vw;
	height: 90vh;
	background-color: transparent;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;

	overflow: hidden;

	.cardCode {
		width: 70vw;
		height: 700rpx;
		background-color: #ffffff;
		margin-bottom: 10vh;
		border-radius: 36rpx;
	}

	.cardThree {
		height: 10vh;
		width: 100vw;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
}

.icon {
	padding-left: 46rpx;
	padding-right: 46rpx;
	padding-bottom: 40rpx;
}

.oksm {
	background-color: #ffffff;
}

.oksm:active {
	background-color: #f0f0f0;
}

.onsm {
	background-color: #ffffff;
}

.onsm:active {
	background-color: #f0f0f0;
}
</style>
