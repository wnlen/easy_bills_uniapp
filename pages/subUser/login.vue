<template>
    <view
        class="vh100 vw100 flex-col items-center justify-center"
        style="background-size: cover; background-image: url('https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/user/login.png')"
    >
        <!-- #ifdef MP-WEIXIN -->
        <view class="absolute" style="left: 48rpx; top: 120rpx; color: #333333" @click="experience">暂不登录</view>
        <view class="form-wrap width60 flex-col items-center" style="top: 400rpx">
            <u-image class="login-logo" width="400rpx" src="https://res-oss.elist.com.cn/wxImg/user/logoLogin.svg" mode="widthFix"></u-image>
            <view class="width100 pt100 pb60">
                <u-button
                    type="primary"
                    hover-class="none"
                    :custom-style="{ backgroundColor: '#01BB74' }"
                    class="form-btn-big"
                    shape="circle"
                    size="default"
                    open-type="getPhoneNumber"
                    @getphonenumber="(e) => getPhoneNumber(e)"
                    @click=""
                >
                    <u-icon name="" size="25" label="手机号快捷登录" labelColor="#fff" labelSize="16"></u-icon>
                </u-button>
                <view class="width100 justify-center items-center flex-row pt30" style="font-size: 20rpx">
                    <view
                        class="flex-col justify-center items-center"
                        :style="{ backgroundColor: disabled ? '#01BB74' : '#ffffff' }"
                        @click="radioGroupChange"
                        style="border-radius: 100rpx; height: 40rpx; width: 40rpx; border: 2rpx solid #aaaaaa"
                    >
                        <u-icon name="checkbox-mark" color="#ffffff" size="28rpx"></u-icon>
                    </view>
                    <view class="ml15">
                        <text style="color: #aaaaaa; font-size: 24rpx">同意并遵行易单据</text>
                        <text style="color: #01bb74; font-size: 24rpx" @top.stop @click="jump(0)">《用户服务协议》</text>
                        <text style="color: #aaaaaa; font-size: 24rpx">和</text>
                        <text style="color: #01bb74; font-size: 24rpx" @top.stop @click="jump(1)">《隐私政策》</text>
                    </view>
                </view>
            </view>
        </view>

        <u-popup :show="roleShow" mode="bottom" border-radius="14" height="800rpx" :closeable="true" :mask-close-able="false">
            <view class="pd36 flex-col justify-center items-center">
                <text class="ft30 ft-bold ft-green mb10" style="color: #01bb74; font-size: 40rpx; font-weight: bold">切换用户角色</text>
                <text class="ft-gray pb48">随时切换您的收发货角色，快速收发单</text>
                <view class="vw100 flex-row" style="height: 400rpx">
                    <view class=""></view>
                    <view class="" style="height: 500rpx; width: 40%; margin-left: 8%; margin-right: 2%; border: 2rpx solid #01bb74; border-radius: 24rpx" @click="roleQH(0)">
                        <!-- <u-image v-show="role==0" border-radius="20" width="100%" height="100%"
							src="/static/images/role01.svg"></u-image> -->
                        <!-- <u-image v-show="role!=0" border-radius="20" width="100%" height="100%"
							src="/static/images/role00.svg"></u-image> -->
                    </view>
                    <view class="" style="height: 500rpx; width: 40%; border: 2rpx solid #01bb74; border-radius: 24rpx" @click="roleQH(1)">
                        <!-- <u-image v-show="role==1" border-radius="20" width="100%" height="100%"
							src="/static/images/role03.svg"></u-image>
						<u-image v-show="role!=1" border-radius="20" width="100%" height="100%"
							src="/static/images/role02.svg"></u-image> -->
                    </view>
                </view>
                <view class="" style="margin-top: 8vh; width: 80vw">
                    <u-button class="width100" type="primary" shape="circle" @click="submitRole">确定</u-button>
                </view>
            </view>
        </u-popup>
        <!-- #endif -->

        <!-- #ifdef APP -->
        <view class="flex-col justify-center items-center pb350" style="width: 100%">
            <view class="head">
                <view class="headline">欢迎登录</view>
            </view>
            <view class="InputTab">
                <view class="headlineInput">手机号</view>
                <view class="Input">
                    <input
                        placeholder-class="placeholder_class"
                        v-model="fromLogin.phoneNumber"
                        type="number"
                        maxlength="11"
                        placeholder="请输入手机号"
                        class="u-line-1 ml15 endcolor"
                        @focus="phoneNumberFocusInput"
                    />
                </view>
                <text class="err ml24" v-if="phoneNumberErr">请输入手机号码</text>
            </view>
            <view class="InputTab">
                <view class="headlineInput">密码</view>
                <view class="Input">
                    <input
                        placeholder-class="placeholder_class"
                        v-model="fromLogin.password"
                        :type="eyePassword ? 'password' : 'text'"
                        maxlength="10"
                        placeholder="请输入密码"
                        @focus="passsswordFocusInput"
                        class="u-line-1 ml15 endcolor"
                    />
                    <u-icon v-if="eyePassword" @click="eyePassword = !eyePassword" name="eye-off" color="#01BB74" size="35"></u-icon>
                    <u-icon v-if="!eyePassword" @click="eyePassword = !eyePassword" name="eye-fill" color="#01BB74" size="35"></u-icon>
                </view>
                <text class="err ml24" v-if="passsswordErr">请输入密码</text>
                <view class="headlineEnd mb36" v-if="err">
                    <u-text class="ts" @click="ZC">手机号或密码错误，请重新输入!!!</u-text>
                </view>
                <view class="headlineEnd">
                    <u-text class="left" @click="ZC">立即注册</u-text>
                    <u-text class="right" @click="wjPassword">忘记密码?</u-text>
                </view>
            </view>
            <view class="buttonTab">
                <view class="button" @click="LoginImport">立即登录</view>
            </view>
            <view class="yszc" style="font-size: 20rpx">
                <view
                    class="flex-col justify-center items-center"
                    :style="{ backgroundColor: disabled ? '#01BB74' : '#ffffff' }"
                    @click="radioGroupChange"
                    style="border-radius: 100rpx; height: 30rpx; width: 30rpx; border: 2rpx solid #aaaaaa"
                >
                    <u-icon name="checkbox-mark" color="#ffffff" size="28rpx"></u-icon>
                </view>
                <view class="ml15">
                    <text style="color: #aaaaaa; font-size: 24rpx">同意并遵行易单据</text>
                    <text style="color: #01bb74; font-size: 24rpx" @top.stop @click="jump(0)">《用户服务协议》</text>
                    <text style="color: #aaaaaa; font-size: 24rpx">和</text>
                    <text style="color: #01bb74; font-size: 24rpx" @top.stop @click="jump(1)">《隐私政策》</text>
                </view>
            </view>

            <view class="module">
                <view class="yjdl" @click="oneKeyLogin">本机号码一键登录</view>
                <view class="mt20" style="color: #aaaaaa; font-size: 24rpx; text-align: center">第三方登录</view>
                <view class="mt10 flex-row justify-center items-center" style="text-align: center">
                    <view class="flex-row justify-center items-center" style="background-color: #20c300; height: 120rpx; width: 120rpx; border-radius: 50%" @click="wxloginInit">
                        <u-icon name="weixin-fill" color="#ffffff" size="100"></u-icon>
                    </view>
                </view>
            </view>
        </view>
        <!-- #endif -->
        <!-- 切换角色 -->
    </view>
