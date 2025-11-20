<template>
  <view>
    <view class="ws-privacy-popup">
      <view class="ws-privacy-popup__header">
        <!--标题-->
        <view class="ws-picker__title">{{ title }}</view>
      </view>
      <view class="ws-privacy-popup__container">
        <text>{{ desc }}</text>
        <text
          class="ws-privacy-popup__container-protocol"
          @click="openPrivacyContract"
          >{{ privacyContractName || protocol }}</text
        >
        <text>{{ subDesc }}</text>
      </view>
      <view class="ws-privacy-popup__footer">
        <button
          class="is-agree"
          id="agree-btn"
          open-type="agreePrivacyAuthorization"
          @agreeprivacyauthorization="handleAgree"
        >
          {{ agreeText }}
        </button>
        <button class="is-disagree" id="disagree-btn" @click="handleDisagree">
          {{ disagreeText }}
        </button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { getContext, getComponent } from "./util";
const privacyResolves = new Set();
let privacyHandler = null;
// 注册监听
if (uni.onNeedPrivacyAuthorization) {
  uni.onNeedPrivacyAuthorization((resolve) => {
    if (typeof privacyHandler === "function") {
      privacyHandler(resolve);
    }
  });
}

const emit = defineEmits(["toShow"]);

const title = ref("用户隐私保护提示"),
  desc = ref("感谢您使用本应用，您使用本应用的服务之前请仔细阅读并同意"),
  protocol = ref("《用户隐私保护指引》"),
  privacyContractName = ref(""),
  subDesc = ref(
    "。当您点击同意并开始使用产品服务时，即表示你已理解并同意该条款内容，该条款将对您产生法律约束力。如您拒绝，将无法使用相应服务。"
  ),
  agreeText = ref("同意并继续"),
  disagreeText = ref("不同意");

function openPrivacyContract() {
  wx.openPrivacyContract({
    success: (res) => {
      console.log("openPrivacyContract success");
    },
    fail: (res) => {
      console.error("openPrivacyContract fail", res);
    },
  });
}
function handleAgree() {
  requestMultiplePermissions()
 .then(() => {
    console.log('所有权限申请成功');
  })
 .catch(err => {
    console.log('部分权限申请失败', err);
  });
  emit("toShow", false);
}
function handleDisagree() {
  emit("toShow", false);
}

const scopes = ['scope.camera', 'scope.album'];
function requestMultiplePermissions() {
  const promises = scopes.map(scope => {
    return new Promise((resolve, reject) => {
      wx.authorize({
        scope: scope,
        success() {
          resolve();
        },
        fail(err) {
          reject(err);
        }
      });
    });
  });

  return Promise.all(promises);
}
</script>

<style scoped lang="scss">
.ws-privacy-popup {
  padding: 48rpx;
  box-sizing: border-box;
  overflow: hidden;
  width: 560rpx;
  background: linear-gradient(180deg, #e5edff 0%, #ffffff 100%);
  border-radius: 24rpx;

  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 52rpx;
    font-size: 36rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 550;
    color: #1a1a1a;
    line-height: 52rpx;
    margin-bottom: 48rpx;
  }

  &__container {
    width: 100%;
    box-sizing: border-box;
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 48rpx;
    margin-bottom: 48rpx;

    &-protocol {
      font-weight: 550;
      color: #4d80f0;
    }
  }

  &__footer {
    display: flex;
    flex-direction: column;

    .is-disagree,
    .is-agree {
      width: 100%;
      height: 88rpx;
      background: #ffffff;
      border-radius: 44rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
    }

    .is-agree {
      background: #4d80f0;
      color: #ffffff;
      margin-bottom: 18rpx;
    }

    button {
      border: none;
      outline: none;

      &::after {
        border: none;
      }
    }
  }
}
</style>