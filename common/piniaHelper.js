// common/piniaHelper.js
import { useUserStore } from '@/store/user';
import { useGlobalStore } from '@/store/global';
import { useGuideStore } from '@/store/guide';
import { useDraftStore } from '@/store/draft';
import { useSystemStore } from '@/store/system';

const storeMap = {
	user: useUserStore,
	global: useGlobalStore,
	guide: useGuideStore,
	draft: useDraftStore,
	system: useSystemStore
};

/**
 * 使用示例
 const token = getPinia('user.token');
 */
export function getPinia(path) {
	if (!path) return undefined;

	const storeMap = {
		user: useUserStore(),
		global: useGlobalStore(),
		guide: useGuideStore(),
		draft: useDraftStore(),
		system: useSystemStore()
	};

	const [storeName, ...keys] = path.split('.');
	const store = storeMap[storeName];
	if (!store) return undefined;

	return keys.reduce((acc, key) => {
		if (acc === undefined || acc === null) return undefined;
		return acc[key];
	}, store);
}

/**
 * 使用示例
 setPinia({
   user: { token: 'newToken', userRole: 'D' },
   global: { tabIndex: 1 },
 });
 */
export function setPinia(payload) {
	for (const [storeName, storeData] of Object.entries(payload)) {
		const useStore = storeMap[storeName];
		if (!useStore) continue;
		const store = useStore();

		const patchData = {};

		for (const key in storeData) {
			const originValue = store[key];
			const newValue = storeData[key];

			// 处理数组合并：保留原值，更新指定项
			if (Array.isArray(originValue) && Array.isArray(newValue)) {
				const merged = [...originValue];
				newValue.forEach((partialItem, index) => {
					merged[index] = {
						...(originValue[index] || {}),
						...(partialItem || {})
					};
				});
				patchData[key] = merged;
			} else {
				patchData[key] = newValue;
			}
		}

		store.$patch(patchData);
	}
}
