<template>
  <view class="tool-page">
    <view class="index-header">
      <view class="index-title">
        <text class="welcome">工具箱</text>
      </view>
    </view>

    <view class="tool-contain">
      <view class="title">扫描服务</view>

      <view class="tool1">
        <view class="left">
          <view class="item item1" @click="goPage(navs[0])">
            <text>{{ navs[0].name }}</text>
            <image mode="widthFix" :src="navs[0].src"/>
          </view>
          <view class="item item2" @click="goPage(navs[1])">
            <text>{{ navs[1].name }}</text>
            <image mode="widthFix" :src="navs[1].src"/>
          </view>
        </view>

        <view class="right">
          <view class="item item1" @click="goPage(navs[2])">
            <text>{{ navs[2].name }}</text>
            <image mode="widthFix" :src="navs[2].src"/>
          </view>
          <view class="item item2" @click="goPage(navs[3])">
            <text>{{ navs[3].name }}</text>
            <image mode="widthFix" :src="navs[3].src"/>
          </view>
          <view class="item item3" @click="goPage(navs[4])">
            <text>{{ navs[4].name }}</text>
            <image mode="widthFix" :src="navs[4].src"/>
          </view>
        </view>
      </view>

      <view class="title">图片工具</view>

      <view class="tool2">
        <view class="line line1">
          <view class="item item1"@click="goPage(pictures[0])">
            <text>{{ pictures[0].name }}</text>
            <image mode="widthFix" :src="pictures[0].src"/>
          </view>
          <view class="item item2"@click="goPage(pictures[1])">
            <text>{{ pictures[1].name }}</text>
            <image mode="widthFix" :src="pictures[1].src"/>
          </view>
          <view class="item item3"@click="goPage(pictures[2])">
            <text>{{ pictures[2].name }}</text>
            <image mode="widthFix" :src="pictures[2].src"/>
          </view>
        </view>

        <view class="line line2">
          <view class="item item1" @click="goPage(pictures[3])">
            <text>{{ pictures[3].name }}</text>
            <image mode="widthFix" :src="pictures[3].src"/>
          </view>
          <view class="item item2" @click="goPage(pictures[4])">
            <text>{{ pictures[4].name }}</text>
            <image mode="widthFix" :src="pictures[4].src"/>
          </view>
        </view>

        <view class="line line3">
          <view class="item item1" @click="goPage(pictures[5])">
            <text>{{ pictures[5].name }}</text>
            <image mode="widthFix" :src="pictures[5].src"/>
          </view>
          <view class="item item2" @click="goPage(pictures[6])">
            <text>{{ pictures[6].name }}</text>
            <image mode="widthFix" :src="pictures[6].src"/>
          </view>
        </view>
      </view>

      <view class="title">PDF转换</view>

      <view class="tool3">
        <view class="left">
          <view class="item item1" @click="goPdf(pdfs[0])">
            <text>{{ pdfs[0].name }}</text>
            <image mode="widthFix" :src="pdfs[0].src"/>
          </view>
          <view class="item item2" @click="goPdf(pdfs[1])">
            <text>{{ pdfs[1].name }}</text>
            <image mode="widthFix" :src="pdfs[1].src"/>
          </view>
        </view>

        <view class="right">
          <view class="item item1" @click="goPdf(pdfs[2])">
            <text>{{ pdfs[2].name }}</text>
            <image mode="widthFix" :src="pdfs[2].src"/>
          </view>
          <view class="item item2" @click="goPdf(pdfs[3])">
            <text>{{ pdfs[3].name }}</text>
            <image mode="widthFix" :src="pdfs[3].src"/>
          </view>
          <view class="item item3" @click="goPdf(pdfs[4])">
            <text>{{ pdfs[4].name }}</text>
            <image mode="widthFix" :src="pdfs[4].src"/>
          </view>
        </view>
      </view>
    </view>
  </view>

  <wd-popup v-model="showFunPopup" custom-style="border-radius: 32rpx;">
    <view class="fun-list">
      <view class="item" v-for="(item, index) of dialogDatas" :key="index" @click="goPage(item)">
        <image mode="heightFix" :src="item.src"/>
        <text>{{ item.name }}</text>
      </view>
    </view>
  </wd-popup>

  <NavBar :index="3"></NavBar>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from '@/section/a-navbar.vue'
import { toRouter } from '@/hooks/utils'
import { useMessage } from 'wot-design-uni'
import { onShareAppMessage } from '@dcloudio/uni-app'

const navs = ref([
  {
    name: '证件扫描',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon7/u1.png',
    index: 4,
    hot: true,
  },
  {
    name: '识别公式',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon7/u8.png',
    index: 11
  },

  {
    name: '文件扫描',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon7/u2.png',
    index: 6
  },
  {
    name: '文字提取',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon7/u3.png',
    index: 5
  },
  {
    name: '扫描书籍等',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon7/u9.png',
    index: 0
  },
])

