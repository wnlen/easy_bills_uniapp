<template>
	<view class="vh100 vw100 fixed-bar-height bg-gray">
		<!-- <z-paging :paging-style="{'marginTop': '0vh'}" ref="paging" use-virtual-list :force-close-inner-list="true"
			:auto="true" :refresher-enabled="true" fixed="true" @virtualListChange="virtualListChange"
			@query="queryList" style=""> -->

		<z-paging
			ref="paging"
			use-virtual-list
			:force-close-inner-list="true"
			:cell-height-mode="1 === 0 ? 'fixed' : 'dynamic'"
			@virtualListChange="virtualListChange"
			@query="queryList"
		>
			<template #top>
				<u-navbar :autoBack="true" :placeholder="true">
					<template #center>
						<view class="flex-row items-center justify-center ml50" style="width: 100%">
							<view class="" style="font-size: 34rpx; font-weight: 510">订单统计</view>
							<view
								@click="jumpVideo"
								class="flex-row justify-center items-center ml12"
								style="border: 2.2rpx solid #01bb74; height: 44rpx; width: 136rpx; border-radius: 8rpx; color: #01bb74; font-size: 22rpx"
							>
								<text class="mr6">使用方法</text>
								<u-icon name="https://res-oss.elist.com.cn/wxImg/video.png" size="20rpx"></u-icon>
							</view>
						</view>
					</template>
				</u-navbar>
				<u-notice-bar v-if="uNoticeBarlist.length" direction="column" :text="uNoticeBarlist" padding="6rpx 12rpx"></u-notice-bar>
				<view class="fliter-wrap">
					<view class="fliter-wrap-view">
						<view
							@click="tagClick(index, item)"
							v-for="(item, index) in filterTags"
							v-show="item.show"
							:key="index"
							class="filter-btn flex-row justify-center items-center"
							:class="{ active: index == tagIndex }"
						>
							<u-icon v-if="item.key == false" size="35rpx" name="https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/vip/vip.svg"></u-icon>
							{{ item.value }}
						</view>
					</view>
				</view>
			</template>

			<view class="ml24 mr24 mb24">
				<div class="bg-white pd20 mt20 radius flex-col justify-center items-center cardShow">
					<view class="flex-col" style="width: 100%">
						<text class="ft30 ft-gray mb18" style="color: #999999">累计金额</text>
						<view class="">
							<text class="ft42 ft-bold">￥</text>
							<u-count-to :end-val="OrderQuantitySum" separator="," color="#000000" font-size="40rpx" decimals="2" bold></u-count-to>
						</view>
					</view>

					<view class="flex-row justify-center items-center mt20" style="width: 100%">
						<view
							class="flex-row justify-center items-center mr24 tags2"
							@click="choiceGET(0)"
							:style="{
								color: showOrderTage == '0' ? '#01BB74' : '#999999',
								border: '2rpx solid ' + (showOrderTage == '0' ? '#01BB74' : '#999999')
							}"
						>
							全部
						</view>
						<view
							class="flex-row justify-center items-center mr24 tags2"
							@click="choiceGET(1)"
							:style="{
								color: showOrderTage == '1' ? '#01BB74' : '#999999',
								border: '2rpx solid ' + (showOrderTage == '1' ? '#01BB74' : '#999999')
							}"
						>
							{{ vuex_userRole == 'R' ? '待确收' : '待签收' }}
						</view>
						<view
							class="flex-row justify-center items-center tags2"
							@click="choiceGET(2)"
							:style="{
								color: showOrderTage == '2' ? '#01BB74' : '#999999',
								border: '2rpx solid ' + (showOrderTage == '2' ? '#01BB74' : '#999999')
							}"
						>
							已签收
						</view>
						<view
							class="flex-row justify-center items-center ml20 tags2"
							@click="choiceGET(3)"
							:style="{
								color: showOrderTage == '3' ? '#01BB74' : '#999999',
								border: '2rpx solid ' + (showOrderTage == '3' ? '#01BB74' : '#999999')
							}"
						>
							{{ vuex_userRole == 'R' ? '已付款' : '已收款' }}
						</view>
					</view>

					<div class="flex-row items-center radius pr20 mr10 mt20" style="height: 5vh; background-color: #f9f9f9; width: 100%">
						<div class="bg-white flex-row items-center justify-left radius" style="width: 100%; height: 5vh; background-color: #f9f9f9">
							<text class="ft11 ft-gray ml36 mr20" @click="CustomerGet">{{ vuex_userRole == 'R' ? '供应商选择' : '客户选择' }}</text>
							<view class="ml24 flex-1">
								<u-input border="none" @change="changeCustomer" v-model="customer" :placeholder="vuex_userRole == 'R' ? '请选择供应商' : '请选择客户'"></u-input>
							</view>

							<div class="flex-col justify-center items-center" style="height: 5vh">
								<u-icon class="ml48" name="/static/img/list/lxr.svg" size="45rpx" @click="CustomerGet"></u-icon>
							</div>
						</div>
					</div>

					<div class="flex-row items-center radius pr20 mr10 mt20" style="height: 5vh; background-color: #f9f9f9; width: 100%">
						<div class="bg-white flex-row items-center justify-left radius" style="width: 100%; height: 5vh; background-color: #f9f9f9">
							<text class="ft11 ft-gray ml36 mr10" @click="filtrateGet">
								{{ Title }}
							</text>
							<u-icon name="arrow-down-fill" size="10"></u-icon>
							<text class="mr20"></text>
							<view class="my-input">
								<u-input v-if="showTage != '1'" border="none" v-model="field" @change="searchListenner" placeholder="输入关键字进行检索"></u-input>
							</view>
							<view class="ml24 my-input">
								<u-input border="none" v-if="showTage == '1'" maxlength="11" v-model="field" @change="searchListenner" placeholder="输入号码进行检索"></u-input>
							</view>

							<div class="flex-col justify-center items-center" style="height: 5vh">
								<u-icon class="ml48" name="/static/img/list/ss.svg" size="45rpx"></u-icon>
							</div>
						</div>
					</div>
				</div>
			</view>

			<view class="order-list ml24 mr24 pt10">
				<view
					v-for="(item, index) in orderList"
					:key="index"
					@click="goPath('/pages/subOrder/details?id=' + item.id)"
					class="flex-col pl20 pr20 pd36 pt38 bg-white mb18 order-item u-skeleton relative cardShow"
				>
					<view class="u-skeleton-fillet mb10 flex-row" @tap.stop style="width: 100%">
						<view class="flex-row justify-left items-center flex-1">
							<view class="flex-row justify-center items-center" style="">
								<view
									class="flex-col justify-center items-center"
									:style="{
										backgroundColor: item.check ? '#01BB74' : '#ffffff'
									}"
									@click="checkboxGroupChange(item, index)"
									style="border-radius: 100rpx; height: 40rpx; width: 40rpx; border: 2rpx solid #aaaaaa"
								>
									<u-icon name="checkbox-mark" color="#ffffff" size="28"></u-icon>
								</view>
								<view class="ml15">订单编号:</view>
								<view class="ml10" style="color: #f76565">
									{{ item.orderNumber }}
								</view>
							</view>
						</view>
						<view class="ml20" style="margin-right: -20rpx">
							<u-image v-if="vuex_userRole == 'D' && item.paymentState == '0'" class="u-img" width="120rpx" height="50rpx" src="@/static/img/obj/bq1.png"></u-image>
							<u-image v-if="vuex_userRole == 'R' && item.paymentState == '0'" class="u-img" width="120rpx" height="50rpx" src="@/static/img/obj/dqs.png"></u-image>
							<u-image v-if="item.paymentState == '1'" width="120rpx" height="50rpx" class="u-img" src="@/static/img/obj/bq2.png" :lazy-load="true"></u-image>
							<u-image
								v-if="vuex_userRole != 'R' && item.paymentState == '2'"
								width="120rpx"
								height="50rpx"
								class="u-img"
								src="@/static/img/obj/bq3.png"
								:lazy-load="true"
							></u-image>
							<u-image v-if="vuex_userRole == 'R' && item.paymentState == '2'" class="u-img" width="120rpx" height="50rpx" src="@/static/img/obj/yfk.png"></u-image>
						</view>
					</view>
					<view class="width100 pb25 pt10 u-skeleton-fillet">
						<u-row gutter="16" justify="between">
							<u-col span="20">
								<view class="flex-col items-center text-left">
									<text
										v-if="vuex_userRole != 'R'"
										:style="{
											color: ifZX(item.bossNumberE) ? '#AAAAAA' : '#3D3D3D'
										}"
										class="ft34 u-line-1 width100"
										style="font-weight: 500"
									>
										{{ item.organizationE || item.bossNumberE }}{{ ifZX(item.bossNumberE) ? '(已注销)' : '' }}
									</text>
									<text
										v-if="vuex_userRole == 'R'"
										:style="{
											color: ifZX(item.bossNumberS) ? '#AAAAAA' : '#3D3D3D'
										}"
										class="ft34 u-line-1 width100"
										style="font-weight: 500"
									>
										{{ item.enterpriseS || item.bossNumberS }}{{ ifZX(item.bossNumberS) ? '(已注销)' : '' }}
									</text>
								</view>
							</u-col>
						</u-row>
					</view>
					<view class="u-skeleton-fillet ft30 line25 ft-lighgray">
						<text>日期：{{ $u.timeFormat(item.creationTime, 'yyyy-mm-dd') }}</text>
					</view>
					<view class="ft-lighgray mt10 line25 flex-row items-center justify-end">
						<text>
							<text>订单金额：</text>
							<text class="ft-bold ft35" style="color: black">￥{{ item.price.toFixed(2) }}</text>
						</text>
					</view>
				</view>
				<view class="flex-row justify-center items-center" style="width: 100%" v-show="uloading">
					<up-loading-icon mode="flower"></up-loading-icon>
				</view>
			</view>
			<view v-if="!orderList.length" style="padding-bottom: 200rpx">
				<u-icon margin-top="22rpx" labelPos="bottom" :name="ImgUrl + '/wxImg/list/empty.svg'" label-color="#AAAAAA" label="暂无记录" size="180rpx"></u-icon>
			</view>
			<view style="height: 200rpx"></view>
			<view class="fixed" style="background-color: #ffffff; box-shadow: 0rpx 4rpx 6rpx 0rpx rgba(51, 51, 51, 0.2); bottom: 0">
				<view class="flex-row justify-between items-center" style="height: 10vh">
					<view class="flex-row items-center vw100">
						<view class="items-center flex-row" style="width: 92%; display: flex; justify-content: space-between">
							<view class="" style="text-align: left; font-size: 24rpx; color: #01bb74" :disabled="false">
								<view class="ml24" style="">
									<view class="flex-row justify-center items-center">
										<view
											class="flex-col justify-center items-center"
											@click="checkedAll"
											:style="{
												backgroundColor: checked ? '#01BB74' : '#ffffff'
											}"
											style="border-radius: 100rpx; height: 40rpx; width: 40rpx; border: 2rpx solid #aaaaaa"
										>
											<u-icon name="checkbox-mark" color="#ffffff" size="28"></u-icon>
										</view>
										<view class="ml15" style="color: #333333; font-size: 28rpx">全选</view>
									</view>
								</view>
							</view>
							<view class="mr20 flex-row" style="text-align: left; font-size: 28rpx; width: 30%; color: #666666">
								统计：
								<view style="color: #01bb74">{{ OrderQuantity }}个订单</view>
							</view>
							<view
								:disabled="!hasCheck"
								@click="dlPdf"
								class="flex-row justify-center items-center"
								style="width: 280rpx; height: 80rpx; border-radius: 90rpx; opacity: 1; background-color: #01bb74; color: white; float: right; font-weight: 600"
							>
								<u-icon name="https://res-oss.elist.com.cn/wxImg/statistics/down.svg" size="40rpx"></u-icon>
								下载PDF
							</view>
						</view>
					</view>
				</view>
			</view>
		</z-paging>

		<view class="order-simple-list pl30 pr30">
			<!-- <view class="fixed-bar pd30" style="background-color: #FFFFFF;box-shadow: 0rpx 4rpx 6rpx 0rpx rgba(51, 51, 51, 0.2);
				bottom: 0;">
				<view class="flex-row justify-between items-center">
					<view class="flex-row items-center vw100">
						<view class="items-center flex-row"
							style="width: 92%;display: flex;justify-content: space-between;">
							<view class="" style="text-align: left;font-size: 24rpx;color: #01BB74;" :disabled="false">
								<view class="ml24" style="">
									<view class="flex-row justify-center items-center">
										<view class="flex-col justify-center items-center" @click="checkedAll"
											:style="{backgroundColor:checked?'#01BB74':'#ffffff'}"
											style="border-radius: 100rpx;height: 40rpx;width: 40rpx;border: 2rpx solid #AAAAAA;">
											<u-icon name="checkbox-mark" color="#ffffff" size="28"></u-icon>
										</view>
										<view class="ml15" style="color: #333333;">
											全选
										</view>
									</view>
								</view>
							</view>
							<view class="mr20 flex-row"
								style="text-align: left;font-size: 24rpx;width: 30%;color: #666666;">
								统计：<view style="color: #01BB74;">{{OrderQuantity}}个订单</view>
							</view>
							<view :disabled="!hasCheck" @click="dlPdf" class="flex-row justify-center items-center"
								style="width: 280rpx;height: 80rpx;border-radius: 90rpx;opacity: 1;background-color: #01BB74;color: white;float: right;
								font-weight: 600;
								">
								<u-icon name="https://res-oss.elist.com.cn/wxImg/statistics/down.svg"
									size="40"></u-icon>下载PDF
							</view>
						</view>
					</view>
				</view>
			</view> -->

			<u-popup :show="show_start" mode="top" width="100%" @close="show_start = false">
				<u-navbar :autoBack="true" :placeholder="true" :border-bottom="false" :titleBold="true" title-color="#000000" title-size="34" bgColor="#ffffff">
					<view class="flex-row items-center justify-center ml50" style="width: 100%">
						<view class="" style="font-size: 34rpx; font-weight: 510">订单统计</view>
						<view
							@click="jumpVideo"
							class="flex-row justify-center items-center ml12"
							style="border: 2.2rpx solid #01bb74; height: 44rpx; width: 136rpx; border-radius: 8rpx; color: #01bb74; font-size: 22rpx"
						>
							使用方法
							<u-icon class="ml6" name="https://res-oss.elist.com.cn/wxImg/video.png" size="20rpx"></u-icon>
						</view>
					</view>
				</u-navbar>
				<view class="flex-col pl30 pr30 pb30 justify-between" style="width: 100%">
					<view class="flex-col mt20" style="width: 100%">
						<text
							style="
								font-family: Source Han Sans;
								font-size: 28rpx;
								font-weight: bold;
								line-height: 42.24rpx;
								letter-spacing: 0rpx;
								font-feature-settings: 'kern' on;
								color: #333333;
							"
						>
							时间筛选
						</text>
						<view class="flex-row items-center justify-between mt10" style="width: 100%">
							<view class="flex-row items-center flex-1">
								<text class="mr10" style="color: #999999">开始日期</text>
								<u-icon name="arrow-down-fill" size="10"></u-icon>
								<view @click="calendars.open()" class="ml14" style="border: 1rpx solid #999999; padding: 6rpx; border-radius: 6rpx">
									{{ date1 || '开始日期' }}
								</view>
							</view>
							<view class="flex-row items-center flex-1">
								<text class="mr10" style="color: #999999">结束日期</text>
								<u-icon name="arrow-down-fill" size="10"></u-icon>
								<view @click="calendars.open()" class="ml14" style="border: 1rpx solid #999999; padding: 6rpx; border-radius: 6rpx">
									{{ date2 || '结束日期' }}
								</view>
							</view>
						</view>

						<view class="mt40">
							<text
								style="
									font-family: Source Han Sans;
									font-size: 28rpx;
									font-weight: bold;
									line-height: 42.24rpx;
									letter-spacing: 0rpx;
									font-feature-settings: 'kern' on;
									color: #333333;
								"
							>
								范围筛选
							</text>

							<view class="flex-row mt20" style="width: 100%">
								<view
									class="flex-col justify-center items-center text-center mr24 tages"
									@click="Filtrate('0')"
									:style="{
										backgroundColor: showTage == '0' ? '#01BB74' : '#F2FBF8',
										color: showTage == '0' ? '#ffffff' : '#01BB74'
									}"
								>
									联系人
								</view>
								<view
									class="flex-col justify-center items-center text-center mr24 tages"
									@click="Filtrate('1')"
									:style="{
										backgroundColor: showTage == '1' ? '#01BB74' : '#F2FBF8',
										color: showTage == '1' ? '#ffffff' : '#01BB74'
									}"
									style=""
								>
									联系号码
								</view>
								<view
									class="flex-col justify-center items-center text-center tages"
									@click="Filtrate('2')"
									:style="{
										backgroundColor: showTage == '2' ? '#01BB74' : '#F2FBF8',
										color: showTage == '2' ? '#ffffff' : '#01BB74'
									}"
								>
									{{ vuex_userRole == 'R' ? '收货地址' : '收货地址' }}
								</view>
							</view>
							<view class="flex-row mt20" style="width: 100%">
								<view
									class="flex-col justify-center items-center text-center tages"
									@click="Filtrate('3')"
									:style="{
										backgroundColor: showTage == '3' ? '#01BB74' : '#F2FBF8',
										color: showTage == '3' ? '#ffffff' : '#01BB74'
									}"
								>
									产品名称
								</view>
							</view>
						</view>
					</view>
					<!-- 按钮 -->
					<view class="flex-row justify-end">
						<u-button
							color="#F4F4F4"
							type="info"
							@click="filterReset"
							shape="circle"
							size="medium"
							:custom-style="{
								width: '154rpx',
								color: '#999999',
								margin: '0 20rpx 0 0',
								height: '60rpx'
							}"
						>
							重置
						</u-button>
						<u-button color="#01BB74" @click="filterSubmit" shape="circle" size="medium" :custom-style="{ width: '154rpx', margin: 0, height: '60rpx' }">确定</u-button>
					</view>
					<!-- 日历选择器 -->
					<uv-calendars mode="range" :startDate="getMin()" :endDate="getMax()" ref="calendars" @confirm="date1Change" />
				</view>
			</u-popup>
		</view>

		<up-overlay :show="roleShow" @click="roleShow = false">
			<pop-database ref="popDatabase"></pop-database>
		</up-overlay>
	</view>
