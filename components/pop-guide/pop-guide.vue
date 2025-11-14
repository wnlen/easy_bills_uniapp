<template>
	<view v-if="show" class="guide-remark white">
		<view class="box" :style="[functionGuideData.position]">
			<view class="tips flex" :style="[functionGuideData.tipsPosition]" @click="next" style="width: 237px; height: 132px; background-size: cover"></view>
		</view>
	</view>
</template>

<script>
let timer = null;
let flag = false;

export default {
	name: 'pop-guide',
	props: {
		maxStep: { type: Number, default: 3 },
		guideData: {
			type: Object,
			default: () => ({
				step: 0,
				tips: '',
				tipsPosition: '',
				btnGroupPosition: '',
				position: {}
			})
		},
		guideType: { type: String, default: 'index' } // goods为商品库引导页
	},
	data() {
		return {
			show: false,
			functionGuideData: {}
		};
	},
	watch: {
		guideData: {
			deep: true,
			handler(data) {
				this.functionGuideData = data;
			}
		}
	},
	methods: {
		// 供父组件调用：开始引导
		init() {
			if (this.show) return;
			const show = false; // 你原本逻辑
			if (!show) {
				this.show = true;
				// ⬇️ 不再直接 $parent 调用，改为派发事件，请父组件去设定 step/定位
				this.$emit('step-change', { step: 1 });
			}
		},

		// 用户主动跳过
		jump() {
			this.$emit('step-change', { step: 'jump' });
			this.setFunctionGuideState();
			// ⬇️ 可选：告诉父组件“引导完成/关闭”
			this.$emit('finished');
		},
		next() {
			this.throttle(() => {
				if (this.functionGuideData.step == this.maxStep) {
					this.completeFlow(); // 走统一完成逻辑
					return;
				}
				const step = this.functionGuideData.step;
				// ⬇️ 不再直接 $parent 调用，改为事件让父组件改 step & 位置
				this.$emit('step-change', { step: step + 1 });
			}, 500);

			// goods 分支按你原逻辑
			if (this.guideType === 'goods') {
				if (this.functionGuideData.step == 2) {
					this.$u.setPinia({ guide: { guidanceGoods: 1 } });
					this.show = false;
					this.$emit('finished'); // 通知父组件：引导结束
				}
				return;
			}

			// 这里保留你的 D/R 分支判断，但不直接找父组件
			const isD = this.pinia_userRole == 'D';
			if (isD) {
				if (this.functionGuideData.step == 4) {
					this.GuidanceDR(true);
				}
			} else {
				if (this.functionGuideData.step == 2) {
					this.GuidanceDR(false);
				}
			}
		},

		// 统一引导完成流程（写 pinia、关引导、通知父组件）
		completeFlow() {
			this.GuidanceDR(this.pinia_userRole == 'D');
		},

		GuidanceDR(isDeliver) {
			// ✅ 本地标记完成
			if (this.$u.getPinia('user.userRole') === 'D') {
				this.$u.setPinia({ guide: { guidanceD: 1 } });
			} else {
				this.$u.setPinia({ guide: { guidanceR: 1 } });
			}

			this.show = false;

			// ❗ 不再 this.$parent.openUnreceived()，改事件让父组件决定何时弹窗
			// （父组件收到 finished 后，按需调用 openUnreceived）
			this.$emit('finished');

			// 保留你原来的用户刷新
			this.$loadUser(this);

			// ⚠️ 这里你原代码里 dx 的 guidanceD/guidanceR 似乎和 isDeliver 反着写了
			// 如果 isDeliver===true 表示发货端，应该 guidanceD=1, guidanceR=0 更直观
			const dx = {
				phoneNumber: this.pinia_user.phone,
				guidanceD: isDeliver ? 1 : 0,
				guidanceR: isDeliver ? 0 : 1,
				port: this.pinia_userRole
			};
			uni.$api.user.userGuidance(dx).then(() => {});
		},

		setFunctionGuideState() {
			this.show = false;
		},

		/* 节流 */
		throttle(fn, delay = 500) {
			if (!flag) {
				flag = true;
				typeof fn === 'function' && fn();
				timer = setTimeout(() => {
					flag = false;
				}, delay);
			}
		}
	},
	beforeDestroy() {
		if (timer) clearTimeout(timer);
	}
};
</script>

<style lang="scss" scoped>
.plus {
	width: 140rpx;
	height: 2rpx;
	position: relative;

	.in-border {
		border: 2rpx dashed #fff;
		width: 110rpx;
		height: 110rpx;
		border-radius: 50%;
		position: absolute;
		left: 10rpx;
		top: -55rpx;
	}

	.plus-icon {
		background: #fff;
		border-radius: 50%;
		overflow: hidden;
		width: 92rpx;
		height: 92rpx;
	}
}

.guide-remark {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 20230828;

	.box {
		position: absolute;
		z-index: 10;
		width: 686rpx;
		border-radius: 24rpx;
		box-shadow: 0 0 0 100vh rgba(0, 0, 0, 0.6);
		transition: all 0.3s ease;

		.tips {
			width: 100%;
			background: transparent;
			border-radius: 24rpx;
			padding: 20rpx 50rpx;
			box-sizing: border-box;
			position: absolute;

			top: -110rpx;
			z-index: 2;
			font-size: 28rpx;
			transition: top 0.3s ease;
		}

		.btn-group {
			width: 100%;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			font-size: 32rpx;
			z-index: 2;
			transition: bottom 0.3s ease;

			.btn {
				width: 240rpx;
				height: 84rpx;
				border-radius: 52rpx;
				border: 2rpx solid #ffffff;
				background: #fff;
				margin: 0 30rpx;
			}
		}
	}
}

.flex {
	display: flex;
	align-items: center;
}

.flex_center {
	@extend .flex;
	justify-content: center;
}
</style>
