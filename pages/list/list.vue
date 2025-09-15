<template>
	<view class="root">
		<z-paging ref="paging" :auto="false" use-virtual-list :force-close-inner-list="true" cell-height-mode="dynamic" @virtualListChange="virtualListChange" @query="queryList">
			<template #top>
				<!-- #ifdef MP-WEIXIN -->
				<up-navbar :placeholder="true" leftIconColor="#fff">
					<template #center>
						<view class="flex-row items-center justify-center">
							<view class="" style="font-size: 34rpx; font-weight: 500">查询订单</view>
							<view
								@click="jumpVideo"
								class="flex-row justify-center items-center ml12"
								style="border: 2.2rpx solid #01bb74; height: 44rpx; width: 136rpx; border-radius: 8rpx; color: #01bb74; font-size: 22rpx"
							>
								<text class="mr6">使用方法</text>
								<up-icon name="https://res-oss.elist.com.cn/wxImg/video.png" size="20rpx"></up-icon>
							</view>
						</view>
					</template>
				</up-navbar>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<up-navbar title="查询订单" :placeholder="true" leftIconColor="#fff"></up-navbar>
				<!-- #endif -->
				<view style="width: 100%">
					<up-tabs
						:list="tabsList"
						lineWidth="30"
						lineHeight="7"
						lineColor="#0FB076"
						:scrollable="false"
						:activeStyle="{
							color: '#0FB076',
							fontWeight: 'bold',
							transform: 'scale(1.05)'
						}"
						:inactiveStyle="{
							color: '#333333',
							transform: 'scale(1)'
						}"
						itemStyle="padding-left: 30rpx; padding-right: 30rpx; height: 70rpx;font-size:32rpx;padding-bottom:20rpx;backgroundColor:#fff"
						:current="current"
						@change="changeTab"
					></up-tabs>
				</view>
			</template>

			<view class="Card cardShow">
				<view class="priceCard">
					<text class="ft-gray mb18 ml10" style="color: #999999; font-size: 30rpx">累计金额</text>
					<view class="">
						<text class="ft40 ft-bold ml9">￥</text>
						<up-count-to :end-val="OrderQuantitySum" separator="," color="#000000" font-size="20" decimals="2" bold></up-count-to>
					</view>
				</view>

				<view class="InputCard">
					<view class="InputOne">
						<uv-input
							v-model="customer"
							:customStyle="{ backgroundColor: 'transparent' }"
							:placeholder="userStore.userRole === 'R' ? '请选择供应商' : '请选择客户'"
							:clearable="true"
							border="none"
							@change="(e) => CustomerGetChange(e)"
						>
							<template #prefix>
								<view>
									<text class="ft30 ft-gray ml20 mr20">{{ userStore.userRole === 'R' ? '供应商选择' : '客户选择' }}</text>
									<text class="mr15">|</text>
								</view>
							</template>
							<template #suffix>
								<view class="flex-col justify-center items-center ml40">
									<up-icon name="/static/img/list/lxr.svg" size="46rpx" @click="CustomerGet"></up-icon>
								</view>
							</template>
						</uv-input>
					</view>

					<view class="InputOne" v-if="showTage !== '1'">
						<uv-input
							v-model="field"
							:customStyle="{ backgroundColor: 'transparent' }"
							placeholder="输入关键字进行检索"
							:clearable="true"
							border="none"
							@change="searchListenner"
						>
							<template #prefix>
								<up-text
									:text="Title"
									margin="0 0 0 20rpx"
									suffixIcon="arrow-down-fill"
									color="#606266"
									iconStyle="color: #606266;margin:0 10rpx;fontSize:20rpx"
									@click="filtrateGet"
								></up-text>
							</template>
							<template #suffix>
								<view class="flex-col justify-center items-center">
									<up-icon name="/static/img/list/ss.svg" size="46rpx" @click="searchListenner"></up-icon>
								</view>
							</template>
						</uv-input>
					</view>
					<view class="InputOne" v-if="showTage === '1'">
						<uv-input
							v-model="field"
							maxlength="11"
							:customStyle="{ backgroundColor: 'transparent' }"
							placeholder="输入号码进行检索"
							:clearable="true"
							border="none"
							@change="searchListenner"
						>
							<template #prefix>
								<up-text
									class="ft11 ft-gray"
									margin="0 0 0 20rpx"
									:text="Title"
									suffixIcon="arrow-down-fill"
									iconStyle="color: #606266;margin:0 10rpx;fontSize:20rpx"
									@click="filtrateGet"
								></up-text>
							</template>
							<template #suffix>
								<view class="ml40 flex-col justify-center items-center">
									<up-icon name="/static/img/list/ss.svg" size="46rpx" @click="searchListenner"></up-icon>
								</view>
							</template>
						</uv-input>
					</view>
				</view>
			</view>

			<text class="NumOrder ml10">
				<text>
					共
					<text style="color: #01bb74">{{ OrderQuantity }}</text>
					个订单
				</text>
			</text>
			<template #empty>
				<up-empty
					:icon="ImgUrl + '/wxImg/list/empty.svg'"
					iconSize="200rpx"
					:text="pinia_userRole == 'D' ? '还没有送货单呢~快去开一个单试试吧！' : '还没收到订单呢~快去邀请供应商开单吧！'"
					marginTop="-100"
				>
					<up-button
						v-if="pinia_userRole == 'D'"
						color="#01BB74"
						iconColor="#ECFFF9"
						:customStyle="{ width: '300rpx', height: '80rpx', fontSize: '32rpx', marginTop: '76rpx', background: 'transparent' }"
						shape="circle"
						:plain="true"
						@click="addOrder"
					>
						<text>去开单</text>
					</up-button>
					<up-button
						v-if="pinia_userRole == 'R' && pinia_user.phone"
						dataName="shareFriend"
						openType="share"
						color="#01BB74"
						iconColor="#ECFFF9"
						:customStyle="{ width: '300rpx', height: '80rpx', fontSize: '32rpx', marginTop: '76rpx', background: 'transparent' }"
						shape="circle"
						:plain="true"
					>
						<text>去邀请</text>
					</up-button>
					<up-button
						v-if="pinia_userRole == 'R' && !pinia_user.phone"
						color="#01BB74"
						iconColor="#ECFFF9"
						:customStyle="{ width: '300rpx', height: '80rpx', fontSize: '32rpx', marginTop: '76rpx', background: 'transparent' }"
						shape="circle"
						:plain="true"
						@click="
							uni.navigateTo({
								url: '/pages/subUser/login'
							})
						"
					>
						<text>去邀请</text>
					</up-button>
				</up-empty>
			</template>
			<view
				v-for="(item, index) in orderList"
				:key="item.id"
				:index="index"
				:id="`zp-id-${item.id}`"
				@click="
					goPath('/pages/subOrder/details?id=' + item.id);
					hide = false;
				"
				class="OrderCard"
			>
				<view class="OrderCardHand" @tap.stop>
					<view class="title ml1 flex-row items-center" style="" @tap.stop>
						<text class="ft30 ft-lightgray pr30" style="color: #666666">
							订单编号:
							<text class="ml15" @click="copyBtn(item.orderNumber)" style="color: #f76565">
								{{ item.orderNumber }}
							</text>
						</text>
						<up-icon size="28rpx" :name="bat64.copy" @click="copyBtn(item.orderNumber)"></up-icon>
						<view class="ml15">
							<up-icon size="28rpx" v-if="item.lockOrder == 1 && item.paymentState != 2" :name="bat64.lock" color="#666666"></up-icon>
						</view>
					</view>
					<view class="ml20" style="width: 30%">
						<view class="u-img" v-if="userStore.userRole == 'D'" :style="{ display: item.paymentState == '0' ? 'inline' : 'none' }">
							<up-image :show-menu-by-longpress="false" width="120rpx" height="50rpx" :src="bat64.dqs"></up-image>
						</view>

						<view class="u-img" v-if="userStore.userRole == 'R'" :style="{ display: item.paymentState == '0' ? 'inline' : 'none' }">
							<up-image :show-menu-by-longpress="false" width="120rpx" height="50rpx" :src="bat64.dqss"></up-image>
						</view>

						<view class="u-img" v-if="userStore.userRole == 'R'" :style="{ display: item.paymentState == '2' ? 'inline' : 'none' }">
							<up-image :show-menu-by-longpress="false" width="120rpx" height="50rpx" :src="bat64.yfk"></up-image>
						</view>
						<view class="u-img" :style="{ display: item.paymentState == '1' ? 'inline' : 'none' }">
							<up-image :show-menu-by-longpress="false" width="120rpx" height="50rpx" :src="bat64.yqs"></up-image>
						</view>

						<view class="u-img" v-if="userStore.userRole != 'R'" :style="{ display: item.paymentState == '2' ? 'inline' : 'none' }">
							<up-image :show-menu-by-longpress="false" width="120rpx" height="50rpx" :src="bat64.ysk"></up-image>
						</view>
					</view>
				</view>
				<view class="width100 pb25 text-left">
					<text class="flex-col text-left">
						<text
							v-if="userStore.userRole == 'D'"
							:style="{ color: ifZX(item.bossNumberE) ? '#AAAAAA' : '#3D3D3D' }"
							class="ft34 u-line-bt width100"
							style="font-weight: 500"
						>
							{{ item.organizationE || item.bossNumberE }}{{ ifZX(item.bossNumberE) ? '(已注销)' : '' }}
						</text>
						<text
							v-if="userStore.userRole == 'R'"
							:style="{ color: ifZX(item.bossNumberS) ? '#AAAAAA' : '#3D3D3D' }"
							class="ft34 u-line-bt width100"
							style="font-weight: 500"
						>
							{{ item.enterpriseS || item.bossNumberS }}{{ ifZX(item.bossNumberS) ? '(已注销)' : '' }}
						</text>
					</text>
				</view>
				<text class="ft30 line25 ft-lightgray">
					<text>日期：{{ $u.timeFormat(item.creationTime, 'yyyy-mm-dd') }}</text>
				</text>

				<text class="ft-lightgray mt10 line25 flex-row items-center justify-end">
					<text>订单金额：</text>
					<text style="color: black; font-size: 24rpx">￥</text>
					<text class="ft35" style="color: black; font-weight: 500">{{ item.price.toFixed(2) }}</text>
				</text>

				<text
					style="width: 100%"
					class="mt17 ft-lightgray ft25 bg-gray radius pd10"
					@tap.stop
					v-if="item.receiptsDescr && item.paymentState != 2"
					@click="noteMyOrder(item)"
				>
					备注：{{ item.receiptsDescr }}
				</text>

				<view class="flex-row u-border-top pd10 pt20 justify-between text-right items-center mt17" @tap.stop>
					<!-- 分享按钮区域 -->
					<view v-if="item.share" class="flex-row items-center justify-center" style="width: 100%">
						<view class="flex-row justify-center items-center" style="width: 100%">
							<view class="flex-row justify-center items-center" style="width: 40%; color: #cccccc">
								<view class="flex-row items-center justify-center">
									<button
										class="hl-btn NY flex-row items-center justify-center"
										type="default"
										open-type="share"
										name="Y"
										:data-thumb="item.picturesId"
										:data-id="item.id"
										:data-versions="'Y'"
									>
										<view style="top: 2rpx">
											<up-icon
												name="share-square"
												size="25rpx"
												color="#666666"
												labelColor="#333333"
												labelSize="22rpx"
												:label="pinia_user.data.work !== '1' && pinia_user.workDate == null ? '有金额转发' : '有金额转发'"
											></up-icon>
										</view>
									</button>
								</view>
							</view>
							<view class="flex-row justify-center items-center u-border-left u-border-right" style="width: 40%; color: #cccccc">
								<button
									class="hl-btn NY flex-row items-center justify-center"
									type="default"
									open-type="share"
									name="N"
									:data-thumb="item.picturesId"
									:data-id="item.id"
									:data-versions="'N'"
								>
									<view style="top: 2rpx">
										<up-icon
											name="share-square"
											size="25rpx"
											color="#666666"
											labelColor="#333333"
											labelSize="22rpx"
											:label="pinia_user.data.work !== '1' && pinia_user.workDate == null ? '无金额转发' : '无金额转发'"
										></up-icon>
									</view>
								</button>
							</view>
							<view class="flex-row justify-center items-center" style="width: 20%; color: #f76565" @click="shareNY(item, 2)">关闭</view>
						</view>
					</view>

					<!-- 未分享区域 -->
					<view v-if="!item.share" class="flex-row items-center justify-center">
						<view class="flex-row items-center justify-center">
							<!-- @click="shareNY(item, 1)" -->
							<button
								class="hl-btn flex-row items-center justify-center"
								type="default"
								open-type="share"
								name="Y"
								:data-thumb="item.picturesId"
								:data-id="item.id"
								:data-versions="'Y'"
							>
								<up-icon
									name="share-square"
									size="25rpx"
									v-if="OperatingSystem"
									color="#666666"
									labelColor="#333333"
									labelSize="22rpx"
									:label="pinia_user.data.work !== '1' && pinia_user.workDate == null ? '转发' : '转发'"
								></up-icon>

								<up-icon
									name="share-square"
									size="25rpx"
									v-if="!OperatingSystem"
									color="#666666"
									labelColor="#333333"
									labelSize="22rpx"
									:label="pinia_user.data.work !== '1' && pinia_user.workDate == null ? '转发' : '转发'"
								></up-icon>
							</button>
							<button
								v-if="userStore.userRole === 'R' && pinia_user.workData.identity !== '3' && item.paymentState === '0' && item.lockOrder != 1"
								class="hl-btn ml20 flex-row items-center justify-center"
								type="default"
								@click="goPath('/pages/subOrder/details?id=' + item.id)"
							>
								<!-- &&item.lockOrder!=1 v-if="OperatingSystem" -->
								<up-icon name="order" size="25rpx" color="#666666" labelSize="22rpx" labelColor="#333333" label="确认签收"></up-icon>
								<!-- <view style="top: 2rpx">
									<up-icon name="order" v-if="!OperatingSystem" size="25rpx" color="#666666" labelSize="22rpx" labelColor="#333333" label="确认签收"></up-icon>
								</view> -->
							</button>
							<button
								v-if="pinia_user.workData.identity !== '3' && item.paymentState !== '2' && item.lockOrder != 1"
								class="hl-btn ml20 flex-row items-center justify-center"
								type="default"
								@click="VerifyAdd(item, index, 2)"
							>
								<!-- &&item.lockOrder!=1 -->
								<up-icon
									name="rmb-circle"
									size="25rpx"
									color="#666666"
									labelSize="22rpx"
									labelColor="#333333"
									:label="userStore.userRole === 'R' ? '确认付款' : '确认收款'"
								></up-icon>
								<!-- <view style="top: 2rpx">
									<up-icon
										v-if="!OperatingSystem"
										name="rmb-circle"
										size="25rpx"
										color="#666666"
										labelSize="22rpx"
										labelColor="#333333"
										:label="userStore.userRole === 'R' ? '确认付款' : '确认收款'"
									></up-icon>
								</view> -->
							</button>
							<button
								v-if="pinia_user.workData.identity !== '3' && item.paymentState !== '2' && item.lockOrder != 1"
								class="hl-btn ml20 flex-row items-center justify-center"
								type="default"
								@click="VerifyAdd(item, index, 1)"
							>
								<!-- &&item.lockOrder!=1 -->
								<up-icon name="trash" size="25rpx" color="#666666" labelSize="22rpx" labelColor="#333333" label="删除"></up-icon>
								<!-- <up-icon v-if="!OperatingSystem" name="trash" size="25rpx" color="#666666" labelSize="22rpx" labelColor="#333333" label="删除"></up-icon> -->
							</button>
							<button
								v-if="
									item.paymentState !== '2' &&
									item.paymentState !== '1' &&
									item.lockOrder != 1 &&
									userStore.userRole == 'D' &&
									pinia_user.workData.identity !== '3'
								"
								class="hl-btn ml20 flex-row items-center justify-center"
								type="default"
								@click="VerifyAdd(item, index, 3)"
							>
								<!-- &&item.lockOrder!=1 -->
								<up-icon name="edit-pen" size="25rpx" color="#666666" labelSize="22rpx" labelColor="#333333" label="修改"></up-icon>
								<!-- <up-icon v-if="!OperatingSystem" name="edit-pen" size="25rpx" color="#666666" labelSize="22rpx" labelColor="#333333" label="修改"></up-icon> -->
							</button>
							<!-- 							<button class="hl-btn ml20 flex-row items-center justify-center" type="default"
								@click="VerifyAdd(item, index, 4)">
								<up-icon v-if="OperatingSystem" name="edit-pen" size="25" color="#666666" labelSize="22"
									labelColor="#333333" label="通知"></up-icon>
								<up-icon v-if="!OperatingSystem" top="2rpx" name="edit-pen" size="25" color="#666666"
									labelSize="22" labelColor="#333333" label="通知"></up-icon>
							</button> -->
						</view>
					</view>
				</view>
			</view>

			<!-- 自定义tab -->
			<template #bottom>
				<view class="" :style="`height:${bottomSafeArea + 50}px`"></view>
			</template>
		</z-paging>
		<pop-tab :tabIndex="1" ref="popTabCom"></pop-tab>
		<!-- 弹出层 -->
		<up-popup :show="show_start" @close="show_start = false" mode="top" :safeAreaInsetBottom="false" :safeAreaInsetTop="true" zIndex="999">
			<!-- #ifdef MP-WEIXIN -->
			<up-navbar leftIconColor="#fff">
				<template #center>
					<view class="flex-row items-center justify-center">
						<view class="" style="font-size: 34rpx; font-weight: 500">查询订单</view>
						<view
							@click="jumpVideo"
							class="flex-row justify-center items-center ml12"
							style="border: 2.2rpx solid #01bb74; height: 44rpx; width: 136rpx; border-radius: 8rpx; color: #01bb74; font-size: 22rpx"
						>
							<text class="mr6">使用方法</text>
							<up-icon name="https://res-oss.elist.com.cn/wxImg/video.png" size="20rpx"></up-icon>
						</view>
					</view>
				</template>
			</up-navbar>
			<!-- #endif -->
			<!-- #ifdef APP -->
			<up-navbar title="查询订单" leftIconColor="#fff" :placeholder="true"></up-navbar>
			<!-- #endif -->
			<view style="height: 44px"></view>
			<view class="pl30 pr30 pb30">
				<view class="pb60">
					<view class="flex-col mt20">
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
						<view class="flex-row items-center justify-between mt10" style="width: 100%">
							<view class="flex-row items-center flex-1">
								<text class="mr10" style="color: #999999">开始日期</text>
								<up-icon name="arrow-down-fill" size="10"></up-icon>
								<view
									@click="
										calendars.open();
										timeType = 1;
									"
									class="ml14"
									style="border: 1rpx solid #999999; padding: 6rpx; border-radius: 6rpx"
								>
									{{ date1 }}
								</view>
							</view>
							<view class="flex-row items-center flex-1">
								<text class="mr10" style="color: #999999">结束日期</text>
								<up-icon name="arrow-down-fill" size="10"></up-icon>
								<view
									@click="
										calendars.open();
										timeType = 2;
									"
									class="ml14"
									style="border: 1rpx solid #999999; padding: 6rpx; border-radius: 6rpx"
								>
									{{ date2 }}
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
									class="flex-col justify-center items-center text-center mr24 tages"
									@click="Filtrate('0')"
									:style="{
										backgroundColor: showTage == '0' ? '#01BB74' : '#F2FBF8',
										color: showTage == '0' ? '#ffffff' : '#01BB74'
									}"
								>
									联系人
								</view>
								<view
									class="flex-col justify-center items-center text-center mr24 tages"
									@click="Filtrate('1')"
									:style="{
										backgroundColor: showTage == '1' ? '#01BB74' : '#F2FBF8',
										color: showTage == '1' ? '#ffffff' : '#01BB74'
									}"
									style=""
								>
									联系号码
								</view>
								<view
									class="flex-col justify-center items-center text-center tages"
									@click="Filtrate('2')"
									:style="{
										backgroundColor: showTage == '2' ? '#01BB74' : '#F2FBF8',
										color: showTage == '2' ? '#ffffff' : '#01BB74'
									}"
								>
									{{ userStore.userRole == 'R' ? '收货地址' : '收货地址' }}
								</view>
							</view>
							<view class="flex-row mt20" style="width: 100%">
								<view
									class="flex-col justify-center items-center text-center tages"
									@click="Filtrate('3')"
									:style="{
										backgroundColor: showTage == '3' ? '#01BB74' : '#F2FBF8',
										color: showTage == '3' ? '#ffffff' : '#01BB74'
									}"
								>
									产品名称
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 按钮 -->
				<view class="flex-row justify-end mt40">
					<up-button
						color="#F4F4F4"
						type="info"
						@click="filterReset"
						shape="circle"
						size="medium"
						:customStyle="{
							width: '154rpx',
							color: '#999999',
							margin: '0 20rpx 0 0',
							height: '60rpx'
						}"
					>
						重置
					</up-button>
					<up-button color="#01BB74" @click="filterSubmit" shape="circle" size="medium" :customStyle="{ width: '154rpx', margin: 0, height: '60rpx' }">确定</up-button>
				</view>
				<!-- 日历选择器 -->
				<uv-calendars color="#01BB74" confirmColor="#01BB74" :startDate="getCurrentYearFirstDay()" :endDate="getCurrentDate()" ref="calendars" @confirm="date1Change" />
			</view>
		</up-popup>

		<!-- <up-tabbar :list="vuex_tabbar" active-color="#0FB076"></up-tabbar> -->

		<!-- <up-overlay
			:show="showMask"
			@click="
				showMask = false;
				password = '';
			"
		> -->
		<view class="flex-col justify-center items-center">
			<up-popup round="15" mode="center" :show="showMask" :customStyle="customStyle_pop_pwd">
				<view class="flex-col justify-center items-center relative" style="height: 100%; width: 100%">
					<view class="absolute pt20" style="width: 100%; top: 0; height: 75%">
						<view class="flex-row items-center justify-center passwordTitle">请输入签收密码</view>
						<view class="flex-col items-center justify-center mt20" style="width: 100%; height: 35%">
							<up-message-input
								active-color="#01BB74"
								:bold="false"
								@change="(e) => changeList(e)"
								@finish="finishList"
								:dot-fill="true"
								v-model="password"
								mode="box"
							></up-message-input>
							<!-- <up-code-input :bold="false" @change="(e) => changeList(e)" @finish="finishList" :dot="true" :modelValue="password" maxlength="4"></up-code-input> -->
							<view class="mt20 err" v-show="err">密码错误，请重新输入</view>
						</view>
						<view @click="goPath('/pages/subUser/resetpassword')" class="ft12 pr30 flex-row justify-end pt15" style="color: #999; width: 100%">找回密码</view>
					</view>
					<view class="flex-row items-center absolute u-border-top" style="width: 100%; bottom: 0; height: 25%">
						<view @click="close_mask" style="width: 50%; height: 100%" class="titlePas flex-col justify-center items-center">取消</view>
						<view @click="onsubmit(password)" style="width: 50%; height: 100%" class="titlePasOK flex-col justify-center items-center u-border-left">确认</view>
					</view>
				</view>
			</up-popup>
		</view>

		<!-- </up-overlay> -->
	</view>
