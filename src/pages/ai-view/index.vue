<template>
  <view class="webview-container">
    <view class="web-wrapper">
      <web-view :src="src"></web-view>
    </view>
  </view>
  <wd-toast />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Base64 } from "js-base64";
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { useToast } from "/node_modules/wot-design-uni";
const src = ref("");
const toast = useToast();
const fid = ref("");

onLoad((options) => {
  console.log(options);
  fid.value = options.id;
  if (options.url) {
    if( options.url.indexOf(".pdf") >= 0 ){
      src.value = decodeURIComponent(options.url);
    } else {
      src.value =
      "https://file.wiiken.cn/onlinePreview?url=" +
      Base64.encode(options.url);
      console.log( src.value );
    }
  }
  console.log("onLoad");
});

const toTransformPics = () => {};

const toCamera = () => {};

const toRefresh = () => {
  console.log(fid.value);

  if (fid.value) {
    toast.loading("文件获取中");
    uni.request({
      url: "/api/filetransform/GetDocumentConvertResult?jobId=" + fid.value,
      method: "GET",
      success: (res) => {
        console.log(res.data);
        if (res.data.body.DocProcessing == "DocProcessing") {
          toast.close();
          toast.success("文件正在处理中");
          return;
        }
        const url = res.data.body.data[0].url;
        // src.value =
        //   "http://124.223.41.167:8012/onlinePreview?url=" + Base64.encode(url);
        console.log(src.value);
        uni.request({
          url: "/api/oss/upload/remote",
          method: "POST",
          data: {
            targetFile: url,
          },
          success: (res) => {
            console.log(res.data);
            toast.success("文件转换成功");
          },
        });
      },
    });
  }
};

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})

</script>

<style scoped lang="scss">
.web-wrapper {
  position: absolute;
  width: 100vw;
  height: calc(100vh - 60px);
  top: 0;
  left: 0;
  z-index: 0;
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
</style>