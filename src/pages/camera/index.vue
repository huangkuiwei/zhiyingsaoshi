<template>
  <view class="camera">
    <view>
      <camera
        ref="cameraRef"
        :style="{ height: `calc(100vh - ${cameraHeight}rpx )` }"
        binderror="error"
        bindscancode="takeCode"
      ></camera>
    </view>
    <view class="camera-fix" :style="{ height: `calc(${cameraHeight}rpx )` }">
      <view class="certificate" v-if="tab == 4">
        <view
          @click="onCert(item)"
          :class="{ active: item.type == cerIndex }"
          v-for="(item, index) in fileTypes"
          :key="index"
          class="certificate-li d-flex-column-center"
        >
          <view>{{ item.name }}</view>
        </view>
      </view>
      <wd-tabs
        :map-num="100"
        color="#fff"
        custom-class="camera-tabs"
        v-model="tab"
        animated
        @click="onTabs"
      >
        <block v-for="(item, index) in tabs" :key="index">
          <wd-tab :disabled="item.name == ''" :title="item.name"> </wd-tab>
        </block>
      </wd-tabs>
      <view class="camera-grid">
        <view class="camera-grid_li" @click="ustate = true">
          <image
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon3/more.png"
            style="width: 26px; height: 26px"
            mode=""
          />
          <view style="font-size: 0.85rem; margin-top: 15rpx;">更多工具</view>
        </view>
        <view class="camera-grid_li">
          <view @click="takePicture" class="camera-btn">
            <!--<view class="camera-box"></view>-->
            <image
                src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon3/camera-icon.png"
                style="width: 104rpx; height: 104rpx"
                mode=""
            />
          </view>
        </view>
        <view class="camera-grid_li">
          <view @click.stop="nextTip" class="more-box" v-if="showNextTip">
            <text class="number">{{ picList.length }}</text>

            <view class="pic">
              <image :src="picList[picList.length - 1]"/>
            </view>

            <text class="next">下一步</text>
          </view>

          <!-- 本地相册 -->
          <view @click="chooseLocalPicture" v-else>
            <wd-badge bg-color="#00D7AD" :modelValue="picList.length">
              <view class="camera-pic_more">
                <image src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon3/import-pic.png"/>
                <text>本地相册</text>
              </view>
            </wd-badge>
          </view>
        </view>
      </view>
    </view>
  </view>

  <wd-popup @click-modal="show=false" v-model="show" custom-style="border-radius:32rpx;">
    <image :src="tempImagePath" style="width: 200px" mode="widthFix" />
  </wd-popup>
  <wd-popup
    :z-index="20"
    custom-style="height: calc(100vh - 44px); background: #262626;"
    v-model="ustate"
    position="bottom"
  >
    <Util @changeTab="onTabs"></Util>
  </wd-popup>
  <!-- #ifdef H5 -->
  <wd-popup
    :modal="false"
    v-model="tState"
    :custom-style="`height: calc(100vh - ${cameraHeight}rpx); background: #808080; top: 0;`"
    position="top"
  >
    <Tip></Tip>
  </wd-popup>
  <!-- #endif -->
  <!-- #ifndef H5 -->
  <wd-popup
    :z-index="11"
    :modal="false"
    v-model="tState"
    :custom-style="`height: calc(100vh - ${cameraHeight}rpx); background: #808080; top: 0px;`"
    position="top"
  >
    <Tip></Tip>
  </wd-popup>
  <!-- #endif -->

  <!-- #ifdef H5 -->
  <wd-popup
    :modal="false"
    v-model="wState"
    :custom-style="`height: calc(100vh - ${cameraHeight}rpx); background: #808080; top: 0;`"
    position="top"
  >
    <Alert></Alert>
  </wd-popup>
  <!-- #endif -->
  <!-- #ifndef H5 -->
  <wd-popup
    :modal="false"
    v-model="wState"
    :custom-style="`height: calc(100vh - ${cameraHeight}rpx); background: #808080; top: 0px;`"
    position="top"
  >
    <Alert></Alert>
  </wd-popup>
  <!-- #endif -->

  <!-- #ifdef H5 -->
  <wd-popup
    :modal="false"
    v-model="masterState"
    :custom-style="`height: calc(100vh - ${cameraHeight}rpx); background: none; top: 0;`"
    position="top"
    :z-index="1"
  >
    <Master @change="picList = []"></Master>
  </wd-popup>
  <!-- #endif -->
  <!-- #ifndef H5 -->
  <wd-popup
    :modal="false"
    v-model="masterState"
    :custom-style="`height: calc(100vh - 201px); background: none; top: 0px;`"
    position="top"
    :z-index="1"
  >
    <Master @change="picList = []"></Master>
  </wd-popup>
  <!-- #endif -->

  <wd-popup
      :closable="false"
      :modelValue="countTipDialog"
      custom-style="width: 570rpx; background: transparent; top: calc(50vh - 510rpx); margin: 0 auto;"
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
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { toRouter } from "@/hooks/utils";
import { onLoad, onShareAppMessage, onShow } from '@dcloudio/uni-app'
import {
  fileTypes,
  ustate,
  tState,
  cerIndex,
  imgSrc,
  wState,
  fileSrc,
  fileTipName,
  masterState,
  maskRef,
  fileTip,
  fileText,
  localSet,
  tab,
  pintuIndex,
  bankIndex,
  idcardIndex, hukouIndex, driverIndex
} from './camera'
import Util from "./util.vue";
import Tip from "./tip.vue";
import Alert from "./alert.vue";
import Master from "./master.vue";
import $http from '@/hooks/http'