</template>
<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useSystemStore } from '@/store/system';
import { useUserStore } from '@/store/user';
import { useGlobalStore } from '@/store/global';
import { setPinia } from '@/common/piniaHelper';
import { getCurrentInstance } from 'vue';
import { onLoad, onShow, onHide, onUnload, onPullDownRefresh, onShareAppMessage, onReady } from '@dcloudio/uni-app';
import { timeFormat } from '@/uni_modules/uv-ui-tools/libs/function/index.js';
const { proxy } = getCurrentInstance();

const systemStore = useSystemStore();
const userStore = useUserStore();
const globalStore = useGlobalStore();
const { vuex_tabbar } = storeToRefs(systemStore);

const paging = ref(null);

const timeType = ref(null);
const popTabCom = ref(null);
const calendars = ref(null);
const flushIndex = ref(systemStore.flush);

const tabHight = ref('100rpx');
const OrderQuantity = ref(0);
const OrderQuantitySum = ref(0);
const searchText = ref('');
const companyIndex = ref(0);
let tabsList = ref([
	{
		name: '全部'
	},
	{
		name: '待签收'
	},
	{
		name: '已签收'
	},
	{
		name: '已收款'
	}
]);

const labText = ref('确认收款');
const current = ref(0);
const dataList = ref([]);
const reload = ref(false);
const total = ref(0);
const current_page = ref(0);
const last_page = ref(1);
const status = ref('loadmore');
const loadText = ref({
	loadmore: '轻轻上拉',
	loading: '努力加载中',
	nomore: '实在没有了'
});
const scrollTop = ref(0);
const filterShow = ref(false);
const date1 = ref('');
const date2 = ref('');
const totalMoney = ref(0);
const show_start = ref(false);
const mode = ref('range');
const time = ref('');
const icon_search = ref('arrow-down-fill');
const showTage = ref('0');
const showOrderTage = ref('0');
const orderList = ref([]);
const orderListCopy = ref([]);
const customer = ref('');
const searchList = ref({
	dataStart: '',
	dataEnd: '',
	type: 0,
	customer: '',
	searchText: ''
});
const customStyle_pop_pwd = ref({
	width: '600rpx',
	height: '400rpx'
});
const realTimeSel = ref({
	bossNumberS: '',
	bossNumberE: '',
	staffNumberS: '',
	staffNumberE: '',
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
	kSiteE: '',
	contactsS: '',
	siteE: '',
	enterpriseDz: '',
	getPhone: '',
	inventoryName: '',
	limitS: '0,10',
	limitE: '25',
	page: 1,
	pageSize: 10
});

