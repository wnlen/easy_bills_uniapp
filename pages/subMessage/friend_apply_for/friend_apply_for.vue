<template>
	<view>
		<view class="ml24 mr24" style="height: 10vh; width: 93vw; border-radius: 6px; align-items: center" v-show="SHOW == 0">
			<u-swipe-action v-for="(item, index) in resApiO" :key="index" v-show="SHOW == 0">
				<u-swipe-action-item :show="item.show" :name="index" @click="delclick(item)" :options="options">
					<view style="width: 96vw" class="flex-row u-border-bottom mt20 pd15">
						<u-image :src="item.aImg || defaultImg" shape="circle" width="50px" height="50px"></u-image>
						<view class="flex-col justify-center ml26" style="height: 70px; width: 40%">
							<text class="title mb8" style="font-size: 32rpx">{{ item.aName || item.aNumber }}</text>
							<text class="title" style="font-size: 27rpx; color: #999999; letter-spacing: 1rpx">申请成为您的{{ item.port == 'D' ? '供应商' : '客户' }}</text>
						</view>
						<view class="flex-col justify-evenly items-end" style="height: 70px; width: 40%">
							<view class="flex-col relative items-end" style="height: 100%">
								<view class="mt20" style="color: #d8d8d8; font-size: 12px">
									<text>{{ $u.timeFormat(item.createTime, 'yyyy-mm-dd hh:MM:ss') }}</text>
								</view>
								<view class="absolute flex-row justify-center items-center" style="bottom: 10px; right: 0">
									<view
										v-if="item.state == 0"
										@click="getPhoneNumber(item)"
										class="flex-row justify-center items-center"
										style="background-color: #e5f8f1; border-radius: 396px; width: 60px; height: 25px; font-size: 12px; color: #01bb74"
									>
										同意
									</view>
									<!-- <button plain v-if="item.state==0" :style="{display:state==0?'none':'block'}"
									class="items-center flex-col justify-left" @click="getPhoneNumber(item)"
									style="background-color: #E5F8F1;border-radius: 396px;width: 60px;height: 30.43px;font-size: 12px;color: #01BB74;">
									同意
								</button>
								<button v-if="item.state==1" :style="{display:state==1?'none':'block'}"
									class="ml10 items-center flex-col justify-left"
									style="width: 65px;height: 30.43px;font-size: 12px;color: #E5F8F1;background-color:  #01BB74;border:none;">已同意</button> -->
								</view>
							</view>
						</view>
					</view>
				</u-swipe-action-item>
			</u-swipe-action>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			phone: '',
			applyFriendList: [],
			resApiO: [],
			resApiT: [],
			defaultImg: '/static/img/obj/defind.svg',
			SHOW: 0,
			customStyle: {
				width: '40px',
				height: '20px',
				backgroundColor: '#E5F8F1',
				color: '#01BB74',
				borderRadius: '233px',
				fontSize: '12px',
				border: '0'
			},
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#ff6e55'
					}
				}
			]
		};
	},
	onShow() {
		this.getApply();
	},
	methods: {
		getApply() {
			this.loadDataHY();
			this.SHOW = 0;
			console.log('好友');
		},
		delclick(item) {
			console.log('删除2', item);
			uni.$api.user
				.deleteClient(item)
				.then((res) => {
					console.log('(删除好友邀请结果)', res.data.data);
					if (res.data.data == '1') {
						this.$u.toast('删除成功');
						this.getApply();
						var that = this;
						setTimeout(function () {
							let result = that.resApiO.length == 0;
							if (result) {
								uni.navigateBack();
							}
						}, 500);
					}
				})
				.catch((res) => {
					this.$u.toast('删除异常，请检查您的网络情况');
				});
		},
		open2(index) {
			// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
			// 原本为'false'，再次设置为'false'会无效
			this.resApiO[index].show = true;
			this.resApiO.map((val, idx) => {
				if (index != idx) this.resApiO[idx].show = false;
			});
		},
		loadDataHY() {
			let that = this;
			uni.$api.user
				.getClientList({
					bNumber: this.pinia_user.phone,
					bBossNumber: this.pinia_user.data.work === '1' ? this.pinia_user.workData.bossNumber : this.pinia_user.phone,
					state: '0'
				})
				.then((res) => {
					this.resApiO = res.data.data.map((obj) => ({
						...obj,
						show: false
					}));
					console.log(this.resApiO);
				})
				.catch((res) => {
					that.$u.toast(that.message);
				});
		},
		getIcon(listPhone, listState) {},
		getPhoneNumber(s) {
			let that = this;
			let item = s;
			uni.$api.client
				.enableClient(item)
				.then((res) => {
					console.log('同意好友申请：', res.data.data);
					var resInt = res.data.data;
					if (resInt == '1') {
						that.$u.toast('添加成功');
					} else if (resInt == '441') {
						that.$u.toast('已经是好友关系');
					} else {
						that.$u.toast('添加失败');
					}
					that.loadDataHY();
					that.flushDBSX(this.pinia_user.phone);

					setTimeout(function () {
						let result = that.resApiO.length == 0;
						if (result) {
							uni.navigateBack();
						}
					}, 500);
				})
				.catch((res) => {
					that.$u.toast(that.message);
				});
		},
		flushDBSX(val) {
			var count = Number(this.$u.getPinia('global.tabbar.2.count'));
			this.$u.setPinia({
				global: {
					tabbar: [
						{},
						{},
						{
							count: num - 1
						}
					]
				}
			});
			if (count < 0) {
				this.$u.setPinia({
					global: {
						tabbar: [
							{},
							{},
							{
								count: 0
							}
						]
					}
				});
			}

			var list = [val];
			uni.$api.task
				.startRWFlow({ list: list })
				.then((res) => {
					console.log('请求结果：' + res);
				})
				.catch((res) => {});
		}
	}
};
</script>

<style>
button[plain] {
	border: 0;
}
</style>
