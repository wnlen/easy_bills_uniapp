<template>
	<view class="vh100 pb60 flex-col justify-center" :class="showCalendar ? 'body-no-scroll' : ''" style="background-color: #ffffff; overflow-x: hidden">
		<up-navbar
			@leftClick="navBack"
			:placeholder="true"
			title="开送货单"
			:border-bottom="false"
			:titleBold="true"
			title-color="#000000"
			title-size="34"
			bgColor="#ffffff"
		></up-navbar>

		<view class="width100" style="height: 80vh; text-align: center; margin-left: 10vw" v-show="pinia_userRole == 'D' && shareShow == true">
			<up-popup :show="showShare" mode="center" round="15" :safeAreaInsetBottom="false" @close="showShare = false">
				<view style="height: 356rpx; width: 580rpx">
					<view class="flex-col justify-center items-center" style="height: 30%; font-size: 32rpx">提示</view>
					<view class="flex-col justify-center items-center" style="height: 29%; font-size: 36rpx">请选择转发版本</view>
					<view class="u-border-top absolute al" style="bottom: 0; height: 30%; width: 100%">
						<view class="u-border-right item flex-col justify-center items-center" style="height: 100%">
							<button
								class="fx"
								size="medium"
								open-type="share"
								:data-id="transmitList[0].id"
								:data-thumb="transmitList[0].picturesId"
								shape="circle"
								:data-versions="'Y'"
							>
								有金额转发
							</button>
						</view>
						<view class="item flex-col justify-center items-center" style="height: 100%">
							<button
								class="fx"
								size="medium"
								open-type="share"
								:data-id="transmitList[0].id"
								:data-thumb="transmitList[0].picturesId"
								shape="circle"
								:data-versions="'N'"
							>
								无金额转发
							</button>
						</view>
					</view>
				</view>
			</up-popup>

			<view class="mt45 flex-col justify-center" style="width: 80vw; text-align: center; align-items: center; height: 50vh">
				<view>
					<up-image style="" width="414rpx" height="280rpx" src="https://res-oss.elist.com.cn/wxImg/order/fscg.png"></up-image>
				</view>
				<view class="text-center mt40" style="color: #01bb74; font-size: 34rpx; font-weight: bold; width: 100%">发送成功!</view>
				<view class="text-center mt20" style="color: #aaaaaa; font-size: 28rpx; font-weight: normal; width: 300rpx; line-height: 40rpx">
					客户登录易单据即可线上签署送货单
				</view>
				<view class="flex-row justify-center items-center mt90">
					<button
						style="
							background-color: #ffffff;
							width: 271.24rpx;
							height: 79.98rpx;
							line-height: 79.98rpx;
							border-radius: 338.4rpx;
							color: #262626;
							border: 2rpx solid #01bb74;
							font-size: 30rpx;
						"
						class="mr10 flex-row items-center justify-center"
						size="medium"
						open-type="share"
						:data-id="transmitList[0].id"
						:data-thumb="transmitList[0].picturesId"
						shape="circle"
						:data-versions="'Y'"
					>
						<view class="pr15"><up-icon labelColor="#01BB74" label="微信分享签单" labelPos="right" name="weixin-fill" color="#01BB74" size="30rpx"></up-icon></view>
					</button>
					<button
						style="background-color: #01bb74; width: 271.24rpx; height: 79.98rpx; border-radius: 338.4rpx; color: #ffffff; font-size: 30rpx"
						class="ml15 flex-row items-center justify-center"
						@click="ContinueBilling"
					>
						返回草稿箱
					</button>
				</view>
			</view>
		</view>

		<view v-if="!identity" class="flex-row justify-center items-center absolute" style="width: 100%; top: 30%">
			<up-image src="https://res-oss.elist.com.cn/wxImg/order/cw.svg" width="600rpx" height="400rpx"></up-image>
			<view class="absolute" style="bottom: -80rpx; color: #aaaaaa; font-size: 28rpx">无开单权限~</view>
		</view>

		<view class="hand relative" style="background-color: #01bb74; width: 100vw; height: 120rpx" v-if="pinia_userRole == 'D' && shareShow == false && identity">
			<view
				class="pd20 syst absolute"
				style="
					width: 100vw;
					background-color: transparent;
					height: 10vh;
					color: #ffffff;
					font-size: 40rpx;
					font-weight: bold;
					display: flex;
					flex-direction: row;
					justify-content: center;
					top: 2rpx;
				"
			>
				{{
					pinia_user.data.work == '0'
						? pinia_user.ac != null
							? pinia_user.ac.enterpriseName || pinia_user.ac.phone
							: pinia_user.phone
						: pinia_user.ac != null
						? pinia_user.ac.enterpriseName || pinia_user.workData.bossNumber
						: pinia_user.workData.bossNumber
				}}发货单
			</view>
		</view>

		<view class="form-wrap pt20 absolute" style="background-color: #ffffff" v-if="pinia_userRole == 'D' && shareShow == false && identity">
			<view class="form-inner flex-col" style="font-size: 28rpx; background-color: #ffffff">
				<view class="flex-col justify-left">
					<up-image v-if="pinia_user.eorderLogo" :src="pinia_user.eorderLogo" width="152" height="60" mode="aspectFill" />
					<view class="ft-bold pt10 handcolor relative">发货单信息</view>
					<view class="flex-row items-end pt20 pb20 u-border-bottom">
						<text class="textcolor">订单编号:</text>
						<text class="ft-red ml15" style="color: #fa5151; font-family: ddbh">
							{{ receipts.orderNumber || '' }}
						</text>
					</view>
					<view class="flex-row items-center width100 u-border-bottom">
						<text class="pt20 pb20 pr12 textcolor">
							<text style="color: #fa3534">*</text>
							客户手机号:
						</text>
						<input
							placeholder-class="placeholder_class"
							type="number"
							v-model="khPhone"
							:style="{ color: ifInput(khPhone), width: '360rpx' }"
							placeholder="请输入客户手机号"
							class="u-line-1 ml15 endcolor"
							@input="searchIFNumber"
							@blur="searchIFNumberBlur"
							:focus="PhoneFocus"
							@focus="searchIFNumberFocus"
						/>
						<!-- <uv-input
							placeholderStyle="color: #d8d8d8;fontSize:28rpx"
							@change="searchIFNumber"
							@blur="searchIFNumberBlur"
							:focus="PhoneFocus"
							@focus="searchIFNumberFocus"
							type="number"
							v-model="khPhone"
							placeholder="请输入客户手机号"
							border="none"
							class="flex-1 endcolor"
							fontSize="28rpx"
						></uv-input> -->
						<view class="flex-1 flex-row justify-end">
							<up-button shape="circle" size="mini" color="#01BB74" :customStyle="{ width: '120rpx', margin: '0' }" @click="jumpTable">选择客户</up-button>
						</view>
					</view>
					<view class="flex-row items-center width100 pt20 pb20 u-border-bottom">
						<text class="textcolor">收货方:</text>
						<input
							disabled
							placeholder-class="placeholder_class"
							type="text"
							v-model="staffNumberEName"
							:style="{ color: ifInput(staffNumberEName) }"
							maxlength="20"
							placeholder="请选择收货方"
							class="u-line-1 ml15 endcolor"
						/>
					</view>
					<view class="flex-row items-center width100 pt20 pb20 u-border-bottom">
						<text class="textcolor">
							<text style="color: #fa3534">*</text>
							发货日期:
						</text>
						<input
							placeholder-class="placeholder_class"
							@click="
								$refs.calendars.open();
								showCalendar = true;
							"
							:style="{ color: ifInput(receipts.creationTime) ? '#333333' : '#D8D8D8' }"
							type="text"
							v-model="receipts.creationTime"
							disabled
							placeholder="发货日期"
							class="flex-1 ml15 endcolor"
						/>
						<view
							class="flex-row"
							@click="
								$refs.calendars.open();
								showCalendar = true;
							"
						>
							<view class="mr20">
								<up-line class="" color="#D8D8D8" length="50rpx" direction="col"></up-line>
							</view>
							<up-icon size="45rpx" name="https://res-oss.elist.com.cn/wxImg/order/time.png"></up-icon>
						</view>
						<uv-calendars
							color="#01BB74"
							confirmColor="#01BB74"
							ref="calendars"
							@close="showCalendar = false"
							@confirm="getConfirm"
							:startDate="getCurrentDateMin()"
							:endDate="getCurrentDate()"
						/>
					</view>
					<view class="flex-row items-center width100 pt20 pb20 u-border-bottom">
						<text class="textcolor">收货人:</text>
						<input
							placeholder-class="placeholder_class"
							type="text"
							v-model="receipts.kTakeE"
							:style="{ color: ifInput(receipts.kTakeE) }"
							maxlength="10"
							placeholder="请输入收货人姓名"
							class="u-line-1 ml15 endcolor"
						/>
					</view>

					<view class="flex-row items-center width100 pr20 pt20 pb20 u-border-bottom">
						<text class="textcolor">联系电话:</text>
						<input
							placeholder-class="placeholder_class"
							type="number"
							v-model="receipts.kPhoneE"
							:style="{ color: ifInput(receipts.kPhoneE) ? '#333333' : '#D8D8D8' }"
							placeholder="请输入联系电话"
							class="ml15 flex-1 u-line-1 endcolor"
						/>
					</view>

					<view class="flex-row items-center justify-between pt20 pb20 u-border-bottom">
						<view class="flex-row items-center width100">
							<text class="textcolor">收货地址:</text>
							<input
								placeholder-class="placeholder_class"
								type="text"
								maxlength="100"
								:style="{ color: ifInput(receipts.kSiteE) ? '#333333' : '#D8D8D8' }"
								v-model="receipts.kSiteE"
								placeholder="请输入收货地址"
								class="ml15 flex-1 u-line-1 endcolor"
							/>
						</view>
					</view>
					<view class="flex-row justify-between items-center mt20">
						<text class="line34 ft-bold handcolor pt24">发货清单</text>
						<!-- 			<text class="line34 handcolorClear pt24" @click="ClearOrderItemList">
							一键清空
						</text> -->
					</view>
				</view>
			</view>

			<scroll-view enhanced :show-scrollbar="false" scroll-y="true" style="background-color: #f4f4f4; max-height: 670rpx; margin-top: 12rpx">
				<view
					style="width: 100%; background-color: #ffffff"
					v-for="(item, index) in orderItemList"
					:key="index"
					:class="index == 0 ? '' : 'mt12'"
					@click="merchandiseInventory(false)"
				>
					<view class="flex-row pt24 pb24" style="width: 100%">
						<view style="width: 10%" class="ml20">品名:</view>
						<view style="color: #666666" class="up-line-1 flex-1">{{ item.description }}</view>
						<view style="width: 10%" class="ml20">规格:</view>
						<view style="color: #666666" class="up-line-1 flex-1">{{ item.specification }}</view>
					</view>
					<view class="flex-row items-center justify-center" style="width: 100%">
						<up-line class="u-line ml24 mr24" color="#F4F4F4" length="100%"></up-line>
					</view>
					<up-table border-color="#ffffff">
						<up-tr>
							<up-td>数量</up-td>
							<up-td>单位</up-td>
							<up-td>单价</up-td>
							<up-td>金额</up-td>
						</up-tr>
						<up-tr>
							<up-td>{{ item.quantity }}</up-td>
							<up-td>{{ item.unit }}</up-td>
							<up-td>{{ item.unitPrice }}</up-td>
							<up-td>
								<text style="width: 200rpx" class="up-line-1">
									￥{{ item.quantity != '-' && item.quantity != '' ? formatAmount(item.unitPrice * item.quantity) : 0 }}
								</text>
							</up-td>
						</up-tr>
					</up-table>
				</view>
			</scroll-view>

			<view class="pt12 mt12" style="background-color: #ffffff">
				<view class="relative pt12 pb12">
					<text class="pl20 textcolor">合计</text>
					<text class="absolute textcolor" style="right: 24rpx; color: #01bb74">￥{{ formatAmount(orderTotal) }}</text>
				</view>
				<view class="relative pt12 pb12">
					<text class="pl20 textcolor">金额大写</text>
					<text class="absolute textcolor" style="right: 24rpx; color: #666666">{{ digitUppercase(orderTotal) }}</text>
				</view>
				<view class="pd12">
					<up-line color="#E0E0E0"></up-line>
				</view>
				<view class="pd12 flex-row justify-center" style="width: 100%">
					<view class="flex-row justify-center items-center" style="width: 49%">
						<up-icon labelPos="bottom" @click="merchandiseInventory(true)" name="https://res-oss.elist.com.cn/wxImg/order/bj.svg" size="70rpx" label="修改"></up-icon>
					</view>
					<view class="flex-row justify-center items-center" style="width: 2%">
						<up-line direction="col" length="50" color="#E0E0E0" />
					</view>
					<view class="flex-row justify-center items-center" style="width: 49%">
						<up-icon
							labelPos="bottom"
							@click="merchandiseInventory(false)"
							name="https://res-oss.elist.com.cn/wxImg/order/spk.svg"
							size="70rpx"
							label="添加商品"
						></up-icon>
					</view>
				</view>
			</view>

			<view class="form-inner-card flex-col" style="font-size: 28rpx; background-color: #ffffff">
				<view v-if="recentlyData" class="flex-row justify-between items-center mt45 ft-bold">
					<text class="line34 handcolor">相关图片/票据</text>
				</view>

				<view class="mt40" style="width: 95%">
					<up-upload
						autoUpload
						@delete="onRemoveImg"
						:autoUploadApi="action"
						autoUploadDriver="local"
						v-model:fileList="imgList"
						:maxCount="3"
						multiple
						:showPreviewImage="true"
						:previewFullImage="true"
						:deletable="true"
						:showRetry="false"
						width="200rpx"
						height="200rpx"
					>
						<up-icon :name="ImgUrl + '/wxImg/order/down.png'" size="200rpx"></up-icon>
					</up-upload>
				</view>

				<view class="flex-col mt45" style="width: 95%">
					<text class="handcolor line34" style="font-weight: bold">备注</text>
					<view class="mt40" style="border-radius: 6rpx; box-sizing: border-box; border: 1rpx solid rgba(216, 216, 216, 0.5)">
						<input
							v-model="receipts.signatureDescr"
							type="text"
							class="line24 height80 table-input ml30 endcolor"
							placeholder="请填写备注内容"
							placeholder-class="placeholder_class"
							maxlength="38"
							:style="{ color: ifColor(receipts.signatureDescr) ? '#666666' : '#D8D8D8' }"
						/>
					</view>
				</view>

				<view class="flex-col justify-between pb10 mt45">
					<text class="line34 ft-bold handcolor">供应商信息</text>
					<view class="form-bottom ft-gray">
						<view class="flex-col justify-between ft24 pt20 pb10 mr24">
							<view class="flex-row items-center width100 pt20 pb20">
								<text class="textcolor">企业名称:</text>
								<text :style="{ color: '#333333' }" class="ml15 endcolor" v-if="pinia_user.data.work == '0'">
									{{ pinia_user.ac?.enterpriseName || pinia_user.phone }}
								</text>
								<text :style="{ color: '#333333' }" class="ml15 endcolor" v-else>
									{{ pinia_user.ac?.enterpriseName || pinia_user.workData.bossNumber }}
								</text>
							</view>
							<view class="flex-row items-center width100 pt20 pb20">
								<text class="textcolor">联系人:</text>
								<text :style="{ color: '#333333' }" class="ml15 endcolor">{{ pinia_user.data.name || pinia_user.phone || pinia_user.data.phone }}</text>
							</view>
							<view class="flex-row items-center width100 pt20 pb20">
								<text class="textcolor">联系电话:</text>
								<text class="ml15 endcolor" :style="{ color: '#333333' }" @click="callPhone(pinia_user.phoneNumber)">
									{{ pinia_user.phone || pinia_user.data.phone }}
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="mt60 pl20 pr20 pb30 flex-row">
				<view class="" style="width: 60%; padding: 12rpx">
					<up-button type="primary" class="form-btn-big" hover-class="none" color="#01BB74" @click="sendOrder" shape="circle">发送订单</up-button>
				</view>
				<view class="" style="width: 40%; padding: 12rpx">
					<up-button plain hover-class="none" :customStyle="{ border: '2rpx solid #01BB74', color: '#01BB74' }" @click="draftOrder" shape="circle">存草稿</up-button>
				</view>
			</view>
		</view>

		<pop-auth ref="popAuth"></pop-auth>
		<!-- 认证提醒 -->

		<up-overlay :show="showOrderPly" @click="showOrderPly = false" :mask-click-able="false">
			<pop-order ref="popOrder" :item="order"></pop-order>
		</up-overlay>
	</view>
