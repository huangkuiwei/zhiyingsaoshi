<template>
  <view class="pic-transform" v-if="!propsChannel">
    <view class="transform-title">选择图片</view>

    <view @click="chooseImage" class="select-box">
      <!--<image-->
      <!--    src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/my/trans.png"-->
      <!--    mode="heightFix"-->
      <!--/>-->
      <view class="select-title" style="margin-left: 0.5rem">本地图片文件</view>
      <wd-icon name="arrow-right" size="20" color="#999"></wd-icon>
    </view>

    <view class="history">
      <view class="history-title">历史图片</view>

      <view class="pic-list">
        <view class="pic-item" v-for="(item, key) of transformImgList" :key="key">
          <view class="time">{{ transformTime(key) }}</view>

          <view class="detail-list">
            <view class="detail-item" v-for="(item2) in item">
              <image
                  :src="item2.img"
                  mode="aspectFill"
              />
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- TODO -->
    <!--<view class="bottom-options">-->
    <!--  <view class="left" @click="toRouter('/pages/camera/index', `tab=${channel}`)">-->
    <!--    <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/paishe.png"/>-->
    <!--    <text>现在拍摄</text>-->
    <!--  </view>-->

    <!--  <button v-if="taskInfoList.length">开始转化</button>-->
    <!--</view>-->

    <wd-popup
        class="preview-img-dialog"
        :closable="false"
        :z-index="9999"
        modal-style="background-color:rgba(0,0,0,0.2);"
        v-model="showPreviewImg"
        @close="showPreviewImg = false"
    >
      <image mode="widthFix" :src="previewImg"/>

      <div class="options">
        <wd-button type="info" @click="showPreviewImg = false">取消</wd-button>
        <wd-button @click="save">保存到相册</wd-button>
      </div>
    </wd-popup>

    <wd-popup
        :closable="false"
        :modelValue="countTipDialog"
        custom-style="width: 570rpx; background: transparent; top: calc(50vh - 380rpx); margin: 0 auto;"
        position="top"
        :z-index="99999"
    >
      <view class="count-tip-container">
        <view class="close">
          <image @click="countTipDialog = false" mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon11/close-icon.png" />
        </view>
        <image src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/vip-dialog-bg.png" mode="widthFix" />
        <view class="btn" @click="toRouter('/pages/member/index')">
          <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/buy-btn.png" />
        </view>

        <view class="count-info">
          <view class="count-number">
            <image mode="heightFix" style="height: 76rpx" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon11/0chance.png" v-if="count === 0"/>
            <image mode="heightFix" style="height: 76rpx" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon11/1chance.png" v-if="count === 1"/>
            <image mode="heightFix" style="height: 76rpx" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon11/2chance.png" v-if="count === 2"/>
          </view>
          <view class="join">加入会员享受全部权益</view>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<script setup>
import { ref, watchEffect, computed } from "vue";
import { onLoad, onShareAppMessage, onShow } from '@dcloudio/uni-app'
import $http from '@/hooks/http'
import { toRouter } from '@/hooks/utils'

const props = defineProps({
  propUrls: {
    type: Array,
    default: () => []
  },
  propsChannel: {
    type: String,
    default: ''
  }
})

const taskInfoList = ref([])
const transformImgList = ref({})
const channel = ref('')
const urls = ref([])
const url = ref('')
const counApi = ref('')
const count = ref(undefined);
const showPreviewImg = ref(false)
const countTipDialog = ref(false)
const previewImg = ref('')
const resultList = ref([])
const previewUrl = ref('')

const getCount = () => {
  return $http.get(counApi.value, {}, {
    showLoginModal: true
  }).then((res) => {
    if (res.data.left < 0) {
      res.data.left = 0
    }

    count.value = res.data.left
  })
}

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})


