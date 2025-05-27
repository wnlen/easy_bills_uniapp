<template>
	<view class="vh100 pb60 flex-col justify-center" style="background-color: #ffffff;overflow-x: hidden;">

		<u-navbar :custom-back="navBack" :border-bottom="false" :titleBold="true" title-color="#000000" title-size="34"
			bgColor="#ffffff">
			<view class="flex-row items-center justify-center ml48" style="width: 100%;">
				<view class="" style="font-size: 34rpx;font-weight: 510;">
					一键开单
				</view>
				<view @click="jumpVideo" class="flex-row justify-center items-center ml12"
					style="border: 1.1px solid #01BB74;height: 22px;width:68px;border-radius: 8rpx;color: #01BB74;font-size: 11px;">
					使用方法<u-icon class="ml6" name="https://res-oss.elist.com.cn/wxImg/video.png" size="20"></u-icon>
				</view>
			</view>
		</u-navbar>

		<view class="width100" style="height: 80vh;text-align: center;margin-left: 10vw;"
			v-show="vuex_userRole == 'D'&& shareShow == true">

			<u-popup v-model="showShare" mode="center" width="80%" height="20%" border-radius="15">
				<view class="relative" style="height: 100%;width: 100%;">
					<view class="flex-col justify-center items-center" style="height: 30%;">
						提示
					</view>
					<view class="flex-col justify-center items-center"
						style="height: 40%;font-size: 18px;font-weight: 600;">请选择转发版本</view>
					<view class="u-border-top absolute al" style="bottom: 0;height: 30%;width: 100%;">
						<view class="u-border-right item flex-col justify-center items-center" style="height: 100%;">
							<button class="fx" size="medium" open-type="share" :data-id="transmitList[0].id"
								:data-thumb="transmitList[0].picturesId" shape="circle" @click="ShareY">有金额转发</button>
						</view>
						<view class="item flex-col justify-center items-center" style="height: 100%;">
							<button class="fx" size="medium" open-type="share" :data-id="transmitList[0].id"
								:data-thumb="transmitList[0].picturesId" shape="circle" @click="ShareN">无金额转发</button>
						</view>
					</view>
				</view>
			</u-popup>


			<view class="mt45 flex-col justify-center"
				style="width: 80vw;text-align: center;align-items: center;height: 50vh;">
				<view class="" style="width: 60vw;height: 20vh;">
					<u-image style="" width="100%" height="100%"
						src="https://res-oss.elist.com.cn/wxImg/order/fscg.png"></u-image>
				</view>
				<view class="text-center mt20" style="color:#01BB74;font-size: 17px;font-weight: bold;width: 100%;">
					发送成功!
				</view>
				<view class="text-center mt10" style="color:#AAAAAA;font-size: 13px;font-weight: normal;">
					电子单据已发送给收货人
				</view>
				<view class="flex-row justify-center items-center mt40">
					<button class=""
						style="background-color: #ffffff;width:135.62px;height:'39.99px';border-radius:169.2px;color: #262626;border: 1px solid #01BB74;"
						class=" mr10" size="medium" shape="circle" @click="showShare=true">
						<u-icon class="pr10" label-color="#01BB74" label="微信分享好友" label-pos="right" name="weixin-fill"
							color="#01BB74" size="30"></u-icon>
					</button>

					<button
						style="background-color: #01BB74;width:135.62px;height:'39.99px';border-radius:169.2px;color: #ffffff;"
						class="ml10" @click="ContinueBilling">继续开单</button>
				</view>

			</view>

		</view>


		<view v-if="!identity" class="flex-row justify-center items-center absolute" style="width: 100%;top: 30%;">
			<u-image src="https://res-oss.elist.com.cn/wxImg/order/cw.svg" width="300px" height="200px"></u-image>
			<view class="absolute" style="bottom: -40px;color: #AAAAAA;font-size: 14px;">
				无开单权限~
			</view>
		</view>


		<view class="hand relative" style="background-color: #01BB74;width: 100vw;height: 60px;"
			v-if="vuex_userRole == 'D' && shareShow == false && identity">
			<view class="pd20 syst absolute" style="width:100vw;background-color: transparent;
				height: 10vh;color: #FFFFFF;font-size: 20px;
				font-weight:bold;display: flex;
				flex-direction: row;
				justify-content: center;
				top: 1px;">
				{{vuex_user.data.work=="0"?(vuex_user.ac!=null?(vuex_user.ac.enterpriseName || vuex_user.ac.phone):vuex_user.phone):vuex_user.ac!=null?(vuex_user.ac.enterpriseName || vuex_user.workData.bossNumber):vuex_user.workData.bossNumber}}发货单
			</view>
		</view>

		<view class="form-wrap  pt20  absolute" style="background-color:#ffffff;"
			v-if="vuex_userRole == 'D' && shareShow == false && identity">
			<view class="form-inner flex-col" style="font-size: 14px;background-color: #ffffff;">
				<view class="flex-col justify-left">
					<u-image v-if="vuex_user.eorderLogo" :src="vuex_user.eorderLogo" width="152" height="60"
						mode="aspectFill" />
					<view class="ft-bold pd10 handcolor relative">
						发货单信息
						<!-- 			<view @click="jumDrafts" class="absolute flex-row items-center justify-center"
							style="width: 90px;height: 40px;border-radius: 193px;background: #EBEBEB;right: 12rpx;top: 0;">
							<u-icon label="草稿箱" size="40"
								name="https://res-oss.elist.com.cn/wxImg/order/drafts.svg"></u-icon>
						</view> -->
					</view>
					<view class="flex-row items-end pt20 pb20 u-border-bottom">
						<text class="textcolor">订单编号: </text>
						<text class="ft-red ml15" style="color: #FA5151;font-family: ddbh;">
							{{ receipts.orderNumber || "" }}</text>
					</view>
					<view class="flex-row items-center width100 u-border-bottom">
						<text class="pt20 pb20 pr12 textcolor"><text style="color: #FA3534;">*</text>客户名称:</text>
						<input maxlength="20" placeholder-class="placeholder_class" style="color:#D8D8D8;"
							@input="searchIFNumber" @blur="searchIFNumberBlur" :focus="PhoneFocus"
							@focus="searchIFNumber" type="text" v-model="receipts.organizationE"
							:style="{color:ifInput(receipts.organizationE)}" placeholder="请输入客户手机号"
							class="flex-1 endcolor" />
						<u-button shape="circle" size="mini" hover-class="none"
							:custom-style="{backgroundColor:'#01BB74',color:'#ffffff'}" @click="jumpTable">
							选择客户
						</u-button>
					</view>
					<view class="flex-row items-center width100 pt20 pb20 u-border-bottom">
						<text class="textcolor" style="width: 106rpx;">收货方:</text>
						<input disabled placeholder-class="placeholder_class" type="text" v-model="staffNumberEName"
							:style="{color:ifInput(staffNumberEName)}" maxlength="20" placeholder="请选择收货方"
							class="u-line-1 ml15 endcolor" />
					</view>
					<view class="flex-row items-center width100 pt20 pb20 u-border-bottom">
						<text class="textcolor"><text style="color: #FA3534;">*</text>发货日期:</text>
						<input placeholder-class="placeholder_class" @click="sendShow = true"
							:style="{color:ifInput(receipts.creationTime)?'#333333':'#D8D8D8'}" type="text"
							v-model="receipts.creationTime" disabled placeholder="发货日期" class="flex-1  ml15 endcolor" />
						<view class="flex-row" @click="sendShow = true">
							<view class="mr20">
								<u-line class="" color="#D8D8D8" length="50" direction="col"></u-line>
							</view>
							<u-icon @click="sendShow = true" class="" size="45"
								name="https://res-oss.elist.com.cn/wxImg/order/time.png">
							</u-icon>
							<view>
								<u-calendar btn-type="success" v-model="sendShow" :min-date="getCurrentDateMin()"
									:max-date="getCurrentDate()" mode="date" active-bg-color="#01BB74"
									@change="getConfirm"></u-calendar>
							</view>
						</view>
					</view>
					<view class="flex-row items-center width100 pt20 pb20 u-border-bottom">
						<text class="textcolor" style="width: 106rpx;">收货人:</text>
						<input placeholder-class="placeholder_class" type="text" v-model="receipts.kTakeE"
							:style="{color:ifInput(receipts.kTakeE)}" maxlength="10" placeholder="请输入收货人姓名"
							class="u-line-1 ml15 endcolor" />
					</view>

					<view class="flex-row items-center width100 pr20 pt20 pb20 u-border-bottom">
						<text class="textcolor">联系电话:</text>
						<input placeholder-class="placeholder_class" type="number" v-model="receipts.kPhoneE"
							:style="{color:ifInput(receipts.kPhoneE)?'#333333':'#D8D8D8'}" maxlength="11"
							placeholder="请输入联系电话" class="ml15  flex-1 u-line-1 endcolor" />
					</view>

					<view class="flex-row items-center justify-between pt20 pb20 u-border-bottom">
						<view class="flex-row items-center width100">
							<text class="textcolor">收货地址:</text>
							<input placeholder-class="placeholder_class" type="text" maxlength="100"
								:style="{color:ifInput(receipts.kSiteE)?'#333333':'#D8D8D8'}" v-model="receipts.kSiteE"
								placeholder="请输入收货地址" class="ml15 flex-1 u-line-1 endcolor" />
						</view>
					</view>
					<view class="flex-row justify-between items-center mb20 pb12">
						<text class="line34 ft-bold handcolor pt24">发货清单</text>
						<text class="line34 handcolorClear pt24" @click="ClearOrderItemList">
							一键清空
						</text>
					</view>
				</view>
			</view>


			<scroll-view enhanced :show-scrollbar="false" scroll-y="true"
				style="background-color: #F4F4F4;max-height: 335px;margin-top: 12rpx;">
				<view style="width: 100%;background-color: #ffffff;" v-for="(item, index) in orderItemList" :key="index"
					class="mb12 mt12">
					<view class="flex-row pt24 pb24" style="width: 100%;">
						<view style="width: 10%;" class="ml20">品名:</view>
						<view style="width: 40%;color: #666666;">{{item.description}}</view>
						<view style="width: 10%;" class="ml20">规格:</view>
						<view style="width: 40%;color: #666666;">{{item.specification}}</view>
					</view>
					<view class="flex-row items-center justify-center" style="width: 100%;">
						<u-line class="u-line ml24 mr24" color="#F4F4F4" length="100%"></u-line>
					</view>
					<u-table border-color="#ffffff">
						<u-tr>
							<u-td>数量</u-td>
							<u-td>单位</u-td>
							<u-td>单价</u-td>
							<u-td>金额</u-td>
						</u-tr>
						<u-tr>
							<u-td>{{item.quantity}}</u-td>
							<u-td>{{item.unit}}</u-td>
							<u-td>{{item.unitPrice}}</u-td>
							<u-td>￥{{item.quantity!="-"&&item.quantity!=""?(item.unitPrice * item.quantity).toFixed(2):0}}</u-td>
						</u-tr>
					</u-table>
				</view>
			</scroll-view>

			<view class="pt12 mt12" style="background-color: #ffffff;">
				<view class="relative pt12 pb12">
					<text class="pl20 textcolor">合计</text>
					<text class="absolute textcolor"
						style="right: 24rpx;color: #01BB74;">￥{{ orderTotal.toFixed(2) }}</text>
				</view>
				<view class="relative pt12 pb12">
					<text class="pl20 textcolor">金额大写</text>
					<text class="absolute textcolor"
						style="right: 24rpx;color: #666666;">{{ digitUppercase(orderTotal) }}</text>
				</view>
				<view class="pd12">
					<u-line color="#E0E0E0"></u-line>
				</view>
				<view class="pd12 flex-row justify-center" style="width: 100%;">
					<view class="flex-row justify-center items-center" style="width: 49%;">
						<u-icon label-pos="bottom" @click="merchandiseInventory(true)"
							name="https://res-oss.elist.com.cn/wxImg/order/bj.svg" size="70" label="修改"></u-icon>
					</view>
					<view class="flex-row justify-center items-center" style="width: 2%;">
						<u-line direction="col" length="50" color="#E0E0E0" />
					</view>
					<view class="flex-row justify-center items-center" style="width: 49%;">
						<u-icon label-pos="bottom" @click="merchandiseInventory(false)"
							name="https://res-oss.elist.com.cn/wxImg/order/spk.svg" size="70" label="商品库"></u-icon>
					</view>
				</view>
			</view>

			<view class="form-inner-card flex-col" style="font-size: 14px;background-color: #ffffff;">
				<view v-if="recentlyData" class="flex-row justify-between items-center mt45 ft-bold">
					<text class="line34 handcolor">相关图片/票据</text>
				</view>

				<view class="recently-cat flex-row flex-wrap mt40" style="width: 95%;">
					<u-upload :custom-btn="true" :action="action" :show-retry="false" :file-list="fileList"
						:show-tips="false" :before-upload="handleUpload" max-size="5242880" max-count="3" multiple
						del-bg-color="#e9e9e9">
						<view slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">
							<u-icon name="https://res-oss.elist.com.cn/wxImg/order/down.png" size="200"></u-icon>
						</view>
					</u-upload>
				</view>


				<view class="flex-col mt45" style="width: 95%;">
					<text class="handcolor line34" style="font-weight: bold;">备注</text>
					<view class="mt40"
						style="border-radius: 3px;box-sizing: border-box;border: 0.5px solid rgba(216, 216, 216, 0.5);">
						<input v-model="receipts.signatureDescr" type="text"
							class="ft24 line24 height80 ft-bold table-input ml30" placeholder="请填写备注内容"
							placeholder-class="placeholder_class" maxlength="38"
							:style="{ color: ifColor(receipts.signatureDescr)?'#666666':'#D8D8D8'}" />
					</view>
				</view>

				<view class="flex-col justify-between pb10 mt45">
					<text class="line34 ft-bold handcolor">供应商信息</text>
					<view class="form-bottom ft-gray">
						<view class="flex-col justify-between ft24 pt20 pb10 mr24">
							<view class="textcolor pt20 pb20 u-border-bottom">
								企业名称:
								<text :style="{color:'#333333'}" v-if="vuex_user.ac != null" class="ml15 endcolor">
									{{ vuex_user.ac.enterpriseName ||vuex_user.phone }}</text>
							</view>
							<view class="textcolor pt20 pb20 u-border-bottom">
								联系人:
								<text :style="{color:'#333333'}" class="ml15 endcolor">{{ vuex_user.data.name || vuex_user.phone || vuex_user.data.phone
									}}</text>
							</view>
							<view class="textcolor pt20 pb20 u-border-bottom">
								联系电话:
								<text class="ml15 endcolor" :style="{color:'#333333'}"
									@click="callPhone(vuex_user.phoneNumber)">{{ vuex_user.phone || vuex_user.data.phone }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="mt60 pl20 pr20 pb30">
				<u-button type="primary" class="form-btn-big" hover-class="none"
					:custom-style="{backgroundColor:'#01BB74'}" @click="sendOrder" shape="circle">发送订单</u-button>
			</view>
		</view>

		<pop-auth ref="popAuth"></pop-auth>
		<!-- 认证提醒 -->

		<u-mask :show="showOrderPly" @click="showOrderPly = false" :mask-click-able="false">
			<pop-order ref="popOrder" :item="order"></pop-order>
		</u-mask>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				order: {},
				showOrderPly: false,
				scrollTop: 0,
				transmitList: [{
						id: null
					},
					{
						id: null
					}
				],
				transmit: "https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/edo/order/ED2402292259345200/ED2402292259345200.jpg",
				receipts: {
					"bossNumberS": "",
					"staffNumberS": "",
					"jobNumberS": "",
					"bossNumberE": "",
					"staffNumberE": "",
					"jobNumberE": "",
					"orderNumber": "",
					"organizationE": "",
					"takeE": "",
					"phoneE": "",
					"siteE": "",
					"kTakeE": "",
					"kPhoneE": "",
					"kSiteE": "",
					"inventoryList": [],
					"price": "",
					"majuscule": "",
					"picturesId": "",
					"enterpriseS": "",
					"contactsS": "",
					"phoneS": "",
					"creationTime": "",
					"signatureImg": "",
					"signatureTime": "",
					"video": "",
					"paymentType": "",
					"paymentState": "",
					"paymentTime": "",
					"state": "",
					"role": "",
					"type": "3",
					"enterpriseJc": "",
					"enterpriseDz": "",
					"signatureDescr": "",
					"organizationEJc": "",
					"preview1": 0
				},
				imgList: [],
				show: false,
				showShare: false,
				title: "创建电子发货单",
				background: {
					'background-image': 'linear-gradient(45deg, #fff, #fff)'
				},
				customStyle: {
					width: '300rpx',
					boder: 'none'
				},
				color: {
					color: "#7277d8"
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
				shareImage: "", //创建订单后接口返回
				orderId: "", //创建订单后接口返回
				shareShow: false,
				recentlyData: [], //近期下单商品
				sendShow: false, //发货日期弹窗
				action: '',
				fileList: [],
				companyName: "请选择",
				searchCopy: "",
				searchDomain: "",
				verify: {
					1: "品名",
					2: "规格",
					3: "单位",
					4: "数量",
					5: "单价"
				},
				identity: true,
				openOrder: false,
				staffNumberEName: "",
				limitingCondition: true,
				ShareDetails: "",
				PhoneFocus: false,
				uNoticeBarlist: ["当年创建的订单请在12月31日前完成收款，逾期将无法处理~"],
				SearchCustomStyleWechat: {
					width: "150px",
					height: "45px",
					padding: "24rpx",
					fontSize: "12px",
					color: "#01BB74"
				}
			};
		},
		onShow() {
			// #ifdef MP-WEIXIN
			this.$refs.popAuth.authShow = false
			this.$refs.popOrder.authShow = false
			this.showShare = false
			// #endif

			// this.loadDataRenew();
			this.loadData();

			this.defImg();
			// #ifdef MP-WEIXIN
			this.addOrderIfOk();
			// #endif
			if (uni.getStorageSync("inventoryStockpile") != undefined && uni.getStorageSync("inventoryStockpile") !=
				null && uni.getStorageSync("inventoryStockpile") != "") {
				this.orderItemList = uni.getStorageSync("inventoryStockpile")
				console.log("inventoryStockpile", uni.getStorageSync("inventoryStockpile"));
				this.orderTotal = 0
				this.orderItemList.forEach(res => {
					this.orderTotal = this.orderTotal + (res.quantity * res.unitPrice)
				})
			}

		},
		onLoad(options) {
			this.addEmp()
			this.getOrderNumber();
			var order = uni.getStorageSync("orderParticular")
			order.bill.orderNumber = this.receipts.orderNumber
			this.receipts = order.bill
			this.orderItemList = order.inventory
			this.receipts.creationTime = this.$u.timeFormat(order.bill.creationTime, 'yyyy-mm-dd')
			this.orderItemList.forEach(res => {
				this.orderTotal = this.orderTotal + (res.quantity * res.unitPrice)
			})
			this.fileList = order.imgList
			uni.setStorageSync("inventoryStockpile", this.orderItemList)
		},
		onUnload() {
			uni.removeStorageSync("inventoryStockpile")
		},
		methods: {
			jumDrafts() {
				console.log("跳转");
				uni.navigateTo({
					url: "drafts"
				})
			},
			jumpVideo() {
				uni.navigateTo({
					url: "/pages/subPack/wxvideo/wxvideo?feedId=0"
				})
			},
			modification() {
				console.log("modification");
				uni.navigateTo({
					url: "modification"
				})
			},
			ClearOrderItemList() {
				this.orderItemList = []
				this.addEmp()
				uni.removeStorageSync("inventoryStockpile")
			},
			merchandiseInventory(type) {
				console.log("merchandiseInventory", type);
				console.log("价格", this.orderTotal);

				if (type) {
					if (this.orderTotal > 0) {
						uni.navigateTo({
							url: "/pages/subOrder/merchandiseInventory?type=" + (type ? 1 : 0)
						})
					} else {
						this.$u.toast("请到商品库选择商品~");
					}
				} else {
					uni.navigateTo({
						url: "/pages/subOrder/merchandiseInventory?type=" + (type ? 1 : 0)
					})
				}
			},
			addOrderIfOk() {
				var startDate = new Date(this.vuex_user.data.registrationDate);
				var endDate = new Date();

				const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate
					.getMonth();

				var okIf = monthsDiff >= 6;

				if (okIf) {
					//判断权限是否生效
					var user = this.vuex_user.data.vProductEffects
					var ifAdd = user.O1 == "1" && user.O2 == "1";

					if (ifAdd) {
						//判断是否有该权限 是否过期
						var O2 = this.vuex_user.jurisdiction.O2;
						if (O2 == "" || O2 == undefined) {
							var O1 = this.vuex_user.jurisdiction.O1;
							if (O1 == "" || O1 == undefined) {
								//获取开单价格
								//判断是否工作
								var work = this.vuex_user.data.work == "0";
								if (work) {
									this.getProductAll()
								} else {
									uni.reLaunch({
										url: "/pages/subOrder/forbid/forbid"
									})
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
				// this.authentication();
			},
			getProductAll() {
				this.$u.post('edo/productAll/get?phone=' + this.vuex_user.phone).then(res => {
					// console.log("开单价格",res.data.data);
					this.order = res.data.data
					this.$refs.popOrder.orderInit(this.order[1], 1)
					this.$refs.popOrder.authShow = true
					this.showOrderPly = true
				});
			},
			defImg() {
				this.action = this.$u.http.config.baseUrl + "/edo/order/imgA"
				if (this.receipts.creationTime == "") {
					this.receipts.creationTime = this.$u.timeFormat(new Date(), 'yyyy-mm-dd')
				}
			},
			authentication() {
				console.log("---安全认证---");
				if (this.$refs.popOrder.authShow) {
					return;
				} else {
					console.log("安全认证");
					if (this.vuex_user.workData.id != null && this.vuex_user.workData.id != '') {
						this.identity = this.vuex_user.workData.identity != '3'
					} else {
						var auth = uni.getStorageSync("auth")
						console.log("安全认证");
						if (auth != undefined && auth == "0") {
							console.log("安全认证");
							var ac = this.vuex_user.ac;
							if (ac == null || ac == "" || ac == undefined) {
								this.$refs.popAuth.authShow = true
							}

						}
					}
				}
			},
			loadDataRenew() {
				let role = this.vuex_user.data.work == "1" ? 1 : 2;
				console.log(this.vuex_user.data.work);
				var that = this;
				this.$u.post('edo/user/renewal?phone=' + this.vuex_user.phone + '&role=' + role).then(res => {
					let a = that.vuex_user
					a.ac = res.data.data.ac
					a.data = res.data.data.data
					a.workData = res.data.data.workData;
					a.jurisdiction = res.data.data.jurisdiction
					a.vuex_password = res.data.data.password
					that.$u.vuex('vuex_user', a);
					if (res.data.data.data.work == "1") {
						that.$u.vuex('vuex_work', 'Y');
					} else {
						that.$u.vuex('vuex_work', 'N');
					}
				})

				console.log("用户信息实时更新 ", this.vuex_user);
			},
			ShareY(item) {
				this.ShareDetails = "Y"
				console.log("有金额");
			},
			ShareN(item) {
				console.log("无金额");
				this.ShareDetails = "N"
			},
			ifInput(val) {
				// console.log("输入框", val);
				if (val === "") {
					// console.log("输入框 满足", val);
					return '#D8D8D8';
				} else {
					// console.log("输入框 不满足", val);
					return '#333333';
				}
			},
			ifColor(val) {
				if (val != "请输入" && val != "0.00" && val != "") {
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
				this.receipts.phoneE = ""
				this.goPath('/pages/subOrder/table');
			},
			onShareAppMessage(ops) {
				if (ops.from === 'button') {
					console.log("分享：", ops);
					var pid = ops.target.dataset.id;
					var pThumb = ops.target.dataset.thumb;
					var phone = this.vuex_user.phone;
					var port = this.vuex_userRole
					var versions = this.ShareDetails
					console.log(pThumb);
					return {
						// title: `这是您的${versions=="Y"?"有金额":"无金额"}货单，请打开易单据查看详情~`,
						title: `您有一张订单待确认~`,
						path: '/pages/subOrder/detailsShare?id=' + pid + "&&type=1" + "&&phone=" + phone + "&&port=" +
							port +
							"&&versions=" + versions,
						imageUrl: pThumb
					}
				} else {
					return {
						title: '打开易单据小程序，极速管理您的货单~',
						path: '/pages/index/index',
						imageUrl: '/static/share.png'
					}
				}
			},
			transpond() {
				console.log("转发");
			},
			blurOrderItem(index, e) {
				var dx = {
					0: "description",
					1: "specification",
					2: "unit",
					3: "quantity",
					4: "unitPrice"
				}
				var dxq = dx[e];
				if (e == 3 || e == 4) {
					this.orderItemList[index][dxq] = this.orderItemList[index][dxq] == "" ? "0.00" : this.orderItemList[
						index][
						dxq
					];
				} else {
					this.orderItemList[index][dxq] = this.orderItemList[index][dxq] == "" ? "请输入" : this.orderItemList[
						index][
						dxq
					];
				}
				console.log("视角判断：", this.orderItemList[index][dxq] == "");

				this.orderItemList = this.orderItemList
				console.log(this.orderItemList);
			},
			focusOrderItem(index, e) {
				console.log(index, e);
				var dx = {
					0: "description",
					1: "specification",
					2: "unit",
					3: "quantity",
					4: "unitPrice"
				}
				var dxq = dx[e];
				if (this.orderItemList[index][dxq] == "" || this.orderItemList[index][dxq] == '0.00' || this.orderItemList[
						index][dxq] == "请输入") {
					if (e == 3 || e == 4) {
						this.orderItemList[index][dxq] = ""
					} else {
						this.orderItemList[index][dxq] = ""
					}
				}
				this.orderItemList = this.orderItemList
				console.log(this.orderItemList);
				this.orderItemList[index].color[dxq] = "transparent"
			},
			addEmp() {
				var ifwork = this.vuex_user.data.work == "0";
				var dx = {
					"id": "",
					"orderId": "",
					"phone": ifwork ? this.vuex_user.phone : this.vuex_user.workData.bossNumber,
					"staffNumber": this.vuex_user.phone,
					"description": "-",
					"specification": "-",
					"unit": "-",
					"quantity": "-",
					"unitPrice": "-",
					"color": {
						"description": "transparent",
						"specification": "transparent",
						"unit": "transparent",
						"quantity": "transparent",
						"unitPrice": "transparent"
					}
				}

				for (var i = 0; i < 1; i++) {
					this.orderItemList.push(dx)
				}

			},
			isAllNumbers(str) {
				return /^\d+$/.test(str);
			},
			searchIFNumber(e) {
				if (e.target.value == "" || e.target.value == null) {
					return;
				}
				this.staffNumberEName = ""
				var phone = e.target.value.replace(/\s+/g, '');
				this.receipts.organizationE = this.receipts.organizationE.replace(/\s+/g, '');
				var ifphone = this.isAllNumbers(e.target.value.replace(/\s+/g, ''))

				if (ifphone && phone.length == 11) {
					//查询
					// console.log("老板账号：",this.vuex_user.workData.bossNumber,"输入手机号码：",phone);
					var ifwork = this.vuex_user.data.work == "0"
					var boss = ""
					if (ifwork) {
						boss = this.vuex_user.phone
					} else {
						boss = this.vuex_user.workData.bossNumber;
					}
					this.searchCopy = phone;
					this.$u.post('edo/user/searchAddOrder?phone=' + phone + '&state=1&boss=' + boss + "&port=" + this
						.vuex_userRole).then(res => {
						console.log("（触发请求：/searchAddOrder");
						console.log(res.data.data);
						try {
							var end = res.data.data;
							this.searchDomain = end;
							console.log("(检索数据)：", end);
							if (Object.keys(end).length != 0) {
								console.log("(检索数据 不为空)", end);
								if (end.user) {
									this.receipts.takeE = res.data.data.user.name
									this.staffNumberEName = res.data.data.user.name
								}
								if (end.verification) {
									this.receipts.organizationE = res.data.data.verification.enterpriseName
								} else {
									this.receipts.takeE = phone
									this.receipts.organizationE = phone
								}

								if (end.cRelation != undefined) {
									this.receipts.bossNumberE = end.user.work != "0" ? end.cRelation.bossNumber :
										end.user.phoneNumber
									this.receipts.staffNumberE = end.user.work != "0" ? end.cRelation.staffNumber :
										end
										.user
										.phoneNumber

									if (end.cRelation.identity == "3") {
										this.$u.toast("财务不支持开单~");
										this.clear()
										return;
									}

								} else {
									this.receipts.bossNumberE = phone
									this.receipts.staffNumberE = phone
								}


								//都 不支持给自己开单
								var a = this.vuex_user.phone === phone

								console.log("(是否为自己手机号码)", a);


								if (a) {
									this.$u.toast("此人员不支持开单~");
									this.clear()
									return;
								}

								//判断是否工作
								var b = this.vuex_user.data.work === "0";
								if (b) {
									//没有工作 出来了自己其他人都可以开单

									//不能给员工开单
									var b1 = this.vuex_user.phone === end.cRelation.bossNumber
									if (b1) {
										this.$u.toast("此人员不支持开单~");
										this.clear()
										return;
									}

								} else {
									//工作了 不能给老板开单  不能给同时开单

									//当前老板是否为当前输入号码
									var c1 = this.vuex_user.workData.bossNumber === phone
									if (c1) {
										this.$u.toast("此人员不支持开单~");
										this.clear()
										return;
									}

									//查询的当前老板是否为当前老板 公司同事
									var c2 = this.vuex_user.workData.bossNumber === end.cRelation.bossNumber
									if (c2) {
										this.$u.toast("此人员不支持开单~");
										this.clear()
										return;
									}

								}

							} else {
								console.log("是空的");
								this.receipts.phoneE = phone
								this.staffNumberEName = phone
								this.receipts.organizationE = this.searchCopy
								this.receipts.takeE = this.searchCopy
								this.receipts.bossNumberE = this.searchCopy
								this.receipts.staffNumberE = this.searchCopy
							}


						} catch (e) {
							//TODO handle the exception
							this.receipts.organizationE = this.searchCopy
							this.receipts.takeE = this.searchCopy
							this.receipts.bossNumberE = this.searchCopy

						}

					});
				} else {
					if (this.searchCopy != "") {
						this.receipts.organizationE = this.searchCopy
					} else {
						console.log("没有搜索记录");
					}
				}
				// console.log("是否全部为数字,", a);
			},
			searchIFNumberBlur(e) {
				var phone = e.target.value;
				if (this.searchDomain.verification) {
					this.receipts.organizationE = this.searchDomain.verification.enterpriseName;
				} else {
					this.receipts.organizationE = this.searchDomain.remark
					console.log("this.searchDomain.verification:", this.searchDomain.verification);
					console.log("this.searchDomain.remark:", this.searchDomain.remark);
					console.log("this.searchDomain.user", this.searchDomain.user);
				}
				if (this.searchDomain.user) {
					this.staffNumberEName = this.searchDomain.user.name
				}

			},
			clear() {
				this.searchCopy = ""
				this.receipts.bossNumberE = ""
				this.receipts.staffNumberE = ""
				this.receipts.organizationE = ""
				this.receipts.takeE = ""
				this.searchDomain = ""
			},
			getCurrentDate() {
				const date = new Date();
				const year = date.getFullYear();
				const month = ("0" + (date.getMonth() + 1)).slice(-2);
				const day = ("0" + date.getDate()).slice(-2);
				return `${year}-${month}-${day}`;
			},
			getCurrentDateEnd() {
				const date = new Date();
				const year = date.getFullYear();
				const month = ("0" + (date.getMonth() + 1)).slice(-2);
				const day = ("0" + date.getDate()).slice(-2);
				const hours = ("0" + date.getHours()).slice(-2);
				const minutes = ("0" + date.getMinutes()).slice(-2);
				const seconds = ("0" + date.getSeconds()).slice(-2);
				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			},
			save() {
				this.show = false
			},
			handleUpload(e, list) {
				this.imgList = list
			},
			ContinueBilling() {
				let receipts = this.receipts
				uni.removeStorageSync("inventoryStockpile")
				this.flushDBSX(receipts);
				receipts.inventoryList = []
				this.imgList = []
				this.orderItemList = []
				this.orderTotal = 0;
				this.shareShow = false
				this.getOrderNumber()
				this.addEmp()
				this.receipts.signatureDescr = ""
				// this.receipts.creationTime = this.getCurrentDate()
			},
			closePop() {

			},
			navBack() {
				uni.navigateBack()
				uni.removeStorageSync("inventoryStockpile")
			},
			navBackQB() {
				this.show = false
			},
			loadData() {
				this.loadOrderNo();
			},
			loadOrderNo() {
				this.receipts.bossNumberS = this.vuex_user.data.work != "0" ? this.vuex_user.workData.bossNumber : this
					.vuex_user.phone;
				this.receipts.staffNumberS = this.vuex_user.phone;

				this.receipts.jobNumberS = this.vuex_user.data.work != "0" ? this.vuex_user.workData.jobNumber : "";
				this.receipts.contactsS = this.vuex_user.data.work != "0" ? this.vuex_user.data.name || this.vuex_user.data
					.phoneNumber : this.vuex_user.phone;
				try {
					var res = JSON.parse(uni.getStorageSync('companyNameJSON'))
					console.log(res);
					this.receipts.bossNumberE = res.data.identity == "1" ? res.data.staffNumber : res.data.bossNumber;
					this.receipts.staffNumberE = res.data.staffNumber
					this.receipts.organizationE = res.company;
					this.receipts.takeE = res.data.name || res.data.staffNumber || res.data.bossNumber;
					this.receipts.phoneE = res.data.staffNumber || res.data.bossNumber;
					this.searchCopy = res.data.identity == "1" ? res.data.staffNumber : res.data.bossNumber;
					this.receipts.organizationEJc = res.data.jc || res.data.bossNumber;
					this.staffNumberEName = res.data.name || res.data.bossNumber
					uni.removeStorageSync('companyNameJSON');

				} catch (e) {
					console.log(uni.getStorageSync('companyNameJSON'));
				}
			},
			loadCustomer() {

			},
			loadProduct() {

			},
			// 点击近期商品
			recentlyClick(val) {
				this.addScroll()

				if (this.orderItemList.length == 1) {
					var a = this.orderItemList[0].unitPrice == "0.00"
					var b = this.orderItemList[0].description == "请输入"
					var end = a && b
					if (end) {
						this.orderItemList = []
					}
				}
				var ifwork = this.vuex_user.data.work == "0";
				this.orderItemList = [...this.orderItemList, {
					"id": "",
					"orderId": this.receipts.orderNumber,
					"phone": ifwork ? this.vuex_user.phone : this.vuex_user.workData.bossNumber,
					"staffNumber": this.vuex_user.phone,
					"description": val.description,
					"specification": "",
					"unit": val.unit,
					"quantity": "0.00",
					"unitPrice": val.unitPrice,
					"color": {
						"description": "transparent",
						"specification": "transparent",
						"unit": "transparent",
						"quantity": "transparent",
						"unitPrice": "transparent"
					}
				}]

			},
			// 返回首页
			goHome(path) {
				this.shareShow = false;
				this.formData = this.formTemp; //重置表单数据
				this.orderItemList = [];
				uni.switchTab({
					url: path
				})
			},
			// 查询客户详细信息
			phoneInput(e) {
				console.log('==== e :', e);
				var that = this;
				if (e.detail.value.length < 11) {
					return
				}
				if (e.detail.value == that.vuex_user.phoneNumber) {
					that.$u.toast("请勿输入自己的号码~");
					return
				}
				if (!that.$u.test.mobile(e.detail.value)) {
					that.$u.toast("请输入正确的手机号码~")
					return
				}
			},
			// 选择客户
			bindPickerChange(e) {

			},
			deleteItem(val, index) {
				const that = this;
				uni.showModal({
					title: '提示',
					content: '即将删除该产品，是否确定？',
					success: (res) => {
						if (res.confirm) {
							that.orderItemList.splice(index, 1)
							that.calcTotalPrice()
						} else {

						}
					}
				})
			},
			sendOrder() {



				this.receipts.bossNumberS = this.vuex_user.data.work != "0" ? this.vuex_user.workData.bossNumber : this
					.vuex_user.phone;
				this.receipts.staffNumberS = this.vuex_user.phone;

				this.receipts.price = this.orderTotal
				this.receipts.contactsS = this.vuex_user.data.name || this.vuex_user.phone
				this.receipts.state = '1'

				if (this.receipts.bossNumberE == "" || this.receipts.organizationE == "") {
					this.$u.toast("请填写名称~");
					return;
				}

				if (this.receipts.kSiteE.length > 16) {
					this.$u.toast("收货地址不能大于16位~");
					return;
				}

				if (this.orderTotal <= 0) {
					this.$u.toast("请输入发货清单");
					return;
				}

				var verify = false;
				var index = 0
				let shouldBreak = false;

				var aIndex = 0
				var bIndex = ""

				if (this.orderItemList.length == 0) {
					this.$u.toast("请填写清单~");
					return;
				}


				if (shouldBreak) {

					console.log(this.orderItemList[aIndex - 1]);
					console.log(aIndex, bIndex);
					this.orderItemList[aIndex - 1].color[bIndex] = "#FA5151"

					this.orderItemList = this.orderItemList
				} else {
					var that = this;


					this.orderItemList = this.orderItemList.map(item => {
						const {
							id,
							...rest
						} = item;
						return rest;
					});



					this.orderItemList = this.orderItemList

					this.receipts.inventoryList = this.orderItemList


					this.orderItemList.forEach(res => {
						// res.unit = this.formatDecimal(res.unit);
						res.quantity = this.formatDecimal(res.quantity)
					})

					this.orderItemList = this.orderItemList

					if (this.vuex_user.ac != null && this.vuex_user.ac != "") {
						try {
							this.receipts.enterpriseS = this.vuex_user.ac.enterpriseName
						} catch (e) {
							//TODO handle the exception
							console.log("捕获");
							console.log(this.vuex_user.ac != null || this.vuex_user.ac != "");
							console.log(this.vuex_user.ac != null);
						}

						this.receipts.enterpriseJc = this.vuex_user.ac.abbreviation
						this.receipts.enterpriseDz = this.vuex_user.ac.businessSite
					} else {
						if (this.vuex_work == "Y") {
							this.receipts.enterpriseS = this.vuex_user.workData.bossNumber
						} else {
							this.receipts.enterpriseS = this.vuex_user.phone;
						}

					}

					var listImg = []
					var bossNumber = this.vuex_work == "Y" ? this.vuex_user.workData.bossNumber : this.vuex_user.phone ||
						this
						.vuex_user.data.phoneNumber
					var jobNumber = this.vuex_work == "Y" ? that.vuex_user.workData.jobNumber : that.vuex_user.phone;
					for (let key in this.imgList) {
						uni.uploadFile({
							url: that.$u.http.config.baseUrl + '/edo/order/img',
							header: {
								phone: bossNumber,
								orderNumber: that.receipts.orderNumber,
								jobNumber: that.receipts.jobNumberS || jobNumber,
								token: that.vuex_user.loginToken
							},
							filePath: this.imgList[key].file.path,
							name: 'file',
							formData: {
								'imageType': "1"
							},
							success: (uploadFileRes) => {
								console.log(uploadFileRes);
								// that.receipts.picturesId.push(uploadFileRes.data)
							}
						});
					}

					console.log(this.searchCopy);
					console.log(this.receipts);
					console.log("最后结果 " + JSON.stringify(this.receipts));


					if (this.limitingCondition) {
						this.limitingCondition = false
						this.receipts.id = null;
						that.$u.post('/edo/order/add', this.receipts).
						then(res => {
							console.log(res);
							var code=res.data
							if (code.data == 1) {
								this.shareShow = true
								// this.staffNumberEName = ""
								this.limitingCondition = true
								this.$u.post('/edo/order/getByOrderNumber/' + this.receipts.orderNumber).
								then(res => {
									console.log("请求结果：" + res.data.data.post);
									this.transmitList = res.data.data;
									uni.removeStorageSync("inventoryStockpile")
									this.flushDBSX(this.receipts);
								}).catch(res => {

								})
							}else if(code.data==9){
								this.getOrderNumber();
								this.limitingCondition = true
								this.$u.toast(code.message);
							}else{
								this.shareShow = true
								this.limitingCondition = true
								this.$u.toast("添加失败，请检查网络~");
							}
						}).catch(res => {

						})
					} else {
						this.$u.toast("请勿重复点击~");
						return;
					}


				}
			},
			flushDBSX(val) {
				var list = [val.bossNumberS, val.staffNumberS, val.bossNumberE, val.staffNumberE]
				this.$u.post('/edo/rw/start?list=' + list).
				then(res => {
					console.log("请求结果：" + res);
				}).catch(res => {

				})
			},
			generateFiveDigitNumber() {
				return 10000 + Math.floor(Math.random() * 90000);
			},
			qaClick() {
				uni.showModal({
					title: '微信账号说明',
					content: '📢　客户微信对应的手机号，用此手机号登录微信小程序后可看到此单据',
					showCancel: false,
					confirmText: "知道了"
				})
			},
			contactClick() {
				// 拉取通信录
				let that = this;
				wx.chooseContact({
					success(res) {
						console.log(res, '回调成功')
						that.formData.customerAccount = res.phoneNumber;
					},
					fail: (res) => {
						console.log(res, '回调失败')
					},
					complete(res) {
						console.log(res, '结束回调')
					}
				})
			},
			ifInit(val) {
				return isNaN(parseFloat(val))
			},
			towDig(sunitPrice, squantity, item) {
				var unitPrice = parseFloat(sunitPrice);
				var quantity = parseFloat(squantity);
				if (isNaN(unitPrice) || isNaN(quantity)) {
					// 处理错误或提供默认值  
					console.error('unitPrice 或 quantity 不是有效的数字');
					// 假设我们提供一个默认值  
				}
				var unitPriceStr = unitPrice.toFixed(2);
				var quantityStr = quantity.toFixed(2);
				// 但我们不需要将字符串转换回数字来进行乘法运算，因为 toFixed 仅在显示时使用  
				var subtotal = unitPrice * quantity;

				if (isNaN(subtotal)) {
					return 0;
				} else {
					return Math.round(subtotal * 100) / 100;
				}

			},
			calcTotalPrice(e) {
				var _this = this;
				this.orderTotal = 0;
				this.orderItemList.forEach(function(item, index) {
					// 确保 item.unitPrice 和 item.quantity 是数字  
					var unitPriceStr = item.unitPrice;
					var quantityStr = item.quantity;
					_this.orderTotal += _this.towDig(quantityStr, unitPriceStr, item);
				});
				// 将结果转换为指定小数位数
				this.orderTotal = Math.round(this.orderTotal * 100) / 100;
			},
			formatDecimal(value) {
				// 将数字转换为浮点数，以确保我们可以进行数学运算  
				var num = parseFloat(value);

				// 检查是否为有效的数字  
				if (isNaN(num)) {
					return "Invalid number";
				}

				// 使用toFixed()方法保留两位小数，并返回字符串  
				return num.toFixed(3);
			},
			callPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			// 切换角色
			checkRole() {
				this.$refs.popRole.roleShow = true
			},
			alertAdd() {
				uni.navigateTo({
					url: "./table"
				})
			},
			addScroll() {
				const query = wx.createSelectorQuery().in(this);
				query.select('.scroll-view-class').boundingClientRect();
				query.selectViewport().scrollOffset();
				query.exec((res) => {
					const scrollViewHeight = res[0].height;
					const contentHeight = res[1].scrollHeight;
					this.scrollTop = contentHeight + 100
					console.log(scrollViewHeight, res);
				});
			},
			// 添加新产品
			addProduct() {
				this.addScroll()
				if (this.receipts.orderNumber == '') {
					this.$u.toast("请先选择发货日期~");
				} else {
					var ifwork = this.vuex_user.data.work == "0";
					this.orderItemList = [...this.orderItemList, {
						"id": "",
						"orderId": this.receipts.orderNumber,
						"phone": ifwork ? this.vuex_user.phone : this.vuex_user.workData.bossNumber,
						"staffNumber": this.vuex_user.phone,
						"description": "请输入",
						"specification": "请输入",
						"unit": "请输入",
						"quantity": "0.00",
						"unitPrice": "0.00",
						"color": {
							"description": "transparent",
							"specification": "transparent",
							"unit": "transparent",
							"quantity": "transparent",
							"unitPrice": "transparent"
						}
					}]
				}

				console.log(this.orderItemList);
			},
			sendHide() {
				this.sendShow = false;
				console.log(this.sendShow);
			},
			// 获取选择的时间
			getConfirm(e) {
				console.log("已经修改时间", e.result);
				this.receipts.creationTime = e.result; //传给接口
			},
			getOrderNumber() {
				var ifphon = this.vuex_work == "Y" ? this.vuex_user.workData.bossNumber : this.vuex_user.phone;
				var path = "?time=" + this.getCurrentDate() + "&phone=" + ifphon;
				console.log("path==", path);
				this.$u.post('/edo/order/getNumber' + path).
				then(res => {
					console.log(res);
					this.receipts.orderNumber = res.data.data
				}).catch(res => {

				})
			},
			digitUppercase(n = 0) {
				if (n === 0) {
					return "-"
				}
				var fraction = ['角', '分'];
				var digit = [
					'零', '壹', '贰', '叁', '肆',
					'伍', '陆', '柒', '捌', '玖'
				];
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
				return head + s.replace(/(零.)*零元/, '元')
					.replace(/(零.)+/g, '零')
					.replace(/^整$/, '零元整');
			}
		},

	};
</script>

<style lang="scss">
	.form-cover {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .5);
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
				color: #333
			}
		}
	}

	.table-input {
		color: #D8D8D8;
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
			// border: 1px solid #333;
			z-index: 1;
			border-radius: 100rpx;
			background: transparent;
		}
	}
</style>
<style>
	.handcolor {
		color: #333333;
		font-size: 16px;
	}

	.handcolorClear {
		color: #666666;
		font-size: 14px;
	}

	.textcolor {
		color: #666666;
		font-size: 14px;
		font-weight: 500;
	}

	.endcolor {
		font-size: 14px;
		font-weight: 500;
	}

	.placeholder_class {
		color: #D8D8D8;
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