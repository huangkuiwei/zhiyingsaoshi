<template>
  <view class="text-extraction-page">
    <image :src="imgUrl" style="width: 100%;" mode="widthFix" />

    <view class="text-list">
      <view
          class="text-item"
          v-for="(item, index) of textList"
          :key="index"
          :style="textPositionStyle(item.range, item.text)"
      >
        <text user-select>{{ item.text }}</text>
      </view>
    </view>
  </view>
  <view class="extra-fix">
    <!--<view class="extra-title"> 轻触文字可编辑 </view>-->
    <!--<view class="box">-->
    <!--  <view contenteditable="true" v-for="(item, index) in lists" :key="index">-->
    <!--    {{ item.DetectedText }}-->
    <!--  </view>-->
    <!--</view>-->
    <view
        class="d-flex"
        style="height: 50px; padding: 0 1.2rem; border-top: 1px solid #eee"
    >
      <view @click="copyText" class="d-flex-column-center">
        <image
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/my/copy.png"
            style="height: 20px"
            mode="heightFix"
        />
        <view style="font-size: 0.85rem">复制全部文本</view>
      </view>
      <view class="flex-1"></view>
      <!--<wd-button @click="toWord">导出Word</wd-button>-->
    </view>
  </view>
  <wd-toast />
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { useToast } from '/node_modules/wot-design-uni'
import { toRouter,toSwich } from '@/hooks/utils'
import $http from '@/hooks/http'
const toast = useToast()

const imgUrl = ref("");
const lists = ref([]);
let copyTxt = "";
let shareUrl = ref('');
const radio = ref(null)
let apiUrl = ref('')

const textList = ref([])

let textPositionStyle = computed(() => {
  return (range, text = '') => {
    let matchText = text.match(/[a-zA-Z\d]+/g) || []
    let matchTextLength = matchText.join('').length
    let length = text.length - matchTextLength / 2.1

    let fontSize = Math.floor((range.width * radio.value) / length) + 'px'

    return {
      top: range.top * radio.value + 'px',
      left: range.left * radio.value + 'px',
      width: range.width * radio.value + 'px',
      fontSize
    }
  }
})

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})


onLoad(async (options) => {
  if (options.tab === '5') {
    uni.setNavigationBarTitle({
      title: '文字提取'
    })

    apiUrl.value = 'api/user/tools/scan/text_extraction'
  } else if (options.tab === '8') {
    uni.setNavigationBarTitle({
      title: '手写文字识别'
    })

    apiUrl.value = 'api/user/tools/scan/handwrite_extraction'
  }

  if (!options.url) {
    return
  }

  uni.showLoading({
    title: '正在提取'
  })

  getImageInfo(options.url)
  imgUrl.value = options.url;

  let res = await $http.upload('api/global/fileupload/upload', imgUrl.value).catch(() => {})

  if (res?.data) {
    let res2 = await $http.post(apiUrl.value, { img_url: res.data }).catch(() => {})
    if (res2?.data?.text_info?.[0]) {
      let result = res2?.data?.text_info
      textList.value = result

      textList.value.forEach(item => {
        copyTxt += item.text + '\n'
      })
    }
  }

  uni.hideLoading()
});

const getImageInfo = (filePath) => {
  uni.getImageInfo({
    src: filePath,
    success: (res) => {
      let windowWidth = uni.getWindowInfo().windowWidth
      radio.value = windowWidth * (700 / 750) / res.width
    },
  });
}

const copyText = () => {
  uni.setClipboardData({
    data: copyTxt,
    success: () => {
      uni.showToast({
        title: "复制成功",
        icon: "none",
      });
    },
    fail: (err) => {
      uni.showToast({
        title: "复制失败",
        icon: "none",
      });
      console.error(err);
    },
  });
};

const toWord = () => {
  let detail = [];
  lists.value.map((v) => {
    detail.push({
      text: v.DetectedText,
      type: 'paragraph'
    })
  })
  uni.request({
    url: '/api/npoi/picture/word',
    method: 'POST',
    data: {
      details: detail,
      cover: uni.getStorageSync('$ossUrl') +shareUrl.value,
      username: uni.getStorageSync('username'),
      shareUrl: shareUrl.value.replace(uni.getStorageSync('$ossUrl'),'')
    },
    success: (res) => {
      uni.hideLoading()
      if( res.data.code === 200 ){
        uni.showToast({
          title: '保存成功',
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          toSwich('/pages/document/index')
        }, 2000)
      }else{
        uni.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 2000
        })
      }
    },
    fail: (res) => {
      uni.hideLoading()
      console.log(res);
      uni.showToast({
        title: '保存失败',
        icon: 'none',
        duration: 2000
      })
    },
  })
}
</script>

<style scoped lang="scss">
.text-extraction-page {
  width: 700rpx;
  margin: 20rpx auto 0;
  display: flex;
  position: relative;

  .text-list {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;

    .text-item {
      position: absolute;
      line-height: 1;
      white-space: nowrap;
      border: 1px solid #aaa;
      padding: 2rpx 4rpx;
      color: #ffffff;
      background: rgba(0, 0, 0, .5);
    }
  }
}

.extra-fix {
  position: fixed;
  width: 100vw;
  left: 0;
  bottom: 0;
  border-radius: 10px 10px 0 0;
  background: #fff;
  .box {
    padding: 1rem;
    min-height: calc(100vh - 430px);
    max-height: calc(100vh - 430px);
    overflow: auto;
  }
  .extra-title {
    height: 2rem;
    background: #e6e6e6;
    line-height: 2rem;
    padding: 0 1rem;
    color: #888;
    border-radius: 10px 10px 0 0;
  }
}
</style>