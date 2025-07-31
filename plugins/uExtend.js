// plugins/uExtend.js
import { legacySetPinia, setPinia, getPinia } from '@/common/piniaHelper'

export default {
  install(app) {
    const defineU = () => {
      const u = app.config.globalProperties.$u || {}

      Object.assign(u, {
        vuex: legacySetPinia,
        setPinia,
        getPinia
      })

      app.config.globalProperties.$u = u
      console.log('[uExtend] $u.vuex 成功注入', u)
    }

    // 主动执行一次（同步场景）
    defineU()

    // 监听 App 启动后再执行（防止小程序异步覆盖）
    setTimeout(() => {
      defineU()
    }, 100)

    // 再来一次保险挂载（极端情况）
    if (typeof uni !== 'undefined') {
      uni.ready?.(() => defineU())
    }
  }
}