<template>
  <view>
    <image :src="shareUrl" style="width: 100%;" mode="widthFix"></image>
    <view class="share-fixed">
      <view style="padding: 0 20px;" class="d-flex flex-1">
        <view class="flex-1"></view>
        <wd-button>立即打印</wd-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { ref } from 'vue'

const shareUrl = ref('')
onLoad(function(options) {
  if (options.shareUrl) {
    shareUrl.value = decodeURIComponent(options.shareUrl)
  }
})

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})


const toView = () => {

}
</script>

<style scoped lang="scss">
.share-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #fff;
  display: flex;
  align-items: center;
  z-index: 9999;
}
</style>