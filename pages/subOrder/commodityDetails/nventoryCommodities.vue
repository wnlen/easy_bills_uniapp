<template>
  <view class="modification">
    <z-paging
      ref="paging"
      use-virtual-list
      :force-close-inner-list="true"
      cell-height-mode="dynamic"
      @virtualListChange="virtualListChange"
      @query="queryList"
    >
      <template #top>
        <up-navbar
          :autoBack="true"
          :placeholder="true"
          bgColor="#00000000"
          :titleBold="true"
          :titleStyle="titleStyle"
          title="商品库"
        ></up-navbar>
        <view class="ml24 mr24 flex-row items-center justify-center pb30">
          <view
            class="flex-row items-center justify-center pl10 pr10"
            style="
              background: #ffffff;
              border-radius: 254rpx;
              width: 75%;
              height: 60rpx;
            "
          >
            <u-icon name="search" color="#01BB74" size="40rpx"></u-icon>
            <u-input
              :customStyle="{
                backgroundColor: 'transparent',
                marginLeft: '10rpx',
              }"
              :modelValue="SearchInventory"
              placeholder="请输入商品名称/规格"
              :clearable="true"
              border="none"
              @change="SearchInventoryChange"
            >
            </u-input>
          </view>
          <u-button
            @click="jumpAddCommodity"
            :custom-style="SearchCustomStyle"
            type="success"
            >添加商品</u-button
          >
        </view>
      </template>
      <view class="box1">
        <view class="invCard" v-for="(item, index) in orderList" :key="index">
          <view class="" @click="jumpCommodityDetails(item)">
            <u-image
              border-radius="12rpx"
              width="200rpx"
              height="200rpx"
              :show-menu-by-longpress="false"
              :src="
                item.img === 'definde'
                  ? 'https://res-oss.elist.com.cn/wxImg/order/emptyView.png'
                  : item.img
              "
            ></u-image>
          </view>
          <view class="invText" @click="jumpCommodityDetails(item)">
            <text>{{ item.description }}</text>
            <text>规格：{{ item.specification }}</text>
            <text>单位：{{ item.unit }}</text>
            <text
              >单价：{{
                item.unitPrice == "0" ? "-" : "￥" + item.unitPrice
              }}</text
            >
          </view>
          <view class="del_product_icon">
            <u-icon
              :stop="true"
              name="trash"
              color="#666666"
              size="40rpx"
              @click="delOrderBill(item)"
            ></u-icon>
          </view>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<script>
