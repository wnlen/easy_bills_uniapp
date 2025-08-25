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
				<u-navbar
					:placeholder="true"
					back-icon-color="#000000"
					:titleBold="true"
					title-color="#000000"
					title="商品库"
					title-size="34"
					@leftClick="customBack"
					bgColor="transparent"
				></u-navbar>
				<view class="ml24 mr24 flex-row items-center justify-center pb30">
					<view class="flex-row items-center justify-center pl20 pr10" style="background: #ffffff; border-radius: 254rpx; width: 75%; height: 60rpx">
						<u-icon name="search" color="#01BB74" size="40rpx"></u-icon>
						<u-input
							:customStyle="{
								backgroundColor: 'transparent',
								marginLeft: '10rpx'
							}"
							v-model="SearchInventory"
							placeholder="请输入商品名称/规格"
							:clearable="true"
							border="none"
							@change="SearchInventoryChange"
						></u-input>
					</view>
					<u-button @click="jumpAddCommodity" :customStyle="SearchCustomStyle" color="#01BB74" type="success">添加商品</u-button>
				</view>
			</template>

			<view class="items-center" v-if="invCardEmpty && hideEmptyView">
				<view class="invCard" @click="jumpAddCommodity">
					<view class="">
						<u-image radius="12rpx" width="200rpx" height="200rpx" :show-menu-by-longpress="false" src="https://res-oss.elist.com.cn/wxImg/order/SlView.png"></u-image>
					</view>
					<view class="invText" style="width: 350rpx">
						<text>示例商品 1</text>
						<text>规格：00A1</text>
						<text>单位：个</text>
					</view>
					<u-icon @tab.stop class="absolute" style="bottom: 24rpx; right: 24rpx" name="plus-circle" color="#01BB74" size="50rpx"></u-icon>
				</view>
				<view class="flex-row justify-center items-center mt80 pb24">
					<view
						class="flex-row justify-center items-center"
						@click="jumpAddCommodity"
						style="width: 280rpx; height: 80rpx; border-radius: 338.4rpx; box-sizing: border-box; border: 3rpx solid #01bb74"
					>
						<view class="absolute">
							<u-icon label="添加商品" labelColor="#01BB74" name="plus" color="#01BB74" size="30rpx"></u-icon>
						</view>
					</view>
				</view>
			</view>

			<view class="invCard" v-for="(item, index) in orderList" :key="index">
				<view class="" @click="jumpCommodityDetails(item)">
					<u-image
						radius="12rpx"
						width="200rpx"
						height="200rpx"
						:show-menu-by-longpress="false"
						:src="item.img === 'definde' ? 'https://res-oss.elist.com.cn/wxImg/order/emptyView.png' : item.img"
					></u-image>
				</view>
				<view class="invText" style="width: 350rpx" @click="jumpCommodityDetails(item)">
					<text>{{ item.description }}</text>
					<text>规格：{{ item.specification }}</text>
					<text>单位：{{ item.unit }}</text>
					<text>单价：{{ item.unitPrice == '0' ? '-' : '￥' + item.unitPrice }}</text>
				</view>
				<u-icon @tab.stop class="absolute" style="bottom: 24rpx; right: 24rpx" name="plus-circle" color="#01BB74" size="50rpx" @click="addOrderBill(item)"></u-icon>
			</view>

			<template #bottom>
				<view class="bottomCard">
					<view class="relative">
						<u-icon name="https://res-oss.elist.com.cn/wxImg/order/merchandiseInventory.png" size="110rpx" @click="AlertCard"></u-icon>
						<u-badge absolute bgColor="#E52829" :value="orderItemList.length" :offset="['0rpx', '-20rpx']"></u-badge>
					</view>

					<text class="ml12">
						合计:
						<text style="color: #01bb74">￥{{ totalPrices }}</text>
					</text>
					<u-button shape="circle" :custom-style="bottomCustomStyle" color="#01bb74" @click="save">保存</u-button>
				</view>
			</template>
		</z-paging>

		<u-popup :show="shoppingTrolley" @close="shoppingTrolley = false" mode="bottom" round="15">
			<view class="" style="width: 100%; height: 70vh; padding-top: 24rpx">
				<z-paging v-if="shoppingTrolley" ref="pagingCheck" :fixed="false" v-model="addList" @query="queryListCheck">
					<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
					<template #top>
						<view style="height: 24rpx"></view>
					</template>
					<u-swipe-action>
						<view class="OrderCard" style="width: 94vw" v-for="(item, index) in orderItemList" :key="index">
							<u-swipe-action-item :show="item.show" :options="options" :name="index" @click="delclick" @open="open">
								<view class="flex-row pt24 pb24" style="width: 100%">
									<view style="width: 10%" class="ml20">品名:</view>
									<view style="width: 40%">{{ item.description }}</view>
									<view style="width: 10%" class="ml20">规格:</view>
									<view style="width: 40%">{{ item.specification }}</view>
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
										<u-td>
											<view class="u-border-bottom">
												<input
													type="digit"
													v-model="item.quantity"
													maxlength="10"
													placeholder="请输入"
													@input="calculate"
													:custom-style="uploadingCommodityInputStyle"
												/>
											</view>
										</u-td>
										<u-td>{{ item.unit }}</u-td>
										<u-td>
											<view class="u-border-bottom">
												<input
													type="digit"
													v-model="item.unitPrice"
													maxlength="10"
													@input="calculate"
													placeholder="请输入"
													:custom-style="uploadingCommodityInputStyle"
												/>
											</view>
										</u-td>
										<u-td width="200rpx">
											<input
												type="text"
												:value="formatAmount(item.unitPrice * item.quantity)"
												disabled
												maxlength="10"
												placeholder="请输入"
												:custom-style="uploadingCommodityInputStyle"
											/>
										</u-td>
									</u-tr>
								</u-table>
							</u-swipe-action-item>
						</view>
					</u-swipe-action>

					<template #bottom>
						<view class="bottomCard">
							<view class="relative">
								<u-icon name="https://res-oss.elist.com.cn/wxImg/order/merchandiseInventory.png" size="110rpx" @click="closeOpen"></u-icon>
								<u-badge absolute bgColor="#E52829" :value="orderItemList.length" :offset="['0rpx', '-20rpx']"></u-badge>
							</view>
							<text class="ml12">
								合计:
								<text style="color: #01bb74">￥{{ totalPrices }}</text>
							</text>
							<u-button shape="circle" :customStyle="bottomCustomStyle" color="#01BB74" @click="closeOpen">保存</u-button>
						</view>
					</template>
				</z-paging>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderList: [],
			SearchInventory: '',
			SearchCustomStyle: {
				width: '120rpx',
				height: '50rpx',
				padding: '6rpx',
				marginLeft: '24rpx',
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
			uploadingCommodityInputStyle: {
				width: '100%',
				height: '100%',
				textAlign: 'center'
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

		if (option.update == 1) {
			// updInventoryStockpile
			if (
				uni.getStorageSync('updInventoryStockpile') != null &&
				uni.getStorageSync('updInventoryStockpile') != undefined &&
				uni.getStorageSync('updInventoryStockpile') != ''
			) {
				this.orderItemList = uni.getStorageSync('updInventoryStockpile');
				this.orderItemList = this.orderItemList.map((item) => {
					return {
						...item,
						show: false
					};
				});
				console.log('===updInventoryStockpile===>', this.orderItemList);
				this.update = true;
			} else {
				uni.navigateBack();
			}
		} else {
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
		// #ifdef MP-WEIXIN
		this.$refs.paging.reload();
		// #endif
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
		customBack() {
			console.log('返回');
			if (this.orderItemList.length > 0 && this.update == false) {
				uni.showModal({
					title: '温馨提醒',
					content: '是否保存此次修改?',
					showCancel: true,
					cancelText: '返回',
					confirmText: '保存',
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
					this.$u.toast('单价不能为空');
					this.shoppingTrolley = true;
					return;
				}
			} else {
				if (this.orderItemList.length > 0) {
					this.$u.toast('开单总金额要大于0');
					this.shoppingTrolley = true;
				} else {
					this.$u.toast('开单总金额要大于0');
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
			this.orderItemList.forEach((res) => {
				this.totalPrices = this.totalPrices + res.quantity * (res.unitPrice ? res.unitPrice : 0);
			});
			this.totalPrices = this.totalPrices.toFixed(2);
		},
		jumpAddCommodity() {
			uni.navigateTo({
				url: 'uploadingCommodity'
			});
		},
		jumpCommodityDetails(item) {
			uni.navigateTo({
				url: 'commodityDetails/commodityDetails?id=' + item.id
			});
		},
		delclick(item) {
			let order = this.orderItemList[item.name];
			this.orderItemList.splice(item.name, 1);
			this.$u.toast(`删除了${order.description}`);
			this.add();
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
