<template>
	<view
		class="vh100 vw100"
		:style="{ backgroundImage: show == 0 ? 'url(https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/obj/bg.png)' : '' }"
		style="background-size: cover"
	>
		<view v-show="show == 1">
			<u-navbar
				:border-bottom="false"
				back-icon-color="#000000"
				:titleBold="true"
				title-color="#000000"
				title="货单详情"
				:custom-back="shareClick"
				title-size="34"
				bgColor="#ffffff"
			></u-navbar>
			<view class="content">
				<!-- 正文内容 -->
			</view>
		</view>
		<view v-if="show == 1" class="height80 fixed-bar-height">
			<view class="ml20 mr20">
				<view class="flex-row" style="margin-top: 2%">
					<view class="" style="width: 20%">
						<!-- <u-image src="https://res-oss.elist.com.cn/wxImg/order/orderLog.svg" width="100px"
							height="29px"></u-image> -->
						<u-image mode="scaleToFill" src="https://res-oss.elist.com.cn/wxImg/order/logo.svg" width="100px" height="40px"></u-image>
					</view>
					<view class="flex-row justify-center items-center" style="width: 60%">
						<u-image src="@/static/img/order/dd2x.svg" width="146px" height="22px"></u-image>
					</view>
					<view class="" style="width: 20%"></view>
				</view>

				<view class="width100 flex-row pt15" style="height: 4vh">
					<view class="flex-row justify-center items-center" style="width: 100%; font-weight: 600">
						<view class="mb10 syst ft-zjj-1" style="text-align: left; color: #333333; font-size: 18px; font-weight: 600">
							<text>{{ post.enterpriseS || post.bossNumberS || '' }}</text>
						</view>
					</view>
				</view>

				<view class="bg-white pb350 flex-co mt10">
					<view v-if="wxType == 0 || wxType == undefined" class="absolute" style="right: 10px">
						<u-image
							v-if="post.paymentState == '0' && vuex_userRole != 'R'"
							src="https://res-oss.elist.com.cn/wxImg/order/dqs.png"
							width="120px"
							height="120px"
						></u-image>
						<u-image
							v-if="post.paymentState == '0' && vuex_userRole == 'R'"
							src="https://res-oss.elist.com.cn/wxImg/order/dqs-r.png"
							width="120px"
							height="120px"
						></u-image>
						<u-image v-if="post.paymentState == '1'" src="https://res-oss.elist.com.cn/wxImg/order/yqs.png" width="120px" height="120px"></u-image>
						<u-image
							v-if="post.paymentState == '2' && vuex_userRole != 'R'"
							src="https://res-oss.elist.com.cn/wxImg/order/ysk.png"
							width="120px"
							height="120px"
						></u-image>
						<u-image
							v-if="post.paymentState == '2' && vuex_userRole == 'R'"
							src="https://res-oss.elist.com.cn/wxImg/order/yfk.png"
							width="120px"
							height="120px"
						></u-image>
					</view>

					<view v-if="wxType == 1 && ShowFXE" class="absolute" style="right: 10px">
						<u-image v-if="post.paymentState == '0' && port == 'D'" src="https://res-oss.elist.com.cn/wxImg/order/dqs.png" width="120px" height="120px"></u-image>
						<u-image v-if="post.paymentState == '0' && port == 'R'" src="https://res-oss.elist.com.cn/wxImg/order/dqs-r.png" width="120px" height="120px"></u-image>
						<u-image v-if="post.paymentState == '1' && port == 'D'" src="https://res-oss.elist.com.cn/wxImg/order/yqs.png" width="120px" height="120px"></u-image>
						<u-image v-if="post.paymentState == '1' && port == 'R'" src="https://res-oss.elist.com.cn/wxImg/order/yqs.png" width="120px" height="120px"></u-image>
						<u-image v-if="post.paymentState == '2' && port == 'D'" src="https://res-oss.elist.com.cn/wxImg/order/ysk.png" width="120px" height="120px"></u-image>
						<u-image v-if="post.paymentState == '2' && port == 'R'" src="https://res-oss.elist.com.cn/wxImg/order/yfk.png" width="120px" height="120px"></u-image>
					</view>

					<view v-if="wxType == 1 && LookShar == 'S'" class="absolute" style="right: 10px">
						<u-image v-if="post.paymentState == '0'" src="https://res-oss.elist.com.cn/wxImg/order/dqs.png" width="120px" height="120px"></u-image>
						<u-image v-if="post.paymentState == '1'" src="https://res-oss.elist.com.cn/wxImg/order/yqs.png" width="120px" height="120px"></u-image>
						<u-image v-if="post.paymentState == '2'" src="https://res-oss.elist.com.cn/wxImg/order/yfk.png" width="120px" height="120px"></u-image>
					</view>

					<view v-if="wxType == 1 && LookShar == 'F'" class="absolute" style="right: 10px">
						<u-image v-if="post.paymentState == '0'" src="https://res-oss.elist.com.cn/wxImg/order/dqs-r.png" width="120px" height="120px"></u-image>
						<u-image v-if="post.paymentState == '1'" src="https://res-oss.elist.com.cn/wxImg/order/yqs.png" width="120px" height="120px"></u-image>
						<u-image v-if="post.paymentState == '2' && port == 'R'" src="https://res-oss.elist.com.cn/wxImg/order/yfk.png" width="120px" height="120px"></u-image>
					</view>

					<!-- <view v-if="wxType==1&&!ShowFXE" class="absolute" style="right: 10px;">
						<u-image v-if="post.paymentState=='0'&&port=='D'"
							src="https://res-oss.elist.com.cn/wxImg/order/dqs.png" width="120px"
							height="120px"></u-image>
						<u-image v-if="post.paymentState=='0'&&port=='R'"
							src="https://res-oss.elist.com.cn/wxImg/order/dqs-r.png" width="120px"
							height="120px"></u-image>
						<u-image v-if="post.paymentState=='1'&&port=='D'"
							src="https://res-oss.elist.com.cn/wxImg/order/yqs.png" width="120px"
							height="120px"></u-image>
						<u-image v-if="post.paymentState=='1'&&port=='R'"
							src="https://res-oss.elist.com.cn/wxImg/order/yqs.png" width="120px"
							height="120px"></u-image>
						<u-image v-if="post.paymentState=='2'&&port=='D'"
							src="https://res-oss.elist.com.cn/wxImg/order/ysk.png" width="120px"
							height="120px"></u-image>
						<u-image v-if="post.paymentState=='2'&&port=='R'"
							src="https://res-oss.elist.com.cn/wxImg/order/yfk.png" width="120px"
							height="120px"></u-image>
					</view>
					
					
					<view v-if="wxType==1&&ShowFXE" class="absolute" style="right: 10px;">
						<u-image v-if="post.paymentState=='0'&&port=='D'"
							src="https://res-oss.elist.com.cn/wxImg/order/dqs-r.png" width="120px"
							height="120px"></u-image>
						<u-image v-if="post.paymentState=='0'&&port=='R'"
							src="https://res-oss.elist.com.cn/wxImg/order/dqs.png" width="120px"
							height="120px"></u-image>
						<u-image v-if="post.paymentState=='1'&&port=='D'"
							src="https://res-oss.elist.com.cn/wxImg/order/yqs.png" width="120px"
							height="120px"></u-image>
						<u-image v-if="post.paymentState=='1'&&port=='R'"
							src="https://res-oss.elist.com.cn/wxImg/order/yqs.png" width="120px"
							height="120px"></u-image>
						<u-image v-if="post.paymentState=='2'&&port=='D'"
							src="https://res-oss.elist.com.cn/wxImg/order/yfk.png" width="120px"
							height="120px"></u-image>
						<u-image v-if="post.paymentState=='2'&&port=='R'"
							src="https://res-oss.elist.com.cn/wxImg/order/ysk.png" width="120px"
							height="120px"></u-image>
					</view> -->

					<view class="pd20 black-border-top black-border-left black-border-right">
						<view class="flex-row" style="font-family: ddbh">
							<u-icon size="50" name="https://res-oss.elist.com.cn/wxImg/order/number.svg"></u-icon>
							<text class="ml10 mt10" style="color: #fa5151; font-size: 15px">{{ post.orderNumber || '' }}</text>
						</view>
						<view class="flex-row mt13 xqcss">
							<view class="">发货日期：</view>
							<view class="yrd mt5">{{ $u.timeFormat(post.creationTime, 'yyyy-mm-dd') || '' }}</view>
						</view>
						<view class="flex-row mt13 xqcss">
							<view class="">购货单位：</view>
							<view class="yrd mt5">
								{{ post.organizationE || '' }}
							</view>
						</view>
						<view class="flex-row mt13 xqcss">
							<view class="">联系人：</view>
							<text class="yrd mt5">{{ post.kTakeE || '' }}</text>
						</view>
						<view class="flex-row mt13 xqcss">
							<view class="">联系电话：</view>
							<text class="yrd mt5">{{ post.kPhoneE || '' }}</text>
						</view>
						<view class="flex-row mt13 xqcss">
							<view class="">收货地址：</view>
							<text class="yrd mt5">{{ post.kSiteE || '' }}</text>
						</view>
					</view>

					<view class="form-middle" style="overflow-x: auto">
						<view class="table-container" v-show="wxType != 1">
							<view class="table">
								<view class="table-header flex-row justify-center items-center">
									<view class="table-cell">品名</view>
									<view class="table-cell">规格</view>
									<view class="table-cell">单位</view>
									<view class="table-cell">数量</view>
									<view class="table-cell">单价</view>
									<view class="table-cell">金额</view>
								</view>
								<view class="table-row" v-for="(item, index) in orderItemList" :key="index">
									<view class="table-cell flex-col justify-center items-center">
										<text class="ft24 line25 text-center">{{ item.description }}</text>
									</view>
									<view class="table-cell flex-col justify-center items-center">
										<text class="ft24">{{ item.specification || '-' }}</text>
									</view>
									<view class="table-cell flex-col justify-center items-center">
										<text class="ft24">{{ item.unit || '-' }}</text>
									</view>
									<view class="table-cell flex-col justify-center items-center">
										<text class="ft24">{{ item.quantity }}</text>
									</view>
									<view class="table-cell flex-col justify-center items-center">
										<text class="ft24">{{ item.unitPrice }}</text>
									</view>
									<view class="table-cell flex-col justify-center items-center">
										<text class="ft24">{{ towDig(item.quantity, item.unitPrice) }}</text>
									</view>
								</view>
							</view>
						</view>

						<view class="table-container">
							<view class="table" v-show="wxType == 1">
								<view class="table-header flex-row justify-center items-center">
									<view class="table-cell">品名</view>
									<view class="table-cell">规格</view>
									<view class="table-cell">单位</view>
									<view class="table-cell">数量</view>
									<view class="table-cell">单价</view>
									<view class="table-cell">金额</view>
								</view>
								<view class="table-row" v-for="(item, index) in orderItemList" :key="index">
									<view class="table-cell flex-col justify-center items-center">
										<text class="ft24 line25 text-center">{{ item.description }}</text>
									</view>
									<view class="table-cell flex-col justify-center items-center">
										<text class="ft24">{{ item.specification || '-' }}</text>
									</view>
									<view class="table-cell flex-col justify-center items-center">
										<text class="ft24">{{ item.unit || '-' }}</text>
									</view>
									<view class="table-cell flex-col justify-center items-center">
										<text class="ft24">{{ item.quantity }}</text>
									</view>
									<view class="table-cell flex-col justify-center items-center">
										<text class="ft24">{{ versions == 'Y' ? item.unitPrice : '****' }}</text>
									</view>
									<view class="table-cell flex-col justify-center items-center">
										<text class="ft24">{{ versions == 'Y' ? towDig(item.quantity, item.unitPrice) : '****' }}</text>
									</view>
								</view>
							</view>
						</view>

						<view class="xqcss pd10 pt10 pb10 black-border-left black-border-right">
							<text class="ml10 xqcss">合计：</text>
							<text class="xqcss">¥ {{ versions == 'Y' ? DigPrice(post.price) || '' : '****' }}</text>
						</view>
						<view class="xqcss pd10 pt10 pb10 black-border-top black-border-bottom black-border-left black-border-right">
							<text class="ft-bold ml10 xqcss">金额大写：</text>
							<text class="yrd">{{ versions == 'Y' ? digitUppercase(post.price) : '****' }}</text>
						</view>

						<view
							class="xqcss pd10 black-border-bottom flex-row items-center black-border-bottom black-border-left black-border-right"
							:style="{ height: post.signatureImg != '' ? '7vh' : '' }"
						>
							<view class="ml10">
								<text class="xqcss">购买单位 / 购买人：</text>
							</view>
							<view class="" style="">
								<image
									v-if="post.signatureImg != ''"
									:src="post.signatureImg"
									style="transform: rotate(270deg) translateY(20%); width: 60px"
									class=""
									mode="widthFix"
								></image>
								<text v-else>{{ post.signatureImg || '' }}</text>
							</view>
						</view>

						<view class="xqcss pt35 flex-row items-center black-border-left black-border-right" style="height: 12vh" v-if="imgList.length > 0">
							<view class="ml20" style="" v-for="(item2, index2) in imgList" :key="index2">
								<u-image :src="item2.url" shape="square" width="150rpx" height="150rpx" @click="bigImg(item2.url)">
									<up-loading-icon slot="loading"></up-loading-icon>
								</u-image>
							</view>
						</view>

						<view class="xqcss flex-row items-center black-border-left black-border-right pt20 xqcss" v-if="post.signatureDescr != ''">
							<view class="flex-row ml20 mt10 bz">
								<text>备注：</text>
								<text class="bzhh">{{ post.signatureDescr || '' }}</text>
							</view>
						</view>

						<view class="xqcss flex-row items-center black-border-left black-border-right pt20 xqcss">
							<view class="flex-row ml20">
								<text>供应商名称：</text>
								<text>{{ post.enterpriseS || '' }}</text>
							</view>
						</view>

						<view class="xqcss flex-row items-center black-border-left black-border-right xqcss">
							<view class="flex-row ml20 mt14">
								<text class="ft-bold xqcss">供应商地址：</text>
								<text>{{ post.enterpriseDz || '' }}</text>
							</view>
						</view>

						<view class="xqcss flex-row items-center black-border-left black-border-right xqcss">
							<view class="flex-row ml20 mt14">
								<text>联系人：</text>
								<text>{{ post.contactsS }}</text>
							</view>
						</view>

						<view class="xqcss flex-row items-center black-border-left black-border-right black-border-bottom xqcss pb38">
							<view class="flex-row ml20 mt14" @click="callPhone(post.contactsS)">
								<text>联系电话：</text>
								<!-- 	<text>{{post.bossNumberS}}</text> -->
								<text>{{ post.staffNumberS }}</text>
							</view>
						</view>
					</view>
					<!-- <view class="flex-row justify-left items-center mt15 pd10 relative" v-if="wxType!=1"
						style="width: 100%;color: #aaaaaa;background-color: #F5FCF9;border-radius: 3px;height: 40px;">
						<view class="flex-row justify-between ml10 mb4"
							style="border-bottom: 1px solid #01BB74;left: 10px;" @click="print">
							<u-icon name="https://res-oss.elist.com.cn/wxImg/print/print.svg" label-color="#01BB74"
								label="打印单据" size="40"></u-icon>
						</view>
						<view class="flex-end absolute" style="right: 20rpx;">
							已打印{{PrintNum}}次
						</view>
					</view> -->
					<view class="flex-row justify-left items-center mt12">
						<view
							class="flex-row justify-left items-center mt15 relative"
							v-if="wxType != 1"
							style="width: 68%; color: #aaaaaa; background-color: #f5fcf9; border-radius: 3px; height: 40px"
						>
							<view class="flex-row justify-between ml10 mb4" style="border-bottom: 1px solid #01bb74; left: 10px" @click="print">
								<u-icon name="https://res-oss.elist.com.cn/wxImg/print/print.svg" label-color="#01BB74" label="打印单据" size="40"></u-icon>
							</view>
							<view class="flex-end absolute" style="right: 20rpx">已打印{{ PrintNum }}次</view>
						</view>
						<view
							class="flex-row justify-center items-center mt15"
							@click="DownPdf(post)"
							style="background: #fffbdd; border-radius: 3px; color: #ffc300; width: 28%; margin-left: 3%; height: 40px"
						>
							<view style="border-bottom: 1px solid #ffc300; padding-bottom: 1rpx; padding-top: 3rpx; font-weight: 500">下载PDF</view>
						</view>
					</view>
				</view>
				<view class="recently-cat flex-row flex-wrap mt10">
					<text v-for="(item, index) in recentlyData" @click="recentlyClick(item)" :key="index">{{ item.productName }}</text>
				</view>
			</view>
		</view>

		<u-popup v-model="showZG" mode="center" border-radius="14" width="500rpx" height="60%">
			<image style="width: 100%; height: 100%" :src="showZGImg" mode="aspectFit"></image>
		</u-popup>

		<u-popup class="flex-col justify-center items-center" border-radius="15" mode="center" v-model="showMask" width="600rpx" height="400rpx">
			<view class="flex-col justify-center items-center relative" style="height: 100%; width: 100%">
				<view class="absolute pt20" style="width: 100%; top: 0; height: 75%">
					<view class="flex-row items-center justify-center passwordTitle">请输入签收密码</view>
					<view class="flex-col items-center justify-center mt20" style="width: 100%; height: 35%">
						<u-message-input @change="changePassword" @finish="finishPassword" :dot-fill="true" :value="password" mode="box"></u-message-input>
						<view class="mt20 err" v-show="err">密码错误，请重新输入</view>
					</view>
					<view @click="goPath('/pages/subUser/resetpassword')" class="ft12 pr30 flex-row justify-end pt15" style="color: #999; width: 100%">找回密码</view>
				</view>
				<view class="flex-row items-center absolute u-border-top" style="width: 100%; bottom: 0; height: 25%">
					<view @click="cancel" style="width: 50%; height: 100%" class="titlePas flex-col justify-center items-center">取消</view>
					<view @click="confirm" style="width: 50%; height: 100%" class="titlePasOK flex-col justify-center items-center u-border-left">确认</view>
				</view>
			</view>
		</u-popup>

		<u-popup v-model="showBrowsePrint" :custom-style="customStylePrint" mode="center" border-radius="14" width="650rpx" :height="showBrowsePrintHeight">
			<view class="w100 pt30 relative flex-col items-center" style="height: 100%; box-shadow: 1px 1px 1px 1px rgba(153, 153, 153, 0.05)">
				<scroll-view scroll-y="true" class="u-border pt20 pb20" style="width: 90%; overflow-y: auto" :style="{ height: ImageSoleHeight }">
					<u-image width="100%" :src="item" mode="widthFix" v-for="(item, index) in browse" :show-menu-by-longpress="false" :key="index"></u-image>
				</scroll-view>

				<view
					@click="print(1)"
					class="absolute flex-col justify-center items-center"
					style="bottom: 15px; width: 148.54px; height: 40px; border-radius: 5px; background-color: #01bb74; color: white"
				>
					确认打印
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			color: '#01BA74',
			colorT: '#01BA74',
			show: 0,
			title: '货单详情',
			background: {
				'background-image': 'linear-gradient(45deg, #fff, #fff)'
			},
			orderId: '',
			type: 1,
			vipShow: false,
			contactShow: false,
			post: [],
			orderItemList: [],
			imgList: [],
			salerData: {},
			//  签收人
			qsrShow: false,
			qsrList: [],
			qyList: [],
			showZG: false,
			showZGImg: '',
			wxLoginRes: '',
			text: true,
			text2: false,
			customStyle: {
				width: '300px',
				height: '60px',
				backgroundColor: '#ECFAF4',
				color: '#01BB74',
				fontSize: '18px',
				fontWeight: 600
			},
			customStylePrint: {
				padding: '20rpx'
			},
			wxType: 0,
			sharePhone: '',
			ultimatelyPhone: '',
			port: '',
			versions: 'Y',
			navbar: true,

			showMask: false,
			password: '',
			err: false,
			browse: [],
			showBrowsePrint: false,
			showBrowsePrintHeight: '300px',
			ImageSoleHeight: '200px',
			PrintNum: 0,
			hasValueFourWithKeyThree: false,
			ShowFXE: false,
			LookShar: '',
			workState: true,
			downPdf: true
		};
	},
	onLoad(options) {
		uni.hideShareMenu();
		console.log('显示', options);

		if (this.vuex_user.phone == undefined) {
			uni.reLaunch({
				url: '/pages/subUser/login'
			});
		} else {
			this.$loadUser(this);
		}

		//检测

		var scene = options.scene;
		if (scene != undefined) {
			this.$u.setPinia({
				user: {
					userRole: scene == 1 ? 'D' : 'R'
				}
			});
		}

		var id = options.id;
		var type = options.type;
		console.log('id', id);
		console.log('type', type);
		if (id != undefined) {
			this.orderId = options.id;
			this.loadData();
			if (type != undefined) {
				console.log('分享页面进入');
				this.navbar = false;
				this.show = 0;
				this.wxType = 1;
				var phone = options.phone;
				var port = options.port;
				var versions = options.versions;
				this.ultimatelyPhone = phone;
				this.port = port;
				this.versions = versions;
			} else {
				console.log('小程序内进入');
				this.show = 1;
				if (this.vuex_userRole == 'R') {
					this.LookShar = 'F';
				}
			}
		}

		console.log('单据id:', id);
		console.log('单据进入路径:', type);
	},
	onShow(options) {
		this.$loadUser(this);

		// 获取签收人
		var that = this;
		this.$api.sign
			.getSignature({
				phone: this.vuex_user.phone
			})
			.then((res) => {
				that.qsrList = res.data.data;
				this.showZG = false;
			});

		this.$api.order
			.getAccountStatistics({
				user: this.vuex_user.data.work == '0' ? this.vuex_user.phone : this.vuex_user.workData.bossNumber
			})
			.then((res) => {
				that.qyList = res.data.data;
			});

		this.getPrintNum();

		this.loadData();

		console.log(options);
	},
	onShareAppMessage(ops) {
		return {
			title: '这是您的货单，请打开易单据查看详情~',
			path: '/pages/subOrder/details?id=' + this.post.orderId,
			imageUrl: this.post.shareImage
		};
	},
	onUnload() {
		uni.removeStorage({
			key: '1003'
		});
	},
	onHide() {
		uni.removeStorage({
			key: '1003'
		});
		if (this.wxType == 1) {
			// wx.exitMiniProgram({
			//        success: function() {
			//          console.log('成功退出小程序');
			//        },
			//        fail: function(err) {
			//          console.error('退出小程序失败', err);
			//        }
			//      });
		}
	},
	methods: {
		getPrintNum() {
			var dx = {
				orderId: this.orderId,
				boss: this.vuex_user.data.work == '1' ? this.vuex_user.workData.bossNumber : this.vuex_user.phone,
				phone: this.vuex_user.phone
			};
			this.$api.order.getOrderRecords(dx).then((rest) => {
				this.PrintNum = rest.data.data;
			});
		},
		print(type) {
			console.log('打印', this.orderId);
			//获取默认打印机

			if (type == 1) {
				//打印
				this.printerOK();
			} else {
				this.printerBrowse();
			}
		},
		printerBrowse() {
			var print = {
				orderId: '',
				port: '',
				phone: '',
				deviceOpenid: '',
				work: this.vuex_user.data.work,
				boss: this.vuex_user.data.work == '1' ? this.vuex_user.workData.bossNumber : this.vuex_user.phone
			};
			print.orderId = this.orderId;
			print.port = this.vuex_userRole;
			print.phone = this.vuex_user.phone;

			this.$api.printer.previewPrintImage(print).then((rest) => {
				this.browse = rest.data;
				if (rest.data.length == 1) {
					this.showBrowsePrintHeight = '300px';
					this.ImageSoleHeight = '200px';
				} else {
					this.showBrowsePrintHeight = '500px';
					this.ImageSoleHeight = '400px';
				}
				this.showBrowsePrint = true;
			});
		},
		printerOK() {
			var ifwork = this.vuex_user.data.work == '0';
			var ifWorkPort = this.vuex_userRole == 'R';

			var phone = this.vuex_user.phone;

			var dx = {
				boss: '',
				staff: '',
				phone: '',
				work: this.vuex_user.data.work
			};

			if (ifwork) {
				dx.boss = phone;
				dx.staff = phone;
				dx.phone = phone;
			} else {
				var boss = this.vuex_user.workData.bossNumber;
				dx.boss = boss;
				dx.staff = phone;
				dx.phone = boss;
			}
			this.$api.printer.getPrinterList(dx).then((res) => {
				console.log('打印及获取：', res.data);
				if (Object.keys(res.data).length == 0) {
					this.$u.toast('您还没有打印机~');
					this.showBrowsePrint = false;
					return;
				}
				console.log('默认机器：', res.data.def[0].deviceopenid);
				var print = {
					orderId: '',
					port: '',
					phone: '',
					deviceOpenid: '',
					boss: '',
					staff: '',
					work: this.vuex_user.data.work
				};
				print.orderId = this.orderId;
				print.port = this.vuex_userRole;
				print.phone = this.vuex_user.phone;
				print.deviceOpenid = res.data.def[0].deviceopenid;
				if (ifwork) {
					print.boss = phone;
					print.staff = phone;
				} else {
					var boss = this.vuex_user.workData.bossNumber;
					print.boss = boss;
					print.staff = phone;
				}

				this.$api.printer.printDocument(print).then((rest) => {
					console.log('打印结果：', rest.data);
					var list = rest.data;
					var err = list[0].err;
					this.showBrowsePrint = false;

					if (err == undefined) {
						this.$u.toast('添加打印任务成功');
					} else {
						if (err == '100020008') {
							this.$u.toast('请检查打印机是否缺纸或者处于开盖状态！');
						} else if (err == '100020001') {
							this.$u.toast('设备处于离线状态！');
						} else {
							this.$u.toast('打印失败！');
						}
					}
					// list.forEach(res=>{

					// })
				});
			});

			this.getPrintNum();
		},
		cancel() {
			console.log('取消');
			this.password = '';
			this.showMask = false;
			this.err = false;
		},
		confirm() {
			console.log('确认');
			var pas = this.password == this.vuex_user.vuex_password;
			if (pas) {
				this.qs();
				this.password = '';
				this.showMask = false;
				this.err = false;
			} else {
				this.err = true;
				this.password = '';
			}
		},
		changePassword(e) {
			this.password = e;
			console.log('改变验证码', e);
			if (e.length < 4) {
				this.err = false;
			}
		},
		finishPassword(e) {
			console.log('最后输入验证码', e);
			console.log('储存验证码', this.qsrList[0].password);
			var pas = e == this.qsrList[0].password;
			console.log('验证验证码对比', pas);
			// if (pas) {
			// 	this.qs()
			// } else {
			// 	this.err = true;
			// }
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
		towDig(sunitPrice, squantity) {
			var unitPrice = parseFloat(sunitPrice);
			var quantity = parseFloat(squantity);
			if (isNaN(unitPrice) || isNaN(quantity)) {
				// 处理错误或提供默认值
				console.error('unitPrice 或 quantity 不是有效的数字');
				// 假设我们提供一个默认值
				unitPrice = 0;
				quantity = 0;
			}
			var unitPriceStr = unitPrice.toFixed(2);
			var quantityStr = quantity.toFixed(2);

			// 但我们不需要将字符串转换回数字来进行乘法运算，因为 toFixed 仅在显示时使用
			var subtotal = unitPrice * quantity;
			return subtotal.toFixed(2);
		},
		DigPrice(obj) {
			var sum = parseFloat(obj);
			return sum.toFixed(2);
		},
		DownPdf(order) {
			if (!this.downPdf) {
				this.$u.toast('请勿频繁点击~');
				return;
			} else {
				this.downPdf = false;
			}
			console.log(order.id);
			var dx = {
				id: order.id,
				phone: this.vuex_user.phone,
				port: this.vuex_userRole == 'D' ? 0 : 1
			};
			var _this = this;
			this.$api.order
				.generateOrderPDFWithId(dx)
				.then((rest) => {
					var url = rest.data.data;
					// uni.downlo
					uni.downloadFile({
						url: url, // 下载url
						success(res) {
							const tempFilePath = res.tempFilePath;
							console.log(res);
							uni.getFileSystemManager().saveFile({
								tempFilePath: tempFilePath,
								filePath: wx.env.USER_DATA_PATH + '/' + 'YDJ-' + order.orderNumber + '.pdf',
								success: function (saveRes) {
									var savedFilePath = saveRes.savedFilePath;
									uni.showActionSheet({
										itemList: ['分享到微信好友', '打开PDF'],
										success: (e) => {
											if (e.tapIndex == 0) {
												uni.shareFileMessage({
													filePath: savedFilePath,
													fileName: order.orderNumber + '.pdf',
													success() {},
													fail: console.error
												});
												_this.downPdf = true;
											} else {
												uni.openDocument({
													filePath: savedFilePath,
													showMenu: true //是否可以分享
												});
												_this.downPdf = true;
											}
										}
									});
								}
							});
						},
						fail: console.error
					});
				})
				.catch((res) => {
					console.log(res);
				});
		},
		shareClick() {
			console.log('点击');
			uni.navigateBack({
				delta: 0, // 返回的页面数
				success: function () {
					console.log('跳转成功');
				},
				fail: function () {
					console.log('跳转失败');
					uni.switchTab({
						url: '/pages/index/index'
					});
				}
			});
		},
		getPhoneNumber(e) {
			console.log('获取手机号：', e);
			var that = this;
			this.$api.user
				.loginWithWXOld({
					loginCode: that.wxLoginRes,
					phoneCode: e.detail.code
				})
				.then((res) => {
					var resDate = res.data.data;
					console.log(resDate.phone);
					if (resDate.phone != null) {
						if (
							resDate.phone == this.post.bossNumberE ||
							resDate.phone == this.post.bossNumberS ||
							resDate.phone == this.post.staffNumberE ||
							resDate.phone == this.post.staffNumberS
						) {
							this.sharePhone = resDate.phone;
							console.log('自己的单子');
							this.show = 1;
							//自己发的看到发货端状态
							if (resDate.phone == this.post.bossNumberS || resDate.phone == this.post.staffNumberS) {
								this.LookShar = 'S';
							}
							//自己收的看到收货端状态
							if (resDate.phone == this.post.bossNumberE || resDate.phone == this.post.staffNumberE) {
								//权限验证
								// https://wxapi.elist.com.cn/edo/user/search?phone=19108696232&state=1
								this.$api.user.searchUser({ phone: resDate.phone }).then((res) => {
									console.log('自己的单子 关系状态：', res.data.data);
									if (res.data.data.map) {
										if (res.data.data.map.boss == this.post.bossNumberE) {
											this.LookShar = 'F';
										} else {
											if (res.data.data.phoneNumber == this.post.bossNumberE) {
												this.LookShar = 'F';
											} else {
												this.LookShar = 'F';
												this.workState = false;
											}
										}
									}
								});
							}
						} else {
							console.log('不是自己的单子', resDate.phone);
							this.$api.user
								.getUserDetails({ phone: resDate.phone })
								.then((res) => {
									var resDateGet = res.data.data.staffNumber;
									// var ifok=resDateGet.includes(resDate.phone)
									console.log('不是自己的单子查询结果，', resDateGet);
									// 判断数组中是否有对象的值等于4
									var hasValueFourWithKeyThree = false;

									if (resDateGet != undefined) {
										for (let key in resDateGet) {
											if (key == resDate.phone) {
												this.ShowFXE = true;
												if (resDateGet[key] != '4') {
													hasValueFourWithKeyThree = true;
												}
											}
										}
									} else {
										hasValueFourWithKeyThree = false;
									}

									console.log('对比结果，', hasValueFourWithKeyThree);
									if (!hasValueFourWithKeyThree) {
										this.text2 = true;
										this.text = false;
									} else {
										this.show = 1;
										this.ShowFXE = true;
										console.log('第三方查看');
									}
								})
								.catch((res) => {
									// that.$u.toast("登陆异常 请重新登录")
									that.$u.toast(that.message);
								});
						}
					}
				})
				.catch((res) => {
					// that.$u.toast("登陆异常 请重新登录")
					that.$u.toast(that.message);
				});
		},
		bigImg(url) {
			//放大显示
			console.log(url);
			this.showZGImg = url;
			this.showZG = true;
		},
		change(e) {
			console.log('内容改变，当前值为：' + e);
			this.colorT = '#01BA74';
		},
		finish(e) {
			console.log('输入结束，当前值为：' + e);
			console.log(this.post);
			var start = '';
			try {
				start = this.post.bossNumberS || this.post.staffNumberS;
			} catch {
				start = this.post.phoneS;
			}

			var end = this.post.bossNumberE || this.post.staffNumberE;

			console.log('start', start);
			console.log('end', end);
			console.log('第三方查看', end != null && end != '' && start != null && start != '');
			if (end != null && end != '' && start != null && start != '') {
				let startF = start.slice(-4);
				let endF = end.slice(-4);
				if (startF == e || endF == e) {
					this.show = 1;
					this.ShowFXE = true;
					console.log('第三方查看');
					console.log('第三方查看', this.ShowFXE, this.wxType);
				} else {
					this.colorT = '#F9393A';
				}
			}
		},
		previewImage(path) {
			uni.previewImage({
				urls: [path],
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function (data) {
						console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					},
					fail: function (err) {
						console.log(err.errMsg);
					}
				}
			});
		},
		loadData() {
			this.post = [];
			var that = this;
			console.log('请求id：' + this.orderId);
			this.$api.order
				.getOrderById({
					orderId: this.orderId
				})((res) => {
					console.log('请求结果：' + res.data.data.post);
					that.post = res.data.data.post;
					that.orderItemList = res.data.data.orderItemList;
					that.imgList = res.data.data.imgList;
				})
				.catch((res) => {});
		},
		onConfirm() {
			console.log(this.qsrList);
			console.log(this.qyList);
			var that = this;
			if (that.qsrList.length == 0 || (that.qyList == null && this.vuex_user.data.work == '0')) {
				//  无签收人
				if (that.qsrList.length == 0 && that.qyList == null) {
					// /pages/subAuth/qiye
					if (this.vuex_user.data.work == '1' && that.qsrList.length == 0) {
						uni.showModal({
							title: '暂无签收信息，是否去添加？',
							showCancel: true,
							cancelText: '取消',
							confirmText: '去添加',
							success: (res) => {
								if (res.confirm) {
									uni.navigateTo({
										url: '/pages/subPack/user/signee/add'
									});
								}
							},
							fail: () => {},
							complete: () => {}
						});
					}

					if (this.vuex_user.data.work == '0' && that.qsrList.length == 0 && that.qyList == null) {
						uni.showModal({
							title: '暂无完整信息，是否去添加？',
							showCancel: true,
							cancelText: '取消',
							confirmText: '去添加',
							success: (res) => {
								if (res.confirm) {
									uni.navigateTo({
										url: '/pages/subPack/user/signee/merge'
									});
								}
							},
							fail: () => {},
							complete: () => {}
						});
					}
				} else if (that.qsrList.length != 0 && that.qyList == null) {
					uni.showModal({
						title: '暂无企业信息，是否去添加？',
						showCancel: true,
						cancelText: '取消',
						confirmText: '去添加',
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/subAuth/qiye'
								});
							}
						},
						fail: () => {},
						complete: () => {}
					});
				} else if (that.qsrList.length == 0 && that.qyList != null) {
					uni.showModal({
						title: '暂无签收信息，是否去添加？',
						showCancel: true,
						cancelText: '取消',
						confirmText: '去添加',
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/subPack/user/signee/add'
								});
							}
						},
						fail: () => {},
						complete: () => {}
					});
				}
				return;
			} else {
				uni.showModal({
					title: '确认签收提醒',
					content: '请仔细核对货物信息后确认签收',
					showCancel: true,
					cancelText: '取消',
					confirmText: '确认',
					success: (res) => {
						if (res.confirm) {
							this.showMask = true;
						}
					}
				});
			}
			// that.qsrShow = true;
		},
		qsrConfirm(val) {
			// uni.showModal({
			// 	title: '确认签收提醒',
			// 	content: '请仔细核对货物信息后确认收货',
			// 	showCancel: true,
			// 	cancelText: '取消',
			// 	confirmText: '确认',
			// 	success: res => {
			// 	}
			// });
		},
		qs() {
			this.post = [];
			var that = this;
			console.log('请求id：' + this.orderId);
			this.$api.order
				.getOrderById({
					orderId: this.orderId
				})
				.then((res) => {
					console.log('请求结果：' + res.data.data.post);
					that.post = res.data.data.post;
					that.orderItemList = res.data.data.orderItemList;
					that.imgList = res.data.data.imgList;
					this.updateOrder();
				})
				.catch((res) => {});
		},
		updateOrder() {
			var that = this;
			var send = this.post;
			var qm = this.qsrList[0];
			send.signatureImg = qm.signatureImg;
			send.signaturePhone = qm.phone;
			send.signatureName = qm.name;
			send.paymentState = '1';
			console.log(send);
			this.$api.order
				.signForOrder(send)
				.then((res) => {
					console.log(res);
					if (res.data == '9') {
						this.$u.toast('该单据已签收');
					} else if (res.data.code == 200) {
						this.$u.toast(res.data.message);
						send.paymentState = '0';
						setTimeout(function () {
							uni.navigateBack();
						}, 1000);
					} else {
						this.showMask = false;
						this.flushDBSX(this.post);
					}
				})
				.catch((res) => {
					console.log(res);
					this.$u.toast('签收失败~');
					this.showMask = false;
					this.loadData();
				});
		},
		flushDBSX(val) {
			var list = [val.bossNumberS, val.staffNumberS, val.bossNumberE, val.staffNumberE];
			this.$api.task
				.startRWFlow({ list: list })
				.then((res) => {
					console.log('实时更新通知结果：' + res);
				})
				.catch((res) => {});
		},
		generateFiveDigitNumber() {
			return 10000 + Math.floor(Math.random() * 90000);
		},
		callPhone(phone) {
			uni.makePhoneCall({
				phoneNumber: phone
			});
		},
		digitUppercase(n = 0) {
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
		},
		copyBtn(from, val) {
			const that = this;
			uni.setClipboardData({
				data: val,
				success: function () {
					that.$u.toast('已复制' + from);
				}
			});
		},
		goPay() {
			uni.showModal({
				title: '现款签收提醒',
				content: '该项货款是否已完成现款支付？',
				showCancel: true,
				cancelText: '取消',
				confirmText: '确认',
				success: (res) => {}
			});
		},
		// 切换收发货
		sideClick() {
			this.$refs.popRole.roleShow = true;
		}
	}
};
</script>

