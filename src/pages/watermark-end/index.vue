<template>
  <view class="global-m">
    <image :src="url" style="width:100%" mode="widthFix" />
  </view>
  <view class="pic-fixed">
    <view class="box">
      <view @click="toSwich('/pages/index/index')" style="font-size: 0.85rem;">
        <view style="text-align: center">
          <wd-icon name="home" size="22px"></wd-icon>
        </view>
        <view>首页</view>
      </view>
      <!-- TODO -->
      <view @click="shareFile" style="font-size: 0.85rem; margin-left: 40px;">
        <view style="text-align: center">
          <wd-icon name="jump" size="22px"></wd-icon>
        </view>
        <view>分享</view>
      </view>
      <view class="flex-1"></view>
      <view>
        <wd-button @click="toSave">保存</wd-button>
      </view>
    </view>
    <Share :show="shareShow"></Share>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { uploadBase64, toSwich } from '@/hooks/utils'
import { useToast } from '/node_modules/wot-design-uni'
import { shareShow} from '@/section/share'
import Share from '@/section/share.vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
const toast = useToast()

const url = ref(null)
const app = getApp();
// console.log(app.globalData);
url.value = app.globalData.watermarkImg

onLoad(() => {

})

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})


const shareFile = () => {
  shareShow.value = true
}

const toSave = async () => {
  uni.saveImageToPhotosAlbum({
    filePath: url.value,
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
}

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
</style>