</template>

<script>
export default {
    data() {
        return {
            xy: ['https://res-oss.elist.com.cn/notice/ServiceAgreement-v1.htm', 'https://res-oss.elist.com.cn/notice/ApplicationPrivacyAgreement-v1.htm'],
            role: 0,
            disabled: false,
            value: 'orange',
            pageroute: '', //存入页面来源url
            wxLoginRes: '',
            roleShow: false,
            isApp: false,
            message: '',
            items: [
                {
                    value: 'D',
                    name: '我要发货'
                },
                {
                    value: 'R',
                    name: '我要收货'
                }
            ],
            disabled: false,
            eyePassword: true,
            fromLogin: {
                phoneNumber: '',
                password: '',
                type: 0
            },
            err: false,
            phoneNumberErr: false,
            passsswordErr: false,
            share_data: {}
        };
    },
    onLoad(option) {
        //使用微信登录获取登录code
        this.getSystemInfoSyncInit();

        console.log('option', option);
        //接收分享参数
        if (option && option.share_id) {
            console.log('option', option);
            this.share_data.id = option.share_id;
            this.share_data.phone = option.phone;
            this.share_data.type = option.type;
            this.share_data.port = option.port;
            this.share_data.versions = option.versions;
            console.log('this.share_data.versionsthis.share_data.versionsthis.share_data.versions', this.share_data.versions);
        }

        if (this.isApp) {
            console.log('app');
            // var that = this;
            // uni.login({
            // 	provider: 'weixin',
            // 	success: function(loginRes) {
            // 		that.wxLoginRes = loginRes.code;
            // 		console.log(loginRes, "app------>");
            // 	}
            // });
        } else {
            var that = this;
            uni.login({
                provider: 'weixin',
                success: function (loginRes) {
                    that.wxLoginRes = loginRes.code;
                    console.log(loginRes.code, '------CQL');
                }
            });

            // if (option.url) {
            // 	that.pageroute = option.url;
            // 	console.log('使用指定 URL：', option.url);
            // } else {
            // 	const prevPage = that.prePage?.();
            // 	const page = prevPage?.$mp?.page;

            // 	if (page && page.route && page.options) {
            // 		const queryString = that.queryParams(page.options);
            // 		that.pageroute = encodeURIComponent(`/${page.route}?${queryString}`);
            // 		console.log('使用上一页生成的 URL：', that.pageroute);
            // 	} else {
            // 		console.warn('无法获取上一页信息，pageroute 设置失败');
            // 		that.pageroute = '';
            // 	}
            // }
        }
    },
    onShow() {
        // #ifdef MP-WEIXIN
        this.refreshCode();
        // #endif
    },
    onShareAppMessage(ops) {
        return {
            title: '打开易单据小程序，极速管理您的货单~',
            path: '/pages/index/index',
            imageUrl: '/static/share.png'
        };
    },
    methods: {
        getSystemInfoSyncInit() {
            const systemInfo = uni.getSystemInfoSync();
            if (systemInfo.platform === 'android' || systemInfo.platform === 'ios') {
                this.isApp = true;
                console.log('app');
            } else {
                this.isApp = false;
                console.log('小程序');
            }
        },
        experience() {
            console.log('立即体验');
            uni.switchTab({
                url: '/pages/index/index'
            });
        },
        jump(i) {
            uni.navigateTo({
                url: '/pages/subUser/webpage?url=' + this.xy[i]
            });
        },
        refreshCode() {
            var that = this;
            uni.login({
                provider: 'weixin',
                success: function (loginRes) {
                    that.wxLoginRes = loginRes.code;
                    console.log('loginRes.code======>', loginRes.code);
                    console.log('loginRes======>', loginRes);
                }
            });
        },
        roleQH(i) {
            this.role = i;
        },
        radioChange(e) {
            console.log(e + '1');
        },
        radioGroupChange(e) {
            console.log('点击');
            if (this.disabled) {
                this.disabled = false;
            } else {
                this.disabled = true;
            }
        },
        getPhoneNumber(e) {
            if (this.disabled) {
                var that = this;
                if (!e.detail.code) {
                    that.$u.toast('请授权手机号进行登录~');
                    return;
                }

                const inviterId = uni.getStorageSync('inviterId') || null; // 登录前保存过
                if (that.wxLoginRes) {
                    this.refreshCode();
                    this.$api.user
                        .loginWithWXOld({
                            loginCode: that.wxLoginRes,
                            phoneCode: e.detail.code,
                            inviterId: inviterId || null
                        })
                        .then((res) => {
                            var resDate = res.data.data;
                            that.message = resDate.loginState;

                            if (resDate.data == null || resDate.data.work == null) {
                                that.$u.toast(that.message);
                                return;
                            }

                            if (resDate.data.work == '' || resDate.data.work != '1') {
                                this.$u.setPinia({
                                    user: {
                                        work: 'N'
                                    }
                                });
                            } else {
                                this.$u.setPinia({
                                    user: {
                                        work: 'Y'
                                    }
                                });
                            }
                            console.log('登录成狗，设置缓存');
                            this.$u.setPinia({
                                user: {
                                    userRole: 'D',
                                    token: resDate.loginToken,
                                    user: resDate
                                },
                                guide: {
                                    guidanceD: resDate.data.guidanceD,
                                    guidanceR: resDate.data.guidanceR
                                }
                            });

                            if (resDate.phone != '' && resDate.data.work != null) {
                                this.$loadUser(this);
                                //接收分享参数
                                if (Object.keys(this.share_data).length != 0) {
                                    console.log('接收分享参数', this.share_data);
                                    uni.redirectTo({
                                        url:
                                            '/pages/subOrder/detailsShare?share_id=' +
                                            this.share_data.id +
                                            '&phone=' +
                                            this.share_data.phone +
                                            '&port=' +
                                            this.share_data.port +
                                            '&type=' +
                                            this.share_data.type +
                                            '&versions=' +
                                            this.share_data.versions
                                    });
                                } else {
                                    uni.switchTab({
                                        url: '/pages/index/index'
                                    });
                                    this.roleShow = true;
                                }
                            } else {
                                that.$u.toast(that.message);
                            }
                        })
                        .catch((res) => {
                            that.$u.toast('服务器异常,请联系官方客服');
                        });
                } else {
                    this.$u.toast(that.wxLoginRes);
                }
            } else {
                this.$u.toast('请同意用户协议~');
            }
        },
        queryParams(data, isPrefix = false) {
            let prefix = isPrefix ? '?' : '';
            let _result = [];
            for (let key in data) {
                let value = data[key];
                // 去掉为空的参数
                if (['', undefined, null].includes(value)) {
                    continue;
                }
                if (value.constructor === Array) {
                    value.forEach((_value) => {
                        _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value));
                    });
                } else {
                    _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                }
            }
            return _result.length ? prefix + _result.join('&') : '';
        },
        radioChange(e) {
            this.$u.setPinia({
                user: {
                    userRole: e.detail.value
                }
            });
        },
        submitRole() {
            if (this.role == 0) {
                this.$u.setPinia({
                    user: {
                        userRole: 'D'
                    }
                });
            } else {
                this.$u.setPinia({
                    user: {
                        userRole: 'R'
                    }
                });
            }
            this.roleShow = false;
            uni.reLaunch({
                url: '/pages/index/index'
            });
        },
        phoneNumberFocusInput() {
            console.log('对焦');
            this.phoneNumberErr = false;
        },
        passsswordFocusInput() {
            console.log('对焦');
            this.passsswordErr = false;
        },
        ZC() {
            uni.navigateTo({
                url: '/pages/subUser/register/register'
            });
        },
        wjPassword() {
            var fromLogin = this.fromLogin;
            uni.navigateTo({
                url: '/pages/subUser/login/verificationCodeLogin/verificationCodeLogin?fromLogin=' + JSON.stringify(fromLogin)
            });
        },
        oneKeyLogin() {
            console.log('设备');
            var that = this;

            // uni.preLogin({
            // 	provider: 'univerify',
            // 	success: function(res) {
            // 		console.log('预登录成功', res);
            // 	},
            // 	fail: function(err) {
            // 		console.error('预登录失败', err);
            // 	},
            // 	complete: function() {
            // 		console.log('预登录操作结束');
            // 	}
            // });
            var _this = this;
            uni.preLogin({
                provider: 'univerify',
                univerifyStyle: {
                    fullScreen: true, // 是否全屏显示，默认值： false
                    title: '快速登录',
                    backgroundColor: '#ffffff', // 授权页面背景颜色，默认值：#ffffff
                    icon: {
                        path: '/static/img/logo/logo-r.png', // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
                        width: '120rpx', //图标宽度 默认值：120rpx
                        height: '120rpx' //图标高度 默认值：120rpx
                    }
                },
                success() {
                    //预登录成功
                    // 显示一键登录选项
                    uni.login({
                        provider: 'univerify',
                        univerifyStyle: {
                            // 自定义登录框样式
                            //参考`univerifyStyle 数据结构`
                            //具体样式设计请去uni-app文档查看
                            //不填写任何自定义登录框样式的话就会采取默认样式
                            fullScreen: true, // 是否全屏显示，默认值： false
                            title: '快速登录',
                            backgroundColor: '#ffffff', // 授权页面背景颜色，默认值：#ffffff
                            icon: {
                                path: '/static/img/logo/logo-r.png', // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
                                width: '120rpx', //图标宽度 默认值：120rpx
                                height: '120rpx' //图标高度 默认值：120rpx
                            }
                        },
                        success(res) {
                            // 登录成功
                            console.log(res.authResult.access_token);
                            console.log(res.authResult.openid);
                            // 此处获取了openid和access_token
                            // {openid:'登录授权唯一标识',access_token:'接口返回的 token'}
                            // 通过uniCloud.callFunction函数实现前端获取手机号
                            uniCloud
                                .callFunction({
                                    name: 'cloudServe', // 填写你自己的云函数名称
                                    //传入上面获取的openid和access_token获取手机号
                                    data: {
                                        access_token: res.authResult.access_token, // 客户端一键登录接口返回的access_token
                                        openid: res.authResult.openid // 客户端一键登录接口返回的openid
                                    }
                                })
                                .then((dataRes) => {
                                    //此处已经成功获取手机号等信息
                                    console.log('云函数返回的参数', dataRes);
                                    let phone = dataRes.result.data.phoneNumber;
                                    // 获取手机号后根据自己的需求做后面的登录操作即可
                                    that.LoginPhone(phone);
                                })
                                .catch((err) => {
                                    console.log(err);
                                    console.log('云函数报错', err);
                                    uni.showToast({
                                        title: err.errMsg,
                                        icon: 'none'
                                    });
                                    this_ = this;
                                    setTimeout(() => {
                                        uni.closeAuthView(); //关闭一键登录弹出窗口
                                        this_.onClickMsgLogin();
                                    }, 500);
                                });
                        },
                        fail(res) {
                            // 登录失败
                            console.log(res.errCode);
                            console.log(res.errMsg);
                        }
                    });
                },
                fail(res) {
                    // 预登录失败
                    // 不显示一键登录选项（或置灰）
                    // 根据错误信息判断失败原因，如有需要可将错误提交给统计服务器
                    console.log(res);
                    console.log(res.errCode);
                    console.log(res.errMsg);
                    var code = res.errCode;
                    switch (code) {
                        case 30005:
                            _this.$u.toast('请检查数据网络是否开启~');
                            break;
                        default:
                            _this.$u.toast('获取失败~');
                    }
                }
            });
        },
        LoginPhone(phone) {
            console.log('手机号码：', phone);
            this.fromLogin.phoneNumber = phone;
            this.$api.user.loginWithAppPhone(this.fromLogin).then.then((res) => {
                console.log(res);
                var mess = res.data;
                this.$u.toast(mess.message);
                setTimeout(() => {
                    uni.closeAuthView(); //关闭一键登录弹出窗口
                }, 500);
                if (mess.data.type == 1) {
                    this.$u.setPinia({
                        user: {
                            user: mess.data,
                            token: mess.data.loginToken
                        }
                    });

                    this.$loadUser(this);
                    uni.switchTab({
                        url: '/pages/index/index'
                    });
                }
            });
        },
        LoginImport() {
            if (!this.disabled) {
                this.$u.toast('请勾选用户协议～');
                return;
            }

            if (this.fromLogin.phoneNumber == '' && this.fromLogin.phoneNumber.length < 11) {
                this.$u.toast('请输入手机号码～');
                this.phoneNumberErr = true;
                return;
            }

            if (this.fromLogin.passssword == '') {
                this.$u.toast('请输入密码～');
                this.passsswordErr = true;
                return;
            }

            this.$api.user.loginWithAppAccount(this.fromLogin).then((res) => {
                var code = res.data.data;
                console.log(code);
                if (code.type == 1) {
                    this.$u.setPinia({
                        user: {
                            user: code,
                            token: code.loginToken
                        }
                    });

                    this.$loadUser(this);
                    uni.switchTab({
                        url: '/pages/index/index'
                    });
                } else {
                    this.$u.toast('密码错误~');
                }
            });
        },
        wxloginInit() {
            var _this = this;
            console.log('点击');
            uni.login({
                provider: 'weixin',
                onlyAuthorize: true,
                success: function (loginRes) {
                    console.log('app------>', loginRes);
                    // loginWXVerifyId
                    var dx = {
                        code: loginRes.code
                    };
                    this.$api.user.verifyLoginWXIdentity(dx).then((res) => {
                        console.log('后台获取=====>', res);
                        var data = res.data.data;
                        if (data.id) {
                            //登录成功
                        } else {
                            var unionId = data.unionId;
                            var openIdApp = data.openIdApp;
                            this.getUserInfo(unionId, openIdApp);
                        }
                    });
                    // this.getUserInfo(loginRes.authResult.access_token, loginRes.authResult.openid);
                }.bind(this),
                fail: function (err) {
                    // 显示失败提示
                    uni.showToast({
                        title: '登录失败：' + err.errMsg,
                        icon: 'none',
                        duration: 2000
                    });
                    console.error('登录失败：', err);
                }
            });
        },
        getUserInfo(unionid, openIdApp) {
            if (this.isValid(unionid)) {
                // 所有变量都有有效值的处理逻辑
                var dx = {
                    unionId: unionid,
                    openIdApp: openIdApp,
                    phone: '',
                    code: ''
                };

                uni.navigateTo({
                    url: '/pages/subUser/bindingPhone/bindingPhone?data=' + JSON.stringify(dx)
                });
            } else {
                // 存在变量值为 null、空字符串或者 undefined 的处理逻辑
                this.$u.toast('微信拉取失败~');
                console.log('存在变量值为 null、空字符串或者 undefined');
            }
        },
        loginWX(code) {
            console.log('微信登录');
            var dx = {
                code: code
            };
            this.$api.user.loginWithWX(dx).then((res) => {
                var code = res.data.data;
                console.log(res);
                uni.navigateTo({
                    url: '/pages/subUser/bindingPhone/bindingPhone?openid=123'
                });
            });
        },
        isValid(value) {
            return value !== null && value !== '' && value !== undefined;
        }
    }
};
</script>