onLoad(async (options) => {
  setTimeout(async () => {
    channel.value = options.channel || props.propsChannel

    if (options.urls) {
      urls.value = options.urls?.split(',') || []
    } else if (props.propUrls) {
      urls.value = props.propUrls
    }

    if (channel.value) {
      if (channel.value === '14') {
        !props.propsChannel && uni.setNavigationBarTitle({
          title: '图片转Word'
        })

        url.value = 'api/user/tools/pic/img_to_word'
        counApi.value = 'api/user/tools/pic/tools_left/ImgToWord'
      } else if (channel.value === '15' || channel.value === 'excel') {
        !props.propsChannel && uni.setNavigationBarTitle({
          title: '图片转Excel'
        })

        url.value = 'api/user/tools/pic/img_to_excel'
        counApi.value = 'api/user/tools/pic/tools_left/ImgToExcel'
      } else if (channel.value === '16') {
        !props.propsChannel && uni.setNavigationBarTitle({
          title: '图片转PDF'
        })

        url.value = 'api/user/tools/pic/img_to_pdf'
        counApi.value = 'api/user/tools/pic/tools_left/ImgToPdf'
      } else if (channel.value === '17') {
        !props.propsChannel && uni.setNavigationBarTitle({
          title: '图片转PPT'
        })

        url.value = 'api/user/tools/pic/img_to_ppt'
        counApi.value = 'api/user/tools/pic/tools_left/ImgToPPT'
      }

      transformImgList.value = uni.getStorageSync(`transformImgList${channel.value}`) || {};

      await getCount()

      if (count.value < 3) {
        countTipDialog.value = true
      }
    }
  })
})

onShow(() => {
  transformImgList.value = uni.getStorageSync(`transformImgList${channel.value}`) || {};

  setTimeout(async () => {
    await getCount()

    if (count.value === 0) {
      countTipDialog.value = true
    }
  })
})

watchEffect(() => {
  // 本地存储一份
  if (channel.value) {
    uni.setStorageSync(`transformImgList${channel.value}`, transformImgList.value)
  }
})

const exit = () => {
  if (count.value === 0) {
    uni.navigateBack()
  } else {
    countTipDialog.value = false
  }
}

const transformTime = (key) => {
  let time = new Date(Number(key));
  let month = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : `0${time.getMonth() + 1}`;
  let day = time.getDate();

  return `${month}月${day}日`;
}

const getImageInfo = async (url) => {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src: url,
      success: (res) => {
        resolve(res)
      },
      fail: (error) => {
        reject(error)
      }
    });
  })
}

const setResultList = async (picList) => {
  for (let i = 0; i < picList.length; i++) {
    let imgInfo = await getImageInfo(picList[i]).catch(() => {})

    resultList.value.push({
      url: picList[i],
      ...imgInfo
    })
  }
}

const submit = async () => {
  uni.showLoading({
    title: '正在创建任务',
    mask: true,
  })

  let uploadUrl = []

  for (let i = 0; i < urls.value.length; i++) {
    let res = await $http.upload('api/global/fileupload/upload', urls.value[i]).catch(() => {})

    if (res?.data) {
      uploadUrl.push(res.data)

      let time = Date.now().toString()
      let currenTime = Object.keys(transformImgList.value).find(key => transformTime(key) === transformTime(time))

      if (currenTime) {
        transformImgList.value[currenTime].push({
          img: res.data,
        })
      } else {
        transformImgList.value[time] = [{
          img: res.data,
        }]
      }
    }
  }

  if (!uploadUrl.length) {
    return
  }

  let params = {
    img_urls: uploadUrl
  }

  let res2 = await $http.post(url.value, params).catch(() => {})
  let name = uploadUrl[0].split('/')[uploadUrl[0].split('/').length - 1]

  if (uploadUrl.length > 1) {
    name += '等多个文件'
  }

  if (res2?.data) {
    let taskInfo = {
      ...res2.data,
      img: urls.value[0],
      status: '已创建',
      name: name,
      file_urls: undefined,
      file_datas: undefined,
    }
    taskInfoList.value.unshift(taskInfo)

    uni.showLoading({
      title: '正在查询结果',
      mask: true,
    })

    await getResult(taskInfo)
  }

  uni.hideLoading()
}

