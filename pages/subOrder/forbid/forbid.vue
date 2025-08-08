<template>
  <view class="content">
    <u-navbar
      :autoBack="true"
      :placeholder="true"
      :custom-back="rightClick"
      :border-bottom="false"
      :titleBold="true"
      title-color="#000000"
      title="一键开单"
      title-size="34"
      bgColor="#ffffff"
    >
    </u-navbar>
    <view class="">
      <view
        class="flex-col items-center absolute"
        style="width: 100%; top: 30%"
      >
        <u-image
          src="https://res-oss.elist.com.cn/wxImg/order/cw.svg"
          width="600rpx"
          height="300rpx"
        ></u-image>
        <view
          class="absolute"
          style="bottom: -300rpx; color: #aaaaaa; font-size: 28rpx"
        >
          <view class="hand"> 您暂无权限~ </view>
          <view class="title"> 一键开单权益已到期，请联系 </view>
          <view class="title"> 主账号进行购买 </view>
          <view class="button" @click="back"> 返回首页 </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    rightClick() {},
    back() {
      uni.switchTab({
        url: "/pages/index/index",
      });
    },
  },
};
</script>

<style scoped>
.content {
  width: 100vw;
  height: 100vh;
  /* background-color: aqua; */
}

.title {
  font-size: 28rpx;
  color: #e6e6e6;
}

.hand {
  font-size: 36rpx;
  font-weight: 500;
  line-height: 44rpx;
  text-align: center;
  letter-spacing: 0rpx;
  font-feature-settings: "kern" on;
  color: #01bb74;

  padding-bottom: 20rpx;
}

.button {
  width: 380rpx;
  height: 90rpx;
  border-radius: 376rpx;
  opacity: 1;
  background: #01bb74;

  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;

  font-size: 36rpx;

  margin-top: 20rpx;
}
</style>
