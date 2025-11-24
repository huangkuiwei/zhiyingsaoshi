<template>
 <view class="my-index">
   <view class="my-nav">
     <view style="width: calc(100% - 38rpx); padding-left: 38rpx; display: flex; align-items: center;">
       <button class="chooseAvatar" open-type="chooseAvatar" @chooseavatar="chooseAvatar" v-if="user.uid">
         <image
             style="height: 124rpx; border-radius: 50%"
             :src="user.avatar_url || `https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/default-head.png`"
             mode="heightFix"
         />
       </button>

       <image
           v-else
           style="height: 124rpx; border-radius: 50%"
           :src="user.avatar_url || `https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/default-head.png`"
           mode="heightFix"
       />

       <view class="my-status" style="gap: 10rpx; flex-grow: 1; font-size: 22rpx; color: #333333;">
         <view style="font-weight: 500;font-size: 30rpx; color: #333333;">
           <view v-if="user.uid" style="display: flex; align-items: center; justify-content: flex-start; position: relative;">
             <view style="max-width: 400rpx; overflow: auto; text-overflow: ellipsis; white-space: nowrap">{{ user.nickname || '微信用户' }}</view>
             <image v-if="user.vip_type" style="width: 39rpx; padding-left: 20rpx" mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/my/icon2.png"></image>
             <image v-else style="width: 39rpx; padding-left: 20rpx" mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/my/icon1.png"></image>
             <input style="position: absolute; left: 0; max-width: 400rpx; overflow: auto; text-overflow: ellipsis" class="username" type="nickname" :value="user.nickname || '微信用户'" @change="nicknameChange">
           </view>
           <view v-else @click="toRouter('/pages/login/index')">
             未登录
           </view>
         </view>

         <view v-if="!user.uid" @click="toRouter('/pages/login/index')">您还未登录 请先登录</view>
         <view v-else>ID:{{user.uid}}</view>
       </view>
     </view>

     <view class="join-vip">
       <image @click="toRouter('/pages/login/index')" v-if="!user.uid" class="vip-bg" mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/my/bg3.png" />
       <image @click="toMember" v-else-if="!user.vip_type" class="vip-bg" mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/my/bg1.png" />
       <image @click="toMember" v-else class="vip-bg" mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/my/bg2.png" />

       <view class="flex-1" :style="{ paddingTop: platform === 'ios' ? '20rpx' : '0' }">
         <view class="join-vip_tip" v-if="user.vip_type > 0">
           {{user.vip_end_time}}到期
         </view>
       </view>

       <button class="join-bottom" @click="toMember" v-if="user.uid">
         <view v-if="!user.vip_type">立即开通</view>
         <view v-else>立即续费</view>
       </button>
     </view>
   </view>

  <view class="menu-box">
    <view class="global-m_y">
      <wd-cell is-link @click="jump" :customStyle="{ paddingBottom: '16rpx', backgroundColor: 'transparent' }">
        <template #title>
          <text style="color: #333333; font-weight: bold; font-size: 30rpx">账号</text>
        </template>
        <template #icon>
          <image class="my-cell_img" mode="heightFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/my/m1.png"></image>
        </template>
        <view></view>
      </wd-cell>
      <wd-cell is-link to="/pages/message/index" :customStyle="{ paddingBottom: '16rpx' }">
        <template #title>
          <text style="color: #333333; font-weight: bold; font-size: 30rpx">消息与通知</text>
        </template>

        <template #icon>
          <image class="my-cell_img" mode="heightFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/my/m2.png"></image>
        </template>
        <view></view>
      </wd-cell>

      <wd-cell is-link @click="permissionsSetting" :customStyle="{ paddingBottom: '16rpx' }">
        <template #title>
          <text style="color: #333333; font-weight: bold; font-size: 30rpx">权限设置</text>
        </template>
        <template #icon>
          <image class="my-cell_img" mode="heightFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/my/m3.png"></image>
        </template>
        <view></view>
      </wd-cell>
      <button class="contact-btn" open-type="contact" style="margin-bottom: 16rpx">
        <image class="my-cell_img" mode="heightFix" style="position: relative; top: 0" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/my/m4.png"></image>
        <text style="color: #333333; font-weight: bold; font-size: 30rpx">客服中心</text>
        <view style="color: #cccccc;">
          <wd-icon name="arrow-right"></wd-icon>
        </view>
      </button>
      <wd-cell is-link to="/pages/opinion/index" :customStyle="{ paddingBottom: '16rpx' }">
        <template #title>
          <text style="color: #333333; font-weight: bold; font-size: 30rpx">意见与反馈</text>
        </template>
        <template #icon>
          <image class="my-cell_img" mode="heightFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/my/m5.png"></image>
        </template>
        <view></view>
      </wd-cell>
      <wd-cell is-link to="/pages/help/index" :customStyle="{ paddingBottom: '16rpx' }">
        <template #title>
          <text style="color: #333333; font-weight: bold; font-size: 30rpx">帮助</text>
        </template>
        <template #icon>
          <image class="my-cell_img" mode="heightFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/my/m6.png"></image>
        </template>
        <view></view>
      </wd-cell>
      <wd-cell is-link @click="toMessage">
        <template #title>
          <text style="color: #333333; font-weight: bold; font-size: 30rpx">检查更新</text>
        </template>
        <template #icon>
          <image class="my-cell_img" mode="heightFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/my/m7.png"></image>
        </template>
        <view></view>
      </wd-cell>
    </view>
  </view>

   <wd-message-box selector="wd-contact-box-slot"></wd-message-box>
 </view>
  <!-- <towxml :nodes="xmlData"></towxml> -->
  <wd-message-box></wd-message-box>
  <Message ref="msgRef"></Message>
  <NavBar :index="4"></NavBar>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { onLoad, onShareAppMessage, onShow } from '@dcloudio/uni-app'
