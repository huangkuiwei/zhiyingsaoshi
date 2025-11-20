<template>
  <view style="margin-top: 0.4rem" class="authority">
    <wd-card type="rectangle" custom-class="h-card">
      <wd-cell-group border>
        <wd-cell size="large" title="推送设置" label="关闭推送，会错过重要资讯">
          <template #>
            <wd-switch size="20px" v-model="checked" />
          </template>
        </wd-cell>
        <wd-cell
          size="large"
          title="存储权限"
          label="保证您在文件导出、保存相册等功能的正常使用"
        >
          <template #>
            <view>
              <wd-switch v-model="storageChecked" size="20px" />
            </view>
          </template>
        </wd-cell>
        <wd-cell
          size="large"
          title="相机权限"
          label="保证拍照、扫描等功能的正常使用"
        >
          <template #>
            <view @click="requestCameraAuthorization">
              <wd-switch size="20px" v-model="cameraChecked" />
            </view>
          </template>
        </wd-cell>
      </wd-cell-group>
    </wd-card>
  </view>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { onShareAppMessage } from '@dcloudio/uni-app'

nextTick(() => {
  // ifdef MP-WEIXIN
  uni.getSetting({
    success: (res) => {
      console.log(res);

      if (res.authSetting["scope.camera"] === true) {
        cameraChecked.value = true;
      }
      if (res.authSetting["scope.storage"] === true) {
        storageChecked.value = true;
      }
    },
  });
  // endif
});

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})


const checked = ref(false);
const cameraChecked = ref(false);
const storageChecked = ref(false);

const requestCameraAuthorization = () => {
  uni.authorize({
    scope: "scope.camera",
    success() {
      console.log("授权成功");
      uni.showToast({
        title: "授权成功",
        icon: "none",
        duration: 1000,
      });
      // 授权成功后的操作
    },
    fail() {
      console.log("授权失败");
      // 授权失败后的操作
    },
  });
};
</script>
<style>
page {
  background: rgba(247, 248, 252, 1);
}
</style>
<style scoped lang="scss">
.authority {
  --wot-cell-title-fs-large: 1rem;
  --wot-cell-title-fs: 1rem;
  --wot-cell-value-fs: 0.85rem;
  --wot-cell-value-color: #999;
  --wot-cell-wrapper-padding-large: 1rem;
}
</style>