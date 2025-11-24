<template>
  <view>
    <view class="water-mark" v-show="false">
      <wd-watermark
          ref="waterRef"
          image="data:image/png;base64,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UmVhZHlxyWU8AAADg2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDMgMTE2LmRkYzdiYzQsIDIwMjEvMDgvMTctMTM6MTg6MzcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MWFjMjRhYTAtNTFhNy0yZDRjLWFhZjgtZTY1YmM0Y2FkZjNkIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkRFNjU1RTc0QzhENTExRjA4QTE1RjQ1RjM3NjdCQUQ1IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkRFNjU1RTczQzhENTExRjA4QTE1RjQ1RjM3NjdCQUQ1IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMS4yIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmQzODk0M2RhLWY2ZjItMzY0YS04NWYxLWVkMTU4YmRlYjcyNiIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmEwZDBlNTExLThjYTEtM2E0Ni05ODUyLTlmZTUyOTAxNzc1NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94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"
          :width="100"
          :height="100"
          :imageWidth="60"
          :imageHeight="43"
          :rotate="0"
      ></wd-watermark>
    </view>

   <template v-if="showCropper && resultList.length">
     <jp-cropper-watermark
         ref="cropperRef"
         @cancel="oncancel"
         @ok="onok"
         :watermarkType="1"
         mode="free"
         :width="width"
         :height="height"
         :maxWidth="1024"
         :maxHeight="1024"
         :url="resultList[currentIndex].url"
         v-model:showCropBox="showCropBox"
         @submit1="submit1"
         @submit2="submit2"
         @reAdd="reAdd"
     />

     <view class="toggle">
       <view class="left" @click="toggleIndex('decrease')" :class="{ disabled: resultList.length === 1 ||currentIndex === 0 }">〈</view>
       <view class="number">
         <view>{{ currentIndex + 1 }}</view>
         <view>/</view>
         <view >{{ resultList.length }}</view>
       </view>
       <view class="right" @click="toggleIndex('add')" :class="{ disabled: resultList.length === 1 ||currentIndex === resultList.length - 1 }">〉</view>
     </view>
   </template>

    <template v-if="!showCropper">
      <view class="img-list">
        <view class="img-item" v-for="item of resultList" :key="item.url">
          <image :src="item.url" mode="aspectFit" />
        </view>
      </view>

      <view class="cropping-fixed">
        <view style="padding: 0 2rem; height: 50px; display: flex; align-items: center">
          <view @click="reAdd" style="flex-grow: 1; display: flex">
            <view style="display: flex; flex-direction: column; align-items: center; gap: 6rpx">
              <image
                  src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/xiangji.png"
                  style="height: 16px; width: 16px"
                  mode="heightFix"
              />
              <view style="font-size: 22rpx; ">重新拍摄</view>
            </view>
          </view>

          <view style="display: flex; align-items: center; gap: 20rpx;">
            <button class="submit" @click="submit">{{ submitText }}</button>
            <button class="share" @click="onShare">分享</button>
          </view>
        </view>
      </view>
    </template>
  </view>

  <Share :show="shareShow"></Share>

  <id-card ref="idCardRef" :propUrls="urls"/>
  <bank-card ref="bankCardRef" :propUrls="urls"/>
  <hukou ref="hukouRef" :propUrls="urls"/>
  <passport ref="passportRef" :propUrls="urls"/>
  <driver ref="driverRef" :propUrls="urls"/>
  <certificate ref="certificateRef" :propUrls="urls"/>
  <license ref="licenseRef" :propUrls="urls"/>
  <fileScan ref="fileScanRef" :propUrls="urls"/>
  <test-paper ref="testPaperRef" :propUrls="urls"/>
  <Jigsaw ref="jigsawRef" :propUrls="urls"/>
  <PicTransform ref="picTransformRef" :propsChannel="tab" :propUrls="urls"/>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import JpCropperWatermark from './jp-cropper-watermark.vue'
import { onLoad, onShareAppMessage, onShow } from '@dcloudio/uni-app'
import { toRouter, toSwich } from '@/hooks/utils'
import $http from '@/hooks/http'
import IdCard from '../camera/certificate/idCard.vue'
import BankCard from '../camera/certificate/bankCard.vue'
import Hukou from '../camera/certificate/hukou.vue'
import Passport from '../camera/certificate/passport.vue'
import Driver from '../camera/certificate/driver.vue'
import Certificate from '../camera/certificate/certificate.vue'
import License from '../camera/certificate/license.vue'
import FileScan from '../camera/fileScan/index.vue'
import TestPaper from '../test-paper/index.vue'
import Jigsaw from '../camera/jigsaw/index.vue'
import PicTransform from '../pic-transform/index.vue'
import { shareShow, shareUrl, taskId } from '@/section/share'
import Share from '@/section/share.vue'

