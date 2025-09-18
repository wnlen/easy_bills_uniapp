<template>
	<view class="content bg-gray">
		<view
			class="user-top flex-col items-center pt20 pl30 pr30 pb30"
			style="z-index: 1; background-color: #ffffff"
			:style="{ backgroundImage: pinia_userRole == 'R' ? 'url(' + backgroundImage[0] + ')' : 'url(' + backgroundImage[1] + ')' }"
		>
			<view class="flex-row items-center flex-1" style="width: 100vw; margin-top: 2.5vh">
				<view class="flex-row flex-1 ml24 items-center" style="">
					<view>
						<!-- #ifdef MP-WEIXIN -->
						<view v-if="pinia_token">
							<up-avatar
								size="60"
								:src="pinia_user.data.headPortrait == null ? ImgUrl + '/wxImg/index/mr.svg' : pinia_user.data.headPortrait"
								@click="userClick"
							></up-avatar>
						</view>
						<view v-else>
							<up-avatar size="60" :src="ImgUrl + '/wxImg/index/mr.svg'" @click="userClick"></up-avatar>
						</view>
						<!-- #endif -->
						<!-- #ifdef APP -->
						<up-avatar size="60" src="https://res-oss.elist.com.cn/wxImg/index/mr.svg" @click="userClick"></up-avatar>
						<!-- #endif -->
					</view>
					<view class="flex-col justify-left ml20" style="width: 100%">
						<view class="flex-row justify-left items-center" style="" @click="userClick">
							<view class="ml15">
								<view class="ft-color ft42 ft-zjj-1" style="font-weight: 500">
									{{ pinia_user.phone == undefined ? '请登录~' : userName(pinia_user.data.name) || '设置用户名~' }}
								</view>
							</view>
							<view class="flex-row justify-between ml20" style="width: 120rpx; height: 60rpx" v-if="pinia_user.data">
								<image v-if="pinia_user.data.work != '1'" src="https://res-oss.elist.com.cn/wxImg/user/zzh.svg" style="width: 100%; height: 100%"></image>
								<view v-if="pinia_user.data.work == '1'" style="width: 100%; height: 100%">
									<image
										v-if="pinia_user.workData.identity == '1'"
										src="https://res-oss.elist.com.cn/wxImg/user/hhr.svg"
										style="width: 100%; height: 100%"
									></image>
									<image
										v-if="pinia_user.workData.identity == '3'"
										src="https://res-oss.elist.com.cn/wxImg/user/cw.svg"
										style="width: 100%; height: 100%"
									></image>
									<image
										v-if="pinia_user.workData.identity == '4'"
										src="https://res-oss.elist.com.cn/wxImg/user/yg.svg"
										style="width: 100%; height: 100%"
									></image>
								</view>
							</view>
						</view>

						<view class="flex-col justify-left mt20" style="">
							<view class="ft-zjj-05" @click="userClick">
								<view class="flex-row items-center">
									<up-icon size="50rpx" :name="ImgUrl + '/wxImg/user/my-phone.png'"></up-icon>
									<text class="pb5" style="color: #525252">{{ pinia_user.phone || '***********' }}</text>
								</view>
							</view>
							<view class="">
								<view class="ft-zjj-05" @click="userClick">
									<view class="flex-row items-center">
										<up-icon size="50rpx" :name="ImgUrl + '/wxImg/user/my-emp.png'"></up-icon>

										<!-- 										<text class="pb5"
											style="color: #525252;">{{(pinia_user.ac?pinia_user.ac.enterpriseName:'未完善公司信息')}}</text> -->
										<text class="pb5" style="color: #525252">
											{{ pinia_user.ac ? (pinia_user.ac.enterpriseName ? pinia_user.ac.enterpriseName : '***********') : '未完善公司信息' }}
										</text>
									</view>
								</view>
								<view class="items-center absolute" @click="generateCode" style="right: 5%; top: 14%">
									<up-icon size="70rpx" :name="ImgUrl + '/wxImg/user/QRCode.svg'"></up-icon>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="user-menu" style="position: relative; z-index: 10">
			<view class="card flex-row bg-white mt25 ml24 mr24 cardShowPlus" style="border-radius: 6px; height: 12vh">
				<view class="icon" style="" id="box">
					<view class="" @click="menuClick(menusIcon[0])">
						<up-icon size="100rpx" :name="ImgUrl + '/wxImg/user/wddd.png'"></up-icon>

						<view>我的订购</view>
					</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<view class="icon" @click="menuClick(menusIcon[1])">
					<view class="">
						<up-icon size="100rpx" :name="ImgUrl + '/wxImg/user/grzl.png'"></up-icon>

						<view>个人资料</view>
					</view>
				</view>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<view class="icon" @click="menuClick('/pages/subAuth/dataAuthentication/dataAuthentication')">
					<view class="">
						<up-icon size="100rpx" :name="ImgUrl + '/wxImg/user/grzl.png'"></up-icon>
						<view>资料认证</view>
					</view>
				</view>
				<!-- #endif -->
				<view class="icon" @click="menuClick(menusIcon[2])">
					<view class="">
						<up-icon size="100rpx" :name="ImgUrl + '/wxImg/user/rygl.png'"></up-icon>

						<view>人员管理</view>
					</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<view class="icon" @click="menuClick(menusIcon[3])">
					<view class="">
						<up-icon size="100rpx" :name="ImgUrl + '/wxImg/user/qsgl.png'"></up-icon>

						<view>签收管理</view>
					</view>
				</view>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<view class="icon" @click="menuClick('/pages/subAuth/mySignature')">
					<view class="">
						<up-icon size="100rpx" :name="ImgUrl + '/wxImg/user/qsgl.png'"></up-icon>

						<view>我的签名</view>
					</view>
				</view>
				<!-- #endif -->
			</view>
			<view
				class="card flex-row mt25 ml24 ml24 cardShowPlus justify-center items-center pb5 pt5"
				style="border-radius: 6px; width: 94vw; height: auto; background-color: white"
			>
				<view class="" style="width: 94%">
					<up-cell-group :border="false">
						<up-cell :title="menus[0].name" :titleStyle="{ color: '#666666' }" isLink @click="menuClick(menus[0])">
							<template #icon>
								<up-icon slot="icon" size="40rpx" :name="ImgUrl + menus[0].icon" color="#999" :customStyle="{ marginRight: '20rpx' }"></up-icon>
							</template>
						</up-cell>
						<up-cell :titleStyle="{ color: '#666666' }" v-for="(item, index) in filteredMenus" :key="index" :title="item.name" isLink @click="menuClick(item)">
							<template #icon>
								<up-icon slot="icon" size="40rpx" :name="ImgUrl + item.icon" color="#999" :customStyle="{ marginRight: '20rpx' }"></up-icon>
							</template>
						</up-cell>
						<up-cell :titleStyle="{ color: '#666666' }" :title="menus[menus.length - 1].name" isLink @click="menuClick(menus[menus.length - 1])" :border="false">
							<template #icon>
								<up-icon slot="icon" size="40rpx" :name="ImgUrl + menus[menus.length - 1].icon" color="#999" :customStyle="{ marginRight: '20rpx' }"></up-icon>
							</template>
						</up-cell>
					</up-cell-group>
				</view>
			</view>
		</view>

		<!-- 自定义tab -->
		<pop-tab :tabIndex="3" ref="popTab"></pop-tab>

		<pop-guide :max-step="3" :guideData="functionGuideData" ref="FunctionGuide"></pop-guide>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tabHight: '50px',
			backgroundImage: ['https://res-oss.elist.com.cn/wxImg/index/indexR.png', 'https://res-oss.elist.com.cn/wxImg/index/indexbg.png'],
			eye: 1,
			price: 0,
			pricb: 0,
			menusIcon: [
				{
					id: 1,
					verify: true,
					verifyLogin: true,
					name: '我的订单',
					icon: 'level',
					url: '/pages/subPack/user/my_order/my_order'
				},
				{
					id: 2,
					verify: false,
					verifyLogin: true,
					name: '个人资料',
					icon: 'error-circle',
					url: '/pages/subUser/userinfo'
				},
				{
					id: 3,
					verify: false,
					verifyLogin: true,
					name: '人员管理',
					icon: 'integral',
					info: '',
					url: '/pages/subPack/user/people/people'
				},
				{
					id: 4,
					verify: false,
					verifyLogin: true,
					name: '签收人管理',
					icon: 'man-add',
					url: '/pages/subPack/user/signee/signee'
				}
			],
			menus: [
				// #ifdef MP-WEIXIN
				{
					name: '公司资料',
					icon: '/wxImg/user/rz.svg',
					url: '/pages/subAuth/auth',
					verify: false,
					verifyLogin: true
				},
				// #endif
				// #ifndef MP-WEIXIN
				{
					name: '法律签署设置',
					icon: '/wxImg/user/rz.svg',
					url: '/pages/subAuth/legalSignature',
					verify: false,
					verifyLogin: true
				},
				// #endif
				{
					name: '操作手册',
					icon: '/wxImg/user/czsc-g.svg',
					url: '/pages/subPack/handbook/handbook',
					verify: false,
					verifyLogin: false
				},
				{
					name: '打印机配置',
					icon: '/wxImg/user/dyj-a.svg',
					url: '/pages/subUser/printer/printer',
					verify: false,
					verifyLogin: true
				},
				{
					name: '系统设置',
					icon: '/wxImg/user/xtsz.svg',
					url: '/pages/subUser/system/system',
					verify: false,
					verifyLogin: true
				},
				{
					name: '账号与安全',
					icon: '/wxImg/user/zhgl-g.svg',
					url: '/pages/subUser/setting',
					verify: false,
					verifyLogin: true
				},
				{
					name: '分享给好友',
					icon: '/wxImg/user/share_icon.svg',
					url: '/pages/user/share',
					verify: false,
					verifyLogin: true
				}
			],
			subjectRole: {
				1: '老板',
				2: '财务',
				3: '现场管理',
				4: '合伙人'
			},
			intoView: '',
			guidancePage: 1,
			functionGuideData: {
				step: 0,
				tips: '', // 介绍
				tipsPosition: '', // 介绍 显示位置
				btnGroupPosition: '', // 按钮组显示位置
				position: {}
			}
		};
	},
	computed: {
		filteredMenus() {
			return this.menus.slice(1, -1);
		}
	},
	onLoad(option) {
		// this.guideCourse()
		this.$getModel((value) => {
			if (value) {
				this.tabHight = value;
				// 在这里可以根据获取到的值进行其他操作
			} else {
				this.tabHight = value;
			}
		});
	},
	onShow() {
		if (this.pinia_user.phone != undefined) {
			this.$loadUser(this);
			// this.guideCourse();
			this.$refs.popTab.getMessNum();
		} else {
			console.log('未登录');
		}
	},
	methods: {
		guideCourse() {
			if (this.pinia_user.phone != undefined) {
				console.log(11, this.$u.getPinia('guide.guidanceD'));
				if (this.$u.getPinia('guide.guidanceD') != 1 && this.pinia_userRole == 'D') {
					this.guide();
				}
			}
		},
		guide() {
			this._statusBarHeight = 44 + uni.getSystemInfoSync().statusBarHeight;
			this.$refs.FunctionGuide.init();
		},
		setFunctionGuideData(data) {
			this.functionGuideData = {
				...this.functionGuideData,
				...data
			};

			if (this.pinia_userRole == 'D') {
				this.showFunctionGuideD();
			} else {
				// this.showFunctionGuideR()
			}
		},
		showFunctionGuideR() {},
		showFunctionGuideD() {
			if (this._step == this.functionGuideData.step) return;
			this._step = this.functionGuideData.step;
			if (this.functionGuideData.step == 1) {
				this.getElementData('#box', (res) => {
					this.setFunctionGuideData({
						tips: '介绍模块1，简述一下模块功能',
						btnGroupPosition: '10rpx',
						tipsPosition: {
							top: '150rpx',
							left: '0',
							backgroundImage: 'url(https://res-oss.elist.com.cn/wxImg/handbook/guide/stepD4.png)'
						},
						position: {
							// 自定义导航栏
							// top: uni.upx2px(30) + this._statusBarHeight + 'px',
							top: `${res.top + res.height / 7}px`,
							left: '24px',
							width: `${res.width / 1.3}px`,
							height: `${res.height / 1.2}px`
						}
					});
				});
				this.$u.setPinia({
					guide: {
						guidanceD: 1
					}
				});
			}
		},
		getElementData(el, cb) {
			const query = uni.createSelectorQuery().in(this);
			query
				.select(el)
				.boundingClientRect()
				.exec((res) => {
					if (res[0]) {
						cb(res[0]);
					}
				});
		},
		generateCode() {
			if (!this.pinia_token) {
				uni.navigateTo({
					url: '/pages/subUser/login'
				});
				return;
			} else {
				uni.navigateTo({
					url: '/pages/subPack/user/QRcode/QRcode'
				});
			}
		},
		eyeClick() {
			if (this.eye == 1) {
				this.eye = 0;
				this.pricb = this.price;
				this.price = '***';
			} else {
				this.eye = 1;
				this.price = this.pricb;
			}
		},
		userClick() {
			if (!this.pinia_token) {
				uni.navigateTo({
					url: '/pages/subUser/login'
				});
				return;
			} else {
				uni.navigateTo({
					url: '/pages/subUser/userinfo'
				});
			}
		},
		menuClick(val) {
			if (!this.pinia_token && val.verifyLogin) {
				uni.navigateTo({
					url: '/pages/subUser/login'
				});
				return;
			}

			if (val.verify) {
				this.$loadUser(this);
				var ifwork = this.pinia_user.data.work != '0';
				if (ifwork) {
					// this.$u.toast("您没有访问权限");
					uni.navigateTo({
						url: '/pages/subPack/noAccess/noAccess'
					});
					return;
				}
			}

			let that = this;
			if (val.url) {
				if (that.$u.test.url(val.url)) {
					uni.navigateTo({
						url: '/pages/webview/webview?url=' + val.url
					});
				}
				uni.navigateTo({
					url: val.url
				});
			}
		},
		userName(str) {
			if (!str) return '';
			if (str.length > 7) {
				return str.slice(0, 7) + '...';
			} else {
				return str;
			}
		}
	}
};
</script>

