<template>
	<view class="vh100 vw100 fixed-bar-height bg-gray fixed-bar-height">
		<view class="flex-col pt100" v-if="orderList.length == 0 && !identity">
			<u-empty
				:show="isEmpty"
				src="https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/role/empty.svg"
				icon-size="200"
				text="暂无签收人~"
				mode="search"
				margin-top="200"
			></u-empty>
			<view class="mt25 vw100 text-center" style="font-size: 28rpx">
				<u-button
					@click="goPath('/pages/subPack/user/signee/add')"
					hover-class="none"
					:custom-style="{ backgroundColor: '#01BB74' }"
					:disabled="orderList.length >= 1"
					type="primary"
					class=""
					shape="circle"
					size="medium"
				>
					新增签收人
				</u-button>
			</view>
		</view>

		<view class="flex-row justify-center items-center absolute" style="width: 100%; top: 25%" v-if="identity">
			<u-image src="https://res-oss.elist.com.cn/wxImg/order/cw.svg" width="600rpx" height="400rpx"></u-image>
			<view class="absolute" style="bottom: -80rpx; color: #aaaaaa; font-size: 28rpx">当前无查看权限~</view>
		</view>

		<view class="order-simple-list pt24" v-if="!identity">
			<view v-for="(item, index) in orderList" :key="index" class="flex-col pd24 ml24 mr24 mb24 bg-white radius">
				<view class="flex-row items-center justify-between">
					<view class="mr20">
						<u-icon name="https://res-oss.elist.com.cn/wxImg/user/qm.svg" size="80rpx"></u-icon>
					</view>
					<view class="flex-col flex-1 pr35">
						<view class="flex-row">
							<text class="ft32 ft-bold ft-black">{{ item.name }}</text>
							<view style="margin-left: 24rpx">
								<u-icon name="eye" color="#999999" size="40rpx" @click="show = true"></u-icon>
							</view>
						</view>
						<text class="ft25 line25 ft-gray mt10">{{ item.phone }}</text>
					</view>
					<!-- #ifdef MP-WEIXIN -->
					<view style="margin-right: 15rpx">
						<u-icon class="mr20" name="edit-pen" color="#aaa" size="34rpx" @click.stop="goDetails(item, 1)"></u-icon>
					</view>
					<view style="margin-right: 24rpx; margin-left: 30rpx">
						<u-icon class="ml30 mr20" name="trash" color="#aaa" size="34rpx" @click="goDetails(item.id, 2)"></u-icon>
					</view>
					<!-- #endif -->
					<!-- #ifdef APP -->
					<view style="margin-right: 15rpx">
						<u-icon class="mr20" name="edit-pen" color="#aaa" size="34rpx" @click="goDetails(item, 1)"></u-icon>
					</view>
					<view style="margin-right: 24rpx; margin-left: 30rpx">
						<u-icon class="ml30 mr20" name="trash" color="#aaa" size="34rpx" @click="goDetails(item.id, 2)"></u-icon>
					</view>
					<!-- #endif -->
				</view>
				<view class="u-border-top pt30 mt30 flex-row items-center justify-between">
					<u-icon v-if="item.ifDefault != 'Y'" label-size="12" name="checkmark-circle-fill" color="#01BB74" size="38rpx" label="默认签收人"></u-icon>
					<u-icon @click="defaultItem(item.id)" v-else name="minus-circle" label-size="12" color="#ccc" size="38rpx" label="默认签收人"></u-icon>
					<!-- 			<text class="ft-gray ft24" @click="deleteItem(item.id)">删除</text> -->
				</view>
				<u-popup v-model="show" mode="center" width="500rpx" height="800rpx" close-icon-size="30" :closeable="true" close-icon-color="#000000" close-icon-pos="top-right">
					<u-image style="transform: rotate(90deg)" width="500rpx" height="800rpx" :src="item.signatureImg"></u-image>
				</u-popup>

				<up-overlay :show="showMask" @click="showMask = false">
					<u-popup class="flex-col justify-center items-center" border-radius="15" mode="center" v-model="showMask" width="600rpx" height="400rpx">
						<view class="flex-col justify-center items-center relative" style="height: 100%; width: 100%">
							<view class="absolute pt20" style="width: 100%; top: 0; height: 75%">
								<view class="flex-row items-center justify-center passwordTitle">请输入签收密码</view>
								<view class="flex-col items-center justify-center mt20" style="width: 100%; height: 35%">
									<u-message-input :bold="false" @change="change" @finish="finish" :dot-fill="true" :value="password" mode="box"></u-message-input>
									<view class="mt20 err" v-show="err">密码错误，请重新输入</view>
								</view>
								<view @click="goPath('/pages/subUser/resetpassword')" class="ft12 pr30 flex-row justify-end pt15" style="color: #999; width: 100%">找回密码</view>
							</view>
							<view class="flex-row items-center absolute u-border-top" style="width: 100%; bottom: 0; height: 25%">
								<view @click="cancel" style="width: 50%; height: 100%" class="titlePas flex-col justify-center items-center">取消</view>
								<view @click="confirm" style="width: 50%; height: 100%" class="titlePasOK flex-col justify-center items-center u-border-left">确认</view>
							</view>
						</view>
					</u-popup>
				</up-overlay>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showMask: false,
			isEmpty: true,
			orderList: [],
			show: false,
			identity: false,
			password: '',
			err: false,
			val: '',
			type: 0
		};
	},
	onShow() {
		if (this.vuex_user.workData != null) {
			var ide = this.vuex_user.workData.identity == '3';
			if (ide) {
				this.identity = true;
			}
		}
		this.password = '';
		this.showMask = false;
		this.loadData();
	},
	methods: {
		cancel() {
			this.showMask = false;
			this.password = '';
		},
		confirm() {
			this.finish(this.password);
		},
		change(e) {
			this.password = e;
			console.log('改变', e);
			var len = e.length;
			if (len < 4) {
				this.err = false;
			}
		},
		finish(e) {
			console.log('结果', e);
			var pas = this.vuex_user.vuex_password == e;
			var type = this.type;
			if (pas) {
				if (type == 1) {
					uni.navigateTo({
						url: '/pages/subPack/user/signee/add?item=' + JSON.stringify(this.val)
					});
				}
				if (type == 2) {
					this.deleteItem(this.val);
				}
			} else {
				this.err = true;
			}
		},
		loadData() {
			var that = this;
			this.$api.sign
				.getSignature({
					phone: this.vuex_user.phone
				})
				.then((res) => {
					that.orderList = res.data.data;
					console.log(that.orderList);
					if (that.orderList.length > 0) {
						that.isEmpty = false;
					} else {
						that.isEmpty = true;
					}
				});
		},
		goDetails(val, type) {
			var password = this.vuex_user.vuex_password;
			this.val = val;
			this.type = type;
			this.showMask = true;
			console.log('密码：', password);
		},
		defaultItem(id) {},
		deleteItem(id) {
			uni.showModal({
				title: '删除提醒',
				content: '是否删除该签收人？',
				showCancel: true,
				cancelText: '取消',
				confirmText: '确定',
				success: (res) => {
					if (res.confirm) {
						this.del(id);
					}
				}
			});
		},
		del(id) {
			var that = this;
			this.$api.sign
				.deleteSignature({
					id: id
				})
				.then((res) => {
					that.$u.toast(res.data.data == '1' ? '删除成功' : '删除失败');
					this.loadData();
				});
		}
	}
};
</script>

<style lang="scss">
.fliter-wrap {
	.fliter-scroll {
		width: 520rpx;
	}

	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
	}

	.filter-btn {
		background: #fff;
		color: #333;
		border-radius: 100rpx;
		padding: 12rpx 35rpx;
		font-size: 26rpx;

		&.active {
			background: #1faf60;
			color: #fff;
		}
	}

	& > .filter-btn {
		margin-left: 20rpx;
	}
}

.list-data-wrap {
	background: linear-gradient(188.57deg, #fbfefb, #e8f5ed);
	box-shadow: 1rpx 1rpx 2rpx #eee;
}

.passwordTitle {
	width: 100%;
	height: 40%;
	color: #333333;
	font-size: 36rpx;
	font-weight: 600;
}

.titlePas {
	color: #333333;
	font-size: 36rpx;
	font-weight: 600;
}

.titlePasOK {
	color: #01bb74;
	font-size: 36rpx;
	font-weight: 600;
}

.err {
	font-family: Source Han Sans;
	font-size: 26rpx;
	font-weight: normal;
	line-height: 44.92rpx;
	letter-spacing: 1.3rpx;

	font-feature-settings: 'kern' on;
	color: #f53f3f;
}
</style>