<style lang="scss">
.black-border-left {
	border-left: 1rpx solid #222;
}

.black-border-right {
	border-right: 1rpx solid #222;
}

.black-border-top {
	border-top: 1rpx solid #222;
}

.black-border-bottom {
	border-bottom: 1rpx solid #222;
}

.table-container {
	width: 100%;
	/* 或设置具体的宽度 */
	overflow-x: auto;
	/* 如果表格宽度超过容器，则出现滚动条 */
}

.table {
	display: table;
	width: 100%;
	border-collapse: collapse;
	/* 移除单元格之间的空白 */
}

.table-header,
.table-row {
	display: table-row;
}

.table-cell {
	// display: table-cell;
	// border: 1px solid #333333;
	// /* 可选：添加边框 */
	// padding: 8px;
	// /* 可选：添加内边距 */
	// /* 设置单元格的最大宽度或宽度，根据实际需要调整 */
	max-width: 60px;
	min-width: 30px;
	// /* 示例值，根据字符数和字体大小调整 */
	word-wrap: break-word;
	// /* 确保长单词或URL会在边界处换行 */
	overflow-wrap: break-word;
	// /* 同 word-wrap，用于兼容不同浏览器 */
	box-sizing: border-box;
	// /* 包含边框和内边距在宽度内 */
	// vertical-align: top;
	// /* 文本顶部对齐 */
	display: table-cell;
	border: 1px solid #333333;
	/* 可选：添加边框 */
	padding: 8px;
	/* 可选：添加内边距 */
	text-align: center;
	/* 水平居中 */
	vertical-align: middle;
	/* 垂直居中 */
	box-sizing: border-box;
	/* 包含边框和内边距在宽度内 */
	width: 59px;
}

.passwordTitle {
	width: 100%;
	height: 40%;
	color: #333333;
	font-size: 18px;
	font-weight: 600;
}

.titlePas {
	color: #333333;
	font-size: 18px;
	font-weight: 600;
}

.titlePasOK {
	color: #01bb74;
	font-size: 18px;
	font-weight: 600;
}

.err {
	font-family: Source Han Sans;
	font-size: 13px;
	font-weight: normal;
	line-height: 22.46px;
	letter-spacing: 0.65px;

	font-feature-settings: 'kern' on;
	color: #f53f3f;
}
</style>
