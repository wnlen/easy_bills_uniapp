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
			<template #empty>
				<view style="padding-bottom: 200rpx">
					<u-icon margin-top="22rpx" label-pos="bottom" :name="ImgUrl + '/wxImg/list/empty.svg'" labelColor="#AAAAAA" label="暂无记录" size="180rpx"></u-icon>
				</view>
			</template>
			<template #top>
				<view class="Card cardShow">
					<view class="InputCard">
						<view class="InputOne">
							<text class="ft11 ft-gray ml20" style="background-color: transparent" @click="CustomerGet">
								{{ pinia_userRole === 'R' ? '供应商选择' : '客户选择' }}
							</text>
							<u-line direction="col" margin="0 20rpx" color="#333" length="30rpx"></u-line>
							<view class="my-input flex-1">
								<u-input
									border="none"
									@change="CustomerGetChange"
									v-model="customer"
									:customStyle="{ backgroundColor: 'transparent' }"
									:placeholder="pinia_userRole === 'R' ? '请选择供应商' : '请选择客户'"
									:clearable="true"
								></u-input>
							</view>

							<view class="flex-col justify-center items-center" style="height: 5vh">
								<view class="ml40"><u-icon name="/static/img/list/lxr.svg" size="45rpx" @click="CustomerGet"></u-icon></view>
							</view>
						</view>

						<view class="InputOne">
							<text class="ft11 ft-gray ml20" @click="filtrateGet">
								{{ Title }}
							</text>
							<view class="ml10 mr10"><u-icon name="arrow-down-fill" size="20rpx"></u-icon></view>
							<view class="my-input flex-1" v-if="showTage !== '1'">
								<u-input border="none" v-model="field" @change="searchListenner" placeholder="输入关键字进行检索"></u-input>
							</view>
							<view class="ml24 my-input flex-1" v-if="showTage === '1'">
								<u-input border="none" maxlength="11" v-model="field" @change="searchListenner" placeholder="输入号码进行检索"></u-input>
							</view>

							<view class="flex-col justify-center items-center" style="height: 5vh">
								<view class="ml40">
									<u-icon name="/static/img/list/ss.svg" size="45rpx"></u-icon>
								</view>
							</view>
						</view>
					</view>
				</view>
			</template>
			<text class="NumOrder ml10">
				<!-- <text>共<text style="color: #01BB74;">{{OrderQuantity}}</text>个订单</text> -->
			</text>

			<view v-for="(item, index) in orderList" :key="item.id" :index="index" :id="`zp-id-${item.id}`" class="OrderCard">
				<view class="width100 pb25 text-left flex-row items-center justify-left">
					<view
						class="flex-col justify-center items-center mr10"
						:style="{ backgroundColor: item.check ? '#01BB74' : '#ffffff' }"
						@click.stop="checkboxGroupChange(item, index)"
						style="border-radius: 100rpx; height: 40rpx; width: 40rpx; border: 2rpx solid #aaaaaa"
					>
						<u-icon name="checkbox-mark" color="#ffffff" size="28rpx"></u-icon>
					</view>
					<view class="flex-col text-left" style="width: 90%" @click.stop="jumpDraftsOrder(item.id)">
						<text
							v-if="pinia_userRole == 'D'"
							:style="{ color: ifZX(item.bossNumberE) ? '#AAAAAA' : '#3D3D3D' }"
							class="ft34 u-line-bt width100"
							style="font-weight: 500"
						>
							{{ item.organizationE == '' && item.bossNumberE == '' ? '(无客户名称)' : item.organizationE || item.bossNumberE }}
							{{ ifZX(item.bossNumberE) ? '(已注销)' : '' }}
						</text>
						<!-- <text v-if="pinia_userRole=='R'" :style="{color:(ifZX(item.bossNumberS)?'#AAAAAA':'#3D3D3D')}"
							class="ft34 u-line-bt width100"
							style="font-weight: 500;">{{item.enterpriseS||item.bossNumberS}}{{ifZX(item.bossNumberS)?"(已注销)":""}}</text> -->
					</view>
				</view>
				<view class="" style="" @click="jumpDraftsOrder(item.id)">
					<text class="ft30 line25 ft-lighgray">
						<text>日期：{{ $u.timeFormat(item.creationTime, 'yyyy-mm-dd') }}</text>
					</text>

					<text class="ft-lighgray mt10 line25 flex-row items-center justify-end">
						<text>订单金额：</text>
						<text style="color: black; font-size: 24rpx">￥</text>
						<text class="ft35" style="color: black; font-weight: 500">{{ item.price.toFixed(2) }}</text>
					</text>

					<text style="width: 100%" class="mt17 ft-lighgray ft25 bg-gray radius pd10" v-if="item.receiptsDescr && item.paymentState != 2" @click.stop="noteMyOrder(item)">
						备注：{{ item.receiptsDescr }}
					</text>
				</view>
			</view>

			<view class="NullView" style="height: 5vh; background-color: transparent"></view>

			<template #bottom>
				<view
					class="flex-row justify-between items-center"
					style="height: 10vh; background-color: #ffffff; box-shadow: 0rpx 4rpx 6rpx 0rpx rgba(51, 51, 51, 0.2); bottom: 0"
				>
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
											<u-icon name="checkbox-mark" color="#ffffff" size="28rpx"></u-icon>
										</view>
										<view class="ml15" style="color: #333333; font-size: 28rpx">全选</view>
									</view>
								</view>
							</view>
							<view
								:disabled="!hasCheck"
								@click="draftsDel"
								class="flex-row justify-center items-center"
								style="width: 280rpx; height: 80rpx; border-radius: 90rpx; opacity: 1; background-color: #01bb74; color: white; float: right; font-weight: 600"
							>
								删除
							</view>
						</view>
					</view>
				</view>
			</template>
		</z-paging>

		<u-loadmore v-show="total > 5" :status="status" marginTop="88" marginBottom="88" :load-text="loadText" />
		<u-popup :show="show_start" mode="top" @close="show_start = false" :safeAreaInsetBottom="false">
			<view class="flex-col pl30 pr30 pb30 justify-between">
				<view>
					<view class="flex-col mt20">
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
								<view @click="$refs.calendars.open()" class="ml14" style="border: 1rpx solid #999999; padding: 6rpx; border-radius: 6rpx">
									{{ date1 || '开始日期' }}
								</view>
							</view>
							<view class="flex-row items-center flex-1">
								<text class="mr10" style="color: #999999">结束日期</text>
								<u-icon name="arrow-down-fill" size="10"></u-icon>
								<view @click="$refs.calendars.open()" class="ml14" style="border: 1rpx solid #999999; padding: 6rpx; border-radius: 6rpx">
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
									{{ pinia_userRole == 'R' ? '收货地址' : '收货地址' }}
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
					<u-button
						color="#F4F4F4"
						type="info"
						@click="filterReset"
						shape="circle"
						size="medium"
						:customStyle="{
							width: '154rpx',
							color: '#999999',
							margin: '0 20rpx 0 0',
							height: '60rpx'
						}"
					>
						重置
					</u-button>
					<u-button color="#01BB74" @click="filterSubmit" shape="circle" size="medium" :customStyle="{ width: '154rpx', margin: 0, height: '60rpx' }">确定</u-button>
				</view>
				<!-- 日历选择器 -->
				<uv-calendars
					color="#01BB74"
					confirmColor="#01BB74"
					mode="range"
					:startDate="getCurrentYearFirstDay()"
					:endDate="getCurrentDate()"
					ref="calendars"
					@confirm="date1Change"
				/>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 选择客户
			searchText: '',
			companyIndex: 0,
			labText: '确认收款',
			reload: false, //判断是否上拉
			total: 0, //数据量
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
			showTage: '0',
			orderList: [],
			orderListCopy: [],
			customer: '',
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
				page: 1,
				pageSize: 10,
				delId: [],
				checkAll: false
			},
			field: '',
			scrollTopCopy: 1156,
			refresh: true,
			uloading: true,
			hide: true,
			onReachBottom: false,
			virtualList: [],
			Title: '条件筛选',
			OperatingSystem: false,
			checked: false,
			DraftsAmount: 0,
			hasCheck: true
		};
	},
	onLoad() {
		this.OperatingSystem = this.getOperatingSystem();
		this.getDraftsAmount();
	},
	onPullDownRefresh() {
		console.log('下拉');
	},
	onShow() {
		if (this.pinia_user.phone != undefined) {
			this.loadData();
			this.Init();
		} else {
			this.$u.toast('登录查看更多');
		}
	},
	onUnload() {},
	onHide() {
		this.ClearIF();
	},
	methods: {
		getDraftsAmount() {
			// amount
			var ifwork = this.pinia_user.data.work == '0';
			if (ifwork) {
				this.realTimeSel.bossNumberS = this.pinia_user.phone;
				this.realTimeSel.staffNumberS = this.pinia_user.phone;
			} else {
				var boss = this.pinia_user.workData.bossNumber;
				this.realTimeSel.bossNumberS = boss;
				this.realTimeSel.staffNumberS = this.pinia_user.phone;
			}
			this.$api.draft.getDraftAmount(this.realTimeSel).then((res) => {
				this.DraftsAmount = res.data.data;
				console.log('===草稿箱总数===>', res);
			});
		},
		jumpDraftsOrder(id) {
			uni.navigateTo({
				url: '/pages/subOrder/draftsOrders/draftsOrders?id=' + id
			});
		},
		draftsDel() {
			var checkTrue = this.orderList.filter((res) => res.check).map((rew) => rew.id);
			if (checkTrue.length <= 0) {
				this.$u.toast('请勾选要删除的草稿');
				return;
			}
			this.realTimeSel.checkAll = this.checked;
			this.realTimeSel.delId = checkTrue;

			this.realTimeSel.bossNumberS = this.pinia_user.data.work != '0' ? this.pinia_user.workData.bossNumber : this.pinia_user.phone;
			this.realTimeSel.staffNumberS = this.pinia_user.phone;

			uni.showModal({
				title: '是否确认删除所选草稿？',
				showCancel: true,
				cancelText: '取消',
				confirmText: '确认',
				success: (res) => {
					if (res.confirm) {
						this.$api.draft.deleteDraftById(this.realTimeSel).then((res) => {
							this.$u.toast('删除成功~');
							this.checked = false;
							this.$refs.paging.reload();
						});

						console.log('删除', this.realTimeSel);
					}
				},
				fail: () => {},
				complete: () => {}
			});
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
				this.$u.toast('您暂无可勾选的草稿~');
			}
		},
		checkboxGroupChange(event, index) {
			console.log(event);
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

			// DraftsAmount
			var check = this.orderList.filter((res) => res.check).length;
			this.checked = check == 0 && this.DraftsAmount ? false : check == this.DraftsAmount;
		},
		jumpVideo() {
			uni.navigateTo({
				url: '/pages/subPack/wxvideo/wxvideo?feedId=3'
			});
		},
		getOperatingSystem() {
			let systemInfo = uni.getSystemInfoSync();
			console.log('systemInfo:', systemInfo);
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
			this.hide = true;
			this.realTimeSel.getPhone = this.pinia_user.phone;

			var ifwork = this.pinia_user.data.work == '0';
			var timeEmp = this.realTimeSel.startDate == '' || this.realTimeSel.endDate == '';
			var ifWorkPort = this.pinia_userRole == 'R';

			if (ifwork) {
				//没有工作
				//console.log("没有工作");
				if (!ifWorkPort) {
					//console.log("没有工作 发货");
					this.realTimeSel.bossNumberE = '';
					this.realTimeSel.bossNumberS = this.pinia_user.phone;
				} else {
					//console.log("没有工作 收货");
					this.realTimeSel.bossNumberS = '';
					this.realTimeSel.bossNumberE = this.pinia_user.phone;
				}
			} else {
				//有工作
				//判断身份
				var identity = this.pinia_user.workData.identity;
				//老板
				var boss = this.pinia_user.workData.bossNumber;
				//console.log("有工作");
				if (!ifWorkPort) {
					//发货端
					//console.log("有工作 发货端");
					this.realTimeSel.staffNumberE = '';
					this.realTimeSel.bossNumberE = '';
					if (identity == '4' || identity == '1') {
						//console.log("有工作 发货端 员工");
						this.realTimeSel.staffNumberS = this.pinia_user.phone;
						this.realTimeSel.bossNumberS = boss;
					} else {
						//console.log("有工作 发货端 其他");
						this.realTimeSel.staffNumberE = '';
						this.realTimeSel.bossNumberE = '';
						this.realTimeSel.bossNumberS = boss;
					}
				} else {
					//console.log("有工作 收货", JSON.parse(JSON.stringify(this.pinia_user.workData)));
					//console.log("有工作 收货" + identity);
					//收货端
					this.realTimeSel.staffNumberS = '';
					this.realTimeSel.bossNumberS = '';
					if (identity == '4') {
						//员工
						//console.log("有工作 收货 员工" + identity);
						this.realTimeSel.staffNumberE = this.pinia_user.phone;
						this.realTimeSel.bossNumberE = boss;
					} else {
						//其他
						//console.log("有工作 收货 其他");
						this.realTimeSel.staffNumberE = '';
						this.realTimeSel.bossNumberS = '';
						this.realTimeSel.bossNumberE = boss;
					}
				}
			}

			if (timeEmp) {
				this.realTimeSel.startDate = this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
				let currentDate = new Date();
				currentDate.setDate(currentDate.getDate() + 15);
				this.realTimeSel.endDate = this.$u.timeFormat(currentDate, 'yyyy-mm-dd');
				this.date1 = this.realTimeSel.startDate;
				this.date2 = this.realTimeSel.endDate;
			}

			let resJson = uni.getStorageSync('companyNameJSON');

			if (resJson != '') {
				var json = JSON.parse(resJson);
				this.searchList.customer = json.company;
				this.customer = json.company;
				if (!ifWorkPort) {
					this.realTimeSel.organizationE = json.company;
				} else {
					this.realTimeSel.enterpriseS = json.company;
				}
				this.$refs.paging.reload();
				uni.removeStorageSync('companyNameJSON');
			}

			this.checked = false;
			// this.$refs.paging.reload();
			// #ifdef MP-WEIXIN
			// this.$refs.paging.refresh();
			this.$refs.paging.reload();
			// #endif
		},
		virtualListChange(vList) {
			console.log('virtualListChange:', vList);
			this.orderList = vList;
		},
		queryList(pageNo, pageSize) {
			if (this.pinia_user.phone != undefined) {
				console.log(pageNo, pageSize);
				this.realTimeSel.page = pageNo;
				this.realTimeSel.pageSize = pageSize;
				// this.checked = false
				this.refreshDataNew();
			} else {
				console.log('请登录');
				this.$refs.paging.complete([]);
			}
		},
		refreshDataNew() {
			this.uloading = true;
			if (this.refresh) {
				this.refresh = false;
				this.onReachBottom = false;
				this.realTimeSel.role = this.pinia_userRole == 'R' ? '1' : '0';
				console.log('this.realTimeSel', this.realTimeSel);
				this.$api.draft
					.getDraftList(this.realTimeSel)
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
					});
			} else {
			}
		},
		loadData() {
			this.$loadUser(this);
		},
		ifZX(val) {
			return val.includes('zx-');
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
		CustomerGetChange() {
			var ifWorkPort = this.pinia_userRole == 'R';
			var changeText = this.customer;
			this.checked = false;
			//console.log(changeText);
			if (!ifWorkPort) {
				this.realTimeSel.organizationE = changeText;
				this.$refs.paging.reload();
			} else {
				this.realTimeSel.enterpriseS = changeText;
				this.$refs.paging.reload();
			}
		},
		getCurrentDate() {
			const date = new Date();
			date.setDate(date.getDate() + 15);
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
			this.$refs.paging.reload();
			this.checked = false;
			// this.refreshDataNew()
		},
		Filtrate(i) {
			//console.log(i);
			this.field = '';

			var filterIndex = this.showTage;
			var ifWorkPort = this.pinia_userRole == 'R';

			this.realTimeSel.kTakeE = '';
			this.realTimeSel.kSiteE = '';
			this.realTimeSel.kPhoneE = '';
			this.realTimeSel.inventoryName = '';

			this.showTage = i;

			this.TitleFun(i);
			this.$refs.paging.reload();
		},
		filtrateGet() {
			this.show_start = true;
		},
		CustomerGet() {
			if (this.pinia_user.phone != undefined) {
				this.hide = false;
				uni.navigateTo({
					url: '/pages/subOrder/table?show=0'
				});
			} else {
				this.$u.toast('登录查看更多');
			}
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
		filterClick() {
			this.filterShow = true;
		},
		date1Change(e) {
			this.date1 = e.range.before;
			this.date2 = e.range.after;
		},
		filterReset() {
			this.date1 = this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');

			let currentDate = new Date();
			currentDate.setDate(currentDate.getDate() + 15);
			this.date2 = this.$u.timeFormat(currentDate, 'yyyy-mm-dd');

			this.showTage = '0';
			this.realTimeSel.startDate = this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
			this.realTimeSel.endDate = this.$u.timeFormat(currentDate, 'yyyy-mm-dd');
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

			this.realTimeSel.kTakeE = '';
			this.realTimeSel.kPhoneE = '';
			this.realTimeSel.kSiteE = '';

			//console.log("重置：", this.realTimeSel);
			this.Title = '条件筛选';
			this.$refs.paging.reload();
		},
		clear() {
			this.$u.setPinia({
				global: {
					tabIndex: 0
				}
			});
			this.realTimeSel.paymentState = '';

			let currentDate = new Date();
			currentDate.setDate(currentDate.getDate() + 15);

			this.date1 = this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
			this.date2 = this.$u.timeFormat(currentDate, 'yyyy-mm-dd');
			this.showTage = '0';
			this.realTimeSel.startDate = this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
			this.realTimeSel.endDate = this.$u.timeFormat(currentDate, 'yyyy-mm-dd');
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
		filterSubmit() {
			this.show_start = false;
			let currentDate = new Date();
			currentDate.setDate(currentDate.getDate() + 15);
			this.realTimeSel.startDate = this.date1 != '' ? this.date1 : this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
			this.realTimeSel.endDate = this.date2 != '' ? this.date2 : this.$u.timeFormat(currentDate, 'yyyy-mm-dd');
			this.$refs.paging.reload();
		}
	}
};
</script>
<style lang="scss" scoped>
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

		.priceCard {
			display: flex;
			flex-direction: column;
			width: 100%;
		}

		.InputCard {
			display: flex;
			flex-direction: column;
			width: 100%;
			// margin-top: 10rpx;
			.InputOne {
				background-color: #f9f9f9;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: left;
				border-radius: 24rpx;
				padding-right: 20rpx;
				&:nth-of-type(2) {
					margin-top: 20rpx;
				}
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
		padding-bottom: 20rpx;
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

			.title {
				display: flex;
				flex-direction: row;
				width: 70%;
			}
		}
	}
}
</style>
<style scoped lang="scss">
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
.tages {
	color: #01bb74;
	background-color: #f2fbf8;
	width: 30%;
	height: 54rpx;
	border-radius: 12rpx;
}
</style>
