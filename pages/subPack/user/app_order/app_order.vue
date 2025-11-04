<template>
	<view class="Myorder">
		<up-navbar :autoBack="true" :placeholder="true" title="我的订购" leftIconColor="#fff" bgColor="transparent" :titleStyle="{ color: '#fff' }"></up-navbar>

		<pop-details ref="popDetails"></pop-details>

		<up-tabs
			:inactiveStyle="{ color: '#D6AE83' }"
			:itemStyle="{ backgroundColor: 'transparent', height: '80rpx' }"
			:activeStyle="{ color: '#D6AE83' }"
			lineColor="#D6AE83"
			:list="TabList"
			:scrollable="false"
			:current="current"
			@change="TabChange"
		></up-tabs>
		<view v-show="current != 2" class="pt48 pl24 pr24 pb36">
			<view class="tcdgTop1 pl30">
				<view class="tag">{{ current == 0 ? '升级套餐' : '未开通' }}</view>
				<view class="tcdgTop1_1 flex-row items-center pt48 pb24">
					<image
						:src="current == 0 ? 'https://res-oss.elist.com.cn/app/img/order/jcbtc.svg' : 'https://res-oss.elist.com.cn/app/img/order/zwzxqy.svg'"
						mode="heightFix"
					></image>
					<text class="ft24" v-if="current == 0">（子账号已用7/10）</text>
					<text class="xfBtn flex-row items-center justify-center" v-if="current == 1">开通</text>
				</view>
				<view class="ft26">
					<view class="flex-row items-center mb20" v-show="current == 0">
						<text>有效期到2025.06.09</text>
						<text class="xfBtn flex-row items-center justify-center">续费</text>
					</view>
					<view class="ft24 flex-col" v-show="current == 1">
						<text class="mb10">当前未开通任何账号套餐，开通后</text>
						<text class="mb20">可添加员工账号协同使用</text>
					</view>
					<view class="">
						<text>法律签署包：已购</text>
						<text class="colorFD">100</text>
						<text>份 剩余</text>
						<text class="colorFD">32</text>
						<text>份</text>
					</view>
				</view>
				<view class="tcdgTop1_2 flex-row items-center">
					<text v-show="current == 0">统计对账已开通</text>
					<view class="flex-row items-center" v-show="current == 1">
						<text>统计对账未开通</text>
						<view class="flex-row items-center ml30">
							<text class="colorFD">去开通</text>
							<wd-icon name="arrow-right" size="22rpx" color="#FE5E2E"></wd-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
		<scroll-view :show-scrollbar="false" scroll-y="true" style="height: 50%">
			<view class="pl24 pr24" v-show="current != 2">
				<view class="tcdgTop2 flex-row items-center justify-center">
					<text class="lineLeft"></text>
					<text>开通专享权益</text>
					<text class="lineRight"></text>
				</view>
				<view class="tcdgTop3 flex-row items-center justify-around">
					<view class="flex-col items-center justify-center">
						<image src="https://res-oss.elist.com.cn/app/img/order/ddcx.svg" mode=""></image>
						<text>订单查询</text>
						<text>更多数据</text>
					</view>
					<view class="flex-col items-center justify-center">
						<image src="https://res-oss.elist.com.cn/app/img/order/fvqs.svg" mode=""></image>
						<text>法律签署</text>
						<text>CA认证</text>
					</view>
					<view class="flex-col items-center justify-center">
						<image src="https://res-oss.elist.com.cn/app/img/order/zhgl.svg" mode=""></image>
						<text>账号管理</text>
						<text>更多账号</text>
					</view>
				</view>
			</view>
			<view class="BodyQBQY" v-show="current != 2">
				<view class="BodyQBQYScrollView">
					<view class="" v-show="current == 0">
						<view class="BodyQBQYScrollViewHand" style="padding-bottom: 20rpx">
							<text class="Hand_title mr10">套餐选择</text>
							<up-icon @click="popDetails(1, item)" size="23rpx" name="question-circle" color="#AAAAAA"></up-icon>
						</view>
						<view class="pl24 pr24">
							<scroll-view :show-scrollbar="false" scroll-x="true" style="width: 100%">
								<view class="flex-row pt30">
									<view v-for="(item, index) in 3" :key="index" class="tcxzBox flex-col items-center justify-center">
										<view class="">基础版{{ index }}</view>
										<view class="">
											<text>￥</text>
											<text>159</text>
											<text>/年</text>
										</view>
										<view class="">
											<text class="mr10">限时3天优惠</text>
											<text>￥199</text>
										</view>
										<view class="">添加{{ index }}个子账号</view>
										<view class="tags">适合个人商户{{ index }}</view>
									</view>
								</view>
							</scroll-view>
						</view>
						<view class="BodyQBQYScrollViewHand" style="padding-bottom: 20rpx">
							<text class="Hand_title mr10">法律签署能力</text>
							<up-icon @click="popDetails(1, item)" size="23rpx" name="question-circle" color="#AAAAAA"></up-icon>
						</view>
						<view class="pt30 pl24 pr24">
							<view class="flqsnlBox relative">
								<view class="ft28 ft-500 mb20">法律签署包</view>
								<view class="flex-row items-center justify-between ft24 mb36">
									<view class="">
										<text>已购：</text>
										<text>100份</text>
										<text>剩余：</text>
										<text>32份</text>
									</view>
									<view class="flex-row items-center">
										<text class="ft-gray">追加份数：</text>
										<up-number-box
											color="#FD5B75"
											:disabledInput="true"
											:integer="true"
											buttonWidth="30rpx"
											buttonRadius="2rpx"
											buttonSize="30rpx"
											inputBgColor="transparent"
											:min="0"
											bgColor="#EA7183"
											v-model="playMoneyListSend.c_product_people.c"
											@change="valChangec"
											:iconStyle="{ color: '#fff', fontSize: '18rpx' }"
										></up-number-box>
									</view>
								</view>
								<view class="text-right">
									<text class="ft24 ft-gray">当前费用：</text>
									<text class="ft-500">￥300.00</text>
								</view>
								<view class="tags">CA 认证 + PDF留档</view>
								<view
									v-if="showAuth"
									class="covers flex-col items-center justify-center"
									@click="
										uni.navigateTo({
											url: '/pages/subAuth/dataAuthentication/dataAuthentication'
										})
									"
								>
									<text class="qrzBtn ft-white flex-row justify-center items-center mb20">去认证</text>
									<text class="ft24">购买法律签署包请先前往认证</text>
								</view>
							</view>
						</view>
					</view>
					<view v-show="current == 1">
						<view class="BodyQBQYScrollViewHand">
							<!-- <view class="Hand_icon"></view> -->
							<text class="Hand_title">统计对账</text>
						</view>
						<view class="BodyQBQYScrollView_CardOne">
							<view
								class="card_people"
								v-for="(item, index) in c_product_statistics"
								:key="index"
								:class="(index == 0 ? check.A.checkA : check.A.checkB) ? 'card_peopleAct' : ''"
								@click="checkboxClick(index)"
							>
								<view class="card_people_icon">
									<wd-icon size="90rpx" name="https://res-oss.elist.com.cn/wxImg/vip/jyn.svg"></wd-icon>
								</view>
								<view class="card_people_title">
									<view class="card_people_title_one">
										<view class="relative flex-row items-start">
											<text class="mr10">{{ item.product || '' }}</text>
											<!-- #ifdef MP-WEIXIN -->
											<up-icon @tap.stop @click="popDetails(1, item)" class="mb10 ml5 absolute" size="23rpx" name="question-circle" color="#AAAAAA"></up-icon>
											<!-- #endif -->
											<!-- #ifdef APP -->
											<up-icon @click="popDetails(1, item)" class="mb10 ml5 absolute" size="23rpx" name="question-circle" color="#AAAAAA"></up-icon>
											<!-- #endif -->
										</view>
									</view>
									<view class="card_people_title_two">
										<text class="grandsonText">{{ item.detailedInformation || '' }}</text>
									</view>
								</view>
								<view class="card_people_price">
									<text class="grandsonPriceSign">￥</text>
									<text class="grandsonPrice">{{ item.priceDiscount || 0 }}/年</text>
									<view class="grandsonPriceOriginal ml10">￥{{ item.price || 0 }}</view>
								</view>
								<!-- <view class="card_people_check">
									<view
										class="flex-col justify-center items-center"
										:style="{
											backgroundColor: (index == 0 ? check.A.checkA : check.A.checkB) ? '#EA7183' : '#ffffff'
										}"
										style="border-radius: 100rpx; height: 32rpx; width: 32rpx; border: 2rpx solid #aaaaaa"
									>
										<up-icon name="checkbox-mark" color="#ffffff" size="20rpx"></up-icon>
									</view>

									<view class="absolute" style="right: 30rpx; top: -4rpx" v-if="index == 1">
										<up-image width="140rpx" height="50rpx" src="https://res-oss.elist.com.cn/wxImg/order/tj.png"></up-image>
									</view>
								</view> -->
							</view>
						</view>
					</view>
				</view>
				<view class="NullView"></view>
			</view>
		</scroll-view>
		<view class="BodyWDDD" v-show="current == 2">
			<view class="vw100" style="margin-top: 50%; height: 200rpx" v-if="jurisdictionOrdder.length == 0">
				<up-empty
					icon="https://ydj-lsy.oss-cn-shanghai.aliyuncs.com/applet-img/img/role/dbsx.svg"
					iconSize="400rpx"
					text="暂无购买记录~"
					mode="search"
					marginTop="200rpx"
				></up-empty>
			</view>

			<scroll-view scroll-y="true" class="BodyWDDDScrollView" v-if="jurisdictionOrdder.length">
				<view
					v-for="(item, index) in jurisdictionOrdder"
					:key="index"
					class="orderCard ml24 mr24 mt48"
					style="width: 94%; background-color: #ffffff; min-height: 20vh; color: #666666; font-size: 26rpx"
				>
					<view class="relative pd20 ml20 mr20">
						<view class="absolute" style="left: 0">订单编号：{{ item.orderNumber }}</view>
						<view class="absolute" style="right: 0; color: #ea7183">
							{{ item.payOrder == 1 ? '交易完成' : '交易异常' }}
						</view>
					</view>

					<view class="pd20 mt25">
						<view
							v-for="(item2, index2) in item.peopleRenew"
							v-show="item2.jurisdictionCode == 'C1'"
							:key="index2"
							class="flex-row justify-left relative mt30"
							style="width: 100%"
						>
							<view class="mr15" style="width: 15%">
								<up-avatar :src="img" mode="circle"></up-avatar>
							</view>
							<view class="items-center">
								<view class="flex-col justify-center ddbt" style="height: 50%">人员续费(财务) 一年</view>
								<view class="flex-col justify-center dqsj" style="height: 50%">{{ $u.timeFormat(item2.endTime, 'yyyy-mm-dd') }}到期 ×{{ item2.sum }}</view>
							</view>
							<view class="absolute" style="right: 10rpx">￥{{ item.priceAll.C1 }}</view>
						</view>

						<view
							v-for="(item2, index2) in item.peopleRenew"
							v-show="item2.jurisdictionCode == 'C2'"
							:key="index2"
							class="flex-row justify-left relative mt30"
							style="width: 100%"
						>
							<view class="mr15" style="width: 15%">
								<up-avatar :src="img" mode="circle"></up-avatar>
							</view>
							<view class="items-center">
								<view class="flex-col justify-center ddbt" style="height: 50%">人员续费(员工) 一年</view>
								<view class="flex-col justify-center dqsj" style="height: 50%">{{ $u.timeFormat(item2.endTime, 'yyyy-mm-dd') }}到期 ×{{ item2.sum }}</view>
							</view>
							<view class="absolute" style="right: 10rpx">￥{{ item.priceAll.C2 }}</view>
						</view>

						<view
							v-for="(item2, index2) in item.peopleRenew"
							v-show="item2.jurisdictionCode == 'C3'"
							:key="index2"
							class="flex-row justify-left relative mt30"
							style="width: 100%"
						>
							<view class="mr15" style="width: 15%">
								<up-avatar :src="img" mode="circle"></up-avatar>
							</view>
							<view class="items-center">
								<view class="flex-col justify-center ddbt" style="height: 50%">人员续费(合伙人) 一年</view>
								<view class="flex-col justify-center dqsj" style="height: 50%">{{ $u.timeFormat(item2.endTime, 'yyyy-mm-dd') }}到期 ×{{ item2.sum }}</view>
							</view>
							<view class="absolute" style="right: 10rpx">￥{{ item.priceAll.C3 }}</view>
						</view>

						<view class="mt30" style="width: 100%" v-if="IFJCODE(item.peopleRenew, 'C1') || IFJCODE(item.peopleRenew, 'C1')">
							<up-divider class="mt20" border-color="#F4F4F4" half-width="290" :use-slot="false"></up-divider>
						</view>

						<view
							v-for="(item3, index3) in item.product"
							:key="index3"
							v-show="getProductIFC(index3, 'B1')"
							class="flex-row justify-left relative mt30"
							style="width: 100%"
						>
							<view class="items-center">
								<view class="flex-col justify-center ddbt" style="height: 50%">往年数据{{ getProductC(index3) }}年(发货端) 一年</view>
								<view class="flex-col justify-center dqsj" style="height: 50%">{{ item3 }}到期</view>
							</view>
							<view class="absolute" style="right: 10rpx">￥{{ item.priceAll.B1 }}</view>
						</view>

						<view class="mt30" style="width: 100%" v-if="IFKEY(item.product, 'B1')">
							<up-divider class="mt20" border-color="#F4F4F4" half-width="290" :use-slot="false"></up-divider>
						</view>

						<view
							v-for="(item3, index3) in item.product"
							:key="index3"
							v-show="getProductIFC(index3, 'B2')"
							class="flex-row justify-left relative mt30"
							style="width: 100%"
						>
							<view class="items-center">
								<view class="flex-col justify-center ddbt" style="height: 50%">往年数据{{ getProductC(index3) }}年(收货端) 一年</view>
								<view class="flex-col justify-center dqsj" style="height: 50%">{{ item3 }}到期</view>
							</view>
							<view class="absolute" style="right: 10rpx">￥{{ item.priceAll.B2 }}</view>
						</view>

						<view class="mt30" style="width: 100%" v-if="IFKEY(item.product, 'B2')">
							<up-divider class="mt20" border-color="#F4F4F4" half-width="290" :use-slot="false"></up-divider>
						</view>

						<view
							v-for="(item3, index3) in item.product"
							:key="index3"
							v-show="getProductIFC(index3, 'A1')"
							class="flex-row justify-left relative mt30"
							style="width: 100%"
						>
							<view class="items-center">
								<view class="flex-col justify-center ddbt" style="height: 50%">统计对账(近三月数据)一年</view>
								<view class="flex-col justify-center dqsj" style="height: 50%">{{ item3 }}到期</view>
							</view>
							<view class="absolute" style="right: 10rpx">￥{{ item.priceAll.A1 }}</view>
						</view>
						<view class="mt30" style="width: 100%" v-if="IFKEY(item.product, 'A1')">
							<up-divider class="mt20" border-color="#F4F4F4" half-width="290" :use-slot="false"></up-divider>
						</view>

						<view
							v-for="(item3, index3) in item.product"
							:key="index3"
							v-show="getProductIFC(index3, 'A2')"
							class="flex-row justify-left relative mt30"
							style="width: 100%"
						>
							<view class="items-center">
								<view class="flex-col justify-center ddbt" style="height: 50%">统计对账(近一年数据)一年</view>
								<view class="flex-col justify-center dqsj" style="height: 50%">{{ item3 }}到期</view>
							</view>
							<view class="absolute" style="right: 10rpx">￥{{ item.priceAll.A2 }}</view>
						</view>
						<view class="mt30" style="width: 100%" v-if="IFKEY(item.product, 'A2')">
							<up-divider class="mt20" border-color="#F4F4F4" half-width="290" :use-slot="false"></up-divider>
						</view>

						<view
							v-for="(item3, index3) in item.product"
							:key="index3"
							v-show="getProductIFC(index3, 'C1')"
							class="flex-row justify-left relative mt30"
							style="width: 100%"
						>
							<view class="items-center">
								<view class="flex-col justify-center ddbt" style="height: 50%">新增账号(财务) 一年</view>
								<view class="flex-col justify-center dqsj" style="height: 50%">{{ item3 }}到期 ×{{ getProductC(index3) }}</view>
							</view>
							<view class="absolute" style="right: 10rpx">￥{{ item.priceAll.C1 }}</view>
						</view>

						<view
							v-for="(item3, index3) in item.product"
							:key="index3"
							v-show="getProductIFC(index3, 'C2')"
							class="flex-row justify-left relative mt30"
							style="width: 100%"
						>
							<view class="items-center">
								<view class="flex-col justify-center ddbt" style="height: 50%">新增账号(员工) 一年</view>
								<view class="flex-col justify-center dqsj" style="height: 50%">{{ item3 }}到期 ×{{ getProductC(index3) }}</view>
							</view>
							<view class="absolute" style="right: 10rpx">￥{{ item.priceAll.C2 }}</view>
						</view>

						<view
							v-for="(item3, index3) in item.product"
							:key="index3"
							v-show="getProductIFC(index3, 'C3')"
							class="flex-row justify-left relative mt30"
							style="width: 100%"
						>
							<view class="items-center">
								<view class="flex-col justify-center ddbt" style="height: 50%">新增账号(合伙人) 一年</view>
								<view class="flex-col justify-center dqsj" style="height: 50%">{{ item3 }}到期 ×{{ getProductC(index3) }}</view>
							</view>
							<view class="absolute" style="right: 10rpx">￥{{ item.priceAll.C3 }}</view>
						</view>

						<view class="mt30" style="width: 100%" v-if="IFKEY(item.product, 'C1') || IFKEY(item.product, 'C2')">
							<up-divider class="mt20" border-color="#F4F4F4" half-width="290" :use-slot="false"></up-divider>
						</view>

						<view
							v-for="(item4, index4) in item.product"
							:key="index4"
							v-show="getProductIFC(index4, 'O1')"
							class="flex-row justify-left relative mt30"
							style="width: 100%"
						>
							<view class="items-center">
								<view class="flex-col justify-center ddbt" style="height: 50%">一键开单 半年</view>
								<view class="flex-col justify-center dqsj" style="height: 50%">{{ item4 }}到期 ×1</view>
							</view>
							<view class="absolute" style="right: 10rpx">￥{{ item.priceAll.O1 }}</view>
						</view>

						<view
							v-for="(item4, index4) in item.product"
							:key="index4"
							v-show="getProductIFC(index4, 'O2')"
							class="flex-row justify-left relative mt30"
							style="width: 100%"
						>
							<view class="items-center">
								<view class="flex-col justify-center ddbt" style="height: 50%">一键开单 一年</view>
								<view class="flex-col justify-center dqsj" style="height: 50%">{{ item4 }}到期 ×1</view>
							</view>
							<view class="absolute" style="right: 10rpx">￥{{ item.priceAll.O2 }}</view>
						</view>

						<view class="mt30" style="width: 100%" v-if="IFKEY(item.product, 'O1') || IFKEY(item.product, 'O2')">
							<up-divider class="mt20" border-color="#F4F4F4" half-width="290" :use-slot="false"></up-divider>
						</view>

						<view class="flex-row justify-left relative mt30" style="width: 100%; height: 70rpx">
							<view class="flex-row items-center absolute" style="right: 0">
								<button class="hl-btn-plus ml20 flex-row items-center justify-center" type="default" @click="invoice(item)">
									<text v-if="item.file == '0'" style="color: #bb9063; font-size: 26rpx; font-weight: normal">申请发票</text>
									<text v-if="item.file != '0' && item.file != '1'" style="color: #bb9063; font-size: 26rpx; font-weight: normal">发票下载</text>
									<text v-if="item.file == '1'" style="color: #bb9063; font-size: 26rpx; font-weight: normal">申请中</text>
								</button>
								<button class="hl-btn-plus ml20 flex-row items-center justify-center" open-type="contact" type="default">
									<text style="color: #bb9063; font-size: 26rpx; font-weight: normal">售后咨询</text>
								</button>
								<!-- <button class="hl-btn-plus ml20 flex-row items-center justify-center"
									@click="$goPath('/pages/subMessage/chitchat/chat?type=9')" type="default">
									<text style="color: #BB9063;font-size: 26rpx;font-weight: normal;">售后咨询</text>
								</button> -->
							</view>
						</view>

						<view class="flex-row justify-left relative mt30" style="width: 100%">
							<view class="items-center">
								<view class="flex-col justify-center ddbt" style="height: 50%">合计</view>
							</view>
							<view class="absolute" style="right: 10rpx">￥{{ item.price }}</view>
						</view>

						<view class="flex-row justify-left relative mt30" style="width: 100%">
							<view class="items-center">
								<view class="flex-col justify-center ddbt" style="height: 50%">支付时间</view>
							</view>
							<view class="absolute" style="right: 10rpx">
								{{ $u.timeFormat(item.payTime, 'yyyy-mm-dd hh:MM:ss') }}
							</view>
						</view>

						<view v-if="item.open" class="flex-col justify-left relative mt30" style="width: 100%">
							<view v-if="showMore" class="flex-row justify-left relative" style="width: 100%">
								<view class="items-center">
									<view class="flex-col justify-center ddbt" style="height: 50%">支付方式</view>
								</view>
								<view class="absolute" style="right: 10rpx">微信支付</view>
							</view>
							<view v-if="showMore" class="flex-row justify-left relative mt30" style="width: 100%">
								<view class="items-center">
									<view class="flex-col justify-center ddbt" style="height: 50%">下单时间</view>
								</view>
								<view class="absolute" style="right: 10rpx">
									{{ $u.timeFormat(item.createTime, 'yyyy-mm-dd hh:MM:ss') }}
								</view>
							</view>
						</view>

						<view class="flex-row justify-center mt30" style="width: 100%">
							<view class="items-center dqsj flex-row" v-if="!item.open" @click="open(item, index)">
								<text>全部订单信息</text>
								<view class="ml5">
									<up-icon name="arrow-down" color="#999999" size="28rpx"></up-icon>
								</view>
							</view>
							<view class="items-center dqsj flex-row" v-if="item.open" @click="close(item, index)">
								<text>收起</text>
								<view class="ml5">
									<up-icon name="arrow-up" color="#999999" size="28rpx"></up-icon>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="BodyWDDDScrollViewEmpty"></view>
			</scroll-view>
		</view>

		<view class="PlyBtn" v-if="current != 2 && showIdently">
			<view class="btn">
				<view class="absolute" style="left: 60rpx">
					合计支付：
					<text>￥{{ playMoneyListSend.totalPrice.toFixed(2) }}</text>
				</view>
				<view class="absolute" style="right: 64rpx; color: #3f311b; font-weight: 600" @click="Play">立即购买</view>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			showAuth: true,
			popupShow: false,
			popupShowText: 0,
			popupShow2: false,
			popupShowText2: 0,
			showMore: true,
			TabList: [
				{
					name: '套餐订购'
				},
				{
					name: '功能服务'
				},
				{
					name: '订购历史'
				}
			],
			administrationManagement: [
				{
					name: '新增账号'
				},
				{
					name: '人员续费'
				}
			],
			selectionIcon: true,
			checkboxYear: false,
			tabUrlImg: {
				bgUrlOne: "url('https://res-oss.elist.com.cn/wxImg/vip/l.svg')",
				bgUrlTow: "url('https://res-oss.elist.com.cn/wxImg/vip/r.svg')",
				l: "url('https://guanlutech.oss-cn-shanghai.aliyuncs.com/wxImg/vip/l.svg')",
				r: "url('https://guanlutech.oss-cn-shanghai.aliyuncs.com/wxImg/vip/r.svg')"
			},
			current: 0,
			currentVip: 0,
			moneyList: {
				halFyear: false,
				aYearAgo: true
			},

			value1: 1,
			dataList: [],
			dataListAll: [],
			value: 0,
			c_product_statistics: [],
			c_product_old_data: [],
			c_product_people: [],
			playMoneyListSend: {
				c_product_statistics: -1,
				c_product_old_data: -1,
				c_product_people: {
					a: 0,
					b: 0,
					c: 0
				},
				totalPrice: 0,
				CODE: [],
				peopleRenew: [],
				price: {
					A1: 0,
					A2: 0,
					B1: 0,
					B2: 0,
					C1: 0,
					C2: 0
				},
				time: ''
			},
			check: {
				A: {
					checkA: false,
					checkB: false
				},
				B: {
					checkA: true,
					checkB: true
				}
			},
			dropdownName: '请选择',
			play: {
				year: '',
				statistics: [],
				old: [],
				people: []
			},
			jurisdiction: {},
			jurisdictionOrdder: [],
			renew: {},
			img: 'https://res-oss.elist.com.cn/wxImg/obj/defind.svg',
			line: [],
			showIdently: false,
			srdz: {
				img: '',
				ad: 'https://res-oss.elist.com.cn/wxImg/vip/mbimg.svg',
				ls: 'https://guanlutech.oss-cn-shanghai.aliyuncs.com/wxImg/vip/mbimg.png',
				ios: 'https://res-oss.elist.com.cn/wxImg/vip/mbimg.png'
			},
			system: true,
			buttonStyle: {
				backgroundColor: 'transparent',
				border: 'none',
				appearance: 'none',
				outline: 'none',
				boxShadow: 'none',
				height: '100%',
				width: '100%',
				padding: '0',
				color: '#E7647F',
				fontSize: '20rpx',
				borderRadius: '6rpx'
			}
		};
	},
	onLoad(option) {
		// if (option.tab!=undefined) {
		// 	this.current=option.tab
		// }
	},
	onShow() {
		this.init();
		this.systemIf();
		this.getData();

		var ifwork = this.pinia_user.data.work == '0';
		if (ifwork) {
			this.getJurisdiction();
			this.getRenew();
			this.getJurisdictionOrder();
			this.showIdently = true;
		} else {
			console.log('无权查看');
		}
	},
	methods: {
		synchronizationData() {
			this.getData();
			this.getRenew();
			this.$loadUser(this);
			// this.getJurisdictionOrder();
		},
		alertTitle() {
			this.$u.toast('请选择购买的账号数量~');
		},
		init() {
			this.check.A.checkA = false;
			this.check.A.checkB = false;
			this.check.B.checkA = true;
			this.check.B.checkB = true;
			this.playMoneyListSend.c_product_old_data = -1;
			this.playMoneyListSend.c_product_people.a = 0;
			this.playMoneyListSend.c_product_people.b = 0;
			this.playMoneyListSend.c_product_statistics = -1;
			this.playMoneyListSend.totalPrice = 0;
		},
		popDetails(type, item) {
			console.log(item);

			if (type == 3) {
				item.type = item.type + 'X';
			}

			var dx = {
				type: item.type
			};
			// CNotice
			console.log('获取详情', item);
			uni.$api.inform.getNoticeList(dx).then((res) => {
				this.$refs.popDetails.show = true;
				this.$refs.popDetails.popupShowText = JSON.parse(JSON.parse(JSON.stringify(res.data.data)).json);
				this.$refs.popDetails.type = type;
				console.log(this.$refs.popDetails.show);
			});
		},
		rightClick() {
			console.log('rightClick');
			uni.switchTab({
				url: '/pages/user/index'
			});
		},
		expireDate(date) {
			let now = new Date();
			let month = now.getMonth() + 1;
			if (month > 11) {
				now.setFullYear(now.getFullYear() + 1);
				month = 0;
			}
			now.setMonth(month);
			let nows = new Date(this.$u.timeFormat(date, 'yyyy-mm-dd'));

			return nows > now;
		},
		systemIf() {
			var that = this;
			uni.getSystemInfo({
				success: function (res) {
					console.log(res);
					// res.platform 可以是 'android' 或 'ios'
					if (res.osName === 'android') {
						that.system = true;
					} else if (res.osName === 'ios') {
						console.log('当前设备是iOS');
						that.system = false;
					}
				}
			});

			if (this.system) {
				this.srdz.img = this.srdz.ad;
			} else {
				this.srdz.img = this.srdz.ios;
			}
		},
		invoice(item) {
			console.log('申请开票', item);
			//查询是否有
			var file = item.file == '0';
			var files = item.file == '1';
			if (files) {
				this.$u.toast('申请中~');
				return;
			}
			if (file) {
				uni.navigateTo({
					url: '/pages/subUser/invoice/invoice?invoice=' + JSON.stringify(item)
				});
			} else {
				this.$u.toast('下载中~');
				let fileUrl = item.file;
				console.log('文件路径：', fileUrl);
				uni.downloadFile({
					url: fileUrl,
					success: (res) => {
						if (res.statusCode === 200) {
							console.log('下载成功');
						}
						uni.getFileSystemManager().saveFile({
							tempFilePath: res.tempFilePath,
							filePath: wx.env.USER_DATA_PATH + '/' + '易单据.pdf', //自定义文件名
							success(res) {
								uni.openDocument({
									filePath: res.savedFilePath,
									showMenu: true, //是否可以分享
									success: (res) => {
										uni.hideLoading();
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
			}
		},
		close(item, index) {
			this.jurisdictionOrdder[index].open = false;
		},
		open(item, index) {
			console.log(item, index);
			this.jurisdictionOrdder[index].open = true;
			console.log(this.jurisdictionOrdder);
		},
		template() {
			uni.navigateTo({
				url: '/pages/subMessage/chitchat/chat?type=9'
			});
		},
		IFKEY(obj, val) {
			let hasKeyWithSubstring = false;
			Object.keys(obj).forEach((key) => {
				if (key.includes(val)) {
					hasKeyWithSubstring = true;
				}
			});
			return hasKeyWithSubstring;
		},
		IFJCODE(key, val) {
			return key.jurisdictionCode == val;
		},
		getProductC(val) {
			return Number(val.split('-')[1]);
		},
		getProductIFC(val, C) {
			// console.log("iteam3:",val);
			return val.includes(C);
		},
		renewCheck(index, list) {
			list[index].check = list[index].check ? false : true;

			this.add();
		},
		getRenew() {
			var phone = this.pinia_user.phone;
			var dx = {
				phone: phone
			};
			uni.$api.pay
				.getJurisdictionRenewInfo(dx)
				.then((res) => {
					var renew = res.data.data;

					for (let key in renew) {
						renew[key].forEach((item) => {
							item.check = true;
						});
					}
					this.renew = renew;
					console.log('权限续费：', this.renew);
				})
				.catch((res) => {});
		},
		getTotalDaysInYear() {
			var year = new Date().getFullYear();
			return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0) ? 366 : 365;
		},
		getDaysLeftInYear() {
			var now = new Date();
			var endOfYear = new Date(now.getFullYear(), 11, 31);
			var diffInTime = endOfYear.getTime() - now.getTime();
			var diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
			return diffInDays;
		},
		IFJurisdiction(key) {
			return this.jurisdiction.hasOwnProperty(key);
		},
		getJurisdictionOrder() {
			var phone = this.pinia_user.phone;
			var dx = {
				phone: phone
			};
			uni.$api.pay
				.createJurisdictionOrder(dx)
				.then((res) => {
					var data = res.data.data;
					for (var i = 0; i < data.length; i++) {
						data[i].open = false;
					}
					this.jurisdictionOrdder = data;
					console.log('权限订单：', data);
				})
				.catch((res) => {});
		},
		getJurisdiction() {
			var phone = this.pinia_user.phone;
			var dx = {
				phone: phone
			};
			uni.$api.pay
				.getUserJurisdiction(dx)
				.then((res) => {
					this.jurisdiction = res.data.data;
					console.log('已开通的权限：', res.data.data);
				})
				.catch((res) => {});
		},
		Play() {
			if (this.play.old.length > 0) {
				if (this.dropdownName == '请选择') {
					this.$u.toast('请选择购买年~');
					return;
				}
			}

			this.play.year = this.dropdownName == '暂无数据' ? 0 : this.dropdownName;

			if (this.playMoneyListSend.totalPrice > 0) {
				this.addCode();
			}

			let order = {
				orderNumber: '', // 订单编号
				price: this.playMoneyListSend.totalPrice, // 支付总价（注：通常价格应该是一个数字或BigDecimal的字符串表示，但这里按照要求设置为空字符串）
				payment: (this.playMoneyListSend.totalPrice * 100).toFixed(0), // 支付金额（同样，支付金额通常应为数字或字符串形式的金额，这里设为空字符串）
				productCode: JSON.stringify(this.playMoneyListSend), // 产品编码
				particulars: JSON.stringify(this.play), // 细节
				state: '', // 状态
				type: '', // 类型
				phone: this.pinia_user.phone, // 所属者（这里假设所属者是通过电话号码表示的，但根据实际情况可能有所不同）
				description: '权限购买'
			};

			console.log('权限：', this.playMoneyListSend);
			if (this.playMoneyListSend.totalPrice > 0) {
				console.log('订单：', order);
				console.log('订单：', JSON.stringify(order));
				var timeKey = new Date().getTime();
				console.log('订单key：', timeKey.toString());
				uni.setStorageSync(timeKey.toString(), JSON.stringify(order));
				uni.navigateTo({
					url: '/pages/subPack/user/my_order/pay?order=' + timeKey.toString()
				});
			}
		},
		playWX(wx) {
			var that = this;
			uni.requestPayment({
				provider: 'wxpay',
				timeStamp: wx.timeStamp, // 字符串，时间戳，从1970年1月1日00:00:00至今的秒数,即当前的时间(String)
				nonceStr: wx.nonceStr, // 字符串，随机串，长度要求在32位内
				package: wx.packageStr, // 字符串，统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=***）
				signType: wx.signType, // 字符串，签名方式：MD5/HMAC-SHA256
				paySign: wx.paySign, // 字符串，签名，见附录-JS-SDK使用权限签名算法
				success: function (res) {
					// 支付成功后的回调函数
					console.log('支付成功后的回调函数:', res);
				},
				fail: function (err) {
					// 支付失败后的回调函数
					console.log('支付失败后的回调函数:', err);
				}
			});
		},
		addCode() {
			var list = this.playMoneyListSend;
			var statisticsIndex = list.c_product_statistics;
			var oldIndex = list.c_product_old_data;
			var peopleIndex = list.c_product_people;

			console.log('提交获取选项：', statisticsIndex, oldIndex, peopleIndex);

			var code = [];
			if (statisticsIndex != -1) {
				if (statisticsIndex != 9) {
					code.push(this.c_product_statistics[statisticsIndex].type);
				} else {
					code.push(this.c_product_statistics[0].type);
					code.push(this.c_product_statistics[1].type);
				}
			}
			if (oldIndex != -1) {
				if (oldIndex == 3) {
					code.push(this.c_product_old_data[0].type + '-' + this.dropdownName);
					code.push(this.c_product_old_data[1].type + '-' + this.dropdownName);
				} else {
					code.push(this.c_product_old_data[oldIndex].type + '-' + this.dropdownName);
				}
			}

			var cw = peopleIndex.a;
			var yg = peopleIndex.b;
			var hhr = peopleIndex.c;

			if (cw > 0) {
				code.push(this.c_product_people[0].type + '-' + cw);
			}
			if (yg > 0) {
				code.push(this.c_product_people[1].type + '-' + yg);
			}
			if (hhr > 0) {
				code.push(this.c_product_people[2].type + '-' + hhr);
			}

			var peopleRenew = [];
			var renew = this.renew;
			var c1 = renew.C1;
			var c2 = renew.C2;
			var c3 = renew.C3;

			if (c1 != null && c1.length > 0) {
				c1.forEach((res) => {
					var check = res.check;
					if (!check) {
						peopleRenew.push(res.id);
					}
				});
			}

			if (c2 != null && c2.length > 0) {
				c2.forEach((res) => {
					var check = res.check;
					if (!check) {
						peopleRenew.push(res.id);
					}
				});
			}

			if (c3 != null && c3.length > 0) {
				c3.forEach((res) => {
					var check = res.check;
					if (!check) {
						peopleRenew.push(res.id);
					}
				});
			}

			this.playMoneyListSend.peopleRenew = peopleRenew;
			this.playMoneyListSend.CODE = code;

			this.playMoneyListSend.price.A1 = this.c_product_statistics[0].priceDiscount;
			this.playMoneyListSend.price.A2 = this.c_product_statistics[1].priceDiscount;
			this.playMoneyListSend.price.B1 = this.c_product_old_data[0].priceDiscount;
			this.playMoneyListSend.price.B2 = this.c_product_old_data[1].priceDiscount;
			this.playMoneyListSend.price.C1 = this.c_product_people[0].priceDiscount;
			this.playMoneyListSend.price.C2 = this.c_product_people[1].priceDiscount;
			this.playMoneyListSend.price.C3 = this.c_product_people[2].priceDiscount;
			//刷新权限
			this.$loadUser(this);
			var jurisdiction = this.pinia_user.jurisdiction;
			this.playMoneyListSend.time = JSON.parse(JSON.stringify(jurisdiction));
		},
		dropdownIcon() {
			// console.log('打开');
			// this.selectionIcon = true;
		},
		dropdown(e) {
			this.dropdownName = e;
			this.selectionIcon = false;
			this.check.B.checkA = false;
			this.check.B.checkB = true;
			this.checkboxClickdr(0);
			console.log(e);
		},
		add() {
			var oldIndex = this.playMoneyListSend.c_product_old_data;
			var peopleIndexA = this.playMoneyListSend.c_product_people.a;
			var peopleIndexB = this.playMoneyListSend.c_product_people.b;
			var peopleIndexC = this.playMoneyListSend.c_product_people.c;

			var statisticsIndex = this.playMoneyListSend.c_product_statistics;
			var a = this.c_product_statistics;
			var b = this.c_product_old_data;
			var c = this.c_product_people;

			var statistics = statisticsIndex == 9 ? a[1].priceDiscount : statisticsIndex == -1 ? 0 : a[statisticsIndex].priceDiscount;

			var old = oldIndex == 3 ? b[0].priceDiscount + b[1].priceDiscount : oldIndex == -1 ? 0 : b[oldIndex].priceDiscount;
			var people = peopleIndexA * c[0].priceDiscount + peopleIndexB * c[1].priceDiscount + peopleIndexC * c[2].priceDiscount;

			var renew = this.renew;

			if (renew != {}) {
				var c1 = renew.C1;
				var c2 = renew.C2;
				var c3 = renew.C3;

				var c1RenewPrice = 0;
				var c2RenewPrice = 0;
				var c3RenewPrice = 0;

				if (c1 != null && c1.length > 0) {
					c1.forEach((res) => {
						var check = res.check;
						if (!check) {
							c1RenewPrice = c1RenewPrice + c[0].priceDiscount;
						}
					});
				}
				if (c2 != null && c2.length > 0) {
					c2.forEach((res) => {
						var check = res.check;
						if (!check) {
							c2RenewPrice = c2RenewPrice + c[1].priceDiscount;
						}
					});
				}
				if (c3 != null && c3.length > 0) {
					c3.forEach((res) => {
						var check = res.check;
						if (!check) {
							c3RenewPrice = c3RenewPrice + c[2].priceDiscount;
						}
					});
				}
			}

			console.log('统计对账选中：', statisticsIndex, ' (单价)：', statistics);
			console.log('往年数据：', oldIndex, ' (单价)：', old);
			console.log('人员总价：', statisticsIndex, ' (单价)：', people);
			console.log('数据：', this.playMoneyListSend);

			this.playMoneyListSend.totalPrice =
				parseFloat(statistics) + parseFloat(old) + parseFloat(people) + parseFloat(c1RenewPrice) + parseFloat(c2RenewPrice) + parseFloat(c3RenewPrice);
		},
		getData() {
			uni.$api.pay.getPayItems({}).then((res) => {
				console.log('获取数据:', res);
				var resData = res.data.data;
				this.c_product_statistics = resData.statistics;
				this.c_product_old_data = resData.database;
				this.c_product_people = resData.location;

				this.c_product_people[2].priceDiscount = 0.01;
			});

			var dx = {
				bossNumberS: '',
				bossNumberE: ''
			};
			dx.bossNumberE = this.pinia_user.phone;
			dx.bossNumberS = this.pinia_user.phone;

			uni.$api.order.getOldOrders(dx).then((res) => {
				var resData = res.data.data;
				this.dataList = resData;
				this.dataListAll = [...new Set([...this.dataList.D, ...this.dataList.R])];
			});
		},
		valChangea(e) {
			console.log('当前值为: ' + e.value);
			this.playMoneyListSend.c_product_people.a = e.value;
			this.play.people = this.playMoneyListSend.c_product_people;
			this.add();
		},
		valChangeb(e) {
			this.playMoneyListSend.c_product_people.b = e.value;
			this.play.people = this.playMoneyListSend.c_product_people;
			this.add();
		},
		valChangec(e) {
			this.playMoneyListSend.c_product_people.c = e.value;
			this.play.people = this.playMoneyListSend.c_product_people;
			this.add();
		},
		getBackgroundStyle() {
			return this.currentVip == 0 ? this.bgUrlOne : this.bgUrlTow;
		},
		TabChange(item) {
			this.current = item.index;
		},
		changeVip(item) {
			console.log(item);
			this.currentVip = item.index;
		},
		checkboxChange(checkbox) {
			console.log('checkbox:', checkbox);
			console.log('play:', this.playMoneyList);
		},
		checkboxClickdr(i) {
			if (this.dropdownName == '请选择') {
				this.$u.toast('请选择购买年~');
				return;
			}

			if (!this.dataList.D.includes(this.dropdownName) && i == 0) {
				this.$u.toast('发货端没有该年份数据~');
				return;
			}

			if (!this.dataList.R.includes(this.dropdownName) && i == 1) {
				this.$u.toast('收货端没有该年份数据~');
				return;
			}

			if (i == 0) {
				this.check.B.checkA = this.check.B.checkA ? false : true;
				this.playMoneyListSend.c_product_old_data = i;
			} else {
				this.check.B.checkB = this.check.B.checkB ? false : true;
				this.playMoneyListSend.c_product_old_data = i;
			}

			if (!this.check.B.checkB && !this.check.B.checkA) {
				this.playMoneyListSend.c_product_old_data = 3;
			} else {
				if (this.check.B.checkB && this.check.B.checkA) {
					this.playMoneyListSend.c_product_old_data = -1;
				} else {
					this.playMoneyListSend.c_product_old_data = i;
				}
			}

			this.play.old = !this.check.B.checkA && !this.check.B.checkB ? [0, 1] : !this.check.B.checkA ? [0] : !this.check.B.checkB ? [0] : [];

			this.add();
		},
		checkboxClick(i) {
			this.synchronizationData();

			var type = this.c_product_statistics[i].type;

			console.log('当前选择：', i);
			var cun = this.playMoneyListSend.c_product_statistics;

			if (i == 0) {
				this.check.A.checkA = this.check.A.checkA ? false : true;
				this.play.statistics = [i];
				this.playMoneyListSend.c_product_statistics = i;
				if (this.check.A.checkB) {
					this.check.A.checkB = false;
				}
			}

			if (i == 1) {
				this.check.A.checkB = this.check.A.checkB ? false : true;
				this.play.statistics = [i];
				this.playMoneyListSend.c_product_statistics = i;

				if (this.check.A.checkA) {
					this.check.A.checkA = false;
				}
			}

			var ca = this.check.A.checkA;
			var cb = this.check.A.checkB;

			if (!ca && !cb) {
				this.playMoneyListSend.c_product_statistics = -1;
			}

			if (!ca && cb) {
				this.playMoneyListSend.c_product_statistics = 9;
			}

			this.add();
		}
	}
};
</script>
<style scoped lang="scss">
::v-deep .u-number-box__input {
	border: 1rpx solid #696969 !important;
	border-radius: 4rpx !important;
	margin: 0 16rpx !important;
}
.colorFD {
	color: #fd5b75;
}
::v-deep .u-navbar__content {
	background-color: transparent !important;
}
::v-deep .u-tabs__wrapper__nav__item {
	height: 64rpx !important;
}
.Myorder {
	width: 100vw;
	height: 100vh;
	position: relative;
	overflow: hidden;
	background: linear-gradient(327deg, #353151 0%, #413f74 57%, #454161 106%, #eff5ea 106%);
	.tcdgTop1 {
		color: #804d1e;
		height: 364rpx;
		background: url('https://res-oss.elist.com.cn/app/img/order/oderbg1.svg') no-repeat left top;
		background-size: 100;
		position: relative;
		.tag {
			width: 48px;
			height: 44rpx;
			font-size: 24rpx;
			font-weight: 500;
			display: flex;
			align-items: center;
			justify-content: center;
			background: linear-gradient(285deg, #ffd78b 4%, #ffe7b9 63%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
			text-fill-color: transparent;
			position: absolute;
			top: 4rpx;
			right: 14rpx;
		}
		.tcdgTop1_1 {
			image {
				height: 45rpx;
			}
		}
		.tcdgTop1_2 {
			padding-left: 66rpx;
			width: 390rpx;
			height: 66rpx;
			border-radius: 6px;
			background: url('https://res-oss.elist.com.cn/app/img/order/oderbg2.svg') no-repeat left top;
			background-size: 100;
			font-size: 24rpx;
			position: absolute;
			left: 30rpx;
			bottom: 36rpx;
			padding-bottom: 8rpx;
		}
		.xfBtn {
			width: 90rpx;
			height: 38rpx;
			border-radius: 114px;
			background: linear-gradient(90deg, #ffcc98 0%, #fd4a62 50%, #ff97b9 100%);
			font-size: 24rpx;
			color: #fff;
			margin-left: 16rpx;
		}
	}
	.tcdgTop2 {
		font-size: 32rpx;
		font-weight: 500;
		color: #f8e9d1;
		.lineLeft {
			margin-right: 14rpx;
			width: 17px;
			height: 2px;
			transform: rotate(180deg);
			border-radius: 5px;
			opacity: 1;
			background: linear-gradient(270deg, rgba(248, 233, 209, 0) 0%, #fbddbe 100%);
		}
		.lineRight {
			margin-left: 14rpx;
			width: 17px;
			height: 2px;
			border-radius: 5px;
			opacity: 1;
			background: linear-gradient(270deg, rgba(248, 233, 209, 0) 0%, #fbddbe 100%);
		}
	}
	.tcdgTop3 {
		margin-top: 20rpx;
		padding: 42rpx 0 52rpx;
		border-radius: 34rpx;
		/* 用渐变作为边框背景 */
		background: linear-gradient(327deg, #353151 0%, #413f74 57%, #454161 106%, #eff5ea 106%) padding-box,
			/* 内容区白色背景 */ linear-gradient(180deg, #f8e9d1 1%, rgba(248, 233, 209, 0) 88%) border-box; /* 边框渐变 */
		background-size: cover;
		/* 关键：设置透明边框，让背景渐变显示为“边框” */
		border: 1px solid transparent;
		image {
			width: 92rpx;
			height: 92rpx;
		}
		text {
			&:nth-of-type(1) {
				font-size: 28rpx;
				font-weight: bold;
				margin: 14rpx 0 4rpx;
				color: #fbddbe;
			}
			&:nth-of-type(2) {
				font-size: 24rpx;
				color: #fdf6eb;
			}
		}
	}
	.tcxzBox {
		position: relative;
		margin-right: 50rpx;
		width: 284rpx;
		height: 270rpx;
		border-radius: 16rpx;
		border: 1px solid transparent;
		/* 用渐变作为边框背景 */
		background: linear-gradient(#fff, #fff) padding-box, /* 内容区白色背景 */ linear-gradient(143deg, #d6ae83 17%, #ffe6bb 50%, #fd5b75 95%) border-box; /* 边框渐变 */
		> view:nth-of-type(1) {
			font-size: 28rpx;
			font-weight: bold;
		}
		> view:nth-of-type(2) {
			margin-top: 20rpx;
			color: #fd5b75;
			font-size: 24rpx;
			font-weight: 700;
			> text:nth-of-type(2) {
				font-size: 32rpx;
			}
		}
		> view:nth-of-type(3) {
			margin-top: 12rpx;
			font-size: 24rpx;
			color: #696969;
			> text:nth-of-type(2) {
				text-decoration: line-through;
			}
		}
		> view:nth-of-type(4) {
			width: 184rpx;
			height: 38rpx;
			background: #fff8c6;
			font-size: 24rpx;
			color: #804d1e;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 14rpx;
		}
		.tags {
			padding-bottom: 8rpx;
			width: 180rpx;
			height: 51rpx;
			font-size: 24rpx;
			color: #fff;
			background: url('https://res-oss.elist.com.cn/app/img/order/tagbg1.svg') no-repeat left top;
			background-size: 100% 100%;
			position: absolute;
			top: -24rpx;
			right: -20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 10;
		}
	}
	.flqsnlBox {
		height: 239rpx;
		background: url('https://res-oss.elist.com.cn/app/img/order/flqsbg.svg') no-repeat left top;
		background-size: 100% 100%;
		padding: 24rpx 36rpx 0 32rpx;
		.tags {
			padding-bottom: 8rpx;
			width: 274rpx;
			height: 51rpx;
			font-size: 24rpx;
			color: #fff;
			background: url('https://res-oss.elist.com.cn/app/img/order/tagbg.svg') no-repeat left top;
			background-size: 100% 100%;
			position: absolute;
			top: -24rpx;
			right: 30rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 10;
		}
		.covers {
			border-radius: 16rpx;
			width: 98%;
			height: 98%;
			background: linear-gradient(0deg, #ffffff 52%, rgba(255, 255, 255, 0) 112%);
			z-index: 20;
			position: absolute;
			top: 3rpx;
			left: 10rpx;
			.qrzBtn {
				font-size: 26rpx;
				font-weight: 500;
				width: 122rpx;
				height: 47rpx;
				border-radius: 114px;
				background: linear-gradient(90deg, #ffcc98 0%, #fd4a62 50%, #ff97b9 100%);
			}
		}
	}
	.BodyQBQY {
		background-color: white;
		border-radius: 30rpx 30rpx 0rpx 0rpx;
		.BodyQBQYScrollView {
			height: 100%;
			width: 100%;

			// padding: 24rpx;

			.BodyQBQYScrollViewHand {
				display: flex;
				flex-direction: row;
				justify-content: left;
				align-items: start;
				// background-color: aliceblue;
				padding: 64rpx 24rpx 50rpx;
				position: relative;
				.Hand_icon {
					background-color: #d6ae83;
					width: 6rpx;
					height: 36rpx;
					margin-right: 16rpx;
				}

				.Hand_title {
					font-size: 34rpx;
					font-weight: 500;
					line-height: 44rpx;
					text-align: center;
					letter-spacing: 0rpx;
					color: #333333;
				}
			}

			.BodyQBQYScrollView_CardOne {
				display: flex;
				flex-direction: column;
				// width: 100%;
				margin-left: 24rpx;
				margin-right: 24rpx;
				.card_peopleAct {
					border: 1px solid transparent;
					background-size: cover;
					/* 用渐变作为边框背景 */
					background: linear-gradient(#fffafb, #fffafb) padding-box, /* 内容区白色背景 */ linear-gradient(109deg, #d6ae83 32%, #ffe6bb 59%, #fd5b75 97%) border-box !important; /* 边框渐变 */
				}
				.card_people {
					box-shadow: 0rpx 4rpx 6rpx 2rpx rgba(109, 99, 88, 0.2);
					height: 200rpx;
					margin-bottom: 24rpx;
					border-radius: 30rpx 30rpx 30rpx 30rpx;
					border: 1px solid transparent;
					display: flex;
					flex-direction: row;
					justify-content: left;
					align-items: center;
					background-size: cover;
					/* 用渐变作为边框背景 */
					background: linear-gradient(#fff, #fff) padding-box, /* 内容区白色背景 */ linear-gradient(109deg, #d6ae83 32%, #ffe6bb 59%, #fd5b75 97%) border-box; /* 边框渐变 */
					.card_people_icon {
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;

						width: 18%;
						// background-color: #333333;
						height: 100%;
					}

					.card_people_title {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;

						width: 48%;
						// background-color: #D6AE83;
						height: 100%;

						.card_people_title_one {
							display: flex;
							flex-direction: row;
							align-items: flex-end;

							width: 100%;
							height: 50%;
							// background-color: darkblue;
						}

						.card_people_title_two {
							display: flex;
							flex-direction: row;
							justify-content: left;
							align-items: flex-start;

							width: 100%;
							height: 50%;
							// background-color: darkcyan;

							.grandsonText {
								font-size: 26rpx;
								font-weight: normal;
								line-height: 34.08rpx;
								letter-spacing: 0rpx;
								color: #aaaaaa;
							}
						}
					}

					.card_people_price {
						display: flex;
						flex-direction: row;
						justify-content: flex-end;
						align-items: center;

						width: 30%;
						height: 100%;

						.grandsonPriceSign {
							font-size: 26.56rpx;
							font-weight: bold;
							line-height: 32.46rpx;
							text-align: right;
							letter-spacing: 0rpx;
							color: #ea7183;
						}

						.grandsonPrice {
							font-family: Source Han Sans;
							font-size: 28rpx;
							font-weight: 500;
							line-height: 32rpx;
							text-align: right;
							letter-spacing: 0rpx;
							font-variation-settings: 'opsz' auto;
							font-feature-settings: 'kern' on;
							color: #ea7183;
							margin-left: 10rpx;

							.grandsonPriceBold {
								font-weight: 900;
							}
						}

						.grandsonPriceOriginal {
							font-family: Source Han Sans;
							font-size: 20.72rpx;
							font-weight: normal;
							line-height: 32.56rpx;
							text-align: center;
							letter-spacing: 0rpx;
							text-decoration: line-through;
							font-variation-settings: 'opsz' auto;
							font-feature-settings: 'kern' on;
							color: #f7c6cd;
						}

						// background-color: red;
					}

					.card_people_check {
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;

						position: relative;

						width: 10%;
						height: 100%;

						border-top-right-radius: 30rpx;
						border-bottom-right-radius: 30rpx;
					}
				}
			}

			.BodyQBQYScrollView_CardTwo {
				display: flex;
				flex-direction: row;
				justify-content: left;
				align-items: center;

				padding: 24rpx 0;
				margin-left: 24rpx;
				margin-right: 24rpx;
				// background-color: #D6AE83;
				height: 20vh;

				.tempCard {
					width: 300rpx;
					height: 100%;
					background-color: #ffffff;
					box-shadow: 0rpx 4.68rpx 7.04rpx 2rpx rgba(109, 99, 88, 0.2);
					border-radius: 10.9rpx;

					display: flex;
					flex-direction: column;

					.tempCard_img {
						width: 100%;
						height: 75%;
						// background-color: #47506C;

						padding: 24rpx;
					}

					.tempCard_title {
						position: relative;
						padding: 0 24rpx;
						.bjzx {
							display: flex;
							flex-direction: row;
							justify-content: center;
							align-items: center;
							width: 150.22rpx;
							height: 44.12rpx;
							border-radius: 5.02rpx;
							opacity: 1;
							background: #fceff2;
							color: #e65d7f;
							font-size: 21.74rpx;
							right: 10rpx;
						}
					}
				}
			}

			.PeopleTab {
				// width: 100%;
				// height: 21vh;
				background-color: #ffffff;
				margin-left: 24rpx;
				margin-right: 24rpx;

				border-radius: 30rpx;
				margin-top: 24rpx;

				box-shadow: 0rpx 5.6rpx 8.4rpx 2rpx rgba(109, 99, 88, 0.2);

				position: relative;

				.TabRY {
					background-size: cover;
					height: 6vh;
					width: 100%;
					z-index: 1;
					align-items: center;

					border-radius: 30rpx 30rpx 0rpx 0rpx;

					display: flex;
					flex-direction: row;
					align-items: center;
				}

				.tabBodyOne {
					width: 100%;
					height: 15vh;

					// background-color: #D6AE83;

					border-radius: 0rpx 0rpx 30rpx 30rpx;

					display: flex;
					flex-direction: column;

					.tabBodyOne_card {
						height: 10%;
						background-color: #323243;

						display: flex;
						flex-direction: row;
						align-items: center;

						position: relative;

						margin-left: 24rpx;
						margin-right: 24rpx;
						margin-top: 24rpx;
					}

					.tabBodyOne_card_body {
						height: 20%;
						// background-color: #323243;

						display: flex;
						flex-direction: row;
						align-items: center;

						margin-left: 24rpx;
						margin-right: 24rpx;
						margin-top: 48rpx;

						.tabBodyOne_card_body_hand {
							display: flex;
							flex-direction: row;
							align-items: flex-start;

							position: relative;

							width: 16%;
							height: 100%;
							// background-color: #AAAAAA;
						}

						.tabBodyOne_card_body_sum {
							display: flex;
							flex-direction: row;
							align-items: center;

							padding-left: 24rpx;

							height: 100%;
							width: 30%;
						}

						.tabBodyOne_card_body_price {
							display: flex;
							flex-direction: row;
							align-items: center;

							height: 100%;
							width: 50%;

							padding-left: 80rpx;
							text-align: right;
						}

						.tabBodyOne_card_body_check {
							display: flex;
							flex-direction: row;
							align-items: center;

							height: 100%;
							width: 10%;
						}
					}
				}

				.tabBodyTwo {
					width: 100%;
					height: auto;
					// background-color: #D6AE83;
					border-radius: 0rpx 0rpx 30rpx 30rpx;
					display: flex;
					flex-direction: column;
					padding-bottom: 100rpx;
					// overflow-y: scroll;

					.tabBodyTwoEmpty {
						width: 100%;
						height: 15vh;
						// background-color: #AAAAAA;

						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;

						color: '#999999';
					}

					.tabBodyTwoTitle {
						height: 10%;
						// background: #47506C;

						display: flex;
						flex-direction: row;
						justify-content: left;
						align-items: center;
						margin-left: 24rpx;
						margin-right: 24rpx;

						margin-top: 48rpx;
						margin-bottom: 24rpx;

						.title_cw {
							width: 15%;
							height: 90%;

							display: flex;
							flex-direction: row;
							justify-content: left;
							align-items: center;

							position: relative;
						}

						.title_hhr {
							width: 20%;
							height: 90%;

							display: flex;
							flex-direction: row;
							justify-content: left;
							align-items: center;

							position: relative;
						}
					}

					.tabBodyTwoBody {
						height: 160rpx;
						// width: 100%;
						// background-color: #E65D7F;

						display: flex;
						flex-direction: row;
						justify-content: left;
						align-items: center;

						margin-left: 24rpx;
						margin-right: 24rpx;

						.tabBodyTwoBody_hand {
							width: 15%;
							height: 100%;
							// background-color: #FCEFF2;

							display: flex;
							flex-direction: row;
							justify-content: left;
							align-items: center;
						}

						.tabBodyTwoBody_time {
							width: 40%;
							height: 100%;
							// background-color: #FCEFF2;

							display: flex;
							flex-direction: row;
							justify-content: left;
							align-items: center;
						}

						.tabBodyTwoBody_price {
							width: 35%;
							height: 100%;
							// background-color: #FCEFF2;

							display: flex;
							flex-direction: row;
							justify-content: left;
							align-items: center;
						}

						.tabBodyTwoBody_check {
							width: 10%;
							height: 100%;
							// background-color: #FCEFF2;

							display: flex;
							flex-direction: row;
							justify-content: left;
							align-items: center;
						}
					}
				}
			}
		}
	}

	.NullView {
		height: 164rpx;
		width: 100vw;
	}
	.BodyWDDD {
		position: absolute;
		top: 16%;
		width: 100%;
		height: 100%;
		background-color: #f4f4f4;
		border-radius: 30rpx 30rpx 0rpx 0rpx;

		.BodyWDDDScrollView {
			height: 100%;
			width: 100%;
			// background-color: #AAAAAA;

			.orderCard {
				border-radius: 12rpx;
			}

			.BodyWDDDScrollViewEmpty {
				width: 100%;
				height: 400rpx;
			}
		}
	}

	.PlyBtn {
		position: fixed;
		bottom: 0;
		width: 100vw;
		height: 10vh;
		background-color: #ffffff;
		z-index: 999;

		.btn {
			// width: 100%;
			margin-top: 24rpx;
			border-radius: 500rpx;
			height: 100rpx;
			background-image: url('https://res-oss.elist.com.cn/app/img/order/subbg.svg');
			// background-image: url('https://guanlutech.oss-cn-shanghai.aliyuncs.com/wxImg/vip/play.png');
			background-size: 100% 100%;

			position: relative;

			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;

			color: #f9eadb;

			margin-left: 24rpx;
			margin-right: 24rpx;
		}
	}
}

.grandsonPriceSign {
	font-family: Source Han Sans;
	font-size: 26.56rpx;
	font-weight: bold;
	line-height: 32.46rpx;
	text-align: right;
	letter-spacing: 0rpx;
	font-variation-settings: 'opsz' auto;
	font-feature-settings: 'kern' on;
	color: #ea7183;
}

.grandsonPrice {
	font-family: Source Han Sans;
	font-size: 32rpx;
	font-weight: 500;
	line-height: 32.46rpx;
	text-align: right;
	letter-spacing: 0rpx;

	font-variation-settings: 'opsz' auto;
	font-feature-settings: 'kern' on;
	color: #ea7183;
}

.grandsonPriceOriginal {
	font-family: Source Han Sans;
	font-size: 20.72rpx;
	font-weight: normal;
	line-height: 32.56rpx;
	text-align: center;
	letter-spacing: 0rpx;
	text-decoration: line-through;
	font-variation-settings: 'opsz' auto;
	font-feature-settings: 'kern' on;
	color: #f7c6cd;
}

.ddbt {
	font-size: 30rpx;
	font-weight: normal;
	line-height: 44rpx;
	letter-spacing: 0rpx;
	color: #333333;
}

.dqsj {
	font-size: 26rpx;
	font-weight: normal;
	line-height: 44rpx;
	/* text-align: center; */
	letter-spacing: 0rpx;
	color: #999999;
}
</style>
