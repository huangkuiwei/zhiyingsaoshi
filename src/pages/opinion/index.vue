<template>
  <view class="global-m">
    <textarea placeholder="请输入您要反馈的意见或建议（5-500字以内）" v-model="content"></textarea>
    <view style="height: 0.8rem;"></view>
    <wd-card custom-class="h-card">
      <view>
        <view style="margin-bottom: 0.6rem; color: #888">请提供问题的截图或图片（选填）</view>
        <wd-upload
            fileType="image"
            v-model:file-list="fileList"
            :limit="5"
            :showLimitNum="true"
            :sourceType="['album']"
            name="file"
            :header="{
              token: token
            }"
            action="https://smapi.wiiken.cn/api/global/fileupload/upload"
        >
          <view class="upload-box">+</view>
        </wd-upload>
      </view>
    </wd-card>
    <view class="font-tip">
      您的反馈我们会尽快解决，但无法保证每一条都能及时受理。如果有紧急咨询， 请直接拨打客服电话：400-000-0000
    </view>
  </view>
  <view class="opinion-btn">
    <view style="padding: 0 1rem;">
      <wd-button block @click="submit">
        提 交
      </wd-button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import $http from '@/hooks/http'
import { onShareAppMessage } from '@dcloudio/uni-app'

const content = ref('')
const fileList = ref([])
const token = ref(uni.getStorageSync('toolsToken'))

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})


const submit = () => {
  if (!content.value) {
    uni.showToast({
      title: '意见不能为空',
      icon: 'none',
    })

    return
  }

  let imgUrls = fileList.value.map(file => {
    let res = JSON.parse(file?.response)
    return res?.data
  }).filter(item => item)

  uni.showLoading({
    title: '提交中...',
    mask: true,
  })

  $http.post('api/user/profile/suggestion/add', {
    content: content.value,
    img_urls: imgUrls,
  }).then(() => {
    uni.showToast({
      title: '意见提交成功',
      icon: 'success'
    })

    content.value = ''
    fileList.value = []
  }).catch(() => {
    uni.hideLoading()
  })
}
</script>
<style>
page{
  background: rgba(246, 247, 251, 1);
}
</style>
<style scoped lang="scss">
.global-m{
  --wot-card-padding: 0.6rem;
  --wot-card-margin: 0;
}
.opinion-btn{
  --wot-button-primary-bg-color: rgba(35, 156, 247, 1);
  --wot-button-primary-color: rgba(255, 255, 255, 1);
  --wot-button-medium-fs: 1.4rem;
  --wot-button-medium-padding: 1.5rem 0;
}
.opinion-btn{
  position: fixed;
  left: 0;
  bottom: 50px;
  width: 100vw;
}

textarea {
  background: #FFFFFF;
  width: calc(100% - 40rpx);
  height: 400rpx;
  border-radius: 16rpx;
  padding: 20rpx;
  font-size: 28rpx;
}

.upload-box {
  width: 160rpx;
  height: 160rpx;
  background: #ffffff;
  border-radius: 16rpx;
  border: 2rpx solid #dddddd;
  font-size: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dddddd;
}

.font-tip {
  font-size: 22rpx;
}
</style>