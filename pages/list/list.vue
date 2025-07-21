<style lang="scss" scoped>
	.root {
		height: 100vh;
		width: 100vw;
		background: #f5f5f5;
		overflow-y: auto;
		align-items: center;

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
					background-color: #F9F9F9;
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

		.NumOrder {
			background-color: transparent;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding-left: 30rpx;
			padding-right: 30rpx;
			padding-bottom: 10rpx;
			padding-top: 30rpx;
			letter-spacing: 2rpx;
		}

		.OrderCard {
			display: flex;
			flex-direction: column;
			padding-left: 20rpx;
			padding-right: 20rpx;
			padding-bottom: 10rpx;
			padding-top: 25rpx;
			background-color: white;
			margin-bottom: 18rpx;
			position: relative;
			margin-left: 24rpx;
			margin-right: 24rpx;
			border-radius: 15rpx;
			box-shadow: 0rpx 7rpx 10rpx 0rpx rgba(51, 51, 51, 0.1);

			.OrderCardHand {
				margin-bottom: 10rpx;
				display: flex;
				flex-direction: row;
				width: 100%;

				.title {
					display: flex;
					flex-direction: row;
					width: 70%;
				}
			}
		}
	}
</style>
<template>
	<view class="root">
		<z-paging ref="paging" use-virtual-list :force-close-inner-list="true"
			:cell-height-mode="1===0?'fixed':'dynamic'" @virtualListChange="virtualListChange" @query="queryList">
			<view slot="top">

				<!-- 		<u-navbar :is-back="false" :border-bottom="false" :titleBold="true" title-color="#000000"
					title-size="34" title="查单" bgColor="#ffffff">
					<view class="flex-row items-center justify-left ml48" style="width: 800rpx;">
						<view class="flex-row justify-center items-center" style="background-color: #ffc300;height: 44rpx;width:140rpx;border-radius: 8rpx;color: #ffffff;font-size: 22rpx;font-weight: 900;
						box-shadow: 3.4rpx 3rpx 2rpx 0rpx rgba(246, 188, 0, 0.5);">
							使用方法<u-icon class="ml6" name="https://res-oss.elist.com.cn/wxImg/video.png"
								size="20"></u-icon>
						</view>
					</view>
				</u-navbar> -->


				<!-- #ifdef MP-WEIXIN -->
				<u-navbar :is-back="false" :border-bottom="false" :titleBold="true" title-color="#000000"
					title-size="34" bgColor="#ffffff">
					<view class="flex-row items-center justify-center ml96" style="width: 100%;">
						<view class="" style="font-size: 34rpx;font-weight: 510;">
							查询订单
						</view>
						<view @click="jumpVideo" class="flex-row justify-center items-center ml12"
							style="border: 2.2rpx solid #01BB74;height: 44rpx;width:136rpx;border-radius: 8rpx;color: #01BB74;font-size: 22rpx;">
							使用方法<u-icon class="ml6" name="https://res-oss.elist.com.cn/wxImg/video.png"
								size="20"></u-icon>
						</view>
					</view>
				</u-navbar>
				<!-- #endif -->
				<!-- #ifdef APP -->
				<u-navbar :is-back="false" :border-bottom="false" :titleBold="true" title-color="#000000"
					title-size="34" title="查询订单" bgColor="#ffffff">
				</u-navbar>
				<!-- #endif -->



				<!-- <u-notice-bar mode="horizontal" :list="uNoticeBarlist" padding="6rpx 12rpx"></u-notice-bar> -->
				<u-tabs :active-item-style="{paddingBottom: '40rpx'}" :bar-height="7" :bar-style="{marginBottom:'8rpx'}"
					gutter="55" :list="tabsList" v-model="current" :is-scroll="true" :current="current"
					active-color="#0FB076" @change="change" height="70"></u-tabs>
			</view>

			<view slot="empty" style="padding-bottom: 200rpx;">
				<u-icon margin-top="22rpx" label-pos="bottom" :name="ImgUrl+'/wxImg/list/empty.svg'"
					label-color="#AAAAAA" label="暂无记录" size="180"></u-icon>
			</view>


			<view class="Card cardShow">

				<view class="priceCard">
					<text class="ft-gray mb18 ml10" style="color: #999999;">累计金额</text>
					<view class="">
						<text class="ft40 ft-bold ml9">￥</text>
						<u-count-to :end-val="OrderQuantitySum" separator="," color="#000000" font-size="40"
							decimals='2' bold></u-count-to>
					</view>
				</view>

				<view class="InputCard">

					<view class="InputOne">
						<text class="ft11 ft-gray ml20" style="background-color: transparent;" @click="CustomerGet">
							{{ vuex_userRole === 'R' ? '供应商选择' : '客户选择' }}
						</text>
						<u-icon class="ml10 mr10" name="/static/img/list/sx.svg" size="40"></u-icon>
						<!-- <view style="width: 24rpx;height: 32rpx;border-right: 2rpx solid #666666;"></view> -->
						<u-input class="my-input" style="width: 100%;" @input="CustomerGetChange" v-model="customer"
							:custom-style="{ backgroundColor: 'transparent' }"
							:placeholder="vuex_userRole === 'R' ? '请选择供应商' : '请选择客户'" clearable="true" />
						<view class="flex-col justify-center items-center" style="height: 5vh;">
							<u-icon class="ml40" name="/static/img/list/lxr.svg" size="45"
								@click="CustomerGet"></u-icon>
						</view>
					</view>

					<view class="InputOne">
						<text class="ft11 ft-gray ml20" @click="filtrateGet">
							<!-- {{showTage==0?"联系人":(showTage==1?"联系号码":showTage==2?(vuex_userRole=='R'?'收货地址':'收货地址'):showTage==3?"产品名称":"条件筛选")}} -->
							{{Title}}
						</text>
						<u-icon class="ml10 mr10" name="/static/img/list/sj.svg" size="40"></u-icon>
						<u-input v-if="showTage !== '1'" class="my-input" style="width: 100%;" v-model="field"
							@input="searchListenner" placeholder="输入关键字进行检索" />
						<u-input v-if="showTage === '1'" maxlength="11" class="ml24 my-input" style="width: 100%;"
							v-model="field" @input="searchListenner" placeholder="输入号码进行检索" />
						<view class="flex-col justify-center items-center" style="height: 5vh;">
							<u-icon class="ml40" name="/static/img/list/ss.svg" size="45" @click="SearchBtn"></u-icon>
						</view>
					</view>
				</view>
			</view>

			<text class="NumOrder ml10">
				<text>共<text style="color: #01BB74;">{{OrderQuantity}}</text>个订单</text>
			</text>



			<!-- 		<view class="item" :id="`zp-id-${item.zp_index}`" :key="item.zp_index" v-for="(item,index) in orderList"
				@click="itemClick(item,item.zp_index)">
				{{index}}
			</view> -->

			<view v-for="(item,index) in orderList" :key="item.id" :index="index" :id="`zp-id-${item.id}`"
				@click="goPath('/pages/subOrder/details?id='+item.id);hide=false" class="OrderCard">
				<view class="OrderCardHand" @tap.stop>
					<view class="title ml1" style="" @tap.stop>
						<text class="ft30 ft-lighgray pr30" style="color: #666666;">
							订单编号:
							<text class="ml15" @click="copyBtn(item.orderNumber)" style="color: #F76565;">
								{{item.orderNumber}}
							</text>
						</text>
						<u-icon size="28" :name="bat64.copy" @click="copyBtn(item.orderNumber)"></u-icon>
						<u-icon class="ml15" size="28" v-if="item.lockOrder==1&&item.paymentState!=2" :name="bat64.lock"
							color="#666666"></u-icon>
					</view>
					<view class="ml20" style="width: 30%;">
						<u-image :show-menu-by-longpress="false" v-if="vuex_userRole=='D'"
							:style="{display:item.paymentState == '0'?'inline':'none'}" class="u-img" width="120rpx"
							height="50rpx" :src="bat64.dqs"></u-image>
						<u-image :show-menu-by-longpress="false" v-if="vuex_userRole=='R'"
							:style="{display:item.paymentState == '0'?'inline':'none'}" class="u-img" width="120rpx"
							height="50rpx" :src="bat64.dqss"></u-image>
						<u-image :show-menu-by-longpress="false" v-if="vuex_userRole=='R'"
							:style="{display:item.paymentState == '2'?'inline':'none'}" class="u-img" width="120rpx"
							height="50rpx" :src="bat64.yfk"></u-image>
						<u-image :show-menu-by-longpress="false"
							:style="{display:item.paymentState == '1'?'inline':'none'}" width="120rpx" height="50rpx"
							class="u-img" :src="bat64.yqs"></u-image>
						<u-image :show-menu-by-longpress="false" v-if="vuex_userRole!='R'"
							:style="{display:item.paymentState == '2'?'inline':'none'}" width="120rpx" height="50rpx"
							class="u-img" :src="bat64.ysk"></u-image>
					</view>
				</view>
				<view class="width100 pb25 text-left">
					<text class="flex-col text-left">
						<text v-if="vuex_userRole=='D'" :style="{color:(ifZX(item.bossNumberE)?'#AAAAAA':'#3D3D3D')}"
							class="ft34 u-line-bt width100"
							style="font-weight: 500;">{{item.organizationE||item.bossNumberE}}{{ifZX(item.bossNumberE)?"(已注销)":""}}</text>
						<text v-if="vuex_userRole=='R'" :style="{color:(ifZX(item.bossNumberS)?'#AAAAAA':'#3D3D3D')}"
							class="ft34 u-line-bt width100"
							style="font-weight: 500;">{{item.enterpriseS||item.bossNumberS}}{{ifZX(item.bossNumberS)?"(已注销)":""}}</text>
					</text>
				</view>
				<text class=" ft30 line25 ft-lighgray">
					<text>日期：{{$u.timeFormat(item.creationTime, 'yyyy-mm-dd')}}</text>
				</text>

				<text class="ft-lighgray mt10 line25 flex-row items-center justify-end">
					<text>订单金额：</text>
					<text style="color: black;font-size: 24rpx;">￥</text>
					<text class="ft35" style="color: black;font-weight: 500;">{{item.price.toFixed(2)}}</text>
				</text>

				<text style="width: 100%;" class="mt17 ft-lighgray ft25 bg-gray radius pd10" @tap.stop
					v-if="item.receiptsDescr&&item.paymentState!=2" @click="noteMyOrder(item)">
					备注：{{item.receiptsDescr}}
				</text>

				<view class="flex-row u-border-top pd10 pt20 justify-between text-right items-center mt17" @tap.stop>
					<!-- 分享按钮区域 -->
					<view v-if="item.share" class="flex-row items-center justify-center" style="width: 100%;">
						<view class="flex-row justify-center items-center" style="width: 100%;">
							<view class="flex-row justify-center items-center" style="width: 40%; color: #cccccc;">
								<button class="hl-btn NY flex-row items-center justify-center" type="default"
									@click="ShareY(item)" open-type="share" name="Y" :data-thumb="item.picturesId"
									:data-id="item.id">
									<u-icon top="2rpx" name="zhuanfa" size="25" color="#666666" label-color="#333333"
										label-size="22"
										:label="vuex_user.data.work !== '1' && vuex_user.workDate == null ? '有金额转发' : '有金额转发'">
									</u-icon>
								</button>
							</view>
							<view class="flex-row justify-center items-center u-border-left u-border-right"
								style="width: 40%; color: #cccccc;">
								<button class="hl-btn NY flex-row items-center justify-center" type="default"
									@click="ShareN(item)" open-type="share" name="N" :data-thumb="item.picturesId"
									:data-id="item.id">
									<u-icon top="2rpx" name="zhuanfa" size="25" color="#666666" label-color="#333333"
										label-size="22"
										:label="vuex_user.data.work !== '1' && vuex_user.workDate == null ? '无金额转发' : '无金额转发'">
									</u-icon>
								</button>
							</view>
							<view class="flex-row justify-center items-center" style="width: 20%; color: #F76565;"
								@click="shareNY(item, 2)">
								关闭
							</view>
						</view>
					</view>

					<!-- 未分享区域 -->
					<view v-if="!item.share" class="flex-row items-center justify-center">
						<view class="flex-row items-center justify-center">
							<button class="hl-btn flex-row items-center justify-center" @click="shareNY(item, 1)"
								type="default">
								<u-icon v-show="OperatingSystem" name="zhuanfa" size="25"
									v-if="vuex_userRole === 'D' || vuex_userRole === 'R'" color="#666666"
									label-color="#333333" label-size="22"
									:label="vuex_user.data.work !== '1' && vuex_user.workDate == null ? '转发' : '转发'">
								</u-icon>

								<u-icon top="2rpx" v-show="!OperatingSystem" name="zhuanfa" size="25"
									v-if="vuex_userRole === 'D' || vuex_userRole === 'R'" color="#666666"
									label-color="#333333" label-size="22"
									:label="vuex_user.data.work !== '1' && vuex_user.workDate == null ? '转发' : '转发'">
								</u-icon>
							</button>
							<button
								v-if="vuex_userRole === 'R' && vuex_user.workData.identity !== '3' && item.paymentState === '0'&&item.lockOrder!=1"
								class="hl-btn ml20 flex-row items-center justify-center" type="default"
								@click="goPath('/pages/subOrder/details?id=' + item.id)">
								<!-- &&item.lockOrder!=1 -->
								<u-icon name="order" v-if="OperatingSystem" size="25" color="#666666" label-size="22"
									label-color="#333333" label="确认签收"></u-icon>

								<u-icon top="2rpx" name="order" v-if="!OperatingSystem" size="25" color="#666666"
									label-size="22" label-color="#333333" label="确认签收"></u-icon>

							</button>
							<button
								v-if="vuex_user.workData.identity !== '3' && item.paymentState !== '2'&&item.lockOrder!=1"
								class="hl-btn ml20 flex-row items-center justify-center" type="default"
								@click="VerifyAdd(item, index, 2)">
								<!-- &&item.lockOrder!=1 -->
								<u-icon v-if="OperatingSystem" name="rmb-circle" size="30" color="#666666"
									label-size="22" label-color="#333333" :label="labText"></u-icon>

								<u-icon top="2rpx" v-if="!OperatingSystem" name="rmb-circle" size="30" color="#666666"
									label-size="22" label-color="#333333" :label="labText"></u-icon>

							</button>
							<button
								v-if="vuex_user.workData.identity !== '3' && item.paymentState !== '2'&&item.lockOrder!=1"
								class="hl-btn ml20 flex-row items-center justify-center" type="default"
								@click="VerifyAdd(item, index, 1)">
								<!-- &&item.lockOrder!=1 -->
								<u-icon v-if="OperatingSystem" name="trash" size="25" color="#666666" label-size="22"
									label-color="#333333" label="删除"></u-icon>
								<u-icon v-if="!OperatingSystem" top="2rpx" name="trash" size="25" color="#666666"
									label-size="22" label-color="#333333" label="删除"></u-icon>

							</button>
							<button
								v-if="item.paymentState !== '2'&&item.paymentState !== '1'&&item.lockOrder!=1&&vuex_userRole=='D'&&vuex_user.workData.identity !== '3'"
								class="hl-btn ml20 flex-row items-center justify-center" type="default"
								@click="VerifyAdd(item, index, 3)">
								<!-- &&item.lockOrder!=1 -->
								<u-icon v-if="OperatingSystem" name="edit-pen" size="25" color="#666666" label-size="22"
									label-color="#333333" label="修改"></u-icon>
								<u-icon v-if="!OperatingSystem" top="2rpx" name="edit-pen" size="25" color="#666666"
									label-size="22" label-color="#333333" label="修改"></u-icon>
							</button>
							<!-- 							<button class="hl-btn ml20 flex-row items-center justify-center" type="default"
								@click="VerifyAdd(item, index, 4)">
								<u-icon v-if="OperatingSystem" name="edit-pen" size="25" color="#666666" label-size="22"
									label-color="#333333" label="通知"></u-icon>
								<u-icon v-if="!OperatingSystem" top="2rpx" name="edit-pen" size="25" color="#666666"
									label-size="22" label-color="#333333" label="通知"></u-icon>
							</button> -->
						</view>
					</view>
				</view>
			</view>


			<view class="NullView" style="height: 5vh;background-color: transparent;">

			</view>

			<view slot="bottom">
				<u-tabbar :list="vuex_tabbar" :height="tabHight" iconSize="40" active-color="#0FB076"></u-tabbar>
			</view>


		</z-paging>


		<u-loadmore v-show="total>5" :status="status" marginTop="88" marginBottom="88" :load-text="loadText" />
		<u-popup v-model="show_start" mode="top" width="550rpx">
			<u-navbar :is-back="false" :border-bottom="false" :titleBold="true" title-color="#000000" title-size="34"
				bgColor="#ffffff">
				<view class="flex-row items-center justify-center ml96" style="width: 100%;">
					<view class="" style="font-size: 34rpx;font-weight: 510;">
						查询订单
					</view>
					<view @click="jumpVideo" class="flex-row justify-center items-center ml12"
						style="border: 2.2rpx solid #01BB74;height: 44rpx;width:136rpx;border-radius: 8rpx;color: #01BB74;font-size: 22rpx;">
						使用方法
						<u-icon class="ml6" name="https://res-oss.elist.com.cn/wxImg/video.png" size="20"></u-icon>
					</view>
				</view>
			</u-navbar>
			<view class="flex-col pl30 pr30 pb30 justify-between height100">
				<view>
					<view class="flex-col mt20">
						<text
							style="font-family: Source Han Sans;font-size: 28rpx;font-weight: bold;line-height: 42.24rpx;letter-spacing: 0rpx;font-feature-settings: 'kern' on; color: #333333;">
							时间筛选
						</text>

						<view class="flex-row items-center justify-between mt10" style="width: 100%;">
							<view class="flex-row items-center" style="width: 50%;">
								<text class="mr10" style="color: #999999;">开始日期</text>
								<u-icon name="arrow-down-fill" size="10"></u-icon>
								<view @click="calendar1Show=true" class="ml24"
									style="border-box;border: 1rpx solid #999999;padding: 12rpx;border-radius: 6rpx;">
									{{date1}}
								</view>
							</view>
							<view class="flex-row items-center" style="width: 50%;">
								<text class="mr10 ml20" style="color: #999999;">结束日期</text>
								<u-icon name="arrow-down-fill" size="10"></u-icon>
								<view @click="calendar2Show=true" class="ml24"
									style="border-box;border: 1rpx solid #999999;padding: 12rpx;border-radius: 6rpx;">
									{{date2}}
								</view>
							</view>
						</view>


						<view class="mt40">
							<text
								style="font-family: Source Han Sans;font-size: 28rpx;font-weight: bold;line-height: 42.24rpx;letter-spacing: 0rpx;font-feature-settings: 'kern' on; color: #333333;">
								范围筛选
							</text>

							<view class="flex-row mt20" style="width: 100%;">
								<view class="flex-col justify-center items-center text-center mr24"
									@click="Filtrate('0')"
									:style="{backgroundColor:showTage=='0'?'#01BB74':'#F2FBF8',color:showTage=='0'?'#ffffff':'#01BB74'}"
									style="color: #ffffff;background-color: #01BB74;width: 30%;height: 54rpx;border-radius: 12rpx;height: 54.84rpx;">
									联系人
								</view>
								<view class="flex-col justify-center items-center text-center mr24"
									@click="Filtrate('1')"
									:style="{backgroundColor:showTage=='1'?'#01BB74':'#F2FBF8',color:showTage=='1'?'#ffffff':'#01BB74'}"
									style="color: #01BB74;background-color: #F2FBF8;width: 30%;height: 54rpx;border-radius: 12rpx;height: 54.84rpx;">
									联系号码
								</view>
								<view class="flex-col justify-center items-center text-center" @click="Filtrate('2')"
									:style="{backgroundColor:showTage=='2'?'#01BB74':'#F2FBF8',color:showTage=='2'?'#ffffff':'#01BB74'}"
									style="color: #01BB74;background-color: #F2FBF8;width: 30%;height: 54rpx;border-radius: 12rpx;height: 54.84rpx;">
									{{(vuex_userRole=='R'?'收货地址':'收货地址')}}
								</view>
							</view>
							<view class="flex-row mt20" style="width: 100%;">
								<view class="flex-col justify-center items-center text-center" @click="Filtrate('3')"
									:style="{backgroundColor:showTage=='3'?'#01BB74':'#F2FBF8',color:showTage=='3'?'#ffffff':'#01BB74'}"
									style="color: #01BB74;background-color: #F2FBF8;width: 30%;height: 54rpx;border-radius: 12rpx;height: 54.84rpx;">
									产品名称
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 按钮 -->
				<view class="flex-row justify-end mt25 vw100" style="">
					<view class="mt15"
						style="text-align: left;align-items: center;color: #ccc;font-size: 24rpx;float: left;margin-right: 15%;">
						<!-- 保存偏好设置 -->
					</view>
					<view class="mr48" style="float: right;">
						<u-button type="info" @click="filterReset" shape="circle" size="medium"
							:custom-style="{'marginRight':'20rpx'}" plain>重置</u-button>
						<u-button type="success" @click="filterSubmit" shape="circle" size="medium"
							:custom-style="{'marginLeft':'20rpx'}" plain>确定</u-button>
					</view>
				</view>
			</view>
		</u-popup>

		<u-calendar btn-type="success" v-model="calendar1Show" active-bg-color="#01BB74" range-bg-color="#DFF9EF"
			range-color="#333333" mode="date" :min-date="getCurrentYearFirstDay()" :max-date="getCurrentDate()"
			@change="date1Change"></u-calendar>
		<u-calendar btn-type="success" v-model="calendar2Show" active-bg-color="#01BB74" range-bg-color="#DFF9EF"
			range-color="#333333" mode="date" :min-date="getCurrentYearFirstDay()" :max-date="getCurrentDate()"
			@change="date2Change"></u-calendar>

		<!-- <u-tabbar :list="vuex_tabbar" active-color="#0FB076"></u-tabbar> -->

		<u-mask :show="showMask" @click="showMask = false;password=''">
			<u-popup negative-top="200rpx" class="flex-col justify-center items-center" border-radius="15" mode="center"
				v-model="showMask" width="600rpx" height="400rpx">
				<view class="flex-col justify-center items-center relative" style="height: 100%;width: 100%;">
					<view class="absolute pt20" style="width: 100%;top: 0;height: 75%;">
						<view class="flex-row items-center justify-center passwordTitle">
							请输入签收密码
						</view>
						<view class="flex-col items-center justify-center mt20" style="width: 100%;height: 35%;">
							<u-message-input :bold="false" @change="changeList" @finish="finishList" :dot-fill="true"
								:value="password" mode="box" maxlength="4"></u-message-input>
							<view class="mt20 err" v-show="err">
								密码错误，请重新输入
							</view>
						</view>
						<view @click="goPath('/pages/subUser/resetpassword')"
							class="ft12 pr30 flex-row justify-end pt15" style="color: #999;width: 100%;">
							找回密码
						</view>
					</view>
					<view class="flex-row items-center absolute u-border-top"
						style="width: 100%;bottom: 0;height: 25%;">
						<view @click="cancel(password)" style="width: 50%;height: 100%;"
							class="titlePas flex-col justify-center items-center">
							取消
						</view>
						<view @click="confirm(password)" style="width: 50%;height: 100%;"
							class="titlePasOK flex-col justify-center items-center u-border-left">
							确认
						</view>
					</view>
				</view>
			</u-popup>
		</u-mask>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabHight: "100rpx",
				// 选择客户
				OrderQuantity: 0,
				OrderQuantitySum: 0,
				searchText: "",
				companyIndex: 0,
				tabsList: [{
					name: '全部',
					orderState: '0'
				}, {
					name: '待签收',
					orderState: '1'
				}, {
					name: '已签收',
					orderState: '2'
				}, {
					name: '已收款',
					orderState: '3'
				}],
				labText: "确认收款",
				current: 0,
				dataList: [],
				reload: false, //判断是否上拉
				total: 0, //数据量
				current_page: 0, //当前页码
				last_page: 1, //总页码
				status: 'loadmore',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				scrollTop: 0, //返回顶部
				//筛选弹窗
				filterShow: false,
				calendar1Show: false, //日期弹窗
				calendar2Show: false, //日期弹窗
				date1: '', // 开始日期
				date2: '', //结束日期
				totalMoney: 0, //当前订单总额
				show_start: false,
				mode: 'range',
				time: "",
				icon_search: "arrow-down-fill",
				showTage: '0',
				showOrderTage: '0',
				orderList: [],
				orderListCopy: [],
				customer: "",
				searchList: {
					dataStart: "",
					dataEnd: "",
					type: 0, //0-3
					customer: "",
					searchText: ""
				},
				realTimeSel: {
					"bossNumberS": "",
					"bossNumberE": "",
					"staffNumberS": "",
					"staffNumberE": "",
					"paymentState": "",
					"phoneE": "",
					"organizationE": "",
					"enterpriseS": "",
					"phoneS": "",
					"startDate": "",
					"endDate": "",
					"takeE": "",
					"kTakeE": "",
					"kPhoneE": "",
					"kSiteE": "",
					"contactsS": "",
					"siteE": "",
					"enterpriseDz": "",
					"getPhone": "",
					"inventoryName": "",
					"limitS": "0,10",
					"limitE": "25",
					"page": 1,
					"pageSize": 10
				},
				field: "",
				scrollTopCopy: 1156,
				refresh: true,
				s: 0,
				e: 25,
				uloading: true,
				sum: 0,
				type: 0,
				hide: true,
				textKHGGS: "客户选择",
				ShareDetails: "",
				showMask: false,
				err: false,
				password: "",
				delOrder: "",
				delOrderAll: {
					url: "",
					state: 0
				},
				payOrder: "",
				payOrderState: 0,
				verifyPassword: {
					item: {},
					index: 0,
					type: 0
				},
				onReachBottom: false,
				virtualList: [],
				bat64: {
					dqs: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANMAAABWCAYAAABVeqOyAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAA/nSURBVHic7Z07bBtXusf/Zx7UtclCW9ASooaGIDUETLmIC6mRsQq3SJE1m10DYbDprNvcAJFry7W0SKpVOgPWAolSKLe4LpYIIBWXLpRCpgDeQl5ds9FCj4YFKVmcx9liSJozc+ZBcmbIMc4PcKExOXPIme98748EfXD943IGRHxGCVkgwEI/7+VwPnaI3xe+31n5jgLfhLkYDifO+BKm9zsrh5RrIg7HFcHrBW2NxAWJw/HAVTNd/7iyDAF7US2Gw4kzrpqJCPgiqoVwOHHHVZgo6B+jWgiHE3c8hIlMRrUQDifuuJt5ABcmDscnHpoJb6JaCIcTd9w1E6VcmDgcn7jnmaj2PKJ1cDixx1WYbj3erxHg+6gWw+HEGc8KiIkr9TlAaxGshcOJNZ7CRL7er0MnX0exGA4nzngKEwDcevzrPoD1UFfC4cQc3y0YAHC98/t3AMmEshIOJ+b40kxddO1hSOvgcGJPX8J06/F+Ddzc43CY9GXmdeDmHodjRxroXbr2EIL0LuC1hIucgjT/COrxL4DSGPg04lwBJJHs/q3XT6Cfvg5ihTbI7Skk8j9AP33dvk4Z9Op8sHNNziKxvAn9sgL94gi0fgL9shLwikNETkF+sAbaPDfWXj8BbZ4PdS+DZiDNBADXOyvPECOTT/70KcS7eQCAflGBWt0e6GGa+HwbJDnd/Vt7V4Ly20Zg6+xFyhYhZb8yHXv/y6OBHqAgzxUEYiYP+cFT07Gb//nScbMgk7OYyP9gOqYe70J9sxXaGvulvwBED7f+9GtskrniXKErSAAg3MlBXloHSU6NcFXeiHMF09/6RWWwh19OBXeuESFMztqO0eZgWjosBhYmALGI7gkzi5Dvr9qOq2+2xu5m9CKkcyCJlOmYWt0e6FzS/KPAzjUqCEuY6icjWIkzg/lMbW493q9d76ysY0zNPTI5C/nTp7bj6vEutFppBCvyj5QtOhyzH2fRMWPJ5KzNvOv3XL1otdJIvjuWZtI/JmECDHPveuf3fxm36F7H4bbuyNppeazsbBZCOgfhTs5+nHHMCVIrAZew+SWDnKsXNz+TJKcgZvKmY1qtFIgFYNVMev1k7MzUoYUJwNhF91jOLWDcAOVg03acTM4isbTu69y9wQfAMCMn7vgzmZQ3W74ifyytNAjSwipzRw8LcnvKpgX1i8rQwsQyefWL8YtEBiJM42TusaJWgCFIrb015m5G5KRNSPxCEinAcqMdXyt7v06cKwysNUznmS9EKkhhEgd/CQhKM2H05h5JGrui1cwAANo8g1J+NnZmgQ05ZdNKtHmGm9IqSCKJic//bvo/tfqSGUhw2lBae2smM01I55B4aNbUTuccJeLMou2YFlJubxgCEyYAIzP3hHQO8oM1pnZx00jjhvxgjR11UxqgSgNarWTaLMRMnumT6BdH0NMVk4ZTj3dt/o5+WYF6vAtp/kPYXMp+FZifEwhyyqapaasBecEeofWL9q9yKIn2QIVpVOaeMLPIFCTtXQnKmy1PQdLr/4/W3re+riUvPTc98NppGdrxrq/3ulUviHMFiDNL5nVdVEyRM7X60iRMJDkN4ZMlaG/N19cvK9BOZ7sPoX5RcQy6qNVtiJbvL7G8iZtXwfhtw8LSSiSRMuUN+4VenY2/MAGjMfdYDwTLXBHSRrJWe7trLitSGtAvj/xdTGmYfaRW0/97HRDSOVsujLYatsoK2jy3aSdp/pFNmMS5gul8ZHK2q8VsKA2o1W1TwIYkpyHOFWznHQUss31cGS5p60TUydz2AwG0/aODDbYvcX8VJJGClP0K//HoF8g+I3hhI84/sh1Tq9tMU0u1aEGSnDY56FK2yExSu4W0DbPuzHRMmn80+goROcUMPowrgWsmYDTmnlYrQZhZdKxskLJFW3RrXCJCSnkd+lwBUrYIkkgZ5p2DVvhQ5GmYKvrlh9CztLBq8n86kEQK0sKqkRZwMHnV6jakbNEoqL04Aq3/c+R+E6tyQ6+fAC0P/zeRst3r3veF9blCESagbe79vLIMiuWwrmFFKa8zjwvpnC26RZtnhqk3Jmhvd6H/q/zhoXehVXpi+pskp4wEtUt4X5xZgpCfhXKwydRSo6pscINl4in/+8yzcl7M5CFY8ox+3jcsoQkTAEBTv6aCdDjKMcskOQX5wZrtuHKwCYlhXnliyRWR3832nWTt+D6s404bghNueTW1+hLywmpXyEhyGomHm0a1dTtKOK4I6RxzcyC/m/UUCqtpSFuN0AUJCFmYbj3er139tPIcBN+FeR1H5JQRfbPclE6Y2JpjGQRhcrbv5Kg1SjcInaoN1gPX25rQqp9AXnpuWqM0XzACEtZAzBjhtEGJM0uekThbKD0icz6cAEQPt//86/ejatWQGeU0xo49XknJfjA07VNM5H+wCRJtNaAcbpnC4LR5jtbemj1w0Q7ETOS3jPYMH9UZUSFm8o5VIEL6nuf7yW1z4CSqgthwzbw2mk6fiwJ5EcW1OkgLq8xchHKwMZY7sRduFR6A4QO29tfYzrXSgPpmC/plBfKnT01OPUlOQ76/CilbHA9NxagC6YUkp0GSU45BBGYdX0QdxZEIU/K9/t/vbwuRCZOULTKjWgBMkaBAiyU9Iki24z4R0vcg3v2DsxC1jLSAn5yQfvoaNxdG6Nx6vo6mEucK0GqlbqQwaqRs0bNOkpWo7sAKpesXw+UB/RKJMJGv9+vXP63sg4Qf2ettT/eitW8PTAyKkL6HxMO/mo6ph38bKKFLklPtCKT7g6XVSlCrL/sL9SoNKAcb0N6VjHSBxZwiiZSxEc0XQFsNI8p4cRSJYIl388xNUKv9A2LmD92/WYnq7jksFRNRdhRHIkwGtDbEyAlv2gM3rCU5caEjQMLMoudnoG1tJ6TvIbE8fBCFNs/YkbO2tkLWuKZWK4HWT4wi0zAeUIbfpl9UoBxsmqJ7nUS1LbDASPJG2UAYnTARUgvt1D7yLOOM/GDNtPM6oddPoB3vQkjnDO3rs/XDi5tXRYiZvGvbRldjAaCW6vOg0I53AaVhCvUr7WCKfnkEsef+SvMFw//tQZxZtPtLEVaXhx7NCxshnXMUJGuJzLjilTzWLypo7X2LVulJaIlVrVZCq/TEaNNw8SWVw61QTT61ut39jMrhVlf7WKORwieLtnInqx9IW41I/b7oNBOlGZDgzTx6xTZRaPMMrfK6bTxUL8LMIsRPgjELWXVs4nyBqXG0Wsl0k2k7wdq7I9PmGfTLo/59oiHRLyto7Ve6cwbFTL77/Wqn5UiKX9XqS4DCdC3aLqHqmnqJFIR0DlqzvbkwTLyoKzoiEyZKyEIYHhNtntseRL1+YjQDUvf3CpOzQ5Xye+Hk++iXFeDSfEytbkPM5LtDLd0eBOW3jdBm9X24iBElVKvb7ZkU9yIrv6LNc+bns1a3S9li93ti1vFF3EAYiTDRF8uT74GFsM7faUsgyWlTM6A1eTfuBNVDRCZnIc0X+tZqHWG2Ovb6ZWUspr9a10CS093WEquJp49gYm0kwnR9S/pLiHE80OY59Msj0NPXYz95aBBIcgriXMF4qF12WyGdg3S/p+pDTvqu9SOTs91dn7Ya0E9fQ/2/cExMkpwaqLWC2c+VLYI2z22mvn5aHnqd/RJNnonQ/wo1LA7DWe03XKtfHEHFy0Cu39kle2H1CQH+w7XWqgeayaNVf+L4gNOrM1M0TpxZgpa+5yvXZergTaQgzCyCBrgxdUL/bqVCfmB1G1v70mirMZKOgNCF6eqnlW8AZMK+ziB5DyfzpXPj+3FghfQ9uzC9+0cAXbgfatFIIgX506eOyWbWzi0/eOptPsop+9rf7vb/nTJC9cLMEqT7/xnYpCTWZ7TNRhxk7QEQamj8+sflDAiehXmNIDE0QRETn/8d8oOngc2vGxQjuGJpvb+Tc23lVqtmTUuS057FoSznfZBIGEtgpBBGjlk/Yy+j0kpA2HkmUXoxyl6mvpCNXb83Kihlv4KQHn6G3TBotZLNLDTKjNjBFVavFKvfqQtjqP8g04k6fl0UOPWDAaPTSkCIwnT108o3UXbZDo3SgMrIoRgjxEYbFVTKZuVOktOuAmLduYU7OcfPwNRK7/rXStZqdCe00zKUgw1b9UK/aA4BhlHO0wtFmOJm3nXQT18zzSTW8P8oYe3ERirAWTtZqxiYwufwUzODhJTdzEJjLPUGbl59CaW8PnxjZHLKcW5eYml9ZL1Z4WimOJl3FoypQOYInHAnN3L/ieUnuGkn6wMrfGKfPxfkT82wIpdarYSb0pNuGVQgYXaH7ukOJDnNHFMQBYELU+zMOwasaJk4VxipudevdrKZO0rD/NoAtVLvNWnzDGr1paGFDjaCbRmXU0g83PQMaIgzSyOxJgIVpriad1Y6JUq9dNsRRkjvmjrzAR13e6UB7bRsFMmWn+HmVdH0Wrk9Q9D0liFLlLS3u2jtrznO/BsKF0GyFsECRm9U1AIVbJ5JlF4QGk/zzkqnVq7XnBAz+YGSw0HREXK3aFYvbqPPrOF19Xh3aAEIqyDXrcVGOdzqRvCsm51419DcrfJ6JPcsMM30MZh3Vnr9B61Wws2rL0c+P6K3RWEg2k2UvXRa38cRMZNH4jP78BjA0NSdynK1us2M8Al3cpjIb0UyGTYQzdT4+bMFQuloxnmFSCfTrlZfDl3J4IXRSRq+T8aaR0frJ8wB+Sx6J8iGidcAGdYseeVgE+ThtM0UJMlpTOR/CP3ncgIRJonSFx7dDrGlNxhh/ZlJ2mp2Hfthdz4xkw+1HcQN4Q77Zz9ZtPa+DV2YpGzRCPg45K0chUJpoLW35uhbdYTTaartsAwtTNc7K89oiO0V4wRtntv8KK/Xc/rDaUIt0Am6eAiC0kCr9MRxsE5nVJi1nywIhvKZGj9/toAx+OnNKPGbYdcvKpGM5P3YUKvbzLZ5vX6C1r7/2RPKbxtGsMh6/HArtA7coTTTx2zeOaHVSs4z+drQ5lnfYeZxaL7zQxQbhPLbhil6N6ivo73dBa2fdH9VUj3eDbXtfmBher+z8l0czLugh6oYo67Kph97pkoDtHlu/Kv/c6BgxTj+CkWYGN8Z+97Q5jmUg02Id/NDz8DQLyu4eVWElC2GXk0+UMfe9Y8ryxCwF/RiOJw407fPRF8sT0Kgkc4N53DiQN9m3s1t6Rmi6JzlcGJGX2YeN+84HGd8m3ncvONw3PFt5nHzjsNxx5eZx807DscbTzOPm3ccjj88zTxu3nE4/nA187h5x+H4x9XMIwK+iGohHE7ccRUmCvrHqBbC4cQdjwAEyUSwBg7noyD2P8PJ4YwLHmYe3kS1EA4n7rgHICjlwsTh+MTdzKPa84jWweHEHldhuvV4v0aA76NaDIcTZ3zV5r3fWTmMQ4s6hzNKfEXzJq7Uh1xDcTju9N0cSAR8YSRzSSaUFXE4MeXf/8Kr1HBQuCEAAAAASUVORK5CYII=",
					yqs: "data:image/png;base64,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",
					ysk: "data:image/png;base64,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",
					dqss: "data:image/png;base64,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",
					yfk: "data:image/png;base64,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",
					bz: "data:image/png;base64,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",
					lock: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAABBCAYAAACO98lFAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAPtSURBVHic7ZtPkptWEMa/fiMxy5Ab4BNkMtpkF+YEdk5gXAWUlvEJPFpmNZ6dClEVsswqzgmMd1lMaZQTBN9Aa0bTnQ1yITSyQDzAdr3fSjyg6fro968bAQaDwWDYgfp+4HQ6dZj5gpkdpdR3ROSIyJqZPyqlsjzP0yRJ1n361JsIQRB4RPQcwItj14pIKiKzzWaz6kOQzkXwfd9VSv0OwDnh9oyZX8VxnOr1apfORPA8zz4/P78REe8zl61EZE1EDj4v0ts8z2ddRUUnInieZ1uW9R7AReVURkQpEc3m83lWva+Imp8B/ArArpxe5Xl+1YUQ2kUoBr732H+z11EUzeraCcPwDfbFyJRSV08J2Aal0xgAMPNf2BUgU0o9ayIAAERRNFNK/QggKzVvBdaKVhHCMLzBbhdo9ebm83mmlLpCRYgiSrShrTsU/bn8lrSFbjHG3KMUYcx8pWvW0BYJRLTzdkTkF119N0mSdRERnyimXS2c6TBSRMF1qel6sVj8qcP2lru7u/VkMgEAt2iyLy8vPy6Xy1Vb21oioRIF6zzPb3XYrVIMrlmp6aUOu61F8H3fJSK31PS246Vusv1BRG4QBNW1SGN0RELZic6iYItS6o/ysYi4rW22NVBsigAAItL5hmc+n2cikj71/FNpJYLneTYRfYoEIkrbOlSH8nMqXfEk2kaCjdKylpk/tLRXi+pz2o4LrUQYjUZO+Xiz2WRt7NWl+hwRqW62GtFKhGILXKaXjFCSJNkRPxrRaNlcrNlfYH+L/CWxAvAuz/PbuoN0LRGeWrt/BdTeu9TqDpZlnZoeGxJHRGrtNkfHLvA8z8ZucjRj5lsi6jUjXAcRsZVSL1F01yK19+rYfUdFGI/HTvm4j8RnG4IgSInofnvs+757zN+j3aE6/fQ1DZ7Kw8ND4wjVnl77GjEiwIgAwIgAoMbs0BXT6dQRkTdFYTY7VJDpg0EioSjQ3IuIR0SuiHjMfD+dTp0h/BlEBGa+wX6ZzS7ae2eoMeHQBszp04ktg4ggItmBU4faO2UoEZ6sSzJzp0naQwwiQhzHKTOXa4xrnWW1pgy2TojjON12CxFZDbkpM4slGBEAGBEADCwCEa0AQET+HtKPwfYOABBF0WsAr4f0ATDdAYARAYARAYARAYARAYARAYARAYARAUANEao1x/F47HbmjQYsy9rJWtWpmNUqzYdh+B92U18rEfniCrLA3jdM6yiKvj92T61lMzPfKqXKSdALot7/PtUYZq71ZX2tz3qXy+U/k8nEBvBTK6/65XqxWPxW58JGr9P3fRfAxdnZ2Q+neNUHj4+P/45Go3dDFXIMBoPhm+B/b5qTk/hRUuYAAAAASUVORK5CYII=",
					copy: "https://res-oss.elist.com.cn/wxImg/list/copy.svg"
				},
				Title: "条件筛选",
				OperatingSystem: false,
				startX: 0,
				startY: 0,
				uNoticeBarlist: [
					"请及时完成2024年订单收款，逾期将无法处理；跨年后，可前往更多功能-往年数据处查看往年订单。"
				]
			}
		},
		onLoad() {
			// this.loadData()
			// this.LoginIf()
			// this.SOCKETfLUSH()
			// this.Init();
			this.$getModel((value) => {
				if (value) {
					this.tabHight = value
					// 在这里可以根据获取到的值进行其他操作
				} else {
					this.tabHight = value
				}
			});
			this.OperatingSystem = this.getOperatingSystem();
			console.log("this.OperatingSystem:", this.OperatingSystem);
		},
		// onReachBottom() {
		// },
		onPullDownRefresh() {
			console.log("下拉");
		},
		onShow() {
			if (this.vuex_user.phone != undefined) {
				this.loadData()
				this.SOCKETfLUSH()
				this.Init();
				// this.$refs.paging.reload();
			} else {
				this.$u.toast("登录查看更多");
				if (this.vuex_tabIndex != "") {
					this.current = Number(this.vuex_tabIndex) + 1
				}
			}
		},
		onShareAppMessage(ops) {
			if (ops.from === 'button') {
				var pid = ops.target.dataset.id;
				var pThumb = ops.target.dataset.thumb;
				var phone = this.vuex_user.phone;
				var port = this.vuex_userRole
				var versions = this.ShareDetails
				console.log("分享参数：", pid);
				console.log("分享参数：", pThumb);
				console.log("分享参数：", phone);
				console.log("分享参数：", port);
				console.log("分享参数：", versions);
				return {
					// title: `这是您的${versions=="Y"?"有金额":"无金额"}货单，请打开易单据查看详情~`,
					title: `您有一张订单待确认~`,
					path: '/pages/subOrder/detailsShare?share_id=' + pid + "&&type=1" + "&&phone=" + phone + "&&port=" + port +
						"&&versions=" + versions,
					imageUrl: pThumb
				}
			} else {
				return {
					title: '打开易单据小程序，极速管理您的货单~',
					path: '/pages/index/index',
					imageUrl: '/static/share.png'
				}
			}
		},
		onUnload() {
			//console.log("页面离开1");

		},
		onHide() {
			//console.log("页面离开2");
			this.ClearIF()
		},
		methods: {
			jumpVideo() {
				var port = this.vuex_userRole == "D"
				this.$openVideo(this, port ? 3 : 4);
			},
			touchStart(e) {
				this.startX = e.touches[0].pageX;
				this.startY = e.touches[0].pageY;
			},
			touchMove(e) {
				let moveEndX = e.touches[0].pageX;
				let moveEndY = e.touches[0].pageY;
				let diffX = moveEndX - this.startX;
				let diffY = moveEndY - this.startY;

				if (Math.abs(diffX) > Math.abs(diffY)) {
					// 主要是左右滑动  
					if (diffX > 60) {
						// 向右滑动  
						// console.log('向右滑动', diffX);
						this.xyTabar(diffX)
					} else if (diffX < -60) {
						// 向左滑动  
						// console.log('向左滑动', diffX);
						this.xyTabar(diffX)
					}
				}
			},
			xyTabar(x) {
				//左右滑动
				// if (x>0) {
				// 	this.current=this.current+1;
				// }else{
				// 	this.current=this.current-1;
				// }
				// this.$refs.paging.reload();
				// // this.current = index;
				// this.$u.vuex('vuex_tabIndex', (this.current == 0 ? "" : (Number(this.current) - 1)));
				// this.realTimeSel.paymentState = (this.current == 0 ? "" : (Number(this.current) - 1))
				// this.realTimeSel.limitS = 0 + "," + 10
				// //console.log("(当前标记)this.current:", this.current);
				// //console.log("(储存标记)this.vuex_tabIndex:", this.vuex_tabIndex);
				// this.refresh = true
				// this.refreshDataNew()
			},
			touchEnd(e) {
				// 滑动结束后的处理  
			},
			getOperatingSystem() {
				let systemInfo = uni.getSystemInfoSync();
				// console.log("systemInfo:", systemInfo);
				if (systemInfo.system.toLowerCase().includes('ios')) {
					return true;
				}
				// iOS detection from: http://stackoverflow.com/a/9039885/177710  
				if (systemInfo.system.toLowerCase().includes('android')) {
					return false;
				}
			},
			TitleFun(showTage) {
				this.Title = showTage == 0 ? "联系人" : (showTage == 1 ? "联系号码" : showTage == 2 ? (this.vuex_userRole == 'R' ?
					'收货地址' : '收货地址') : showTage == 3 ? "产品名称" : "条件筛选")
			},
			Init() {
				this.password = ""
				this.hide = true
				
				console.log('当前：',this.vuex_tabIndex)
				if (this.vuex_tabIndex != "") {
					this.current = Number(this.vuex_tabIndex)
					this.realTimeSel.paymentState = Number(this.vuex_tabIndex) - 1;
				}

				//console.log("(当前标记)this.current:", this.current);
				//console.log("(储存标记)this.vuex_tabIndex:", this.vuex_tabIndex);

				this.realTimeSel.getPhone = this.vuex_user.phone

				var ifwork = this.vuex_user.data.work == "0"
				var timeEmp = this.realTimeSel.startDate == "" || this.realTimeSel.endDate == ""
				var ifWorkPort = this.vuex_userRole == "R"

				//console.log("端口：", ifWorkPort);

				if (ifWorkPort) {
					this.tabsList[1].name = "待确收"
					this.tabsList[3].name = "已付款"
					this.labText = "确认付款"
					this.textKHGGS = "供应商选择"
				} else {
					this.tabsList[3].name = "已收款"
					this.tabsList[1].name = "待签收"
					this.labText = "确认收款"
				}

				if (ifwork) {
					//没有工作
					//console.log("没有工作");
					if (!ifWorkPort) {
						//console.log("没有工作 发货");
						this.realTimeSel.bossNumberE = ""
						this.realTimeSel.bossNumberS = this.vuex_user.phone
					} else {
						//console.log("没有工作 收货");
						this.realTimeSel.bossNumberS = ""
						this.realTimeSel.bossNumberE = this.vuex_user.phone
					}

				} else {
					//有工作
					//判断身份
					var identity = this.vuex_user.workData.identity;
					//老板
					var boss = this.vuex_user.workData.bossNumber;
					//console.log("有工作");
					if (!ifWorkPort) {
						//发货端
						//console.log("有工作 发货端");
						this.realTimeSel.staffNumberE = ""
						this.realTimeSel.bossNumberE = ""
						if (identity == "4") {
							//console.log("有工作 发货端 员工");
							this.realTimeSel.staffNumberS = this.vuex_user.phone;
							this.realTimeSel.bossNumberS = boss;
						} else {
							//console.log("有工作 发货端 其他");
							this.realTimeSel.staffNumberE = ""
							this.realTimeSel.bossNumberE = ""
							this.realTimeSel.bossNumberS = boss
						}
					} else {
						//console.log("有工作 收货", JSON.parse(JSON.stringify(this.vuex_user.workData)));
						//console.log("有工作 收货" + identity);
						//收货端
						this.realTimeSel.staffNumberS = ""
						this.realTimeSel.bossNumberS = ""
						if (identity == "4") {
							//员工
							//console.log("有工作 收货 员工" + identity);
							this.realTimeSel.staffNumberE = this.vuex_user.phone;
							this.realTimeSel.bossNumberE = boss;
						} else {
							//其他
							//console.log("有工作 收货 其他");
							this.realTimeSel.staffNumberE = ""
							this.realTimeSel.bossNumberS = ""
							this.realTimeSel.bossNumberE = boss
						}

					}

				}

				if (timeEmp) {
					this.realTimeSel.startDate = this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1),
						'yyyy-mm-dd');
					let currentDate = new Date();
					currentDate.setDate(currentDate.getDate() + 15);
					this.realTimeSel.endDate = this.$u.timeFormat(currentDate, 'yyyy-mm-dd');
					this.date1 = this.realTimeSel.startDate
					this.date2 = this.realTimeSel.endDate
				}

				let resJson = uni.getStorageSync("companyNameJSON")
				//console.log(resJson);

				if (resJson != "") {
					var json = JSON.parse(resJson)
					this.searchList.customer = json.company
					this.customer = json.company
					if (!ifWorkPort) {
						this.realTimeSel.organizationE = json.company;
					} else {
						this.realTimeSel.enterpriseS = json.company;
					}
					this.$refs.paging.reload();
					uni.removeStorageSync("companyNameJSON")
				}

				if (this.vuex_userRole == "R") {
					this.tabsList[this.tabsList.length - 1].name = "已付款"
				}

				// this.refreshDataNew();
				// #ifdef MP-WEIXIN
				this.$refs.paging.refresh();
				// #endif
				// this.$refs.paging.reload();
			},
			virtualListChange(vList) {
				// console.log("virtualListChange:", vList);
				this.orderList = vList;
			},
			queryList(pageNo, pageSize) {
				// this.LimitSeting(pageNo);
				if (this.vuex_user.phone != undefined) {
					// console.log(pageNo, pageSize);
					this.realTimeSel.page = pageNo
					this.realTimeSel.pageSize = pageSize
					this.refreshDataNew();
				} else {
					console.log("请登录");
					this.$refs.paging.complete([]);
				}
			},
			refreshDataNew() {
				this.uloading = true
				if (this.refresh) {
					this.refresh = false;
					this.onReachBottom = false
					this.realTimeSel.role = this.vuex_userRole == "R" ? "1" : "0"
					console.log('this.vuex_tabIndex',this.vuex_tabIndex)
					console.log('this.current',this.current)
					if (this.vuex_tabIndex != "") {
						this.realTimeSel.paymentState = Number(this.vuex_tabIndex) - 1;
					}
					console.log('获取订单获取订单获取订单获取订单')
					this.$u.post('/edo/order/getFilter', this.realTimeSel)
						.then(res => {
							var orderList = res.data.data.map(obj => {
								return {
									...obj,
									share: false
								};
							});

							// console.log(orderList, orderList.length);

							this.$refs.paging.complete(orderList);

							this.totalMoney = orderList.reduce((total, obj) => total + obj.price, 0);

							this.refresh = true;
							this.onReachBottom = true
							this.uloading = false
						})
						.catch(res => {
							this.$refs.paging.complete(false);
							this.refresh = true;
							this.$u.toast("请求失败");
						});


					this.$u.post('/edo/order/Quantity', this.realTimeSel)
						.then(res => {
							//console.log("当前订单个数：", res);
							this.OrderQuantity = res.data.data[1]
							this.OrderQuantitySum = res.data.data[0]
						})
						.catch(res => {
							this.refresh = true;
							this.$u.toast("获取个数失败");
						});

					// 
				} else {
					//console.debug("请求到底拦截");
				}
			},
			LimitSeting(pageNo) {
				//console.debug("分页");
				if (this.onReachBottom) {
					this.type = 1;
					var sum = this.realTimeSel.limitS;
					var list = sum.split(",")
					var s = Number(list[0]);
					var e = Number(list[1]);

					//console.debug("改变前 ", s, e);
					var mo = this.orderList.length % this.OrderQuantity;
					var deng = mo != 0;
					var xy = deng < 1;
					if (deng && xy) {
						// this.$u.toast("已经是最后一个")
					} else {
						if (pageNo == 1) {
							s = 0;
						} else {
							s = s + 10;
						}

						e = 10;
						//console.debug("改变后 ", s, e);
						this.realTimeSel.limitS = s + "," + e
					}
				} else {
					this.uloading = true
					//console.log("重复拦截");
				}
			},
			getNewfreshData() {
				this.realTimeSel.role = this.vuex_userRole == "R" ? "1" : "0"
				this.$u.post('/edo/order/getFilter', this.realTimeSel)
					.then(res => {
						//console.log("滑动触发", res);
					})
					.catch(res => {
						this.refresh = true;
						this.$u.toast("请求失败");
					});


				this.$u.post('/edo/order/Quantity', this.realTimeSel)
					.then(res => {
						//console.log("当前订单个数：", res);
						this.OrderQuantity = res.data.data[1]
						this.OrderQuantitySum = res.data.data[0]
					})
					.catch(res => {
						this.refresh = true;
						this.$u.toast("获取个数失败");
					});
			},
			loadData() {
				this.$loadUser(this);
			},
			VerifyAdd(item, index, type) {

				this.err = false
				var pas = this.vuex_user.vuex_password;
				if (pas == "" || pas == null || pas == undefined) {
					uni.showModal({
						title: '暂无签收人，是否去添加？',
						showCancel: true,
						cancelText: '取消',
						confirmText: '去添加',
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/subPack/user/signee/add',
								});
							}
						},
						fail: () => {},
						complete: () => {}
					});
					return;
				}

				if (type == 1) {
					let tips = ""
					if (this.vuex_userRole == "D") {
						tips = "是否确认向收货方申请删除该单据，需要对方同意后单据才会被删除 ？"
						if (item.paymentState == "0") {
							// 1、订单未确认的情况下，直接删除
							tips = "是否确认删除该单据，删除后该单据将从单据列表中移除 ？";
						}
					} else {
						tips = "是否确认向发货方申请删除该单据，需要对方同意后单据才会被删除 ？"
					}
					uni.showModal({
						title: '温馨提醒',
						content: tips,
						showCancel: true,
						cancelText: '取消',
						confirmText: '确定',
						success: res => {
							var okif = res.confirm;
							if (okif) {
								this.showMask = true
							}
						}
					});
				}

				if (type == 2) {
					var port = this.vuex_userRole == "R"
					var thisPhone = this.vuex_user.phone;
					let tips = "是否确认收货方已支付该单据"
					let title = "确认收款提示"
					if (port) {
						tips = "是否向发货方申请确认付款该单据"
						title = "确认付款提示"
					}
					uni.showModal({
						title: title,
						content: tips,
						showCancel: true,
						cancelText: '取消',
						confirmText: '确定',
						success: res => {
							var okif = res.confirm;
							if (okif) {
								this.showMask = true
							}
						}

					});
				}



				if (type == 3) {
					var port = this.vuex_userRole == "R"
					var thisPhone = this.vuex_user.phone;
					let tips = "是否确认修改该单据？"
					let title = "修改提醒"
					uni.showModal({
						title: title,
						content: tips,
						showCancel: true,
						cancelText: '取消',
						confirmText: '确定',
						success: res => {
							var okif = res.confirm;
							if (okif) {
								this.showMask = true
							}
						}

					});
				}


				// if (type == 4) {
				// 	this.$pushMessage("312312");
				// }

				this.verifyPassword.type = type;
				this.verifyPassword.item = item;
				this.verifyPassword.index = index;

				//console.log(this.verifyPassword);
			},
			verifyPasswordAdd(item, index, type) {
				this.verifyPassword.item = item;
				this.verifyPassword.index = index;
				this.verifyPassword.type = type;
			},
			changeList(e) {
				//console.log("changeList操作", e);
				this.password = e
			},
			finishList(e) {
				//console.log("finishList操作", e);
				this.password = e
			},
			cancel() {
				this.showMask = false
				this.password = ""
			},
			compile(item) {
				// console.log("编辑:", item);
				uni.navigateTo({
					url: "/pages/subOrder/addCompile?orderId=" + item.id
				})
			},
			confirm(password) {
				//console.log(password);

				var pas = this.vuex_user.vuex_password;
				var type = this.verifyPassword.type;
				var item = this.verifyPassword.item;
				var index = this.verifyPassword.index;

				//删除 1
				//确认付款 2
				//确认收款 3

				var run = pas == password
				if (run) {
					type == 1 ? this.deleteOrder(item, index) : ((type == 2) ? this.payment(item) : (type == 3 ? this
						.compile(item) : this.compile(item)))
				} else {
					this.err = true
					this.$u.toast("密码验证失败")
					this.password = ""
					return;
				}


				this.password = ""
				this.verifyPassword.type = 0;
				this.verifyPassword.item = {};
				this.verifyPassword.index = 0;
				this.showMask = false

			},
			ShareY(item) {
				this.ShareDetails = "Y"
				//console.log("有金额");
				// #ifdef APP
				this.appShare(item)
				// #endif
			},
			ShareN(item) {
				//console.log("无金额");
				this.ShareDetails = "N"
				// #ifdef APP
				this.appShare(item)
				// #endif
			},
			appShare(item) {
				// console.log("分享", item.id);
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession",
					type: 5,
					summary: "您有一张待确认单据！",
					imageUrl: item.picturesId,
					miniProgram: {
						id: "gh_65335aa354af",
						path: "/pages/subOrder/detailsShare?id=" + item.id,
						type: 0,
						webUrl: 'http://uniapp.dcloud.io'
					},
					success: function(res) {
						console.log("success:" + JSON.stringify(res));
					},
					fail: function(err) {
						console.log("fail:" + JSON.stringify(err));
					}
				});

			},
			shareNY(item, i) {
				item.share = i == 1 ? true : false;
				//console.log("分享", item);
			},
			copyBtn(val) {
				const that = this;
				uni.setClipboardData({
					data: val,
					success: function() {
						that.$u.toast("单号已复制")
					}
				});
				return
			},
			ifZX(val) {
				return val.includes("zx-");
			},
			SOCKETfLUSH() {
				this.unwatchFlush = this.$store.watch(
					(state) => state.flush, // 监听状态  
					(newVal, oldVal) => {
						this.flushIndex = newVal; // 当状态变化时，更新本地数据  
						//console.log('list flush 改变:', newVal);
						this.$refs.paging.refresh();
						// this.refreshDataNew()
					}
				);
			},
			remark(item) {
				this.goPath('/pages/subList/remark?item=' + JSON.stringify(item));
				this.hide = false
			},
			ClearIF() {
				if (this.hide) {
					//console.log("清除缓存");
					this.clear()
					this.$refs.paging.reload();
					this.realTimeSel.limitS = 0 + "," + 10
					this.Title = "条件筛选"
				}
			},
			payment(val) {
				var port = this.vuex_userRole == "R"
				var thisPhone = this.vuex_user.phone;
				var ifok = true;
				if (ifok) {
					if (port) {
						//收货端  发起申请
						//console.log("收货端");
						this.applyUpdatePlay(val)

					} else {
						//发货端 直接收款
						//console.log("发货端");
						val.paymentState = "2"
						val.signaturePhone = thisPhone;
						this.updateOrder(val)
					}
				}
			},
			flushDBSX(val) {
				var list = [val.bossNumberS, val.staffNumberS, val.bossNumberE, val.staffNumberE]
				this.$inform(this, list)
			},
			generateFiveDigitNumber() {
				return 10000 + Math.floor(Math.random() * 90000);
			},
			applyUpdatePlay(val) {
				// console.log(val);
				//申请修改
				//当前手机号码 发起者
				var aPhone = this.vuex_user.phone;
				//是否工作
				var workif = this.vuex_user.data.work == "0";
				//收获端老板是否为同一人
				var ifOne = val.bossNumberE == val.staffNumberE
				//判断端口
				var ifPort = this.vuex_userRole == "D"
				//订单状态
				var stateOrder = val.paymentState == "0"
				var dx = {
					"aUser": aPhone,
					"bUser": val.bossNumberS,
					"orderNumber": val.orderNumber,
					"orderId": val.id,
					"createTime": new Date(),
					"updateTime": "",
					"state": 1,
					"aBoss": "",
					"bBoss": "",
					"port": this.vuex_userRole,
					"orderState": val.paymentState,
					"aName": this.vuex_user.data.name || this.vuex_user.phone || "",
					"genre": "P"
				}


				if (workif) {
					//没工作
					dx.aBoss = this.vuex_user.phone;
					dx.bBoss = val.bossNumberS;
					dx.bUser = val.staffNumberS;
				} else {
					//工作
					var identity = this.vuex_user.workData.identity;
					var boss = this.vuex_user.workData.bossNumber;
					dx.aBoss = boss;

					if (val.bossNumberS == val.staffNumberS) {
						//直接发起老板
						dx.bBoss = val.bossNumberS
					} else {
						//发起给员工
						dx.bBoss = val.staffNumberS
					}

				}

				this.$u.post('/edo/orderDel/add', dx).
				then(res => {
					this.finallyAlertDel(res.data, val)
				}).catch(res => {

					// this.refreshData()
				})



			},
			finallyAlertDel(resData, val) {
				// console.log("DEL or PAY-------------申请", resData);
				this.$u.toast(resData.message);
				this.password = ""
				if (resData.data == 1) {
					this.flushDBSX(this, val)
					this.$refs.paging.refresh();
				}

			},
			updateOrder(order) {
				this.$u.post('/edo/order/signFor', order).
				then(res => {
					// console.log(res);
					if (res.data.data == "1") {
						this.$u.toast(res.data.message);
					} else {
						this.$u.toast(res.data.message);
					}
					this.$refs.paging.reload();
				}).catch(res => {
					this.$u.toast("确认失败~");
					this.$refs.paging.reload();
				})
			},
			CustomerGetChange() {
				var ifWorkPort = this.vuex_userRole == "R";
				var changeText = this.customer;
				//console.log(changeText);
				if (!ifWorkPort) {
					this.realTimeSel.organizationE = changeText;
					this.$refs.paging.reload();
				} else {
					this.realTimeSel.enterpriseS = changeText;
					this.$refs.paging.reload();
				}

			},
			getCurrentDate() {
				const date = new Date();
				date.setDate(date.getDate() + 15);
				const year = date.getFullYear();
				const month = ("0" + (date.getMonth() + 1)).slice(-2);
				const day = ("0" + date.getDate()).slice(-2);
				return `${year}-${month}-${day}`;
			},
			getCurrentYearFirstDay() {
				const date = new Date();
				const year = date.getFullYear();
				const month = ("0" + (date.getMonth() + 1)).slice(-2);
				const day = ("0" + date.getDate()).slice(-2);
				return `${year}-01-01`;
			},
			searchListenner(e) {
				//console.log(e);
				var filterIndex = this.showTage;
				var ifWorkPort = this.vuex_userRole == "R"

				if (filterIndex == '0') {
					if (!ifWorkPort) {
						//发货 收货人
						this.realTimeSel.kTakeE = this.field
					} else {
						this.realTimeSel.kTakeE = this.field
						// this.realTimeSel.contactsS = this.field
					}
				}

				if (filterIndex == '1') {
					if (!ifWorkPort) {
						//发货 电话号码
						this.realTimeSel.kPhoneE = this.field
					} else {
						this.realTimeSel.kPhoneE = this.field
					}
				}

				if (filterIndex == '2') {
					if (!ifWorkPort) {
						//发货 收货地址
						this.realTimeSel.kSiteE = this.field
					} else {
						this.realTimeSel.kSiteE = this.field
					}
				}

				if (filterIndex == '3') {
					if (!ifWorkPort) {
						//产品名称
						this.realTimeSel.inventoryName = this.field
					} else {
						this.realTimeSel.inventoryName = this.field
					}
				}
				this.type = 1
				this.$refs.paging.reload();
				// this.refreshDataNew()
			},
			Filtrate(i) {
				//console.log(i);
				this.field = ""

				var filterIndex = this.showTage;
				var ifWorkPort = this.vuex_userRole == "R"

				this.realTimeSel.kTakeE = ""
				this.realTimeSel.kSiteE = ""
				this.realTimeSel.kPhoneE = ""
				this.realTimeSel.inventoryName = ""

				this.showTage = i;

				this.TitleFun(i)
				this.$refs.paging.reload();
			},
			filtrateGet() {
				this.show_start = true
			},
			CustomerGet() {
				if (this.vuex_user.phone != undefined) {
					this.hide = false
					uni.navigateTo({
						url: '/pages/subOrder/table?show=0'
					})
				} else {
					this.$u.toast("登录查看更多")
				}
			},
			openTime() {
				//console.log("点击");
				this.show_start = true
			},
			noteMyOrder(val) {
				//console.log(val);
			},
			payClick(val) {
				uni.showModal({
					title: '温馨提醒',
					content: '请仔细核对货物信息后确认收货',
					showCancel: true,
					cancelText: '取消',
					confirmText: '现款签收',
					success: res => {

					}
				});
			},
			change(index) {
				//查询数据库
				this.$refs.paging.reload();
				this.current = index;
				console.log('index',index);
				
				this.$u.vuex('vuex_tabIndex', (index == 0 ? "" : index));
				this.realTimeSel.paymentState = (index == 0 ? "" : index)
				this.realTimeSel.limitS = 0 + "," + 10
				// console.log("(当前标记)this.current:", this.current);
				//console.log("(储存标记)this.vuex_tabIndex:", this.vuex_tabIndex);
				this.refresh = true
				this.$refs.paging.reload();
			},
			copyBtn(val) {
				const that = this;
				uni.setClipboardData({
					data: val,
					success: function() {
						that.$u.toast("单号已复制")
					}
				});
				return
			},
			sendTips(val) {
				this.$u.toast("请先到后台发货~")
			},
			// 删除订单
			deleteOrder(val, index) {
				//是否确定
				var okif = true;
				//当前手机号码 发起者
				var aPhone = this.vuex_user.phone;
				//是否工作
				var workif = this.vuex_work == "N";
				//收获端老板是否为同一人
				var ifOne = val.bossNumberE == val.staffNumberE
				//判断端口
				var ifPort = this.vuex_userRole == "D"
				//订单状态
				var stateOrder = val.paymentState == "0"
				//请求地址
				var url = ""

				if (okif) {
					//按下确认
					var dx = {
						"aUser": aPhone,
						"bUser": "",
						"orderNumber": val.orderNumber,
						"orderId": val.id,
						"createTime": "",
						"updateTime": "",
						"state": 1,
						"aBoss": "",
						"bBoss": "",
						"port": this.vuex_userRole,
						"orderState": val.paymentState,
						"aName": this.vuex_user.data.name || this.vuex_user.phone || "",
						"genre": "D"
					}

					if (!workif) {
						//工作
						dx.aBoss = this.vuex_user.workData.bossNumber;
					} else {
						//没工作
						dx.aBoss = aPhone
					}


					if (ifOne) {
						//没工作
						dx.bBoss = val.bossNumberE
						dx.bUser = val.bossNumberE
					} else {
						//工作
						dx.bBoss = val.bossNumberE
						dx.bUser = val.staffNumberE
					}

					var delmess = 0;

					if (ifPort) {
						//发货端
						if (stateOrder) {
							//直接删除
							url = '/edo/order/del'
							//console.log("直接删除");
							dx = val;
							delmess = 0;
						} else {
							//申请删除
							url = "/edo/orderDel/add"
							delmess = 1;
						}

					} else {
						//收货端
						url = "/edo/orderDel/add"
						dx.bBoss = val.bossNumberS
						dx.bUser = val.staffNumberS
					}
					var that = this;
					if (delmess == "1") {
						//申请删除
						var okOrNo = 0;
						this.$u.post(url, dx).
						then(res => {
							this.finallyAlertDel(res.data, val)
						})
					} else {
						var okOrNo = 0;
						this.$u.post(url, dx).
						then(res => {
							this.finallyAlertDel(res.data, val)
						})
					}
					this.totalMoney = this.orderList.reduce((total, obj) => total + obj
						.price, 0);
				} else {
					console.log("取消");
				}
			},
			// 货单筛选
			filterClick() {
				this.filterShow = true;
			},
			date1Change(e) {
				this.date1 = e.result
			},
			date2Change(e) {
				this.date2 = e.result
			},
			filterReset() {

				const date = new Date();
				date.setDate(date.getDate() + 15);

				this.date1 = this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
				this.date2 = this.$u.timeFormat(date, 'yyyy-mm-dd');

				this.showTage = "0"
				this.realTimeSel.startDate = this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
				this.realTimeSel.endDate = this.$u.timeFormat(date, 'yyyy-mm-dd');

				this.showTage = 0;
				this.realTimeSel.phoneE = ""
				this.realTimeSel.organizationE = ""
				this.realTimeSel.enterpriseS = ""
				this.realTimeSel.enterpriseS = ""
				this.realTimeSel.takeE = ""
				this.realTimeSel.enterpriseDz = ""
				this.realTimeSel.inventoryName = ""
				this.customer = ""
				this.field = ""
				this.realTimeSel.phoneS = ""
				this.realTimeSel.contactsS = ""
				this.realTimeSel.siteE = ""
				this.realTimeSel.kTakeE = ""
				this.realTimeSel.kPhoneE = ""
				this.realTimeSel.kSiteE = ""
				//console.log("重置：", this.realTimeSel);
				this.Title = "条件筛选";
				this.$refs.paging.reload();

			},
			clear() {
				this.$u.vuex('vuex_tabIndex', 0);

				const date = new Date();
				date.setDate(date.getDate() + 15);

				this.current = 0;
				this.realTimeSel.paymentState = "";
				this.date1 = this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
				this.date2 = this.$u.timeFormat(date, 'yyyy-mm-dd');
				this.showTage = "0"
				this.realTimeSel.startDate = this.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
				this.realTimeSel.endDate = this.$u.timeFormat(date, 'yyyy-mm-dd');
				this.showTage = 0;
				this.realTimeSel.phoneE = ""
				this.realTimeSel.organizationE = ""
				this.realTimeSel.enterpriseS = ""
				this.realTimeSel.enterpriseS = ""
				this.realTimeSel.takeE = ""
				this.realTimeSel.enterpriseDz = ""
				this.realTimeSel.inventoryName = ""
				this.realTimeSel.kTakeE = ""
				this.realTimeSel.kPhoneE = ""
				this.realTimeSel.kSiteE = ""
				this.customer = ""
				this.field = ""
			},
			SearchBtn() {

			},
			filterSubmit() {
				this.show_start = false

				const date = new Date();
				date.setDate(date.getDate() + 15);

				this.realTimeSel.startDate = this.date1 != "" ? this.date1 : this.$u.timeFormat(new Date(new Date()
					.getFullYear(), 0, 1), 'yyyy-mm-dd');
				this.realTimeSel.endDate = this.date2 != "" ? this.date2 : this.$u.timeFormat(date, 'yyyy-mm-dd');
				this.$refs.paging.reload();
			},
		}
	}