const pinia_user = storeToRefs(userStore).user;
const field = ref('');
const scrollTopCopy = ref(1156);
const refresh = ref(true);
const s = ref(0);
const e = ref(25);
const uloading = ref(true);
const sum = ref(0);
const type = ref(0);
const hide = ref(true);
const textKHGGS = ref('客户选择');
const showMask = ref(false);
const err = ref(false);
const password = ref('');
const delOrder = ref('');
const delOrderAll = ref({
	url: '',
	state: 0
});
const payOrder = ref('');
const payOrderState = ref(0);
const verifyPassword = ref({
	item: {},
	index: 0,
	type: 0
});
const onReachBottom = ref(false);
const virtualList = ref([]);
const bat64 = ref({
	dqs: 'data:image/png;base64,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',
	yqs: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANMAAABWCAYAAABVeqOyAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAzXSURBVHic7Z0xbBvnFcf/ZwVlkxKkkUFiBwouLA1FBJCA0kX0QHmo7AyNA6WA64XJEBtohiYBasNDbNkeXCuAbRRwgCRDyg6JC0SIp7ocqmgQPUUwBciTZEQQF0pLI4FJwwLCdXj6zOPdd8fj3X0fj/L7ARpEkd99PN3/3vve9947Az1QvGkewxCuGkAe9MMwzAGG3zcWb5l3DAPvqZwMwwwyvsQ0PW8+BlsihvHkSLc3FG+Zd8BCYpiueFqm4k2zaAzhG12TYZhBxtsyHcHrmubBMAOPp5gM4IyuiTDMoONtmQwc1TQPhhl4ugUgWEwM45NuYqppmQXDHAI8xWSymBjGN96WaR/XNM2DYQYeTzEtXTY2TRN3dU2GYQaZrhkQ+C+uAdhUPhOGGXC6imlpzvje3MfbOibDMINMd8sEYOmysWQamFM8F4YZaHyXYADA9Lz5HYBjaqbCMIONL8skMPcxrWoiDDPo9CSmpcvGJrt7DCOnJzdPwO4ewzjpyTIJ2N1jGCdDQT60+e9r3x/77RwMoBjxfBgLIyngywvAr38JvPwL4H/7wH9+CDZWLgt89hbwm18ByQTwsxeAH1o05iCQTAB/+T0wNgyMvhzP+Qdy8wTs7qmlNAWUCp2v/e6vQLPV+1jvngRmJ6MZKwpmJoBLpztf+8MnwPae/P3Hh4HPSp2vLawA9xbVzC8Igdw8Abt7apl9tfP3Wj3YxZ9M0MUbxVj9YmzY+VpjV/88vHghzIeXLhubxY/MOcOMR4Tv+DBwI0a1we/fd7/TdiOXJRFYKVeDjVUqRDdWv5CJqVbXPw8vQokJAJb+bFybnjffQgzcvWQCyKT7PYtosLt3ALl9fik/AlbrdIOxu3e9jmWl8gSorAX7bBiOS8S0fZgsk8Dcx7QxhO+iGIshq5TPOl/Pj/ofo/KExGRflwQZy8qqhzXIpJzuZGUNaAS0zoJkwmmZNnbi56ZGIqa4uXuDjswqBeHdk3L3SBUjaefca/XwYjo+7HRTvUTdLyIRExAPd6/ZAv7VBxcEIEsShYs5Oym3SkHG0SkklUjXS1v659GNyMQE9N/de7oDzD/sz7EvngZOhRRTJuW8szd2gfNlujN/caHzb+UqrY3syELqAAVErHf0XBa4c9bfmP2kMO587VBbJoDdvbBcfM3pztxbJIvbbNH6w7ommZmQr0mWN4DcaKeFK1edF+BqnfZqrAGKUiGadU5UJBNOS91sAX88GXzM6jpQ3Qg3LxmRigmIh7s3iMjcu1q9859ernaKKZOm3+2W5OkOsLrVHm953d3alKtAYazTRb19Fjj3afDvEiUyq5RMAKcmnK/7ZXtXjZhCbdq6EYfN3JFU54/9jh8nclkKFlhptoD5f3a+1thzhqXt0TPA6eblR+XvE8exCy2TDh46jxq3eccRJWKKQ6nGlxc6f8K4BaqR7QOVq3JX66uVzt8zaRKjQLZeSibIUrlRWXNmE8xM0Bqun8hcvDgTuZsnOHD3iuBk2K5ceUAX77sn6QJaXqe1jIynOxTJ2t4jN3B1i0SXTJCIZMIEaD125Wv3vZnyIxLixg6tpaIIaYdF9l02doDmT96fS/7cZV/q4HOqvpcyMQGAuY+3jSE8BrdZ7kpljRbGF093j0h+8I/O3zMpWud4hebzWeDTEnDroTwSVlnrT2aDFzIX78Ovu6dozU4CYzZPxM/nwqLEzRMc9N3jRpY+abbISvWys1+aopC5XUgbOxQKt7pvmTSFwoUFjDM5l307P3tn9s81W+qFBCgWEwAsXTLugvvuRU4uC3xxXr6ftLBCe1OrdeCD+yQsK7OTJMDSVHxF5ZYFckIS3bOTs62z7N9fFcrFBAAm2DpFRSZF+XZ3JG5ds0VunLXGp7FHgrKvwcQaK46implwDzzYhSLDfl6eahKT0jXTM37EA7yEz7Uc65AisiPcQsW1OoXSZYvrZosEVtsCLtk2hp8FLl4FFr4l0fUzgTSZ8A7LZ9KUq+cmEFnpiq7UIy1iWpozvi/Om0v9LHM/Ma421Kuq9COXJbfMzb1p7JIA3KJ/VqobwLlP5FE/q6hqWzReP1J2SoXu5zKfdReTbE2l63vosUzEpsZjOUgmgpcd6CaTonSg0pT3hVVZc9+PckNYqeV1unDt7lQyQcI9Md5OYVpe13NBvjkpD4fb06hmJ91vHvaMCZ0VxfrEZGATprajDRxCQDOvdBe9uDhyWQqJh6WxKxdtMkEX7uwkHVOISuxzRY3soq/VaR1oje6JjWq7wGV1T16b1VGj0zIxLlw67S9tprZFm6szE5SbFlXQ4NynNKbXwl/kw52aAN4pqxGTKJ+xRvJEMGW13in4UxNOMRXGJeslja6qPjGZ/U18beyqPbFh6pm+WvEWU2WNLjRx8ajIVxObtrms3P0T3FtUGx0rP2on8FqPZT9HMxNOF9d+Xpotves+bWIygLyuY8mo1dXWOoWpZ3q6QxeG9Y7c2KULQbYmarbUdeYRe1PCxbOWcnilOUVJuUrf0Xqspzu0X2R143KjQOPAmslcPN0ZHVrEVJwzj6LPYoo7wn3b2DlILfIoEfh4kX5U8iyb/BFl3Z8Y13dxNvbk/fAWVjp7WpSm2nOanXS6eMvr6uYoQ49lehFvaTlOH5l/GN7yRVVDdHyYImO9RvpmJtoW0cr2nh6L1I3VLRK5EI1wB+3RPuAgCVhzaF+LmAwDf9JxnMOK2LCt1b2tQy5Ld26xdhtJOZNiu30WaEfu/t6jGP2SSQXrT9HYo2Rgq3BKU5QNbl+vVjVbJUCDmIq3zPfAVbeBsGc9FMbbJRcytm0hblEU6Mc9s24Ki72mKF3JTIrmXxgLt98nqza+9Frne8T+mG6U5uYVb5rHDANXVR7jsGPNRUsmqC7JDVklrp+KWVn75IVve9/slIXqZyep9OOLC5StHnbjXPYd7ccNMvcoUComYwif4zmvZcplgyeSNvacJeX5rHdo3N72WKwrvJAt3oOskWSu24nx6FuOebV2tkcBdaJMTAfuXVHV+INCJt3Ozr59li7sXoRVWXOWEJSm3PMMpX0iXnEfP5lwPiCgstb7nT2Tco6jCtl3FPTLKgGKxMTuXRtx0Yt+BpdO+ysjsHLla9uYks6pVux37vyovFc3ILdKQRp5Xjzt7yaxvE7pQbdCRj7dwt7LCroO+UWJmNi9azMi2cjttVjNrSuRl3Wylx28KUkglVmloCHlyhP3v23skHjOfUKVxGGDA5mUs5uT4MaZ/tVmRS4mdu86kaXlBMlrk60TvKyT/eKW9Z+TWaWgj5qxdzgSEbV3ylT1G1Vjy2QCuP6Ge+pWJk1/7weRiondu05kj7gJmgbUkGycelkn+z5L86fO98rWOJW1cBudQlDlKnD+b2SNoszjSyZo3dktoJHPktupm0j3meLs3vWjB5ysNidMsu3Ct+0xG7sU6XO724uNV0CenqTiAWgiWVbVRu/1N5xCEhbQfq5Fx1edvecjE1Pc3Dt7jU5+lP4hunrBuUW3wtz5G3vtFCE/644rD+Sv5yTh9YWV8OdG1bn1amV2b/Eg+viT0+09NUGf8eoXGCWRiKk4b+YN4E4UY0WFrODt9lm6aGr1zkaGUdTmjBxYvkya9lYKY847f7MVPs0l7BMqkgnnA9Carfg+ltPanNNOudq+qZQfUcTSXt4v+gV++EB9Y5VIxGQgfs1SKk+cu+2ZtHsUSAdeeyCFMT3PUzo+LF/HuXWCtaPrCRndGsjIHn0z/5C+m/08ZtL0pPZyVW3DmNBiKn5kXoUZv/KKylr3Hgo6EY1P3CiMh3uyQxjGhv0LWXXbZPEoT69I5b1F+blstqgW6/ob8iiqEKdbV9uwhIrmFefNfJyfxfTB/eDRsyhp7NJc4vYM1jhSGHcXUmOXutR63ZSEoNzek0mru8GGskxxdO+sNPZoj8NeMaqLjR36p8ath3ecWVihAIl97ePVF1DGvUUSn92tFwELFQQWU/GWeQcDUD1rrRhNJigjIZOiJyUA0YbMxT+6sUuL3V4sURwfKyljW4Ol/3iR3M5Muh0cCZK8KoJNN87QWH77CwbFCPKh4k2zaAzhm6gnwzw/FMacVuP9++3IqghA9Fot7EZpSn232p7FVJwzjxov4TG44I9hOug9APEiroKFxDAOerJM7N4xjDu+xcTuHcN449/NY/eOYTzxZZnYvWOY7nQVE7t3DOOP7m4eu3cM4wtPy8TuHcP4x9syHcHrmubBMAOPp5gM4IyuiTDMoONtmQxeKzGMX5S2R2aY54luYqppmQXDHAI8xWSymBjGN96WaR/XNM2DYQYeTzEtXTY2TRN3dU2GYQYZX7l50/PmYwxAiTrD9BNf0TzzR0yzhWIYb3ouDsQRvG4AZ3gPimE6+T9ojosxKwLzPgAAAABJRU5ErkJggg==',
	ysk: 'data:image/png;base64,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',
	dqss: 'data:image/png;base64,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',
	yfk: 'data:image/png;base64,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',
	bz: 'data:image/png;base64,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',
	lock: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAABBCAYAAACO98lFAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAPtSURBVHic7ZtPkptWEMa/fiMxy5Ab4BNkMtpkF+YEdk5gXAWUlvEJPFpmNZ6dClEVsswqzgmMd1lMaZQTBN9Aa0bTnQ1yITSyQDzAdr3fSjyg6fro968bAQaDwWDYgfp+4HQ6dZj5gpkdpdR3ROSIyJqZPyqlsjzP0yRJ1n361JsIQRB4RPQcwItj14pIKiKzzWaz6kOQzkXwfd9VSv0OwDnh9oyZX8VxnOr1apfORPA8zz4/P78REe8zl61EZE1EDj4v0ts8z2ddRUUnInieZ1uW9R7AReVURkQpEc3m83lWva+Imp8B/ArArpxe5Xl+1YUQ2kUoBr732H+z11EUzeraCcPwDfbFyJRSV08J2Aal0xgAMPNf2BUgU0o9ayIAAERRNFNK/QggKzVvBdaKVhHCMLzBbhdo9ebm83mmlLpCRYgiSrShrTsU/bn8lrSFbjHG3KMUYcx8pWvW0BYJRLTzdkTkF119N0mSdRERnyimXS2c6TBSRMF1qel6sVj8qcP2lru7u/VkMgEAt2iyLy8vPy6Xy1Vb21oioRIF6zzPb3XYrVIMrlmp6aUOu61F8H3fJSK31PS246Vusv1BRG4QBNW1SGN0RELZic6iYItS6o/ysYi4rW22NVBsigAAItL5hmc+n2cikj71/FNpJYLneTYRfYoEIkrbOlSH8nMqXfEk2kaCjdKylpk/tLRXi+pz2o4LrUQYjUZO+Xiz2WRt7NWl+hwRqW62GtFKhGILXKaXjFCSJNkRPxrRaNlcrNlfYH+L/CWxAvAuz/PbuoN0LRGeWrt/BdTeu9TqDpZlnZoeGxJHRGrtNkfHLvA8z8ZucjRj5lsi6jUjXAcRsZVSL1F01yK19+rYfUdFGI/HTvm4j8RnG4IgSInofnvs+757zN+j3aE6/fQ1DZ7Kw8ND4wjVnl77GjEiwIgAwIgAoMbs0BXT6dQRkTdFYTY7VJDpg0EioSjQ3IuIR0SuiHjMfD+dTp0h/BlEBGa+wX6ZzS7ae2eoMeHQBszp04ktg4ggItmBU4faO2UoEZ6sSzJzp0naQwwiQhzHKTOXa4xrnWW1pgy2TojjON12CxFZDbkpM4slGBEAGBEADCwCEa0AQET+HtKPwfYOABBF0WsAr4f0ATDdAYARAYARAYARAYARAYARAYARAYARAUANEao1x/F47HbmjQYsy9rJWtWpmNUqzYdh+B92U18rEfniCrLA3jdM6yiKvj92T61lMzPfKqXKSdALot7/PtUYZq71ZX2tz3qXy+U/k8nEBvBTK6/65XqxWPxW58JGr9P3fRfAxdnZ2Q+neNUHj4+P/45Go3dDFXIMBoPhm+B/b5qTk/hRUuYAAAAASUVORK5CYII=',
	copy: 'https://res-oss.elist.com.cn/wxImg/list/copy.svg'
});
const Title = ref('条件筛选');
const OperatingSystem = ref(false);
const startX = ref(0);
const startY = ref(0);
const uNoticeBarlist = ref(['请及时完成2024年订单收款，逾期将无法处理；跨年后，可前往更多功能-往年数据处查看往年订单。']);
const bottomSafeArea = ref(0);
const isFromSwitchTab = ref(false);
watch(
	() => systemStore.flush,
	(newVal) => {
		flushIndex.value = newVal;
		paging.value?.refresh();
	}
);

