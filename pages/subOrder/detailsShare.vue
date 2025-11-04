<template>
	<view class="vh100 vw100" style="background-size: cover">
		<view>
			<up-navbar
				:placeholder="true"
				:border-bottom="false"
				back-icon-color="#000000"
				:titleBold="true"
				title-color="#000000"
				title="货单详情"
				@leftClick="shareClick"
				title-size="34"
				bgColor="#ffffff"
			></up-navbar>
		</view>

		<up-empty icon="https://res-oss.elist.com.cn/wxImg/order/orderEmpty.svg" textColor="#666" width="414rpx" v-if="shareShow" text="订单已删除~" marginTop="400rpx"></up-empty>
		<up-popup :show="showZG" mode="center" @close="showZG = false" :safeAreaInsetBottom="false">
			<image style="width: 500rpx; height: 100%; display: block" :src="showZGImg" mode="widthFix"></image>
		</up-popup>
		<view class="height80 fixed-bar-height" v-if="!shareShow">
			<view class="ml20 mr20">
				<view class="flex-row" style="margin-top: 2%">
					<view class="" style="width: 20%">
						<up-image
							mode="scaleToFill"
							src="https://res-oss.elist.com.cn/wxImg/order/logo.svg"
							width="200rpx"
							height="80rpx"
							:show-menu-by-longpress="false"
						></up-image>
					</view>
					<view class="flex-row justify-center items-center" style="width: 60%">
						<up-image :show-menu-by-longpress="false" src="/static/img/order/dd2x.svg" width="292rpx" height="44rpx"></up-image>
					</view>
					<view class="" style="width: 20%"></view>
				</view>

				<view class="width100 flex-row pt15" style="height: 4vh">
					<view class="flex-row justify-center items-center" style="width: 100%; font-weight: 600">
						<view class="mb10 syst ft-zjj-1" style="text-align: left; color: #333333; font-size: 36rpx; font-weight: 600">
							<text>{{ post.enterpriseS || post.bossNumberS || '' }}</text>
						</view>
					</view>
				</view>
				<view class="bg-white pb350 flex-co mt10">
					<view v-if="wxType == 1 && LookShar == 'D'" class="absolute" style="right: 20rpx">
						<up-image
							v-if="post.paymentState == '0'"
							:show-menu-by-longpress="false"
							src="https://res-oss.elist.com.cn/wxImg/order/dqs.png"
							width="240rpx"
							height="240rpx"
						></up-image>
						<up-image
							v-if="post.paymentState == '1'"
							:show-menu-by-longpress="false"
							src="https://res-oss.elist.com.cn/wxImg/order/yqs.png"
							width="240rpx"
							height="240rpx"
						></up-image>
						<up-image
							v-if="post.paymentState == '2'"
							:show-menu-by-longpress="false"
							src="https://res-oss.elist.com.cn/wxImg/order/ysk.png"
							width="240rpx"
							height="240rpx"
						></up-image>
					</view>

					<view v-if="wxType == 1 && LookShar == 'R'" class="absolute" style="right: 20rpx">
						<up-image
							v-if="post.paymentState == '0'"
							:show-menu-by-longpress="false"
							src="https://res-oss.elist.com.cn/wxImg/order/dqs-r.png"
							width="240rpx"
							height="240rpx"
						></up-image>
						<up-image
							v-if="post.paymentState == '1'"
							:show-menu-by-longpress="false"
							src="https://res-oss.elist.com.cn/wxImg/order/yqs.png"
							width="240rpx"
							height="240rpx"
						></up-image>
						<up-image
							v-if="post.paymentState == '2'"
							:show-menu-by-longpress="false"
							src="https://res-oss.elist.com.cn/wxImg/order/yfk.png"
							width="240rpx"
							height="240rpx"
						></up-image>
					</view>

					<view class="pd20 black-border-top black-border-left black-border-right">
						<view class="flex-row" style="font-family: Alike Angular">
							<wd-icon size="50rpx" name="https://res-oss.elist.com.cn/wxImg/order/number.svg"></wd-icon>
							<text class="ml10 mt10" style="color: #fa5151; font-size: 30rpx">{{ post.orderNumber || '' }}</text>
						</view>
						<view class="flex-row mt13 xqcss">
							<view class="">发货日期：</view>
							<view class="yrd">{{ $u.timeFormat(post.creationTime, 'yyyy-mm-dd') || '' }}</view>
						</view>
						<view class="flex-row mt13 xqcss">
							<view class="">购货单位：</view>
							<view class="yrd">
								{{ post.organizationE || '' }}
							</view>
						</view>
						<view class="flex-row mt13 xqcss">
							<view class="">联系人：</view>
							<text class="yrd">{{ post.kTakeE || '' }}</text>
						</view>
						<view class="flex-row mt13 xqcss">
							<view class="">联系电话：</view>
							<text class="yrd">{{ post.kPhoneE || '' }}</text>
						</view>
						<view class="flex-row mt13 xqcss">
							<view class="">收货地址：</view>
							<text class="yrd">{{ post.kSiteE || '' }}</text>
						</view>
						<view class="" v-if="uni.$u.getPinia('user.customized') || orderisCustomized">
							<view class="flex-row mt13 xqcss">
								<view class="">项目名称：</view>
								<text class="yrd">{{ post.projectName || '' }}</text>
							</view>
							<view class="flex-row mt13 xqcss">
								<view class="">物流单位：</view>
								<text class="yrd">{{ post.logisticsCompany || '' }}</text>
							</view>
							<view class="flex-row mt13 xqcss">
								<view class="">车次：</view>
								<text class="yrd">{{ post.transportBatchNo || '' }}</text>
							</view>
							<view class="flex-row mt13 xqcss">
								<view class="">承运人：</view>
								<text class="yrd">{{ post.carrierName || '' }}</text>
							</view>
							<view class="flex-row mt13 xqcss">
								<view class="">车牌号：</view>
								<text class="yrd">{{ post.plateNo || '' }}</text>
							</view>
							<view class="flex-row mt13 xqcss">
								<view class="">车型：</view>
								<text class="yrd">{{ post.vehicleType || '' }}</text>
							</view>
							<view class="flex-row mt13 xqcss">
								<view class="">司机电话：</view>
								<text class="yrd">{{ post.driverPhone || '' }}</text>
							</view>
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
									<view class="table-cell">{{ uni.$u.getPinia('user.customized') || orderisCustomized ? '单重' : '单价' }}</view>
									<view class="table-cell">{{ uni.$u.getPinia('user.customized') || orderisCustomized ? '总重' : '金额' }}</view>
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
										<text class="ft24">{{ uni.$u.getPinia('user.customized') || orderisCustomized ? item.unitWeightKg : item.unitPrice }}</text>
									</view>
									<view class="table-cell flex-col justify-center items-center">
										<text class="ft24" v-if="uni.$u.getPinia('user.customized') || orderisCustomized">
											{{ item.quantity != '-' && item.quantity != '' ? item.unitWeightKg * item.quantity : 0 }}
										</text>
										<text class="ft24" v-else>{{ towDig(item.quantity, item.unitPrice) }}</text>
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
									<view class="table-cell">{{ uni.$u.getPinia('user.customized') || orderisCustomized ? '单重' : '单价' }}</view>
									<view class="table-cell">{{ uni.$u.getPinia('user.customized') || orderisCustomized ? '总重' : '金额' }}</view>
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
										<text class="ft24" v-if="uni.$u.getPinia('user.customized') || orderisCustomized">{{ versions == 'Y' ? item.unitWeightKg : '****' }}</text>
										<text class="ft24" v-else>{{ versions == 'Y' ? item.unitPrice : '****' }}</text>
									</view>
									<view class="table-cell flex-col justify-center items-center">
										<text class="ft24" v-if="uni.$u.getPinia('user.customized') || orderisCustomized">
											{{ versions == 'Y' ? item.unitWeightKg * item.quantity : '****' }}
										</text>
										<text class="ft24" v-else>{{ versions == 'Y' ? towDig(item.quantity, item.unitPrice) : '****' }}</text>
									</view>
								</view>
							</view>
						</view>

						<view class="xqcss pd10 pt10 pb10 black-border-left black-border-right black-border-bottom">
							<text class="ml10 xqcss">合计：</text>
							<text class="xqcss" v-if="uni.$u.getPinia('user.customized') || orderisCustomized">{{ post.totalWeightKg || 0 }}</text>
							<text class="xqcss" v-else>¥ {{ versions == 'Y' ? DigPrice(post.price) || '' : '****' }}</text>
						</view>
						<view
							class="xqcss pd10 pt10 pb10 black-border-bottom black-border-left black-border-right"
							v-if="!(uni.$u.getPinia('user.customized') || orderisCustomized)"
						>
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
									style="transform: rotate(270deg) translateY(20%); width: 100rpx"
									class=""
									mode="widthFix"
								></image>
								<text v-else>{{ post.signatureImg || '' }}</text>
							</view>
						</view>

						<view class="xqcss pt35 flex-row items-center black-border-left black-border-right" style="height: 12vh" v-if="imgList.length > 0">
							<view class="ml20" style="" v-for="(item2, index2) in imgList" :key="index2">
								<up-image :src="item2.url" shape="square" width="150rpx" height="150rpx" @click="bigImg(item2.url)">
									<up-loading-icon slot="loading"></up-loading-icon>
								</up-image>
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
							<view class="flex-row ml20 mt14" @click="callPhone(post.staffNumberS)">
								<text>联系电话：</text>
								<text>{{ post.staffNumberS }}</text>
							</view>
						</view>
					</view>
					<view class="flex-row justify-center items-end mt5" @click="exit" style="width: 100%; color: #aaaaaa">关闭单据{{ ' >' }}</view>
				</view>
				<view class="fixed-bar">
					<view class="pl30 pr30 pb30 flex-row justify-between items-center">
						<view v-if="LookBtn == 'Y' && post.paymentState == '0' && post.lockOrder != 1" class="flex-row flex-1 items-center">
							<wd-button :customStyle="{ width: '100%' }" @click="onConfirm">确认签收</wd-button>
						</view>
					</view>
				</view>
			</view>
		</view>

		<up-popup class="flex-col justify-center items-center" round="15" mode="center" :show="showMask" :customStyle="customStyle_pop_pwd">
			<view class="flex-col justify-center items-center relative" style="height: 400rpx; width: 600rpx">
				<view class="absolute pt20" style="width: 100%; top: 0; height: 75%">
					<view class="flex-row items-center justify-center passwordTitle">请输入签收密码</view>
					<view class="flex-col items-center justify-center mt20" style="width: 100%; height: 35%">
						<up-message-input
							active-color="#01BB74"
							@change="changePassword"
							@finish="finishPassword"
							:dot-fill="true"
							v-model="password"
							mode="box"
						></up-message-input>
						<view class="mt20 err" v-show="err">密码错误，请重新输入</view>
					</view>
					<view @click="$goPath('/pages/subUser/resetpassword')" class="ft12 pr30 flex-row justify-end pt15" style="color: #999; width: 100%">找回密码</view>
				</view>
				<view class="flex-row items-center absolute u-border-top" style="width: 100%; bottom: 0; height: 25%">
					<view @click="cancel" style="width: 50%; height: 100%" class="titlePas flex-col justify-center items-center">取消</view>
					<view @click="confirm" style="width: 50%; height: 100%" class="titlePasOK flex-col justify-center items-center u-border-left">确认</view>
				</view>
			</view>
		</up-popup>
		<pop-letter ref="popLetter"></pop-letter>
	</view>
