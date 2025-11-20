<template>
  <view class="global-m">
    <!-- <view class="card-swiper">
    <wd-swiper
      :autoplay="false"
      v-model:current="current"
      custom-indicator-class="custom-indicator-class"
      custom-image-class="custom-image"
      custom-next-image-class="custom-image-prev"
      custom-prev-image-class="custom-image-prev"
      :indicator="{ type: 'dots' }"
      :list="files"
      previousMargin="24px"
      nextMargin="24px"
      height="80vh"
    ></wd-swiper>
  </view> -->
    <view class="ai-file-grid">
      <view v-for="(item, index) in files" :key="index">
        <image :src="item" style="width: 100%" mode="widthFix" />
      </view>
    </view>
  </view>
  <view class="pic-fixed">
    <view class="box">
      <view @click="toShare" style="font-size: 0.85rem">
        <view style="text-align: center">
          <wd-icon name="jump" size="22px"></wd-icon>
        </view>
        <view>分享</view>
      </view>
      <view @click="toView" style="font-size: 0.85rem; margin-left: 20px">
        <view style="text-align: center">
          <wd-icon name="view" size="22px"></wd-icon>
        </view>
        <view>预览</view>
      </view>
      <!-- <view @click="toViewModule" style="font-size: 0.85rem; margin-left: 20px">
        <view style="text-align: center">
          <wd-icon name="view-module" size="22px"></wd-icon>
        </view>
        <view>文件状态</view>
      </view> -->
      <view class="flex-1"></view>
      <view>
        <wd-button @click="toTransformFile">
          转换保存
          <text v-if="type === 'word'">
            (word)
          </text>
          <text v-else-if="type === 'excel'">
            (excel)
          </text>
          <text v-else>
            (pdf)
          </text>
        </wd-button>
      </view>
    </view>
  </view>
  <wd-toast />
  <wd-message-box></wd-message-box>
  <wd-overlay :show="progressStatus">
    <view class="wrapper">
      <view style="width:200px;">
        <wd-progress :duration="10" :percentage="progress" />
      </view>
    </view>
  </wd-overlay>
  <Share :show="shareShow"></Share>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { Base64 } from "js-base64";
import { shareShow} from '@/section/share'
import Share from '@/section/share.vue'
import { useToast } from '/node_modules/wot-design-uni'
import { useMessage } from '/node_modules/wot-design-uni'
import { toRouter, goView } from "@/hooks/utils";
const message = useMessage()
const toast = useToast()
const files = ref([]), ossId = ref(""), src = ref(""), ossUrl = ref(""), type = ref("");
const channel = ref(null);
const progress = ref(0), progressStatus = ref(false), progressInterval = ref(null);
onLoad((options) => {
  console.log(options);
  if (options.urls) {
    files.value = options.urls.split(",");
  }
  if( options.type ){
    type.value = options.type
  }
  channel.value = options.channel;
});

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})


