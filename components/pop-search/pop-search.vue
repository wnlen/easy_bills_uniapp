<template>
    <view class="Card cardShow">
        <view class="InputCard">
            <view class="InputOne">
                <text class="ft11 ft-gray ml20" style="background-color: transparent" @click="choice">
                    {{ vuex_userRole === 'R' ? InputOneName.a : InputOneName.b }}
                </text>
                <view class="ml10 mr10">
                    <u-icon name="/static/img/list/sx.svg" size="40rpx"></u-icon>
                </view>

                <view class="my-input">
                    <u-input
                        border="none"
                        @change="InputTextOne"
                        v-model="InputOneText"
                        :customStyle="{ backgroundColor: 'transparent' }"
                        :placeholder="vuex_userRole === 'R' ? InputOneName.a : InputOneName.b"
                        clearable="true"
                    ></u-input>
                </view>

                <view class="flex-col justify-center items-center" style="height: 5vh">
                    <view class="ml40"><u-icon name="/static/img/list/lxr.svg" size="45rpx" @click="choice"></u-icon></view>
                </view>
            </view>

            <view class="InputOne">
                <text class="ft11 ft-gray ml20" @click="openSearchTj">
                    {{ InputOneName.c }}
                </text>
                <view class="ml10 mr10" style="right: 0; top: 40rpx">
                    <u-icon name="/static/img/list/sj.svg" size="40rpx"></u-icon>
                </view>

                <view class="my-input">
                    <u-input border="none" v-if="showTage !== '1'" v-model="field" @change="searchListenner" placeholder="输入关键字进行检索"></u-input>
                </view>
                <view class="ml24 my-input">
                    <u-input border="none" v-if="showTage === '1'" maxlength="11" v-model="field" @change="searchListenner" placeholder="输入号码进行检索"></u-input>
                </view>

                <view class="flex-col justify-center items-center ml40" style="height: 5vh">
                    <u-icon name="/static/img/list/ss.svg" size="45rpx" @click="SearchBtn"></u-icon>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        InputOneName: {
            type: Object,
            default: {
                a: '供应商选择',
                b: '客户选择',
                c: '条件筛选'
            }
        }
    },
    name: 'pop-search',
    data() {
        return {
            InputOneText: ''
        };
    },
    methods: {
        openSearchTj() {
            this.$parent.openSearchTj();
        },
        choice() {
            uni.navigateTo({
                url: '/pages/subOrder/table?show=0'
            });
        },
        InputTextOne(text) {
            console.log(text);
        }
    }
};
</script>

<style scoped lang="scss">
.Card {
    width: 94%;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 14rpx;
    padding: 20rpx;
    margin-left: 3%;
    margin-top: 25rpx;

    .priceCard {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .InputCard {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-top: 10rpx;

        .InputOne {
            background-color: #f9f9f9;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: left;
            border-radius: 24rpx;
            margin-top: 20rpx;
            padding-right: 20rpx;
        }
    }
}
</style>