const videoRef = ref(null),
  cameraHeight = ref(320),
  show = ref(false),
  cameraRef = ref(null),
  screenWidth = ref(0),
  screenHeight = ref(0),
  picCount = ref(0),
  picList = ref([]),
  video = ref(null);
// const tab = ref(4);
let cameraContext = null,
  tempImagePath = null;
const countTipDialog = ref(false);
const count = ref(undefined);
const tabs = ref([
  { name: "", index: -1 },
  { name: "", index: -1 },
  { name: "", index: -1 },
  { name: "", index: -1 },
  { name: "证件扫描", index: 0 },
  { name: "文字提取", index: 1 },
  { name: "文件扫描", index: 2 },
  { name: "拍照计数", index: 3 },
  { name: "手写文字识别", index: 4 },
  { name: "拍照翻译", index: 5 },
  { name: "试卷去手写", index: 6 },
  { name: "识别公式", index: 7 },
  { name: "图片加水印", index: 8 },
  { name: "拼图", index: 9 },
  { name: "图片转Word", index: 10 },
  { name: "图片转Excel", index: 11 },
  { name: "图片转PDF", index: 12 },
  { name: "图片转PPT", index: 13 },
  { name: "", index: -1 },
  { name: "", index: -1 },
  { name: "", index: -1 },
]);
const showNextTip = ref(false)

