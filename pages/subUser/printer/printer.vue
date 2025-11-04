<template>
	<view class="content pd15 bg-gray">
		<view class="vw100 relative flex-col justify-center items-center" style="height: 30vh; margin-top: 60%" v-if="!allShow && !defShow">
			<up-empty icon="https://res-oss.elist.com.cn/wxImg/vip/print.svg" iconSize="400rpx" text="暂无打印机~" mode="search" margin-top="-200"></up-empty>

			<wd-button @click="buy" :customStyle="{ width: '300rpx', height: '70rpx', fontSize: '30rpx', marginTop: '100rpx', background: '#47506C' }">去购买</wd-button>
		</view>

		<view v-if="defShow" class="cardPrint flex-col justify-center items-start relative mt40" v-for="(item, index) in def" :key="index">
			<view class="ml15 flex-row justify-center items-center">
				<wd-icon name="https://res-oss.elist.com.cn/wxImg/print/print-icon.svg" size="80rpx"></wd-icon>
				<text class="ml15" style="color: #666666; font-size: 14px">默认设备名称：{{ item.name }}</text>
				<view class="ml15" :style="{ backgroundColor: item.online ? '#01BB74' : '#F76565' }" style="width: 5px; height: 5px; border-radius: 45%"></view>
			</view>
			<view class="absolute flex-row justify-center items-center" style="right: 5px" @click="edit(item)">
				<text class="mr20" style="color: #01bb74" v-show="item.online">在线</text>
				<text class="mr20" style="color: #f76565" v-show="!item.online">离线</text>
				<wd-icon name="arrow-right" color="#666666" size="20rpx"></wd-icon>
			</view>
		</view>

		<view v-if="allShow" class="cardPrintList flex-col justify-start items-start relative mt40">
			<view class="ml15 mt25">其他打印机</view>
			<view class="cardPrint flex-col justify-center items-start relative mt20" @click="defUpdate(item)" v-for="(item, index) in all" :key="index">
				<view class="ml15 flex-row justify-center items-center">
					<text class="ml15" style="color: #666666; font-size: 14px">设备名称：{{ item.name }}</text>
				</view>
				<view class="absolute flex-row justify-center items-center" style="right: 5px">
					<text class="mr20" style="color: #01bb74" v-show="item.online">在线</text>
					<text class="mr20" style="color: #f76565" v-show="!item.online">离线</text>
					<wd-icon name="arrow-right" color="#666666" size="20rpx"></wd-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			defShow: false,
			allShow: false,
			infos: {},
			def: [],
			all: []
		};
	},
	onShow() {
		this.getPrinter();
	},
	methods: {
		buy() {
			uni.navigateTo({
				url: '/pages/subUser/printer/particulars'
			});
		},
		showPrint() {
			var def = this.def.length > 0;
			var all = this.all.length > 0;
			console.log(this.all, this.def);
			this.defShow = def ? true : false;
			this.allShow = all ? true : false;
		},
		edit(item) {
			console.log(item);
			uni.navigateTo({
				url: '/pages/subUser/printer/edit?id=' + item.id
			});
		},
		defUpdate(item) {
			console.log(item);

			var ifwork = this.pinia_user.data.work == '0';
			var ifWorkPort = this.pinia_userRole == 'R';

			var phone = this.pinia_user.phone;

			var dx = {
				boss: '',
				staff: '',
				phone: '',
				deviceopenid: item.deviceopenid,
				id: item.id,
				type: '1',
				state: '1'
			};

			if (ifwork) {
				dx.boss = phone;
				dx.staff = phone;
				dx.phone = phone;
			} else {
				var boss = this.pinia_user.workData.bossNumber;
				dx.boss = boss;
				dx.staff = phone;
				dx.phone = boss;
			}

			uni.showModal({
				title: '温馨提醒',
				content: '是否将其设置为默认打印机',
				showCancel: true,
				cancelText: '取消',
				confirmText: '确认',
				confirmColor: '#01bb74',
				success: (res) => {
					console.log(res.confirm);
					if (res.confirm) {
						// printDef
						uni.$api.printer.setDefaultPrinter(dx).then((res) => {
							console.log('打印及设置：', res);
							if (res.data == '1') {
								this.getPrinter();
								uni.showToast({
									title: '操作成功',
									icon: 'success',
									duration: 2000 // 持续时间，单位毫秒，默认为 1500
								});
							} else {
							}
						});
					}
				}
			});
		},
		getPrinter() {
			var ifwork = this.pinia_user.data.work == '0';
			var ifWorkPort = this.pinia_userRole == 'R';

			var phone = this.pinia_user.phone;

			var dx = {
				boss: '',
				staff: '',
				phone: ''
			};

			if (ifwork) {
				dx.boss = phone;
				dx.staff = phone;
				dx.phone = phone;
			} else {
				var boss = this.pinia_user.workData.bossNumber;
				dx.boss = boss;
				dx.staff = phone;
				dx.phone = boss;
			}

			uni.$api.printer.getPrinterList(dx).then((res) => {
				// console.log(res);
				this.def = res.data.def ? res.data.def : [];
				this.all = res.data.all ? res.data.all : [];
				this.showPrint();
				// console.log("默认机器：",this.def);
			});
		}
	}
};
</script>

<style>
.content {
	background-color: #f9f9f9;
	height: 100vh;
	width: 100vw;
	position: fixed;
}

.cardPrint {
	background-color: #ffffff;
	border-radius: 6px;
	width: 92%;
	margin-left: 4%;
	height: 60px;
}

.cardPrintList {
	background-color: #ffffff;
	border-radius: 6px;
	width: 92%;
	margin-left: 4%;
	min-height: 20vh;
}

.cardPrintList .cardPrint {
	background-color: #f9f9f9;
	border-radius: 6px;
	width: 92%;
	margin-left: 4%;
	height: 60px;
}
</style>
