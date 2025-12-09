<template>
	<view class="modification">
		<z-paging
			ref="paging"
			use-virtual-list
			:force-close-inner-list="true"
			:showEmpty="true"
			:hide-empty-view="hideEmptyView"
			:cell-height-mode="1 === 0 ? 'fixed' : 'dynamic'"
			@virtualListChange="virtualListChange"
			@query="queryList"
		>
			<template #top>
				<up-navbar
					:placeholder="true"
					back-icon-color="#000000"
					:titleBold="true"
					title-color="#000000"
					title="商品库"
					title-size="34"
					@leftClick="customBack"
					bgColor="transparent"
				>
					<template #right>
						<!-- #ifndef MP-WEIXIN -->
						<!-- <wd-icon name="share" size="44rpx" @click="toShare"></wd-icon> -->
						<!-- #endif -->
					</template>
				</up-navbar>
				<view class="ml24 mr24 flex-row items-center justify-center pb30">
					<view class="flex-row items-center justify-center pl20 pr10 flex-1" style="background: #ffffff; border-radius: 254rpx; height: 60rpx">
						<wd-icon name="search" color="#01BB74" size="34rpx"></wd-icon>
						<uv-input
							:customStyle="{
								backgroundColor: 'transparent',
								marginLeft: '10rpx'
							}"
							v-model="SearchInventory"
							placeholder="请输入商品名称/规格"
							:clearable="true"
							border="none"
							@change="SearchInventoryChange"
						></uv-input>
					</view>
					<wd-button @click="jumpAddCommodity" :customStyle="SearchCustomStyle" size="small" :round="false">添加商品</wd-button>
					<!-- #ifdef MP-WEIXIN -->
					<!-- <view class="ml20">
						<button open-type="share" class="shareBtn" hover-class="none"><wd-icon name="share" size="44rpx"></wd-icon></button>
					</view> -->
					<!-- #endif -->
				</view>
			</template>

			<up-empty
				v-if="invCardEmpty && hideEmptyView"
				icon="https://res-oss.elist.com.cn/wxImg/order/goodsEmpty.svg"
				iconSize="200rpx"
				text="商品库空空如也~尝试添加一个新商品吧！"
				marginTop="200rpx"
			>
				<wd-button
					iconColor="#ECFFF9"
					:customStyle="{ width: '300rpx', height: '80rpx', fontSize: '32rpx', marginTop: '76rpx', background: 'transparent', color: '#01BB74' }"
					:plain="true"
					@click="jumpAddCommodity"
				>
					<text>去添加</text>
				</wd-button>
			</up-empty>

			<!-- <view class="items-center" v-if="invCardEmpty && hideEmptyView">
				<view class="invCard" @click="jumpAddCommodity">
					<view class="">
						<up-image radius="12rpx" width="200rpx" height="200rpx" :show-menu-by-longpress="false" src="https://res-oss.elist.com.cn/wxImg/order/SlView.png"></up-image>
					</view>
					<view class="invText" style="width: 350rpx">
						<text>示例商品 1</text>
						<text>规格：00A1</text>
						<text>单位：个</text>
					</view>
					<wd-icon @tab.stop class="absolute" style="bottom: 24rpx; right: 24rpx" name="add-circle1" color="#01BB74" size="50rpx"></wd-icon>
				</view>
				<view class="flex-row justify-center items-center mt80 pb24">
					<view
						class="flex-row justify-center items-center"
						@click="jumpAddCommodity"
						style="width: 280rpx; height: 80rpx; border-radius: 338.4rpx; box-sizing: border-box; border: 3rpx solid #01bb74"
					>
						<view class="absolute">
							<wd-icon label="添加商品" labelColor="#01BB74" name="add" color="#01BB74" size="30rpx"></wd-icon>
						</view>
					</view>
				</view>
			</view> -->

			<view class="invCard relative" v-for="(item, index) in orderList" :key="index">
				<view class="" @click="jumpCommodityDetails(item)">
					<up-image
						radius="12rpx"
						width="200rpx"
						height="200rpx"
						:show-menu-by-longpress="false"
						:src="item.img === 'definde' ? 'https://res-oss.elist.com.cn/wxImg/order/emptyView.png' : item.img"
					></up-image>
				</view>
				<view class="invText flex-1 pt12" @click="jumpCommodityDetails(item)" v-if="uni.$u.getPinia('user.customized')">
					<text>{{ item.description }}</text>
					<text class="up-line-1">型号：{{ item.modelNo }}</text>
					<text>长度(毫米)：{{ item.lengthMm }}</text>
					<text>单重(kg/件)：{{ item.unitWeightKg }}</text>
				</view>
				<view class="invText flex-1 pt12" @click="jumpCommodityDetails(item)" v-else>
					<text>{{ item.description }}</text>
					<text class="up-line-1" style="width: 418rpx">规格：{{ item.specification }}</text>
					<text>单位：{{ item.unit }}</text>
					<text>单价：{{ item.unitPrice == '0' ? '-' : '￥' + item.unitPrice }}</text>
				</view>
				<!-- class="absolute" style="bottom: 24rpx; right: 24rpx" -->
				<view class="absolute addicon" :id="index == 0 ? 'box1' : ''">
					<wd-icon @tab.stop name="add-circle1" color="#01BB74" size="40rpx" @click="addOrderBill(item)"></wd-icon>
				</view>
			</view>

			<template #bottom>
				<view class="bottomCard">
					<view class="relative" id="box2">
						<wd-icon name="https://res-oss.elist.com.cn/wxImg/order/merchandiseInventory.png" size="110rpx" @click="AlertCard"></wd-icon>
						<up-badge absolute bgColor="#FA5151" :value="orderItemList.length" :offset="['0rpx', '-20rpx']"></up-badge>
					</view>

					<text class="">
						<text>合计</text>
						<text v-if="uni.$u.getPinia('user.customized')">(KG)</text>
						<text>：</text>
						<text style="color: #01bb74" v-if="uni.$u.getPinia('user.customized')">{{ formatAmount(totalPrices) }}</text>
						<text style="color: #01bb74" v-else>￥{{ formatAmount(totalPrices) }}</text>
					</text>
					<wd-button :customStyle="bottomCustomStyle" @click="save">保存</wd-button>
				</view>
			</template>
		</z-paging>

		<up-popup :show="shoppingTrolley" @close="shoppingTrolley = false" mode="bottom" round="15">
			<view class="" style="width: 100%; height: 70vh; padding-top: 24rpx">
				<z-paging v-if="shoppingTrolley" ref="pagingCheck" :fixed="false" v-model="addList" @query="queryListCheck">
					<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
					<template #top>
						<view style="height: 24rpx"></view>
					</template>
					<!-- <up-swipe-action> -->
					<view class="OrderCard" style="width: 94vw" v-for="(item, index) in orderItemList" :key="index">
						<!-- <up-swipe-action-item :show="item.show" :options="options" :name="index" @click="delclick" @open="open"> -->
						<view class="absolute" style="right: 24rpx; top: 18rpx">
							<wd-icon name="minus-circle-filled" color="#FA5151" size="40rpx" @click="delclick(index)"></wd-icon>
						</view>
						<view class="flex-row pb15" style="width: 93%" v-if="uni.$u.getPinia('user.customized')">
							<view class="">品名:</view>
							<view class="flex-1 up-line-1">{{ item.description }}</view>
						</view>
						<view class="flex-row pb15" :style="uni.$u.getPinia('user.customized') ? '' : 'width: 93%'">
							<view class="" v-if="!uni.$u.getPinia('user.customized')">品名:</view>
							<view class="flex-1 up-line-1" v-if="!uni.$u.getPinia('user.customized')">{{ item.description }}</view>
							<view :class="uni.$u.getPinia('user.customized') ? '' : 'ml10'">规格:</view>
							<view class="flex-1 up-line-1">{{ item.specification }}</view>
							<view class="ml10" v-if="uni.$u.getPinia('user.customized')">型号:</view>
							<view class="flex-1 up-line-1" v-if="uni.$u.getPinia('user.customized')">{{ item.modelNo }}</view>
						</view>
						<view class="flex-row items-center justify-center" style="width: 100%">
							<up-line class="u-line ml24 mr24" color="#E0E0E0" length="100%"></up-line>
						</view>
						<up-table border-color="#ffffff">
							<up-tr>
								<up-td>数量</up-td>
								<up-td>
									<view class="" style="width: 160rpx">
										{{ uni.$u.getPinia('user.customized') ? '长度' : '单位' }}
									</view>
								</up-td>
								<up-td>{{ uni.$u.getPinia('user.customized') ? '单重' : '单价' }}</up-td>
								<up-td>
									<view style="width: 200rpx">
										{{ uni.$u.getPinia('user.customized') ? '总重' : '金额' }}
									</view>
								</up-td>
							</up-tr>
							<up-tr>
								<up-td>
									<view class="flex-row items-center">
										<view class="u-border-bottom flex-1">
											<input type="digit" v-model="item.quantity" maxlength="10" placeholder="请输入" @input="calculate" />
										</view>
										<wd-icon
											color="#999"
											size="36rpx"
											name="close-circle"
											@click="
												item.quantity = '';
												calculate();
											"
										></wd-icon>
									</view>
								</up-td>
								<up-td>
									<view class="up-line-1" style="width: 160rpx">
										{{ uni.$u.getPinia('user.customized') ? item.lengthMm : item.unit }}
										<!-- {{ uni.$u.getPinia('user.customized') ? item.modelNo : item.unit }} -->
									</view>
								</up-td>
								<up-td>
									<view class="flex-row items-center">
										<view class="u-border-bottom flex-1">
											<input
												type="digit"
												v-if="uni.$u.getPinia('user.customized')"
												v-model="item.unitWeightKg"
												maxlength="10"
												@input="calculate"
												placeholder="请输入"
											/>
											<input type="digit" v-else v-model="item.unitPrice" maxlength="10" @input="calculate" placeholder="请输入" />
										</view>
										<wd-icon
											color="#999"
											size="36rpx"
											name="close-circle"
											@click="
												item.unitWeightKg = '';
												item.unitPrice = '';
												calculate();
											"
										></wd-icon>
									</view>
								</up-td>
								<up-td>
									<text style="width: 200rpx" class="up-line-1" v-if="uni.$u.getPinia('user.customized')">
										{{ formatAmount(item.unitWeightKg * item.quantity) }}
									</text>
									<!-- <text style="width: 200rpx" class="up-line-1" v-if="uni.$u.getPinia('user.customized')">{{ item.lengthMm }}</text> -->
									<text style="width: 200rpx" class="up-line-1" v-else>{{ `￥${formatAmount(item.unitPrice * item.quantity)}` }}</text>

									<!-- <input type="text" :value="`￥${formatAmount(item.unitPrice * item.quantity)}`" disabled maxlength="10" placeholder="请输入" /> -->
								</up-td>
							</up-tr>
						</up-table>
						<!-- </up-swipe-action-item> -->
					</view>
					<!-- </up-swipe-action> -->

					<template #bottom>
						<view class="bottomCard">
							<view class="relative">
								<wd-icon name="https://res-oss.elist.com.cn/wxImg/order/merchandiseInventory.png" size="110rpx" @click="closeOpen"></wd-icon>
								<up-badge absolute bgColor="#FA5151" :value="orderItemList.length" :offset="['0rpx', '-20rpx']"></up-badge>
							</view>
							<text class="ml12">
								<text>合计</text>
								<text v-if="uni.$u.getPinia('user.customized')">(KG)</text>
								<text>：</text>
								<text style="color: #01bb74" v-if="uni.$u.getPinia('user.customized')">{{ formatAmount(totalPrices) }}</text>
								<text style="color: #01bb74" v-else>￥{{ formatAmount(totalPrices) }}</text>
							</text>
							<wd-button :customStyle="bottomCustomStyle" @click="closeOpen">保存</wd-button>
						</view>
					</template>
				</z-paging>
			</view>
		</up-popup>
		<!-- 新手指引 -->
		<pop-guide :max-step="2" :guideType="'goods'" :guideData="functionGuideData" ref="FunctionGuide" @step-change="onGuideStepChange" @finished="onGuideFinished"></pop-guide>
	</view>
