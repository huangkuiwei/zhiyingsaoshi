<template>
  <view class="lottery-page">
    <image
      class="banner"
      mode="widthFix"
      src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/banner.png"
    />

    <view class="user-list">
      <swiper autoplay :interval="3000" circular vertical>
        <swiper-item v-for="(item, key) of userList" :key="key">
          <view>
            <text>{{ item.name }}抽到</text>
            <text>{{ item.value }}</text>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <view class="lottery-box">
      <view class="count">剩余抽取次数: {{ drawCount }}</view>
      <view class="adv" v-if="!drawCount" @click="lookAdv">观看视频获得抽奖资格</view>

      <view class="jp1">
        <image
            class="drawing-img"
            v-if="drawing"
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/drawing.gif"
        />

        <image
            class="no-draw-img"
            v-else
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/img1.png"
        />
      </view>

      <image
          v-if="drawing"
          class="btn1"
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/btn2.png?t=123"
      />

      <image
          v-else
          class="btn1"
          mode="widthFix"
          :src="drawCount ? 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/btn1.png' : 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/btn6.png'"
          @click="getDraw"
      />
    </view>

    <view class="draw-img">
      <image
          class="bg"
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/jiangpin.png"
      />

      <view class="draw-list">
        <view>
          <image
              mode="widthFix"
              src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/icon1.png?t=123"
          />

          <text>50元话费红包</text>
        </view>

        <view>
          <image
              mode="widthFix"
              src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/icon2.png?t=123"
          />

          <text>腾讯视频会员</text>
        </view>

        <view>
          <image
              mode="widthFix"
              src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/icon3.png?t=123"
          />

          <text>0.1元现金红包</text>
        </view>

        <view>
          <image
              mode="widthFix"
              src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/icon4.png?t=123"
          />

          <text>iPhone17</text>
        </view>

        <view>
          <image
              mode="widthFix"
              src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/icon5.png?t=123"
          />

          <text>20元话费红包</text>
        </view>
      </view>
    </view>

    <uni-popup ref="noDrawCountDialog" maskBackgroundColor="rgba(0, 0, 0, 0.5)">
      <view class="no-draw-dialog">
        <view class="title">抽奖机会已用完</view>
        <view class="tip">观看视频获得抽奖资格～</view>

        <image
            class="btn"
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/btn4.png"
            @click="$refs.noDrawCountDialog.close(); lookAdv()"
        />

        <image
            class="close"
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/close.png"
            @click="$refs.noDrawCountDialog.close()"
        />
      </view>
    </uni-popup>

    <uni-popup ref="noDrawDialog" maskBackgroundColor="rgba(0, 0, 0, 0.5)">
      <view class="no-draw-dialog">
        <view class="title">很遗憾没中奖</view>
        <view class="tip" :style="{ opacity: drawCount ? '0' : '1' }">别气馁，观看视频获得抽奖资格～</view>

        <image
            class="btn"
            mode="widthFix"
            :src="drawCount ? 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/btn3.png' : 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/btn4.png'"
            @click="again"
        />

        <image
            class="close"
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/close.png"
            @click="$refs.noDrawDialog.close()"
        />
      </view>
    </uni-popup>

    <uni-popup ref="drawHongbaoDialog" maskBackgroundColor="rgba(0, 0, 0, 0.5)">
      <view class="draw-hongbao-dialog">
        <image
            class="word"
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/word1.png"
        />

        <image
            class="hongbao"
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/hongbao.png"
        />

        <view class="tip">现金红包</view>

        <image
            class="btn"
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/btn5.png"
            @click="$refs.drawHongbaoDialog.close()"
        />

        <image
            class="close"
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/close.png"
            @click="$refs.drawHongbaoDialog.close()"
        />
      </view>
    </uni-popup>
  </view>
</template>

<script>
import $http from '@/hooks/http'

let videoAd = null