// 页面首次加载
onLoad(() => {
	proxy.$getModel((value) => {
		tabHight.value = value || '100rpx';
	});
	OperatingSystem.value = getOperatingSystem();
	console.log('userStore.userRole11111111111111111', userStore.userRole);
	if (userStore.userRole == 'R') {
		tabsList = ref([
			{
				name: '全部'
			},
			{
				name: '待确收'
			},
			{
				name: '已签收'
			},
			{
				name: '已付款'
			}
		]);
	} else {
		tabsList = ref([
			{
				name: '全部'
			},
			{
				name: '待签收'
			},
			{
				name: '已签收'
			},
			{
				name: '已收款'
			}
		]);
	}
	console.log('OperatingSystem:', OperatingSystem.value);
});
uni.$on('switchTabToList', (e) => {
	console.log('1监听到isFromSwitchTab');
	isFromSwitchTab.value = true;
});
// 页面进入展示
onShow(() => {
	refresh.value = true;

	nextTick(() => {
		if (globalStore.tabIndex > 0) {
			current.value = globalStore.tabIndex;
		} else {
			current.value = 0;
		}
		console.log(userStore.user.phone);
		if (userStore.user.phone) {
			// 根据标记判断来源
			if (isFromSwitchTab.value) {
				const date = new Date();
				date.setDate(date.getDate() + 15);
				date1.value = uni.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
				date2.value = uni.$u.timeFormat(date, 'yyyy-mm-dd');
				realTimeSel.value.startDate = date1.value;
				realTimeSel.value.endDate = date2.value;
				realTimeSel.value.phoneE = '';
				realTimeSel.value.organizationE = '';
				realTimeSel.value.enterpriseS = '';
				realTimeSel.value.takeE = '';
				realTimeSel.value.enterpriseDz = '';
				realTimeSel.value.inventoryName = '';
				realTimeSel.value.kTakeE = '';
				realTimeSel.value.kPhoneE = '';
				realTimeSel.value.kSiteE = '';
				customer.value = '';
				field.value = '';
				Title.value = '条件筛选';
				console.log('通过 uni.switchTab 进入当前 TabBar 页面');
			}

			useInitPage(realTimeSel, searchList, paging, date1, date2, tabsList.value, customer, current);

			popTabCom.value?.getMessNum();

			loadData();
			// paging.value?.reload();
		} else {
			uni.$u.toast('登录查看更多');
		}
	});
});

