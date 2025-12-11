<template>
	<view class="Index ft24" :class="pinia_userRole === 'D' ? 'Indexbg1' : 'Indexbg2'">
		<up-navbar title="" :placeholder="true" bgColor="transparent" leftIconSize="0"></up-navbar>
		<view class="flex-row justify-between items-end ml30 mr30">
			<view>
				<image v-if="pinia_token" style="width: 108rpx; height: 34rpx" :src="`${ImgUrl}/wxImg/index/ydj.png`"></image>
				<image v-else style="width: 128rpx; height: 34rpx" :src="`${ImgUrl}/wxImg/index/qdl.png`" @click="clicklogin"></image>

				<view class="ft28">送货单轻松签收</view>
			</view>
			<view class="flex-row justify-between text-center ft28 ft-bold" id="box">
				<wd-segmented :options="segmentedList" v-model:value="current" size="middle" @change="changeRole(current)"></wd-segmented>
			</view>
		</view>
		<view class="bg-white radius12 mt60 ml30 mr30">
			<view class="mb54 flex-row justify-between">
				<view class="charts-box relative" @touchmove.stop.prevent>
					<qiun-data-charts
						type="ring"
						:animation="false"
						:tooltipShow="false"
						:canvas2d="true"
						canvasId="mQeRxIXWgXIzJwrjsSJdlsgpudfZgkIY"
						:opts="ringOpts"
						:chartData="chartsDataPie2"
					/>
					<view class="text-center ft-bold">
						<text class="ft24" v-if="!(pinia_userRole == 'D' && uni.$u.getPinia('user.customized'))">￥</text>
						<text v-for="(item, index) in formatAmount(allprice).split('.')" :class="index == 0 ? 'ft32' : 'ft24'" :key="index">
							<text>{{ item }}</text>
							<text v-if="index === 0 && formatAmount(allprice).split('.').length > 1">.</text>
						</text>
					</view>
				</view>
				<view class="flex-col justify-around mr24 items-end pt30">
					<view class="flex-row items-center" @click="goList(ite.type)" v-for="(ite, ind) in rawData" :key="ind">
						<view class="text-center ft-bold" :class="ind == 0 ? 'ft-orange' : ind == 1 ? 'ft-blue' : 'ft-green'">
							<text class="ft20" v-if="!(pinia_userRole == 'D' && uni.$u.getPinia('user.customized'))">￥</text>
							<text v-for="(item, index) in formatAmount(ite.value).split('.')" :class="index == 0 ? 'ft28' : 'ft20'" :key="index">
								<text>{{ item }}</text>
								<text v-if="index === 0 && formatAmount(ite.value).split('.').length > 1">.</text>
							</text>
						</view>
						<view class="ft28 ml16 flex-row items-center">
							<text class="mr6">{{ ite.name }}</text>
							<wd-icon name="caret-right-small" size="40rpx" color="#999"></wd-icon>
							<!-- <wd-icon name="caret-right-small" size="22px"></wd-icon> -->
						</view>
					</view>
				</view>
			</view>
			<view class="flex-row justify-between pall30">
				<view
					class="flex-row items-center relative"
					:id="index == 0 ? 'box2' : 'box3'"
					:class="pinia_userRole === 'D' && index === 0 ? 'indexbox1 indexbox' : pinia_userRole === 'R' && index === 0 ? 'indexbox2 indexbox' : 'indexbox3 indexbox'"
					v-for="(item, index) in orderList2"
					:key="index"
					@click="goPath(item.path, index)"
					hover-class="hover-order"
				>
					<view class="ml10 mr10 mt8">
						<wd-icon size="72rpx" :name="item.icon"></wd-icon>
					</view>
					<view>
						<view class="ft36 ft-bold">
							{{ item.name }}
						</view>
						<view class="ft24 ft-color">
							{{ item.sub }}
						</view>
					</view>
					<view
						class="tags flex-row items-center justify-center ft-white"
						:style="`z-index: ${tagsIndex};`"
						v-if="pinia_userRole === 'R' && rawData[0].value && index === 0"
					>
						去签收
					</view>
				</view>
			</view>
		</view>

		<view class="bg-white radius12 mt30 ml30 mr30">
			<view class="flex-row flex-wrap">
				<view class="flex-col width25 items-center relative" hover-class="hover-view" @click="goPath2(listItem)" v-for="(listItem, listIndex) in iconlist" :key="listIndex">
					<view class="mt10">
						<wd-icon size="80rpx" :name="listItem.icon"></wd-icon>
					</view>
					<text>{{ listItem.title }}</text>
					<up-badge bgColor="#FA5151" :offset="['12rpx', '50rpx']" absolute :value="listItem.count"></up-badge>
				</view>
			</view>
			<view class="flex-row justify-center pb20">
				<up-button hover-class="none" :active="false" :hair-line="false" class="no-shadow-button" :customStyle="buttonStyle" open-type="contact">
					<wd-icon name="service" size="28rpx"></wd-icon>
					<text class="ft28 ml10">客服咨询 ></text>
				</up-button>
			</view>
		</view>

		<view class="mt30 ml30 mr30 pb150">
			<up-swiper
				@click="middleClick"
				bg-color="#F6F7F7"
				:list="middleBanner.length > 0 ? middleBanner : pinia_userRole == 'R' ? middleBannerlXR : middleBannerlXD"
				imgMode="aspectFill"
				height="95"
				interval="5000"
				autoplay
				name="url"
				:effect3d="true"
				effect3d-previous-margin="-10"
				border-radius="18"
			></up-swiper>
			<!-- <image src="https://res-oss.elist.com.cn/wxImg/index/new/banner.png" style="width: 100%;" mode="widthFix"></image> -->
		</view>
		<!-- 权限到期提示弹窗 -->
		<up-overlay :show="expireShow">
			<view class="flex-col justify-center items-center" style="width: 100%; height: 100%; background-color: transparent">
				<view
					class="flex-col justify-center items-center relative"
					style="
						width: 600rpx;
						height: 400rpx;
						background-image: url('https://res-oss.elist.com.cn/wxImg/index/xftx.png');
						background-size: 100%;
						box-sizing: border-box;
						padding-top: 28rpx;
					"
				>
					<text style="font-size: 28rpx" v-if="pinia_user.workData">该{{ pinia_user.workData.identity == 3 ? '财务' : '分管' }}人员权限已到期,请联系</text>

					<text style="font-size: 28rpx">主账号续费</text>

					<view class="absolute flex-col justify-center items-center" style="bottom: 0; height: 140rpx; width: 100%">
						<view
							@click="exit"
							class=""
							style="
								background: #00d081;
								width: 280rpx;
								height: 68rpx;
								border-radius: 760rpx;
								display: flex;
								justify-content: center;
								align-items: center;
								font-size: 28rpx;
								color: #fff;
								font-weight: bold;
							"
						>
							确认
						</view>
					</view>
				</view>
			</view>
		</up-overlay>
		<!-- 切换角色 -->
		<pop-role ref="popRole"></pop-role>
		<!-- 新手指引 -->
		<pop-guide :max-step="4" :guideData="functionGuideData" ref="FunctionGuide" @step-change="onGuideStepChange" @finished="onGuideFinished"></pop-guide>
		<!-- 自定义tab -->
		<!-- #ifdef APP -->
		<pop-tab ref="popTab" :tabIndex="0" v-if="showTab"></pop-tab>
		<!-- #endif -->
		<!-- #ifndef APP -->
		<pop-tab ref="popTab" :tabIndex="0"></pop-tab>
		<!-- #endif -->
		<!-- 未签收提醒 -->
		<up-popup :show="showUnreceived" :safeAreaInsetBottom="false" mode="center" :customStyle="unreceivedStyle">
			<view class="unreceivedBox">
				<view class="mb10 unreceivedTitle">小易提醒您:</view>
				<view class="">
					<text>近期有多个订单未签收，可进入“</text>
					<text
						class="ft-green"
						@click="
							uni.$emit('switchTabToList');
							uni.switchTab({
								url: '/pages/list/list'
							});
						"
					>
						查单
					</text>
					<text>”转发分享进行送货单签收。或者养成开单后立即分享给签收人，提示签字~</text>
				</view>
				<view class="flex-row justify-center mt10">
					<up-checkbox-group :labelSize="12" activeColor="#01bb74" shape="circle" v-model="unreceivedValue">
						<up-checkbox label="不再提醒" :name="true" :labelSize="14"></up-checkbox>
					</up-checkbox-group>
				</view>
				<view class="">
					<view class="unreceivedBtn" @click="closeUnreceived">我知道啦</view>
				</view>
			</view>
		</up-popup>
	</view>

	<!-- #ifdef APP-PLUS -->
	<!-- 悬浮按钮 -->
	<wd-fab :draggable="true" @click="openDebugger()" :expandable="false" position="right-center" inactiveIcon="error-fill"></wd-fab>
	<!-- #endif -->
