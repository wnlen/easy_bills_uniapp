<template>
	<view class="bg-white" style="overflow-x: hidden;padding-bottom: 100px;">
		<u-navbar :custom-back="navBack" :border-bottom="false" :titleBold="true" title-color="#000000" title-size="34"
			bgColor="#ffffff">
			<view class="flex-row items-center justify-center ml48" style="width: 100%;">
				<view class="" style="font-size: 34rpx;font-weight: 510;">
					{{title}}
				</view>
				<view @click="jumpVideo" class="flex-row justify-center items-center ml12"
					style="border: 1.1px solid #01BB74;height: 22px;width:68px;border-radius: 8rpx;color: #01BB74;font-size: 11px;">
					使用方法<u-icon class="ml6" name="https://res-oss.elist.com.cn/wxImg/video.png" size="20"></u-icon>
				</view>
			</view>
		</u-navbar>

		<!-- <u-tabs name="cate_name" inactive-color="#333333" active-color="#01BB74" :list="list.length? list : []"
			:is-scroll="false" :current="currents" @change="change"></u-tabs> -->

		<view class="flex-row ml24 mr24 mt24" style="display: flex;">
			<view class="ml5 mr5" style="flex: 1;">
				<u-button openType="share" :custom-style="SearchCustomStyleWechat" hover-class="none" shape="circle"
					:plain="true">
					<u-icon class="pr10" name="weixin-fill" color="#01BB74" size="30"></u-icon>
					微信邀请
				</u-button>
			</view>
			<view class="ml5 mr5" style="flex: 1">
				<u-button :custom-style="SearchCustomStyle" hover-class="none" shape="circle"
					@click="goPath('/pages/subIndex/add_friend/add_friend')">
					<u-icon class="pr10" name="phone-fill" color="#ffffff" size="30"></u-icon>
					手机号邀请
				</u-button>
			</view>
			<view class="ml5 mr5" style="flex: 1">
				<!-- 	<u-button :custom-style="SearchCustomStyle" hover-class="none" shape="circle" @click="scanQRcodes">
					<u-icon class="pr10" name="scan" color="#ffffff" size="30"></u-icon>
					扫一扫邀请
				</u-button> -->
				<u-button :custom-style="SearchCustomStyle" hover-class="none" shape="circle" @click="establish">
					<u-icon class="pr10" name="plus" color="#ffffff" size="30"></u-icon>
					创建{{title}}
				</u-button>
			</view>
		</view>

		<view class="mt24 flex-row ml24 mr24" style="background-color: #f8f8f8;border-radius: 6.12px;">
			<view class="flex-col justify-center pd12">
				<u-icon class="mr10" name="search" color="#01BB74" size="30"></u-icon>
			</view>
			<u-input style="width: 100%;" v-model="searchValue" @input="search"
				:placeholder="show!=1?(vuex_userRole=='R'?'请输入关键字进行供应商查找':'请输入关键字进行客户查找'):(vuex_userRole=='R'?'请输入关键字进行账单查询':'请输入关键字进行销售查询')" />
		</view>

		<u-mask :show="showSF" @click="showSF = false">
			<div @tap.stop v-if="showSF" class="flex-col relative" :style="{height:heig}" style="background-color: white;width: 75%;margin-top: 70%;
				         border-radius: 6.87px;margin-left: 46px;">
				<view class="flex-col justify-center items-center" style="font-size: 16px;height: 5vh;">
					添加好友
				</view>

				<view class="flex-row text-center justify-center items-center" style="width: 100%;height: 8vh;">
					<view class="flex-col text-center justify-center items-center"
						style="color: #999999;font-size: 16px;">
						申请添加对方为
					</view>
					<view @click="showChecked=(showChecked==true?false:true);!showChecked?(heig='20vh'):(heig='29vh')"
						class="ml15 flex-col text-center justify-center items-center"
						style="box-sizing: border-box;border: 0.57px solid #999999;border-radius: 6.87px;width: 79.58px;height: 30.23px;">
						{{role==0?"客户":"供应商"}}
					</view>
					<view class="ml10">
						<u-icon v-if="!showChecked" name="arrow-down-fill" color="#000000" size="15"></u-icon>
						<u-icon v-if="showChecked" name="arrow-up-fill" color="#000000" size="15"></u-icon>
					</view>
				</view>
				<view v-if="!showChecked" class=" u-border-top flex-row" style="width: 100%;height: 7vh;" @tap.stop>
					<view @click="showSF=false;state=0"
						class="onsm u-border-right flex-col text-center justify-center items-cente"
						style="width:50%;height: 100%;">
						取消
					</view>
					<view @click="addFriend(sm)" class="oksm flex-col text-center justify-center items-center"
						style="width: 50%;height: 100%;">
						确认
					</view>
				</view>

				<view v-if="showChecked" class="u-border-top flex-col justify-center items-center"
					style="width: 100%;height: 16vh;" @tap.stop>
					<view @click="role=0;showChecked=false;heig='20vh'" class="flex-row items-center pl20 relative"
						style="height: 35px;width: 255px;border-radius: 3px;"
						:style="{backgroundColor:role==0?'#ECFAF4':'#FBFBFB',color:role==0?'#01BB74':'#333333'}">
						<view>
							客户
						</view>
						<view v-if="role==0" class="absolute" style="right: 10px;">
							<u-icon name="https://res-oss.elist.com.cn/wxImg/code/check.svg" size="28"></u-icon>
						</view>
					</view>
					<view @click="role=1;showChecked=false;heig='20vh'" class="flex-row items-center mt10 pl20 relative"
						style="height: 35px;width: 255px;border-radius: 3px;"
						:style="{backgroundColor:role==1?'#ECFAF4':'#FBFBFB',color:role==1?'#01BB74':'#333333'}">
						<view>
							供应商
						</view>
						<view v-if="role==1" class="absolute" style="right: 10px;">
							<u-icon name="https://res-oss.elist.com.cn/wxImg/code/check.svg" size="28"></u-icon>
						</view>
					</view>
				</view>

			</div>
		</u-mask>





		<view class="">
			<u-empty v-if="isEmptyObject(listO)&&show==1&&vuex_userRole=='D'" src="https://res-oss.elist.com.cn/wxImg/order/empty.svg"
				icon-size="400" text="暂无客户~" mode="search" margin-top="200"></u-empty>
			<u-empty v-if="isEmptyObject(listO)&&show==1&&vuex_userRole=='R'" src="https://res-oss.elist.com.cn/wxImg/order/empty.svg"
				icon-size="400" text="暂无供应商~" mode="search" margin-top="200"></u-empty>
			<view class="mt20 pb150" :style="{display:show!=1?'none':'block'}"
				@click="showAl=(showAl==true?false:false)">
				<view class="ml20 flex-row items-center vw100" v-for="(item2, index2) in listO" :key="index2"
					style="border-bottom: 1px solid #f7f7f7;height: 9vh;" @click="particulars(item2,false)">
					<view class="" style="width:10%">
						<u-image :show-menu-by-longpress="false"
							:src="item2.img=='zx'?'/static/img/obj/zx.svg':(item2.img==undefined?'/static/img/obj/wzc.svg':(item2.img=='wsz'?'/static/img/obj/defind.svg':item2.img))"
							width="90rpx" height="90rpx" shape="circle"></u-image>
					</view>
					<view class="ml30" style="width:60%">
						<view class="ft-bold">
							{{item2.company}}
						</view>
						<view class="ft-gray">
							{{vuex_userRole=="R"?'应付款:':'应收欠款:'}}
							<text class="ft-bold" size="mini" :style="{color:item2.total>0?'#01BB74':'#999999'}">
								￥{{(item2.total).toFixed(2)}}</text>
						</view>
					</view>
					<view class="" style="width: 20%;display: flex;flex-direction: row;justify-content: right;"
						v-if="identity">
						<u-button v-if="item2.total>0" type="success" shape="circle" @click="collection(item2)"
							size="mini">{{vuex_userRole!='R'?'去收款':'去付款'}}</u-button>
					</view>
				</view>
			</view>
		</view>

		<view class="">
			<u-empty v-if="isEmptyObject(client)&&show==0" src="https://res-oss.elist.com.cn/wxImg/order/empty.svg"
				icon-size="400" text="暂无好友~" mode="search" margin-top="200"></u-empty>
			<view class="" :style="{display:show!=0?'none':'block'}">
				<view v-for="(item, index) in client" :key="index" @click="particulars(item,true)">
					<view class="ml20 mt15" style="border-bottom: 1px solid #f7f7f7;width: 110vw;">
						<u-collapse arrow-color="#ffffff">
							<view class="flex-col justify-center items-baseline" style="height: 40px;"
								:style="{color:ifZX(index)?'red':'black'}">
								{{getCompanyName(item)}}
								<!-- {{ifCm(index)}} -->
								<!-- {{ifZX(index)?index.replace("zx-'",''):ifCm(index)?ifCmStr(index):index}} -->
							</view>
						</u-collapse>
					</view>
				</view>
			</view>
		</view>

		<view :style="{display:show!=1?'none':'block'}" class="vw100 pd30"
			style="position: fixed;bottom: 0px;height: 50px;background-color: #01BB74;z-index: 999;align-items: center;border-radius: 6px 6px 0px 0px;opacity: 1;">
			<view class="" style="float: right;color: white;">
				合计欠款：<text class="ft39 ft-bold">￥{{(all).toFixed(2)}}</text>
			</view>
		</view>

	</view>
