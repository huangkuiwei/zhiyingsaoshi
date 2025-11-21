<template>
  <view class="login-page">
    <view class="logo">
      <uni-icons type="left" size="30" @click="toBack" />
    </view>

    <view class="logo-img">
      <wd-img
          width="147rpx"
          height="140rpx"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/login/logo.png"
      ></wd-img>

      <wd-img
          v-if="loginType === 0"
          width="357rpx"
          height="51rpx"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/login/logo2.png"
      ></wd-img>
    </view>

    <view class="banner"> </view>

    <view class="container">
      <view class="input-box">
        <text>{{ phone.slice(0, 3) }}****{{ phone.slice(-4) }}</text>
      </view>

      <view class="login" @click="login">一键登录</view>
      <view class="other-login" @click="toBack">其他手机号码登录</view>

      <view class="login-agree" style="padding: 0 32rpx">
        <wd-checkbox checked-color="rgba(35, 156, 247, 1)" size="large" v-model="radio"></wd-checkbox>
        <view class="login-agree_text">
          已阅读并同意
          <view style="color: #239CF7" @click="toRouter(`/pages/vipProtocol/index`, `title=${encodeURIComponent('《用户服务及隐私协议》')}`)">《用户服务及隐私协议》</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { toRouter, toSwich } from '../../hooks/utils'

export default {
  name: 'login',

  data() {
    return {
      radio: false,
      phone: '',
      token: '',
    };
  },

  onLoad(options) {
    this.phone = options.phone;
    this.token = options.token;
  },

  onShareAppMessage() {
    return {
      title: '高清电子文档一键转换',
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
      path: '/pages/index/index',
    };
  },

  methods: {
    toRouter,

    toBack() {
      uni.navigateBack();
    },

    /**
     * 登录
     */
    login() {
      if(!this.radio){
        return uni.showToast({
          icon: 'none',
          title: '请选同意服务及隐私协议'
        })
      }

      let token = this.token;
      uni.setStorageSync('toolsToken', token)
      toSwich('/pages/index/index')
    },
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
  // TODO 背景有问题
  background: #FFFFFF linear-gradient(228deg, #D5F1FD 0%, #D5F5C2 33%, #D6F985 100%) left top/100% 483rpx no-repeat;
}
</style>

<style scoped lang="scss">
.login-page {
  height: 100%;
  display: flex;
  flex-direction: column;

  .logo{
    padding: 105rpx 0 128rpx 20rpx;
    display: flex;
    flex-direction: column;
  }

  .logo-img {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 52rpx;
    margin-bottom: 60rpx;
  }

  .banner {
    flex-shrink: 0;
    padding: calc(var(--page-title-height)) 0 0;
  }

  .container {
    flex-grow: 1;
    padding-bottom: 180rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .input-box {
      font-weight: 500;
      font-size: 48rpx;
      color: #1a1a1a;
      margin-bottom: 92rpx;
    }

    .login {
      width: 560rpx;
      font-weight: 500;
      font-size: 32rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 29rpx;
      border-radius: 16rpx;
      background: #CDF022;
      color: #030203;
      font-weight: 500;
      font-size: 32rpx;
      height: 100rpx;
      line-height: 100rpx;
    }

    .other-login {
      font-weight: 500;
      font-size: 24rpx;
      color: #666666;
      margin-bottom: 37rpx;
    }

    .login-agree{
      display: flex;
      margin-top: 34rpx;
      align-items: center;

      .login-agree_text{
        color: #030203;
        font-size: 22rpx;
        display: flex;
      }
    }
  }
}
</style>
