<template>
	<!-- 签名横屏 -->
	<view class="signa bg-white">
		<view class="flex-row items-center justify-center pd20" style="background: #eee;">
			<canvas class="canvas" disable-scroll="true" :style="{'width':width,'height':height}"
				canvas-id="designature" @touchstart="starts" @touchmove="moves" @touchend="end"></canvas>
		</view>
		<view class="bottomBox width100 flex-col">
			<view class="ft-gray ft24 mb36">请在框内手写您的签名，签写完毕后<text class="ft-bold">点击保存</text></view>
			<view class="btn blue mt40" @click="save">保存</view>
			<view class="btn mt60" @click="clear">清除</view>
			<view class="btn mt20" @click="cancel">取消</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				resultUrl: '',
				dom: null,
				line: [],
				width: '0px',
				height: '0px',
				radius: 0
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					console.log(res);
					this.width = res.windowWidth - 100 + 'px';
					this.height = res.windowHeight - 200 + 'px';
				}
			});
			this.dom = uni.createCanvasContext('designature', this);
		},
		methods: {
			cancel() {
				uni.navigateBack()
			},
			end(e) {

			},
			distance(a, b) {
				let x = b.x - a.x;
				let y = b.y - a.y;
				return Math.sqrt(x * x + y * y);
			},
			starts(e) {
				console.log(e)
				this.line.push({
					points: [{
						time: new Date().getTime(),
						x: e.touches[0].x,
						y: e.touches[0].y,
						dis: 0
					}]
				})
				let currentPoint = {
					x: e.touches[0].x,
					y: e.touches[0].y
				}
				this.currentPoint = currentPoint
				this.drawer(this.line[this.line.length - 1])
			},
			moves(e) {
				console.log(e)
				let point = {
					x: e.touches[0].x,
					y: e.touches[0].y
				}
				this.lastPoint = this.currentPoint,
					this.currentPoint = point
				this.line[this.line.length - 1].points.push({
					time: new Date().getTime(),
					x: e.touches[0].x,
					y: e.touches[0].y,
					dis: this.distance(this.currentPoint, this.lastPoint)
				})
				this.drawer(this.line[this.line.length - 1])
			},
			drawer(item) {
				let x1, x2, y1, y2, len, radius, r, cx, cy, t = 0.5,
					x, y;
				var time = 0;
				if (item.points.length > 2) {
					let lines = item.points[item.points.length - 3];
					let line = item.points[item.points.length - 2];
					let end = item.points[item.points.length - 1];
					x = line.x;
					y = line.y;
					x1 = lines.x;
					y1 = lines.y;
					x2 = end.x;
					y2 = end.y;
					var dis = 0;
					time = (line.time - lines.time) + (end.time - line.time)
					dis = line.dis + lines.dis + end.dis;
					var dom = this.dom;
					var or = Math.min(time / dis * this.linePressure + this.lineMin, this.lineMax);
					cx = (x - (Math.pow(1 - t, 2) * x1) - Math.pow(t, 2) * x2) / (2 * t * (1 - t))
					cy = (y - (Math.pow(1 - t, 2) * y1) - Math.pow(t, 2) * y2) / (2 * t * (1 - t))
					dom.setLineCap('round')
					dom.beginPath();
					dom.setStrokeStyle('black')
					dom.setLineWidth(5)
					dom.moveTo(x1, y1);
					dom.quadraticCurveTo(cx, cy, x2, y2);

					dom.stroke();
					dom.draw(true)
				}

			},
			clear() {
				this.dom.clearRect(0, 0, 1000, 1000)
				this.dom.draw()
			},
			save() {
				var that = this;
				uni.canvasToTempFilePath({
					canvasId: 'designature',
					fileType: 'png',
					quality: 1, //图片质量
					success: function(res) {
						// 上传签名
						let fileAvatar = res.tempFilePath;
						uni.uploadFile({
							url: that.$u.http.config.baseUrl + '/edo/user/modifyImage',
							header: {
								phone: that.vuex_user.phone
							},
							filePath: fileAvatar,
							name: 'imageFile',
							formData: {
								'imageType': 1
							},
							success: (uploadFileRes) => {
									console.log(uploadFileRes.data);
									uni.$emit('getSignImg',uploadFileRes.data);
									uni.navigateBack({
										delta: 1
									});
							}
						});
					},
					fail(e) {
						console.log(e)
					}
				}, this)
			}
		}
	}
</script>

<style scoped lang="scss">
	.signa {
		position: relative;
		overflow: hidden;
		height: 100vh;
		width: 100vw;
		padding: 20px 16px 30px;

		.canvas {
			background-color: #fff;
			position: relative;
			z-index: 9999;
		}

		.bottomBox {
			flex-direction: column;
			justify-content: center;
			width: 100px;
			height: 80vw;
			padding: 10px;
			// background-color: #007AFF;
			position: fixed;
			left: 50%;
			bottom: -40vw;
			transform: rotate(90deg);
			margin-left: -50px;
			margin-bottom: 72px;

			.btn {
				width: 100%;
				height: 37px;
				background: #F5F5F5;
				border-radius: 19px;
				text-align: center;
				line-height: 37px;
				color: #333333;
				font-size: 13px;

				&.blue {
					background: #0FB076;
					color: #fff;
				}
			}
		}
	}
</style>