<template>
	<view class="vw100 vh100 bg-gray" style="overflow: hidden">
		<view v-if="pinia_work == 'Y'" class="ml24 mr24 pd24 mt24 bg-white" style="border-radius: 24rpx">
			<view class="flex-row justify-left mb20" style="height: 10%; width: 100%">
				<view class="" style="width: 20vw">
					<text class="" style="font-weight: bold">老板信息</text>
				</view>
			</view>
			<view class="flex-row justify-left" style="height: 90%; width: 100%">
				<view class="flex-row justify-left items-center" style="width: 10%">
					<up-image
						class="ml20 mt15"
						width="80rpx"
						height="80rpx"
						shape="circle"
						:show-menu-by-longpress="false"
						:src="pinia_user.workData.img || img"
						@click="addStaff(item)"
					></up-image>
					<text class="ml10">{{ pinia_user.workData.bossNumber }}</text>
				</view>
				<view class="flex-row justify-end" style="width: 90%"></view>
			</view>
		</view>
		<view v-if="pinia_work == 'N'" class="ml24 mr24 pt25 pd24 bg-white mt30" @click="clear()" style="border-radius: 24rpx">
			<view class="flex-row justify-left" style="height: 10%; width: 100%">
				<view class="" style="width: 20vw">
					<text class="" style="font-weight: bold">合伙人</text>
				</view>
				<view class="absolute" style="width: 66vw; right: 48rpx">
					<button
						class="flex-col justify-center items-center"
						@click.stop="addRoleSet(1)"
						style="
							background-color: #00b578;
							width: 120rpx;
							height: 50rpx;
							border-radius: 508rpx;
							font-size: 24rpx;
							color: white;
							float: right;
							border: 2rpx solid transparent;
							border: none;
							border-style: none;
						"
					>
						邀请
					</button>

					<view
						class="flex-col justify-center items-center pd15"
						v-show="showAl == 1"
						style="
							background-color: #666666;
							width: 200rpx;
							height: 152rpx;
							position: absolute;
							right: 0;
							top: 70rpx;
							z-index: 999;
							color: #ffffff;
							border-radius: 8rpx;
							opacity: 1;
							transition: opacity 10s ease-in-out;
						"
					>
						<view
							class=""
							style="
								width: 0;
								height: 0;
								border-left: 20rpx solid transparent;
								border-right: 20rpx solid transparent;
								border-bottom: 20rpx solid #666666;
								position: absolute;
								right: 10rpx;
								top: -16rpx;
							"
						></view>
						<view class="flex-row u-border-bottom pd20 items-center" @click="getPhone(1)">
							<view class="mr15"><albb-icon icon="ydj-shoujihao" color="#ffffff" size="30rpx"></albb-icon></view>
							<text style="font-weight: normal">手机号</text>
						</view>
						<view class="pd16 flex-row items-center" @click="scanQRcodes(1)">
							<view class="mr15"><albb-icon icon="ydj-saoyisao" color="#ffffff" size="35rpx"></albb-icon></view>
							<text style="font-weight: normal">扫一扫</text>
						</view>
					</view>
				</view>
			</view>
			<view class="flex-row justify-left" v-if="userUrl['1'].length == 0" style="height: 90%; width: 100%">
				<view class="flex-row justify-center items-center" style="width: 10%">
					<view class="mt20"><wd-icon name="https://res-oss.elist.com.cn/wxImg/vip/init.svg" shape="circle" size="80rpx" @click=""></wd-icon></view>
				</view>
			</view>

			<view class="" v-else>
				<view class="flex-col justify-left pt20 pb20" v-for="(item, index) in userUrl['1']" :key="index" style="height: 90%; width: 100%">
					<view class="flex-row justify-left items-center mt20">
						<view v-if="item.name == ''" class="flex-row justify-left items-center" style="width: 10%">
							<up-image
								class=""
								width="80rpx"
								height="80rpx"
								shape="circle"
								:src="item.img || img"
								:show-menu-by-longpress="false"
								@click="addStaff(item)"
							></up-image>
							<text class="ml10">{{ item.name }}</text>
							<text class="ml15 jzzh" :style="{ color: expireDate(item.endTime) ? '' : '#FA5151' }">账号截止到{{ $u.timeFormat(item.endTime, 'yyyy-mm-dd') }}</text>
							<view v-if="item.staffNumber == 0" @click="RenewPeople(item, 1)" class="xf flex-col justify-center items-center ml24" style="">续费</view>
						</view>

						<view v-else class="flex-row justify-left items-center" style="width: 10%">
							<up-image
								class=""
								width="80rpx"
								height="80rpx"
								shape="circle"
								:src="item.img || img"
								:show-menu-by-longpress="false"
								@click="addStaff(item)"
							></up-image>
							<view class="flex-col ml20">
								<view class="flex-row items-center">
									<text class="ml10 ft16">{{ item.name }}</text>
									<view @click="RenewPeople(item, 1)" class="ml24 xf flex-col justify-center items-center">续费</view>
								</view>
								<text class="ml15 jzzh mt20" :style="{ color: expireDate(item.endTime) ? '' : '#FA5151' }">
									账号截止到{{ $u.timeFormat(item.endTime, 'yyyy-mm-dd') }}
								</text>
							</view>
						</view>

						<view class="flex-row justify-end items-center" style="width: 92%">
							<view class="mr30" v-if="item.name != ''">
								<wd-icon name="delete1" @click="deleteRole(item)" size="35rpx" color="#333333"></wd-icon>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view v-if="pinia_work == 'N'" class="ml24 mr24 pt25 pd24 bg-white mt30" @click="clear()" style="border-radius: 24rpx">
			<view class="flex-row justify-left" style="height: 10%; width: 100%">
				<view class="" style="width: 20vw">
					<text class="" style="font-weight: bold">财务</text>
				</view>
				<view class="absolute" style="width: 66vw; right: 48rpx">
					<button
						class="flex-col justify-center items-center"
						@click.stop="addRoleSet(3)"
						style="
							background-color: #00b578;
							width: 120rpx;
							height: 50rpx;
							border-radius: 508rpx;
							font-size: 24rpx;
							color: white;
							float: right;
							border: 2rpx solid transparent;
							border: none;
							border-style: none;
						"
					>
						邀请
					</button>

					<view
						class="flex-col justify-center items-center pd15"
						v-show="showAl == 3"
						style="
							background-color: #666666;
							width: 200rpx;
							height: 152rpx;
							position: absolute;
							right: 0;
							top: 70rpx;
							z-index: 999;
							color: #ffffff;
							border-radius: 8rpx;
							opacity: 1;
							transition: opacity 10s ease-in-out;
						"
					>
						<view
							class=""
							style="
								width: 0;
								height: 0;
								border-left: 20rpx solid transparent;
								border-right: 20rpx solid transparent;
								border-bottom: 20rpx solid #666666;
								position: absolute;
								right: 10rpx;
								top: -16rpx;
							"
						></view>
						<view class="flex-row u-border-bottom pd20 items-center" @click="getPhone(3)">
							<view class="mr15"><albb-icon icon="ydj-shoujihao" color="#ffffff" size="30rpx"></albb-icon></view>
							<text style="font-weight: normal">手机号</text>
						</view>
						<view class="pd16 flex-row items-center" @click="scanQRcodes(3)">
							<view class="mr15"><albb-icon icon="ydj-saoyisao" color="#ffffff" size="35rpx"></albb-icon></view>
							<text style="font-weight: normal">扫一扫</text>
						</view>
					</view>
				</view>
			</view>
			<view class="flex-row justify-left" v-if="userUrl['3'].length == 0" style="height: 90%; width: 100%">
				<view class="flex-row justify-center items-center" style="width: 10%">
					<view class="mt20"><wd-icon name="https://res-oss.elist.com.cn/wxImg/vip/init.svg" shape="circle" size="80rpx" @click=""></wd-icon></view>
				</view>
			</view>
			<view class="" v-else>
				<view class="flex-col justify-left pt20 pb20" v-for="(item, index) in userUrl['3']" :key="index" style="height: 90%; width: 100%">
					<view class="flex-row justify-left items-center mt20">
						<view v-if="item.name == ''" class="flex-row justify-left items-center" style="width: 10%">
							<up-image
								class=""
								width="80rpx"
								height="80rpx"
								shape="circle"
								:src="item.img || img"
								:show-menu-by-longpress="false"
								@click="addStaff(item)"
							></up-image>
							<text class="ml10">{{ item.name }}</text>
							<text class="ml15 jzzh" :style="{ color: expireDate(item.endTime) ? '' : '#FA5151' }">账号截止到{{ $u.timeFormat(item.endTime, 'yyyy-mm-dd') }}</text>
							<view v-if="item.staffNumber == 0" @click="RenewPeople(item, 3)" class="xf flex-col justify-center items-center ml24" style="">续费</view>
						</view>

						<view v-else class="flex-row justify-left items-center" style="width: 10%">
							<up-image
								class=""
								width="80rpx"
								height="80rpx"
								shape="circle"
								:src="item.img || img"
								:show-menu-by-longpress="false"
								@click="addStaff(item)"
							></up-image>
							<view class="flex-col ml20">
								<view class="flex-row items-center">
									<text class="ml10 ft16">{{ item.name }}</text>
									<view @click="RenewPeople(item, 3)" class="ml24 xf flex-col justify-center items-center">续费</view>
								</view>
								<text class="ml15 jzzh mt20" :style="{ color: expireDate(item.endTime) ? '' : '#FA5151' }">
									账号截止到{{ $u.timeFormat(item.endTime, 'yyyy-mm-dd') }}
								</text>
							</view>
						</view>

						<view class="flex-row justify-end items-center" style="width: 92%">
							<view class="mr30" v-if="item.name != ''">
								<wd-icon name="delete1" @click="deleteRole(item)" size="35rpx" color="#333333"></wd-icon>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view v-if="pinia_work == 'N'" class="ml24 mr24 pt25 pd24 bg-white mt30" @click="clear()" style="border-radius: 24rpx">
			<view class="flex-row justify-left" style="height: 10%; width: 100%">
				<view class="" style="width: 24vw">
					<text class="" style="font-weight: bold">员工</text>
				</view>
				<view class="absolute" style="width: 66vw; right: 48rpx">
					<button
						class="flex-col justify-center items-center"
						@click.stop="addRoleSet(4)"
						style="
							background-color: #00b578;
							width: 120rpx;
							height: 50rpx;
							border-radius: 508rpx;
							font-size: 24rpx;
							color: white;
							float: right;
							border: 2rpx solid transparent;
							border: none;
							border-style: none;
						"
					>
						邀请
					</button>
					<view
						class="flex-col justify-center items-center pd15"
						v-show="showAl == 4"
						style="
							background-color: #666666;
							width: 200rpx;
							height: 152rpx;
							position: absolute;
							right: 0;
							top: 70rpx;
							z-index: 999;
							color: #ffffff;
							border-radius: 8rpx;
							opacity: 1;
							transition: opacity 10s ease-in-out;
						"
					>
						<view
							class=""
							style="
								width: 0;
								height: 0;
								border-left: 20rpx solid transparent;
								border-right: 20rpx solid transparent;
								border-bottom: 20rpx solid #666666;
								position: absolute;
								right: 10rpx;
								top: -16rpx;
							"
						></view>
						<view class="flex-row u-border-bottom pd20 items-center" @click="getPhone(4)">
							<view class="mr15"><albb-icon icon="ydj-shoujihao" color="#ffffff" size="30rpx"></albb-icon></view>
							<text style="font-weight: normal">手机号</text>
						</view>
						<view class="pd16 flex-row items-center" @click="scanQRcodes(4)">
							<view class="mr15"><albb-icon icon="ydj-saoyisao" color="#ffffff" size="35rpx"></albb-icon></view>
							<text style="font-weight: normal">扫一扫</text>
						</view>
					</view>
				</view>
			</view>

			<view class="flex-row justify-left" v-if="userUrl['4'].length == 0" style="height: 90%; width: 100%">
				<view class="flex-row justify-center items-center" style="width: 10%">
					<view class="mt20"><wd-icon name="https://res-oss.elist.com.cn/wxImg/vip/init.svg" shape="circle" size="80rpx" @click=""></wd-icon></view>
				</view>
			</view>
			<view class="" v-else>
				<view class="flex-col justify-left pt20 pb20" v-for="(item, index) in userUrl['4']" :key="index" style="height: 90%; width: 100%">
					<view class="flex-row justify-left items-center mt20">
						<view v-if="item.name == ''" class="flex-row justify-left items-center" style="width: 10%">
							<up-image
								class=""
								width="80rpx"
								height="80rpx"
								shape="circle"
								:src="item.img || img"
								:show-menu-by-longpress="false"
								@click="addStaff(item)"
							></up-image>
							<text class="ml10">{{ item.name }}</text>
							<text class="ml15 jzzh" :style="{ color: expireDate(item.endTime) ? '' : '#FA5151' }">账号截止到{{ $u.timeFormat(item.endTime, 'yyyy-mm-dd') }}</text>
							<view v-if="item.staffNumber == 0" @click="RenewPeople(item, 4)" class="xf flex-col justify-center items-center ml24" style="">续费</view>
						</view>

						<view v-else class="flex-row justify-left items-center" style="width: 10%">
							<up-image
								class=""
								width="80rpx"
								height="80rpx"
								shape="circle"
								:src="item.img || img"
								:show-menu-by-longpress="false"
								@click="addStaff(item)"
							></up-image>
							<view class="flex-col ml20">
								<view class="flex-row items-center">
									<text class="ml10 ft16">{{ item.name }}</text>
									<view @click="RenewPeople(item, 4)" class="ml24 xf flex-col justify-center items-center">续费</view>
								</view>
								<text class="ml15 jzzh mt20" :style="{ color: expireDate(item.endTime) ? '' : '#FA5151' }">
									账号截止到{{ $u.timeFormat(item.endTime, 'yyyy-mm-dd') }}
								</text>
							</view>
						</view>
						<view class="flex-row justify-end" style="width: 92%">
							<view class="mr30" v-if="item.name != ''">
								<wd-icon name="delete1" @click="deleteRole(item)" size="35rpx" color="#333333"></wd-icon>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- </view> -->
		<up-modal
			:show="show"
			title="提示"
			:content="gs != undefined && gs != '' ? `该用户已在${gs}，您无法对该用户发起邀请` : '该用户已进入其他账户，您无法对该用户发起邀请'"
			confirmColor="#01bb74"
			:closeOnClickOverlay="true"
			contentTextAlign="center"
			@close="show = false"
			@confirm="
				show = false;
				gs = '';
			"
			confirmText="我知道了"
		></up-modal>
		<pop-renew ref="popRenew" :item="buy"></pop-renew>
	</view>
