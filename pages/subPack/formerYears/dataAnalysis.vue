<template>
    <view class="content">
        <web-view :src="srcView"></web-view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            srcView: ''
        };
    },
    mounted() {},
    onLoad(option) {
        var work = this.vuex_user.data.work != '0';
        var phone = this.vuex_user.phone;
        var port = this.vuex_userRole;
        console.log('this.vuex_user.loginToken', this.vuex_user.loginToken);
        console.log('phone', this.phone);
        console.log('port', port);
        console.log('option', option);
        var href = 'https://www.upbill.cn/echarts/statistics?phone=' + phone + '&year=' + option.year + '&port=' + port + '&token=' + this.vuex_user.loginToken;
        this.srcView = href;
        console.log(href);
    },
    methods: {}
};
</script>

<style lang="scss" scoped></style>