onReady(async () => {
	// current.value = 0;
});

// 页面隐藏（如切后台）
onHide(() => {
	ClearIF();
});

// 页面销毁
onUnload(() => {
	// 页面卸载逻辑，如清理定时器等
});

// 下拉刷新
onPullDownRefresh(() => {
	console.log('下拉');
});

// 分享页面逻辑
onShareAppMessage((ops) => {
	const store = useUserStore();
	const pinia_user = store.user;
	const pinia_userRole = store.userRole;
	if (ops.from === 'button') {
		if (ops.target.dataset.name == 'shareFriend') {
			// 邀请成为供应商
			let title = '',
				imageUrl = '';
			if (pinia_userRole == 'D') {
				title = '邀请您成为他的客户~';
				imageUrl = 'https://res-oss.elist.com.cn/wxImg/message/shareD.png';
			} else {
				title = '邀请您成为他的供应商~';
				imageUrl = 'https://res-oss.elist.com.cn/wxImg/message/shareR.png';
			}
			var phone = pinia_user.data.work == '0' ? pinia_user.phone : pinia_user.workData.bossNumber;
			return {
				title: title,
				path: '/pages/subMessage/friend_apply_for/shareFriend?phone=' + phone + '&invitationRole=' + pinia_userRole,
				imageUrl: imageUrl
				// imageUrl: 'https://res-oss.elist.com.cn/wxImg/message/share.png'
			};
		} else {
			// 分享订单
			const pid = ops.target.dataset.id;
			const pThumb = ops.target.dataset.thumb;
			const phone = userStore.user.phone;
			const port = userStore.userRole;
			const versions = ops.target.dataset.versions;
			console.log('分享参数：', `share_id=${pid}&&type=1&&phone=${phone}&&port=${port}&&versions=${versions}`);
			return {
				title: '您有一张订单待确认~',
				path: `/pages/subOrder/detailsShare?share_id=${pid}&&type=1&&phone=${phone}&&port=${port}&&versions=${versions}`,
				imageUrl: pThumb
			};
		}
	} else {
		return {
			title: '打开易单据小程序，极速管理您的货单~',
			path: '/pages/index/index',
			imageUrl: '/static/share.png'
		};
	}
});

