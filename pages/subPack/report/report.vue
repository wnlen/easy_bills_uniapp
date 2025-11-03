<template>
	<view>
		<up-navbar :placeholder="true" autoBack>
			<template #center>
				<view class="ft-500 flex-row items-center justify-center ft34" @click="showNavbar = !showNavbar">
					<text>{{ navbarList[navbarAct].name }}</text>
					<wd-icon name="caret-down-small" size="22px"></wd-icon>
				</view>
			</template>
		</up-navbar>
		<view class="pl24 pr24">
			<view class="timeTab flex-row items-center justify-between mt12">
				<view :class="index == timeAct ? 'timeAct' : ''" @click="changeTime(index)" v-for="(item, index) in timeList" :key="index">{{ item.name }}</view>
			</view>
			<!-- 统一头部 -->
			<view class="timeTitle">{{ setTitle() }}流水账一{{ timeList[timeAct].name }}表</view>
			<view class="mb20 flex-row items-center">
				<text class="ft-500 ft24 mr12">统计时间</text>
				<wd-icon name="caret-down-small" size="22px"></wd-icon>
				<text class="timeBox ml10" @click="showPicker()">{{ statisticsTime }}</text>
			</view>
			<!-- 支出、收入报表 -->
			<view class="" v-if="navbarAct == 0">
				<view class="tableBox">
					<view class="tableBox-item" v-for="(item, index) in statisticsList" :key="index">
						<text>{{ item.name }}</text>
						<text>{{ formatAmount(item.value) }}</text>
					</view>
				</view>
				<view class="charts-box mt45">
					<qiun-data-charts type="area" :opts="opts" :chartData="chartData" />
				</view>
				<view class="mt25">
					<view class="tableHead">
						<text>日期</text>
						<text style="width: 146rpx" v-for="(item, index) in statisticsList" :key="index">{{ item.name }}</text>
					</view>

					<view class="tableBodyBox">
						<view class="tableBody" v-for="(item, index) in dataList" :key="index">
							<text>{{ index }}</text>
							<text style="width: 146rpx">{{ index }}</text>
							<text style="width: 146rpx">{{ index }}</text>
							<text style="width: 146rpx">{{ index }}</text>
							<text style="width: 146rpx">{{ index }}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 应收、应付欠款 -->
			<view class="" v-else>
				<view class="tableBox1 flex-row">
					<view class="tableBox1-title">统计</view>
					<view class="">
						<view class="tableBox1-item" v-for="(item, index) in statisticsList" :key="index">
							<text>{{ item.name }}</text>
							<text>{{ formatAmount(item.value) }}</text>
						</view>
					</view>
					<view class="tableBox1-title">合计</view>
					<view class="flex-1 flex-row items-center justify-center">
						{{ formatAmount(53698) }}
					</view>
				</view>
				<view class="mt25">
					<view class="tableHead">
						<text>单位名称</text>
						<text v-for="(item, index) in statisticsList" :key="index">{{ item.name }}</text>
					</view>
					<view class="tableBodyBox">
						<view class="tableBody" v-for="(item, index) in dataList" :key="index">
							<text>{{ index }}</text>
							<text>{{ index }}</text>
							<text>{{ index }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<up-popup :show="showNavbar" mode="top" @close="showNavbar = false" :safeAreaInsetBottom="false" round="6">
			<view>
				<up-navbar :placeholder="true" autoBack>
					<template #center>
						<view class="ft-500 flex-row items-center justify-center ft34" @click="showNavbar = !showNavbar">
							<text>{{ navbarList[navbarAct].name }}</text>
							<wd-icon name="caret-down-small" size="22px"></wd-icon>
						</view>
					</template>
				</up-navbar>
				<view class="navbarBox ft34 text-center pt48">
					<view :class="navbarAct == index ? 'ft-green' : ''" @click="changeNavbar(index)" class="pb48" v-for="(item, index) in navbarList" :key="index">
						{{ item.name }}
					</view>
				</view>
			</view>
		</up-popup>

		<up-empty
			v-if="showEmpty"
			icon="https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/role/dbsx.svg"
			iconSize="400rpx"
			:text="`暂无${navbarList[navbarAct].name}~`"
			marginTop="400rpx"
		></up-empty>
		<!-- 日历选择器 -->
		<uv-datetime-picker ref="datetimePicker" v-model="valueTime" :mode="dateMode" @confirm="dateChange"></uv-datetime-picker>
	</view>
</template>

<script>
export default {
	data() {
		return {
			statisticsTime: '',
			dateMode: 'date',
			valueTime: Number(new Date()),
			chartData: {},
			opts: {
				color: ['#FFC300'],
				padding: [10, 0, 0, 0],
				enableScroll: false,
				legend: {
					show: false
				},
				xAxis: {
					disableGrid: true
				},
				yAxis: {
					gridType: 'dash',
					dashLength: 2
				},
				extra: {
					area: {
						type: 'curve',
						opacity: 0.2,
						addLine: true,
						width: 2,
						gradient: true,
						activeType: 'hollow'
					}
				}
			},
			dataList: [{}, {}],
			showEmpty: false,
			showNavbar: false,
			timeList: [
				{
					name: '周报'
				},
				{
					name: '月报'
				},
				{
					name: '季报'
				}
			],
			timeAct: 0,
			navbarList: [
				{
					name: '收入分析'
				},
				{
					name: '应收欠款'
				}
			],
			navbarAct: 0,
			statisticsList: [
				{
					name: '待签收',
					value: 678
				},
				{
					name: '已签收',
					value: 678
				},
				{
					name: '已收款',
					value: 678
				},
				{
					name: '总收入',
					value: 678
				}
			]
		};
	},
	onLoad() {
		this.setNavbar();
		this.setTitle();
		this.statisticsTime = this.timestampToWeekInfo(new Date().getTime()).yearWeek;
	},
	methods: {
		showPicker() {
			if (this.timeAct == 0) {
				this.dateMode = 'date';
			} else if (this.timeAct == 1) {
				this.dateMode = 'year-month';
			} else if (this.timeAct == 2) {
				this.dateMode = 'year-month';
			}
			this.$refs.datetimePicker.open();
		},
		dateChange(e) {
			console.log(e);
			if (this.timeAct == 0) {
				this.statisticsTime = this.timestampToWeekInfo(e.value).yearWeek;
			} else if (this.timeAct == 1) {
				this.statisticsTime = this.timestampToYearMonth(e.value);
			} else if (this.timeAct == 2) {
				this.statisticsTime = this.timestampToQuarterInfo(e.value).yearQuarter;
			}
		},
		changeNavbar(index) {
			this.navbarAct = index;
			this.showNavbar = false;
			this.setNavbar();
			this.setTitle();
		},
		setTitle() {
			if (this.$u.getPinia('user.userRole') == 'R') {
				if (this.navbarAct == 0) {
					return '支出明细';
				} else {
					return '应付欠款';
				}
			} else {
				if (this.navbarAct == 0) {
					return '收入明细';
				} else {
					return '应收欠款';
				}
			}
		},
		setNavbar() {
			//模拟从服务器获取数据时的延时
			setTimeout(() => {
				//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
				let res = {
					categories: ['2018', '2019', '2020', '2021', '2022', '2023'],
					series: [
						{
							name: '',
							data: [35, 8, 25, 37, 4, 20]
						}
					]
				};
				this.chartData = JSON.parse(JSON.stringify(res));
			}, 1000);
			if (this.$u.getPinia('user.userRole') == 'R') {
				this.navbarList = [
					{
						name: '支出分析'
					},
					{
						name: '应付欠款'
					}
				];
				if (this.navbarAct == 0) {
					this.statisticsList = [
						{
							name: '待确收',
							value: 678
						},
						{
							name: '已签收',
							value: 678
						},
						{
							name: '已付款',
							value: 678
						},
						{
							name: '总支出',
							value: 678
						}
					];
				} else {
					this.statisticsList = [
						{
							name: '已付欠款',
							value: 678
						},
						{
							name: '应付欠款',
							value: 678
						}
					];
				}
			} else {
				if (this.navbarAct == 0) {
					this.statisticsList = [
						{
							name: '待签收',
							value: 678
						},
						{
							name: '已签收',
							value: 678
						},
						{
							name: '已收款',
							value: 678
						},
						{
							name: '总收入',
							value: 678
						}
					];
				} else {
					this.statisticsList = [
						{
							name: '已收欠款',
							value: 678
						},
						{
							name: '应收欠款',
							value: 678
						}
					];
				}
			}
		},
		changeTime(index) {
			this.timeAct = index;
			if (this.timeAct == 0) {
				this.statisticsTime = this.timestampToWeekInfo(new Date().getTime()).yearWeek;
			} else if (this.timeAct == 1) {
				this.statisticsTime = this.timestampToYearMonth(new Date().getTime());
			} else if (this.timeAct == 2) {
				this.statisticsTime = this.timestampToQuarterInfo(new Date().getTime()).yearQuarter;
			}
		},
		/**
		 * 将时间戳转换为年-季度，并获取该季度的最小/最大日期
		 * @param {number} timestamp 毫秒级时间戳（如 1760275200000）
		 * @returns {Object} { yearQuarter, minDate, maxDate }
		 *   - yearQuarter: 年-季度（如 "2025-Q1"）
		 *   - minDate: 季度最小日期（如 "2025-01-01"）
		 *   - maxDate: 季度最大日期（如 "2025-03-31"）
		 */
		timestampToQuarterInfo(timestamp) {
			const date = new Date(timestamp);
			if (isNaN(date.getTime())) {
				throw new Error('无效时间戳，请传入毫秒级时间戳');
			}

			// 1. 获取年份和月份（月份0=1月，11=12月）
			const year = date.getFullYear();
			const month = date.getMonth(); // 0-11

			// 2. 计算季度（1-4）
			const quarter = Math.floor(month / 3) + 1; // 0-2月→Q1，3-5月→Q2，以此类推

			// 3. 计算季度第一天（最小日期）
			const startMonth = (quarter - 1) * 3; // Q1→0（1月），Q2→3（4月）...
			const minDate = new Date(year, startMonth, 1); // 当月第一天

			// 4. 计算季度最后一天（最大日期）
			const endMonth = startMonth + 2; // Q1→2（3月），Q2→5（6月）...
			// 下个月的第0天 = 当月最后一天（自动处理28/29/30/31天）
			const maxDate = new Date(year, endMonth + 1, 0);

			// 5. 格式化日期为 YYYY-MM-DD
			const format = (d) => {
				const y = d.getFullYear();
				const m = String(d.getMonth() + 1).padStart(2, '0'); // 月份补零
				const day = String(d.getDate()).padStart(2, '0'); // 日期补零
				return `${y}-${m}-${day}`;
			};
			console.log(`${year}-Q${quarter}`, format(minDate), format(maxDate));
			return {
				yearQuarter: `${year}-Q${quarter}`,
				minDate: format(minDate),
				maxDate: format(maxDate)
			};
		},
		/**
		 * 将时间戳转换为“年-月”格式（本地时区）
		 * @param {number} timestamp 毫秒级时间戳（如 1760275200000）
		 * @returns {string} 年-月格式（如 "2025-10"）
		 */
		timestampToYearMonth(timestamp) {
			const date = new Date(timestamp);
			if (isNaN(date.getTime())) {
				throw new Error('无效时间戳，请传入毫秒级时间戳');
			}

			const year = date.getFullYear(); // 获取年份（4位，如 2025）
			const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是0基，+1后补零（如 10月→"10"）

			return `${year}-${month}`;
		},
		/**
		 * 确保周起始日为周一时，最小日期正确（周一当天）
		 * @param {number} timestamp 毫秒级时间戳（如 new Date(2025,9,13).getTime()）
		 * @param {0|1} weekStart 周起始日（0=周日，1=周一，默认1）
		 * @returns {Object} { yearWeek, minDate, maxDate }
		 */
		timestampToWeekInfo(timestamp, weekStart = 1) {
			const date = new Date(timestamp);
			if (isNaN(date.getTime())) throw new Error('无效时间戳');

			// 1. 计算周起始日（周一）
			const day = date.getDay(); // 0=周日，1=周一...6=周六
			const minDate = new Date(date);

			if (weekStart === 1) {
				// 周起始日为周一：明确分支逻辑
				if (day === 1) {
					minDate.setDate(date.getDate()); // 周一：当天为起始
				} else if (day === 0) {
					minDate.setDate(date.getDate() - 6); // 周日：回退6天到上周一
				} else {
					minDate.setDate(date.getDate() - (day - 1)); // 周二至周六：回退到本周一
				}
			} else {
				minDate.setDate(date.getDate() - day); // 周日起始逻辑
			}
			minDate.setHours(0, 0, 0, 0);

			// 2. 周结束日（起始日+6天）
			const maxDate = new Date(minDate);
			maxDate.setDate(minDate.getDate() + 6);
			maxDate.setHours(23, 59, 59, 999);

			// 3. 精准计算周数（ISO 8601标准：第一周至少含当年4天）
			const getISOWeekNumber = (date) => {
				// 复制日期对象避免污染
				const d = new Date(date);
				d.setHours(0, 0, 0, 0);
				// 调整到本周周四（ISO周的“锚点”，确保周数计算准确）
				d.setDate(d.getDate() + (4 - (d.getDay() || 7))); // 周日转为7，确保4-7=-3，加3天到周四

				// 当年第一天的周四
				const yearStart = new Date(d.getFullYear(), 0, 1);
				const yearStartThursday = new Date(yearStart);
				yearStartThursday.setDate(1 + (4 - (yearStartThursday.getDay() || 7)));

				// 若当年第一个周四在1月4日之后，则第一周从下一年开始
				if (yearStartThursday.getDate() > 4) {
					yearStartThursday.setFullYear(yearStartThursday.getFullYear() + 1);
					yearStartThursday.setDate(1 + (4 - (yearStartThursday.getDay() || 7)));
				}

				// 计算两个周四之间的周数差
				const diffTime = d - yearStartThursday;
				const diffWeeks = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));
				return diffWeeks + 1; // +1是因为yearStartThursday是第1周的周四
			};

			// 4. 确定年份（处理跨年周）
			const weekNumber = getISOWeekNumber(minDate);
			let year = minDate.getFullYear();

			// 1月的周数若≥52，属于上一年
			if (minDate.getMonth() === 0 && weekNumber >= 52) {
				year = minDate.getFullYear() - 1;
			}
			// 12月的周数若为1，属于下一年
			else if (minDate.getMonth() === 11 && weekNumber === 1) {
				year = minDate.getFullYear() + 1;
			}
			// 5. 格式化输出  toISOString返回 UTC 时区 的时间字符串，会因时区偏移导致日期变化（如东八区的凌晨会变成前一天的 UTC 时间）。
			const format = (d) => d.toISOString().split('T')[0];
			console.log(
				`${year}-W${String(weekNumber).padStart(2, '0')}`,
				new Intl.DateTimeFormat('zh-CN', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					timeZone: 'Asia/Shanghai' // 明确指定东八区（避免环境时区影响）
				})
					.format(minDate)
					.replace(/\//g, '-'),
				format(maxDate)
			);
			return {
				yearWeek: `${year}-W${String(weekNumber).padStart(2, '0')}`,
				minDate: new Intl.DateTimeFormat('zh-CN', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					timeZone: 'Asia/Shanghai' // 明确指定东八区（避免环境时区影响）
				})
					.format(minDate)
					.replace(/\//g, '-'),
				maxDate: format(maxDate)
			};
		}
	}
};
</script>

