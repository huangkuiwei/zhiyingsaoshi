<template>
  <view class="page-title">
    <text>个人中心</text>

    <view class="back" @click="toBack">
      <uni-icons class="back" color="#ffffff" type="arrow-left" size="22"></uni-icons>
    </view>
  </view>

  <view class="banner"> </view>

  <view class="member-top">
    <view style="width: calc(100% - 60rpx); display: flex; align-items: center; padding: 0 28rpx 0 32rpx">
      <image
          style="height: 121rpx; border-radius: 50%; margin-right: 14rpx"
          :src="user.avatar_url || `https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/default-head.png`"
          mode="heightFix"
      />

      <view style="display: flex; flex-direction: column; justify-content: center; gap: 10rpx; flex-grow: 1; margin-right: 10rpx">
        <view :style="{ fontWeight: 'bold', paddingLeft: '10rpx' }" style="display: flex; align-items: center">
          <view v-if="!user.uid" @click="login">未登录</view>
          <view v-else>{{user.nickname || '微信用户'}}</view>

          <image v-if="user.vip_type" style="width: 39rpx; padding-left: 20rpx" mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/my/icon2.png"></image>
          <image v-else-if="user.vip_type === 0" style="width: 39rpx; padding-left: 20rpx" mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/my/icon1.png"></image>
        </view>

        <view style="font-size: 22rpx; padding-left: 10rpx; align-self: self-start">
          <view v-if="!user.uid" @click="login">
            您还未登录 请先登录
          </view>
          <view
              v-if="user.uid"
              style="display: flex; align-items: center; align-self: self-start; color: #ffffff; background: #FFFFFF50; border-radius: 19rpx; padding: 0 12rpx; font-size: 0.6rem; height: 20px;"
          >
            <wd-icon v-if="user.vip_type" custom-class="iconfont" class-prefix="icon" name="Silver" color="#BF932A" size="14"></wd-icon>
            <view style="margin-left: 0.2rem;">
              <text v-if="user.vip_type === 0">尚未开通VIP</text>
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
    <view class="vip-title">会员套餐</view>

    <view style="padding-bottom: 400rpx;">
      <view class="member-grid" v-if="platform !== 'ios'">
        <view @click="memberSelect(item)" class="member-grid_li" :class="{'active': item.select}" v-for="(item,index) in lists" :key="index">
          <!--<image v-if="item.recommend" mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon8/recommend.png" class="recommend"/>-->

          <view style="padding: 0 0 20rpx 0; font-size: 20rpx; color: #CDF022">{{item.name}}</view>
          <view class="member-price">
            <view class="tip">¥</view>
            <view class="price">{{ item.forever }}</view>
            <!--<view class="tip">{{item.unit}}</view>-->
          </view>

          <view class="price1">
            <text v-if="item.id === 10000">￥45</text>
            <text v-if="item.id === 10001">￥368</text>
            <text v-if="item.id === 10009">￥39.9</text>
          </view>

          <!--<view class="proto" style="margin-top: 0.3rem; font-size: 0.7rem;">-->
          <!--  原价¥{{item.proto}}-->
          <!--</view>-->
          <view class="forever" v-if="item.id === 10000 || item.id === 10001 || item.id === 10009">
            ¥{{item.price}}/天
          </view>
        </view>
      </view>

      <view class="member-t">
        会员尊享<text style="color: #CDF022">19+</text>特权
      </view>

      <view class="member-icons">
        <view class="member-icons-item" v-for="(item,index) in icons" :key="index">
          <image class="icon" mode="widthFix" :src="item.src"></image>
          <view class="name">
            {{ item.name }}
          </view>
        </view>
      </view>

      <view class="member-t" style="padding: 10rpx 0 30rpx 0">
        会员特权<text style="color: #CDF022">对比</text>
      </view>

      <view class="shop-detail">
        <image
            style="width: 104%; position: relative; left: -2%"
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/member/des.png"
        />
      </view>
    </view>
  </view>

  <wd-popup :close-on-click-modal="false" :modal="false" v-model="show" position="bottom" custom-style="background: #1D1D27">
    <view v-if="platform !== 'ios'" style="padding: 40rpx 1.5rem">
      <view class="buy-btn" @click="onPay(price, openid, agree, user)">
        <text style="font-weight: bold">{{ user.vip_type ? '立即续费' : '立即开通' }}</text>
        <text style="font-size: 26rpx">{{ price.forever }}元</text>
      </view>
      <view class="member-xieyi">
        <checkbox-group :value="agree" @change="agree = $event.detail.value">
          <label style="display: flex; align-items: center">
            <checkbox style="transform: scale(0.6)" value="1"></checkbox>
            <text>开通会员前请阅读并同意</text>
          </label>
        </checkbox-group>
        <text style="margin-left: 3px;" @click="toRouter(`/pages/vipProtocol/index`, `title=${encodeURIComponent('会员协议')}`)">《购买协议》</text>
      </view>
    </view>

    <view class="global-m contact-btn-m" v-else>
      <view class="buy-tip">由于相关规定，iOS版小程序暂不支持购买</view>
      <button class="contact-btn" open-type="contact">联系客服</button>
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
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/share2.jpg',
    path: '/pages/index/index',
  }
})