</template>

<script>
export default {
	data() {
		return {
			order: {},
			showOrderPly: false,
			scrollTop: 0,
			removeList: [],
			transmitList: [
				{
					id: null
				},
				{
					id: null
				}
			],
			transmit: 'https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/edo/order/ED2402292259345200/ED2402292259345200.jpg',
			receipts: {
				bossNumberS: '',
				staffNumberS: '',
				jobNumberS: '',
				bossNumberE: '',
				staffNumberE: '',
				jobNumberE: '',
				orderNumber: '',
				organizationE: '',
				takeE: '',
				phoneE: '',
				siteE: '',
				kTakeE: '',
				kPhoneE: '',
				kSiteE: '',
				inventoryList: [],
				price: '',
				majuscule: '',
				picturesId: '',
				enterpriseS: '',
				contactsS: '',
				phoneS: '',
				creationTime: '',
				signatureImg: '',
				signatureTime: '',
				video: '',
				paymentType: '',
				paymentState: '',
				paymentTime: '',
				state: '',
				role: '',
				type: '3',
				enterpriseJc: '',
				enterpriseDz: '',
				signatureDescr: '',
				organizationEJc: '',
				preview1: 0,
				imgList: []
			},
			imgList: [],
			show: false,
			showShare: false,
			title: '创建电子发货单',
			background: {
				'background-image': 'linear-gradient(45deg, #fff, #fff)'
			},
			customStyle: {
				width: '300rpx',
				boder: 'none'
			},
			color: {
				color: '#7277d8'
			},
			// 选择客户
			index: 0,
			customerList: [],
			//
			orderTotal: 0, //订单总额
			orderItemList: [], //选择产品后的表格回显数
			selectShow: false,
			selectList: [],
			productList: [],
			shareImage: '', //创建订单后接口返回
			orderId: '', //创建订单后接口返回
			shareShow: false,
			recentlyData: [], //近期下单商品
			action: '',
			fileList: [],
			companyName: '请选择',
			searchCopy: '',
			searchDomain: '',
			verify: {
				1: '品名',
				2: '规格',
				3: '单位',
				4: '数量',
				5: '单价'
			},
			identity: true,
			openOrder: false,
			staffNumberEName: '',
			limitingCondition: true,
			PhoneFocus: false,
			uNoticeBarlist: ['当年创建的订单请在12月31日前完成收款，逾期将无法处理~'],
			SearchCustomStyleWechat: {
				width: '300rpx',
				height: '90rpx',
				padding: '24rpx',
				fontSize: '24rpx',
				color: '#01BB74'
			},
			newImg: [],
			khPhone: '',
			showCalendar: false
		};
	},
	onShow() {
		// #ifdef MP-WEIXIN
		this.$refs.popAuth.authShow = false;
		this.$refs.popOrder.authShow = false;
		this.showShare = false;
		// #endif

		// this.loadDataRenew();
		this.loadData();

		this.defImg();
		// #ifdef MP-WEIXIN
		this.addOrderIfOk();
		// #endif

		if (uni.getStorageSync('inventoryStockpile') != undefined && uni.getStorageSync('inventoryStockpile') != null && uni.getStorageSync('inventoryStockpile') != '') {
			this.orderItemList = uni.getStorageSync('inventoryStockpile');
			console.log('inventoryStockpile', uni.getStorageSync('inventoryStockpile'));
			this.orderTotal = 0;
			this.orderItemList.forEach((res) => {
				this.orderTotal = this.orderTotal + res.quantity * res.unitPrice;
			});
		}
	},
	onLoad(options) {
		// this.addEmp();
		//获取草稿箱信息
		var id = options.id;
		this.getOrderParticular(id);
	},
	onUnload() {
		uni.removeStorageSync('inventoryStockpile');
	},
	methods: {
		deleteimg(res) {
			this.removeList.push(res.file);
			this.imgList.splice(res.index, 1);
		},
		afterRead(res) {
			// this.loadList.push(res.file[0]);
			console.log('2222222222222222', res);
			const res1 = res.file[0];
			const dx = {
				url: res1.url,
				id: res1.id,
				size: res1.size,
				billId: res1.billId
			};
			this.imgList.push(dx);
		},
		authenticationSynchronization(receipts) {
			var receiptsVer = {
				bossNumberS: receipts.bossNumberS,
				staffNumberS: receipts.staffNumberS,
				bossNumberE: receipts.bossNumberE,
				staffNumberE: receipts.staffNumberE
			};
			console.log('===authenticationSynchronization===>');
			uni.$api.order
				.authenticateOrder(receiptsVer)
				.then((res) => {
					const reIf = res.data.data;
					if (reIf === 1) {
						console.log('===authenticationSynchronization===>', '验证成功~');
						this.searchIFNumberBegin({
							target: {
								value: this.receipts.staffNumberE
							}
						});
					} else {
						if (reIf === 2) {
							// this.$u.toast("开单方人员信息发送变更~");
							this.receipts.staffNumberS = this.pinia_user.phone;
							// this.clear()
						} else {
							this.clear();
							this.$u.toast('收单方人员信息发生变更~');
						}
					}
				})
				.catch((error) => {
					console.error('请求出错:', error);
				});
		},
		ClearOrderItemList() {
			this.orderItemList = [];
			this.addEmp();
			this.orderTotal = 0;
			uni.removeStorageSync('inventoryStockpile');
		},
		onRemoveImg(res) {
			this.removeList.push(res.file);
			const removeList = this.imgList.splice(res.index, 1);
			if (removeList[0].id) {
				this.newImg.push(removeList[0]);
			}
		},
		getOrderParticular(id) {
			console.log('草稿箱ID====>', id);
			uni.$api.draft
				.getDraftById({
					id: id
				})
				.then((res) => {
					var order = res.data.data;
					this.receipts = order.post;
					this.receipts.creationTime = this.$u.timeFormat(this.receipts.creationTime, 'yyyy-mm-dd');
					this.receipts.inventoryList = order.orderItemList;
					this.orderItemList = order.orderItemList;
					this.imgList = order.imgList;
					if (this.imgList.length) {
						this.imgList.forEach((el) => {
							el.status = 'success'; //上传成功图标
							el.type = 'image'; //预览必须要保留type为image才能预览
						});
					}
					// this.getOrderNumber();
					this.orderItemList.forEach((res) => {
						this.orderTotal = this.orderTotal + res.quantity * res.unitPrice;
					});

					this.staffNumberEName = this.receipts.bossNumberE;
					this.fileList = order.imgList;

					var dx = {
						user: {
							phoneNumber: this.receipts.bossNumberE,
							name: this.receipts.takeE ? this.receipts.takeE : null
						},
						verification: {
							enterpriseName: this.receipts.organizationE
						}
					};

					console.log('companyNameJSON', dx);

					this.searchDomain = dx;
					this.khPhone = this.receipts.organizationE != '' ? this.receipts.organizationE : this.receipts.bossNumberE;
					this.staffNumberEName = this.receipts.takeE ? this.receipts.takeE : this.receipts.bossNumberE;

					console.log('===草稿箱===>', this.receipts);
					uni.setStorageSync('inventoryStockpile', this.orderItemList);

					if (this.receipts.inventoryList.length <= 0) {
						this.addEmp();
					}
					if (this.khPhone) {
						this.searchIFNumberBlur();
					}
					this.authenticationSynchronization(this.receipts);
				});
		},
		jumDrafts() {
			console.log('跳转');
			uni.navigateTo({
				url: 'drafts'
			});
		},
		jumpVideo() {
			uni.navigateTo({
				url: '/pages/subPack/wxvideo/wxvideo?feedId=0'
			});
		},
		modification() {
			console.log('modification');
			uni.navigateTo({
				url: 'modification'
			});
		},
		merchandiseInventory(type) {
			console.log('merchandiseInventory', type);
			console.log('价格', this.orderTotal);

			if (type) {
				if (this.orderTotal > 0) {
					uni.navigateTo({
						url: '/pages/subOrder/merchandiseInventory?type=' + (type ? 1 : 0)
					});
				} else {
					this.$u.toast('请到商品库选择商品~');
				}
			} else {
				uni.navigateTo({
					url: '/pages/subOrder/merchandiseInventory?type=' + (type ? 1 : 0)
				});
			}
		},
		addOrderIfOk() {
			var startDate = new Date(this.pinia_user.data.registrationDate);
			var endDate = new Date();

			const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth();

			var okIf = monthsDiff >= 6;

			if (okIf) {
				//判断权限是否生效
				var user = this.pinia_user.data.vProductEffects;
				var ifAdd = user.O1 == '1' && user.O2 == '1';

				if (ifAdd) {
					//判断是否有该权限 是否过期
					var O2 = this.pinia_user.jurisdiction.O2;
					if (O2 == '' || O2 == undefined) {
						var O1 = this.pinia_user.jurisdiction.O1;
						if (O1 == '' || O1 == undefined) {
							//获取开单价格
							//判断是否工作
							var work = this.pinia_user.data.work == '0';
							if (work) {
								this.getProductAll();
							} else {
								uni.reLaunch({
									url: '/pages/subOrder/forbid/forbid'
								});
							}
						} else {
							this.authentication();
						}
					} else {
						this.authentication();
					}
				} else {
					this.authentication();
				}
			} else {
				this.authentication();
			}
		},
		getProductAll() {
			uni.$api.product
				.getAllProducts({
					phone: this.pinia_user.phone
				})
				.then((res) => {
					// console.log("开单价格",res.data.data);
					this.order = res.data.data;
					this.$refs.popOrder.orderInit(this.order[1], 1);
					this.$refs.popOrder.authShow = true;
					this.showOrderPly = true;
				});
		},
		defImg() {
			this.action = uni.$http.config.baseURL + 'order/imgA';
			if (this.receipts.creationTime == '') {
				this.receipts.creationTime = this.$u.timeFormat(new Date(), 'yyyy-mm-dd');
			}
		},
		authentication() {
			console.log('---安全认证---');
			if (this.$refs.popOrder.authShow) {
				return;
			} else {
				console.log('安全认证');
				if (this.pinia_user.workData.id != null && this.pinia_user.workData.id != '') {
					this.identity = this.pinia_user.workData.identity != '3';
				} else {
					var auth = uni.getStorageSync('auth');
					console.log('安全认证');
					if (auth != undefined && auth == '0') {
						console.log('安全认证');
						var ac = this.pinia_user.ac;
						if (ac == null || ac == '' || ac == undefined) {
							this.$refs.popAuth.authShow = true;
						}
					}
				}
			}
		},
		ifInput(val) {
			// console.log("输入框", val);
			if (val === '') {
				// console.log("输入框 满足", val);
				return '#D8D8D8';
			} else {
				// console.log("输入框 不满足", val);
				return '#333333';
			}
		},
		ifColor(val) {
			if (val != '请输入' && val != '0.00' && val != '') {
				// console.log("满足", val);
				return true;
			} else {
				// console.log("不满足", val);
				return false;
			}
		},
		getCurrentDateMin() {
			const date = new Date();
			const year = date.getFullYear();
			return `${year}-01-01`;
		},
		jumpTable() {
			this.receipts.phoneE = '';
			this.goPath('/pages/subOrder/table');
		},
		onShareAppMessage(ops) {
			if (ops.from === 'button') {
				console.log('分享：', ops);
				var pid = ops.target.dataset.id;
				var pThumb = ops.target.dataset.thumb;
				var phone = this.pinia_user.phone;
				var port = this.pinia_userRole;
				var versions = ops.target.dataset.versions;
				console.log(pThumb);
				return {
					// title: `这是您的${versions=="Y"?"有金额":"无金额"}货单，请打开易单据查看详情~`,
					title: `您有一张订单待确认~`,
					path: '/pages/subOrder/detailsShare?share_id=' + pid + '&&type=1' + '&&phone=' + phone + '&&port=' + port + '&&versions=' + versions,
					imageUrl: pThumb
				};
			} else {
				return {
					title: '打开易单据小程序，极速管理您的货单~',
					path: '/pages/index/index',
					imageUrl: '/static/share.png'
				};
			}
		},
		addEmp() {
			var ifwork = this.pinia_user.data.work == '0';
			var dx = {
				id: '',
				orderId: '',
				phone: ifwork ? this.pinia_user.phone : this.pinia_user.workData.bossNumber,
				staffNumber: this.pinia_user.phone,
				description: '-',
				specification: '-',
				unit: '-',
				quantity: '-',
				unitPrice: '-',
				color: {
					description: 'transparent',
					specification: 'transparent',
					unit: 'transparent',
					quantity: 'transparent',
					unitPrice: 'transparent'
				}
			};

			for (var i = 0; i < 1; i++) {
				this.orderItemList.push(dx);
			}
		},
		isAllNumbers(str) {
			return /^\d+$/.test(str);
		},
		InitSearch(e) {
			if (e.target.value == '' || e.target.value == null) {
				console.log('===未输入手机号码===>');
				return false;
			} else {
				this.khPhone = e.target.value.replace(/\s+/g, '');
			}

			this.receipts.organizationE = this.receipts.organizationE.replace(/\s+/g, '');
			var ifphone = this.isAllNumbers(e.target.value.replace(/\s+/g, ''));
			var phone = e.target.value.replace(/\s+/g, '');

			if (ifphone && phone.length == 11) {
				console.log('===标准专属手机号码===>', phone);
				return true;
			} else {
				this.searchCopy = '';
				this.receipts.bossNumberE = '';
				this.receipts.staffNumberE = '';
				this.receipts.organizationE = '';
				this.receipts.takeE = '';
				this.searchDomain = '';
				this.staffNumberEName = '';
			}
			return false;
		},
		searchIFNumber(e) {
			console.log(e);
			const ifok = this.InitSearch(e);
			console.log('===验证ifok===>', ifok);
			if (ifok) {
				console.log('===验证通过===>');
				var ifwork = this.pinia_user.data.work == '0';
				var boss = '';
				if (ifwork) {
					boss = this.pinia_user.phone;
				} else {
					boss = this.pinia_user.workData.bossNumber;
				}

				var phone = e.target.value.replace(/\s+/g, '');
				this.searchCopy = phone;
				var port = this.pinia_userRole;

				uni.$api.user
					.searchUserAddOrder({
						phone: phone,
						state: 1,
						boss: boss,
						port: port
					})
					.then((res) => {
						console.log('===edo/user/searchAddOrder==>', res);
						var data = res.data.data;
						var cRelation = data.cRelation;
						var remark = data.remark;
						var user = data.user;
						var verification = data.verification;

						console.log('===data==>', data);
						console.log('===cRelation==>', cRelation);
						console.log('===remark==>', remark);
						console.log('===user==>', user);
						console.log('===verification==>', verification);
						var userIfOk = user.id;
						this.searchDomain = data;
						if (userIfOk) {
							console.debug('已注册用户');

							if (user.name) {
								this.receipts.takeE = user.name;
								this.staffNumberEName = user.name;
							}

							if (verification != null && verification != undefined) {
								this.receipts.organizationE = verification.enterpriseName;
							} else {
								this.receipts.takeE = phone;
								if (this.searchDomain.remark) {
									console.log('===searchDomain.remark===>', this.searchDomain.remark);
									this.receipts.organizationE = this.searchDomain.remark;
								} else {
									this.receipts.organizationE = phone;
								}
							}

							if (cRelation != undefined && cRelation != null) {
								this.receipts.bossNumberE = user.work != '0' ? cRelation.bossNumber : user.phoneNumber;
								this.receipts.staffNumberE = user.work != '0' ? cRelation.staffNumber : user.phoneNumber;

								if (cRelation.identity == '3') {
									this.$u.toast('财务不支持开单~');
									this.clear();
									return;
								}

								if (ifwork) {
									if (cRelation.bossNumber == this.pinia_user.phone) {
										this.$u.toast('请勿给自己开单~');
										this.clear();
										return;
									}
								} else {
									if (cRelation.bossNumber == this.pinia_user.workData.bossNumber) {
										this.$u.toast('请勿给同一组织开单~');
										this.clear();
										return;
									}
								}
							} else {
								this.receipts.bossNumberE = phone;
								this.receipts.staffNumberE = phone;
							}

							this.staffNumberEName = user.name;

							var a = this.pinia_user.phone === phone;

							if (a) {
								this.$u.toast('此人员不支持开单~');
								this.clear();
								return;
							}

							if (!ifwork) {
								if (phone == this.pinia_user.workData.bossNumber) {
									this.$u.toast('此人员不支持开单~');
									this.clear();
								}
							}
						} else {
							console.debug('未注册用户');
							this.staffNumberEName = user.phoneNumber;
							this.receipts.phoneE = phone;
							// this.staffNumberEName = phone
							this.receipts.organizationE = this.searchCopy;
							this.receipts.takeE = this.searchCopy;
							this.receipts.bossNumberE = this.searchCopy;
							this.receipts.staffNumberE = this.searchCopy;
							// this.searchDomain = {}
							console.log('===未注册用户===>', this.searchDomain);

							// if (this.searchDomain.remark) {
							// 	console.log("===searchDomain.remark===>", this.searchDomain.remark);
							// 	this.receipts.organizationE = this.searchDomain.remark
							// 	this.khPhone = this.searchDomain.remark
							// } else {
							// 	this.receipts.organizationE = phone
							// }
						}
					});
			} else {
				console.log('===验证不通过===>');
				if (this.searchCopy != '') {
					this.receipts.organizationE = this.searchCopy;
					this.searchDomain = {};
				} else {
					console.log('没有搜索记录');
				}
			}
		},
		searchIFNumberBegin(e) {
			console.log(e);
			const ifok = this.InitSearch(e);
			console.log('===验证ifok===>', ifok);
			if (ifok) {
				console.log('===验证通过===>');
				var ifwork = this.pinia_user.data.work == '0';
				var boss = '';
				if (ifwork) {
					boss = this.pinia_user.phone;
				} else {
					boss = this.pinia_user.workData.bossNumber;
				}

				var phone = e.target.value.replace(/\s+/g, '');
				this.searchCopy = phone;
				var port = this.pinia_userRole;

				uni.$api.user
					.searchUserAddOrder({
						phone: phone,
						state: 1,
						boss: boss,
						port: port
					})
					.then((res) => {
						console.log('===edo/user/searchAddOrder==>', res);
						var data = res.data.data;
						var cRelation = data.cRelation;
						var remark = data.remark;
						var user = data.user;
						var verification = data.verification;

						console.log('===data==>', data);
						console.log('===cRelation==>', cRelation);
						console.log('===remark==>', remark);
						console.log('===user==>', user);
						console.log('===verification==>', verification);
						var userIfOk = user.id;
						this.searchDomain = data;
						if (userIfOk) {
							console.debug('已注册用户');

							if (user.name) {
								this.receipts.takeE = user.name;
								this.staffNumberEName = user.name;
							}

							if (verification != null && verification != undefined) {
								this.receipts.organizationE = verification.enterpriseName;
								this.khPhone = verification.enterpriseName;
							} else {
								this.receipts.takeE = phone;

								if (this.receipts.organizationE != null || this.receipts.organizationE != '') {
									this.receipts.organizationE = '';
									this.khPhone = '';
									if (this.searchDomain.remark) {
										this.receipts.organizationE = this.searchDomain.remark;
										this.khPhone = this.searchDomain.remark;
									}
								}
								if (this.searchDomain.remark) {
									console.log('===searchDomain.remark===>', this.searchDomain.remark);
									this.receipts.organizationE = this.searchDomain.remark;
								} else {
									this.receipts.organizationE = phone;
								}
							}

							if (cRelation != undefined && cRelation != null) {
								this.receipts.bossNumberE = user.work != '0' ? cRelation.bossNumber : user.phoneNumber;
								this.receipts.staffNumberE = user.work != '0' ? cRelation.staffNumber : user.phoneNumber;

								if (cRelation.identity == '3') {
									this.$u.toast('财务不支持开单~');
									this.clear();
									return;
								}

								if (ifwork) {
									if (cRelation.bossNumber == this.pinia_user.phone) {
										this.$u.toast('请勿给自己开单~');
										this.clear();
										return;
									}
								} else {
									if (cRelation.bossNumber == this.pinia_user.workData.bossNumber) {
										this.$u.toast('请勿给同一组织开单~');
										this.clear();
										return;
									}
								}
							} else {
								this.receipts.bossNumberE = phone;
								this.receipts.staffNumberE = phone;
							}

							this.staffNumberEName = user.name;

							var a = this.pinia_user.phone === phone;

							if (a) {
								this.$u.toast('此人员不支持开单~');
								this.clear();
								return;
							}

							if (!ifwork) {
								if (phone == this.pinia_user.workData.bossNumber) {
									this.$u.toast('此人员不支持开单~');
									this.clear();
								}
							}
						} else {
							console.debug('未注册用户');
							this.staffNumberEName = user.phoneNumber;
							this.receipts.phoneE = phone;
							// this.staffNumberEName = phone
							this.receipts.organizationE = this.searchCopy;
							this.receipts.takeE = this.searchCopy;
							this.receipts.bossNumberE = this.searchCopy;
							this.receipts.staffNumberE = this.searchCopy;
							// this.searchDomain = {}
							console.log('===未注册用户===>', this.searchDomain);

							if (this.searchDomain.remark) {
								console.log('===searchDomain.remark===>', this.searchDomain.remark);
								this.receipts.organizationE = this.searchDomain.remark;
								this.khPhone = this.searchDomain.remark;
							} else {
								this.receipts.organizationE = phone;
							}
						}
					});
			} else {
				console.log('===验证不通过===>');
				if (this.searchCopy != '') {
					this.receipts.organizationE = this.searchCopy;
					this.searchDomain = {};
				} else {
					console.log('没有搜索记录');
				}
			}
		},
		searchIFNumberFocus() {
			console.log('===聚焦===>');
			console.log('===searchDomain===>', this.searchDomain);
			if (this.searchDomain.user) {
				this.khPhone = this.searchDomain.user.phoneNumber;
			} else {
				this.khPhone = this.receipts.bossNumberE;
			}
		},
		searchIFNumberBlur(e) {
			// var phone = e.target.value;
			// if (this.searchDomain.verification) {
			// 	this.receipts.organizationE = this.searchDomain.verification.enterpriseName;
			// } else {
			// 	// this.receipts.organizationE = this.searchDomain.remark

			// 	console.log("this.searchDomain.verification:", this.searchDomain.verification);
			// 	console.log("this.searchDomain.remark:", this.searchDomain.remark);
			// 	console.log("this.searchDomain.user", this.searchDomain.user);
			// }
			// if (this.searchDomain.user) {
			// 	this.staffNumberEName = this.searchDomain.user.name
			// }

			console.log('===失焦===>', this.searchDomain);
			var phone = e.target.value;

			if (this.searchDomain.verification) {
				if (this.searchDomain.verification.enterpriseName) {
					this.receipts.organizationE = this.searchDomain.verification.enterpriseName;
					this.khPhone = this.searchDomain.verification.enterpriseName;
				}

				if (this.searchDomain.user.name) {
					this.staffNumberEName = this.searchDomain.user.name;
				} else {
					this.staffNumberEName = phone;
				}
			} else {
				if (this.searchDomain.remark && this.searchDomain.verification == null) {
					this.receipts.organizationE = this.searchDomain.remark;
					this.khPhone = this.searchDomain.remark;
				} else {
					if (this.searchDomain) {
						if (this.searchDomain.cRelation) {
							this.receipts.organizationE = this.searchDomain.cRelation.bossNumber;
							this.khPhone = this.searchDomain.cRelation.bossNumber;
						}
					}
				}
			}

			if (phone == '') {
				this.searchDomain = {};
				this.receipts.bossNumberE = '';
				this.receipts.organizationE = '';
			}

			if (phone.length < 11 || phone.length > 11) {
				this.khPhone = '';
				this.$u.toast('请输入11位客户手机号~');
				this.clear();
			}

			// console.log("===失焦===>", this.searchDomain);
			// var phone = e.target.value;

			// if (this.searchDomain.verification) {
			// 	if (this.searchDomain.verification.enterpriseName) {
			// 		this.receipts.organizationE = this.searchDomain.verification.enterpriseName;
			// 		this.khPhone = this.searchDomain.verification.enterpriseName;
			// 	}

			// 	if (this.searchDomain.remark && this.searchDomain.verification.enterpriseName == null) {
			// 		this.receipts.organizationE = this.searchDomain.remark
			// 		this.khPhone = this.searchDomain.remark;
			// 	}

			// 	if (this.searchDomain.user.name) {
			// 		this.staffNumberEName = this.searchDomain.user.name
			// 	} else {
			// 		this.staffNumberEName = phone
			// 	}

			// }

			// if (phone == "") {
			// 	this.searchDomain = {}
			// 	this.receipts.bossNumberE = ""
			// 	this.receipts.organizationE = ""
			// }

			// if (phone.length < 11 || phone.length > 11) {
			// 	this.khPhone = ""
			// 	this.$u.toast("请输入11位客户手机号~");
			// 	this.clear()
			// }
		},
		clear() {
			this.searchCopy = '';
			this.receipts.bossNumberE = '';
			this.receipts.staffNumberE = '';
			this.receipts.organizationE = '';
			this.receipts.takeE = '';
			this.searchDomain = '';
			this.khPhone = '';
			this.staffNumberEName = '';
		},
		getCurrentDate() {
			const date = new Date();
			date.setDate(date.getDate() + 15);
			const year = date.getFullYear();
			const month = ('0' + (date.getMonth() + 1)).slice(-2);
			const day = ('0' + date.getDate()).slice(-2);
			return `${year}-${month}-${day}`;
		},
		getCurrentDateEnd() {
			const date = new Date();
			const year = date.getFullYear();
			const month = ('0' + (date.getMonth() + 1)).slice(-2);
			const day = ('0' + date.getDate()).slice(-2);
			const hours = ('0' + date.getHours()).slice(-2);
			const minutes = ('0' + date.getMinutes()).slice(-2);
			const seconds = ('0' + date.getSeconds()).slice(-2);
			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		},
		ContinueBilling() {
			let receipts = this.receipts;
			uni.removeStorageSync('inventoryStockpile');
			this.flushDBSX(receipts);
			receipts.inventoryList = [];
			this.imgList = [];
			this.orderItemList = [];
			this.orderTotal = 0;
			this.shareShow = false;
			this.getOrderNumber();
			this.addEmp();
			this.receipts.signatureDescr = '';
			uni.navigateBack();
		},
		navBack() {
			var drafts = this.transmitList[0].id != null;
			if (drafts) {
				uni.switchTab({
					url: '/pages/index/index'
				});
			} else {
				this.addDrafts(true);
			}
		},
		addDrafts(type) {
			//判断是否要保存

			if (this.backHomepageClick) {
				uni.navigateBack();
				return;
			}

			if (uni.getStorageSync('inventoryStockpile') || this.receipts.bossNumberE != '') {
				console.log('uni.getStorageSync("inventoryStockpile")=>', 1);
			} else {
				console.log('uni.getStorageSync("inventoryStockpile")=>', 0);
				uni.navigateBack();
				return;
			}

			uni.showModal({
				title: '温馨提醒',
				content: '是否保存到草稿箱?',
				showCancel: true,
				cancelText: type ? '不保存' : '不保存',
				confirmText: '保存',
				success: (res) => {
					var okif = res.confirm;
					if (okif) {
						// this.$u.toast("已保存到草稿箱~");
						this.draftOrderConceal(true);
					} else {
						this.$u.toast('已清除');
					}
					this.backHomepageClick = true;
					uni.navigateBack();
				}
			});
		},
		loadData() {
			this.loadOrderNo();
		},
		loadOrderNo() {
			this.receipts.bossNumberS = this.pinia_user.data.work != '0' ? this.pinia_user.workData.bossNumber : this.pinia_user.phone;

			this.receipts.staffNumberS = this.pinia_user.phone;

			this.receipts.jobNumberS = this.pinia_user.data.work != '0' ? this.pinia_user.workData.jobNumber : '';

			this.receipts.contactsS = this.pinia_user.data.work != '0' ? this.pinia_user.data.name || this.pinia_user.data.phoneNumber : this.pinia_user.phone;

			try {
				var res = JSON.parse(uni.getStorageSync('companyNameJSON'));
				console.log('companyNameJSON======>', res);
				this.receipts.bossNumberE = res.data.identity == '0' ? res.data.staffNumber : res.data.bossNumber;
				this.receipts.staffNumberE = res.data.staffNumber;
				this.receipts.kTakeE = res.data.name;
				this.receipts.kPhoneE = res.data.staffNumber;
				this.receipts.organizationE = res.company;
				this.receipts.takeE = res.data.name || res.data.staffNumber || res.data.bossNumber;
				this.receipts.phoneE = res.data.staffNumber || res.data.bossNumber;
				this.searchCopy = res.data.identity == '0' ? res.data.staffNumber : res.data.bossNumber;
				this.receipts.organizationEJc = res.data.jc || res.data.bossNumber;
				this.staffNumberEName = res.data.name || res.data.bossNumber;

				var dx = {
					user: {
						phoneNumber: res.data.identity == '0' ? res.data.staffNumber : res.data.bossNumber,
						name: res.data.name ? res.data.name : null
					},
					verification: {
						enterpriseName: res.company
					},
					remarkInbox: res.data.remarkInbox
				};

				console.log('companyNameJSON', dx);

				this.searchDomain = dx;
				this.khPhone = res.company;

				uni.removeStorageSync('companyNameJSON');
			} catch (e) {
				console.log('companyNameJSON===err===>', uni.getStorageSync('companyNameJSON'));
			}
		},
		draftSendInit() {
			return new Promise((resolve) => {
				this.receipts.bossNumberS = this.pinia_user.data.work != '0' ? this.pinia_user.workData.bossNumber : this.pinia_user.phone;

				this.receipts.staffNumberS = this.pinia_user.phone;

				this.receipts.price = this.orderTotal;

				this.receipts.contactsS = this.pinia_user.data.name || this.pinia_user.phone;

				this.receipts.state = '1';

				// 	if (this.receipts.bossNumberE == "" || this.receipts.organizationE == "") {
				// 		this.$u.toast("请填写客户手机号~");
				// 		return resolve(false);
				// 	}

				// 	if (this.receipts.kSiteE.length > 16) {
				// 		this.$u.toast("收货地址不能大于16位~");
				// 		return resolve(false);
				// 	}

				// 	if (this.orderTotal <= 0) {
				// 		this.$u.toast("请输入发货清单");
				// 		return resolve(false);
				// 	}

				// 	if (this.orderItemList.length == 0) {
				// 		this.$u.toast("请填写清单~");
				// 		return resolve(false);
				// 	}

				if (this.orderTotal <= 0) {
					if (this.orderItemList.length > 0) {
						this.orderItemList = [];
					}
				}

				if (this.orderItemList.length > 0) {
					this.orderItemList = this.orderItemList.map((item) => {
						const { id, ...rest } = item;
						return rest;
					});
				}

				this.orderItemList = this.orderItemList;

				this.receipts.inventoryList = this.orderItemList;

				// this.orderItemList.forEach(res => {
				// 	res.quantity = this.formatDecimal(res.quantity)
				// })

				this.orderItemList = this.orderItemList;

				if (this.pinia_user.ac != null && this.pinia_user.ac != '') {
					try {
						this.receipts.enterpriseS = this.pinia_user.ac.enterpriseName;
					} catch (e) {
						console.log('捕获');
						console.log(this.pinia_user.ac != null || this.pinia_user.ac != '');
						console.log(this.pinia_user.ac != null);
					}

					this.receipts.enterpriseJc = this.pinia_user.ac.abbreviation;
					this.receipts.enterpriseDz = this.pinia_user.ac.businessSite;
				} else {
					if (this.pinia_work == 'Y') {
						this.receipts.enterpriseS = this.pinia_user.workData.bossNumber;
					} else {
						this.receipts.enterpriseS = this.pinia_user.phone;
					}
				}
				this.receipts.createTime = null;

				resolve(true);
			});
		},
		sendInit() {
			return new Promise((resolve) => {
				this.receipts.bossNumberS = this.pinia_user.data.work != '0' ? this.pinia_user.workData.bossNumber : this.pinia_user.phone;

				this.receipts.staffNumberS = this.pinia_user.phone;

				this.receipts.price = this.orderTotal;

				this.receipts.contactsS = this.pinia_user.data.name || this.pinia_user.phone;

				this.receipts.state = '1';

				if (this.receipts.bossNumberE == '' || this.receipts.organizationE == '') {
					this.$u.toast('请填写客户手机号~');
					return resolve(false);
				}

				if (this.receipts.kSiteE.length > 16) {
					this.$u.toast('收货地址不能大于16位~');
					return resolve(false);
				}

				if (this.orderTotal <= 0) {
					this.$u.toast('请输入发货清单');
					return resolve(false);
				}

				if (this.orderItemList.length == 0) {
					this.$u.toast('请填写清单~');
					return resolve(false);
				}

				this.orderItemList = this.orderItemList.map((item) => {
					const { id, ...rest } = item;
					return rest;
				});

				this.orderItemList = this.orderItemList;

				this.receipts.inventoryList = this.orderItemList;

				this.orderItemList.forEach((res) => {
					res.quantity = this.formatDecimal(res.quantity);
				});

				this.orderItemList = this.orderItemList;

				if (this.pinia_user.ac != null && this.pinia_user.ac != '') {
					try {
						this.receipts.enterpriseS = this.pinia_user.ac.enterpriseName;
					} catch (e) {
						console.log('捕获');
						console.log(this.pinia_user.ac != null || this.pinia_user.ac != '');
						console.log(this.pinia_user.ac != null);
					}

					this.receipts.enterpriseJc = this.pinia_user.ac.abbreviation;
					this.receipts.enterpriseDz = this.pinia_user.ac.businessSite;
				} else {
					if (this.pinia_work == 'Y') {
						this.receipts.enterpriseS = this.pinia_user.workData.bossNumber;
					} else {
						this.receipts.enterpriseS = this.pinia_user.phone;
					}

					if (this.searchDomain.remarkInbox) {
						this.receipts.enterpriseS = this.searchDomain.remarkInbox;
					}
				}
				this.receipts.createTime = null;

				resolve(true);
			});
		},
		sendOrderRes() {
			return new Promise((resolve) => {
				if (this.limitingCondition) {
					this.receipts.id = null;
					this.limitingCondition = false;
					let receiptsData = JSON.parse(JSON.stringify(this.receipts));
					receiptsData.creationTime = receiptsData.creationTime + ' 00:00:00';
					//要删除的
					const uniqueIds = [
						...new Set(
							this.removeList
								.filter((item) => item.id) // 只要有 id 的
								.map((item) => item.id)
						)
					];
					receiptsData.delImgFolderIdList = uniqueIds;
					console.log('要删除的', receiptsData.delImgFolderIdList);

					uni.$api.order
						.addOrder(receiptsData)
						.then((res) => {
							console.log(res);
							var code = res.data.data;
							if (code == 1) {
								this.shareShow = true;
								this.limitingCondition = true;
								this.backHomepageClick = true;
								uni.$api.order
									.getOrderByNumber({
										orderNumber: this.receipts.orderNumber
									})
									.then((res) => {
										console.log('请求结果：' + res.data.data.post);
										this.transmitList = res.data.data;
										uni.removeStorageSync('inventoryStockpile');
										resolve(true);
									})
									.catch((res) => {
										resolve(false);
									});
							} else if (code == 9) {
								this.getOrderNumber();
								this.$u.toast(res.data.message);
								resolve(false);
							} else {
								this.$u.toast('添加失败，请检查网络~');
								resolve(false);
							}
						})
						.catch((res) => {});
				} else {
					this.$u.toast('请勿重复点击~');
					resolve(false);
				}
			});
		},
		sendOrderResDraft() {
			return new Promise((resolve) => {
				if (this.limitingCondition) {
					this.limitingCondition = false;
					let receiptsData = JSON.parse(JSON.stringify(this.receipts));
					receiptsData.creationTime = receiptsData.creationTime + ' 00:00:00';
					uni.$api.draft
						.editDraft(receiptsData)
						.then((res) => {
							console.log(res);
							this.$u.toast(res.data.message);
							resolve(true);
						})
						.catch((res) => {
							resolve(false);
						});
				} else {
					this.$u.toast('请勿重复点击~');
					resolve(false);
				}
			});
		},
		sendOrderImg() {
			return new Promise((resolve) => {
				var that = this;
				var listImg = [];
				var bossNumber = this.pinia_work == 'Y' ? this.pinia_user.workData.bossNumber : this.pinia_user.phone || this.pinia_user.data.phoneNumber;
				var jobNumber = this.pinia_work == 'Y' ? that.pinia_user.workData.jobNumber : that.pinia_user.phone;

				var imgList = this.imgList.filter((res) => res.size);
				console.log('imgList22222222', imgList);

				for (let key in imgList) {
					uni.uploadFile({
						url: uni.$http.config.baseURL + 'order/img',
						header: {
							phone: bossNumber,
							orderNumber: that.receipts.orderNumber,
							jobNumber: that.receipts.jobNumberS || jobNumber,
							token: that.pinia_user.loginToken
						},
						filePath: imgList[key].url,
						name: 'file',
						formData: {
							imageType: '1'
						},
						success: (uploadFileRes) => {
							console.log(uploadFileRes);
						}
					});
				}

				resolve(true);
			});
		},
		async sendOrder() {
			const result = await this.sendInit();
			console.log('验证结果======>', result);
			if (!result) {
				return;
			} else {
				const img = await this.sendOrderImg();
				console.log('添加img结果======>', img);
				if (img) {
					const resultOrder = await this.sendOrderRes();
					if (resultOrder) {
						this.flushDBSX(this.receipts);
					}
				}
			}
		},
		async draftOrder() {
			const result = await this.draftSendInit();
			console.log('验证结果======>', result);
			if (!result) {
				return;
			} else {
				this.receipts.imgList = this.newImg;
				var orderNumber = this.receipts.orderNumber;
				this.receipts.inventoryList.forEach((res) => {
					res.orderId = orderNumber;
				});
				const resultOrder = await this.sendOrderResDraft();
				// const resultOrder = true;
				console.log('添加结果======>', resultOrder);
				if (resultOrder) {
					console.log('fileList======>', this.fileList);
					console.log('imgList======>', this.imgList);
					console.log('newImg======>', this.newImg);
					const img = await this.sendOrderImg();
					if (img) {
						this.backHomepageClick = true;
						setTimeout(function () {
							uni.navigateBack();
						}, 500);
					}
				}
			}
		},
		async draftOrderConceal() {
			const result = await this.draftSendInit();
			console.log('验证结果======>', result);
			if (!result) {
				return;
			} else {
				this.receipts.imgList = this.newImg;
				var orderNumber = this.receipts.orderNumber;
				this.receipts.inventoryList.forEach((res) => {
					res.orderId = orderNumber;
				});
				const resultOrder = await this.sendOrderResDraft();
				// const resultOrder = true;
				console.log('添加结果======>', resultOrder);
				if (resultOrder) {
					console.log('fileList======>', this.fileList);
					console.log('imgList======>', this.imgList);
					console.log('newImg======>', this.newImg);
					const img = await this.sendOrderImg();
					if (img) {
						this.backHomepageClick = true;
					}
				}
			}
		},
		flushDBSX(val) {
			var list = [val.bossNumberS, val.staffNumberS, val.bossNumberE, val.staffNumberE];
			uni.$api.task
				.startRWFlow({ list: list })
				.then((res) => {
					console.log('请求结果：' + res);
				})
				.catch((res) => {});
		},
		formatDecimal(value) {
			// 将数字转换为浮点数，以确保我们可以进行数学运算
			var num = parseFloat(value);

			// 检查是否为有效的数字
			if (isNaN(num)) {
				return 'Invalid number';
			}

			// 使用toFixed()方法保留两位小数，并返回字符串
			return num.toFixed(3);
		},
		callPhone(phone) {
			uni.makePhoneCall({
				phoneNumber: phone
			});
		},
		// 获取选择的时间
		getConfirm(e) {
			this.showCalendar = false;
			this.receipts.creationTime = e.fulldate; //传给接口
		},
		getOrderNumber() {
			var ifphon = this.pinia_work == 'Y' ? this.pinia_user.workData.bossNumber : this.pinia_user.phone;
			var path = '?time=' + this.getCurrentDate() + '&phone=' + ifphon;
			console.log('path==', path);
			uni.$api.order
				.getNextOrderNumber({
					path: path
				})
				.then((res) => {
					console.log(res);
					this.receipts.orderNumber = res.data.data;
				})
				.catch((res) => {});
		},
		digitUppercase(n = 0) {
			if (n === 0) {
				return '-';
			}
			var fraction = ['角', '分'];
			var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
			var unit = [
				['元', '万', '亿'],
				['', '拾', '佰', '仟']
			];
			var head = n < 0 ? '欠' : '';
			n = Math.abs(n);
			var s = '';
			for (var i = 0; i < fraction.length; i++) {
				s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
			}
			s = s || '整';
			n = Math.floor(n);
			for (var i = 0; i < unit[0].length && n > 0; i++) {
				var p = '';
				for (var j = 0; j < unit[1].length && n > 0; j++) {
					p = digit[n % 10] + unit[1][j] + p;
					n = Math.floor(n / 10);
				}
				s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
			}
			return (
				head +
				s
					.replace(/(零.)*零元/, '元')
					.replace(/(零.)+/g, '零')
					.replace(/^整$/, '零元整')
			);
		}
	}
};
</script>

