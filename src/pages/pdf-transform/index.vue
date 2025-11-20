t<template>
  <view class="pdf-transform">
    <view class="transform-title">选择PDF</view>

    <view @click="choosePDFFile" class="select-box">
      <!--<image-->
      <!--    src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/my/trans.png"-->
      <!--    mode="heightFix"-->
      <!--/>-->
      <view class="select-title" style="margin-left: 0.5rem">微信PDF文件</view>
      <wd-icon name="arrow-right" size="20" color="#999"></wd-icon>
    </view>

    <view class="history">
      <view class="history-title">历史PDF</view>

      <view class="pic-list">
        <view class="pic-item" v-for="item of taskInfoList" :key="item.task_id">
          <view class="container">
            <image
                src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/images/PDF.png"
                mode="aspectFill"
            />
            <view class="name">{{ item.name }}</view>

            <!--<view v-if="item.status === '处理成功'" @click="item.showOptions = true">-->
            <!--  <wd-icon name="more" size="20"></wd-icon>-->
            <!--</view>-->

            <view class="status">
              <text :style="{ color: item.status === '处理失败' ? 'red' : '' }">{{ item.status }}</text>
              <text v-if="item.status === '处理成功'" @click="lookResult(item)">查看</text>
            </view>
          </view>

          <!--<view class="options">-->
          <!--  <view-->
          <!--      @click="toShareFile(item)"-->
          <!--      class="d-grid_li"-->
          <!--  >-->
          <!--    <image-->
          <!--        style="height: 16px; width: 16px"-->
          <!--        src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/document/d3.png"-->
          <!--    />-->
          <!--    <view>分享</view>-->
          <!--  </view>-->

          <!--  <view @click.stop="toDelete(item)" class="d-grid_li">-->
          <!--    <image-->
          <!--        style="height: 16px; width: 16px"-->
          <!--        src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/document/d4.png"-->
          <!--    />-->
          <!--    <view>删除</view>-->
          <!--  </view>-->
          <!--</view>-->
        </view>
      </view>
    </view>

    <!-- TODO -->
    <!--<view class="bottom-options" v-if="taskInfoList.length">-->
    <!--  <button>开始转化</button>-->
    <!--</view>-->

    <wd-popup
        class="preview-img-dialog"
        :closable="false"
        :z-index="9999"
        modal-style="background-color:rgba(0,0,0,0.2);"
        v-model="showPreviewImg"
        @close="showPreviewImg = false"
    >
      <view class="img-box">
        <image mode="widthFix" :src="previewImg[previewIndex]"/>
      </view>

      <view class="arrow" v-show="previewImg.length > 1">
        <text @click="previewIndex !== 0 && (previewIndex -= 1)">上一张</text>
        <text @click="(previewIndex < (previewImg.length - 1)) && (previewIndex += 1)">下一张</text>
      </view>

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
import { ref, watchEffect } from "vue";
import { onLoad, onShareAppMessage, onShow } from '@dcloudio/uni-app'
import $http from '@/hooks/http'
import { toRouter } from '@/hooks/utils'

const taskInfoList = ref([])
const channel = ref('')
const url = ref('')
const counApi = ref('')
const showPreviewImg = ref(false)
const previewImg = ref([])
const previewIndex = ref(0)
const count = ref(undefined);
const countTipDialog = ref(false)

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

