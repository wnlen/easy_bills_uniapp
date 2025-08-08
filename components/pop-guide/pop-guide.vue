<template>
    <view v-if="show" class="guide-remark white">
        <view class="box" :style="[functionGuideData.position]">
            <view class="tips flex" :style="[functionGuideData.tipsPosition]" @click="next" style="width: 237px; height: 132px; background-size: cover"></view>
        </view>
    </view>
</template>

<script>
let timer = null;
let flag = false;
export default {
    name: 'pop-guide',
    props: {
        maxStep: {
            type: Number,
            default: 3
        },
        guideData: {
            type: Object,
            default: () => {
                return {
                    step: 0,
                    tips: '', // 介绍
                    tipsPosition: '', // 介绍 显示位置
                    btnGroupPosition: '', // 按钮组显示位置
                    position: {}
                };
            }
        }
    },
    data() {
        return {
            show: false,
            functionGuideData: {}
        };
    },
    watch: {
        guideData: {
            deep: true,
            immediate: false,
            handler(data) {
                this.functionGuideData = data;
            }
        }
    },
    methods: {
        init() {
            if (this.show) return;
            setTimeout(() => {
                // const show = uni.getStorageSync('showGuide')
                const show = false;
                if (!show) {
                    this.show = true;
                    this.$parent.setFunctionGuideData({
                        step: 1
                    });
                }
            }, 1000);
        },
        jump() {
            this.$parent.setFunctionGuideData({
                step: 'jump'
            });
            this.setFunctionGuideState();
        },
        next() {
            this.throttle(() => {
                if (this.functionGuideData.step == this.maxStep) {
                    this.jump();
                    return;
                }
                let step = this.functionGuideData.step;
                this.$parent.setFunctionGuideData({
                    step: step + 1
                });
            }, 500);

            console.log(this.functionGuideData.step);

            var port = this.vuex_userRole == 'D';
            if (port) {
                if (this.$parent.guidancePage == 1) {
                    //修改数据库
                    console.log('数据修改');
                    this.GuidanceDR(port);
                } else {
                    if (this.functionGuideData.step == 3) {
                        uni.setStorageSync('guidance', 1);
                        if (uni.getStorageSync('guidance') != '') {
                            uni.switchTab({
                                url: '/pages/user/index'
                            });
                        }
                    }
                }
            } else {
                //收货端
                if (this.functionGuideData.step == 3) {
                    this.GuidanceDR(port);
                }
            }
        },
        GuidanceDR(port) {
            var dx = {
                phoneNumber: this.vuex_user.phone,
                guidanceD: port ? 0 : 1,
                guidanceR: port ? 1 : 0,
                port: this.vuex_userRole
            };
            this.show = false;
            this.$loadUser(this);
            this.$api.user.userGuidance(dx).then((res) => {});
        },
        setFunctionGuideState() {
            this.show = false;
        },

        /* 节流 */
        throttle(fn) {
            if (!flag) {
                flag = true;
                typeof fn === 'function' && fn();
                timer = setTimeout(() => {
                    flag = false;
                }, 500);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.plus {
    width: 140rpx;
    height: 2rpx;
    position: relative;

    .in-border {
        border: 2rpx dashed #fff;
        width: 110rpx;
        height: 110rpx;
        border-radius: 50%;
        position: absolute;
        left: 10rpx;
        top: -55rpx;
    }

    .plus-icon {
        background: #fff;
        border-radius: 50%;
        overflow: hidden;
        width: 92rpx;
        height: 92rpx;
    }
}

.guide-remark {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 20230828;

    .box {
        position: absolute;
        z-index: 10;
        width: 686rpx;
        border-radius: 24rpx;
        box-shadow: 0 0 0 100vh rgba(0, 0, 0, 0.6);
        transition: all 0.3s ease;

        .tips {
            width: 100%;
            background: transparent;
            border-radius: 24rpx;
            padding: 20rpx 50rpx;
            box-sizing: border-box;
            position: absolute;

            top: -110rpx;
            z-index: 2;
            font-size: 28rpx;
            transition: top 0.3s ease;
        }

        .btn-group {
            width: 100%;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            font-size: 32rpx;
            z-index: 2;
            transition: bottom 0.3s ease;

            .btn {
                width: 240rpx;
                height: 84rpx;
                border-radius: 52rpx;
                border: 2rpx solid #ffffff;
                background: #fff;
                margin: 0 30rpx;
            }
        }
    }
}

.flex {
    display: flex;
    align-items: center;
}

.flex_center {
    @extend .flex;
    justify-content: center;
}
</style>
