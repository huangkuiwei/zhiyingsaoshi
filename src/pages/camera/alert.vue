<template>
  <view class="ca-tip">
    <view class="ca-tip-box">
      <image
          class="close"
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/close.png"
          @click="wState = false"
      />

      <view class="ca-tip-content">
        <view class="tip-img">
          <image :src="fileSrc" mode="heightFix" />
        </view>

        <view class="ca-tip-bottom">
          <view style="height: 30px; padding: 10rpx 0 !important;" class="d-flex-center">
            {{fileTipName}}
          </view>
          <view style="font-size: 0.7rem; padding: 10rpx 0 !important;" class="d-flex-center">
            {{ fileTip }}
          </view>
          <view class="d-flex-center alert-btn" style="padding: 20rpx 0 !important">
            <wd-button @click="close" size="large">{{fileText}}</wd-button>
          </view>
          <view @click="onLocalSet" style="font-size: 0.8rem; padding: 0 !important" class="d-flex-center">
            不再提醒
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { fileSrc, fileTipName, fileTip, fileText, tab, localSet, wState } from './camera'
import { toRouter } from '@/hooks/utils'

const onLocalSet = () => {
  // console.log( tab.value );
  wState.value = false
  localSet.value['tab' + tab.value] = true
  uni.setStorageSync('identify', JSON.stringify( localSet.value ))
}

const close = () => {
  // 拍照计数，点击选择技术类型
  if (tab.value === 7) {
    toRouter('/pages/detect/index')
  }

  wState.value = false
}
</script>

<style scoped lang="scss">
.ca-tip{
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.ca-tip-box{
  width: 480rpx;
  position: relative;

  .close {
    position: absolute;
    top: 30rpx;
    right: 30rpx;
    width: 30rpx;
  }
}
.ca-tip-content{

}

.ca-tip-bottom {
  border-radius: 0 0 20rpx 20rpx;
  background: #ffffff;
  padding: 20rpx 46rpx 38rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tip-img {
  border-radius: 20rpx 20rpx 0 0;
  padding: 80rpx 0 0 0;
  background: #F0F5F8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  image {
    height: 270rpx;
  }
}

.alert-btn{
  padding: 1rem 0;
  --wot-button-primary-bg-color: rgba(35, 156, 247, 1);
}
</style>