onLoad(async (options) => {
  channel.value = options.channel

  if (channel.value) {
    if (channel.value === 'word') {
      uni.setNavigationBarTitle({
        title: 'PDF转Word'
      })

      url.value = 'api/user/tools/pdf/pdf_to_word'
      counApi.value = `api/user/tools/pdf/tools_left/PdfToWord`
    } else if (channel.value === 'excel') {
      uni.setNavigationBarTitle({
        title: 'PDF转Excel'
      })

      url.value = 'api/user/tools/pdf/pdf_to_excel'
      counApi.value = `api/user/tools/pdf/tools_left/PdfToExcel`
    } else if (channel.value === 'ppt') {
      uni.setNavigationBarTitle({
        title: 'PDF转PPT'
      })

      url.value = 'api/user/tools/pdf/pdf_to_ppt'
      counApi.value = `api/user/tools/pdf/tools_left/PdfToPPT`
    } else if (channel.value === 'pic') {
      uni.setNavigationBarTitle({
        title: 'PDF转图片'
      })

      url.value = 'api/user/tools/pdf/pdf_to_img'
      counApi.value = `api/user/tools/pdf/tools_left/PdfToImg`
    } else if (channel.value === 'longpic') {
      uni.setNavigationBarTitle({
        title: 'PDF转长图'
      })

      url.value = 'api/user/tools/pdf/pdf_to_img'
      counApi.value = `api/user/tools/pdf/tools_left/PdfToImg`
    }

    taskInfoList.value = uni.getStorageSync(`transformPDFList${channel.value}`) || [];

    await getCount()

    if (count.value < 3) {
      countTipDialog.value = true
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


onShow(async () => {
  await getCount()

  if (count.value === 0) {
    countTipDialog.value = true
  }
})

watchEffect(() => {
  // 本地存储一份
  if (channel.value) {
    uni.setStorageSync(`transformPDFList${channel.value}`, taskInfoList.value)
  }
})

const exit = () => {
  if (count.value === 0) {
    uni.navigateBack()
  } else {
    countTipDialog.value = false
  }
}

const choosePDFFile = async () => {
  await getCount()

  if (count.value === 0) {
    countTipDialog.value = true
    return
  }

  if (!count.value) {
    return
  }

  uni.chooseMessageFile({
    count: 1,
    type: 'file',
    extension: ['pdf'],
    success: async (response) => {
      uni.showLoading({
        title: '正在创建任务'
      })

      const tempFilePath = response.tempFiles[0];

      let res = await $http.upload('api/global/fileupload/upload', tempFilePath.path).catch(() => {})

      if (res?.data) {
        let res2 = await $http.post(url.value, { file_url: res.data }).catch(() => {})
        uni.hideLoading()

        if (res2?.data) {
          let taskInfo = {
            ...res2.data,
            status: '已创建',
            name: tempFilePath.name,
            file_urls: undefined,
            file_datas: undefined,
            showOptions: false
          }
          taskInfoList.value.unshift(taskInfo)
          getResult(taskInfo)
        } else{
          uni.showToast({
            title: '任务创建失败',
            icon: 'none'
          })
        }
      } else {
        uni.showToast({
          title: '图片上传失败',
          icon: 'none'
        })
      }
    },
    fail: (err) => {
      console.log(err);
    }
  });
}

const getResult = async (taskInfo) => {
  let currentTaskInfo = taskInfoList.value.find(item => item.task_id === taskInfo.task_id)
  let res = await $http.get(`api/user/tools/pdf/convert_result/${taskInfo.office_type}/${taskInfo.task_id}`).catch(() => {})

  if (!res?.data) {
    // 失败处理
    currentTaskInfo.status = '处理失败';
    return
  }

  if (res.data.status === '已创建' || res.data.status === '处理中') {
    setTimeout(() => {
      getResult(currentTaskInfo)
    }, 500)
  }

  if (res.data.status === '处理成功') {
    if (channel.value === 'longpic') {
      let genUrl = await mergeImages(res.data.file_urls).catch(() => {})

      if (genUrl) {
        res.data.file_urls = [genUrl]

        // 保存结果
        $http.post('api/global/fileupload/save_result_file', {
          file_url: genUrl
        })
      }
    }
  }

  // 更新数据
  currentTaskInfo.status = res.data.status;
  currentTaskInfo.file_urls = res.data.file_urls;
  currentTaskInfo.file_datas = res.data.file_datas;
}

const mergeImages = async (urls) => {
  return new Promise(async (resolve, reject) => {
    let urlsInfoList = await getImageInfo(urls);
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

const getImageInfo = async (urls) => {
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

const lookResult = (item) => {
  if (channel.value === 'word' ||
      channel.value === 'excel' ||
      channel.value === 'ppt'
  ) {
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
  // 图片
  else if (channel.value === 'pic' || channel.value === 'longpic') {
    previewImg.value = item.file_urls
    previewIndex.value = 0
    showPreviewImg.value = true
  }
}

const save = () => {
  uni.showLoading({
    title: '正在下载'
  })

  if (channel.value === 'longpic') {
    const fs = uni.getFileSystemManager();
    const tempFilePath = `${uni.env.USER_DATA_PATH}/${new Date().getTime()}.png`;

    fs.writeFile({
      filePath: tempFilePath,
      data: previewImg.value[previewIndex.value].split(',')[1],
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
  } else {
    let url = previewImg.value[previewIndex.value]
    let filename = url.split('/')[url.split('/').length - 1]
    let newFilePath = `${uni.env.USER_DATA_PATH}/${filename}`

    uni.downloadFile({
      url: url,
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
      complete: () => {
        uni.hideLoading()
      }
    });
  }
}
</script>

<style lang="scss">
.pdf-transform {
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
      font-size: 28rpx;
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
      display: flex;
      flex-direction: column;
      gap: 20rpx;

      .pic-item {
        padding: 20rpx 40rpx;
        background: #ffffff;

        .container {
          display: flex;
          align-items: center;

          image {
            height: 70rpx;
            width: 70rpx;
            border-radius: 8rpx;
            margin-right: 20rpx;
            flex-shrink: 0;
          }

          .name {
            flex-grow: 1;
            padding-right: 20rpx;
            font-size: 26rpx;
            word-break: break-all;
          }

          .status {
            color: #2bb3ed;
            flex-shrink: 0;
            font-size: 28rpx;
            display: flex;
            align-items: center;
            gap: 10rpx;
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
    justify-content: flex-end;
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
