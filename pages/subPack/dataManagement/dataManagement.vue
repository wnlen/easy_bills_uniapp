<template>
	<view class="contentView">
		<view class="">
			<view
				class="titleBox mt14 mb20"
				@click="
					uni.navigateTo({
						url: '/pages/subPack/dataManagement/manageAnalysis'
					})
				"
			>
				<text>数据分析</text>
				<wd-icon name="arrow-right" color="#666666" size="40rpx"></wd-icon>
			</view>
			<view class="flex-row items-center justify-center">
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
			<view class="pl24 pr24 pb38">
				<view class="charts-box1">
					<qiun-data-charts type="ring" :opts="opts4" :chartData="chartData4" :canvas2d="true" canvasId="mQeRxIXWgXIzJwrjsSJdlsgpudfZgk34" />
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
			<view class="titleBox mt14 mb54">
				<text>客户订单数统计</text>
			</view>
			<view class="pl24 pr24 pb38">
				<view class="charts-box1">
					<qiun-data-charts type="pie" :opts="opts1" :chartData="chartData1" :canvas2d="true" canvasId="mQeRxIXWgXIzJwrjsSJdlsgpudfZgk31" />
				</view>
			</view>

			<view
				class="titleBox mt14 mb20"
				@click="
					uni.navigateTo({
						url: '/pages/subPack/dataManagement/manageSales'
					})
				"
			>
				<text>客户销售排行</text>
				<wd-icon name="arrow-right" color="#666666" size="40rpx"></wd-icon>
			</view>
			<sales-ranking-list></sales-ranking-list>
		</view>
		<!-- 空 -->
		<!-- <view class="">
			<up-empty icon="https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/role/dbsx.svg" iconSize="400rpx" :text="`暂无数据~`" marginTop="240rpx"></up-empty>
			<view
				class="openBtn"
				@click="
					uni.navigateTo({
						url: '/pages/subOrder/add'
					})
				"
			>
				前往开单
			</view>
		</view> -->

		<!-- 日历选择器 -->
		<uv-calendars color="#01BB74" confirmColor="#01BB74" ref="calendars" @confirm="date1Change" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			date1: '',
			date2: '',
			timeType: null,
			// 饼图
			chartData1: {},
			opts1: {
				color: ['#1890FF', '#91CB74', '#FAC858', '#EE6666', '#73C0DE', '#3CA272', '#FC8452', '#9A60B4', '#ea7ccc'],
				padding: [5, 5, 5, 5],
				fontColor: (params) => {
					return this.opts1.color[params.index];
				},
				enableScroll: false,
				legend: {
					show: false
				},
				enableScroll: false,
				extra: {
					pie: {
						activeOpacity: 0.5,
						activeRadius: 10,
						offsetAngle: 0,
						labelWidth: 15,
						border: false
					}
				}
			},
			chartData4: {
				series: [
					{
						data: []
					}
				]
			},
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
	onLoad() {
		this.$nextTick(() => {
			this.getServerData();
		});
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
					series: [
						{
							data: [
								{ name: '欣欣开发', value: 185, labelText: '欣欣开发:185单' },
								{ name: '松江建筑', value: 108, labelText: '松江建筑:108单' },
								{ name: '天心建筑', value: 218, labelText: '天心建筑:218单' }
							]
						}
					]
				};
				this.chartData1 = JSON.parse(JSON.stringify(res));
				let res1 = {
					series: [
						{
							data: [
								{ name: '待签收', value: 500, bgColor: '#F7A944' },
								{ name: '已签收', value: 30, bgColor: '#418AFF' },
								{ name: '已付款', value: 20, bgColor: '#01BB74' }
							]
						}
					]
				};
				this.chartData4 = JSON.parse(JSON.stringify(res1));
			}, 500);
		}
	}
};
</script>

<style lang="scss" scoped>
.titleBox {
	font-size: 32rpx;
	font-weight: 500;
	padding: 0 24rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
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
.openBtn {
	width: 300rpx;
	height: 76rpx;
	border-radius: 188px;
	background: #ecfff9;
	border: 1px solid #01bb74;
	font-size: 32rpx;
	font-weight: 500;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #01bb74;
	margin: 100rpx auto 0;
}
</style>