<style lang="scss" scoped>
::v-deep button::after {
	border: none !important; //按钮外边框border隐藏
}
.form-cover {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 100;

	.pop-inner {
		width: 500rpx;
		height: 600rpx;
		padding-top: 270rpx;
		background: url('https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/images/vip-pop.png') top center no-repeat;
		background-size: 100% 100%;
	}
}

.recently-cat {
	text {
		font-size: 24rpx;
		border: 1rpx solid #eee;
		padding: 10rpx 30rpx;
		color: #666;
		border-radius: 100rpx;
		margin: 8rpx;
		color: #999;

		&:active {
			background: #f8f8f8;
			color: #333;
		}
	}
}

.table-input {
	color: #d8d8d8;
	min-height: 24rpx;
	border: none;
	outline: none;
	font-weight: normal;
}

.fx {
	border: 0;
	cursor: pointer;
	padding: 0 15rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	transition: all 0.15s;
	min-width: 150rpx;
	height: 50rpx;
	line-height: 50rpx;
	color: #666;
	position: relative;
	background-color: #fff !important;
	z-index: 1;
	font-size: 28rpx;
	border-radius: 100rpx;

	&::after {
		content: '';
		border: none;
		position: absolute;
		pointer-events: none;
		box-sizing: border-box;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		left: 0;
		top: 0;
		width: 199.8%;
		height: 199.7%;
		-webkit-transform: scale(0.5, 0.5);
		transform: scale(0.5, 0.5);
		// border: 2rpx solid #333;
		z-index: 1;
		border-radius: 100rpx;
		background: transparent;
	}
}
</style>
<style>
.handcolor {
	color: #333333;
	font-size: 32rpx;
}

.handcolorClear {
	color: #666666;
	font-size: 28rpx;
}

.textcolor {
	color: #666666;
	font-size: 28rpx;
	font-weight: 500;
}

.endcolor {
	font-size: 28rpx;
	font-weight: 500;
}

.placeholder_class {
	color: #d8d8d8;
}

.al {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}

.item {
	flex: 1;
	margin: 0;
}
</style>
