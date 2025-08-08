<template>
  <view class="popAnnouncement" v-show="popAnnouncement">
    <up-overlay :show="popAnnouncement">
      <view class="pop">
        <view class="pop_card">
          <view class="pop_card_hand">
            <text class="_hand">公告</text>
          </view>
          <view
            class="pop_card_text"
            v-html="announcement ? announcement.announcementText : ''"
          >
          </view>
          <view class="pop_card_btn" @click="exit">
            <view class="pop_card_btn_sty">
              <view class="_sty">
                {{ announcement ? announcement.announcementBtnText : "确认" }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </up-overlay>
  </view>
</template>

<script>
export default {
  name: "pop-announcement",
  data() {
    return {
      popAnnouncement: false,
      customStyle: {
        marginLeft: "48rpx",
        marginRight: "48rpx",
      },
      text: "亲爱的易单据用户：特别提醒您，我们已将24年订单全部迁移至【更多功能】-【往年数据】处，在这里，您可以轻松查阅过往年份订单数据。<br>如有任何疑问，请随时联系我们，感谢您的支持。",
    };
  },
  methods: {
    exit() {
      var announcement = this.announcement;
      this.$loadUser(this);
      //已读标记
      this.popAnnouncement = false;
      var dx = {
        announcementId: announcement.id,
        phone: this.vuex_user.phone,
        state: 1,
        announcementRead: 1,
        createTime: new Date(),
      };
      this.$api.announcement.addAnnouncement(dx).then((res) => {
        console.log(dx);
      });

      var path = this.announcement.announcementBtnPath;
      if (path != null && path != undefined && path != "") {
        uni.navigateTo({
          url: this.announcement.announcementBtnPath,
        });
      }
    },
  },
};
</script>

<style lang="scss">
.popAnnouncement {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;

  .pop {
    width: 100%;
    height: 100%;
    background-color: transparent;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .pop_card {
      width: 65%;
      height: 30%;
      border-radius: 14px;
      background-image: url("https://res-oss.elist.com.cn/wxImg/user/dqalert.png");
      background-size: cover;
      position: relative;

      .pop_card_hand {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        width: 100%;

        position: absolute;
        top: 0;
        height: 60px;
        font-size: 20px;
        font-size: 20px;

        ._hand {
          color: #ff8f1f;
          position: relative;
          display: inline-block;
          text-align: center;
          // background-color: aqua;
          /* 可选，用于确保标题文本居中 */
        }

        ._hand::before,
        ._hand::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 20px;
          /* 线条的宽度，可以根据需要调整 */
          height: 1rpx;
          /* 线条的高度，可以根据需要调整 */
          background-color: #ff8f1f;
          /* 线条的颜色，可以根据需要调整 */
        }

        ._hand::before {
          left: -30px;
          /* 根据线条宽度和标题的padding/margin调整 */
        }

        ._hand::after {
          right: -30px;
          /* 根据线条宽度和标题的padding/margin调整 */
        }
      }

      .pop_card_text {
        position: absolute;
        // background-color: #F18341;
        margin-top: 50px;

        font-size: 13px;
        font-weight: normal;
        line-height: 22px;
        letter-spacing: 0em;

        overflow-y: auto;
        max-height: 130px;

        padding-left: 24rpx;
        padding-right: 24rpx;

        color: #666666;
      }

      .pop_card_text::v-deep ::-webkit-scrollbar {
        display: none;
        width: 0 !important;
        height: 0 !important;
        -webkit-appearance: none;
        background: transparent;
      }

      .pop_card_btn {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        bottom: 0;
        height: 80px;
        width: 100%;
        padding-top: 30rpx;

        .pop_card_btn_sty {
          background: linear-gradient(0deg, #f18341 -17%, #ffb963 100%);
          width: 160px;
          height: 40px;
          box-shadow: 0px 1px 3px 0px rgba(222, 118, 14, 0.2);
          border-radius: 380px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;

          ._sty {
            width: 142px;
            height: 30px;
            font-size: 14px;
            font-weight: bold;
            background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.2) 0%,
              rgba(255, 255, 255, 0) 68%
            );
            border-radius: 220px;
            color: white;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