function useInitPage(realTimeSel, searchList, pagingRef, date1, date2, tabsList, customer, current) {
	const store = useUserStore();
	const global = useGlobalStore();
	const pinia_user = store.user;
	const pinia_userRole = store.userRole;
	const hide = true;
	const password = '';
	// console.log('current.value', current.value);
	// if (Number(current.value) > 0) {
	// 	realTimeSel.value.paymentState = Number(current.value) - 1;
	// } else {
	// 	realTimeSel.value.paymentState = '';
	// }

	realTimeSel.value.getPhone = pinia_user.phone;

	const ifwork = pinia_user.data?.work === '0';
	const ifWorkPort = pinia_userRole === 'R';
	const timeEmp = !realTimeSel.value.startDate || !realTimeSel.value.endDate;
	// 设置 tab 名字与按钮文案
	if (ifWorkPort) {
		tabsList[1].name = '待确收';
		tabsList[3].name = '已付款';
	} else {
		tabsList[3].name = '已收款';
		tabsList[1].name = '待签收';
	}

	// 设置发货/收货端身份参数
	if (ifwork) {
		if (!ifWorkPort) {
			realTimeSel.value.bossNumberE = '';
			realTimeSel.value.bossNumberS = pinia_user.phone;
		} else {
			realTimeSel.value.bossNumberS = '';
			realTimeSel.value.bossNumberE = pinia_user.phone;
		}
	} else {
		const identity = pinia_user.workData.identity;
		const boss = pinia_user.workData.bossNumber;

		if (!ifWorkPort) {
			realTimeSel.value.staffNumberE = '';
			realTimeSel.value.bossNumberE = '';
			if (identity === '4') {
				realTimeSel.value.staffNumberS = pinia_user.phone;
				realTimeSel.value.bossNumberS = boss;
			} else {
				realTimeSel.value.bossNumberS = boss;
			}
		} else {
			realTimeSel.value.staffNumberS = '';
			realTimeSel.value.bossNumberS = '';
			if (identity === '4') {
				realTimeSel.value.staffNumberE = pinia_user.phone;
				realTimeSel.value.bossNumberE = boss;
			} else {
				realTimeSel.value.bossNumberE = boss;
			}
		}
	}
	console.log('realTimeSel33333333333', realTimeSel);
	// 设置默认时间
	if (!isFromSwitchTab.value) {
		if (timeEmp) {
			const start = proxy.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
			const endDate = new Date();
			endDate.setDate(endDate.getDate() + 15);
			const end = proxy.$u.timeFormat(endDate, 'yyyy-mm-dd');
			realTimeSel.value.startDate = start;
			realTimeSel.value.endDate = end;
			date1.value = start;
			date2.value = end;
		}
	}

	// 公司名缓存还原
	const resJson = uni.getStorageSync('companyNameJSON');
	if (resJson) {
		const json = JSON.parse(resJson);
		searchList.customer = json.company;
		customer.value = json.company;
		if (!ifWorkPort) {
			realTimeSel.value.organizationE = json.company;
		} else {
			realTimeSel.value.enterpriseS = json.company;
		}
		pagingRef.value?.reload();
		uni.removeStorageSync('companyNameJSON');
		return;
	}

	if (pinia_userRole === 'R') {
		tabsList[tabsList.length - 1].name = '已付款';
	}
	// console.log('globalStore.tabIndex3', globalStore.tabIndex, vuex_tabIndex, realTimeSel.value.paymentState);

	if (isFromSwitchTab.value) {
		pagingRef.value?.reload(); //重新加载
		console.log('通过 uni.switchTab 进入当前 TabBar 页面');
	} else {
		pagingRef.value?.refresh(); //保留数据重新加载
		console.log('从子页面返回当前 TabBar 页面');
	}
	// 每次 onShow 后重置标记（避免下次误判）
	isFromSwitchTab.value = false;
}

function loadData() {
	proxy.$loadUser(this);
}

function jumpVideo() {
	const port = userStore.userRole === 'D';
	proxy.$openVideo(port ? 3 : 4);
}

function touchStart(e) {
	startX.value = e.touches[0].pageX;
	startY.value = e.touches[0].pageY;
}

function changeList(e) {
	console.log('输入的值', e);
	password.value = e;
}

function finishList(e) {
	password.value = e;
}
function close_mask() {
	showMask.value = false;
	password.value = '';
}

function touchMove(e) {
	const moveEndX = e.touches[0].pageX;
	const moveEndY = e.touches[0].pageY;
	const diffX = moveEndX - startX.value;
	const diffY = moveEndY - startY.value;
	if (Math.abs(diffX) > Math.abs(diffY)) {
		if (diffX > 60 || diffX < -60) {
			xyTabar(diffX);
		}
	}
}

function xyTabar(x) {
	if (x > 0) {
		current.value++;
	} else {
		current.value--;
	}
	paging.value?.reload();
	console.log('点击切花');
	let num = current.value === 0 ? '' : current.value - 1;
	setPinia({
		global: {
			tabIndex: num
		}
	});
	// realTimeSel.value.paymentState = current.value === 0 ? '' : current.value - 1;
	realTimeSel.value.limitS = '0,10';
	refresh.value = true;
	refreshDataNew();
}

function getOperatingSystem() {
	const systemInfo = uni.getSystemInfoSync();
	bottomSafeArea.value = systemInfo.safeAreaInsets ? systemInfo.safeAreaInsets.bottom : 0;
	if (systemInfo.system.toLowerCase().includes('ios')) {
		return true;
	}
	if (systemInfo.system.toLowerCase().includes('android')) {
		return false;
	}
}

