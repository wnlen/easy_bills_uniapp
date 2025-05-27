import Vue from 'vue'
import Vuex from 'vuex'
import apiConfig from '@/common/http.api.js';

Vue.use(Vuex)

let lifeData = {};

try {
	// 尝试获取本地是否存在lifeData变量，第一次启动APP时是不存在的
	lifeData = uni.getStorageSync('lifeData');
} catch (e) {

}

let ImgUrl = 'https://res-oss.elist.com.cn'

// #ifdef MP-WEIXIN
const accountInfo = uni.getAccountInfoSync();
const envVersion = accountInfo.miniProgram.envVersion;

if (envVersion === 'develop') {
	ImgUrl = apiConfig.develop.api_host;
} else if (envVersion === 'trial') {
	ImgUrl = apiConfig.trial.api_host;
} else if (envVersion === 'release') {
	ImgUrl = apiConfig.release.api_host;
}
// #endif



// 需要永久存储，且下次APP启动需要取出的，在state中的变量名
let saveStateKeys = ['vuex_user', 'vuex_token', 'vuex_userRole', 'vuex_tabIndex', 'vuex_work', 'taber',
	'vuex_password', 'ImgUrl', 'guidanceD', 'guidanceR', 'guidance', 'announcement', 'draft'
];

// 保存变量到本地存储中
const saveLifeData = function(key, value) {
	// 判断变量名是否在需要存储的数组中
	if (saveStateKeys.indexOf(key) != -1) {
		// 获取本地存储的lifeData对象，将变量添加到对象中
		let tmp = uni.getStorageSync('lifeData');
		// 第一次打开APP，不存在lifeData变量，故放一个{}空对象
		tmp = tmp ? tmp : {};
		tmp[key] = value;
		// 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
		uni.setStorageSync('lifeData', tmp);
	}
}
const store = new Vuex.Store({
	state: {
		flush: 0,
		// 如果上面从本地获取的lifeData对象下有对应的属性，就赋值给state中对应的变量
		// 加上vuex_前缀，是防止变量名冲突，也让人一目了然
		vuex_user: lifeData.vuex_user ? lifeData.vuex_user : {
			workData: {
				bossNumber: null,
				endTime: null,
				id: null,
				identity: null,
				img: null,
				jc: null,
				jobNumber: null,
				jurisdictionCode: null,
				name: null,
				staffNumber: null,
				state: null,
				identity: null
			},
			data: {
				work: null,
				name:"",
				headPortrait:null
			},
			ac: {
				enterpriseName: null
			},
			phone: null
		},
		vuex_token: lifeData.vuex_token ? lifeData.vuex_token : '',
		// 用户当前操作权限
		vuex_userRole: lifeData.vuex_userRole ? lifeData.vuex_userRole : 'D',
		// 首页点击跳转到订单列表对应tab
		vuex_tabIndex: lifeData.vuex_tabIndex ? lifeData.vuex_tabIndex : 0,
		// 如果vuex_version无需保存到本地永久存储，无需lifeData.vuex_version方式
		vuex_work: lifeData.vuex_work ? lifeData.vuex_work : '',
		vuex_password: lifeData.vuex_password ? lifeData.vuex_password : lifeData.vuex_password,
		announcement: lifeData.announcement ? lifeData.announcement : lifeData.announcement,
		vuex_version: '1.0.0',
		taber: 0,
		ImgUrl: ImgUrl,
		// 自定义tabbar数据
		vuex_tabbar: [{
				iconPath: "/static/images/tab/tab-home.png",
				selectedIconPath: "/static/images/tab/tab-home-active.png",
				text: '首页',
				counts: '',
				// midButton: true,
				pagePath: "/pages/index/index",
				customIcon: false,
			},
			{
				iconPath: "/static/images/tab/tab-list.png",
				selectedIconPath: "/static/images/tab/tab-list-active.png",
				text: '查单',
				midButton: true,
				// count: 2,
				pagePath: "/pages/list/list"
			},
			{
				iconPath: "/static/images/tab/message-out.png",
				selectedIconPath: "/static/images/tab/message-blur.png",
				text: '消息',
				count: 0,
				midButton: true,
				pagePath: "/pages/message/message",
			},
			{
				iconPath: "/static/images/tab/tab-my.png",
				selectedIconPath: "/static/images/tab/tab-my-active.png",
				text: '我的',
				// count: 2,
				pagePath: "/pages/user/index"
			},
		],
		guidanceD: lifeData.guidanceD,
		guidanceR: lifeData.guidanceR,
		guidance: lifeData.guidance ? lifeData.guidance : 0,
		draft: false
	},
	mutations: {
		$uStore(state, payload) {
			// 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
			let nameArr = payload.name.split('.');
			let saveKey = '';
			let len = nameArr.length;
			if (len >= 2) {
				let obj = state[nameArr[0]];
				for (let i = 1; i < len - 1; i++) {
					obj = obj[nameArr[i]];
				}
				obj[nameArr[len - 1]] = payload.value;
				saveKey = nameArr[0];
			} else {
				// 单层级变量，在state就是一个普通变量的情况
				state[payload.name] = payload.value;
				saveKey = payload.name;
			}
			// 保存变量到本地，见顶部函数定义
			saveLifeData(saveKey, state[saveKey])
		},
		updateFlush(state, newValue) {
			state.flush = newValue;
		},
		setMyState(state, newValue) { // 这是一个mutation，用于修改state
			state.vuex_tabbar = newValue; // 通过提交这个mutation，你可以改变myState的值
		},
		setDraft(state, newValue){
			state.draft = newValue;
		}
	}
})

export default store