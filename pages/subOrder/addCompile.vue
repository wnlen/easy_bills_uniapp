<template>
	<view class="vh100 pb60 flex-col justify-center" style="background-color: #ffffff" :class="showCalendar ? 'body-no-scroll' : ''">
		<u-navbar
			:autoBack="true"
			:placeholder="true"
			:custom-back="navBack"
			:border-bottom="false"
			:titleBold="true"
			title-color="#000000"
			title="订单修改"
			title-size="34"
			bgColor="#ffffff"
		></u-navbar>

		<view v-if="!identity" class="flex-row justify-center items-center absolute" style="width: 100%; top: 30%">
			<u-image src="https://res-oss.elist.com.cn/wxImg/order/cw.svg" width="600rpx" height="400rpx"></u-image>
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
						? pinia_user.ac
							? pinia_user.ac.enterpriseName || pinia_user.ac.phone
							: pinia_user.phone
						: pinia_user.ac
						? pinia_user.ac.enterpriseName
						: pinia_user.workData.bossNumber
				}}发货单
			</view>
		</view>

		<view class="form-wrap pt20 absolute" style="background-color: #ffffff" v-if="pinia_userRole == 'D' && shareShow == false && identity">
			<view class="form-inner flex-col" style="font-size: 28rpx; background-color: #ffffff">
				<view class="flex-col justify-left">
					<u-image v-if="pinia_user.eorderLogo" :src="pinia_user.eorderLogo" width="152" height="60" mode="aspectFill" />
					<view class="ft-bold handcolor">发货单信息</view>
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
						<input disabled placeholder-class="placeholder_class" type="text" v-model="receipts.organizationE" placeholder="请输入手机号" class="flex-1 endcolor" />
					</view>
					<view class="flex-row items-center width100 pt20 pb20 u-border-bottom">
						<text class="textcolor" style="width: 106rpx">收货方:</text>
						<input
							disabled
							placeholder-class="placeholder_class"
							type="text"
							v-model="staffNumberEName"
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
								<u-line class="" color="#D8D8D8" length="50rpx" direction="col"></u-line>
							</view>
							<u-icon size="45rpx" name="https://res-oss.elist.com.cn/wxImg/order/time.png"></u-icon>
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
						<text class="textcolor" style="width: 106rpx">收货人:</text>
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
							maxlength="11"
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
					<view class="flex-row justify-between items-center">
						<text class="line34 ft-bold handcolor pt24">发货清单</text>
					</view>
				</view>
			</view>

			<scroll-view enhanced :show-scrollbar="false" scroll-y="true" style="background-color: #f4f4f4; max-height: 670rpx; margin-top: 12rpx">
				<view style="width: 100%; background-color: #ffffff" v-for="(item, index) in orderItemList" :key="index" @click="merchandiseInventory(false)" class="mb12 mt12">
					<view class="flex-row pt24 pb24" style="width: 100%">
						<view style="width: 10%" class="ml20">品名:</view>
						<view style="color: #666666" class="up-line-1 flex-1">{{ item.description }}</view>
						<view style="width: 10%" class="ml20">规格:</view>
						<view style="color: #666666" class="up-line-1 flex-1">{{ item.specification }}</view>
					</view>
					<view class="flex-row items-center justify-center" style="width: 100%">
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
							<u-td>{{ item.quantity }}</u-td>
							<u-td>{{ item.unit }}</u-td>
							<u-td>{{ item.unitPrice }}</u-td>
							<u-td>
								<text style="width: 200rpx" class="up-line-1">
									￥{{ item.quantity != '-' && item.quantity != '' ? formatAmount(item.unitPrice * item.quantity) : 0 }}
								</text>
							</u-td>
						</u-tr>
					</u-table>
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
					<u-line color="#E0E0E0"></u-line>
				</view>
				<view class="pd12 flex-row justify-center" style="width: 100%">
					<view class="flex-row justify-center items-center" style="width: 49%">
						<u-icon labelPos="bottom" @click="merchandiseInventory(true)" name="https://res-oss.elist.com.cn/wxImg/order/bj.svg" size="70rpx" label="修改"></u-icon>
					</view>
					<view class="flex-row justify-center items-center" style="width: 2%">
						<u-line direction="col" length="50" color="#E0E0E0" />
					</view>
					<view class="flex-row justify-center items-center" style="width: 49%">
						<u-icon
							labelPos="bottom"
							@click="merchandiseInventory(false)"
							name="https://res-oss.elist.com.cn/wxImg/order/spk.svg"
							size="70rpx"
							label="添加商品"
						></u-icon>
					</view>
				</view>
			</view>

			<view class="form-inner-card flex-col" style="font-size: 28rpx; background-color: #ffffff">
				<view v-if="recentlyData" class="flex-row justify-between items-center mt45 ft-bold">
					<text class="line34 handcolor">相关图片/票据</text>
				</view>

				<view class="flex-row flex-wrap mt40" style="width: 95%">
					<u-upload
						autoDelete
						autoUploadDriver="local"
						v-model:fileList="fileList"
						:maxSize="10485760"
						:maxCount="3"
						width="100"
						height="100"
						multiple
						:previewFullImage="true"
						@afterRead="handleUpload"
					>
						<u-icon :name="ImgUrl + '/wxImg/order/down.png'" size="200rpx"></u-icon>
					</u-upload>
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
							<view class="textcolor pt20 pb20">
								<text>企业名称:</text>
								<text :style="{ color: '#333333' }" class="ml15 endcolor">{{ receipts.enterpriseS }}</text>
							</view>
							<view class="textcolor pt20 pb20">
								<text>联系人:</text>
								<text :style="{ color: '#333333' }" class="ml15 endcolor">{{ receipts.contactsS }}</text>
							</view>
							<view class="textcolor pt20 pb20">
								<text>联系电话:</text>
								<text class="ml15 endcolor" :style="{ color: '#333333' }" @click="callPhone(receipts.bossNumberS)">{{ receipts.bossNumberS }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="mt60 pl20 pr20 pb30">
				<u-button type="primary" class="form-btn-big" hover-class="none" color="#01BB74" @click="sendOrder" shape="circle">修改订单</u-button>
			</view>
		</view>
		<!-- 		<u-select mode="single-column" label-name="productName" value-name="id" :list="selectList" v-model="selectShow"
			@confirm="selectConfirm"></u-select> -->

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
			transmitList: [],
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
			newImg: [],
			showCalendar: false
		};
	},
	onShow() {
		this.defImg();

		if (uni.getStorageSync('updInventoryStockpile') != undefined && uni.getStorageSync('updInventoryStockpile') != null && uni.getStorageSync('updInventoryStockpile') != '') {
			this.orderItemList = uni.getStorageSync('updInventoryStockpile');

			this.add();
			uni.removeStorageSync('updInventoryStockpile');
		}
	},
	onLoad(options) {
		uni.removeStorageSync('updInventoryStockpile');
		uni.$api.order
			.getOrderById({
				orderId: options.orderId
			})
			.then((res) => {
				var data = res.data.data.post;
				data.creationTime = this.$u.timeFormat(data.creationTime, 'yyyy-mm-dd');
				this.receipts = data;

				this.staffNumberEName = this.receipts.takeE;
				// this.searchIFNumber(this.staffNumberEName)
				this.orderItemList = [
					...this.orderItemList,
					...res.data.data.orderItemList.map((item) => ({
						...item,
						color: {
							description: 'transparent',
							specification: 'transparent',
							unit: 'transparent',
							quantity: 'transparent',
							unitPrice: 'transparent'
						}
					}))
				];

				// uni.setStorageSync("updInventoryStockpile", this.orderItemList)
				this.fileList = res.data.data.imgList;
				this.add();
			})
			.catch((res) => {});
	},
	methods: {
		add() {
			this.orderTotal = 0;
			this.orderItemList.forEach((res) => {
				this.orderTotal = this.orderTotal + res.quantity * res.unitPrice;
			});
		},
		modification() {
			uni.navigateTo({
				url: 'modification'
			});
		},
		merchandiseInventory(type) {
			uni.setStorageSync('updInventoryStockpile', this.orderItemList);
			uni.navigateTo({
				url: '/pages/subOrder/merchandiseInventory?type=' + (type ? 1 : 0) + '&update=1'
			});
		},
		defImg() {
			this.action = uni.$http.config.baseURL + 'order/imgA';
		},
		handleUpload(res) {
			console.log('图片', res);
			this.imgList = res.file;
			this.fileList = res.file;
		},
		getCurrentDate() {
			const date = new Date();
			date.setDate(date.getDate() + 15);
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
		ifInput(val) {
			if (val === '') {
				return '#D8D8D8';
			} else {
				return '#333333';
			}
		},
		ifColor(val) {
			if (val != '请输入' && val != '0.00' && val != '') {
				return true;
			} else {
				return false;
			}
		},
		navBack() {
			uni.navigateBack();
		},
		sendOrder() {
			this.receipts.inventoryList = this.orderItemList;

			//验证
			if (this.receipts.bossNumberE == '') {
				this.$u.toast('请输入客户手机号~');
				return;
			}

			if (this.receipts.kSiteE.length > 16) {
				this.$u.toast('收货地址不能大于16位~');
				return;
			}

			var verify = false;
			var index = 0;
			let shouldBreak = false;

			var aIndex = 0;
			var bIndex = '';

			if (this.orderItemList.length == 0) {
				this.$u.toast('请填写清单~');
				return;
			}

			if (shouldBreak) {
				this.orderItemList[aIndex - 1].color[bIndex] = '#FA5151';

				this.orderItemList = this.orderItemList;
			} else {
				var that = this;
				this.orderItemList.forEach((res) => {
					Object.keys(res).forEach((key) => {
						if (res[key] === '请输入') {
							res[key] = '';
						}
					});
				});
			}

			this.orderItemList = this.orderItemList.map((item) => {
				item.orderId = this.receipts.orderNumber;
				const { id, ...rest } = item;
				return rest;
			});

			this.receipts.inventoryList = this.orderItemList;
			if (this.imgList.length <= 0) {
			} else {
				//上传图片
				var listImg = [];
				var bossNumber = this.pinia_work == 'Y' ? this.pinia_user.workData.bossNumber : this.pinia_user.phone || this.pinia_user.data.phoneNumber;
				var jobNumber = this.pinia_work == 'Y' ? that.pinia_user.workData.jobNumber : that.pinia_user.phone;
				for (let key in this.imgList) {
					if (this.imgList[key].url) {
						console.log('上传本地图片', this.imgList[key].url);
						uni.uploadFile({
							url: uni.$http.config.baseURL + 'order/img',
							header: {
								phone: bossNumber,
								orderNumber: that.receipts.orderNumber,
								jobNumber: that.receipts.jobNumberS || jobNumber
							},
							filePath: this.imgList[key].url,
							name: 'file',
							formData: {
								imageType: '1'
							},
							success: (uploadFileRes) => {
								console.log('上传成功', uploadFileRes);
							}
						});
					}
				}
			}

			this.receipts.price = this.orderTotal;
			this.receipts.inventoryList = this.orderItemList;
			this.receipts.imgList = this.newImg;

			if (this.limitingCondition) {
				this.limitingCondition = false;
				let receiptsData = JSON.parse(JSON.stringify(this.receipts));
				receiptsData.creationTime = receiptsData.creationTime + ' 00:00:00';
				uni.$api.order
					.editOrder(receiptsData)
					.then((res) => {
						this.$u.toast(res.data.message);
						if (res.data.data == 1) {
							uni.removeStorageSync('updInventoryStockpile');
						}
						setTimeout(function () {
							uni.navigateBack();
						}, 200);
					})
					.catch((res) => {});
			} else {
				this.$u.toast('请勿重复点击~');
				return;
			}
		},
		flushDBSX(val) {
			var list = [val.bossNumberS, val.staffNumberS, val.bossNumberE, val.staffNumberE];
			uni.$api.task
				.startRWFlow({ list: list })
				.then((res) => {})
				.catch((res) => {});
		},
		callPhone(phone) {
			uni.makePhoneCall({
				phoneNumber: phone
			});
		},
		searchIFNumber(phone) {
			uni.$api.user
				.searchUserAddOrder({
					phone: phone,
					state: 1
				})
				.then((res) => {
					this.staffNumberEName = res.data.data.user.name;
				});
		},
		// 获取选择的时间
		getConfirm(e) {
			this.showCalendar = false;
			this.receipts.creationTime = e.fulldate; //传给接口
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

<style lang="scss">
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
	/* 子元素平分宽度 */
	margin: 0;
	/* 可选：给子元素添加一些间距 */
	/* 其他样式，如高度、背景色等 */

	/* 		display: flex;
	    flex-direction: row;
		justify-content: center;
		align-items: center; */
}
</style>
