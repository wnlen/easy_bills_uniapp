## 1.1.20（2024-01-20）

1. 优化 uv-loading-page 重构，避免初始加载的时候先显示页面的问题，小程序平台由于性能问题，可能还是会短暂出现，请注意优化处理
2. 优化 uv-textarea confirmType 默认值改成 return，支持换行
3. 优化 uv-ui-tools luch-request 更新
4. 修复 uv-drop-down parentData 不变的 BUG
5. 修复 uv-picker 上个版本引出的 BUG
6. 修复 uv-image 设置 show-menu-by-longpress 不生效的 BUG
7. 修复 uv-upload 动态设置 deletable 为 false 不生效的 BUG

## 1.1.19（2023-12-12）

1. 优化 uv-toast 部分重构，支持取消遮罩不影响点击其他元素 a. 增加 z-index 参数；b. 增加 overlay 参数
2. 优化 关于组件如何阻止事件冒泡，增加相关说明：[组件怎么阻止事件冒泡](https://www.uvui.cn/components/feature.html#组件怎么阻止事件冒泡)
3. 优化 持续优化文档
4. 修复 uv-tabs current 为字符串 activeStyle 不生效的 BUG
5. 修复 uv-vtabs 在 change 回调中设置 current，快速点击菜单，导致死循环的 BUG
6. 修复 uv-cell right-icon 插槽编译到 APP 端不显示的 BUG，问题来源：[https://gitee.com/climblee/uv-ui/issues/I8LXZI](https://gitee.com/climblee/uv-ui/issues/I8LXZI)

## 1.1.18（2023-11-28）

0. 优化 uv-datetime-picker 增加 round 属性，设置弹窗圆角
1. 优化 uv-subsection 增加 customItemStyle 属性，方便修改 bar 样式，比如设置圆角
2. 修复 uv-picker issues 反馈的问题 uv-picker 在组合式 API 的自定义组件中，columns 动态赋值无法显示选项：[https://gitee.com/climblee/uv-ui/issues/I8H0GQ](https://gitee.com/climblee/uv-ui/issues/I8H0GQ)
3. 修复 uv-popup issues 问题：[https://gitee.com/climblee/uv-ui/issues/I8HDLO](https://gitee.com/climblee/uv-ui/issues/I8HDLO)
4. 修复 uv-skeletons 支付宝小程序报错的 BUG
5. 修复 uv-image webp 之前未使用的 BUG & 微信报错的 BUG
6. 修复 uv-modal 上版本引出的确认和取消按钮均不显示，还有高度的 BUG

## 1.1.17（2023-11-10）

0. 交流反馈 欢迎加入 uv-ui 官方群 1 交流反馈： 549833913（1000+）
1. 交流反馈 欢迎加入 uv-ui 官方群 2 交流反馈： 206060892
2. 新增 新增其他小组件下载入口：其他小组件
3. 优化 uv-calendars 增加 readonly 属性，是否为只读状态，只读状态下禁止选择日期
4. 修复 uv-search 禁用时，不能触发 click 的 BUG
5. 修复 uv-checkbox and uv-radio label 文字过长，不换行的相关说明及处理
6. 修复 uv-input and uv-search 点击 clear 按钮在微信小程序不好触发的 BUG
7. 修复 uv-list 修复设置 ellipsis 不生效的 BUG
8. 修复 uv-index-list 修复 sticky 属性不生效的 BUG

## 1.1.16（2023-10-30）

1. 交流反馈 欢迎加入 uv-ui 官方群 1 交流反馈： 549833913（940+/1000）
2. 交流反馈 欢迎加入 uv-ui 官方群 2 交流反馈： 206060892
3. 新增 uv-skeletons 骨架屏，全新升级骨架屏，更加灵活，体验更加，强烈推荐使用新版骨架屏。一般用于页面在请求远程数据尚未完成时，在内容加载出来前展示与内容布局结构一致的灰白块，提升用户视觉体验。
4. 优化 uv-button 增加后置插槽 suffix，方便在按钮文字后面增加图标等
5. 优化 uv-popup vue 模式内容有背景色，设置圆角被遮挡的情况
6. 优化 uv-tabs 点击一个选项，change 事件重复派发的问题
7. 优化 持续优化文档及其他
8. 修复 uv-album 设置 singleSize、multipleSize、space 等值带单位，存在不显示的 BUG
9. 修复 uv-picker 省市级示例设置 defaultValue，再次选择第二列错乱的 BUG
10. 修复 uv-icon imgMode 默认值改成 aspectFit，否则会导致支付宝平台 name 设置为本地图片显示不全的 BUG
11. 修复 uv-transition 在 APP-IOS 上不能正常显示的 BUG
12. 修复 uv-toast、uv-swipe-action、uv-sticky、uv-notify、uv-notice-bar、uv-grid、uv-count-down、uv-code 等组件，unmounted 兼容 vue3

## 1.1.15（2023-10-12）

1. 优化 uv-keyboard a. 增加 disKeys 参数，mode = "car"下，被禁用的键，如：['I','O']； b. 增加 customabc 参数，mode = "car"下，是否启用自定义中英文切换内容模式，为了兼容支付宝等小程序不兼容嵌套插槽，导致同时显示自定义内容和原始内容； c. 增加 ref 方法 changeCarMode，mode = "car"下， 调用此方法可以切换中英文模式； d. 增加@changeCarInputMode，mode = "car"下，调用此方法可以进行切换中英文； e. 增加插槽 abc，mode = "car"下，自定义中英文切换内容
2. 优化 uv-checkbox uv-radio 优化：https://gitee.com/climblee/uv-ui/issues/I872VD
3. 优化 uv-picker 将 immediate-change 默认值改为 true，该值在于 change 回调的及时性，微信小程序生效
4. 优化 uv-tags 兼容 customStyle 参数等优化
5. 修复 uv-transition 部分情况，修改某属性自动关闭的 BUG
6. 修复 uv-calendars 懒加载报错：https://gitee.com/climblee/uv-ui/issues/I869JS
7. 修复 uv-datetime-picker 设置 minDate 出现选择错乱的 BUG
8. 修复 uv-input 搜狗输入法下存在不可清空的情况
9. 修复 uv-calendars selected 没有设置了 info 或者 info 设置为空字符串后，文本则无法恢复 BUG

## 1.1.14（2023-09-27）

1. 优化 uv-list-item 可使用 customStyle 变量进行样式控制
2. 优化 uv-cell 增加 cellStyle 参数，方便自定义单元格的样式
3. 优化 uv-switch 优化细节
4. 优化 不断优化[文档](https://www.uvui.cn/)
5. 修复 uv-button 通过 customStyle 修改按钮宽度，组件中最外层节点不改变的问题
6. 修复 uv-calendars a. 修复 range 模式下，selected 设置了 info 后选中后，导致文本不恢复的问题；b. 修复 multiple 模式下，selected 自定义信息的颜色没变，依然是白色
7. 修复 uv-checkbox uv-checkbox-group 之 change 回调中 v-model 值不更新的 BUG

## 1.1.13（2023-09-15）

1. 优化 uv-button a. 增加参数 iconSize，用于控制图标的大小；b. 增加 open-type="agreePrivacyAuthorization"类型，用户同意隐私协议事件回调
2. 优化 uv-picker 三级联动的案例：[https://www.uvui.cn/components/picker.html#省市区三级联动](https://www.uvui.cn/components/picker.html#省市区三级联动)
3. 修复 uv-read-more 全局设置 rpx 时，导致展开高度不对的 BUG
4. 修复 uv-tabs a. 设置 lineWidth 未带单位产生的误差 BUG；b. 首次加载时，处理下划线会有左到右的过渡效果
5. 修复 uv-textaera 设置 autoHeight 后出现高度异常的 BUG
6. 修复 uv-input H5 等情况设置禁用或可读情况下，点击事件无效的问题，nvue 需要特殊处理
7. 修复 uv-calendars a. 在 vue2+小程序渲染时闪烁的问题；b. 增加 allowSameDay 参数，是否允许日期范围的起止时间为同一天，mode=range 时有效
8. 修复 uv-safe-bottom 兼容飞书小程序
9. 修复 uv-album 添加依赖，避免导入运行有误
10. 修复 uv-ui-tools 优化组件用到的相关

## 1.1.12（2023-09-10）

1. 修复 uv-popup a. h5 初始 zIndex 错误的问题；b. 修复全局设置 prop 无效的问题
2. 修复 uv-button 修复多个按钮由 view 包裹，显示在一行宽度不正常的 BUG
3. 修复 uv-modal a. 修复两个按钮之间竖线不显示的问题；b. uv-ui 项目自定义按钮示例修复
4. 修复 uv-calendars 修复国际化失效的 BUG
5. 修复 uv-keyboard 修复键盘 change 回调事件产生冲突的 BUG

## 1.1.11（2023-09-02）

1. 优化 uv-calendars a. 去除 range 参数，由 mode="range"替换；b. 新增 mode 参数，不传 / multiple / range，分别为单日期， 多个日期，选择日期范围；c. 与 uv-calendar 选择日期的功能保持一致
2. 优化 uv-modal a. 增加 align 参数，设置文本对齐方式；b. 增加 textStyle 参数，扩展文本样式
3. 优化 uv-datetime-picker a. 增加 mode="year"模式，方便只选择年；b. 增加 clearDate 参数，是否清除上次选择
4. 修复 uv-ui-tools 设置 customstyle 同名计算属性报错：The computed property "customStyle" is already defined as a prop
5. 修复 uv-image a. 设置 widthFix 时出现显示不全的 BUG；b. 修复抖音等平台在 width 和 height 属性改变时出现不显示的 BUG
6. 修复 uv-checkbox 点击空隙处或 label 插槽内容不会选中的问题
7. 修复 uv-radio 点击空隙处或 label 插槽内容不会选中的问题
8. 修复 uv-calendars 在 pages.json 中设置 easycom 会报错的 BUG
9. 修复 uv-index-list 设置 customNavHeight 导致定位不准确的 BUG

## 1.1.10（2023-08-30）

1. 交流反馈 欢迎加入 uv-ui 官方群 1 交流反馈： 549833913
2. 交流反馈 欢迎加入 uv-ui 官方群 2 交流反馈： 206060892
3. 优化 uv-calendars 1. 去除 range 参数，由 mode="range"替换；2. 新增 mode 参数，不传 / multiple / range，分别为单日期， 多个日期，选择日期范围；3. 与 uv-calendar 选择日期的功能保持一致
4. 新增 uv-album 新增相册组件及相关文档
5. 优化 其他优化
6. 修复 uv-text app-nvue 设置 align 不生效的 BUG
7. 修复 uv-drop-down 自定义内容，点击自定义内容时会自动关闭弹窗的问题
8. 修复 uv-image 异步修改宽高不生效的问题，问题来源：https://gitee.com/climblee/uv-ui/issues/I7WUQ3
9. 修复 uv-calendars 通过 setConfig 修改属性不生效的问题，出自评论区：https://ext.dcloud.net.cn/plugin?id=12287
10. 修复 uv-list 设置边框不生效的 BUG

## 1.1.9（2023-08-27）

1. 优化 uv-calendars 1. 去除 range 参数，由 mode="range"替换；2. 新增 mode 参数，不传 / multiple / range，分别为单日期， 多个日期，选择日期范围；3. 与 uv-calendar 选择日期的功能保持一致
2. 优化 uv-picker 增加 round 属性，设置圆角
3. 修复 uv-calendars 点击返回今天按钮时，monthSwitch 方法回调参数返回月份不是当天对应月份
4. 修复 uv-radio 1. 设置 labelSize 属性设置无效的问题：https://gitee.com/climblee/uv-ui/issues/I7W6UN；2. v-model 绑定布尔值控制台报警：https://gitee.com/climblee/uv-ui/issues/I7W714
5. 修复 uv-checkbox 1. 设置 label 属性为布尔值不生效的 BUG

## 1.1.8（2023-08-24）

1. 优化 uv-popup 弹出不丝滑优化思路：https://www.uvui.cn/components/popup.html#yh
2. 修复 uv-switch 取消 value 传值，只能使用 v-model 传值，避免异步操作不生效的 BUG
3. 修复 uv-index-list ios 端滚动过程中+快速点击右侧导航页面出现空白的 BUG
4. 修复 uv-rate 1. 支付宝报错的 BUG; 2. 不能选半星的 BUG
5. 修复 uv-model 异步 loading 时，确认回调还会一直触发的 BUG
6. 修复 uv-swiper 标题文字过多未隐藏掉的 BUG
7. 修复 uv-text app-nvue 编译不能自动换行的 BUG

## 1.1.7（2023-08-22）

1. 优化 uv-drop-down a. 增加@change 回调，返回弹窗关闭状态； b. 增加 init 方法，方便位置改变进行调整
2. 优化 部分文档优化
3. 修复 uv-input a. app-nvue-ios 端不能输入的 BUG；b. 键盘高度等值不返回 BUG
4. 修复 uv-scroll-list 报错导致不能移动指示器的 BUG
5. 修复 uv-search 边距值在上次更新中误改导致不对的 BUG
6. 修复 uv-image 设置 width 和 height 为 100%不生效的 BUG

## 1.1.6（2023-08-18）

1. 优化 优化文档
2. 修复 uv-list 使用列表右侧显示 switch，switchChange 回调中返回数据为 undefined 的 BUG
3. 修复 uv-checkbox 数据多不换行的 BUG
4. 修复 uv-upload 1. 图片预览位置错误的 BUG；2. 视频预览不生效的 BUG；3. 改变上传视频宽高不生效的 BUG
5. 修复 uv-navbar 在部分 ios 高版本机型，返回按钮不好操作的问题
6. 修复 uv-waterfall 只有一条数据的时候，切换的时候数据会左右显示错误的 BUG

## 1.1.5（2023-08-14）

1. 优化 uv-pick-color 删除 scrollTop 参数，内部修改后就不需要了
2. 优化 uv-loading-icon 增加 textStyle 参数，可自定义文本样式，比如给上边距
3. 修复 uv-safe-bottom 百度小程序报错的 BUG
4. 修复 uv-form 设置 labelWidth 属性时，节点渲染有闪动的 BUG
5. 修复 uv-grid 设置 col 属性时，节点渲染有闪动的 BUG
6. 修复 uv-parse 阻止 a 标签跳转文档说明

## 1.1.4（2023-08-13）

1. 优化 nvue 自定义图标 [详细文档-nvue 中自定义图标库](https://www.uvui.cn/guide/customIcon.html#nvue%E4%B8%AD%E8%87%AA%E5%AE%9A%E4%B9%89%E5%9B%BE%E6%A0%87%E5%BA%93)
2. 优化 uv.$uv.http 在 APP.vue 页面使用报错的 BUG： [Api 集中管理](https://www.uvui.cn/js/http.html#_3-api%E9%9B%86%E4%B8%AD%E7%AE%A1%E7%90%86)
3. 修复 uv-navbar app-nvue 运行 ios 存在背景图片错乱的问题
4. 修复 uv-list app-nvue 运行 ios 存在，分包页面不滚动
5. 修复 uv-textarea 值为 null 或 undefined 时显示错误的 bug
6. 修复 uv-search 值为 null 或 undefined 时显示错误的 bug
7. 修复 uv-scroll-list vue2 编译报错的 BUG
8. 修复 uv-calendars 选择月份弹窗层级的问题
9. 修复 uv-form 动画在 vue3 setup 语法糖中错乱，以及表单其他相关问题解决： [Issues](https://gitee.com/my_dear_li_pan/uv-ui/issues/I7SNTT)
10. 修复 uv-picker-color 滚动页面无法点击的 BUG：增加 scrollTop 参数，设置滚动条的位置。不设置如果页面出现滚动就需要传该值，会出现颜色面板无法进行选颜色的情况。
11. 交流反馈 欢迎加入 uv-ui 官方群 1 交流反馈： [549833913](https://www.uvui.cn/components/addQQGroup.html)
12. 交流反馈 欢迎加入 uv-ui 官方群 2 交流反馈： [206060892](https://www.uvui.cn/components/addQQGroup.html)

## 1.1.3（2023-08-06）

1. 优化 uv-calendars 1. 增加 startText 参数; 2. 增加 endText 参数; 3. 增加 selected 中的参数; 4. 优化日历范围选择
2. 优化 uv-empty icon 属性支持 base64 图片
3. 优化 uv-navbar 增加背景图片的裁剪模式参数 imgMode
4. 优化 uv-picker-color 颜色值不对的 BUG
5. 优化 [API 文档优化](https://www.uvui.cn/components/changelog.html)
6. 优化 常见问题增加：[怎么隐藏 uv-tabs 等组件的滚动条](https://www.uvui.cn/components/problem.html#%E4%B9%9D%E3%80%81%E6%80%8E%E4%B9%88%E9%9A%90%E8%97%8Fuv-tabs%E7%AD%89%E7%BB%84%E4%BB%B6%E7%9A%84%E6%BB%9A%E5%8A%A8%E6%9D%A1)
7. 修复 uv-radio name 为数字 0 时不能选中的 BUG
8. 修复 uv-textarea 1. v-model 设置为数据时的 BUG；2. 复制过多内容，计数显示错误的 BUG；3. maxlength 为-1 改成不显示计数
9. 修复 uv-code-input 在 vue2 模式下，v-model 设置为 0 时不生效的 BUG
10. 修复 uv-input 在 vue2 模式下，v-model 设置为 0 时不生效的 BUG
11. 修复 uv-search 在 vue2 模式下，v-model 设置为 0 时不生效的 BUG
12. 修复 uv-ui-tools 1. 路由拦截修复；2. 增加 events 参数

## 1.1.2（2023-08-03）

1. 新增 uv-calendars 新版日历发布
2. 新增 uv-toolbar 组件独立发布，老用户更新 uv-picker，需要手动删除 uv-picker 目录下的 uv-toolbar 目录，否则会有冲突提示
3. 优化 uv-tags 增加 cellChild 参数
4. 优化 uv-navbar 兼容背景图片
5. 优化 uv-notice-bar 竖向滚动时候增加 change 回调

## 1.1.1（2023-07-30）

1. 新增 uv-drop-down 下拉筛选组件，兼容 app-nvue 及多端
2. 优化 uv-textarea 增加 confirm-hold 参数，方便设置进行换行处理
3. 优化 其他关于文档的优化等

## 1.1.0（2023-07-26）

1. 重构 uv-list 全面重构，提高性能，放弃使用 scroll-view，具体文档参考：uv-list 列表
2. 优化 uv-search 1. 增加 prefix 和 suffix 前置和后置插槽；2. 增加 boxStyle 参数，方便控制输入框部分的样式
3. 优化 文档优化：获取节点布局信息，文档新增 nvue 获取方式的说明

## 1.0.22（2023-07-26）

1. 优化 uv-textarea 组件 增加 textStyle 和 countStyle 属性，方便控制文本样式
2. 优化 uv-swiper 增加竖向播放属性：vertical
3. 优化 uv-icon 支持 base64 图片格式
4. 优化 uv-transition 和 uv-image 增加参数 cellChild 属性，避免 nvue 中出现回收后不显示的 BUG
5. 优化 uv-button 增加 customTextStyle 属性，方便自定义按钮文字样式
6. 优化 优化部分文档说明
7. 修复 uv-slider 修改背景颜色属性为 backgroundColor，避免设置不生效
8. 修复 uv-index-list 1. 修复全局设置成 rpx 存在的高度 BUG；2. 修复其他 BUG

## 1.0.21（2023-07-22）

1. 新增 uv-scroll-list 横向滚动列表组件
2. 优化 增加测试占位图，方便开发者使用线上图片进行测试：[https://www.uvui.cn/components/testPic.html](https://www.uvui.cn/components/testPic.html)
3. 优化 uv-calendar 组件文档示例等优化，增加 setFormatter 说明
4. 优化 uv-notice-bar 优化文档，说明不显示左边图标的使用方法
5. 修复 uv-input 在微信小程序端清除内容存在不能清除的 BUG
6. 修复 uv-button 1. 解决微信小程序动态设置 hover-class 点击态不消失的 BUG; 2. 文档优化
7. 修复 uv-waterfall 在 tab 切换等场景快速切换时，会出现报错的 BUG
8. 优化 优化其他

## 1.0.20（2023-07-18）

1. 修复 uv-textarea 设置-1 不生效
2. 修复 uv-icon 恢复 uv-empty 相关的图标
3. 修复 uv-empty 恢复设置 mode 属性的内置图标
4. 优化 [优化文档](https://www.uvui.cn)

## 1.0.19（2023-07-14）

1. 优化 uv-waterfall 当 changeList 未处理数据时，正确返回对应列的数据，避免误导
2. 修复 uv-rate VUE3 模式下设置 value 属性不生效的 BUG
3. 修复 uv-input VUE3 模式下设置 value 属性不生效的 BUG
4. 修复 uv-search VUE3 模式下设置 value 属性不生效的 BUG
5. 修复 uv-code-input VUE3 模式下设置 value 属性不生效的 BUG
6. 修复 uv-number-box VUE3 模式下设置 value 属性不生效的 BUG
7. 修复 uv-radio VUE3 模式下设置 value 属性不生效的 BUG
8. 修复 uv-checkbox VUE3 模式下设置 value 属性不生效的 BUG
9. 修复 uv-textarea VUE3 模式下设置 value 属性不生效的 BUG
10. 修复 uv-switch VUE3 模式下设置 value 属性不生效的 BUG
11. 修复 uv-slider VUE3 模式下设置 value 属性不生效的 BUG
12. 修复 uv-datetime-picker VUE3 模式下设置 value 属性不生效的 BUG
13. 修复 uv-icon 部分图标错误的 BUG

## 1.0.18（2023-07-06）

1. 优化 uv-icon 1. 更新图标，删除一些不常用的图标；2. 删除 base64，修改成 ttf 文件引入读取图标。uv-icon 图标
2. 优化 uv-icon nvue 自定义图标用法，文档说明：[点击跳转](https://www.uvui.cn/guide/customIcon.html)
3. 优化 uv-upload 文档示例代码，增加 fileList 参数说明：[点击跳转](https://www.uvui.cn/components/upload.html#filelist-options)
4. 修复 uv-checkbox vue3 模式下，动态修改 v-model 绑定的值无效的 BUG
5. 修复 uv-radio vue3 模式下，动态修改 v-model 绑定的值无效的 BUG
6. 修复 uv-datetime-picker vue3 模式下，动态修改 v-model 绑定的值无效的 BUG

## 1.0.17（2023-07-04）

1. 优化 uv-icon 修复，NVUE 平台主题颜色在 APP 不生效的 BUG
2. 优化 uv-notice-bar 优化，增加 disableScroll 属性
3. 优化 uv-input uv-back-top uv-cell uv-form uv-search uv-modal uv-navbar uv-index-list uv-empty uv-upload 去除插槽判断，避免某些平台不显示的 BUG
4. 优化 uv-form 优化文档
5. 优化 优化其他相关文档

## 1.0.16（2023-07-03）

1. 优化 uv-transition 动画组件，代码重构优化，性能更加友好，增加自定义动画功能。详情[参考文档](https://www.uvui.cn/components/transition.html)
2. 优化 uv-popup 弹出层，代码重构优化，性能翻倍，小程序体验性能更加，避免卡顿。打开和关闭方法更改，详情[参考文档](https://www.uvui.cn/components/popup.html)
3. 优化 uv-calendar 由于弹出层 uv-popup 的修改，打开和关闭方法更改，详情[参考文档](https://www.uvui.cn/components/actionSheet.html)
4. 优化 uv-action-sheet 由于弹出层 uv-popup 的修改，打开和关闭方法更改，详情[参考文档](https://www.uvui.cn/components/calendar.html)
5. 优化 uv-datetime-picker 由于弹出层 uv-popup 的修改，打开和关闭方法更改，详情[参考文档](https://www.uvui.cn/components/datetimePicker.html)
6. 优化 uv-form 由于弹出层 uv-transition 的修改，组件内部做了相应的修改，参数不变。
7. 优化 uv-keyboard 由于弹出层 uv-popup 的修改，打开和关闭方法更改，详情[参考文档](https://www.uvui.cn/components/keyboard.html)
8. 优化 uv-modal 由于弹出层 uv-popup 的修改，打开和关闭方法更改，详情[参考文档](https://www.uvui.cn/components/modal.html)
9. 优化 uv-notify 由于弹出层 uv-popup 的修改，打开和关闭方法更改，详情[参考文档](https://www.uvui.cn/components/notify.html)
10. 优化 uv-overlay 由于弹出层 uv-transition 的修改，组件内部做了相应的修改，参数不变。
11. 优化 uv-pick-color 由于弹出层 uv-popup 的修改，打开和关闭方法更改，详情[参考文档](https://www.uvui.cn/components/pickColor.html)
12. 优化 uv-picker 由于弹出层 uv-popup 的修改，打开和关闭方法更改，详情[参考文档](https://www.uvui.cn/components/picker.html)
13. 优化 uv-tooltip 由于弹出层 uv-transition 的修改，组件内部做了相应的修改，参数不变。
14. 优化 uv-loading-page 由于弹出层 uv-transition 的修改，组件内部做了相应的修改，参数不变。
15. 优化 相关文档的优化更改。
16. 修复 uv-safe-bottom 修复，在百度程序，抖音小程序不生效的 BUG

## 1.0.15（2023-06-29）

1. 欢迎加 QQ 群交流：[549833913](https://www.uvui.cn/components/addQQGroup.html)
2. 优化 uv-swiper 优化：1. 增加 titleStyle 属性，方便修改标题样式；2. 标题上去掉是否是图片的判断，避免无后缀的图片不显示
3. 优化 uv-steps 优化：1. 增加插槽 title; 3. 文档关于插槽相关的参数说明完善；增加 customStyle 属性
4. 优化 uv-checkbox 优化：增加 label 文字插槽，与 radio 保持一致，优化文档相关说明
5. 优化 uv-modal 优化：增加 closeLoading 方法，方便异步加载手动取消加载状态，更新文档
6. 优化 uv-image 增加文档说明：uv-list、 uv-waterfall 等组件在 Android 平台使用了 list 封装，所以在该组件中仍然不能使用 uv-image 等组件
7. 优化 优化更多文档
8. 修复 uv-vtabs 修复非联动情况下，内容过多的情况，滚动一段距离，再切换未滚动到顶部的 BUG
9. 修复 uv-image 修复：duration 属性不生效的 BUG
10. 修复 uv-code-input 修复：使用:disabledKeyboard="true"属性，事件全部失效的 BUG
11. 修复 uv-button 修复：设置 open-type="chooseAvatar"等值不生效的 BUG

## 1.0.14（2023-06-25）

1. 欢迎加 QQ 群交流：[549833913](https://www.uvui.cn/components/addQQGroup.html)
2. 优化 uv-count-down 增加外部样式 customStyle 参数
3. 优化 文档的全面优化
4. 修复 uv-count-to 1. 修复继续滚动的函数 2. 修改文档错误 4. 适配 px 和 rpx 的单位 4. 适配 customStyle 参数
5. 修复 uv-load-more 修复 customStyle 参数设置背景等不生效的 BUG
6. 修复 uv-code-input 优化下边框
7. 修复 uv-tabs 添加 uv-icon 依赖
8. 修复 uv-grid 优化修改
9. 修复 uv-cell 优化修改

## 1.0.13（2023-06-20）

1. 优化 uv-calendar formatter 格式化中增加 topInfo 参数
2. 优化 uv-tabs 增加 customStyle 参数
3. 优化 文档优化，便于开发者直接开干
4. 优化 uv-switch 优化 size 属性，适配单位传递
5. 修复 uv-ui-tools、uv-form、uv-picker 修复 vue3 编译支付宝异常
6. 修复 uv-ui-tools、uv-form、uv-picker 修复 vue3 编译支付宝异常
7. 修复 uv-parse 修复在 nvue 不显示的 BUG
8. 修复 uv-form 修复某些条件下报错的 BUG

## 1.0.12（2023-06-14）

1. 优化部分组件，优化文档部分细节
2. uv-popup、uv-modal 修复遮罩层 zIndex 问题
3. uv-form 在 vue3 的 setup 语法中 ref 使用 uvForm 会导致报错
4. uv-tabs activeStyle 设置字体大小，可能会导致下划线位置不对 BUG
5. uv-pick-color 百度小程序点击报错
6. uv-transition 恢复 this.$nextTick
7. uv-picker 抖音小程序选择的时候报错，导致不能关闭的 BUG
8. uv-checkbox 多余的属性 labelDisabled，导致 APP 中报错提示
9. uv-tabbar 底部安全距离组件无效的 BUG
10. uv-vtabs 头部存在的时候，联动不准确的 BUG

## 1.0.11（2023-06-12）

1. uv-radio-group、uv-checkbox-group 兼容自定义样式 customStyle，方便通过样式调整整体位置等，数据较多时允许换行
2. uv-ui-tools 优化内置样式等，解决微信小程序使用 uvui 提示 Some selectors are not allowed in component wxss, including tag name selectors, ID selectors, and attribute selectors，[详情](https://www.uvui.cn/components/problem.html)
3. uv-datetime-picker 取消 defaultIndex 参数，目前传该值也没实际意义
4. uv-tabbar 增加 iconSize 参数
5. uv-calendar 增加 change 回调
6. uv-calendar 修复 BUG
7. uv-rate 修复只读或禁止状态下设置 value 无效的问题
8. uv-popup 修复 zIndex 问题
9. uv-modal 修复 zIndex 问题
10. 文档-扩展配置更新：[扩展配置](https://www.uvui.cn/components/setting.html)
11. 文档-优化更新：[uv-ui 文档](https://www.uvui.cn/components/changelog.html)
12. 文档-新增常见问题：[常见问题](https://www.uvui.cn/components/problem.html)
13. 优化其他

## 1.0.10（2023-06-05）

1. uv-navbar 渐变背景色兼容
2. uv-calendar 日历选择 BUG 修复

## 1.0.9（2023-06-05）

1. 新增 uv-vtabs 垂直选项卡组件，主要用于分类展示，分类切换功能，支持联动和不联动两种模式
2. uv-qrcode，uv-datetime-picker，uv-subsection 等文档说明优化，避免开发困难；优化 API 相关说明
3. uv-notice-bar 1. 修复在触发 error 函数报错的 BUG；2. 修复在 text 值为 undefined 的时候，解决报错 BUG
4. uv-button 等组件修复触发两次事件的 BUG
5. uv-datetime-picker 1. 修复重置值存在不更新的 BUG；2. 优化文档，增加 filter 使用方法说明
6. uv-badge 修复 type 等属性为 null 或 undefined 的时候不显示徽标的 BUG
7. uv-ui-tools 优化工具组件，兼容更多功能，小程序分享功能优化等
   ...

## 1.0.8（2023-05-27）

1. uv-waterfall 修复在百度小程序中可能存在的 BUG；去掉原有的 slot 方式
2. uv-image 修复可能报错的问题
3. uv-pick-color 在文档预览模式中无法点击的问题
4. uv-index-list 修复 select 事件不触发的问题
5. 优化其他组件及示例项目等

## 1.0.7（2023-05-25）

1. uv-icon 将线上 ttf 字体包替换成 base64，避免加载时或者网络差时候显示白色方块
2. uv-text 去掉多余的 data-index 属性，避免警告
3. uv-upload 在 fileList 的 watch 中增加 deep 属性
4. uv-pick-color 去掉 template 中存在的 this.导致头条小程序编译警告
5. uv-image 去掉 template 中存在的 this.导致头条小程序编译警告

## 1.0.6（2023-05-23）

1. 新增 uv-pick-color 颜色选择器组件
2. uv-toolbar 组件增加 showBorder 属性，是否显示下边框
3. uv-transition 组件在百度小程序等平台不支持 this.$nextick 导致下面的逻辑不执行，使用延时替换方案
4. uv-ui-tools 组件中 bem()函数兼容百度/头条小程序等
5. uv-waterfall 组件修复在百度/头条小程序显示异常等 BUG，增加 changeList 回调函数处理数据，同步更新示例等
6. uv-image 组件修复在百度/头条小程序等开启 observeLazyLoad 后显示异常 BUG
7. uv-tabs 组件修复上次更新导致的在 nvue 中不滚动的 BUG
8. uv-qrcode 组件修复在部分平台不显示加载的 BUG
9. 修复其他已知问题等

## 1.0.5（2023-05-17）

1. 新增 uv-qrcode 二维码组件
2. 修复 uv-tooltip 在 vue2 模式下的 BUG
3. 优化部分问题

## 1.0.4（2023-05-16）

1. 优化组件依赖，修改后无需全局引入，组件导入即可使用
2. 优化部分功能

## 1.0.3（2023-05-12）

1. 修复 uv-input 在 vue3 模式下双向绑定问题
2. 修复 uv-textarea 在 vue3 模式下双向绑定问题
3. 修复 uv-rate 在 vue3 模式下双向绑定问题

## 1.0.2（2023-05-11）

1. 更新文档
2. 增加插件下载入口

## 1.0.1（2023-05-10）

1. 所有组件依赖
2. 上传示例项目

## 1.0.0（2023-05-10）

1. uv-ui