<style scoped lang="scss">
.module {
    position: fixed;
    bottom: 0;
    height: 20vh;
}

.yjdl {
    width: 380rpx;
    height: 100rpx;
    border-radius: 376rpx;
    opacity: 1;
    background: #f5fcf9;

    font-family: Source Han Sans;
    font-size: 30rpx;
    font-weight: 500;
    line-height: 42.24rpx;
    text-align: center;
    letter-spacing: 0rpx;

    font-feature-settings: 'kern' on;
    color: #01bb74;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.placeholder_class {
    color: #999999;
    font-family: Source Han Sans;
    font-size: 28rpx;
    font-weight: normal;
    line-height: 42.24rpx;
    letter-spacing: 0rpx;

    margin-left: 0rpx;

    text-align: left;
}

.yszc {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-top: 30rpx;
}

.head {
    margin-bottom: 160rpx;
    width: 100%;
    position: relative;
}

.headline {
    font-family: Source Han Sans;
    font-size: 52rpx;
    font-weight: 500;
    line-height: 42.24rpx;
    letter-spacing: 0rpx;
    font-feature-settings: 'kern' on;
    color: #333333;
    position: absolute;

    left: 40rpx;
}

.headlineInput {
    font-family: Source Han Sans;
    font-size: 32rpx;
    font-weight: normal;
    line-height: 42.24rpx;
    text-align: center;
    letter-spacing: 0rpx;
    font-feature-settings: 'kern' on;
    color: #333333;

    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;

    margin-bottom: 20rpx;
}