import { toRouter } from '@/hooks/utils'
import NavBar from '@/section/a-navbar.vue'
import { useMessage } from '/node_modules/wot-design-uni'
import Message from './message.vue'
import $http from '@/hooks/http'
const instance = getCurrentInstance();
const appContext = instance?.appContext
// const xmlData = ref(appContext?.config.globalProperties.$towxml(``, 'markdown'))
// console.log(appContext)


// const xmlData = ref(getApp().globalData.$towxml('111', 'markdown'))


const msgRef = ref(null), user = ref({})
const message = useMessage()
const platform = uni.getDeviceInfo().platform
const contactMessage = useMessage('wd-contact-box-slot')

const permissionsSetting = () => {
  uni.openSetting({
    success (res) {
      console.log(res.authSetting)
    }
  })
}

// TODO 客服
const openContact = () => {
  contactMessage.confirm({
    title: '将跳转至“微信”打开客服聊天窗口',
    // confirmButtonProps: {
    //   openType: 'contact'
    // }
  }).then((type) => {
    if (type.action == 'confirm') {
      uni.openCustomerServiceChat({
        corpId: 'wwd8a1200c46e63718',
        extInfo: {
          url: 'https://work.weixin.qq.com/kfid/kfc571cd6bb4349e984'
        }
      })
    }
  })
}

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/share2.jpg',
    path: '/pages/index/index',
  }
})


const chooseAvatar = async (event) => {
  uni.showLoading({
    title: '正在处理'
  })

  let res = await $http.upload('api/global/fileupload/upload', event.detail.avatarUrl).catch(() => {})

  if (res?.data) {
    uni.login({
      success: (res1) => {
        $http.post('api/user/auth/userauth/get_openid', {
          code: res1.code,
          micro_appid: uni.getAccountInfoSync().miniProgram.appId
        }).then((res2) => {
          $http.post('api/user/auth/userauth/update_wx_info', {
            openid: res2.data,
            avatarUrl: res.data,
            nickName: user.value.nickname
          }).then(() => {
            user.value.avatar_url = res.data
          }).finally(() => {
            uni.hideLoading()
          })
        }).catch(() => {
          uni.hideLoading()
        })
      }
    })
  } else {
    uni.hideLoading()

    uni.showToast({
      title: '上传失败',
      icon: 'none'
    })
  }
}

