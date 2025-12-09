<template>
	<view class="root">
		<z-paging
			ref="paging"
			use-virtual-list
			:force-close-inner-list="true"
			:cell-height-mode="1 === 0 ? 'fixed' : 'dynamic'"
			@virtualListChange="virtualListChange"
			@query="queryList"
		>
			<template #top>
				<view style="padding-bottom: 60rpx">
					<view class="Card cardShow">
						<view class="HnadCard">
							<view
								class="HnadCardBtn"
								@click="change(0)"
								:style="{
									color: current == 0 ? '#01BB74' : '#999999',
									border: '2rpx solid ' + (current == 0 ? '#01BB74' : '#999999')
								}"
								style="width: 20%; height: 54rpx"
							>
								全部
							</view>
							<view
								class="HnadCardBtn"
								@click="change(1)"
								:style="{
									color: current == 1 ? '#01BB74' : '#999999',
									border: '2rpx solid ' + (current == 1 ? '#01BB74' : '#999999')
								}"
								style="width: 20%; height: 54rpx"
							>
								待确收
							</view>
							<view
								class="HnadCardBtn"
								@click="change(2)"
								:style="{
									color: current == 2 ? '#01BB74' : '#999999',
									border: '2rpx solid ' + (current == 2 ? '#01BB74' : '#999999')
								}"
								style="width: 20%; height: 54rpx"
							>
								已签收
							</view>
						</view>

						<view class="InputCard">
							<view class="InputOne">
								<text class="ft11 ft-gray ml20" style="background-color: transparent" @click="CustomerGet">
									{{ pinia_userRole === 'R' ? '供应商选择' : '客户选择' }}
								</text>
								<up-line direction="col" margin="0 20rpx" color="#333" length="30rpx"></up-line>
								<view class="my-input flex-1">
									<uv-input
										border="none"
										@change="CustomerGetChange"
										v-model="customer"
										:customStyle="{ backgroundColor: 'transparent' }"
										disabled="true"
										:placeholder="pinia_userRole === 'R' ? '请选择供应商' : '请选择客户'"
										:clearable="true"
									></uv-input>
								</view>

								<view class="flex-col justify-center items-center" style="height: 5vh">
									<view class="ml40"><wd-icon name="/static/img/list/lxr.svg" size="45rpx" @click="CustomerGet"></wd-icon></view>
								</view>
							</view>

							<view class="InputOne">
								<text class="ft11 ft-gray ml20" @click="filtrateGet">
									{{ Title }}
								</text>
								<albb-icon class="ml10 mr10" icon="ydj-tiaojianshaixuanfan2" color="#606266" size="20rpx"></albb-icon>
								<view class="my-input flex-1" v-if="showTage !== '1'">
									<uv-input border="none" v-model="field" @change="searchListenner" :clearable="true" placeholder="输入关键字进行检索"></uv-input>
								</view>
								<view class="ml24 my-input flex-1" v-if="showTage === '1'">
									<uv-input border="none" maxlength="11" v-model="field" @change="searchListenner" :clearable="true" placeholder="输入号码进行检索"></uv-input>
								</view>

								<view class="flex-col justify-center items-center" style="height: 5vh">
									<view class="ml40">
										<wd-icon name="/static/img/list/ss.svg" size="45rpx" @click="SearchBtn"></wd-icon>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="absolute" style="text-align: left; font-size: 24rpx; color: #01bb74; left: 0" :disabled="false">
						<view class="ml24" style="">
							<view class="flex-row justify-center items-center">
								<view
									class="flex-col justify-center items-center"
									@click="checkedAll"
									:style="{ backgroundColor: checked ? '#01BB74' : '#ffffff' }"
									style="border-radius: 100rpx; height: 40rpx; width: 40rpx; border: 2rpx solid #aaaaaa"
								>
									<wd-icon name="check" color="#ffffff" size="20rpx"></wd-icon>
								</view>
								<view class="ml15" style="color: #333333">全选</view>
							</view>
						</view>
					</view>
				</view>
			</template>
			<view slot="empty" style="padding-bottom: 200rpx">
				<wd-icon :name="ImgUrl + '/wxImg/list/empty.svg'" size="180"></wd-icon>
				<view class="text-center ft-lightgray">暂无记录</view>
			</view>

			<view
				:index="index"
				v-for="(item, index) in orderList"
				:key="item.id"
				@click="
					uni.$nav.to('/pages/subOrder/details', { id: item.id });
					hide = false;
				"
				class="OrderCard"
			>
				<view class="OrderCardHand" @tap.stop>
					<view class="title ml1 flex-1" style="" @tap.stop>
						<view
							class="flex-col justify-center items-center mr15"
							:style="{ backgroundColor: item.check ? '#01BB74' : '#ffffff' }"
							@click.stop="checkboxGroupChange(item, index)"
							style="border-radius: 100rpx; height: 40rpx; width: 40rpx; border: 2rpx solid #aaaaaa"
						>
							<wd-icon name="check" color="#ffffff" size="20rpx"></wd-icon>
						</view>

						<text class="ft30 ft-lightgray pr30" style="color: #666666" @tap.stop>
							订单编号:
							<text class="ml15" @click="copyBtn(item.orderNumber)" style="color: #f76565">
								{{ item.orderNumber }}
							</text>
						</text>

						<wd-icon size="30rpx" v-if="item.paymentState != 2" :name="bat64.copy" @click="copyBtn(item.orderNumber)"></wd-icon>
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
				<view class="width100 pb25 text-left">
					<text class="flex-col text-left">
						<text
							v-if="pinia_userRole == 'D'"
							:style="{ color: ifZX(item.bossNumberE) ? '#AAAAAA' : '#3D3D3D' }"
							class="ft34 u-line-bt width100"
							style="font-weight: 500"
						>
							{{ item.organizationE || item.bossNumberE }}{{ ifZX(item.bossNumberE) ? '(已注销)' : '' }}
						</text>
						<text
							v-if="pinia_userRole == 'R'"
							:style="{ color: ifZX(item.bossNumberS) ? '#AAAAAA' : '#3D3D3D' }"
							class="ft34 u-line-bt width100"
							style="font-weight: 500"
						>
							{{ item.enterpriseS || item.bossNumberS }}{{ ifZX(item.bossNumberS) ? '(已注销)' : '' }}
						</text>
					</text>
				</view>
				<text class="ft30 line25 ft-lightgray">
					<text>日期：{{ $u.timeFormat(item.creationTime, 'yyyy-mm-dd') }}</text>
				</text>

				<text class="ft-lightgray mt10 line25 flex-row items-center justify-end">
					<text>订单金额：</text>
					<text style="color: black; font-size: 24rpx">￥</text>
					<text class="ft35" style="color: black; font-weight: 500">{{ item.price.toFixed(2) }}</text>
				</text>

				<text
					style="width: 100%"
					class="mt17 ft-lightgray ft25 bg-gray radius pd10"
					@tap.stop
					v-if="item.receiptsDescr && item.paymentState != 2"
					@click="noteMyOrder(item)"
				>
					备注：{{ item.receiptsDescr }}
				</text>
			</view>

			<template #bottom>
				<view class="flex-row justify-between items-center pd30 bg-white">
					<view class="flex-row items-center vw100">
						<view class="items-center flex-row" style="width: 92%; display: flex; justify-content: space-between">
							<view class="relative" @click="showCheckClick">
								<up-badge :offset="[0, 0]" bgColor="#FF8F1F" :absolute="true" :value="realTimeSel.ids.length" color="#ffffff"></up-badge>
								<wd-icon size="100rpx" name="https://res-oss.elist.com.cn/wxImg/order/checkOrder.svg"></wd-icon>
							</view>
							<view class="mr20 flex-row" style="text-align: left; font-size: 24rpx; width: 30%; color: #666666">
								统计：
								<view style="color: #01bb74">{{ OrderQuantity }}个订单</view>
							</view>
							<view
								:disabled="!hasCheck"
								@click="OpenReceipt"
								class="flex-row justify-center items-center"
								style="width: 280rpx; height: 80rpx; border-radius: 90rpx; opacity: 1; background-color: #01bb74; color: white; float: right; font-weight: 600"
							>
								修改
							</view>
						</view>
					</view>
				</view>
			</template>
		</z-paging>

		<up-popup :show="showCheck" mode="bottom" round="15" @close="showCheck = false">
			<view class="warp" style="height: 70vh; width: 100vw; background-color: #ffffff; border-radius: 15rpx 15rpx 0 0">
				<z-paging v-if="showCheck" ref="pagingCheck" :fixed="false" v-model="selectList" @query="queryListCheck">
					<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
					<view solt="top" style="height: 24rpx"></view>
					<view class="item OrderCard" v-for="(item, index) in selectList" :key="item.id">
						<up-swipe-action>
							<up-swipe-action-item :show="item.show" :name="index" @click="delclick" :options="options">
								<view
									@click="
										uni.$nav.to('/pages/subOrder/details', { id: item.id });
										hide = false;
									"
									class=""
								>
									<view class="OrderCardHand" @tap.stop>
										<view class="title ml1" style="" @tap.stop>
											<text class="ft30 ft-lightgray pr30" style="color: #666666" @tap.stop>
												订单编号:
												<text class="ml15" @click="copyBtn(item.orderNumber)" style="color: #f76565">
													{{ item.orderNumber }}
												</text>
											</text>

											<wd-icon size="30rpx" v-if="item.paymentState != 2" :name="bat64.copy" @click="copyBtn(item.orderNumber)"></wd-icon>
										</view>
										<view class="ml20 absolute" style="top: 0; right: 0">
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
									<view class="width100 pb25 text-left">
										<text class="flex-col text-left">
											<text
												v-if="pinia_userRole == 'D'"
												:style="{
													color: ifZX(item.bossNumberE) ? '#AAAAAA' : '#3D3D3D'
												}"
												class="ft34 u-line-bt width100"
												style="font-weight: 500"
											>
												{{ item.organizationE || item.bossNumberE }}{{ ifZX(item.bossNumberE) ? '(已注销)' : '' }}
											</text>
											<text
												v-if="pinia_userRole == 'R'"
												:style="{
													color: ifZX(item.bossNumberS) ? '#AAAAAA' : '#3D3D3D'
												}"
												class="ft34 u-line-bt width100"
												style="font-weight: 500"
											>
												{{ item.enterpriseS || item.bossNumberS }}{{ ifZX(item.bossNumberS) ? '(已注销)' : '' }}
											</text>
										</text>
									</view>
									<text class="ft30 line25 ft-lightgray">
										<text>日期：{{ $u.timeFormat(item.creationTime, 'yyyy-mm-dd') }}</text>
									</text>

									<text class="ft-lightgray mt10 line25 flex-row items-center justify-end">
										<text>订单金额：</text>
										<text style="color: black; font-size: 24rpx">￥</text>
										<text class="ft35" style="color: black; font-weight: 500">{{ item.price.toFixed(2) }}</text>
									</text>

									<text
										style="width: 100%"
										class="mt17 ft-lightgray ft25 bg-gray radius pd10"
										@tap.stop
										v-if="item.receiptsDescr && item.paymentState != 2"
										@click="noteMyOrder(item)"
									>
										备注：{{ item.receiptsDescr }}
									</text>
								</view>
							</up-swipe-action-item>
						</up-swipe-action>
					</view>
					<template #bottom>
						<view class="flex-row justify-between items-center pd30 bg-white">
							<view class="flex-row items-center vw100">
								<view class="items-center flex-row" style="width: 92%; display: flex; justify-content: space-between">
									<view class="relative" @click="showCheckClick">
										<up-badge :offset="[0, 0]" bgColor="#FF8F1F" :absolute="true" :value="realTimeSel.ids.length" color="#ffffff"></up-badge>
										<wd-icon size="100rpx" name="https://res-oss.elist.com.cn/wxImg/order/checkOrder.svg"></wd-icon>
									</view>
									<view class="mr20 flex-row" style="text-align: left; font-size: 24rpx; width: 30%; color: #666666">
										统计：
										<view style="color: #01bb74">{{ OrderQuantity }}个订单</view>
									</view>
									<view
										:disabled="!hasCheck"
										@click="OpenReceipt"
										class="flex-row justify-center items-center"
										style="
											width: 280rpx;
											height: 80rpx;
											border-radius: 90rpx;
											opacity: 1;
											background-color: #01bb74;
											color: white;
											float: right;
											font-weight: 600;
										"
									>
										修改
									</view>
								</view>
							</view>
						</view>
					</template>
				</z-paging>
			</view>
		</up-popup>

		<!-- <up-loadmore v-show="total > 5" :status="status" marginTop="88" marginBottom="88" :load-text="loadText" /> -->

		<up-popup :show="show_start" mode="top" width="550rpx" :safeAreaInsetBottom="false" @close="show_start = false">
			<view class="flex-col pl30 pr30 pb30 justify-between">
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
							<view class="flex-row items-center flex-1">
								<text style="color: #999999">开始日期</text>
								<albb-icon class="ml10 mr10" icon="ydj-tiaojianshaixuanfan2" color="#606266" size="20rpx"></albb-icon>
								<view
									@click="
										$refs.calendars.open();
										timeType = 1;
									"
									style="border: 1rpx solid #999999; padding: 6rpx; border-radius: 6rpx"
								>
									{{ date1 == '' ? '开始日期' : date1 }}
								</view>
							</view>
							<view class="flex-row items-center flex-1">
								<text style="color: #999999" class="ml10">结束日期</text>
								<albb-icon class="ml10 mr10" icon="ydj-tiaojianshaixuanfan2" color="#606266" size="20rpx"></albb-icon>
								<view
									@click="
										$refs.calendars.open();
										timeType = 2;
									"
									style="border: 1rpx solid #999999; padding: 6rpx; border-radius: 6rpx"
								>
									{{ date1 == '' ? '结束日期' : date1 }}
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
									{{ pinia_userRole.userRole == 'R' ? '收货地址' : '收货地址' }}
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
					<wd-button size="small" @click="filterSubmit" :customStyle="{ width: '154rpx', margin: 0, height: '60rpx' }">确定</wd-button>
				</view>
			</view>
		</up-popup>

		<!-- 日历选择器 -->
		<uv-calendars color="#01BB74" confirmColor="#01BB74" :startDate="getCurrentYearFirstDay()" :endDate="getCurrentDate()" ref="calendars" @confirm="date1Change" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 选择客户
			showCheck: false,
			OrderQuantity: 0,
			OrderQuantitySum: 0,
			searchText: '',
			companyIndex: 0,
			labText: '确认收款',
			current: 0,
			dataList: [],
			reload: false, //判断是否上拉
			total: 0, //数据量
			current_page: 0, //当前页码
			last_page: 1, //总页码
			status: 'loadmore',
			loadText: {
				loadmore: '轻轻上拉',
				loading: '努力加载中',
				nomore: '实在没有了'
			},
			scrollTop: 0, //返回顶部
			//筛选弹窗
			filterShow: false,
			date1: '', // 开始日期
			date2: '', //结束日期
			totalMoney: 0, //当前订单总额
			show_start: false,
			mode: 'range',
			time: '',
			icon_search: 'arrow-down-fill',
			showTage: '0',
			showOrderTage: '0',
			orderList: [],
			orderListCopy: [],
			customer: '',
			customStyle: {
				width: '100vw'
			},
			searchList: {
				dataStart: '',
				dataEnd: '',
				type: 0, //0-3
				customer: '',
				searchText: ''
			},
			realTimeSel: {
				bossNumberS: '',
				bossNumberE: '',
				staffNumberS: '',
				staffNumberE: '',
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
				kSiteE: '',
				contactsS: '',
				siteE: '',
				enterpriseDz: '',
				getPhone: '',
				inventoryName: '',
				limitS: '0,10',
				limitE: '25',
				ids: [],
				checked: false
			},
			field: '',
			scrollTopCopy: 1156,
			refresh: true,
			s: 0,
			e: 25,
			uloading: true,
			sum: 0,
			type: 0,
			hide: true,
			textKHGGS: '客户选择',
			ShareDetails: '',
			err: false,
			delOrder: '',
			delOrderAll: {
				url: '',
				state: 0
			},
			payOrder: '',
			payOrderState: 0,
			verifyPassword: {
				item: {},
				index: 0,
				type: 0
			},
			onReachBottom: false,
			virtualList: [],
			bat64: {
				dqs: 'data:image/png;base64,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',
				yqs: 'data:image/png;base64,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',
				ysk: 'data:image/png;base64,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',
				dqss: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANMAAABWCAYAAABVeqOyAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAA6ISURBVHic7Z09bNvWFsf/lxRl2NKgDoqCelEhJMMTYLtDPdiLgzru0Ae09fJegDpotucuLfCcOfacFO3UdAtgF0jcwX1DO9QoEC32kAyOg6fFgV+0uPDHUA2SPySR9w36iEleklcSeUWm9wcEiCh+XNE893zccw4JuuDs8UwWRL1HCZkgwEQ3x0okbzuEd8fz9dlvKfB1kIORSKIMlzCdr8/uUKmJJBJXFK8dWhpJCpJE4oGrZjp7PDsDBU9FDUYiiTKumoko+ETUQCSSqOMqTBT0U1EDkUiijocwkZSogUgkUcfdzAOkMEkknHhoJrwQNRCJJOq4ayZKpTBJJJy4rzNRfUXQOCSSyOMqTMO3CiUCfCdqMBJJlPHMgBg6bawAtCRgLBJJpPEUJnKnUIZB7ogYjEQSZTyFCQCGb/1eALAc6EgkkojDXYIBAGfrH74GSDaQkUgkEYdLM3Uw9BsBjUMiiTxdCdPwrUIJ0tyTSJh0Zea1keaeRGKnOzOvjTT3JBIbPWkmADhbn72HCJl8JJFBbGIR+t7PME52ez6PNr0MoiU7n/WDbeivNvwYYmAMffozaHkfRnkfxsE2jPI+UK8MdEwkkQEZyZi2GScvnQ/Qkhj6eA309Aj0z9ZvOdkFLe8HPFJ+Yr0eOPyP31fO1j/8IhLmnpaENr0CJZWDOjoNWqtAf7WBxt7PXT9USioHkrja+UyrR9D9Hq+PKOlxkHgS5Mo4lCvjoNk5XPy6MOhhQUmPQ5u8a9p28cvnoKdH7P1TuebviCeBVA4qgMbeBhovHgoYLR89CxOAprmnxF77NJbAiOUXoKRync8knoSanWsKUxjQktAmFvs6RePVBnOWjuXNgmOc7A5cK/UCufT3axMmrQT0KUzDtwqls/XZZYTY3IvlFxC7Pm/aRmsV1LaWQ/NQES0B9b25vs6hl34DtWxT0k1tZNqPZwLRkqG5N20UhjAZx72b60HQn2ZCuM29WH4Bsfxt2/bGi4ehm9WCgCWg8RsPPI+jtQoaxbVQ+YLKlTHTZ1qrOJqEg6JvYQIQSnPPUZCKq9BLmwMYkViU9DjUbG/ajsST0N5fhDo6hfrz+6BVvoeWJDKI/c18z53Mz67QkiY/FQifiQf4JExhM/ccBWlvA43imm27kh5D/MY3PV1LfW+O20SrP7vPFGRar6JRXLWf+9p80+FuYRzvOkYirbO01VfqBZLIgNaq/PuPZGz3gmV+dgvTxOsjIhsU/mgmhMPca4e/1dFp23f6681QRX5M1CtMIVevmX09vbTJpVWV0Smbr+TlX1j3B4D6i4eh8J2U0SnbNuPYJYw+IHwTJgADNfdIIoP4zAObOQCEL4TKAxnJmLQSwOlwa0loH5hDzsbxLmqFJcdDlPQ44tZAxcEWjINt/gEHiFXQaa3SXCsLGb4K06DMPfXaPLT32aHlRnGVOeuHHfKO2bThdbjj08s2Iay7TSRaEtqkWdBo9RD1Z96BCiFoSZuZR+JJxKeXez4lr4bvFn81EwZj7pF4grmdJUhkJGN7KI3y/3Dxy+dc14rfMGs//WALjR0+rUfr/P6HkraYaRxaIpZfsM3ijT33AEAsv2DT5vVnD0Jh3gFwDKKwzFJegvK3fBcmAMLNvUZxDWp2rvNQ0Ooh6i8e2h5ANTsHbfIujONdNIprb25qvQLa68NTqwYSorXOxl5mjZqdswVdaPXQVSsr6XHbGlyjuBoq515l+EthJRBhGoS5VyssYejjH0Grh6gVluzhXC2JWCvLQLnS9BFo9TAUqTU2tKQ9gODygLNSc4BmqpNbZgVr7YaMXLX5XJcRGZQgqVxfGkg0wWgmtMy9n2ZnQDET1DUuQ6tHqD39t2OypDa5ZPMlQpNOZME6G9NaxdFUU0anHB/+bh9EEk96hvkbxdXetXiXsLSSfrDlucZEWjmYpuNKm6DVQwDBRQIDEyYAgN64Q5XYjqg2y06CpF6bt91c43g3VCv8l+H2l1o5fdZJ4q1AS9qWBoCmSe8lTKy/d+O/q4FnTAQqTMO3CqXTJ7MrIPg2yOu4QVI5W6SP1iqoP7+P+EwPESvN/OAqo1OIJ7o7j1Hedw3VW9dVHCNP9WaO4dDcD11dPwrErn/GnCSUVA66hzBZ/U1RqUfBaiYAI//8/buz9Q+/GsRiLklkmCHURnENtHrkiz3eLm/wi3bJRBuvNRVa3kejuIpY/nazxud41xRUMMr7aOx8bzvOmvFRe/pv2z7NiejLXn5GfzhoJaA50XiFta2+oKiASuDCBAC6QVdUhTwSca0OWpK5iKsfbIXWvAPsaUA8ayq1whJIKof6sweIXf/M8mXFveiuBWuf3sqw+8dJKwF2E9gGI49PVLaEEGFKnBv/OR9RxAmTlrStB7XhXRMaCIwoHsAXSKhvLQcwIPGQRMZRKwHNyUVJjzlOEKw8PlFJsUKEidwplM+ezBZABET2WoLEuqlWWMmlvUISV20LjJcjSJdxysK2aZW/INr0imdARX3vI2dhYkRCRaUeCRGmJrTUR8sJLtzy81j4mWakpMfswvT6Ny4TC4Crn9AXrZncC9Y+rOrWIInlbzMnwfqz+6Z1NLffYws+COx3IU6YCCkFevouBSlsOPkJrAACz+zdRknluMpLei1B8RP9YAvK6JTpt+kHW9BLm1Cvz3cEhSSuQhmdsi8ZMMxkXWCy7qB8TF9Rs3OI3/whsoLk6ie0AgiX/4Ulb85vaHkf9ef333yuVToJt/prcwSPlbPH2mYcbPk8SmfECROl2SBOq6THoE3eZc/qIesR4IT2AXv8f0WMg+2OL1t/fr8zcRh/mIVCHZ0GSWQs2yz+UvVQaGm7MDOPEjIRhMdknLwErR7atFJjbwP63gaG/v6j47HqtXn/nH7NLgysfDkA5iRchwieX0RxnalRXAOtVU1mHK0ewTjeNd2rWP426s9amoxl4gluTyBEmOijmdQ5MBHU+RvFNdOD2y69sDY5tELiiUBNQ6dzX25iiXql6RP02K/BC/rnfuTWmQAw1wL10qZJYNTsXDNXsHrEnBStpmHQCLlfZ8OxL4I8/+UQdBSLAfXXv735v0AbP2qwlhpi+dvMSKhxvCu8e5GYdSZCvwo6LN4orgFaMtTZDU60TVWgVZvF6GHBCxkJfxBGSY8x+zrwYLVC1OwcQGGvCBjAhBq4MJ0+mf0aQDbo6/RiH+sH29xtrLwgiYytOM+pypWVK2acvGyaJbW3MFKnJaG2mrwo7071FWwxTnZtPrK1bIRWDwdS4BioMJ09nslSgntBXqMfaHmfmYGsZuegjE51laKjpMeAvHmbcbDFvWjbdqS9/DxPLCX8yugUhq54z9JDHzP2YQRV3K9t3z/2/pdc2Si80OoR9NIms5Vbm0H1RQxWM6mxR4SKqWXyA5LIQPvgbsfJpROLketqxGo+wnrIrfgRiGElofopSG3aARvWmGn1cGBFn4EFIE6fzH4tqsrWL+IzD8yh1+vzwaT4BEm32sQnWP0k3GDlLPIfe+SofRrFtYEtagciTGePZ7IIsXnnRK2wBGrxWbT3F22Lg2GF1WtPFCrHel2zwcsqLn79vO8AgVOnWVEl9SyCMfMiZt61odWjZrTIUpkbn3mAi83F0KfxsHrt1Tb/xdzXupjNanVG3skhPr3CdW19b4MZhaS1Cow/tu1Jv2mu0zJhVU+30SYWUSvv+xZY6gbfhSmK5t1l9FcbUN7JmRZRSeIqYvmFwfhPrXdJmXAw5aw+Cz094l5rYe3XjUY2Tl7CKO93fKR2mzH9YNvXScipevrN91cRn3nA7lAVML4KU9ijd7w0iqtQ0mMmBzd2fR76qw3hfyAllYPikJZk27fL/uJ+o+9tgOQXmkIUQESNtzJgUALlr8+kxh6J6kQUJG1zz4pbP7lBQ0Yy9saVgtda9INtXPy6IFSQaPUQtS37/N0WKJH+rm/CFHXzzope2rRVaJJEJrTBCNvCZa0i/k0RAfmUTiU27TdAXs40v0xHoAQVOfpi5lV+ujlBKB1YO6+gaOx8j/iNbzprF4NIVaK1inefcUZumsgK08DQkszXqLapby13MkzaloR1MbctUCLehOiLMMUofdTvC63CiHHyEvWdhzD+2PK2vQMKSVsL5ljE8guhyE3zk2bvdPtLBYCWRios2VK1HAWqxzchdkvfwnS2PnuPBlheMWguz2ZkJNNJsqT1CtBe64gn2F1xunjrRa+wqnTd3jDohja51EmUpfXKQH5TO8fRqSSl6SMtO3YcchIooNVj/uYPgWmpvoSp8tPNCVC67NNYQg89PWo2KOG0wQOPJLV7A/qklYzjl9AmP3L8ntYqgZuOanbOXZA4InTt4kKntShr1a5f9CVMb6t554a+t8EVqjaOd3t68Gi9+qZ6FO4CSRIZ0OqRyRTi1Uqswjmv40SYjk6apds6Nb31Ymptcsl0f4IMl/csTOfrs9++zeadEzw92PTSJuq9NrtsVd7yQMv7qBWWmuX3+QWgXvH0rzqXYexHq0fN18pYX/9Z3oe+tyEsG7tRXIMyOg0llePWRiyMk11cbC52ghj1nYeBNqTsqWLv7PHsDBQ89XswvtN6S8Rl/Hi/kLWFMa1VQU8PuVsRB0E7/Nvvw0JSORAt0Xl4g6pWVdLjNnPu8t+GJDJQ3p32zbchqVzgnV27Fib6aCZ1PqLuDPKt6hJJGOnazLsYid2DgMpZiSRqdKWZImPeSSQDgDudiD6aSUGhYl8LI5FECG4zT5p3Eok7XGaeNO8kEm88zTxp3kkkfHiaedK8k0j4cDXzpHknkfDjauYRBZ+IGohEEnVchYmCfipqIBJJ1PEIQJCsgDFIJG8Fb8VrOCWSMOBh5uGFqIFIJFHHPQBBqRQmiYQTdzOP6ny9cSUSibswDd8qlAjwnajBSCRRhis373x9duevWKIukXQDVzRv6LRxQ2ooicSdrosDiYJPmou5JBvIiCSSiPJ/LFBvr/ghK9gAAAAASUVORK5CYII=',
				yfk: 'data:image/png;base64,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',
				bz: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAADRSURBVCiR1ZO9DcJADEa/yzlJexvACNkAVmADU9ylzCiI+lKEDRgBNsgIsAF1fs40IEFIUCQqXFnPevJX2AoAmNkAMJiuW1VVtyFUzGzSNN2JyGXKVEotQwh77339yomIshDC2XtfTcnMvIzjeA3gTY6+RH2LrbU+DSENgbU2i6KoGHIRQZ7nz940TbP9kAFkfd8fyrL82PSygIkomxt7tP5Upq7r6iRJCufcAgBE5Dpbfpzd5gmstTxX/i32CKu11oVzbvXFM23bHtXYZO6X3QGZ60m/xWMUdgAAAABJRU5ErkJggg==',
				copy: 'https://res-oss.elist.com.cn/wxImg/list/copy.svg'
			},
			Title: '条件筛选',
			startX: 0,
			startY: 0,
			checked: false,
			searchJson: {},
			ids: [],
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#ff6e55'
					}
				}
			],
			selectList: [],
			oldId: [],
			oldList: [],
			searchJson: {
				paymentState: '',
				organizationE: '',
				kTakeE: '',
				kPhoneE: '',
				kSiteE: '',
				inventoryName: '',
				bossNumberS: '',
				bossNumberE: '',
				staffNumberS: '',
				staffNumberE: '',
				endDate: '',
				startDate: ''
			},
			uBadge: 0,
			start: '',
			end: '',
			timeType: null
		};
	},
	onLoad(option) {
		console.log(option);
		this.start = option.start;
		this.end = option.end;
		this.OperatingSystem = this.getOperatingSystem();
		this.searchJson = JSON.parse(option.searchJson);
		this.realTimeSel.paymentState = this.searchJson.paymentState;
		this.realTimeSel.organizationE = this.searchJson.organizationE;
		this.realTimeSel.kPhoneE = this.searchJson.kPhoneE;
		this.realTimeSel.kSiteE = this.searchJson.kSiteE;
		this.realTimeSel.kTakeE = this.searchJson.kTakeE;
		this.realTimeSel.bossNumberE = this.searchJson.bossNumberE;
		this.realTimeSel.startDate = this.searchJson.startDate;
		this.realTimeSel.endDate = this.searchJson.endDate;
		this.date1 = this.searchJson.startDate;
		this.date2 = this.searchJson.endDate;

		this.field =
			this.searchJson.kTakeE != ''
				? this.searchJson.kTakeE
				: this.searchJson.kSiteE != ''
				? this.searchJson.kSiteE
				: this.searchJson.kPhoneE != ''
				? this.searchJson.kPhoneE
				: '';
		this.showTage = this.searchJson.kTakeE != '' ? 0 : this.searchJson.kPhoneE != '' ? 1 : this.searchJson.kSiteE != '' ? 2 : 3;
		this.customer = this.searchJson.organizationE;
		this.ids = option.ids.split(',').map(Number);
		this.realTimeSel.ids = option.ids.split(',').map(Number);
		this.oldId = option.ids.split(',').map(Number);

		console.log('this.showTage', this.field);
		console.log('this.showTage', this.showTage);
		console.log('option', option);
		console.log('this.OperatingSystem:', this.OperatingSystem);
		console.log('this.OperatingSystem:', this.realTimeSel);
	},
	onShow() {
		// this.loadData();
		// this.LoginIf();
		this.SOCKETfLUSH();
		this.Init();
		//检索精确到人
	},
	onHide() {
		this.ClearIF();
	},
	methods: {
		showCheckClick() {
			// this.$refs.pagingCheck.refresh();
			this.showCheck = !this.showCheck;
		},
		queryListCheck(pageNo, pageSize) {
			this.realTimeSel.page = pageNo;
			this.realTimeSel.pageSize = pageSize;
			this.getCheck();
		},
		virtualListChangeCheck(list) {
			this.selectList = list;
		},
		delclick(item) {
			if (this.selectList.length <= 1) {
				this.$u.toast('请至少选择一个订单');
				return;
			}
			var id = this.selectList[item.name].id;

			if (this.oldId.includes(id)) {
				this.orderList.unshift(this.selectList[item.name]);
				this.$refs.paging.complete(this.orderList);
				this.oldList.push(this.selectList[item.name]);
			}

			this.ids = this.ids.filter((idd) => idd !== id);
			let orderItem = this.orderList.find((item) => item.id === id);
			console.log(orderItem);
			if (orderItem) {
				orderItem.check = false;
			}
			this.selectList.splice(item.name, 1);
			this.realTimeSel.ids = this.selectList.map((item) => item.id);
			this.$u.toast(`删除了第${item.name + 1}个订单`);
		},
		closeCheck() {
			console.log('关闭');
		},
		openCheck() {
			console.log('打开');
		},
		containsAllElements(list1, list2) {
			const set1 = new Set(list1);
			const set2 = new Set(list2);

			// 找出 list1 中有而 list2 中没有的元素
			const diff1 = list1.filter((item) => !set2.has(item));

			// 找出 list2 中有而 list1 中没有的元素
			const diff2 = list2.filter((item) => !set1.has(item));

			return [...diff1, ...diff2];
		},
		OpenReceipt() {
			this.searchJson.paymentState = this.realTimeSel.paymentState;
			this.searchJson.organizationE = this.realTimeSel.organizationE;

			this.searchJson.kPhoneE = this.realTimeSel.kPhoneE;
			this.searchJson.kSiteE = this.realTimeSel.kSiteE;
			this.searchJson.kTakeE = this.realTimeSel.kTakeE;

			this.searchJson.bossNumberS = this.realTimeSel.bossNumberS;

			this.searchJson.startDate = this.realTimeSel.startDate;
			this.searchJson.endDate = this.realTimeSel.endDate;

			if (this.checked) {
				//全选
				console.log('全选');
				//获取单据id
				uni.$api.bills.checkAllLockedIds(this.realTimeSel).then((res) => {
					console.log(res);
					var data = res.data.data;
					var updateFrom = {
						priceNumber: data.price,
						delId: '',
						ids: data.ids,
						nowIds: data.ids,
						searchJson: this.searchJson,
						oldId: this.oldId,
						check: this.checked
					};

					if (data.price > 0) {
						uni.setStorageSync('bill', JSON.stringify(updateFrom));
						if (uni.getStorageSync('bill')) {
							uni.navigateBack();
						}
					}

					console.log(updateFrom);
				});
				//单据价格
				//所有id
				//选择id
			} else {
				//单选
				var orderListCheck = this.orderList.filter((res) => res.check == true);
				var orderListCheckId = orderListCheck.map((res) => res.id);

				console.log('原ID:', this.oldId);
				console.log('现在选择ID', this.ids);
				console.log('选择订单ID', orderListCheck);
				console.log('总订单ID', orderListCheck);

				var list = this.containsAllElements(this.oldId, this.ids);

				if (list.length <= 0) {
					console.log('包含原单据未改变', list);
				} else {
					console.log('原单据改变 改变单据', list);
				}

				var priceNumber = 0;

				//计算价格
				uni.$api.bills.getLockedBillTotalPrice(this.realTimeSel).then((res) => {
					priceNumber = res.data.data;

					var updateFrom = {
						priceNumber: priceNumber,
						delId: list,
						ids: this.realTimeSel.ids,
						nowIds: orderListCheckId,
						searchJson: this.searchJson,
						oldId: this.oldId,
						check: this.checked
					};

					if (priceNumber > 0) {
						uni.setStorageSync('bill', JSON.stringify(updateFrom));
						if (uni.getStorageSync('bill')) {
							uni.navigateBack();
						}
					}

					console.log(updateFrom);
				});
			}
		},
		removeCheck() {
			this.checked = false;
			this.orderList.forEach((res) => {
				res.check = false;
			});
			this.hasCheck = false;
		},
		checkedAll() {
			var len = this.orderList.length;
			if (!(len > 0)) {
				this.$u.toast('您暂无可勾选的订单~');
				return;
			}

			if (this.checked) {
				this.checked = false;
				this.orderList.forEach((res) => {
					res.check = false;
				});
				this.hasCheck = false;
				// this.$refs.paging.refresh();
				return;
			} else {
				this.realTimeSel.role = this.pinia_userRole == 'R' ? '1' : '0';
				uni.$api.bills.checkAllLockedBills(this.realTimeSel).then((res) => {
					console.log(res);
					if (res.data.data == '0') {
						this.$u.toast('请选择同一客户名称的订单~');
					} else if (res.data.data == '2') {
						this.$u.toast('同一主体存在注销单据和现有单据不能同时开单~');
					} else if (res.data.data == '1') {
						this.checked = true;
						this.orderList.forEach((res) => {
							res.check = true;
						});
						this.hasCheck = true;
						this.getCheckedId();
					}
				});
			}
		},
		checkboxGroupChange(event, index) {
			console.log('event', event);

			this.orderList[index].check = this.orderList[index].check ? false : true;

			if (this.orderList[index].check) {
				this.realTimeSel.ids.push(this.orderList[index].id);
			} else {
				this.realTimeSel.ids = this.realTimeSel.ids.filter((id) => id != this.orderList[index].id);
				console.log(this.realTimeSel.ids);
			}

			var port = this.pinia_userRole == 'R';
			var filteredOrders = [];
			var zxList = [];
			var checkTrue = this.orderList.filter((order) => order.check);
			if (port) {
				filteredOrders = checkTrue.filter((order) => order.bossNumberS != checkTrue[0].bossNumberS);
				zxList = filteredOrders.filter((order) => order.bossNumberS.includes('zx'));
			} else {
				filteredOrders = checkTrue.filter((order) => order.bossNumberE != checkTrue[0].bossNumberE);
				zxList = filteredOrders.filter((order) => order.bossNumberE.includes('zx'));
			}

			var zx = false;

			if (port) {
				zxList.forEach((res) => {
					var bossNumberS = checkTrue[0].bossNumberS;
					if (res.bossNumberS.split('zx-')[1] === bossNumberS) {
						zx = true;
					}
				});
			} else {
				zxList.forEach((res) => {
					var bossNumberE = checkTrue[0].bossNumberE;
					if (res.bossNumberE.split('zx-')[1] === bossNumberE) {
						zx = true;
					}
				});
			}

			if (zx) {
				this.$u.toast('同一主体,已注销单据不能和现有单据同时开收付款单~');
				this.orderList[index].check = false;
				return;
			}

			console.log('filteredOrders', filteredOrders);

			if (filteredOrders.length > 0) {
				console.log('zx', zxList);
				this.$u.toast('请选择同一客户名称的订单~');
				this.orderList[index].check = false;
				return;
			}

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

			console.log(event);
		},
		getCheckedId() {
			uni.$api.bills.checkAllLockedIds(this.realTimeSel).then((res) => {
				console.log(res);
				var data = res.data.data;
				this.realTimeSel.ids = data.ids;
				console.log(data);
			});
		},
		getOperatingSystem() {
			let systemInfo = uni.getSystemInfoSync();
			if (systemInfo.system.toLowerCase().includes('ios')) {
				return true;
			}
			if (systemInfo.system.toLowerCase().includes('android')) {
				return false;
			}
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
		Init() {
			this.realTimeSel.organizationE = '';
			if (this.pinia_user.data.work == '0') {
				if (this.pinia_userRole == 'D') {
					this.realTimeSel.bossNumberS = this.pinia_user.phone;
					if (this.pinia_user.phone == this.start) {
						this.realTimeSel.bossNumberE = this.end;
					}
				} else {
					this.realTimeSel.bossNumberE = this.pinia_user.phone;
					if (this.pinia_user.phone == this.start) {
						this.realTimeSel.bossNumberS = this.end;
					}
				}
			} else {
				if (this.pinia_userRole == 'D') {
					this.realTimeSel.bossNumberS = this.pinia_user.workData.bossNumber;
				} else {
					this.realTimeSel.bossNumberE = this.pinia_user.workData.bossNumber;
				}
			}
			this.$refs.paging.refresh();
		},
		virtualListChange(vList) {
			this.orderList = vList;
		},
		queryList(pageNo, pageSize) {
			// this.LimitSeting(pageNo);
			if (this.pinia_user.phone != undefined) {
				console.log(pageNo, pageSize);
				this.realTimeSel.page = pageNo;
				this.realTimeSel.pageSize = pageSize;
				this.refreshDataNew();
			} else {
				console.log('请登录');
				this.$refs.paging.complete([]);
			}
		},
		getCheck() {
			// getFilterLockCheck
			uni.$api.bills
				.getCheckedLockedBills(this.realTimeSel)
				.then((res) => {
					console.log('getFilterLockCheck:', res.data.data);

					var orderList = res.data.data.map((obj) => {
						console.log(this.ids, obj.id);
						return {
							...obj,
							check: this.checked ? true : this.ids.includes(obj.id) || this.realTimeSel.ids.includes(obj.id),
							show: false
						};
					});

					this.$refs.pagingCheck.complete(orderList);

					this.refresh = true;
					this.onReachBottom = true;
					this.uloading = false;
				})
				.catch((res) => {
					this.$refs.paging.complete(false);
					this.refresh = true;
				});
		},
		refreshDataNew() {
			if (this.realTimeSel.page * this.realTimeSel.pageSize > 10) {
				// this.realTimeSel.ids = []
			} else {
				this.realTimeSel.ids = this.ids;
			}
			this.uloading = true;
			if (this.refresh) {
				this.refresh = false;
				this.onReachBottom = false;
				this.realTimeSel.role = this.pinia_userRole == 'R' ? '1' : '0';
				uni.$api.bills
					.getFilteredLockedBills(this.realTimeSel)
					.then((res) => {
						//console.log(res.data.data);

						var orderList = res.data.data.map((obj) => {
							console.log(this.ids, obj.id);
							console.log(this.ids.includes(obj.id) || this.realTimeSel.ids.includes(obj.id));
							return {
								...obj,
								check: this.checked ? true : this.ids.includes(obj.id) || this.realTimeSel.ids.includes(obj.id),
								show: false
							};
						});

						this.oldList.forEach((res) => {
							orderList.unshift(res);
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
					});

				uni.$api.bills
					.getLockedBillQuantity(this.realTimeSel)
					.then((res) => {
						//console.log("当前订单个数：", res);
						this.OrderQuantity = res.data.data[1];
						this.OrderQuantitySum = res.data.data[0];
					})
					.catch((res) => {
						this.refresh = true;
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
		getNewfreshData() {
			this.realTimeSel.role = this.pinia_userRole == 'R' ? '1' : '0';
			uni.$api.order
				.getFilteredOrders(this.realTimeSel)
				.then((res) => {
					//console.log("滑动触发", res);
				})
				.catch((res) => {
					this.refresh = true;
				});

			uni.$api.order
				.getFilteredOrderCount(this.realTimeSel)
				.then((res) => {
					//console.log("当前订单个数：", res);
					this.OrderQuantity = res.data.data[1];
					this.OrderQuantitySum = res.data.data[0];
				})
				.catch((res) => {
					this.refresh = true;
				});
		},
		loadData() {
			let role = this.pinia_user.data.work == '1' ? 1 : 2;
			//console.log(this.pinia_user.data.work);
			var that = this;
			// uni.$api.user
			// 	.refreshUser({
			// 		phone: this.pinia_user.phone,
			// 		role: role
			// 	})
			// 	.then((res) => {
			// 		let a = that.pinia_user;
			// 		a.ac = res.data.data.ac;
			// 		a.data = res.data.data.data;
			// 		a.workData = res.data.data.workData;
			// 		a.jurisdiction = res.data.data.jurisdiction;
			// 		a.password = res.data.data.password;
			// 		that.$u.vuex('pinia_user', a);
			// 		if (res.data.data.data.work == '1') {
			// 			that.$u.vuex('pinia_work', 'Y');
			// 		} else {
			// 			that.$u.vuex('pinia_work', 'N');
			// 		}
			// 	});

			//console.log("用户信息实时更新 ", this.pinia_user);
		},
		LoginIf() {
			if (!this.pinia_token) {
				uni.navigateTo({
					url: '/pages/subUser/login'
				});
			}
		},
		verifyPasswordAdd(item, index, type) {
			this.verifyPassword.item = item;
			this.verifyPassword.index = index;
			this.verifyPassword.type = type;
		},
		changeList(e) {
			//console.log("changeList操作", e);
			this.password = e;
		},
		finishList(e) {
			//console.log("finishList操作", e);
			this.password = e;
		},
		cancel() {
			this.showMask = false;
			this.password = '';
		},
		copyBtn(val) {
			const that = this;
			uni.setClipboardData({
				data: val,
				success: function () {
					that.$u.toast('单号已复制');
				}
			});
			return;
		},
		ifZX(val) {
			return val.includes('zx-');
		},
		SOCKETfLUSH() {
			this.unwatchFlush = this.$watch(
				(state) => state.flush, // 监听状态
				(newVal, oldVal) => {
					this.flushIndex = newVal; // 当状态变化时，更新本地数据
					//console.log('list flush 改变:', newVal);
					this.refreshDataNew();
				}
			);
		},
		remark(item) {
			uni.$nav.to('/pages/subList/remark', { item: JSON.stringify(item) });
			this.hide = false;
		},
		ClearIF() {
			if (this.hide) {
				//console.log("清除缓存");
				this.clear();
				this.$refs.paging.reload();
				this.realTimeSel.limitS = 0 + ',' + 10;
				this.Title = '条件筛选';
			}
		},
		generateFiveDigitNumber() {
			return 10000 + Math.floor(Math.random() * 90000);
		},
		applyUpdatePlay(val) {
			console.log(val);
			//申请修改
			//当前手机号码 发起者
			var aPhone = this.pinia_user.phone;
			//是否工作
			var workif = this.pinia_user.data.work == '0';
			//收获端老板是否为同一人
			var ifOne = val.bossNumberE == val.staffNumberE;
			//判断端口
			var ifPort = this.pinia_userRole == 'D';
			//订单状态
			var stateOrder = val.paymentState == '0';
			var dx = {
				aUser: aPhone,
				bUser: val.bossNumberS,
				orderNumber: val.orderNumber,
				orderId: val.id,
				createTime: new Date(),
				updateTime: '',
				state: 1,
				aBoss: '',
				bBoss: '',
				port: 'f',
				orderState: val.paymentState,
				aName: this.pinia_user.data.name || this.pinia_user.phone || ''
			};

			if (workif) {
				//没工作
				dx.aBoss = this.pinia_user.phone;
				dx.bBoss = val.bossNumberS;
				dx.bUser = val.staffNumberS;
			} else {
				//工作
				var identity = this.pinia_user.workData.identity;
				var boss = this.pinia_user.workData.bossNumber;
				dx.aBoss = boss;

				if (val.bossNumberS == val.staffNumberS) {
					//直接发起老板
					dx.bBoss = val.bossNumberS;
				} else {
					//发起给员工
					dx.bBoss = val.staffNumberS;
				}
			}

			var okOrNo = 0;
			uni.$api.order
				.addTemporaryOrder(dx)
				.then((res) => {
					okOrNo = res.data.data;
				})
				.catch((res) => {
					this.$u.toast('申请失败~');
					this.refreshData();
				})
				.finally(() => {
					this.finallyAlert(okOrNo);
				});
		},
		finallyAlert(resData) {
			if (resData == '1') {
				this.$u.toast('申请成功~');
			} else if (resData == '2') {
				this.$u.toast('请勿重复申请~');
			} else if (resData == '3') {
				this.$u.toast('该单位已有人员提交付款申请~');
			} else if (resData == '4') {
				this.$u.toast('该单位已经有人员提交删除申请');
			} else if (resData == '5') {
				this.$u.toast('已有申请记录');
			} else if (resData == '9') {
				this.$u.toast('操作失败');
			} else if (resData == '8') {
				this.$u.toast('订单状态已经改变');
			}
			this.password = '';
			this.refreshDataOneMin();
		},
		finallyAlertDel(resData, delmess) {
			if (resData == '1') {
				var role = this.pinia_userRole == 'R';
				if (role) {
					this.$u.toast('申请成功~');
				} else {
					if (delmess == '1') {
						this.$u.toast('申请成功~');
					} else {
						this.$u.toast('删除成功~');
					}
				}
			} else if (resData == '2') {
				this.$u.toast('请勿重复申请~');
			} else if (resData == '3') {
				this.$u.toast('该单位已有人员提交付款申请~');
			} else if (resData == '4') {
				this.$u.toast('该单位已经有人员提交删除申请');
			} else if (resData == '5') {
				this.$u.toast('已有申请记录');
			} else if (resData == '9') {
				this.$u.toast('操作失败');
			} else if (resData == '8') {
				this.$u.toast('订单状态已经改变');
			}

			this.password = '';
			this.refreshDataOneMin();
		},
		refreshDataOneMin() {
			var that = this;
			setTimeout(function () {
				that.refreshDataNew();
			}, 500);
		},
		updateOrder(order) {
			uni.$api.order
				.signForOrder(order)
				.then((res) => {
					if (res.data.data == '9') {
						this.$u.toast('确认失败~');
					} else {
						this.$u.toast('确认成功~');
					}
					this.refreshDataNew();
				})
				.catch((res) => {
					this.$u.toast('确认失败~');
					this.refreshDataNew();
				});
		},
		CustomerGetChange() {
			var ifWorkPort = this.pinia_userRole == 'R';
			var changeText = this.customer;
			//console.log(changeText);
			if (!ifWorkPort) {
				this.realTimeSel.organizationE = changeText;
				// this.$refs.paging.reload();
				this.refreshDataNew();
			} else {
				this.realTimeSel.enterpriseS = changeText;
				// this.$refs.paging.reload();
				this.refreshDataNew();
			}
		},
		getCurrentDate() {
			const date = new Date();
			const year = date.getFullYear();
			const month = ('0' + (date.getMonth() + 1)).slice(-2);
			const day = ('0' + date.getDate()).slice(-2);
			return `${year}-${month}-${day}`;
		},
		getCurrentYearFirstDay() {
			const date = new Date();
			const year = date.getFullYear();
			const month = ('0' + (date.getMonth() + 1)).slice(-2);
			const day = ('0' + date.getDate()).slice(-2);
			return `${year}-01-01`;
		},
		searchListenner(e) {
			//console.log(e);
			var filterIndex = this.showTage;
			var ifWorkPort = this.pinia_userRole == 'R';

			if (filterIndex == '0') {
				if (!ifWorkPort) {
					//发货 收货人
					this.realTimeSel.kTakeE = this.field;
				} else {
					this.realTimeSel.kTakeE = this.field;
					// this.realTimeSel.contactsS = this.field
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
					this.realTimeSel.inventoryName = this.field;
				}
			}
			this.type = 1;
			this.$refs.paging.reload();
			this.refreshDataNew();
		},
		Filtrate(i) {
			this.showTage = i;
			this.TitleFun(i);
			if (this.field) {
				this.field = '';
				this.realTimeSel.kTakeE = '';
				this.realTimeSel.kSiteE = '';
				this.realTimeSel.kPhoneE = '';
				this.realTimeSel.inventoryName = '';
				this.refreshDataNew();
			}
		},
		filtrateGet() {
			this.show_start = true;
		},
		CustomerGet() {
			this.hide = false;
			this.$u.toast('收付款单修改不能自定义客户');
		},
		openTime() {
			//console.log("点击");
			this.show_start = true;
		},
		noteMyOrder(val) {
			//console.log(val);
		},
		payClick(val) {
			uni.showModal({
				title: '温馨提醒',
				content: '请仔细核对货物信息后确认收货',
				showCancel: true,
				cancelText: '取消',
				confirmText: '现款签收',
				confirmColor: '#01bb74',
				success: (res) => {}
			});
		},
		change(index) {
			//查询数据库
			this.$refs.paging.reload();
			this.current = index;
			this.$u.setPinia({
				global: {
					tabIndex: index == 0 ? '' : Number(index) - 1
				}
			});

			this.realTimeSel.paymentState = index == 0 ? '' : Number(index) - 1;
			this.realTimeSel.limitS = 0 + ',' + 10;
			this.refresh = true;
			this.refreshDataNew();
			this.removeCheck();
		},
		copyBtn(val) {
			const that = this;
			uni.setClipboardData({
				data: val,
				success: function () {
					that.$u.toast('单号已复制');
				}
			});
			return;
		},
		sendTips(val) {
			this.$u.toast('请先到后台发货~');
		},
		date1Change(e) {
			if (this.timeType == 1) {
				this.date1 = e.fulldate;
			} else {
				if (!this.date1) {
					return uni.$u.toast('请先选择开始时间');
				} else if (new Date(e.fulldate).getTime() < new Date(this.date1).getTime()) {
					return uni.$u.toast('开始日期不能大于结束日期~');
				}
				this.date2 = e.fulldate;
			}
		},
		filterReset() {
			this.date1 = this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
			this.date2 = this.$u.timeFormat(new Date(), 'yyyy-mm-dd');
			this.showTage = '0';
			this.realTimeSel.startDate = this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
			this.realTimeSel.endDate = this.$u.timeFormat(new Date(), 'yyyy-mm-dd');
			this.showTage = 0;
			this.realTimeSel.phoneE = '';
			this.realTimeSel.organizationE = '';
			this.realTimeSel.enterpriseS = '';
			this.realTimeSel.enterpriseS = '';
			this.realTimeSel.takeE = '';
			this.realTimeSel.enterpriseDz = '';
			this.realTimeSel.inventoryName = '';
			this.customer = '';
			this.field = '';
			this.realTimeSel.phoneS = '';
			this.realTimeSel.contactsS = '';
			this.realTimeSel.siteE = '';
			//console.log("重置：", this.realTimeSel);

			this.refreshDataNew();
		},
		clear() {
			this.$u.setPinia({
				global: {
					tabIndex: 0
				}
			});

			this.current = 0;
			this.realTimeSel.paymentState = '';
			this.date1 = this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
			this.date2 = this.$u.timeFormat(new Date(), 'yyyy-mm-dd');
			this.showTage = '0';
			this.realTimeSel.startDate = this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
			this.realTimeSel.endDate = this.$u.timeFormat(new Date(), 'yyyy-mm-dd');
			this.showTage = 0;
			this.realTimeSel.phoneE = '';
			this.realTimeSel.organizationE = '';
			this.realTimeSel.enterpriseS = '';
			this.realTimeSel.enterpriseS = '';
			this.realTimeSel.takeE = '';
			this.realTimeSel.enterpriseDz = '';
			this.realTimeSel.inventoryName = '';
			this.realTimeSel.kTakeE = '';
			this.realTimeSel.kPhoneE = '';
			this.realTimeSel.kSiteE = '';
			this.customer = '';
			this.field = '';
		},
		SearchBtn() {},
		filterSubmit() {
			this.show_start = false;
			this.realTimeSel.startDate = this.date1 != '' ? this.date1 : this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
			this.realTimeSel.endDate = this.date2 != '' ? this.date2 : this.$u.timeFormat(new Date(), 'yyyy-mm-dd');
			this.refreshDataNew();
		}
	}
};
</script>

<style scoped lang="scss">
::v-deep .u-safe-bottom {
	height: 0 !important;
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

.remark {
	background-size: 30rpx;
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

.check-company .u-line-bt {
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
	border: 2rpx solid #d8d8d8;
}

.hl-btn.NY.bg-gray {
	border: 2rpx solid #d8d8d8;
	padding-left: 2rpx;
	padding-right: 2rpx;
}

// .hl-btn.bg-gray {
// 	border: 2rpx solid #D8D8D8;
// }

.u-img {
	float: right;
}

.my-input .u-input-clear {
	/* 调整清除按钮的样式，比如 margin 或 padding */
	margin-right: 20rpx;
	/* 或者其他你想要的样式 */
}

.passwordTitle {
	width: 100%;
	height: 40%;
	color: #333333;
	font-size: 36rpx;
	font-weight: 600;
}

.titlePas {
	color: #333333;
	font-size: 36rpx;
	font-weight: 600;
}

.titlePasOK {
	color: #01bb74;
	font-size: 36rpx;
	font-weight: 600;
}

.err {
	font-family: Source Han Sans;
	font-size: 26rpx;
	font-weight: normal;
	line-height: 44.92rpx;
	letter-spacing: 1.3rpx;

	font-feature-settings: 'kern' on;
	color: #f53f3f;
}
</style>

<style lang="scss">
.root {
	height: 100vh;
	width: 100vw;
	background: #f5f5f5;
	overflow-y: auto;
	align-items: center;

	.Card {
		width: 94%;
		background-color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 14rpx;
		padding: 20rpx;
		margin-left: 3%;
		margin-top: 25rpx;
		margin-bottom: 24rpx;

		.HnadCard {
			height: 10%;
			width: 100%;
			// background-color: aqua;

			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: left;

			.HnadCardBtn {
				border-radius: 12rpx;

				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;

				font-size: 24rpx;

				margin-right: 20rpx;
			}
		}

		.priceCard {
			display: flex;
			flex-direction: column;
			width: 100%;
		}

		.InputCard {
			display: flex;
			flex-direction: column;
			width: 100%;
			margin-top: 10rpx;

			.InputOne {
				background-color: #f9f9f9;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: left;
				border-radius: 24rpx;
				margin-top: 20rpx;
				padding-right: 20rpx;
			}
		}
	}

	.NumOrder {
		background-color: transparent;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding-left: 30rpx;
		padding-right: 30rpx;
		padding-bottom: 10rpx;
		padding-top: 30rpx;
		letter-spacing: 2rpx;
	}

	.OrderCard {
		display: flex;
		flex-direction: column;
		padding-left: 20rpx;
		padding-right: 20rpx;
		padding-bottom: 24rpx;
		padding-top: 25rpx;
		background-color: white;
		margin-bottom: 18rpx;
		position: relative;
		margin-left: 24rpx;
		margin-right: 24rpx;
		border-radius: 15rpx;
		box-shadow: 0rpx 7rpx 10rpx 0rpx rgba(51, 51, 51, 0.1);

		.OrderCardHand {
			margin-bottom: 10rpx;
			display: flex;
			flex-direction: row;
			width: 100%;
			justify-content: space-between;
			.title {
				display: flex;
				flex-direction: row;
				align-items: center;
				width: 70%;
			}
		}
	}
}
.tages {
	color: #01bb74;
	background-color: #f2fbf8;
	width: 30%;
	height: 54rpx;
	border-radius: 12rpx;
}
.u-badge {
	z-index: 100 !important;
}
</style>