</template>

<script>
import { nextTick } from 'vue';

export default {
	data() {
		return {
			intoView: '',
			functionGuideData: {
				step: 0,
				tips: '', // 介绍
				tipsPosition: '', // 介绍 显示位置
				btnGroupPosition: '', // 按钮组显示位置
				position: {}
			},
			orderList: [],
			SearchInventory: '',
			SearchCustomStyle: {
				width: '120rpx',
				height: '50rpx',
				padding: '6rpx',
				fontSize: '24rpx',
				margin: '0 0 0 24rpx'
			},
			bottomCustomStyle: {
				width: '216rpx',
				height: '80rpx',
				padding: '6rpx',
				marginLeft: '6rpx',
				position: 'absolute',
				right: '24rpx',
				bottom: '25%'
			},
			shoppingTrolley: false,
			addList: [],
			orderItemList: [],
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#ff6e55'
					}
				}
			],
			merchandiseInventory: {
				phone: '',
				staffNumber: '',
				description: '',
				specification: '',
				state: '1',
				pages: 0,
				size: 10
			},
			totalPrices: 0,
			update: false,
			invCardEmpty: false,
			hideEmptyView: true
		};
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内分享按钮
			console.log(res.target);
		}
		return {
			title: '自定义分享标题',
			path: '/pages/test/test?id=123',
			imageUrl: ''
		};
	},
	onLoad(option) {
		console.log(option);
		if (option.type == '1') {
			var that = this;
			setTimeout(function () {
				that.shoppingTrolley = true;
			}, 1000);
		}

		console.log('inventoryStockpile', uni.getStorageSync('inventoryStockpile'));
		if (uni.getStorageSync('inventoryStockpile') != null && uni.getStorageSync('inventoryStockpile') != undefined && uni.getStorageSync('inventoryStockpile') != '') {
			this.orderItemList = uni.getStorageSync('inventoryStockpile');
			this.orderItemList = this.orderItemList.map((item) => {
				return {
					...item,
					show: false
				};
			});
			console.log('===inventoryStockpile===>', this.orderItemList);
		} else {
			this.orderItemList = [];
		}

		this.add();
	},
	onShow() {
		var work = this.pinia_user.data.work == '0';
		if (work) {
			//没工作
			this.merchandiseInventory.staffNumber = this.pinia_user.phone;
			this.merchandiseInventory.phone = this.pinia_user.phone;
		} else {
			this.merchandiseInventory.staffNumber = this.pinia_user.phone;
			this.merchandiseInventory.phone = this.pinia_user.workData.bossNumber;
		}
		this.$refs.paging.reload();
	},
	onUnload() {
		// uni.showModal({
		// 	title: '温馨提醒',
		// 	content: "是否保存该在操作?",
		// 	showCancel: true,
		// 	cancelText: '不保存',
		// 	confirmText: '保存',
		// 	success: res => {
		// 		var okif = res.confirm;
		// 		if (okif) {
		// 			uni.setStorageSync("inventoryStockpile", this.orderItemList);
		// 			if (uni.getStorageSync("inventoryStockpile") != undefined) {
		// 				uni.navigateBack()
		// 			}
		// 		} else {
		// 			uni.navigateBack()
		// 		}
		// 	}
		// });
	},
	methods: {
		// app分享
		toShare() {
			// 分享图片
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession',
				type: 2,
				imageUrl: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/uni@2x.png',
				success: function (res) {
					console.log('success:' + JSON.stringify(res));
				},
				fail: function (err) {
					console.log('fail:' + JSON.stringify(err));
				}
			});
		},
		//监听引导页每一步位置
		onGuideStepChange({ step }) {
			console.log('监听', step);
			this.setFunctionGuideData({ step });
		},
		setFunctionGuideData(data) {
			this.functionGuideData = {
				...this.functionGuideData,
				...data
			};

			this.showFunctionGuideR();
		},
		showFunctionGuideR() {
			if (this._step == this.functionGuideData.step) return;
			this._step = this.functionGuideData.step;
			if (this.functionGuideData.step == 1) {
				this.getElementData('#box1', (res) => {
					this.setFunctionGuideData({
						tips: '点击按钮添加到清单',
						btnGroupPosition: '',
						tipsPosition: {
							top: '30rpx',
							right: '-24rpx',
							backgroundImage: 'url(https://res-oss.elist.com.cn/wxImg/handbook/guide/guidanc6.png)'
						},
						position: {
							borderRadius: '50%',
							top: res.top + 'px',
							width: `${res.width}px`,
							left: `${res.left}px`,
							height: `${res.height}px`
						}
					});
				});
			} else if (this.functionGuideData.step == 2) {
				let systemInfo = uni.getSystemInfoSync();
				let platform = systemInfo.platform;
				let osName = systemInfo.osName;
				const bottomSafeArea = systemInfo.safeAreaInsets ? systemInfo.safeAreaInsets.bottom : 0;
				var setting = platform === 'android';
				this.getElementData('#box2', (res) => {
					this.setFunctionGuideData({
						tips: '点击修改商品数量/单价',
						btnGroupPosition: '550rpx',
						tipsPosition: {
							top: '-232rpx',
							left: '0rpx',
							backgroundImage: 'url(https://res-oss.elist.com.cn/wxImg/handbook/guide/guidanc7.png)'
						},
						position: {
							borderRadius: '50%',
							top: `${res.top}px`,
							width: `${res.width}px`,
							left: `${res.left}px`,
							height: `${res.height}px`
						}
					});
				});
			}
		},
		getElementData(el, cb) {
			let query = null;
			query = uni.createSelectorQuery().in(this);
			query
				.select(el)
				.boundingClientRect()
				.exec((res) => {
					if (res[0]) {
						cb(res[0]);
					}
				});
		},
		customBack() {
			console.log('返回');
			if (this.orderItemList.length > 0 && this.update == false) {
				uni.showModal({
					title: '温馨提醒',
					content: '是否保存此次修改?',
					showCancel: true,
					cancelText: '返回',
					confirmText: '保存',
					confirmColor: '#01bb74',
					success: (res) => {
						var okif = res.confirm;
						if (okif) {
							if (!uni.$u.getPinia('user.customized')) {
								var nullNot = this.orderItemList.filter((res) => res.unitPrice == null || res.unitPrice == '');
								console.log(nullNot);
								// console.log(this.orderItemList);
								if (this.totalPrices > 0) {
									if (nullNot.length <= 0) {
										uni.setStorageSync('inventoryStockpile', this.orderItemList);
										if (uni.getStorageSync('inventoryStockpile') != undefined) {
											uni.navigateBack();
										}
									} else {
										this.$u.toast('单价不能为空');
										this.shoppingTrolley = true;
									}
								} else {
									this.$u.toast('开单总金额要大于0');
								}
							} else {
								if (this.totalPrices < 0) {
									this.$u.toast('开单总重要大于0');
									return;
								}
								uni.navigateBack();
							}
						} else {
							uni.navigateBack();
						}
					}
				});
			} else {
				uni.navigateBack();
			}
		},
		calculate() {
			console.log('计算');
			this.add();
		},
		virtualListChange(vList) {
			this.orderList = vList;
			// 新手指引
			console.log('this.orderList.length', this.orderList.length, this.$u.getPinia('guide.guidanceGoods'));
			if (this.orderList.length && this.$u.getPinia('guide.guidanceGoods') != 1) {
				this.$nextTick(() => {
					this.$refs.FunctionGuide.init();
				});
			}
		},
		queryList(pageNo, pageSize) {
			console.log(pageNo, pageSize);
			this.merchandiseInventory.pages = pageNo;
			this.getMerchandiseInventory();
		},
		getMerchandiseInventory() {
			uni.$api.library
				.getCommodityList(this.merchandiseInventory)
				.then((res) => {
					var list = res.data.data.map((res) => {
						return {
							...res,
							show: false
						};
					});
					this.$refs.paging.complete(list);
					this.EmpytSL(list, false);
				})
				.catch((res) => {
					this.$u.toast('获取失败');
				});
		},
		EmpytSL(list, type) {
			if (type) {
				console.log('===this.orderList.length===>', this.orderList.length);
				this.invCardEmpty = this.orderList.length <= 0;
			} else {
				if (list.length == 0 && this.orderList.length <= 0) {
					if (this.merchandiseInventory.description == '' && this.merchandiseInventory.specification == '') {
						this.hideEmptyView = true;
						this.invCardEmpty = true;
					} else {
						this.invCardEmpty = false;
						this.hideEmptyView = false;
					}
				} else {
					this.invCardEmpty = false;
					this.hideEmptyView = false;
				}
			}
		},
		save() {
			var nullNot = this.orderItemList.filter((res) => res.unitPrice == null || res.unitPrice == '');
			// var nullunitWeightKg = this.orderItemList.filter((res) => res.unitWeightKg == null || res.unitWeightKg == '' || res.unitWeightKg == '0');

			if (this.totalPrices > 0) {
				// if (uni.$u.getPinia('user.customized') && nullunitWeightKg.length > 0) {
				// 	this.$u.toast('单重必须大于0');
				// 	this.shoppingTrolley = true;
				// 	return;
				// }
				if (nullNot.length > 0 && !uni.$u.getPinia('user.customized')) {
					this.$u.toast('单价不能为空');
					this.shoppingTrolley = true;
					return;
				}
			} else {
				if (!uni.$u.getPinia('user.customized')) {
					if (this.orderItemList.length > 0) {
						this.$u.toast('开单总金额必须大于0');
						this.shoppingTrolley = true;
						return;
					} else {
						this.$u.toast('开单总金额必须大于0');
						return;
					}
				} else {
					if (this.orderItemList.length > 0) {
						this.$u.toast('开单总重必须大于0');
						this.shoppingTrolley = true;
						return;
					} else {
						this.$u.toast('开单总重必须大于0');
						return;
					}
				}
			}

			console.log('清单----->', this.orderItemList);
			if (this.update) {
				console.log('update清单----->', this.update);
				console.log('update清单----->', this.orderItemList);
				uni.setStorageSync('updInventoryStockpile', this.orderItemList);
				if (uni.getStorageSync('updInventoryStockpile') != undefined) {
					uni.navigateBack();
				}
			} else {
				uni.setStorageSync('inventoryStockpile', this.orderItemList);
				if (uni.getStorageSync('inventoryStockpile') != undefined) {
					uni.navigateBack();
				}
			}
		},
		AlertCard() {
			if (this.orderItemList.length > 0) {
				this.shoppingTrolley = true;
			} else {
				this.$u.toast('您还没有添加产品~');
				this.shoppingTrolley = false;
			}
		},
		SearchInventoryChange(e) {
			console.log(e);
			this.merchandiseInventory.description = e;
			this.merchandiseInventory.specification = e;
			this.$refs.paging.reload();
		},
		queryListCheck() {},
		addOrderBill(item) {
			console.log('===结构===>', item);
			var id = item.id;
			var description = item.description;
			var specification = item.specification;
			var unit = item.unit;
			var unitPrice = item.unitPrice;
			console.log(id, description, specification, unit, unitPrice);
			// item.show = false
			// item.id = null
			var idList = this.orderItemList.filter(
				(res) => res.id == id && res.description === description && res.specification === specification && res.unit === unit && res.unitPrice == unitPrice
			);

			const copy = item;
			const deepCopy = JSON.parse(JSON.stringify(copy));

			if (idList.length <= 0) {
				deepCopy.quantity = 1;
				// deepCopy.unitPrice = deepCopy.unitPrice > 0 ? deepCopy.unitPrice : '';
				this.orderItemList.push(deepCopy);
				this.$u.toast(deepCopy.description + ' + ' + deepCopy.quantity);
			} else {
				console.log(idList);
				const itemToModify = this.orderItemList.find(
					(res) => res.id == id && res.description === description && res.specification === specification && res.unit === unit && res.unitPrice == unitPrice
				); // 替换为你的条件
				if (itemToModify) {
					itemToModify.quantity = Number(itemToModify.quantity) + 1;
					this.$u.toast(itemToModify.description + ' + ' + itemToModify.quantity);
				}
			}
			this.add();
		},
		add() {
			this.totalPrices = 0;
			if (uni.$u.getPinia('user.customized')) {
				this.orderItemList.forEach((res) => {
					this.totalPrices = this.totalPrices + res.quantity * (res.unitWeightKg ? res.unitWeightKg : 0);
				});
			} else {
				this.orderItemList.forEach((res) => {
					this.totalPrices = this.totalPrices + res.quantity * (res.unitPrice ? res.unitPrice : 0);
				});
			}
		},
		jumpAddCommodity() {
			uni.navigateTo({
				url: '/pages/subOrder/commodityDetails/updateCommodity'
			});
		},
		jumpCommodityDetails(item) {
			uni.navigateTo({
				url: 'commodityDetails/commodityDetails?id=' + item.id
			});
		},
		delclick(index) {
			let order = this.orderItemList[index];
			this.orderItemList.splice(index, 1);
			this.$u.toast(`删除了${order.description}`);
			this.add();
			if (!this.orderItemList.length) {
				this.shoppingTrolley = false;
			}
			// let order = this.orderItemList[item.name];
			// this.orderItemList.splice(item.name, 1);
			// this.$u.toast(`删除了${order.description}`);
			// this.add();
		},
		// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
		open(index) {
			// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
			// 原本为'false'，再次设置为'false'会无效
			console.log(index);
			console.log(this.orderItemList);
			this.orderItemList[index].show = true;
			this.orderItemList.map((val, idx) => {
				if (index != idx) this.orderItemList[idx].show = false;
			});
		},
		closeOpen() {
			this.shoppingTrolley = false;
			this.orderItemList.map((val, idx) => {
				this.orderItemList[idx].show = false;
			});

			this.save();
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
				show: false,
				color: {
					description: 'transparent',
					specification: 'transparent',
					unit: 'transparent',
					quantity: 'transparent',
					unitPrice: 'transparent'
				}
			};
			this.orderItemList.push(dx);
		}
	}
};
</script>

