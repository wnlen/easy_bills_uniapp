<template>
  <view class="vw100 vh100 bg-gray">
    <view>
      <u-navbar
        :autoBack="true"
        :placeholder="true"
        title="系统通知"
      ></u-navbar>
      <view class="content"> </view>
    </view>

    <u-card
      class="ml24 mr24 bg-white justify-center"
      :title="item.name"
      head-border-bottom="false"
      style="width: 94vw"
      v-for="(item, index) in List"
      :key="index"
    >
      <view class="" slot="body">
        <view
          class="u-body-item u-flex u-col-between u-p-t-0"
          style="color: #aaaaaa"
        >
          <view class="u-body-item-title u-line-2">
            {{ item.body }}
          </view>
        </view>
        <view
          class="u-body-item u-flex u-row-between u-p-b-0"
          @click="jump(item.jump.url)"
        >
          <view
            class="u-body-item-title u-line-2 mt40"
            style="color: #01bb74"
            >{{ item.jump.titel }}</view
          >
          <view class="" style="float: right">
            <u-icon
              class="u-body-item-title u-line-2 mt40"
              name="arrow-right"
              color="#666666"
              size="28"
            ></u-icon>
          </view>
        </view>
      </view>
    </u-card>

    <u-popup v-model="showAlertSJ" mode="center" border-radius="16">
      <view
        class="flex-col justify-center items-center"
        style="width: 600rpx; height: 800rpx; text-align: center"
      >
        <view class="" style="height: 300rpx; width: 300rpx">
          <u-image
            width="100%"
            height="100%"
            src="https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/obj/sj.svg"
          ></u-image>
        </view>
        <view
          class="mb10"
          style="color: #333333; font-size: 38.4rpx; font-weight: bold"
        >
          更新升级中
        </view>
        <view
          class="mb20"
          style="color: #aaaaaa; font-size: 28.4rpx; font-weight: bold"
        >
          易单据为您提供更加优质服务
        </view>

        <view class="mb20" style="width: 60%">
          <u-line-progress
            :striped="true"
            :percent="70"
            :striped-active="true"
          ></u-line-progress>
        </view>
        <view
          class=""
          style="color: #aaaaaa; font-size: 24rpx; font-weight: bold"
        >
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
      List: [
        {
          name: "系统通知",
          body: "已更新至2.0.33版本，修复了一些已知问题",
          jump: {
            titel: "更新升级",
            url: "",
          },
        },
      ],
    };
  },
  methods: {
    jump(url) {
      this.showAlertSJ = true;
      // uni.navigateTo({
      // 	url: "/pages/message/" + url
      // })
    },
  },
};
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 170rpx;
  width: 100vw;
  background-color: #ffffff;
  border-bottom: 2rpx solid #eee;
}

.header-left {
  font-size: 30rpx;
  color: #333;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-right: 150rpx;
}

.header-message {
  font-size: 28rpx;
  color: #999;
}
</style>
