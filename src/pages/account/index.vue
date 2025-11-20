<template>
  <view style="margin-top: 0.4rem;" class="account">
    <wd-card
      type="rectangle"
      custom-class="h-card"
    >
      <wd-cell-group border>
        <wd-cell title="头像" center>
          <template #>
            <button class="chooseAvatar" open-type="chooseAvatar" @chooseavatar="chooseAvatar">
              <image
                  mode="widthFix"
                  :src="user.avatar_url || `https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/default-head.png`"
              />
            </button>
          </template>
        </wd-cell>
        <!--<wd-cell size="large" title="性别" is-link value="女"></wd-cell>-->
        <wd-cell size="large" title="帐户ID" :value="user.uid"></wd-cell>
        <wd-cell size="large" title="绑定手机号" is-link :value="user.phone" @click="toRouter('/pages/bindPhone/index')"></wd-cell>
        <!--<wd-cell size="large" title="自动续费" value="12345678913574">-->
        <!--  <template #>-->
        <!--    <wd-switch size="20px" v-model="checked" />-->
        <!--  </template>-->
        <!--</wd-cell>-->
        <wd-cell size="large" title="权限设置" is-link @click="permissionsSetting"></wd-cell>
      </wd-cell-group>
    </wd-card>
  </view>
  <view class="global-m account-btn" style="margin-top: 200rpx;" v-if="user.uid">
    <button @click="loginOut" block>
      退出登录
    </button>
  </view>
  <wd-message-box></wd-message-box>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShareAppMessage, onShow } from '@dcloudio/uni-app'
import { useMessage } from '/node_modules/wot-design-uni'
import { toRouter } from '@/hooks/utils'
import $http from '@/hooks/http'
const message = useMessage(), user = ref({})
const checked = ref(false)

const loginOut = () => {
  message.confirm({
    title: '退出',
    msg: '您要退出吗'
  }).then( () => {
    uni.showLoading({
      title: '正在退出'
    })

    // uni.removeStorageSync('username')
    $http.post('api/user/auth/userauth/logout').then( () => {
      uni.removeStorageSync('toolsToken')
      toRouter('/pages/login/index')
    }).finally(() => {
      uni.hideLoading()
    })
  } ).catch( () => {

  } )
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

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})


const permissionsSetting = () => {
  uni.openSetting({
    success (res) {
      console.log(res.authSetting)
    }
  })
}

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
</script>
<style>
page{
  background: rgba(247, 248, 252, 1);
}

.wd-cell__title {
  color: #333333;
}
</style>
<style scoped lang="scss">
.account{
  --wot-cell-title-fs: 1rem;
  --wot-cell-value-fs: 0.85rem;
  --wot-cell-value-color: #999;
  --wot-cell-wrapper-padding-large: 1rem;
}

.account-btn {
  button {
    background: #B0B0B0;
    color: #FFFFFF;
    border-radius: 60rpx;
    border: none;
    outline: none;

    &::after {
      border: none;
    }
  }
}

.chooseAvatar {
  display: inline-block;
  padding: 0;
  margin: 0;
  background: transparent;
  height: 100rpx;
  width: 100rpx;

  image {
    width: 100rpx;
    border-radius: 12rpx;
  }

  &:after {
    border: none;
    outline: 0;
  }
}
</style>