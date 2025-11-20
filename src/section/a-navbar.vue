<template>
  <view class="a-navbar">
    <wd-grid>
      <wd-grid-item :custom-class="item.hidden?'extra':''" v-for="(item,index) in menus" :key="index" icon="goods" :use-slot="true">
        <view @click="toSwich(item.page)" v-show="!item.hidden">
          <view>
            <wd-img
              width="22"
              height="22"
              :src="item.index == props.index?item.select_icon:item.icon"
            ></wd-img>
          </view>
          <view style="font-size: 0.8rem;" :class="{'active': item.index == props.index}">
            {{ item.name }}
          </view>
        </view>
        <view v-show="item.hidden">
          <view @click="jump" class="navbar-camero">
            <image class="camero" style="width: 80px" mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon10/camero.png"></image>
          </view>
        </view>
      </wd-grid-item>
    </wd-grid>
  </view>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { toSwich, toRouter } from '@/hooks/utils'
import { tab } from '@/pages/camera/camera'

const props=defineProps(['index'])
const menus = ref([
  {
    page: '/pages/index/index',
    name: '首页',
    index: 1,
    icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon10/icon_1.png',
    select_icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon10/icon_1_sel.png'
  },
  {
    page: '/pages/document/index',
    name: '文档',
    index: 2,
    icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon10/icon_2.png',
    select_icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon10/icon_2_sel.png'
  },
  {
    hidden: true
  },
  {
    page: '/pages/tool/index',
    name: '工具',
    index: 3,
    icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon10/icon_3.png',
    select_icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon10/icon_3_sel.png'
  },
  {
    page: '/pages/my/index',
    name: '我的',
    index: 4,
    icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon10/icon_4.png',
    select_icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon10/icon_4_sel.png'
  }
])

const jump = () => {
  uni.getSetting({
    success (res) {
      let camera = res.authSetting['scope.camera']

      // 相机权限未授权
      if (!camera) {
        uni.authorize({
          scope: 'scope.camera',
          success: () => {
            toRouter('/pages/camera/index')
          },
          fail: () => {
            uni.showModal({
              title: '提示',
              content: '您没有授权相机权限，无法使用该功能，请跳转到设置页面打开相机权限',
              showCancel: true,
              success: (res) => {
                if (res.confirm) {
                  uni.openSetting({
                    success (res) {
                      console.log(res.authSetting)
                    }
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        })
      } else {
        toRouter('/pages/camera/index')
      }
    }
  })
}
</script>
<style scoped lang="scss">
.a-navbar{
  position: fixed;
  width: 100vw;
  bottom: 0;
  left: 0;
  background: #fff;
  box-shadow: 0 -1px 3px 3px #f7f7f7;
  overflow: visible;
  z-index: 999;
  color: #CCCCCC;
  .extra{
    overflow: visible;
  }
}
.active{
  color: #00D7AD;
}
.navbar-camero{
  position: relative;
  background: #fff;
  .camero{
    position: absolute;
    left: 50%;
    margin-left: -40px;
    top: -40px;
    z-index: 99;
  }
}
</style>