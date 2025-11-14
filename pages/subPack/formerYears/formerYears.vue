<template>
	<view class="vh100 vw100 fixed-bar-height" style="background-color: #fffbf1">
		<z-paging
			ref="paging"
			use-virtual-list
			:force-close-inner-list="true"
			:cell-height-mode="1 === 0 ? 'fixed' : 'dynamic'"
			@virtualListChange="virtualListChange"
			@query="queryList"
		>
			<template #top>
				<up-navbar
					:autoBack="true"
					:placeholder="true"
					:border-bottom="false"
					:titleBold="true"
					title-color="#000000"
					title="往年数据"
					title-size="34"
					bgColor="transparent"
					:background="{ background: 'transparent' }"
				></up-navbar>
				<up-notice-bar v-if="uNoticeBarlist.length" direction="column" :text="uNoticeBarlist" padding="6rpx 12rpx"></up-notice-bar>
				<view class="flex-row justify-between pl30 pr30" style="width: 100%; height: 5vh">
					<view class="flex-col justify-center items-center" @click="selectionIconClick" style="height: 100%">
						<liu-data-select elementId="data-select1" :dataList="dataList" @change="dropdown" color="#965510">
							<view id="data-select1" class="btn-info flex-row justify-center items-center">
								<view class="mr10">
									<albb-icon :icon="selectionIcon ? 'ydj-tiaojianshaixuanfan2' : 'ydj-tiaojianshaixuan2'" color="#965510" size="30rpx"></albb-icon>
								</view>
								<text style="color: #965510">{{ dropdownName }}</text>
								<text style="color: #965510" v-if="dropdownName != '请选择'">年</text>
							</view>
						</liu-data-select>
					</view>
					<!-- 数据分析对接后展示tab -->
					<!-- <view class="" v-if="!moneyCALL" style="height: 100%; width: 63%">
						<up-tabs
							:scrollable="false"
							:list="tabslist"
							@change="changeTabs"
							:current="current"
							:activeStyle="{ color: '#965510', fontSize: '32rpx' }"
							:inactiveStyle="{ color: '#333', fontSize: '32rpx' }"
							lineColor="#965510"
						></up-tabs>
					</view> -->
				</view>
			</template>
			<template #empty>
				<up-empty
					v-if="current == 0 && !moneyCALL"
					icon="https://res-oss.elist.com.cn/wxImg/list/empty.svg"
					iconSize="200rpx"
					text="没有数据哦~"
					marginTop="-200rpx"
				></up-empty>
			</template>
			<view class="order-simple-list pl30 pr30" v-show="current == 0 && !moneyCALL">
				<div class="bg-white pd20 mt20 radius flex-col justify-center items-center cardShow">
					<view class="flex-col" style="width: 100%">
						<text class="ft30 ft-gray mb18" style="color: #999999">累计金额</text>
						<view class="">
							<text class="ft42 ft-bold">￥</text>
							<up-count-to :end-val="OrderQuantitySum" separator="," color="#000000" font-size="40rpx" decimals="2" bold></up-count-to>
						</view>
					</view>

					<view class="flex-row justify-center items-center mt20" style="width: 100%">
						<view
							class="flex-row justify-center items-center mr24"
							@click="choiceGET(0)"
							:style="{
								backgroundColor: '#ffffff',
								color: showOrderTage == '0' ? '#965510' : '#999999',
								border: '2rpx solid ' + (showOrderTage == '0' ? '#965510' : '#999999')
							}"
							style="width: 20%; height: 54rpx; border-radius: 12rpx; height: 54.84rpx"
						>
							全部
						</view>
						<view
							class="flex-row justify-center items-center mr24"
							@click="choiceGET(1)"
							:style="{
								backgroundColor: '#ffffff',
								color: showOrderTage == '1' ? '#965510' : '#999999',
								border: '2rpx solid ' + (showOrderTage == '1' ? '#965510' : '#999999')
							}"
							style="width: 20%; height: 54rpx; border-radius: 12rpx; height: 54.84rpx"
						>
							{{ pinia_userRole == 'R' ? '待确收' : '待签收' }}
						</view>
						<view
							class="flex-row justify-center items-center"
							@click="choiceGET(2)"
							:style="{
								backgroundColor: '#ffffff',
								color: showOrderTage == '2' ? '#965510' : '#999999',
								border: '2rpx solid ' + (showOrderTage == '2' ? '#965510' : '#999999')
							}"
							style="width: 20%; height: 54rpx; border-radius: 12rpx; height: 54.84rpx"
						>
							已签收
						</view>
						<view
							class="flex-row justify-center items-center ml20"
							@click="choiceGET(3)"
							:style="{
								backgroundColor: '#ffffff',
								color: showOrderTage == '3' ? '#965510' : '#999999',
								border: '2rpx solid ' + (showOrderTage == '3' ? '#965510' : '#999999')
							}"
							style="width: 20%; height: 54rpx; border-radius: 12rpx; height: 54.84rpx"
						>
							{{ pinia_userRole == 'R' ? '已付款' : '已收款' }}
						</view>
					</view>

					<div class="flex-row items-center radius pr20 mr10 mt20" style="height: 5vh; background-color: #f9f9f9; width: 100%">
						<div class="bg-white flex-row items-center justify-left radius" style="width: 100%; height: 5vh; background-color: #f9f9f9">
							<text class="ft11 ft-gray ml36" @click="CustomerGet">{{ pinia_userRole == 'R' ? '供应商选择' : '客户选择' }}</text>
							<up-line direction="col" margin="0 20rpx" color="#333" length="30rpx"></up-line>
							<view class="flex-1">
								<uv-input
									border="none"
									@change="changeCustomer"
									clearable
									v-model="customer"
									:placeholder="pinia_userRole == 'R' ? '请选择供应商' : '请选择客户'"
								></uv-input>
							</view>

							<view class="flex-col justify-center items-center" style="height: 5vh">
								<view class="ml40"><wd-icon name="https://res-oss.elist.com.cn/wxImg/statistics/lxrOther.svg" size="45rpx" @click="CustomerGet"></wd-icon></view>
							</view>
						</div>
					</div>

					<div class="flex-row items-center radius pr20 mr10 mt20" style="height: 5vh; background-color: #f9f9f9; width: 100%">
						<div class="bg-white flex-row items-center justify-left radius" style="width: 100%; height: 5vh; background-color: #f9f9f9">
							<text class="ft11 ft-gray ml36" @click="filtrateGet">{{ Title }}</text>
							<view>
								<albb-icon class="ml10 mr10" icon="ydj-tiaojianshaixuanfan2" color="#606266" size="20rpx"></albb-icon>
							</view>

							<view class="my-input flex-1" v-if="showTage != '1'">
								<uv-input border="none" v-model="field" @change="searchListenner" :clearable="true" placeholder="输入关键字进行检索"></uv-input>
							</view>
							<view class="my-input flex-1" v-if="showTage == '1'">
								<uv-input border="none" maxlength="11" v-model="field" @change="searchListenner" :clearable="true" placeholder="输入号码进行检索"></uv-input>
							</view>
							<view class="flex-col justify-center items-center" style="height: 5vh">
								<view class="ml40"><wd-icon name="https://res-oss.elist.com.cn/wxImg/statistics/ssOther.svg" size="36rpx" @click="searchListenner"></wd-icon></view>
							</view>
						</div>
					</div>
				</div>
			</view>
			<view class="flex-col justify-center items-center" style="height: 80vh" v-show="current == 0 && moneyCALL">
				<view class="vw100" style="height: 100rpx">
					<up-empty
						icon="https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/role/empty.svg"
						iconSize="400rpx"
						text="暂无数据"
						mode="search"
						margin-top="-260rpx"
					></up-empty>
				</view>
				<view
					@click="$goPath('/pages/subPack/user/my_order/my_order')"
					v-if="pinia_user.workData.identity != 3 && pinia_user.workData.identity != 4 && pinia_user.workData.identity != 1"
					class="buyOrder flex-col justify-center items-center"
					style=""
				>
					前往订购
				</view>
			</view>
			<!-- 数据分析模块开始 -->
			<view class="pl24 pr24 mt12 pb38" v-show="current == 1">
				<data-analysis ref="dataAnalysis"></data-analysis>
			</view>
			<!-- 数据分析模块结束 -->
			<view class="order-list ml24 mr24 pt10 mt24" v-show="current == 0 && !moneyCALL">
				<view
					v-for="(item, index) in orderList"
					:key="index"
					@click="$goPath('/pages/subPack/formerYears/details?id=' + item.id)"
					class="flex-col pl20 pr20 pd36 pt38 bg-white mb18 order-item u-skeleton relative cardShow"
				>
					<view class="u-skeleton-fillet mb10 flex-row" @tap.stop style="width: 100%">
						<view class="flex-row justify-left items-center flex-1">
							<view>
								<!-- 	<up-checkbox-group :key="index" @change="checkboxGroupChange(item.orderNumber,index)">
									<up-checkbox v-model="item.check" shape="circle" active-color="#965510">
										<view class="ft30 ft-lightgray pr30" style="color: #666666;">
											订单编号
											<text class="ml15" style="color: #F76565;">
												{{item.orderNumber}}
											</text>
										</view>
									</up-checkbox>
								</up-checkbox-group> -->
								<view class="flex-row justify-center items-center">
									<view
										class="flex-col justify-center items-center"
										@click="checkboxGroupChange(item.orderNumber, index)"
										:style="{
											backgroundColor: item.check ? '#965510' : '#ffffff'
										}"
										style="border-radius: 100rpx; height: 40rpx; width: 40rpx; border: 2rpx solid #aaaaaa"
									>
										<wd-icon name="check" color="#ffffff" size="20rpx"></wd-icon>
									</view>
									<view class="ft30 ft-lightgray pr30 ml24" style="color: #666666">
										订单编号
										<text class="ml15" style="color: #f76565">
											{{ item.orderNumber }}
										</text>
									</view>
								</view>
							</view>
						</view>
						<view class="ml20" style="margin-right: -20rpx">
							<up-image
								v-if="pinia_userRole == 'D' && item.paymentState == '0'"
								class="u-img"
								width="120rpx"
								height="50rpx"
								src="https://res-oss.elist.com.cn/wxImg/obj/bq1.png"
							></up-image>
							<up-image
								v-if="pinia_userRole == 'R' && item.paymentState == '0'"
								class="u-img"
								width="120rpx"
								height="50rpx"
								src="https://res-oss.elist.com.cn/wxImg/obj/dqs.png"
							></up-image>
							<up-image
								v-if="item.paymentState == '1'"
								width="120rpx"
								height="50rpx"
								class="u-img"
								src="https://res-oss.elist.com.cn/wxImg/obj/bq2.png"
								:lazy-load="true"
							></up-image>
							<up-image
								v-if="pinia_userRole != 'R' && item.paymentState == '2'"
								width="120rpx"
								height="50rpx"
								class="u-img"
								src="https://res-oss.elist.com.cn/wxImg/obj/bq3.png"
								:lazy-load="true"
							></up-image>
							<up-image
								v-if="pinia_userRole == 'R' && item.paymentState == '2'"
								class="u-img"
								width="120rpx"
								height="50rpx"
								src="https://res-oss.elist.com.cn/wxImg/obj/yfk.png"
							></up-image>
						</view>
					</view>
					<view class="width100 pb25 pt10 u-skeleton-fillet">
						<up-row gutter="16" justify="between">
							<up-col span="20">
								<view class="flex-col items-center text-left">
									<text
										v-if="pinia_userRole != 'R'"
										:style="{
											color: ifZX(item.bossNumberE) ? '#AAAAAA' : '#3D3D3D'
										}"
										class="ft34 u-line-1 width100"
										style="font-weight: 500"
									>
										{{ item.organizationE || item.bossNumberE }}{{ ifZX(item.bossNumberE) ? '(已注销)' : '' }}
									</text>
									<text
										v-if="pinia_userRole == 'R'"
										:style="{
											color: ifZX(item.bossNumberS) ? '#AAAAAA' : '#3D3D3D'
										}"
										class="ft34 u-line-1 width100"
										style="font-weight: 500"
									>
										{{ item.enterpriseS || item.bossNumberS }}{{ ifZX(item.bossNumberS) ? '(已注销)' : '' }}
									</text>
								</view>
							</up-col>
						</up-row>
					</view>
					<view class="u-skeleton-fillet ft30 line25 ft-lightgray">
						<text>日期：{{ $u.timeFormat(item.creationTime, 'yyyy-mm-dd') }}</text>
					</view>
					<view class="ft-lightgray mt10 line25 flex-row items-center justify-end">
						<text>
							<text>订单金额：</text>
							<text class="ft-bold ft35" style="color: black">￥{{ item.price.toFixed(2) }}</text>
						</text>
					</view>
				</view>
				<!-- <view class="flex-row justify-center items-center" style="width: 100%;"
					v-show="uloading&&dataList.length>0">
					<up-loading-icon mode="flower"></up-loading-icon>
				</view> -->
			</view>

			<!-- 			<view class="flex-col justify-center items-center" style="height: 80vh;" v-show="current==0&&moneyCALL">
				<view class="vw100" style="height: 200rpx;">
					<up-empty src="https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/role/empty.svg"
						icon-size="400" text="暂无消息~" mode="search" margin-top="-200"></up-empty>
				</view>
				<view @click="$goPath('/pages/subPack/user/my_order/my_order')"
					class="buyOrder flex-col justify-center items-center" style="">
					前往订购
				</view>
			</view> -->

			<template #bottom>
				<view
					v-if="current == 0 && !moneyCALL && !uni.$u.getPinia('user.customized')"
					class="items-center flex-row justify-center"
					style="
						padding-right: 30rpx;
						display: flex;
						justify-content: space-between;
						background-color: #ffffff;
						box-shadow: 0rpx 4rpx 6rpx 0rpx rgba(51, 51, 51, 0.2);
						bottom: 0;
						height: 10vh;
					"
				>
					<view class="" style="text-align: left; font-size: 24rpx; color: #965510" :disabled="false">
						<view class="ml24" style="">
							<view class="">
								<view class="flex-row justify-center items-center">
									<view
										class="flex-col justify-center items-center"
										@click="checkedAll"
										:style="{
											backgroundColor: checked ? '#965510' : '#ffffff'
										}"
										style="border-radius: 100rpx; height: 40rpx; width: 40rpx; border: 2rpx solid #aaaaaa"
									>
										<wd-icon name="check" color="#ffffff" size="20rpx"></wd-icon>
									</view>
									<view class="ml15" style="color: #333333; font-size: 28rpx">全选</view>
								</view>
							</view>
						</view>
					</view>
					<view class="mr20 flex-row" style="text-align: left; font-size: 24rpx; width: 30%; color: #666666">
						统计：
						<view style="color: #965510">{{ OrderQuantity }}个订单</view>
					</view>
					<view
						:disabled="!hasCheck"
						@click="dlPdf"
						class="flex-row justify-center items-center"
						style="
							width: 280rpx;
							height: 80rpx;
							border-radius: 90rpx;
							opacity: 1;
							background: linear-gradient(270deg, #464b63 0%, #56638a 100%);
							color: white;
							float: right;
							font-weight: 600;
						"
					>
						<wd-icon name="https://res-oss.elist.com.cn/wxImg/statistics/down.svg" size="40rpx"></wd-icon>
						下载PDF
					</view>
				</view>
			</template>
		</z-paging>

		<up-popup :show="show_start" mode="top" width="550rpx" :safeAreaInsetBottom="false" @close="show_start = false">
			<view class="flex-col pd30 justify-between pt100">
				<view>
					<view class="flex-col mt40">
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
							<view class="flex-row items-center" style="width: 50%">
								<text style="color: #999999">开始日期</text>
								<albb-icon class="ml10 mr10" icon="ydj-tiaojianshaixuanfan2" color="#606266" size="20rpx"></albb-icon>
								<view
									@click="
										$refs.calendars.open();
										timeType = 1;
									"
									class="text-center flex-row justify-center items-center"
									style="border: 1rpx solid #999999; padding: 12rpx 6rpx; border-radius: 6rpx; min-width: 180rpx; height: 56rpx"
								>
									{{ date1 == '' ? '开始日期' : date1 }}
								</view>
							</view>
							<view class="flex-row items-center" style="width: 50%">
								<text style="color: #999999" class="ml10">结束日期</text>
								<albb-icon class="ml10 mr10" icon="ydj-tiaojianshaixuanfan2" color="#606266" size="20rpx"></albb-icon>
								<view
									@click="
										$refs.calendars.open();
										timeType = 2;
									"
									class="text-center flex-row justify-center items-center"
									style="border: 1rpx solid #999999; padding: 12rpx 6rpx; border-radius: 6rpx; min-width: 180rpx; height: 56rpx"
								>
									{{ date2 == '' ? '结束日期' : date2 }}
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
									class="justify-center items-center mr24 tages flex-row"
									@click="Filtrate('0')"
									:style="{
										backgroundColor: showTage == '0' ? '#4E5777' : '#FFFBF1',
										color: showTage == '0' ? '#ffffff' : '#965510'
									}"
								>
									联系人
								</view>
								<view
									class="justify-center items-center mr24 tages flex-row"
									@click="Filtrate('1')"
									:style="{
										backgroundColor: showTage == '1' ? '#4E5777' : '#FFFBF1',
										color: showTage == '1' ? '#ffffff' : '#965510'
									}"
								>
									联系号码
								</view>
								<view
									class="justify-center items-center tages flex-row"
									@click="Filtrate('2')"
									:style="{
										backgroundColor: showTage == '2' ? '#4E5777' : '#FFFBF1',
										color: showTage == '2' ? '#ffffff' : '#965510'
									}"
								>
									{{ pinia_userRole == 'R' ? '收货地址' : '收货地址' }}
								</view>
							</view>
							<view class="flex-row mt20" style="width: 100%">
								<view
									class="justify-center items-center tages flex-row"
									@click="Filtrate('3')"
									:style="{
										backgroundColor: showTage == '3' ? '#4E5777' : '#FFFBF1',
										color: showTage == '3' ? '#ffffff' : '#965510'
									}"
								>
									产品名称
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 按钮 -->
				<view class="flex-row justify-end mt40">
					<wd-button
						size="small"
						type="info"
						@click="filterReset"
						:customStyle="{
							width: '154rpx',
							color: '#999999',
							margin: '0 20rpx 0 0',
							height: '60rpx'
						}"
					>
						重置
					</wd-button>
					<wd-button size="small" @click="filterSubmit" :customStyle="{ width: '154rpx', margin: 0, height: '60rpx', background: '#4E5777' }">确定</wd-button>
				</view>
				<!-- 日历选择器 -->
				<uv-calendars color="#01BB74" confirmColor="#01BB74" :startDate="limitingTimeO" :endDate="limitingTimeT" ref="calendars" @confirm="date1Change" />
			</view>
		</up-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tabslist: [
				{
					name: '订单统计'
				},
				{
					name: '数据分析'
				}
			],
			limitingTimeO: '2020-01-01',
			limitingTimeT: '2024-01-01',
			checked: false,
			companySerch: '',
			seBtnColor: 1,
			searchText: '',
			showIcon: 1,
			details: {},
			dlText: '下载PDF',
			isEmpty: false,
			tagIndex: 0,
			current: 0,
			moneyCALL: true,
			dataList: [],
			dropdownName: '请选择',
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
				kTakeE: '',
				kPhoneE: '',
				contactsS: '',
				siteE: '',
				enterpriseDz: '',
				getPhone: '',
				inventoryName: '',
				limitS: '0,25',
				limitE: '25',
				staffNumberS: '',
				staffNumberE: '',
				role: '',
				inventoryName: '',
				page: 1,
				pageSize: 10
			},
			field: '',
			refresh: true,
			uloading: true,
			OrderQuantity: 0,
			OrderQuantitySum: 0,
			selectionIcon: true,
			time: {
				A: {
					show: false,
					mode: 'range'
				},
				B: {
					show: true,
					mode: 'range'
				}
			},
			year: null,
			jurisdiction: true,
			option: null,
			Title: '条件筛选',
			uNoticeBarlist: [],
			downPdfCheck: true,
			hideEmptyView: false,
			timeType: null
		};
	},
	onLoad(option) {
		this.getYear();
		this.year = new Date().getFullYear() - 1;
	},
	onReachBottom() {},
	onPullDownRefresh() {},
	onShow() {
		// this.getYear()
		var option = uni.getStorageSync('companyNameJSON');
		if (option) {
			this.option = JSON.parse(option);
			console.log(this.option.company);
			if (this.pinia_userRole == 'D') {
				this.realTimeSel.organizationE = this.option.company;
				this.customer = this.option.company;
			} else {
				this.realTimeSel.enterpriseS = this.option.company;
				this.customer = this.option.company;
			}
			uni.removeStorageSync('companyNameJSON');
			this.$refs.paging.reload();
		}

		this.setGD();
	},
	methods: {
		changeTabs(tabItem) {
			console.log(tabItem, this.current);
			this.current = tabItem.index;
			if (this.current == 1) {
				this.$refs.dataAnalysis.getServerData();
			}
		},
		virtualListChange(vList) {
			this.orderList = vList;
		},
		queryList(pageNo, pageSize) {
			//权限匹配
			var port = this.pinia_userRole == 'D';
			if (port) {
				var DP = this.pinia_user.jurisdiction['B1-' + this.year] || this.pinia_user.jurisdiction['B1'];
				console.log('===请求拦截判断D===>', DP);
				if (DP == undefined) {
					// this.$u.toast("您没有该年份数据权限");
					this.$refs.paging.complete([]);
					this.hideEmptyView = true;
					this.jurisdiction = false;
					return;
				} else {
					this.moneyCALL = false;
				}
			} else {
				var RP = this.pinia_user.jurisdiction['B2-' + this.year] || this.pinia_user.jurisdiction['B2'];
				console.log('===请求拦截判断R===>', RP);
				if (RP == undefined) {
					// this.$u.toast("您没有该年份数据权限");
					this.hideEmptyView = true;
					this.$refs.paging.complete([]);
					this.jurisdiction = false;
					return;
				} else {
					this.moneyCALL = false;
				}
			}

			console.log(pageNo, pageSize);
			this.realTimeSel.page = pageNo;
			this.realTimeSel.pageSize = pageSize;
			this.refreshData();
		},
		selectionIconClick() {
			this.selectionIcon = !this.selectionIcon;
			console.log(this.selectionIcon);
		},
		TitleFun(showTage) {
			this.Title =
				showTage == 0
					? '联系人'
					: showTage == 1
					? '联系号码'
					: showTage == 2
					? this.pinia_userRole == 'R'
						? '收货地址'
						: '收货地址'
					: showTage == 3
					? '产品名称'
					: '条件筛选';
		},
		setGD() {
			var b1 = this.pinia_user.jurisdiction.hasOwnProperty('B1');
			var b2 = this.pinia_user.jurisdiction.hasOwnProperty('B2');
			var b1y = this.pinia_user.jurisdiction.hasOwnProperty('B1-' + this.dropdownName);
			var b2y = this.pinia_user.jurisdiction.hasOwnProperty('B2-' + this.dropdownName);
			var ifWorkPort = this.pinia_userRole == 'R';

			if (ifWorkPort) {
				if (b2) {
					this.uNoticeBarlist.push('往年数据收货端截至' + this.$u.timeFormat(this.pinia_user.jurisdiction['B2'], 'yyyy-mm-dd') + '到期');
				}
				if (b2y) {
					this.uNoticeBarlist.push('往年数据收货端截至' + this.$u.timeFormat(this.pinia_user.jurisdiction['B2-' + this.dropdownName], 'yyyy-mm-dd') + '到期');
				}
			} else {
				if (b1) {
					this.uNoticeBarlist.push('往年数据发货端截至' + this.$u.timeFormat(this.pinia_user.jurisdiction['B1'], 'yyyy-mm-dd') + '到期');
				}

				if (b1y) {
					this.uNoticeBarlist.push('往年数据发货端截至' + this.$u.timeFormat(this.pinia_user.jurisdiction['B1-' + this.dropdownName], 'yyyy-mm-dd') + '到期');
				}
			}
		},
		getDatabase() {
			var b1 = this.pinia_user.jurisdiction.B1;
			var b2 = this.pinia_user.jurisdiction.B2;
			//需购买
		},
		getInIt() {
			var ifwork = this.pinia_user.data.work == '0';
			var timeEmp = this.realTimeSel.startDate == '' || this.realTimeSel.endDate == '';
			var ifWorkPort = this.pinia_userRole == 'R';

			if (ifwork) {
				console.log('没工作');
				if (!ifWorkPort) {
					//发货
					console.log('没工作 发货');
					this.realTimeSel.bossNumberE = '';
					this.realTimeSel.bossNumberS = this.pinia_user.phone;
				} else {
					//收货
					console.log('没工作 收货');
					this.realTimeSel.bossNumberS = '';
					this.realTimeSel.bossNumberE = this.pinia_user.phone;
				}
			} else {
				console.log('有工作');
				var identity = this.pinia_user.workData.identity;
				var boss = this.pinia_user.workData.bossNumber;

				if (!ifWorkPort) {
					console.log('有工作 发货');
					this.realTimeSel.staffNumberE = '';
					if (identity == '4') {
						console.log('有工作 发货 员工');
						this.realTimeSel.staffNumberS = this.pinia_user.phone;
						this.realTimeSel.bossNumberS = boss;
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
						this.realTimeSel.staffNumberE = this.pinia_user.phone;
						this.realTimeSel.bossNumberE = boss;
					} else {
						console.log('有工作 收货 其他');
						this.realTimeSel.bossNumberE = boss;
					}
				}
			}

			if (this.realTimeSel.startDate == '' && this.realTimeSel.endDate == '') {
				console.log('时间为null', this.date1, this.date2);
				console.log(this.dataList);
				if (this.date1 == '' && this.date2 == '') {
					console.log('时间为null');
				} else {
					this.realTimeSel.startDate = this.date1;
					this.realTimeSel.endDate = this.date2;
				}
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
				// this.refreshData()
				uni.removeStorageSync('companyNameJSON');
			}
			var timeO = this.realTimeSel.startDate;
			var timeT = this.realTimeSel.endDate;
			if (timeO != '' && timeT != '') {
				this.$refs.paging.refresh();
			} else {
				this.uloading = false;
			}
		},
		getYear() {
			console.log('this.pinia_user.jurisdiction', this.pinia_user.jurisdiction);
			console.log('this.pinia_userRole', this.pinia_userRole);
			var role = this.pinia_userRole == 'R';
			for (let key in this.pinia_user.jurisdiction) {
				if (role) {
					if (key == 'B2') {
						//全部权限
						this.getAllYear();
						return;
					} else {
						var year = key.split('-')[1];
						if (year != null && year != 'DQ' && year != 'null' && year != '') {
							this.dataList.push(year);
						}
					}
				} else {
					if (key == 'B1') {
						//全部权限
						this.getAllYear();
						return;
					} else {
						var year = key.split('-')[1];
						if (year != null && year != 'DQ' && year != 'null' && year != '') {
							this.dataList.push(year);
						}
					}
				}
			}
		},
		getAllYear() {
			var role = this.pinia_userRole == 'R';
			var work = this.pinia_user.data.work == '0';
			var dx = {
				bossNumberS: '',
				bossNumberE: ''
			};
			if (role) {
				dx.bossNumberE = work ? this.pinia_user.phone : this.pinia_user.workData.bossNumber;
			} else {
				dx.bossNumberS = work ? this.pinia_user.phone : this.pinia_user.workData.bossNumber;
			}
			console.log('老数据', dx);
			uni.$api.order.getOldOrders(dx).then((res) => {
				console.log('获取数据:', res);
				var resData = res.data.data;
				if (role) {
					this.dataList = resData.R;
				} else {
					this.dataList = resData.D;
				}

				if (this.dataList.length > 0) {
					this.dropdownName = this.dataList[0];
					this.date1 = this.dataList[0] + '-01-01';
					this.date2 = this.getLastMillisecondOfYear(this.dataList[0]);

					var timeO = (this.realTimeSel.startDate = this.dropdownName + '-01-01');
					var timeT = (this.realTimeSel.endDate = this.getLastMillisecondOfYear(this.dropdownName));

					this.date1 = this.dropdownName + '-01-01';
					this.date2 = this.getLastMillisecondOfYear(this.dropdownName);

					this.limitingTimeO = this.dropdownName + '-01-01';
					this.limitingTimeT = this.getLastMillisecondOfYear(this.dropdownName);

					this.getInIt();
				} else {
					this.dropdownName = '暂无选项';
				}
			});
		},
		dropdown(e) {
			this.year = e;
			//验证权限
			var role = this.pinia_userRole == 'D';
			if (role) {
				var b1 = this.pinia_user.jurisdiction['B1-' + e] || this.pinia_user.jurisdiction['B1'];
				console.log('B1：', b1);
				if (b1 != undefined) {
					//时间对比
					console.log('当前权限：', b1);
					var ifbig = this.compareDates(b1);
					if (!ifbig) {
						//通过
						this.dropdownName = e;
						this.selectionIcon = false;
						var timeO = (this.realTimeSel.startDate = this.dropdownName + '-01-01');
						var timeT = (this.realTimeSel.endDate = this.getLastMillisecondOfYear(this.dropdownName));
						this.date1 = this.dropdownName + '-01-01';
						this.date2 = this.getLastMillisecondOfYear(this.dropdownName);
						this.limitingTimeO = this.dropdownName + '-01-01';
						this.limitingTimeT = this.getLastMillisecondOfYear(this.dropdownName);
						this.moneyCALL = false;
						this.$refs.paging.refresh();
					} else {
						//请续费

						this.$u.toast('已过期请续费');
					}
				} else {
					console.log('请购买：', b1);
					this.$u.toast('请购买相关权限');
				}
			} else {
				var b2 = this.pinia_user.jurisdiction.B2;
				console.log('B2：', b2);
				if (b2 != undefined) {
					console.log('当前权限：', b2);
					var ifbig = this.compareDates(b2);
					if (!ifbig) {
						//通过
						this.dropdownName = e;
						this.selectionIcon = false;
						var timeO = (this.realTimeSel.startDate = this.dropdownName + '-01-01');
						var timeT = (this.realTimeSel.endDate = this.getLastMillisecondOfYear(this.dropdownName));
						this.date1 = this.dropdownName + '-01-01';
						this.date2 = this.getLastMillisecondOfYear(this.dropdownName);
						this.limitingTimeO = this.dropdownName + '-01-01';
						this.limitingTimeT = this.getLastMillisecondOfYear(this.dropdownName);
						this.moneyCALL = false;
						this.$refs.paging.refresh();
					} else {
						//请续费
						console.log('请续费：', b2);
						this.$u.toast('已过期请续费');
					}
				} else {
					console.log('请购买：', b2);
					this.$u.toast('请购买相关权限');
				}
			}

			console.log('所有权限：', this.pinia_user.jurisdiction);
		},
		compareDates(dateString1) {
			// 创建一个新的Date对象
			var date1 = new Date();
			var date2 = new Date(dateString1);
			return date1.getTime() > date2.getTime();
		},
		getLastDayOfYear(year) {
			// 设置日期为下一年的1月0日，这将自动变为前一年的12月31日
			var date = new Date(year, 12, 0); // 注意月份是0-11，所以12月是11
			var lastDayString = date.toISOString().split('T')[0];
			return lastDayString;
		},

		jumpnView() {
			console.log('this.dropdownName', this.dropdownName);
			if (this.dropdownName == '' || this.dropdownName == '请选择') {
				this.$u.toast('请选择年份');
			} else {
				if (this.jurisdiction && this.orderList.length > 0) {
					uni.navigateTo({
						url: '/pages/subPack/formerYears/dataAnalysis?year=' + this.dropdownName
					});
				} else {
					this.$u.toast(this.jurisdiction ? '当前无往年数据' : '请购买相关权限');
				}
			}
		},
		ifZX(val) {
			return val.includes('zx-');
		},
		changeCustomer() {
			var ifWorkPort = this.pinia_userRole == 'R';
			if (!ifWorkPort) {
				this.realTimeSel.organizationE = this.customer;
			} else {
				this.realTimeSel.enterpriseS = this.customer;
			}
			this.$refs.paging.refresh();
		},
		refreshData() {
			var timeO = this.realTimeSel.startDate != '';
			var timeT = this.realTimeSel.endDate != '';

			console.log('===请求判断=refresh==>：', this.refresh);
			console.log('===请求判断=timeO==>：', timeO);
			console.log('===请求判断=timeT==>：', timeT);

			// this.checked = false
			if (this.refresh && timeO && timeT) {
				this.refresh = false;
				this.realTimeSel.role = this.pinia_userRole == 'R' ? '1' : '0';
				uni.$api.order
					.getFilteredOrders(this.realTimeSel)
					.then((res) => {
						console.log(res.data.data);

						var orderList = res.data.data.map((obj) => {
							return {
								...obj,
								check: this.checked
							};
						});

						this.$refs.paging.complete(orderList);

						this.totalMoney = orderList.reduce((total, obj) => total + obj.price, 0);

						this.refresh = true;
						this.uloading = false;
					})
					.catch((res) => {
						this.refresh = true;
						this.$refs.paging.complete(false);
						this.$u.toast('服务器响应失败');
					});

				uni.$api.order
					.getFilteredOrderCount(this.realTimeSel)
					.then((res) => {
						console.log('当前订单个数：', res);
						this.OrderQuantity = res.data.data[1];
						this.OrderQuantitySum = res.data.data[0];
					})
					.catch((res) => {
						this.refresh = true;
					});
			} else {
				this.$refs.paging.complete([]);
			}
		},
		searchListenner() {
			var filterIndex = this.showTage;
			var ifWorkPort = this.pinia_userRole == 'R';

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

			this.$refs.paging.refresh();
			// this.field
		},
		dlPdf() {
			if (this.checked) {
				var dx = Object.assign({}, this.realTimeSel);
				dx.limitS = '';
				dx.role = this.pinia_userRole == 'R' ? '1' : '0';
				uni.$api.order
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
		},
		downPdf(okDown) {
			if (okDown.length <= 0) {
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
				port: this.pinia_userRole,
				condition: condition,
				text: this.field
			};

			if (!this.downPdfCheck) {
				this.$u.toast('请勿重复点击');
				return;
			}

			this.downPdfCheck = false;

			console.log(dx);
			uni.$api.order
				.generateOrderPDF(dx)
				.then((res) => {
					uni.downloadFile({
						url: res.data.data,
						success: (res) => {
							if (res.statusCode === 200) {
								console.log('下载成功');
							}
							let that = this;

							var name = '';
							if (this.pinia_user.ac != null) {
								name = this.pinia_user.ac.enterpriseName;
							}

							if (name == null || name == undefined || name == '') {
								name = this.pinia_user.phone;
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
											that.checked = false;
											that.clearCheck();
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
					this.hasCheck = false;
					this.checked = false;
				})
				.catch((res) => {
					this.$u.toast(res.message);
				});
		},
		clearCheck() {
			this.orderList.forEach((res) => (res.check = false));
			this.downPdfCheck = true;
		},
		getCurrentDate() {
			const date = new Date();
			const year = this.dropdownName;
			const month = ('0' + (date.getMonth() + 1)).slice(-2);
			const day = ('0' + date.getDate()).slice(-2);
			return `${year}-${month}-${day}`;
		},
		getCurrentDateMin() {
			const year = this.dropdownName;
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

			this.showOrderTage = i;
			var state = i == 0 ? '' : i - 1;
			this.realTimeSel.paymentState = state;
			this.$refs.paging.reload();
		},
		Filtrate(i) {
			console.log(i);
			this.showTage = i;
			this.searchList.scope = i;
			this.TitleFun(i);
			if (this.field) {
				this.field = '';
				this.realTimeSel.kTakeE = '';
				this.realTimeSel.kSiteE = '';
				this.realTimeSel.kPhoneE = '';
				this.realTimeSel.inventoryName = '';
				this.$refs.paging.reload();
			}
		},
		date1Change(e) {
			var len = this.dataList.length > 0;
			console.log(len);
			if (!len) {
				this.$u.toast('您没有相关产品记录~');
				return;
			} else {
				if (this.timeType == 1) {
					this.date1 = e.fulldate;
					this.date2 = '';
				} else {
					if (!this.date1) {
						return uni.$u.toast('请先选择开始时间');
					} else if (new Date(e.fulldate).getTime() < new Date(this.date1).getTime()) {
						return uni.$u.toast('开始日期不能大于结束日期~');
					}
					this.date2 = e.fulldate;
				}
			}
		},
		filterSubmit() {
			// if (this.dataList.length > 0) {
			// 	this.show_start = false;
			// 	this.realTimeSel.startDate = this.date1;
			// 	this.realTimeSel.endDate = this.date2;
			// } else {
			// 	this.show_start = false;
			// }
			this.show_start = false;

			const date = new Date();
			date.setDate(date.getDate() + 15);

			this.realTimeSel.startDate = this.date1 != '' ? this.date1 : this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
			this.realTimeSel.endDate = this.date2 != '' ? this.date2 : this.$u.timeFormat(date, 'yyyy-mm-dd');
			this.$refs.paging.refresh();
		},
		getLastMillisecondOfYear(year) {
			const lastMillisecond = new Date(year, 11, 31, 23, 59, 59, 999);
			var date = new Date(lastMillisecond);
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			var d = date.getDate();
			console.log('d-----------', d);
			return `${y}-${m}-${d}`;
		},
		filterReset() {
			if (this.dropdownName == '暂无选项') {
				return;
			}

			this.date1 = this.dropdownName + '-01-01';
			this.date2 = this.getLastMillisecondOfYear(this.dropdownName);

			this.realTimeSel.startDate = this.dropdownName + '-01-01';
			this.realTimeSel.endDate = this.getLastMillisecondOfYear(this.dropdownName);

			// var timeNow = new Date();
			// var oneMonthAgo = this.$u.timeFormat(new Date(timeNow.getFullYear(), timeNow.getMonth() - 1, timeNow
			// 	.getDate()), 'yyyy-mm-dd');
			// var index = this.tagIndex

			// var timeNow = new Date();
			// var yearOneDate = new Date(timeNow.getFullYear(), 0, 1);
			// var timeNowGet = this.$u.timeFormat(new Date(), 'yyyy-mm-dd');
			// var oneWeekAgo = this.$u.timeFormat(new Date(timeNow.getTime() - 7 * 24 * 60 * 60 * 1000),
			// 	'yyyy-mm-dd')
			// var oneMonthAgo = this.$u.timeFormat(new Date(timeNow.getFullYear(), timeNow.getMonth() - 1, timeNow
			// 	.getDate()), 'yyyy-mm-dd');
			// var twoMonthsAgo = this.$u.timeFormat(new Date(timeNow.getFullYear(), timeNow.getMonth() - 2, timeNow
			// 	.getDate()), 'yyyy-mm-dd');
			// var threeMonthsAgo = this.$u.timeFormat(new Date(timeNow.getFullYear(), timeNow.getMonth() - 3, timeNow
			// 	.getDate()), 'yyyy-mm-dd');
			// var sixMonthsAgo = this.$u.timeFormat(new Date(timeNow.getFullYear(), timeNow.getMonth() - 6, timeNow
			// 	.getDate()), 'yyyy-mm-dd');

			// if (index == 0) {
			// 	if (oneWeekAgo < yearOneDate) {
			// 		oneWeekAgo = yearOneDate;
			// 	}
			// 	this.date1 = oneWeekAgo;
			// 	console.log("当前时间：", timeNowGet, "计算的时间：", oneWeekAgo < yearOneDate, "不能超过的时间：", yearOneDate);
			// 	this.realTimeSel.startDate = oneWeekAgo;

			// 	// console.log("前一周");
			// } else
			// if (index == 1) {
			// 	if (oneMonthAgo < yearOneDate) {
			// 		oneMonthAgo = yearOneDate;
			// 	}
			// 	this.date1 = oneMonthAgo
			// 	this.realTimeSel.startDate = oneMonthAgo;
			// 	// console.log("前一个月");
			// } else
			// if (index == 2) {
			// 	if (threeMonthsAgo < yearOneDate) {
			// 		threeMonthsAgo = yearOneDate;
			// 	}
			// 	this.date1 = threeMonthsAgo;
			// 	this.realTimeSel.startDate = threeMonthsAgo;
			// 	// console.log("前三个月");
			// } else
			// if (index == 3) {
			// 	if (sixMonthsAgo < yearOneDate) {
			// 		sixMonthsAgo = yearOneDate;
			// 	}
			// 	this.date1 = sixMonthsAgo;
			// 	this.realTimeSel.startDate = sixMonthsAgo
			// 	// console.log("前半年");
			// }
			// this.date2 = this.$u.timeFormat(new Date(), 'yyyy-mm-dd');

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
			this.customer = '';
			this.$refs.paging.reload();
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
			var len = this.orderList.length;
			if (len > 0) {
				this.checked = !this.checked;
				this.orderList.forEach((res) => {
					res.check = this.checked;
				});
			} else {
				this.$u.toast('您暂无可勾选的订单~');
			}
		},
		getData() {
			let that = this;
			var phone = this.pinia_user.data.work == '1' && this.pinia_user.workData.identity != '4' ? this.pinia_user.workData.bossNumber : this.pinia_user.phone;
			let zd = false;
			try {
				zd = this.pinia_user.workData.identity != '4';
			} catch (e) {
				//TODO handle the exception
				zd = false;
				if (this.pinia_user.workData == null || this.pinia_user.workData == undefined || this.pinia_user.workData == '') {
					zd = true;
					console.log('没有工作');
				}
			}

			if (this.pinia_userRole == 'D') {
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
				uni.$api.order
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
				uni.$api.order
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
			this.realTimeSel.startDate = this.date1 != '' ? this.date1 : '';
			this.realTimeSel.endDate = this.date2 != '' ? this.date2 : '';
			// this.refreshData()
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
		}
	}
};
</script>

<style lang="scss" scoped>
.fliter-wrap {
	.fliter-scroll {
		width: 520rpx;
	}

	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
	}

	.filter-btn {
		background: #fff;
		color: #333;
		border-radius: 100rpx;
		padding: 12rpx 35rpx;
		font-size: 26rpx;

		&.active {
			background: #1faf60;
			color: #fff;
		}
	}

	& > .filter-btn {
		margin-left: 20rpx;
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
	background: url(data:image/png;base64,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)
		right center no-repeat;
	background-size: 25rpx;
}

.fixed-add-btn {
	background: 'transparent';
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

.buyOrder {
	width: 300rpx;
	height: 70rpx;
	border-radius: 376rpx;
	opacity: 1;
	/* 矩形 228 */

	background: linear-gradient(270deg, #44495f -7%, #56638a 100%);

	font-family: Source Han Sans;
	font-size: 30rpx;
	font-weight: 500;
	line-height: 42.24rpx;
	text-align: center;
	letter-spacing: 0rpx;

	font-variation-settings: 'opsz' auto;
	font-feature-settings: 'kern' on;
	color: #ffffff;
}
.tages {
	color: #965510;
	background: #fffbf1;
	width: 30%;
	height: 54rpx;
	border-radius: 12rpx;
	height: 54.84rpx;
}
</style>
