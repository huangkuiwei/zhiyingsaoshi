<template>
  <view class="translate-page">
    <!--<view class="url-list">-->
    <!--  <view class="more-item">-->
    <!--    <image :src="url" mode="widthFix"></image>-->
    <!--  </view>-->
    <!--</view>-->

    <!--<view class="bottom-options">-->
    <!--  <wd-button @click="save">保存</wd-button>-->
    <!--</view>-->
  </view>
</template>

<script setup>
import $http from '@/hooks/http'
import { computed, ref } from 'vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { taskId } from '@/section/share'

const props = defineProps({
  propUrls: {
    type: Array,
    default: () => []
  }
})

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
  uni.showLoading({
    title: '正在处理'
  })

  let imgs = [];

  for (let i = 0; i < resultList.value.length; i++) {
    let res = await $http.upload('api/global/fileupload/upload', resultList.value[i].url).catch(() => {})

    if (res?.data) {
      let res2 = await $http.post('api/user/tools/scan/photo_remove_handwrite', {
        img_url: res.data,
      })

      if (res2?.data?.file_urls?.[0]) {
        taskId.value = res2.data.taskid
        let imgInfo = await getImageInfo(res2?.data?.file_urls?.[0]).catch(() => {})

        imgs.push({
          url: res2?.data?.file_urls?.[0],
          ...imgInfo
        })

      } else {
        uni.showToast({
          title: '处理失败',
          icon: 'none',
        })

        return Promise.reject()
      }
    }
  }

  resultList.value = imgs

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


// const save = () => {
//   // #ifdef MP-WEIXIN
//   const fs = uni.getFileSystemManager();
//   const tempFilePath = `${uni.env.USER_DATA_PATH}/${new Date().getTime()}.png`;
//
//   fs.writeFile({
//     filePath: tempFilePath,
//     data: url.value.split(',')[1], // Remove the data URL prefix and decode Base64
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
.translate-page {
  padding-bottom: 120rpx;

  .url-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 40rpx 30rpx;

    .more-item {
      width: 100%;
      margin-bottom: 30rpx;

      image {
        width: 100%;
        display: block;
      }
    }
  }

  .bottom-options {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background: #ffffff;
  }
}
</style>