</template>
<script>
	export default {
		data() {
			return {
				showAl: false,
				list: [
					{
					cate_name: '客户列表'
				}, {
					cate_name: '销售列表'
				}, ],
				current: 0,
				currents: 0,
				scrollTop: 0,
				indexList: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
					"T", "U",
					"V", "W", "X", "Y", "Z"
				],
				listO: {},
				listOCopy: {},
				show: 1,
				client: {},
				clientCopy: {},
				all: 0,
				showSF: false,
				sm: "",
				role: 0,
				showChecked: false,
				heig: "20vh",
				searchValue: "",
				SearchCustomStyle: {
					width: "110px",
					height: "30px",
					padding: "12rpx",
					fontSize: "12px",
					backgroundColor: "#FFAF38",
					color: "#ffffff"
				},
				SearchCustomStyleWechat: {
					width: "100px",
					height: "30px",
					padding: "12rpx",
					fontSize: "12px",
					color: "#01BB74"
				},
				identity: false,
				title: ""
			}
		},
		onShow() {
			this.loadData();
		},
		onLoad() {
			var ifWorkPort = this.vuex_userRole == "R"
			if (ifWorkPort) {
				this.list[0].cate_name = "供应商列表"
				this.list[1].cate_name = "供应列表"
				uni.setNavigationBarTitle({
					title: "供应商"
				})
				this.title = "供应商"
			} else {
				uni.setNavigationBarTitle({
					title: "客户"
				})
				this.list[0].cate_name = "客户列表"
				this.list[1].cate_name = "销售列表"
				this.title = "客户"
			}

			var identity = this.vuex_user.data.work == '1' ? this.vuex_user.workData.identity != 4 : true
			this.identity = identity


			var that = this;
			setTimeout(function() {
				that.currents = 1;
			}, 500)

		},
		onShareAppMessage(ops) {
			if (ops.from === 'button') {
				var phone = this.vuex_user.data.work == "0" ? this.vuex_user.phone : this.vuex_user.workData.bossNumber
				return {
					title: `您有一个好友邀请~`,
					path: '/pages/subMessage/friend_apply_for/shareFriend?phone=' + phone,
					imageUrl: "https://res-oss.elist.com.cn/wxImg/message/share.png"
				}
			}
		},
		methods: {
			establish() {
				console.log("establish");
				uni.navigateTo({
					url: "/pages/subIndex/establish/establish"
				})
			},
			jumpVideo() {
				var port = this.vuex_userRole == "D"
				this.$openVideo(this, port ? 5 : 6);
			},
			collection(item2) {
				var dx = {
					company: item2.company,
					phone: item2.phone
				}
				if (this.vuex_userRole == "D") {
					uni.navigateTo({
						url: "/pages/subStatistics/receipt/receipt?tid=开收款单&searchData=" + JSON.stringify(dx)
					})
				} else {
					uni.navigateTo({
						url: "/pages/subStatistics/receipt/receipt?tid=开付款单&searchData=" + JSON.stringify(dx)
					})
				}
			},
			particulars(particulars, type) {
				if (type) {
					console.log("===particulars===>", particulars);
					var boss = particulars.filter(res => res.identity == "0");
					console.log(boss[0].staffNumber.includes("zx"));
					if (!boss[0].staffNumber.includes("zx")) {
						uni.navigateTo({
							url: "/pages/subIndex/details/details?phone=" + boss[0].staffNumber + "&select=" +
								boss[0].state + "&&type=" + type
						})
					} else {
						this.$u.toast("该用户已经注销~");
					}
				} else {
					if (particulars.img == "zx") {
						this.$u.toast("该用户已经注销~");
						return;
					}

					var state = particulars.img == "wzc" || particulars.img == undefined ? "9" : "0"

					// if (particulars.img == undefined) {
					// 	this.$u.toast("该人员未注册~");
					// 	return;
					// }
					console.log("===particulars.img===>", state);
					console.log("===particulars===>", particulars);
					uni.navigateTo({
						url: "/pages/subIndex/details/details?phone=" + particulars.phone + "&select=" +
							state + "&&type=" + type
					})
				}
			},
			isEmptyObject(obj) {
				return Object.keys(obj).length === 0;
			},
			ifZX(val) {
				// console.log("购买十名非常：", val);
				return val.includes("zx-");
			},
			getCompanyName(item) {
				var boss = item.filter(res => res.identity == "0");
				var zx = this.ifZX(boss[0].companyName);
				return zx ? boss[0].companyName.replace("zx-'", '') : boss[0].companyName;
			},
			scanQRcodes() {
				const that = this;
				uni.scanCode({
					success: (res) => {
						that.scanResult = res.result;
						var json = JSON.parse(that.scanResult);
						console.log('扫码:', json);
						that.sm = json
						that.showSF = true;
						that.showAl = false
						// that.addFriend(json);
					},
					fail: (err) => {
						console.error('扫码失败:', err);
						this.$u.toast("扫码失败~");
					}
				});
			},
			addFriend(json) {
				var addPhone = json.phone;
				var phone = this.vuex_user.phone
				var work = this.vuex_user.data.work == "1"
				var img = this.vuex_user.data.headPortrait;
				var aName = this.vuex_user.data.nickName || phone;
				var identy = ""
				var aBossNumber = phone

				if (addPhone == phone) {
					this.showSF = false
					this.$u.toast("请勿添加自己~")
					return;
				}


				if (work) {
					identy = this.vuex_user.workData.identity;
					aBossNumber = this.vuex_user.workData.bossNumber;
					if (aBossNumber == phone) {
						this.showSF = false
						this.$u.toast("请勿添加自己老板~")
						return;
					}

					var boss = this.vuex_user.workData.bossNumber;
					if (boss == dx.aBossNumber) {
						this.showSF = false
						this.$u.toast("请勿添加自己老板~")
						return;
					}
				}

				var dx = {
					"aNumber": phone,
					"aBossNumber": aBossNumber,
					"bBossNumber": "",
					"aJobBumber": "",
					"bNumber": "",
					"aImg": img,
					"bImg": "",
					"state": "0",
					"aName": "",
					"port": "",
					"aCompany": ""
				}

				this.$u.post('edo/user/search?phone=' + addPhone).then(res => {
					console.log("(检索添加人)： ", JSON.stringify(res.data.data.map));
					var addUser = res.data.data;
					var bossAdd = addPhone;



					if (addUser.map.boss !== undefined) {
						bossAdd = addUser.map.boss;
					}
					var bImg = addUser.headPortrait;


					if (bossAdd == phone) {
						this.showSF = false
						this.$u.toast("请勿添加自己~")
						return;
					}


					dx.bImg = bImg
					dx.bNumber = addPhone
					dx.bBossNumber = bossAdd

					dx.port = this.role == 1 ? "R" : "D"

					this.$u.post('edo/client/add', dx).then(res => {
						console.log("添加申请： " + res.data.data);
						var resAddFriend = res.data
						this.addResAlert(resAddFriend)
					})
				})
			},
			addResAlert(data) {
				this.$u.toast(data.message)
				this.showSF = false;
			},
			search(e) {
				this.searchValue = e
				this.listO = this.listOCopy
				this.client = this.clientCopy
				if (this.show == '1') {
					var list = this.listO.filter(res => res.company.includes(e));

					this.listO = list

					var sum = 0;
					for (let key in list) {
						sum = sum + list[key].total
					}
					this.all = sum
					// console.log("list:", list,sum);
				} else {
					var dx = this.client
					let filteredKeys = Object.keys(dx).filter(key => key.includes(e));
					let filteredObj = {};
					filteredKeys.forEach(key => {
						filteredObj[key] = dx[key];
					});
					this.client = filteredObj
					// console.log("client:", filteredObj);
				}
				// console.log(e);

			},
			loadData() {
				var that = this;
				var phone = this.vuex_work == "Y" ? this.vuex_user.workData.bossNumber : this.vuex_user.phone
				var port = this.vuex_userRole == "R" ? "1" : "0";
				this.$u.post('edo/delivery/get?sBossNumber=' + phone + '&eBossNumber=' + phone + '&port=' + port).then(
					res => {
						console.log(res.data.data);
						that.client = res.data.data
						this.clientCopy = res.data.data
					})

				var ifWorkPort = this.vuex_userRole == "R"
				var ifwork = this.vuex_user.data.work == "0"


				var dx = {
					"bossNumberS": "",
					"bossNumberE": "",
					"staffNumberS": "",
					"staffNumberE": ""
				}
				if (ifWorkPort) {
					console.log("收货端");
					if (ifwork) {
						console.log("收货端 没工作");
						dx.bossNumberE = this.vuex_user.phone
					} else {
						console.log("收货端 有工作");
						var identity = this.vuex_user.workData.identity == "4";
						if (identity) {
							console.log("收货端 有工作 员工");
							var boss = this.vuex_user.workData.bossNumber;
							dx.bossNumberE = boss
							dx.staffNumberE = this.vuex_user.phone
						} else {
							console.log("收货端 有工作 其他");
							var boss = this.vuex_user.workData.bossNumber;
							dx.bossNumberE = boss
						}
					}
				} else {
					console.log("发货端");
					if (ifwork) {
						console.log("发货端 没工作");
						dx.bossNumberS = this.vuex_user.phone
					} else {
						console.log("发货端 有工作");
						var identity = this.vuex_user.workData.identity == "4";
						if (identity) {
							console.log("发货端 有工作 员工");
							var boss = this.vuex_user.workData.bossNumber;
							dx.bossNumberS = boss
							dx.staffNumberS = this.vuex_user.phone
						} else {
							console.log("发货端 有工作 其他");
							var boss = this.vuex_user.workData.bossNumber;
							dx.bossNumberS = boss
						}
					}
				}

				this.$u.post('edo/order/market', dx).then(res => {
					console.log('edo/order/market', res.data.data);
					that.listO = res.data.data
					that.listOCopy = res.data.data
					var sum = 0;
					for (let key in this.listO) {
						sum = sum + this.listO[key].total
					}
					this.all = sum
				})
			},
			change(index) {
				this.currents = index;
				this.show = index
				this.searchValue = ""
				this.listO = this.listOCopy
				this.client = this.clientCopy
				console.log(this.show);
			},
			jump(e, item) {

			}

		}
	}
</script>
<style lang="scss" scoped>
	.list-cell {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		padding: 10px 24rpx;
		overflow: hidden;
		color: #323233;
		font-size: 14px;
		line-height: 24px;
		background-color: #fff;
	}

	.anchor-text {
		color: red;
	}

	.custom-style {
		// width: 13%;
		border-radius: 12px;
		text-align: center;
	}
</style>