<template>
	<view class="billReceipt">
		<!-- 日历选择器 -->
		<uv-calendars color="#01BB74" confirmColor="#01BB74" :startDate="getCurrentYearFirstDay()" :endDate="getCurrentDate()" ref="calendars" @confirm="ChangeTimeStart" />
		<view class="flex-row items-center justify-center" style="height: 66%">
			<up-empty icon="https://res-oss.elist.com.cn/wxImg/order/cw.svg" iconSize="400rpx" text="无查看权限~" v-if="!identity"></up-empty>
		</view>

		<z-paging
			:paging-style="{ marginTop: '0' }"
			ref="paging"
			use-virtual-list
			:force-close-inner-list="true"
			v-if="identity"
			:auto="true"
			:refresher-enabled="true"
			:cell-height-mode="0 != 0 ? 'fixed' : 'dynamic'"
			@virtualListChange="virtualListChange"
			@query="queryList"
			:height="current == 0 ? '100%' : '100%'"
			style=""
		>
			<template #top>
				<view class="" @touchmove.stop.prevent>
					<up-tabs
						:list="TabList"
						:current="current"
						:scrollable="false"
						:showBar="true"
						lineColor="#01BB74"
						:activeStyle="{ backgroundColor: 'transparent', color: '#01BB74' }"
						:inactiveStyle="{ color: '#333333' }"
						:itemStyle="{
							width: '50%',
							height: '90rpx',
							backgroundColor: '#fff'
						}"
						@change="TabChange"
					/>

					<view class="billCard cardShow">
						<text @click="openTableChoice" style="color: #666666">
							{{ pinia_userRole === 'R' ? '供应商选择' : '客户选择' }}
						</text>
						<up-line direction="col" margin="0 20rpx" color="#333" length="30rpx"></up-line>
						<view class="my-input flex-1">
							<uv-input
								border="none"
								@change="InputTextOne"
								v-model="InputOneText"
								:customStyle="{ backgroundColor: 'transparent' }"
								:placeholder="pinia_userRole === 'R' ? '请选择供应商' : '请选择客户'"
								:clearable="true"
							></uv-input>
						</view>

						<view class="flex-col justify-center items-center" style="height: 100%">
							<view class="ml40">
								<up-icon name="/static/img/list/lxr.svg" size="45rpx" @click="openTableChoice"></up-icon>
							</view>
						</view>
					</view>

					<view class="billCardTime cardShow">
						<view class="billCardTimeStart">
							<text class="mr10" style="color: #666666">开始日期</text>
							<up-icon name="arrow-down-fill" size="10"></up-icon>
							<view
								@click="
									$refs.calendars.open();
									timeType = 1;
								"
								class="ml10"
								style="border: 1rpx solid #999999; padding: 6rpx; border-radius: 6rpx"
							>
								{{ time.start }}
							</view>
						</view>
						<view class="billCardTimeEnd">
							<text class="mr10" style="color: #666666">结束日期</text>
							<up-icon name="arrow-down-fill" size="10"></up-icon>
							<view
								@click="
									$refs.calendars.open();
									timeType = 2;
								"
								class="ml10"
								style="border: 1rpx solid #999999; padding: 6rpx; border-radius: 6rpx"
							>
								{{ time.end }}
							</view>
						</view>
					</view>
				</view>
			</template>

			<view class="OrderCard" v-for="(item, index) in CBills" :key="item.id" @click="clickJump(item)">
				<view class="OrderCard_Hand" @tap.stop v-if="item.billState == 0">
					<view
						class="flex-col justify-center items-center mr15 ml24"
						:style="{ backgroundColor: item.check ? '#01BB74' : '#ffffff' }"
						@click="checkboxGroupChange(item, index)"
						style="border-radius: 100rpx; height: 40rpx; width: 40rpx; border: 2rpx solid #aaaaaa"
					>
						<up-icon name="checkbox-mark" color="#ffffff" size="28rpx"></up-icon>
					</view>
					<view class="OrderCard_Hand_time">
						{{ $u.timeFormat(item.billTime, 'yyyy-mm-dd') }}
					</view>
				</view>
				<view class="OrderCard_Hand" @tap.stop v-else>
					<view class="OrderCard_Hand_time ml48">
						{{ $u.timeFormat(item.billTime, 'yyyy-mm-dd') }}
					</view>
				</view>
				<!-- 			<view class="OrderCard_body" v-if="item.billState==0">
					<text v-if="pinia_userRole=='R'"
						class="OrderCard_body_text ml24">{{item.sourcePhone==pinia_user.phone&&pinia_user.data.work!="1"?item.billEnterpriseE:pinia_user.data.work=="1"?item.billEnterpriseE:item.billEnterpriseS}}</text>
					<text v-if="pinia_userRole=='D'"
						class="OrderCard_body_text ml24">{{item.sourcePhone==pinia_user.phone&&pinia_user.data.work!="1"?item.billEnterpriseE:pinia_user.data.work=="1"?item.billEnterpriseE:item.billEnterpriseS}}</text>
				</view>
				<view class="OrderCard_body_ply" v-if="item.billState==1">
					<text v-if="pinia_userRole=='R'"
						class="OrderCard_body_text ml24">{{item.sourcePhone==pinia_user.phone&&pinia_user.data.work!="1"?item.billEnterpriseE:pinia_user.data.work=="1"?item.billEnterpriseE:item.billEnterpriseS}}</text>
					<text v-if="pinia_userRole=='D'"
						class="OrderCard_body_text ml24">{{item.sourcePhone==pinia_user.phone&&pinia_user.data.work!="1"?item.billEnterpriseE:pinia_user.data.work=="1"?item.billEnterpriseE:item.billEnterpriseS}}</text>
				</view> -->
				<view class="OrderCard_body" v-if="item.billState == 0">
					<text v-if="pinia_userRole == 'R'" class="OrderCard_body_text ml24">
						{{
							pinia_user.data.work == '0'
								? item.sourcePhone == pinia_user.phone
									? item.billEnterpriseE
									: item.billEnterpriseS
								: item.sourcePhone == pinia_user.workData.bossNumber
								? item.billEnterpriseE
								: item.billEnterpriseS
						}}
					</text>
					<text v-if="pinia_userRole == 'D'" class="OrderCard_body_text ml24">
						{{
							pinia_user.data.work == '0'
								? item.sourcePhone == pinia_user.phone
									? item.billEnterpriseE
									: item.billEnterpriseS
								: item.sourcePhone == pinia_user.workData.bossNumber
								? item.billEnterpriseE
								: item.billEnterpriseS
						}}
					</text>
				</view>
				<view class="OrderCard_body_ply" v-if="item.billState == 1">
					<text v-if="pinia_userRole == 'R'" class="OrderCard_body_text ml24">
						{{
							pinia_user.data.work == '0'
								? item.sourcePhone == pinia_user.phone
									? item.billEnterpriseE
									: item.billEnterpriseS
								: item.sourcePhone == pinia_user.workData.bossNumber
								? item.billEnterpriseE
								: item.billEnterpriseS
						}}
					</text>
					<text v-if="pinia_userRole == 'D'" class="OrderCard_body_text ml24">
						{{
							pinia_user.data.work == '0'
								? item.sourcePhone == pinia_user.phone
									? item.billEnterpriseE
									: item.billEnterpriseS
								: item.sourcePhone == pinia_user.workData.bossNumber
								? item.billEnterpriseE
								: item.billEnterpriseS
						}}
					</text>
				</view>

				<view class="OrderCard_card">
					<view class="OrderCard_card_a">
						<view class="a_t">订单编号： {{ item.billNumber }}</view>
					</view>
					<view class="OrderCard_card_b">
						<view class="b_t">订单数：{{ addingBill(item.orders) }}</view>
					</view>
					<view class="OrderCard_card_b">
						<view class="c_t">
							订单金额：
							<text style="color: #01bb74; font-weight: 500">￥{{ formatAmount(item.billPrice) }}</text>
						</view>
					</view>
				</view>
				<view class="OrderCard_end" @tap.stop>
					<up-button
						class="ml30 bg-white"
						v-if="
							pinia_user.data.work == '1'
								? pinia_user.workData.identity == 3 || pinia_user.workData.identity == 1
									? item.sourcePhone == pinia_user.workData.bossNumber && item.billState != 1
									: false
								: item.sourcePhone == pinia_user.phone && item.billState != 1
						"
						hover-class="none"
						plain
						shape="circle"
						@click="click(index, 0)"
						:customStyle="SearchCustomStyleWechat"
					>
						<up-icon name="order" size="25rpx" color="#666666" labelSize="22rpx" labelColor="#333333" label="修改"></up-icon>
					</up-button>

					<up-button class="ml30" hover-class="none" plain shape="circle" @click="viewDetails(item)" :customStyle="SearchCustomStyleWechat">
						<up-icon name="list-dot" size="25rpx" color="#666666" labelSize="22rpx" labelColor="#333333" label="订单列表"></up-icon>
					</up-button>
					<!-- v-if="pinia_user.data.work=='1'?pinia_user.workData.identity!=3:true&&item.billState!=1" -->
					<up-button class="ml30" hover-class="none" plain shape="circle" @click="click(index, 1)" v-if="item.billState != 1" :customStyle="SearchCustomStyleWechat">
						<up-icon name="trash" size="25rpx" color="#666666" labelSize="22rpx" labelColor="#333333" label="删除"></up-icon>
					</up-button>
				</view>
			</view>
			<template #empty>
				<view style="padding-bottom: 200rpx">
					<up-icon margin-top="22rpx" label-pos="bottom" :name="ImgUrl + '/wxImg/list/empty.svg'" labelColor="#AAAAAA" label="暂无记录" size="180"></up-icon>
				</view>
			</template>
			<template #bottom>
				<view class="fixedBar pd10" style="" v-if="current == 0">
					<view class="fixedBarLeft">
						<view class="fixedBarLeftTop">
							<view class="LeftTop_text">
								<span v-if="pinia_userRole == 'D'">应收：</span>
								<span v-if="pinia_userRole == 'R'">应付：</span>
								<text>￥{{ formatAmount(parseFloat(price) - parseFloat(discount)) }}</text>
							</view>
						</view>
						<view class="fixedBarLeftBuo">
							<text>折扣：￥{{ formatAmount(parseFloat(discount)) }}</text>
						</view>
					</view>
					<view class="fixedBarRight">
						<up-button shape="circle" @click="okUpdate" hover-class="none" :customStyle="customStyleBill">{{ billTitle }}</up-button>
					</view>
				</view>
			</template>
		</z-paging>

		<pop-password ref="popPassword" v-if="showPassVerify"></pop-password>
	</view>
