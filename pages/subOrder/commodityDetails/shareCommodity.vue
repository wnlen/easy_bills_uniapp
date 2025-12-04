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
				<view class="topBoxAll">
					<view class="topBox flex-row items-center justify-between">
						<view class="flex-col">
							<image src="https://res-oss.elist.com.cn/wxImg/commodity/title.svg" mode="widthFix"></image>
							<text class="ft28 mt5">上海欣欣日用百货有限公司</text>
						</view>
						<image src="https://res-oss.elist.com.cn/wxImg/commodity/car.png"></image>
					</view>
				</view>

				<view class="ml24 mr24 flex-row items-center justify-center pb30">
					<view class="flex-row items-center justify-center pl20 pr10 flex-1 searchBox">
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
						<view class="searchBtn">搜索</view>
					</view>
				</view>
				<view class="flex-row items-center selBox">
					<view class="flex-row items-center mr30">
						<text>最新</text>
						<view class="flex-col ml10">
							<albb-icon icon="ydj-tiaojianshaixuan2" size="15rpx" color="#01BB74"></albb-icon>
							<albb-icon icon="ydj-tiaojianshaixuanfan2" size="15rpx" color="#D8D8D8"></albb-icon>
						</view>
					</view>
					<view class="flex-row items-center">
						<text>价格</text>
						<view class="flex-col ml10">
							<albb-icon icon="ydj-tiaojianshaixuan2" size="15rpx" color="#D8D8D8"></albb-icon>
							<albb-icon icon="ydj-tiaojianshaixuanfan2" size="15rpx" color="#D8D8D8"></albb-icon>
						</view>
					</view>
				</view>
			</template>
			<up-empty
				v-if="invCardEmpty && hideEmptyView"
				icon="https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/role/dbsx.svg"
				iconSize="200rpx"
				text="暂无商品~"
			></up-empty>
			<view class="invCardBox">
				<view class="invCard relative" v-for="(item, index) in orderList" :key="index">
					<view class="" @click="jumpCommodityDetails(item)">
						<up-image
							radius="12rpx 12rpx 0 0"
							width="340rpx"
							height="340rpx"
							:show-menu-by-longpress="false"
							:src="item.img === 'definde' ? 'https://res-oss.elist.com.cn/wxImg/order/emptyView.png' : item.img"
						></up-image>
					</view>
					<view class="pl20 pt15 pb15">
						<view class="invText flex-1" @click="jumpCommodityDetails(item)" v-if="uni.$u.getPinia('user.customized')">
							<text>{{ item.description }}</text>
							<text class="up-line-1">型号：{{ item.modelNo }}</text>
							<text>单重(kg/件)：{{ item.unitWeightKg }}</text>
						</view>
						<view class="invText flex-1" @click="jumpCommodityDetails(item)" v-else>
							<text>{{ item.description }}</text>
							<text class="up-line-1">规格：{{ item.specification }}</text>
							<text class="money">
								<text>￥</text>
								{{ item.unitPrice == '0' ? '-' : formatAmount(item.unitPrice) }}
							</text>
						</view>
						<view class="absolute addicon">
							<wd-badge :is-dot="isShowDot(item.id)" :top="3" :right="1">
								<wd-icon name="cart" size="40rpx" @click.stop="addOrderBill(item)" color="#01BB74"></wd-icon>
							</wd-badge>
						</view>
					</view>
				</view>
			</view>

			<template #bottom>
				<view class="bottomCard">
					<view class="relative pd10" id="box2">
						<wd-icon name="https://res-oss.elist.com.cn/wxImg/order/merchandiseInventory.png" size="110rpx" @click="AlertCard"></wd-icon>
						<up-badge absolute bgColor="#FA5151" :value="orderItemList.length" :offset="['0rpx', '-20rpx']"></up-badge>
					</view>

					<text class="">
						合计:
						<text style="color: #01bb74" v-if="uni.$u.getPinia('user.customized')">{{ totalPrices }}</text>
						<text style="color: #01bb74" v-else>￥{{ formatAmount(totalPrices) }}</text>
					</text>
					<wd-button :customStyle="bottomCustomStyle" @click="save">下单</wd-button>
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
						<view class="absolute" style="right: 24rpx">
							<wd-icon name="minus-circle-filled" color="#FA5151" size="40rpx" @click="delclick(index)"></wd-icon>
						</view>
						<view class="flex-row pb24" style="width: 93%">
							<view class="">品名:</view>
							<view class="flex-1 up-line-1">{{ item.description }}</view>
							<view class="ml10">规格:</view>
							<view class="flex-1 up-line-1">{{ item.specification }}</view>
						</view>
						<view class="flex-row items-center justify-center" style="width: 100%">
							<up-line class="u-line ml24 mr24" color="#F4F4F4" :dashed="true" length="100%"></up-line>
						</view>
						<up-table border-color="#ffffff">
							<up-tr>
								<up-td>数量</up-td>
								<up-td>单位</up-td>
								<up-td>{{ uni.$u.getPinia('user.customized') ? '单重' : '单价' }}</up-td>
								<up-td>{{ uni.$u.getPinia('user.customized') ? '总重' : '金额' }}</up-td>
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
								<up-td>{{ item.unit }}</up-td>
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
								<up-td width="200rpx">
									<text style="width: 200rpx" class="up-line-1" v-if="uni.$u.getPinia('user.customized')">{{ `${item.unitWeightKg * item.quantity}` }}</text>
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
								合计:
								<text style="color: #01bb74" v-if="uni.$u.getPinia('user.customized')">{{ totalPrices }}</text>
								<text style="color: #01bb74" v-else>￥{{ formatAmount(totalPrices) }}</text>
							</text>
							<wd-button :customStyle="bottomCustomStyle" @click="closeOpen">下单</wd-button>
						</view>
					</template>
				</z-paging>
			</view>
		</up-popup>
	</view>
