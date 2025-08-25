<template>
	<view class="bg-white" style="overflow-x: hidden; padding-bottom: 200rpx">
		<u-navbar :autoBack="true" :placeholder="true" bgColor="#ffffff">
			<template #center>
				<view class="flex-row items-center justify-center ml48" style="width: 100%">
					<view class="" style="font-size: 34rpx; font-weight: 510">
						{{ title }}
					</view>
					<view
						@click="jumpVideo"
						class="flex-row justify-center items-center ml12"
						style="border: 2.2rpx solid #01bb74; height: 44rpx; width: 136rpx; border-radius: 8rpx; color: #01bb74; font-size: 22rpx"
					>
						<text class="mr6">使用方法</text>
						<view class="ml6">
							<u-icon name="https://res-oss.elist.com.cn/wxImg/video.png" size="20rpx"></u-icon>
						</view>
					</view>
				</view>
			</template>
		</u-navbar>

		<u-tabs
			name="cate_name"
			lineColor="#01BB74"
			:activeStyle="{ color: '#01BB74' }"
			:inactiveStyle="{ color: '#333333' }"
			:list="list.length ? list : []"
			:scrollable="false"
			:current="currents"
			@change="change"
		></u-tabs>

		<view class="flex-row ml24 mr24 mt24" style="display: flex">
			<view class="ml5 mr5" style="flex: 1">
				<u-button openType="share" color="#01BB74" :customStyle="SearchCustomStyleWechat" shape="circle" :plain="true">
					<view><u-icon name="weixin-fill" color="#01BB74" size="30rpx"></u-icon></view>
					<text class="pl10">微信邀请</text>
				</u-button>
			</view>
			<!-- <view class="ml5 mr5" style="flex: 1">
				<u-button :customStyle="SearchCustomStyle"  shape="circle" @click="goPath('/pages/subIndex/add_friend/add_friend')">
					<u-icon name="phone-fill" color="#ffffff" size="30rpx"></u-icon>
					<text class="pl10">手机号邀请</text>
				</u-button>
			</view> -->
			<view class="ml5 mr5" style="flex: 1">
				<!-- 	<u-button :customStyle="SearchCustomStyle"  shape="circle" @click="scanQRcodes">
					<view class=></view><u-icon  "pr10" name="scan" color="#ffffff" size="30rpx"></u-icon>
					扫一扫邀请
				</u-button> -->
				<u-button :customStyle="SearchCustomStyle" color="#FFAF38" shape="circle" @click="establish">
					<u-icon name="plus" color="#ffffff" size="30rpx"></u-icon>
					<text class="pl10">创建{{ title }}</text>
				</u-button>
			</view>
		</view>

		<view class="mt24 flex-row ml24 mr24" style="background-color: #f8f8f8; border-radius: 12.24rpx">
			<view class="flex-col justify-center pd12">
				<view class="search"><u-icon name="search" color="#01BB74" size="40rpx"></u-icon></view>
			</view>
			<view class="pd10 flex-1">
				<u-input
					border="none"
					v-model="searchValue"
					@change="search"
					:placeholder="
						show != 1
							? pinia_userRole == 'R'
								? '请输入关键字进行供应商查找'
								: '请输入关键字进行客户查找'
							: pinia_userRole == 'R'
							? '请输入关键字进行账单查询'
							: '请输入关键字进行销售查询'
					"
				></u-input>
			</view>
		</view>

		<up-overlay :show="showSF" @click="showSF = false">
			<div
				@tap.stop
				v-if="showSF"
				class="flex-col relative"
				:style="{ height: heig }"
				style="background-color: white; width: 75%; margin-top: 70%; border-radius: 13.74rpx; margin-left: 92rpx"
			>
				<view class="flex-col justify-center items-center" style="font-size: 32rpx; height: 5vh">添加好友</view>

				<view class="flex-row text-center justify-center items-center" style="width: 100%; height: 8vh">
					<view class="flex-col text-center justify-center items-center" style="color: #999999; font-size: 32rpx">申请添加对方为</view>
					<view
						@click="
							showChecked = showChecked == true ? false : true;
							!showChecked ? (heig = '20vh') : (heig = '29vh');
						"
						class="ml15 flex-col text-center justify-center items-center"
						style="box-sizing: border-box; border: 1.14rpx solid #999999; border-radius: 13.74rpx; width: 159.16rpx; height: 60.46rpx"
					>
						{{ role == 0 ? '客户' : '供应商' }}
					</view>
					<view class="ml10">
						<u-icon v-if="!showChecked" name="arrow-down-fill" color="#000000" size="15rpx"></u-icon>
						<u-icon v-if="showChecked" name="arrow-up-fill" color="#000000" size="15rpx"></u-icon>
					</view>
				</view>
				<view v-if="!showChecked" class="u-border-top flex-row" style="width: 100%; height: 7vh" @tap.stop>
					<view
						@click="
							showSF = false;
							state = 0;
						"
						class="onsm u-border-right flex-col text-center justify-center items-cente"
						style="width: 50%; height: 100%"
					>
						取消
					</view>
					<view @click="addFriend(sm)" class="oksm flex-col text-center justify-center items-center" style="width: 50%; height: 100%">确认</view>
				</view>

				<view v-if="showChecked" class="u-border-top flex-col justify-center items-center" style="width: 100%; height: 16vh" @tap.stop>
					<view
						@click="
							role = 0;
							showChecked = false;
							heig = '20vh';
						"
						class="flex-row items-center pl20 relative"
						style="height: 70rpx; width: 510rpx; border-radius: 6rpx"
						:style="{
							backgroundColor: role == 0 ? '#ECFAF4' : '#FBFBFB',
							color: role == 0 ? '#01BB74' : '#333333'
						}"
					>
						<view>客户</view>
						<view v-if="role == 0" class="absolute" style="right: 20rpx">
							<u-icon name="https://res-oss.elist.com.cn/wxImg/code/check.svg" size="28rpx"></u-icon>
						</view>
					</view>
					<view
						@click="
							role = 1;
							showChecked = false;
							heig = '20vh';
						"
						class="flex-row items-center mt10 pl20 relative"
						style="height: 70rpx; width: 510rpx; border-radius: 6rpx"
						:style="{
							backgroundColor: role == 1 ? '#ECFAF4' : '#FBFBFB',
							color: role == 1 ? '#01BB74' : '#333333'
						}"
					>
						<view>供应商</view>
						<view v-if="role == 1" class="absolute" style="right: 20rpx">
							<u-icon name="https://res-oss.elist.com.cn/wxImg/code/check.svg" size="28rpx"></u-icon>
						</view>
					</view>
				</view>
			</div>
		</up-overlay>

		<view class="">
			<u-empty
				v-if="isEmptyObject(listO) && show == 1 && pinia_userRole == 'D'"
				icon="https://res-oss.elist.com.cn/wxImg/order/empty.svg"
				iconSize="200rpx"
				text="暂无客户~"
				marginTop="200rpx"
			></u-empty>
			<u-empty
				v-if="isEmptyObject(listO) && show == 1 && pinia_userRole == 'R'"
				icon="https://res-oss.elist.com.cn/wxImg/order/empty.svg"
				iconSize="200rpx"
				text="暂无供应商~"
				marginTop="200"
			></u-empty>
			<view class="mt20 pb150" :style="{ display: show != 1 ? 'none' : 'block' }" @click="showAl = showAl == true ? false : false">
				<view class="ml20 flex-row items-center vw100" v-for="(item2, index2) in listO" :key="index2" style="height: 9vh" @click="particulars(item2, false)">
					<view class="" style="width: 10%">
						<u-image
							:show-menu-by-longpress="false"
							:src="item2.img == 'zx' ? '/static/img/obj/zx.svg' : item2.img == undefined ? headimg() : item2.img == 'wsz' ? '/static/img/obj/defind.svg' : item2.img"
							width="90rpx"
							height="90rpx"
							shape="circle"
						></u-image>
					</view>
					<view class="ml30" style="width: 60%">
						<view class="ft-bold">
							{{ item2.company }}
						</view>
						<view class="ft-gray">
							{{ pinia_userRole == 'R' ? '应付款:' : '应收欠款:' }}
							<text class="ft-bold" size="mini" :style="{ color: item2.total > 0 ? '#01BB74' : '#999999' }">￥{{ formatAmount(item2.total) }}</text>
						</view>
					</view>
					<view class="" style="width: 20%; display: flex; flex-direction: row; justify-content: right" @click.stop="collection(item2)" v-if="identity">
						<u-button v-if="item2.total > 0" color="#01BB74" :customStyle="{ width: '110rpx', height: '50rpx' }" shape="circle" size="mini">
							{{ pinia_userRole != 'R' ? '去收款' : '去付款' }}
						</u-button>
					</view>
				</view>
			</view>
		</view>

		<view class="">
			<u-empty
				v-if="isEmptyObject(client) && show == 0"
				icon="https://res-oss.elist.com.cn/wxImg/order/empty.svg"
				iconSize="400rpx"
				text="暂无好友~"
				mode="search"
				margin-top="200"
			></u-empty>
			<view class="" :style="{ display: show != 0 ? 'none' : 'block' }">
				<view v-for="(item, index) in client" :key="index" @click="particulars(item, true)" style="border-bottom: 1px solid #f4f4f4">
					<view class="ml20 mt15" style="width: 110vw">
						<u-collapse :border="false">
							<view class="flex-col justify-center items-baseline" style="height: 80rpx" :style="{ color: ifZX(index) ? 'red' : 'black' }">
								{{ getCompanyName(item) }}
								<!-- {{ifCm(index)}} -->
								<!-- {{ifZX(index)?index.replace("zx-'",''):ifCm(index)?ifCmStr(index):index}} -->
							</view>
						</u-collapse>
					</view>
				</view>
			</view>
		</view>

		<view
			:style="{ display: show != 1 ? 'none' : 'block' }"
			class="vw100 pd30"
			style="position: fixed; bottom: 0rpx; height: 100rpx; background-color: #01bb74; z-index: 999; align-items: center; border-radius: 12rpx 12rpx 0rpx 0rpx; opacity: 1"
		>
			<view class="" style="float: right; color: white">
				合计欠款：
				<text class="ft39 ft-bold">￥{{ formatAmount(all) }}</text>
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
					name: '客户列表'
				},
				{
					name: '销售列表'
				}
			],
			current: 0,
			currents: 0,
			scrollTop: 0,
			indexList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
			listO: {},
			listOCopy: {},
			show: 1,
			client: {},
			clientCopy: {},
			all: 0,
			showSF: false,
			sm: '',
			role: 0,
			showChecked: false,
			heig: '20vh',
			searchValue: '',
			SearchCustomStyle: {
				width: '80%',
				height: '60rpx',
				padding: '12rpx',
				fontSize: '24rpx',
				color: '#ffffff'
			},
			SearchCustomStyleWechat: {
				width: '80%',
				height: '60rpx',
				padding: '12rpx',
				fontSize: '24rpx',
				color: '#01BB74'
			},
			identity: false,
			title: ''
		};
	},
	onShow() {
		this.loadData();
	},
	onLoad() {
		var ifWorkPort = this.pinia_userRole == 'R';
		if (ifWorkPort) {
			this.list[0].name = '供应商列表';
			this.list[1].name = '供应列表';
			uni.setNavigationBarTitle({
				title: '供应商'
			});
			this.title = '供应商';
		} else {
			uni.setNavigationBarTitle({
				title: '客户'
			});
			this.list[0].name = '客户列表';
			this.list[1].name = '销售列表';
			this.title = '客户';
		}

		var identity = this.pinia_user.data.work == '1' ? this.pinia_user.workData.identity != 4 : true;
		this.identity = identity;

		var that = this;
		setTimeout(function () {
			that.currents = 1;
		}, 500);
	},
	onShareAppMessage(ops) {
		if (ops.from === 'button') {
			var phone = this.pinia_user.data.work == '0' ? this.pinia_user.phone : this.pinia_user.workData.bossNumber;
			return {
				title: `您有一个好友邀请~`,
				path: '/pages/subMessage/friend_apply_for/shareFriend?phone=' + phone,
				imageUrl: 'https://res-oss.elist.com.cn/wxImg/message/share.png'
			};
		}
	},
	methods: {
		headimg() {
			return uni.getStorageSync('wzc_img');
		},
		establish() {
			console.log('establish');
			uni.navigateTo({
				url: '/pages/subIndex/establish/establish'
			});
		},
		jumpVideo() {
			var port = this.pinia_userRole == 'D';
			this.$openVideo(port ? 5 : 6);
		},
		collection(item2) {
			var dx = {
				company: item2.company,
				phone: item2.phone
			};
			if (this.pinia_userRole == 'D') {
				uni.navigateTo({
					url: '/pages/subStatistics/receipt/receipt?tid=开收款单&searchData=' + JSON.stringify(dx)
				});
			} else {
				uni.navigateTo({
					url: '/pages/subStatistics/receipt/receipt?tid=开付款单&searchData=' + JSON.stringify(dx)
				});
			}
		},
		particulars(particulars, type) {
			if (type) {
				console.log('===particulars===>', particulars);
				var boss = particulars.filter((res) => res.identity == '0');
				console.log(boss[0].staffNumber.includes('zx'));
				if (!boss[0].staffNumber.includes('zx')) {
					uni.navigateTo({
						url: '/pages/subIndex/details/details?phone=' + boss[0].staffNumber + '&select=' + boss[0].state + '&&type=' + type
					});
				} else {
					this.$u.toast('该用户已经注销~');
				}
			} else {
				if (particulars.img == 'zx') {
					this.$u.toast('该用户已经注销~');
					return;
				}

				var state = particulars.img == 'wzc' || particulars.img == undefined ? '9' : '0';

				// if (particulars.img == undefined) {
				// 	this.$u.toast("该人员未注册~");
				// 	return;
				// }
				console.log('===particulars.img===>', state);
				console.log('===particulars===>', particulars);
				uni.navigateTo({
					url: '/pages/subIndex/details/details?phone=' + particulars.phone + '&select=' + state + '&&type=' + type
				});
			}
		},
		isEmptyObject(obj) {
			return Object.keys(obj).length === 0;
		},
		ifZX(val) {
			// console.log("购买十名非常：", val);
			return val.includes('zx-');
		},
		getCompanyName(item) {
			var boss = item.filter((res) => res.identity == '0');
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
					that.sm = json;
					that.showSF = true;
					that.showAl = false;
					// that.addFriend(json);
				},
				fail: (err) => {
					console.error('扫码失败:', err);
					this.$u.toast('扫码失败~');
				}
			});
		},
		addFriend(json) {
			var addPhone = json.phone;
			var phone = this.pinia_user.phone;
			var work = this.pinia_user.data.work == '1';
			var img = this.pinia_user.data.headPortrait;
			var aName = this.pinia_user.data.nickName || phone;
			var identy = '';
			var aBossNumber = phone;

			if (addPhone == phone) {
				this.showSF = false;
				this.$u.toast('请勿添加自己~');
				return;
			}

			if (work) {
				identy = this.pinia_user.workData.identity;
				aBossNumber = this.pinia_user.workData.bossNumber;
				if (aBossNumber == phone) {
					this.showSF = false;
					this.$u.toast('请勿添加自己老板~');
					return;
				}

				var boss = this.pinia_user.workData.bossNumber;
				if (boss == dx.aBossNumber) {
					this.showSF = false;
					this.$u.toast('请勿添加自己老板~');
					return;
				}
			}

			var dx = {
				aNumber: phone,
				aBossNumber: aBossNumber,
				bBossNumber: '',
				aJobBumber: '',
				bNumber: '',
				aImg: img,
				bImg: '',
				state: '0',
				aName: '',
				port: '',
				aCompany: ''
			};

			uni.$api.user
				.searchUser({
					phone: addPhone
				})
				.then((res) => {
					console.log('(检索添加人)： ', JSON.stringify(res.data.data.map));
					var addUser = res.data.data;
					var bossAdd = addPhone;

					if (addUser.map.boss !== undefined) {
						bossAdd = addUser.map.boss;
					}
					var bImg = addUser.headPortrait;

					if (bossAdd == phone) {
						this.showSF = false;
						this.$u.toast('请勿添加自己~');
						return;
					}

					dx.bImg = bImg;
					dx.bNumber = addPhone;
					dx.bBossNumber = bossAdd;

					dx.port = this.role == 1 ? 'R' : 'D';

					uni.$api.user.addClient(dx).then((res) => {
						console.log('添加申请： ' + res.data.data);
						var resAddFriend = res.data;
						this.addResAlert(resAddFriend);
					});
				});
		},
		addResAlert(data) {
			this.$u.toast(data.message);
			this.showSF = false;
		},
		search(e) {
			this.searchValue = e;
			this.listO = this.listOCopy;
			this.client = this.clientCopy;
			if (this.show == '1') {
				var list = this.listO.filter((res) => res.company.includes(e));

				this.listO = list;

				var sum = 0;
				for (let key in list) {
					sum = sum + list[key].total;
				}

				this.all = sum;
			} else {
				var dx = this.client;
				let filteredKeys = Object.keys(dx).filter((key) => key.includes(e));
				let filteredObj = {};
				filteredKeys.forEach((key) => {
					filteredObj[key] = dx[key];
				});
				this.client = filteredObj;
			}
		},
		loadData() {
			var that = this;
			var phone = this.pinia_work == 'Y' ? this.pinia_user.workData.bossNumber : this.pinia_user.phone;
			var port = this.pinia_userRole == 'R' ? '1' : '0';

			uni.$api.order
				.getDeliveryList({
					sBossNumber: phone,
					eBossNumber: phone,
					port: port
				})
				.then((res) => {
					that.client = res.data.data;
					this.clientCopy = res.data.data;
				});

			var ifWorkPort = this.pinia_userRole == 'R';
			var ifwork = this.pinia_user.data.work == '0';

			var dx = {
				bossNumberS: '',
				bossNumberE: '',
				staffNumberS: '',
				staffNumberE: ''
			};
			if (ifWorkPort) {
				console.log('收货端');
				if (ifwork) {
					console.log('收货端 没工作');
					dx.bossNumberE = this.pinia_user.phone;
				} else {
					console.log('收货端 有工作');
					var identity = this.pinia_user.workData.identity == '4';
					if (identity) {
						console.log('收货端 有工作 员工');
						var boss = this.pinia_user.workData.bossNumber;
						dx.bossNumberE = boss;
						dx.staffNumberE = this.pinia_user.phone;
					} else {
						console.log('收货端 有工作 其他');
						var boss = this.pinia_user.workData.bossNumber;
						dx.bossNumberE = boss;
					}
				}
			} else {
				console.log('发货端');
				if (ifwork) {
					console.log('发货端 没工作');
					dx.bossNumberS = this.pinia_user.phone;
				} else {
					console.log('发货端 有工作');
					var identity = this.pinia_user.workData.identity == '4';
					if (identity) {
						console.log('发货端 有工作 员工');
						var boss = this.pinia_user.workData.bossNumber;
						dx.bossNumberS = boss;
						dx.staffNumberS = this.pinia_user.phone;
					} else {
						console.log('发货端 有工作 其他');
						var boss = this.pinia_user.workData.bossNumber;
						dx.bossNumberS = boss;
					}
				}
			}

			uni.$api.order.getMarketOrders(dx).then((res) => {
				console.log('edo/order/market', res.data.data);
				that.listO = res.data.data;
				that.listOCopy = res.data.data;

				this.all = Object.values(this.listO)
					.reduce((acc, item) => acc + Number(item.total), 0)
					.toFixed(2);
				this.all = Number(this.all); // 可选，如果你希望是数字
			});
		},
		change(item) {
			this.currents = item.index;
			this.show = item.index;
			this.searchValue = '';
			this.listO = this.listOCopy;
			this.client = this.clientCopy;
		},
		jump(e, item) {}
	}
};
</script>
<style lang="scss" scoped>
.list-cell {
	display: flex;
	box-sizing: border-box;
	width: 100%;
	padding: 20rpx 24rpx;
	overflow: hidden;
	color: #323233;
	font-size: 28rpx;
	line-height: 48rpx;
	background-color: #fff;
}

.anchor-text {
	color: red;
}

.custom-style {
	// width: 13%;
	border-radius: 24rpx;
	text-align: center;
}
</style>