</script>

<style scoped lang="scss">
	.title {
		color: $u-type-primary;
		text-align: center;
		padding: 20rpx 0 0 0;
	}

	.order-item {
		border-radius: 20rpx;
		box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, .03);
	}

	.remark {
		background-size: 30rpx;

	}

	.fixed-add-btn {
		background: transparent;
	}

	.fixed-add-btn .add-btn {
		width: 260rpx;
		height: 100rpx;
		line-height: 100rpx;
		border-radius: 120rpx;
		background: #0FB076;
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
		background: rgba(0, 0, 0, .03);
	}

	.check-company .u-line-bt {
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
			opacity: .8;
		}
	}

	.hl-btn.bg-gray {
		border: 2rpx solid #D8D8D8;
	}

	.hl-btn.NY.bg-gray {
		border: 2rpx solid #D8D8D8;
		padding-left: 2rpx;
		padding-right: 2rpx;
	}

	// .hl-btn.bg-gray {
	// 	border: 2rpx solid #D8D8D8;
	// }

	.u-img {
		float: right;
	}

	.my-input .u-input-clear {
		/* 调整清除按钮的样式，比如 margin 或 padding */
		margin-right: 20rpx;
		/* 或者其他你想要的样式 */
	}


	.passwordTitle {
		width: 100%;
		height: 40%;
		color: #333333;
		font-size: 36rpx;
		font-weight: 600;

	}

	.titlePas {
		color: #333333;
		font-size: 36rpx;
		font-weight: 600;
	}

	.titlePasOK {
		color: #01BB74;
		font-size: 36rpx;
		font-weight: 600;
	}


	.err {
		font-family: Source Han Sans;
		font-size: 26rpx;
		font-weight: normal;
		line-height: 44.92rpx;
		letter-spacing: 1.3rpx;

		font-feature-settings: "kern" on;
		color: #F53F3F;
	}
</style>