<template>
  <!-- #ifndef H5 -->
  <wd-sticky>
    <view class="sticky-header">
      <view class="sticky-flex">
        <view @click="toBack" style="padding: 0 0.5rem;">
          <wd-icon name="arrow-left" size="24" color="#222"></wd-icon>
        </view>
        <view class="flex-1">
          所有文档
        </view>
        <view style="margin-right: 1rem; font-size: 0.85rem;">
          取消
        </view>
        <view style="width: 80px;"></view>
      </view>
    </view>
  </wd-sticky>
  <!-- #endif -->
  <!-- #ifdef H5 -->
  <wd-sticky :offset-top="-44">
    <view class="sticky-header-h5">
      <view class="sticky-flex">
        <view @click="toBack" style="padding: 0 0.5rem;">
          <wd-icon name="arrow-left" size="24" color="#222"></wd-icon>
        </view>
        <view class="flex-1">
          所有文档
        </view>
        <view style="margin-right: 1rem; font-size: 0.85rem;">
          取消
        </view>
        <view style="width: 80px;"></view>
      </view>
    </view>
  </wd-sticky>
  <!-- #endif -->
  <view class="global-m">
    <view :class="{'active': item.select}" @click="item.select = !item.select" v-for="(item, index) in lists" :key="index">
      <view class="doc-li" v-if="item.type=='dir'">
        <image style="width: 30px; height: 26px;" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/document/dir.png"></image>
        <view style="margin-left: 0.5rem;">文件夹</view>
      </view>
      <view class="doc-li" v-else-if="item.type=='file'">
        <image style="width: 55px; height: 55px;" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/images/WechatIMG1398.jpg"></image>
        <view class="doc-li_right">
          <view class="doc-li_right-name">
            体验的学校计划<text>.ppt</text>
          </view>
          <view class="doc-li_right-date">
            2024-09-26  1:12:45
          </view>
        </view>
      </view>
    </view>
  </view>
  <view class="move-fix">
    <view class="move-fix_content btns">
      <wd-button type="info" size="large" block>新建文件夹</wd-button>
      <wd-button size="large" block>移动</wd-button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { toSwich } from '@/hooks/utils'
import { onShareAppMessage } from '@dcloudio/uni-app'

const tindex = ref(1)
const lists = ref([
  {
    select: false,
    type: 'dir'
  },
  {
    select: false,
    type: 'dir'
  },
  {
    select: false,
    type: 'dir'
  },
  {
    select: false,
    type: 'file'
  }
])

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})


const toBack = () => {
  uni.navigateBack();
}

</script>
<style>
page{
  background: #fff;
}
</style>
<style lang="scss" scoped>
.sticky-header{
  height: 88px;
  background: #fff;
  width: 100vw;
  display: flex;
  align-items: flex-end;
  box-shadow: 0 3px 3px #eee;
}
.sticky-header-h5{
  height: 44px;
  background: #fff;
  width: 100vw;
  display: flex;
  align-items: flex-end;
  box-shadow: 0 3px 3px #eee;
}
.sticky-flex{
  flex: 1;
  height: 44px;
  display: flex;
  align-items: center;
}
.doc-li{
  display: flex;
  align-items: center;
  padding: 0.5rem;
  margin-bottom: 10px;
  border-radius: 5px;
  .doc-li_right{
    flex: 1;
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-left: 0.5rem;
  }
}
.active{
  background: rgba(247, 248, 252, 1);
}
.doc-li_right-name{
  text{
    font-size: 0.9rem;
    color: #999;
  }
}
.doc-li_right-date{
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.3rem;
}
.move-fix{
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
}
.move-fix_content{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  padding: 1.5rem;
}
</style>