</template>

<script>
import SocketManager from '@/utils/socketManager.js';
import { useSystemStore } from '@/store/system';
import { ensureFontsReady } from '@/utils/font-loader.js';
import { showDebuggerWindow } from '@/uni_modules/imengyu-IMDebuggerWindow/common/debuggerExtern.js';
import { debuggerModule, installDebugger } from '@/uni_modules/imengyu-IMDebuggerWindow/common/debuggerExtern.js';
export default {
	data() {
		return {
			current: '发货端',
			unreceivedValue: [],
			selectCurrent: 'D',
			unreceivedStyle: {
				background: 'url(https://res-oss.elist.com.cn/wxImg/index/wqstx.png) no-repeat',
				backgroundSize: '100% 100%',
				boxSizing: 'border-box',
				fontSize: '28rpx',
				lineHeight: '48rpx',
				textAlign: 'justify'
			},
			showUnreceived: false,
			CACHE_TTL_MS: 20 * 1000, // 允许缓存 60 秒，可按需调整
			lastFetchedAt: 0,
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
				padding: [0, 0, 0, 0],
				color: ['#ECECEC', '#ECECEC', '#ECECEC'],
				width: 130,
				height: 130,
				dataLabel: false,
				enableScroll: false,
				legend: {
					show: false
				},
				title: {
					name: '总供应',
					fontSize: 14,
					color: '#333',
					offsetY: -5, // 设置与副标题的间距
					fontWeight: 'bold' // 设置加粗
				},
				subtitle: {
					name: '（2025年）',
					fontSize: 11,
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
						borderWidth: 1,
						borderColor: '#FFFFFF'
					}
				}
			},
			rawData: [
				// 原始数据（差距过大）
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
			],
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
			segmentedList: [
				{
					value: '发货端',
					disabled: false
				},
				{
					value: '收货端',
					disabled: false
				}
			],
			iconlistD: [
				{
					title: '客户',
					icon: 'https://res-oss.elist.com.cn/wxImg/index/new/icon1.png',
					path: '/pages/subIndex/my_customer/my_customer',
					count: 0
				},
				{
					title: '商品库',
					icon: 'https://res-oss.elist.com.cn/wxImg/index/new/icon2.png',
					path: '/pages/subOrder/commodityDetails/nventoryCommodities',
					count: 0
				},
				{
					title: '草稿箱',
					icon: 'https://res-oss.elist.com.cn/wxImg/index/new/icon3.png',
					path: '/pages/subOrder/drafts',
					count: 0
				},
				{
					title: '待办事项',
					icon: 'https://res-oss.elist.com.cn/wxImg/index/new/icon4.png',
					path: '/pages/subIndex/backlog/backlog',
					count: 0
				},
				{
					title: '更多功能',
					icon: 'https://res-oss.elist.com.cn/wxImg/index/new/icon5.png',
					path: '/pages/subPack/more/more?tid=更多功能',
					count: 0
				}
			],
			iconlistR: [
				{
					title: '供应商',
					icon: 'https://res-oss.elist.com.cn/wxImg/index/new/icon1.png',
					path: '/pages/subIndex/my_customer/my_customer',
					count: 0
				},
				{
					title: '待办事项',
					icon: 'https://res-oss.elist.com.cn/wxImg/index/new/icon4.png',
					path: '/pages/subIndex/backlog/backlog',
					count: 0
				},
				{
					title: '付款单列表',
					icon: 'https://res-oss.elist.com.cn/wxImg/index/new/icon6.png',
					path: '/pages/subStatistics/receipt/bill_receipt?tid=付款单列表',
					count: 0
				},
				{
					title: '开付款单',
					icon: 'https://res-oss.elist.com.cn/wxImg/index/new/icon7.png',
					path: '/pages/subStatistics/receipt/receipt?tid=开付款单',
					count: 0
				},
				{
					title: '更多功能',
					icon: 'https://res-oss.elist.com.cn/wxImg/index/new/icon5.png',
					path: '/pages/subPack/more/more?tid=更多功能',
					count: 0
				}
			],
			// 财务列表
			iconlistC: [
				{
					title: '客户',
					icon: 'https://res-oss.elist.com.cn/wxImg/index/new/icon1.png',
					path: '/pages/subIndex/my_customer/my_customer',
					count: 0
				},
				{
					icon: 'https://res-oss.elist.com.cn/wxImg/index/new/icon6.png',
					title: '收款单列表',
					path: '/pages/subStatistics/receipt/bill_receipt',
					count: 0
				},
				{
					icon: 'https://res-oss.elist.com.cn/wxImg/index/new/icon7.png',
					title: '开收款单',
					path: '/pages/subStatistics/receipt/receipt?tid=开收款单',
					count: 0
				},
				{
					title: '待办事项',
					icon: 'https://res-oss.elist.com.cn/wxImg/index/new/icon4.png',
					path: '/pages/subIndex/backlog/backlog',
					count: 0
				},
				{
					title: '更多功能',
					icon: 'https://res-oss.elist.com.cn/wxImg/index/new/icon5.png',
					path: '/pages/subPack/more/more?tid=更多功能',
					count: 0
				}
			],
			iconlist: [],
			orderList2: [
				{
					name: '开送货单',
					sub: '三步完成开单',
					icon: 'https://res-oss.elist.com.cn/wxImg/index/new/index1.png',
					path: '/pages/subOrder/add'
				},
				{
					name: '统计对账',
					sub: '下载统计表',
					icon: 'https://res-oss.elist.com.cn/wxImg/index/new/index2.png',
					path: '/pages/subStatistics/statistics'
				}
			],
			expireShow: false,
			unwatchFlush: null,
			daibannum: 0,
			tagsIndex: 1,
			showTab: false
		};
	},
	onLoad() {
		// 加载字体
		try {
			ensureFontsReady();
			// 字体已全局可用，后续页面直接用 font-family 即可
		} catch (e) {
			console.error('font init failed', e);
			if (debuggerModule) debuggerModule.addAppErr(e);
		}

		if (this.pinia_token) {
			const role = this.$u.getPinia('user.userRole');
			const guidanceD = this.$u.getPinia('guide.guidanceD');
			const identity = this.pinia_user.workData.identity;
			// 权限是否过期
			if (this.pinia_user.workData.endTime == 0 || this.pinia_user.workData.endTime == 'null') {
				return;
			}
			// 只有发货端弹出提醒 财务不弹
			if (role === 'D' && guidanceD === 1 && identity != 3) {
				this.openUnreceived();
			}
		}
	},
	onHide() {
		this.showTab = false;
	},
	onShow() {
		this.showTab = true;
		// #ifndef MP-WEIXIN
		uni.hideTabBar();
		// #endif
		const net = uni.$u.getPinia('system.NET_CONNECTED'); // 读取网络状态
		const hasToken = !!this.pinia_token;
		// 本地清理无所谓
		if (uni.getStorageSync('inventoryStockpile')) {
			uni.removeStorageSync('inventoryStockpile');
		}
		// 不管有网没网，这些纯本地的不怕
		this.setDR(this.pinia_userRole);
		// ===========================
		// 1) 断网场景：只展示本地 UI，不发请求
		// ===========================
		if (net === false) {
			console.log('[首页] 当前为离线模式');
			if (!hasToken) {
				// 未登录且离线：只展示默认广告 & 静态界面
				if (this.pinia_userRole == 'D') {
					this.middleBanner = this.middleBannerlXD;
				} else {
					this.middleBanner = this.middleBannerlXR;
				}
				this.ringOpts.color = ['#ECECEC', '#ECECEC', '#ECECEC'];
			} else {
				// 已登录 + 离线：保留上一次缓存的数据即可，不再请求
				// 比如你可以从 storage 里读上次的 dashboard 缓存
				// this.dashboard = uni.getStorageSync('dashboardCache') || {}
			}
			// 给个温和提示（可选）
			uni.showToast({
				title: '当前为离线模式，部分数据无法更新',
				icon: 'none',
				duration: 2000
			});
			// 离线模式下，直接 return，不再请求网络、不建 socket
			return;
		}
		// ===========================
		// 2) 有网络：按原逻辑走
		// ===========================
		var that = this;
		this.getmiddleBanner(); //加载广告
		if (!hasToken) {
			if (this.pinia_userRole == 'D') {
				this.middleBanner = this.middleBannerlXD;
			} else {
				this.middleBanner = this.middleBannerlXR;
			}
			this.ringOpts.color = ['#ECECEC', '#ECECEC', '#ECECEC'];
		} else {
			this.$nextTick(() => {
				// 更新用户信息--权限是否过期等
				that.$loadUser && that.$loadUser(this);
				setTimeout(() => {
					// 权限是否过期
					if (this.pinia_user.workData.endTime == 0 || this.pinia_user.workData.endTime == 'null') {
						this.expireShow = true;
						return;
					}
					this.fetchDashboard(); //加载统计数据
					this.getdaiban(true); //获取待办数量
					this.$refs.popTab && this.$refs.popTab.getMessNum();

					this.guideCourse && this.guideCourse();
					this.SOCKETfLUSH && this.SOCKETfLUSH();
					this.getCustomization && this.getCustomization();
				}, 300);
			});
		}
	},
	onShareAppMessage() {
		if (res.from === 'button') {
			// 来自页面内分享按钮
			// console.log(res.target)
		}
		return {
			title: '易单据，快捷开单',
			path: '/pages/index/index'
		};
	},
	methods: {
		openDebugger() {
			showDebuggerWindow(); // 打开调试窗口
		},
		goPath(path, index) {
			const identity = this.pinia_user.workData.identity;
			if (this.pinia_userRole == 'D' && index == 1 && uni.$u.getPinia('user.customized')) {
				return uni.showToast({
					title: '定制版暂不支持此功能',
					icon: 'none'
				});
			} else if (this.pinia_userRole == 'D' && index == 0 && identity == 3) {
				uni.navigateTo({
					url: '/pages/subOrder/noPermission'
				});
			} else {
				uni.navigateTo({
					url: path
				});
			}
		},
		goPath2(item) {
			if (uni.$u.getPinia('user.customized') && (item.title == '收款单列表' || item.title == '开收款单')) {
				return uni.showToast({
					title: '定制版暂不支持此功能',
					icon: 'none'
				});
			} else {
				uni.navigateTo({
					url: item.path
				});
			}
		},
		// 获取是否定制化
		getCustomization() {
			uni.$api.customization
				.customizationUpdated()
				.then((res) => {
					uni.$u.setPinia({
						user: {
							customized: res.data.data.customized
						}
					});
				})
				.catch((err) => {
					console.error('用户信息刷新失败', err);
				});
		},
		clicklogin() {
			// #ifdef APP
			this.$univerify();
			// #endif
			// #ifndef APP
			uni.navigateTo({
				url: '/pages/subUser/login'
			});
			// #endif
		},
		//监听引导页每一步位置
		onGuideStepChange({ step }) {
			console.log('监听', step);
			this.setFunctionGuideData({ step });
		},
		//设置引导步骤
		setFunctionGuideData(data) {
			this.functionGuideData = {
				...this.functionGuideData,
				...data
			};

			if (this.pinia_userRole == 'D') {
				this.showFunctionGuideD();
			} else {
				this.showFunctionGuideR();
			}
		},
		//监听引导页结束
		onGuideFinished() {
			const role = this.$u.getPinia('user.userRole');
			const identity = this.pinia_user.workData.identity;
			// 只有发货端弹出提醒 财务不弹
			if (role === 'D' && identity != 3) {
				this.openUnreceived();
			}
		},
		// 关闭未签收提醒弹窗
		closeUnreceived() {
			// 不再提醒操作
			if (this.unreceivedValue.length) {
				uni.$u.setPinia({
					guide: {
						unreceivedReminder: true
					}
				});
			}
			this.showUnreceived = false;
		},
		// 开启未签收提醒弹窗
		openUnreceived() {
			if (!uni.$u.getPinia('guide.unreceivedReminder')) {
				uni.$api.inform.getOrderNoticeReminder({}).then((res) => {
					if (res.data.code == 200) {
						this.showUnreceived = res.data.data;
					}
				});
			}
		},
		getdaiban(type) {
			var dx = {
				bUser: '',
				bBoss: '',
				type: type
			};
			if (this.pinia_user.data.work !== '1') {
				//没工作
				dx.bBoss = this.pinia_user.phone;
			} else {
				//有工作
				var identity = this.pinia_user.workData.identity;
				if (identity == '4') {
					dx.bBoss = this.pinia_user.workData.bossNumber;
					dx.bUser = this.pinia_user.phone;
				} else if (identity == '1') {
					dx.bBoss = this.pinia_user.workData.bossNumber;
					// dx.bUser = this.pinia_user.phone
				} else {
					dx.bBoss = this.pinia_user.workData.bossNumber;
					dx.bUser = this.pinia_user.workData.bossNumber;
				}
			}

			uni.$api.order.getOrderDraftLimit(dx).then((res) => {
				var getList = res.data.data.map((obj) => ({
					...obj,
					show: false
				}));

				// var filer = this.pinia_userRole == 'D';
				// if (filer) {
				// 	this.$refs.paging.complete(getList.filter((res) => res.port == 'R' || res.port == 'E'));
				// } else {
				// 	this.$refs.paging.complete(getList.filter((res) => res.port == 'D' || res.port == 'S'));
				// }

				// console.error('22222222222')
			});
		},
		fetchDashboard(isqiehuan = false) {
			// const now = Date.now();
			// console.log('this.lastFetchedAt', this.lastFetchedAt);
			// if (!isqiehuan) {
			// 	if (now - this.lastFetchedAt < this.CACHE_TTL_MS) return; // 命中 TTL，跳过
			// }
			const portType = this.pinia_userRole == 'D' ? '0' : '1'; // 0=发货端, 1=收货端
			const phone = uni.$u.getPinia('user.user.phone');
			uni.$api.dashboard
				.getDashboardOrderStatistics({
					targetPhone: phone,
					portType: portType
				})
				.then((res) => {
					this.ringOpts.color = ['#ECECEC', '#ECECEC', '#ECECEC'];
					const data = res.data.data || {};
					if (this.pinia_userRole == 'D' && uni.$u.getPinia('user.customized')) {
						this.rawData[0].value = data.pendingWeightKg ?? 0;
						this.rawData[1].value = data.signedWeightKg ?? 0;
						this.rawData[2].value = data.receivedWeightKg ?? 0;
						this.allprice = data.totalWeightKg ?? 0;
					} else {
						this.rawData[0].value = data.pendingAmount ?? 0;
						this.rawData[1].value = data.signedAmount ?? 0;
						this.rawData[2].value = data.receivedAmount ?? 0;
						this.allprice = data.totalAmount ?? 0;
					}

					// this.lastFetchedAt = now;

					if (this.allprice) {
						this.ringOpts.color = ['#F7A944', '#1890FF', '#01BB74'];
						this.chartsDataPie2.series[0].data = this.scaleData(this.rawData);
					} else {
						this.ringOpts.color = ['#ECECEC', '#ECECEC', '#ECECEC'];
						this.chartsDataPie2.series[0].data = this.scaleData(this.rawData);
					}
				});
		},
		scaleData(rawData) {
			const maxVal = Math.max(...rawData.map((item) => item.value));
			return rawData.map((item) => {
				// 若数据过小，强制设为最大值的1/20
				let scaledValue = 0;
				if (item.value > 0 && item.value < maxVal / 90) {
					scaledValue = maxVal / 90 + item.value;
				} else {
					scaledValue = item.value;
				}
				return { ...item, value: scaledValue };
			});
		},
		// 监听数据
		SOCKETfLUSH() {
			const system = useSystemStore();
			var that = this;
			this.unwatchFlush = this.$watch(
				() => system.flush, // 监听状态
				(newVal, oldVal) => {
					console.log('SOCKET监听数据', newVal);
					if (that.pinia_token) {
						that.getOrderDB();
					} else {
						// 关闭socket
						SocketManager.close();
					}
				},
				{ deep: true, immediate: true }
			);
		},
		// 跳转订单页
		goList(val) {
			// this.current=val
			this.$u.setPinia({
				global: {
					tabIndex: val
				}
			});
			uni.$emit('switchTabToList');
			// 为了下个页面能获取到数据做延迟处理
			setTimeout(() => {
				uni.switchTab({
					url: '/pages/list/list'
				});
			}, 300);
		},
		// 新手指引
		guideCourse() {
			if (this.$u.getPinia('user.userRole') === 'D' && this.$u.getPinia('guide.guidanceD') !== 1) {
				this.$refs.FunctionGuide.init();
			} else if (this.$u.getPinia('user.userRole') === 'R' && this.$u.getPinia('guide.guidanceR') !== 1) {
				this.$refs.FunctionGuide.init();
			}
		},

		showFunctionGuideR() {
			if (this._step == this.functionGuideData.step) return;
			this._step = this.functionGuideData.step;
			if (this.functionGuideData.step == 1) {
				this.tagsIndex = 20230829;
				this.getElementData('#box2', (res) => {
					this.setFunctionGuideData({
						tips: '确认收货一键签单',
						btnGroupPosition: '',
						tipsPosition: {
							top: '138rpx',
							left: '24rpx',
							backgroundImage: 'url(https://res-oss.elist.com.cn/wxImg/handbook/guide/guidanc5.png)'
						},
						position: {
							top: res.top + 'px',
							width: `${res.width}px`,
							left: `${res.left}px`,
							height: `${res.height}px`,
							borderRadius: '27.54rpx'
						}
					});
				});
			} else if (this.functionGuideData.step == 2) {
				this.tagsIndex = 1;
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
							top: '-240rpx',
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
					console.log('#box', res);
					this.setFunctionGuideData({
						tips: '快速切换收发端口',
						btnGroupPosition: '10rpx',
						tipsPosition: {
							top: '60rpx',
							right: '26rpx',
							backgroundImage: 'url(https://res-oss.elist.com.cn/wxImg/handbook/guide/guidanc1.png)'
						},
						img: {
							url: ''
						},
						position: {
							// 自定义导航栏
							// top: uni.upx2px(30) + this._statusBarHeight + 'px',
							top: `${res.top}px`,
							right: '30rpx',
							width: `${res.width}px`,
							height: `${res.height}px`,
							borderRadius: '214rpx'
						}
					});
				});
			} else if (this.functionGuideData.step == 2) {
				this.getElementData('#box2', (res) => {
					this.setFunctionGuideData({
						tips: '简单快捷一键开单',
						btnGroupPosition: '',
						tipsPosition: {
							top: '138rpx',
							left: '24rpx',
							backgroundImage: 'url(https://res-oss.elist.com.cn/wxImg/handbook/guide/guidanc2.png)'
						},
						position: {
							top: res.top + 'px',
							width: `${res.width}px`,
							left: `${res.left}px`,
							height: `${res.height}px`,
							borderRadius: '27.54rpx'
						}
					});
				});
			} else if (this.functionGuideData.step == 3) {
				this.getElementData('#box3', (res) => {
					this.setFunctionGuideData({
						tips: '简单快捷一键开单',
						btnGroupPosition: '',
						tipsPosition: {
							top: '138rpx',
							right: '26rpx',
							backgroundImage: 'url(https://res-oss.elist.com.cn/wxImg/handbook/guide/guidanc3.png)'
						},
						position: {
							top: res.top + 'px',
							width: `${res.width}px`,
							left: `${res.left}px`,
							height: `${res.height}px`,
							borderRadius: '27.54rpx'
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
							top: '-240rpx',
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
			if (this.functionGuideData.step == 4 && this.pinia_userRole == 'D') {
				query = uni.createSelectorQuery().in(this.$refs.popTab);
			} else if (this.functionGuideData.step == 2 && this.pinia_userRole == 'R') {
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
		// 加载广告
		getmiddleBanner() {
			var filer = this.pinia_userRole == 'D' ? '1' : '0';
			uni.$api.advert
				.getAdvertList({
					port: filer
				})
				.then((res) => {
					if (res.data.code == 401) {
						if (this.pinia_userRole == 'D') {
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
		// 根据定制设置发货端菜单
		setIconlistD() {
			if (uni.$u.getPinia('user.customized')) {
				this.iconlistD[4] = {
					title: '往年数据',
					icon: 'https://res-oss.elist.com.cn/wxImg/icon/icon/tb10.png',
					path: '/pages/subPack/formerYears/formerYears',
					count: 0
				};
				this.iconlistC[4] = {
					title: '往年数据',
					icon: 'https://res-oss.elist.com.cn/wxImg/icon/icon/tb10.png',
					path: '/pages/subPack/formerYears/formerYears',
					count: 0
				};
			} else {
				this.iconlistD[4] = {
					title: '更多功能',
					icon: 'https://res-oss.elist.com.cn/wxImg/index/new/icon5.png',
					path: '/pages/subPack/more/more?tid=更多功能',
					count: 0
				};
				this.iconlistC[4] = {
					title: '更多功能',
					icon: 'https://res-oss.elist.com.cn/wxImg/index/new/icon5.png',
					path: '/pages/subPack/more/more?tid=更多功能',
					count: 0
				};
			}
			if (this.pinia_user.workData.identity == '3') {
				this.iconlist = this.iconlistC;
			} else {
				this.iconlist = this.iconlistD;
			}
		},
		setDR(value) {
			this.current = value == 'D' ? '发货端' : '收货端';

			this.$set(this.ringOpts.subtitle, 'name', `（${new Date().getFullYear()}年）`);
			if (value === 'D') {
				this.rawData[0].name = '待签收';
				this.rawData[1].name = '已签收';
				this.rawData[2].name = '已收款';
				this.$set(this.ringOpts.title, 'name', '总销售');

				// 设置菜单
				this.setIconlistD();

				this.orderList2 = [
					{
						name: '开送货单',
						sub: '三步完成开单',
						icon: 'https://res-oss.elist.com.cn/wxImg/index/new/index1.png',
						path: '/pages/subOrder/add'
					},
					{
						name: '统计对账',
						sub: '下载统计表',
						icon: 'https://res-oss.elist.com.cn/wxImg/index/new/index2.png',
						path: '/pages/subStatistics/statistics'
					}
				];
			} else {
				this.rawData[0].name = '待确收';
				this.rawData[1].name = '已签收';
				this.rawData[2].name = '已付款';
				this.$set(this.ringOpts.title, 'name', '总供应');

				this.iconlist = this.iconlistR;
				this.orderList2 = [
					{
						name: '送货单签收',
						sub: '在线电子签署',
						icon: 'https://res-oss.elist.com.cn/wxImg/index/new/index3.png',
						path: '/pages/subPack/pending/pending'
					},
					{
						name: '统计对账',
						sub: '下载统计表',
						icon: 'https://res-oss.elist.com.cn/wxImg/index/new/index2.png',
						path: '/pages/subStatistics/statistics'
					}
				];
			}
		},
		/*切换角色  */
		changeRole(value) {
			value = value == '发货端' ? 'D' : 'R';
			this.setDR(value);
			this.$u.setPinia({
				user: {
					userRole: value
				}
			});
			if (this.pinia_token) {
				this.guideCourse();
				// this.getOrderDB(); //待办事项
				this.fetchDashboard(true);
			}
		},
		// 待办事项
		getOrderDB() {
			var that = this;
			var workIF = this.pinia_user.data.work == '0';
			var dx = {
				bUser: '',
				bBoss: '',
				port: this.pinia_userRole
			};
			if (workIF) {
				dx.bBoss = this.pinia_user.phone;
			} else {
				var identity = this.pinia_user.workData.identity;
				if (identity == '4') {
					dx.bBoss = this.pinia_user.workData.bossNumber;
					dx.bUser = this.pinia_user.phone;
				} else if (identity == '1') {
					dx.bBoss = this.pinia_user.workData.bossNumber;
					// dx.bUser = this.pinia_user.workData.bossNumber;
				} else {
					dx.bBoss = this.pinia_user.workData.bossNumber;
					dx.bUser = this.pinia_user.phone;
				}
			}

			const fetchOrderDraftList = (dx) => {
				uni.$api.order.getOrderDraftList(dx).then((res) => {
					if (uni.$u.getPinia('user.userRole') === 'D') {
						// console.error('获取待办事项11111111', res);
						that.iconlist[3].count = res.data.data[0];
					} else {
						that.iconlist[1].count = res.data.data[0];
					}
				});
			};

			// 使用节流：3 秒内多次触发只会调用一次
			const throttledFetchOrderDraftList = uni.$u.throttle(fetchOrderDraftList(dx), 3000);
		},
		exit() {
			// #ifdef MP-WEIXIN
			wx.exitMiniProgram({
				success: function () {
					console.log('成功退出小程序');
				},
				fail: function (err) {
					console.error('退出小程序失败', err);
				}
			});
			// #endif
			// #ifndef MP-WEIXIN
			this.$u.setPinia({
				user: {
					userRole: this.pinia_userRole,
					token: '',
					user: { phone: undefined }
				}
			});
			uni.reLaunch({ url: '/pages/subUser/login' });
			// #endif
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
.hover-order {
	background-color: #fff !important;
}
.tags {
	font-size: 18rpx;
	width: 83rpx;
	height: 33rpx;
	border-radius: 30rpx 40rpx 40rpx 0rpx;
	background: #fa5151;
	position: absolute;
	top: -24rpx;
	right: 14rpx;
}
.unreceivedBox {
	width: 530rpx;
	padding: 140rpx 50rpx 26rpx;
	box-sizing: border-box;
	.unreceivedTitle {
		font-weight: 500;
	}
}
.unreceivedBtn {
	width: 308rpx;
	height: 74rpx;
	border-radius: 750.62rpx;
	background: #00d081;
	margin: 0 auto;
	color: #fff;
	font-size: 30rpx;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
}
::v-deep .u-checkbox__icon-wrap {
	width: 28rpx !important;
	height: 28rpx !important;
}
.Index {
	min-height: 100vh;
	// overflow: hidden;
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

:deep(.wd-segmented) {
	background-color: #fff !important;
	color: #fff;
	border-radius: 214rpx !important;
	border: 2rpx #ffc300 solid;
}

:deep(.wd-segmented__item) {
	color: #ffc300 !important;
	min-height: 24px !important;
	line-height: 24px !important;
	padding: 0 8px !important;
}

:deep(.wd-segmented__item.is-active) {
	color: #fff !important;
}

:deep(.wd-segmented__item--active) {
	background-color: var(--wot-segmented-item-acitve-bg, #ffc300) !important;
	border-radius: 214rpx !important;
}
:deep(.wd-segmented__item-label) {
	text-overflow: clip !important;
}
</style>
