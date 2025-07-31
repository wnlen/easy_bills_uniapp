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
import uExtend from '@/plugins/uExtend'

export function createApp() {
	const app = createSSRApp(App)
	// 创建 Pinia 实例
	const pinia = createPinia()
	
	// 先注入默认的持久化策略（优先级最高）
	pinia.use(({
		options
	}) => {
		if (options.persist === true) {
			options.persist = {
				enabled: true,
				strategies: [{
					storage: {
						getItem: uni.getStorageSync,
						setItem: uni.setStorageSync,
						removeItem: uni.removeStorageSync
					}
				}]
			}
		} else if (options.persist?.enabled && !options.persist.strategies?.[0]?.storage) {
			options.persist.strategies[0].storage = {
				getItem: uni.getStorageSync,
				setItem: uni.setStorageSync,
				removeItem: uni.removeStorageSync
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
	app.use(uExtend) // ✅ 保证挂载时 $u 已生成
	
	// 强制初始化 $u 对象
	console.log('uView $u:', app.config.globalProperties.$u) // 检查初始内容
	
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
	app.mixin(globalMixin)

	return {
		app
	}
}