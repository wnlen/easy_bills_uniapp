## 阿里矢量图-图标组件

> **组件名：albb-icon**

### 安装方式

本组件符合[easycom](https://uniapp.dcloud.io/collocation/pages?id=easycom)规范，`HBuilderX 2.5.5`起，只需将本组件导入项目，在页面`template`中即可直接使用，无需在页面中`import`和注册`components`。

### 基本用法

在 `template` 中使用组件

```html
<!-- 基本用法 -->
<albb-icon icon="h-tubiao"></albb-icon>

<!-- 自定义图标颜色 -->
<albb-icon icon="h-tubiao" color="#f15723"></albb-icon>

<!-- 自定义图标大小 -->
<albb-icon icon="h-tubiao" size="40rpx"></albb-icon>

<!-- 自定义图标颜色、大小 -->
<albb-icon icon="h-tubiao" size="40rpx" color="#f15723"></albb-icon>
```

### 使用自己的阿里矢量图库

自定义的阿里矢量图库，可使用网络地址（数据丢失，阿里不负责；小程序必须下载到本地使用），也可以下载下来放在本地

建议开发时使用网络地址，上线时下载到本地

##### 使用网络图片

复制自己的阿里矢量图项目图片链接，替换 albb-icon.vue 中的网络链接即可

```css
<style lang="scss" scoped>
	// 本地地址，需从阿里矢量图中下载相关文件
	// @import url('./iconfont.css');
	.iconfont {
		font-size: 32rpx;
	}
</style>
```

在 `template` 中使用组件

```html
<albb-icon icon="h-tubiao"></albb-icon>
```

##### 使用本地地址

下载自己的阿里矢量图项目，放入 static 下即可（iconfont.css 、iconfont.woff2、iconfont.woff、iconfont.ttf）

```css
<style lang="scss" scoped>
	// 本地地址，需从阿里矢量图中下载相关文件
	@import url('./iconfont.css');
	.iconfont {
		font-size: 32rpx;
	}
</style>
```

注意事项

iconfont.css 文件中引用其他三个文件，注意引用路径的正确性

微信小程序必须使用 本地地址

在 `template` 中使用组件

```html
<albb-icon icon="h-tubiao"></albb-icon>
```

#####

## API

### Props

| 属性名 | 类型 | 默认值 | 说明 |
| | | | |
| icon | String |h-tubiao | 矢量图标代码 |
| extraClass| String |- | 图标样式 class |
| iconStyle | Object |- | 图标样式 style |
| size | String |32rpx | 图标大小 |
| color | String | #fff | 图标颜色 |

### Events

| 事件名 | 类型 | 回调参数 | 说明 |
| | | | |
| active | function |无 | 图标点击事件 |
