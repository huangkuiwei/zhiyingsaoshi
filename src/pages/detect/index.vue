<template>
  <view class="global-m">
    <view style="margin-bottom:20px; font-weight: bold">工地计数</view>
    <view class="detect-m">
      <view @click="tocheck(item)" class="detect-li" v-for="item in list1" :key="item.name">
        <image :src="item.url" style="width: 75%;" mode="widthFix" />
        <view class="d-flex-center" style="padding:  20rpx 0 !important; font-size: 26rpx">
          {{item.name}}
        </view>
        <view class="detect-count">
          <view v-if="item.checked">
            <wd-icon color="#00D7AD" name="check-circle-filled" size="22px"></wd-icon>
          </view>
        </view>
      </view>
    </view>
    <view style="margin:20px 0; font-weight: bold">通用计数</view>
    <view class="detect-m">
      <view @click="tocheck(item)" class="detect-li" v-for="item in list2" :key="item.name">
        <image :src="item.url" style="width: 75%;" mode="widthFix" />
        <view class="d-flex-center" style="padding:  20rpx 0 !important; font-size: 26rpx">
          {{item.name}}
        </view>
        <view class="detect-count">
          <view v-if="item.checked">
            <wd-icon color="#00D7AD" name="check-circle-filled" size="22px"></wd-icon>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onShareAppMessage } from '@dcloudio/uni-app'
const list1 = ref([
  { name: '钢管', checked: false, count: 0, url: 'https://yonganpicture.oss-cn-shenzhen.aliyuncs.com/icons/detect1.png' },
  { name: '方管', checked: false, count: 0, url: 'https://yonganpicture.oss-cn-shenzhen.aliyuncs.com/icons/detect2.png' },
  { name: '钢筋', checked: false, count: 0, url: 'https://yonganpicture.oss-cn-shenzhen.aliyuncs.com/icons/detect3.png' },
  { name: '圆木', checked: false, count: 0, url: 'https://yonganpicture.oss-cn-shenzhen.aliyuncs.com/icons/detect4.png' },
  { name: '方木', checked: false, count: 0, url: 'https://yonganpicture.oss-cn-shenzhen.aliyuncs.com/icons/detect5.png' }
])
const list2 = ref([
  { name: '水果', checked: false, count: 0, url: 'https://yonganpicture.oss-cn-shenzhen.aliyuncs.com/icons/tongyong1.png' },
  { name: '颗粒', checked: false, count: 0, url: 'https://yonganpicture.oss-cn-shenzhen.aliyuncs.com/icons/tongyong2.png' },
  { name: '卷', checked: false, count: 0, url: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon4/tongyong2.png' },
  { name: '瓶子', checked: false, count: 0, url: 'https://yonganpicture.oss-cn-shenzhen.aliyuncs.com/icons/tongyong4.png' },
  { name: '药丸', checked: false, count: 0, url: 'https://yonganpicture.oss-cn-shenzhen.aliyuncs.com/icons/tongyong5.png' }
])

const tocheck = (item) => {
  item.checked =!item.checked
  const arr1 = list1.value.filter(i => i.checked)
  const arr2 = list2.value.filter(i => i.checked)
  getApp().globalData.detects = [...arr1,...arr2]

  setTimeout(() => {
    uni.navigateBack()
  }, 500)
}

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})

</script>

<style>
page {
  background: #fff;
}
</style>

<style scoped lang="scss">
.detect-m{
  display: flex;
  flex-wrap: wrap;
}
.detect-li{
  position: relative;
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.detect-count{
  position: absolute;
  right: 5px;
  bottom: 30px;
}
</style>