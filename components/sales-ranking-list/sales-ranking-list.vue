<template>
	<view class="pl24 pr24 pb38">
		<view class="timeBox flex-row items-center justify-center">
			<text @click="changeTime(index)" :class="timeAct == index ? 'timeAct' : ''" v-for="(item, index) in timeList" :key="index">{{ item.name }}</text>
		</view>
		<view class="pb48" v-if="showCharts">
			<view class="ft26">排行统计图</view>
			<view class="charts-box">
				<qiun-data-charts type="column" :opts="opts" :chartData="chartData" :canvas2d="true" canvasId="mQeRxIXWgXIzJwrjsSJdlsgpudfZgk40" />
			</view>
		</view>
		<view v-if="!isEmpty">
			<view v-for="(item, index) in 3" :key="index" class="rankingBox pt12 pb12 flex-row items-center justify-between">
				<view class="flex-row items-center leftRanking" :class="index == 0 ? 'leftRanking1' : index == 1 ? 'leftRanking2' : index == 2 ? 'leftRanking3' : ''">
					<text>{{ index + 1 }}</text>
					<image :src="ImgUrl + '/wxImg/index/mr.svg'" mode=""></image>
					<text class="ft32 u-line-1">上海欣欣开发有限公司</text>
				</view>
				<text class="ft30">￥{{ formatAmount(98153) }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'sales-ranking-list',
	props: {
		showCharts: {
			type: Boolean,
			default: true
		},
		isEmpty: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			timeList: [
				{
					name: '本月'
				},
				{
					name: '本季'
				},
				{
					name: '本年'
				}
			],
			timeAct: 0,
			chartData: {},
			opts: {
				color: ['#F9CC44'],
				padding: [15, 15, 0, 5],
				enableScroll: false,
				legend: {
					show: false
				},
				xAxis: {
					disableGrid: true
				},
				yAxis: {
					data: [
						{
							min: 0
						}
					]
				},
				extra: {
					column: {
						type: 'group',
						width: 20,
						activeBgColor: '#000000',
						activeBgOpacity: 0.08,
						seriesGap: 5,
						barBorderRadius: [10, 10, 0, 0]
					}
				}
			}
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.getServerData();
		});
	},
	methods: {
		changeTime(index) {
			this.timeAct = index;
		},
		getServerData() {
			//模拟从服务器获取数据时的延时
			setTimeout(() => {
				//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
				let res = {
					categories: ['2018', '2019', '2020', '2021', '2022', '2023'],
					series: [
						{
							name: '',
							data: [35, 36, 31, 33, 13, 34]
						}
					]
				};
				this.chartData = JSON.parse(JSON.stringify(res));
			}, 500);
		}
	}
};
</script>

<style lang="scss" scoped>
.timeBox {
	padding: 30rpx 0 50rpx;
	text {
		font-size: 28rpx;
		font-weight: 500;
		width: 100rpx;
		height: 52rpx;
		border-radius: 3.6px;
		background: #ecfaf4;
		margin-right: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #01bb74;
		&:last-of-type {
			margin-right: 0;
		}
		&.timeAct {
			background: #01bb74;
			color: #fff;
		}
	}
}
.charts-box {
	width: 100%;
	height: 400rpx;
}
.rankingBox {
	border-bottom: 2rpx solid #f4f4f4;
}
.leftRanking {
	image {
		width: 106rpx;
		height: 106rpx;
		border-radius: 50%;
		margin: 0 16rpx;
	}
	text:nth-of-type(1) {
		color: #999999;
		font-size: 40rpx;
	}
	text:nth-of-type(2) {
		width: 360rpx;
	}
}
.leftRanking1 {
	image {
		border: 4rpx solid #fbbf24;
	}
	text:nth-of-type(1) {
		color: #fbbf24 !important;
		font-weight: bold;
	}
}
.leftRanking2 {
	image {
		border: 4rpx solid #979797;
	}
	text:nth-of-type(1) {
		color: #979797 !important;
		font-weight: bold;
	}
}
.leftRanking3 {
	image {
		border: 4rpx solid #f19459;
	}
	text:nth-of-type(1) {
		color: #f19459 !important;
		font-weight: bold;
	}
}
</style>
