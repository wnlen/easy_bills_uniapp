<template>
	<view class="Index ft24" :class="vuex_userRole === 'D' ? 'Indexbg1' : 'Indexbg2'">
		<u-navbar title="" :placeholder="true" bgColor="transparent" leftIconSize="0"></u-navbar>
		<view class="flex-row justify-between items-end ml30 mr30">
			<view>
				<image v-if="isLogin" style="width: 108rpx; height: 34rpx" :src="`${ImgUrl}/wxImg/index/ydj.png`"></image>
				<image v-else style="width: 128rpx; height: 34rpx" :src="`${ImgUrl}/wxImg/index/qdl.png`" @click="goToLogin()"></image>

				<view class="ft28">送货单轻松签收</view>
			</view>
			<view class="flex-row justify-between butBox text-center ft28 ft-bold" id="box">
				<view v-for="(item, index) in roleList" :key="item.value" @click="changeRole(item.value)" :class="vuex_userRole === item.value ? 'activeBtn' : 'flex-1'">
					{{ item.name }}
				</view>
			</view>
		</view>
		<view class="bg-white radius12 mt60 ml30 mr30">
			<view class="mb54 flex-row justify-between">
				<view class="charts-box">
					<qiun-data-charts type="ring" :canvas2d="true" canvasId="myChartCanvas" :opts="ringOpts" :chartData="chartsDataPie2" />
					<view class="text-center ft-bold">
						<text class="ft24">￥</text>
						<text v-for="(item, index) in allprice.toFixed(2).toString().split('.')" :class="index == 0 ? 'ft32' : 'ft24'" :key="index">
							<text>{{ item }}</text>
							<text v-if="index === 0 && allprice.toFixed(2).toString().split('.').length > 1">.</text>
						</text>
					</view>
				</view>
				<view class="flex-col justify-around mr32 items-end pt30">
					<view class="flex-row items-center" @click="goList(ite.type)" v-for="(ite, ind) in chartsDataPie2.series[0].data" :key="ind">
						<view class="text-center ft-bold" :class="ind == 0 ? 'ft-orange' : ind == 1 ? 'ft-blue' : 'ft-green'">
							<text class="ft20">￥</text>
							<text v-for="(item, index) in ite.value.toFixed(2).toString().split('.')" :class="index == 0 ? 'ft28' : 'ft20'" :key="index">
								<text>{{ item }}</text>
								<text v-if="index === 0 && ite.value.toFixed(2).toString().split('.').length > 1">.</text>
							</text>
						</view>
						<view class="ft-gray ft28 ml11">{{ ite.name }} ></view>
					</view>
				</view>
			</view>
			<view class="flex-row justify-between pall30">
				<view
					class="flex-row items-center"
					:id="index == 0 ? 'box2' : 'box3'"
					:class="vuex_userRole === 'D' && index === 0 ? 'indexbox1 indexbox' : vuex_userRole === 'R' && index === 0 ? 'indexbox2 indexbox' : 'indexbox3 indexbox'"
					v-for="(item, index) in orderList2"
					:key="index"
					@click="goPath(item.path)"
				>
					<view class="ml10 mr10 mt8">
						<u-icon size="72rpx" :name="item.icon"></u-icon>
					</view>
					<view>
						<view class="ft36 ft-bold">
							{{ item.name }}
						</view>
						<view class="ft24 ft-color">
							{{ item.sub }}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bg-white radius12 mt30 ml30 mr30">
			<view class="flex-row flex-wrap">
				<view class="flex-col width25_ items-center relative" @click="goPath(listItem.path)" v-for="(listItem, listIndex) in iconlist" :key="listIndex">
					<view class="mt10">
						<u-icon size="80rpx" :name="listItem.icon"></u-icon>
					</view>
					<text>{{ listItem.title }}</text>
					<u-badge bgColor="#E52829" :offset="['12rpx', '50rpx']" absolute :value="listItem.count"></u-badge>
				</view>
			</view>
			<view class="flex-row justify-center pb20">
				<u-button hover-class="none" :active="false" :hair-line="false" class="no-shadow-button" :custom-style="buttonStyle" open-type="contact">
					<u-icon name="kefu-ermai" size="28rpx"></u-icon>
					<text class="ft28 ml10">客服咨询 ></text>
				</u-button>
			</view>
		</view>

		<view class="mt30 ml30 mr30 pb30">
			<u-swiper
				@click="middleClick"
				bg-color="#F6F7F7"
				:list="middleBanner.length > 0 ? middleBanner : vuex_userRole == 'R' ? middleBannerlXR : middleBannerlXD"
				imgMode="aspectFill"
				height="95"
				interval="5000"
				autoplay
				name="url"
				:effect3d="true"
				effect3d-previous-margin="-10"
				border-radius="18"
			></u-swiper>
			<!-- <image src="/static/img/index/new/banner.png" style="width: 100%;" mode="widthFix"></image> -->
		</view>

		<!-- 切换角色 -->
		<pop-role ref="popRole"></pop-role>
		<!-- 新手指引 -->
		<pop-guide :max-step="4" :guideData="functionGuideData" ref="FunctionGuide"></pop-guide>
		<!-- 自定义tab -->
		<pop-tab ref="popTab" :tabIndex="0"></pop-tab>
	</view>
