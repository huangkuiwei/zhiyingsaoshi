<template>
  <view>
    <view class="file-title">
    {{prefix}}
  </view>
  <view>
    <view>
      <image :src="fileUrl" style="width: 100%" mode="widthFix" />
    </view>
  </view>
  <wd-gap height="60px"></wd-gap>
  <view class="file-fix">
    <view style="padding: 0 1.5rem;" class="d-flex flex-1">
      <view class="d-flex-column-center">
        <wd-icon name="camera" size="20px"></wd-icon>
        <view style="font-size: 0.8rem;">
          添加
        </view>
      </view>
      <view @click="toOss" style="margin-left: 2rem;" class="d-flex-column-center">
        <wd-icon name="download1" size="20px"></wd-icon>
        <view style="font-size: 0.8rem;">
          保存
        </view>
      </view>
      <view class="flex-1"></view>
      <wd-button @click="shareShow = true" size="large">分享</wd-button>
    </view>
  </view>
  <Share :show="shareShow"></Share>
  </view>
</template>

<script lang="ts" setup>
import { getFile, toOssImage } from './index'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { shareShow} from '@/section/share'
import Share from '@/section/share.vue'
import { ref } from 'vue'

const fileUrl = ref(''), prefix = ref(''), url = ref('')

onLoad( (options) => {
  url.value = options.path
  if(!options.path){
    return;
  }
  getFile(options.path).then( res => {
    fileUrl.value = 'data:image/jpeg;base64,' + res.data.data
    prefix.value = res.data.prefix
  } )
} )

const toOss = () => {
  toOssImage(url.value).then(() => {
    uni.showToast({ title: '上传成功，路径默认为根目录', icon: 'none' })
  })
}

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})


</script>
<style lang="scss">
page{
  background: #F7F8FC;
}
</style>
<style scoped lang="scss">
.file-title{
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  font-weight: bold;
}
.file-fix{
  height: 50px;
  display: flex;
  align-items: center;
  position: fixed;
  width: 100vw;
  background: #fff;
  border-top: 1px solid #eee;
  z-index: 9;
  left: 0;
  bottom: 0;
}
</style>