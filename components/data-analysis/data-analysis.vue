<template>
	<view class="contentView">
		<view class="bg-white pl24 pr24 pb38">
			<view class="flex-row items-center justify-center" v-if="showCalendar">
				<view
					class="calendarBox"
					@click="
						$refs.calendars.open();
						timeType = 1;
					"
				>
					<wd-icon name="calendar" size="24rpx" color="#999999"></wd-icon>
					<text class="ml12">{{ date1 == '' ? '开始日期' : date1 }}</text>
				</view>
				<text class="ml12 mr12">至</text>
				<view
					class="calendarBox"
					@click="
						$refs.calendars.open();
						timeType = 2;
					"
				>
					<wd-icon name="calendar" size="24rpx" color="#999999"></wd-icon>
					<text class="ml12">{{ date2 == '' ? '结束日期' : date2 }}</text>
				</view>
			</view>
			<view class="charts-box1">
				<qiun-data-charts type="ring" :opts="opts4" :chartData="chartData4" :canvas2d="true" canvasId="mQeRxIXWgXIzJwrjsSJdlsgpudfZgkIE" />
			</view>
			<view class="flex-row items-center justify-between u-border-bottom pt15 pb15">
				<view class="flex-row items-center">
					<text>总金额</text>
					<!-- <view class="flex-row items-center ml20">
						<up-icon name="arrow-downward" size="20rpx" color="#F53F3F"></up-icon>
						<text class="ft12" style="color: #f53f3f">0.8%</text>
					</view> -->
				</view>
				<view class="ft-green">
					<text>￥</text>
					<text>{{ formatAmount(468552) }}</text>
				</view>
			</view>
			<view class="flex-row items-center justify-between u-border-bottom pt15 pb15" v-for="(item, index) in chartData4.series[0].data" :key="index">
				<view class="flex-row items-center">
					<text class="bgColorBox" :style="`background:${item.bgColor}`"></text>
					<text>{{ item.name }}</text>
				</view>
				<view class="">
					<text>￥</text>
					<text>{{ formatAmount(item.value) }}</text>
				</view>
			</view>
		</view>
		<view class="bg-white">
			<view class="earchTitle">待签收统计图</view>
			<view class="charts-box">
				<qiun-data-charts type="column" :opts="opts1" :chartData="chartData1" :canvas2d="true" canvasId="NrrFqdcSkawnWFhtAazcccaSZppHblXx" />
			</view>
		</view>
		<view class="bg-white">
			<view class="earchTitle">已签收统计图</view>
			<view class="charts-box">
				<qiun-data-charts type="column" :opts="opts2" :chartData="chartData2" :canvas2d="true" canvasId="NrrFqdcSkawnWFhtAazcccaSZppHblXT" />
			</view>
		</view>
		<view class="bg-white relative">
			<view class="earchTitle">已收款统计图</view>
			<view class="charts-box">
				<qiun-data-charts type="column" :opts="opts3" :chartData="chartData3" :canvas2d="true" canvasId="NrrFqdcSkawnWFhtAazcccaSZppHblXQ" />
			</view>
		</view>
		<!-- 日历选择器 -->
		<uv-calendars color="#01BB74" confirmColor="#01BB74" ref="calendars" @confirm="date1Change" />
	</view>
</template>

<script>
export default {
	name: 'data-analysis',
	props: {
		showCalendar: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			date1: '',
			date2: '',
			timeType: null,

			chartData1: {},
			chartData2: {},
			chartData3: {},
			chartData4: {
				series: [
					{
						data: []
					}
				]
			},
			// 柱状图
			opts1: {
				tooltipShow: true,
				color: ['#F7A944'],
				padding: [15, 15, 0, 5],
				enableScroll: false,
				legend: {
					show: false
				},
				dataLabel: false,
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
						width: 10,
						activeBgColor: '#000000',
						activeBgOpacity: 0.08,
						seriesGap: 5,
						barBorderCircle: true
					}
				}
			},
			opts2: {},
			opts3: {},
			// 圆环图
			opts4: {
				rotate: false,
				rotateLock: false,
				color: ['#F7A944', '#418AFF', '#01BB74'],
				padding: [5, 5, 5, 5],
				fontColor: (params) => {
					return this.opts4.color[params.index];
				},
				enableScroll: false,
				legend: {
					show: false
				},
				title: {
					name: ''
				},
				subtitle: {
					name: ''
				},
				extra: {
					ring: {
						ringWidth: 15,
						activeOpacity: 0.5,
						activeRadius: 10,
						offsetAngle: 0,
						labelWidth: 15,
						border: true,
						borderWidth: 1,
						borderColor: '#FFFFFF'
					}
				}
			}
		};
	},
	methods: {
		date1Change(e) {
			if (this.timeType == 1) {
				this.date1 = e.fulldate;
				this.date2 = '';
			} else {
				if (!this.date1) {
					return uni.$u.toast('请先选择开始时间');
				} else if (new Date(e.fulldate).getTime() < new Date(this.date1).getTime()) {
					return uni.$u.toast('开始日期不能大于结束日期~');
				}
				this.date2 = e.fulldate;
			}
		},
		getServerData() {
			//模拟从服务器获取数据时的延时
			setTimeout(() => {
				//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
				let res = {
					categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
					series: [
						{
							name: '',
							data: [18, 27, 21, 24, 6, 28, 18, 27, 21, 24, 6, 28]
						}
					]
				};
				let res1 = {
					series: [
						{
							data: [
								{ name: '待签收', value: 500000, bgColor: '#F7A944' },
								{ name: '已签收', value: 30, bgColor: '#418AFF' },
								{ name: '已付款', value: 20, bgColor: '#01BB74' }
							]
						}
					]
				};
				this.opts2 = JSON.parse(JSON.stringify(this.opts1));
				this.opts2.color = ['#418AFF'];
				this.opts3 = JSON.parse(JSON.stringify(this.opts1));
				this.opts3.color = ['#01BB74'];
				this.chartData1 = JSON.parse(JSON.stringify(res));
				this.chartData2 = JSON.parse(JSON.stringify(res));
				this.chartData3 = JSON.parse(JSON.stringify(res));
				this.chartData4 = JSON.parse(JSON.stringify(res1));
			}, 500);
		}
	}
};
</script>

<style lang="scss" scoped>
.calendarBox {
	color: #aaa;
	font-size: 24rpx;
	background: rgba(244, 244, 244, 0.5);
	border-radius: 6rpx;
	width: 203rpx;
	height: 45rpx;
	display: flex;
	align-items: center;
	padding-left: 16rpx;
}
.bgColorBox {
	width: 24rpx;
	height: 24rpx;
	border-radius: 4rpx;
	margin-right: 20rpx;
}
.contentView {
	> view {
		border-radius: 10rpx;
		margin-top: 24rpx;
	}
	.charts-box {
		width: 100%;
		height: 430rpx;
		box-sizing: border-box;
		padding-bottom: 20rpx;
	}
	.charts-box1 {
		width: 100%;
		height: 400rpx;
	}
}

.cardEacher {
	border-radius: 12.62rpx;
	opacity: 1;
	background: #ffffff;
}

.color-block {
	width: 20rpx;
	/* 设置方块宽度 */
	height: 20rpx;
	/* 设置方块高度 */
	/* 设置方块颜色为红色 */
}

.earchTitle {
	font-size: 30rpx;
	font-weight: 600;
	padding: 24rpx 0 14rpx 20rpx;
	color: #333333;
}
</style>