</template>

<script>
export default {
	data() {
		return {
			imgListIOS: {
				ygxf: 'https://res-oss.elist.com.cn/wxImg/vip/ygxf.png',
				cwxf: 'https://res-oss.elist.com.cn/wxImg/vip/cwxf.png',
				yggm: 'https://res-oss.elist.com.cn/wxImg/vip/yggm.png',
				cwgm: 'https://res-oss.elist.com.cn/wxImg/vip/cwgm.png',
				hhrgm: 'https://res-oss.elist.com.cn/wxImg/vip/hhr.png',
				hhrxf: 'https://res-oss.elist.com.cn/wxImg/vip/hhrxf.png'
			},
			imgList: {
				ygxf: 'https://res-oss.elist.com.cn/wxImg/vip/ygxf.svg',
				cwxf: 'https://res-oss.elist.com.cn/wxImg/vip/cwxf.svg',
				yggm: 'https://res-oss.elist.com.cn/wxImg/vip/yggm.svg',
				cwgm: 'https://res-oss.elist.com.cn/wxImg/vip/cwgm.svg',
				hhrgm: 'https://res-oss.elist.com.cn/wxImg/vip/hhr.svg',
				hhrxf: 'https://res-oss.elist.com.cn/wxImg/vip/hhrxf.svg'
			},
			show: false,
			showAl: 0,
			user: {
				1: '老板',
				2: '财务',
				3: '现场管理',
				4: '合伙人'
			},
			userUrl: {
				1: [
					// {
					// 	name: ''
					// }
				],
				2: [
					// {
					// 	name: ''
					// }
				],
				3: [
					// {
					// 	name: ''
					// }
				],
				4: [
					// {
					// 	name: ''
					// }
				]
			},
			img: 'https://res-oss.elist.com.cn/wxImg/obj/defind.svg',
			subjectRole: 0,
			scanResult: '',
			gs: '',
			buy: {},
			system: false
		};
	},
	onShow() {
		// this.SOCKETfLUSH();
		var listz = [];
		if (this.pinia_user.data.work != '1') {
			this.loadDataPeop();
		} else {
			console.log('已加入别的公司');
		}

		this.systemIf();
	},
	onPullDownRefresh() {
		console.log('下拉');
		var listz = [];
		if (this.pinia_user.data.work != '1') {
			this.loadDataPeop();
		}
		this.systemIf();
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	methods: {
		SOCKETfLUSH() {
			this.unwatchFlush = this.$watch(
				(state) => state.flush, // 监听状态
				(newVal, oldVal) => {
					this.flushIndex = newVal; // 当状态变化时，更新本地数据
					console.log('people flush 改变:', newVal);
					this.loadDataPeop();
				}
			);
		},
		expireDate(date) {
			let now = new Date();
			let month = now.getMonth() + 1;
			if (month > 11) {
				now.setFullYear(now.getFullYear() + 1);
				month = 0;
			}
			now.setMonth(month);
			let nows = new Date(this.$u.timeFormat(date, 'yyyy-mm-dd'));

			return nows > now;
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
		CrearOrderBuy(json, index) {
			console.log('触发购买');
			var productCode = {
				totalPrice: 0,
				CODE: [],
				peopleRenew: [],
				price: {
					C1: 0,
					C2: 0,
					C3: 0
				},
				time: {
					C1: '',
					C2: '',
					C3: ''
				}
			};

			var jsonI = '';
			if (index == 3) {
				json.forEach((res) => {
					var i = res.type == 'C1';
					if (i) {
						jsonI = res;
					}
				});
			}

			if (index == 4) {
				json.forEach((res) => {
					var i = res.type == 'C2';
					if (i) {
						jsonI = res;
					}
				});
			}

			if (index == 1) {
				json.forEach((res) => {
					var i = res.type == 'C3';
					if (i) {
						jsonI = res;
					}
				});
			}

			productCode.time[jsonI.type] = new Date().toISOString();
			productCode.totalPrice = parseFloat(jsonI.priceDiscount);
			productCode.price[jsonI.type] = jsonI.priceDiscount;
			productCode.CODE = index == 3 ? ['C1-1'] : index == 1 ? ['C3-1'] : ['C2-1'];

			let order = {
				orderNumber: '', // 订单编号
				price: parseFloat(jsonI.priceDiscount), // 支付总价（注：通常价格应该是一个数字或BigDecimal的字符串表示，但这里按照要求设置为空字符串）
				payment: (parseFloat(jsonI.priceDiscount) * 100).toFixed(0), // 支付金额（同样，支付金额通常应为数字或字符串形式的金额，这里设为空字符串）
				productCode: JSON.stringify(productCode), // 产品编码
				particulars: JSON.stringify(jsonI), // 细节
				state: '', // 状态
				type: '', // 类型
				phone: this.pinia_user.phone, // 所属者（这里假设所属者是通过电话号码表示的，但根据实际情况可能有所不同）
				description: '单独购买'
			};

			console.log('最后的订单：', order);

			uni.setStorageSync('Renew', JSON.stringify(order));

			this.$refs.popRenew.orderPrice = parseFloat(jsonI.priceDiscount);
			this.buy = order;
			if (index == 4) {
				if (!this.system) {
					this.$refs.popRenew.src = this.imgListIOS.yggm + '?time=' + this.getTimestamp();
				} else {
					this.$refs.popRenew.src = this.imgList.yggm + '?time=' + this.getTimestamp();
				}
			} else if (index == 3) {
				if (!this.system) {
					this.$refs.popRenew.src = this.imgListIOS.cwgm + '?time=' + this.getTimestamp();
				} else {
					this.$refs.popRenew.src = this.imgList.cwgm + '?time=' + this.getTimestamp();
				}
			} else if (index == 1) {
				if (!this.system) {
					this.$refs.popRenew.src = this.imgListIOS.hhrgm + '?time=' + this.getTimestamp();
				} else {
					this.$refs.popRenew.src = this.imgList.hhrgm + '?time=' + this.getTimestamp();
				}
			}
			console.log('最后的图片：', this.$refs.popRenew.src);
			this.$refs.popRenew.roleShow = true;
		},
		CrearOrder(json, index) {
			console.log('触发续费');
			var productCode = {
				totalPrice: 0,
				CODE: [],
				peopleRenew: [],
				price: {
					C1: 0,
					C2: 0,
					C3: 0
				},
				time: {
					C1: '',
					C2: '',
					C3: ''
				}
			};

			productCode.peopleRenew = [json.id];
			productCode.time[json.code] = json.endTime;
			productCode.totalPrice = parseFloat(json.price);
			productCode.price[json.code] = json.price;

			let order = {
				orderNumber: '', // 订单编号
				price: parseFloat(json.price), // 支付总价（注：通常价格应该是一个数字或BigDecimal的字符串表示，但这里按照要求设置为空字符串）
				payment: (parseFloat(json.price) * 100).toFixed(0), // 支付金额（同样，支付金额通常应为数字或字符串形式的金额，这里设为空字符串）
				productCode: JSON.stringify(productCode), // 产品编码
				particulars: JSON.stringify(json), // 细节
				state: '', // 状态
				type: '', // 类型
				phone: this.pinia_user.phone, // 所属者（这里假设所属者是通过电话号码表示的，但根据实际情况可能有所不同）
				description: '单独续费'
			};

			console.log('最后的订单：', order);

			uni.setStorageSync('Renew', JSON.stringify(order));

			this.$refs.popRenew.orderPrice = parseFloat(json.price);
			this.buy = order;
			if (index == 4) {
				if (!this.system) {
					this.$refs.popRenew.src = this.imgListIOS.ygxf + '?time=' + this.getTimestamp();
				} else {
					this.$refs.popRenew.src = this.imgList.ygxf + '?time=' + this.getTimestamp();
				}
			} else if (index == 3) {
				if (!this.system) {
					this.$refs.popRenew.src = this.imgListIOS.cwxf + '?time=' + this.getTimestamp();
				} else {
					this.$refs.popRenew.src = this.imgList.cwxf + '?time=' + this.getTimestamp();
				}
			} else if (index == 1) {
				if (!this.system) {
					this.$refs.popRenew.src = this.imgListIOS.hhrxf + '?time=' + this.getTimestamp();
				} else {
					this.$refs.popRenew.src = this.imgList.hhrxf + '?time=' + this.getTimestamp();
				}
			}
			this.$refs.popRenew.roleShow = true;
		},
		getTimestamp() {
			let now = new Date();
			now.setSeconds(0, 0);
			let timestampWithHoursOnly = now.getTime();
			return timestampWithHoursOnly;
		},
		getPricePeopleAll(index) {
			uni.$api.pay.getSubUserLimit({}).then((res) => {
				console.log(res);
				this.CrearOrderBuy(res.data.data, index);
			});
		},
		getPriceAll(id, phone, index, type) {
			var dx = {
				id: id,
				phone: phone
			};
			uni.$api.pay.getOpenedPermissions(dx).then((res) => {
				this.CrearOrder(res.data.data, index);
			});
		},
		RenewPeople(item, index) {
			console.log(item);
			var jurisdictionCode = item.jurisdictionCode;
			var phone = this.pinia_user.phone;
			//查询价格
			this.getPriceAll(jurisdictionCode, phone, index, 2);
			//查询权限 是否是他的权限
			//创建订单
			//发起支付
		},
		clear() {
			console.log('消除');
			this.showAl = 0;
		},
		addStaff(item) {
			console.log(item);
			if (item.staffNumber == '0') {
				uni.setStorageSync('invite', item.identity);
				console.log('空缺员工');
				// uni.setStorageSync("addstaff", JSON.stringify(item))
				uni.navigateTo({
					url: '/pages/index/add_friend/add_friend'
				});
			}
		},
		loadDataPeop() {
			var that = this;
			uni.$api.user
				.getRelationList({
					bossNumber: this.pinia_user.phone
				})
				.then((res) => {
					var resDate = res.data.data;
					that.userUrl['4'] = resDate['4'] || [];
					that.userUrl['3'] = resDate['3'] || [];
					that.userUrl['2'] = resDate['2'] || [];
					that.userUrl['1'] = resDate['1'] || [];
					console.log('that.userUrl', that.userUrl);
				})
				.catch((res) => {
					that.$u.toast(res.data.message);
				});
		},
		addRoleSet(subjectRole) {
			//坑位验证
			//购买坑位 一个一个买
			if (subjectRole == '3') {
				console.log('财务：', this.userUrl['3']);
				var cw = 0;
				this.userUrl['3'].forEach((res) => {
					var add = res.staffNumber;
					if (add == '0') {
						cw = cw + 1;
					}
				});

				if (cw > 0) {
					this.showAl = subjectRole;
					console.log('添加身份' + subjectRole);
					uni.setStorageSync('invite', subjectRole);
				} else {
					//购买弹框
					this.getPricePeopleAll(subjectRole);
				}
			} else if (subjectRole == '4') {
				console.log('员工：', this.userUrl['4']);
				var yg = 0;
				this.userUrl['4'].forEach((res) => {
					var add = res.staffNumber;
					if (add == '0') {
						yg = yg + 1;
					}
				});

				if (yg > 0) {
					this.showAl = subjectRole;
					console.log('添加身份' + subjectRole);
					uni.setStorageSync('invite', subjectRole);
				} else {
					//购买弹框
					this.getPricePeopleAll(subjectRole);
				}
			} else if (subjectRole == '1') {
				console.log('合伙人：', this.userUrl['1']);
				var hhr = 0;
				this.userUrl['1'].forEach((res) => {
					var add = res.staffNumber;
					if (add == '0') {
						hhr = hhr + 1;
					}
				});

				if (hhr > 0) {
					this.showAl = subjectRole;
					console.log('添加身份' + subjectRole);
					uni.setStorageSync('invite', subjectRole);
				} else {
					//购买弹框
					this.getPricePeopleAll(subjectRole);
				}
			}
		},
		getPhone(subjectRole) {
			this.showAl = subjectRole;
			console.log('添加身份' + subjectRole);
			uni.setStorageSync('invite', subjectRole);
			uni.navigateTo({
				url: '/pages/subIndex/add_friend/add_yg'
			});
		},
		deleteRole(val) {
			const that = this;
			uni.showModal({
				title: '温馨提示',
				content: '是否移除当前用户的身份？',
				cancelText: '再考虑下',
				confirmText: '确定移除',
				confirmColor: '#01bb74',
				success: (res) => {
					if (res.confirm) {
						console.log(val);
						uni.$api.user
							.deleteRelation(val)
							.then((res) => {
								console.log(res);
								this.loadDataPeop();
							})
							.catch((res) => {
								that.$u.toast(res.data.message);
							});
					}
				}
			});
		},
		verification(phone, json, e) {
			uni.$api.user.searchUser({ phone: phone }).then((res) => {
				this.gs = res.data.data.map.enterpriseName;
				if (res.data.data.work != '0') {
					this.show = true;
				} else {
					this.addFriendYG(json.phone, json.img, e);
				}
			});
		},
		selectDB(phone, json, e) {
			uni.$api.user.searchUser({ phone: phone }).then((res) => {
				this.gs = res.data.data.map.enterpriseName;
				if (res.data.data.work == '0') {
					this.addFriendYG(json.phone, json.img, e);
				} else {
					this.verification(json.phone);
				}
			});
		},
		// 更换授权用户
		changeUser(val) {
			const that = this;
			uni.showModal({
				title: '离职账号迁移',
				cancelText: '取消',
				confirmText: '确定',
				editable: true,
				placeholderText: '请输入新账号手机号~',
				confirmColor: '#01bb74',
				success: (res) => {
					if (res.confirm) {
						if (!that.$u.test.mobile(res.content)) {
							that.$u.toast('请输入手机号码后确定~');
							return;
						}
					}
				}
			});
		},
		scanQRcodes(e) {
			const that = this;
			uni.scanCode({
				success: (res) => {
					that.scanResult = res.result;
					var json = JSON.parse(that.scanResult);
					console.log('扫码:', json);
					this.addYg(json);
				},
				fail: (err) => {
					console.error('扫码失败:', err);
					this.$u.toast('扫码失败~');
				}
			});
		},
		addYg(json) {
			var addPhone = json.phone;
			uni.$api.user.searchUser({ phone: addPhone }).then((res) => {
				var data = res.data.data;
				var work = data.work == '1';
				var phone = data.phoneNumber;
				var myPhone = this.pinia_user.phone;
				if (work) {
					// this.$u.toast("此人已经工作~")
					this.gs = data.map.enterpriseName;
					this.show = true;
				} else {
					if (phone == myPhone) {
						this.$u.toast('请勿添加自己~');
						return;
					}
					if (addPhone == myPhone) {
						this.$u.toast('请勿添加自己~');
						return;
					}
					this.addFriendYG(phone);
				}
				console.log('检索号码', data);
			});
		},
		flushDBSX(val) {
			var list = [val];
			uni.$api.task
				.startRWFlow({ list: list })
				.then((res) => {
					console.log('请求结果：' + res);
				})
				.catch((res) => {});
		},
		addFriendYG(e, img, invite) {
			if (e == this.pinia_user.phone) {
				this.$u.toast('请勿添加自己~');
			} else {
				var yg = {
					aUser: this.pinia_user.phone,
					bUser: e,
					aName: this.pinia_user.data.name,
					workNumber: '',
					ifType: uni.getStorageSync('invite'),
					img: this.pinia_user.data.headPortrait
				};

				console.log('扫码添加员工：', yg);
				uni.$api.bills.addApply(JSON.stringify(yg)).then((res) => {
					console.log(res.data.data);
					this.$u.toast(res.data.message);
					if (res.data.data == 1) {
						this.flushDBSX(yg.bUser);
					}
				});
			}
		}
	}
};
</script>

<style lang="scss">
.jzzh {
	color: #999999;
	font-size: 28rpx;
	font-weight: normal;
	letter-spacing: 0.05em;
}
::v-deep button::after {
	border: none !important; //按钮外边框border隐藏
}
.xf {
	background: linear-gradient(286deg, #f9d2aa 7%, #ffecd3 82%);
	border-radius: 397.32rpx;
	width: 104rpx;
	height: 44rpx;
	color: #a47a4d;
	font-size: 24rpx;
	font-weight: normal;
}
</style>