</template>

<script>
export default {
	data() {
		return {
			roleShow: false,
			checked: false,
			companySerch: '',
			seBtnColor: 1,
			searchText: '',
			showIcon: 1,
			details: {},
			dlText: '下载PDF',
			isEmpty: false,
			tagIndex: 0,
			filterTags: [
				{
					value: '近一周',
					key: true,
					show: true,
					time: 0
				},
				{
					value: '近一月',
					key: true,
					show: true,
					time: 1
				},
				{
					value: '近半年',
					key: false,
					show: false,
					time: 3
				},
				{
					value: '近三月',
					key: false,
					show: true,
					time: 2
				},
				{
					value: '近一年',
					key: false,
					show: true,
					time: 4
				}
			],
			show: false, //筛选弹窗
			showFX: false, //分享弹窗
			show_start: false,
			bf: [],
			orderList: [],
			orderListCopy: [],
			hasCheck: false, //转发文件弹框
			date1: '',
			date2: '',
			showTage: '0',
			showOrderTage: 0,
			totalMoney: 0,
			checkedOrders: [],
			customer: '',
			searchList: {
				start: '',
				end: '',
				scope: '0',
				keyword: '',
				customer: ''
			},
			timeItem: {
				value: '近一月',
				key: true
			},
			realTimeSel: {
				bossNumberS: '',
				bossNumberE: '',
				paymentState: '',
				phoneE: '',
				organizationE: '',
				enterpriseS: '',
				phoneS: '',
				startDate: '',
				endDate: '',
				takeE: '',
				contactsS: '',
				siteE: '',
				kTakeE: '',
				kPhoneE: '',
				kSiteE: '',
				enterpriseDz: '',
				getPhone: '',
				inventoryName: '',
				limitS: '0,25',
				limitE: '25',
				staffNumberS: '',
				staffNumberE: '',
				role: '',
				page: 1,
				pageSize: 10
			},
			field: '',
			refresh: true,
			uloading: true,
			OrderQuantity: 0,
			OrderQuantitySum: 0,
			system: false,
			dpdf: true,
			Title: '条件筛选',
			onReachBottom: false,
			type: 0,
			uNoticeBarlist: []
		};
	},
	onLoad() {
		var a = this.filterTags;
		var bn = this.vuex_user.jurisdiction.hasOwnProperty('A1');
		var yn = this.vuex_user.jurisdiction.hasOwnProperty('A2');
		if (bn) {
			this.filterTags[3].key = true;
		}
		if (yn) {
			this.filterTags[4].key = true;
		}

		var text = '';
		for (let key in this.vuex_user.jurisdiction) {
			var date = this.$u.timeFormat(this.vuex_user.jurisdiction[key], 'yyyy-mm-dd');
			console.log(key.includes('DQ'));
			if (key.includes('DQ')) {
				// "近三月，近一年 到期时间2024.12.31"
				var code = key.split('-')[0];
				if (code == 'A1') {
					text = text + '  近三月 已到期' + date;
				} else if (code == 'A2') {
					text = text + '    近一年 已到期' + date;
				}
				// else if(code == "B1"){
				// 	text = text + "  往年数据 已到期" + date
				// }else if(code == "B2"){
				// 	text = text + "  往年数据 已到期" + date
				// }
				console.log('`````````````````', key);
			} else {
				if (key.includes('A')) {
					text = text + (key == 'A1' ? '  近三月 到期时间' + date : '    近一年 到期时间' + date);
				}
				console.log('`````````````````', key);
			}
		}
		if (text !== '') {
			this.uNoticeBarlist.push(text);
		}
	},
	onReachBottom() {
		console.log('lala ');
		console.log('加载更多');
		var sum = this.realTimeSel.limitS;
		var list = sum.split(',');
		var s = Number(list[0]) + 25;
		var e = 25;
		this.s = s;
		this.e = e;
		s = s == 0 ? e - 25 : s + 25;

		if (this.orderList.length % 25 == 0) {
			this.realTimeSel.limitS = s + ',' + e;

			this.$refs.paging.reload();
		} else {
			this.uloading = false;
		}
	},
	onHide() {
		this.Title = '条件筛选';
	},
	onShow() {
		// this.loadDataRen();
		// #ifdef MP-WEIXIN
		this.$refs.popDatabase.roleShow = false;
		// #endif
		this.roleShow = false;

		this.systemIf();

		var ifwork = this.vuex_user.data.work == '0';
		var timeEmp = this.realTimeSel.startDate == '' || this.realTimeSel.endDate == '';
		var ifWorkPort = this.vuex_userRole == 'R';

		if (ifwork) {
			console.log('没工作');
			if (!ifWorkPort) {
				//发货
				console.log('没工作 发货');
				this.realTimeSel.bossNumberE = '';
				this.realTimeSel.bossNumberS = this.vuex_user.phone;
			} else {
				//收货
				console.log('没工作 收货');
				this.realTimeSel.bossNumberS = '';
				this.realTimeSel.bossNumberE = this.vuex_user.phone;
			}
		} else {
			console.log('有工作');
			var identity = this.vuex_user.workData.identity;
			var boss = this.vuex_user.workData.bossNumber;

			if (!ifWorkPort) {
				console.log('有工作 发货');
				this.realTimeSel.staffNumberE = '';
				if (identity == '4') {
					console.log('有工作 发货 员工');
					this.realTimeSel.staffNumberS = this.vuex_user.phone;
					this.realTimeSel.bossNumberS = boss;
					// this.realTimeSel.staffNumberS = boss;
				} else {
					console.log('有工作 发货 其他');
					this.realTimeSel.bossNumberE = '';
					this.realTimeSel.bossNumberS = boss;
				}
			} else {
				console.log('有工作 收货');
				this.realTimeSel.staffNumberS = '';
				if (identity == '4') {
					console.log('有工作 收货 员工');
					this.realTimeSel.staffNumberE = this.vuex_user.phone;
					this.realTimeSel.bossNumberE = boss;
				} else {
					console.log('有工作 收货 其他');
					this.realTimeSel.bossNumberE = boss;
				}
			}
		}

		if (this.date1 == '' && this.date2 == '') {
			var timeNow = new Date();
			// var oneWeekAgo = this.$u.timeFormat(new Date(timeNow.getTime() - 7 * 24 * 60 * 60 * 1000), 'yyyy-mm-dd')
			var oneWeekAgo = this.$u.timeFormat(new Date(timeNow.getTime() - 7 * 24 * 60 * 60 * 1000), 'yyyy-mm-dd');
			var timeNowGet = this.$u.timeFormat(new Date(), 'yyyy-mm-dd');
			var yearOneDate = new Date(timeNow.getFullYear(), 0, 1);
			console.log('一周：', oneWeekAgo, '现在：', timeNowGet, '年：', yearOneDate);
			console.log(this.isBig(oneWeekAgo, timeNowGet));
			if (this.isBig(oneWeekAgo, yearOneDate)) {
				oneWeekAgo = this.$u.timeFormat(yearOneDate, 'yyyy-mm-dd');
			}
			console.log('当前时间：', timeNowGet, '计算的时间：', oneWeekAgo < yearOneDate, '不能超过的时间：', yearOneDate);

			this.realTimeSel.startDate = oneWeekAgo;
			this.realTimeSel.endDate = timeNowGet;

			this.date2 = timeNowGet;
			this.date1 = oneWeekAgo;
			console.log('endDate', oneWeekAgo, timeNowGet);
		}

		let resJson = uni.getStorageSync('companyNameJSON');
		console.log(resJson);

		if (resJson != '') {
			var json = JSON.parse(resJson);
			this.customer = json.company;
			this.searchList.customer = json.company;
			if (!ifWorkPort) {
				this.realTimeSel.organizationE = json.company;
			} else {
				this.realTimeSel.enterpriseS = json.company;
			}

			this.$refs.paging.reload();
			uni.removeStorageSync('companyNameJSON');
		}
	},
	methods: {
		jumpVideo() {
			var port = this.vuex_userRole == 'D';
			this.$openVideo(port ? 1 : 0);
		},
		virtualListChange(vList) {
			this.orderList = vList;
		},
		queryList(pageNo, pageSize) {
			console.log(pageNo, pageSize);
			this.realTimeSel.page = pageNo;
			this.realTimeSel.pageSize = pageSize;
			// this.LimitSeting(pageNo);
			this.refreshDataNew();
		},
		refreshDataNew() {
			this.uloading = true;
			if (this.refresh) {
				this.refresh = false;
				this.onReachBottom = false;
				this.realTimeSel.role = this.vuex_userRole == 'R' ? '1' : '0';
				this.$u
					.post('/edo/order/getFilter', this.realTimeSel)
					.then((res) => {
						var orderList = res.data.data.map((obj) => {
							return {
								...obj,
								share: false,
								check: this.checked
							};
						});

						this.$refs.paging.complete(orderList);

						this.totalMoney = orderList.reduce((total, obj) => total + obj.price, 0);

						this.refresh = true;
						this.onReachBottom = true;
						this.uloading = false;
					})
					.catch((res) => {
						this.$refs.paging.complete(false);
						this.refresh = true;
						this.$u.toast('请求失败');
					});

				this.$u
					.post('/edo/order/Quantity', this.realTimeSel)
					.then((res) => {
						//console.log("当前订单个数：", res);
						this.OrderQuantity = res.data.data[1];
						this.OrderQuantitySum = res.data.data[0];
					})
					.catch((res) => {
						this.refresh = true;
						this.$u.toast('获取个数失败');
					});
				//
			} else {
				//console.debug("请求到底拦截");
			}
		},
		LimitSeting(pageNo) {
			//console.debug("分页");
			if (this.onReachBottom) {
				this.type = 1;
				var sum = this.realTimeSel.limitS;
				var list = sum.split(',');
				var s = Number(list[0]);
				var e = Number(list[1]);

				//console.debug("改变前 ", s, e);
				var mo = this.orderList.length % this.OrderQuantity;
				var deng = mo != 0;
				var xy = deng < 1;
				if (deng && xy) {
					// this.$u.toast("已经是最后一个")
				} else {
					if (pageNo == 1) {
						s = 0;
					} else {
						s = s + 10;
					}

					e = 10;
					//console.debug("改变后 ", s, e);
					this.realTimeSel.limitS = s + ',' + e;
				}
			} else {
				this.uloading = true;
				//console.log("重复拦截");
			}
		},
		loadVip() {
			var a = this.filterTags;
			var bn = this.vuex_user.jurisdiction.hasOwnProperty('A1');
			var yn = this.vuex_user.jurisdiction.hasOwnProperty('A2');
			if (bn) {
				this.filterTags[3].key = true;
			}
			if (yn) {
				this.filterTags[4].key = true;
			}
		},
		TitleFun(showTage) {
			console.log('改变');
			this.Title =
				showTage == 0
					? '联系人'
					: showTage == 1
					? '联系号码'
					: showTage == 2
					? this.vuex_userRole == 'R'
						? '收货地址'
						: '收货地址'
					: showTage == 3
					? '产品名称'
					: '条件筛选';
		},
		loadDataRen() {
			let role = this.vuex_user.data.work == '1' ? 1 : 2;
			console.log(this.vuex_user.data.work);
			var that = this;
			this.$api.user
				.refreshUser({
					phone: this.vuex_user.phone,
					role: role
				})
				.then((res) => {
					console.log('权限', res.data.data);
					let a = that.vuex_user;
					a.ac = res.data.data.ac;
					a.data = res.data.data.data;
					a.workData = res.data.data.workData;
					a.jurisdiction = res.data.data.jurisdiction;
					a.vuex_password = res.data.data.password;
					that.$u.vuex('vuex_user', a);
					if (res.data.data.data.work == '1') {
						that.$u.vuex('vuex_work', 'Y');
					} else {
						that.$u.vuex('vuex_work', 'N');
					}
					this.loadVip();
				});

			console.log('用户信息实时更新 ', this.vuex_user);
		},
		systemIf() {
			var that = this;
			uni.getSystemInfo({
				success: function (res) {
					console.log(res);
					// res.platform 可以是 'android' 或 'ios'
					if (res.osName === 'android') {
						that.system = true;
					} else if (res.osName === 'ios') {
						console.log('当前设备是iOS');
						that.system = false;
					}
				}
			});
		},
		ifZX(val) {
			return val.includes('zx-');
		},
		changeCustomer() {
			var ifWorkPort = this.vuex_userRole == 'R';
			if (!ifWorkPort) {
				this.realTimeSel.organizationE = this.customer;
			} else {
				this.realTimeSel.enterpriseS = this.customer;
			}
			this.$refs.paging.reload();
		},
		refreshData() {},
		searchListenner() {
			this.checked = false;
			var filterIndex = this.showTage;
			var ifWorkPort = this.vuex_userRole == 'R';

			if (filterIndex == '0') {
				if (!ifWorkPort) {
					//发货 收货人
					this.realTimeSel.kTakeE = this.field;
				} else {
					this.realTimeSel.kTakeE = this.field;
				}
			}

			if (filterIndex == '1') {
				if (!ifWorkPort) {
					//发货 电话号码
					this.realTimeSel.kPhoneE = this.field;
				} else {
					this.realTimeSel.kPhoneE = this.field;
				}
			}

			if (filterIndex == '2') {
				if (!ifWorkPort) {
					//发货 收货地址
					this.realTimeSel.kSiteE = this.field;
				} else {
					this.realTimeSel.kSiteE = this.field;
				}
			}

			if (filterIndex == '3') {
				if (!ifWorkPort) {
					//产品名称
					this.realTimeSel.inventoryName = this.field;
				} else {
					//产品名称
					this.realTimeSel.inventoryName = this.field;
				}
			}

			this.$refs.paging.reload();
			this.field;
		},
		dlPdf() {
			if (this.dpdf) {
				this.dpdf = false;
				if (this.checked) {
					var dx = Object.assign({}, this.realTimeSel);
					dx.limitS = '';
					dx.role = this.vuex_userRole == 'R' ? '1' : '0';
					this.$api.order
						.getFilteredOrders(dx)
						.then((res) => {
							console.log('下载pdf的单据：', res.data.data);
							this.downPdf(res.data.data);
						})
						.catch((res) => {
							this.$u.toast('服务器响应失败');
						});
				} else {
					var okDown = this.orderList.filter((res) => res.check == true);
					this.downPdf(okDown);
				}
			} else {
				this.$u.toast('请勿重复点击~');
			}
		},
		downPdf(okDown) {
			if (okDown.length <= 0) {
				this.dpdf = true;
				this.$u.toast('请选择单据~');
				return;
			}

			var condition = this.showTage == 0 ? '联系人' : this.showTage == 1 ? '联系号码' : this.showTage == 2 ? '收货地址' : this.showTage == 3 ? '产品名称' : '';
			if (this.field == '') {
				condition = this.field;
			}

			var dx = {
				start: this.realTimeSel.startDate,
				end: this.realTimeSel.endDate,
				cOrderList: okDown,
				port: this.vuex_userRole,
				condition: condition,
				text: this.field
			};

			console.log(dx);
			this.$api.order
				.generateOrderPDF(dx)
				.then((res) => {
					// #ifdef APP-PLUS
					console.log('pdf----------->', res.data.data);
					uni.downloadFile({
						url: res.data.data,
						success: (downloadResult) => {
							if (downloadResult.statusCode === 200) {
								// 第二步：保存文件到本地
								uni.saveFile({
									tempFilePath: downloadResult.tempFilePath,
									success: (saveResult) => {
										uni.hideLoading();
										uni.showToast({
											title: '保存成功',
											icon: 'success'
										});
										console.log('文件保存路径:', saveResult.savedFilePath);

										// 在Android上可能需要使用以下代码打开文件
										// #ifdef APP-PLUS
										plus.runtime.openFile(saveResult.savedFilePath, {}, function (e) {
											uni.showToast({
												title: '打开文件失败,没有找到打开工具',
												icon: 'none'
											});
										});
										// #endif
									},
									fail: (err) => {
										uni.hideLoading();
										uni.showToast({
											title: '保存失败',
											icon: 'none'
										});
										console.error('保存文件失败:', err);
									}
								});
							} else {
								uni.hideLoading();
								uni.showToast({
									title: '下载失败',
									icon: 'none'
								});
							}
						},
						fail: (err) => {
							uni.hideLoading();
							uni.showToast({
								title: '下载失败',
								icon: 'none'
							});
							console.error('下载文件失败:', err);
						}
					});
					// #endif

					// #ifdef APP-PLUS
					// uni.downloadFile({
					// 	url: res.data.data,
					// 	success: (downloadRes) => {
					// 		if (downloadRes.statusCode === 200) {
					// 			console.log('下载成功', downloadRes);

					// 			// 生成文件名（过滤非法字符）
					// 			let fileName = "";
					// 			const user = this.vuex_user;
					// 			if (user.ac && user.ac.enterpriseName) {
					// 				fileName = user.ac.enterpriseName.replace(/[\\/:*?"<>|]/g, "");
					// 			} else {
					// 				fileName = user.phone || '未知用户';
					// 			}
					// 			const timeNow = this.$u.timeFormat(new Date(), 'yyyy-mm-dd');
					// 			const fullFileName = `YDJ-${fileName}-${timeNow}.pdf`;

					// 			// 保存路径（直接存到 _doc 目录）
					// 			const savePath = `_doc/${fullFileName}`;

					// 			// 保存文件
					// 			uni.saveFile({
					// 				tempFilePath: downloadRes.tempFilePath,
					// 				filePath: savePath,
					// 				success: (saveRes) => {
					// 					console.log('文件保存成功', saveRes.savedFilePath);

					// 					// 检查文件是否存在
					// 					plus.io.resolveLocalFileSystemURL(
					// 						saveRes.savedFilePath,
					// 						(entry) => {
					// 							// 文件存在，尝试打开
					// 							uni.openDocument({
					// 								filePath: saveRes
					// 									.savedFilePath,
					// 								showMenu: true, // 关键：显示系统选择菜单
					// 								success: () => {
					// 									uni.hideLoading();
					// 									console.log(
					// 									'打开成功');
					// 								},
					// 								fail: (err) => {
					// 									uni.hideLoading();
					// 									console.error(
					// 										'打开失败', err
					// 										);
					// 									uni.showToast({
					// 										title: '打开失败，请安装PDF阅读器',
					// 										icon: 'none'
					// 									});
					// 								}
					// 							});
					// 						},
					// 						(err) => {
					// 							uni.hideLoading();
					// 							console.error('文件不存在', err);
					// 							uni.showToast({
					// 								title: '文件不存在或已损坏',
					// 								icon: 'none'
					// 							});
					// 						}
					// 					);
					// 				},
					// 				fail: (err) => {
					// 					uni.hideLoading();
					// 					console.error('保存失败', err);
					// 					uni.showToast({
					// 						title: '保存失败，请检查存储权限',
					// 						icon: 'none'
					// 					});
					// 				}
					// 			});
					// 		} else {
					// 			uni.hideLoading();
					// 			console.error('下载失败，状态码：', downloadRes.statusCode);
					// 			uni.showToast({
					// 				title: '下载失败，服务器错误',
					// 				icon: 'none'
					// 			});
					// 		}
					// 	},
					// 	fail: (err) => {
					// 		uni.hideLoading();
					// 		console.error('下载请求失败', err);
					// 		uni.showToast({
					// 			title: '下载失败，请检查网络',
					// 			icon: 'none'
					// 		});
					// 	}
					// });
					// #endif

					// #ifdef H5 || MP-WEIXIN
					uni.downloadFile({
						url: res.data.data,
						success: (res) => {
							if (res.statusCode === 200) {
								console.log('下载成功');
							}
							let that = this;

							var name = '';
							if (this.vuex_user.ac != null) {
								name = this.vuex_user.ac.enterpriseName;
							}

							if (name == null || name == undefined || name == '') {
								name = this.vuex_user.phone;
							}

							var timeNowGet = this.$u.timeFormat(new Date(), 'yyyy年mm月dd日');

							uni.getFileSystemManager().saveFile({
								tempFilePath: res.tempFilePath,
								filePath: wx.env.USER_DATA_PATH + '/' + 'YDJ-' + name + '-' + timeNowGet + '.pdf', //自定义文件名
								success(res) {
									uni.openDocument({
										filePath: res.savedFilePath,
										showMenu: true, //是否可以分享
										success: (res) => {
											uni.hideLoading();
											console.log(res);
											// that.checked = false
										},
										fail: (e) => {
											uni.showToast({
												title: '打开失败',
												icon: 'error'
											});
										}
									});
								}
							});
						}
					});

					// #endif
					this.hasCheck = false;
					// this.checked = false
					var that = this;
					setTimeout(function () {
						that.dpdf = true;
					}, 1000);
				})
				.catch((res) => {
					this.dpdf = true;
					this.$u.toast(res.message);
				});
		},
		getMax() {
			console.log('最大时间：', this.date2);
			const date = new Date();
			const year = date.getFullYear();
			const month = ('0' + (date.getMonth() + 1)).slice(-2);
			const day = ('0' + date.getDate()).slice(-2);
			return `${year}-${month}-${day}`;
		},
		getMin() {
			return this.date1;
		},
		getCurrentDate() {
			const date = new Date();
			const year = date.getFullYear();
			const month = ('0' + (date.getMonth() + 1)).slice(-2);
			const day = ('0' + date.getDate()).slice(-2);
			return `${year}-${month}-${day}`;
		},
		getCurrentDateMin() {
			const date = new Date();
			const year = date.getFullYear();
			return `${year}-01-01`;
		},
		timeMs(time) {
			var timeM = new Date(time);
			return timeM;
		},
		choiceGET(i) {
			this.field = '';
			this.checked = false;

			this.orderList.forEach((res) => {
				res.check = false;
			});
			this.hasCheck = false;

			var filterIndex = this.showTage;
			var ifWorkPort = this.vuex_userRole == 'R';
			if (filterIndex == '0') {
				if (!ifWorkPort) {
					//发货 收货人
					this.realTimeSel.kTakeE = '';
				} else {
					this.realTimeSel.kTakeE = '';
				}
			}

			if (filterIndex == '1') {
				if (!ifWorkPort) {
					//发货 电话号码
					this.realTimeSel.kPhoneE = '';
				} else {
					this.realTimeSel.kPhoneE = '';
				}
			}

			if (filterIndex == '2') {
				if (!ifWorkPort) {
					//发货 收货地址
					this.realTimeSel.kSiteE = '';
				} else {
					this.realTimeSel.kSiteE = '';
				}
			}

			if (filterIndex == '3') {
				if (!ifWorkPort) {
					//发货
					this.realTimeSel.inventoryName = this.field;
				}
			}

			this.showOrderTage = i;

			console.log(i);
			var state = i == 0 ? '' : i - 1;
			this.realTimeSel.paymentState = state;
			var hq = this.realTimeSel.limitS.split(',');
			this.realTimeSel.limitS = '0' + ',' + hq[1];
			this.$refs.paging.reload();
		},
		Filtrate(i) {
			console.log(i);
			this.showTage = i;
			this.searchList.scope = i;
			this.field = '';
			if (i == '0') {
				this.realTimeSel.kPhoneE = '';
				this.realTimeSel.kSiteE = '';
				this.realTimeSel.inventoryName = '';
			} else if (i == '1') {
				this.realTimeSel.kTakeE = '';
				this.realTimeSel.kSiteE = '';
				this.realTimeSel.inventoryName = '';
			} else if (i == '2') {
				this.realTimeSel.kPhoneE = '';
				this.realTimeSel.kTakeE = '';
				this.realTimeSel.inventoryName = '';
			} else if (i == '3') {
				this.realTimeSel.kPhoneE = '';
				this.realTimeSel.kTakeE = '';
				this.realTimeSel.kSiteE = '';
			}
			this.TitleFun(i);
			this.$refs.paging.reload();
		},
		e1() {},
		e2() {},
		date1Change(e) {
			this.date1 = e.range.before;
			this.realTimeSel.startDate = e.range.before;
			this.realTimeSel.endDate = e.range.after;
			this.date2 = e.range.after;
			// this.searchList.start = e.result
			// if (this.date2 != '') {
			// 	if (this.date2 >= e.result) {
			// 		this.realTimeSel.startDate = this.date1;
			// 	} else {
			// 		this.$u.toast('开始日期不能大于结束日期~');
			// 		this.date1 = '';
			// 	}
			// } else {
			// 	this.realTimeSel.startDate = this.date1;
			// }
		},
		// date2Change(e) {
		// 	this.date2 = e.result;
		// 	// this.searchList.end = e.result
		// 	// this.realTimeSel.endDate = this.date1
		// 	if (this.date1 != '') {
		// 		if (this.date2 >= this.date1) {
		// 			this.realTimeSel.endDate = this.date2;
		// 		} else {
		// 			this.$u.toast('开始日期不能大于结束日期~');
		// 			this.date2 = '';
		// 		}
		// 	} else {
		// 		this.realTimeSel.endDate = this.date2;
		// 	}
		// },
		filterSubmit() {
			this.show_start = false;
			this.realTimeSel.startDate = this.date1 != '' ? this.date1 : this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
			this.realTimeSel.endDate = this.date2 != '' ? this.date2 : this.$u.timeFormat(new Date(), 'yyyy-mm-dd');
			this.$refs.paging.reload();
		},
		filterReset() {
			this.date1 = '';
			this.date2 = '';
			var timeNow = new Date();
			var oneMonthAgo = this.$u.timeFormat(new Date(timeNow.getFullYear(), timeNow.getMonth() - 1, timeNow.getDate()), 'yyyy-mm-dd');
			// this.date1 = this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');

			var index = this.tagIndex;

			var timeNow = new Date();
			var yearOneDate = new Date(timeNow.getFullYear(), 0, 1);
			yearOneDate = this.$u.timeFormat(yearOneDate, 'yyyy-mm-dd');
			var timeNowGet = this.$u.timeFormat(new Date(), 'yyyy-mm-dd');
			var oneWeekAgo = this.$u.timeFormat(new Date(timeNow.getTime() - 7 * 24 * 60 * 60 * 1000), 'yyyy-mm-dd');
			var oneMonthAgo = this.$u.timeFormat(new Date(timeNow.getFullYear(), timeNow.getMonth() - 1, timeNow.getDate()), 'yyyy-mm-dd');
			var twoMonthsAgo = this.$u.timeFormat(new Date(timeNow.getFullYear(), timeNow.getMonth() - 2, timeNow.getDate()), 'yyyy-mm-dd');
			var threeMonthsAgo = this.$u.timeFormat(new Date(timeNow.getFullYear(), timeNow.getMonth() - 3, timeNow.getDate()), 'yyyy-mm-dd');
			var sixMonthsAgo = this.$u.timeFormat(new Date(timeNow.getFullYear(), timeNow.getMonth() - 6, timeNow.getDate()), 'yyyy-mm-dd');

			console.log(index);

			if (index == 0) {
				if (this.DateMaxMin(oneWeekAgo) < this.DateMaxMin(yearOneDate)) {
					oneWeekAgo = yearOneDate;
				}
				this.date1 = oneWeekAgo;
				console.log(index, '当前时间：', timeNowGet, '计算的时间：', oneWeekAgo < yearOneDate, '不能超过的时间：', yearOneDate);
				this.realTimeSel.startDate = oneWeekAgo;

				// console.log("前一周");
			} else if (index == 1) {
				if (this.DateMaxMin(oneMonthAgo) < this.DateMaxMin(yearOneDate)) {
					oneMonthAgo = yearOneDate;
				}
				this.date1 = oneMonthAgo;
				this.realTimeSel.startDate = oneMonthAgo;
				// console.log("前一个月");
			} else if (index == 2) {
				if (this.DateMaxMin(threeMonthsAgo) < this.DateMaxMin(yearOneDate)) {
					threeMonthsAgo = yearOneDate;
				}
				this.date1 = threeMonthsAgo;
				this.realTimeSel.startDate = threeMonthsAgo;
				// console.log("前三个月");
			} else if (index == 3) {
				// console.log(sixMonthsAgo, yearOneDate);
				// if (this.DateMaxMin(sixMonthsAgo) < this.DateMaxMin(yearOneDate)) {
				// 	sixMonthsAgo = yearOneDate;
				// }
				// this.date1 = sixMonthsAgo;
				// this.realTimeSel.startDate = sixMonthsAgo

				if (this.DateMaxMin(threeMonthsAgo) < this.DateMaxMin(yearOneDate)) {
					threeMonthsAgo = yearOneDate;
				}
				this.date1 = threeMonthsAgo;
				this.realTimeSel.startDate = threeMonthsAgo;
				// console.log("前半年");
			}

			if (index == 4) {
				this.date1 = yearOneDate;
				this.realTimeSel.startDate = yearOneDate;
			}

			this.date2 = this.$u.timeFormat(new Date(), 'yyyy-mm-dd');
			this.showTage = '0';
			this.realTimeSel.phoneE = '';
			this.realTimeSel.organizationE = '';
			this.realTimeSel.enterpriseS = '';
			this.realTimeSel.enterpriseS = '';
			this.realTimeSel.takeE = '';
			this.realTimeSel.enterpriseDz = '';
			this.realTimeSel.inventoryName = '';
			this.realTimeSel.customer = '';
			this.field = '';
			this.realTimeSel.phoneS = '';
			this.realTimeSel.contactsS = '';
			this.realTimeSel.siteE = '';

			this.realTimeSel.kTakeE = '';
			this.realTimeSel.kPhoneE = '';
			this.realTimeSel.kSiteE = '';

			this.Title = '条件筛选';
			this.$refs.paging.reload();
		},
		DateMaxMin(time) {
			return new Date(time).getTime();
		},
		checkboxGroup() {
			console.log('触发');
		},
		checkboxGroupChange(event, index) {
			this.orderList[index].check = this.orderList[index].check ? false : true;

			var allNum = this.OrderQuantity;
			var num = 0;
			this.orderList.forEach((res) => {
				var check = res.check;
				if (check) {
					num = num + 1;
				}
			});

			if (num == allNum) {
				this.checked = true;
			} else {
				this.checked = false;
			}
		},
		checkedAll() {
			console.log('全选');
			var len = this.orderList.length;
			if (len > 0) {
				if (this.checked) {
					this.checked = false;
					this.orderList.forEach((res) => {
						res.check = false;
					});
					this.hasCheck = false;
				} else {
					this.checked = true;
					this.orderList.forEach((res) => {
						res.check = true;
					});
					this.hasCheck = true;
				}
			} else {
				// 您暂无可勾选的订单
				this.$u.toast('您暂无可勾选的订单~');
			}
		},
		getData() {
			let that = this;
			var phone = this.vuex_user.data.work == '1' && this.vuex_user.workData.identity != '4' ? this.vuex_user.workData.bossNumber : this.vuex_user.phone;
			let zd = false;
			try {
				zd = this.vuex_user.workData.identity != '4';
			} catch (e) {
				//TODO handle the exception
				zd = false;
				if (this.vuex_user.workData == null || this.vuex_user.workData == undefined || this.vuex_user.workData == '') {
					zd = true;
					console.log('没有工作');
				}
			}

			if (this.vuex_userRole == 'D') {
				var dx = {};
				if (zd) {
					dx = {
						bossNumberS: phone
					};
				} else {
					dx = {
						staffNumberS: phone
					};
				}
				console.log(dx);
				this.$api.order
					.getOrders(dx)
					.then((res) => {
						var resDate = res.data.data.map((item) => {
							return {
								...item,
								check: false
							};
						});
						that.orderList = resDate;
						console.log(that.orderList);
						this.orderListCopy = resDate;
						if (that.orderList.length > 0) {
							this.loadData();
						}
					})
					.catch((res) => {
						that.$u.toast(that.message);
					});
			} else {
				this.orderList = [];
				console.log('收货端');
				var dx = {};
				if (zd) {
					dx = {
						bossNumberE: phone
					};
				} else {
					dx = {
						staffNumberE: phone
					};
				}
				console.log(dx);
				this.$api.order
					.getOrders(dx)
					.then((res) => {
						console.log(res.data.data);
						this.orderList = res.data.data;
						this.orderListCopy = res.data.data;
						if (that.orderList.length > 0) {
							this.loadData();
						}
					})
					.catch((res) => {
						that.$u.toast(that.message);
					});
			}
		},
		loadData() {
			this.totalMoney = this.orderList.reduce((total, obj) => total + obj.price, 0);
		},
		filtrateGet() {
			this.show_start = true;
			this.realTimeSel.startDate = this.date1 != '' ? this.date1 : this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
			this.realTimeSel.endDate = this.date2 != '' ? this.date2 : this.$u.timeFormat(new Date(), 'yyyy-mm-dd');
			this.$refs.paging.reload();
		},
		CustomerGet() {
			uni.navigateTo({
				url: '/pages/subOrder/table?show=0'
			});
		},
		jump() {
			console.log('跳转');
			uni.navigateTo({
				url: '/pages/statistics/company_name/company_name'
			});
		},
		isBig(time1, time2) {
			var t1 = new Date(time1);
			var t2 = new Date(time2);
			return t1 < t2;
		},
		tagClick(index, item) {
			if (item.key) {
				this.timeItem = item;
				this.tagIndex = index;
				console.log('日期选择：', index);

				var timeNow = new Date();
				var yearOneDate = new Date(timeNow.getFullYear(), 0, 1);
				var timeNowGet = this.$u.timeFormat(new Date(), 'yyyy-mm-dd');
				var oneWeekAgo = this.$u.timeFormat(new Date(timeNow.getTime() - 7 * 24 * 60 * 60 * 1000), 'yyyy-mm-dd');
				var oneMonthAgo = this.$u.timeFormat(new Date(timeNow.getFullYear(), timeNow.getMonth() - 1, timeNow.getDate()), 'yyyy-mm-dd');
				var twoMonthsAgo = this.$u.timeFormat(new Date(timeNow.getFullYear(), timeNow.getMonth() - 2, timeNow.getDate()), 'yyyy-mm-dd');
				var threeMonthsAgo = this.$u.timeFormat(new Date(timeNow.getFullYear(), timeNow.getMonth() - 3, timeNow.getDate()), 'yyyy-mm-dd');
				var sixMonthsAgo = this.$u.timeFormat(new Date(timeNow.getFullYear(), timeNow.getMonth() - 6, timeNow.getDate()), 'yyyy-mm-dd');

				this.orderList = this.orderListCopy;
				if (item.time == 0) {
					if (this.isBig(oneWeekAgo, yearOneDate)) {
						oneWeekAgo = this.$u.timeFormat(yearOneDate, 'yyyy-mm-dd');
					}
					this.date1 = oneWeekAgo;
					console.log('当前时间：', timeNowGet, '计算的时间：', oneWeekAgo < yearOneDate, '不能超过的时间：', yearOneDate);
					this.realTimeSel.startDate = oneWeekAgo;
				} else if (item.time == 1) {
					if (this.isBig(oneMonthAgo, yearOneDate)) {
						oneMonthAgo = this.$u.timeFormat(yearOneDate, 'yyyy-mm-dd');
					}
					this.date1 = oneMonthAgo;
					this.realTimeSel.startDate = oneMonthAgo;
				} else if (item.time == 2) {
					if (this.isBig(threeMonthsAgo, yearOneDate)) {
						threeMonthsAgo = this.$u.timeFormat(yearOneDate, 'yyyy-mm-dd');
					}
					this.date1 = threeMonthsAgo;
					this.realTimeSel.startDate = threeMonthsAgo;
				} else if (item.time == 3) {
					if (this.isBig(sixMonthsAgo, yearOneDate)) {
						sixMonthsAgo = this.$u.timeFormat(yearOneDate, 'yyyy-mm-dd');
					}

					console.log('sixMonthsAgo < yearOneDate', sixMonthsAgo < yearOneDate, sixMonthsAgo, yearOneDate);
					this.date1 = sixMonthsAgo;
					this.realTimeSel.startDate = sixMonthsAgo;
				}

				if (item.time == 4) {
					this.date1 = this.$u.timeFormat(yearOneDate, 'yyyy-mm-dd');
					this.realTimeSel.startDate = this.$u.timeFormat(yearOneDate, 'yyyy-mm-dd');
				}

				this.$refs.paging.reload();

				this.checked = false;
				this.orderList.forEach((res) => {
					res.check = false;
				});
				this.hasCheck = false;

				// this.field = ""
			} else {
				// this.$u.toast("请开通会员")
				var work = this.vuex_user.data.work != '1';
				if (work) {
					this.RenewStatic(index);
				} else {
					this.$u.toast('请联系老板开通共享权限');
				}
			}
		},
		RenewStatic(index) {
			this.roleShow = true;
			this.getPriceAll(index);
		},
		getPriceAll(index) {
			var dx = {
				phone: this.vuex_user.phone
			};
			this.$api.pay.getDatabaseUsage(dx).then((res) => {
				this.CrearOrder(res.data.data, index);
			});
		},
		CrearOrder(productCode, index) {
			console.log(productCode, index);

			this.$refs.popDatabase.productCode = productCode;

			var a = index == 4;

			if (productCode.length > 0) {
				var key = productCode[index - 3].key;

				if (key == 1) {
					//续费
					console.log('续费', key, productCode);
					var keys = productCode;
					this.$refs.popDatabase.KEY = 1;
					var time = {
						A1: {
							endTime: ''
						},
						A2: {
							endTime: ''
						}
					};
					keys.forEach((res) => {
						if (res.code == 'A1') {
							this.$refs.popDatabase.orderPriceB = res.price;
							this.$refs.popDatabase.orderPriceBDiscount = res.priceDiscount;
							time.A1.endTime = res.endTime;
						}
						if (res.code == 'A2') {
							this.$refs.popDatabase.orderPriceQ = res.price;
							this.$refs.popDatabase.orderPriceQDiscount = res.priceDiscount;
							time.A2.endTime = res.endTime;
						}
					});
					this.$refs.popDatabase.time = time;
					this.$refs.popDatabase.KEY = 1;
				}
				if (key == 2) {
					console.log('第一次购买', productCode);
					console.log('第一次购买', key);
					var keys = productCode;
					this.$refs.popDatabase.KEY = 2;
					keys.forEach((res) => {
						if (res.code == 'A1') {
							this.$refs.popDatabase.orderPriceB = res.price;
							this.$refs.popDatabase.orderPriceBDiscount = res.priceDiscount;
						}
						if (res.code == 'A2') {
							this.$refs.popDatabase.orderPriceQ = res.price;
							this.$refs.popDatabase.orderPriceQDiscount = res.priceDiscount;
						}
					});
				}
			} else {
				console.log('权限为null');
			}

			this.OrderInit(productCode);

			if (this.system) {
				this.$refs.popDatabase.src = 'https://res-oss.elist.com.cn/wxImg/vip/ddtj.svg';
			} else {
				this.$refs.popDatabase.src = 'https://res-oss.elist.com.cn/wxImg/vip/ddtj.png';
			}

			this.$refs.popDatabase.roleShow = true;
			console.log('当前点击类：');
			var type = index == 3 ? 'A1' : 'A2';
			this.$refs.popDatabase.orderInit(type);
		},
		OrderInit(productCode) {
			var workIF = this.vuex_user.data.work == '1';
			let order = {
				orderNumber: '', // 订单编号
				price: 0, // 支付总价（注：通常价格应该是一个数字或BigDecimal的字符串表示，但这里按照要求设置为空字符串）
				payment: 0, // 支付金额（同样，支付金额通常应为数字或字符串形式的金额，这里设为空字符串）
				productCode: '', // 产品编码
				particulars: '细节', // 细节
				state: '', // 状态
				type: '', // 类型
				phone: this.vuex_user.phone, // 所属者（这里假设所属者是通过电话号码表示的，但根据实际情况可能有所不同）
				description: '权限购买'
			};

			this.$refs.popDatabase.order = order;
		}
	}
};
</script>

