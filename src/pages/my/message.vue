<template>
  <view class="message-my">
    <wd-message-box selector="wd-message-box-slot">
      <view class="message-content">
        <!--<view class="message-img">-->
        <!--  <image style="width: 180px;" mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/my/huojian.png"></image>-->
        <!--</view>-->
        <!--<view class="mc-title">-->
        <!--  发现新版本-->
        <!--</view>-->
        <!--<view style="margin: 0.4rem 0 1rem 0;">V1.001.02</view>-->
        <!--<view class="message-li d-flex">-->
        <!--  <view class="m-dot"></view>-->
        <!--  <view>部分界面优化升级</view>-->
        <!--</view>-->
        <!--<view class="message-li d-flex">-->
        <!--  <view class="m-dot"></view>-->
        <!--  <view>优化功能升级</view>-->
        <!--</view>-->
        <!--<view style="margin-top: 1rem;">-->
        <!--  <wd-button block @click="toMsg">-->
        <!--    立 即 体 验-->
        <!--  </wd-button>-->
        <!--</view>-->
        <!--<view style="margin-top: 0.6rem;" @click="toMsg">-->
        <!--  忽略本次更新-->
        <!--</view>-->
        <view class="title">版本升级</view>
        <view style="margin-top: 330rpx; font-size: 32rpx">已是最新版本</view>
      </view>
    </wd-message-box>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useMessage } from '/node_modules/wot-design-uni'

const message = useMessage('wd-message-box-slot')
const openMessage = () => {
  message.alert({})
}

const toMsg = (e) => {
  message.close();
}

defineExpose({
  openMessage
})
</script>

<style scoped lang="scss">
.mc-title{
  font-size: 1.1rem;
  color: #222;
  margin-top: 1rem;
}
.message-li{
  margin-top: 0.5rem;
  text-align: left;
  font-size: 0.85rem;
  color: #222;
}
.message-img{
  margin-top: -80px;
}
.m-dot{
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(35, 156, 247, 1);
  margin-right: 0.4rem;
}

.message-content {
  .title {
    position: absolute;
    top: 100rpx;
    left: 60rpx;
    color: #08C39F;
    font-size: 54rpx;
    font-weight: bold;
  }
}
</style>