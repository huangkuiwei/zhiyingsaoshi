<template>
  <view class="file-scan-page">
    <!--<view class="url-list">-->
    <!--  <view v-for="(url, index) in urls" :key="index" class="more-item">-->
    <!--    <image :src="url" mode="widthFix"></image>-->
    <!--  </view>-->
    <!--</view>-->

    <!--<view class="btn" v-if="previewImg">-->
    <!--  <wd-button :loading="loading" @click="submit">{{ previewImg.length ? '查看结果' : '开始制作' }}</wd-button>-->
    <!--</view>-->

    <!--<wd-popup-->
    <!--    class="preview-img-dialog"-->
    <!--    :closable="false"-->
    <!--    :z-index="9999"-->
    <!--    modal-style="background-color:rgba(0,0,0,0.2);"-->
    <!--    v-model="showPreviewImg"-->
    <!--    @close="showPreviewImg = false"-->
    <!--&gt;-->
    <!--  <image mode="widthFix" :src="previewImg[previewIndex]"/>-->

    <!--  <view class="arrow" v-show="previewImg.length > 1">-->
    <!--    <text @click="previewIndex !== 0 && (previewIndex -= 1)">上一张</text>-->
    <!--    <text @click="(previewIndex < (previewImg.length - 1)) && (previewIndex += 1)">下一张</text>-->
    <!--  </view>-->

    <!--  <div class="options">-->
    <!--    <wd-button type="info" @click="showPreviewImg = false">取消</wd-button>-->
    <!--    <wd-button @click="save">保存到相册</wd-button>-->
    <!--  </div>-->
    <!--</wd-popup>-->
  </view>
</template>

<script setup>
import { ref } from 'vue'
import $http from '@/hooks/http'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { taskId } from '@/section/share'

const props = defineProps({
  propUrls: {
    type: Array,
    default: () => []
  }
})

const uploadUrls = ref([])
const loading = ref(false)
const showPreviewImg = ref(false)
const previewImg = ref([])
const previewIndex = ref(0)
const resultList = ref([])
const mergePicUrl = ref([])

onLoad(() => {
  setTimeout(async() => {
    for (let i = 0; i < props.propUrls.length; i++) {
      let imgInfo = await getImageInfo(props.propUrls[i]).catch(() => {})

      resultList.value.push({
        url: props.propUrls[i],
        ...imgInfo
      })
    }
  }, 10)
})

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})


const submit = async () => {
  if (previewImg.value.length) {
    showPreviewImg.value= true
    return
  }

  uni.showLoading({
    title: '正在处理图片',
    mask: true
  })

  loading.value = true
  let tempUploadUrls = []

  for (let i = 0; i < resultList.value.length; i++) {
    let res = await $http.upload('api/global/fileupload/upload', resultList.value[i].url).catch(() => {})

    if (res?.data) {
      let res2 = await $http.post('api/user/tools/scan/scan_file', { img_url: res.data }).catch(() => {})
      if (res2?.data?.file_urls?.[0]) {
        taskId.value = res2.data.taskid
        tempUploadUrls.push(res2.data.file_urls[0])
      } else {
        return Promise.reject()
      }
    }
  }

  loading.value = false
  uploadUrls.value = tempUploadUrls

  if (tempUploadUrls.length) {
    // #ifdef MP-WEIXIN
    await drawWXImages()
    // #endif
  }

  uni.hideLoading()
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

const drawWXImages = async () => {
  const canvas = uni.createOffscreenCanvas({ width: 840, height: 1188 , type: '2d' })
  const ctx = canvas.getContext('2d')

  for (let i = 0; i < uploadUrls.value.length; i++) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await createImgAndDraw(canvas, ctx, uploadUrls.value[i]).catch(() => {})

    ctx.restore()
    previewImg.value.push(canvas.toDataURL())
  }

  showPreviewImg.value = true

  let imgs = [];

  for (let i = 0; i < previewImg.value.length; i++) {
    let data = await writeFile(previewImg.value[i])
    imgs.push(data)
  }

  resultList.value = imgs
}

