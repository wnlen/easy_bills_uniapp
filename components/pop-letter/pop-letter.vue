<template>
	<view>
		<up-overlay :show="show" @click="show = false">
			<view class="letter" @tap.stop>
				<view
					style="
						width: 65vw;
						height: 52vh;
						background-color: red;
						position: relative;
						border-radius: 12px;
						background-image: url(https://res-oss.elist.com.cn/wxImg/user/antithesis.png);
						background-size: cover;
					"
				>
					<view class="absolute" style="position: absolute; z-index: 11; right: 0; top: -30px">
						<up-icon name="close-circle" color="#ffffff" size="50rpx" @click="show = false"></up-icon>
					</view>
					<view
						style="
							position: absolute;
							top: 64%;
							left: 53%;
							transform: translate(-50%, -50%);
							color: white;
							font-size: 16px;
							text-align: center;
							z-index: 9;
							border-radius: 8rpx;
							width: 220px;
							height: 240px;
							font-family: 'ysdzt', Arial, sans-serif;
						"
						@tab.stop
						@click="showImg"
					>
						<view
							class=""
							style="width: 100%; height: 20px; z-index: 10; color: #d99211; text-align: left; padding-left: 56rpx; padding-bottom: 30rpx; letter-spacing: -0.15em"
						>
							尊敬的易单据用户:
						</view>
						<text :key="index" class="typing-line" style="line-height: 1.5em" v-for="(line, index) in currentTextLines" :style="{ animationDelay: `${index * 100}ms` }">
							{{ line }}
						</text>
					</view>
				</view>
			</view>
		</up-overlay>
	</view>
</template>

<script>
export default {
	name: 'pop-letter',
	data() {
		return {
			show: false,
			currentTextLines: [],
			originalText:
				'这是您和易单据的\n第一次相遇，\n接下来，\n您将感受到易单据\n是多么的强大！\n当您使用易单据后，\n您的供应商的\n每一张\n送货单\n都将在这里体现，\n您可以通过\n易单据\n给供应商\n签收送货单\n如果您\n是一家\n更强大的公司，\n您的员工签单，\n财务和您都能\n实时的看到单据；\n您也可以通过\n易单据的统计功能\n随意的查询\n您每一家\n供应商的送货单据，\n每一张单据，\n查询他们的\n价格和数量；\n最关键的\n通过易单据，\n面对供应商\n半年付款的，\n季度付款的，\n年度付款的，\n你可以轻松\n统计出\n详细送货清单。\n当然，\n易单据还有更多，\n更强大的功能\n在您后期使用中\n会发现更多！\n未来，\n易单据\n将和您携手同行，\n用真诚与专业\n陪伴您\n骏业日新！',
			timer: null,
			img: ['https://res-oss.elist.com.cn/wxImg/letter/pop-letter-a.png', 'https://res-oss.elist.com.cn/wxImg/letter/pop-letter-b.png']
		};
	},
	methods: {
		letter() {
			// 检查是否已经存在定时器
			if (this.timer) {
				return; // 如果已经存在定时器，直接返回，不启动新的定时器
			}

			// 将原始文本按换行符分割成数组
			const lines = this.originalText.split('\n');
			let lineIndex = 0;

			// 定义定时器函数，方便后续复用
			const showNextLine = () => {
				if (lineIndex < lines.length) {
					if (this.currentTextLines.length > 5) {
						// 暂停当前定时器
						clearInterval(this.timer);
						// 等待 2 秒
						setTimeout(() => {
							// 清空当前显示的文本行数组
							this.currentTextLines = [];
							// 重新启动定时器
							this.timer = setInterval(showNextLine, 500);
						}, 2000);
					} else {
						// 逐行添加到当前显示的文本行数组中
						this.currentTextLines.push(lines[lineIndex]);
						lineIndex++;
					}
				} else {
					// 文本显示完毕，清除定时器
					clearInterval(this.timer);
					this.timer = null; // 将定时器变量置为 null，表示没有活动的定时器
				}
			};

			// 启动定时器
			this.timer = setInterval(showNextLine, 500);
		},
		showImg() {
			uni.previewImage({
				loop: true,
				urls: this.img //可以展示imgUrl 列表中所有的图片
			});
		}
	}
};
</script>

<style>
.letter {
	width: 100%;
	height: 100%;
	/* background-color: antiquewhite; */
	padding-top: 20px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
</style>
