<template>
  <view class="login">
    <view class="logo">
      <uni-icons type="left" size="30" @click="goHome" />
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

    <template v-if="loginType === 1">
      <view style="padding: 0 61rpx; margin-top: 66rpx">
        <wd-input v-model="username" :no-border="true" custom-class="login-input" size="large" placeholder="请输入手机号"></wd-input>
      </view>

      <view style="margin-top: 30rpx; padding: 0 61rpx">
        <wd-input :maxlength="6" v-model="vercode" :no-border="true" custom-class="login-input" size="large" placeholder="验证码">
          <template #suffix>
            <view v-show="verState">
              <!--<wd-button @click="getVercode" type="warning" custom-class="login-button" size="large">-->
              <!--  发送验证码-->
              <!--</wd-button>-->
              <button @click="getVercode" class="login-button">
                发送验证码
              </button>
            </view>
            <view v-show="!verState">
              <wd-count-down @finish="onFinish" ref="countDown" :auto-start="false" format="ss" :time="time" />
            </view>
          </template>
        </wd-input>
      </view>
      <view class="login-agree" style="padding: 0 87rpx">
        <wd-checkbox checked-color="rgba(35, 156, 247, 1)" size="large" v-model="radio"></wd-checkbox>
        <view class="login-agree_text">
          已阅读并同意
          <view style="color: #239CF7" @click="toRouter(`/pages/vipProtocol/index`, `title=${encodeURIComponent('《用户服务及隐私协议》')}`)">《用户服务及隐私协议》</view>
        </view>
      </view>
    </template>

    <view class="login-btns">
      <template v-if="loginType === 0">
        <view class="login-btn login-btn1">
          <button @click="showOneKeyLoginTip" custom-class="submit-btn" block size="large">
            授权手机号一键登录
          </button>
        </view>

        <view class="login-btn login-btn2">
          <button @click="loginType = 1" custom-class="submit-btn" block size="large">
            用短信验证码登录
          </button>
        </view>
      </template>

      <view class="login-btn login-btn3" v-else>
        <button @click="toLogin(username, vercode, radio, sign)" custom-class="submit-btn" block size="large">
          登录
        </button>
      </view>
    </view>
    <!-- <view class="login-weixin">
      <wd-divider style="width:200px">其他登录方式</wd-divider>
      <view style="height: 1rem;"></view>
      <wd-img
        width="50"
        height="50"
        src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/images/weixin.png"
      ></wd-img>
      <view style="height: 0.5rem;"></view>
      <view class="font-tip">微信</view>
    </view> -->

    <custom-dialog ref="redemptionDialog" title="温馨提示" :shop-close="false">
      <view class="content">
        <view class="input-box">
          <view class="options">
            本机号码一键登录功能需要申请您的手机号权限，从而进行快捷登录。
          </view>
        </view>
      </view>

      <template #footer>
        <view class="btn">
          <wd-button type="default" @click="redemptionDialog.close()" custom-class="redemption-btn redemption-btn1">
            拒绝
          </wd-button>

          <wd-button open-type="getPhoneNumber" @getphonenumber="oneKeyLogin" custom-class="redemption-btn redemption-btn2">
            同意
          </wd-button>
        </view>
      </template>
    </custom-dialog>
  </view>
</template>

<script setup>
import { toRouter, toSwich } from '@/hooks/utils'
import { ref } from 'vue'
import validator from 'validator'
import { toLogin, toVercode } from './login.ts'
import $http from '@/hooks/http'
import { onShareAppMessage } from '@dcloudio/uni-app'
import customDialog from '../../components/customDialog.vue'

const verState = ref(true), time = ref(60*1000)
const sign = ref(null)
const vercode = ref(null), username = ref(uni.getStorageSync('username_lg'))
const radio = ref( false ), countDown = ref(null)
const redemptionDialog = ref(null)
const loginType = ref(0)

const getVercode = () => {
  const isPhone = validator.isMobilePhone(username.value, 'zh-CN');

  if (isPhone) {
    verState.value = false
    countDown.value.start()

    $http.post('api/global/sms/send_code', {
      mobile: username.value
    }).then((res) => {
      sign.value = res.data.sign
    })
  } else {
    uni.showToast({
      title: '手机号码格式错误',
      icon: 'none',
      duration: 2000
    })
  }
}

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/share2.jpg',
    path: '/pages/index/index',
  }
})

const showOneKeyLoginTip = () => {
  redemptionDialog.value.open()
}

const oneKeyLogin = (event) => {
  redemptionDialog.value.close()

  if (event.errMsg === 'getPhoneNumber:ok') {
    uni.showLoading({
      title: '加载中',
      mask: true,
    })

    $http
        .post('api/user/auth/userauth/login_by_phone', {
          code: event.code,
        })
        .then((res) => {
          toRouter('/pages/oneKeyLogin/oneKeyLogin', `phone=${res.data.phone}&token=${res.data.token}`);
        })
        .finally(() => {
          uni.hideLoading()
        });
  } else if (event.errno === 1400001) {
    uni.showModal({
      title: '提示',
      content: '该功能使用次数已达当前小程序上限，暂时无法使用，请手动填写手机号',
      showCancel: false,
      success: (res) => {
        if (res.confirm) {
        }
      },
    });
  }
}

const onFinish = () => {
  verState.value = true
  countDown.value.reset()
}

const goHome = () => {
  uni.switchTab({
    url: '/pages/index/index',
  })
}
</script>

<style lang="scss">
page {
  height: 100%;
  background: url("https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/login/bg.png") left top/100% 100% no-repeat;
}

.login-input {
  background: #F5F5F5 !important;
  border-radius: 20rpx !important;
}
</style>

<style scoped lang="scss">
.login{
  height: 100%;
}
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
}

.login-button{
  height: 2.2rem !important;
  background: #030203;
  color: #CDF022;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10rpx;
  font-size: 28rpx;

  &:after {
    border: none;
    outline: 0;
  }
}
.login-agree{
  display: flex;
  margin-top: 34rpx;
  align-items: center;
}
.login-agree_text{
  color: #030203;
  font-size: 22rpx;
  display: flex;
}

.login-btns {
  .login-btn{
    margin-top: 30rpx;
    font-weight: 500;
    padding: 0 74rpx;

    &.login-btn1 {
      margin-top: 128rpx;
    }

    &.login-btn2 {
      button {
        background: #F2FFB5;
      }
    }

    &.login-btn3 {
      margin-top: 97rpx;
    }

    button {
      border-radius: 16rpx;
      background: #CDF022;
      color: #030203;
      font-weight: 500;
      font-size: 32rpx;
      height: 100rpx;
      line-height: 100rpx;

      &:after {
        border: none;
      }
    }
  }
}

.submit-btn{
  height: 3rem !important;
  font-size: 1.2rem !important;
}
.login-weixin{
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
}
</style>

<style lang="scss">
.content {
  .input-box {
    margin-bottom: 54rpx;

    .options {
      font-size: 28rpx;
      color: #333333;
      line-height: 40rpx;
    }
  }
}

.btn {
  display: flex;
  align-items: center;
  justify-content: space-around;

  .redemption-btn {
    height: 80rpx !important;
    width: 150rpx !important;
    font-size: 28rpx !important;

    &.redemption-btn1 {
      border: 4rpx solid #CDF022;
    }
  }
}
</style>