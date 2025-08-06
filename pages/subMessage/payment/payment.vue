<template>
	<view class="vw100 vh100 bg-gray">
		<view>
			<u-navbar :autoBack="true" :placeholder="true" title="支付消息"></u-navbar>
			<view class="content">
			</view>
		</view>

		<view class="flex-col mt20" v-for="(item,index) in List">
			<text class="flex-col justify-center items-center" style="width: 100vw;color:#999999;font-size: 20rpx;">
				{{item.createTime}}
			</text>
			<u-card class="ml24 mr24 bg-white justify-center mt10"
			     margin="10"
			    :border="false"
				:thumb="item.type==1?'/static/img/message/zftx.svg':'/static/img/message/fktz.svg'" thumb-width="40"
				:title="item.name" head-border-bottom="true" style="width: 94vw;border-radius: 20rpx;"
				:thumb-circle="true"
				:key="index">
				<view class="" slot="body">
					<view class="u-body-item u-flex  u-col-between u-p-t-0" style="color: #AAAAAA;">
						<view class="u-body-item-title u-line-2" style="width: 85vw;" v-if="item.type==1">
							{{item.body}}
						</view>
						<view class="u-body-item-title u-line-6"
							style="width: 85vw;text-align: center;color: #333333;font-size: 30rpx;" else>
							<view class="">
								{{item.play.state=="1"?"支付成功":"支付失败"}}
							</view>
							<view
								style="width: 85vw;text-align: center;color: #333333;font-size: 40rpx;font-weight: bold;">
								￥{{item.play.price}}
							</view>
							<view class="mt20 mb10"
								style="width: 85vw;text-align: left;color: #333333;font-size: 24rpx;">
								<text style="color: #AAAAAA;">{{item.allBody.playName}}</text><text
									class="ml10">{{item.allBody.playTime}}</text>
							</view>
							<view style="width: 85vw;text-align: left;color: #333333;font-size: 24rpx;">
								<text style="color: #AAAAAA;">{{item.allBody.unitName}}</text><text
									class="ml10">{{item.allBody.unit}}</text>
							</view>
						</view>
					</view>
					<view class="u-body-item u-flex u-row-between u-p-b-0" @click="jump(item.jump.url)">
						<view class="u-body-item-title u-line-2 mt40" style="color: #01BB74;">{{item.jump.titel}}</view>
						<view class="" style="float: right;">
							<u-icon class="u-body-item-title u-line-2 mt40" name="arrow-right" color="#666666"
								size="28"></u-icon>
						</view>
					</view>
				</view>
			</u-card>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				List: [{
					    createTime:"2014-01-06",
						type: "1",
						name: "支付提醒",
						body: "上海天禧园林有限公司已发送付款通知单，快去核对 货物吧!",
						play: {
							state: "1",
							price: "333"
						},
						allBody: {},
						jump: {
							titel: "查看详情",
							url: ""
						}
					},
					{
						createTime:"2014-01-06",
						type: "2",
						name: "付款通知",
						body: "上海天禧园林有限公司已发送付款通知单，快去核对 货物吧!",
						play: {
							state: "1",
							price: "333"
						},
						allBody: {
							playName: "付款时间",
							playTime: "2014-01-06",
							unitName: "付款单位",
							unit: "上海天禧园林有限公司"
						},
						jump: {
							titel: "查看详情",
							url: ""
						}
					}
				]
			}
		},
		methods: {
			jump(url) {
				this.showAlertSJ = true
				// uni.navigateTo({
				// 	url: "/pages/message/" + url
				// })
			}
		}
	}
</script>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		height: 170rpx;
		width: 100vw;
		background-color: #ffffff;
		border-bottom: 2rpx solid #eee;
	}

	.header-left {
		font-size: 30rpx;
		color: #333;
	}

	.header-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-right: 150rpx;
	}

	.header-message {
		font-size: 28rpx;
		color: #999;
	}
</style>