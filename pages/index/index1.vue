<template>
	<view class="Index ft24" :class="userRole===1?'Indexbg1':'Indexbg2'">
		<u-navbar title="" :placeholder="true" bgColor="transparent" leftIconSize="0">
		</u-navbar>
		<view class="flex-row justify-between items-end ml30 mr30">
			<view>
				<view class="title mb12">{{isLogin?"易单据":"请登录~"}}</view>
				<view class="ft28">送货单轻松签收</view>
			</view>
			<view class="flex-row justify-between butBox text-center ft28 ft-bold">
				<view class="flex-1" v-for="(item,index) in roleList" :key="item.value" @click="changeRole(item.value)"
					:class="userRole===item.value?'activeBtn':''">{{item.name}}</view>
			</view>
		</view>
		<view class="bg-white radius12 mt60 ml30 mr30">
			<view class="mb54 flex-row justify-between">
				<view class="charts-box">
					<qiun-data-charts type="ring" :opts="ringOpts" :chartData="chartsDataPie2" />
					<view class="text-center ft-bold">
						<text class="ft24">￥</text>
						<text v-for="(item,index) in allprice.toString().split('.')" :class="index==0?'ft32':'ft24'"
							:key="index">{{item}}<text
								v-if="index===0&&allprice.toString().split('.').length>1">.</text> </text>
					</view>
				</view>
				<view class="flex-col justify-around mr32 items-end">
					<view class="flex-row items-center" v-for="(ite,ind) in chartsDataPie2.series[0].data" :key="ind">
						<view class="text-center ft-bold" :class="ind==0?'ft-orange':ind==1?'ft-blue':'ft-green'">
							<text class="ft20">￥</text>
							<text v-for="(item,index) in ite.value.toString().split('.')"
								:class="index==0?'ft28':'ft20'" :key="index">{{item}}<text
									v-if="index===0&&ite.value.toString().split('.').length>1">.</text> </text>
						</view>
						<view class="ft-gray ft28 ml11">{{ite.name}} ></view>
					</view>
				</view>
			</view>
			<view class="flex-row justify-between pall30">
				<view class="flex-row items-center"
					:class="userRole===1&&index===0?'indexbox1 indexbox':userRole===2&&index===0?'indexbox2 indexbox':'indexbox3 indexbox'"
					v-for="(item,index) in orderList2" :key="index">
					<image class="ml10 mr10 mt8" :src="item.icon" mode="widthFix"></image>
					<view>
						<view class="ft36 ft-bold">
							{{item.name}}
						</view>
						<view class="ft24 ft-color">
							{{item.sub}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bg-white radius12 mt30 ml30 mr30">
			<view class="flex-row flex-wrap">
				<view class="flex-col width25_ items-center" @click="goPath(listItem.path)"
					v-for="(listItem,listIndex) in iconlist" :key="listIndex">
					<image :src="listItem.icon" mode="widthFix" style="width: 80rpx;margin-top: 10rpx;"></image>
					<text>{{listItem.title}}</text>
				</view>
			</view>
			<view class="flex-row justify-center pb20" @click="goPath('/pages/subMessage/chitchat/chat?type=9')">
				<u-icon name="kefu-ermai" size="14"></u-icon>
				<text class="ft28 ml10">客服咨询></text>
			</view>
		</view>
		<view class="flex-row justify-center mt30 ml30 mr30 pb30">
			<u-swiper @click="middleClick" bg-color="#F6F7F7"
				:list="middleBanner.length>0?middleBanner:(vuex_userRole=='R'?middleBannerlXR:middleBannerlXD)"
				imgMode="aspectFill" height="95" interval="5000" autoplay name="url" :effect3d="true"
				effect3d-previous-margin="-10" border-radius="18"></u-swiper>
			<!-- <image src="/static/img/index/new/banner.png" style="width: 100%;" mode="widthFix"></image> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				middleBanner: [],
				middleBannerlXD: [{
					"url": "https://res-oss.elist.com.cn/advertising/free_card.png",
					"jump": "https://res-oss.elist.com.cn/advertising/free_card.png?s=1"
				}],
				middleBannerlXR: [{
					"url": "https://res-oss.elist.com.cn/advertising/banner001.jpg",
					"jump": "https://res-oss.elist.com.cn/advertising/advertising001.png?s=1"
				}],
				allprice: 0,
				ringOpts: {
					rotate: false,
					rotateLock: false,
					color: ["#1890FF", "#91CB74", "#F7A944", ],
					padding: [0, 0, 0, 0],
					width: 130,
					height: 130,
					dataLabel: false,
					enableScroll: false,
					legend: {
						show: false,
					},
					title: {
						name: "总销售",
						fontSize: 14,
						color: "#333"
					},
					subtitle: {
						name: "（今年）",
						fontSize: 10,
						color: "#333"
					},
					extra: {
						ring: {
							ringWidth: 15,
							activeOpacity: 0.5,
							activeRadius: 10,
							offsetAngle: 0,
							labelWidth: 15,
							border: true,
							borderWidth: 3,
							borderColor: "#FFFFFF"
						}
					}
				},
				chartsDataPie2: {
					series: [{
						data: [{
							"name": "待签收",
							"value": 0,
						}, {
							"name": "已签收",
							"value": 0,
						}, {
							"name": "已收款",
							"value": 0,
						}]
					}]
				},
				userRole: 1,
				roleList: [{
					name: '发货端',
					value: 1,
				}, {
					name: '收货端',
					value: 2,
				}],
				iconlist: [{
						title: "客户",
						icon: "/static/img/index/new/icon1.png",
						path: "/pages/subIndex/my_customer/my_customer"
					},
					{
						title: "商品库",
						icon: "/static/img/index/new/icon2.png",
						path: "/pages/subOrder/commodityDetails/nventoryCommodities",
					},
					{
						title: "草稿箱",
						icon: "/static/img/index/new/icon3.png",
						path: "/pages/subOrder/drafts"
					},
					{
						title: "待办事项",
						icon: "/static/img/index/new/icon4.png",
						path: "/pages/subIndex/backlog/backlog",
					},
					{
						title: "更多功能",
						icon: "/static/img/index/new/icon5.png",
						path: "/pages/subPack/more/more?tid=更多功能"
					},
				],
				orderList2: [{
						name: '开送货单',
						sub: '三步完成开单',
						icon: '/static/img/index/new/index1.png',
					},
					{
						name: '统计对账',
						sub: '下载统计表',
						icon: '/static/img/index/new/index2.png',
					}
				],
			}
		},
		onShow() {
			this.getmiddleBanner(); //加载广告
			// if (this.vuex_user.phone == undefined || this.vuex_user.phone == "10000000000" || this.vuex_user.phone ==
			// 	null) {
			// 	if (this.vuex_userRole == "D") {
			// 		this.middleBanner = this.middleBannerlXD
			// 	} else {
			// 		this.middleBanner = this.middleBannerlXR
			// 	}

			// 	//#ifdef APP 
			// 	this.goToLogin();
			// 	//#endif 
			// } else {}
			// console.log('this.middleBanner',this.middleBannerlXR);
		},
		computed: {
			isLogin() {
				return this.vuex_token && this.vuex_user?.phone;
			},
		},
		methods: {
			// 加载广告
			getmiddleBanner() {
				// console.log('刷新')
				var filer = this.vuex_userRole == "D" ? "1" : "0"
				console.log('广告',filer);
				console.log('this.$api.advert 是：', this.$api.advert)
				this.$api.advert.getAdvertList({
					'port': filer
				}).then(res => {
					console.log('广告列表',res)
					if (res.data.code == 401) {
						if (this.vuex_userRole == "D") {
							this.middleBanner = this.middleBannerlXD
						} else {
							this.middleBanner = this.middleBannerlXR
						}
			
					} else {
						this.middleBanner = []
						this.middleBanner = res.data.data;
					}
				})
			},
			// 跳转广告
			middleClick(e) {
				this.jumpToUrl(this.middleBanner[e].jump);
			},
			jumpToUrl(url) {
				console.log('点击广告', url)
				if (!url) return;
				if (url.indexOf('http') < 0) {
					// 内部跳转
					uni.navigateTo({
						url: url
					});
				} else {
					// 外部跳转
					console.log("外部跳转");
					uni.previewImage({
						loop: true,
						urls: [url], //可以展示imgUrl 列表中所有的图片
					});
				}
			},
			/*切换角色  */
			changeRole(value) {
				if (!this.isLogin) {
					uni.navigateTo({
						url: "/pages/subUser/login"
					})
					return
				}
				this.userRole = value
				if (value === 1) {
					this.chartsDataPie2 = {
						series: [{
							data: [{
								"name": "待签收",
								"value": 0,
							}, {
								"name": "已签收",
								"value": 0,
							}, {
								"name": "已收款",
								"value": 0,
							}]
						}]
					}
					this.ringOpts = {
							rotate: false,
							rotateLock: false,
							color: ["#1890FF", "#91CB74", "#F7A944", ],
							padding: [0, 0, 0, 0],
							width: 130,
							height: 130,
							dataLabel: false,
							enableScroll: false,
							legend: {
								show: false,
							},
							title: {
								name: "总销售",
								fontSize: 14,
								color: "#333"
							},
							subtitle: {
								name: "（今年）",
								fontSize: 10,
								color: "#333"
							},
							extra: {
								ring: {
									ringWidth: 15,
									activeOpacity: 0.5,
									activeRadius: 10,
									offsetAngle: 0,
									labelWidth: 15,
									border: true,
									borderWidth: 3,
									borderColor: "#FFFFFF"
								}
							}
						},
						this.iconlist = [{
								title: "客户",
								icon: "/static/img/index/new/icon1.png",
								path: "/pages/subIndex/my_customer/my_customer"
							},
							{
								title: "商品库",
								icon: "/static/img/index/new/icon2.png",
								path: "/pages/subOrder/commodityDetails/nventoryCommodities",
							},
							{
								title: "草稿箱",
								icon: "/static/img/index/new/icon3.png",
								path: "/pages/subOrder/drafts"
							},
							{
								title: "待办事项",
								icon: "/static/img/index/new/icon4.png",
								path: "/pages/subIndex/backlog/backlog",
							},
							{
								title: "更多功能",
								icon: "/static/img/index/new/icon5.png",
								path: "/pages/subPack/more/more?tid=更多功能"
							},
						]
					this.orderList2 = [{
							name: '开送货单',
							sub: '三步完成开单',
							icon: '/static/img/index/new/index1.png',
						},
						{
							name: '统计对账',
							sub: '下载统计表',
							icon: '/static/img/index/new/index2.png',
						}
					]
				} else {
					this.ringOpts = {
							rotate: false,
							rotateLock: false,
							color: ["#1890FF", "#91CB74", "#F7A944", ],
							padding: [0, 0, 0, 0],
							width: 130,
							height: 130,
							dataLabel: false,
							enableScroll: false,
							legend: {
								show: false,
							},
							title: {
								name: "总供应",
								fontSize: 14,
								color: "#333"
							},
							subtitle: {
								name: "（今年）",
								fontSize: 10,
								color: "#333"
							},
							extra: {
								ring: {
									ringWidth: 15,
									activeOpacity: 0.5,
									activeRadius: 10,
									offsetAngle: 0,
									labelWidth: 15,
									border: true,
									borderWidth: 3,
									borderColor: "#FFFFFF"
								}
							}
						},
						this.chartsDataPie2 = {
							series: [{
								data: [{
									"name": "待确收",
									"value": 0,
								}, {
									"name": "已签收",
									"value": 0,
								}, {
									"name": "已付款",
									"value": 0,
								}]
							}]
						}
					this.iconlist = [{
							title: "供应商",
							icon: "/static/img/index/new/icon1.png",
							path: "/pages/subIndex/my_customer/my_customer"
						},
						{
							title: "待办事项",
							icon: "/static/img/index/new/icon4.png",
							path: "/pages/subIndex/backlog/backlog",
						},
						{
							title: "付款单列表",
							icon: "/static/img/index/new/icon6.png",
							path: "/pages/subStatistics/receipt/bill_receipt?tid=付款单列表"
						},
						{
							title: "开付款单",
							icon: "/static/img/index/new/icon7.png",
							path: "/pages/subStatistics/receipt/receipt?tid=开付款单"
						},

						{
							title: "更多功能",
							icon: "/static/img/index/new/icon5.png",
							path: "/pages/subPack/more/more?tid=更多功能"
						},
					]
					this.orderList2 = [{
							name: '送货单签收',
							sub: '在线电子签署',
							icon: '/static/img/index/new/index3.png',
						},
						{
							name: '统计对账',
							sub: '下载统计表',
							icon: '/static/img/index/new/index2.png',
						}
					]
				}

			},
		}
	}