const toTransformFile = () => {
  console.log(files.value[0]);
  if( files.value.length > 0 && channel.value == 'remote' ){
    // toast.loading('文件转换中')
    progressStatus.value = true
    let reqUrl = '';
    if( type.value === 'word' ){
      reqUrl = "/api/filetransform/transform/word"
    } else if( type.value === 'excel' ){
      reqUrl = "/api/filetransform/transform/excel"
    } else if( type.value === 'pdf' ){
      reqUrl = "/api/filetransform/transform/pdf"
    } else if( type.value === 'ppt' ){
      reqUrl = "/api/filetransform/transform/ppt/remote"
    } else{
      return toast.warning('请选择文件类型')
    }
    uni.request({
      url: reqUrl, // 接口地址
      method: "POST",
      data: {
        files: files.value,
        username: uni.getStorageSync("username"),
      },
      success: function (res) {
        if(type.value === 'ppt'){
          ossUrl.value = res.data.url;
          // toast.success("文件转换成功");
          progress.value = 100
          clearInterval(progressInterval.value)
          setTimeout(() => {
            progressStatus.value = false
            toast.success("文件转换成功");
          }, 1500)
          return
        }
        console.log(res);
        progress.value = 20
        // toast.close()
        let s = res.data
        if( typeof res.data === 'string' ){
          let s = JSON.parse(res.data)
        }
        ossId.value = s.body.data.id;
        // toRouter('/pages/ai-view/index', 'id=' + s.body.data.id)
        
        // toast.loading('文件转换可能需要一段时间，请稍后')
        progressInterval.value = setInterval(() => {
          uni.request({
            url: "/api/filetransform/GetDocumentConvertResult?jobId=" + ossId.value,
            method: "GET",
            success: (res) => {
              console.log(res.data);
              // toast.close();
              //@ts-ignore
              if (res.data.body.code == "DocProcessing") {
                progress.value += 15;
                if( progress.value >= 99 ){
                  progress.value = 99;
                }
                // toast.success("文件正在处理中");
                return;
              }
              const url = res.data.body.data[0].url;
              //src.value = 'http://124.223.41.167:8012/onlinePreview?url=' + Base64.encode(url);
              uni.request({
                url: "/api/oss/upload/remote",
                method: "POST",
                data: {
                  targetFile: url,
                  username: uni.getStorageSync("username"),
                },
                success: (res) => {
                  console.log(res.data);
                  ossUrl.value = res.data.fileUrl;
                  progress.value = 100;
                  clearInterval(progressInterval.value)
                  setTimeout(() => {
                    progressStatus.value = false
                    toast.success("文件转换成功");
                  }, 1500)
                },
              });
            },
          });
        }, 3000)
      },
      fail: function (err) {
        console.log(err);
        progressStatus.value = false
        clearInterval(progressInterval.value)
        toast.close()
        uni.showToast({
          title: "转换失败",
          icon: "none",
          duration: 2000,
        });
      },
    })
    return;
  }

  if (files.value.length > 0) {
    // toast.loading('文件转换中')
    progressStatus.value = true
    const uploadTasks = files.value.map((file, index) => {
      return new Promise((resolve, reject) => {
        console.log(file);
        //https://tools-api.xiaoohui.com
        const uploadTask = uni.uploadFile({
          url: "https://tools-api.xiaoohui.com/api/filetransform/transform/one", // 接口地址
          filePath: file, // 临时文件路径
          name: "file", // 服务器接收的文件字段名（这个地方很重要要和后端沟通一下）
          formData: {
            // 可以在这里添加额外的formData参数
          },
          success: function (res) {
            let s = {}
            if( typeof res.data === 'string' ){
              s = JSON.parse(res.data)
            }
            resolve(s);
          },
          fail: function (err) {
            reject(err);
          },
        });
      });
    });
    Promise.all(uploadTasks)
      .then((results) => {
        console.log("所有文件上传成功", results);
        progress.value = 10;
        if( results.length > 0 ){
          let arrs = [];
          results.forEach(item => {
            arrs.push(item.filePath);
          });
          let reqUrl = '';
          if( type.value === 'word' ){
            reqUrl = "/api/filetransform/transform/word"
          } else if( type.value === 'excel' ){
            reqUrl = "/api/filetransform/transform/excel"
          } else if( type.value === 'pdf' ){
            reqUrl = "/api/filetransform/transform/pdf"
          } else if( type.value === 'ppt' ){
            reqUrl = "/api/filetransform/transform/ppt/remote"
          } else{
            return toast.warning('请选择文件类型')
          }
          uni.request({
            url: reqUrl, // 接口地址
            method: "POST",
            data: {
              files: arrs,
              username: uni.getStorageSync("username"),
            },
            success: function (res) {
              if(type.value === 'ppt'){
                ossUrl.value = res.data.url;
                // toast.success("文件转换成功");
                progress.value = 100
                clearInterval(progressInterval.value)
                setTimeout(() => {
                  progressStatus.value = false
                  toast.success("文件转换成功");
                }, 1500)
                return
              }
              console.log(res);
              toast.close()
              let s = res.data
              if( typeof res.data === 'string' ){
                let s = JSON.parse(res.data)
              }
              ossId.value = s.body.data.id;
              // toRouter('/pages/ai-view/index', 'id=' + s.body.data.id)
              
              // toast.loading('文件转换可能需要一段时间，请稍后')
              progressInterval.value = setInterval(() => {
                uni.request({
                  url: "/api/filetransform/GetDocumentConvertResult?jobId=" + ossId.value,
                  method: "GET",
                  success: (res) => {
                    console.log(res.data);
                    toast.close();
                    //@ts-ignore
                    if (res.data.body.code == "DocProcessing") {
                      progress.value += 15;
                      if( progress.value >= 99 ){
                        progress.value = 99;
                      }
                      // toast.success("文件正在处理中");
                      return;
                    }
                    const url = res.data.body.data[0].url;
                    //src.value = 'http://124.223.41.167:8012/onlinePreview?url=' + Base64.encode(url);
                    uni.request({
                      url: "/api/oss/upload/remote",
                      method: "POST",
                      data: {
                        targetFile: url,
                        username: uni.getStorageSync("username"),
                      },
                      success: (res) => {
                        console.log(res.data);
                        ossUrl.value = res.data.fileUrl;
                        progress.value = 100;
                        clearInterval(progressInterval.value)
                        setTimeout(() => {
                          progressStatus.value = false
                        }, 1500)
                        toast.success("文件转换成功");
                      },
                    });
                  },
                });
              }, 3000)
            },
            fail: function (err) {
              console.log(err);
              progressStatus.value = false
              clearInterval(progressInterval.value)
              toast.close()
              uni.showToast({
                title: "转换失败",
                icon: "none",
                duration: 2000,
              });
            },
          })
        }
      })
      .catch((error) => {
        console.error("上传失败", error);
      });
  }
};
const toShare = () => {
  console.log("toShare");
  shareShow.value = true
};

