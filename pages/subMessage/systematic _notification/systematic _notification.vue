<template>
	<view class="vw100 vh100 bg-gray">
		<view>
			<u-navbar title="系统通知"></u-navbar>
			<view class="content">
			</view>
		</view>


		<u-card class="ml24 mr24 bg-white justify-center" :title="item.name" head-border-bottom="false"
			style="width: 94vw;" v-for="(item,index) in List" :key="index">
			<view class="" slot="body">
				<view class="u-body-item u-flex  u-col-between u-p-t-0" style="color: #AAAAAA;">
					<view class="u-body-item-title u-line-2">
						{{item.body}}
					</view>
				</view>
				<view class="u-body-item u-flex u-row-between u-p-b-0" @click="jump(item.jump.url)">
					<view class="u-body-item-title u-line-2 mt40" style="color: #01BB74;">{{item.jump.titel}}</view>
					<view class="" style="float: right;">
						<u-icon class="u-body-item-title u-line-2 mt40" name="arrow-right" color="#666666"
							size="28"></u-icon>
					</view>
				</view>
			</view>
		</u-card>


		<u-popup v-model="showAlertSJ" mode="center" border-radius="16">
			<view class="flex-col justify-center items-center" style="width: 300px;height: 400px; text-align: center;">
				<view class="" style="height: 150px;width: 150px;">
					<u-image width="100%" height="100%" src="https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/obj/sj.svg"></u-image>
				</view>
				<view class="mb10" style="color: #333333;font-size: 19.2px;font-weight: bold;">
					更新升级中
				</view>
				<view class="mb20" style="color: #AAAAAA;font-size: 14.2px;font-weight: bold;">
					易单据为您提供更加优质服务
				</view>

				<view class="mb20" style="width: 60%;">
					<u-line-progress :striped="true" :percent="70" :striped-active="true"></u-line-progress>
				</view>
				<view class="" style="color: #AAAAAA;font-size:12px;font-weight: bold;">
					正在努力下载...
				</view>
			</view>
		</u-popup>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				showAlertSJ: false,
				List: [{
					name: "系统通知",
					body: "已更新至2.0.33版本，修复了一些已知问题",
					jump: {
						titel: "更新升级",
						url: ""
					}
				}]
			}
		},
		methods: {
			jump(url) {
				this.showAlertSJ=true
				// uni.navigateTo({
				// 	url: "/pages/message/" + url
				// })
			}
		}
	}
</script>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		height: 85px;
		width: 100vw;
		background-color: #ffffff;
		border-bottom: 1px solid #eee;
	}

	.header-left {
		font-size: 15px;
		color: #333;
	}

	.header-title {
		font-size: 18px;
		font-weight: bold;
		color: #333;
		margin-right: 75px;
	}

	.header-message {
		font-size: 14px;
		color: #999;
	}
</style>