const pictures = ref([
  {
    name: '图片加水印',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon7/p1.png',
    index: 12
  },
  {
    name: '图片去水印',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon7/p2.png',
    index: 18,
    hot: true,
  },
  {
    name: '图片转Word',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon7/p3.png',
    index: 14
  },
  {
    name: '图片转Excel',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon7/p4.png',
    index: 15
  },
  {
    name: '图片转PPT',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon7/p5.png',
    index: 17
  },
  {
    name: '图片转PDF',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon7/p6.png',
    index: 16
  },
  {
    name: '拼图',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon7/p7.png',
    index: 13
  },
])

const pdfs = ref([
  {
    name: 'PDF转Word',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon7/d1.png',
    url: 'type=pdf&channel=word'
  },
  {
    name: 'PDF转PPT',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon7/d3.png',
    url: 'type=pdf&channel=ppt'
  },
  {
    name: 'PDF转Excel',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon7/d2.png',
    url: 'type=pdf&channel=excel'
  },
  {
    name: 'PDF转图片',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon7/d4.png',
    url: 'type=pdf&channel=pic',
    hot: true,
  },
  {
    name: 'PDF转长图',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon7/d5.png',
    url: 'type=pdf&channel=longpic'
  },
])

const dialogDatas = ref([
  {
    name: '拍照翻译',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon13/01.png',
    index: 9
  },
  {
    name: '试卷去手写',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon13/02.png',
    index: 10
  },
  {
    name: '手写文字识别',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon13/03.png',
    index: 8
  },
  {
    name: '拍照计数',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon13/04.png',
    index: 7,
    hot: true,
  },
])

const showFunPopup = ref(false)

const goPage = (item) => {
  showFunPopup.value = false

  // console.log(item);
  if (item.index === -1) {
    uni.showToast({
      title: '正在开发，敬请期待',
      icon: 'none'
    });
    return;
  }

  if (item.index === 0) {
    showFunPopup.value = true
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

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})


const buyVip = () => {
  toRouter('/pages/member/index')
}
</script>

<style scoped lang="scss">
.tool-page {
  padding-bottom: 120rpx;

  .index-header {
    background: #00D7AD;
    height: 280rpx;
    color: #FFFFFF;
    position: relative;
    background: url("https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/header-bg.png") left top/100% auto no-repeat;

    .index-title {
      position: absolute;
      left: 40rpx;
      right: 0;
      bottom: 50rpx;
      display: flex;
      flex-direction: column;
      font-size: 34rpx;
      font-weight: bold;
    }
  }

  .tool-contain {
    background: #fff;
    padding: 20rpx 40rpx;
    color: #1F1F1F;
    border-top-left-radius: 10rpx;
    border-top-right-radius: 10rpx;
    position: relative;
    top: -8rpx;

    .title {
      font-size: 32rpx;
      font-weight: bold;
      padding-bottom: 20rpx;
    }

    .tool1, .tool3 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 40rpx;

      &.tool1 {
        .right {
          .item3 {
            text {
              width: 120rpx;
            }
          }
        }
      }

      &.tool3 {
        .left {
          .item2 {
            text {
              left: 26rpx !important;
            }
          }
        }

        .right {
          .item {
            text {
              left: 26rpx !important;
            }
          }
        }
      }

      .left, .right {
        width: 49%;
        display: flex;
        flex-direction: column;
        gap: 20rpx;

        &.left {
          .item1 {
            text {
              top: 34rpx;
              left: 0;
              right: 0;
              text-align: center;
            }
          }

          .item2 {
            text {
              top: 0;
              bottom: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              left: 40rpx;
              text-align: center;
            }
          }
        }

        &.right {
          .item {
            text {
              top: 0;
              bottom: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              left: 40rpx;
              text-align: center;
            }

            &.item3 {
              text {
                text-align: left;
                text-align-last: left;
              }
            }
          }
        }

        .item {
          position: relative;

          text {
            position: absolute;
            font-size: 28rpx;
            font-weight: bold;
          }

          image {
            width: 100%;
          }
        }
      }
    }

    .tool2 {
      display: flex;
      flex-direction: column;
      gap: 20rpx;
      margin-bottom: 40rpx;

      .line {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &.line1 {
          .item {
            width: 31%;

            text {
              left: 0;
              right: 0;
              text-align: center;
              top: 30rpx;
            }
          }
        }

        &.line2 {
          .item {
            width: 49%;
          }

          text {
            top: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            left: 24rpx;
          }
        }

        &.line3 {
          .item {
            width: 49%;

            text {
              top: 0;
              bottom: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              left: 24rpx;
            }
          }
        }

        .item {
          position: relative;

          text {
            position: absolute;
            font-size: 28rpx;
            font-weight: bold;
          }

          image {
            width: 100%;
          }
        }
      }
    }
  }
}

.fun-list {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30rpx;
  width: 600rpx;
  padding: 60rpx 0 50rpx;

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    image {
      height: 60rpx;
      margin-bottom: 20rpx;
    }

    text {
      font-size: 24rpx;
      color: #1f1f1f;
    }
  }
}
</style>