<style scoped lang="scss">
.content {
	max-width: 100vw;
	height: 100vh;
	overflow: hidden;
}
::v-deep .u-cell__body {
	padding: 30rpx !important;
}
::v-deep .u-line {
	border-color: #f4f4f4 !important;
}
.content::-webkit-scrollbar {
	/* Chrome, Safari, Opera */
	display: none;
}

.user-top {
	width: 100%;
	height: 380rpx;
	background-size: cover;
}

.user-menu {
	background: #f4f4f4;
	min-height: 200rpx;
	margin-top: -30rpx;
	border-top-left-radius: 18rpx;
	border-top-right-radius: 18rpx;
}

.mine-border {
	border: 1rpx solid #fff;
	border-radius: 100rpx;
	padding: 1rpx 15rpx 1rpx 10rpx;
	color: #fff;
}

.u-card-wrap {
	background-color: $u-bg-color;
	padding: 1px;
}

.u-body-item {
	font-size: 32rpx;
	color: #333;
	padding: 20rpx 10rpx;
}

.u-body-item image {
	width: 120rpx;
	flex: 0 0 120rpx;
	height: 120rpx;
	border-radius: 8rpx;
	margin-left: 12rpx;
}

.cen {
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.cenT {
	color: #aaaaaa;
	font-size: 12px;
}

.cenN {
	font-weight: bold;
	color: #000000;
	font-size: 17px;
}

.icon {
	width: 25%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
	::v-deep image {
		margin: 0 auto;
	}
}
</style>
