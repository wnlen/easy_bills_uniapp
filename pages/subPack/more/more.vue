<template>
	<view class="content items-center pt20">
		<!-- 		<up-navbar :border-bottom="false" title-color="#333333" title="更多功能" title-size="28"
			background="{background:transparent,color:white,fontSize: 28rpx;}"></up-navbar> -->

		<up-navbar :autoBack="true" :placeholder="true" :border-bottom="false" :titleBold="true" title-color="#000000" title="更多功能" title-size="34" bgColor="#ffffff"></up-navbar>

		<view class="ml24 mr24">
			<!-- <view class="titleMore">
				首页服务
			</view>
			<view class="pt30">
				<SortByDrag :data="list" :drag="drag" :minus="compile" height="500rpx" :itemWidth="136"
					:itemHeight="162" @sort="handleSort">
					<template v-slot="{item, index}">
						<view class="ml5 mr5 flex-col justify-center items-center relative"
							style="background-color: transparent;">
							<up-icon :label="item.name" size="100" :name="item.icon" labelPos="bottom" labelSize="25"
								labelColor="#333333" @touchstart="handleTouchStart" @touchend="handleTouchEnd"
								@touchcancel="handleTouchCancel"></up-icon>
						</view>
					</template>

				</SortByDrag>
			</view> -->
			<view class="titleMore">其他服务</view>
			<view class="pt30">
				<SortByDrag
					:data="listO"
					:drag="drag"
					:minus="compile"
					minusName="plus-circle-fill"
					minusColor="#01BB74"
					height="500rpx"
					:itemWidth="136"
					:itemHeight="162"
					@sort="handleSort"
				>
					<template v-slot="{ item, index }">
						<view class="ml5 mr5 flex-col justify-center items-center relative" style="background-color: transparent">
							<up-icon
								:label="item.name"
								size="100rpx"
								:name="item.icon"
								labelPos="bottom"
								labelSize="25rpx"
								labelColor="#333333"
								@touchstart="handleTouchStart"
								@touchend="handleTouchEnd"
								@click="jump(item)"
								@touchcancel="handleTouchCancel"
							></up-icon>
						</view>
					</template>
				</SortByDrag>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			drag: false,
			list: [],
			timer: null, // 用于存储定时器的变量
			longPressTime: 10000, // 设置长按时间为800毫秒
			compile: false,
			listO: []
		};
	},
	onShow() {
		this.getIcon();
		setTimeout(() => {
			this.getIcon();
		}, 3000);
	},
	methods: {
		jump(item) {
			console.log(item);
			var url = item.jump;
			if (url == null || url == '' || url == undefined) {
				uni.showToast({
					title: '请联系客服配置',
					icon: 'none'
				});
			} else {
				uni.navigateTo({
					url: url
				});
			}
		},
		getIcon() {
			uni.$api.bills
				.checkSequenceExistence({
					phone: this.pinia_user.phone
				})
				.then((res) => {
					var D = this.pinia_userRole == 'D';
					// this.list = D ? res.data.data.D : res.data.data.R;
					// this.listO= D ? res.data.data.DO : res.data.data.RO;
					this.listO = D ? res.data.data.D : res.data.data.R;
					console.log('LIstanbul:', this.list);
				});
		},
		handleSort(w) {
			console.log('新数组：', w);
		},
		click(e) {
			console.log(e.item, e.index);
		},
		handleTouchStart() {
			this.timer = setTimeout(() => {
				this.longPressAction(); // 长按动作
			}, this.longPressTime);
		},
		handleTouchEnd() {
			clearTimeout(this.timer); // 清除定时器
		},
		handleTouchCancel() {
			clearTimeout(this.timer); // 清除定时器
		},
		longPressAction() {
			// 这里执行长按后的动作
			uni.showToast({
				title: '拖动编辑',
				icon: 'none'
			});
			this.compile = true;
			this.drag = true;
		}
	}
};
</script>
<style>
.content {
	width: 100vw;
	height: 100vh;
	/* background-color: aquamarine; */
}

.titleMore {
	font-size: 32rpx;
	font-weight: 500;
	line-height: 44rpx;
	color: #333333;
}
</style>