<style lang="scss">
.tags2 {
	width: 20%;
	height: 54rpx;
	border-radius: 12rpx;
}
.fliter-wrap {
	background-color: white;
	padding: 14rpx;

	.fliter-wrap-view {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

		margin-left: 12rpx;
		margin-right: 12rpx;
		// background-color: #f80;

		.filter-btn {
			margin-left: 15rpx;
			margin-right: 15rpx;
			border-radius: 198rpx;
			background-color: #f9f9f9;
			padding: 12rpx;
			flex: 1;

			&.active {
				background: #1faf60;
				color: #fff;
			}
		}
	}
}

.list-data-wrap {
	background: linear-gradient(188.57deg, #fbfefb, #e8f5ed);
	box-shadow: 1rpx 1rpx 2rpx #eee;
}

.title {
	color: $u-type-primary;
	text-align: center;
	padding: 20rpx 0 0 0;
}

.order-item {
	border-radius: 20rpx;
	box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.03);
}

.copy-btn {
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABf1JREFUaEPtWWtsFFUU/s5skUcxEUuC+ESpkYcJSkkU/UHpzmw7s7X4AITwqIEfmIgmaFBMJJRoYiDGRyAhISQU8YEW0LTdmXbuHSgRQyS8NKF/aCoimhgxJFqQlO4cM7vb7XZ3232StIn7r73nfOf77j3nPs4QRvmPRjl/FFVARUXFmLKyux5x3fDkXCeG2XfJcULdufoVLEDTgksYvASEuWBMz5VAkv1vYBxn4jMgOuvYpsiEl7cAj7gL3k7AtExBChjfL4W5ejj/vATEZv3rfmAGrgI4BOAcMS6zj/7OlTSFMYnIfZBB5SCUg6HGMG4w8SrHtg6mw8xZgBowNoHxfgysl4C3e3pKd5040fRvrqSHs/drwQ8I/Ea/DYErhbCOJfvkJEDTjFUMfBoD6WSFXnbaQ98Vk3giVlUg+JTC/H3sfzzpjtJxTU1NvYk2WQtYWF07x+eGHYDKAHT6FN/S9vaW87eKfD+uqgZngrgz8jfhI2mbr+clQA0YG8D4EAAXSPociI8R00lAOSVE64VMeKpqvAPCu1ENWC2EuX8gtTJ4+wP6YmJaD2BBpkB5jn/JbskGx2n+Yyj/+fOXjC+deM1LpccJdECI0PKMAgKBQGmYfY0EWpy0ZFcZ6ALoWn6E2UvBcgDjE/yvM9EGxw7tHgpT04ydDLwCoFsKM37epK2BqqraexQf7wPYHwO8AMbGkhL3x7a2tov5ER/sFQgEZrhuybOg+I7mJYgpRSiYDt8fCK4l5j3emEK+h2y75edYSg02r66unuq6PouBOd4Igw9c75m4ptjb5ECR1laC3CYA0esHc72UVv9OFydXVVU9V/H5TkdMiJc5tvVVWgGqamwBoSE6yPuEsF4qxoxnwlA1w9vRZsVEzJXSOpvso2rBCwCXM/Fzjm19myLAm/2wq5wC6G6AuqQIPZwpcLHGVbX2fpD7Swzv2PhxPqOlpeV6Mr6mBVcKEfosbREnzr5CbNi2ZRWLYDY4qqqvB9GO6CpghZTmF8l+lZXPTO7oaLmSVoBfM/YS4KXMD1KYT2YTtJg2NTU10/rCSqQ4wXhPSnNzIr6mBZsYvNhVlCeOtLeeTEkhVTOOA3gazDuktF4rJrlssVTN8E7dmSAckrY5aAtXNcO7RowB86tSWjvTCfjT2w2YeKVjW59nG7SYdpqmNzKo3ruuSGHOTsRWNcNLqeWuolQcaW89k05A9JrA7kIp2zqKSSxbrMQ6lMJMOafq6upub25u/id9EWvGiBbgDwTriXmBFOaaUSlAjU8wGqQ0t466FEoQsFVKM3bYJiTngMHIrIH/VyDbnaQQu+F2odGSQg0gbPEmIXEb1XV97M0+uhEtXNokRGjbSC3itAKqdH260kddMQFLhQh5V/DBrcURUsRpBahqTSVIOeqRVojm2XYo8jYYdNKNbAH6ZyBa4ZEeexvdGQqFvGba6BBQqev3lvQp5wAuA9NuKUPrRvJJnJJCmmbsYWBtcvqMihXQNOMTBqJX+6TZH/ECABwG8Hxs5zkoRGhpcmMtuYi9h/RjBH5LCGt7IQdSvr4Jr8I4BIHSkk9ZAU0z9nL0SXlYCvOFfEkU4qdq+lGAKiMZ47XtCQ2ObXrv5LQtzUEr4Nf0Nwm0jQiXhW3eVwiRfHz9fn0WKRRtGBPv4vC4zY7zzV/DYQ1OIdVYBEKk38LgbY6wNuVDJF8fTQs2MriegdOOMOdlg5PyZFM1vQ2g6mjVKw9I2XopG6BCbRK/+jDRuuH6pImxUgREDw36NbqM+EnaZqTFeCt/MfJeq5Bymf2UIu4n6Q/U1BMrjXHSjBelNOPfxIolxmtS+caENxKwMXoroN8JvEgI81S2MYb8QlMV0HWFyUzYyyRc7oZCXcTu+Xzb60SYwExTXMJUYnhfIGdEY/BNdhXDcUIyW/JDrkB8Jfx1UxTl5scMWpYLaM62jFZF4d22bbXk6pvVNzJVNRqIaDaDHx2YsVxDpdh3g9GZL/F+tKwEJIaOfLkJK7OIUJqPBEXxXentnXCxo6OpJx//ZJ+cBRQjaDExRr2A/wCaZNNPvTsrRgAAAABJRU5ErkJggg==)
		right center no-repeat;
	background-size: 25rpx;
}