</script>

<style lang="scss" scoped>
	.Index {
		min-height: 100vh;

	}

	.Indexbg1 {
		background: url('/static/img/index/new/bg1.png') no-repeat left top #F6F7F7;
		background-size: 100% auto;
	}

	.Indexbg2 {
		background: url('/static/img/index/new/bg2.png') no-repeat left top #F6F7F7;
		background-size: 100% auto;
	}

	@font-face {
		font-family: "阿里妈妈数黑体 Bold";
		font-weight: 700;
		src: url("//at.alicdn.com/wf/webfont/rdxQu8eqOUH7/4bx8ph3uS3Bz.woff2") format("woff2"),
			url("//at.alicdn.com/wf/webfont/rdxQu8eqOUH7/jgLhzuIxyXiQ.woff") format("woff");
		font-variation-settings: normal;
		font-display: swap;
	}

	.title {
		font-family: '阿里妈妈数黑体 Bold';
		font-size: 36rpx;

	}

	.charts-box {
		width: 290rpx;
		height: 290rpx;
	}

	.butBox {
		width: 260rpx;
		background: #fff;
		border-radius: 214rpx;
		border: 1px solid #FDB728;
		color: #FDB728;

		>view {
			line-height: 54rpx;

			&.activeBtn {
				color: #fff;
				border-radius: 214rpx;
				background: #FDB728;
			}
		}
	}

	.indexbox {
		width: 147px;
		height: 73px;
		border-radius: 13.77px;

		image {
			width: 72rpx;
		}
	}

	.indexbox1 {
		background: #FFF9EC;
		border: 1.1px solid #FF8F1F;
		color: #FF8F1F;
	}

	.indexbox2 {
		background: #FFF9EC;
		border: 1.1px solid #FFC300;
		color: #FFC300;
	}

	.indexbox3 {
		background: #ECF3FF;
		border: 1.1px solid #3465FF;
		color: #3465FF;
	}
</style>