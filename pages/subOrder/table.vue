<template>
	<view class="" style="width: 100%; height: 100vh; overflow-x: hidden">
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
						<up-icon v-if="!showChecked" name="arrow-down-fill" color="#000000" size="15rpx"></up-icon>
						<up-icon v-if="showChecked" name="arrow-up-fill" color="#000000" size="15rpx"></up-icon>
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
							<up-icon name="https://res-oss.elist.com.cn/wxImg/code/check.svg" size="28rpx"></up-icon>
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
							<up-icon name="https://res-oss.elist.com.cn/wxImg/code/check.svg" size="28rpx"></up-icon>
						</view>
					</view>
				</view>
			</div>
		</up-overlay>

		<view class="flex-row" style="width: 100%; display: flex">
			<view class="ml5 mr5" style="flex: 1">
				<up-button openType="share" color="#01BB74" :customStyle="SearchCustomStyleWechat" shape="circle" :plain="true">
					<view class="pr10"><up-icon name="weixin-fill" color="#01BB74" size="30rpx"></up-icon></view>
					微信邀请
				</up-button>
			</view>
			<!-- <view class="ml5 mr5" style="flex: 1">
				<up-button :customStyle="SearchCustomStyle"  shape="circle"
					@click="goPath('/pages/subIndex/add_friend/add_friend')">
					<view class=></view><up-icon  "pr10" name="phone-fill" color="#ffffff" size="30rpx"></up-icon>
					手机号邀请
				</up-button>
			</view> -->
			<view class="ml5 mr5" style="flex: 1">
				<up-button :customStyle="SearchCustomStyle" color="#FFAF38" shape="circle" @click="establish">
					<view class="pr10">
						<up-icon name="plus" color="#ffffff" size="30rpx"></up-icon>
					</view>
					创建{{ pinia_userRole == 'D' ? '客户' : '供应商' }}
				</up-button>
			</view>
		</view>
		<view class="anchorText">
			<view class="SearchTablePage">
				<view class="SearchTablePageIcon">
					<up-icon name="search" color="#01BB74" size="40rpx"></up-icon>
				</view>
				<view class="SearchTablePageInput">
					<uv-input placeholder="请输入关键字进行查找" border="none" @change="search"></uv-input>
				</view>
			</view>
		</view>
		<!-- borderBottom: item.length > 1 && index2 != item.length ? '1px solid #f4f4f4' : '' -->
		<up-empty
			v-if="isEmptyObject(client)"
			icon="https://res-oss.elist.com.cn/wxImg/order/empty.svg"
			iconSize="200rpx"
			:text="pinia_userRole == 'D' ? '客户空空如也~快尝试创建一个新客户吧！' : '供应商空空如也~邀请供应商一起开单吧！'"
			mode="search"
			marginTop="200rpx"
		>
			<up-button
				v-if="pinia_userRole == 'D'"
				color="#01BB74"
				iconColor="#ECFFF9"
				:customStyle="{ width: '300rpx', height: '80rpx', fontSize: '32rpx', marginTop: '76rpx', background: '#ECFFF9' }"
				shape="circle"
				:plain="true"
				@click="establish"
			>
				<text>去创建</text>
			</up-button>
			<up-button
				v-else
				openType="share"
				color="#01BB74"
				iconColor="#ECFFF9"
				:customStyle="{ width: '300rpx', height: '80rpx', fontSize: '32rpx', marginTop: '76rpx', background: '#ECFFF9' }"
				shape="circle"
				:plain="true"
			>
				<text>去邀请</text>
			</up-button>
		</up-empty>
		<view v-for="(item, index) in client" :key="index">
			<view class="ml20 mr20" v-show="show == 1" style="border-bottom: 1px solid #f4f4f4">
				<up-collapse :border="false">
					<up-collapse-item v-if="!ifZX(index)" :border="false">
						<template #right-icon></template>
						<template #title>
							<view class="" style="font-weight: 500">
								{{ getCompanyName(item) }}
							</view>
						</template>
						<view
							v-for="(item2, index2) in item"
							:key="index2"
							style="padding: 20rpx 0 20rpx 48rpx"
							class="anchor-text"
							:style="{ color: item.state == '2' ? '#FA5151' : '#333333', borderTop: index2 == 0 ? '' : '1px solid #f4f4f4' }"
						>
							<view
								class="flex-row items-center"
								style="color: black"
								:style="{
									color: item2.identity == '3' ? '#999' : '#333'
								}"
								@click="jump(index, item2, item)"
							>
								<text>{{ item2.name || item2.staffNumber }}</text>
								<view
									class="custom-style ml10"
									:style="{
										backgroundColor: item2.identity == '0' ? '#648AFF' : item2.identity == '1' ? '#FF8C8C' : '#FFE387',
										color: '#ffffff',
										width: item2.identity == '1' || item2.identity == '0' ? '100rpx' : '80rpx'
									}"
								>
									{{ item2.identity == '0' ? '主账号' : item2.identity == '1' ? '合伙人' : item2.identity == '3' ? '财务' : '员工' }}
								</view>
							</view>
						</view>
					</up-collapse-item>
				</up-collapse>
			</view>
			<view class="ml20" v-show="show == 0" style="width: 110vw">
				<view @click="jumpShow(item)" style="width: 85%; padding-top: 20rpx; padding-bottom: 20rpx" class="anchor-text ml24">
					<view class="" style="display: flex; flex-direction: row; padding-top: 10rpx; color: black">
						{{ ifZX(index) ? index.replace("zx-'", '') : getCompanyName(item) }}
					</view>
				</view>
			</view>
		</view>
		<!-- 第一次添加成功客户提示 -->
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
					<up-image src="https://res-oss.elist.com.cn/wxImg/list/customerTip.svg" width="540rpx" height="584rpx"></up-image>
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
			client: {},
			scrollTop: 0,
			indexList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
			scanResult: '',
			showAl: false,
			show: 1,
			spply: {
				aNumber: '',
				aCompany: '',
				aBossNumber: '',
				aName: '',
				aJobNumber: '',
				bNumber: '',
				aImg: '',
				bImg: '',
				state: 0
			},
			clientCopy: {},
			showSF: false,
			checked: '供应商',
			showChecked: false,
			heig: '20vh',
			role: 0,
			sm: '',
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
			}
		};
	},
	onLoad(option) {
		console.log('option.show:', option.show);
		this.show = option.show ? option.show : 1;
	},
	onShow() {
		if (this.pinia_userRole == 'R') {
			uni.setNavigationBarTitle({
				title: '供应商列表'
			});
		}
		this.loadData();
	},
	onShareAppMessage(ops) {
		let title = '',
			imageUrl = '';
		if (this.pinia_userRole == 'D') {
			title = '邀请您成为他的客户~';
			imageUrl = 'https://res-oss.elist.com.cn/wxImg/message/shareD.png';
		} else {
			title = '邀请您成为他的供应商~';
			imageUrl = 'https://res-oss.elist.com.cn/wxImg/message/shareR.png';
		}
		if (ops.from === 'button') {
			var phone = this.pinia_user.data.work == '0' ? this.pinia_user.phone : this.pinia_user.workData.bossNumber;
			return {
				title: title,
				path: '/pages/subMessage/friend_apply_for/shareFriend?phone=' + phone + '&invitationRole=' + this.pinia_userRole,
				imageUrl: imageUrl
				// imageUrl: 'https://res-oss.elist.com.cn/wxImg/message/share.png'
			};
		}
	},
	methods: {
		getCompanyName(item) {
			var boss = item.filter((res) => res.identity == '0');
			var zx = this.ifZX(boss[0].companyName);
			return zx ? boss[0].companyName.replace("zx-'", '') : boss[0].companyName;
		},
		establish() {
			console.log('establish');
			uni.navigateTo({
				url: '/pages/subIndex/establish/establish'
			});
		},
		isEmptyObject(obj) {
			return Object.keys(obj).length === 0;
		},
		ifZX(val) {
			return val.includes('zx-');
		},
		search(e) {
			console.log('输入的关键字: ', e);
			console.log('数据: ', this.client);
			this.client = this.clientCopy;
			var dx = this.client;
			let filteredKeys = Object.keys(dx).filter((key) => key.includes(e));
			let filteredObj = {};
			filteredKeys.forEach((key) => {
				filteredObj[key] = dx[key];
			});
			this.client = filteredObj;
		},
		scanQRcodesAddFriend() {
			//查询该用户信息
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

					// that.addFriend(json);
				},
				fail: (err) => {
					console.error('扫码失败:', err);
					this.$u.toast('扫码失败~');
				}
			});
		},
		loadData() {
			var that = this;
			var port = this.pinia_userRole == 'R' ? '1' : '0';
			var phone = this.pinia_work == 'Y' ? this.pinia_user.workData.bossNumber : this.pinia_user.phone;
			uni.$api.order
				.getDeliveryList({
					sBossNumber: phone,
					eBossNumber: phone,
					port: port
				})
				.then((res) => {
					console.log(res.data.data);
					that.client = res.data.data;
					that.clientCopy = res.data.data;
				});
		},
		jumpShow(item) {
			console.log('item：', item);
			var boss = item.filter((res) => res.identity == '0');
			var zx = this.ifZX(boss[0].companyName);
			var json = {
				company: zx ? boss[0].companyName.replace("zx-'", '') : boss[0].companyName,
				data: item
			};
			console.log('点击了', json);
			uni.setStorageSync('companyNameJSON', JSON.stringify(json));
			uni.navigateBack();
		},
		jump(index, item, list) {
			console.log(index, item);

			var zx = this.ifZX(index);

			var listBoss = list.filter((res) => res.identity == '0');

			item.remarkInbox = listBoss[0].remarkInbox;

			var json = {
				company: listBoss[0].companyName,
				data: item
			};
			if (zx) {
				json = {
					company: zx ? item.companyName.replace("zx-'", '') : item.companyName,
					data: {
						identity: '1'
					}
				};

				uni.setStorageSync('companyNameJSON', JSON.stringify(json));
				uni.navigateBack();
			} else {
				var iden = item.identity == '3';

				if (!iden) {
					console.log('点击了', json);
					uni.setStorageSync('companyNameJSON', JSON.stringify(json));
					uni.navigateBack();
				} else {
					this.$u.toast('不能给财务开单~');
				}
			}
		},
		postGetList(url) {},
		compare(a, b) {
			if (a.length === b.length) {
				return 0;
			} else if (a.length < b.length) {
				return -1;
			} else {
				return 1;
			}
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

					dx.port = this.role == 1 ? 'D' : 'R';

					uni.$api.user.addClient(dx).then.then((res) => {
						console.log('添加申请： ' + res.data.data);
						var resAddFriend = res.data;
						this.addResAlert(resAddFriend);
					});
				});
		},
		addResAlert(data) {
			console.log('tab' + data);
			this.$u.toast(data.message);
			this.showSF = false;
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	}
};
</script>
<style lang="scss" scoped>
::v-deep .u-cell__body {
	padding: 26rpx !important;
}
::v-deep .u-collapse-item__content__text {
	padding: 0 15px !important;
}
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

.anchorText {
	// background-color: #ffaaff;
	height: 7vh;

	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	// margin-left: 24rpx;
	margin-right: 24rpx;

	padding-left: 24rpx;

	.SearchTablePage {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 10rpx 0;
		border-radius: 12.24rpx;
		background: #f4f4f4;

		.SearchTablePageIcon {
			height: 100%;
			width: 10%;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
		}

		.SearchTablePageInput {
			height: 100%;
			width: 90%;
			display: flex;
			flex-direction: row;
			justify-content: left;
		}
	}

	.SearchTablePageADD {
		width: 10%;
		padding-left: 12rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
}

.custom-style {
	// width: 200rpx;
	border-radius: 24rpx;
	text-align: center;
	padding: 4rpx;
	font-size: 24rpx;
}
</style>
