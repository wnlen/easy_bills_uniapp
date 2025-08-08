// store/guide.js
import { defineStore } from "pinia";

export const useGuideStore = defineStore("guide", {
  unistorage: true, // 开启后对 state 的数据读写都将持久化
  state: () => ({
    guidanceD: null,
    guidanceR: null,
    guidance: 0,
    draft: false,
  }),
  actions: {
    setDraft(val) {
      this.draft = val;
    },
    setGuidanceD(val) {
      this.guidanceD = val;
    },
    setGuidanceR(val) {
      this.guidanceD = val;
    },
  },
});
