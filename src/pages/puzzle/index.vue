<template>
  <view class="global-m">
    <image :src="url" style="width: 100%" mode="widthFix" />
  </view>
  <view class="pic-fixed">
    <view class="box">
      <view @click="toSwich('/pages/index/index')" style="font-size: 0.85rem;">
        <view style="text-align: center">
          <wd-icon name="home" size="22px"></wd-icon>
        </view>
        <view>首页</view>
      </view>
      <view @click="shareShow = true" style="font-size: 0.85rem; margin-left: 40px;">
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
  </view>
  <wd-toast />
  <Share :show="shareShow"></Share>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { uploadBase64, toSwich } from '@/hooks/utils'
import { useToast } from '/node_modules/wot-design-uni'
import { shareShow} from '@/section/share'
import Share from '@/section/share.vue'
const toast = useToast()


const url = ref("");
const canvasOffScreenable = ref<boolean>(
  uni.canIUse("createOffscreenCanvas") && Boolean(uni.createOffscreenCanvas)
);

onLoad(async (options) => {
  if (options.urls && canvasOffScreenable.value) {
    //竖向拼接
    if (options.type == 1) {
      const urls = options.urls.split(",");
      let width = 0,
        height = 0;

      for(let i=0; i<urls.length; i++){
        const res = await uni.getImageInfo({
          src: urls[i],
        });
        
        if (res.width > width) {
          width = res.width;
        }
        height += res.height;
      }
        
      
      console.log(width, height);
      const canvas: any = uni.createOffscreenCanvas({
        width,
        height,
        type: "2d",
      });
      const ctx = canvas.getContext("2d");
      urls.map((v, index) => {
        const img = canvas.createImage() as HTMLImageElement;
        img.src = v;
        img.crossOrigin = "anonymous";
        img.referrerPolicy = "no-referrer";
        img.onload = () => {
          ctx.drawImage(img, 0, index * img.height, img.width, img.height);
          ctx.restore();
          url.value = canvas.toDataURL();
        };
        
      });
      
    }
    //横向拼接
    if (options.type == 2) {
      const urls = options.urls.split(",");
      let width = 0,
        height = 0;

      for(let i=0; i<urls.length; i++){
        const res = await uni.getImageInfo({
          src: urls[i],
        });
        
        if (res.height > height) {
          height = res.height;
        }
        width += res.width;
      }
        
      
      console.log(width, height);
      const canvas: any = uni.createOffscreenCanvas({
        width,
        height,
        type: "2d",
      });
      const ctx = canvas.getContext("2d");
      urls.map((v, index) => {
        const img = canvas.createImage() as HTMLImageElement;
        img.src = v;
        img.crossOrigin = "anonymous";
        img.referrerPolicy = "no-referrer";
        img.onload = () => {
          ctx.drawImage(img, index*img.width, 0, img.width, img.height);
          ctx.restore();
          url.value = canvas.toDataURL();
        };
        
      });
    }
  }
});

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})


const toSave = () => {  
  toast.loading('正在上传')
  url.value ?
    (
      uploadBase64(toast, url.value.split(',')[1] )
    )
  : ''
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