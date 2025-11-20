<template>
  <view style="height: 100%;" class="mask-box">
    <wd-gap height="5px"></wd-gap>
    <view v-if="cerIndex==1" class="idcard person-card">
      <view class="d-flex-center">
        <view class="page-box">
          <view :class="{'active': idcardIndex == 1}" class="master-li">
            身份证人像面
          </view>
          <view :class="{'active': idcardIndex == 2}" class="master-li">
            身份证国徽面
          </view>
        </view>
      </view>
      <view class="master-part">
        <image class="mask-dom" v-if="idcardIndex==1" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/my/shenfenzheng.png" style="height: calc(100% - 60px)" mode="heightFix" />
        <image v-if="idcardIndex==2" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/my/shengfenfanmian.png" style="height: calc(100% - 60px)" mode="heightFix" />
      </view>
    </view>
    <view v-if="cerIndex == 2" class="idcard person-card">
      <view class="d-flex-center">
        <view class="page-box">
          <view :class="{'active': bankIndex == 1}" class="master-li">
            银行卡正面
          </view>
          <view :class="{'active': bankIndex == 2}" class="master-li">
            银行卡背面
          </view>
        </view>
      </view>
      <view class="master-part">
        <view class="bankBox"></view>
      </view>
    </view>
    <view v-if="cerIndex==3" class="idcard">
      <view class="d-flex-center">
        <view class="page-box">
          <view @click="hukouIndex=1; emits('change', 1)" :class="{'active': hukouIndex == 1}" class="master-li">
            单张
          </view>
          <view @click="hukouIndex=2; emits('change', 2)" :class="{'active': hukouIndex == 2}" class="master-li">
            多张
          </view>
        </view>
      </view>
      <view class="master-part">
        <image class="mask-dom" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/document/hukou.png" style="height: calc(100% - 60px)" mode="heightFix" />
      </view>
    </view>
    <view v-if="cerIndex==5" class="idcard person-card">
      <view class="d-flex-center">
        <view class="page-box">
          <view :class="{'active': driverIndex == 1}" class="master-li">
            驾驶证主页
          </view>
          <view :class="{'active': driverIndex == 2}" class="master-li">
            驾驶证副业
          </view>
        </view>
      </view>

      <view class="master-part">
        <image class="mask-dom" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/document/jiashi.png" style="height: calc(100% - 60px)" mode="heightFix" />
      </view>
    </view>
    <view v-if="cerIndex==99" class="idcard">
      <view class="master-part">
        
      </view>
      <view class="d-flex-center">
        <view class="page-box">
          <view @click="pintuIndex=1; emits('change', 1)" :class="{'active': pintuIndex == 1}" class="master-li">
            单张
          </view>
          <view @click="pintuIndex=2; emits('change', 2)" :class="{'active': pintuIndex == 2}" class="master-li">
            多张
          </view>
        </view>
        
      </view>
    </view>
    <view v-if="cerIndex==98" class="idcard">
      
    </view>
  </view>
</template>

<script lang="ts" setup>
import { idcardIndex, cerIndex, maskRef, bankIndex, hukouIndex, pintuIndex, driverIndex } from './camera'
import { ref, nextTick } from 'vue'
console.log(cerIndex);

const emits = defineEmits(['change'])
</script>

<style scoped lang="scss">
.master-li{
  width: 50px;
  height: 30px;
  // background: #1F1914;
  display: flex;
  font-size: 13px;
  color: #00D7AD;
  align-items: center;
  justify-content: center;

  &:nth-child(1) {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }

  &:nth-child(2) {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }
}
.master-li.active{
  color: #FFFFFF;
  background: #00D7AD;
}
.master-part{
  flex: 1;
  // background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mask-box{
  display: flex;
  flex-direction: column;
}
.idcard{
  flex: 1;
  display: flex;
  flex-direction: column;
}
.person-card{
  .master-li{
    width: 100px;
  }
}
.bankBox{
  height: calc(100% - 60px);
  width: 60%;
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  border: 1px solid #fff;
}
.page-box{
  background: #3D3A35;
  display: flex;
  border: 1px solid #00D7AD;
  align-items: center;
  border-radius: 20px;
}
</style>