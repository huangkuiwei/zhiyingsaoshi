<template>
  <wd-popup
      :z-index="99999"
      closable
      modal-style="background-color:rgba(0,0,0,0.2);"
      v-model="shareShow"
      position="bottom"
      @close="shareShow = false"
  >
    <view class="share-list">
      <view
          @click="toShare(item)"
          v-for="(item, index) in lists"
          :key="index"
          class="share-li"
      >
        <image
            :src="item.icon"
            style="width: 30rpx; margin-right: 18rpx"
            mode="widthFix"
        />
        <text class="name">{{ item.name }}</text>
        <text class="vip" v-if="item.vip">VIP</text>
      </view>
    </view>
  </wd-popup>

  <wd-popup
      :closable="false"
      :modelValue="shareDialog"
      custom-style="width: 600rpx; border-radius: 12rpx"
      :z-index="9999"
  >
    <view class="share-container">
      <view class="title">分享文件</view>

      <view class="options">
        <wd-button style="width: 180rpx" type="info" @click="shareDialog = false">取消</wd-button>
        <wd-button style="width: 180rpx" @click="shareFile">分享给好友</wd-button>
      </view>
    </view>
  </wd-popup>
</template>

<script setup>
import { ref } from 'vue'
import { shareShow, shareUrl, taskId } from './share'
import { onLoad } from '@dcloudio/uni-app'
import $http from '@/hooks/http'
import { toRouter } from '@/hooks/utils'

const lists = ref([
  {
    id: 'img',
    name: '以图片格式分享',
    icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon6/pic.png',
  },
  {
    id: 'longimg',
    name: '以长图格式分享',
    icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon6/longpic.png',
  },
  {
    id: 'pdf',
    name: '以PDF格式分享',
    icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon6/pdf.png',
  },
  {
    id: 'docx',
    name: '以Word格式分享',
    icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon6/doc.png',
    vip: true
  },
  {
    id: 'pptx',
    name: '以PPT格式分享',
    icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon6/ppt.png',
    vip: true

  },
  {
    id: 'xlsx',
    name: '以Excel格式分享',
    icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon6/excel.png',
    vip: true
  }
])
const user = ref({})
const tempFilePath = ref('')
const shareDialog = ref(false)

onLoad(() => {
  $http.get('api/user/auth/userauth/info?referch=1').then(res => {
    let vip_info = res.data.vip_info

    user.value = {
      ...res.data,
      ...vip_info,
    };
  }).catch(() => {
    user.value = {}
  })
})

const toShare = async (item) => {
  shareShow.value = false

  if (item.vip && !user.value.vip_type) {
    toRouter('/pages/member/index')
    return
  }

  if (item.id === 'img' || item.id === 'longimg') {
    let filename = shareUrl.value.split('/')[shareUrl.value.split('/').length - 1]
    let newFilePath = `${uni.env.USER_DATA_PATH}/${filename}`

    uni.downloadFile({
      url: shareUrl.value,
      filePath: newFilePath,
      success: () => {
        uni.shareFileMessage({
          filePath: newFilePath,
          success() {
            console.log('文件转发成功');
          },
          fail(res) {
            console.log('文件转发失败', res);
          },
          complete() {
            uni.hideLoading();
          }
        });
      },
      fail: (res) => {
        console.log('文件下载失败', res);
      },
      complete: () => {
        uni.hideLoading()
      }
    });

    return
  }

  uni.showLoading({
    title: '正在转换文件...'
  })

  let res = await $http.post('api/user/tools/scan/create_share', {
    taskid: taskId.value,
    to_format: item.id
  })

  let url = res?.data?.file_urls?.[0]
  let filename = url.split('/')[url.split('/').length - 1]
  let newFilePath = `${uni.env.USER_DATA_PATH}/${filename}`

  if (url) {
    uni.downloadFile({
      url: url,
      filePath: newFilePath,
      success: () => {
        tempFilePath.value = newFilePath
        shareDialog.value = true
      },
      fail: (res) => {
        console.log('文件下载失败', res);
      },
      complete: () => {
        uni.hideLoading()
      }
    });
  } else {
    uni.showToast({
      title: '文件转换失败',
      icon: 'none',
    })
  }
}

const shareFile = () => {
  uni.shareFileMessage({
    filePath: tempFilePath.value,
    success() {
      console.log('文件转发成功');
    },
    fail(res) {
      console.log('文件转发失败', res);
    },
    complete() {
      uni.hideLoading();
    }
  });
}
</script>

<style scoped lang="scss">
.share-list {
  padding: 30rpx 0;
}

.share-li {
  display: flex;
  align-items: center;
  padding: 30rpx 60rpx;
  font-size: 28rpx;

  .name {
    margin-right: 16rpx;
  }

  .vip {
    background: #E6212A;
    color: #ffffff;
    font-size: 16rpx;
    width: 38rpx;
    height: 22rpx;
    border-radius: 4rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.share-container {
  padding: 60rpx 40rpx;

  .title {
    text-align: center;
    font-size: 38rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 60rpx;
  }

  .options {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}
</style>