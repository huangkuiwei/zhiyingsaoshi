<script setup>
import { reactive } from 'vue'
import { onShareAppMessage, onShow } from '@dcloudio/uni-app'
import $http from '@/hooks/http'

const state = reactive({
  user: {},
  step: 1,
  modifyPhoneParams: {
    old_mobile_sms_sign: undefined,
    old_mobile_sms_code: '',
    new_mobile: undefined,
    new_mobile_sms_sign: undefined,
    new_mobile_sms_code: ''
  }
})

onShow(() => {
  $http.get('api/user/auth/userauth/info?referch=1').then(res => {
    let vip_info = res.data.vip_info

    state.user = {
      ...res.data,
      ...vip_info
    }
  })
})

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})


const getStep1Code = () => {
  uni.showLoading({
    title: '正在发送短信',
    mask: true
  })

  $http.post('api/global/sms/send_code', {
    mobile: state.user.phone,
  }).then((res) => {
    uni.hideLoading()
    state.modifyPhoneParams.old_mobile_sms_sign = res.data.sign
    state.step = 2
  })
}

const onInputChange1 = ($event) => {
  if ($event.target.value.length >= 6) {
    setTimeout(() => {
      state.modifyPhoneParams.old_mobile_sms_code = $event.target.value.slice(0, 6)

      uni.showLoading({
        title: '请稍等...',
        mask: true
      })

      $http.post('api/global/sms/verify_code', {
        sign: state.modifyPhoneParams.old_mobile_sms_sign,
        mobile: state.user.phone,
        code: state.modifyPhoneParams.old_mobile_sms_code,
        sms_type: 2
      }).then(() => {
        uni.hideLoading()

        uni.showToast({
          title: '验证成功'
        })

        setTimeout(() => {
          state.step = 3
        }, 1500)
      })
    })
  }
}

const getStep2Code = () => {
  if (state.modifyPhoneParams.new_mobile === state.user.phone) {
    uni.showToast({
      title: '新旧号码不能相同',
      icon: 'none'
    })

    return
  }

  uni.showLoading({
    title: '正在发送短信',
    mask: true
  })

  $http.post('api/global/sms/send_code', {
    mobile: state.modifyPhoneParams.new_mobile,
  }).then((res) => {
    uni.hideLoading()
    state.modifyPhoneParams.new_mobile_sms_sign = res.data.sign
    state.step = 4
  })
}

const onInputChange2 = ($event) => {
  if ($event.target.value.length >= 6) {
    setTimeout(() => {
      state.modifyPhoneParams.new_mobile_sms_code = $event.target.value.slice(0, 6)

      uni.showLoading({
        title: '请稍等',
        mask: true
      })

      $http.post('api/user/auth/userauth/change_mobile', {
        old_mobile_sms_sign: state.modifyPhoneParams.old_mobile_sms_sign,
        old_mobile_sms_code: state.modifyPhoneParams.old_mobile_sms_code,
        new_mobile: state.modifyPhoneParams.new_mobile,
        new_mobile_sms_sign: state.modifyPhoneParams.new_mobile_sms_sign,
        new_mobile_sms_code: state.modifyPhoneParams.new_mobile_sms_code
      }).then(() => {
        uni.showToast({
          title: '修改成功'
        })

        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      })
    })
  }
}
</script>

<template>
  <view class="bind-phone">
    <view class="step1" v-if="state.step === 1" key="1">
      <view class="title">验证旧手机号</view>
      <view class="phone">{{ state.user.phone }}</view>
      <view class="btn" @click="getStep1Code">获取验证码</view>
    </view>

    <view class="step2" v-if="state.step === 2" key="2">
      <view class="title">请输入验证码</view>
      <view class="sub-title">验证码已经发送到你的手机号：{{ state.user.phone }}</view>
      <view class="code">
        <input type="number" :focus="true" v-model="state.modifyPhoneParams.old_mobile_sms_code" @input="($event) => onInputChange1($event)" placeholder="请输入验证码">
      </view>
    </view>

    <view class="step3" v-if="state.step === 3" key="3">
      <view class="title">验证新手机号</view>
      <input class="phone" type="number" maxlength="11" v-model="state.modifyPhoneParams.new_mobile" placeholder="请输入新手机号">
      <view class="btn" @click="getStep2Code">获取验证码</view>
    </view>

    <view class="step2" v-if="state.step === 4" key="4">
      <view class="title">请输入验证码</view>
      <view class="sub-title">验证码已经发送到你的手机号：{{ state.modifyPhoneParams.new_mobile }}</view>
      <view class="code">
        <input type="number" :focus="true" v-model="state.modifyPhoneParams.new_mobile_sms_code" @input="($event) => onInputChange2($event)" placeholder="请输入验证码">
      </view>
    </view>
  </view>
</template>

<style lang="scss">
page {
  background: #ffffff;
}

.bind-phone {
  padding: 70rpx 40rpx 0;

  .step1 {
    .title {
      color: #111111;
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 60rpx;
    }

    .phone {
      width: 100%;
      color: #999999;
      font-size: 30rpx;
      background: #f0f0f0;
      border-radius: 40rpx;
      height: 80rpx;
      display: flex;
      align-items: center;
      padding-left: 30rpx;
      margin-bottom: 130rpx;
    }

    .btn {
      background: #00D7AD;
      color: #ffffff;
      border-radius: 40rpx;
      height: 80rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .step2 {
    .title {
      color: #111111;
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 15rpx;
    }

    .sub-title {
      color: #999999;
      font-size: 24rpx;
      margin-bottom: 80rpx;
    }

    input {
      width: 100%;
      height: 90rpx;
      border-bottom: 1px solid #00D7AD;
      background: #ffffff;
      font-size: 36rpx;
    }
  }

  .step3 {
    .title {
      color: #111111;
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 60rpx;
    }

    .phone {
      box-sizing: border-box;
      width: 100%;
      border: 1px solid #00D7AD;
      color: #111111;
      font-size: 34rpx;
      border-radius: 50rpx;
      height: 100rpx;
      padding-left: 50rpx;
      margin-bottom: 130rpx;
    }

    .btn {
      background: #00D7AD;
      color: #ffffff;
      border-radius: 40rpx;
      height: 80rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
