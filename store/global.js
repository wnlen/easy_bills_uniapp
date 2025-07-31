// store/global.js
import { defineStore } from 'pinia'
import apiConfig from '@/common/http.api.js'

let ImgUrl = 'https://res-oss.elist.com.cn'

// #ifdef MP-WEIXIN
const accountInfo = uni.getAccountInfoSync()
const envVersion = accountInfo.miniProgram.envVersion

if (envVersion === 'develop') {
  ImgUrl = apiConfig.develop.api_host
} else if (envVersion === 'trial') {
  ImgUrl = apiConfig.trial.api_host
} else if (envVersion === 'release') {
  ImgUrl = apiConfig.release.api_host
}
// #endif

export const useGlobalStore = defineStore('global', {
  persist: {
  	enabled: true,
  	strategies: [{
  		key: 'global', // 本地存储的 key
  		storage: {
  			getItem: (key) => uni.getStorageSync(key),
  			setItem: (key, value) => uni.setStorageSync(key, value),
  			removeItem: (key) => uni.removeStorageSync(key),
  		}
  	}]
  },
  state: () => ({
    tabIndex: 0,
    version: '1.0.0',
    taber: 0,
    ImgUrl,
    tabbar: [
      {
        iconPath: '/static/images/tab/tab-home.png',
        selectedIconPath: '/static/images/tab/tab-home-active.png',
        text: '首页',
        counts: '',
        pagePath: '/pages/index/index',
        customIcon: false,
      },
      {
        iconPath: '/static/images/tab/tab-list.png',
        selectedIconPath: '/static/images/tab/tab-list-active.png',
        text: '查单',
        midButton: true,
        pagePath: '/pages/list/list'
      },
      {
        iconPath: '/static/images/tab/message-out.png',
        selectedIconPath: '/static/images/tab/message-blur.png',
        text: '消息',
        count: 0,
        midButton: true,
        pagePath: '/pages/message/message'
      },
      {
        iconPath: '/static/images/tab/tab-my.png',
        selectedIconPath: '/static/images/tab/tab-my-active.png',
        text: '我的',
        pagePath: '/pages/user/index'
      }
    ]
  }),
  actions: {
    setTabIndex(index) {
      this.tabIndex = index
    },
    setTabbar(newVal) {
      this.tabbar = newVal
    }
  }
})