</template>

<script>
import { nextTick } from 'vue';

export default {
	data() {
		return {
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
		var work = this.pinia_user.work == '0';
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
	onUnload() {},
	methods: {
		isShowDot(id) {
			return this.orderItemList.some((item) => item.id === id);
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
			if (this.totalPrices > 0) {
				if (nullNot.length <= 0) {
					// uni.setStorageSync("inventoryStockpile", this.orderItemList);
					// if (uni.getStorageSync("inventoryStockpile") != undefined) {
					// 	uni.navigateBack()
					// 	return;
					// }
				} else {
					if (uni.$u.getPinia('user.customized')) {
						this.$u.toast('单重不能为空');
					} else {
						this.$u.toast('单价不能为空');
					}

					this.shoppingTrolley = true;
					return;
				}
			} else {
				if (this.orderItemList.length > 0) {
					if (uni.$u.getPinia('user.customized')) {
						this.$u.toast('总重要大于0');
					} else {
						this.$u.toast('开单总金额要大于0');
					}

					this.shoppingTrolley = true;
				} else {
					if (uni.$u.getPinia('user.customized')) {
						this.$u.toast('总重要大于0');
					} else {
						this.$u.toast('开单总金额要大于0');
					}
				}
				return;
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
				deepCopy.unitPrice = deepCopy.unitPrice > 0 ? deepCopy.unitPrice : '';
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
			// uni.navigateTo({
			// 	url: '/pages/subOrder/commodityDetails/commodityDetails?id=' + item.id
			// });
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
			var ifwork = this.pinia_user.work == '0';
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
.topBoxAll {
	padding-top: var(--status-bar-height);
}
.topBox {
	padding: 70rpx 100rpx 20rpx 40rpx;
	> view {
		image {
			width: 112px;
		}
	}
	> image {
		width: 224rpx;
		height: 140rpx;
	}
}
.searchBox {
	height: 76rpx;
	border-radius: 20rpx;
	border: 1rpx solid #01bb74;
	background: #ffffff;
	.searchBtn {
		width: 53px;
		height: 48rpx;
		border-radius: 522rpx;
		background: #f2fff6;
		font-size: 26rpx;
		color: #01bb74;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
.selBox {
	height: 68rpx;
	background: #f9f9f9;
	padding-left: 32rpx;
	border-radius: 15px 15px 0px 0px;
	font-size: 28rpx;
}
.addicon {
	bottom: 30rpx;
	z-index: 10;
	right: 20rpx;
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
	background: url('https://res-oss.elist.com.cn/wxImg/commodity/bg.svg') #f9f9f9 no-repeat left top;
	background-size: 100% auto;
}
.invCardBox {
	background: #f9f9f9;
	position: relative;
	display: flex;
	flex-direction: row;
	align-items: center;
	flex-wrap: wrap;
	justify-content: space-between;
	padding: 0 24rpx;
}
.invCard {
	box-shadow: 0rpx 2rpx 6rpx 0rpx rgba(216, 216, 216, 0.5);
	background-color: #ffffff;
	border-radius: 12rpx;
	margin-bottom: 24rpx;
	.invText {
		display: flex;
		flex-direction: column;
		align-items: left;
		justify-content: left;
		> text:nth-child(1) {
			font-size: 24rpx;
			font-weight: bold;
			letter-spacing: 0rpx;
			color: #3d3d3d;
		}

		> text:nth-child(2) {
			font-size: 20rpx;
			font-weight: normal;
			letter-spacing: 0rpx;
			color: #999999;
			padding-bottom: 12rpx;
			padding-top: 8rpx;
			// background-color: red;
		}
		.money {
			text {
				font-size: 16rpx;
			}
			font-weight: 500;
			font-size: 28rpx;
			color: #fa5151;
			padding-bottom: 16rpx;
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
