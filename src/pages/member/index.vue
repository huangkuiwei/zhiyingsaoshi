<template>
  <view class="member-top">
    <view style="width: calc(100% - 60rpx); display: flex; align-items: center; padding: 0 28rpx 0 32rpx">
      <image
          style="height: 124rpx; border-radius: 50%; margin-right: 14rpx"
          :src="user.avatar_url || `https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/default-head.png`"
          mode="heightFix"
      />

      <view style="display: flex; flex-direction: column; justify-content: center; gap: 10rpx; flex-grow: 1; margin-right: 10rpx">
        <view :style="{ fontWeight: 'bold', paddingLeft: '10rpx' }">
          <view v-if="!user.uid">未登录</view>
          <view v-else>{{user.nickname || '微信用户'}}</view>
        </view>

        <view style="font-size: 0.8rem; padding-left: 10rpx; align-self: self-start">
          <view v-if="!user.uid && platform !== 'ios'">
            低至每天<text style="color: rgba(246, 225, 177, 1); font-size: 1rem;">0.35</text>元，畅享全部权益
          </view>
          <view
              v-if="user.uid"
              style="display: flex; align-items: center; align-self: self-start; color: #B09D6D; background: #FCF0D1; padding: 0 12rpx; font-size: 0.6rem; border-radius: 5px; height: 20px;"
          >
            <wd-icon v-if="user.vip_type" custom-class="iconfont" class-prefix="icon" name="Silver" color="#BF932A" size="14"></wd-icon>
            <view style="margin-left: 0.2rem;">
              <text v-if="user.vip_type === 0">免费用户</text>
              <text v-if="user.vip_type === 1">日会员</text>
              <text v-if="user.vip_type === 5">月会员</text>
              <text v-if="user.vip_type === 8">年会员</text>
              <text v-if="user.vip_type === 15">高级月会员</text>
              <text v-if="user.vip_type === 18">高级年会员</text>
            </view>
          </view>
        </view>
      </view>

      <button v-if="!user.uid" @click="login" size="small" class="padding-x_medium">登录</button>
    </view>
  </view>
  
  <view class="member-content">
    <view class="global-m" style="padding-bottom: 400rpx; padding-top: 20rpx;">
      <view style="height: 0.5rem;"></view>
      <view class="member-grid" v-if="platform !== 'ios'">
        <view @click="memberSelect(item)" class="member-grid_li" :class="{'active': item.select}" v-for="(item,index) in lists" :key="index">
          <image v-if="item.recommend" mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon8/recommend.png" class="recommend"/>

          <view style="padding: 0 0 10rpx 0; font-size: 22rpx; color: #4D3924">{{item.name}}</view>
          <view class="member-price">
            <view class="tip">¥</view>
            <view class="price">{{ item.forever }}</view>
            <view class="tip">{{item.unit}}</view>
          </view>
          <!--<view class="proto" style="margin-top: 0.3rem; font-size: 0.7rem;">-->
          <!--  原价¥{{item.proto}}-->
          <!--</view>-->
          <view class="forever" v-if="item.id === 10000 || item.id === 10001 || item.id === 10009">
            ¥{{item.price}}/天
          </view>
        </view>
      </view>

      <view class="shop-detail">
        <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon8/shop-detail1.png"/>

        <view class="vip-detail">
          <view class="title">
            <text>会员权益</text>
            <text>对比</text>
          </view>
        </view>

        <image
            style="width: 104%; position: relative; left: -2%"
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon8/shop-detail2.png"
        />

        <view class="vip-detail">
          <view class="title">
            <text>用户</text>
            <text>评价</text>
          </view>
        </view>

        <view class="detail3">
          <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon8/shop-detail3.png"/>
        </view>
      </view>
    </view>
  </view>

  <wd-popup :close-on-click-modal="false" :modal="false" v-model="show" position="bottom" custom-style="height: 180px; box-shadow: 0 -5px 5px #eee;">
    <view class="global-m" v-if="platform !== 'ios'" style="padding: 0 1rem">
      <view class="d-flex-center" style="padding-top: 0 !important">
        <view class="d-flex-center">
          <wd-icon :name="radio==1?'check-circle-filled':'circle1'" size="26px" :color="radio==1?'rgba(92, 155, 244, 1)':'rgba(153, 153, 153, 1)'"></wd-icon>
          <image style="height: 54rpx; margin-left: 0.5rem;" mode="heightFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/images/wx_icon.png"></image>
          <view style="color: #999999; margin-left: 0.5rem;">微信支付</view>
        </view>
        <!-- <view class="d-flex-center" style="margin-left: 1.5rem;">
          <wd-icon :name="radio==2?'check-circle-filled':'circle1'" size="26px" :color="radio==2?'rgba(92, 155, 244, 1)':'rgba(153, 153, 153, 1)'"></wd-icon>
          <image style="height: 40px; margin-left: 0.5rem;" mode="heightFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/images/zhifubao.png"></image>
          <view style="color: rgba(153, 153, 153, 1); margin-left: 0.5rem;">微信支付</view>
        </view> -->
      </view>
      <view style="height: 1.5rem;"></view>
      <wd-button @click="onPay(price, openid, agree, user)" type="error" block size="large">立即开通</wd-button>
      <view class="d-flex-center member-xieyi">
        <checkbox-group :value="agree" @change="agree = $event.detail.value">
          <label style="display: flex; align-items: center">
            <checkbox style="transform: scale(0.6)" value="1"></checkbox>
            <text>请阅读并同意</text>
          </label>
        </checkbox-group>
        <text style="color: rgba(35, 156, 247, 1); margin-left: 3px;" @click="toRouter(`/pages/vipProtocol/index`, `title=${encodeURIComponent('会员协议')}`)">会员协议</text>
      </view>
    </view>

    <view class="global-m contact-btn-m" v-else>
      <view class="buy-tip">由于相关规定，iOS版小程序暂不支持购买</view>
      <button class="contact-btn" @click="openContact">联系客服</button>
    </view>
    
  </wd-popup>
  
