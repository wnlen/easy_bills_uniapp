<template>
	<up-popup :show="roleShow" @close="roleShow = false" mode="bottom" round="15" height="750rpx" :closeable="true" :mask-close-able="false">
		<view class="pd36 flex-col justify-center jb" @tap.stop style="background-size: cover" :style="{ backgroundImage: 'url(' + ImgUrl + '/wxImg/index/backRD.png)' }">
			<view class="flex-col" style="width: 100%">
				<text class="ft30 ft-bold ft-green mb10" style="color: #333333; font-size: 40rpx; font-weight: bold">设置角色</text>
				<text class="ft-gray pb48" style="#666666">切换您的角色，快速收发单</text>
			</view>
			<view class="vw100 flex-row" style="height: 300rpx">
				<view class=""></view>
				<view
					class="relative mr10"
					style="height: 400rpx; width: 40%; margin-left: 4%; margin-right: 2%; border: 3rpx solid #01bb74; border-radius: 24rpx; box-sizing: content-box"
				>
					<view class="" v-show="roleShowF == true">
						<up-image width="100%" height="400rpx" @click="qh(11)" radius="20rpx" :show-menu-by-longpress="false" :src="ImgUrl + '/wxImg/index/01.png'"></up-image>
					</view>
					<view class="" v-show="roleShowF == false">
						<up-image width="100%" height="400rpx" @click="qh(1)" radius="20rpx" :show-menu-by-longpress="false" :src="ImgUrl + '/wxImg/index/02.png'"></up-image>
					</view>

					<view class="absolute" style="top: 20rpx; right: 20rpx">
						<up-radio-group placement="column" @change="qh(1)" v-model="check">
							<up-radio :customStyle="{ marginBottom: '16rpx' }" @change="" activeColor="#01BB74" v-model="roleShowF" name="1"></up-radio>
						</up-radio-group>
					</view>
				</view>
				<view class="relative ml10" style="height: 400rpx; width: 40%; border: 3rpx solid #568ff2; border-radius: 24rpx; box-sizing: content-box">
					<view class="" v-show="roleShowS == true">
						<up-image height="400rpx" @click="qh(22)" radius="20rpx" width="100%" :show-menu-by-longpress="false" :src="ImgUrl + '/wxImg/index/04.png'"></up-image>
					</view>
					<view class="" v-show="roleShowS == false">
						<up-image height="400rpx" @click="qh(2)" radius="20rpx" width="100%" :show-menu-by-longpress="false" :src="ImgUrl + '/wxImg/index/03.png'"></up-image>
					</view>

					<view class="absolute" style="top: 20rpx; right: 20rpx">
						<up-radio-group placement="column" @change="qh(2)" v-model="check">
							<up-radio :customStyle="{ marginBottom: '16rpx' }" @change="" activeColor="#568FF2" name="2"></up-radio>
						</up-radio-group>
					</view>
				</view>
			</view>
			<view class="" style="margin: 10vh 0 0 30rpx; width: 85vw">
				<up-button hover-class="none" color="#01BB74" type="primary" shape="circle" @click="submitRole">确定</up-button>
			</view>
		</view>
	</up-popup>
</template>

<script>
export default {
	name: 'pop-role',
	data() {
		return {
			check: '',
			roleShow: false,
			roleShowF: true,
			roleShowS: false,
			roleId: 'D',
			items: [
				{
					value: 'D',
					name: ''
				},
				{
					value: 'R',
					name: ''
				}
			],
			system: true,
			pageid: ''
		};
	},
	watch: {
		roleShow(newValue, oldValue) {
			if (newValue) {
				this.roleId = this.pinia_userRole === 0 ? 'D' : this.pinia_userRole;
				this.$loadUser(this);
			}
		}
	},
	methods: {
		qh(i) {
			if (i == 2) {
				this.roleShowF = false;
				this.roleShowS = true;
				this.check = '2';
			}
			if (i == 1) {
				this.roleShowF = true;
				this.roleShowS = false;
				this.check = '1';
			}
			console.log('发货 ： ' + this.roleShowF);
			console.log('收货 ： ' + this.roleShowS);
		},
		guidanceFun() {
			if (this.pinia_user.phone != undefined) {
				this.$loadUser(this);
				if (this.pinia_userRole == 'D') {
					if (this.guidanceD == 1) {
						this.$parent.guide();
					}
				} else {
					if (this.guidanceR == 1) {
						console.log('收货端指引');
						this.$parent.guide();
					}
				}
			} else {
				console.log('未登录');
			}
		},
		radioChange(e) {
			this.roleId = e.detail.value;
		},
		submitRole() {
			if (this.roleShowF) {
				this.$u.setPinia({
					user: {
						userRole: 'D'
					}
				});
				if (this.pinia_user.phone != undefined) {
					if (this.$parent.indexSumList) {
						var filer = this.pinia_userRole == 'D' ? '0' : '1';
						console.log('发货端0');
						this.$parent.indexSumList = this.$parent.indexSumListCopy;
						this.$parent.indexSumList = this.$parent.indexSumList.filter((res) => res.port == filer);
						console.log('发货端1');
						console.log(this.$parent.indexSumList);
						if (this.pageid == 'index') {
							this.$parent.getData();
							this.$parent.getOrderDB();
						}
						console.log('发货端2');
					} else {
						if (this.pageid == 'index') {
							this.$parent.getData();
							this.$parent.getOrderDB();
						}
						console.log('发货端3');
					}
				} else {
					console.log('未登录');
				}
			} else {
				this.$u.setPinia({
					user: {
						userRole: 'R'
					}
				});
				if (this.pinia_user.phone != undefined) {
					if (this.$parent.indexSumList) {
						var filer = this.pinia_userRole == 'D' ? '0' : '1';
						console.log('收货端0');
						this.$parent.indexSumList = this.$parent.indexSumListCopy;
						this.$parent.indexSumList = this.$parent.indexSumList.filter((res) => res.port == filer);
						console.log(this.$parent.indexSumList);
						if (this.pageid == 'index') {
							this.$parent.getOrderDB();
						}
					} else {
						if (this.pageid == 'index') {
							this.$parent.getOrderDB();
						}
					}
				} else {
					console.log('未登录');
				}
			}
			this.guidanceFun();
			this.roleShow = false;
		}
	}
};
</script>

<style lang="scss"></style>
