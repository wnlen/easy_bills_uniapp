<template>
    <view class="vh100 vw100 fixed-bar-height" style="background-color: #fffbf1">
        <z-paging
            ref="paging"
            use-virtual-list
            :force-close-inner-list="true"
            :hide-empty-view="hideEmptyView"
            :cell-height-mode="1 === 0 ? 'fixed' : 'dynamic'"
            @virtualListChange="virtualListChange"
            @query="queryList"
        >
            <template #top>
                <u-navbar
                    :autoBack="true"
                    :placeholder="true"
                    :border-bottom="false"
                    :titleBold="true"
                    title-color="#000000"
                    title="往年数据"
                    title-size="34"
                    bgColor="transparent"
                    :background="{ background: 'transparent' }"
                ></u-navbar>
                <u-notice-bar mode="horizontal" :list="uNoticeBarlist" padding="6rpx 12rpx"></u-notice-bar>
                <view class="relative" style="width: 100%; height: 5vh">
                    <view class="absolute flex-col justify-center items-center" @click="selectionIconClick" style="width: 30%; left: 0; height: 100%">
                        <liu-data-select elementId="data-select1" :dataList="dataList" @change="dropdown" color="#965510">
                            <view id="data-select1" class="btn-info flex-row justify-center">
                                <view class="mr10" v-if="!selectionIcon"><u-icon name="arrow-down-fill" color=" #965510" size="15"></u-icon></view>
                                <view class="mr10" v-else><u-icon name="arrow-up-fill" color=" #965510" size="15"></u-icon></view>
                                <text style="color: #965510">{{ dropdownName }}</text>
                                <text style="color: #965510" v-if="dropdownName != '请选择'">年</text>
                            </view>
                        </liu-data-select>
                    </view>
                    <view class="absolute flex-row justify-end items-center" style="width: 70%; right: 0; text-align: right; height: 100%">
                        <text class="mr24" @click="jumpnView">数据分析></text>
                    </view>
                </view>
            </template>

            <view class="order-simple-list pl30 pr30" v-show="current == 0 && !moneyCALL">
                <div class="bg-white pd20 mt20 radius flex-col justify-center items-center cardShow">
                    <view class="flex-col" style="width: 100%">
                        <text class="ft30 ft-gray mb18" style="color: #999999">累计金额</text>
                        <view class="">
                            <text class="ft42 ft-bold">￥</text>
                            <u-count-to :end-val="OrderQuantitySum" separator="," color="#000000" font-size="40rpx" decimals="2" bold></u-count-to>
                        </view>
                    </view>

                    <view class="flex-row justify-center items-center mt20" style="width: 100%">
                        <view
                            class="flex-row justify-center items-center mr24"
                            @click="choiceGET(0)"
                            :style="{
                                backgroundColor: '#ffffff',
                                color: showOrderTage == '0' ? '#965510' : '#999999',
                                border: '2rpx solid ' + (showOrderTage == '0' ? '#965510' : '#999999')
                            }"
                            style="width: 20%; height: 54rpx; border-radius: 12rpx; height: 54.84rpx"
                        >
                            全部
                        </view>
                        <view
                            class="flex-row justify-center items-center mr24"
                            @click="choiceGET(1)"
                            :style="{
                                backgroundColor: '#ffffff',
                                color: showOrderTage == '1' ? '#965510' : '#999999',
                                border: '2rpx solid ' + (showOrderTage == '1' ? '#965510' : '#999999')
                            }"
                            style="width: 20%; height: 54rpx; border-radius: 12rpx; height: 54.84rpx"
                        >
                            {{ vuex_userRole == 'R' ? '待确收' : '待签收' }}
                        </view>
                        <view
                            class="flex-row justify-center items-center"
                            @click="choiceGET(2)"
                            :style="{
                                backgroundColor: '#ffffff',
                                color: showOrderTage == '2' ? '#965510' : '#999999',
                                border: '2rpx solid ' + (showOrderTage == '2' ? '#965510' : '#999999')
                            }"
                            style="width: 20%; height: 54rpx; border-radius: 12rpx; height: 54.84rpx"
                        >
                            已签收
                        </view>
                        <view
                            class="flex-row justify-center items-center ml20"
                            @click="choiceGET(3)"
                            :style="{
                                backgroundColor: '#ffffff',
                                color: showOrderTage == '3' ? '#965510' : '#999999',
                                border: '2rpx solid ' + (showOrderTage == '3' ? '#965510' : '#999999')
                            }"
                            style="width: 20%; height: 54rpx; border-radius: 12rpx; height: 54.84rpx"
                        >
                            {{ vuex_userRole == 'R' ? '已付款' : '已收款' }}
                        </view>
                    </view>

                    <div class="flex-row items-center radius pr20 mr10 mt20" style="height: 5vh; background-color: #f9f9f9; width: 100%">
                        <div class="bg-white flex-row items-center justify-left radius" style="width: 100%; height: 5vh; background-color: #f9f9f9">
                            <text class="ft11 ft-gray ml36" @click="CustomerGet">{{ vuex_userRole == 'R' ? '供应商选择' : '客户选择' }}</text>
                            <view class="ml24">
                                <u-input border="none" @change="changeCustomer" v-model="customer" :placeholder="vuex_userRole == 'R' ? '请选择供应商' : '请选择客户'"></u-input>
                            </view>

                            <view class="flex-col justify-center items-center" style="height: 5vh">
                                <view class="ml40"><u-icon name="/static/img/list/lxr.svg" size="45rpx" @click="CustomerGet"></u-icon></view>
                            </view>
                        </div>
                    </div>

                    <div class="flex-row items-center radius pr20 mr10 mt20" style="height: 5vh; background-color: #f9f9f9; width: 100%">
                        <div class="bg-white flex-row items-center justify-left radius" style="width: 100%; height: 5vh; background-color: #f9f9f9">
                            <text class="ft11 ft-gray ml36" @click="filtrateGet">{{ Title }}</text>
                            <view class="ml10">
                                <u-icon name="arrow-down-fill" size="10"></u-icon>
                            </view>

                            <view class="ml24 my-input">
                                <u-input border="none" v-if="showTage != '1'" v-model="field" @change="searchListenner" placeholder="输入关键字进行检索"></u-input>
                            </view>
                            <view class="ml24 my-input">
                                <u-input border="none" v-if="showTage == '1'" maxlength="11" v-model="field" @change="searchListenner" placeholder="输入号码进行检索"></u-input>
                            </view>
                        </div>
                    </div>
                </div>
            </view>

            <view class="flex-col justify-center items-center" style="height: 80vh" v-show="current == 0 && moneyCALL">
                <view class="vw100" style="height: 200rpx">
                    <u-empty
                        icon="https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/role/empty.svg"
                        iconSize="400rpx"
                        text="暂无数据~"
                        mode="search"
                        margin-top="-200"
                    ></u-empty>
                </view>
                <view
                    @click="goPath('/pages/subPack/user/my_order/my_order')"
                    v-if="vuex_user.workData.identity != 3 && vuex_user.workData.identity != 4 && vuex_user.workData.identity != 1"
                    class="buyOrder flex-col justify-center items-center"
                    style=""
                >
                    前往订购
                </view>
            </view>

            <view class="contentView flex-col justify-center items-center" style="height: 600rpx" v-show="current == 1">
                <!-- 正在开发中~ -->
            </view>

            <view class="order-list ml24 mr24 pt10 mt24" v-show="current == 0 && !moneyCALL">
                <view
                    v-for="(item, index) in orderList"
                    :key="index"
                    @click="goPath('/pages/subPack/formerYears/details?id=' + item.id)"
                    class="flex-col pl20 pr20 pd36 pt38 bg-white mb18 order-item u-skeleton relative cardShow"
                >
                    <view class="u-skeleton-fillet mb10 flex-row" @tap.stop style="width: 100%">
                        <view class="flex-row justify-left items-center" style="width: 70%">
                            <view>
                                <!-- 	<u-checkbox-group :key="index" @change="checkboxGroupChange(item.orderNumber,index)">
									<u-checkbox v-model="item.check" shape="circle" active-color="#965510">
										<view class="ft30 ft-lighgray pr30" style="color: #666666;">
											订单编号
											<text class="ml15" style="color: #F76565;">
												{{item.orderNumber}}
											</text>
										</view>
									</u-checkbox>
								</u-checkbox-group> -->
                                <view class="flex-row justify-center items-center">
                                    <view
                                        class="flex-col justify-center items-center"
                                        @click="checkboxGroupChange(item.orderNumber, index)"
                                        :style="{
                                            backgroundColor: item.check ? '#965510' : '#ffffff'
                                        }"
                                        style="border-radius: 100rpx; height: 40rpx; width: 40rpx; border: 2rpx solid #aaaaaa"
                                    >
                                        <u-icon name="checkbox-mark" color="#ffffff" size="28rpx"></u-icon>
                                    </view>
                                    <view class="ft30 ft-lighgray pr30 ml24" style="color: #666666">
                                        订单编号
                                        <text class="ml15" style="color: #f76565">
                                            {{ item.orderNumber }}
                                        </text>
                                    </view>
                                </view>
                            </view>
                        </view>
                        <view class="ml20" style="width: 30%">
                            <u-image
                                v-if="vuex_userRole == 'D'"
                                :style="{
                                    display: item.paymentState == '0' ? 'inline' : 'none'
                                }"
                                class="u-img"
                                width="120rpx"
                                height="50rpx"
                                src="@/static/img/obj/bq1.png"
                            ></u-image>
                            <u-image
                                v-if="vuex_userRole == 'R'"
                                :style="{
                                    display: item.paymentState == '0' ? 'inline' : 'none'
                                }"
                                class="u-img"
                                width="120rpx"
                                height="50rpx"
                                src="@/static/img/obj/dqs.png"
                            ></u-image>
                            <u-image
                                :style="{
                                    display: item.paymentState == '1' ? 'inline' : 'none'
                                }"
                                width="120rpx"
                                height="50rpx"
                                class="u-img"
                                src="@/static/img/obj/bq2.png"
                                :lazy-load="true"
                            ></u-image>
                            <u-image
                                v-if="vuex_userRole != 'R'"
                                :style="{
                                    display: item.paymentState == '2' ? 'inline' : 'none'
                                }"
                                width="120rpx"
                                height="50rpx"
                                class="u-img"
                                src="@/static/img/obj/bq3.png"
                                :lazy-load="true"
                            ></u-image>
                            <u-image
                                v-if="vuex_userRole == 'R'"
                                :style="{
                                    display: item.paymentState == '2' ? 'inline' : 'none'
                                }"
                                class="u-img"
                                width="120rpx"
                                height="50rpx"
                                src="@/static/img/obj/yfk.png"
                            ></u-image>
                        </view>
                    </view>
                    <view class="width100 pb25 pt10 u-skeleton-fillet">
                        <u-row gutter="16" justify="between">
                            <u-col span="20">
                                <view class="flex-col items-center text-left">
                                    <text
                                        v-if="vuex_userRole != 'R'"
                                        :style="{
                                            color: ifZX(item.bossNumberE) ? '#AAAAAA' : '#3D3D3D'
                                        }"
                                        class="ft34 u-line-1 width100"
                                        style="font-weight: 500"
                                    >
                                        {{ item.organizationE || item.bossNumberE }}{{ ifZX(item.bossNumberE) ? '(已注销)' : '' }}
                                    </text>
                                    <text
                                        v-if="vuex_userRole == 'R'"
                                        :style="{
                                            color: ifZX(item.bossNumberS) ? '#AAAAAA' : '#3D3D3D'
                                        }"
                                        class="ft34 u-line-1 width100"
                                        style="font-weight: 500"
                                    >
                                        {{ item.enterpriseS || item.bossNumberS }}{{ ifZX(item.bossNumberS) ? '(已注销)' : '' }}
                                    </text>
                                </view>
                            </u-col>
                        </u-row>
                    </view>
                    <view class="u-skeleton-fillet ft30 line25 ft-lighgray">
                        <text>日期：{{ $u.timeFormat(item.creationTime, 'yyyy-mm-dd') }}</text>
                    </view>
                    <view class="ft-lighgray mt10 line25 flex-row items-center justify-end">
                        <text>
                            <text>订单金额：</text>
                            <text class="ft-bold ft35" style="color: black">￥{{ item.price.toFixed(2) }}</text>
                        </text>
                    </view>
                </view>
                <!-- <view class="flex-row justify-center items-center" style="width: 100%;"
					v-show="uloading&&dataList.length>0">
					<up-loading-icon mode="flower"></up-loading-icon>
				</view> -->
            </view>

            <!-- 			<view class="flex-col justify-center items-center" style="height: 80vh;" v-show="current==0&&moneyCALL">
				<view class="vw100" style="height: 200rpx;">
					<u-empty src="https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/role/empty.svg"
						icon-size="400" text="暂无消息~" mode="search" margin-top="-200"></u-empty>
				</view>
				<view @click="goPath('/pages/subPack/user/my_order/my_order')"
					class="buyOrder flex-col justify-center items-center" style="">
					前往订购
				</view>
			</view> -->

            <view
                v-show="!(current == 0 && moneyCALL)"
                class="pt48"
                slot="bottom"
                style="background-color: #ffffff; box-shadow: 0rpx 4rpx 6rpx 0rpx rgba(51, 51, 51, 0.2); bottom: 0; height: 10vh"
            >
                <view class="items-center flex-row justify-center" style="width: 92%; display: flex; justify-content: space-between">
                    <view class="" style="text-align: left; font-size: 24rpx; color: #965510" :disabled="false">
                        <view class="ml24" style="">
                            <view class="">
                                <view class="flex-row justify-center items-center">
                                    <view
                                        class="flex-col justify-center items-center"
                                        @click="checkedAll"
                                        :style="{
                                            backgroundColor: checked ? '#965510' : '#ffffff'
                                        }"
                                        style="border-radius: 100rpx; height: 40rpx; width: 40rpx; border: 2rpx solid #aaaaaa"
                                    >
                                        <u-icon name="checkbox-mark" color="#ffffff" size="28rpx"></u-icon>
                                    </view>
                                    <view class="ml15" style="color: #333333; font-size: 28rpx">全选</view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="mr20 flex-row" style="text-align: left; font-size: 24rpx; width: 30%; color: #666666">
                        统计：
                        <view style="color: #965510">{{ OrderQuantity }}个订单</view>
                    </view>
                    <view
                        :disabled="!hasCheck"
                        @click="dlPdf"
                        class="flex-row justify-center items-center"
                        style="
                            width: 280rpx;
                            height: 80rpx;
                            border-radius: 90rpx;
                            opacity: 1;
                            background: linear-gradient(270deg, #464b63 0%, #56638a 100%);
                            color: white;
                            float: right;
                            font-weight: 600;
                        "
                    >
                        <u-icon name="https://res-oss.elist.com.cn/wxImg/statistics/down.svg" size="40rpx"></u-icon>
                        下载PDF
                    </view>
                </view>
            </view>

            <!-- <view slot="empty" class="flex-col justify-center items-center">
				<view class="vw100" style="height: 200rpx;">
					<u-empty :src="ImgUrl+'/wxImg/list/empty.svg'" icon-size="150" text="暂无数据~" mode="search"
						margin-top="-250"></u-empty>
				</view>
			</view> -->

            <view slot="empty" style="padding-bottom: 200rpx">
                <u-icon margin-top="22rpx" labelPos="bottom" :name="ImgUrl + '/wxImg/list/empty.svg'" labelColor="#AAAAAA" label="暂无记录" size="360rpx"></u-icon>
            </view>
        </z-paging>

        <u-popup v-model="show_start" mode="top" width="550rpx">
            <view class="flex-col pd30 justify-between height100 pt100">
                <view>
                    <view class="flex-col mt40">
                        <text
                            style="
                                font-family: Source Han Sans;
                                font-size: 28rpx;
                                font-weight: bold;
                                line-height: 42.24rpx;
                                letter-spacing: 0rpx;
                                font-feature-settings: 'kern' on;
                                color: #333333;
                            "
                        >
                            时间筛选
                        </text>
                        <!-- 		<view class="flex-row items-center justify-between mt10 vw100">
							<view class="flex-row items-center">
								<text class="mr10" style="color: #999999;">开始日期</text>
								<u-icon name="arrow-down-fill" size="10"></u-icon>
								<input @click="calendar1Show=true" disabled class="ml24"
									style="box-sizing: border-box;border: 1rpx solid #999999;width: 20%;border-radius: 6rpx;height: 60rpx;align-items: center;text-align: center;"
									type="text" placeholder=" 开始日期" v-model="date1" />
								<text class="mr10 ml20" style="color: #999999;">结束日期</text>
								<u-icon name="arrow-down-fill" size="10"></u-icon>
								<input @click="calendar2Show=true" disabled class="ml24"
									style="box-sizing: border-box;border: 1rpx solid #999999;width: 20%;border-radius: 6rpx;height: 60rpx;align-items: center;text-align: center;"
									type="text" placeholder=" 结束日期" v-model="date2" />
							</view>
						</view> -->

                        <view class="flex-row items-center justify-between mt10" style="width: 100%">
                            <view class="flex-row items-center" style="width: 50%">
                                <text class="mr10" style="color: #999999">开始日期</text>
                                <u-icon name="arrow-down-fill" size="10"></u-icon>
                                <view
                                    @click="$refs.calendars.open()"
                                    class="ml24 text-center flex-row justify-center items-center"
                                    style="border: 1rpx solid #999999; padding: 12rpx; border-radius: 6rpx; min-width: 180rpx; height: 56rpx"
                                >
                                    {{ date1 == '' ? '开始日期' : date1 }}
                                </view>
                            </view>
                            <view class="flex-row items-center" style="width: 50%">
                                <text class="mr10 ml20" style="color: #999999">结束日期</text>
                                <u-icon name="arrow-down-fill" size="10"></u-icon>
                                <view
                                    @click="$refs.calendars.open()"
                                    class="ml24 text-center flex-row justify-center items-center"
                                    style="border: 1rpx solid #999999; padding: 12rpx; border-radius: 6rpx; min-width: 180rpx; height: 56rpx"
                                >
                                    {{ date2 == '' ? '结束日期' : date2 }}
                                </view>
                            </view>
                        </view>

                        <view class="mt40">
                            <text
                                style="
                                    font-family: Source Han Sans;
                                    font-size: 28rpx;
                                    font-weight: bold;
                                    line-height: 42.24rpx;
                                    letter-spacing: 0rpx;
                                    font-feature-settings: 'kern' on;
                                    color: #333333;
                                "
                            >
                                范围筛选
                            </text>

                            <view class="flex-row mt20" style="width: 100%">
                                <view
                                    class="text-center items-center mr24 pt5"
                                    @click="Filtrate('0')"
                                    :style="{
                                        backgroundColor: showTage == '0' ? '#4E5777' : '#FFFBF1',
                                        color: showTage == '0' ? '#ffffff' : '#965510'
                                    }"
                                    style="color: #ffffff; background-color: #4e5777; width: 30%; height: 54rpx; border-radius: 12rpx; height: 54.84rpx"
                                >
                                    联系人
                                </view>
                                <view
                                    class="text-center items-center mr24 pt5"
                                    @click="Filtrate('1')"
                                    :style="{
                                        backgroundColor: showTage == '1' ? '#4E5777' : '#FFFBF1',
                                        color: showTage == '1' ? '#ffffff' : '#965510'
                                    }"
                                    style="color: #4e5777; background-color: #4e5777; width: 30%; height: 54rpx; border-radius: 12rpx; height: 54.84rpx"
                                >
                                    联系号码
                                </view>
                                <view
                                    class="text-center items-center pt5"
                                    @click="Filtrate('2')"
                                    :style="{
                                        backgroundColor: showTage == '2' ? '#4E5777' : '#FFFBF1',
                                        color: showTage == '2' ? '#ffffff' : '#965510'
                                    }"
                                    style="color: #4e5777; background-color: #f2fbf8; width: 30%; height: 54rpx; border-radius: 12rpx; height: 54.84rpx"
                                >
                                    {{ vuex_userRole == 'R' ? '收货地址' : '收货地址' }}
                                </view>
                            </view>
                            <view class="flex-row mt20" style="width: 100%">
                                <view
                                    class="text-center items-center pt5"
                                    @click="Filtrate('3')"
                                    :style="{
                                        backgroundColor: showTage == '3' ? '#4E5777' : '#FFFBF1',
                                        color: showTage == '3' ? '#ffffff' : '#965510'
                                    }"
                                    style="color: #4e5777; background-color: #f2fbf8; width: 30%; height: 54rpx; border-radius: 12rpx; height: 54.84rpx"
                                >
                                    产品名称
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 按钮 -->
                <view class="flex-row justify-end mt25 vw100" style="">
                    <view class="mt15" style="text-align: left; align-items: center; color: #ccc; font-size: 24rpx; float: left; margin-right: 15%">
                        <!-- 保存偏好设置 -->
                    </view>
                    <view class="mr48" style="float: right">
                        <u-button @click="filterReset" shape="circle" size="medium" :custom-style="{ marginRight: '20rpx' }" plain>重置</u-button>
                        <u-button class="ml20" type="success" @click="filterSubmit" shape="circle" size="medium" :custom-style="{ backgroundColor: '#4E5777' }">确定</u-button>
                    </view>
                </view>
                <!-- 日历选择器 -->
                <uv-calendars mode="range" :startDate="limitingTimeO" :endDate="limitingTimeT" ref="calendars" @confirm="date1Change" />
            </view>
        </u-popup>
    </view>