const toView = () => {
  console.log("toView");
  if( !ossUrl.value ){
    toast.warning('请先转换文件,才能预览')
    return;
  }
  goView(ossUrl.value);
  // toRouter('/pages/ai-view/index', 'url=' + ossUrl.value)
};

const toViewModule = () => {
  console.log("toViewModule");
  if( ossUrl.value ){
    message
    .confirm({
      msg: '文件转换成功，是否预览？',
      title: '文件状态'
    })
    .then(() => {
      console.log('点击了确定按钮')
      toRouter('/pages/ai-view/index', 'url=' + ossUrl.value)
    })
    .catch(() => {
      console.log('点击了取消按钮')
    })
    return;
  }
  uni.request({
    url: "/api/filetransform/GetDocumentConvertResult?jobId=" + ossId.value,
    method: "GET",
    success: (res) => {
      console.log(res.data);
      toast.close();
      //@ts-ignore
      if (res.data.body.code == "DocProcessing") {
        toast.success("文件正在处理中");
        return;
      }
      const url = res.data.body.data[0].url;
      //src.value = 'http://124.223.41.167:8012/onlinePreview?url=' + Base64.encode(url);
      uni.request({
        url: "/api/oss/upload/remote",
        method: "POST",
        data: {
          targetFile: url,
          username: uni.getStorageSync("username"),
        },
        success: (res) => {
          console.log(res.data);
          ossUrl.value = res.data.fileUrl;
          message
          .confirm({
            msg: '文件转换成功，是否预览？',
            title: '文件状态'
          })
          .then(() => {
            console.log('点击了确定按钮')
            toRouter('/pages/ai-view/index', 'url=' + ossUrl.value)
          })
          .catch(() => {
            console.log('点击了取消按钮')
          })
          toast.success("文件转换成功");
        },
      });
    },
  });
}
</script>

<style scoped lang="scss">
.ai-file-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}
.pic-fixed {
  position: fixed;
  height: 50px;
  width: 100%;
  left: 0;
  bottom: 0;
  box-shadow: 0 -4px 4px #eee;
  z-index: 9;
  background: #fff;
  --wot-button-primary-bg-color: #00D7AD;
  .box {
    display: flex;
    padding: 0 1.5rem;
    align-items: center;
  }
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  --wot-progress-label-color: #fff;
}
.card-swiper {
  --wot-swiper-radius: 0;
  --wot-swiper-item-padding: 0 24rpx;
  --wot-swiper-nav-dot-color: #e7e7e7;
  --wot-swiper-nav-dot-active-color: #4d80f0;
  padding-bottom: 24rpx;
  :deep(.custom-indicator-class) {
    bottom: -16px;
  }
  :deep(.custom-image) {
    border-radius: 12rpx;
  }
  :deep(.custom-image-prev) {
    height: 168px !important;
  }
}
</style>