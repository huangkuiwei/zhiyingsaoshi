<template>
  <view class="water-mark">
    <wd-watermark
      ref="waterRef"
      :content="waterText"
      :width="width"
      :height="height"
    ></wd-watermark>
  </view>
  <!-- <image
    :style="{ width: `${temWidth}px`, height: `${temHeight}px` }"
    :src="urlBase"
    mode=""
  /> -->
  <view class="global-m d-flex-center water-inner">
    <image :src="src" style="width: 96%" mode="widthFix" />
  </view>
  <view class="pic-fixed">
    <view class="box">
      <view @click="toCamera" style="font-size: 0.85rem; margin-right: 80rpx" v-if="!hideReply">
        <view style="text-align: center">
          <wd-icon name="camera" size="22px"></wd-icon>
        </view>
        <view>重新拍照</view>
      </view>
      <view @click="toWater" style="font-size: 0.85rem;">
        <view style="text-align: center">
          <wd-icon name="edit" size="22px"></wd-icon>
        </view>
        <view>水印</view>
      </view>
      <view class="flex-1"></view>
      <view>
        <wd-button @click="toTransformPics">处理</wd-button>
      </view>
    </view>
  </view>
  <wd-popup v-model="show" custom-style="border-radius:10rpx;">
    <view class="water-box">
      <view class="d-flex-center">添加水印</view>
      <view class="water-input">
        <wd-input
          v-model="waterText"
          :no-border="true"
          placeholder="请输入水印"
        ></wd-input>
      </view>
      <view style="height: 10px"></view>
      <wd-button @click="show=false" block>确认</wd-button>
      <view class="d-flex-center" style="margin-top: 15px">
        <wd-checkbox v-model="checkVal">
          <view style="color: #999">应用到其他所有页面</view>
        </wd-checkbox>
      </view>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import { ref, nextTick } from "vue";
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { toRouter } from '@/hooks/utils'
const app = getApp();
console.log(app.globalData);

import {
  addUnit,
  buildUrlWithParams,
  isBase64Image,
  objToStyle,
  uuid,
} from "./common/util";
import $http from '@/hooks/http'
import { taskId } from '@/section/share'
const show = ref(false),
  checkVal = ref(false),
  waterRef = ref(null),
  imgBase = ref(""),
  waterText = ref("添加水印"),
  width = ref(100),
  height = ref(100),
  temWidth = ref(0),
  temHeight = ref(0),
  urlBase = ref(""),
  pixelRatio = ref(uni.getWindowInfo().pixelRatio),
  src = ref("https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/logo.png");

const hideReply = ref(false);
const canvasOffScreenable = ref<boolean>(
  uni.canIUse("createOffscreenCanvas") && Boolean(uni.createOffscreenCanvas)
); // 是否可以使用离屏canvas

onLoad((options) => {
  hideReply.value = options.hideReply === 'true'
  options.url ? (src.value = options.url) : "";
  // if( options.url ){

  // }
  uni.getImageInfo({
    src: src.value,
    success: function (res) {
      temWidth.value = res.width;
      temHeight.value = res.height;
      console.log("图片宽度:", res.width);
      console.log("图片高度:", res.height);
    },
    fail: function (err) {
      console.log("获取图片信息失败:", err);
    },
  });

  console.log(pixelRatio.value);
});

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})


const toCamera = () => {
  uni.navigateBack()
};

