<template>
  <view class="preview">
    <web-view :src="url"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      url: "",
    };
  },
  onLoad(option) {
    this.url = option.path;
  },
};
</script>

<style>
.preview {
  width: 100%;
  height: 100%;
}
</style>
