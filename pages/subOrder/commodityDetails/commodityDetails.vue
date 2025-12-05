<template>
	<view class="pb150">
		<up-navbar :autoBack="true" :placeholder="true" title="商品详情"></up-navbar>
		<view class="" v-if="details.img != null && details.img != 'definde'">
			<up-image width="100%" height="600rpx" :src="details.img" :show-menu-by-longpress="false" @click="previewImageAll([details.img], 'none')"></up-image>
		</view>
		<view class="flex-col pt24" style="width: 100%">
			<view class="relative flex-row justify-center items-center pd24 mt24" style="width: 100%">
				<view class="absolute commodityDetailsHeadline" style="left: 24rpx">品名</view>
				<view class="absolute commodityDetailsValue" style="right: 24rpx">
					{{ details.description }}
				</view>
			</view>
			<view class="relative flex-row justify-center items-center pd24 mt24" style="width: 100%">
				<view class="absolute commodityDetailsHeadline" style="left: 24rpx">商品编号</view>
				<view class="absolute commodityDetailsValue" style="right: 24rpx">
					{{ details.orderId }}
				</view>
			</view>
			<view class="relative flex-row justify-center items-center pd24 mt24" style="width: 100%">
				<view class="absolute commodityDetailsHeadline" style="left: 24rpx">规格</view>
				<view class="absolute commodityDetailsValue" style="right: 24rpx">
					{{ details.specification ? details.specification : '---' }}
				</view>
			</view>
			<view class="" v-if="!uni.$u.getPinia('user.customized')">
				<view class="relative flex-row justify-center items-center pd24 mt24" style="width: 100%">
					<view class="absolute commodityDetailsHeadline" style="left: 24rpx">单位</view>
					<view class="absolute commodityDetailsValue" style="right: 24rpx">
						{{ details.unit ? details.unit : '---' }}
					</view>
				</view>
				<view class="relative flex-row justify-center items-center pd24 mt24" style="width: 100%">
					<view class="absolute commodityDetailsHeadline" style="left: 24rpx">单价</view>
					<view class="absolute commodityDetailsValue" style="right: 24rpx">
						{{ details.unitPrice ? '￥' + details.unitPrice : '---' }}
					</view>
				</view>
			</view>
			<view class="" v-if="uni.$u.getPinia('user.customized')">
				<view class="relative flex-row justify-center items-center pd24 mt24" style="width: 100%">
					<view class="absolute commodityDetailsHeadline" style="left: 24rpx">型号</view>
					<view class="absolute commodityDetailsValue" style="right: 24rpx">
						{{ details.modelNo ? details.modelNo : '---' }}
					</view>
				</view>
				<view class="relative flex-row justify-center items-center pd24 mt24" style="width: 100%">
					<view class="absolute commodityDetailsHeadline" style="left: 24rpx">长度(毫米)</view>
					<view class="absolute commodityDetailsValue" style="right: 24rpx">
						{{ details.lengthMm ? details.lengthMm : '---' }}
					</view>
				</view>
				<view class="relative flex-row justify-center items-center pd24 mt24" style="width: 100%">
					<view class="absolute commodityDetailsHeadline" style="left: 24rpx">单重(kg/件)</view>
					<view class="absolute commodityDetailsValue" style="right: 24rpx">
						{{ details.unitWeightKg ? details.unitWeightKg : '---' }}
					</view>
				</view>
			</view>

			<view class="relative flex-row justify-center items-center pd24 mt24" style="width: 100%">
				<view class="absolute commodityDetailsHeadline" style="left: 24rpx">备注说明</view>
				<view class="absolute commodityDetailsValue" style="right: 24rpx">
					{{ details.explainRemark ? '' : '---' }}
				</view>
			</view>
			<view class="ml24 mr24 pd24 mt24" style="background-color: #f9f9f9; border-radius: 12rpx; text-indent: 1em; color: #666" v-if="details.explainRemark">
				<!-- &nbsp;&nbsp; -->
				{{ details.explainRemark }}
			</view>
		</view>

		<view class="" style="position: fixed; bottom: 40rpx; width: 94%; justify-content: center; left: 3%">
			<wd-button :customStyle="{ backgroundColor: '#01BB74', color: '#ffffff', width: '100%' }" @click="commodityDetailsUpdate">编辑商品</wd-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			presentPicture: 'https://res-oss.elist.com.cn/wxImg/cs.png',

			details: {
				description: '',
				explainRemark: null,
				id: null,
				img: null,
				imgId: null,
				orderId: null,
				pages: null,
				phone: null,
				quantity: 0,
				size: null,
				specification: null,
				staffNumber: null,
				state: 1,
				top: null,
				unit: null,
				unitPrice: 0
			},
			getByID: {
				id: null,
				phone: '',
				staffNumber: ''
			}
		};
	},
	onLoad(option) {
		console.log(option);
		this.getByID.id = option.id;
		// this.getCommodityDetails()
	},
	onShow() {
		this.getCommodityDetails();
	},
	methods: {
		getCommodityDetails(id) {
			this.getByID.staffNumber = this.pinia_user.phone;
			if (this.pinia_user.user.work == '0') {
				this.getByID.phone = this.pinia_user.phone;
			} else {
				this.getByID.phone = this.pinia_user.workData.bossNumber;
			}
			console.log('getByID', this.getByID);
			uni.$api.library
				.getCommodityById(this.getByID)
				.then((res) => {
					this.details = res.data.data;
				})
				.catch((err) => {
					console.log('详情失败', err);
					this.$u.toast('获取失败');
				});
		},
		commodityDetailsUpdate() {
			console.log('编辑商品');
			uni.navigateTo({
				url: '/pages/subOrder/commodityDetails/updateCommodity?id=' + this.details.id
			});
		}
	}
};
</script>

<style lang="scss">
.commodityDetailsHeadline {
	font-size: 32rpx;
	font-weight: normal;
	line-height: 44rpx;
	letter-spacing: 0rpx;
	color: #666666;
}

.commodityDetailsValue {
	font-size: 32rpx;
	font-weight: normal;
	line-height: 44rpx;
	text-align: right;
	letter-spacing: 0rpx;
	color: #333333;
}
</style>