const toTransformPics = () => {
  // console.log(waterRef.value.waterMarkUrl);
  const waterMarkUrl = waterRef.value.waterMarkUrl;
  // console.log(canvasOffScreenable.value);
  
  if (canvasOffScreenable.value) {
    const canvasImg: any = uni.createOffscreenCanvas({
      height: temHeight.value,
      width: temWidth.value,
      type: "2d",
    });
    canvasImg.id = 'water-canvas'
    // console.log( canvasImg.canvasId );
    
    const ctxImg: any = canvasImg.getContext("2d");
    const img = canvasImg.createImage() as HTMLImageElement;
    // ctxImg.translate(width.value / 2, height.value / 2)
    // ctxImg.rotate((Math.PI / 180) * Number(-25))
    img.crossOrigin = "anonymous";
    img.referrerPolicy = "no-referrer";
    // img.src = buildUrlWithParams(src.value, {
    //   timestamp: `${new Date().getTime()}`,
    // });
    img.src = src.value
    // console.log(img);
    
    img.onload = () => {
      ctxImg.drawImage(img, 0, 0, temWidth.value, temHeight.value);
      ctxImg.restore();
      // console.log( ctxImg );
      const img2 = canvasImg.createImage() as HTMLImageElement;
      img2.src = waterMarkUrl;

      img2.onload = () => {
        console.log(img2.width, img2.height);
        // 计算平铺的行数和列数
        // const numRows = Math.ceil(temHeight.value / height.value);
        // const numColumns = Math.ceil(temWidth.value / width.value);
        const numRows = Math.ceil(temHeight.value / img2.height);
        const numColumns = Math.ceil(temWidth.value / img2.width);
        for (var i = 0; i < numRows; i++) {
          for (var j = 0; j < numColumns; j++) {
            // 计算每个小图片在画布上的绘制位置
            // const x = j * width.value;
            // const y = i * height.value;
            const x = j * img2.width;
            const y = i * img2.height;
            // console.log(x,y);

            // 在画布上绘制小图片
            ctxImg.drawImage(
              img2,
              x,
              y,
              img2.width,
              img2.height
            );
          }
        }
        // canvasImg.drawImage(img2, 0, 0);
        ctxImg.restore();
        urlBase.value = canvasImg.toDataURL();
        // console.log(urlBase.value);
        
        app.globalData.urlBase = urlBase.value

        // #ifdef MP-WEIXIN
        const fs = uni.getFileSystemManager();
        const tempFilePath = `${uni.env.USER_DATA_PATH}/${new Date().getTime()}.png`;

        fs.writeFile({
          filePath: tempFilePath,
          data: urlBase.value.split(',')[1], // Remove the data URL prefix and decode Base64
          encoding: 'base64',
          success: async () => {
            app.globalData.watermarkImg = tempFilePath

            if (hideReply.value) {
              uni.navigateBack()
            } else {
              uni.showLoading({
                title: '正在加载...',
                mask: true,
              })

              let file_url = ''
              let res = await $http.upload('api/global/fileupload/upload', app.globalData.watermarkImg).catch(() => {})

              if (res?.data) {
                file_url = res.data

                let res2 = await $http.post('api/user/tools/pic/add_watermark', {
                  img_urls: [file_url]
                }).catch(() => {})

                taskId.value = res2.data.task_id

                // 保存结果
                await $http.post('api/global/fileupload/save_result_file', {
                  file_url: file_url,
                  taskid: taskId.value
                }).catch(() => {})

                uni.hideLoading()
                toRouter('/pages/watermark-end/index')
              } else {
                uni.showToast({
                  title: '图片上传失败',
                  icon: 'none'
                })
              }
            }
          },
        });
        // #endif
        // ctxImg.drawImage(img2, 0, 0, width.value, height.value);
        // ctxImg.restore();
        // urlBase.value = canvasImg.toDataURL();
      };
    };
    // console.log( img );
  }

  // #ifdef H5

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.setAttribute("width", `${width.value}px`);
  canvas.setAttribute("height", `${height.value}px`);

  if (ctx) {
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.translate(width.value / 2, width.value / 2);
    ctx.rotate((Math.PI / 180) * -25);
    ctx.font = `normal normal normal 14px/${height.value}px PingFang SC`;
    ctx.fillStyle = "#8c8c8c";
    ctx.fillText(waterText.value, 0, 0);
    ctx.restore();
    console.log(ctx);
  }
  // #endif
};

const toWater = () => {
  show.value = true;
};
</script>

<style scoped lang="scss">
.pic-fixed {
  position: fixed;
  height: 50px;
  width: 100%;
  left: 0;
  bottom: 0;
  box-shadow: 0 -4px 4px #eee;
  z-index: 1101;
  background: #fff;
  --wot-button-primary-bg-color: #00D7AD;
  .box {
    display: flex;
    padding: 0 1.5rem;
    align-items: center;
  }
}
.water-box {
  width: 290px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  padding: 1rem;
  --wot-button-primary-bg-color: #00D7AD;
}
.water-input {
  --wot-input-bg: rgba(245, 245, 245, 1);
  margin-top: 0.8rem;
}
.water-inner {
  overflow: hidden;
}
</style>