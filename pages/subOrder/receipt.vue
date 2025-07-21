<template>
	<view class="vh100 vw100 fixed-bar-height  flex-col justify-center items-center">
		<u-navbar :border-bottom="false" :titleBold="true" title-color="#000000" :title="title" title-size="34"
			bgColor="#ffffff">
		</u-navbar>
		<u-image :src="OperatingSystem?systemImg.ios:systemImg.az" width="300px" height="200px"></u-image>
		<text class="mt30" style="color: #AAAAAA;">正在开发中~</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "",
				OperatingSystem: false,
				systemImg: {
					ios: "https://res-oss.elist.com.cn/wxImg/user/exploit.png",
					az: "https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/user/empty.svg"
				}
			}
		},
		onShow() {
			this.OperatingSystem = this.getOperatingSystem()
		},
		onLoad(option) {
			console.log(option.tid);
			this.title = option.tid
		},
		methods: {
			getOperatingSystem() {
				let systemInfo = uni.getSystemInfoSync();
				console.log("systemInfo:", systemInfo);
				if (systemInfo.system.toLowerCase().includes('ios')) {
					return true;
				}
				// iOS detection from: http://stackoverflow.com/a/9039885/177710  
				if (systemInfo.system.toLowerCase().includes('android')) {
					return false;
				}
			}
		}
	}
</script>

<style lang="scss">

</style>