</template>

<script>
export default {
	data() {
		return {
			billFrom: {
				sourcePhone: '',
				receptionPhone: '',
				billTime: '',
				billPrice: 0,
				billDiscountPrice: null,
				billAfterPrice: 0,
				billVoucher: '',
				billOperator: '',
				billState: '0',
				billEnterpriseS: '',
				billEnterpriseE: '',
				billPhone: '',
				orders: '',
				type: '0',
				createTime: '',
				updateTime: '',
				startTime: '',
				endTime: '',
				page: '',
				size: '',
				port: '',
				id: null
			},
			TabList: [
				{
					name: '未收款'
				},
				{
					name: '已收款'
				}
			],
			current: 0,
			inputNameTitle: '条件筛选',
			showTage: 0,
			InputOneText: '',
			InputTwoText: '',
			CBills: [],
			CBillsList: {
				page: 1
			},
			checked: false,
			billReceiptOKclick: false,
			showPassVerify: false,
			time: {
				start: '2024-01-01',
				end: '2024-12-30',
				startShow: false,
				endShow: false
			},
			b64Img: {
				img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAYAAACMRWrdAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAF0SURBVGiB7dpBTsJAFAbg/01I45IjcAN7A2CNJHIC9ATiQsKOuCO4EG4gJ9BEXKM36BF6hG5tzIwLFyakbyAygyX5v+3rTN9Lm6bvtQAREf0Sb/RtcgWH4ZFy2Z+4As594GK+UA9RF6/HI4h5jJJYONfozZ6qAkZdItKOlU0wnrtJL+wUCHItpBdWyi2gL6yBHCXutaD/4fE8aqKRdGBMM3hah7C2wJfJMJjl/50KEREREZ2eHS/BkxYSDAG0jpLNvsQVcHaF3kOmHqIufp10YLCJklgoFl30Z+9VIb0fM+4mVj7BCKZaSC/MSb16sCriCi3kKUzvTmvDylIL7Ri/3aUQM6zh1ctRYsUOmoiIiIj+YncH3bBpkM9I1hboz18O3mdPemE/Y4ENgo4FXIbys4vBQu2jQtH7sQRTBJ91SIrk7DLsntV8jWYryhnFnUfZd4vnrwGsopzR2Tj7bvE/PNbjEUTaQTpocQWsLLWpEhERxfQNdghWBaM5y08AAAAASUVORK5CYII='
			},
			customStyleBill: {
				width: '360rpx',
				height: '80rpx',
				backgroundColor: '#00B578',
				boder: 'none',
				color: '#ffffff'
			},
			options: [
				{
					text: '修改',
					style: {
						backgroundColor: '#FF8F1F',
						borderRadius: '0rpx 0rpx 0rpx 0rpx'
					},
					radius: '0rpx 0rpx 0rpx 0rpx'
				},
				{
					text: '删除',
					style: {
						backgroundColor: '#FA5151',
						borderRadius: '0rpx 0rpx 12rpx 0rpx'
					},
					radius: '0rpx 0rpx 0rpx 0rpx'
				}
			],
			operationBill: {
				type: 0,
				bill: {}
			},
			price: 0,
			discount: 0,
			checkOrder: [],
			billFromDel: {
				id: ''
			},
			defaultValues: {
				id: '', // 通常自增主键在创建时不应设置值，这里设为空字符串仅作形式上的统一
				aUser: '',
				bUser: '',
				orderNumber: '',
				orderId: '',
				aBoss: '',
				bBoss: '',
				createTime: '', // 默认值可以设为空字符串，但通常你会在创建时设置当前时间
				updateTime: '', // 默认值可以设为空字符串，但通常你会在更新时设置当前时间
				state: 0, // 假设一个默认的状态值，这里用0表示，根据实际需求调整
				port: '',
				orderState: '',
				aName: '',
				genre: ''
			},
			SearchCustomStyleWechat: {
				width: 'auto',
				height: 'auto',
				padding: '12rpx 24rpx',
				fontSize: '24rpx',
				color: '#666666',
				margin: '0'
			},
			identity: false,
			billTitle: '收款',
			timeType: null
		};
	},
	onLoad(option) {
		console.log('进入', option);
		console.log('ggggggggggg', uni);
		if (this.pinia_userRole == 'D') {
			uni.setNavigationBarTitle({
				title: '收款单列表'
			});
			this.TabList[0].name = '未收款';
			this.TabList[1].name = '已收款';
		} else {
			uni.setNavigationBarTitle({
				title: '付款单列表'
			});
			this.TabList[0].name = '未付款';
			this.TabList[1].name = '已付款';
		}

		var identity = this.pinia_user.data.work == '1' ? this.pinia_user.workData.identity != 4 : true;
		this.identity = identity;
		if (identity) {
			this.checkFalse();
			this.current = 0;
			this.Init();
			this.$refs.paging.reload();
		}
	},
	onShow() {},
	methods: {
		SOCKETfLUSH() {
			this.unwatchFlush = this.$watch(
				(state) => state.flush, // 监听状态
				(newVal, oldVal) => {
					this.flushIndex = newVal;
					this.$refs.paging.refresh();
				}
			);
		},
		clickJump(bill) {
			uni.navigateTo({
				url: '/pages/subStatistics/receipt/bill_particulars?id=' + bill.id
			});
		},
		delBill(bill) {
			console.log('删除', this.defaultValues);
			console.log('删除', bill);

			var billdel = false;
			if (this.pinia_user.data.work == '0') {
				billdel = bill.sourcePhone == this.pinia_user.phone;
			} else {
				billdel = bill.sourcePhone == this.pinia_user.workData.bossNumber;
			}

			if (billdel) {
				//直接删除
				uni.$api.bills.deleteBill(bill).then((res) => {
					console.log('删除：', bill.id, res);
					this.$u.toast(res.data.message);
					this.$refs.paging.refresh();
				});
			} else {
				//申请
				this.defaultValues.port = this.pinia_userRole == 'D' ? 'S' : 'E';
				this.defaultValues.orderId = bill.id;
				this.defaultValues.orderNumber = bill.billNumber;
				this.defaultValues.genre = 'D';

				var work = this.pinia_user.data.work == '0';

				if (this.pinia_userRole == 'D') {
					this.defaultValues.aBoss = this.pinia_user.phone;
					this.defaultValues.bBoss = bill.sourcePhone;

					if (work) {
						this.defaultValues.aUser = this.pinia_user.phone;
					} else {
						this.defaultValues.aUser = this.pinia_user.workData.bossNumber;
					}

					this.defaultValues.bUser = bill.sourcePhone;

					this.defaultValues.aName = this.pinia_user.ac.enterpriseName || this.pinia_user.phone;
				} else {
					this.defaultValues.aBoss = bill.receptionPhone;
					this.defaultValues.bBoss = bill.sourcePhone;
					if (work) {
						this.defaultValues.aUser = this.pinia_user.phone;
					} else {
						this.defaultValues.aUser = this.pinia_user.workData.bossNumber;
					}
					this.defaultValues.bUser = bill.sourcePhone;
					// this.defaultValues.aName = bill.billEnterpriseS;
					this.defaultValues.aName = this.pinia_user.ac == null ? this.pinia_user.phone : this.pinia_user.ac.enterpriseName;
				}

				this.defaultValues.createTime = new Date();
				this.defaultValues.state = '1';
				this.defaultValues.orderState = this.addingBill(bill.orders);
				uni.$api.bills.revokeBillApplication(this.defaultValues).then((res) => {
					console.log('删除：', bill.id, res);
					this.$u.toast(res.data.message);
					this.$refs.paging.refresh();
				});
			}
		},
		OpenBillDetails(id, type) {
			uni.navigateTo({
				url: '/pages/subStatistics/receipt/bill_particulars_up?id=' + id + '&port=' + this.pinia_userRole + '&edit=' + type
			});
		},
		ChangeTimeStart(e) {
			if (this.timeType == 1) {
				this.time.start = e.fulldate;
				this.billFrom.startTime = this.time.start;
			} else {
				if (!this.time.start) {
					return uni.$u.toast('请先选择开始时间');
				} else if (new Date(e.fulldate).getTime() < new Date(this.time.start).getTime()) {
					return uni.$u.toast('开始日期不能大于结束日期~');
				}
				this.time.end = e.fulldate;
				this.billFrom.endTime = this.time.end;
			}
			//请求
			this.$refs.paging.reload();
			// if (this.EndBigStart(e.result, this.time.end)) {
			// 	this.$u.toast(`开始时间不能大于结束时间`);
			// 	return;
			// } else {

			// }
		},
		EndBigStart(start, end) {
			var s = new Date(start).getTime();
			var e = new Date(end).getTime();
			return e < s;
		},
		click(index, type) {
			console.log('index:', index);
			console.log('type:', type);
			this.getSin(type, index);
		},
		getSin(type, index) {
			var operator = type == 0;
			var port = this.pinia_userRole == 'D';
			var billPort = port ? '收' : '付';

			var Bill = this.CBills[index];

			var work = this.pinia_user.data.work == '0';
			var phone = this.pinia_user.phone;

			var content = '';
			if (Bill.sourcePhone == phone || Bill.sourcePhone == this.pinia_user.workData.bossNumber) {
				content = '是否确认' + (operator ? '修改' : '删除') + '该' + billPort + '款单?';
			} else {
				content = '是否确认向' + (port ? '收' : '发') + '货方申请' + (operator ? '修改' : '删除') + '该' + billPort + '款单，需要对方同意后' + billPort + '款单才会被删除';
			}

			uni.showModal({
				title: '温馨提醒',
				content: content,
				showCancel: true,
				cancelText: '取消',
				confirmText: '确认',
				success: (res) => {
					if (res.confirm) {
						if (operator) {
							var Bill = this.CBills[index];
							if (Bill.sourcePhone == this.pinia_user.phone || Bill.sourcePhone == this.pinia_user.workData.bossNumber) {
								this.OpenBillDetails(Bill.id, true);
							} else {
								this.$u.toast(`您没有权限修改`);
								this.$refs.paging.refresh();
							}
						} else {
							//删除
							var Bill = this.CBills[index];
							this.delBill(Bill);
						}
						this.checkFalse();
					}
				},
				fail: () => {},
				complete: () => {}
			});
		},
		confirmPassword() {
			console.log('操作', this.operationBill);
			if (this.operationBill.type == 1) {
				console.log('删除请求');
			} else {
				console.log('修改请求');
				this.OpenBillDetails(this.operationBill.bill.id, true);
			}
		},
		// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
		open(index) {
			// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
			// 原本为'false'，再次设置为'false'会无效
			console.log(index);
			this.CBills[index].show = true;
			this.CBills.map((val, idx) => {
				if (index != idx) this.CBills[idx].show = false;
			});
		},
		addingBill(bill) {
			var billid = String(bill);
			return billid.split(',').length;
		},
		viewDetails(item) {
			var billid = String(item.orders);
			var list = billid.split(',');
			uni.navigateTo({
				url: '/pages/subStatistics/receipt/billList?listId=' + list
			});
		},
		okList() {
			var bill = this.CBills.filter((res) => res.check == true);
			var okList = bill.map((res) => res.id);
			this.billTitle = this.pinia_userRole == 'D' ? (okList.length > 1 ? '批量收款' : '收款') : okList.length > 1 ? '批量付款' : '付款';
		},
		okUpdate() {
			var bill = this.CBills.filter((res) => res.check == true);
			var okList = bill.map((res) => res.id);

			if (okList.length <= 0) {
				this.$u.toast(`请选择订单`);
				return;
			}

			var port = this.pinia_userRole == 'D';
			var content = port ? '是否确认收货方已支付该订单？' : '是否向发货方申请确认付款该订单？';
			uni.showModal({
				title: '温馨提醒',
				content: content,
				showCancel: true,
				cancelText: '取消',
				confirmText: '确认',
				success: (res) => {
					if (res.confirm) {
						this.chargeBut();
					}
				},
				fail: () => {},
				complete: () => {}
			});
		},
		chargeBut() {
			var port = this.pinia_userRole == 'D';

			var bill = this.CBills.filter((res) => res.check == true);
			var okList = bill.map((res) => res.id);

			if (port) {
				console.log('收费');
				uni.$api.bills
					.confirmBills({
						billCheckList: okList,
						phone: this.pinia_user.phone,
						port: this.pinia_userRole
					})
					.then((res) => {
						this.$refs.paging.reload().catch(() => {});
						this.$u.toast(res.data.message);
						this.checkFalse();
					});
				console.log('收费', bill, okList);
			} else {
				//申请付款
				var work = this.pinia_user.data.work == '0';

				var cDelOrderApplyList = [];

				bill.forEach((res) => {
					this.defaultValues = Object.assign(
						{},
						...Object.keys(this.defaultValues).map((key) => ({
							[key]: ''
						}))
					);
					this.defaultValues.port = this.pinia_userRole == 'D' ? 'S' : 'E';
					this.defaultValues.orderId = res.id;
					this.defaultValues.orderNumber = res.billNumber;

					if (this.pinia_userRole == 'D') {
						this.defaultValues.aBoss = res.sourcePhone;
						this.defaultValues.bBoss = res.receptionPhone;

						if (work) {
							this.defaultValues.aUser = this.pinia_user.phone;
						} else {
							this.defaultValues.aUser = this.pinia_user.workData.bossNumber;
						}
						this.defaultValues.bUser = res.receptionPhone;

						this.defaultValues.aName = res.billEnterpriseE;
					} else {
						// this.defaultValues.aBoss = this.pinia_user.phone;
						// this.defaultValues.bBoss = res.receptionPhone;
						if (work) {
							this.defaultValues.aUser = this.pinia_user.phone;
							this.defaultValues.aBoss = this.pinia_user.phone;
						} else {
							this.defaultValues.aUser = this.pinia_user.workData.bossNumber;
							this.defaultValues.aBoss = this.pinia_user.workData.bossNumber;
						}

						if (this.defaultValues.aUser == res.receptionPhone || this.pinia_user.workData.bossNumber == res.receptionPhone) {
							this.defaultValues.bUser = res.sourcePhone;
							this.defaultValues.bBoss = res.sourcePhone;
						} else if (this.pinia_user.phone == res.sourcePhone || this.pinia_user.workData.bossNumber == res.sourcePhone) {
							this.defaultValues.bUser = res.receptionPhone;
							this.defaultValues.bBoss = res.receptionPhone;
						}

						if (work) {
							if (this.pinia_user.phone == res.receptionPhone) {
								this.defaultValues.aName = res.billEnterpriseE;
							}
							if (this.pinia_user.phone == res.sourcePhone) {
								this.defaultValues.aName = res.billEnterpriseS;
							}
						} else {
							if (this.pinia_user.workData.bossNumber == res.receptionPhone) {
								this.defaultValues.aName = res.billEnterpriseE;
							}
							if (this.pinia_user.workData.bossNumber == res.sourcePhone) {
								this.defaultValues.aName = res.billEnterpriseS;
							}
						}
					}

					this.defaultValues.createTime = new Date();
					this.defaultValues.state = '1';
					this.defaultValues.orderState = this.addingBill(res.orders);
					this.defaultValues.genre = 'P';

					cDelOrderApplyList.push(this.defaultValues);
				});

				// batchBillApply
				uni.$api.bills.batchApplyBills({ cDelOrderApplyList: cDelOrderApplyList }).then((res) => {
					this.$u.toast(res.data.message);
					this.$refs.paging.reload().catch(() => {});
					this.checkFalse();
				});

				console.log(cDelOrderApplyList);
			}
		},
		checkboxGroupChange(event, index) {
			console.log(event, index);
			if (!this.CBills[index].check) {
				if (!this.checkOrder.includes(this.CBills[index].id)) {
					this.checkOrder.push(this.CBills[index].id);
				}
			} else {
				this.checkOrder = [...new Set(this.checkOrder)];
				this.checkOrder = this.checkOrder.filter((res) => res !== this.CBills[index].id);
				console.log(this.checkOrder);
			}

			this.CBills[index].check = this.CBills[index].check ? false : true;
			var sum = 0;
			var discount = 0;
			this.CBills.forEach((res) => {
				if (res.check) {
					sum = sum + res.billPrice;
					discount = discount + (res.billPrice - res.billAfterPrice);
				}
			});

			this.price = sum;
			this.discount = discount.toFixed(2);
			this.okList();
		},
		virtualListChange(vList) {
			this.CBills = vList;
		},
		queryList(pageNo, pageSize) {
			this.billFrom.page = pageNo;
			this.billFrom.size = pageSize;
			const param = uni.$u.deepClone(this.billFrom);
			param.startTime = param.startTime + ' 00:00:00';
			param.endTime = param.endTime + ' 00:00:00';
			uni.$api.bills.searchBills(param).then((res) => {
				console.log(res);
				var billsList = res.data.data.map((obj) => {
					return {
						...obj,
						check: this.checked || this.checkOrder.includes(obj.id),
						show: false,
						disabled: this.current == 0 ? false : true
					};
				});
				this.$refs.paging.complete(billsList);
			});
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
			this.okList();
			let resJson = uni.getStorageSync('companyNameJSON');
			var ifWorkPort = this.pinia_userRole == 'R';
			var work = this.pinia_user.data.work == '0';

			if (resJson != '') {
				var json = JSON.parse(resJson);
				this.InputOneText = json.company;
				// this.customer = json.company
				if (ifWorkPort) {
					this.billFrom.billEnterpriseS = json.company;
				} else {
					this.billFrom.billEnterpriseE = json.company;
				}
				uni.removeStorageSync('companyNameJSON');

				this.$refs.paging.reload();
			}

			if (ifWorkPort) {
				if (work) {
					this.billFrom.receptionPhone = this.pinia_user.phone;
					this.billFrom.sourcePhone = this.pinia_user.phone;
				} else {
					this.billFrom.receptionPhone = this.pinia_user.workData.bossNumber;
					this.billFrom.sourcePhone = this.pinia_user.workData.bossNumber;
				}

				this.billFrom.type = 0;
			} else {
				if (work) {
					this.billFrom.receptionPhone = this.pinia_user.phone;
					this.billFrom.sourcePhone = this.pinia_user.phone;
				} else {
					this.billFrom.receptionPhone = this.pinia_user.workData.bossNumber;
					this.billFrom.sourcePhone = this.pinia_user.workData.bossNumber;
				}
				this.billFrom.type = 1;
			}

			this.time.end = this.getCurrentDate();
			this.time.start = this.getCurrentYearFirstDay();
			this.billFrom.startTime = this.time.start;
			this.billFrom.endTime = this.time.end;
			this.billFrom.billState = '0';

			this.billFrom.port = this.pinia_userRole;

			this.SOCKETfLUSH();
		},
		TabChange(item) {
			this.billFrom.billState = item.index;
			this.current = item.index;
			this.$refs.paging.reload().catch(() => {});
			this.checkOrder = [];
		},
		checkFalse() {
			this.CBills.forEach((res) => {
				res.check = false;
			});
			this.checkOrder = [];
			this.price = 0;
			this.discount = 0;
		},
		openSearchTj() {
			console.log('打开筛选');
		},
		openTableChoice() {
			uni.navigateTo({
				url: '/pages/subOrder/table?show=0'
			});
		},
		InputTextOneTwo(text) {
			console.log(text);
		},
		InputTextOne(text) {
			var ifWorkPort = this.pinia_userRole == 'R';
			if (ifWorkPort) {
				this.billFrom.billEnterpriseS = text;
			} else {
				this.billFrom.billEnterpriseE = text;
			}
			this.$refs.paging.reload().catch(() => {});
			console.log(this.billFrom);
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
		}
	}
};
</script>

