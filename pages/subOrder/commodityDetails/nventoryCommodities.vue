<template>
	<view class="modification">
		<z-paging ref="paging" use-virtual-list :force-close-inner-list="true" cell-height-mode="dynamic" @virtualListChange="virtualListChange" @query="queryList">
			<template #top>
				<up-navbar :autoBack="true" :placeholder="true" bgColor="transparent" :titleStyle="titleStyle" title="商品库"></up-navbar>
				<view class="ml24 mr24 flex-row items-center justify-center pb30">
					<view class="flex-row items-center justify-center pl20 pr10" style="background: #ffffff; border-radius: 254rpx; width: 75%; height: 60rpx">
						<wd-icon name="search" color="#01BB74" size="40rpx"></wd-icon>
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
					<wd-button size="small" :round="false" @click="jumpAddCommodity" :customStyle="SearchCustomStyle">添加商品</wd-button>
				</view>
			</template>
			<template #empty>
				<up-empty
					icon="https://res-oss.elist.com.cn/wxImg/order/goodsEmpty.svg"
					iconSize="200rpx"
					:text="pinia_userRole == 'D' ? '商品库空空如也~尝试添加一个新商品吧！' : '还没有收到订单呢~快去邀请供应商开单吧！'"
					marginTop="-200"
				>
					<wd-button
						v-if="pinia_userRole == 'D'"
						iconColor="#ECFFF9"
						:customStyle="{ width: '300rpx', height: '80rpx', fontSize: '32rpx', marginTop: '76rpx', background: 'transparent', color: '#01BB74' }"
						:plain="true"
						@click="jumpAddCommodity"
					>
						<text>去添加</text>
					</wd-button>
				</up-empty>
			</template>
			<view class="box1">
				<view class="invCard" v-for="(item, index) in orderList" :key="index">
					<view class="" @click="jumpCommodityDetails(item)">
						<up-image
							radius="12rpx"
							width="200rpx"
							height="200rpx"
							:show-menu-by-longpress="false"
							:src="item.img === 'definde' ? 'https://res-oss.elist.com.cn/wxImg/order/emptyView.png' : item.img"
						></up-image>
					</view>
					<view class="invText" @click="jumpCommodityDetails(item)" v-if="uni.$u.getPinia('user.customized')">
						<text>{{ item.description }}</text>
						<text class="up-line-1">型号：{{ item.modelNo }}</text>
						<text>长度(毫米)：{{ item.lengthMm }}</text>
						<text>单重(kg/件)：{{ item.unitWeightKg }}</text>
					</view>
					<view class="invText" @click="jumpCommodityDetails(item)" v-else>
						<text>{{ item.description }}</text>
						<text class="up-line-1">规格：{{ item.specification }}</text>
						<text>单位：{{ item.unit }}</text>
						<text>单价：{{ item.unitPrice == '0' ? '-' : '￥' + item.unitPrice }}</text>
					</view>
					<view class="del_product_icon">
						<wd-icon name="delete1" color="#666666" size="40rpx" @click.stop="delOrderBill(item)"></wd-icon>
					</view>
				</view>
			</view>
		</z-paging>
		<!-- 第一次添加成功商品提示 -->
		<up-overlay :show="showTip" @click="showTip = false">
			<view class="warp">
				<view class="rect relative" @tap.stop>
					<view
						class="rectBtn"
						@click="
							uni.navigateTo({
								url: '/pages/subOrder/add'
							});
							showTip = false;
						"
					></view>
					<up-image src="https://res-oss.elist.com.cn/wxImg/list/productTip.svg" width="540rpx" height="584rpx"></up-image>
				</view>
			</view>
		</up-overlay>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showTip: false,
			titleStyle: {
				fontSize: '34rpx',
				fontWeight: '500'
			},
			orderList: [],
			SearchInventory: '',
			SearchCustomStyle: {
				width: '120rpx',
				height: '50rpx',
				padding: '6rpx',
				margin: '0 0 0 24rpx',
				fontSize: '24rpx'
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
						backgroundColor: '#dd524d'
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
			totalPrices: 0
		};
	},
	onLoad(option) {},
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
	methods: {
		virtualListChange(vList) {
			this.orderList = vList;
		},
		queryList(pageNo, pageSize) {
			this.merchandiseInventory.pages = pageNo;
			this.getMerchandiseInventory();
		},
		getMerchandiseInventory() {
			uni.$api.library
				.getCommodityList(this.merchandiseInventory)
				.then((res) => {
					this.$refs.paging.complete(res.data.data);
				})
				.catch((res) => {
					this.$u.toast('获取失败');
				});
		},
		SearchInventoryChange(e) {
			console.log(e);
			this.merchandiseInventory.description = e;
			this.merchandiseInventory.specification = e;
			this.$refs.paging.reload();
		},
		queryListCheck() {},
		delOrderBill(item) {
			uni.showModal({
				title: '温馨提醒',
				content: '是否删除该商品?',
				showCancel: true,
				cancelText: '取消',
				confirmText: '确定',
				confirmColor: '#01bb74',
				success: (res) => {
					var okif = res.confirm;
					if (okif) {
						uni.$api.library
							.deleteCommodity(item)
							.then((res) => {
								this.$u.toast(res.data.message);
								this.$refs.paging.reload();
							})
							.catch((res) => {
								this.$u.toast('获取失败');
							});
					}
				}
			});
		},
		jumpAddCommodity() {
			uni.navigateTo({
				url: '/pages/subOrder/commodityDetails/updateCommodity'
			});
		},
		jumpCommodityDetails(item) {
			uni.navigateTo({
				url: 'commodityDetails?id=' + item.id
			});
		},
		click(index, index1) {
			if (index1 == 0) {
				var order = this.orderItemList[index];
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
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.rectBtn {
	position: absolute;
	width: 328rpx;
	height: 80rpx;
	bottom: 42rpx;
	left: 50%;
	transform: translateX(-50%);
	z-index: 100;
	border-radius: 394.89px;
}
.warp {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
}
.modification {
	width: 100vw;
	height: 100vh;
	opacity: 1;
	background: linear-gradient(0deg, rgba(243, 255, 247, 0) 14%, #edfff3 99%);
	overflow: hidden;
}

.box1 {
	// position: absolute;
	// width: 100%;
	// margin-top: 50rpx;
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
		width: 400rpx;
		// background-color: #aaffff;

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

	.del_product_icon {
		position: absolute;
		right: 34rpx;
		bottom: 36rpx;
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