<style lang="scss" scoped>
#box2 {
	width: 110rpx;
	height: 110rpx;
}
.shareBtn {
	padding: 0;
	line-height: 44rpx;
	background-color: transparent;
}
.shareBtn:after {
	width: auto;
	height: auto;
}
.addicon {
	width: 60rpx;
	height: 60rpx;
	padding: 10rpx;
	border-radius: 50%;
	bottom: 20rpx;
	z-index: 10;
	right: 22rpx;
	// background-color: #01bb74;
}
::v-deep .u-border-bottom,
.up-border-bottom {
	border-color: #01bb74 !important;
}
::v-deep .u-safe-bottom {
	height: 0 !important;
}
.modification {
	width: 100vw;
	height: 100vh;
	opacity: 1;
	background: linear-gradient(0deg, rgba(243, 255, 247, 0) 14%, #edfff3 99%);
}

.modificationCrad {
	width: 100vw;
	height: 82%;
	border-radius: 30rpx 30rpx 0rpx 0rpx;
	background-color: #ffffff;
	position: absolute;
	bottom: 0;
}

.invCard {
	box-shadow: 0rpx 2rpx 6rpx 0rpx rgba(216, 216, 216, 0.5);
	margin-right: 24rpx;
	margin-left: 24rpx;
	padding: 24rpx;
	background-color: #ffffff;
	border-radius: 12rpx;
	margin-bottom: 24rpx;
	position: relative;
	display: flex;
	flex-direction: row;
	align-items: center;

	.invText {
		display: flex;
		flex-direction: column;
		align-items: left;
		justify-content: left;
		margin-left: 48rpx;

		text:nth-child(1) {
			padding-bottom: 24rpx;
			font-size: 32rpx;
			font-weight: bold;
			line-height: 36rpx;
			letter-spacing: 0rpx;
			color: #3d3d3d;
		}

		text:not(:nth-child(1)) {
			font-size: 28rpx;
			font-weight: normal;
			line-height: 36rpx;
			letter-spacing: 0rpx;
			color: #999999;
			padding-bottom: 12rpx;
			padding-top: 4rpx;
			// background-color: red;
		}
	}
}

.bottomCard {
	width: 100%;
	height: 10vh;

	display: flex;
	flex-direction: row;
	align-items: center;
	background: #ffffff;

	position: relative;

	box-shadow: 0rpx -2rpx 6rpx 0rpx rgba(0, 0, 0, 0.1);

	padding-left: 24rpx;
}

.OrderCard {
	display: flex;
	flex-direction: column;
	padding-left: 20rpx;
	padding-right: 20rpx;
	padding-bottom: 10rpx;
	padding-top: 25rpx;
	background-color: white;
	margin-bottom: 18rpx;
	position: relative;
	margin-left: 24rpx;
	margin-right: 24rpx;
	border-radius: 15rpx;
	box-shadow: 0rpx 7rpx 10rpx 0rpx rgba(51, 51, 51, 0.1);
}
</style>