const user = ref({})

const tab = ref(null);
const cerIndex = ref(null);

const width = ref(100);
const height = ref(100);
const urls = ref([]);
const currentIndex = ref(0);
const showCropper = ref(true);
const idCardRef = ref(null);
const bankCardRef = ref(null);
const hukouRef = ref(null);
const passportRef = ref(null);
const driverRef = ref(null);
const certificateRef = ref(null);
const licenseRef = ref(null);
const fileScanRef = ref(null);
const testPaperRef = ref(null);
const jigsawRef = ref(null);
const picTransformRef = ref(null);
const submitText = ref('完成');
const cropperRef = ref(null)
const waterRef = ref(null)
const showCropBox = ref(false);

onLoad(async (options) => {
  tab.value = options.tab;
  cerIndex.value = options.cerIndex;

  if (options.urls) {
    urls.value = options.urls.split(',')
  }

  $http.get('api/user/auth/userauth/info?referch=1').then(res => {
    let vip_info = res.data.vip_info

    user.value = {
      ...res.data,
      ...vip_info,
    };
  })
})

onMounted(() => {
  setTimeout(async () => {
    if (tab.value === '14' || tab.value === '15' || tab.value === '16' || tab.value === '17') {
      submitText.value = '正在转换'
      await picTransformRef.value.setResultList(urls.value)
    }

    width.value = resultList.value[currentIndex.value].width
    height.value = resultList.value[currentIndex.value].height
  }, 100)
})

onShow(() => {
  let globalData = getApp().globalData

  if (globalData.watermarkImg) {
    resultList.value[currentIndex.value].url = globalData.watermarkImg
    globalData.watermarkImg = undefined
  }
})

const resultList = computed(() => {
  if (tab.value === '4') {
    if (cerIndex.value === '1') {
      return idCardRef?.value?.resultList || []
    } else if (cerIndex.value === '2') {
      return bankCardRef?.value?.resultList || []
    } else if (cerIndex.value === '3') {
      return hukouRef?.value?.resultList || []
    } else if (cerIndex.value === '4') {
      return passportRef?.value?.resultList || []
    } else if (cerIndex.value === '5') {
      return driverRef?.value?.resultList || []
    } else if (cerIndex.value === '6') {
      return certificateRef?.value?.resultList || []
    } else if (cerIndex.value === '7') {
      return licenseRef?.value?.resultList || []
    }
  } else if (tab.value === '6') {
    return fileScanRef?.value?.resultList || []
  } else if (tab.value === '10') {
    return testPaperRef?.value?.resultList || []
  } else if (tab.value === '13') {
    return jigsawRef?.value?.resultList || []
  } else if (tab.value === '14' || tab.value === '15' || tab.value === '16' || tab.value === '17') {
    return picTransformRef?.value?.resultList || []
  }

  return []
})

const submit1 = async () => {
  uni.setNavigationBarTitle({
    title: ''
  })

  currentIndex.value = 0

  if (tab.value === '4') {
    if (cerIndex.value === '1') {
      await idCardRef.value.submit()
    } else if (cerIndex.value === '2') {
      await bankCardRef.value.submit()
    } else if (cerIndex.value === '3') {
      await hukouRef.value.submit()
    } else if (cerIndex.value === '4') {
      await passportRef.value.submit()
    } else if (cerIndex.value === '5') {
      await driverRef.value.submit()
    } else if (cerIndex.value === '6') {
      await certificateRef.value.submit()
    } else if (cerIndex.value === '7') {
      await licenseRef.value.submit()
    }
  } else if (tab.value === '6') {
    await fileScanRef.value.submit()
  } else if (tab.value === '10') {
    await testPaperRef.value.submit()
  } else if (tab.value === '13') {
    await jigsawRef.value.submit()
  }

  cropperRef.value.step = 2
}

