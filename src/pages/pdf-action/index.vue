<template>
  <view>
    <view style="height: 400px;" class="d-flex-center">
      <view style="width: 80%; color: #666;">
        小程序文件预览只支持全屏，无法添加额外的操作按钮，请点击按钮单独预览
        <view style="margin-top: 30px">
          <wd-button block type="primary" @click="toPreview">预览</wd-button>
        </view>
      </view>
    </view>
    <view class="pic-fixed">
      <view class="box">
        <view style="font-size: 0.85rem">
          <view style="text-align: center">
            <wd-icon name="camera" size="22px"></wd-icon>
          </view>
          <view>继续添加</view>
        </view>
        <view style="font-size: 0.85rem; margin-left: 20px;">
          <view style="text-align: center">
            <wd-icon name="download" size="22px"></wd-icon>
          </view>
          <view>保存</view>
        </view>
        <view class="flex-1"></view>
        <view>
          <wd-button @click="shareShow = true">分享</wd-button>
        </view>
      </view>
    </view>
    <wd-toast />
    <Share :show="shareShow"></Share>
  </view>
  
</template>

<script lang="ts" setup>
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { toRouter } from '@/hooks/utils'
import { ref } from 'vue'
import { useToast } from '/node_modules/wot-design-uni'
import { shareShow} from '@/section/share'
import Share from '@/section/share.vue'
const toast = useToast()
const url = ref('')
const docmind = ref('')
const channel = ref('')

onLoad((options) => {
  if( options.docmind ){
    docmind.value = options.docmind
    channel.value = options.channel
    if( options.channel == 'ppt' ){
      url.value = options.docmind
    } else {
      getUrl(options.docmind)
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


const toShare = () => {
  
}

const getUrl = (docmind, callback) => {
  toast.loading('正在获取文件预览地址')
    uni.request({
      url: '/api/filetransform/GetDocumentConvertResult?jobId=' + docmind,
      method: 'GET',
      success: async (res) => {
        if( !res.data.body.code == 'DocProcessing' ){
          toast.warning('正在转换请稍后')
          return;
        }
        if(!res.data.body.data){
          toast.warning('文件地址获取失败')
          return;
        }
        let pathArr = res.data.body.data
        let resArr = []
        toast.close()
        console.log(url)
        for(let i=0;i<pathArr.length;i++){
          let result = await uni.request({
          url: "/api/oss/upload/remote",
          method: "POST",
          data: {
            targetFile: pathArr[i].url,
            username: uni.getStorageSync('username')
          },});
          resArr.push(result.data.fileUrl)
        }
        url.value = resArr.join('|')
        toast.success("文件转换成功");
        callback&&callback()
        console.log(url.value);
        
        // uni.request({
        //   url: "/api/oss/upload/remote",
        //   method: "POST",
        //   data: {
        //     targetFile: path,
        //     username: uni.getStorageSync('username')
        //   },
        //   success: (res) => {
        //     // console.log(res.data);
        //     url.value = res.data.fileUrl
        //     toast.success("文件转换成功");
        //     callback&&callback()
        //   },
        // });
      }
    })
}

const toPreview = () => {
  if( !url.value ){
    getUrl(docmind.value, () => {
      toRouter('/pages/pdf-view/index', 'url=' + url.value + '&channel=' + channel.value)
    })
  } else {
    toRouter('/pages/pdf-view/index', 'url=' + url.value + '&channel=' + channel.value)
  }
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