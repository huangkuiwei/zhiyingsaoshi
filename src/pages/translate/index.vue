<template>
  <view class="translate-page">
    <view class="language">
      <picker :range="fromLang.map(item => item.name)" :value="fromIndex" @change="onFromLangChange">
        <view>
          <text>{{fromLang[fromIndex].name}}</text>
          <text style="font-size: 20rpx; padding-left: 10rpx">﹀</text>
        </view>
      </picker>
      <text class="arrow">→</text>
      <picker :range="toLang.map(item => item.name)" :value="toIndex" @change="onToLangChange">
        <view>
          <text>{{toLang[toIndex].name}}</text>
          <text style="font-size: 20rpx; padding-left: 10rpx">﹀</text>
        </view>
      </picker>
    </view>

    <view class="url-list">
      <view class="more-item">
        <image :src="url" mode="widthFix"></image>
      </view>
    </view>

    <!--<view class="bottom-options">-->
    <!--  <wd-button @click="save">保存</wd-button>-->
    <!--</view>-->
  </view>
</template>

<script lang="ts" setup>
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { ref } from 'vue'
import $http from '@/hooks/http'
import { toSwich } from '@/hooks/utils'

const url = ref(null)
const fromLang = ref([
  {
    name: '自动识别',
    value: 'auto',
  },
  {
    name: '英语',
    value: 'en',
  },
  {
    name: '中文',
    value: 'zh',
  },
  {
    name: '日语',
    value: 'jp',
  },
  {
    name: '韩语',
    value: 'kor',
  },
  {
    name: '葡萄牙语',
    value: 'pt',
  },
  {
    name: '法语',
    value: 'fra',
  },
  {
    name: '德语',
    value: 'de',
  },
  {
    name: '意大利语',
    value: 'it',
  },
  {
    name: '西班牙',
    value: 'spa',
  },
  {
    name: '俄语',
    value: 'ra',
  },
  {
    name: '荷兰语',
    value: 'nl',
  },
  {
    name: '马来语',
    value: 'may',
  },
  {
    name: '丹麦语',
    value: 'dan',
  },
  {
    name: '瑞典语',
    value: 'swe',
  },
  {
    name: '印尼语',
    value: 'id',
  },
  {
    name: '波兰语',
    value: 'pl',
  },
  {
    name: '罗马尼亚语',
    value: 'rom',
  },
  {
    name: '土耳其语',
    value: 'tr',
  },
  {
    name: '希腊语',
    value: 'el',
  },
  {
    name: '匈牙利语',
    value: 'hu',
  }
])
const toLang = ref([
  {
    name: '英语',
    value: 'en',
  },
  {
    name: '中文',
    value: 'zh',
  },
  {
    name: '日语',
    value: 'jp',
  },
  {
    name: '韩语',
    value: 'kor',
  },
  {
    name: '葡萄牙语',
    value: 'pt',
  },
  {
    name: '法语',
    value: 'fra',
  },
  {
    name: '德语',
    value: 'de',
  },
  {
    name: '意大利语',
    value: 'it',
  },
  {
    name: '西班牙',
    value: 'spa',
  },
  {
    name: '俄语',
    value: 'ra',
  },
  {
    name: '荷兰语',
    value: 'nl',
  },
  {
    name: '马来语',
    value: 'may',
  },
  {
    name: '丹麦语',
    value: 'dan',
  },
  {
    name: '瑞典语',
    value: 'swe',
  },
  {
    name: '印尼语',
    value: 'id',
  },
  {
    name: '波兰语',
    value: 'pl',
  },
  {
    name: '罗马尼亚语',
    value: 'rom',
  },
  {
    name: '土耳其语',
    value: 'tr',
  },
  {
    name: '希腊语',
    value: 'el',
  },
  {
    name: '匈牙利语',
    value: 'hu',
  }
])
const fromIndex = ref(0)
const toIndex = ref(1)
const uploadUrl = ref('')

onLoad(async (params) => {
  url.value = params.url

  uni.showLoading({
    title: '正在翻译'
  })

  let res = await $http.upload('api/global/fileupload/upload', url.value).catch(() => {})

  if (res?.data) {
    uploadUrl.value = res.data
    translate().catch(() => {})
  }
})

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})


const translate = () => {
  uni.showLoading({
    title: '正在翻译'
  })

  return $http.post('api/user/tools/scan/photo_translate', {
    img_url: uploadUrl.value,
    from: fromLang.value[fromIndex.value].value,
    to: toLang.value[toIndex.value].value,
  }).then(res => {
    if (res?.data?.file_urls?.[0]) {
      url.value = res.data.file_urls[0]
    } else {
      uni.showToast({
        title: '处理失败',
        icon: 'none',
      })
    }
  }).finally(() => {
    uni.hideLoading()
  })
}

const onFromLangChange = ($event) => {
  fromIndex.value = $event.detail.value
  translate()
}

const onToLangChange = ($event) => {
  toIndex.value = $event.detail.value
  translate()
}

const save = () => {
  // #ifdef MP-WEIXIN
  const fs = uni.getFileSystemManager();
  const tempFilePath = `${uni.env.USER_DATA_PATH}/${new Date().getTime()}.png`;

  fs.writeFile({
    filePath: tempFilePath,
    data: url.value.split(',')[1], // Remove the data URL prefix and decode Base64
    encoding: 'base64',
    success() {
      uni.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: () => {
          uni.showToast({
            title: "保存成功",
            icon: "none",
            duration: 2000,
          });
        },
        fail: (res) => {
          console.log("保存失败", res);
          uni.showToast({
            title: "保存失败",
            icon: "none",
            duration: 2000,
          });
        },
      });
    },
  });
  // #endif
}
</script>

<style scoped lang="scss">
.translate-page {
  padding-bottom: 120rpx;

  .language {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    background: #ffffff;
    padding: 20rpx 0;

    .arrow {
      padding: 0 10rpx;
      margin: 0 20rpx;
      background: #dddddd;
      border-radius: 8rpx;
    }
  }

  .url-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 40rpx 30rpx;

    .more-item {
      width: 100%;
      margin-bottom: 30rpx;

      image {
        width: 100%;
        display: block;
      }
    }
  }

  .bottom-options {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background: #ffffff;
  }
}
</style>