const submit2 = async () => {
  if (tab.value === '14' || tab.value === '15' || tab.value === '16' || tab.value === '17') {
    await picTransformRef.value.submit()
    submitText.value = '预览'
  } else {
    uni.showLoading({
      title: '加载中...',
      mask: true,
    })

    let saveUrlItem = resultList.value[0]

    if (tab.value === '6') {
      await fileScanRef.value.mergePic()
      saveUrlItem = fileScanRef.value.mergePicUrl[0]
    }

    // 非VIP加水印分享
    if (!user.value.vip_type) {
      let watermarkPicInfo = await toTransformPics(saveUrlItem).catch(() => {})

      if (watermarkPicInfo) {
        saveUrlItem = watermarkPicInfo
      }
    }

    let file_url = saveUrlItem.url

    // 文件未上传就先进行上传处理
    if (!saveUrlItem.url.includes('hnenjoy.oss-cn-shanghai.aliyuncs.com')) {
      let res = await $http.upload('api/global/fileupload/upload', saveUrlItem.url).catch(() => {})

      if (res?.data) {
        file_url = res.data
      } else {
        uni.showToast({
          title: '图片上传失败',
          icon: 'none',
        })
      }
    }

    // 合成长图
    if (tab.value === '13') {
      let res = await $http.post('api/user/tools/pic/composite_long_image', {
        img_urls: [file_url]
      })

      if (res?.data) {
        taskId.value = res.data.task_id
      }
    }

    // 保存结果
    await $http.post('api/global/fileupload/save_result_file', {
      file_url: file_url,
      taskid: taskId.value
    }).catch(() => {})

    shareUrl.value = file_url
  }

  uni.hideLoading()
  showCropper.value = false
}

const submit = async () => {
  if (tab.value === '14' || tab.value === '15' || tab.value === '16' || tab.value === '17') {
    let url = picTransformRef.value.previewUrl
    let filesuffix = url.split('.')[url.split('.').length - 1]

    let filename = url.split('/')[url.split('/').length - 1]
    let newFilePath = `${uni.env.USER_DATA_PATH}/${filename}`

    if (url) {
      if (filesuffix.toLowerCase() === 'pdf' && uni.getDeviceInfo().platform === 'android') {
        uni.downloadFile({
          url: url,
          filePath: newFilePath,
          success: (res) => {
            uni.openDocument({
              filePath: newFilePath,
              showMenu: true,
              success: (res) => {
                console.log('打开成功', res)
              },
              fail: (res) => {
                console.log('打开失败', res)
              }
            })
            console.log('下载成功', res)
          },
          fail: (res) => {
            console.log('下载失败', res)
          }
        })
      } else {
        toRouter('/pages/ai-view/index', 'url=' + encodeURIComponent(picTransformRef.value.previewUrl))
      }
    } else {
      uni.showToast({
        title: '无转换内容',
        icon: 'none'
      })
    }
    return
  }

  toSwich('/pages/document/index')
}

const reAdd = () => {
  uni.navigateBack()
}

const onok = (ev) => {
  resultList.value[currentIndex.value].url = ev.path
};

const onShare = async () => {
  let url = ''

  if (tab.value === '4') {
    if (cerIndex.value === '1') {
      url = idCardRef?.value?.resultList?.[0]?.url
    } else if (cerIndex.value === '2') {
      url = bankCardRef?.value?.resultList?.[0]?.url
    } else if (cerIndex.value === '3') {
      url = hukouRef?.value?.resultList?.[0]?.url
    } else if (cerIndex.value === '4') {
      url = passportRef?.value?.resultList?.[0]?.url
    } else if (cerIndex.value === '5') {
      url = driverRef?.value?.resultList?.[0]?.url
    } else if (cerIndex.value === '6') {
      url = certificateRef?.value?.resultList?.[0]?.url
    } else if (cerIndex.value === '7') {
      url = licenseRef?.value?.resultList?.[0]?.url
    }
  } else if (tab.value === '6') {
    url = fileScanRef?.value?.resultList?.[0]?.url
  } else if (tab.value === '10') {
    url = testPaperRef?.value?.resultList?.[0]?.url
  } else if (tab.value === '13') {
    url = jigsawRef?.value?.resultList?.[0]?.url
  } else if (tab.value === '14' || tab.value === '15' || tab.value === '16' || tab.value === '17') {
    url = picTransformRef.value.previewUrl
  }

  if (tab.value === '14' || tab.value === '15' || tab.value === '16' || tab.value === '17') {
    uni.showLoading({
      title: '正在加载...'
    })

    let filename = url.split('/')[url.split('/').length - 1]
    let newFilePath = `${uni.env.USER_DATA_PATH}/${filename}`

    uni.downloadFile({
      url: url,
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
      fail(res) {
        console.log('文件下载失败', res);
        uni.hideLoading();
      },
      complete: () => {
        uni.hideLoading();
      }
    });
  } else {
    shareShow.value = true
  }
}

const oncancel = () => {};

