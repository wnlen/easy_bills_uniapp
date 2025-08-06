<template>
	<view class="page-container">
		<u-navbar :border-bottom="false" :titleBold="true" title-color="#000000" :title="detailsHeadline"
			title-size="34" bgColor="#ffffff"></u-navbar>
			
		<uv-popup ref="popup" mode="center" round="50" :overlay="false" :customStyle="popup_style" zIndex="999999">
			<view v-if="vuex_userRole=='D'">
				<uv-textarea v-model="up.remarkD" border="none" count placeholder="请输入内容" height="100" :customStyle="textareaStyle"></uv-textarea>
			</view>
			<view v-if="vuex_userRole=='R'">
				<uv-textarea v-model="up.remarkR" border="none" count placeholder="请输入内容" height="100" :customStyle="textareaStyle"></uv-textarea>
			</view>
			
			<view class="popup-box">
				<view class="btn-l" @click="this.$refs.popup.close();">
					取消
				</view>
				<view class="btn-r" @click="editRemark">
					完成
				</view>
			</view>
		</uv-popup>
		
		<view class="page-list">
			<uv-cell-group :border="false">
				<uv-cell title="头像" :center="true" :cellStyle="cellStyle">
					<template v-slot:value>
						<uv-avatar :src="fixAvatar(userData.headPortrait)" :default-url="headimg()" shape="circle" size="56"></uv-avatar>
					</template>
				</uv-cell>
				<uv-cell title="公司名称" :value="enterpriseName" :cellStyle="cellStyle"></uv-cell>
				<uv-cell title="公司地址" :value="enterpriseSite" :cellStyle="cellStyle"></uv-cell>
				<uv-cell title="手机号" :value="userData.phone||userData.phoneNumber" :cellStyle="cellStyle"></uv-cell>
				<uv-cell v-if="vuex_userRole=='D'" title="备注" :value="up.remarkD||'设置备注'" :border="false" :isLink="true" :cellStyle="cellStyle"
					@click="editRemarkFocusClick"></uv-cell>
				<uv-cell v-if="vuex_userRole=='R'" title="备注" :value="up.remarkR||'设置备注'" :border="false" :isLink="true" :cellStyle="cellStyle"
					@click="editRemarkFocusClick"></uv-cell>
			</uv-cell-group>
		</view>

		<view class="page-list">
			<view class="page-list-box" v-if="vuex_userRole == 'D'">
				<view class="box_l">
					<text>销售总额：</text>
					<text style="color:  #FFC300;">￥<uv-count-to color="#FFC300" fontSize="15" :startVal="0" decimals="2" separator="," :endVal="Statisticsdata.totalAmount"></uv-count-to></text>
				</view>
				<view class="box_r">
					<text>总开单数：</text>
					<text style="color: #01BB74;"><uv-count-to color="#01BB74" fontSize="15" :startVal="0" separator="," :endVal="Statisticsdata.totalOrders"></uv-count-to></text>
				</view>
			</view>
			<view class="page-list-box" v-if="vuex_userRole == 'R'">
				<view class="box_l">
					<text>供应总额：</text>
					<text style="color:  #FFC300;">￥<uv-count-to color="#FFC300" fontSize="15" :startVal="0" decimals="2" separator="," :endVal="Statisticsdata.totalAmount"></uv-count-to></text>
				</view>
				<view class="box_r">
					<text>总收单数：</text>
					<text style="color: #01BB74;"><uv-count-to color="#01BB74" fontSize="15" :startVal="0" separator="," :endVal="Statisticsdata.totalOrders"></uv-count-to></text>
				</view>
			</view>
			<view class="page-list-chart" @touchmove.stop.prevent>
				<qiun-data-charts type="column"
					:opts="{yAxis:{data:[{min:0}]},extra:{column:{seriesGap:5,barBorderRadius:[6,6,6,6],width:40}}}"
					:disableScroll="true"
					:enableScroll="false" 
					:canvas2d="true"
					:chartData="chartsData" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detailsHeadline: "客户信息",
				phone: "",
				state: 0,
				userData: {},
				remark: "",
				up: {
					sBossNumber: "",
					eBossNumber: "",
					remarkD: "",
					remarkR: "",
					port: ""
				},
				port: false,
				type: false,
				cellStyle: {
					'background-color': '#fff',
					'padding': '30rpx 10rpx',
				},
				chartsData: {},
				Statisticsdata:{},
				popup_style:{
					'width': '80%',
					'height': '350rpx',
					'margin': '0 auto',
					'position': 'fixed',
					'borderRadius': '25rpx',
					'top': '550rpx',
					'boxShadow': '0px 0px 20rpx 20rpx #ececec'
				},
				textareaStyle:{
					'marginTop':'10rpx',
					'marginLeft':'10rpx',
					'marginRight':'10rpx',
				}
			}
		},
		computed: {
			enterpriseName() {
				if(this.vuex_userRole=='D'){
					return this.userData?.enterpriseName || '客户未完善';
				}else{
					return this.userData?.enterpriseName || '供应商未完善';
				}
				
			},
			enterpriseSite() {
				if(this.vuex_userRole=='D'){
					return this.userData?.site || '客户未完善';
				}else{
					return this.userData?.site || '供应商未完善';
				}
			}
		},
		watch: {
			// remark(newVal, oldVal) {
			// 	if(this.vuex_userRole == "R"){
			// 		this.up.remarkR = newVal
			// 	}else if(this.vuex_userRole == "D"){
			// 		this.up.remarkD = newVal
			// 	}
			// }
		},
		onLoad(option) {
			console.log('option111111111111111111111111111111',option)
			this.phone = option.phone
			this.state = option.select
			this.type = option.type
			if (this.state === "9") {
				this.userData.phoneNumber = this.phone
				this.getUnregisteredUser(this.phone)
			} else {
				this.getUserData(this.phone)
			}
			this.getOrderStatistics();//获取图表统计
		},
		onShow() {
			// this.$refs.popup.open();
			var ifWorkPort = this.vuex_userRole == "R"
			this.port = ifWorkPort
			if (ifWorkPort) {
				this.detailsHeadline = "供应商信息"
			} else {
				this.detailsHeadline = "客户信息"
			}

		},
		methods: {
			headimg(){
				return uni.getStorageSync('wzc_img');
			},
			fixAvatar(url) {
				return !url || url === 'null' ? '' : url;
			},
			getOrderStatistics(){
				const portType = this.vuex_userRole == "D" ? "0" : "1"; // 0=发货端, 1=收货端
				
				this.$api.dashboard.getDashboardOrderStatistics(this.phone, portType).then(res => {
					if (res.data.code === 200) {
						this.Statisticsdata = res.data.data;
						if(portType == '0'){
							this.chartsData = JSON.parse(JSON.stringify({
								"categories": ["待签收", "已签收", "已收款"],
								"series": [{
									"name": "",
									"legendShape": "none",
									"data": [{
										'value': res.data.data.pendingAmount,
										color: '#F7A944'
									}, {
										'value': res.data.data.signedAmount,
										color: '#418AFF'
									}, {
										'value': res.data.data.receivedAmount,
										color: '#01BB74'
									}]
								}]
							}))
						}else if(portType == '1'){
							this.chartsData = JSON.parse(JSON.stringify({
								"categories": ["待确收", "已签收", "已付款"],
								"series": [{
									"name": "",
									"legendShape": "none",
									"data": [{
										'value': res.data.data.pendingAmount,
										color: '#F7A944'
									}, {
										'value': res.data.data.signedAmount,
										color: '#418AFF'
									}, {
										'value': res.data.data.receivedAmount,
										color: '#01BB74'
									}]
								}]
							}))
						}
						console.log('this.chartsData',res.data.data)
					}
				});
			},
			editRemarkFocusClick() {
				this.$refs.popup.open();
			},
			getBossNumber() {
				return this.vuex_user.data.work === "0" ?
					this.vuex_user.phone :
					this.vuex_user.workData.bossNumber;
			},
			isRole(role) {
				return this.vuex_userRole === role;
			},
			getUnregisteredUser(eBossNumber) {
				var ifWorkPort = this.vuex_userRole == "D"
				var work = this.vuex_user.data.work == "0"
				var sBossNumber = work ? this.vuex_user.phone : this.vuex_user.workData.bossNumber
				var dx = {
					sBossNumber: sBossNumber,
					eBossNumber: eBossNumber
				}
				this.$api.user.searchReceivableUsers(dx).then(res => {
					console.log("===未注册用户===>", res);
					var wzcUser = res.data.data;
					this.remark = ifWorkPort ? wzcUser.remarkD : wzcUser.remarkR
					var dx = {
						phoneNumber: ""
					}
					dx.phoneNumber = wzcUser.eBossNumber
					this.userData = dx
					if (this.port) {
						this.up.remarkR = this.remark
					} else {
						this.up.remarkD = this.remark
					}
					// console.log(this.userData);
				});
			},
			getUserData(phone) {
				var ifwork = this.vuex_user.data.work == "0"
				var boss = ""
				if (ifwork) {
					boss = this.vuex_user.phone
				} else {
					boss = this.vuex_user.workData.bossNumber;
				}

				console.log('type', this.type)
				var url = ""
				if (this.type) {
					url = '/edo/user/searchMarket?phone='
				} else {
					url = '/edo/user/search?phone='
				}

				this.$u.post(url + phone + "&boss=" + boss + "&port=" + this.vuex_userRole).
				then(res => {
					this.userData = res.data.data
					this.remark = res.data.data.remark

					if (this.port) {
						this.up.remarkR = this.remark ? this.remark : null
					} else {
						this.up.remarkD = this.remark ? this.remark : null
					}
					console.log("===获取个人信息===>", this.userData);
					console.log("===获取个人备注===>", this.userData.remark);
					console.log("===保存备注===>", this.remark);
				});
			},
			//更新备注
			editRemark() {
				const isR = this.isRole("R");
				const remark = isR ? this.up.remarkR?.trim() : this.up.remarkD?.trim();
				console.log('this.remark',this.remark)
				console.log('remark',remark)
				
				if (remark === this.remark) {
					console.log("备注无效或未变更");
					return;
				}
				console.log('sBossNumber',this.getBossNumber())
				console.log('eBossNumber',this.userData.phoneNumber)
				console.log('eBossNumber',this.userData.phone)
				const payload = {
					sBossNumber: this.getBossNumber(),
					eBossNumber: this.userData.phoneNumber ||this.userData.phone,
					port: isR ? "R" : "D",
					remarkR: isR ? remark : null,
					remarkD: isR ? null : remark
				};

				this.$api.user.updateDeliveryRemark(payload).then(res => {
					const msg = res.data.message;
					this.$u.toast(msg);
					this.$refs.popup.close();
					if (res.data.data === 1) {
						this.remark = remark;
						isR ? this.up.remarkR = remark : this.up.remarkD = remark;
					}
				});
			}
		},
	}