function TitleFun(showTage) {
	Title.value =
		showTage == '0'
			? '联系人'
			: showTage == '1'
			? '联系号码'
			: showTage == '2'
			? userStore.userRole === 'R'
				? '收货地址'
				: '收货地址'
			: showTage == '3'
			? '产品名称'
			: '条件筛选';
}

const refreshDataNew = async () => {
	uloading.value = true;
	if (refresh.value) {
		refresh.value = false;
		onReachBottom.value = false;
		realTimeSel.value.role = userStore.userRole === 'R' ? '1' : '0';
		console.log('globalStore.tabIndex', globalStore.tabIndex);
		// if (globalStore.tabIndex != '') {
		// 	realTimeSel.value.paymentState = Number(globalStore.tabIndex) - 1;
		// }
		console.log('realTimeSel.value.paymentState', current.value);
		if (current.value != '') {
			realTimeSel.value.paymentState = Number(current.value) - 1;
		} else {
			realTimeSel.value.paymentState = '';
		}
		console.log('111', realTimeSel);
		const res = await proxy.$api.order.getFilteredOrders(realTimeSel.value);
		if (res.data.code == 200) {
			const orderListData = res.data.data.map((obj) => ({
				...obj,
				share: false
			}));
			paging.value?.complete(orderListData);
			totalMoney.value = orderListData.reduce((total, obj) => total + obj.price, 0);
			// refresh.value = true;
			onReachBottom.value = true;
			uloading.value = false;
		} else {
		}
		// .then((res) => {
		// 	const orderListData = res.data.data.map((obj) => ({
		// 		...obj,
		// 		share: false
		// 	}));
		// 	paging.value?.complete(orderListData);
		// 	totalMoney.value = orderListData.reduce((total, obj) => total + obj.price, 0);
		// 	refresh.value = true;
		// 	onReachBottom.value = true;
		// 	uloading.value = false;
		// })
		// .catch(() => {
		// 	// paging.value?.complete(false);
		// 	refresh.value = true;
		// });
		const res1 = await proxy.$api.order.getFilteredOrderCount(realTimeSel.value);
		// .then((res) => {
		// 	OrderQuantity.value = res.data.data[1];
		// 	OrderQuantitySum.value = res.data.data[0];
		// })
		// .catch(() => {
		// 	refresh.value = true;
		// });
		if (res1.data.code == 200) {
			if (OrderQuantity.value != res1.data.data[1]) {
				OrderQuantity.value = res1.data.data[1];
			}
			if (OrderQuantitySum.value != res1.data.data[0]) {
				OrderQuantitySum.value = res1.data.data[0];
			}
			// OrderQuantity.value = res1.data.data[1];
			// OrderQuantitySum.value = res1.data.data[0];
		} else {
			// refresh.value = true;
		}
		setTimeout(() => {
			refresh.value = true;
		}, 3000);
	}
};

function changeTab(item) {
	console.log('item', item);
	paging.value?.reload();
	current.value = item.index;
	setPinia({
		global: {
			tabIndex: item.index === 0 ? '' : item.index
		}
	});
	// realTimeSel.value.paymentState = item.index === 0 ? '' : item.index;
	realTimeSel.value.limitS = '0,10';
	refresh.value = true;
	paging.value?.reload();
}

function CustomerGetChange(e) {
	const ifWorkPort = userStore.userRole === 'R';
	const changeText = e;

	if (!ifWorkPort) {
		realTimeSel.value.organizationE = changeText;
	} else {
		realTimeSel.value.enterpriseS = changeText;
	}
	paging.value?.reload();
}

function CustomerGet() {
	if (pinia_user.value.phone != undefined) {
		hide.value = false;
		uni.navigateTo({
			url: '/pages/subOrder/table?show=0'
		});
	} else {
		proxy.$u.toast('登录查看更多');
	}
}
function addOrder() {
	if (pinia_user.value.phone != undefined) {
		uni.navigateTo({
			url: '/pages/subOrder/add'
		});
	} else {
		uni.navigateTo({
			url: '/pages/subUser/login'
		});
	}
}
function filtrateGet() {
	show_start.value = true;
}
function Filtrate(type) {
	field.value = '';
	realTimeSel.value.kTakeE = '';
	realTimeSel.value.kPhoneE = '';
	realTimeSel.value.kSiteE = '';
	realTimeSel.value.inventoryName = '';
	showTage.value = type;
	TitleFun(type);
	paging.value?.reload();
}

function virtualListChange(vList) {
	orderList.value = vList;
}

function date1Change(e) {
	if (timeType.value == 1) {
		date1.value = e.fulldate;
	} else {
		if (!date1.value) {
			return uni.$u.toast('请先选择开始时间');
		} else if (new Date(e.fulldate).getTime() < new Date(date1.value).getTime()) {
			return uni.$u.toast('开始日期不能大于结束日期~');
		}
		date2.value = e.fulldate;
	}
	// 不是区间取 e.fulldate
}
function getCurrentYearFirstDay() {
	const date = new Date();
	const year = date.getFullYear();
	const month = ('0' + (date.getMonth() + 1)).slice(-2);
	const day = ('0' + date.getDate()).slice(-2);
	return `${year}-01-01`;
}

const queryList = async (pageNo, pageSize) => {
	if (userStore.user.phone) {
		realTimeSel.value.page = pageNo;
		realTimeSel.value.pageSize = pageSize;
		await refreshDataNew();
	} else {
		console.log('请登录');
		paging.value?.complete([]);
	}
};

function clear() {
	setPinia({
		global: {
			tabIndex: ''
		}
	});
	const date = new Date();
	date.setDate(date.getDate() + 15);
	current.value = 0;
	realTimeSel.value.paymentState = '';
	date1.value = uni.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
	date2.value = uni.$u.timeFormat(date, 'yyyy-mm-dd');
	showTage.value = '0';
	realTimeSel.value.startDate = date1.value;
	realTimeSel.value.endDate = date2.value;
	realTimeSel.value.phoneE = '';
	realTimeSel.value.organizationE = '';
	realTimeSel.value.enterpriseS = '';
	realTimeSel.value.takeE = '';
	realTimeSel.value.enterpriseDz = '';
	realTimeSel.value.inventoryName = '';
	realTimeSel.value.kTakeE = '';
	realTimeSel.value.kPhoneE = '';
	realTimeSel.value.kSiteE = '';
	customer.value = '';
	field.value = '';
}

function filterReset() {
	const date = new Date();
	date.setDate(date.getDate() + 15);
	date1.value = uni.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
	date2.value = uni.$u.timeFormat(date, 'yyyy-mm-dd');
	showTage.value = '0';
	realTimeSel.value.startDate = date1.value;
	realTimeSel.value.endDate = date2.value;
	realTimeSel.value.phoneE = '';
	realTimeSel.value.organizationE = '';
	realTimeSel.value.enterpriseS = '';
	realTimeSel.value.takeE = '';
	realTimeSel.value.enterpriseDz = '';
	realTimeSel.value.inventoryName = '';
	realTimeSel.value.kTakeE = '';
	realTimeSel.value.kPhoneE = '';
	realTimeSel.value.kSiteE = '';
	customer.value = '';
	field.value = '';
	Title.value = '条件筛选';
	paging.value?.reload();
}

function filterSubmit() {
	show_start.value = false;
	const date = new Date();
	date.setDate(date.getDate() + 15);
	realTimeSel.value.startDate = date1.value || uni.$u.timeFormat(new Date(new Date().getFullYear(), 0, 1), 'yyyy-mm-dd');
	realTimeSel.value.endDate = date2.value || uni.$u.timeFormat(date, 'yyyy-mm-dd');
	paging.value?.reload();
}

function VerifyAdd(item, index, type) {
	err.value = false;
	const pas = userStore.user.password;
	console.log('userStore', userStore);
	// if (!pas) {
	// 	uni.showModal({
	// 		title: '暂无签收人，是否去添加？',
	// 		showCancel: true,
	// 		cancelText: '取消',
	// 		confirmText: '去添加',
	// 		success: (res) => {
	// 			if (res.confirm) {
	// 				uni.navigateTo({
	// 					url: '/pages/subPack/user/signee/add'
	// 				});
	// 			}
	// 		}
	// 	});
	// 	return;
	// }

	if (type === 1) {
		let tips = '是否确认删除该单据，删除后该单据将从单据列表中移除？';
		if (userStore.userRole === 'D' && item.paymentState !== '0') {
			tips = '是否确认向收货方申请删除该单据，需要对方同意后单据才会被删除？';
		} else if (userStore.userRole === 'R') {
			tips = '是否确认向发货方申请删除该单据，需要对方同意后单据才会被删除？';
		}
		uni.showModal({
			title: '温馨提醒',
			content: tips,
			showCancel: true,
			cancelText: '取消',
			confirmText: '确定',
			success: (res) => {
				if (res.confirm) {
					// showMask.value = true;
					onsubmit();
				}
			}
		});
	}

	if (type === 2 || type === 3) {
		const isReceiver = userStore.userRole === 'R';
		const title = type === 2 ? (isReceiver ? '确认付款提示' : '确认收款提示') : '修改提醒';
		const content = type === 2 ? (isReceiver ? '是否向发货方申请确认付款该单据' : '是否确认收货方已支付该单据') : '是否确认修改该单据？';
		uni.showModal({
			title,
			content,
			showCancel: true,
			cancelText: '取消',
			confirmText: '确定',
			success: (res) => {
				if (res.confirm) {
					// showMask.value = true;
					onsubmit();
				}
			}
		});
	}

	verifyPassword.value = {
		item,
		index,
		type
	};
}

