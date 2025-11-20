<template>
  <view class="detect-view-page">
    <view class="count">数量：{{ count }}</view>

    <view class="img-box">
      <image :src="imgUrl" style="width: 100%;" mode="widthFix" />

      <view class="text-list">
        <view
            class="text-item"
            v-for="(item, index) of textList"
            :key="index"
            :style="textPositionStyle(item.range)"
        >
          <text user-select>{{ item.index }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import $http from '@/hooks/http'

const imgUrl = ref("");
const radio = ref(null)
const textList = ref([])
const count = ref(0)

let textPositionStyle = computed(() => {
  return (range) => {
    return {
      top: range.top * radio.value + 'px',
      left: range.left * radio.value + 'px'
    }
  }
})

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})


onLoad(async (options) => {
  if (!options.url) {
    return
  }

  uni.showLoading({
    title: '正在计数'
  })

  getImageInfo(options.url)
  imgUrl.value = options.url;

  let res = await $http.upload('api/global/fileupload/upload', imgUrl.value).catch(() => {})

  if (res?.data) {
    let res2 = await $http.post('api/user/tools/scan/photo_counting', { img_url: res.data }).catch(() => {})
    if (res2?.data) {
      count.value = res2.data.count
      textList.value = res2.data.results || []
    }
  }

  uni.hideLoading()
});

const getImageInfo = (filePath) => {
  uni.getImageInfo({
    src: filePath,
    success: (res) => {
      let windowWidth = uni.getWindowInfo().windowWidth
      radio.value = windowWidth * (700 / 750) / res.width
    },
  });
}
</script>

<style scoped lang="scss">
.detect-view-page {
  .count {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx 0;
  }

  .img-box {
    width: 700rpx;
    margin: 0 auto;
    display: flex;
    position: relative;

    .text-list {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      width: 100%;
      height: 100%;

      .text-item {
        position: absolute;
        line-height: 1;
        white-space: nowrap;
        border: 1px solid #aaa;
        padding: 2rpx 4rpx;
        color: #ffffff;
        background: rgba(0, 0, 0, .5);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24rpx;
        height: 24rpx;
        font-size: 18rpx;
        border-radius: 50%
      }
    }
  }
}
</style>