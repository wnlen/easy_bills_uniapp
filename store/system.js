// store/system.js
import { defineStore } from 'pinia';

export const useSystemStore = defineStore('system', {
    unistorage: true, // 开启后对 state 的数据读写都将持久化
    state: () => ({
        flush: 0
    }),
    actions: {
        setFlush(val) {
            this.flush = val;
        }
    }
});
