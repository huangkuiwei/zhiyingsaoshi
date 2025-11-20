import { toSwich } from '@/hooks/utils'
import validator from 'validator'
import $http from '../../hooks/http'

export const toLogin = async (username, vercode, radio, sign) => {
  if( !radio ){
    return uni.showToast({
      icon: 'none',
      title: '请选同意服务及隐私协议'
    })
  }
  if( !vercode ){
    return uni.showToast({
      icon: 'none',
      title: '验证码不能为空'
    })
  }
  const isPhone = validator.isMobilePhone(username, 'zh-CN');
  isPhone ? function(){
    uni.showToast({
      title: '正在登录',
      icon: 'loading'
    });

    $http.post('api/user/auth/userauth/login', {
      uname: username,
      sms_sign: sign,
      sms_code: vercode
    }).then((res) => {
      console.log('res.data1', res.data)

      let token = res.data.token;
      uni.setStorageSync('toolsToken', token)
      toSwich('/pages/index/index')
    })
  }(
    
  ): uni.showToast({title: '手机号码格式错误',icon:'none'})
  // toSwich('/pages/index/index')
}

export const toVercode = async (username) => {
  const sms = await uni.request({
    url: '/api/sms/wx',
    method: 'POST',
    data:{
      username
    }
  })
}