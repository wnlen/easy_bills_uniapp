// main.js
import Vue from 'vue'
import App from './App.vue';
import {
	createSSRApp
} from 'vue';

// ========== UI 框架 ==========
import uView from '@/uni_modules/uview-plus';

// ========== 状态管理 ==========
import * as Pinia from 'pinia';
import {
	createUnistorage
} from './uni_modules/pinia-plugin-unistorage';
import {
	setPinia,
	getPinia
} from '@/common/piniaHelper';

// ========== 初始化请求库（含拦截器、headers等） ==========
import {
	initRequest
} from '@/common/http.interceptor.js';

// ========== 自定义插件 ==========
import plugins from '@/common/plugins'; //全局插件
import globalMixin from '@/common/mixins/global.js'; //全局混入
import createApi from '@/api'; //api接口

// ========== APP调试插件 ==========
import {
	debuggerModule
} from './uni_modules/imengyu-IMDebuggerWindow/common/debuggerExtern.js'


// import uExtend from '@/plugins/uExtend'

export function createApp() {
	const app = createSSRApp(App);

	// 创建 Pinia 实例
	const store = Pinia.createPinia();
	store.use(createUnistorage());
	app.use(store);

	// 初始化 uView 拦截器
	const http = initRequest();

	// UI 框架
	app.use(uView, () => ({
		httpIns: () => http
	}));

	// Vue 3 的全局属性配置$u
	app.config.globalProperties.$u = {
		...app.config.globalProperties.$u,
		setPinia,
		getPinia
	};
	//给全局this赋值$u
	uni.$u = app.config.globalProperties.$u;

	// API 注入
	const api = createApi(http);
	app.config.globalProperties.$api = api;
	uni.$api = api;

	app.config.globalProperties.$http = http;
	uni.$http = http;

	// 全局插件 & Mixin
	app.use(plugins);
	app.mixin(globalMixin); //混入全局变量\全局方法

	// === 注册全局错误捕获 ===
	app.config.errorHandler = (err, vm, info) => {
		try {
			if (debuggerModule) {
				debuggerModule.addVueError(err, vm, info)
			}
		} catch (e) {
			console.warn('IMDebuggerWindow addVueError failed:', e)
		}
	}

	// 挂载 Vue 应用
	// #ifdef H5
	// app.mount('#app');
	// #endif

	return {
		app,
		Pinia
	};
}