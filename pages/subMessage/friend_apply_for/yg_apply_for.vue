<template>
	<view>
		<view class="ml24 mr24 mt20 swipeBox" v-for="(item2, index2) in resApiT" :key="index2" v-show="SHOW == 1">
			<u-swipe-action>
				<u-swipe-action-item :show="item2.show" :name="index2" @click="delclick(item2, index2)" :options="options">
					<view style="width: 96vw; height: 80px" class="flex-row items-center u-border-bottom pd15">
						<u-image :src="item2.img || defaultImg" shape="circle" width="50px" height="50px"></u-image>
						<view class="flex-col justify-center ml26" style="height: 100%; width: 40%">
							<text class="title mb8" style="font-size: 32rpx">{{ item2.aName || item2.aUser }}</text>
							<view class="title" style="font-size: 27rpx; color: #999999; letter-spacing: 1rpx">
								邀请您成为{{ item2.ifType == '0' ? '主账号' : item2.ifType == '1' ? '合伙人' : item2.ifType == '3' ? '财务' : '员工' }}
							</view>
						</view>
						<view class="flex-col justify-evenly items-end" style="height: 70px; width: 40%">
							<view class="flex-col relative items-end" style="height: 100%">
								<view class="mt20" style="color: #d8d8d8; font-size: 12px">
									<text>{{ $u.timeFormat(item2.createTime, 'yyyy-mm-dd hh:MM:ss') }}</text>
								</view>
								<view class="absolute flex-row justify-center items-center" style="bottom: 8px; right: 0">
									<!-- <button plain v-if="item2.state==0" :style="{display:state==0?'none':'block'}"
									class="flex-row justify-center items-center" @click="getPhoneNumberT(item2)"
									style="background-color: #E5F8F1;border-radius: 396px;width: 60px;height: 25px;font-size: 12px;color: #01BB74;">
									同意
								</button> -->
									<view
										v-if="item2.state == 0"
										@click="getPhoneNumberT(item2)"
										class="flex-row justify-center items-center"
										style="background-color: #e5f8f1; border-radius: 396px; width: 60px; height: 25px; font-size: 12px; color: #01bb74"
									>
										同意
									</view>
									<!-- <button v-if="item2.state==1" :style="{display:state==1?'none':'block'}"
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
						backgroundColor: '#ff6e55',
						borderRadius: '0 10rpx 10rpx 0',
						height: '100%',
						padding: '0 15px'
					}
				}
			],
			ClickSafe: true
		};
	},
	onShow() {
		this.getApply();
	},
	methods: {
		getApply() {
			this.loadDataYG();
			this.SHOW = 1;
		},
		delclick(item, index) {
			this.resApiT[index].show = false;
			uni.$api.user
				.deleteRelationApply(item)
				.then((res) => {
					if (res.data.data == '1') {
						this.getApply();
						this.flushDBSX(this.pinia_user.phone);
						this.$u.toast('删除成功');
						var that = this;

						setTimeout(function () {
							let result = that.resApiT.length == 0;
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
		open1(index) {
			this.resApiT[index].show = true;
			this.resApiT.map((val, idx) => {
				if (index != idx) this.resApiT[idx].show = false;
			});
		},
		loadDataYG() {
			let that = this;
			var dx = {
				bUser: this.pinia_user.phone,
				state: '0'
			};

			uni.$api.bills.getApplyList(dx).then((res) => {
				this.resApiT = res.data.data.map((obj) => ({
					...obj,
					show: false
				}));

				this.ClickSafe = true;
			});
		},
		getIcon(listPhone, listState) {},
		getPhoneNumberT(item) {
			//判断是否有单据 待签收 已签收
			//判断是否有待办
			if (this.ClickSafe) {
				this.ClickSafe = false;
				var dx = {
					aUser: item.aUser,
					bUser: item.bUser,
					workNumber: item.workNumber,
					state: '1',
					ifType: item.ifType
				};

				uni.$api.bills
					.confirmApply(JSON.parse(JSON.stringify(dx)))
					.then((res) => {
						if (res.data.data == 1) {
							this.loadDataYG();
							this.flushDBSX(dx, res.data.message);
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

						this.$u.toast(res.data.message);

						var that = this;

						setTimeout(function () {
							let result = that.resApiT.length == 0;
							if (result) {
								uni.navigateBack();
							}
						}, 800);
					})
					.catch((res) => {
						// that.$u.toast("登陆异常 请重新登录")
						this.$u.toast('添加失败');
						this.ClickSafe = true;
					});
			} else {
				this.$u.toast('请勿重复~');
			}
		},
		flushDBSX(dx, mes) {
			var count = Number(this.$u.getPinia('global.tabbar.2.count'));
			this.$u.setPinia({
				global: {
					tabbar: [
						{},
						{},
						{
							count: count - 1
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

			var list = [];
			list.push(dx.aUser);
			list.push(dx.bUser);
			uni.$api.task
				.startRWFlow({ list: list })
				.then((res) => {
					// this.$u.toast(mes);
				})
				.catch((res) => {});
		}
	}
};
</script>

<style scoped>
button[plain] {
	border: 0;
}

.title {
	font-size: 32rpx;
}
</style>
