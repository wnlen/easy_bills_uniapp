<template>
	<view>
		<wd-cell-group border>
			<wd-cell is-link>
				<template #title>
					<view class="ft-gray">默认开单方式</view>
				</template>
				<text class="ft-lightgray" @click="showPlacement = true">{{ value }}</text>
			</wd-cell>
			<wd-cell is-link>
				<template #title>
					<view class="ft-gray">我的印章</view>
				</template>
			</wd-cell>
		</wd-cell-group>
		<wd-action-sheet v-model="showPlacement" title="请选择">
			<wd-picker-view ref="wdPickerView" :columns="columns" @change="onChange" />
		</wd-action-sheet>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showPlacement: false,
			value: '普通开单',
			columns: [
				{ label: '普通开单', value: 1 },
				{ label: '法律签署开单', value: 2 }
			]
		};
	},
	methods: {
		onChange(e) {
			this.value = this.$refs.wdPickerView.getLabels()[0];
			// console.log(e, this.$refs.wdPickerView.getLabels());
		}
	}
};
</script>

<style></style>