const toggleIndex = (type) => {
  if (type === 'add') {
    if (resultList.value.length === 1 ||currentIndex.value === resultList.value.length - 1) {
      uni.showToast({
        title: '已经是最后一张了',
        icon: 'none'
      })

      return
    }

    currentIndex.value += 1
  } else {
    if (resultList.value.length === 1 || currentIndex.value === 0) {
      uni.showToast({
        title: '已经是第一张了',
        icon: 'none'
      })

      return
    }

    currentIndex.value -= 1
    width.value = resultList.value[currentIndex.value].width
    height.value = resultList.value[currentIndex.value].height
  }
}

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/share2.jpg',
    path: '/pages/index/index',
  }
})


const toTransformPics = (imgInfo) => {
  return new Promise((resolve, reject) => {
    const waterMarkUrl = waterRef.value.waterMarkUrl;

    if (uni.createOffscreenCanvas) {
      const canvasImg = uni.createOffscreenCanvas({
        height: imgInfo.height,
        width: imgInfo.width,
        type: "2d",
      });

      canvasImg.id = 'water-canvas'

      const ctxImg = canvasImg.getContext("2d");
      const img = canvasImg.createImage();
      img.crossOrigin = "anonymous";
      img.referrerPolicy = "no-referrer";
      img.src = imgInfo.url

      img.onload = () => {
        ctxImg.drawImage(img, 0, 0, imgInfo.width, imgInfo.height);
        ctxImg.restore();

        const img2 = canvasImg.createImage();
        img2.src = waterMarkUrl;

        img2.onload = () => {
          const numRows = Math.ceil(imgInfo.height / img2.height);
          const numColumns = Math.ceil(imgInfo.width / img2.width);

          for (var i = 0; i < numRows; i++) {
            for (var j = 0; j < numColumns; j++) {
              const x = j * img2.width;
              const y = i * img2.height;

              ctxImg.drawImage(img2, x, y, img2.width, img2.height);
            }
          }

          ctxImg.restore();

          let urlBase = canvasImg.toDataURL();

          const fs = uni.getFileSystemManager();
          const tempFilePath = `${uni.env.USER_DATA_PATH}/${new Date().getTime()}.png`;

          fs.writeFile({
            filePath: tempFilePath,
            data: urlBase.split(',')[1], // Remove the data URL prefix and decode Base64
            encoding: 'base64',
            success: async () => {
              let res = await $http.upload('api/global/fileupload/upload', tempFilePath).catch(() => {})

              if (res?.data) {
                resolve({
                  ...imgInfo,
                  url: res.data
                })
              } else {
                reject(res)
              }
            },
            fail: (error) => {
              reject(error)
            }
          });
        };
      };
    }
  })
};
</script>
<style>
page {
  background: #f7f8fc;
}
</style>
<style scoped lang="scss">
.cropping-img {
  height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.cropping-fixed {
  height: 50px;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 9999;
  background: #fff;
  width: 100vw;
  border-top: 1px solid #eee;
  font-size: 0.85rem;
  --wot-button-primary-bg-color: #00D7AD;
}
.cropping-jp{
  overflow: auto;
  display: flex;
  align-items: center;
  font-size: 26rpx;
}

.submit {
  background: #ffffff;
  border: 2rpx solid #CDF022;
  border-radius: 999px;
  font-size: 28rpx;
  color: #CDF022;
  width: 180rpx;
  margin: 0;
  padding: 0;
}

.share {
  background: #CDF022;
  border-radius: 999px;
  font-size: 28rpx;
  color: #212121;
  width: 180rpx;
  margin: 0;
  padding: 0;
}

.cropping-jp .d-flex-column-center{
  flex-shrink: 0;
  flex-grow: 1;
}

.step2 {
  padding: 0 20rpx;

  image {
    width: 100%;
  }
}

.toggle {
  position: fixed;
  bottom: 140rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  // background: #ffffff;
  padding: 10rpx 40rpx;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999999;
  color: #2F2F46;
  font-size: 28rpx;

  .number {
    padding: 0 2rpx;
    flex-shrink: 0;
    white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34rpx;
  }

  .left {
    font-weight: bold;
  }

  .right {
    font-weight: bold;
  }

  .disabled {
    color: #D9D9D9;
    border-radius: 10rpx;
  }
}

.img-list {
  display: flex;
  flex-wrap: wrap;
  padding: 40rpx;

  .img-item {
    background: #ffffff;
    width: 315rpx;
    box-shadow: 0 3px 3px #eee;
    height: 446rpx;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    border-radius: 20rpx;
    margin-bottom: 20rpx;

    &:nth-child(2n - 1) {
      margin-right: 40rpx;
    }

    image {
      height: 100%;
      border-radius: 20rpx;
    }
  }
}
</style>