<template>
	<view class="content">
		<!-- <u-navbar :background="{ background: '#ffffff' }" back-icon-size="30" title="操作手册"></u-navbar> -->
		<u-navbar :custom-back="customBack" :border-bottom="false" :titleBold="true" title-color="#000000" title="操作手册" title-size="34"
			bgColor="#ffffff"></u-navbar>

		<view class="absolute flex-col items-center cardAll">

			<view class="cardOne">
				<view class="cardOneTitle">
					通用
				</view>

				<view class="cardOneIcon flex-row justify-center items-center" v-for="(item,index) in iconList.cardOne"
					:key="index">
					<view class="item" v-for="(item2,index2) in item" :key="index2">
						<u-icon @click="jump(item2)" label-pos="bottom" :label="item2.name" :name="item2.icon"
							size="90"></u-icon>
					</view>
				</view>

			</view>


			<view class="cardOne mt30" v-if="vuex_userRole=='R'">
				<view class="cardOneTitle">
					收货端
				</view>

				<view class="cardOneIcon flex-row justify-center items-center" v-for="(item,index) in iconList.cardTowS"
					:key="index">
					<view class="item" v-for="(item2,index2) in item" :key="index2">
						<u-icon @click="jump(item2)" label-pos="bottom" :label="item2.name" :name="item2.icon"
							size="90"></u-icon>
					</view>
				</view>

			</view>


			<view class="cardOne mt30" v-if="vuex_userRole=='D'">
				<view class="cardOneTitle">
					发货端
				</view>

				<view class="cardOneIcon flex-row justify-center items-center" v-for="(item,index) in iconList.cardTowF"
					:key="index">
					<view class="item" v-for="(item2,index2) in item" :key="index2">
						<u-icon @click="jump(item2)" label-pos="bottom" :label="item2.name" :name="item2.icon"
							size="90"></u-icon>
					</view>
				</view>

			</view>



			<view class="cardOne mt30">
				<view class="cardOneTitle">
					我的权益
				</view>

				<view class="cardOneIcon flex-row justify-center items-center"
					v-for="(item,index) in iconList.cardThree" :key="index">
					<view class="item" v-for="(item2,index2) in item" :key="index2">
						<u-icon @click="jump(item2)" label-pos="bottom" :label="item2.name" :name="item2.icon"
							size="90"></u-icon>
					</view>
				</view>

			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				iconList: {
					cardOne: [
						[{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon5.svg",
								name: "端口切换",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/dkqh.html",
								accomplish: true
							},
							{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon1.svg",
								name: "资料填写",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/ztrz.html",
								accomplish: true
							},
							{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon2.svg",
								name: "人员邀请",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/ryyq.html",
								accomplish: true
							},
							{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon3.svg",
								name: "注销账号",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/zxzh.html",
								accomplish: true
							}
						],
						[{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon4.svg",
								name: "打印单据",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/djdy.html",
								accomplish: true
							},
							{
								icon: "",
								name: "",
								path: ""
							},
							{
								icon: "",
								name: "",
								path: ""
							},
							{
								icon: "",
								name: "",
								path: ""
							}
						]
					],
					cardTowF: [
						[{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon8.svg",
								name: "一键开单",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/yjkd.html",
								accomplish: true
							},
							{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon6.svg",
								name: "客户管理",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/khgl.html",
								accomplish: true
							},
							{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon7.svg",
								name: "订单查询",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/ddcx-f.html",
								accomplish: true
							},
							{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon9.svg",
								name: "订单统计",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/ddtj-f.html",
								accomplish: true
							}
						],
						[{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon10.svg",
								name: "单据操作",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/djcz-f.html",
								accomplish: true
							},
							{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon16.svg",
								name: "开收款单",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/kskd.html",
								accomplish: true
							},
							{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon15.svg",
								name: "收款单操作",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/skdcz.html",
								accomplish: true
							},
							{
								icon: "",
								name: "",
								path: ""
							}
						]
					],
					cardTowS: [
						[{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon8.svg",
								name: "签收管理",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/qsgl.html",
								accomplish: true
							},
							{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon6.svg",
								name: "供应商管理",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/gysgl.html",
								accomplish: true
							},
							{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon7.svg",
								name: "订单查询",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/ddcx-s.html",
								accomplish: true
							},
							{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon9.svg",
								name: "订单统计",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/ddtj-s.html",
								accomplish: true
							}
						],
						[{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon10.svg",
								name: "单据操作",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/djcz-s.html",
								accomplish: true
							},
							{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon16.svg",
								name: "开付款单",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/kfkd.html",
								accomplish: true
							},
							{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon15.svg",
								name: "付款单操作",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/fkdcz.html",
								accomplish: true
							},
							{
								icon: "",
								name: "",
								path: ""
							}
						]
					],
					cardThree: [
						[{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon13.svg",
								name: "订单统计",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/ddtj-q.html",
								accomplish: true
							},
							{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon12.svg",
								name: "开单模板",
								path: "",
								accomplish: false
							},
							{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon11.svg",
								name: "往年数据",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/wnsj-q.html",
								accomplish: true
							},
							{
								icon: "https://res-oss.elist.com.cn/wxImg/handbook/icon/icon14.svg",
								name: "人员管理",
								path: "https://res-oss.elist.com.cn/wxImg/handbook/course/rygl-q.html",
								accomplish: true
							}
						]
					]
				},

			}
		},
		onShow() {
			if (this.vuex_userRole==""||this.vuex_userRole==undefined) {
				this.$u.setPinia({
					user:{
						userRole: 'D'
					}
				})
			}
		},
		methods: {
			customBack(){
				uni.switchTab({
					url:"/pages/user/index"
				})
			},
			jump(list) {
				if (!list.accomplish) {
					uni.navigateTo({
						url: "/pages/subOrder/receipt?tid=操作手册"
					})
				} else {
					uni.navigateTo({
						url: "/pages/subPack/handbook/webpage?url=" + list.path
					})
				}

			}
		}
	}
</script>

<style>
	.content {
		width: 100vw;
		min-height: 110vh;
		background-image: url('https://res-oss.elist.com.cn/wxImg/handbook/back.png');
		background-size: cover;
	}

	.cardOne {
		background-color: #FFFFFF;
		width: 96%;
		min-height: 20vh;
		border-radius: 6px;

	}

	.cardAll {
		background-color: transparent;
		width: 100%;
		height: 70%;
		bottom: 0;
		/* overflow-y: auto; */
		padding-top: 20px;
		padding-bottom: 100px;
	}

	.cardOneTitle {
		font-size: 15px;
		font-weight: normal;
		line-height: normal;
		letter-spacing: 0em;
		color: #333333;
		padding: 10px;
	}

	.cardOneIcon {
		/* background-color: aqua; */
		display: flex;
		justify-content: space-between
	}

	.item {
		flex: 1;
		height: 90px;
		/* border: 1px solid #ccc; */
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>