.Input {
    width: 578.22rpx;
    height: 96rpx;
    border-radius: 376rpx;
    opacity: 1;

    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;

    background: #f5fcf9;
}

input {
    text-align: left;
    // background-color: #01BB74;
    height: 100%;
    width: 80%;
    text-indent: 40rpx;
}

.button {
    width: 580rpx;
    height: 100rpx;
    border-radius: 376rpx;
    opacity: 1;
    background: #01bb74;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    font-size: 36rpx;
    font-weight: 500;
    color: #ffffff;

    margin-top: 80rpx;
    box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.1), 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
}

.button:hover {
    background-color: #01bb74;
    /* 悬停时改变背景颜色 */
}

.button:active {
    background-color: #00d382;
    /* 按下时改变背景颜色 */
    transform: translateY(2rpx);
    /* 按下时稍微向下移动一点，增加反馈 */
}

.headlineEnd {
    display: flex;
    flex-direction: row;
    margin-top: 10rpx;
    font-size: 24rpx;
    font-weight: normal;
    position: relative;

    .left {
        position: absolute;
        left: 0;
    }

    .right {
        position: absolute;
        right: 0;
    }

    .ts {
        color: #f53f3f;
    }
}

.InputTab {
    margin-bottom: 40rpx;
}

.buttonTab {
    margin-top: 20rpx;
}

.err {
    color: #f53f3f;
    font-size: 24rpx;
}
</style>