const toBack = () => {
  uni.navigateBack();
}

// TODO 客服
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
    // 日会员暂时不做显示
    let index = res.data.findIndex(item => item.product_name.includes('日会员'))

    res.data.forEach(item => {
      item.recommend = false
    })

    if (index !== -1) {
      res.data.splice(index, 1)
    }

    res.data.push({
      price: 2990,
      product_name: '连续包月',
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

<style lang="scss">
page{
  background: #030203 url("https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/member/bg1.png") left top/100% auto no-repeat;
  --page-title-height: calc(var(--status-bar-height) + 120rpx);
}
</style>

<style scoped lang="scss">
.page-title {
  --page-title-padding-top: calc(var(--status-bar-height) + 68rpx);
  position: fixed;
  height: calc(var(--page-title-height));
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding-top: calc(var(--page-title-padding-top));
  color: #ffffff;
  font-size: 32rpx;
  font-weight: bold;
  z-index: 9;
  box-sizing: border-box;

  .back {
    position: absolute;
    bottom: 6rpx;
    left: 15rpx;
  }
}

.page-title {
}

.banner {
  padding: calc(var(--page-title-height) + 40rpx) 0 0;
}

.member-top{
  margin-bottom: 50rpx;
  display: flex;
  align-items: center;
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
  padding: 0 60rpx;

  .vip-title {
    font-weight: 500;
    font-size: 28rpx;
    color: #FFFFFF;
    margin-bottom: 28rpx;
  }
}
.member-grid{
  display: flex;
  align-items: center;
  gap: 14rpx;

  .proto{
    color: rgba(218, 198, 186, 1);
  }
  .forever{
    padding: 24rpx 0 6rpx;
    color: #A1A1A2;
    font-size: 22rpx;
  }
  .active{
    background: url("https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/member/bg3.png?t=123") left top/ 100% 100% no-repeat;
    .price{
      color: #CDF022;
    }
    .tip{
      color: #CDF022;
    }
    .proto{
      color: #CDF022;
    }
    .forever{
      color: #A1A1A2;
    }
  }
}
.member-grid_li{
  background: url("https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/member/bg2.png?t=123") left top/ 100% 100% no-repeat;
  text-align: center;
  padding-top: 32rpx;
  position: relative;
  width: 33%;

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
    color: #CDF022;
  }

  .tip{
    display: flex;
    height: 32rpx;
    align-items: flex-end;
    position: relative;
    top: 10rpx;
    color: #CDF022;
  }
}

.price1 {
  margin: 10rpx 0 5rpx;
  font-size: 20rpx;
  color: #A7A7A7;
  text-decoration: line-through;
}

.member-icons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;

  .member-icons-item {
    width: 25%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24rpx;
    margin-bottom: 35rpx;

    .icon {
      width: 80rpx;
    }

    .name {
      font-size: 24rpx;
      color: #FFFFFF;
    }
  }
}

.shop-detail {
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
  padding: 69rpx 0 43rpx 0;
  font-weight: 500;
  font-size: 28rpx;
  color: #FFFFFF;
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
  padding: 50rpx 1.5rem;

  .buy-tip {
    text-align: center;
    font-size: 30rpx;
    margin-bottom: 30rpx;
    color: #ffffff;
  }

  .contact-btn {
    width: 100%;
    box-sizing: border-box;
    background: linear-gradient(to right, #F0F900 0%, #96FF01 100%);
    border-radius: 16rpx;
    height: 81rpx;
    color: #000000;
    font-size: 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.buy-btn {
  width: 100%;
  background: linear-gradient(to right, #F0F900 0%, #96FF01 100%);
  border-radius: 16rpx;
  height: 81rpx;
  color: #000000;
  font-size: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
}

.member-xieyi {
  padding: 20rpx 0 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>