export default {
  data() {
    return {
      titleStyle: {
        fontSize: "34",
        fontWeight: "bold",
      },
      orderList: [],
      SearchInventory: "",
      SearchCustomStyle: {
        width: "120rpx",
        height: "60rpx",
        padding: "6rpx",
        marginLeft: "24rpx",
        fontSize: "24rpx",
      },
      bottomCustomStyle: {
        width: "216rpx",
        height: "80rpx",
        padding: "6rpx",
        marginLeft: "6rpx",
        position: "absolute",
        right: "24rpx",
        bottom: "25%",
      },
      uploadingCommodityInputStyle: {
        width: "100%",
        height: "100%",
        textAlign: "center",
      },
      shoppingTrolley: false,
      addList: [],
      orderItemList: [],
      options: [
        {
          text: "删除",
          style: {
            backgroundColor: "#dd524d",
          },
        },
      ],
      merchandiseInventory: {
        phone: "",
        staffNumber: "",
        description: "",
        specification: "",
        state: "1",
        pages: 0,
        size: 10,
      },
      totalPrices: 0,
    };
  },
  onLoad(option) {},
  onShow() {
    var work = this.vuex_user.data.work == "0";
    if (work) {
      //没工作
      this.merchandiseInventory.staffNumber = this.vuex_user.phone;
      this.merchandiseInventory.phone = this.vuex_user.phone;
    } else {
      this.merchandiseInventory.staffNumber = this.vuex_user.phone;
      this.merchandiseInventory.phone = this.vuex_user.workData.bossNumber;
    }
    this.$refs.paging.reload();
  },
  methods: {
    virtualListChange(vList) {
      this.orderList = vList;
    },
    queryList(pageNo, pageSize) {
      console.log(pageNo, pageSize);
      this.merchandiseInventory.pages = pageNo;
      this.getMerchandiseInventory();
    },
    getMerchandiseInventory() {
      this.$api.library
        .getCommodityList(this.merchandiseInventory)
        .then((res) => {
          console.log("res111111111", res);
          this.$refs.paging.complete(res.data.data);
        })
        .catch((res) => {
          this.$u.toast("获取失败");
        });
    },
    SearchInventoryChange(e) {
      console.log(e);
      this.merchandiseInventory.description = e;
      this.merchandiseInventory.specification = e;
      this.$refs.paging.reload();
    },
    queryListCheck() {},
    delOrderBill(item) {
      uni.showModal({
        title: "温馨提醒",
        content: "是否删除该商品?",
        showCancel: true,
        cancelText: "取消",
        confirmText: "确定",
        success: (res) => {
          var okif = res.confirm;
          if (okif) {
            this.$api.library
              .deleteCommodity(item)
              .then((res) => {
                this.$u.toast(res.data.message);
                this.$refs.paging.reload();
              })
              .catch((res) => {
                this.$u.toast("获取失败");
              });
          }
        },
      });
    },
    jumpAddCommodity() {
      uni.navigateTo({
        url: "../uploadingCommodity",
      });
    },
    jumpCommodityDetails(item) {
      uni.navigateTo({
        url: "commodityDetails?id=" + item.id,
      });
    },
    click(index, index1) {
      if (index1 == 0) {
        var order = this.orderItemList[index];
        this.orderItemList.splice(index, 1);
        this.$u.toast(`删除了${order.description}`);
      }
    },
    // 如果打开一个的时候，不需要关闭其他，则无需实现本方法
    open(index) {
      // 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
      // 原本为'false'，再次设置为'false'会无效
      this.orderItemList[index].show = true;
      this.orderItemList.map((val, idx) => {
        if (index != idx) this.orderItemList[idx].show = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.modification {
  width: 100vw;
  height: 100vh;
  opacity: 1;
  background: linear-gradient(0deg, rgba(243, 255, 247, 0) 14%, #edfff3 99%);
  overflow: hidden;
}

.box1 {
  // position: absolute;
  // width: 100%;
  // margin-top: 50rpx;
}

.invCard {
  box-shadow: 0rpx 2rpx 6rpx 0rpx rgba(216, 216, 216, 0.5);
  margin-right: 24rpx;
  margin-left: 24rpx;
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;

  .invText {
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: left;
    margin-left: 48rpx;
    width: 400rpx;
    // background-color: #aaffff;

    text:nth-child(1) {
      padding-bottom: 24rpx;
      font-size: 32rpx;
      font-weight: bold;
      line-height: 36rpx;
      letter-spacing: 0rpx;
      color: #3d3d3d;
    }

    text:not(:nth-child(1)) {
      font-size: 28rpx;
      font-weight: normal;
      line-height: 36rpx;
      letter-spacing: 0rpx;
      color: #999999;
      padding-bottom: 12rpx;
      padding-top: 4rpx;
      // background-color: red;
    }
  }

  .del_product_icon {
    position: absolute;
    right: 20rpx;
    bottom: 20rpx;
  }
}

.bottomCard {
  width: 100%;
  height: 10vh;

  display: flex;
  flex-direction: row;
  align-items: center;
  background: #ffffff;

  position: relative;

  box-shadow: 0rpx -2rpx 6rpx 0rpx rgba(0, 0, 0, 0.1);

  padding-left: 24rpx;
}

.OrderCard {
  display: flex;
  flex-direction: column;
  padding-left: 20rpx;
  padding-right: 20rpx;
  padding-bottom: 10rpx;
  padding-top: 25rpx;
  background-color: white;
  margin-bottom: 18rpx;
  position: relative;
  margin-left: 24rpx;
  margin-right: 24rpx;
  border-radius: 15rpx;
  box-shadow: 0rpx 7rpx 10rpx 0rpx rgba(51, 51, 51, 0.1);
}
</style>