</template>

<script>
export default {
	data() {
		return {
			intoView: '',
			functionGuideData: {
				step: 0,
				tips: '', // 介绍
				tipsPosition: '', // 介绍 显示位置
				btnGroupPosition: '', // 按钮组显示位置
				position: {}
			},
			buttonStyle: {
				border: 'none',
				appearance: 'none',
				outline: 'none',
				boxShadow: 'none',
				height: '100%',
				width: '100%',
				padding: '0'
			},
			middleBanner: [],
			middleBannerlXD: [
				{
					url: 'https://res-oss.elist.com.cn/advertising/free_card.png',
					jump: 'https://res-oss.elist.com.cn/advertising/free_card.png?s=1'
				}
			],
			middleBannerlXR: [
				{
					url: 'https://res-oss.elist.com.cn/advertising/banner001.jpg',
					jump: 'https://res-oss.elist.com.cn/advertising/advertising001.png?s=1'
				}
			],
			allprice: 0,
			ringOpts: {
				rotate: false,
				rotateLock: false,
				// color: ['#1890FF', '#01BB74', '#F7A944'],
				color: ['#ECECEC', '#ECECEC', '#ECECEC'],
				padding: [0, 0, 0, 0],
				width: 130,
				height: 130,
				dataLabel: false,
				enableScroll: false,
				legend: {
					show: false
				},
				title: {
					name: '总销售',
					fontSize: 14,
					color: '#333',
					offsetY: -5, // 设置与副标题的间距
					fontWeight: 'bold' // 设置加粗
				},
				subtitle: {
					name: '（今年）',
					fontSize: 10,
					color: '#333'
				},
				extra: {
					ring: {
						ringWidth: 15,
						activeOpacity: 0.5,
						activeRadius: 10,
						offsetAngle: 0,
						labelWidth: 15,
						border: true,
						borderWidth: 3,
						borderColor: '#FFFFFF'
					}
				}
			},
			chartsDataPie2: {
				series: [
					{
						data: [
							{
								name: '待签收',
								value: 0,
								type: 1
							},
							{
								name: '已签收',
								value: 0,
								type: 2
							},
							{
								name: '已收款',
								value: 0,
								type: 3
							}
						]
					}
				]
			},
			roleList: [
				{
					name: '发货端',
					value: 'D'
				},
				{
					name: '收货端',
					value: 'R'
				}
			],
			iconlist: [
				{
					title: '客户',
					icon: '/static/img/index/new/icon1.png',
					path: '/pages/subIndex/my_customer/my_customer',
					count: 0
				},
				{
					title: '商品库',
					icon: '/static/img/index/new/icon2.png',
					path: '/pages/subOrder/commodityDetails/nventoryCommodities',
					count: 0
				},
				{
					title: '草稿箱',
					icon: '/static/img/index/new/icon3.png',
					path: '/pages/subOrder/drafts',
					count: 0
				},
				{
					title: '待办事项',
					icon: '/static/img/index/new/icon4.png',
					path: '/pages/subIndex/backlog/backlog',
					count: 0
				},
				{
					title: '更多功能',
					icon: '/static/img/index/new/icon5.png',
					path: '/pages/subPack/more/more?tid=更多功能',
					count: 0
				}
			],
			orderList2: [
				{
					name: '开送货单',
					sub: '三步完成开单',
					icon: '/static/img/index/new/index1.png',
					path: '/pages/subOrder/add'
				},
				{
					name: '统计对账',
					sub: '下载统计表',
					icon: '/static/img/index/new/index2.png',
					path: '/pages/subStatistics/statistics'
				}
			]
		};
	},
	onShow() {
		this.getmiddleBanner(); //加载广告
		// 未登录状态
		if (this.vuex_user.phone == undefined || this.vuex_user.phone == '10000000000' || this.vuex_user.phone == null) {
			if (this.vuex_userRole == 'D') {
				this.middleBanner = this.middleBannerlXD;
			} else {
				this.middleBanner = this.middleBannerlXR;
			}

			//#ifdef APP
			this.goToLogin();
			//#endif
		}
		// 已登录状态
		else {
			// this.guideCourse();
		}
		// 新手指引
		if (this.isLogin) {
			this.guideCourse();
			this.getOrderDB();
		}
		this.setDR(this.vuex_userRole);
	},
	onLoad() {},
	computed: {
		isLogin() {
			if (this.vuex_token && this.vuex_user) {
				return true;
			} else {
				return false;
			}
			// return this.vuex_token && this.vuex_user?.phone;
		}
	},
	methods: {
		// 跳转订单页
		goList(val) {
			// this.current=val
			this.$u.setPinia({
				global: {
					tabIndex: val
				}
			});
			uni.switchTab({
				url: '/pages/list/list'
			});
		},
		// 新手指引
		guideCourse() {
			if (this.$u.getPinia('user.userRole') == 'D' && this.$u.getPinia('guide.guidanceD') != 1) {
				this.$refs.FunctionGuide.init();
			} else if (this.$u.getPinia('user.userRole') == 'R' && this.$u.getPinia('guide.guidanceR') != 1) {
				this.$refs.FunctionGuide.init();
			}
		},
		setFunctionGuideData(data) {
			this.functionGuideData = {
				...this.functionGuideData,
				...data
			};

			if (this.vuex_userRole == 'D') {
				this.showFunctionGuideD();
			} else {
				this.showFunctionGuideR();
			}
		},
		showFunctionGuideR() {
			if (this._step == this.functionGuideData.step) return;
			this._step = this.functionGuideData.step;
			if (this.functionGuideData.step == 1) {
				this.getElementData('#box2', (res) => {
					this.setFunctionGuideData({
						tips: '确认收货一键签单',
						btnGroupPosition: '',
						tipsPosition: {
							top: '200rpx',
							left: '0',
							backgroundImage: 'url(https://res-oss.elist.com.cn/wxImg/handbook/guide/guidanc5.png)'
						},
						position: {
							top: res.top + 'px',
							width: `${res.width}px`,
							left: '60rpx',
							height: `${res.height}px`
						}
					});
				});
			} else if (this.functionGuideData.step == 2) {
				let systemInfo = uni.getSystemInfoSync();
				let platform = systemInfo.platform;
				let osName = systemInfo.osName;
				const bottomSafeArea = systemInfo.safeAreaInsets ? systemInfo.safeAreaInsets.bottom : 0;
				var setting = platform === 'android';
				this.getElementData('#box4', (res) => {
					this.setFunctionGuideData({
						tips: '查询订单一览无余',
						btnGroupPosition: '550rpx',
						tipsPosition: {
							top: '-270rpx',
							left: '-70rpx',
							backgroundImage: 'url(https://res-oss.elist.com.cn/wxImg/handbook/guide/guidanc4.png)'
						},
						position: {
							bottom: `${bottomSafeArea}px`,
							height: '50px',
							width: '43px',
							left: `${res.left - 11}px`
						}
					});
				});
			}
		},
		showFunctionGuideD() {
			if (this._step == this.functionGuideData.step) return;
			this._step = this.functionGuideData.step;
			if (this.functionGuideData.step == 1) {
				this.getElementData('#box', (res) => {
					this.setFunctionGuideData({
						tips: '快速切换收发端口',
						btnGroupPosition: '10rpx',
						tipsPosition: {
							top: '100rpx',
							right: '0',
							backgroundImage: 'url(https://res-oss.elist.com.cn/wxImg/handbook/guide/guidanc1.png)'
						},
						img: {
							url: ''
						},
						position: {
							// 自定义导航栏
							// top: uni.upx2px(30) + this._statusBarHeight + 'px',
							top: `${res.top}px`,
							right: '32rpx',
							width: `${res.width - 1}px`,
							height: `${res.height - 1}px`
						}
					});
				});
			} else if (this.functionGuideData.step == 2) {
				this.getElementData('#box2', (res) => {
					this.setFunctionGuideData({
						tips: '简单快捷一键开单',
						btnGroupPosition: '',
						tipsPosition: {
							top: '200rpx',
							left: '0',
							backgroundImage: 'url(https://res-oss.elist.com.cn/wxImg/handbook/guide/guidanc2.png)'
						},
						position: {
							top: res.top + 'px',
							width: `${res.width}px`,
							left: '60rpx',
							height: `${res.height}px`
						}
					});
				});
			} else if (this.functionGuideData.step == 3) {
				this.getElementData('#box3', (res) => {
					this.setFunctionGuideData({
						tips: '简单快捷一键开单',
						btnGroupPosition: '',
						tipsPosition: {
							top: '200rpx',
							right: '0',
							backgroundImage: 'url(https://res-oss.elist.com.cn/wxImg/handbook/guide/guidanc3.png)'
						},
						position: {
							top: res.top + 'px',
							width: `${res.width}px`,
							right: '60rpx',
							height: `${res.height}px`
						}
					});
				});
			} else if (this.functionGuideData.step == 4) {
				let systemInfo = uni.getSystemInfoSync();
				let platform = systemInfo.platform;
				let osName = systemInfo.osName;
				const bottomSafeArea = systemInfo.safeAreaInsets ? systemInfo.safeAreaInsets.bottom : 0;
				var setting = platform === 'android';
				this.getElementData('#box4', (res) => {
					this.setFunctionGuideData({
						tips: '查询订单一览无余',
						btnGroupPosition: '550rpx',
						tipsPosition: {
							top: '-270rpx',
							left: '-70rpx',
							backgroundImage: 'url(https://res-oss.elist.com.cn/wxImg/handbook/guide/guidanc4.png)'
						},
						position: {
							bottom: `${bottomSafeArea}px`,
							height: '50px',
							width: '43px',
							left: `${res.left - 11}px`
						}
					});
				});

				this.$nextTick(() => {
					this.intoView = 'box6';
				});
			} else if (this.functionGuideData.step == 'jump') {
				this.intoView = 'top';
			}
		},
		getElementData(el, cb) {
			let query = null;
			if (this.functionGuideData.step == 4 && this.vuex_userRole == 'D') {
				query = uni.createSelectorQuery().in(this.$refs.popTab);
			} else if (this.functionGuideData.step == 2 && this.vuex_userRole == 'R') {
				query = uni.createSelectorQuery().in(this.$refs.popTab);
			} else {
				query = uni.createSelectorQuery().in(this);
			}
			query
				.select(el)
				.boundingClientRect()
				.exec((res) => {
					if (res[0]) {
						cb(res[0]);
					}
				});
		},
		goToLogin() {
			uni.navigateTo({
				url: '/pages/subUser/login'
			});
		},
		// 加载广告
		getmiddleBanner() {
			var filer = this.vuex_userRole == 'D' ? '1' : '0';
			this.$api.advert
				.getAdvertList({
					port: filer
				})
				.then((res) => {
					if (res.data.code == 401) {
						if (this.vuex_userRole == 'D') {
							this.middleBanner = this.middleBannerlXD;
						} else {
							this.middleBanner = this.middleBannerlXR;
						}
					} else {
						this.middleBanner = [];
						this.middleBanner = res.data.data;
					}
				});
		},
		// 跳转广告
		middleClick(e) {
			this.jumpToUrl(this.middleBanner[e].jump);
		},
		jumpToUrl(url) {
			if (!url) return;
			if (url.indexOf('http') < 0) {
				// 内部跳转
				uni.navigateTo({
					url: url
				});
			} else {
				// 外部跳转
				uni.previewImage({
					loop: true,
					urls: [url] //可以展示imgUrl 列表中所有的图片
				});
			}
		},
		setDR(value) {
			if (value === 'D') {
				this.chartsDataPie2 = {
					series: [
						{
							data: [
								{
									name: '待签收',
									value: 0,
									type: 1
								},
								{
									name: '已签收',
									value: 0,
									type: 2
								},
								{
									name: '已收款',
									value: 0,
									type: 3
								}
							]
						}
					]
				};
				this.ringOpts = {
					rotate: false,
					rotateLock: false,
					// color: ['#1890FF', '#01BB74', '#F7A944'],
					color: ['#ECECEC', '#ECECEC', '#ECECEC'],
					padding: [0, 0, 0, 0],
					width: 130,
					height: 130,
					dataLabel: false,
					enableScroll: false,
					legend: {
						show: false
					},
					title: {
						name: '总销售',
						fontSize: 14,
						color: '#333',
						offsetY: -5, // 设置与副标题的间距
						fontWeight: 'bold' // 设置加粗
					},
					subtitle: {
						name: '（今年）',
						fontSize: 10,
						color: '#333'
					},
					extra: {
						ring: {
							ringWidth: 15,
							activeOpacity: 0.5,
							activeRadius: 10,
							offsetAngle: 0,
							labelWidth: 15,
							border: true,
							borderWidth: 3,
							borderColor: '#FFFFFF'
						}
					}
				};
				this.iconlist = [
					{
						title: '客户',
						icon: '/static/img/index/new/icon1.png',
						path: '/pages/subIndex/my_customer/my_customer',
						count: 0
					},
					{
						title: '商品库',
						icon: '/static/img/index/new/icon2.png',
						path: '/pages/subOrder/commodityDetails/nventoryCommodities',
						count: 0
					},
					{
						title: '草稿箱',
						icon: '/static/img/index/new/icon3.png',
						path: '/pages/subOrder/drafts',
						count: 0
					},
					{
						title: '待办事项',
						icon: '/static/img/index/new/icon4.png',
						path: '/pages/subIndex/backlog/backlog',
						count: 0
					},
					{
						title: '更多功能',
						icon: '/static/img/index/new/icon5.png',
						path: '/pages/subPack/more/more?tid=更多功能',
						count: 0
					}
				];
				this.orderList2 = [
					{
						name: '开送货单',
						sub: '三步完成开单',
						icon: '/static/img/index/new/index1.png',
						path: '/pages/subOrder/add'
					},
					{
						name: '统计对账',
						sub: '下载统计表',
						icon: '/static/img/index/new/index2.png',
						path: '/pages/subStatistics/statistics'
					}
				];
			} else {
				this.ringOpts = {
					rotate: false,
					rotateLock: false,
					// color: ['#1890FF', '#01BB74', '#F7A944'],
					color: ['#ECECEC', '#ECECEC', '#ECECEC'],
					padding: [0, 0, 0, 0],
					width: 130,
					height: 130,
					dataLabel: false,
					enableScroll: false,
					legend: {
						show: false
					},
					title: {
						name: '总销售',
						fontSize: 14,
						color: '#333',
						offsetY: -5, // 设置与副标题的间距
						fontWeight: 'bold' // 设置加粗
					},
					subtitle: {
						name: '（今年）',
						fontSize: 10,
						color: '#333'
					},
					extra: {
						ring: {
							ringWidth: 15,
							activeOpacity: 0.5,
							activeRadius: 10,
							offsetAngle: 0,
							labelWidth: 15,
							border: true,
							borderWidth: 3,
							borderColor: '#FFFFFF'
						}
					}
				};
				this.chartsDataPie2 = {
					series: [
						{
							data: [
								{
									name: '待确收',
									value: 0,
									type: 1
								},
								{
									name: '已签收',
									value: 0,
									type: 2
								},
								{
									name: '已付款',
									value: 0,
									type: 3
								}
							]
						}
					]
				};
				this.iconlist = [
					{
						title: '供应商',
						icon: '/static/img/index/new/icon1.png',
						path: '/pages/subIndex/my_customer/my_customer',
						count: 0
					},
					{
						title: '待办事项',
						icon: '/static/img/index/new/icon4.png',
						path: '/pages/subIndex/backlog/backlog',
						count: 0
					},
					{
						title: '付款单列表',
						icon: '/static/img/index/new/icon6.png',
						path: '/pages/subStatistics/receipt/bill_receipt?tid=付款单列表',
						count: 0
					},
					{
						title: '开付款单',
						icon: '/static/img/index/new/icon7.png',
						path: '/pages/subStatistics/receipt/receipt?tid=开付款单',
						count: 0
					},

					{
						title: '更多功能',
						icon: '/static/img/index/new/icon5.png',
						path: '/pages/subPack/more/more?tid=更多功能',
						count: 0
					}
				];
				this.orderList2 = [
					{
						name: '送货单签收',
						sub: '在线电子签署',
						icon: '/static/img/index/new/index3.png',
						path: '/pages/subPack/pending/pending'
					},
					{
						name: '统计对账',
						sub: '下载统计表',
						icon: '/static/img/index/new/index2.png',
						path: '/pages/subStatistics/statistics'
					}
				];
			}
		},
		/*切换角色  */
		changeRole(value) {
			this.$u.setPinia({
				user: {
					userRole: value
				}
			});
			if (this.isLogin) {
				this.guideCourse();
			}
			this.setDR(value);
			this.getOrderDB();
		},
		// 待办事项
		getOrderDB() {
			this.$u.getPinia('user.user.data.work');
			var workIF = this.vuex_user.data.work == '0';
			var dx = {
				bUser: '',
				bBoss: '',
				port: this.vuex_userRole
			};
			if (workIF) {
				dx.bBoss = this.vuex_user.phone;
			} else {
				var identity = this.vuex_user.workData.identity;
				if (identity == '4') {
					dx.bBoss = this.vuex_user.workData.bossNumber;
					dx.bUser = this.vuex_user.phone;
				} else if (identity == '1') {
					dx.bBoss = this.vuex_user.workData.bossNumber;
					// dx.bUser = this.vuex_user.workData.bossNumber
				} else {
					dx.bBoss = this.vuex_user.workData.bossNumber;
					dx.bUser = this.vuex_user.phone;
				}
			}

			this.$api.order.getOrderDraftList(dx).then((res) => {
				if (this.$u.getPinia('user.userRole') == 'D') {
					this.iconlist[3].count = res.data.data[0];
				} else {
					this.iconlist[2].count = res.data.data[0];
				}
			});
		}
	}
};
</script>

