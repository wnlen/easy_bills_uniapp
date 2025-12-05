<template>
	<view>
		<view class="list">
			<text style="color: #fa3534">*</text>
			手机号（与微信手机号一致）
		</view>
		<view class="flex-row justify-center items-center ml24 mr24 mt24 pl20 pr20 pt24 pb24" style="background-color: rgba(244, 244, 244, 0.5); border-radius: 6px">
			<view style="width: 100%">
				<input
					class="input"
					placeholder-class="placeholder_class_establish"
					type="number"
					@input="searchPhoneInput"
					v-model="submitUser.searchPhone"
					style="color: '#333333'"
					maxlength="11"
					placeholder="请输入手机号"
				/>
			</view>
		</view>
		<view class="list">
			{{ user.port == 'D' ? '客户备注' : '供应商备注' }}
		</view>
		<view class="flex-row justify-center items-center ml24 mr24 mt24 pl20 pr20 pt24 pb24" style="background-color: rgba(244, 244, 244, 0.5); border-radius: 6px">
			<view style="width: 100%" v-if="user.port == 'D'">
				<input
					class="input"
					placeholder-class="placeholder_class_establish"
					type="text"
					v-model="submitUser.remarkD"
					style="color: '#333333'"
					placeholder="请输入客户备注"
				/>
			</view>
			<view style="width: 100%; padding-right: 20rpx" v-if="user.port == 'R'">
				<input
					class="input"
					placeholder-class="placeholder_class_establish"
					type="text"
					v-model="submitUser.remarkR"
					style="color: '#333333'"
					placeholder="请输入供应商备注"
				/>
			</view>
		</view>

		<view class="mt60 pl20 pr20 pb30 absolute" style="bottom: 24rpx; width: 100%" v-if="user.port == 'D'">
			<wd-button :customStyle="{ width: '100%' }" @click="establishFriend">创建客户</wd-button>
		</view>
		<view class="mt60 pl20 pr20 pb30 absolute" style="bottom: 24rpx; width: 100%" v-if="user.port == 'R'">
			<wd-button :customStyle="{ width: '100%' }" @click="establishFriend">创建供应商</wd-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			user: {
				work: false,
				port: 'D',
				identity: 0,
				bossNumber: '',
				phone: ''
			},
			placeholderStyle: {
				textAlign: 'right',
				color: '#D8D8D8'
			},
			labelStyle: {
				color: 'red',
				paddingLeft: '12px'
			},
			submitUser: {
				sBossNumber: '',
				eBossNumber: '',
				sourceNumber: '',
				port: '',
				searchPhone: '',
				remarkD: '',
				remarkR: ''
			}
		};
	},
	onShow() {
		this.Init();
	},
	methods: {
		searchPhoneInput(e) {
			this.submitUser.eBossNumber = e.value.value;
			this.remark = e.value.value;
		},
		Init() {
			var ifWorkPort = this.pinia_userRole == 'R';
			if (ifWorkPort) {
				uni.setNavigationBarTitle({
					title: '创建供应商'
				});
				this.title = '供应商';
			} else {
				uni.setNavigationBarTitle({
					title: '创建新客户'
				});
			}
			this.user.work = this.pinia_user.user.work == '0';
			this.user.port = this.pinia_userRole;
			this.submitUser.port = this.pinia_userRole;
			if (!this.user.work) {
				this.user.identity = this.pinia_user.workData.identity;
				this.user.bossNumber = this.pinia_user.workData.bossNumber;
				this.submitUser.sBossNumber = this.pinia_user.workData.bossNumber;
			} else {
				this.user.bossNumber = this.pinia_user.phone;
				this.submitUser.sBossNumber = this.user.bossNumber;
			}
			this.user.phone = this.pinia_user.phone;
		},
		establishFriend() {
			var ver = this.verification();

			if (ver) {
				uni.$api.order.directDelivery(this.submitUser).then((res) => {
					var mes = res.data;
					this.$u.toast(mes.message);
					if (mes.data >= 1) {
						if (this.pinia_userRole == 'D') {
							// 获取上一个页面的值
							// 在当前页面中获取并修改上一页数据
							let pages = getCurrentPages(); // 获取当前页面栈
							let prevPage1 = pages[pages.length - 3];
							if (prevPage1.route != 'pages/subOrder/add') {
								// 获取上一个页面实例
								let prevPage = pages[pages.length - 2];
								if (prevPage.route == 'pages/subOrder/table') {
									if (JSON.stringify(prevPage.$vm.client) == '{}') {
										// 修改上一页的数据
										prevPage.$vm.$set(prevPage.$vm, 'showTip', true);
										// 如果需要强制更新视图（某些特殊情况）
										prevPage.$vm.$forceUpdate();
									}
								} else {
									if (!prevPage.$vm.listO.length) {
										// 修改上一页的数据
										prevPage.$vm.$set(prevPage.$vm, 'showTip', true);
										// 如果需要强制更新视图（某些特殊情况）
										prevPage.$vm.$forceUpdate();
									}
								}
							}
						}
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					}
				});
			}
		},
		verification() {
			var search = this.submitUser.searchPhone;
			var remark = this.user.port == 'D' ? this.submitUser.remarkD : this.submitUser.remarkR;

			if (remark != null && remark != '') {
				remark = remark.trim();
			}

			if (remark != null && remark.length <= 0) {
				remark = null;
			}

			if (search == '' || search == null || search == undefined) {
				this.$u.toast('请输入要添加的手机号码！');
				return false;
			}

			if (remark == '' || remark == null || remark == undefined) {
				this.submitUser.remarkD = null;
				this.submitUser.remarkR = null;
			} else {
				if (remark.length > 14) {
					this.$u.toast('备注最大长度为14！');
					return false;
				}
			}

			if (search.length != 11) {
				this.$u.toast('号码固定位数11位！');
				return false;
			}

			if (this.submitUser.sBossNumber == this.submitUser.searchPhone) {
				this.$u.toast('同一组织请勿添加！');
				return false;
			}

			const regex = /^1[3-9]\d{9}$/;
			var zz = regex.test(search);

			if (!zz) {
				this.$u.toast('请输入11位数字手机号码！');
				return false;
			}

			return true;
		}
	}
};
</script>

<style>
.placeholder_class_establish {
	color: #d8d8d8;
	text-align: left;
}

.input {
	text-align: left;
}

.list {
	margin-left: 30rpx;
	margin-top: 30rpx;
}
</style>
