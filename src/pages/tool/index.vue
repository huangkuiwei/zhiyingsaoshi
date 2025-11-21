<template>
  <view class="index-top">
    <view class="index-header"></view>
  </view>

  <view class="global-m">
    <view @click="buyVip">
      <image style="width: 100%" mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/tool/banner.png"></image>
    </view>

    <view class="d-flex" style="font-weight: 500;font-size: 32rpx;color: #1F1F1F; padding: 20rpx 0 6rpx">
      <view>扫描服务</view>
    </view>
    <scroll-view scroll-y="true">
      <view class="tool-grid">
        <view @click="goPage(item)" class="tool-card" v-for="(item,index) in navs" :key="index">
          <wd-card custom-class="h-card mb-0">
            <view class="d-flex" style="">
              <image style="height: 66rpx; width: 66rpx;" :src="item.src"></image>
              <view style="font-weight: 500;font-size: 28rpx;color: #1F1F1F; flex-grow: 1; text-align: right; padding-right: 20rpx">
                {{ item.name }}
              </view>
              <image v-if="item.hot" class="hot" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/hot.png" mode="widthFix"></image>
            </view>
          </wd-card>
        </view>
      </view>
      <view class="d-flex" style="font-weight: 500;font-size: 32rpx;color: #1F1F1F; padding: 20rpx 0 6rpx">
        <view>图片工具</view>
      </view>
      <view class="tool-grid">
        <view @click="goPage(item)" class="tool-card" v-for="(item,index) in pictures" :key="index">
          <wd-card custom-class="h-card mb-0">
            <view class="d-flex">
              <image style="height: 66rpx; width: 66rpx;" :src="item.src"></image>
              <view style="font-weight: 500;font-size: 28rpx;color: #1F1F1F; flex-grow: 1; text-align: right; padding-right: 20rpx">
                {{ item.name }}
              </view>
              <image v-if="item.hot" class="hot" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/hot.png" mode="widthFix"></image>
            </view>
          </wd-card>
        </view>

      </view>
      <view class="d-flex" style="font-weight: 500;font-size: 32rpx;color: #1F1F1F; padding: 20rpx 0 6rpx">
        <view>PDF工具</view>
      </view>
      <view class="tool-grid">
        <view @click="goPdf(item)" class="tool-card" v-for="(item,index) in pdfs" :key="index">
          <wd-card custom-class="h-card mb-0">
            <view class="d-flex">
              <image style="height: 82rpx; width: 82rpx;" :src="item.src"></image>
              <view style="font-weight: 500;font-size: 28rpx;color: #1F1F1F; flex-grow: 1; text-align: right; padding-right: 20rpx">
                {{ item.name }}
              </view>
              <image v-if="item.hot" class="hot" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/hot.png" mode="widthFix"></image>
            </view>
          </wd-card>
        </view>
      </view>
      <view style="height: 3.8rem"></view>
    </scroll-view>
  </view>
  <NavBar :index="3"></NavBar>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from '@/section/a-navbar.vue'
import { toRouter } from '@/hooks/utils'

const navs = ref([
  {
    name: '证件扫描',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/tool/u1.png',
    index: 4,
  },
  {
    name: '文字提取',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/tool/u2.png',
    index: 5
  },
  {
    name: '文件扫描',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/tool/u2.png',
    index: 6
  },
  {
    name: '拍照计数',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/tool/u4.png',
    index: 7,
  },
  {
    name: '手写文字识别',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/tool/u5.png',
    index: 8
  },
  {
    name: '拍照翻译',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/tool/u6.png',
    index: 9
  },
  {
    name: '试卷去手写',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/tool/u7.png',
    index: 10
  },
  {
    name: '识别公式',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/tool/u8.png',
    index: 11
  },
])

const pictures = ref([
  {
    name: '图片加水印',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/tool/p1.png',
    index: 12
  },
  {
    name: '图片去水印',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/tool/p2.png',
    index: 18,
  },
  {
    name: '图片转Word',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/tool/p3.png',
    index: 14
  },
  {
    name: '图片转Excel',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/tool/p4.png',
    index: 15
  },
  {
    name: '图片转PPT',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/tool/p5.png',
    index: 17
  },
  {
    name: '图片转PDF',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/tool/p6.png',
    index: 16
  },
  {
    name: '拼图',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/tool/p7.png',
    index: 13
  },
])

const pdfs = ref([
  {
    name: 'PDF转Word',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/tool/d1.png',
    url: 'type=pdf&channel=word'
  },
  {
    name: 'PDF转Excel',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/tool/d2.png',
    url: 'type=pdf&channel=excel'
  },
  {
    name: 'PDF转PPT',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/tool/d3.png',
    url: 'type=pdf&channel=ppt'
  },
  {
    name: 'PDF转图片',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/tool/d4.png',
    url: 'type=pdf&channel=pic',
  },
  {
    name: 'PDF转长图',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/tool/d5.png',
    url: 'type=pdf&channel=longpic'
  },
])
const goPage = (item) => {
  // console.log(item);
  if (item.index === -1) {
    uni.showToast({
      title: '正在开发，敬请期待',
      icon: 'none'
    });
    return;
  }
  if( item.index === 18 ){
    toRouter('/pages/remove-watermark/index', 'type=pic&channel=18&from=tool')
    return;
  }
  toRouter('/pages/camera/index', 'tab=' + item.index + '&from=tool')
}
const goPdf = (item) => {
  toRouter('/pages/pdf-transform/index', item.url)
}

const buyVip = () => {
  toRouter('/pages/member/index')
}
</script>
<style lang="scss">
page{
  background: #F7F7F7;
}

.h-card {
  padding: 17rpx 26rpx !important;
  background: #F9FAFC !important;
  border-radius: 10rpx !important;
  width: 100% !important;
  margin: 0 !important;
  box-sizing: border-box;
  box-shadow: none !important;
}
</style>
<style scoped lang="scss">
.index-top {
  background: #F7F7F7 linear-gradient(228deg, #D5F1FD 0%, #D5F5C2 33%, #D6F985 100%) left top/100% 513rpx no-repeat;

  .index-header {
    height: 180rpx;
  }
}
.tool-grid{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20rpx;
  margin-top: 0.8rem;
  background: #ffffff;
  padding: 20rpx;
  border-radius: 10rpx;

  .d-flex {
    position: relative;
  }

  .hot {
    position: absolute;
    top: -25rpx;
    right: -30rpx;
    width: 76rpx;
  }
}
.tool-card{
  width: 315rpx;
  box-sizing: border-box;
}
</style>