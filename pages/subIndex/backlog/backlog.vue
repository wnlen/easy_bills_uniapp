<template>
	<view class="bg-gray vh100">
		<z-paging
			ref="paging"
			use-virtual-list
			:force-close-inner-list="true"
			:cell-height-mode="1 === 0 ? 'fixed' : 'dynamic'"
			@virtualListChange="virtualListChange"
			@query="queryList"
		>
			<template #top>
				<u-navbar
					:autoBack="true"
					:placeholder="true"
					:border-bottom="false"
					:titleBold="true"
					title-color="#000000"
					title="待办事项"
					title-size="34"
					bgColor="#ffffff"
				></u-navbar>
				<!-- <u-notice-bar mode="horizontal" :list="uNoticeBarlist" padding="6rpx 12rpx"></u-notice-bar> -->

				<u-tabs
					:list="tabList"
					:current="tab"
					:lineColor="'#01BB74'"
					:activeStyle="{ color: '#01BB74' }"
					:inactiveStyle="{ color: '#333333' }"
					:scrollable="false"
					:itemStyle="{
						height: '80rpx',
						backgroundColor: '#fff'
					}"
					@change="TabClick"
				/>
			</template>
			<template #empty>
				<view
					v-show="
						(vuex_user.workData.identity == '3' && tab == 1) ||
						(vuex_user.workData.identity == '4' && tab == 0) ||
						vuex_user.data.work == '0' ||
						vuex_user.workData.identity == '1'
					"
					style="padding-bottom: 1000rpx"
				>
					<u-empty
						icon="https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/role/dbsx.svg"
						iconSize="400rpx"
						text="暂无待办事项~"
						mode="search"
						margin-top="200"
					></u-empty>
				</view>
			</template>
			<template #empty>
				<view
					v-show="
						(vuex_user.workData.identity == '3' && tab == 0) ||
						(vuex_user.workData.identity == '4' && tab == 1) ||
						(vuex_user.data.work == '1' && vuex_user.workData.identity != '1')
					"
					style="padding-bottom: 1000rpx"
				>
					<u-empty icon="https://res-oss.elist.com.cn/wxImg/order/cw.svg" iconSize="400rpx" text="无查看权限~" mode="search" margin-top="200"></u-empty>
				</view>
			</template>
			<view class="ml24 mr24 mt24" style="border-radius: 24rpx; overflow: hidden" v-for="(item, index) in list" :key="item.id">
				<u-swipe-action>
					<u-swipe-action-item :show="item.show" :name="index" @click="delclick(item)" :options="options">
						<view class="pd20">
							<view class="item flex-col justify-left">
								<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
								<view class="u-body-item u-flex u-row-between u-p-b-0 justify-between">
									<view class="flex-row justify-center items-center" v-if="item.genre == 'D'">
										<u-icon name="https://res-oss.elist.com.cn/wxImg/index/del.svg" size="40rpx"></u-icon>
										<text class="ml20" style="font-size: 32rpx; font-weight: bold">删除申请</text>
									</view>
									<view class="flex-row justify-center items-center" v-if="item.genre == 'P'">
										<u-icon name="https://res-oss.elist.com.cn/wxImg/index/play.svg" size="40rpx"></u-icon>
										<text class="ml20" style="font-size: 32rpx; font-weight: bold">确认付款申请</text>
									</view>
									<div>
										<u-button :custom-style="customStyle" color="#01BB74" shape="circle" @click="clickApply(item)">同意</u-button>
									</div>
								</view>
								<view class="">
									<!-- 				<view class="flex-col mt25" style="font-size: 28rpx;">
								<text style="color: #666666;"
									v-if="item.genre=='D'">{{item.aName||item.aUser}}申请删除{{item.port=="E"?"付款单":(item.port=="S"?"收款单":"订单")}}</text>
								<text style="color: #666666;"
									v-if="item.genre=='P'">{{item.aName||item.aUser}}申请确认付款{{item.port=="E"?"付款单":(item.port=="S"?"收款单":"订单")}}</text>
								<text style="color: #666666;" class="mt10">订单编号：<text
										style="color: #01BB74;">{{item.orderNumber}}</text></text>
							</view>
							<view class="flex-col mt25" style="font-size: 28rpx;">
								<text style="color: #666666;"
									v-if="item.genre=='D'">{{item.aName||item.aUser}}申请删除{{item.port=="E"?"付款单":(item.port=="S"?"收款单":"订单")}}</text>
								<text style="color: #666666;"
									v-if="item.genre=='P'">{{item.aName||item.aUser}}申请确认付款{{item.port=="E"?"付款单":(item.port=="S"?"收款单":"订单")}}</text>
								<text style="color: #666666;" class="mt10">订单编号：<text
										style="color: #01BB74;">{{item.orderNumber}}</text></text>
							</view> -->
									<view class="flex-col mt25" style="font-size: 28rpx" v-if="item.port == 'D' || item.port == 'R'">
										<text style="color: #666666" v-if="item.genre == 'D'">{{ item.aName || item.aUser }}申请删除订单</text>
										<text style="color: #666666" v-if="item.genre == 'P'">{{ item.aName || item.aUser }}申请确认付款订单</text>
										<text style="color: #666666" class="mt10">
											订单编号：
											<text style="color: #01bb74">{{ item.orderNumber }}</text>
										</text>
									</view>
									<view class="flex-col mt25" style="font-size: 28rpx" v-if="item.port == 'E' || item.port == 'S'">
										<text style="color: #666666" v-if="item.genre == 'D'">
											{{ item.aName || item.aUser }}申请删除{{ item.port == 'E' ? '收款单' : '付款单' }}
										</text>
										<text style="color: #666666" v-if="item.genre == 'P'">{{ item.aName || item.aUser }}申请确认付款收款单</text>
										<text style="color: #666666" class="mt10">
											订单编号：
											<text style="color: #01bb74">{{ item.orderNumber }}</text>
										</text>
									</view>

									<view class="flex-row mt15" style="font-size: 28rpx" v-if="item.port == 'D' || item.port == 'R'">
										<text style="color: #aaaaaa" v-if="item.orderState <= 1">订单状态：</text>
										<text style="color: #aaaaaa" v-if="item.orderState > 1">订单数：</text>
										<text style="color: #aaaaaa" v-if="item.orderState <= 1">
											{{ item.orderState == '0' ? '待签收' : item.orderState == '1' ? '已签收' : '已付款' }}
										</text>
										<text style="color: #aaaaaa" v-if="item.orderState > 1">{{ item.orderState }}</text>
									</view>

									<view class="flex-row mt15" style="font-size: 28rpx" v-if="item.port == 'E' || item.port == 'S'">
										<text style="color: #aaaaaa">订单数量：</text>
										<text style="color: #aaaaaa">{{ item.billQuantity }}</text>
									</view>
									<view class="flex-row mt15" style="font-size: 28rpx" v-if="item.port == 'E' || item.port == 'S'">
										<text style="color: #aaaaaa">订单金额：</text>
										<text style="color: #aaaaaa">￥{{ parseFloat(item.totalPrices).toFixed(2) }}</text>
									</view>

									<view class="flex-row mb36 mt15" style="font-size: 28rpx">
										<text style="color: #aaaaaa">申请时间：</text>
										<text style="color: #aaaaaa">{{ $u.timeFormat(item.createTime, 'yyyy-mm-dd hh:MM:ss') }}</text>
									</view>
								</view>
								<view class="u-body-item u-flex u-row-between u-p-b-0 u-border-top items-center justify-between" @click="jumpDetails(item)">
									<view class="u-body-item-title u-line-0 mt15" style="color: #01bb74">查看订单</view>
									<view class="u-body-item-title u-line-1 mt15"><u-icon name="arrow-right" color="#666666" size="28rpx"></u-icon></view>
								</view>
							</view>
						</view>
					</u-swipe-action-item>
				</u-swipe-action>
			</view>
		</z-paging>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [],
			disabled: false,
			btnWidth: 180,
			show: false,
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#ff6e55'
					}
				}
			],
			identity: false,
			customStyle: {
				width: '108.2rpx',
				height: '45.4rpx',
				borderRadius: '454rpx',
				fontSize: '24rpx'
			},
			tabList: [
				{
					name: '送货单'
				},
				{
					name: '收款单'
				}
			],
			tab: 0,
			uNoticeBarlist: [' 当年待办请在12月31日前处理完成，逾期将清空无法处理~ ']
		};
	},
	onShow() {
		console.log(1, this.$u.getPinia('user'));
		if (this.vuex_user.workData != null) {
			var ide = this.vuex_user.workData.identity == '3';
			if (ide) {
				this.identity = true;
			}
		}

		if (this.vuex_userRole == 'D') {
			this.tabList[1].name = '收款单';
		} else {
			this.tabList[1].name = '付款单';
		}

		// #ifdef MP-WEIXIN
		// this.$refs.paging.refresh();
		// #endif

		// this.loadData();
	},
	onHide() {},
	methods: {
		virtualListChange(vlist) {
			this.list = vlist;
		},
		queryList(start, end) {
			console.log('获取', start, end);
			if (this.vuex_user.workData.identity != '3' || (this.tab == 1 && this.vuex_user.workData.identity == '3')) {
				this.refresh(start, end);
			} else {
				this.$refs.paging.complete([]);
			}
		},
		TabClick(item) {
			this.tab = item.index;
			console.log(item);
			this.$refs.paging.refresh();
		},
		jumpDetails(item) {
			console.log(item);
			if (item.port == 'E' || item.port == 'S') {
				uni.navigateTo({
					url: '/pages/subStatistics/receipt/bill_particulars?id=' + item.orderId
				});
			} else {
				uni.navigateTo({
					url: '/pages/subOrder/details?id=' + item.orderId
				});
			}
		},
		delCount() {
			const sum = Number(this.$u.getPinia('global.tabbar.0.counts'));
			var ifok = sum > 0;
			if (ifok) {
				const num = sum - 1;
				this.$u.setPinia({
					global: {
						tabbar: [
							{
								count: num
							}
						]
					}
				});
			}
		},
		clickApply(item) {
			uni.showModal({
				title: '温馨提醒',
				content: '确定删除吗？',
				success: (res) => {
					if (res.confirm) {
						// console.log('用户点击确定');
						console.log(item);
						var genre = item.genre;
						if (genre == 'P') {
							this.okPlay(item);
						} else if (genre == 'D') {
							this.okDel(item);
						}
					} else if (res.cancel) {
						// console.log('用户点击取消');
					}
				}
			});
		},
		okDel(item) {
			//同意删除
			this.$api.order.confirmOrderDraft(item).then((res) => {
				console.log(res.data.data);
				if (res.data.data == '1') {
					this.$u.toast(res.data.message);
					var that = this;
					setTimeout(function () {
						that.$refs.paging.refresh();
						that.delCount();
					}, 500);
				}
			});
		},
		okPlay(item) {
			//同意支付
			this.$api.order.confirmOrderDraft(item).then((res) => {
				console.log(res.data.data);
				if (res.data.data == '1') {
					this.$u.toast(res.data.message);
					var that = this;
					setTimeout(function () {
						that.$refs.paging.refresh();
						that.delCount();
					}, 500);
				}
			});
		},
		refresh(start, end) {
			var workIF = this.vuex_user.data.work == '0';
			var dx = {
				bUser: '',
				bBoss: '',
				type: this.tab == 0 ? true : false,
				page: start,
				size: end
			};
			if (workIF) {
				//没工作
				dx.bBoss = this.vuex_user.phone;
			} else {
				//有工作
				console.log('(待办事项)有工作:', workIF);
				var identity = this.vuex_user.workData.identity;
				if (identity == '4') {
					dx.bBoss = this.vuex_user.workData.bossNumber;
					dx.bUser = this.vuex_user.phone;
				} else if (identity == '1') {
					dx.bBoss = this.vuex_user.workData.bossNumber;
					// dx.bUser = this.vuex_user.phone
				} else {
					dx.bBoss = this.vuex_user.workData.bossNumber;
					dx.bUser = this.vuex_user.workData.bossNumber;
				}
			}

			this.$api.order.getOrderDraftLimit(dx).then((res) => {
				var getList = res.data.data.map((obj) => ({
					...obj,
					show: false
				}));

				var filer = this.vuex_userRole == 'D';
				if (filer) {
					this.$refs.paging.complete(getList.filter((res) => res.port == 'R' || res.port == 'E'));
				} else {
					this.$refs.paging.complete(getList.filter((res) => res.port == 'D' || res.port == 'S'));
				}
				console.log('筛选条件后: ', this.list);
			});
		},
		loadData() {
			var workIF = this.vuex_user.data.work == '0';
			var dx = {
				bUser: '',
				bBoss: '',
				type: this.tab == 0 ? true : false
			};
			if (workIF) {
				//没工作
				dx.bBoss = this.vuex_user.phone;
			} else {
				//有工作
				console.log('(待办事项)有工作:', workIF);
				var identity = this.vuex_user.workData.identity;
				if (identity == '4') {
					dx.bBoss = this.vuex_user.workData.bossNumber;
					dx.bUser = this.vuex_user.phone;
				} else {
					dx.bBoss = this.vuex_user.workData.bossNumber;
					dx.bUser = this.vuex_user.workData.bossNumber;
				}
			}

			this.$api.order.getOrderDraftList(dx).then((res) => {
				this.list = res.data.data.map((obj) => ({
					...obj,
					show: false
				}));
				var filer = this.vuex_userRole == 'D' ? '1' : '0';
				console.log('筛选条件: ', filer);
				if (filer == '1') {
					this.list = this.list.filter((res) => res.port == 'f' || res.port == '1');
				} else {
					this.list = this.list.filter((res) => res.port == '0');
				}

				console.log('筛选条件后: ', this.list);
			});
		},
		delclick(item) {
			console.log('删除', item);
			this.$api.order.updateOrderDraft(item).then((res) => {
				console.log(res.data.data);
				if (res.data.data == '1') {
					this.$u.toast('已撤销申请~');
					this.$refs.paging.refresh();
					this.delCount();
				} else {
					this.$u.toast(res.data.message);
				}
			});
		},
		// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
		open(index) {
			// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
			// 原本为'false'，再次设置为'false'会无效
			console.log(index);
			this.list[index].show = true;
			this.list.map((val, idx) => {
				if (index != idx) this.list[idx].show = false;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.item {
	display: flex;
	padding: 20rpx;
}

image {
	width: 120rpx;
	flex: 0 0 120rpx;
	height: 120rpx;
	margin-right: 20rpx;
	border-radius: 12rpx;
}

.title {
	text-align: left;
	font-size: 28rpx;
	color: $u-content-color;
	margin-top: 20rpx;
}
</style>
