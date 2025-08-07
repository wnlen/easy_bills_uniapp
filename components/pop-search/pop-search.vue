<template>
	<view class="Card cardShow">
		<view class="InputCard">
			<view class="InputOne">
				<text class="ft11 ft-gray ml20" style="background-color: transparent" @click="choice">
					{{ vuex_userRole === 'R' ? InputOneName.a : InputOneName.b }}
				</text>
				<u-icon class="ml10 mr10" name="/static/img/list/sx.svg" size="40"></u-icon>
				<u-input
					class="my-input"
					border="none"
					style="width: 100%"
					@input="InputTextOne"
					:modelValue="InputOneText"
					:custom-style="{ backgroundColor: 'transparent' }"
					:placeholder="vuex_userRole === 'R' ? InputOneName.a : InputOneName.b"
					clearable="true"
				/>
				<view class="flex-col justify-center items-center" style="height: 5vh">
					<u-icon class="ml40" name="/static/img/list/lxr.svg" size="45" @click="choice"></u-icon>
				</view>
			</view>

			<view class="InputOne">
				<text class="ft11 ft-gray ml20" @click="openSearchTj">
					{{ InputOneName.c }}
				</text>
				<u-icon class="ml10 mr10" name="/static/img/list/sj.svg" size="40"></u-icon>
				<u-input border="none" v-if="showTage !== '1'" class="my-input" style="width: 100%" :modelValue="field" @input="searchListenner" placeholder="输入关键字进行检索" />
				<u-input
					border="none"
					v-if="showTage === '1'"
					maxlength="11"
					class="ml24 my-input"
					style="width: 100%"
					:modelValue="field"
					@input="searchListenner"
					placeholder="输入号码进行检索"
				/>
				<view class="flex-col justify-center items-center" style="height: 5vh">
					<u-icon class="ml40" name="/static/img/list/ss.svg" size="45" @click="SearchBtn"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		InputOneName: {
			type: Object,
			default: {
				a: '供应商选择',
				b: '客户选择',
				c: '条件筛选'
			}
		}
	},
	name: 'pop-search',
	data() {
		return {
			InputOneText: ''
		};
	},
	methods: {
		openSearchTj() {
			this.$parent.openSearchTj();
		},
		choice() {
			uni.navigateTo({
				url: '/pages/subOrder/table?show=0'
			});
		},
		InputTextOne(text) {
			console.log(text);
		}
	}
};
</script>

<style scoped lang="scss">
.Card {
	width: 94%;
	background-color: white;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border-radius: 14rpx;
	padding: 20rpx;
	margin-left: 3%;
	margin-top: 25rpx;

	.priceCard {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.InputCard {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-top: 5px;

		.InputOne {
			background-color: #f9f9f9;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: left;
			border-radius: 12px;
			margin-top: 10px;
			padding-right: 10px;
		}
	}
}
</style>
