<template>
	<view class="Index" @click="closeRole">
		<view
			class="flex-row justify-left items-start"
			style="z-index: 9; height: 35vh; width: 100vw; background-color: transparent"
			:style="{
				backgroundImage: pinia_userRole != 'R' ? 'url(https://res-oss.elist.com.cn/wxImg/index/indexbg.png)' : 'url(https://res-oss.elist.com.cn/wxImg/index/indexR.png)',
				backgroundSize: 'cover'
			}"
		>
			<view class="flex-row justify-left items-center" style="width: 100%; height: 70%; background-color: transparent; text-align: center; z-index: 2">
				<view class="mt16 ml14 mr15">
					<!-- #ifdef MP-WEIXIN -->
					<u-avatar size="45" @click="goPath('')" :src="pinia_user.data.headPortrait ? pinia_user.data.headPortrait : ImgUrl + '/wxImg/index/mr.svg'"></u-avatar>
					<!-- #endif -->
					<!-- #ifdef APP -->
					<u-avatar
						size="45"
						@click="goPath('')"
						:src="pinia_user.data.headPortrait ? pinia_user.data.headPortrait : 'https://res-oss.elist.com.cn/wxImg/index/mr.svg'"
					></u-avatar>
					<!-- #endif -->
				</view>
				<view class="flex-col justify-center items-start" style="width: 50%" @click="goPath('')">
					<view v-if="isLogin">
						<view class="islogon ellipsis">
							{{ 'Hello!' + username }}
						</view>
						<br />
						<view class="text_1">欢迎使用易单据订单管理</view>
					</view>
					<view v-else>
						<view class="islogon">登录之后更精彩~</view>
						<br />
						<view class="text_1">登录后体验完整易单据</view>
					</view>
				</view>
				<view class="btn_role">
					<up-button v-if="pinia_userRole == 'D'" @click="sideClick" type="primary" shape="circle" text="发货端" :customStyle="btn_customStyle">
						发货端
						<albb-icon icon="ydj-qiehuan" :iconStyle="iconStyle" size="40rpx" color="#fff"></albb-icon>
					</up-button>
					<up-button v-if="pinia_userRole == 'R'" @click="sideClick" type="primary" shape="circle" text="收货端" :customStyle="btn_customStyle">
						收货端
						<albb-icon icon="ydj-qiehuan" :iconStyle="iconStyle" size="40rpx" color="#fff"></albb-icon>
					</up-button>
				</view>
			</view>
		</view>
		<view class="home-main pl0 pr0 width100 mt10" style="background-color: transparent">
			<view class="home-box">
				<view class="" v-if="pinia_userRole == 'R'">
					<u-notice-bar
						mode="horizontal"
						padding="13rpx 22rpx"
						speed="80"
						:list="[pinia_user.chickenBloodTip || '欢迎使用易单据切换角色选择发货模式可使用～']"
					></u-notice-bar>
				</view>
				<view v-if="pinia_userRole == 'D'" class="home-data cardShowPlus" style="background-color: #ffffff">
					<view class="">
						<view class="flex-col height80 justify-left mt15 ml12">
							<view class="flex-row items-center justify-left pb10 width100" style="display: flex; justify-content: space-between; align-items: center">
								<view class="flex-row" style="width: 300rpx; z-index: 999">
									<text class="mr5 ft-bold ft32" style="letter-spacing: 2rpx">销售额(今年)</text>
									<view @click="isLook = !isLook" class="flex-col items-center justify-center">
										<u-icon v-if="isLook" name="eye-fill" size="18"></u-icon>
										<u-icon v-else name="eye-off" size="18"></u-icon>
									</view>
								</view>
							</view>
							<view class="flex-row items-center justify-left">
								<view class="" style="height: 60rpx">
									<text class="ft-bold ft50 ft-yellow" v-if="!isLook" style="color: #ffc300">
										<text class="ft32 ft-yellow">****</text>
									</text>
									<text class="ft32 ft-yellow" v-if="isLook">￥</text>
									<u-count-to v-if="isLook" :end-val="priceObj[0]" separator="," color="#FFC300" font-size="25" decimals="2" duration="1" bold></u-count-to>
								</view>
							</view>
						</view>
					</view>
					<view class="father mt45" style="width: 100%">
						<view class="view" @click="goList(1)">
							<text class="ft-lighgray ft25">待签收</text>
							<view class="flex-row items-center justify-center mt8">
								<text class="ft12 flex-row mt5" style="" v-if="isLook">￥</text>
								<text v-if="!isLook">****</text>

								<view class="" v-if="isLook">
									<u-count-to
										v-if="!ifBig(priceObj[1])"
										:end-val="priceObj[1]"
										separator=","
										color="#333333"
										font-size="15"
										decimals="2"
										duration="1"
										bold
									></u-count-to>
									<text style="font-size: 30rpx; font-weight: bold" v-if="ifBig(priceObj[1])">
										{{ BigSub(priceObj[1]) }}
									</text>
								</view>
							</view>
						</view>
						<view class="view" @click="goList(2)">
							<text class="ft-lighgray ft25">已签收</text>
							<view class="flex-row items-center justify-center mt8">
								<text class="ft12 mt5" v-if="isLook">￥</text>
								<text v-if="!isLook">****</text>
								<view class="" v-if="isLook">
									<u-count-to
										v-if="!ifBig(priceObj[2])"
										:end-val="priceObj[2]"
										separator=","
										color="#333333"
										font-size="15"
										decimals="2"
										duration="1"
										bold
									></u-count-to>
									<text style="font-size: 29.68rpx; font-weight: bold" v-if="ifBig(priceObj[2])">
										{{ BigSub(priceObj[2]) }}
									</text>
								</view>
							</view>
						</view>
						<view class="view" @click="goList(3)">
							<text class="ft-lighgray ft25">已收款</text>
							<view class="flex-row items-center justify-center mt8">
								<text class="ft12 mt5" v-if="isLook">￥</text>
								<text v-if="!isLook">****</text>
								<view class="" v-if="isLook">
									<u-count-to
										v-if="!ifBig(priceObj[3])"
										:end-val="priceObj[3]"
										separator=","
										color="#333333"
										font-size="15"
										decimals="2"
										duration="1"
										bold
									></u-count-to>
									<text style="font-size: 29.68rpx; font-weight: bold" v-if="ifBig(priceObj[3])">
										{{ BigSub(priceObj[3]) }}
									</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="towCard flex-col justify-center height300 ml24 mr24" style="background-color: transparent">
				<view class="home-menu-wrap flex-row justify-center width100" style="background-color: transparent">
					<view
						v-if="pinia_userRole == 'R'"
						style="background-size: cover; border-radius: 18rpx"
						:style="{
							backgroundImage: 'url(' + ImgUrl + '/wxImg/index/dqrdj.png)'
						}"
						class="home-menu home-menu1 flex-row items-center cardShowPlus"
						id="box22"
						@click="goPath('/pages/subPack/pending/pending')"
					>
						<view class="flex-col">
							<text class="ft36" style="color: #e19306">待确认单据</text>
							<text class="ft24 ft-lighgray mt5" style="color: #e19306">快速查询单据</text>
						</view>
					</view>
					<view
						v-else
						class="home-menu home-menu2 flex-row items-center cardShowPlus"
						style="background-size: cover; border-radius: 18rpx; background-position: bottom"
						:style="{
							backgroundImage: 'url(https://res-oss.elist.com.cn/wxImg/index/yjkd.png)'
						}"
						@click="goPath('/pages/subOrder/add')"
						id="box2"
					>
						<view class="flex-col">
							<text class="ft36 ml10" style="color: #d46d45">一键开单</text>
							<text class="ft24 ft-lighgray mt5 ml10" style="color: #d46d45">便捷高效创建</text>
						</view>
					</view>
					<view
						class="home-menu home-menu3 flex-row items-center cardShowPlus"
						style="background-size: cover; border-radius: 18rpx"
						:style="{
							backgroundImage: 'url(https://res-oss.elist.com.cn/wxImg/index/ddtj.png)'
						}"
						@click="goPath('/pages/subStatistics/statistics')"
					>
						<view class="flex-col">
							<text class="ft36 ml10" style="color: #1d5594">订单统计</text>
							<text class="ft24 ft-lighgray mt5 ml10" style="color: #1d5594">下载统计PDF</text>
						</view>
					</view>
				</view>
			</view>

			<view class="sudoku u-margin-top-30 ml24 mr24 pb48 cardShowPlus" v-if="pinia_userRole != 'R'" style="border-radius: 12rpx">
				<view class="grid-container">
					<view class="grid-item mt10 items-center justify-center" @click="goList(item.type)" v-for="(item, index) in Sudoku.notLogD[0]" :key="index">
						<u-icon size="60" :name="item.icon"></u-icon>
						<view class="grid-text">{{ item.text }}</view>
					</view>
				</view>

				<view class="grid-container">
					<view class="grid-item mt10 items-center justify-center" @click="goPath(item.path)" v-for="(item, index) in Sudoku.notLogD[1]" :key="index">
						<u-icon size="60" :name="item.icon"></u-icon>
						<view class="grid-text">{{ item.text }}</view>
					</view>
				</view>

				<view class="grid-container pb6">
					<view class="grid-item mt10 relation" @click="goPathIndex(item)" v-for="(item, index) in Sudoku.notLogD[2]" :key="index">
						<view class="justify-center" v-if="!item.chat">
							<u-icon size="60" :name="item.icon"></u-icon>
							<view class="grid-text">{{ item.text }}</view>
							<u-badge v-if="item.count" bgColor="#E52829" :count="item.count" class="mr30" absolute :offset="['0', '0']"></u-badge>
						</view>
						<view v-else>
							<u-button hover-class="none" :hair-line="false" :customStyle="buttonStyle" open-type="contact">
								<view class="flex-col justify-center items-center" style="width: 100%">
									<u-icon size="55" :name="item.icon"></u-icon>
									<view class="grid-text" style="">{{ item.text }}</view>
								</view>
							</u-button>
						</view>
					</view>
				</view>
			</view>

			<view class="sudoku u-margin-top-30 ml24 mr24 pl10 pr10 pb48 cardShowPlus" v-if="pinia_userRole == 'R'" style="border-radius: 12rpx">
				<view class="grid-container">
					<view class="grid-item mt10" @click="goList(item.type)" v-for="(item, index) in Sudoku.notLogR[0]" :id="index == 0 ? 'box33' : ''" :key="index">
						<u-icon size="60" :name="item.icon"></u-icon>
						<view class="grid-text">{{ item.text }}</view>
						<u-badge v-if="item.count" bgColor="#E52829" :count="item.count" class="mr30" style="position: absolute; top: 0rpx; right: 0rpx"></u-badge>
					</view>
				</view>

				<view class="grid-container">
					<view class="grid-item mt10" @click="goPath(item.path)" v-for="(item, index) in Sudoku.notLogR[1]" :key="index">
						<u-icon size="60" :name="item.icon"></u-icon>
						<view class="grid-text">{{ item.text }}</view>
					</view>
				</view>

				<view class="grid-container pb6">
					<view class="grid-item mt10" @click="goPathIndex(item)" v-for="(item, index) in Sudoku.notLogR[2]" :key="index">
						<view class="" v-if="!item.chat">
							<u-icon size="60" :name="item.icon"></u-icon>
							<view class="grid-text">{{ item.text }}</view>
							<u-badge v-if="item.count" bgColor="#E52829" :count="item.count" class="mr30" style="position: absolute; top: 0rpx; right: 0rpx"></u-badge>
						</view>
						<view class="" v-else>
							<u-button hover-class="none" :hair-line="false" :customStyle="buttonStyle" open-type="contact">
								<view class="flex-col justify-center items-center" style="width: 100%">
									<u-icon size="110" :name="item.icon"></u-icon>
									<view class="grid-text" style="">{{ item.text }}</view>
								</view>
							</u-button>
						</view>
					</view>
				</view>
			</view>
			<view class="middle-banner mt25 ml24 mr24 cardShowPlus">
				<u-swiper
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
				></u-swiper>
			</view>
		</view>

		<pop-role ref="popRole"></pop-role>

		<u-tabbar id="box6" :height="tabHight" iconSize="40" :list="vuex_tabbar" active-color="#0FB076"></u-tabbar>

		<up-overlay :show="expireShow">
			<view class="flex-col justify-center items-center" style="width: 100%; height: 100%; background-color: transparent">
				<view
					class="flex-col justify-center items-center relative"
					style="width: 80%; height: 25%; border-radius: 28rpx; background-image: url('https://res-oss.elist.com.cn/wxImg/user/dqalert.png'); background-size: cover"
				>
					<view class="absolute flex-col justify-center items-center" style="top: 0; height: 160rpx; font-size: 36rpx; font-weight: bold">提示</view>

					<!-- #ifdef MP-WEIXIN -->
					<text style="font-size: 32rpx; color: #999999">该{{ pinia_user.workData.identity == 3 ? '财务' : '分管' }}人员权限已到期,请联系</text>
					<!-- #endif -->
					<!-- #ifdef APP -->
					<text style="font-size: 32rpx; color: #999999">人员权限已到期,请联系</text>
					<!-- #endif -->
					<text style="font-size: 32rpx; color: #999999">主账号续费</text>

					<view class="absolute flex-col justify-center items-center" style="bottom: 0; height: 160rpx; width: 100%" @click="exit">
						<view
							class=""
							style="
								background: linear-gradient(0deg, #f18341 -17%, #ffb963 100%);
								width: 320rpx;
								height: 80rpx;
								box-shadow: 0rpx 2rpx 6rpx 0rpx rgba(222, 118, 14, 0.2);
								border-radius: 760rpx;
								display: flex;
								flex-direction: row;
								justify-content: center;
								align-items: center;
							"
						>
							<view
								class=""
								style="
									width: 284rpx;
									height: 60rpx;
									font-size: 28rpx;
									font-weight: bold;
									background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 68%);
									border-radius: 440rpx;
									color: white;
									display: flex;
									flex-direction: row;
									justify-content: center;
									align-items: center;
								"
							>
								确认
							</view>
						</view>
					</view>
				</view>
			</view>
		</up-overlay>

		<pop-guide :max-step="3" :guideData="functionGuideData" ref="FunctionGuide"></pop-guide>
		<pop-announcement ref="popAnnouncement"></pop-announcement>
		<!-- <button ref="targetButton" open-type="contact" class="pos">客服</button> -->
	</view>
