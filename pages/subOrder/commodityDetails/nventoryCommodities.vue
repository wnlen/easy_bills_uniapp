<template>
	<view class="modification">

		<!-- <view class="modificationCrad"> -->

		<z-paging ref="paging" use-virtual-list :force-close-inner-list="true"
			:cell-height-mode="1===0?'fixed':'dynamic'" @virtualListChange="virtualListChange" @query="queryList">
			<view slot="top">
				<!-- <u-navbar title="商品库" :background="{backgroundColor: 'transparent'}" :border-bottom="false"></u-navbar> -->
				<u-navbar :border-bottom="false" :background="{backgroundColor: 'transparent'}" back-icon-color="#000000" 
				:titleBold="true" title-color="#000000" title="商品库" title-size="34" bgColor="#ffffff"></u-navbar>
				<view class="ml24 mr24 flex-row items-center justify-center pb30">
					<view class="flex-row items-center justify-center pl10 pr10 "
						style="background: #FFFFFF;border-radius: 127px;width: 75%;">
						<u-icon class="ml6" name="search" color="#01BB74" size="40"></u-icon>
						<u-input class="my-input ml6" style="width: 100%;" @input="SearchInventoryChange"
							v-model="SearchInventory" :custom-style="{ backgroundColor: 'transparent' }"
							placeholder="请输入商品名称/规格" clearable="true" />
					</view>
					<u-button @click="jumpAddCommodity" :custom-style="SearchCustomStyle" type="success">添加商品</u-button>
				</view>
			</view>


			<view slot="empty" style="padding-bottom: 100px;">
				<u-icon margin-top="22rpx" label-pos="bottom" :name="ImgUrl+'/wxImg/list/empty.svg'"
					label-color="#AAAAAA" label="没有数据哦~" size="180"></u-icon>
			</view>

			<view class="invCard" v-for="(item,index) in orderList" :key="index">
				<view class="" @click="jumpCommodityDetails(item)">
					<u-image border-radius="6px" width="200rpx" height="200rpx" :show-menu-by-longpress="false"
						:src="item.img==='definde'?'https://res-oss.elist.com.cn/wxImg/order/emptyView.png':item.img"></u-image>
				</view>
				<view class="invText" @click="jumpCommodityDetails(item)">
					<text>{{item.description}}</text>
					<text>规格：{{item.specification}}</text>
					<text>单位：{{item.unit}}</text>
					<text>单价：{{item.unitPrice=="0"?"-":("￥"+item.unitPrice)}}</text>
				</view>
				<u-icon @tab.stop class="absolute" style="bottom: 24rpx;right: 24rpx;" name="trash" color="#666666"
					size="40" @click="delOrderBill(item)"></u-icon>
			</view>

		</z-paging>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderList: [],
				SearchInventory: "",
				SearchCustomStyle: {
					width: "60px",
					height: "30px",
					padding: "6rpx",
					marginLeft: "24rpx",
					fontSize: "12px"
				},
				bottomCustomStyle: {
					width: "108px",
					height: "40px",
					padding: "6rpx",
					marginLeft: "6rpx",
					position: "absolute",
					right: "24rpx",
					bottom: "25%"
				},
				uploadingCommodityInputStyle: {
					width: "100%",
					height: "100%",
					textAlign: "center"
				},
				shoppingTrolley: false,
				addList: [],
				orderItemList: [],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				merchandiseInventory: {
					phone: "",
					staffNumber: "",
					description: "",
					specification: "",
					state: "1",
					pages: 0,
					size: 10
				},
				totalPrices: 0
			}
		},
		onLoad(option) {

		},
		onShow() {
			var work = this.vuex_user.data.work == "0";
			if (work) {
				//没工作
				this.merchandiseInventory.staffNumber = this.vuex_user.phone
				this.merchandiseInventory.phone = this.vuex_user.phone
			} else {
				this.merchandiseInventory.staffNumber = this.vuex_user.phone
				this.merchandiseInventory.phone = this.vuex_user.workData.bossNumber
			}
			this.$refs.paging.reload();
		},
		methods: {
			virtualListChange(vList) {
				this.orderList = vList;
			},
			queryList(pageNo, pageSize) {
				console.log(pageNo, pageSize);
				this.merchandiseInventory.pages = pageNo
				this.getMerchandiseInventory()
			},
			getMerchandiseInventory() {
				this.$u.post('/edo/library/get', this.merchandiseInventory)
					.then(res => {
						this.$refs.paging.complete(res.data.data);
					})
					.catch(res => {
						this.$u.toast("获取失败");
					});
			},
			SearchInventoryChange(e) {
				console.log(e);
				this.merchandiseInventory.description = e
				this.merchandiseInventory.specification = e
				this.$refs.paging.reload();
			},
			queryListCheck() {

			},
			delOrderBill(item) {
				uni.showModal({
					title: '温馨提醒',
					content: "是否删除该商品?",
					showCancel: true,
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						var okif = res.confirm;
						if (okif) {
							this.$u.post('/edo/library/del', item)
								.then(res => {
									this.$u.toast(res.data.message);
									this.$refs.paging.reload();
								})
								.catch(res => {
									this.$u.toast("获取失败");
								});
						}
					}
				});
			},
			jumpAddCommodity() {
				uni.navigateTo({
					url: "../uploadingCommodity"
				})
			},
			jumpCommodityDetails(item) {
				uni.navigateTo({
					url: "commodityDetails?id=" + item.id
				})
			},
			click(index, index1) {
				if (index1 == 0) {
					var order = this.orderItemList[index]
					this.orderItemList.splice(index, 1);
					this.$u.toast(`删除了${order.description}`);
				}
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.orderItemList[index].show = true;
				this.orderItemList.map((val, idx) => {
					if (index != idx) this.orderItemList[idx].show = false;
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.modification {
		width: 100vw;
		height: 100vh;
		opacity: 1;
		background: linear-gradient(0deg, rgba(243, 255, 247, 0) 14%, #EDFFF3 99%);
		overflow: hidden;
	}

	.modificationCrad {
		width: 100vw;
		height: 82%;
		border-radius: 15px 15px 0px 0px;
		background-color: #ffffff;
		position: absolute;
		bottom: 0;
	}

	.invCard {
		box-shadow: 0px 1px 3px 0px rgba(216, 216, 216, 0.5);
		margin-right: 24rpx;
		margin-left: 24rpx;
		padding: 24rpx;
		background-color: #FFFFFF;
		border-radius: 6px;
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
			width: 200px;
			// background-color: #aaffff;

			text:nth-child(1) {
				padding-bottom: 24rpx;
				font-size: 16px;
				font-weight: bold;
				line-height: 18px;
				letter-spacing: 0px;
				color: #3D3D3D;
			}

			text:not(:nth-child(1)) {
				font-size: 14px;
				font-weight: normal;
				line-height: 18px;
				letter-spacing: 0px;
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

		box-shadow: 0px -1px 3px 0px rgba(0, 0, 0, 0.1);

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
		box-shadow: 0px 3.5px 5px 0px rgba(51, 51, 51, 0.1);
	}
</style>