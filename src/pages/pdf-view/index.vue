<template>
  <web-view :src="pdfUrl"></web-view>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue";
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { Base64 } from "js-base64";
const pdfUrl = ref(null);
const showRight = ref(true);
const imageState = ref(true);

onLoad((options) => {
  console.log(options.url);
  if( options.channel == 'word' || options.channel == 'excel' || options.channel == 'ppt' ){
    pdfUrl.value = uni.getStorageSync('$viewUrl') + Base64.encode( options.url);
  }
  if( options.channel == 'pic' ){
    pdfUrl.value = uni.getStorageSync('$picsUrl') + Base64.encode( options.url);
  }
  if( options.channel == 'longpic' ){
    uni.request({
      url: '/api/image/longimg',
      method: 'POST',
      data: {
        urls: options.url.split('|'),
        username: uni.getStorageSync('username')
      },
      success: (res) => {
        uni.request({
          url: '/api/image/file',
          method: 'POST',
          data: {
            filePath: res.data
          },
          success: (res) => {
            uni.request({
              url: '/api/oss/uploadBase64ToOSS',
              method: 'POST',
              data: {
                base64: res.data.data,
                username: uni.getStorageSync('username')
              },
              success: (res) => {
                pdfUrl.value = uni.getStorageSync('$viewUrl') + Base64.encode( uni.getStorageSync('$ossUrl') + res.data);
              }
            })
          }
        })
      }
    })
  }
});

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})


onMounted(() => {
  // uni.showActionSheet({
  //   itemList: ["选项1", "选项2", "选项3"],
  //   success: (res) => {
  //     console.log("用户选择的索引:", res.tapIndex); // 返回用户选择的索引
  //   },
  // });
});
</script>
<style scoped lang="scss">
.cover-view {
  position: absolute;
  top: 0; /* 根据实际需要调整位置 */
  left: 0; /* 根据实际需要调整位置 */
  z-index: 999; /* 调整覆盖层的层级 */
  /* 其他样式，如宽高、z-index等 */
}
</style>