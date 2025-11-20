<template>
  <view class="preview-page">
    <view class="img-box" v-if="type === 'img'">
      <!--<view class="title">{{ title }}</view>-->
      <image mode="widthFix" :src="previewFileUrl" />
    </view>
  </view>
</template>

<script setup>
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { ref } from 'vue'

let previewFileUrl = ref([])
let type = ref(null)
let title = ref(null)

onLoad((options) => {
  previewFileUrl.value = decodeURIComponent(options.previewFileUrl)
  type.value = options.type
  title.value = options.title
})

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})

</script>

<style lang="scss">
.preview-page {
  .img-box {
    padding: 30rpx;

    .title {
      text-align: center;
      font-weight: bold;
      font-size: 32rpx;
      width: 80%;
      margin: 0 auto 40rpx;
      word-break: break-all;
    }

    image {
      width: 100%;
    }
  }
}
</style>