</template>

<script>
export default {
    data() {
        return {
            limitingTimeO: '2020-01-01',
            limitingTimeT: '2024-01-01',
            checked: false,
            companySerch: '',
            seBtnColor: 1,
            searchText: '',
            showIcon: 1,
            details: {},
            dlText: '下载PDF',
            isEmpty: false,
            tagIndex: 0,
            current: 0,
            moneyCALL: true,
            dataList: [],
            dropdownName: '请选择',
            show: false, //筛选弹窗
            showFX: false, //分享弹窗
            show_start: false,
            bf: [],
            orderList: [],
            orderListCopy: [],
            hasCheck: false, //转发文件弹框
            date1: '',
            date2: '',
            showTage: '0',
            showOrderTage: 0,
            totalMoney: 0,
            checkedOrders: [],
            customer: '',
            searchList: {
                start: '',
                end: '',
                scope: '0',
                keyword: '',
                customer: ''
            },
            timeItem: {
                value: '近一月',
                key: true
            },
            realTimeSel: {
                bossNumberS: '',
                bossNumberE: '',
                paymentState: '',
                phoneE: '',
                organizationE: '',
                enterpriseS: '',
                phoneS: '',
                startDate: '',
                endDate: '',
                takeE: '',
                kTakeE: '',
                kPhoneE: '',
                contactsS: '',
                siteE: '',
                enterpriseDz: '',
                getPhone: '',
                inventoryName: '',
                limitS: '0,25',
                limitE: '25',
                staffNumberS: '',
                staffNumberE: '',
                role: '',
                inventoryName: '',
                page: 1,
                pageSize: 10
            },
            field: '',
            refresh: true,
            uloading: true,
            OrderQuantity: 0,
            OrderQuantitySum: 0,
            selectionIcon: true,
            time: {
                A: {
                    show: false,
                    mode: 'range'
                },
                B: {
                    show: true,
                    mode: 'range'
                }
            },
            year: null,
            jurisdiction: true,
            option: null,
            Title: '条件筛选',
            uNoticeBarlist: [],
            downPdfCheck: true,
            hideEmptyView: false
        };
    },
    onLoad(option) {
        this.getYear();
        this.year = new Date().getFullYear() - 1;
    },
    onReachBottom() {},
    onPullDownRefresh() {},
    onShow() {
        // this.getYear()
        var option = uni.getStorageSync('companyNameJSON');
        if (option) {
            this.option = JSON.parse(option);
            console.log(this.option.company);
            if (this.vuex_userRole == 'D') {
                this.realTimeSel.organizationE = this.option.company;
                this.customer = this.option.company;
            } else {
                this.realTimeSel.enterpriseS = this.option.company;
                this.customer = this.option.company;
            }
            uni.removeStorageSync('companyNameJSON');
            this.$refs.paging.reload();
        }

        this.setGD();
    },
    methods: {
        virtualListChange(vList) {
            this.orderList = vList;
        },
        queryList(pageNo, pageSize) {
            //权限匹配
            var port = this.vuex_userRole == 'D';
            if (port) {
                var DP = this.vuex_user.jurisdiction['B1-' + this.year] || this.vuex_user.jurisdiction['B1'];
                console.log('===请求拦截判断D===>', DP);
                if (DP == undefined) {
                    // this.$u.toast("您没有该年份数据权限");
                    this.$refs.paging.complete([]);
                    this.hideEmptyView = true;
                    this.jurisdiction = false;
                    return;
                } else {
                    this.moneyCALL = false;
                }
            } else {
                var RP = this.vuex_user.jurisdiction['B2-' + this.year] || this.vuex_user.jurisdiction['B2'];
                console.log('===请求拦截判断R===>', RP);
                if (RP == undefined) {
                    // this.$u.toast("您没有该年份数据权限");
                    this.hideEmptyView = true;
                    this.$refs.paging.complete([]);
                    this.jurisdiction = false;
                    return;
                } else {
                    this.moneyCALL = false;
                }
            }

            console.log(pageNo, pageSize);
            this.realTimeSel.page = pageNo;
            this.realTimeSel.pageSize = pageSize;
            this.refreshData();
        },
        selectionIconClick() {
            this.selectionIcon = !this.selectionIcon;
            console.log(this.selectionIcon);
        },
        TitleFun(showTage) {
            this.Title =
                showTage == 0
                    ? '联系人'
                    : showTage == 1
                    ? '联系号码'
                    : showTage == 2
                    ? this.vuex_userRole == 'R'
                        ? '收货地址'
                        : '收货地址'
                    : showTage == 3
                    ? '产品名称'
                    : '条件筛选';
        },
        setGD() {
            var b1 = this.vuex_user.jurisdiction.hasOwnProperty('B1');
            var b2 = this.vuex_user.jurisdiction.hasOwnProperty('B2');
            var b1y = this.vuex_user.jurisdiction.hasOwnProperty('B1-' + this.dropdownName);
            var b2y = this.vuex_user.jurisdiction.hasOwnProperty('B2-' + this.dropdownName);
            var ifWorkPort = this.vuex_userRole == 'R';

            if (ifWorkPort) {
                if (b2) {
                    this.uNoticeBarlist.push('往年数据收货端免费截至' + this.$u.timeFormat(this.vuex_user.jurisdiction['B2'], 'yyyy-mm-dd') + '到期');
                }
                if (b2y) {
                    this.uNoticeBarlist.push('往年数据收货端免费截至' + this.$u.timeFormat(this.vuex_user.jurisdiction['B2-' + this.dropdownName], 'yyyy-mm-dd') + '到期');
                }
            } else {
                if (b1) {
                    this.uNoticeBarlist.push('往年数据发货端免费截至' + this.$u.timeFormat(this.vuex_user.jurisdiction['B1'], 'yyyy-mm-dd') + '到期');
                }

                if (b1y) {
                    this.uNoticeBarlist.push('往年数据发货端免费截至' + this.$u.timeFormat(this.vuex_user.jurisdiction['B1-' + this.dropdownName], 'yyyy-mm-dd') + '到期');
                }
            }
        },
        getDatabase() {
            var b1 = this.vuex_user.jurisdiction.B1;
            var b2 = this.vuex_user.jurisdiction.B2;
            //需购买
        },
        getInIt() {
            var ifwork = this.vuex_user.data.work == '0';
            var timeEmp = this.realTimeSel.startDate == '' || this.realTimeSel.endDate == '';
            var ifWorkPort = this.vuex_userRole == 'R';

            if (ifwork) {
                console.log('没工作');
                if (!ifWorkPort) {
                    //发货
                    console.log('没工作 发货');
                    this.realTimeSel.bossNumberE = '';
                    this.realTimeSel.bossNumberS = this.vuex_user.phone;
                } else {
                    //收货
                    console.log('没工作 收货');
                    this.realTimeSel.bossNumberS = '';
                    this.realTimeSel.bossNumberE = this.vuex_user.phone;
                }
            } else {
                console.log('有工作');
                var identity = this.vuex_user.workData.identity;
                var boss = this.vuex_user.workData.bossNumber;

                if (!ifWorkPort) {
                    console.log('有工作 发货');
                    this.realTimeSel.staffNumberE = '';
                    if (identity == '4') {
                        console.log('有工作 发货 员工');
                        this.realTimeSel.staffNumberS = this.vuex_user.phone;
                        this.realTimeSel.bossNumberS = boss;
                    } else {
                        console.log('有工作 发货 其他');
                        this.realTimeSel.bossNumberE = '';
                        this.realTimeSel.bossNumberS = boss;
                    }
                } else {
                    console.log('有工作 收货');
                    this.realTimeSel.staffNumberS = '';
                    if (identity == '4') {
                        console.log('有工作 收货 员工');
                        this.realTimeSel.staffNumberE = this.vuex_user.phone;
                        this.realTimeSel.bossNumberE = boss;
                    } else {
                        console.log('有工作 收货 其他');
                        this.realTimeSel.bossNumberE = boss;
                    }
                }
            }

            if (this.realTimeSel.startDate == '' && this.realTimeSel.endDate == '') {
                console.log('时间为null', this.date1, this.date2);
                console.log(this.dataList);
                if (this.date1 == '' && this.date2 == '') {
                    console.log('时间为null');
                } else {
                    this.realTimeSel.startDate = this.date1;
                    this.realTimeSel.endDate = this.date2;
                }
            }

            let resJson = uni.getStorageSync('companyNameJSON');
            console.log(resJson);

            if (resJson != '') {
                var json = JSON.parse(resJson);
                this.customer = json.company;
                this.searchList.customer = json.company;
                if (!ifWorkPort) {
                    this.realTimeSel.organizationE = json.company;
                } else {
                    this.realTimeSel.enterpriseS = json.company;
                }
                // this.refreshData()
                uni.removeStorageSync('companyNameJSON');
            }
            var timeO = this.realTimeSel.startDate;
            var timeT = this.realTimeSel.endDate;
            if (timeO != '' && timeT != '') {
                this.$refs.paging.refresh();
            } else {
                this.uloading = false;
            }
        },
        getYear() {
            console.log('this.vuex_user.jurisdiction', this.vuex_user.jurisdiction);
            console.log('this.vuex_userRole', this.vuex_userRole);
            var role = this.vuex_userRole == 'R';
            for (let key in this.vuex_user.jurisdiction) {
                if (role) {
                    if (key == 'B2') {
                        //全部权限
                        this.getAllYear();
                        return;
                    } else {
                        var year = key.split('-')[1];
                        if (year != null && year != 'DQ' && year != 'null' && year != '') {
                            this.dataList.push(year);
                        }
                    }
                } else {
                    if (key == 'B1') {
                        //全部权限
                        this.getAllYear();
                        return;
                    } else {
                        var year = key.split('-')[1];
                        if (year != null && year != 'DQ' && year != 'null' && year != '') {
                            this.dataList.push(year);
                        }
                    }
                }
            }
        },
        getAllYear() {
            var role = this.vuex_userRole == 'R';
            var work = this.vuex_user.data.work == '0';
            var dx = {
                bossNumberS: '',
                bossNumberE: ''
            };
            if (role) {
                dx.bossNumberE = work ? this.vuex_user.phone : this.vuex_user.workData.bossNumber;
            } else {
                dx.bossNumberS = work ? this.vuex_user.phone : this.vuex_user.workData.bossNumber;
            }
            console.log('老数据', dx);
            this.$api.order.getOldOrders(dx).then((res) => {
                console.log('获取数据:', res);
                var resData = res.data.data;
                if (role) {
                    this.dataList = resData.R;
                } else {
                    this.dataList = resData.D;
                }

                if (this.dataList.length > 0) {
                    this.dropdownName = this.dataList[0];
                    this.date1 = this.dataList[0] + '-01-01';
                    this.date2 = this.getLastMillisecondOfYear(this.dataList[0]);

                    var timeO = (this.realTimeSel.startDate = this.dropdownName + '-01-01');
                    var timeT = (this.realTimeSel.endDate = this.getLastMillisecondOfYear(this.dropdownName));

                    this.date1 = this.dropdownName + '-01-01';
                    this.date2 = this.getLastMillisecondOfYear(this.dropdownName);

                    this.limitingTimeO = this.dropdownName + '-01-01';
                    this.limitingTimeT = this.getLastMillisecondOfYear(this.dropdownName);

                    this.getInIt();
                } else {
                    this.dropdownName = '暂无选项';
                }
            });
        },
        dropdown(e) {
            this.year = e;
            //验证权限
            var role = this.vuex_userRole == 'D';
            if (role) {
                var b1 = this.vuex_user.jurisdiction['B1-' + e] || this.vuex_user.jurisdiction['B1'];
                console.log('B1：', b1);
                if (b1 != undefined) {
                    //时间对比
                    console.log('当前权限：', b1);
                    var ifbig = this.compareDates(b1);
                    if (!ifbig) {
                        //通过
                        this.dropdownName = e;
                        this.selectionIcon = false;
                        var timeO = (this.realTimeSel.startDate = this.dropdownName + '-01-01');
                        var timeT = (this.realTimeSel.endDate = this.getLastMillisecondOfYear(this.dropdownName));
                        this.date1 = this.dropdownName + '-01-01';
                        this.date2 = this.getLastMillisecondOfYear(this.dropdownName);
                        this.limitingTimeO = this.dropdownName + '-01-01';
                        this.limitingTimeT = this.getLastMillisecondOfYear(this.dropdownName);
                        this.moneyCALL = false;
                        this.$refs.paging.refresh();
                    } else {
                        //请续费

                        this.$u.toast('已过期请续费');
                    }
                } else {
                    console.log('请购买：', b1);
                    this.$u.toast('请购买相关权限');
                }
            } else {
                var b2 = this.vuex_user.jurisdiction.B2;
                console.log('B2：', b2);
                if (b2 != undefined) {
                    console.log('当前权限：', b2);
                    var ifbig = this.compareDates(b2);
                    if (!ifbig) {
                        //通过
                        this.dropdownName = e;
                        this.selectionIcon = false;
                        var timeO = (this.realTimeSel.startDate = this.dropdownName + '-01-01');
                        var timeT = (this.realTimeSel.endDate = this.getLastMillisecondOfYear(this.dropdownName));
                        this.date1 = this.dropdownName + '-01-01';
                        this.date2 = this.getLastMillisecondOfYear(this.dropdownName);
                        this.limitingTimeO = this.dropdownName + '-01-01';
                        this.limitingTimeT = this.getLastMillisecondOfYear(this.dropdownName);
                        this.moneyCALL = false;
                        this.$refs.paging.refresh();
                    } else {
                        //请续费
                        console.log('请续费：', b2);
                        this.$u.toast('已过期请续费');
                    }
                } else {
                    console.log('请购买：', b2);
                    this.$u.toast('请购买相关权限');
                }
            }

            console.log('所有权限：', this.vuex_user.jurisdiction);
        },
        compareDates(dateString1) {
            // 创建一个新的Date对象
            var date1 = new Date();
            var date2 = new Date(dateString1);
            return date1.getTime() > date2.getTime();
        },
        getLastDayOfYear(year) {
            // 设置日期为下一年的1月0日，这将自动变为前一年的12月31日
            var date = new Date(year, 12, 0); // 注意月份是0-11，所以12月是11
            var lastDayString = date.toISOString().split('T')[0];
            return lastDayString;
        },

        jumpnView() {
            console.log('this.dropdownName', this.dropdownName);
            if (this.dropdownName == '' || this.dropdownName == '请选择') {
                this.$u.toast('请选择年份');
            } else {
                if (this.jurisdiction && this.orderList.length > 0) {
                    uni.navigateTo({
                        url: '/pages/subPack/formerYears/dataAnalysis?year=' + this.dropdownName
                    });
                } else {
                    this.$u.toast(this.jurisdiction ? '当前无往年数据' : '请购买相关权限');
                }
            }
        },
        ifZX(val) {
            return val.includes('zx-');
        },
        changeCustomer() {
            var ifWorkPort = this.vuex_userRole == 'R';
            if (!ifWorkPort) {
                this.realTimeSel.organizationE = this.customer;
            } else {
                this.realTimeSel.enterpriseS = this.customer;
            }
            this.$refs.paging.refresh();
        },
        refreshData() {
            var timeO = this.realTimeSel.startDate != '';
            var timeT = this.realTimeSel.endDate != '';

            console.log('===请求判断=refresh==>：', this.refresh);
            console.log('===请求判断=timeO==>：', timeO);
            console.log('===请求判断=timeT==>：', timeT);

            // this.checked = false
            if (this.refresh && timeO && timeT) {
                this.refresh = false;
                this.realTimeSel.role = this.vuex_userRole == 'R' ? '1' : '0';
                this.$api.order
                    .getFilteredOrders(this.realTimeSel)
                    .then((res) => {
                        console.log(res.data.data);

                        var orderList = res.data.data.map((obj) => {
                            return {
                                ...obj,
                                check: this.checked
                            };
                        });

                        this.$refs.paging.complete(orderList);

                        this.totalMoney = orderList.reduce((total, obj) => total + obj.price, 0);

                        this.refresh = true;
                        this.uloading = false;
                    })
                    .catch((res) => {
                        this.refresh = true;
                        this.$refs.paging.complete(false);
                        this.$u.toast('服务器响应失败');
                    });

                this.$api.order
                    .getFilteredOrderCount(this.realTimeSel)
                    .then((res) => {
                        console.log('当前订单个数：', res);
                        this.OrderQuantity = res.data.data[1];
                        this.OrderQuantitySum = res.data.data[0];
                    })
                    .catch((res) => {
                        this.refresh = true;
                        this.$u.toast('获取个数失败');
                    });
            } else {
                this.$refs.paging.complete([]);
            }
        },
        searchListenner() {
            var filterIndex = this.showTage;
            var ifWorkPort = this.vuex_userRole == 'R';

            if (filterIndex == '0') {
                if (!ifWorkPort) {
                    //发货 收货人
                    this.realTimeSel.kTakeE = this.field;
                } else {
                    this.realTimeSel.kTakeE = this.field;
                }
            }

            if (filterIndex == '1') {
                if (!ifWorkPort) {
                    //发货 电话号码
                    this.realTimeSel.kPhoneE = this.field;
                } else {
                    this.realTimeSel.kPhoneE = this.field;
                }
            }

            if (filterIndex == '2') {
                if (!ifWorkPort) {
                    //发货 收货地址
                    this.realTimeSel.kSiteE = this.field;
                } else {
                    this.realTimeSel.kSiteE = this.field;
                }
            }

            if (filterIndex == '3') {
                if (!ifWorkPort) {
                    //产品名称
                    this.realTimeSel.inventoryName = this.field;
                } else {
                    //产品名称
                    this.realTimeSel.inventoryName = this.field;
                }
            }

            this.$refs.paging.refresh();
            // this.field
        },
        dlPdf() {
            if (this.checked) {
                var dx = Object.assign({}, this.realTimeSel);
                dx.limitS = '';
                dx.role = this.vuex_userRole == 'R' ? '1' : '0';
                this.$api.order
                    .postOrderFilter(dx)
                    .then((res) => {
                        console.log('下载pdf的单据：', res.data.data);
                        this.downPdf(res.data.data);
                    })
                    .catch((res) => {
                        this.$u.toast('服务器响应失败');
                    });
            } else {
                var okDown = this.orderList.filter((res) => res.check == true);
                this.downPdf(okDown);
            }
        },
        downPdf(okDown) {
            if (okDown.length <= 0) {
                this.$u.toast('请选择单据~');
                return;
            }

            var condition = this.showTage == 0 ? '联系人' : this.showTage == 1 ? '联系号码' : this.showTage == 2 ? '收货地址' : this.showTage == 3 ? '产品名称' : '';
            if (this.field == '') {
                condition = this.field;
            }

            var dx = {
                start: this.realTimeSel.startDate,
                end: this.realTimeSel.endDate,
                cOrderList: okDown,
                port: this.vuex_userRole,
                condition: condition,
                text: this.field
            };

            if (!this.downPdfCheck) {
                this.$u.toast('请勿重复点击');
                return;
            }

            this.downPdfCheck = false;

            console.log(dx);
            this.$api.order
                .generateOrderPDF(dx)
                .then((res) => {
                    uni.downloadFile({
                        url: res.data.data,
                        success: (res) => {
                            if (res.statusCode === 200) {
                                console.log('下载成功');
                            }
                            let that = this;

                            var name = '';
                            if (this.vuex_user.ac != null) {
                                name = this.vuex_user.ac.enterpriseName;
                            }

                            if (name == null || name == undefined || name == '') {
                                name = this.vuex_user.phone;
                            }
                            var timeNowGet = this.$u.timeFormat(new Date(), 'yyyy年mm月dd日');

                            uni.getFileSystemManager().saveFile({
                                tempFilePath: res.tempFilePath,
                                filePath: wx.env.USER_DATA_PATH + '/' + 'YDJ-' + name + '-' + timeNowGet + '.pdf', //自定义文件名
                                success(res) {
                                    uni.openDocument({
                                        filePath: res.savedFilePath,
                                        showMenu: true, //是否可以分享
                                        success: (res) => {
                                            uni.hideLoading();
                                            console.log(res);
                                            that.checked = false;
                                            that.clearCheck();
                                        },
                                        fail: (e) => {
                                            uni.showToast({
                                                title: '打开失败',
                                                icon: 'error'
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                    this.hasCheck = false;
                    this.checked = false;
                })
                .catch((res) => {
                    this.$u.toast(res.message);
                });
        },
        clearCheck() {
            this.orderList.forEach((res) => (res.check = false));
            this.downPdfCheck = true;
        },
        getCurrentDate() {
            const date = new Date();
            const year = this.dropdownName;
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const day = ('0' + date.getDate()).slice(-2);
            return `${year}-${month}-${day}`;
        },
        getCurrentDateMin() {
            const year = this.dropdownName;
            return `${year}-01-01`;
        },
        timeMs(time) {
            var timeM = new Date(time);
            return timeM;
        },
        choiceGET(i) {
            this.field = '';
            this.checked = false;
            this.orderList.forEach((res) => {
                res.check = false;
            });
            this.hasCheck = false;

            this.showOrderTage = i;
            var state = i == 0 ? '' : i - 1;
            this.realTimeSel.paymentState = state;
            this.$refs.paging.reload();
        },
        Filtrate(i) {
            console.log(i);
            this.showTage = i;
            this.searchList.scope = i;
            this.field = '';
            if (i == '0') {
                this.realTimeSel.phoneE = '';
                this.realTimeSel.siteE = '';
                this.realTimeSel.inventoryName = '';

                this.realTimeSel.phoneS = '';
                this.realTimeSel.enterpriseDz = '';
                this.realTimeSel.inventoryName = '';
            } else if (i == '1') {
                this.realTimeSel.takeE = '';
                this.realTimeSel.siteE = '';
                this.realTimeSel.inventoryName = '';

                this.realTimeSel.contactsS = '';
                this.realTimeSel.enterpriseDz = '';
                this.realTimeSel.inventoryName = '';
            } else if (i == '2') {
                this.realTimeSel.phoneE = '';
                this.realTimeSel.takeE = '';
                this.realTimeSel.inventoryName = '';

                this.realTimeSel.contactsS = '';
                this.realTimeSel.phoneS = '';
                this.realTimeSel.inventoryName = '';
            } else if (i == '3') {
                this.realTimeSel.phoneE = '';
                this.realTimeSel.takeE = '';
                this.realTimeSel.siteE = '';

                this.realTimeSel.contactsS = '';
                this.realTimeSel.phoneS = '';
                this.realTimeSel.enterpriseDz = '';
            }

            this.TitleFun(i);
            this.$refs.paging.reload();
        },
        e1() {},
        e2() {},
        date1Change(e) {
            var len = this.dataList.length > 0;
            console.log(len);
            if (!len) {
                this.$u.toast('您没有相关产品记录~');
                return;
            } else {
                this.date1 = e.range.before;
                this.date2 = e.range.after;
                this.realTimeSel.startDate = this.date1;
                this.realTimeSel.endDate = this.date2;
                // this.searchList.start = e.result
                // if (this.date2 != '') {
                // 	if (this.date2 >= e.result) {
                // 		this.realTimeSel.startDate = this.date1;
                // 	} else {
                // 		this.$u.toast('开始日期不能大于结束日期~');
                // 		this.date1 = '';
                // 	}
                // } else {
                // 	this.realTimeSel.startDate = this.date1;
                // }
            }
        },
        filterSubmit() {
            if (this.dataList.length > 0) {
                this.show_start = false;
                this.realTimeSel.startDate = this.date1;
                this.realTimeSel.endDate = this.date2;
                this.$refs.paging.refresh();
            } else {
                this.show_start = false;
            }
        },
        getLastMillisecondOfYear(year) {
            const lastMillisecond = new Date(year, 11, 31, 23, 59, 59, 999);
            var date = new Date(lastMillisecond);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            console.log('d-----------', d);
            return `${y}-${m}-${d}`;
        },
        filterReset() {
            if (this.dropdownName == '暂无选项') {
                return;
            }

            this.date1 = this.dropdownName + '-01-01';
            this.date2 = this.getLastMillisecondOfYear(this.dropdownName);

            this.realTimeSel.startDate = this.dropdownName + '-01-01';
            this.realTimeSel.endDate = this.getLastMillisecondOfYear(this.dropdownName);

            // var timeNow = new Date();
            // var oneMonthAgo = this.$u.timeFormat(new Date(timeNow.getFullYear(), timeNow.getMonth() - 1, timeNow
            // 	.getDate()), 'yyyy-mm-dd');
            // var index = this.tagIndex

            // var timeNow = new Date();
            // var yearOneDate = new Date(timeNow.getFullYear(), 0, 1);
            // var timeNowGet = this.$u.timeFormat(new Date(), 'yyyy-mm-dd');
            // var oneWeekAgo = this.$u.timeFormat(new Date(timeNow.getTime() - 7 * 24 * 60 * 60 * 1000),
            // 	'yyyy-mm-dd')
            // var oneMonthAgo = this.$u.timeFormat(new Date(timeNow.getFullYear(), timeNow.getMonth() - 1, timeNow
            // 	.getDate()), 'yyyy-mm-dd');
            // var twoMonthsAgo = this.$u.timeFormat(new Date(timeNow.getFullYear(), timeNow.getMonth() - 2, timeNow
            // 	.getDate()), 'yyyy-mm-dd');
            // var threeMonthsAgo = this.$u.timeFormat(new Date(timeNow.getFullYear(), timeNow.getMonth() - 3, timeNow
            // 	.getDate()), 'yyyy-mm-dd');
            // var sixMonthsAgo = this.$u.timeFormat(new Date(timeNow.getFullYear(), timeNow.getMonth() - 6, timeNow
            // 	.getDate()), 'yyyy-mm-dd');

            // if (index == 0) {
            // 	if (oneWeekAgo < yearOneDate) {
            // 		oneWeekAgo = yearOneDate;
            // 	}
            // 	this.date1 = oneWeekAgo;
            // 	console.log("当前时间：", timeNowGet, "计算的时间：", oneWeekAgo < yearOneDate, "不能超过的时间：", yearOneDate);
            // 	this.realTimeSel.startDate = oneWeekAgo;

            // 	// console.log("前一周");
            // } else
            // if (index == 1) {
            // 	if (oneMonthAgo < yearOneDate) {
            // 		oneMonthAgo = yearOneDate;
            // 	}
            // 	this.date1 = oneMonthAgo
            // 	this.realTimeSel.startDate = oneMonthAgo;
            // 	// console.log("前一个月");
            // } else
            // if (index == 2) {
            // 	if (threeMonthsAgo < yearOneDate) {
            // 		threeMonthsAgo = yearOneDate;
            // 	}
            // 	this.date1 = threeMonthsAgo;
            // 	this.realTimeSel.startDate = threeMonthsAgo;
            // 	// console.log("前三个月");
            // } else
            // if (index == 3) {
            // 	if (sixMonthsAgo < yearOneDate) {
            // 		sixMonthsAgo = yearOneDate;
            // 	}
            // 	this.date1 = sixMonthsAgo;
            // 	this.realTimeSel.startDate = sixMonthsAgo
            // 	// console.log("前半年");
            // }
            // this.date2 = this.$u.timeFormat(new Date(), 'yyyy-mm-dd');

            this.showTage = '0';
            this.realTimeSel.phoneE = '';
            this.realTimeSel.organizationE = '';
            this.realTimeSel.enterpriseS = '';
            this.realTimeSel.enterpriseS = '';
            this.realTimeSel.takeE = '';
            this.realTimeSel.enterpriseDz = '';
            this.realTimeSel.inventoryName = '';
            this.realTimeSel.customer = '';
            this.field = '';
            this.realTimeSel.phoneS = '';
            this.realTimeSel.contactsS = '';
            this.realTimeSel.siteE = '';

            this.realTimeSel.kTakeE = '';
            this.realTimeSel.kPhoneE = '';
            this.realTimeSel.kSiteE = '';

            this.$refs.paging.reload();
        },
        checkboxGroupChange(event, index) {
            this.orderList[index].check = this.orderList[index].check ? false : true;

            var allNum = this.OrderQuantity;
            var num = 0;
            this.orderList.forEach((res) => {
                var check = res.check;
                if (check) {
                    num = num + 1;
                }
            });

            if (num == allNum) {
                this.checked = true;
            } else {
                this.checked = false;
            }
        },
        checkedAll() {
            var len = this.orderList.length;
            if (len > 0) {
                this.checked = !this.checked;
                this.orderList.forEach((res) => {
                    res.check = this.checked;
                });
            } else {
                this.$u.toast('您暂无可勾选的订单~');
            }
        },
        getData() {
            let that = this;
            var phone = this.vuex_user.data.work == '1' && this.vuex_user.workData.identity != '4' ? this.vuex_user.workData.bossNumber : this.vuex_user.phone;
            let zd = false;
            try {
                zd = this.vuex_user.workData.identity != '4';
            } catch (e) {
                //TODO handle the exception
                zd = false;
                if (this.vuex_user.workData == null || this.vuex_user.workData == undefined || this.vuex_user.workData == '') {
                    zd = true;
                    console.log('没有工作');
                }
            }

            if (this.vuex_userRole == 'D') {
                var dx = {};
                if (zd) {
                    dx = {
                        bossNumberS: phone
                    };
                } else {
                    dx = {
                        staffNumberS: phone
                    };
                }
                console.log(dx);
                this.$api.order
                    .getOrders(dx)
                    .then((res) => {
                        var resDate = res.data.data.map((item) => {
                            return {
                                ...item,
                                check: false
                            };
                        });
                        that.orderList = resDate;
                        console.log(that.orderList);
                        this.orderListCopy = resDate;
                        if (that.orderList.length > 0) {
                            this.loadData();
                        }
                    })
                    .catch((res) => {
                        that.$u.toast(that.message);
                    });
            } else {
                this.orderList = [];
                console.log('收货端');
                var dx = {};
                if (zd) {
                    dx = {
                        bossNumberE: phone
                    };
                } else {
                    dx = {
                        staffNumberE: phone
                    };
                }
                console.log(dx);
                this.$api.order
                    .getOrders(dx)
                    .then((res) => {
                        console.log(res.data.data);
                        this.orderList = res.data.data;
                        this.orderListCopy = res.data.data;
                        if (that.orderList.length > 0) {
                            this.loadData();
                        }
                    })
                    .catch((res) => {
                        that.$u.toast(that.message);
                    });
            }
        },
        loadData() {
            this.totalMoney = this.orderList.reduce((total, obj) => total + obj.price, 0);
        },
        filtrateGet() {
            this.show_start = true;
            this.realTimeSel.startDate = this.date1 != '' ? this.date1 : '';
            this.realTimeSel.endDate = this.date2 != '' ? this.date2 : '';
            // this.refreshData()
        },
        CustomerGet() {
            uni.navigateTo({
                url: '/pages/subOrder/table?show=0'
            });
        },
        jump() {
            console.log('跳转');
            uni.navigateTo({
                url: '/pages/statistics/company_name/company_name'
            });
        }
    }
};
</script>

<style lang="scss">
.fliter-wrap {
    .fliter-scroll {
        width: 520rpx;
    }

    ::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
        color: transparent;
    }

    .filter-btn {
        background: #fff;
        color: #333;
        border-radius: 100rpx;
        padding: 12rpx 35rpx;
        font-size: 26rpx;

        &.active {
            background: #1faf60;
            color: #fff;
        }
    }

    & > .filter-btn {
        margin-left: 20rpx;
    }
}

.list-data-wrap {
    background: linear-gradient(188.57deg, #fbfefb, #e8f5ed);
    box-shadow: 1rpx 1rpx 2rpx #eee;
}

.title {
    color: $u-type-primary;
    text-align: center;
    padding: 20rpx 0 0 0;
}

.order-item {
    border-radius: 20rpx;
    box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.03);
}

.copy-btn {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABf1JREFUaEPtWWtsFFUU/s5skUcxEUuC+ESpkYcJSkkU/UHpzmw7s7X4AITwqIEfmIgmaFBMJJRoYiDGRyAhISQU8YEW0LTdmXbuHSgRQyS8NKF/aCoimhgxJFqQlO4cM7vb7XZ3232StIn7r73nfOf77j3nPs4QRvmPRjl/FFVARUXFmLKyux5x3fDkXCeG2XfJcULdufoVLEDTgksYvASEuWBMz5VAkv1vYBxn4jMgOuvYpsiEl7cAj7gL3k7AtExBChjfL4W5ejj/vATEZv3rfmAGrgI4BOAcMS6zj/7OlTSFMYnIfZBB5SCUg6HGMG4w8SrHtg6mw8xZgBowNoHxfgysl4C3e3pKd5040fRvrqSHs/drwQ8I/Ea/DYErhbCOJfvkJEDTjFUMfBoD6WSFXnbaQ98Vk3giVlUg+JTC/H3sfzzpjtJxTU1NvYk2WQtYWF07x+eGHYDKAHT6FN/S9vaW87eKfD+uqgZngrgz8jfhI2mbr+clQA0YG8D4EAAXSPociI8R00lAOSVE64VMeKpqvAPCu1ENWC2EuX8gtTJ4+wP6YmJaD2BBpkB5jn/JbskGx2n+Yyj/+fOXjC+deM1LpccJdECI0PKMAgKBQGmYfY0EWpy0ZFcZ6ALoWn6E2UvBcgDjE/yvM9EGxw7tHgpT04ydDLwCoFsKM37epK2BqqraexQf7wPYHwO8AMbGkhL3x7a2tov5ER/sFQgEZrhuybOg+I7mJYgpRSiYDt8fCK4l5j3emEK+h2y75edYSg02r66unuq6PouBOd4Igw9c75m4ptjb5ECR1laC3CYA0esHc72UVv9OFydXVVU9V/H5TkdMiJc5tvVVWgGqamwBoSE6yPuEsF4qxoxnwlA1w9vRZsVEzJXSOpvso2rBCwCXM/Fzjm19myLAm/2wq5wC6G6AuqQIPZwpcLHGVbX2fpD7Swzv2PhxPqOlpeV6Mr6mBVcKEfosbREnzr5CbNi2ZRWLYDY4qqqvB9GO6CpghZTmF8l+lZXPTO7oaLmSVoBfM/YS4KXMD1KYT2YTtJg2NTU10/rCSqQ4wXhPSnNzIr6mBZsYvNhVlCeOtLeeTEkhVTOOA3gazDuktF4rJrlssVTN8E7dmSAckrY5aAtXNcO7RowB86tSWjvTCfjT2w2YeKVjW59nG7SYdpqmNzKo3ruuSGHOTsRWNcNLqeWuolQcaW89k05A9JrA7kIp2zqKSSxbrMQ6lMJMOafq6upub25u/id9EWvGiBbgDwTriXmBFOaaUSlAjU8wGqQ0t466FEoQsFVKM3bYJiTngMHIrIH/VyDbnaQQu+F2odGSQg0gbPEmIXEb1XV97M0+uhEtXNokRGjbSC3itAKqdH260kddMQFLhQh5V/DBrcURUsRpBahqTSVIOeqRVojm2XYo8jYYdNKNbAH6ZyBa4ZEeexvdGQqFvGba6BBQqev3lvQp5wAuA9NuKUPrRvJJnJJCmmbsYWBtcvqMihXQNOMTBqJX+6TZH/ECABwG8Hxs5zkoRGhpcmMtuYi9h/RjBH5LCGt7IQdSvr4Jr8I4BIHSkk9ZAU0z9nL0SXlYCvOFfEkU4qdq+lGAKiMZ47XtCQ2ObXrv5LQtzUEr4Nf0Nwm0jQiXhW3eVwiRfHz9fn0WKRRtGBPv4vC4zY7zzV/DYQ1OIdVYBEKk38LgbY6wNuVDJF8fTQs2MriegdOOMOdlg5PyZFM1vQ2g6mjVKw9I2XopG6BCbRK/+jDRuuH6pImxUgREDw36NbqM+EnaZqTFeCt/MfJeq5Bymf2UIu4n6Q/U1BMrjXHSjBelNOPfxIolxmtS+caENxKwMXoroN8JvEgI81S2MYb8QlMV0HWFyUzYyyRc7oZCXcTu+Xzb60SYwExTXMJUYnhfIGdEY/BNdhXDcUIyW/JDrkB8Jfx1UxTl5scMWpYLaM62jFZF4d22bbXk6pvVNzJVNRqIaDaDHx2YsVxDpdh3g9GZL/F+tKwEJIaOfLkJK7OIUJqPBEXxXentnXCxo6OpJx//ZJ+cBRQjaDExRr2A/wCaZNNPvTsrRgAAAABJRU5ErkJggg==)
        right center no-repeat;
    background-size: 25rpx;
}

.fixed-add-btn {
    background: 'transparent';
}

.fixed-add-btn .add-btn {
    width: 260rpx;
    height: 100rpx;
    line-height: 100rpx;
    border-radius: 120rpx;
    background: #0fb076;
    border: 10rpx solid #def1e1;
}

.slot-wrap {
    border: 1rpx solid #eee;
    border-radius: 100rpx;
    padding: 0 15rpx;
    cursor: pointer;
}

.slot-wrap:active {
    background: #efefef;
}

.check-company:active {
    background: rgba(0, 0, 0, 0.03);
}

.check-company .u-line-1 {
    max-width: 220rpx;
}

.query-btn {
    position: fixed;
    right: 15rpx;
    bottom: 120rpx;
    bottom: calc(120rpx + env(safe-area-inset-bottom));
    bottom: calc(120rpx + constant(safe-area-inset-bottom));
    z-index: 10;
    background: #f80;
    width: 100rpx;
    height: 100rpx;
    border: 10rpx solid #f7e0cd;
    border-radius: 100%;
    box-sizing: content-box;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    text {
        font-size: 22rpx;
        line-height: 22rpx;
    }

    &:active {
        opacity: 0.8;
    }
}

.hl-btn.bg-gray {
}

.u-img {
    float: right;
}

.cardEacher {
    border-radius: 12.62rpx;
    opacity: 1;
    background: #ffffff;
}

.color-block {
    width: 20rpx;
    /* 设置方块宽度 */
    height: 20rpx;
    /* 设置方块高度 */
    /* 设置方块颜色为红色 */
}

.earchTitle {
    font-size: 30.68rpx;
    font-weight: 600;
    line-height: 42.18rpx;
    letter-spacing: 0rpx;
    color: #333333;
}

.buyOrder {
    width: 378.24rpx;
    height: 88.86rpx;
    border-radius: 376rpx;
    opacity: 1;
    /* 矩形 228 */

    width: 378.24rpx;
    height: 88.86rpx;
    border-radius: 376rpx;
    opacity: 1;

    background: linear-gradient(270deg, #44495f -7%, #56638a 100%);

    font-family: Source Han Sans;
    font-size: 36rpx;
    font-weight: 500;
    line-height: 42.24rpx;
    text-align: center;
    letter-spacing: 0rpx;

    font-variation-settings: 'opsz' auto;
    font-feature-settings: 'kern' on;
    color: #ffffff;
}
</style>
