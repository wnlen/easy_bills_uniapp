<template>
  <view
    class="attestation"
    :style="{ backgroundImage: 'url(' + ImgUrl + '/wxImg/user/back.svg' + ')' }"
  >
    <u-navbar
      :autoBack="true"
      :placeholder="true"
      :border-bottom="false"
      back-icon-color="#000000"
      :titleBold="true"
      title-color="#000000"
      title="公司资料"
      title-size="34"
      :background="{
        background: 'transparent',
        color: 'white',
        fontSize: '28rpx',
      }"
    ></u-navbar>

    <image
      :src="ImgUrl + '/wxImg/user/back.png'"
      alt=""
      srcset=""
      style="
        position: absolute;
        top: 30rpx;
        width: 100vw;
        height: 100%;
        margin-top: 0vh;
        border-radius: 12rpx;
      "
    ></image>

    <view class="card" style="">
      <view class="" v-if="true" style="border-radius: border-radius: 12rpx;">
        <view
          class="flex-row items-center pt38"
          style="width: 100%; padding-left: 35rpx"
        >
          <u-image
            shape="circle"
            class="ml20"
            :show-menu-by-longpress="false"
            :src="vuex_user.data.headPortrait || '/static/img/obj/defind.svg'"
            width="100rpx"
            height="100rpx"
          ></u-image>
          <text
            class="ml10"
            style="font-weight: bold; color: #333333; font-size: 36rpx"
            >{{ userName(vuex_user.data.name) || "未设置" }}</text
          >
          <image
            class="ml15"
            :src="
              !qy
                ? ImgUrl + '/wxImg/order/no-is.svg'
                : ImgUrl + '/wxImg/order/yes-is.svg'
            "
            style="width: 80rpx; height: 50rpx"
          ></image>
        </view>
        <view
          class="flex-row items-center ml24 mr24 flex-row mb18"
          v-if="1 == 2"
          style="
            height: 6vh;
            background: rgba(1, 187, 116, 0.05);
            border-radius: 12rpx;
            position: relative;
            padding-left: 20rpx;
          "
        >
          <u-icon
            class="ml20"
            :name="ImgUrl + '/wxImg/user/sfz.svg'"
            size="30"
          ></u-icon>
          <text class="ml15" style="font-weight: 500; color: #333333"
            >身份证认证</text
          >
          <button
            class="ml48 mr20 flex-col justify-center"
            shape="circle"
            @click="jump(1)"
            style="
              background-color: #01bb74;
              color: white;
              width: 120rpx;
              height: 60rpx;
              font-size: 20rpx;
              align-items: center;
              position: absolute;
              right: 0;
              border-radius: 434rpx;
            "
          >
            去认证
          </button>
        </view>
        <!-- 				<view class="flex-row items-center card ml24 mr24 flex-row mb18"
					style="width: 93%;height: 6vh;background: rgba(1, 187, 116, 0.05);border-radius: 12rpx;position: relative; ">
					<u-icon class="ml20" name="/static/img/auth/rl.svg" size="30"></u-icon>
					<text class="ml15" style="font-weight: 500;color: #333333;">人脸认证</text>
					<button class="ml48 mr20 flex-col justify-center" shape="circle" @click="jump(2)"
						style="background-color: #01BB74;color: white;width: 120rpx;height: 60rpx;font-size: 20rpx;align-items: center;position: absolute;right: 0;border-radius: 434rpx;">去认证</button>
				</view> -->
        <view
          @click="jump(3)"
          class="flex-row items-center ml24 mr24 flex-row mb24 mt24"
          v-show="vuex_user.data.work == '0'"
          style="
            height: 10vh;
            background: #fffef9;
            border-radius: 12rpx;
            position: relative;
            box-shadow: 0rpx 2rpx 6rpx 0rpx rgba(205, 202, 186, 0.3);
            padding-left: 20rpx;
          "
        >
          <u-icon
            class="ml20"
            :name="ImgUrl + '/wxImg/user/qyrz.png'"
            size="45"
          ></u-icon>
          <text class="ml15" style="font-weight: 500; color: #333333"
            >公司资料</text
          >
          <button
            v-if="btnqy == 0"
            class="ml48 mr20 flex-col justify-center"
            shape="circle"
            style="
              color: white;
              width: 120rpx;
              height: 60rpx;
              font-size: 20rpx;
              align-items: center;
              position: absolute;
              right: 0;
              border-radius: 434rpx;
              background: linear-gradient(90deg, #242538 0%, #5a637e 118%);
            "
          >
            {{ btnqy == 0 ? "去完善" : "已完善" }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      btnqy: 0,
      qy: null,
    };
  },
  onShow() {
    this.loadData();
  },
  methods: {
    userName(str) {
      if (str.length > 7) {
        return str.slice(0, 7) + "...";
      } else {
        return str;
      }
    },
    loadData() {
      this.$api.order
        .getAccountStatistics({
          user: this.vuex_user.phone,
        })
        .then((res) => {
          console.log("认证状态==》", res.data);
          if (res.data.data != null) {
            this.btnqy = res.data.data.id != null ? 1 : 0;
          } else {
            this.btnqy = 0;
          }
        });
    },
    qiyeAuth() {
      const that = this;
    },
    jump(i) {
      if (i == 1) {
        uni.navigateTo({
          url: "/pages/subAuth/geti",
        });
      } else if (i == 2) {
        uni.navigateTo({
          url: "/pages/subAuth/rl",
        });
      } else {
        let url =
          this.btnqy == 0
            ? "/pages/subAuth/qiye?btn=0"
            : "/pages/subAuth/qiye?btn=3";
        uni.navigateTo({
          url: url,
        });
      }
    },
    addRoleSet() {
      this.$refs.popPartner.popShow = true;
    },
    deleteRole(val) {
      const that = this;
      uni.showModal({
        title: "温馨提示",
        content: "是否移除当前用户的合伙人身份？",
        cancelText: "再考虑下",
        confirmText: "确定移除",
        success: (res) => {
          if (res.confirm) {
          }
        },
      });
    },
    // 更换授权用户
    changeUser(val) {
      const that = this;
      uni.showModal({
        title: "离职账号迁移",
        cancelText: "取消",
        confirmText: "确定",
        editable: true,
        placeholderText: "请输入新账号手机号~",
        success: (res) => {
          if (res.confirm) {
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.nl-border {
  .u-border-bottom:last-of-type {
    padding-bottom: 0;
  }

  .u-border-bottom:last-of-type::after {
    display: none;
  }

  .u-border-bottom:first-of-type {
    padding-top: 0 !important;
  }
}

.attestation {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #ffffff;
  background-size: cover;
  position: relative;

  .card {
    height: 74vh;
    position: absolute;
    z-index: 2;
    border-radius: 26rpx;
    bottom: 0;
    background-color: white;
    left: 24rpx;
    right: 24rpx;
  }
}
</style>
