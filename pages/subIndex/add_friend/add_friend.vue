<template>
	<view class="bg-gray vh100 vw100" style="overflow: hidden">
		<view class="ml24 mr24" style="padding-top: 20px">
			<up-search
				search-icon-color="#01bb74"
				:show-action="false"
				placeholder="请输入电话号码"
				:animation="true"
				@change="SearchFriend"
				@search="SearchFriend"
				maxlength="11"
				shape="square"
				class="u-search"
				height="90rpx"
				bg-color="#ffffff"
				v-model="searchNumber"
			></up-search>
		</view>

		<!-- <up-overlay :show="showSF" @click="showSF = false">
			<div @tap.stop v-if="showSF" class="flex-col justify-center items-center relative" :style="{height:heig}"
				style="background-color: white;position: absolute;width: 75%;height: 20vh;margin-top: 70%;
				         border-radius: 6.87px;margin-left: 46px;">
				<view class="absolute mt45" style="font-size: 16px;top: 0;height: 30px;">
					添加好友
				</view>
				<view class="flex-row text-center justify-center items-center absolute"
					style="width: 100%;height: 40px;top:45px;">
					<view class="flex-col text-center justify-center items-center"
						style="color: #999999;font-size: 16px;">
						申请添加对方为
					</view>
					<view @click="showChecked=(showChecked==true?false:true);!showChecked?(heig='20vh'):(heig='26.7vh')"
						class="ml15 flex-col text-center justify-center items-center"
						style="box-sizing: border-box;border: 0.57px solid #999999;border-radius: 6.87px;width: 79.58px;height: 30.23px;">
						{{role==0?"客户":"供应商"}}
					</view>
					<view class="ml10">
						<wd-icon v-if="!showChecked" name="arrow-down-fill" color="#000000" size="15"></wd-icon>
						<wd-icon v-if="showChecked" name="arrow-up-fill" color="#000000" size="15"></wd-icon>
					</view>
				</view>
				<view v-if="!showChecked" class=" u-border-top flex-row absolute"
					style="width: 100%;height: 52px;bottom: 0;" @tap.stop>
					<view @click="showSF=false;state=0"
						class="onsm u-border-right flex-col text-center justify-center items-cente"
						style="width:50%;height: 100%;">
						取消
					</view>
					<view @click="addFriend(searchUser)" class="oksm flex-col text-center justify-center items-center"
						style="width: 50%;height: 100%;">
						确认
					</view>
				</view>
				<view v-if="showChecked" class="u-border-top flex-col absolute mt20"
					style="width: 100%;height: 100px;bottom: 0;" @tap.stop>
					<view @click="role=0;showChecked=false;heig='20vh'"
						class="flex-row items-center ml36 mt25 pl20 relative"
						style="height: 35px;width: 255px;border-radius: 3px;"
						:style="{backgroundColor:role==0?'#ECFAF4':'#FBFBFB',color:role==0?'#01BB74':'#333333'}">
						<view>
							客户
						</view>
						<view v-if="role==0" class="absolute" style="right: 10px;">
							<wd-icon name="https://res-oss.elist.com.cn/wxImg/code/check.svg" size="28rpx"></wd-icon>
						</view>
					</view>
					<view @click="role=1;showChecked=false;heig='20vh'"
						class="flex-row items-center ml36 mt10 pl20 relative"
						style="height: 35px;width: 255px;border-radius: 3px;"
						:style="{backgroundColor:role==1?'#ECFAF4':'#FBFBFB',color:role==1?'#01BB74':'#333333'}">
						<view>
							供应商
						</view>
						<view v-if="role==1" class="absolute" style="right: 10px;">
							<wd-icon name="https://res-oss.elist.com.cn/wxImg/code/check.svg" size="28rpx"></wd-icon>
						</view>
					</view>
				</view>
			</div>
		</up-overlay> -->

		<!-- <up-overlay :show="showSF" @click="showSF = false">
			<div @tap.stop v-if="showSF" class="flex-col justify-center items-center relative" :style="{height:heig}"
				style="background-color: white;width: 75%;height: 20%vh;margin-top: 70%;
				         border-radius: 6.87px;margin-left: 46px;">
				<view class="absolute mt45" style="font-size: 16px;top: 0;height: 30px;">
					添加好友
				</view>
				<view class="flex-row text-center justify-center items-center absolute"
					style="width: 100%;height: 40px;top:45px;">
					<view class="flex-col text-center justify-center items-center"
						style="color: #999999;font-size: 16px;">
						申请添加对方为
					</view>
					<view @click="showChecked=(showChecked==true?false:true);!showChecked?(heig='20vh'):(heig='26.7vh')"
						class="ml15 flex-col text-center justify-center items-center"
						style="box-sizing: border-box;border: 0.57px solid #999999;border-radius: 6.87px;width: 79.58px;height: 30.23px;">
						{{role==0?"客户":"供应商"}}
					</view>
					<view class="ml10">
						<wd-icon v-if="!showChecked" name="arrow-down-fill" color="#000000" size="15"></wd-icon>
						<wd-icon v-if="showChecked" name="arrow-up-fill" color="#000000" size="15"></wd-icon>
					</view>
				</view>
				<view v-if="!showChecked" class=" u-border-top flex-row absolute"
					style="width: 100%;height: 52px;bottom: 0;" @tap.stop>
					<view @click="showSF=false;state=0"
						class="onsm u-border-right flex-col text-center justify-center items-cente"
						style="width:50%;height: 100%;">
						取消
					</view>
					<view @click="addFriend(searchUser)" class="oksm flex-col text-center justify-center items-center"
						style="width: 50%;height: 100%;">
						确认
					</view>
				</view>
				<view v-if="showChecked" class="u-border-top flex-col absolute mt20"
					style="width: 100%;height: 100px;bottom: 0;" @tap.stop>
					<view @click="role=0;showChecked=false;heig='20vh'"
						class="flex-row items-center ml36 mt25 pl20 relative"
						style="height: 35px;width: 255px;border-radius: 3px;"
						:style="{backgroundColor:role==0?'#ECFAF4':'#FBFBFB',color:role==0?'#01BB74':'#333333'}">
						<view>
							客户
						</view>
						<view v-if="role==0" class="absolute" style="right: 10px;">
							<wd-icon name="https://res-oss.elist.com.cn/wxImg/code/check.svg" size="28rpx"></wd-icon>
						</view>
					</view>
					<view @click="role=1;showChecked=false;heig='20vh'"
						class="flex-row items-center ml36 mt10 pl20 relative"
						style="height: 35px;width: 255px;border-radius: 3px;"
						:style="{backgroundColor:role==1?'#ECFAF4':'#FBFBFB',color:role==1?'#01BB74':'#333333'}">
						<view>
							供应商
						</view>
						<view v-if="role==1" class="absolute" style="right: 10px;">
							<wd-icon name="https://res-oss.elist.com.cn/wxImg/code/check.svg" size="28rpx"></wd-icon>
						</view>
					</view>
				</view>
			</div>
		</up-overlay> -->

		<up-overlay :show="showSF" @click="showSF = false">
			<div
				@tap.stop
				v-if="showSF"
				class="flex-col relative"
				:style="{ height: heig }"
				style="background-color: white; width: 75%; margin-top: 70%; border-radius: 6.87px; margin-left: 46px"
			>
				<view class="flex-col justify-center items-center" style="font-size: 16px; height: 5vh">添加好友</view>

				<view class="flex-row text-center justify-center items-center" style="width: 100%; height: 8vh">
					<view class="flex-col text-center justify-center items-center" style="color: #999999; font-size: 16px">申请添加对方为</view>
					<view
						@click="
							showChecked = showChecked == true ? false : true;
							!showChecked ? (heig = '20vh') : (heig = '29vh');
						"
						class="ml15 flex-col text-center justify-center items-center"
						style="box-sizing: border-box; border: 0.57px solid #999999; border-radius: 6.87px; width: 79.58px; height: 30.23px"
					>
						{{ role == 0 ? '客户' : '供应商' }}
					</view>
					<view class="ml10">
						<albb-icon icon="ydj-tiaojianshaixuanfan2" v-if="!showChecked" size="15" color="#000000"></albb-icon>
						<albb-icon icon="ydj-tiaojianshaixuan2" v-if="showChecked" color="#000000" size="15"></albb-icon>
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
					<view @click="addFriend(searchUser)" class="oksm flex-col text-center justify-center items-center" style="width: 50%; height: 100%">确认</view>
				</view>

				<view v-if="showChecked" class="u-border-top flex-col justify-center items-center" style="width: 100%; height: 16vh" @tap.stop>
					<view
						@click="
							role = 0;
							showChecked = false;
							heig = '20vh';
						"
						class="flex-row items-center pl20 relative"
						style="height: 35px; width: 255px; border-radius: 3px"
						:style="{
							backgroundColor: role == 0 ? '#ECFAF4' : '#FBFBFB',
							color: role == 0 ? '#01BB74' : '#333333'
						}"
					>
						<view>客户</view>
						<view v-if="role == 0" class="absolute" style="right: 10px">
							<wd-icon name="https://res-oss.elist.com.cn/wxImg/code/check.svg" size="28rpx"></wd-icon>
						</view>
					</view>
					<view
						@click="
							role = 1;
							showChecked = false;
							heig = '20vh';
						"
						class="flex-row items-center mt10 pl20 relative"
						style="height: 35px; width: 255px; border-radius: 3px"
						:style="{
							backgroundColor: role == 1 ? '#ECFAF4' : '#FBFBFB',
							color: role == 1 ? '#01BB74' : '#333333'
						}"
					>
						<view>供应商</view>
						<view v-if="role == 1" class="absolute" style="right: 10px">
							<wd-icon name="https://res-oss.elist.com.cn/wxImg/code/check.svg" size="28rpx"></wd-icon>
						</view>
					</view>
				</view>
			</div>
		</up-overlay>

		<view
			v-for="(item, index) in searchUser"
			:key="index"
			class="card ml24 mr24 bg-white flex-row justify-left items-center mt20"
			style="height: 10vh; width: 93vw; border-radius: 6px"
		>
			<view class="flex-col justify-center items-center" style="width: 13vw">
				<up-image class="ml20" width="50px" height="50px" shape="circle" :src="item.headPortrait || defaultImg"></up-image>
			</view>
			<view class="ml10 flex-col justify-center items-baseline" style="width: 60vw; height: 100%">
				<view
					class="flex-row"
					style="height: 50%"
					:style="{
						height: item.map.boss ? '50%' : '100%',
						alignItems: item.map.boss ? 'center' : 'center'
					}"
				>
					<text class="ml5" style="color: #01bb74">{{ item.phoneNumber }}</text>
					<text class="ml10" style="">{{ userName(item.name) || '用户' }}</text>
				</view>
			</view>
			<view class="mr48" style="float: right; width: 10vw">
				<button
					v-if="!showYQZ"
					:style="{ display: state == 1 ? 'none' : 'block' }"
					class="items-center flex-col justify-left pr35"
					@click="add"
					style="background-color: #01bb74; border-radius: 396px; width: 60px; height: 30.43px; font-size: 12px; color: white"
				>
					添加
				</button>
				<view v-if="showYQZ" style="width: 100px; font-size: 13px; color: #01bb74" class="flex-row">申请中</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showYQZ: false,
			state: 0,
			searchNumber: '',
			searchUser: [],
			defaultImg: 'https://res-oss.elist.com.cn/wxImg/obj/defind.svg',
			phone: '',
			addstaff: uni.getStorageSync('addstaff'),
			showSF: false,
			checked: '供应商',
			showChecked: false,
			heig: '20vh',
			role: 0,
			sm: ''
		};
	},
	onShow() {
		var role = this.pinia_userRole == 'R';
		if (role) {
			this.checked = '供应商';
		} else {
			this.checked = '客户';
		}
	},
	onLoad() {},

	onUnload() {},
	methods: {
		showToast(text, type) {
			this.$refs.uToast.show({
				title: text,
				type: type
			});
		},
		add() {
			this.showSF = true;
		},
		addFriend(item) {
			console.log('获取的好友', item[0]);
			item = item[0];

			var addPhone = item.phoneNumber;
			var addbBoss = item.map.boss || '';
			var addWork = item.work == '0';

			var phone = this.pinia_user.phone;
			var work = this.pinia_user.user.work == '1';
			var img = this.pinia_user.data.headPortrait;
			var aName = this.pinia_user.data.nickName || phone;
			var identy = '';
			var aBossNumber = phone;

			if (work) {
				aBossNumber = this.pinia_user.workData.bossNumber;
				identy = this.pinia_user.workData.identity;
			}

			var dx = {
				aNumber: phone,
				aBossNumber: aBossNumber,
				bBossNumber: addbBoss,
				aJobBumber: '',
				bNumber: addPhone,
				aImg: img,
				bImg: '',
				state: '0',
				aName: aName,
				port: this.role == 1 ? 'R' : 'D',
				aCompany: ''
			};

			if (addWork) {
				dx.bNumber = addPhone;
				dx.bBossNumber = addPhone;
			} else {
				dx.bNumber = addPhone;
				dx.bBossNumber = addbBoss;
			}

			//自己不能加自己
			if (dx.aNumber == dx.bNumber) {
				this.showSF = false;
				this.$u.toast('请勿添加自己~');
				return;
			}

			//自己不能添加自己老板员工
			if (dx.aBossNumber == dx.bBossNumber) {
				this.showSF = false;
				this.$u.toast('同一家公司不能添加为好友~');
				return;
			}

			uni.$api.client.addClient(dx).then((res) => {
				console.log('添加申请： ' + res.data.data);
				var resAddFriend = res.data;
				this.addResAlert(resAddFriend, addPhone);
			});
		},
		addFriendKH(e, img) {},
		addResAlert(data, number) {
			if (data.data == 1) {
				this.flushDBSX(number);
			}

			this.$u.toast(data.message);
			this.showYQZ = true;
			this.showSF = false;
		},
		SearchFriend() {
			this.showYQZ = false;
			this.state = 0;
			this.searchUser = [];
			var that = this;
			if (this.searchNumber.length == 11) {
				uni.$api.user.searchUser({ phone: this.searchNumber }).then((res) => {
					console.log('更具电话号码检索： ' + res.data);

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