</template>

<script setup>
import { ref, computed } from 'vue'
import { onPay } from './member'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import $http from '@/hooks/http'
import { toRouter } from '@/hooks/utils'

const show = ref(true)
const radio = ref(1),user = ref({})
const openid = ref(null)
const agree = ref([])

const platform = uni.getDeviceInfo().platform

onLoad(() => {
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

  // const username = uni.getStorageSync('username')
  // uni.request({
  //   url: '/api/user/username?username=' + username,
  //   method: 'GET',
  //   success: (res) => {
  //     user.value = res.data
  //   },
  //   fail: (res) => {}
  // })
  uni.login({
    success: (res) => {
      console.log('res.code', res.code)

      $http.post('api/user/auth/userauth/get_openid', {
        code: res.code,
        micro_appid: uni.getAccountInfoSync().miniProgram.appId
      }).then((res) => {
        openid.value = res.data
      })
    }
  })

  getProductList()
})

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})


const openContact = () => {
  uni.openCustomerServiceChat({
    corpId: 'wwd8a1200c46e63718',
    extInfo: {
      url: 'https://work.weixin.qq.com/kfid/kfc571cd6bb4349e984'
    }
  })
}

const lists = ref([])
// price.value = lists.value[0]

const price = computed(() => {
  return lists.value.find(item => item.select)
})

const getProductList = async () => {
  $http.get('api/global/product/get').then(res => {
    // 扫妙日会员暂时不做显示
    let index = res.data.findIndex(item => item.product_name === '扫妙日会员')

    res.data.forEach(item => {
      item.recommend = false
    })

    if (index !== -1) {
      res.data.splice(index, 1)
    }

    res.data.push({
      price: 2990,
      product_name: '扫妙连续包月',
      id: 10009,
      recommend: true
    })

    res.data.forEach((item, index) => {
      item.forever = Number((item.price / 100).toFixed(2))

      let unit = ''

      if (item.product_name.includes('月')){
        unit = '/月'
        item.price = (item.forever / 30).toFixed(2)
      } else if (item.product_name.includes('年')){
        unit = '/年'
        item.price = (item.forever / 366).toFixed(2)
      } else if (item.product_name.includes('终身')){
        unit = '/终身'
      }

      item.name = item.product_name
      item.proto = item.forever
      item.unit = unit
      item.select = (index === 0)
    })

    lists.value = res.data
  })
}

const icons = ref([
  {
    name: '证件扫描',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/images/m1.png'
  },
  {
    name: '文字提取',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/images/m2.png'
  },
  {
    name: '拍照翻译',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/images/m3.png'
  },
  {
    name: '试卷去手写',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/images/m4.png'
  },
  {
    name: '图片加水印',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/images/m5.png'
  },
  {
    name: '图片转Word',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/images/m6.png'
  },
  {
    name: '图片转PPT',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/images/m7.png'
  },
  {
    name: '拼图',
    src: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/images/m8.png'
  }
])

const memberSelect = (item) => {
  lists.value.forEach(item => {
    item.select = false
  })
  price.value = item
  console.log(item);
  item.select = !item.select;
}

const login = () => {
  toRouter('/pages/login/index')
}
</script>

<style scoped lang="scss">
page{
  --wot-button-error-bg-color: rgba(229, 22, 22, 1);
  --wot-button-large-height: 3rem;
  --wot-button-large-fs: 1.4rem;
}
.member-top{
  height: 200px;
  padding-top: 40rpx;
  display: flex;
  align-items: center;
  background: url("https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/vip-bg.png") left top/100% 100% no-repeat;
  --wot-color-white: none;
  color: #fff;
  --wot-cell-title-fs: 1rem;
  --wot-cell-title-color: #fff;
  --wot-button-primary-bg-color: rgba(238, 204, 145, 1);
  --wot-button-primary-color: rgba(83, 45, 23, 1);
}

