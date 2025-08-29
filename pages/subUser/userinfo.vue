<template>
	<view class="pt60">
		<view class="flex-row justify-center pt30 mb20 avatar-area">
			<button open-type="chooseAvatar" @chooseavatar="onChooseAvatar" type="default" mode="circle">
				<view class="relative" style="">
					<u-avatar :level-icon="camera" size="150rpx" :src="`${userInfo.headPortrait}`"></u-avatar>
					<!-- camera -->
					<view
						class="absolute flex-col justify-center items-center"
						style="border-radius: 50%; width: 50rpx; height: 50rpx; background-color: #f4f4f4; z-index: 9999; right: 0; bottom: 10rpx"
					>
						<u-icon name="camera" color="#333333" size="30rpx"></u-icon>
					</view>
				</view>
			</button>
		</view>
		<!-- <view class="box ml48 mr48 pd30 bg-white"> -->
		<view class="ml32 mr32 bg-white mt40">
			<view class="flex-row pb35 u-border-bottom items-center justify-between" @click="userInfoNickNameFocus = true">
				<text class="ft-gray">姓名</text>
				<view class="flex-row justify-end items-center flex-1">
					<!-- <input v-model="userInfo.name" type="nickname" maxlength="20" class="text-right ft29 mr3"
						placeholder="获取姓名" @blur="onNickname" /> -->
					<input
						:focus="userInfoNickNameFocus"
						v-model="userInfo.name"
						type="text"
						maxlength="20"
						class="text-right ft29 mr3"
						placeholder="输入姓名"
						@blur="onNickname"
					/>
					<u-icon name="arrow-right" color="#ccc" @click="userInfoNickNameFocus = true"></u-icon>
				</view>
			</view>
			<view class="flex-row pt35 pb35 u-border-bottom items-center justify-between">
				<text class="ft-gray">账号</text>
				<view class="flex-row justify-end items-center flex-1">
					<text>{{ pinia_user.phone }}</text>
				</view>
			</view>
			<view class="flex-row pt35 pb35 items-center justify-between u-border-bottom">
				<text class="ft-gray">性别</text>
				<view class="flex-1">
					<picker @change="bindPickerChange" :value="Number(pinia_user.data.gender)" :range="array">
						<view class="flex-row justify-end items-center flex-1">
							<text>{{ array[gender] || '请选择' }}</text>
							<view class="ml3">
								<u-icon name="arrow-right" color="#ccc"></u-icon>
							</view>
						</view>
					</picker>
				</view>
			</view>
			<view class="flex-row pt35 pb35 items-center u-border-bottom justify-between">
				<text class="ft-gray">状态</text>
				<view class="flex-row justify-end items-center flex-1" @click="jump">
					<u-tag v-if="ac ? ac.id != undefined : false" :plain="true" text="已完善" borderColor="#01BB74" color="#01BB74" @click="jump" />
					<u-tag v-if="ac ? ac.id == undefined : true" :plain="true" text="未完善" type="error" @click="jump" />
				</view>
			</view>
			<view class="flex-row pt35 pb35 u-border-bottom items-center justify-between">
				<text class="ft-gray">注册时间</text>
				<view class="flex-row justify-end items-center flex-1">
					<text>{{ $u.timeFormat(new Date(time).getTime(), 'yyyy-mm-dd') }}</text>
				</view>
			</view>
		</view>
		<view class="flex-col pl60 pr60 pb60 pt60 vw100" style="position: fixed; bottom: 40rpx; text-align: center">
			<u-button shape="circle" hover-class="none" color="#01BB74" type="primary" @click="updateInfo">保存信息</u-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			gender: '',
			userInfo: {
				name: '', //必填
				gender: '', //性别：0-男 1-女
				headPortrait: ''
			},
			array: ['男', '女'],
			subjectRole: {
				1: '老板',
				2: '财务',
				3: '现场管理',
				4: '合伙人'
			},
			ac: '',
			camera: 'camera',
			time: '',
			userInfoNickNameFocus: false
		};
	},
	onLoad() {},
	onShow() {
		this.userInfo = this.$u.getPinia('user.user.data');
		this.gender = Number(this.$u.getPinia('user.user.data.gender'));
		this.ac = this.$u.getPinia('user.user.ac');
		this.time = this.userInfo.registrationDate;
	},
	methods: {
		jump() {
			uni.navigateTo({
				url: '/pages/subAuth/auth'
			});
		},
		bindPickerChange(e) {
			console.log('性别', e);
			this.gender = e.detail.value;
			this.userInfo.gender = parseInt(e.detail.value);
		},
		onChooseAvatar(e) {
			let that = this,
				fileAvatar = e.detail.avatarUrl;

			uni.uploadFile({
				url: uni.$http.config.baseURL + 'user/modifyImage',
				header: {
					phone: that.pinia_user.phone
				},
				filePath: fileAvatar,
				name: 'imageFile',
				formData: {
					imageType: '0'
				},
				success: (uploadFileRes) => {
					console.log('uploadFileResuploadFileRes', uploadFileRes, uploadFileRes.statusCode);
					if (uploadFileRes.statusCode == 200) {
						that.userInfo.headPortrait = uploadFileRes.data;
						that.refreshImg();
						var data = {
							id: that.pinia_user.data.id,
							headPortrait: that.userInfo.headPortrait,
							name: that.userInfo.name,
							work: this.pinia_user.data.work,
							boss: this.pinia_user.data.work == '0' ? this.pinia_user.phone : this.pinia_user.workData.bossNumber
						};
						uni.$api.user
							.updateUserUp(data)
							.then((res) => {
								if (res.data.data == 1) {
									that.$u.toast('修改成功');
									this.onShow();
								}
							})
							.catch((res) => {
								that.$u.toast(res.data.message);
							});
					}
				},
				complete: (mess) => {
					console.log('mess', mess);
				}
			});
		},
		onNickname(e) {
			this.userInfoNickNameFocus = false;
			// this.userInfo.name = e.detail.value;
			//console.log("修改", this.userInfo);
		},
		updateInfo() {
			let that = this;
			this.userInfo.name = this.userInfo.name.trim();
			var ifempty = this.userInfo.name != '';
			if (ifempty) {
				//console.log("修改", this.userInfo);
				var send = {
					id: this.pinia_user.data.id,
					name: this.userInfo.name,
					gender: this.userInfo.gender,
					phoneNumber: this.pinia_user.phone,
					work: this.pinia_user.data.work,
					boss: this.pinia_user.data.work == '0' ? this.pinia_user.phone : this.pinia_user.workData.bossNumber
				};
				uni.$api.user.updateUserUp(send).then((res) => {
					if (res.data.data == '1') {
						uni.navigateBack();
					}
				});
			} else {
				this.$u.toast('请填写昵称~');
			}
		}
	}
};
</script>

<style lang="scss">
.box {
	border: 2rpx solid #f6f6f6;
	box-shadow: 0 6rpx 15rpx rgba(0, 0, 0, 0.05);
	min-height: 100rpx;
	border-radius: 14rpx;
}

.avatar-area button::after {
	border: none;
	background: none;
}

.avatar-area button {
	background-color: transparent !important;
}

.addr-box {
	width: 100%;
	max-width: 100%;
	box-sizing: border-box;
	background: #fcfcfc;
	border: 1rpx solid #f3f1f1;
}
</style>
