<template>
  <view>
    <!-- 自定义tab -->
    <u-tabbar :value="tabIndex" activeColor="#01BB74" @change="changeTab">
      <up-tabbar-item
        :text="item.text"
        v-for="(item, index) in tabbar"
        :key="index"
      >
        <template #active-icon>
          <image
            style="width: 46rpx"
            mode="widthFix"
            class="u-page__item__slot-icon"
            :src="item.selectedIconPath"
          ></image>
        </template>
        <template #inactive-icon>
          <image
            :id="index == 1 ? 'box4' : ''"
            style="width: 46rpx"
            mode="widthFix"
            class="u-page__item__slot-icon"
            :src="item.iconPath"
          >
          </image>
        </template>
      </up-tabbar-item>
    </u-tabbar>
  </view>
</template>

<script>
export default {
  name: "uni-tab",
  props: {
    tabIndex: {
      type: Number, // 设置数据类型为 Number
      default: 0, // 设置默认值
    },
  },
  data() {
    return {
      tabbar: [
        {
          iconPath: "/static/images/tab/tab-home.png",
          selectedIconPath: "/static/images/tab/tab-home-active.png",
          text: "首页",
          counts: "",
          pagePath: "/pages/index/index",
          customIcon: false,
        },
        {
          iconPath: "/static/images/tab/tab-list.png",
          selectedIconPath: "/static/images/tab/tab-list-active.png",
          text: "查单",
          midButton: true,
          pagePath: "/pages/list/list",
        },
        {
          iconPath: "/static/images/tab/message-out.png",
          selectedIconPath: "/static/images/tab/message-blur.png",
          text: "消息",
          count: 0,
          midButton: true,
          pagePath: "/pages/message/message",
        },
        {
          iconPath: "/static/images/tab/tab-my.png",
          selectedIconPath: "/static/images/tab/tab-my-active.png",
          text: "我的",
          pagePath: "/pages/user/index",
        },
      ],
    };
  },
  methods: {
    changeTab(e) {
      uni.switchTab({
        url: this.tabbar[e].pagePath,
      });
    },
  },
};
</script>

<style></style>