.padding-x_medium {
  flex-shrink: 0;
  background: linear-gradient(0deg, #E5CBC1 0%, #EED6B7 59%, #F1DAB9 99%) !important;
  color: #412A14;
  border: 0;
  outline: none;
  width: 160rpx;
  height: 53rpx;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 28rpx;

  &::after {
    border: none;
  }
}

.member-content{
  border-radius: 30rpx 30rpx 0 0;
  margin-top: -1.8rem;
  background: #F7F7F7;
}
.member-grid{
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(3, 1fr);
  .proto{
    color: rgba(218, 198, 186, 1);
  }
  .forever{
    padding: 24rpx 0 6rpx;
    color: #B87A2F;
    font-size: 24rpx;
  }
  .active{
    background: url("https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon8/shop-bg1.png") left top/ 100% 100% no-repeat;
    .price{
      color: #FD502C;
    }
    .tip{
      color: #FD502C;
    }
    .proto{
      color: rgba(222, 198, 173, 1);
    }
    .forever{
      color: #FFFFFF;
    }
  }
}
.member-grid_li{
  background: url("https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon8/shop-bg2.png") left top/ 100% 100% no-repeat;
  text-align: center;
  padding-top: 50rpx;
  position: relative;

  .recommend {
    position: absolute;
    top: 0;
    left: 8rpx;
    width: 70rpx;
  }
}
.member-price{
  display: flex;
  align-items: center;
  justify-content: center;
  color: #854E12;
  font-size: 22rpx;

  .price{
    font-size: 52rpx;
    font-weight: bold;
    padding: 0;
    color: #854E12;
  }
  .tip{
    display: flex;
    height: 32rpx;
    align-items: flex-end;
    position: relative;
    top: 10rpx;
    color: #B87A2F;
  }
}

.shop-detail {
  margin-top: 30rpx;

  image {
    width: 100%;
  }

  .detail3 {
    background: #FEFEFC;
    border-radius: 20rpx;
    border: 2px solid #FFEAC3;
    padding: 28rpx;
  }
}

.member-t{
  display: flex;
  align-items: center;
  padding: 1rem 0 0.2rem 0;
}
.member-xieyi{
  margin-top: 0.2rem;
  font-size: 0.85rem;
  color: rgba(153, 153, 153, 1);
}

.vip-detail {
  .title {
    padding: 20rpx 0;
    font-weight: bold;

    text {
      &:nth-child(1) {
        color: #333333;
      }

      &:nth-child(2) {
        color: #FD502C;
      }
    }
  }

  .table {
    display: flex;
    position: relative;
    box-shadow: 0 3px 3px #eee;

    .line1, .line2, .line3, .line4 {
      width: 33%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: #555555;

      &.line1 {
        view {
          &:nth-child(1) {
            border-top-left-radius: 16rpx;
          }

          &:last-child {
            border-bottom-left-radius: 16rpx;
          }

          &:nth-child(2n - 1) {
            background: #F6F6F6;
          }
        }
      }

      &.line2 {
        view {
          &:nth-child(2n - 1) {
            background: #F6F6F6;
          }
        }
      }

      &.line3 {
        view {
          &:nth-child(1) {
            border-top-right-radius: 16rpx;
          }

          &:last-child {
            border-bottom-right-radius: 16rpx;
          }

          &:nth-child(2n - 1) {
            background: #F6F6F6;
          }
        }
      }

      &.line4 {
        position: absolute;
        width: 33%;
        left: 33%;
        top: -20rpx;
        bottom: -20rpx;
        background: linear-gradient(180deg, #FFECC190 0%, #FECF7390 100%) !important;
        border-radius: 16rpx;
        z-index: 9;

        view {
          display: flex;
          align-items: center;
          justify-content: center;

          &:nth-child(1) {
            font-weight: bold;
            font-size: 32rpx;
            height: 60rpx;
            border-top-left-radius: 16rpx;
            border-top-right-radius: 16rpx;
            color: #A85305;
          }

          &:last-child {
            height: 60rpx;
            border-bottom-left-radius: 16rpx;
            border-bottom-right-radius: 16rpx;
          }

          image {
            width: 26rpx;
          }
        }
      }

      view {
        font-size: 28rpx;
        text-align: center;
        height: 40rpx;
        padding: 10rpx 0;

        &:nth-child(1) {
          font-weight: bold;
          color: #111111;
        }
      }
    }
  }
}

.contact-btn-m {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 100rpx;

  .buy-tip {
    text-align: center;
    font-size: 30rpx;
    margin-bottom: 30rpx;
  }

  .contact-btn {
    width: 100%;
    color: #ffffff;
    background: #FA4350;
    border-radius: 999px;
  }
}
</style>