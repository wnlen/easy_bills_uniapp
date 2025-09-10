<template>
	<view style="position: relative; height: 100vh">
		<view class="ml30 mr30 bg-white mt10">
			<view class="flex-row pt30 pb30 u-border-bottom items-center justify-between">
				<text style="color: red"><text class="ft-black ft30 ml5">开票金额</text></text>
				<view class="flex-row justify-end items-center flex-1">￥{{ invoice.price }}</view>
			</view>
			<view class="flex-row pt30 pb30 u-border-bottom items-center justify-between">
				<text style="color: red"><text class="ft-black ft30 ml5">抬头类型</text></text>
				<view class="flex-row justify-end items-center flex-1">
					<view class="flex-row justify-center items-center">
						<view
							class="flex-col justify-center items-center"
							@click="check(1)"
							:style="{ backgroundColor: type ? '#EA7183' : '#ffffff' }"
							style="border-radius: 50px; height: 15px; width: 15px; border: 1px solid #aaaaaa"
						>
							<up-icon name="checkbox-mark" color="#ffffff" size="28rpx"></up-icon>
						</view>
						<view class="ml5">企业</view>
					</view>
					<view class="flex-row justify-center items-center ml48">
						<view
							class="flex-col justify-center items-center"
							@click="check(2)"
							:style="{ backgroundColor: !type ? '#EA7183' : '#ffffff' }"
							style="border-radius: 50px; height: 15px; width: 15px; border: 1px solid #aaaaaa"
						>
							<up-icon name="checkbox-mark" color="#ffffff" size="28rpx"></up-icon>
						</view>
						<view class="ml5">个人/非企业单位</view>
					</view>
				</view>
			</view>
			<view class="flex-row pt30 pb30 u-border-bottom items-center justify-between">
				<text style="color: red">
					*
					<text class="ft-black ft30 ml5">发票抬头</text>
				</text>
				<view class="flex-row justify-end items-center flex-1">
					<uv-input v-model="invoice.name" border="none" inputAlign="right" type="text" maxlength="50" placeholder="请输入发票抬头 " />
				</view>
			</view>
			<view v-if="type" class="flex-row pt30 pb30 u-border-bottom items-center justify-between">
				<text style="color: red">
					*
					<text class="ft-black ft30 ml5">税号</text>
				</text>
				<view class="flex-row justify-end items-center flex-1">
					<uv-input v-model="invoice.taxpayerNumber" type="text" maxlength="50" border="none" inputAlign="right" placeholder="请输入纳税人识别号 " />
				</view>
			</view>
			<!-- 			<view class="flex-row pt30 pb30 u-border-bottom items-center justify-between">
				<text style="color: red;">*<text class="ft-black ft30 ml5">发票内容</text></text>
				<view class="flex-row justify-end items-center flex-1">
					<uv-input v-model="invoice.content" type="text" maxlength="50"
						class="text-right ft29" placeholder="请输入发票内容 " />
				</view>
			</view> -->
			<!-- opening_bank -->
			<view v-if="type" class="flex-row pt30 pb30 u-border-bottom items-center justify-between">
				<text style="color: red"><text class="ft-black ft30 ml5">开户行</text></text>
				<view class="flex-row justify-end items-center flex-1">
					<uv-input v-model="invoice.openingBank" type="text" maxlength="50" border="none" inputAlign="right" placeholder="选填" />
				</view>
			</view>
			<view v-if="type" class="flex-row pt30 pb30 u-border-bottom items-center justify-between">
				<text style="color: red"><text class="ft-black ft30 ml5">银行账号</text></text>
				<view class="flex-row justify-end items-center flex-1">
					<uv-input v-model="Bank" type="text" maxlength="50" border="none" inputAlign="right" placeholder="选填" />
				</view>
			</view>
			<view v-if="type" class="flex-row pt30 pb30 u-border-bottom items-center justify-between">
				<text style="color: red"><text class="ft-black ft30 ml5">企业地址</text></text>
				<view class="flex-row justify-end items-center flex-1">
					<uv-input v-model="invoice.site" type="text" maxlength="20" border="none" inputAlign="right" placeholder="选填" />
				</view>
			</view>
			<view v-if="type" class="flex-row pt30 pb30 u-border-bottom items-center justify-between">
				<text style="color: red"><text class="ft-black ft30 ml5">企业电话</text></text>
				<view class="flex-row justify-end items-center flex-1">
					<uv-input v-model="invoice.phone" type="number" maxlength="11" border="none" inputAlign="right" placeholder="选填" />
				</view>
			</view>
		</view>

		<view class="flex-col justify-center pl60 pr60 pb60 pt60 vw100" style="position: absolute; bottom: 0">
			<text class="kpxz" @click="jump()">《开票须知》</text>
			<up-button hover-class="none" color="#47506C" shape="circle" type="primary" @click="installInvoice">提交申请</up-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			type: false,
			invoice: {
				name: '',
				phone: '',
				identity: '',
				taxpayerNumber: '',
				site: '',
				openingBank: '',
				price: '',
				orderId: '',
				type: '',
				state: '1',
				content: '',
				mail: '',
				createTime: '',
				solveTime: '',
				url: '1',
				solve: '1'
			},
			Bank: '',
			invoiceOrder: ''
		};
	},
	onShow() {},
	onLoad(a) {
		var json = JSON.parse(a.invoice);
		this.invoiceOrder = json;
		this.invoice.orderId = json.id;
		this.invoice.price = json.price;
		// this.invoice.phone = this.pinia_user.phone
	},
	methods: {
		jump() {
			uni.navigateTo({
				url: '/pages/subUser/webpage?url=' + 'https://res-oss.elist.com.cn/notice/BillingInstructions-v1.htm'
			});
		},
		installInvoice() {
			if (this.invoice.orderId == '') {
				this.$u.toast('订单选择错误 ');
				return;
			}

			if (this.invoice.price == '') {
				this.$u.toast('价格错误 ');
				return;
			}

			if (this.invoice.name == '') {
				this.$u.toast('发票抬头不能为空 ');
				return;
			}

			if (this.type) {
				if (this.invoice.taxpayerNumber == '') {
					this.$u.toast('税号不能为空 ');
					return;
				}
			}

			if (this.invoice.openingBank != '' || this.Bank != '') {
				this.invoice.openingBank = this.invoice.openingBank + '/' + this.Bank;
			}

			this.invoice.phone = this.pinia_user.phone;
			this.invoice.type = this.type ? 1 : 0;
			this.invoice.createTime = new Date();

			console.log(this.invoice);

			uni.$api.invoice
				.addInvoice(this.invoice)
				.then((res) => {
					if (res.data.data == '1') {
						this.$u.toast('申请成功 ');
						uni.reLaunch({
							url: '/pages/subUser/invoice/invoiceSucess'
						});
					} else {
						this.$u.toast('重复申请 ');
					}
				})
				.catch((res) => {});
		},
		check(index) {
			var click = index == 1;
			console.log(click);
			if (click) {
				this.type = true;
			} else {
				this.type = false;
			}
		},
		authRefresh() {}
	}
};
</script>

<style lang="scss">
.box {
	border: 1px solid #f6f6f6;
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

.kpxz {
	font-family: Source Han Sans;
	font-size: 14px;
	font-weight: normal;
	line-height: 22px;
	text-align: center;
	letter-spacing: 0px;
	color: #aaaaaa;
	padding-bottom: 10px;
}
</style>
