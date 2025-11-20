<template>
  <view class="global-m">
    <view class="more-grid">
      <view @click="toCrop(url)" v-for="(url, index) in urls" :key="index" class="more-item">
        <image :src="url" style="width: 100%;" mode="widthFix"></image>
      </view>  
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { toRouter } from '@/hooks/utils'
const urls = ref([])
onLoad( (params) => {
  urls.value = params.urls.split(',')
} )
const toCrop = (url) => {
  toRouter('/pages/cropping/index', `url=${url}`)
}

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})

</script>

<style scoped lang="scss">
.more-grid{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  margin-top: 10px;
}
</style>