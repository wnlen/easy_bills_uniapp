<template>
    <view class="Print flex-col justify-start items-center">
        <view class="mt20" style="width: 90%">
            <u-input border="none" v-model="value" :placeholder="placeholder" maxlength="6" type="text" :border="true"></u-input>
        </view>

        <view class="mt20" style="width: 90%">
            <u-collapse :head-style="headstyle" arrow-color="#CCC">
                <u-collapse-item :title="item.head" v-for="(item, index) in itemList" :key="index">
                    <view class="mt20" style="width: 90%">
                        <u-input border="none" v-model="wifiName" placeholder="请输入无线网名称" maxlength="30" type="text" :border="true"></u-input>
                    </view>
                    <view class="mt20" style="width: 90%">
                        <u-input border="none" v-model="wifiPass" placeholder="请输入无线网密码" maxlength="20" type="password" :border="true"></u-input>
                    </view>
                    <view class="mt20" style="width: 90%; color: red; font-size: 24rpx">修改后请联系客服进行配置修改!!!</view>
                </u-collapse-item>
            </u-collapse>
        </view>

        <view class="flex-col justify-center pl60 pr60 pb60 pt60 vw100" style="position: absolute; bottom: 0">
            <u-button hover-class="none" :custom-style="{ backgroundColor: '#01BB74' }" shape="circle" type="primary" @click="updateInfo">确认修改</u-button>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            value: '',
            wifiName: '',
            wifiPass: '',
            headstyle: {
                fontSize: '26rpx',
                color: '#CCC'
            },
            placeholder: '请输入设备名称',
            id: '',
            itemList: [
                {
                    head: '修改网络配置',
                    body: '只要我们正确择取一个合适的参照物乃至稍降一格去看待他人，值得赏识的东西便会扑面而来',
                    open: true,
                    disabled: true
                }
            ]
        };
    },
    onLoad(option) {
        console.log('option：', option.id);
        this.id = option.id;
    },
    methods: {
        updateInfo() {
            console.log('修改名称：', this.value);

            if (this.wifiPass.length != 0 && this.wifiName.length == 0) {
                this.$u.toast('请输入无线网名称');
                return;
            }

            if (this.wifiPass.length == 0 && this.wifiName.length != 0) {
                if (this.wifiPass.length < 8) {
                    this.$u.toast('请输入不少于8位的密码');
                }
                return;
            }

            if (this.wifiPass.length != 0 && this.wifiName.length != 0) {
                if (this.wifiPass.length < 8) {
                    this.$u.toast('请输入不少于8位的密码');
                    return;
                }
            }

            if (this.value.length <= 0) {
                this.$u.toast('请输入设备名称');
                return;
            }

            var dx = {
                id: this.id,
                name: this.value,
                wireless: this.wifiName,
                wirelessPassword: this.wifiPass
            };

            this.$api.printer.updatePrinterName(dx).then((res) => {
                var up = res.data;
                if (up == '1') {
                    uni.navigateBack();
                } else {
                    uni.showToast({
                        title: '操作失败',
                        icon: 'error',
                        duration: 2000 // 持续时间，单位毫秒，默认为 1500
                    });
                }
                console.log('修改名称：', res);
            });
        },
        alertMess(title) {
            uni.showToast({
                title: title,
                icon: 'error',
                duration: 2000 // 持续时间，单位毫秒，默认为 1500
            });
        }
    }
};
</script>

<style>
.Print {
    width: 100vw;
    height: 100vh;
}
</style>
