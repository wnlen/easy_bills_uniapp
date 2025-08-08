<template>
  <view class="content">
    <web-view style="width: 100%" :src="feedId"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // finderUserName: "sphgIVBwvsJcDEZ",
      feedId: "",
      listD: [
        "https://res-oss.elist.com.cn/wxImg/handbook/2025video/video0-d.html",
        "https://res-oss.elist.com.cn/wxImg/handbook/2025video/video1-d.html",
        "https://res-oss.elist.com.cn/wxImg/handbook/2025video/video2-d.html",
        "https://res-oss.elist.com.cn/wxImg/handbook/2025video/video3-d.html",
      ],
      listR: [
        "https://res-oss.elist.com.cn/wxImg/handbook/2025video/video0-r.html",
        "https://res-oss.elist.com.cn/wxImg/handbook/2025video/video1-r.html",
        "https://res-oss.elist.com.cn/wxImg/handbook/2025video/video2-r.html",
        "https://res-oss.elist.com.cn/wxImg/handbook/2025video/video3-r.html",
      ],
    };
  },
  onLoad(option) {
    console.log("地址：", option.feedId);
    this.feedId =
      this.vuex_userRole == "D"
        ? this.listD[option.feedId]
        : this.listR[option.feedId];
  },
  methods: {},
};
</script>

<style>
.video-container {
  width: 100vw;
  /* 视口宽度 */
  height: 100vh;
  /* 视口高度 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

channel-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 保持视频比例并覆盖整个容器 */
}

.content {
  width: 100vw;
  height: 100vh;
}
</style>