</template>
<script>
import albbIcon from '@/uni_modules/albb-icon/components/albb-icon/albb-icon.vue';
export default {
	data() {
		return {
			iconStyle: {
				marginLeft: '5rpx',
				color: '#fff'
			},
			btn_customStyle: {
				width: '160rpx',
				height: '52rpx',
				backgroundColor: '#FDB728',
				'border-color': '#FDB728'
			},
			tabHight: '100rpx',
			expireShow: false,
			calendar: 0,
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
			isLook: true,
			priceObj: [0, 0, 0, 0, 0],
			backlog: 0,
			indexSumList: 0,
			indexSumListCopy: [],
			socket: null,
			flushIndex: 0,
			unwatchFlush: null,
			DQS: [],
			intoView: '',
			functionGuideData: {
				step: 0,
				tips: '', // 介绍
				tipsPosition: '', // 介绍 显示位置
				btnGroupPosition: '', // 按钮组显示位置
				position: {}
			},
			buttonStyle: {
				backgroundColor: '',
				border: 'none',
				appearance: 'none',
				outline: 'none',
				boxShadow: 'none',
				height: '100%',
				width: '100%',
				padding: '0'
			},
			guidancePage: 0,
			Sudoku: {
				notLogD: [
					[
						{
							icon: '/static/img/index/icon/tb1.png',
							type: 1,
							text: '待签收'
						},
						{
							icon: '/static/img/index/icon/tb2.png',
							type: 2,
							text: '已签收'
						},
						{
							icon: '/static/img/index/icon/tb3.png',
							type: 3,
							text: '已收款'
						}
					],
					[
						{
							icon: '/static/img/index/icon/tb4.png',
							type: 0,
							text: '客户',
							path: '/pages/subIndex/my_customer/my_customer'
						},
						{
							icon: '/static/img/index/icon/tb10.png',
							type: 0,
							text: '商品库',
							path: '/pages/subOrder/commodityDetails/nventoryCommodities'
						},
						{
							icon: 'https://res-oss.elist.com.cn/wxImg/tab/tb11.png',
							type: 0,
							text: '草稿箱',
							path: '/pages/subOrder/drafts'
						}
					],
					[
						{
							icon: '/static/img/index/icon/tb7.png',
							type: 0,
							text: '待办事项',
							path: '/pages/subIndex/backlog/backlog',
							count: 0
						},
						{
							icon: '/static/img/index/icon/tb8.png',
							type: 0,
							text: '客服咨询',
							path: '/pages/subMessage/chitchat/chat?type=9',
							chat: true
						},
						{
							icon: '/static/img/index/icon/tb9.png',
							type: 0,
							text: '更多功能',
							path: '/pages/subPack/more/more?tid=更多功能'
						}
					]
				],
				notLogR: [
					[
						{
							icon: '/static/img/index/icon/tb1.png',
							type: 1,
							text: '待确收'
						},
						{
							icon: '/static/img/index/icon/tb2.png',
							type: 2,
							text: '已签收'
						},
						{
							icon: '/static/img/index/icon/tb3.png',
							type: 3,
							text: '已付款'
						}
					],
					[
						{
							icon: '/static/img/index/icon/tb4.png',
							type: 0,
							text: '供应商',
							path: '/pages/subIndex/my_customer/my_customer'
						},
						{
							icon: '/static/img/index/icon/tb5.png',
							type: 0,
							text: '付款单列表',
							path: '/pages/subStatistics/receipt/bill_receipt?tid=付款单列表'
						},
						{
							icon: '/static/img/index/icon/tb6.png',
							type: 0,
							text: '开付款单',
							path: '/pages/subStatistics/receipt/receipt?tid=开付款单'
						}
					],
					[
						{
							icon: '/static/img/index/icon/tb7.png',
							type: 0,
							text: '待办事项',
							path: '/pages/subIndex/backlog/backlog',
							count: 0
						},
						{
							icon: '/static/img/index/icon/tb8.png',
							type: 0,
							text: '客服咨询',
							path: '/pages/subMessage/chitchat/chat?type=9',
							chat: true
						},
						{
							icon: '/static/img/index/icon/tb9.png',
							type: 0,
							text: '更多功能',
							path: '/pages/subPack/more/more?tid=更多功能'
						}
					]
				]
			}
		};
	},
	computed: {
		isLogin() {
			return this.pinia_token && this.pinia_user?.phone;
		},
		username() {
			// console.log('this.pinia_user',this.pinia_user)
			return this.pinia_user?.data?.name || this.pinia_user?.data?.phoneNumber || '用户';
		}
	},
	onLoad() {
		//菜单变更
		this.$getModel((value) => {
			// console.log("===动态高===>", value);
			if (value) {
				this.tabHight = value;
				// 在这里可以根据获取到的值进行其他操作
			} else {
				this.tabHight = value;
			}
		});
		console.log('pinia_userRole', this.pinia_userRole);
		console.log('albbIcon', albbIcon);
	},
	onShow() {
		console.log('广告列表1111111111', this.ImgUrl);

		// console.log('this.$u.getPinia',this.$u.getPinia('user.token'))
		setTimeout(() => {
			console.log('延迟后打印 token:', this.$u.getPinia('user.token'));
		}, 3000); // 加一点延迟，确保持久化加载完毕
		this.getmiddleBanner(); //加载广告
		if (this.pinia_user.phone == undefined || this.pinia_user.phone == '10000000000' || this.pinia_user.phone == null) {
			if (this.pinia_userRole == 'D') {
				this.middleBanner = this.middleBannerlXD;
			} else {
				this.middleBanner = this.middleBannerlXR;
			}
			// console.log('this.middleBanner',this.middleBanner);

			//#ifdef APP
			this.goToLogin();
			//#endif
		} else {
			this.$loadUser(this);
			// this.$pushMessage(111);
			this.guideCourse();
			this.SOCKETfLUSH();
			this.exitIfOpen();
			this.getData();
			this.getDQS();
			this.getOrderDB();
			this.Announcement();
			this.draftOk();
			setTimeout(() => {
				this.menu();
			}, 1000);
		}
		// console.log('this.middleBanner',this.middleBannerlXR);
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
	onShareTimeline(res) {
		return {
			title: '易单据，快捷开单',
			type: 0,
			summary: ''
		};
	},
	methods: {
		goToLogin() {
			uni.navigateTo({
				url: '/pages/subUser/login'
			});
		},
		goPathIndex(item) {
			// console.log(item);
			if (this.pinia_user.phone == undefined) {
				uni.navigateTo({
					url: '/pages/subUser/login'
				});
				return;
			}
			if (item.chat) {
				this.$refs.targetButton.triggerEvent('click');
			} else {
				uni.navigateTo({
					url: item.path
				});
			}
		},
		draftOk() {
			setTimeout(() => {
				if (this.draft) {
					console.log('===草稿箱存入凭证===>', this.draft);
					this.$u.toast('已存入草稿箱~');
				}
			}, 1200);
		},
		Announcement() {
			this.$loadUser(this);
			// console.log("===全局公告===>");
			var announcement = this.announcement;
			console.log('=== 全局公告 announcement===>', announcement);
			var ale = announcement ? announcement.id != null : null;
			console.log('=== 全局公告 ale===>', announcement);
			if (announcement?.announcementType == '0') {
				this.getYear();
			} else {
				this.$refs.popAnnouncement.popAnnouncement = ale;
			}
		},
		getYear() {
			var dx = {
				bossNumberS: this.pinia_user.phone,
				bossNumberE: this.pinia_user.phone
			};

			this.$api.order.getOldOrders(dx).then((res) => {
				var data = res.data.data;
				if (data.D.length > 0 || data.R.length > 0) {
					this.$refs.popAnnouncement.popAnnouncement = true;
					// console.log("YEAR");
				}
			});
		},
		menu() {
			var login = this.pinia_user.phone != undefined;
			if (login) {
				var work = this.pinia_user.data.work == '1';
				if (work) {
					var identity = this.pinia_user.workData.identity;
					if (identity == '3') {
						this.Sudoku.notLogD[1][1] = {
							icon: '/static/img/index/icon/tb5.png',
							type: 0,
							text: '收款单列表',
							path: '/pages/subStatistics/receipt/bill_receipt'
						};

						this.Sudoku.notLogD[1][2] = {
							icon: 'https://res-oss.elist.com.cn/wxImg/tab/tb6.png',
							type: 0,
							text: '开收款单',
							path: '/pages/subStatistics/receipt/receipt?tid=开收款单'
						};
					}
					if (identity != '3') {
						this.Sudoku.notLogD[1][1] = {
							icon: '/static/img/index/icon/tb10.png',
							type: 0,
							text: '商品库',
							path: '/pages/subOrder/commodityDetails/nventoryCommodities'
						};

						this.Sudoku.notLogD[1][2] = {
							icon: 'https://res-oss.elist.com.cn/wxImg/tab/tb11.png',
							type: 0,
							text: '草稿箱',
							path: '/pages/subOrder/drafts'
						};
					}
				} else {
					this.Sudoku.notLogD[1][1] = {
						icon: '/static/img/index/icon/tb10.png',
						type: 0,
						text: '商品库',
						path: '/pages/subOrder/commodityDetails/nventoryCommodities'
					};

					this.Sudoku.notLogD[1][2] = {
						icon: 'https://res-oss.elist.com.cn/wxImg/tab/tb11.png',
						type: 0,
						text: '草稿箱',
						path: '/pages/subOrder/drafts'
					};
				}
			}
		},
		guideCourse() {
			if (this.pinia_user.phone != undefined) {
				// console.log("信息", this.guidanceD, this.guidanceR);
				if (this.pinia_userRole == 'D') {
					if (this.guidanceD == 1) {
						this.guide();
					}
				} else {
					if (this.guidanceR == 1) {
						this.guide();
					}
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
				this.showFunctionGuideR();
			}
		},
		showFunctionGuideR() {
			if (this._step == this.functionGuideData.step) return;
			this._step = this.functionGuideData.step;
			if (this.functionGuideData.step == 1) {
				this.getElementData('#box', (res) => {
					this.setFunctionGuideData({
						tips: '介绍模块1，简述一下模块功能',
						btnGroupPosition: '10rpx',
						tipsPosition: {
							top: '50rpx',
							right: '0',
							backgroundImage: 'url(https://res-oss.elist.com.cn/wxImg/handbook/guide/stepD1.png)'
						},
						img: {
							url: ''
						},
						position: {
							// 自定义导航栏
							// top: uni.upx2px(30) + this._statusBarHeight + 'px',
							top: `${res.top + res.height / 2}px`,
							right: '36rpx',
							width: `${res.width}px`,
							height: `${res.height / 2}px`
						}
					});
				});
			} else if (this.functionGuideData.step == 2) {
				this.getElementData('#box22', (res) => {
					this.setFunctionGuideData({
						tips: '介绍模块2，简述一下模块功能',
						btnGroupPosition: '',
						tipsPosition: {
							top: '200rpx',
							left: '0',
							backgroundImage: 'url(https://res-oss.elist.com.cn/wxImg/handbook/guide/stepR22.png)'
						},
						position: {
							top: res.top + 'px',
							width: `${res.width}px`,
							left: '28rpx',
							height: `${res.height}px`
						}
					});
				});
			} else if (this.functionGuideData.step == 3) {
				let systemInfo = uni.getSystemInfoSync();
				let platform = systemInfo.platform;
				let osName = systemInfo.osName;

				var setting = platform === 'android';

				this.getElementData('#box33', (res) => {
					this.setFunctionGuideData({
						tips: '介绍模块6，模块处于底部，需滚动页面',
						btnGroupPosition: '550rpx',
						tipsPosition: {
							top: '200rpx',
							left: '0',
							backgroundImage: 'url(https://res-oss.elist.com.cn/wxImg/handbook/guide/stepR33.png)'
						},
						position: {
							top: res.top + 'px',
							width: `${res.width / 2}px`,
							left: '90rpx',
							height: `${res.height}px`
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
		showFunctionGuideD() {
			if (this._step == this.functionGuideData.step) return;
			this._step = this.functionGuideData.step;
			if (this.functionGuideData.step == 1) {
				this.getElementData('#box', (res) => {
					this.setFunctionGuideData({
						tips: '介绍模块1，简述一下模块功能',
						btnGroupPosition: '10rpx',
						tipsPosition: {
							top: '50rpx',
							right: '0',
							backgroundImage: 'url(https://res-oss.elist.com.cn/wxImg/handbook/guide/stepD1.png)'
						},
						img: {
							url: ''
						},
						position: {
							// 自定义导航栏
							// top: uni.upx2px(30) + this._statusBarHeight + 'px',
							top: `${res.top + res.height / 2}px`,
							right: '36rpx',
							width: `${res.width}px`,
							height: `${res.height / 2}px`
						}
					});
				});
			} else if (this.functionGuideData.step == 2) {
				this.getElementData('#box2', (res) => {
					this.setFunctionGuideData({
						tips: '介绍模块2，简述一下模块功能',
						btnGroupPosition: '',
						tipsPosition: {
							top: '200rpx',
							left: '0',
							backgroundImage: 'url(https://res-oss.elist.com.cn/wxImg/handbook/guide/stepD2.png)'
						},
						position: {
							top: res.top + 'px',
							width: `${res.width}px`,
							left: '28rpx',
							height: `${res.height}px`
						}
					});
				});
			} else if (this.functionGuideData.step == 3) {
				let systemInfo = uni.getSystemInfoSync();
				let platform = systemInfo.platform;
				let osName = systemInfo.osName;

				var setting = platform === 'android';

				this.getElementData('#box6', (res) => {
					this.setFunctionGuideData({
						tips: '介绍模块6，模块处于底部，需滚动页面',
						btnGroupPosition: '550rpx',
						tipsPosition: {
							top: '-270rpx',
							left: '-40rpx',
							backgroundImage: 'url(https://res-oss.elist.com.cn/wxImg/handbook/guide/stepD3.png)'
						},
						position: {
							bottom: setting ? uni.getSystemInfoSync().statusBarHeight * 0.1 + 'px' : uni.getSystemInfoSync().statusBarHeight * 0.55 + 'px',
							height: setting ? `${res.height / 1.1}px` : `${res.height / 1.5}px`,
							width: `${res.width / 4 / 2}px`,
							left: `${res.width / 4 + res.width / 4 / 5}px`
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
		exitIfOpen() {
			var workIF = this.pinia_user.data.work == '1';
			if (workIF) {
				var s = this.pinia_user.workData.endTime;
				if (s == '0') {
					this.expireShow = true;
				}
			}
		},
		exit() {
			wx.exitMiniProgram({
				success: function () {
					console.log('成功退出小程序');
				},
				fail: function (err) {
					console.error('退出小程序失败', err);
				}
			});
		},
		BigSub(price) {
			if (typeof price !== 'number' || price < 1000000) {
				throw new Error('Price must be a number greater than or equal to 10000000.');
			}
			const priceInWan = price / 10000;
			const roundedPriceInWan = Math.round(priceInWan);
			const formattedPrice = roundedPriceInWan + '万';
			return formattedPrice;
		},
		ifBig(price) {
			if (price > 1000000) {
				return true;
			} else {
				return false;
			}
		},
		SOCKETfLUSH() {
			this.unwatchFlush = this.$store.watch(
				(state) => state.flush, // 监听状态
				(newVal, oldVal) => {
					this.flushIndex = newVal;
					this.getOrderDB();
					this.getData();
					this.getDQS();
					console.log('监听SOCKET状态');
				}
			);
		},
		getOrderDB() {
			var workIF = this.pinia_user.data.work == '0';
			var dx = {
				bUser: '',
				bBoss: '',
				port: this.pinia_userRole
			};
			if (workIF) {
				dx.bBoss = this.pinia_user.phone;
			} else {
				//console.log("(待办事项)有工作:", workIF);
				var identity = this.pinia_user.workData.identity;
				if (identity == '4') {
					dx.bBoss = this.pinia_user.workData.bossNumber;
					dx.bUser = this.pinia_user.phone;
				} else if (identity == '1') {
					dx.bBoss = this.pinia_user.workData.bossNumber;
					// dx.bUser = this.pinia_user.workData.bossNumber
				} else {
					dx.bBoss = this.pinia_user.workData.bossNumber;
					dx.bUser = this.pinia_user.phone;
				}
			}

			this.$api.order.getOrderDraftList(dx).then((res) => {
				this.indexSumList = res.data.data[0];
				// console.log("待办", this.indexSumList);
				this.Sudoku.notLogD[2][0].count = res.data.data[0];
				this.Sudoku.notLogR[2][0].count = res.data.data[0];
			});
		},
		onPullDownRefresh() {
			if (this.pinia_user.phone != undefined) {
				this.getData();
				this.getDQS();
				setTimeout(function () {
					uni.stopPullDownRefresh();
				}, 1000);
			} else {
				this.$u.toast('请登录');
				uni.stopPullDownRefresh();
			}
		},
		getmiddleBanner() {
			// console.log('刷新')
			var filer = this.pinia_userRole == 'D' ? '1' : '0';
			// console.log('广告',this.pinia_userRole);
			console.log('this.$api.advert 是：', this.$api.advert);
			this.$api.advert
				.getAdvertList({
					port: filer
				})
				.then((res) => {
					console.log('广告列表', res);

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
		getData() {
			//是否工作
			var ifwork = this.pinia_user.data.work == '0';
			//是否为发获段
			var ifWorkPort = this.pinia_userRole == 'D';
			var realTimeSel = {
				bossNumberS: '',
				staffNumberS: ''
			};

			const date = new Date();
			date.setDate(date.getDate() + 15);

			realTimeSel.startDate = this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
			realTimeSel.endDate = this.$u.timeFormat(date, 'yyyy-mm-dd');

			if (ifwork) {
				//没工作
				realTimeSel.bossNumberS = this.pinia_user.phone;
			} else {
				var identity = this.pinia_user.workData.identity == '4';
				if (identity) {
					realTimeSel.bossNumberS = this.pinia_user.workData.bossNumber;
					realTimeSel.staffNumberS = this.pinia_user.phone;
				}
				realTimeSel.bossNumberS = this.pinia_user.workData.bossNumber;
			}

			if (ifWorkPort) {
				this.$api.order
					.getFilteredOrderSum(realTimeSel)
					.then((res) => {
						//console.log(res.data.data);
						this.priceObj = res.data.data;
					})
					.catch((res) => {
						this.$u.toast(that.message);
					});
			}
		},
		getDQS() {
			var ifwork = this.pinia_user.data.work == '0';
			//是否为发获段
			var ifWorkPort = this.pinia_userRole == 'D';

			var realTimeSel = {
				bossNumberS: '',
				bossNumberE: '',
				staffNumberS: '',
				staffNumberE: '',
				paymentState: '0',
				phoneE: '',
				organizationE: '',
				enterpriseS: '',
				phoneS: '',
				startDate: '',
				endDate: '',
				takeE: '',
				contactsS: '',
				siteE: '',
				enterpriseDz: '',
				getPhone: '',
				inventoryName: ''
			};

			const date = new Date();
			date.setDate(date.getDate() + 15);

			realTimeSel.startDate = this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
			realTimeSel.endDate = this.$u.timeFormat(date, 'yyyy-mm-dd');

			if (ifwork) {
				//没工作
				realTimeSel.bossNumberE = this.pinia_user.phone;
			} else {
				var identity = this.pinia_user.workData.identity == '4';
				if (identity) {
					realTimeSel.bossNumberE = this.pinia_user.workData.bossNumber;
					realTimeSel.staffNumberE = this.pinia_user.phone;
				}
				realTimeSel.bossNumberE = this.pinia_user.workData.bossNumber;
			}

			this.$api.order
				.getFilteredOrderCount(realTimeSel)
				.then((res) => {
					//console.log("index 当前订单个数：", res);
					this.DQS = res.data.data;
					this.Sudoku.notLogR[0][0].count = res.data.data[1];
				})
				.catch((res) => {
					this.refresh = true;
					this.$u.toast('获取个数失败');
				});
		},
		jumpSearch() {
			//console.log("聚焦");
			uni.navigateTo({
				url: '/pages/index/search_index/search_index'
			});
		},
		closeRole() {
			if (this.$refs.popRole.roleShow) {
				this.$refs.popRole.roleShow = false;
			}
		},
		// 切换收发货
		sideClick() {
			this.$refs.popRole.roleShow = true;
			this.$refs.popRole.pageid = 'index';
			if (this.pinia_userRole == 'R') {
				this.$refs.popRole.roleShowF = false;
				this.$refs.popRole.roleShowS = true;
				this.$refs.popRole.check = '2';
			} else {
				this.$refs.popRole.roleShowF = true;
				this.$refs.popRole.roleShowS = false;
				this.$refs.popRole.check = '1';
			}
		},
		isElevenDigitPhoneNumber(phoneNumber) {
			// 使用正则表达式匹配11位数字
			const regex = /^\d{11}$/;
			return regex.test(phoneNumber);
		},
		middleClick(e) {
			this.jumpToUrl(this.middleBanner[e].jump);
		},
		jumpToUrl(url) {
			console.log('点击广告', url);
			if (!url) return;
			if (url.indexOf('http') < 0) {
				// 内部跳转
				uni.navigateTo({
					url: url
				});
			} else {
				// 外部跳转
				console.log('外部跳转');
				uni.previewImage({
					loop: true,
					urls: [url] //可以展示imgUrl 列表中所有的图片
				});
			}
		},
		goList(val) {
			uni.switchTab({
				url: '/pages/list/list'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.Index {
	background-color: #f6f7f7;
	overflow: auto;
	height: 100vh;
	width: 100vw;
	position: relative;
	overflow-x: hidden;
}

.Index::-webkit-scrollbar {
	display: none;
}

.Index {
	-ms-overflow-style: none;
	scrollbar-width: none;
	/* Firefox */
}

.ft36 {
	color: #333333;
	font-weight: bold;
}

.grid-text {
	font-size: 28rpx;
	color: #333333;
	font-weight: normal;
	border: none;
}

.swiper-wrap {
	height: 35vh;
}

.inp {
	position: absolute;
	width: 90%;
	top: 15.3vh;
	z-index: 9999;
	margin-left: 5%;
}

.home-main {
	position: relative;
	top: -300rpx;
	z-index: 997;
	min-height: 500rpx;
}

.home-menu-wrap {
	.home-menu {
		border-radius: 28rpx;
		color: #333;
		position: relative;
		flex: 1;
		overflow: hidden;
		padding: 20rpx 0 40rpx 16rpx;
		border-radius: 12rpx;
		height: 12vh;
	}

	.home-menu1 {
		margin-right: 15rpx;
	}

	.home-menu2 {
		margin-right: 15rpx;
	}

	.home-menu3 {
		margin-left: 15rpx;
	}
}

.home-data {
	padding-top: 24rpx;
	padding-bottom: 24rpx;
	padding-left: 12rpx;
	padding-right: 12rpx;
	background-color: #ffffff;
	border-radius: 12rpx;
}

.sub-menu {
	.sub-menu-item {
		width: 336rpx;
		height: 180rpx;
		padding: 42rpx 0 0 46rpx;
		opacity: 1;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
	}

	.sub-item-orange {
	}

	.sub-item-blue {
	}

	.sub-item-red {
	}
}

.home-box {
	padding: 40rpx 20rpx 30rpx;
	width: 100%;
	height: auto;
	background-color: transparent;
}

.sudoku,
.towCard {
	background-color: #ffffff;
}

.sudoku {
	background-color: #ffffff;
}

.father {
	display: flex;
	/* 使用Flexbox布局 */
	// background-color: darkcyan;
}

.father .view:nth-child(1) {
	width: 33%;
	margin-right: 4rpx;
	height: 100%;
	background-color: #f9f9f9;

	border-top-left-radius: 12rpx;
	border-bottom-left-radius: 12rpx;
}

.father .view:nth-child(2) {
	width: 33%;
	margin-right: 4rpx;
	height: 100%;
	background-color: #f8f8f8;
}

.father .view:nth-child(3) {
	width: 33%;
	height: 100%;
	background-color: #f8f8f8;
	border-top-right-radius: 12rpx;
	border-bottom-right-radius: 12rpx;
}

.view {
	flex: 1;
	/* 这会使每个视图平分容器的宽度 */
	box-sizing: border-box;
	/* 确保边框和内边距不会增加元素的宽度 */
	padding: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.islogon {
	width: 450rpx;
	color: #333333;
	font-size: 40rpx;
	font-weight: bold;
	letter-spacing: 4rpx;
	text-align: left;
	margin-bottom: 5rpx;
}

.text_1 {
	text-align: left;
}

.btn_role {
	position: absolute;
	right: 30rpx;
	top: 170rpx;
}

.grid-container {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 0;
}

.grid-item {
	background-color: #ffffff;
	text-align: center;
	/* padding: 10rpx; */
	padding-top: 30rpx;
	position: relative;
	margin: 0 auto;
}
</style>