<style scoped lang="scss">
.billReceipt {
	width: 100vw;
	height: 100vh;
	background-color: #f4f4f4;
}

.fixedBar {
	background-color: #ffffff;

	width: 100vw;
	height: 10vh;

	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	.fixedBarLeft {
		height: 100%;
		width: 40%;

		.fixedBarLeftTop {
			height: 50%;
			font-size: 28rpx;
			display: flex;
			flex-direction: row;
			align-items: center;

			padding-left: 24rpx;

			text {
				font-size: 40rpx;
				color: #01bb74;
			}
		}

		.fixedBarLeftBuo {
			height: 50%;
			display: flex;
			flex-direction: row;
			align-items: start;

			padding-left: 24rpx;

			text {
				font-size: 22rpx;
				color: #fdb728;
			}
		}
	}

	.fixedBarRight {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-right: 20rpx;
		height: 100%;
		width: 30%;
	}
}

.OrderCard {
	display: flex;
	flex-direction: column;
	// padding-left: 20rpx;
	// padding-right: 20rpx;
	// padding-bottom: 10rpx;
	padding-top: 25rpx;
	background-color: white;
	margin-bottom: 18rpx;
	position: relative;
	margin-left: 24rpx;
	margin-right: 24rpx;
	border-radius: 15rpx;
	box-shadow: 0rpx 7rpx 10rpx 0rpx rgba(51, 51, 51, 0.1);

	background-color: white;

	// width: 200rpx;
	// height: 200rpx;

	.OrderCard_Hand {
		display: flex;
		flex-direction: row;
		justify-content: left;
		align-items: center;

		.OrderCard_Hand_time {
			color: #666666;
			font-size: 30rpx;
		}
	}

	.OrderCard_body {
		font-size: 36rpx;
		font-weight: normal;
		text-align: left;
		color: #333333;

		padding: 24rpx;

		margin-left: 24rpx;
	}

	.OrderCard_body_ply {
		font-size: 36rpx;
		font-weight: normal;
		text-align: left;
		color: #333333;

		padding: 24rpx;

		margin-left: 0;
	}

	.OrderCard_card {
		margin-left: 24rpx;
		margin-right: 24rpx;
		// margin-top: 15rpx;

		padding: 30rpx;

		border-radius: 12rpx;

		background: rgba(244, 244, 244, 0.35);

		color: #999999;

		// height: 200rpx;

		.OrderCard_card_a {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding-bottom: 10rpx;

			.a_t {
				width: 80%;
			}
		}

		.OrderCard_card_b {
			display: flex;
			flex-direction: row;
			align-items: center;

			.b_t {
				width: 50%;
			}

			.c_t {
				text-align: right;
				width: 100%;
			}
		}
	}

	.OrderCard_end {
		height: 100rpx;

		display: flex;
		align-items: center;
		padding: 0 40rpx;
		::v-deep button {
			margin-right: 20rpx !important;
			&:last-of-type {
				margin-right: 0 !important;
			}
		}
	}
}

