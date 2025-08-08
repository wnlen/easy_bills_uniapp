### liu-data-select 适用于 uni-app 项目的 select 下拉框选择器组件

### 本组件目前兼容微信小程序、H5

### 本组件是非常简单好用的 select 下拉框选择器，可点击任意元素弹出，可自定义选择框大小、颜色、内容等，源码简单易修改

# --- 扫码预览、关注我们 ---

## 扫码关注公众号，查看更多插件信息，预览插件效果！

![](https://uni.ckapi.pro/uniapp/publicize.png)

### 使用方式

```示例
<template>
	<view class="page-main">
		<view class="title">示例一：</view>
		<liu-data-select elementId="data-select1" :dataList="dataList" @change="change">
			<input id="data-select1" v-model="name" class="btn-info" placeholder="请选择" disabled />
		</liu-data-select>

		<view class="title">示例二：</view>
		<liu-data-select elementId="data-select2" :dataList="dataList" @change="change1">
			<input id="data-select2" v-model="name1" class="btn-info1" placeholder="请选择" disabled />
		</liu-data-select>

		<view class="title">示例三：</view>
		<liu-data-select elementId="data-select3" :dataList="dataList" @change="change2" bgColor="#000000"
			color="#FFFFFF">
			<view id="data-select3" class="btn-info1">{{name2 || '点击选择'}}</view>
		</liu-data-select>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: '',
				name1: '',
				name2: '',
				dataList: ['选项1', '选项2', '选项3', '选项4', '选项5', '选项6', '选项7', '选项8', '选项9', '选项10']
			}
		},
		methods: {
			change(e) {
				this.name = e
				console.log('点击示例一选项：', e)
			},
			change1(e) {
				this.name1 = e
				console.log('点击示例二选项：', e)
			},
			change2(e) {
				this.name2 = e
				console.log('点击示例三选项：', e)
			}
		}
	}
</script>

<style scoped>
	.page-main {
		padding: 20rpx;
	}

	.title {
		margin: 32rpx;
	}

	.btn-info {
		width: 600rpx;
		height: 88rpx;
		margin: 0 auto;
		margin-top: 30rpx;
		border: solid #f0f0f0 1px;
		border-radius: 12rpx;
		padding: 0 30rpx;
	}

	.btn-info1 {
		width: 300rpx;
		height: 88rpx;
		margin: 0 auto;
		margin-top: 30rpx;
		border: solid #f0f0f0 1px;
		border-radius: 12rpx;
		padding: 0 30rpx;
		line-height: 88rpx;
	}
</style>
```

### 属性说明

| 名称       | 类型     | 默认值  | 描述                                          |
| ---------- | -------- | ------- | --------------------------------------------- |
| elementId  | String   |         | 所点击元素 id(必须传)                         |
| dataList   | Array    | []      | 下拉框数据源                                  |
| bgColor    | String   | #FFFFFF | 下拉框背景色                                  |
| radius     | Number   | 8       | 下拉框圆角(rpx)                               |
| dWidth     | Number   | 0       | 下拉框宽度(rpx)，不传则默认取所点击元素的宽度 |
| dHeight    | Number   | 0       | 下拉框高度(rpx)，不传则默认由内容撑开         |
| dMaxHeight | Number   | 0       | 下拉框最大高度(rpx)，超出则内部滚动           |
| color      | String   | #333333 | 字体颜色                                      |
| fontSize   | Number   | 28      | 字体大小(rpx)                                 |
| lineHeight | Number   | 66      | 字体行高(rpx)                                 |
| @change    | Function |         | 点击选项回调事件                              |
