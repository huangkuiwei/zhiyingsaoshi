<template>
  <view class="ca-tip">
    <view class="ca-tip-box">
      <image
          class="close"
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/close.png"
          @click="startPic"
      />

      <view class="ca-tip-content">
        <view class="ca-tip-title">
          ——  A4纸实例  ——
        </view>
        <view class="tip-img" style="margin: 0 1rem;">
          <image mode="heightFix" :src="imgSrc" />
        </view>
      </view>

      <view class="ca-tip-bottom">
        <view class="tip-text">
          <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/tip-icon.png"/>
          <text>证件图片仅保存在手机本地，不会上传到服务器，不被识别和使用。</text>
        </view>

        <view @click="startPic" class="tip-action">
          <wd-button>开始制作</wd-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { cerIndex, tState, imgSrc, masterState } from './camera'

const startPic = () => {
  tState.value = false;
  masterState.value = true
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
  width: 450rpx;
  position: relative;

  .close {
    position: absolute;
    top: 30rpx;
    right: 30rpx;
    width: 30rpx;
  }
}

.ca-tip-content{
  border-radius: 20rpx 20rpx 0 0;
  padding: 40rpx 0 24rpx;
  background: #F0F5F8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ca-tip-bottom {
  border-radius: 0 0 20rpx 20rpx;
  background: #ffffff;
  padding: 42rpx 22rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ca-tip-title{
  text-align: right;
  --wot-button-small-height: 20px;
  --wot-button-primary-bg-color: rgba(128, 128, 128, 1);
  font-size: 18rpx;
  margin-bottom: 27rpx;
}

.tip-img {
  image {
    height: 246rpx;
  }
}

.tip-action{
  --wot-button-primary-bg-color: rgba(35, 156, 247, 1);

  button {
    width: 320rpx;
  }
}
.tip-text{
  border-radius: 0 0 5px 5px;
  margin-bottom: 34rpx;
  display: flex;
  color: #808080;
  font-size: 18rpx;

  image {
    width: 34rpx;
    margin-right: 2rpx;
  }
}
</style>