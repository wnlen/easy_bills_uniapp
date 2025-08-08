<template>
    <view v-show="authShow" class="flex-col justify-center items-center pop-wrap">
        <view
            class="radius flex-col justify-center items-center relative"
            style="
                height: 37vh;
                background-image: url('https://res-oss.elist.com.cn/wxImg/order/auth.png');
                background-size: cover;
                border-radius: 19px;
                width: 75%;
                margin-top: 200px;
            "
        >
            <u-icon @click="close" name="https://res-oss.elist.com.cn/wxImg/order/cha.png" style="right: 0; top: 20px" class="absolute" size="40"></u-icon>

            <view class="flex-col justify-center items-center absolute" style="bottom: 10px">
                <view class="color">完善开单信息</view>
                <view class="mt15 title ml60 mr60">您还未填写公司信息，为保证单据信息的完整性，请您填写信息</view>

                <view
                    class="flex-col justify-center items-center mt25"
                    style="
                        background-image: url(https://res-oss.elist.com.cn/wxImg/order/auth-btn.png);
                        background-size: cover;
                        width: 70%;
                        height: 60px;
                        color: #ffffff;
                        font-size: 14px;
                        font-weight: bold;
                        line-height: normal;
                        letter-spacing: 0em;
                    "
                    @click="jump"
                >
                    立即完善
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'pop-auth',
    data() {
        return {
            authShow: false
        };
    },
    onLoad() {},
    methods: {
        // popClose() {
        // 	this.authShow=false;
        // },
        getiAuth() {},
        qiyeAuth() {
            const that = this;
        },
        jump() {
            uni.setStorageSync('auth', '1');
            uni.navigateTo({
                url: '/pages/subAuth/auth?open=1'
            });
        },
        close() {
            this.authShow = false;
            uni.setStorageSync('auth', '1');
        }
    }
};
</script>

<style lang="scss">
.pop-wrap {
    position: fixed;
    top: -220px;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10000000000000;
    background: rgba(0, 0, 0, 0.5);
    opacity: 1;
    transition: all 0.5s ease;

    &.hides {
        opacity: 0;
    }
}

.color {
    color: #333333;
    font-size: 20px;
    font-weight: 500;
    line-height: normal;
    text-align: center;
    letter-spacing: 0em;
}

.title {
    font-family: Source Han Sans;
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    text-align: center;
    letter-spacing: 0em;
    color: #999999;
}
</style>