.fixed-add-btn {
	background: transparent;
}

.fixed-add-btn .add-btn {
	width: 260rpx;
	height: 100rpx;
	line-height: 100rpx;
	border-radius: 120rpx;
	background: #0fb076;
	border: 10rpx solid #def1e1;
}

.slot-wrap {
	border: 1rpx solid #eee;
	border-radius: 100rpx;
	padding: 0 15rpx;
	cursor: pointer;
}

.slot-wrap:active {
	background: #efefef;
}

.check-company:active {
	background: rgba(0, 0, 0, 0.03);
}

.check-company .u-line-1 {
	max-width: 220rpx;
}

.query-btn {
	position: fixed;
	right: 15rpx;
	bottom: 120rpx;
	bottom: calc(120rpx + env(safe-area-inset-bottom));
	bottom: calc(120rpx + constant(safe-area-inset-bottom));
	z-index: 10;
	background: #f80;
	width: 100rpx;
	height: 100rpx;
	border: 10rpx solid #f7e0cd;
	border-radius: 100%;
	box-sizing: content-box;
	color: #fff;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	text {
		font-size: 22rpx;
		line-height: 22rpx;
	}

	&:active {
		opacity: 0.8;
	}
}

.hl-btn.bg-gray {
}

.u-img {
	float: right;
}
.tages {
	color: #01bb74;
	background-color: #f2fbf8;
	width: 30%;
	height: 54rpx;
	border-radius: 12rpx;
}
</style>
