<template>
  <view class="hukou-page">
    <!--<view class="url-list">-->
    <!--  <view v-for="(url, index) in urls" :key="index" class="more-item">-->
    <!--    <image :src="url" mode="widthFix"></image>-->
    <!--  </view>-->
    <!--</view>-->

    <!--<view class="btn" v-if="previewImg">-->
    <!--  <wd-button :loading="loading" @click="submit">{{ previewImg ? '查看结果' : '开始制作' }}</wd-button>-->
    <!--</view>-->

    <!--<wd-popup-->
    <!--    class="preview-img-dialog"-->
    <!--    :closable="false"-->
    <!--    :z-index="9999"-->
    <!--    modal-style="background-color:rgba(0,0,0,0.2);"-->
    <!--    v-model="showPreviewImg"-->
    <!--    @close="showPreviewImg = false"-->
    <!--&gt;-->
    <!--  <image mode="widthFix" :src="previewImg"/>-->

    <!--  <div class="options">-->
    <!--    <wd-button type="info" @click="showPreviewImg = false">取消</wd-button>-->
    <!--    <wd-button @click="save">保存到相册</wd-button>-->
    <!--  </div>-->
    <!--</wd-popup>-->
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
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
const previewImg = ref('')
const resultList = ref([])

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
  if (previewImg.value) {
    showPreviewImg.value= true
    return
  }

  uni.showLoading({
    title: '正在处理图片',
    mask: true
  })

  loading.value = true
  let uploadUrl = []
  let tempUploadUrls = []

  for (let i = 0; i < resultList.value.length; i++) {
    let res = await $http.upload('api/global/fileupload/upload', resultList.value[i].url).catch(() => {})

    if (res?.data) {
      uploadUrl.push(res.data)
    } else {
      uni.showToast({
        title: '图片上传失败',
        icon: 'none',
      })
    }
  }

  let res2 = await $http.post('api/user/tools/scan/scan_certificate', { img_urls: uploadUrl }).catch(() => {})
  if (res2?.data?.file_urls) {
    taskId.value = res2.data.taskid

    for (let i = 0; i < res2.data.file_urls.length; i++) {
      let url = res2.data.file_urls[i]
      let imgInfo = await getImageInfo(url).catch(() => {})

      if (imgInfo) {
        if (imgInfo.width > imgInfo.height) {
          tempUploadUrls.push(url)
        } else {
          let newBase64Str = await rotate(url, imgInfo)
          tempUploadUrls.push(newBase64Str)
        }
      }
    }
  } else {
    return Promise.reject()
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

const rotate = (url, imgInfo) => {
  return new Promise((resolve) => {
    const canvas = uni.createOffscreenCanvas({ width: imgInfo.width, height: imgInfo.height , type: '2d' })
    const ctx = canvas.getContext('2d')

    const img = canvas.createImage()

    img.onload = () => {
      canvas.width = imgInfo.height
      canvas.height = imgInfo.width

      ctx.translate(0, canvas.height)
      ctx.rotate(270 * Math.PI / 180)
      ctx.drawImage(img, 0, 0, imgInfo.width, imgInfo.height, 0, 0, imgInfo.width, imgInfo.height)

      ctx.restore()
      resolve(canvas.toDataURL())
    }

    img.src = url
  })
}

const drawWXImages = async () => {
  const canvas = uni.createOffscreenCanvas({ width: 840, height: 1188 , type: '2d' })
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < uploadUrls.value.length; i++) {
    await createImgAndDraw(canvas, ctx, uploadUrls.value[i], i + 1).catch(() => {})
  }

  ctx.restore()
  previewImg.value = canvas.toDataURL()
  showPreviewImg.value = true
  await writeFile()
}

const writeFile = () => {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    const fs = uni.getFileSystemManager();
    const tempFilePath = `${uni.env.USER_DATA_PATH}/${new Date().getTime()}.png`;

    fs.writeFile({
      filePath: tempFilePath,
      data: previewImg.value.split(',')[1], // Remove the data URL prefix and decode Base64
      encoding: 'base64',
      success: async () => {
        let imgInfo = await getImageInfo(tempFilePath).catch(() => {})
        resultList.value = [{
          url: tempFilePath,
          ...imgInfo
        }]
        resolve(resultList)
      },
      fail: (error) => {
        reject(error)
      }
    });
    // #endif
  })
}

const createImgAndDraw = async (canvas, ctx, url, index) => {
  return new Promise((resolve) => {
    const img = canvas.createImage()
    img.src = url

    img.onload = () => {
      let height = (img.height / img.width) * (840 - 480)

      if (index === 1) {
        ctx.drawImage(img, 240, 150, 840 - 480, height)
      } else if (index === 2) {
        ctx.drawImage(img, 240, 470, 840 - 480, height)
      } else if (index === 3) {
        ctx.drawImage(img, 240, 790, 840 - 480, height)
      }

      resolve(url)
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
//     data: previewImg.value.split(',')[1], // Remove the data URL prefix and decode Base64
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
  resultList
})
</script>

<style scoped lang="scss">
.hukou-page {
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
.hukou-page .wd-popup-wrapper {
  background: transparent;

  .wd-popup {
    width: 600rpx !important;
    background: transparent !important;

    image {
      width: 100%;
      display: block;
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