const nicknameChange = (event) => {
  user.value.nickname = event.detail.value

  uni.login({
    success: (res) => {
      $http.post('api/user/auth/userauth/get_openid', {
        code: res.code,
        micro_appid: uni.getAccountInfoSync().miniProgram.appId
      }).then((res) => {
        $http.post('api/user/auth/userauth/update_wx_info', {
          openid: res.data,
          avatarUrl: user.value.avatar_url,
          nickName: user.value.nickname
        })
      })
    }
  })
}

const toMessage = () => {
  msgRef.value.openMessage()
}

onShow(() => {
  $http.get('api/user/auth/userauth/info?referch=1').then(res => {
    let vip_info = res.data.vip_info

    if (vip_info.vip_end_time) {
      vip_info.vip_end_time = `${vip_info.vip_end_time.slice(0, 4)}年${vip_info.vip_end_time.slice(5, 7)}月${vip_info.vip_end_time.slice(8, 10)}日`
    }

    user.value = {
      ...res.data,
      ...vip_info,
    };
  }).catch(() => {
    user.value = {}
  })
})

const toMember = () => {
  toRouter('/pages/member/index')
}

const jump = () => {
  if (!user.value.uid) {
    toRouter('/pages/login/index')
    return
  }

  toRouter('/pages/account/index')
}
</script>

<style>
page {
  height: 100%;
}
</style>

<style scoped lang="scss">
.my-index {
  height: 100%;
  background: url("https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/my/bg.png") left top/100% auto no-repeat;
  overflow: auto;
  display: flex;
  flex-direction: column;
  --wot-message-box-width: 600rpx;
}

.my-nav{
  flex-shrink: 0;
  padding-top: 200rpx;
}
.my-cell{
  --wot-color-white: none;
}
.my-status{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 0.6rem;
  color: #333333;
}
.join-vip{
  margin-top: 27rpx;
  margin-bottom: 53rpx;
  padding: 0 30rpx;
  position: relative;

  button {
    align-self: flex-start;
    margin-top: 16rpx;
  }

  .vip-bg {
    width: 100%;
  }

  .vip-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
}
.join-vip_name{
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 4rpx;
}
.join-vip_tip{
  font-size: 22rpx;
  color: #9A9A9A;
  position: absolute;
  top: 172rpx;
  left: 93rpx;
}

.join-bottom {
  position: absolute;
  top: 138rpx;
  right: 88rpx;
  width: 134rpx;
  height: 52rpx;
  background: #CDF022;
  border-radius: 10rpx;
  font-weight: 600;
  font-size: 24rpx;
  color: #212121;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.menu-box {
  padding: 0 30rpx;
}

.global-m_y{
  // --wot-card-padding: 0.4rem 0.6rem;
  // --wot-card-margin: 0;
  // --wot-cell-title-fs: 0.9rem;
  flex-grow: 1;
  background: #FFFFFF;
  padding: 40rpx 0 0 0;
  border-radius: 30rpx;
}
.my-cell_img{
  height: 18px;
  width: 18rpx;
  margin-right: 32rpx;
  position: relative;
  top: 6rpx;
}

.chooseAvatar {
  padding: 0;
  margin: 0;
  background: transparent;
  height: 124rpx;

  &:after {
    border: none;
    outline: 0;
  }
}

.contact-btn {
  background: transparent;
  padding-left: 30rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  &:after {
    border: none;
    outline: 0;
  }

  text {
    font-size: var(--wot-cell-title-fs, 14px);
    color: var(--wot-cell-title-color, rgba(0, 0, 0, 0.85));
    padding-left: 2rpx;
    flex-grow: 1;
    text-align: left;
  }
}
</style>