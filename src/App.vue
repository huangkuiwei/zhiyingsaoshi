<script>
import { token } from '@/api/user'
import { toRouter } from '@/hooks/utils'
export default {
  onLaunch: function () {
    console.log('App Launch')
    uni.removeStorageSync("sign_order_no");

    let isModalShowing = false;
    uni.setStorageSync('$ossUrl', 'https://yonganpicture.oss-cn-shenzhen.aliyuncs.com/')
    uni.setStorageSync('$viewUrl', 'https://file.wiiken.cn/onlinePreview?url=')
    uni.setStorageSync('$picsUrl', 'https://file.wiiken.cn/picturesPreview?urls=')
    // uni.addInterceptor('request', {
    //   invoke(args) {
    //
    //     const token = uni.getStorageSync('token');
    //     if (token && args.url != '/api/login/wx') {
    //       args.header = {
    //         'Authorization': 'Bearer ' + token // 假设有一个getToken函数获取token
    //       }
    //     }
    //
    //     if (!args.url.includes('http')) {
    //       args.url = 'https://tools-api.xiaoohui.com' + args.url
    //     }
    //
    //     // let username = uni.getStorageSync('username')
    //     // if(!username && !args.url.includes('https://smapi.wiiken.cn')){
    //     //   if( args.url.indexOf('api/login') >= 0 || args.url.indexOf('api/sms') >= 0 ){
    //     //
    //     //   } else {
    //     //     if (!isModalShowing) {
    //     //       isModalShowing = true;
    //     //       uni.showModal({
    //     //         title: '提示',
    //     //         content: '您当前未登录或登录已失效，为了您有更好的体验，智映扫视需要您进行登录',
    //     //         showCancel: true,
    //     //         success: function (res) {
    //     //           if (res.confirm) {
    //     //             toRouter('/pages/login/index')
    //     //           } else if (res.cancel) {
    //     //             console.log('用户点击取消')
    //     //           }
    //     //         },
    //     //         complete: function () {
    //     //           isModalShowing = false;
    //     //         }
    //     //       })
    //     //     }
    //     //   }
    //     //
    //     //
    //     // }
    //   },
    //   success(args) {
    //     // 请求发送成功后做些什么
    //     // if( args.statusCode == 401 ){
    //     //   toRouter('/pages/login/index');
    //     // }
    //   },
    //   fail(err) {
    //     console.log( 'err', err );
    //
    //     // 请求发送失败后做些什么
    //   }
    // })
    // token()
    // uni.getStorageSync('username') ? '': toRouter('/pages/login/index')

    // 小程序版本更新
    const updateManager = uni.getUpdateManager();

    updateManager.onUpdateReady(() => {
      uni.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启小程序？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        },
      });
    });

    updateManager.onUpdateFailed((err) => {
      console.log('版本下载失败原因', err);

      uni.showToast({
        title: '新版本下载失败，请稍后再试',
        icon: 'none',
      });
    });
  },
  onShow: function (res) {
    console.log('App Show')

    // 场景值1038：从被打开的小程序返回
    if (res.scene === 1038) {
      const { appId, extraData } = res.referrerInfo;

      // appId为wxbd687630cd02ce1d：从签约小程序跳转回来
      if (appId === 'wxbd687630cd02ce1d') {
        if (extraData.return_code === 'SUCCESS') {
          let sign_order_no = uni.getStorageSync("sign_order_no");
          uni.setStorageSync('drawCount', 1);

          if (sign_order_no) {
            // 跳转到红包领取页面
            wx.navigateTo({
              url: '/pages/receiveRedPacket/receiveRedPacket',
            });
          } else {
            // 跳转到订购成功页面
            wx.navigateTo({
              url: '/pages/success/success',
            });
          }
        } else {
          // let sign_order_no = uni.getStorageSync("sign_order_no");
          // uni.setStorageSync('drawCount', 0);
          wx.showToast({
            title: '签约失败',
            icon: 'none',
          });

          // if (sign_order_no) {
          //   setTimeout(() => {
          //     // 跳转到红包领取页面
          //     wx.navigateTo({
          //       url: '/pages/lottery/lottery',
          //     });
          //   }, 500)
          // }
        }
      }
    }
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style>
@import url('@/unistyle.scss');
page{
  --wot-grid-item-padding: 0.4rem 0 !important;
  --wot-checkbox-checked-color: #00D7AD;
}
body{
  font-size: 1rem;
}
/*每个页面公共css */
</style>

<style lang="scss">
.count-tip-container {
  position: relative;

  image {
    width: 100%;
  }

  .count-info {
    position: absolute;
    top: 500rpx;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;

    .count-number {
      margin-bottom: 16rpx;

      text {
        color: #2F2F46;
        font-size: 40rpx;
        font-weight: bold;

        &:nth-child(2) {
          color: #E51616;
        }
      }
    }

    .join {
      margin-bottom: 30rpx;
      color: #999999;
      font-size: 26rpx;
      font-weight: bold;
    }

    .exit {
      color: #999999;
      font-size: 26rpx;
    }
  }

  .close {
    text-align: right;
    position: relative;
    top: 260rpx;
    right: 120rpx;

    image {
      width: 54rpx;
    }
  }

  .btn {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 100rpx;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9;

    image {
      width: 398rpx;
    }
  }
}

.d-flex-center {
  background: transparent !important;
  padding: 40rpx 0 0 !important;
  font-weight: bold !important;
}

// 公共样式
.wd-button.is-primary {
  background: #CDF022 !important;
  color: #212121 !important;
}

.wd-message-box__title {
  font-weight: bold !important;
  padding-bottom: 50rpx !important;
}

.wd-message-box__content .wd-input__inner {
  border: 2rpx solid #C0C0C0 !important;
  padding: 0 20rpx !important;
  border-radius: 10rpx !important;
  font-size: 22rpx !important;
}

.wd-message-box__content .wd-input:after {
  display: none !important;
}
</style>