</script>

<style scoped lang="scss">
	.page-container {
		width: 100vw;
		height: 100vh;
		background-color: #F4F4F4;
	}

	.page-list {
		position: relative;
		margin: 30rpx 24rpx;
		border-radius: 12rpx;
		padding: 0 22rpx;
		font-size: 30rpx;
		line-height: 44rpx;
		background-color: #fff;
		.page-list-box {
			position: relative;
			width: 100%;
			height: 55rpx;
			top: 30rpx;

			.box_l {
				position: absolute;
				left: 15rpx;
			}

			.box_r {
				position: absolute;
				right: 15rpx;
			}
		}

		.page-list-chart {
			position: relative;
			top: 50rpx;
			height: 560rpx;
			padding: 30rpx 0;
			touch-action: none;
			z-index: 1;
		}
	}
	.popup-box{
		position: relative;
		width: 100%;
		height: 150rpx;
		.btn-l{
			position: absolute;
			width: 50%;
			height: 150rpx;
			line-height: 100rpx;
			left: 0;
			bottom: -10rpx;
			border-top: 1rpx solid #eaeaec;
			border-right: 1rpx solid #eaeaec;
			text-align: center;
			font-size: 40rpx;
		}
		.btn-r{
			position: absolute;
			width: 50%;
			height: 150rpx;
			line-height: 100rpx;
			right: 0rpx;
			bottom: -10rpx;
			border-top: 1rpx solid #eaeaec;
			border-left: 1rpx solid #eaeaec;
			text-align: center;
			font-size: 40rpx;
		}
	}
</style>