<style>
.no-shadow-button,
.no-shadow-button:active,
.no-shadow-button:focus,
::v-deep .u-button:before {
	--u-button-shadow: none !important; /* 确保长按时也没有阴影 */
	background: transparent !important;
}
</style>

<style lang="scss" scoped>
.Index {
	min-height: 100vh;
}

.Indexbg1 {
	background: url('https://res-oss.elist.com.cn/wxImg/index/indexbg.png') no-repeat left top #f6f7f7;
	background-size: 100% auto;
}

.Indexbg2 {
	background: url('https://res-oss.elist.com.cn/wxImg/index/indexR.png') no-repeat left top #f6f7f7;
	background-size: 100% auto;
}

.charts-box {
	width: 290rpx;
	height: 290rpx;
}

.butBox {
	width: 260rpx;
	background: #fff;
	border-radius: 214rpx;
	border: 2rpx solid #fdb728;
	color: #fdb728;
	> view {
		line-height: 54rpx;

		&.activeBtn {
			color: #fff;
			border-radius: 214rpx;
			background: #fdb728;
			width: 144rpx;
		}
	}
}

.indexbox {
	width: 294rpx;
	height: 146rpx;
	border-radius: 27.54rpx;

	image {
		width: 72rpx;
	}
}

.indexbox1 {
	background: #fff9ec;
	border: 2.2rpx solid #ff8f1f;
	color: #ff8f1f;
}

.indexbox2 {
	background: #fff9ec;
	border: 2.2rpx solid #ffc300;
	color: #ffc300;
}

.indexbox3 {
	background: #ecf3ff;
	border: 2.2rpx solid #3465ff;
	color: #3465ff;
}
</style>
