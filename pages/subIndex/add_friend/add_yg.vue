<template>
	<view class="bg-gray vh100 vw100" style="overflow: hidden">
		<view class="ml24 mr24 u-search" style="padding-top: 20rpx">
			<up-input
				prefixIcon="search"
				prefixIconStyle="font-size: 22px;color: #01bb74"
				type="number"
				:showAction="false"
				:clearable="true"
				:focus="true"
				placeholder="请输入电话号码"
				@change="(e) => SearchFriend(e)"
				maxlength="11"
				shape="square"
				height="90rpx"
				bgColor="#ffffff"
				:modelValue="searchNumber"
				border="surround"
				:customStyle="customStyle"
			></up-input>
		</view>
		<view class="vw100" style="height: 80vh">
			<view
				v-for="(item, index) in searchUser"
				:key="index"
				class="card ml24 mr24 bg-white flex-row justify-left items-center"
				style="height: 10vh; width: 93vw; margin-top: 2vh; border-radius: 6px"
			>
				<view class="flex-col justify-center items-center ml20" style="width: 13vw">
					<u-image width="90rpx" height="90rpx" shape="circle" :src="item.headPortrait || defaultImg"></u-image>
				</view>
				<view class="ml10 flex-col justify-left items-baseline flex-1">
					<view class="flex-row items-center">
						<text class="ml5" style="color: #01bb74">{{ item.phoneNumber }}</text>
						<text class="ml10" style="">{{ userName(item.name) || '用户' }}</text>
					</view>
					<view v-show="item.map != '' && item.map.boss" class="flex-row justify-start items-center" style="width: 60vw; font-size: 12px; height: 50%">
						<!-- <u-icon name="https://res-oss.elist.com.cn/wxImg/user/yrz-s.svg" width="200rpx" height="20rpx"></u-icon> -->
						<image src="https://res-oss.elist.com.cn/wxImg/user/yrz-s.svg" style="width: 100rpx" mode="widthFix"></image>
						<text class="ml10" style="color: #333333">
							{{ item.map.enterpriseName != undefined ? item.map.enterpriseName : '该用户已进入其他账户' }}
						</text>
					</view>
				</view>
				<view class="mr20">
					<button
						:style="{ display: state == 0 ? 'none' : 'block' }"
						v-if="(item.work == '0' && item.work != '1') || !showYQZ"
						class="items-center flex-col justify-left"
						@click="addFriend(item.phoneNumber, item.headPortrait)"
						style="background-color: #01bb74; border-radius: 396px; width: 110rpx; height: 50rpx; font-size: 12px; color: white; line-height: 50rpx"
					>
						添加
					</button>
					<view v-if="showYQZ" style="width: 110rpx; color: #01bb74" class="flex-row justify-center ft26">邀请中</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			customStyle: {
				backgroundColor: '#fff'
			},
			showYQZ: false,
			state: 1,
			searchNumber: '',
			searchUser: [],
			defaultImg: '/static/img/obj/defind.svg',
			phone: '',
			spply: {
				aNumber: '',
				aCompany: '',
				aBossNumber: '',
				aName: '',
				aJobNumber: '',
				bNumber: '',
				aImg: '',
				bImg: '',
				state: 0,
				port: ''
			},
			addstaff: uni.getStorageSync('addstaff'),
			showSF: false,
			checked: '供应商',
			showChecked: false,
			heig: '20vh',
			role: 0,
			sm: ''
		};
	},
	onShow() {},
	onLoad() {
		this.loadData();
	},

	onUnload() {
		uni.removeStorageSync('invite');
		uni.removeStorageSync('addstaff');
	},
	methods: {
		showToast(text, type) {
			this.$refs.uToast.show({
				title: text,
				type: type
			});
		},
		addFriend(e, img) {
			var invite = uni.getStorageSync('invite');
			console.log('invite不为空执行添员工:', invite);
			this.addFriendYG(e, img, invite);
			this.state = 0;
		},
		addFriendYG(e, img, invite) {
			var work = this.searchUser[0].work == '1';
			if (work) {
				this.$u.toast('该人员已经加入其他公司~');
				return;
			}

			if (e == this.pinia_user.phone) {
				this.$u.toast('请勿添加自己~');
			} else {
				var yg = {
					aUser: this.pinia_user.phone,
					bUser: e,
					aName: this.pinia_user.data.name,
					workNumber: '',
					ifType: invite,
					img: this.pinia_user.data.headPortrait
				};

				if (this.addstaff != '') {
					var json = JSON.parse(this.addstaff);
					yg.workNumber = json.jobNumber;
					uni.removeStorageSync('addstaff');
				}

				console.log(yg);
				uni.$api.bills.addApply(JSON.stringify(yg)).then((res) => {
					console.log(res.data.data);

					if (res.data.data == 1) {
						this.showYQZ = true;
						this.flushDBSX(yg.bUser);
					}

					this.$u.toast(res.data.message);
				});
			}
		},
		loadData() {},
		SearchFriend(phone) {
			console.log('干啊啊啊啊', phone);
			this.showYQZ = false;
			this.state = 1;
			this.searchUser = [];

			var that = this;
			if (phone.length == 11) {
				const ok = uni.$u.test.mobile(phone);
				if (!ok) return uni.$u.toast('手机号格式不正确');
				uni.$api.user
					.searchUser({
						phone: String(phone),
						boss: '',
						port: this.pinia_userRole
					})
					.then((res) => {
						console.log('更具电话号码检索： ', res.data);

						try {
							if (res.data.data.phone != '') {
								that.searchUser.push(res.data.data);
							}
						} catch {
							this.$u.toast('没有该用户');
						}

						console.log(that.searchUser);
					});
			}
		},
		flushDBSX(val) {
			var list = [val];
			uni.$api.task
				.startRWFlow({ list: list })
				.then((res) => {
					console.log('请求结果：' + res);
				})
				.catch((res) => {});
		},
		postGetFriend(phone, my) {
			console.log('验证：', phone, my);
		},
		userName(str) {
			if (str.length > 7) {
				return str.slice(0, 7) + '...';
			} else {
				return str;
			}
		}
	}
};
</script>

<style></style>
