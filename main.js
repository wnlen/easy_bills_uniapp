import Vue from 'vue';
import App from './App';

Vue.config.productionTip = false;

App.mpType = 'app';

// 引入全局uView
import uView from './uni_modules/vk-uview-ui';
Vue.use(uView);
// vuex使用
import store from '@/store';

// 引入uView提供的对vuex的简写法文件
let vuexStore = require('@/store/$u.mixin.js');
Vue.mixin(vuexStore);





Vue.prototype.goPath = function(path) {
	uni.setStorageSync("1003", "0")
	console.log(path=="/pages/subMessage/chitchat/chat?type=9");
	if (this.vuex_user.phone != undefined) {
		uni.navigateTo({
			url: path
		});
	}else{
		uni.navigateTo({
			url:"/pages/subUser/login"
		})
	}
}


Vue.prototype.goTab = function(path) {
	uni.switchTab({
		url: path
	})
}
// 封装常用
const prePage = () => {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}
Vue.prototype.$hao = {
	prePage
};

const app = new Vue({
	store,
	...App
});

// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
import httpInterceptor from '@/common/http.interceptor.js';
Vue.use(httpInterceptor, app);

// http接口API抽离，免于写url或者一些固定的参数


import push from '@/common/push.js';
Vue.use(push, app);


// import httpNew from '@/common/http.new.js';
// Vue.use(httpNew, app);

import socket from '@/common/socket.js';
Vue.use(socket, app);

import refresh from '@/common/refresh.js'
Vue.use(refresh);


app.$mount();