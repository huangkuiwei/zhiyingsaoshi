<template>
  <view class="login-page">
    <view class="logo">
      <uni-icons style="margin-bottom: 90rpx" type="arrow-left" size="30" @click="toBack" />

      <wd-img
          width="310rpx"
          height="117rpx"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/login-logo.png"
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

<style>
page {
  height: 100%;
  background: url("https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/login_bg.png") left top/100% 100% no-repeat;
}
</style>

<style scoped lang="scss">
.login-page {
  height: 100%;
  background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/login/login-bg.png') top left/100% 100%
    no-repeat;
  padding-bottom: 60rpx;
  display: flex;
  flex-direction: column;

  .logo{
    padding: 95rpx 0 103rpx 44rpx;
    display: flex;
    flex-direction: column;
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
      height: 90rpx;
      background: #0abf92;
      border-radius: 45rpx;
      font-weight: 500;
      font-size: 32rpx;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 29rpx;
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
        color: #333333;
        font-size: 0.8rem;
        display: flex;
      }
    }
  }
}
</style>
