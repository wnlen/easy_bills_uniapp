<template>
    <view>
        <view class="header">
            <view class="header-left ml20 flex-row" style="width: 100vw">
                <u-icon name="arrow-left" color="#000000" size="40" @click="Reba"></u-icon>
                <u-search
                    search-icon-color="#dcdcdc"
                    :show-action="false"
                    placeholder="请输入货品名称/关键字搜索"
                    :animation="true"
                    maxlength="30"
                    shape="round"
                    class="u-search ml15"
                    height="60"
                    bg-color="#F4F4F4"
                    style="width: 65vw"
                ></u-search>
            </view>
        </view>

        <view class="vw100 flex-row items-center mt30">
            <!-- 			<view class="mt20 ml24 flex-row justify-between" style="font-size: 16px;font-weight: bold;background-color: aquamarine;">
				历史搜索
				<view class="" style="font-size: 14px;font-weight: normal;width: 80vw;height: 100%;background-color: bisque;">
					<view @click="isLook = !isLook">
						<u-icon v-if="isLook" name="eye-fill" size="35"></u-icon>
						<u-icon v-else name="eye-off" size="35"></u-icon>
					</view>
					<view class="flex-col justify-start" style="font-size: 14px;font-weight: normal;float: right;">
						<u-icon name="trash" color="#000000" size="28rpx"></u-icon>
					</view>
				</view>
			</view> -->
            <view class="mt20 ml24 flex-row justify-between" style="font-size: 16px; font-weight: bold; display: flex; align-items: center; width: 90vw">
                <view class="flex-row justify-start" style="font-size: 14px; font-weight: normal">
                    历史搜索
                    <view class="flex-col justify-start ml10" style="font-size: 14px; font-weight: normal" @click="isLook = !isLook">
                        <u-icon v-if="isLook" name="eye-fill" size="35"></u-icon>
                        <u-icon v-else name="eye-off" size="35"></u-icon>
                    </view>
                </view>

                <view class="flex-col justify-start" style="font-size: 14px; font-weight: normal">
                    <view class="flex-row justify-between" style="font-size: 14px; font-weight: normal; float: right">
                        <u-icon name="trash" color="#000000" size="40rpx"></u-icon>
                    </view>
                </view>
            </view>
        </view>

        <view class="ml24 mr24 vw100 mt30 flex-row" v-if="isLook">
            <view class="pd10 ml15" style="border-radius: 16px; background-color: #f4f4f4; width: 100px; text-align: center; align-items: center">上海机械厂</view>

            <view class="pd10 ml15" style="border-radius: 16px; background-color: #f4f4f4; width: 100px; text-align: center; align-items: center">上海机械厂</view>

            <view class="pd10 ml15" style="border-radius: 16px; background-color: #f4f4f4; width: 100px; text-align: center; align-items: center">上海机械厂</view>
        </view>

        <view class="mt20 ml24 flex-row justify-between mt40" style="font-size: 16px; font-weight: bold; display: flex; align-items: center; width: 90vw">
            <view class="flex-row justify-start" style="font-size: 14px; font-weight: normal">推荐搜索</view>

            <view class="flex-col justify-start" style="font-size: 14px; font-weight: normal">
                <view class="flex-row justify-between" style="font-size: 14px; font-weight: normal; float: right">
                    <u-icon name="reload" color="#000000" size="40rpx"></u-icon>
                </view>
            </view>
        </view>

        <view class="ml24 mr24 mt30 flex-row" v-if="isLook" style="width: 100vw">
            <view class="pd10 ml15" style="border-radius: 16px; background-color: #f4f4f4; width: 100px; text-align: center; align-items: center">上海机械厂</view>

            <view class="pd10 ml15" style="border-radius: 16px; background-color: #f4f4f4; width: 100px; text-align: center; align-items: center">上海机械厂</view>

            <view class="pd10 ml15" style="border-radius: 16px; background-color: #f4f4f4; width: 100px; text-align: center; align-items: center">上海机械厂</view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            isLook: true
        };
    },
    methods: {
        seach(e) {
            console.log(e);
        },
        Reba() {
            uni.navigateBack();
        }
    }
};
</script>

<style>
.header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 85px;
    width: 100vw;
    background-color: #ffffff;
    /* border-bottom: 1px solid #eee; */
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
