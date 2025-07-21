import Vue from 'vue';
import App from './App.vue';
Vue.config.productionTip = false;
App.mpType = 'app';

// ========== UI 框架 ==========
import uView from '@/uni_modules/vk-uview-ui';
Vue.use(uView); // 注册 uView UI

// ========== 状态管理 ==========
import store from '@/store';
import vuexStore from '@/store/$u.mixin.js';
Vue.mixin(vuexStore); // vuex 简写

// ========== 自定义插件 ==========
import httpInterceptor from '@/common/http.interceptor.js';
Vue.use(httpInterceptor); // 请求拦截

import push from '@/common/push.js';
Vue.use(push);

import createApi from '@/api';
const api = createApi(uni.$u); 
Vue.prototype.$api = api;
uni.$api = api; 

// import socket from '@/common/socket.js';
// Vue.use(socket);

import refresh from '@/common/refresh.js';
Vue.use(refresh);

//全局js 方法插件
import globalMethods from '@/common/globalMethods.js';
Vue.use(globalMethods);

//全局模版 方法插件
import globalMixin from '@/common/globalMixin.js';
Vue.mixin(globalMixin);

// ========== 创建 Vue 实例 ==========
const app = new Vue({
	store,
	...App
});

app.$mount();