.billCard {
	display: flex;
	flex-direction: row;
	align-items: center;

	background-color: #ffffff;

	border-radius: 12rpx;

	margin: 24rpx;

	padding-left: 24rpx;
	padding-right: 24rpx;

	height: 5vh;
}

.billCardTime {
	display: flex;
	flex-direction: row;
	align-items: center;

	background-color: #ffffff;

	border-radius: 12rpx;
	margin: 0 24rpx 24rpx;
	// margin-right: 24rpx;
	// margin-left: 24rpx;
	// margin-bottom: 12rpx;
	// margin-top: 12rpx;

	padding-left: 24rpx;
	padding-right: 24rpx;

	height: 6vh;

	font-size: 28rpx;

	.billCardTimeStart {
		width: 50%;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: left;
		font-size: 28rpx;
	}

	.billCardTimeEnd {
		width: 50%;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: left;
		font-size: 28rpx;

		padding-left: 12rpx;
	}

	.timeInput {
		box-sizing: border-box;
		border: 1rpx solid #d8d8d8;
		width: 200rpx;
		border-radius: 6rpx;
		height: 60rpx;
		margin-left: 24rpx;
		text-align: center;
	}
}
</style>

<style lang="scss">
.u-page {
	padding: 0;
}

.u-demo-block__title {
	padding: 20rpx 0 4rpx 30rpx;
}

.swipe-action {
	&__content {
		padding: 25rpx 0;

		&__text {
			font-size: 30rpx;
			color: $u-main-color;
			padding-left: 30rpx;
		}
	}
}
</style>