onLoad(async (options) => {
  if( options.tab ){
    tab.value = Number(options.tab)
    onTabs({index: Number(options.tab)})
  }

  await getCount()

  if (count.value < 3) {
    countTipDialog.value = true
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

  if (count.value < 3 && !picList.value.length) {
    countTipDialog.value = true
  }
})

onMounted(() => {
  cameraContext = uni.createCameraContext();
  uni.getSystemInfo({
    success: (res) => {
      screenWidth.value = res.screenWidth;
      screenHeight.value = res.screenHeight;
    },
  });
  const identify = uni.getStorageSync('identify')
  identify ? localSet.value = JSON.parse(identify): ''
});
const takePicture = async () => {
  await getCount()

  if (count.value === 0) {
    countTipDialog.value = true
    return
  }

  if (!count.value) {
    return
  }

  if (tState.value || wState.value) {
    return uni.showToast({
      title: "请先开始",
      icon: "none",
    });
  }

  setShowNextTip()

  console.log(tab.value, cerIndex.value);
  if( tab.value == 7 ){
    const detects = getApp().globalData.detects
    if( !detects ){
      toRouter('/pages/detect/index')
      return;
    }
    if( detects.length ==0 ){
      toRouter('/pages/detect/index')
      return;
    }
  }
  cameraContext.takePhoto({
    quality: "original",
    success: (res) => {
      console.log(res);
      tempImagePath = res.tempImagePath;
      show.value = true;
      uni.showToast({
        title: "拍照完成",
        icon: "loading",
        duration: 1000
      });
      setTimeout( () => {
        show.value = false
      }, 1000 )
      handler(tempImagePath)
    },
    fail: (err) => {
      console.error("拍照失败：", err);
    },
  });
};

const getCount = async () => {
  let action_name = ''
  let url = ''

  if (tab.value === 4) {
    action_name = 'ScanCertificate'
    url = 'api/user/tools/scan/tools_left'
  } else if (tab.value === 5) {
    action_name = 'TextExtraction'
    url = 'api/user/tools/scan/tools_left'
  } else if (tab.value === 6) {
    action_name = 'ScanFile'
    url = 'api/user/tools/scan/tools_left'
  } else if (tab.value === 7) {
    action_name = 'PhotoCounting'
    url = 'api/user/tools/scan/tools_left'
  } else if (tab.value === 8) {
    action_name = 'HandwriteExtraction'
    url = 'api/user/tools/scan/tools_left'
  } else if (tab.value === 9) {
    action_name = 'PhotoTranslate'
    url = 'api/user/tools/scan/tools_left'
  } else if (tab.value === 10) {
    action_name = 'PhotoRemoveHandwrite'
    url = 'api/user/tools/scan/tools_left'
  } else if (tab.value === 11) {
    action_name = 'IdentifyingFormulas'
    url = 'api/user/tools/scan/tools_left'
  } else if (tab.value === 12) {
    action_name = 'AddWatermark'
    url = 'api/user/tools/pic/tools_left'
  } else if (tab.value === 13) {
    action_name = 'CompositeLongImage'
    url = 'api/user/tools/pic/tools_left'
  } else if (tab.value === 14) {
    action_name = 'ImgToWord'
    url = 'api/user/tools/pic/tools_left'
  } else if (tab.value === 15) {
    action_name = 'ImgToExcel'
    url = 'api/user/tools/pic/tools_left'
  } else if (tab.value === 16) {
    action_name = 'ImgToPdf'
    url = 'api/user/tools/pic/tools_left'
  } else if (tab.value === 17) {
    action_name = 'ImgToPPT'
    url = 'api/user/tools/pic/tools_left'
  }

  let res = await $http.get(`${url}/${action_name}`, {}, {
    showLoginModal: true
  }).catch(() => {})

  if (res?.data) {
    // 剩余次数
    if (res.data.left < 0) {
      res.data.left = 0
    }

    count.value = res.data.left
  }
}

watch(tab, async () => {
  await getCount()

  if (count.value < 3) {
    countTipDialog.value = true
  }
})

const exit = () => {
  if (count.value === 0) {
    uni.navigateBack()
  } else {
    countTipDialog.value = false
  }
}

const onTabs = (item) => {
  countTipDialog.value = false
  showNextTip.value = false

  tab.value = item.index;
  console.log( tab.value );
  picList.value = []

  if (item.index == 4) {
    wState.value = false;
    tState.value = true;
    cerIndex.value = 1;
    masterState.value = false
    cameraHeight.value = 320;
  } else if( item.index == 12 ){
    wState.value = false;
    tState.value = false;
    masterState.value = false
    cameraHeight.value = 320 - 74;
  } else if( item.index == 13 || item.index == 14 || item.index == 15 || item.index == 16 || item.index == 17 || item.index == 6 ){
    wState.value = false;
    tState.value = false;
    cerIndex.value = 99;
    masterState.value = true
    cameraHeight.value = 320 - 74;
  } else {
    wState.value = true;
    tState.value = false;
    masterState.value = false
    cameraHeight.value = 320 - 74;
    const identify = uni.getStorageSync('identify');
    if( identify ){
      const localval = JSON.parse(identify);
      localSet.value = localval;      
      if( localSet.value['tab' + tab.value] ){
        wState.value = false
      }
    }
  }
  switch (item.index) {
    case 5:

      fileTipName.value = "文字提取";
      fileSrc.value =
        "https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon12/filetext.png";
      fileTip.value = '提取图片上的文字，可对识别的内容进行复制、编辑。'
      fileText.value = '开始提取'
      break;
    case 6:
      fileTipName.value = "文件扫描";
      fileSrc.value =
        "https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon12/wenjiansaomiao.png";
      fileTip.value = '拍照即可将图片变成扫描件，支持导出PDF'
      fileText.value = '开始扫描'
      break;
    case 7:
      masterState.value = true
      cerIndex.value = 98;
      fileTipName.value = "拍照计数";
      fileSrc.value =
        "https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon12/paizhaojishu.png";
      fileTip.value = 'AI拍照清点物体数量，超高准确率'
      fileText.value = '选择计数类型'
      break;
    case 8:
      fileTipName.value = "手写文字识别";
      fileSrc.value =
        "https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon12/shouxiewenzishibie.png";
      fileTip.value = '拍照识别图片图片上的手写文字'
      fileText.value = '开始识别'
      break;
    case 9:
      fileTipName.value = "拍照翻译";
      fileSrc.value =
        "https://yonganpicture.oss-cn-shenzhen.aliyuncs.com/icons/fanyi.png";
      fileTip.value = '拍照自动识别图片上的文字，快速翻译，支持多国语言'
      fileText.value = '开始翻译'
      break;
    case 10:
      fileTipName.value = "试卷去手写";
      fileSrc.value =
        "https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon12/qushouxie.png";
      fileTip.value = '为保证处理效果，请一次拍摄一个版面的内容'
      fileText.value = '开始去除'
      break;
    case 11:
      fileTipName.value = "识别公式";
      fileSrc.value =
        "https://yonganpicture.oss-cn-shenzhen.aliyuncs.com/icons/shibiegongshi.png";
      fileTip.value = 'AI拍照清点物体数量，超高准确率'
      fileText.value = '开始识别'
      break;
    default:
      break;
  }
};

const onCert = (item) => {
  cerIndex.value = item.type;
  masterState.value = true
  showNextTip.value = false

  picList.value = []
  idcardIndex.value = 1
  bankIndex.value = 1
  hukouIndex.value = 1
  driverIndex.value = 1

  switch (cerIndex.value) {
    case 1:
      imgSrc.value =
        "https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon2/icon1.png";
      break;
    case 2:
      imgSrc.value =
        "https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon2/icon2.png";
      break;
    case 3:
      imgSrc.value =
        "https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon2/icon3.png";
      break;
    case 4:
      imgSrc.value =
        "https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon2/icon4.png";
      break;
    case 5:
      imgSrc.value =
        "https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon2/icon5.png";
      break;
    case 6:
      imgSrc.value =
        "https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon2/icon6.png";
      break;
    case 7:
      imgSrc.value =
        "https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon2/icon7.png";
      break;
    default:
      break;
  }
};

const chooseLocalPicture = async (item) => {
  await getCount()

  if (count.value === 0) {
    countTipDialog.value = true
    return
  }

  if (!count.value) {
    return
  }

  if (tState.value || wState.value) {
    return uni.showToast({
      title: "请先开始",
      icon: "none",
    });
  }

  let uploadCount = 1;

  if (tab.value === 4) {
    if (cerIndex.value === 1) {
      uploadCount = 1
    }

    if (cerIndex.value === 2) {
      uploadCount = 1
    }

    if (cerIndex.value === 3) {
      if (hukouIndex.value === 1) {
        uploadCount = 1
      } else {
        uploadCount = 3
      }
    }

    if (cerIndex.value === 4) {
      uploadCount = 1
    }

    if (cerIndex.value === 5) {
      uploadCount = 1
    }

    if (cerIndex.value === 6) {
      uploadCount = 1
    }

    if (cerIndex.value === 7) {
      uploadCount = 1
    }
  }

  if (tab.value === 5 || tab.value === 8) {
    uploadCount = 1
  }

  if (tab.value === 6) {
    if (pintuIndex.value === 1) {
      uploadCount = 1
    } else {
      uploadCount = 9
    }
  }

  if (tab.value === 7) {
    uploadCount = 1
  }

  if (tab.value === 9) {
    uploadCount = 1
  }

  if (tab.value === 10) {
    uploadCount = 1
  }

  if (tab.value === 11) {
    uploadCount = 1
  }

  if (tab.value === 12) {
    uploadCount = 1
  }

  if (tab.value === 13) {
    if (pintuIndex.value === 1) {
      uploadCount = 1
    } else {
      if (count.value >= 9) {
        uploadCount = 9
      } else {
        uploadCount = count.value
      }
    }
  }

  if (tab.value === 14 || tab.value === 15 || tab.value === 16 || tab.value === 17) {
    if (pintuIndex.value === 1) {
      uploadCount = 1
    } else {
      uploadCount = 9
    }
  }

  uni.chooseImage({
    count: uploadCount,
    sizeType: ["original", "compressed"],
    sourceType: ["album"],
    success: (res) => {      
      console.log( res );
      const tempFilePaths = res.tempFilePaths;

      if( tempFilePaths.length > 0 ){
        const tempImagePath = tempFilePaths;
        handler(tempImagePath)
        setShowNextTip()
      }
    },
    fail: (err) => {
      console.error("选择本地图片失败：", err);
    },
  });
}

const setShowNextTip = () => {
  if (tab.value === 4) {
    if (cerIndex.value === 1) {
      showNextTip.value = false
    }

    if (cerIndex.value === 2) {
      showNextTip.value = false
    }

    if (cerIndex.value === 3) {
      if (hukouIndex.value === 1) {
        showNextTip.value = false
      } else {
        showNextTip.value = true
      }
    }

    if (cerIndex.value === 4) {
      showNextTip.value = false
    }

    if (cerIndex.value === 5) {
      showNextTip.value = false
    }

    if (cerIndex.value === 6) {
      showNextTip.value = false
    }

    if (cerIndex.value === 7) {
      showNextTip.value = false
    }
  }

  if (tab.value === 5 || tab.value === 8) {
    showNextTip.value = false
  }

  if (tab.value === 6) {
    if (pintuIndex.value === 1) {
      showNextTip.value = false
    } else {
      showNextTip.value = true
    }
  }

  if (tab.value === 7) {
    showNextTip.value = false
  }

  if (tab.value === 9) {
    showNextTip.value = false
  }

  if (tab.value === 10) {
    showNextTip.value = false
  }

  if (tab.value === 11) {
    showNextTip.value = false
  }

  if (tab.value === 12) {
    showNextTip.value = false
  }

  if (tab.value === 13) {
    if (pintuIndex.value === 1) {
      showNextTip.value = false
    } else {
      showNextTip.value = true
    }
  }

  if (tab.value === 14 || tab.value === 15 || tab.value === 16 || tab.value === 17) {
    if (pintuIndex.value === 1) {
      showNextTip.value = false
    } else {
      showNextTip.value = true
    }
  }
}

const nextTip = () => {
  handler(null, true)
}

const handler = (tempImagePath, jump) => {
  if (typeof tempImagePath === 'string') {
    picList.value.push(tempImagePath)
  } else if (Array.isArray(tempImagePath)) {
    tempImagePath.forEach(item => {
      picList.value.push(item)
    })
  }

  if (picList.value.length == 0) {
    uni.showToast({
      title: '请先选择图片',
      icon: 'none'
    })
    return
  }

  // 扫描服务-证件扫描
  if (tab.value === 4) {
    // 扫描服务-证件扫描-身份证
    if (cerIndex.value === 1) {
      idcardIndex.value = 2

      if (picList.value.length === 2) {
        toRouter("/pages/cropping/index", "urls=" + picList.value.join(',') + '&tab=4&cerIndex=1');
        // 初始化
        setTimeout(() => {
          picList.value = []
          showNextTip.value = false
          idcardIndex.value = 1
        }, 1500)
      }
      return
    }

    // 扫描服务-证件扫描-银行卡
    if (cerIndex.value === 2) {
      bankIndex.value = 2

      if (picList.value.length === 2) {
        toRouter("/pages/cropping/index", "urls=" + picList.value.join(',') + '&tab=4&cerIndex=2');
        setTimeout(() => {
          // 初始化
          picList.value = []
          showNextTip.value = false
          bankIndex.value = 1
        }, 1500)
      }
      return
    }

    // 扫描服务-证件扫描-户口页，最多上传3张
    if (cerIndex.value === 3) {
      if (hukouIndex.value === 1) {
        if (picList.value.length === 1) {
          toRouter("/pages/cropping/index", "urls=" + picList.value.join(',') + '&tab=4&cerIndex=3');
          setTimeout(() => {
            // 初始化
            picList.value = []
            showNextTip.value = false
          }, 1500)
        }
      } else {
        if (picList.value.length === 3 || jump) {
          toRouter("/pages/cropping/index", "urls=" + picList.value.join(',') + '&tab=4&cerIndex=3');
          setTimeout(() => {
            // 初始化
            picList.value = []
            showNextTip.value = false
          }, 1500)
        }
      }

      return
    }

    // 扫描服务-证件扫描-护照
    if (cerIndex.value === 4) {
      if (picList.value.length === 1) {
        toRouter("/pages/cropping/index", "urls=" + picList.value.join(',') + '&tab=4&cerIndex=4');
        setTimeout(() => {
          // 初始化
          picList.value = []
          showNextTip.value = false
        }, 1500)
      }

      return
    }

    // 扫描服务-证件扫描-驾驶证
    if (cerIndex.value === 5) {
      driverIndex.value = 2

      if (picList.value.length === 2) {
        toRouter("/pages/cropping/index", "urls=" + picList.value.join(',') + '&tab=4&cerIndex=5');
        setTimeout(() => {
          // 初始化
          picList.value = []
          showNextTip.value = false
          driverIndex.value = 1
        }, 1500)
      }
      return
    }

    // 扫描服务-证件扫描-证书
    if (cerIndex.value === 6) {
      if (picList.value.length === 1) {
        toRouter("/pages/cropping/index", "urls=" + picList.value.join(',') + '&tab=4&cerIndex=6');
        setTimeout(() => {
          // 初始化
          picList.value = []
          showNextTip.value = false
        }, 1500)
      }

      return
    }

    // 扫描服务-证件扫描-执照
    if (cerIndex.value === 7) {
      if (picList.value.length === 1) {
        toRouter("/pages/cropping/index", "urls=" + picList.value.join(',') + '&tab=4&cerIndex=7');
        setTimeout(() => {
          // 初始化
          picList.value = []
          showNextTip.value = false
        }, 1500)
      }

      return
    }
  }

  // 扫描服务-文字提取/手写文字识别
  if (tab.value === 5 || tab.value === 8) {
    toRouter('/pages/text-extraction/index', 'url=' + tempImagePath + `&tab=${tab.value}`)
    setTimeout(() => {
      // 初始化
      picList.value = []
      showNextTip.value = false
    }, 1500)
    return
  }

  // 扫描服务-文件扫描，最多上传9张
  if (tab.value === 6) {
    if (pintuIndex.value === 1) {
      if (picList.value.length === 1) {
        toRouter("/pages/cropping/index", "urls=" + picList.value.join(',') + '&tab=6');
        setTimeout(() => {
          // 初始化
          picList.value = []
          showNextTip.value = false
        }, 1500)
      }
    } else {
      if (picList.value.length === 9 || jump) {
        toRouter("/pages/cropping/index", "urls=" + picList.value.join(',') + '&tab=6');
        setTimeout(() => {
          // 初始化
          picList.value = []
          showNextTip.value = false
        }, 1500)
      }
    }

    return
  }

  // 扫描服务-拍照计数 TODO 计数接口未返回数据
  if (tab.value === 7) {
    toRouter('/pages/detect-view/index', 'url=' + tempImagePath)
    setTimeout(() => {
      // 初始化
      picList.value = []
      showNextTip.value = false
    }, 1500)
    return
  }

  // 扫描服务-拍照翻译
  if (tab.value === 9) {
    toRouter('/pages/translate/index', 'url=' + tempImagePath)
    setTimeout(() => {
      // 初始化
      picList.value = []
      showNextTip.value = false
    }, 1500)
    return
  }

  // 扫描服务-试卷去手写
  if (tab.value === 10) {
    toRouter("/pages/cropping/index", "urls=" + picList.value.join(',') + '&tab=10');
    setTimeout(() => {
      // 初始化
      picList.value = []
      showNextTip.value = false
    }, 1500)
    return
  }

  // 扫描服务-识别公式
  if (tab.value === 11) {
    toRouter('/pages/mathjax/index', 'url=' + tempImagePath + '&type=gongshi')
    setTimeout(() => {
      // 初始化
      picList.value = []
      showNextTip.value = false
    }, 1500)
    return
  }

  // 图片工具-图片加水印
  if (tab.value === 12) {
    toRouter('/pages/watermark/index', 'url=' + tempImagePath + '&type=watermark')
    setTimeout(() => {
      // 初始化
      picList.value = []
      showNextTip.value = false
    }, 1500)
    return
  }

  // 图片工具-拼图，最多上传9张
  if (tab.value === 13) {
    if ((pintuIndex.value === 1 && picList.value.length === 1)) {
      toRouter("/pages/cropping/index", "urls=" + picList.value.join(',') + '&tab=13');
      setTimeout(() => {
        // 初始化
        picList.value = []
        showNextTip.value = false
      }, 1500)
    }

    let hasFull = false

    if ((count.value >= 9 && picList.value.length === 9) || (count.value < 9 && picList.value.length === count.value)) {
      hasFull = true
    }

    if ((pintuIndex.value === 2 && hasFull) || jump) {
      toRouter("/pages/cropping/index", "urls=" + picList.value.join(',') + '&tab=13');
      setTimeout(() => {
        // 初始化
        picList.value = []
        showNextTip.value = false
      }, 1500)
    }

    return
  }

  // 图片工具-图片转word/excel/ppt/pdf，最多上传9张
  if (tab.value === 14 || tab.value === 15 || tab.value === 16 || tab.value === 17) {
    if ((pintuIndex.value === 1 && picList.value.length === 1)) {
      toRouter("/pages/cropping/index", "urls=" + picList.value.join(',') + `&tab=${tab.value}`);
      setTimeout(() => {
        // 初始化
        picList.value = []
        showNextTip.value = false
      }, 1500)
    }

    if ((pintuIndex.value === 2 && picList.value.length === 9) || jump) {
      toRouter("/pages/cropping/index", "urls=" + picList.value.join(',') + `&tab=${tab.value}`);
      setTimeout(() => {
        // 初始化
        picList.value = []
        showNextTip.value = false
      }, 1500)
    }

    return
  }
}
</script>
<style>
page {
  background: #000000;
}

.camera-tabs .wd-tabs__nav-item {
  padding: 0 24rpx !important;
}
</style>
<style scoped lang="scss">
@import url("./camera.scss");
.camera {
  color: #fff;
}
.camera-grid {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(3, 1fr);
}
.camera-grid_li {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.camera-fix {
  width: 100vw;
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 0;
  background: #000;
}
.camera-btn {

}
.camera-pic_more{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 24rpx;

  image {
    width: 52rpx;
    height: 52rpx;
    margin-bottom: 15rpx;
  }
}

.more-box{
  // width: 90rpx;
  // height: 85rpx;
  // border-radius: 15rpx;
  // background: #229EF9;
  // color: #fff;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  // font-size: 24rpx;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;

  .number {
    position: absolute;
    right: -6rpx;
    top: -6rpx;
    width: 34rpx;
    height: 34rpx;
    font-size: 20rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    background: #00D7AD;
  }

  .pic {
    background: #ffffff;
    width: 56rpx;
    height: 56rpx;
    border-radius: 50%;
    flex-shrink: 0;
    margin-bottom: 8rpx;

    image {
      width: 56rpx;
      height: 56rpx;
      border-radius: 50%;
    }
  }

  .next {
    color: #ffffff;
    font-size: 28rpx;
  }
}
.video {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>