<template>
  <view class="jigsaw-page">
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
    <!--  <view class="img-box">-->
    <!--    <image mode="widthFix" :src="previewImg"/>-->
    <!--  </view>-->

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
  let genUrl = await mergeImages(resultList.value.map(item => item.url)).catch(() => {})

  if (genUrl) {
    previewImg.value = genUrl
    showPreviewImg.value = true
  }

  loading.value = false
  uni.hideLoading()

  let imgInfo = await getImageInfo(previewImg.value).catch(() => {})
  
  resultList.value = [{
    url: previewImg.value,
    ...imgInfo
  }]
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

const mergeImages = async (urls) => {
  return new Promise(async (resolve, reject) => {
    let urlsInfoList = await getImageInfos(urls);
    let totalHeight = 0

    urlsInfoList.forEach(item => {
      let radio = 600 / item.width
      totalHeight += (item.height * radio)
    })
    const canvas = uni.createOffscreenCanvas({ width: 600, height: totalHeight , type: '2d' })

    if (!canvas) {
      uni.showToast({
        title: '合并图片失败',
        icon: 'none'
      })

      reject()
      return
    }

    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let dy = 0

    for (let i = 0; i < urlsInfoList.length; i++) {
      const height = await createImgAndDraw(canvas, ctx, urlsInfoList[i].path, dy).catch(() => {})
      height && (dy += height)
    }

    ctx.restore()
    let base64 = canvas.toDataURL()

    const fs = uni.getFileSystemManager();
    const tempFilePath = `${uni.env.USER_DATA_PATH}/${new Date().getTime()}.png`;

    fs.writeFile({
      filePath: tempFilePath,
      data: base64.split(',')[1], // Remove the data URL prefix and decode Base64
      encoding: 'base64',
      success: async () => {
        let res = await $http.upload('api/global/fileupload/upload', tempFilePath).catch(() => {})

        if (res.data) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: (error) => {
        reject(error)
      }
    });
  })
}

const createImgAndDraw = async (canvas, ctx, url, dy) => {
  return new Promise((resolve) => {
    const img = canvas.createImage()
    img.src = url
    img.crossOrigin = "anonymous";
    img.referrerPolicy = "no-referrer";

    img.onload = () => {
      let height = (img.height / img.width) * 600
      ctx.drawImage(img, 0, dy, 600, height)
      resolve(height)
    }
  })
}

const getImageInfos = async (urls) => {
  let promiseArr = urls.map((url) => {
    return new Promise(async (resolve, reject) => {
      uni.getImageInfo({
        src: url,
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          console.log("获取图片信息失败:", err);
          reject(err)
        },
      });
    })
  })

  return Promise.all(promiseArr)
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
.jigsaw-page {
  .url-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 40rpx 30rpx;

    .more-item {
      width: 30%;
      margin-bottom: 30rpx;

      &:not(:nth-child(3n)) {
        margin-right: 5%;
      }

      image {
       width: 100%;
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
.jigsaw-page .wd-popup-wrapper {
  background: transparent;

  .wd-popup {
    width: 600rpx !important;
    background: transparent !important;
    position: relative;

    .img-box {
      max-height: 70vh !important;
      overflow: auto !important;

      image {
        width: 100%;
        display: block;
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