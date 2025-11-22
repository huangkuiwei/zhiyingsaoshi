<template>
  <view style="color: #fff; padding: 1rem;">
    <view class="d-flex" style=" padding-bottom: 50rpx">
      <view class="flex-1" style="font-size: 34rpx; padding-left: 20rpx; font-weight: bold;">选择工具</view>
      <view @click="ustate=false">
        <wd-icon name="close" size="16" color="#fff"></wd-icon>
      </view>
    </view>

    <template v-if="toolType === 2">
      <view style="padding: 0 30rpx 40rpx; font-size: 28rpx; color: #ffffff;">
        扫描服务
      </view>
      <view class="util-grid" style="border-bottom: 2rpx solid #1C1C1C; margin-bottom: 20rpx">
        <view @click="toCamera(item)" v-for="(item,index) in lists" :key="index" class="util-grid-li d-flex-column-center">
          <image :src="item.icon" mode="widthFix" />
          <view style="margin-top: 5px;">
            {{ item.name }}
          </view>
        </view>
      </view>
      <view style="padding: 0 30rpx 40rpx; font-size: 28rpx; color: #ffffff;">
        图片转换
      </view>
      <view class="util-grid" style="border-bottom: 2rpx solid #1C1C1C; margin-bottom: 20rpx">
        <view @click="toCamera(item)" v-for="(item,index) in picts" :key="index" class="util-grid-li d-flex-column-center">
          <image :src="item.icon" mode="widthFix" />
          <view style="margin-top: 5px;">
            {{ item.name }}
          </view>
        </view>
      </view>
    </template>

    <template v-if="toolType === 1">
      <view style="padding: 0 30rpx 40rpx; font-size: 28rpx; color: #ffffff;">
        pdf转换
      </view>
      <view class="util-grid">
        <view v-for="(item,index) in pdfs" :key="index" class="util-grid-li d-flex-column-center" @click="goPdf(item)">
          <image :src="item.icon" mode="widthFix" />
          <view style="margin-top: 5px;">
            {{ item.name }}
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ustate, tab } from './camera'
import { toRouter } from '@/hooks/utils'
const props = defineProps(['toolType'])
const emits = defineEmits(['changeTab'])

const lists = ref([
  { name: '证件扫描', icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/camera/t1.png', index: 4 },
  { name: '文字提取', icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/camera/t2.png', index: 5 },
  { name: '文件扫描', icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/camera/t3.png', index: 6 },
  { name: '拍照计数', icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/camera/t4.png', index: 7 },
  { name: '手写文字识别', icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/camera/t5.png', index: 8 },
  { name: '拍照翻译', icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/camera/t6.png', index: 9 },
  { name: '试卷去手写', icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/camera/t7.png', index: 10 },
  { name: '识别公式', icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/camera/t8.png', index: 11 },
])

const picts = ref([
  { name: '图片加水印', icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/camera/g1.png', index: 12 },
  { name: '图片去水印', icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/camera/g2.png', index: 18 },
  { name: '图片转Word', icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/camera/g3.png', index: 14 },
  { name: '图片转Excel', icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/camera/g4.png', index: 15 },
  { name: '图片转PPT', icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/camera/g5.png', index: 17 },
  { name: '图片转PDF', icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/camera/g6.png', index: 16 },
  { name: '拼图', icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/camera/g7.png', index: 13 },
])

const pdfs = ref([
  { name: 'PDF转Word', icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com//zhiyingsaoshi/camera/d1.png', url: 'type=pdf&channel=word' },
  { name: 'PDF转表格', icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/camera/d2.png', url: 'type=pdf&channel=excel' },
  { name: 'PDF转图片', icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/camera/d3.png', url: 'type=pdf&channel=ppt' },
  { name: 'PDF转PPT', icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/camera/d4.png', url: 'type=pdf&channel=pic' },
  { name: 'PDF转长图', icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/camera/d5.png', url: 'type=pdf&channel=longpic' },
])

const toCamera = (item) => {
  ustate.value = false
  emits('changeTab', item)
}

const goPdf = (item) => {
  ustate.value = false
  emits('changeTab', item)
}
</script>

<style scoped lang="scss">
.util-grid{
  display: flex;
  flex-wrap: wrap;

  .util-grid-li {
    font-size: 20rpx;
    width: 20%;
    margin-bottom: 40rpx;

    image {
      width: 94rpx;
      margin-bottom: 10rpx;
    }
  }
}
</style>