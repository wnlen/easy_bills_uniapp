// store/draft.js
import { defineStore } from 'pinia';

export const useDraftStore = defineStore('draft', {
    unistorage: true, // 开启后对 state 的数据读写都将持久化
    state: () => ({
        draft: false
    }),
    actions: {
        setDraft(val) {
            this.draft = val;
        }
    }
});