const chooseImage = async () => {
  await getCount()

  if (count.value === 0) {
    countTipDialog.value = true
    return
  }

  if (!count.value) {
    return
  }

  uni.chooseImage({
    count: 10,
    sizeType: ['original', 'compressed'],
    sourceType: ['album'],
    success: async (response) => {
      const tempFilePaths = response.tempFilePaths;
      toRouter("/pages/cropping/index", "urls=" + tempFilePaths.join(',') + `&tab=${channel.value}`);
    },
    fail: (err) => {
      console.log(err);
    }
  });
}

const getResult = async (taskInfo) => {
  let currentTaskInfo = taskInfoList.value.find(item => item.task_id === taskInfo.task_id)
  let res = await $http.get(`api/user/tools/pic/convert_result/${taskInfo.office_type}/${taskInfo.task_id}`).catch(() => {})

  if (!res?.data) {
    // 失败处理
    currentTaskInfo.status = '处理失败';
    uni.showToast({
      title: '处理失败',
      icon: 'none'
    })

    return Promise.reject()
  }

  if (res.data.status === '已创建' || res.data.status === '处理中') {
    await getResult(currentTaskInfo)
  }

  // 更新数据
  currentTaskInfo.status = res.data.status;
  currentTaskInfo.file_urls = res.data.file_urls;
  currentTaskInfo.file_datas = res.data.file_datas;

  if (res.data.status === '处理成功') {
    previewUrl.value = currentTaskInfo.file_urls[0]
  }
}

const lookResult = (item) => {
  let url = item.file_urls?.[0]

  if (url) {
    toRouter('/pages/ai-view/index', 'url=' + encodeURIComponent(url))
  } else {
    uni.showToast({
      title: '无转换内容',
      icon: 'none'
    })
  }
}

const save = () => {
  let filename = previewImg.value.split('/')[previewImg.value.split('/').length - 1]
  let newFilePath = `${uni.env.USER_DATA_PATH}/${filename}`

  uni.downloadFile({
    url: previewImg.value,
    filePath: newFilePath,
    success: () => {
      uni.saveImageToPhotosAlbum({
        filePath: newFilePath,
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
    fail: (res) => {
      console.log("下载失败", res);
    },
    complete: () => {
      uni.hideLoading()
    }
  });
}

defineExpose({
  submit,
  setResultList,
  resultList,
  previewUrl
})
</script>

<style lang="scss">
.pic-transform {
  padding-bottom: 120rpx;
  padding-top: 30rpx;

  .transform-title {
    padding-left: 32rpx;
    margin-bottom: 30rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
  }

  .select-box {
    display: flex;
    align-items: center;
    padding: 20rpx 36rpx;
    background: #ffffff;
    margin-bottom: 60rpx;
    color: #333333;
    font-size: 28rpx;

    image {
      height: 158rpx;
      margin-right: 42rpx;
    }

    .select-title {
      flex-grow: 1;
    }
  }

  .history {
    display: flex;
    flex-direction: column;

    .history-title {
      padding: 0 32rpx;
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
      margin-bottom: 44rpx;
    }

    .pic-list {
      .pic-item {
        padding: 0 32rpx;
        margin-bottom: 40rpx;

        .time {
          margin-bottom: 35rpx;
          color: #999999;
          font-size: 28rpx;
        }

        .detail-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10rpx;

          .detail-item {
            height: 164rpx;
            width: 164rpx;

            image {
              width: 100%;
              height: 100%;
              border-radius: 8rpx;
              margin-right: 20rpx;
              flex-shrink: 0;
            }
          }
        }
      }
    }
  }

  .bottom-options {
    box-sizing: border-box;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    padding: 0 52rpx;

    .left {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      span {
        color: #333333;
        font-size: 20rpx;
      }

      image {
        width: 50rpx;
      }
    }

    button {
      margin: 0;
      background: #00D7AD;
      border-radius: 35rpx;
      width: 200rpx;
      height: 70rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 30rpx;
    }
  }
}
</style>