export default {
  name: 'lottery',

  data() {
    return {
      userList: [
        { name: '用户151****5485', value: '20元话费红包' },
        { name: '用户184****9854', value: '腾讯视频会员' },
        { name: '用户188****2548', value: '0.1元现金红包' },
        { name: '用户137****9985', value: '20元话费红包' },
        { name: '用户192****7845', value: '腾讯视频会员' },
        { name: '用户132****1452', value: '50元话费红包' },
        { name: '用户152****3658', value: '腾讯视频会员' },
        { name: '用户154****7878', value: '0.1元现金红包' },
      ],
      drawing: false,
      drawCount: 0,
      sign_order_no: null,
    };
  },

  onLoad() {
    this.sign_order_no = uni.getStorageSync('sign_order_no')
    let drawCount = uni.getStorageSync('drawCount')

    if (drawCount) {
      this.drawCount = Number(drawCount) || 0
    }

    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-56fd5a12cde9f4c3'
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {
        console.error('激励视频广告加载失败', err)
      })
      videoAd.onClose((res) => {
        // 奖励一次抽奖机会
        if (res.isEnded) {
          this.drawCount += 1
          uni.showToast({
            title: '观看成功，获得一次抽奖机会',
            icon: 'none',
          })
        }
      })
    }
  },

  methods: {
    async getDraw() {
      if (!this.drawCount) {
        this.lookAdv()
        return
      }

      this.drawing = true;
      await this.sleep(2000)

      $http.post('https://sspi.zyyttech.cn/api/open/order/cashgift/lucky_draw', {
        external_agreement_no: this.sign_order_no,
      }, {
        showErrorDialog: true
      }).then(async (res) => {
        this.drawCount -= 1

        if (Number(res.data.lucky_result) === 1) {
          this.$refs.drawHongbaoDialog.open()
          let mchId = res.data.mch_id
          let appid = res.data.appid
          let package1 = res.data.package

          await this.merchantTransfer(mchId, appid, package1).catch(() => {})
        } else {
          this.$refs.noDrawDialog.open()
        }
      }).finally(() => {
        this.drawing = false;
      })
    },

    merchantTransfer(mchId, appid, package1) {
      return new Promise((resolve, reject) => {
        uni.requestMerchantTransfer({
          mchId: mchId,
          appId: appid,
          package: package1,
          success: (res1) => {
            console.log('res1:', res1);

            // res.err_msg将在页面展示成功后返回应用时返回ok，并不代表付款成功
            if (res1.errMsg === 'requestMerchantTransfer:ok') {
            }
            resolve(res1)
          },
          fail: (error) => {
            console.log('error:', error, mchId, appid, package1);
            uni.showToast({
              title: error.errMsg,
              icon: 'none',
            })

            reject(error)
          },
        });
      })
    },

    sleep(time) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, time)
      })
    },

    again() {
      this.$refs.noDrawDialog.close()

      if (this.drawCount) {
        setTimeout(() => {
          this.getDraw()
        }, 500)
      } else {
        this.lookAdv()
      }
    },

    lookAdv() {
      if (videoAd) {
        videoAd.show().catch(() => {
          // 失败重试
          videoAd.load()
              .then(() => videoAd.show())
              .catch(err => {
                console.error('激励视频广告显示失败', err);

                uni.showToast({
                  title: err.errDetail || '激励视频广告显示失败',
                  icon: 'none',
                });
              })
        })
      }
    }
  }
};
</script>

<style lang="scss">
page {
  height: 100%;
}
</style>

<style scoped lang="scss">
.lottery-page {
  height: 100%;
  overflow: auto;
  background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/bg.png') left top/100% 100%
    no-repeat;
  padding-top: 100rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  image {
    width: auto;
    height: auto;
  }

  .banner {
    width: 603rpx;
    margin-bottom: 28rpx;
  }

  .user-list {
    width: 500rpx;
    margin-bottom: 13rpx;

    swiper {
      width: 100%;
      height: 60rpx;
      background: #ffffff60;
      border-radius: 30rpx;

      swiper-item {
        height: 100%;
        width: 100%;

        view {
          font-size: 27rpx;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15rpx;

          text {
            &:nth-child(1) {
              color: #333333;
            }

            &:nth-child(2) {
              color: #e11304;
            }
          }
        }
      }
    }
  }

  .lottery-box {
    width: 100%;
    height: 813rpx;
    background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/lottery_bg.png?t=123') left top/100%
      100% no-repeat;
    position: relative;
    margin-bottom: 22rpx;

    .count {
      position: absolute;
      left: 0;
      right: 0;
      top: 110rpx;
      width: 100%;
      text-align: center;
      font-weight: 500;
      font-size: 28rpx;
      color: #FFFFFF;
    }

    .adv {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 180rpx;
      width: 100%;
      text-align: center;
      font-size: 24rpx;
      color: #FFFFFF;
      text-stroke: 0.3px #FF4242;
      -webkit-text-stroke: 0.3px #FF4242;
    }

    .jp1 {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 240rpx;

      .drawing-img {
        position: absolute;
        left: 76rpx;
        bottom: -12px;
        width: 602rpx;
      }

      .no-draw-img {
        position: absolute;
        left: 122rpx;
        bottom: 0;
        width: 501rpx;
      }
    }

    .btn1 {
      position: absolute;
      bottom: 50rpx;
      left: 161rpx;
      width: 412rpx;
    }
  }

  .draw-img {
    width: 100%;
    box-sizing: border-box;
    padding: 0 35rpx;
    position: relative;

    .bg {
      width: 100%;
    }

    .draw-list {
      position: absolute;
      left: 60rpx;
      right: 60rpx;
      bottom: 25rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      view {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10rpx;

        image {
          width: 112rpx;
        }

        text {
          font-size: 13rpx;
          color: #000000;
        }
      }
    }
  }
}

.no-draw-dialog {
  width: 683rpx;
  height: 926rpx;
  background: url("https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/bg2.png") left top/100% 100% no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    padding-top: 400rpx;
    font-weight: 600;
    font-size: 54rpx;
    color: #991000;
    margin-bottom: 26rpx;
  }

  .tip {
    font-size: 24rpx;
    color: #5A5A5A;
    margin-bottom: 58rpx;
  }

  .btn {
    width: 332rpx;
    margin-bottom: 96rpx;
  }

  .close {
    width: 55rpx;
  }
}

.draw-hongbao-dialog {
  width: 672rpx;
  height: 588rpx;
  background: url("https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/lottery/bg3.png") left top/100% 100% no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;

  .word {
    flex-shrink: 0;
    width: 386rpx;
    margin-bottom: 42rpx;
  }

  .hongbao {
    flex-shrink: 0;
    width: 256rpx;
    margin-bottom: 30rpx;
  }

  .tip {
    flex-shrink: 0;
    font-weight: 600;
    font-size: 45rpx;
    color: #FFFFFF;
    background: linear-gradient(3deg, #FFECB1 0%, #FFFFFF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 60rpx;
  }

  .btn {
    flex-shrink: 0;
    width: 440rpx;
    margin-bottom: 53rpx;
  }

  .close {
    flex-shrink: 0;
    width: 55rpx;
  }
}
</style>