</template>

<script>
export default {
	data() {
		return {
			customStyle_pop_pwd: {
				width: '600rpx',
				height: '400rpx'
			},
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
			showZG: false,
			showZGImg: '',
			wxLoginRes: '',
			text: true,
			text2: false,
			wxType: 0,
			sharePhone: '',
			port: '',
			versions: 'Y',
			navbar: true,

			showMask: false,
			password: '',
			err: false,
			ImageSoleHeight: '400rpx',
			PrintNum: 0,
			hasValueFourWithKeyThree: false,
			LookShar: '',
			LookBtn: '',
			LookThree: false,
			LookThreeNo: false,
			identity: 9,
			options: {},
			shareShow: false,
			qyList: [],
			sendWord: true,
			customStyle: {
				backgroundColor: 'transparent'
			},
			currentTextLines: [],
			originalText:
				'这是您和易单据的\n第一次相遇，\n接下来，\n您将感受到易单据\n是多么的强大！\n当您使用易单据后，\n您的供应商的\n每一张\n送货单\n都将在这里体现，\n您可以通过\n易单据\n给供应商\n签收送货单\n如果您\n是一家\n更强大的公司，\n您的员工签单，\n财务和您都能\n实时的看到单据；\n您也可以通过\n易单据的统计功能\n随意的查询\n您每一家\n供应商的送货单据，\n每一张单据，\n查询他们的\n价格和数量；\n最关键的\n通过易单据，\n面对供应商\n半年付款的，\n季度付款的，\n年度付款的，\n你可以轻松\n统计出\n详细送货清单。\n当然，\n易单据还有更多，\n更强大的功能\n在您后期使用中\n会发现更多！\n未来，\n易单据\n将和您携手同行，\n用真诚与专业\n陪伴您\n骏业日新！',
			timer: null,
			orderisCustomized: false
		};
	},
	computed: {
		// pinia_user() {
		// 	return this.$store.state.pinia_user;
		// },
	},
	onLoad(options) {
		this.options = options;
		if (this.$u.getPinia('user') && this.$u.getPinia('user.user.phone')) {
			this.$loadUser(this);
			//单据id
			this.getOrder(options);
			this.$getRecord(this);
			this.getQs();
		} else {
			console.warn('pinia_user 未初始化');
			uni.navigateTo({
				url: '/pages/subUser/login?sharePath=detailsShare'
			});
		}
	},
	onShow() {
		if (this.$u.getPinia('user') && this.$u.getPinia('user.user.phone')) {
			this.$loadUser(this);
			//单据id
			this.getOrder(this.options);
			this.$getRecord(this);
			this.getQs();
		} else {
		}
	},
	onShareAppMessage(ops) {
		return {
			title: '这是您的货单，请打开易单据查看详情~',
			path: '/pages/subOrder/details?id=' + this.post.orderId,
			imageUrl: this.post.shareImage
		};
	},
	onUnload() {
		// uni.removeStorage({
		// 	key: '1003'
		// });
	},
	onHide() {
		console.log('===隐藏===>');
		// uni.removeStorage({
		// 	key: '1003'
		// });
	},
	methods: {
		getQs() {
			uni.$api.sign
				.getSignature({
					phone: this.$u.getPinia('user.user.phone')
				})
				.then((res) => {
					this.qsrList = res.data.data;
					this.showZG = false;
				});
			uni.$api.order
				.getAccountStatistics({
					user: this.$u.getPinia('user.user.data.work') == '0' ? this.$u.getPinia('user.user.phone') : this.$u.getPinia('user.user.workData.bossNumber')
				})
				.then((res) => {
					this.qyList = res.data.data;
				});
		},
		async getOrder(options) {
			if (options.share_id != undefined) {
				this.orderId = options.share_id;
				//获取单据信息
				const order = await this.loadData(options.share_id);
				if (order.data.data.post == null) {
					this.shareShow = true;
					return;
				}
				this.orderisCustomized = order.data.data.isCustomized;
				this.post = order.data.data.post;
				this.orderItemList = order.data.data.orderItemList;
				this.imgList = order.data.data.imgList;
				this.yz(options);
			} else if (options.id != undefined) {
				this.orderId = options.id;
				//获取单据信息
				const order = await this.loadData(options.id);
				if (order.data.data.post == null) {
					this.shareShow = true;
					return;
				}
				this.orderisCustomized = order.data.data.isCustomized;
				this.post = order.data.data.post;
				this.orderItemList = order.data.data.orderItemList;
				this.imgList = order.data.data.imgList;
				this.yz(options);
			}
		},
		yz(options) {
			var id = options.share_id;
			//分享标记
			var type = options.type;
			//分享人手机号码
			var phone = options.phone;
			//分享人端口
			var port = options.port;
			//分享金额限制${versions=="Y"?"有金额":"无金额"}
			var versions = options.versions;
			console.log('this.pinia_user', this.$u.getPinia('user.user'));
			if (this.$u.getPinia('user.user.phone') != undefined) {
				//获取签收人
				uni.$api.sign
					.getSignature({
						phone: this.$u.getPinia('user.user.phone')
					})
					.then((res) => {
						this.qsrList = res.data.data;
						this.showZG = false;
					});

				//登录了
				console.log('------ok------->单据id', id);
				console.log('------ok------->分享标记', type);
				console.log('------ok------->分享人手机号码', phone);
				console.log('------ok------->分享人端口', port);
				console.log('------ok------->分享金额限制', versions);
				console.log('------ok------->签收', this.qsrList);

				//验证分享
				if (type != undefined) {
					console.log('------------->分享页验证成功');
					console.log('port', port);
					console.log('phone', phone);
					this.navbar = false;
					this.show = 0;
					this.wxType = 1;
					this.port = port;
					this.LookShar = port;
					this.sharePhone = phone;
					this.versions = versions;

					this.verificationOrder();
				} else {
					console.log('------------->分享页验证失败');
				}
			} else {
				console.log('------no------->单据id', id);
				console.log('------no------->分享标记', type);
				console.log('------no------->分享人手机号码', phone);
				console.log('------no------->分享人端口', port);
				console.log('------no------->分享金额限制', versions);
				//统一处理 没有 签收按钮

				this.LookShar = port;
				this.LookBtn = 'N';
				this.LookThreeNo = true;
				this.wxType = 1;
			}
		},
		cancel() {
			console.log('取消');
			this.password = '';
			this.showMask = false;
			this.err = false;
		},
		confirm() {
			console.log('确认');
			var pas = this.password == this.pinia_user.password;
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
			if (pas) {
				this.qs();
			} else {
				this.err = true;
			}
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
		shareClick() {
			console.log('返回', this.port);
			if (this.$u.getPinia('user.user.phone')) {
				if (this.LookThree) {
				} else {
					if (this.LookThreeNo) {
						this.$u.setPinia({
							user: {
								userRole: 'D'
							}
						});
					} else {
						this.$u.setPinia({
							user: {
								userRole: this.LookShar
							}
						});
					}
				}
			} else {
				this.$u.setPinia({
					user: {
						userRole: 'D'
					}
				});
			}
			// && this.$u.getPinia('user.userRole') != undefined && this.$u.getPinia('user.userRole') != ''
			if (this.$u.getPinia('user.userRole')) {
				uni.switchTab({
					url: '/pages/index/index'
				});
			} else {
				this.$u.setPinia({
					user: {
						userRole: 'D'
					}
				});
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		},
		async verificationOrder() {
			if (this.$u.getPinia('user.user.phone') != undefined) {
				//获取当前手机号码
				var phone = this.$u.getPinia('user.user.phone');
				//判断是否工作
				var work = this.$u.getPinia('user.user.data.work') == '0';
				//判断是否和单子有关系
				var portE = phone == this.post.bossNumberE;
				var portS = phone == this.post.bossNumberS;

				uni.$api.user.getUserDetails({ phone: phone }).then((res) => {
					console.log('res', res);
					var resRelation = res.data.data.cRelation;
					var resDateGet = res.data.data.staffNumber;
					var user = res.data.data.user.work == '0';

					console.log('-------------->当前公司结构：', res);
					console.log('-------------->当前公司结构：', resRelation);
					console.log('-------------->当前公司结构：', resDateGet);
					console.log('-------------->签收判断：', portE);
					console.log('-------------->签收判断：', portS);
					if (user) {
						//没工作
						if (portE) {
							//收货端
							//有签收按钮,状态为收货端
							this.LookShar = 'R';
							this.LookBtn = 'Y';
						}

						if (portS) {
							//发货端
							this.LookShar = 'D';
							this.LookBtn = 'N';
						}

						if (!portE && !portS) {
							//第三者
							this.LookShar = this.port;
							this.LookBtn = 'N';
							this.identity = 9;
							this.LookThree = true;
						}
					} else {
						//有工作
						if (resDateGet == undefined) {
							this.LookShar = this.port;
							this.LookBtn = 'N';
							this.identity = 9;
							this.LookThree = true;
						}

						var boss = '';
						var identity = resDateGet[phone];

						for (let key in resDateGet) {
							if (resDateGet[key] == '0') {
								boss = key;
							}
						}

						if (boss == '') {
							console.log('异常');
							return;
						}

						console.log(boss, identity);
						console.log(this.post);
						console.log(this.post.bossNumberE, this.post.bossNumberS);
						console.log(this.post.staffNumberE, this.post.staffNumberS);
						var bossE = boss == this.post.bossNumberE;
						var bossS = boss == this.post.bossNumberS;
						var staffE = phone == this.post.staffNumberE;
						var staffS = phone == this.post.staffNumberS;

						if (!bossE && !bossS && !staffE && !staffS) {
							//有工作 第三方
							this.LookShar = this.port;
							this.LookBtn = 'N';
							this.identity = 9;
						}

						if (bossE) {
							//收货端
							//有签收按钮,状态为收货端
							this.LookShar = 'R';

							if (staffE) {
								this.LookBtn = 'Y';
							} else {
								this.LookBtn = 'N';
							}
						}

						if (bossS) {
							//发货端
							this.LookShar = 'D';
							this.LookBtn = 'N';
						}

						if (identity != '0') {
							if (bossE) {
								//收货端
								this.LookShar = 'R';
								this.LookBtn = identity == '4' && staffE ? 'Y' : 'N';
								if (identity == '1') {
									this.LookBtn = staffE && boss != this.post.bossNumberE ? 'N' : 'Y';
								}
							}

							if (bossS) {
								//发货端
								this.LookShar = 'D';
								this.LookBtn = 'N';
							}

							if (staffE || staffS) {
								if (!bossS && !bossE) {
									this.LookShar = this.port;
									this.LookBtn = 'N';
									this.identity = 9;
									this.LookThree = true;
								}
							}

							// if (portS) {
							// 	//发货端
							// 	this.LookBtn = "N"
							// }
						}
					}
				});
			}
		},
		bigImg(url) {
			//放大显示
			console.log(url);
			this.showZGImg = url;
			this.showZG = true;
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
		//根据id获取单据
		loadData(id) {
			return uni.$api.order.getOrderById({
				orderId: id
			});
		},
		onConfirm() {
			console.log(this.qsrList);
			var that = this;
			if (that.qsrList.length == 0 || (that.qyList == null && this.$u.getPinia('user.user.data.work') == '0')) {
				//  无签收人
				if (that.qsrList.length == 0 && that.qyList == null) {
					// /pages/subAuth/qiye
					if (this.$u.getPinia('user.user.data.work') == '1' && that.qsrList.length == 0) {
						uni.showModal({
							title: '暂无签收信息，是否去添加？',
							showCancel: true,
							cancelText: '取消',
							confirmText: '去添加',
							confirmColor: '#01bb74',
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

					if (this.$u.getPinia('user.user.data.work') == '0' && that.qsrList.length == 0 && that.qyList == null) {
						uni.showModal({
							title: '暂无完整信息，是否去添加？',
							showCancel: true,
							cancelText: '取消',
							confirmText: '去添加',
							confirmColor: '#01bb74',
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
						confirmColor: '#01bb74',
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/subAuth/qiye?btn=0'
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
						confirmColor: '#01bb74',
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
					confirmColor: '#01bb74',
					success: (res) => {
						if (res.confirm) {
							this.qs();
							// this.showMask = true;
						}
					}
				});
			}
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
			var that = this;
			var send = this.post;
			var qm = this.qsrList[0];
			send.signatureImg = qm.signatureImg;
			send.signaturePhone = qm.phone;
			send.signatureName = qm.name;
			send.paymentState = '1';
			uni.$api.order
				.signForOrder(send)
				.then((res) => {
					if (res.data == '9') {
						this.$u.toast('该单据已签收');
					} else {
						this.$u.toast('签收成功~');
					}
					this.showMask = false;
					this.getOrder(this.options);
					this.flushDBSX(this.post);
				})
				.catch((res) => {
					this.$u.toast('签收失败~');
					this.showMask = false;
					this.getOrder(this.options);
				});
		},
		flushDBSX(val) {
			var list = [val.bossNumberS, val.staffNumberS, val.bossNumberE, val.staffNumberE];
			uni.$api.task
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
				confirmColor: '#01bb74',
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
	// border: 2rpx solid #333333;
	// /* 可选：添加边框 */
	// padding: 16rpx;
	// /* 可选：添加内边距 */
	// /* 设置单元格的最大宽度或宽度，根据实际需要调整 */
	max-width: 120rpx;
	min-width: 60rpx;
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
	border: 2rpx solid #333333;
	/* 可选：添加边框 */
	padding: 16rpx;
	/* 可选：添加内边距 */
	text-align: center;
	/* 水平居中 */
	vertical-align: middle;
	/* 垂直居中 */
	box-sizing: border-box;
	/* 包含边框和内边距在宽度内 */
	width: 118rpx;
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

.typing-line {
	display: block;
	opacity: 0;
	width: 0;
	overflow: hidden;
	white-space: nowrap;
	animation: typing 0.5s forwards;
	// font-size:32rpx;
	// font-family: 'YRDZS-Semibold', Arial, sans-serif;
	padding-top: 12rpx;
	color: #8f3e04;
}

@keyframes typing {
	from {
		opacity: 0;
		width: 0;
	}

	to {
		opacity: 1;
		width: 100%;
	}
}
</style>
