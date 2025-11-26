
import { toRouter, toSwich } from '@/hooks/utils'
import $http from '../../hooks/http'
export const onPay = (price, openid, agree, user) => {
  console.log('agree', agree)

  if (!user.uid) {
    uni.showModal({
      title: '提示',
      content: '您当前未登录或登录已失效，为了您有更好的体验，智映扫视需要您进行登录',
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          toRouter('/pages/login/index')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

    return
  }

  if (!agree.includes('1')) {
    uni.showToast({
      title: '请先阅读并同意会员协议',
      icon: 'none',
    })

    return
  }

  uni.showLoading({
    title: '正在开通会员',
    mask: true,
  })

  // TODO 连续包月
  if (price.id === 10009) {
    // $http
    //   .post('https://sspi.zyyttech.cn/api/business/ali_sign/create_sign', {
    //     mobile: user.phone,
    //     pt: 15,
    //     url: 'https://tfz.wiiken.cn/#/pages/hnwk/wksmts/5072342?pid=38649',
    //     appid: uni.getAccountInfoSync().miniProgram.appId,
    //     system_type: uni.getDeviceInfo().platform === 'ios' ? 'ios' : 'android',
    //     openid: openid,
    //     user_agent:
    //       'Mozilla/5.0 (Linux; Android 8.1.0; vivo Y85A Build/OPM1.171019.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/122.0.6261.120 Mobile Safari/537.36 XWEB/1220099 MMWEBSDK/20240404 MMWEBID/106 MicroMessenger/8.0.49.2600(0x28003133) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64',
    //   })
    //   .then((res) => {
    //     let query = getQueryParam(res.data, 'query');
    //     let orderNo = query.split('=')[1];
    //
    //     uni.request({
    //       method: 'GET',
    //       url: `https://sspi.zyyttech.cn/api/business/ali_sign/au_order/${orderNo}`,
    //       success: (res) => {
    //         if (res.data.code === 0 || res.data.Code === 0) {
    //           if (res.data.data.startsWith('http')) {
    //             uni.navigateTo({
    //               url: `/pages/webview/webview?src=${encodeURIComponent(res.data.data)}`,
    //             });
    //           } else {
    //             let params = JSON.parse(res.data.data);
    //             console.log(params, 'params');
    //
    //             uni.navigateToMiniProgram({
    //               appId: 'wxbd687630cd02ce1d',
    //               path: 'pages/index/index',
    //               extraData: {
    //                 appid: params.appid,
    //                 contract_code: params.contract_code,
    //                 contract_display_account: params.contract_display_account,
    //                 mch_id: params.mch_id,
    //                 notify_url: params.notify_url,
    //                 plan_id: params.plan_id,
    //                 request_serial: params.request_serial,
    //                 timestamp: Number(params.timestamp),
    //                 sign: params.sign,
    //                 // return_web: params.return_web,
    //                 // version: params.version,
    //               },
    //               success(res) {
    //                 // 成功跳转到签约小程序
    //                 console.log(params, res, 'success');
    //               },
    //               fail(res) {
    //                 // 未成功跳转到签约小程序
    //                 console.log(res, 'fail');
    //               },
    //             });
    //           }
    //         } else {
    //           uni.showToast({
    //             title: res.data.msg || res.data.Msg,
    //             icon: 'none',
    //             mask: true,
    //           });
    //         }
    //       },
    //       complete: () => {
    //         uni.hideLoading();
    //       },
    //     });
    //   })
    //   .catch(() => {
    //     uni.hideLoading();
    //   });

    uni.showModal({
      content: '暂不支持连续包月购买',
      showCancel: false,
    })

    return
  }

  $http.post('api/user/order/pay/create', {
    product_id: price.id,
    pay_type: 12,
    system_type: uni.getDeviceInfo().platform === 'ios' ? 'ios' : 'android',
    micro_appid: uni.getAccountInfoSync().miniProgram.appId,
    openid: openid
  }).then((res) => {
    console.log('res.data', res.data)
    let payInfo = JSON.parse(res.data)

    uni.requestPayment({
      ...payInfo,
      success: async (res) => {
        console.log('支付成功:', res);
        uni.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 1500
        })

        await $http.get('api/user/auth/userauth/info?referch=1').catch(() => {})
        uni.hideLoading()

        setTimeout(() => {
          toSwich('/pages/my/index')
        }, 1500)
      },
      fail: (err) => {
        uni.hideLoading()
        uni.showToast({
          title: '支付取消',
          icon: 'none',
          duration: 1500
        })
        console.error('支付失败:', err);
      },
    })
  }).catch(() => {
    uni.hideLoading()
  })
}

function getQueryParam(url, paramName) {
  // 定义正则表达式，用于匹配参数值
  const re = new RegExp('[?&]' + paramName + '=([^&#]*)', 'i');

  // 在 url 的 search 部分查找
  let match = url.replace(/^[^?]+/, '').match(re); // 提取 ? 后的部分再匹配

  // 如果没找到，在 hash 部分查找
  if (!match) {
    const hashMatch = url.match(/#.*$/);
    if (hashMatch) {
      match = hashMatch[0].replace(/\?.*$/, '').replace(/^#/, '?').match(re);
    }
  }

  // 返回解码后的结果或 null
  return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
}