<template>
	<u-popup v-model="roleShow" mode="bottom" border-radius="15" height="750rpx" :closeable="true"
		:mask-close-able="false">
		<view class="pd36 flex-col justify-center items-center jb" @tap.stop style="background-size: cover;"
			:style="{backgroundImage:'url('+ImgUrl+'/wxImg/index/backRD.png)'}">
			<view class="flex-col" style="width: 100%;">
				<text class="ft30 ft-bold ft-green mb10"
					style="color: #333333;font-size: 20px;font-weight: bold;">设置角色</text>
				<text class="ft-gray pb48" style="#666666">切换您的角色，快速收发单</text>
			</view>
			<view class="vw100 flex-row" style="height: 150px;">
				<view class="">

				</view>
				<view class="relative mr10"
					style="height: 200px;width: 40%;margin-left: 8%;margin-right: 2%;border: 1.5px solid #01BB74;border-radius: 12px;">
					<u-image v-show="roleShowF==true" @click="qh(11)" border-radius="20" width="100%" height="100%" :show-menu-by-longpress="false"
						:src="ImgUrl+'/wxImg/index/01.png'"></u-image>
					<u-image v-show="roleShowF==false" @click="qh(1)" border-radius="20" width="100%" height="100%" :show-menu-by-longpress="false"
						:src="ImgUrl+'/wxImg/index/02.png'"></u-image>
					<view class="absolute" style="top: 10px;right: -10px;">
						<u-radio-group placement="column" @change="qh(1)" v-model="check">
							<u-radio :customStyle="{marginBottom: '8px'}" @change="" activeColor="#01BB74"
								v-model="roleShowF" name="1">
							</u-radio>
						</u-radio-group>
					</view>
				</view>
				<view class="relative ml10"
					style="height: 200px;width: 40%;border: 1.5px  solid #568FF2;border-radius: 12px;">
					<u-image v-show="roleShowS==true" @click="qh(22)" border-radius="20" width="100%" height="100%" :show-menu-by-longpress="false"
						:src="ImgUrl+'/wxImg/index/04.png'"></u-image>
					<u-image v-show="roleShowS==false" @click="qh(2)" border-radius="20" width="100%" height="100%" :show-menu-by-longpress="false"
						:src="ImgUrl+'/wxImg/index/03.png'"></u-image>
					<view class="absolute" style="top: 10px;right: -10px;">
						<u-radio-group placement="column" @change="qh(2)" v-model="check">
							<u-radio :customStyle="{marginBottom: '8px'}" @change="" activeColor="#568FF2" name="2">
							</u-radio>
						</u-radio-group>
					</view>
				</view>
			</view>
			<view class="" style="margin-top: 8vh;width: 85vw;">
				<u-button hover-class="none" :custom-style="{backgroundColor:'#01BB74'}" class="width100" type="primary"
					shape="circle" @click="submitRole">确定</u-button>
			</view>
		</view>
	</u-popup>
</template>

<script>
	import { useGlobalStore } from '@/store/global';
	const globalStore = useGlobalStore();
	export default {
		name: "pop-role",
		data() {
			return {
				check: '',
				roleShow: false,
				roleShowF: true,
				roleShowS: false,
				roleId: 'D',
				items: [{
						value: 'D',
						name: ''
					},
					{
						value: 'R',
						name: ''
					}
				],
				system: true,
				pageid:''
			};
		},
		watch: {
			roleShow(newValue, oldValue) {
				if (newValue) {
					this.roleId = this.vuex_userRole === 0 ? 'D' : this.vuex_userRole;
					this.$loadUser(this);
				}
			}
		},
		onShow() {
			console.log('ImgUrlaaaaaaaaaaaaaa',this.ImgUrl)
			if (this.vuex_userRole == "R") {
				this.roleShowF = false
				this.roleShowS = true
				this.check = '2';
				// this.vuex_tabbar[0].counts=0
			} else {
				this.roleShowF = true
				this.roleShowS = false
				this.check = '1';
				// this.vuex_tabbar[0].counts=0
			}
			
			this.$u.setPinia({
				global:{
					tabIndex:0
				}
			})
		},
		methods: {
			qh(i) {
				if (i == 2) {
					this.roleShowF = false
					this.roleShowS = true
					this.check = '2';
					
				}
				if (i == 1) {
					this.roleShowF = true
					this.roleShowS = false
					this.check = '1';
					
				}
				console.log("发货 ： " + this.roleShowF);
				console.log("收货 ： " + this.roleShowS);
			},
			guidanceFun() {
				if (this.vuex_user.phone != undefined) {
					this.$loadUser(this);
					if (this.vuex_userRole == "D") {
						if (this.guidanceD == 1) {
							this.$parent.guide()
						}
					} else {
						if (this.guidanceR == 1) {
							console.log("收货端指引");
							this.$parent.guide()
						}
					}

				}else{
					console.log("未登录");
				}
			},
			radioChange(e) {
				this.roleId = e.detail.value
			},
			submitRole() {
				
				if (this.roleShowF) {
					this.$u.setPinia({
						user:{
							userRole:'D'
						}
					})
					if (this.vuex_user.phone != undefined) {
						if (this.$parent.indexSumList) {
							
							var filer = this.vuex_userRole == "D" ? "0" : "1"
							console.log("发货端0");
							this.$parent.indexSumList = this.$parent.indexSumListCopy
							this.$parent.indexSumList = this.$parent.indexSumList.filter(res => res.port == filer);
							console.log("发货端1");
							console.log(this.$parent.indexSumList);
							if(this.pageid == 'index'){
								this.$parent.getData();
								this.$parent.getOrderDB()
							}
							console.log("发货端2");
						}else{
							if(this.pageid == 'index'){
								this.$parent.getData();
								this.$parent.getOrderDB()
							}
							console.log("发货端3");
						}
					} else {
						console.log("未登录");
					}

				} else {
					this.$u.setPinia({
						user:{
							userRole:'R'
						}
					})
					if (this.vuex_user.phone != undefined) {
						if (this.$parent.indexSumList) {
							var filer = this.vuex_userRole == "D" ? "0" : "1"
							console.log("收货端0");
							this.$parent.indexSumList = this.$parent.indexSumListCopy
							this.$parent.indexSumList = this.$parent.indexSumList.filter(res => res.port == filer);
							console.log(this.$parent.indexSumList);
							if(this.pageid == 'index'){
								this.$parent.getOrderDB()
							}
						}else{
							if(this.pageid == 'index'){
								this.$parent.getOrderDB()
							}
						}

					} else {
						console.log("未登录");
					}
				}
				this.guidanceFun()
				this.roleShow = false;
			}
		},
	}
</script>

<style lang="scss">

</style>