<style scoped lang="scss">
::v-deep .uv-toolbar__wrapper__confirm {
	color: #01bb74 !important ;
}
.timeTab {
	> view {
		width: 126rpx;
		height: 46rpx;
		border-radius: 99px;
		background: #f9f9f9;
		font-size: 24rpx;
		font-weight: 500;
		color: #999999;
		display: flex;
		align-items: center;
		justify-content: center;
		&.timeAct {
			color: #fff;
			background: #01bb74;
		}
	}
}
.timeTitle {
	height: 66.68rpx;
	border-radius: 6px 6px 0px 0px;
	background: #01bb74;
	color: #fff;
	margin: 48rpx 0 24rpx;
	font-size: 32rpx;
	font-weight: 500;
	display: flex;
	align-items: center;
	justify-content: center;
}
.timeBox {
	font-size: 20rpx;
	width: 185rpx;
	height: 38.5rpx;
	border-radius: 3px;
	border: 1rpx solid #aaaaaa;
	display: flex;
	align-items: center;
	justify-content: center;
}
.tableBox {
	display: flex;
	flex-wrap: wrap;
	font-size: 20rpx;
	border: 1rpx solid #aaaaaa4d;
	.tableBox-item {
		flex: 0 0 50%; /* 固定占 50% 宽度（flex-grow:0, flex-shrink:0, flex-basis:50%） */
		display: flex;
		&:nth-of-type(2n) {
			text:nth-of-type(2n) {
				border-right: none;
			}
		}
		&:nth-of-type(n + 3) {
			border-top: 1rpx solid #aaaaaa4d;
		}
		text:nth-of-type(2n) {
			background: #ecfaf4;
		}
		text {
			flex: 1;
			height: 50rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-right: 1rpx solid #aaaaaa4d;
		}
	}
}
.tableBox1 {
	border: 1rpx solid #aaaaaa4d;
	height: 100rpx;
	font-size: 20rpx;
	.tableBox1-title {
		width: 106rpx;
		background: #ecfaf4;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.tableBox1-item {
		&:nth-of-type(2) {
			border-top: 1rpx solid #aaaaaa4d;
		}
		display: flex;
		text {
			line-height: 48rpx;
			width: 128rpx;
			text-align: center;
		}
		text:nth-of-type(odd) {
			border-right: 1rpx solid #aaaaaa4d;
		}
		text:nth-of-type(2n) {
			width: 188rpx;
		}
	}
}
.tableHead {
	display: flex;
	font-size: 20rpx;
	border-left: 1rpx solid #01bb74;
	text {
		line-height: 21.98px;
		background: #01bb74;
		color: #fff;
		text-align: center;
		width: 166rpx;
		border-right: 1rpx solid #fff;
		&:nth-of-type(1) {
			flex: 1;
		}
		&:last-of-type {
			border-right: none;
		}
	}
}

.tableBodyBox {
	border: 1rpx solid rgba(170, 170, 170, 0.45);
	border-top: none;
}
.tableBody {
	display: flex;
	font-size: 20rpx;
	border-bottom: 1rpx solid rgba(170, 170, 170, 0.45);
	&:last-of-type {
		border-bottom: none;
	}
	text {
		&:last-of-type {
			border-right: none;
		}
		border-right: 1rpx solid rgba(170, 170, 170, 0.45);
		line-height: 21.98px;
		text-align: center;
		width: 166rpx;
		&:nth-of-type(1) {
			flex: 1;
		}
	}
}
.charts-box {
	height: 200rpx;
}
</style>
