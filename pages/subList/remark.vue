<template>
	<view class="vw100 vh100 bg-white">
		<up-input label-width="0" v-model="text" type="textarea" auto-height="true" trim="true" placeholder="请输入备注" focus maxlength="50"></up-input>
		<view class="fixed-bar bg-white pd30">
			<view class="flex-row justify-center items-center">
				<wd-button :customStyle="customStyle" @click="save">保存</wd-button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			customStyle: {
				width: '300px'
			},
			text: '',
			remark: ''
		};
	},
	onLoad(item) {
		console.log('item', item);
		var json = JSON.parse(item.item);
		this.remark = json;
		if (json.receiptsDescr != undefined) {
			this.text = json.receiptsDescr;
		}
	},
	methods: {
		save() {
			console.log('保存');

			var remark = {
				phone: this.pinia_user.phone,
				orderNumber: this.remark.orderNumber,
				remark: this.text,
				orderId: this.remark.id,
				state: '0'
			};
			console.log(remark);
			if (remark.remark.length > 0) {
				uni.$api.user
					.addRemark(remark)
					.then((res) => {
						console.log(res.data.data);
						this.orderList = res.data.data;
						this.totalMoney = this.orderList.reduce((total, obj) => total + obj.price, 0);
					})
					.catch((res) => {
						this.$u.toast('添加成功');
						uni.navigateBack();
					});
			} else {
				this.$u.toast('请填写备注内容~');
			}
		}
	}
};
</script>