const mergePic = async () => {
  const canvas = uni.createOffscreenCanvas({ width: 840, height: 1188 * resultList.value.length , type: '2d' })
  const ctx = canvas.getContext('2d')

  for (let i = 0; i < resultList.value.length; i++) {
    await createImgAndDraw1(canvas, ctx, resultList.value[i].url, i).catch(() => {})
  }

  ctx.restore()

  let data = await writeFile(canvas.toDataURL())
  mergePicUrl.value = [data]
}

const createImgAndDraw1 = async (canvas, ctx, url, index) => {
  return new Promise((resolve) => {
    const img = canvas.createImage()
    img.src = url
    img.crossOrigin = "anonymous";
    img.referrerPolicy = "no-referrer";

    img.onload = () => {
      ctx.drawImage(img, 0, index * 1180, 840, 1188)
      resolve()
    }
  })
}

const writeFile = (base64) => {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    const fs = uni.getFileSystemManager();
    const tempFilePath = `${uni.env.USER_DATA_PATH}/${new Date().getTime()}.png`;

    fs.writeFile({
      filePath: tempFilePath,
      data: base64.split(',')[1], // Remove the data URL prefix and decode Base64
      encoding: 'base64',
      success: async () => {
        let imgInfo = await getImageInfo(tempFilePath).catch(() => {})
        resolve({
          url: tempFilePath,
          ...imgInfo
        })
      },
      fail: (error) => {
        reject(error)
      }
    });
    // #endif
  })
}

const createImgAndDraw = async (canvas, ctx, base64Str) => {
  return new Promise((resolve) => {
    const img = canvas.createImage()
    img.src = base64Str

    img.onload = () => {
      let radio = img.width / img.height

      if (radio > 840 / 1188) {
        let height = (img.height / img.width) * 840
        ctx.drawImage(img, 0, 0, 840, height)
      } else {
        let width = (img.width / img.height) * 1188
        ctx.drawImage(img, 0, 0, width, 1188)
      }

      resolve(base64Str)
    }
  })
}

// const save = () => {
//   // #ifdef MP-WEIXIN
//   const fs = uni.getFileSystemManager();
//   const tempFilePath = `${uni.env.USER_DATA_PATH}/${new Date().getTime()}.png`;
//
//   fs.writeFile({
//     filePath: tempFilePath,
//     data: previewImg.value[previewIndex.value].split(',')[1], // Remove the data URL prefix and decode Base64
//     encoding: 'base64',
//     success() {
//       uni.saveImageToPhotosAlbum({
//         filePath: tempFilePath,
//         success: () => {
//           uni.showToast({
//             title: "保存成功",
//             icon: "none",
//             duration: 2000,
//           });
//         },
//         fail: (res) => {
//           console.log("保存失败", res);
//           uni.showToast({
//             title: "保存失败",
//             icon: "none",
//             duration: 2000,
//           });
//         },
//       });
//     },
//   });
//   // #endif
// }

defineExpose({
  submit,
  resultList,
  mergePicUrl,
  mergePic
})
</script>

<style scoped lang="scss">
.file-scan-page {
  .url-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 40rpx 30rpx;

    .more-item {
      margin-bottom: 30rpx;

      &:nth-child(2n - 1) {
        margin-right: 30rpx;
      }

      image {
        width: 330rpx;
        display: block;
      }
    }
  }

  image {
    width: 210px;
    height: 297px;
  }

  .btn {
    margin-top: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 100rpx;
  }
}
</style>

<style lang="scss">
.file-scan-page .wd-popup-wrapper {
  background: transparent;

  .wd-popup {
    width: 600rpx !important;
    background: transparent !important;
    position: relative;

    image {
      width: 100%;
      display: block;
    }

    .arrow {
      text {
        color: #ffffff;
        background: rgba(0, 0, 0, 0.5);
        width: 90rpx;
        height: 90rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20rpx;

        &:nth-child(1) {
          position: absolute;
          left: 6rpx;
          top: 40%;
        }

        &:nth-child(2) {
          position: absolute;
          right: 6rpx;
          top: 40%;
        }
      }
    }

    .options {
      margin-top: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      button {
        width: 30%;
      }
    }
  }
}
</style>