function onsubmit(passwordInput) {
	// console.log('面膜', passwordInput);
	// const storedPass = userStore.user.password;
	const { type, item, index } = verifyPassword.value;
	// console.log('雷系', type);

	// if (storedPass === passwordInput) {
	// 	if (type === 1) deleteOrder(item, index);
	// 	else if (type === 2) payment(item);
	// 	else compile(item);
	// } else {
	// 	err.value = true;
	// 	uni.$u.toast('密码验证失败');
	// 	password.value = '';
	// 	return;
	// }
	if (type === 1) deleteOrder(item, index);
	else if (type === 2) payment(item);
	else compile(item);
	password.value = '';
	verifyPassword.value = {
		item: {},
		index: 0,
		type: 0
	};
	// showMask.value = false;
}

function verifyPasswordAdd(item, index, type) {
	verifyPassword.value = {
		item,
		index,
		type
	};
}

function deleteOrder(order, index) {
	console.log('删除订单', order);
	console.log('删除订单', index);
	const aPhone = userStore.user.phone;
	const workif = userStore.work === 'N';
	const ifOne = order.bossNumberE === order.staffNumberE;
	const ifPort = userStore.userRole === 'D';
	const stateOrder = order.paymentState === '0';
	let url = '';
	let dx = {
		aUser: aPhone,
		bUser: '',
		orderNumber: order.orderNumber,
		orderId: order.id,
		createTime: '',
		updateTime: '',
		state: 1,
		aBoss: workif ? aPhone : userStore.user.workData.bossNumber,
		bBoss: '',
		port: userStore.userRole,
		orderState: order.paymentState,
		aName: userStore.user.data.name || aPhone || '',
		genre: 'D'
	};

	if (ifOne) {
		dx.bBoss = order.bossNumberE;
		dx.bUser = order.bossNumberE;
	} else {
		dx.bBoss = order.bossNumberE;
		dx.bUser = order.staffNumberE;
	}

	if (ifPort) {
		if (stateOrder) {
			url = 'order/del';
			dx = order;
			proxy.$api.order.delOrder(dx).then((res) => {
				finallyAlertDel(res.data, order);
			});
		} else {
			proxy.$api.order.addTemporaryOrder(dx).then((res) => {
				finallyAlertDel(res.data, order);
			});
		}
	} else {
		dx.bBoss = order.bossNumberS;
		dx.bUser = order.staffNumberS;
		proxy.$api.order.addTemporaryOrder(dx).then((res) => {
			finallyAlertDel(res.data, order);
		});
	}
	console.log('地址', url);
	console.log('地址', dx);

	totalMoney.value = orderList.value.reduce((total, obj) => total + obj.price, 0);
}

function payment(order) {
	const isReceiver = userStore.userRole === 'R';
	const thisPhone = userStore.user.phone;

	if (isReceiver) {
		applyUpdatePlay(order);
	} else {
		order.paymentState = '2';
		order.signaturePhone = thisPhone;
		updateOrder(order);
	}
}

function applyUpdatePlay(order) {
	const aPhone = userStore.user.phone;
	const workif = userStore.user.data.work === '0';
	const dx = {
		aUser: aPhone,
		bUser: order.bossNumberS,
		orderNumber: order.orderNumber,
		orderId: order.id,
		createTime: new Date().getTime(), //时间戳
		updateTime: '',
		state: 1,
		aBoss: '',
		bBoss: '',
		port: userStore.userRole,
		orderState: order.paymentState,
		aName: userStore.user.data.name || aPhone || '',
		genre: 'P'
	};

	if (workif) {
		dx.aBoss = aPhone;
		dx.bBoss = order.bossNumberS;
		dx.bUser = order.staffNumberS;
	} else {
		const identity = userStore.user.workData.identity;
		const boss = userStore.user.workData.bossNumber;
		dx.aBoss = boss;
		dx.bBoss = order.bossNumberS === order.staffNumberS ? order.bossNumberS : order.staffNumberS;
	}
	console.log('333');
	proxy.$api.order
		.addTemporaryOrder(dx)
		.then((res) => finallyAlertDel(res.data, order))
		.catch(() => {});
}

function ifZX(val) {
	return val.includes('zx-');
}

function updateOrder(order) {
	console.log('444');
	proxy.$api.order
		.signForOrder(order)
		.then((res) => {
			uni.$u.toast(res.data.message);
			paging.value?.reload();
		})
		.catch(() => {
			uni.$u.toast('确认失败~');
			paging.value?.reload();
		});
}

function searchListenner(e) {
	const store = useUserStore();
	const pinia_user = store.user;
	const pinia_userRole = store.userRole;
	const filterIndex = showTage.value;
	const ifWorkPort = pinia_userRole.value === 'R';

	if (filterIndex === '0') {
		realTimeSel.value.kTakeE = field.value;
		// 收货人（发货、收货都写入同字段）
	}

	if (filterIndex === '1') {
		realTimeSel.value.kPhoneE = field.value;
		// 电话
	}

	if (filterIndex === '2') {
		realTimeSel.value.kSiteE = field.value;
		// 地址
	}

	if (filterIndex === '3') {
		realTimeSel.value.inventoryName = field.value;
		// 产品名称
	}

	type.value = 1;
	paging.value?.reload(); // 相当于 this.$refs.paging.reload()
}

function finallyAlertDel(resData, order) {
	uni.$u.toast(resData.message);
	password.value = '';
	if (resData.data === 1) {
		flushDBSX(order);
		paging.value?.refresh();
	}
}

function flushDBSX(val) {
	var list = [val.bossNumberS, val.staffNumberS, val.bossNumberE, val.staffNumberE];
	proxy.$inform(this, list);
}

function copyBtn(val) {
	uni.setClipboardData({
		data: val,
		success: () => {
			uni.$u.toast('单号已复制');
		}
	});
}

function shareNY(item, i) {
	item.share = i === 1;
}

function compile(item) {
	uni.navigateTo({
		url: `/pages/subOrder/addCompile?orderId=${item.id}`
	});
}

function remark(item) {
	goPath(`/pages/subList/remark?item=${JSON.stringify(item)}`);
	hide.value = false;
}

function ClearIF() {
	if (hide.value) {
		clear();
		paging.value?.reload();
		realTimeSel.value.limitS = '0,10';
		Title.value = '条件筛选';
	}
}

function getCurrentDate() {
	const date = new Date();
	date.setDate(date.getDate() + 15);
	const year = date.getFullYear();
	const month = ('0' + (date.getMonth() + 1)).slice(-2);
	const day = ('0' + date.getDate()).slice(-2);
	return `${year}-${month}-${day}`;
}
</script>

<style scoped lang="scss">
.root {
	height: 100vh;
	width: 100vw;
	background: #f5f5f5;
	overflow-y: auto;
	align-items: center;
	position: relative;

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
				height: 62rpx;
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

.title {
	color: $u-type-primary;
	text-align: center;
	padding: 20rpx 0 0 0;
}

.order-item {
	border-radius: 20rpx;
	box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.03);
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
		opacity: 0.8;
	}
}

.hl-btn.bg-gray {
	border: 2rpx solid #d8d8d8;
}

.hl-btn.NY.bg-gray {
	border: 2rpx solid #d8d8d8;
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
	color: #01bb74;
	font-size: 36rpx;
	font-weight: 600;
}

.err {
	font-family: Source Han Sans;
	font-size: 26rpx;
	font-weight: normal;
	line-height: 44.92rpx;
	letter-spacing: 1.3rpx;

	font-feature-settings: 'kern' on;
	color: #f53f3f;
}
.tages {
	color: #01bb74;
	background-color: #f2fbf8;
	width: 30%;
	height: 54rpx;
	border-radius: 12rpx;
}
</style>
