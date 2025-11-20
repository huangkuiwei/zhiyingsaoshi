<template>
  <web-view :src="src"></web-view>
</template>

<script>
export default {
  name: 'webview',

  data() {
    return {
      src: '',
    };
  },

  onLoad(options) {
    this.src = options.src && decodeURIComponent(options.src);
  },

  onShareAppMessage() {
    return {
      title: '高清电子文档一键转换',
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
      path: '/pages/index/index',
    };
  },
};
</script>

<style lang="scss"></style>
