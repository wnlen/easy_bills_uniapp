<template>
    <view style="padding-top: 200px;">
       <button open-type="contact" class="pos" >客服</button>
    </view>
</template>

<script>
export default {
    methods: {
        jumpToCustomerService() {
            uni.navigateToMiniProgram({
                appId: 'wx782c26e4c19acffb', // 微信客服小程序的固定 AppID
                success(res) {
                    console.log('成功跳转至微信客服小程序', res);
                },
                fail(err) {
                    console.error('跳转微信客服小程序失败', err);
                }
            });
        }
    }
};
</script>    