<template>
	<view class="vh100 bg-gray">
		<view class="bg-white">
			<up-cell-group :border="false">
				<up-cell
					:titleStyle="{ color: '#666666' }"
					v-for="(item, index) in menus"
					:key="index"
					:title="item.name"
					:isLink="true"
					arrow-direction="right"
					@click="menuClick(item)"
				>
					<template #value>
						<text class="ft-lightgray">{{ item.id == '1' ? (pinia_userRole == 'D' ? '发货方' : '收货方') : '' }}</text>
					</template>
				</up-cell>
				<!-- #ifdef APP -->
				<up-cell :titleStyle="{ color: '#666666' }" title="微信快速登录" @click="wxbind" :isLink="true">
					<template #value>
						<text class="ft-lightgray">{{ pinia_userRole == 'D' ? '绑定' : '未绑定' }}</text>
					</template>
				</up-cell>
				<!-- #endif -->
				<up-cell :titleStyle="{ color: '#666666' }" title="注销账号" @click="writeOff" :isLink="true"></up-cell>
				<up-cell :titleStyle="{ color: '#666666' }" title="退出登录" @click="loginOut" :isLink="true"></up-cell>
			</up-cell-group>
		</view>

		<!-- 切换角色 -->
		<pop-role ref="popRole"></pop-role>
		<!-- 切换角色 -->
	</view>
</template>

<script>
import SocketManager from '@/utils/socketManager.js';
export default {
	data() {
		return {
			menus: [
				{
					name: '当前角色',
					icon: 'tags',
					info: '获取中...',
					id: 1
				},
				{
					name: '个人资料',
					icon: 'error-circle',
					url: '/pages/subUser/userinfo'
				}
				// {'name':'修改密码','icon':'order','url':'/pages/user/resetpassword'},
				// {'name':'关于我们','icon':'question-circle','url':'/pages/user/about'},
			]
		};
	},
	onLoad() {
		this.loadData();
	},
	methods: {
		writeOff() {
			var phone = this.pinia_user.phone;

			uni.showModal({
				title: '请您慎重考虑,是否注销?',
				showCancel: true,
				cancelText: '取消注销',
				confirmText: '确认注销',
				confirmColor: '#01bb74',
				success: (res) => {
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/subUser/unsubscribe'
						});
					}
				},
				fail: () => {},
				complete: () => {}
			});

			console.log(phone);
		},
		loadData() {
			this.menus[0].info = this.pinia_userRole == 'D' ? '发货方' : '收货方';
		},
		menuClick(val) {
			if (val.name == '当前角色') {
				this.$refs.popRole.roleShow = true;
				if (this.pinia_userRole == 'R') {
					this.$refs.popRole.roleShowF = false;
					this.$refs.popRole.roleShowS = true;
					this.$refs.popRole.check = '2';
				} else {
					this.$refs.popRole.roleShowF = true;
					this.$refs.popRole.roleShowS = false;
					this.$refs.popRole.check = '1';
				}
			}
			if (val.url) {
				uni.navigateTo({
					url: val.url
				});
			}
		},
		async loginOut() {
			uni.showModal({
				title: '是否退出?',
				showCancel: true,
				cancelText: '取消退出',
				confirmText: '确认退出',
				confirmColor: '#01bb74',
				success: async (res) => {
					if (!res.confirm) return;

					uni.$api.user.loginlogout({});

					this.$u.toast('已退出~');
					this.$u.setPinia({
						user: {
							userRole: this.pinia_userRole,
							token: '',
							user: { phone: undefined }
						}
					});

					// 关闭socket...（略）
					setTimeout(() => {
						uni.reLaunch({ url: '/pages/user/index' });
					}, 500);
					SocketManager.close();
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
::v-deep .u-line {
	border-color: #f4f4f4 !important;
}
</style>
