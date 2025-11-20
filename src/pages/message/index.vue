<template>
  <view class="global-m message">
    <template v-if="noticeList.length">
      <wd-card custom-class="card-title_fs" v-for="(item, index) in noticeList" :key="index">
        <template #title>
          <view class="d-flex" style="margin-bottom: 10rpx">
            <view class="flex-1" style="font-size: 28rpx; font-weight: bold">
              {{ item.title }}
            </view>
            <view class="dot"></view>
          </view>
        </template>
        <view style="padding-bottom: 0.5rem; font-size: 22rpx">
          {{ item.content }}
        </view>
        <template #footer>
          <view class="message-footer d-flex">
            <view style="font-size: 20rpx;">
              {{ item.time }}
            </view>
            <view class="flex-1" style="font-size: 26rpx;">
              查看详情
            </view>
            <wd-icon size="16" name="arrow-right"></wd-icon>
          </view>
        </template>
      </wd-card>
    </template>

    <view v-else style="text-align: center; margin-top: 100rpx; font-size: 28rpx; color: #aaa">暂无消息通知</view>
  </view>
</template>

<script setup>
import {ref, watchEffect} from 'vue'
import { onShareAppMessage } from '@dcloudio/uni-app'

const noticeList =ref([])

watchEffect(() => {
  noticeList.value = [
    // {
    //   title: '高级账户升级成功',
    //   content: '用户您好，您的高级账户已升级成功，立即畅享20+项特权！我们 将为您提供优质会员服务...',
    //   time: '2024-10-01 13:20'
    // }
  ]
})

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})

</script>
<style>
page{
  background: rgba(247, 248, 252, 1);
}
</style>
<style scoped lang="scss">
.message{
  --wot-card-padding: 0.5rem;
  --wot-card-margin: 0;
}

</style>
<style>
.message-card_title{
  padding: 0.3rem 0 !important;
}
.dot{
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: rgba(255, 0, 0, 1);
}
.message-footer{
  color: #999;
}
</style>