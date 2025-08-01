// common/piniaHelper.js
import { useUserStore } from '@/store/user'
import { useGlobalStore } from '@/store/global'
import { useGuideStore } from '@/store/guide'
import { useDraftStore } from '@/store/draft'
import { useSystemStore } from '@/store/system'

const storeMap = {
  user: useUserStore,
  global: useGlobalStore,
  guide: useGuideStore,
  draft: useDraftStore,
  system: useSystemStore
}

/**
 * 使用示例
 const token = getPinia('user.token');
 */
export function getPinia(path) {
	const [storeName, key] = path.split('.') // 如 "user.token"

	const storeMap = {
		user: useUserStore(),
		global: useGlobalStore(),
		guide: useGuideStore(),
		draft: useDraftStore(),
		system: useSystemStore()
	}

	const store = storeMap[storeName]
	if (!store) return undefined

	return key ? store[key] : store
}

/**
 * 使用示例
 setPinia({
   user: { token: 'newToken', userRole: 'D' },
   global: { tabIndex: 1 },
 });
 */
export function setPinia(payload) {
  if (typeof payload === 'string') {
    console.error('[setPinia] 已弃用字符串参数，请使用对象形式')
    return
  }

  for (const [storeName, storeData] of Object.entries(payload)) {
    const useStore = storeMap[storeName]
    if (!useStore) {
      console.warn(`[setPinia] 未找到 store: ${storeName}`)
      continue
    }

    const store = useStore()
    Object.assign(store, storeData)
  }
}

// 兼容旧版调用方式 (可选)
export function legacySetPinia(name, value) {
	const mapping = {
		'vuex_token': {
			store: 'user',
			key: 'token'
		},
		'vuex_user': {
			store: 'user',
			key: 'user'
		},
		'vuex_userRole': {
			store: 'user',
			key: 'userRole'
		},
		'vuex_password': {
			store: 'user',
			key: 'password'
		},
		'announcement': {
			store: 'user',
			key: 'announcement'
		},
		'vuex_tabIndex': {
			store: 'global',
			key: 'tabIndex'
		},
		'vuex_tabbar': {
			store: 'global',
			key: 'tabbar'
		},
		'ImgUrl': {
			store: 'global',
			key: 'ImgUrl'
		},
		'taber': {
			store: 'global',
			key: 'taber'
		},
		'guidance': {
			store: 'guide',
			key: 'guidance'
		},
		'guidanceD': {
			store: 'guide',
			key: 'guidanceD'
		},
		'guidanceR': {
			store: 'guide',
			key: 'guidanceR'
		},
		'draft': {
			store: 'draft',
			key: 'draft'
		},
		'flush': {
			store: 'system',
			key: 'flush'
		}
	};

	const map = mapping[name];
	if (!map) {
		console.warn(`未匹配的 pinia 状态字段: ${name}`);
		return;
	}

	setPinia({
		[map.store]: {
			[map.key]: value
		}
	});
}

