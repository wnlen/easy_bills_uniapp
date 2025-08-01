// main.js
import App from './App.vue'
import {
	createSSRApp
} from 'vue'

// ========== UI 框架 ==========
import uViewPlus from '@/uni_modules/uview-plus'

// ========== 状态管理 ==========
import {
	createPinia
} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import {
	legacySetPinia,
	setPinia,
	getPinia
} from '@/common/piniaHelper'

// ========== 初始化请求库（含拦截器、headers等） ==========
import {
	initRequest
} from '@/common/http.interceptor.js'

// ========== 自定义插件 ==========
import push from '@/common/push.js'
import createRefresh from '@/common/refresh.js'
import globalMethods from '@/common/globalMethods.js'
import globalMixin from '@/common/globalMixin.js'
import createApi from '@/api'

// import uExtend from '@/plugins/uExtend'


export function createApp() {
	const app = createSSRApp(App)

	// 创建 Pinia 实例
	const pinia = createPinia()

	// 先注入默认的持久化策略（优先级最高）
	pinia.use(({
		options
	}) => {
		// 如果 persist 设置为 true，注入默认策略
		if (options.persist === true) {
			options.persist = {
				enabled: true,
				strategies: [{
					storage: {
						getItem: uni.getStorageSync,
						setItem: uni.setStorageSync,
						removeItem: uni.removeStorageSync,
					}
				}]
			}
		}

		// 如果启用了 persist 且没有设置 storage，则补充默认的 uni 存储
		else if (
			options.persist?.enabled &&
			!options.persist.strategies?.[0]?.storage
		) {
			options.persist.strategies[0].storage = {
				getItem: uni.getStorageSync,
				setItem: uni.setStorageSync,
				removeItem: uni.removeStorageSync,
			}
		}
	})

	pinia.use(piniaPluginPersistedstate)
	app.use(pinia)

	// 初始化 uView 拦截器
	const http = initRequest()

	// UI 框架
	app.use(uViewPlus, () => ({
		httpIns: () => http
	}))

	// Vue 3 的全局属性配置$u
	app.config.globalProperties.$u = {
		...app.config.globalProperties.$u,
		vuex: legacySetPinia,
		setPinia,
		getPinia
	};
	//给全局this赋值$u
	uni.$u = app.config.globalProperties.$u

	// API 注入
	const api = createApi(http)
	app.config.globalProperties.$api = api
	uni.$api = api

	app.config.globalProperties.$http = http
	uni.$http = http

	// 全局插件 & Mixin
	app.use(push)
	app.use(globalMethods)
	app.use(createRefresh(http))
	app.mixin(globalMixin) //混入全局变量\全局方法

	// 挂载 Vue 应用
	app.mount('#app');

	return {
		app
	}
}