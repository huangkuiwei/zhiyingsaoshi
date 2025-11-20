<template>
  <view class="index-top">
    <view class="index-header">
      <view class="index-title" :style="{ paddingTop: headerTop }" v-if="!user.uid">
        <image style="width: 106rpx; margin-bottom: 18rpx" mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/hell-icon.png"/>
        <text class="welcome">欢迎使用扫妙</text>
      </view>

      <view class="user-info" :style="{ paddingTop: headerTop }" v-else>
        <view class="header-logo">
          <image
              style="height: 100rpx; border-radius: 50%"
              :src="user.avatar_url || `https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/default-head.png`"
              mode="heightFix"
          />
        </view>

        <view class="user-detail">
          <view class="user-name">
            <view style="max-width: 600rpx; overflow: auto; text-overflow: ellipsis; white-space: nowrap">{{ user.nickname || '微信用户' }}</view>

            <image
                v-if="user.vip_type"
                mode="widthFix"
                src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/vip-icon2.png"
            />

            <image
                v-else
                mode="widthFix"
                src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/vip-icon.png"
            />
          </view>

          <view class="tip">
            <text v-if="!user.vip_type">您还不是VIP会员</text>
            <text v-else>到期期限：{{user.vip_end_time}}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
  <view class="index-content" style="position: relative; z-index: 10">
    <view class="box">
      <view class="ad" @click="toRouter('/pages/camera/index', 'tab=4')">
        <image
            class="banner"
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/banner.png"
        />
      </view>

      <view class="index-card" style="margin-top: 72rpx">
        <view>
          <view class="card-grid">
            <view @click="toRouter('/pages/camera/index', 'tab=6')">
              <view class="card-grid_li">
                <wd-img
                  height="50"
                  mode="heightFix"
                  src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/tool-icon1.png"
                ></wd-img>

                <image class="hot" mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/hot.png"/>
              </view>
              <view class="span">智能扫描</view>
            </view>

            <view @click="show = true">
              <view class="card-grid_li">
                <wd-img
                    height="50"
                    mode="heightFix"
                    src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/tool-icon2.png"
                ></wd-img>
              </view>
              <view class="span">图片转换</view>
            </view>

            <view @click="pdfShow = true">
              <view class="card-grid_li">
                <wd-img
                    height="50"
                    mode="heightFix"
                    src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/tool-icon3.png"
                ></wd-img>
              </view>
              <view class="span">PDF转换</view>
            </view>

            <view @click="toRouter('/pages/camera/index', 'tab=4')">
              <view class="card-grid_li">
                <wd-img
                    height="50"
                    mode="heightFix"
                    src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/tool-icon4.png"
                ></wd-img>
              </view>
              <view class="span">证件扫描</view>
            </view>
          </view>

          <view class="card-grid">
            <view @click="toRouter('/pages/camera/index', 'tab=5')">
              <view class="card-grid_li">
                <wd-img
                    height="50"
                    mode="heightFix"
                    src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/tool-icon5.png"
                ></wd-img>
              </view>
              <view class="span">提取文字</view>
            </view>

            <view @click="toRouter('/pages/camera/index', 'tab=9')">
              <view class="card-grid_li">
                <wd-img
                    height="50"
                    mode="heightFix"
                    src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/tool-icon6.png"
                ></wd-img>
              </view>
              <view class="span">拍照翻译</view>
            </view>

            <view @click="toRouter('/pages/camera/index', 'tab=10')">
              <view class="card-grid_li">
                <wd-img
                    height="50"
                    mode="heightFix"
                    src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/tool-icon7.png"
                ></wd-img>
              </view>
              <view class="span">试卷去手写</view>
            </view>

            <view @click="toSwich('/pages/tool/index')">
              <view class="card-grid_li">
                <wd-img
                    height="50"
                    mode="heightFix"
                    src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/tool-icon8.png"
                ></wd-img>
              </view>
              <view class="span">更多</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view style="padding-bottom: 140rpx">
      <wd-card :customStyle="{ margin: 0 }">
        <template #title>
          <view class="card-title">
            <view style="font-size: 32rpx" class="name">最近文档</view>
            <view style="font-size: 24rpx; color: #999999" @click="toSwich('/pages/document/index')">查看更多 ></view>
          </view>
        </template>
        <view class="card-content">
          <view
              class="file-item"
              :class="{ 'd-active': item.id == tindex }"
              v-for="(item, index) in files"
              :key="index"
              @click="goPreview(item)"
          >
            <view class="left">
              <image
                  v-if="
                            item.file_name.includes('.') &&
                            /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(item.file_name)
                          "
                  mode="aspectFit"
                  :src="item.file_url"
              />
              <wd-icon v-if="/\.(doc|docx)$/i.test(item.file_name)" class-prefix="icon" custom-class="iconfont" name="word1" size="60" color="#0072FF"></wd-icon>
              <wd-icon v-else-if="/\.(xls|xlsx)$/i.test(item.file_name)" class-prefix="icon" custom-class="iconfont" name="excel" size="60" color="#00C650"></wd-icon>
              <wd-icon v-else-if="/\.(ppt|pptx)$/i.test(item.file_name)" class-prefix="icon" custom-class="iconfont" name="ppt" size="60" color="#FF3E4C"></wd-icon>
              <wd-icon v-else-if="/\.(pdf)$/i.test(item.file_name)" class-prefix="icon" custom-class="iconfont" name="pdf" size="60" color="#FF3E4C"></wd-icon>
            </view>

            <view class="right" :style="{ justifyContent: item.id == tindex ? 'space-between' : 'center', gap: item.id == tindex ? '0' : '10rpx' }">
              <view class="filename">
                {{ item.file_name }}
              </view>

              <view
                  class="time"
                  v-if="item.create_at"
              >
                <image
                    mode="widthFix"
                    src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/time-icon.png"
                />
                <text>{{ item.create_at }}</text>
              </view>

              <view class="d-grid" style="grid-gap: 30rpx">
                <view @click.stop="toEdit(item)" class="d-grid_li d-grid_li1">
                  <view>编辑</view>
                </view>
                <view @click.stop="toShareFile(item)" class="d-grid_li d-grid_li1">
                  <view>分享</view>
                </view>
                <view @click.stop="toDelete(item)" class="d-grid_li d-grid_li1">
                  <view>删除</view>
                </view>
              </view>
            </view>

            <view
                @click.stop="(tindex = (tindex === item.id ? -1 : item.id)), (currentItem = (currentItem === item ? null : item))"
                class="doc-more"
            >
              <image
                  style="width: 8rpx"
                  mode="widthFix"
                  :src="tindex === item.id ? 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/dot2.png' : 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/dot1.png'"
              />
            </view>
          </view>
          <view class="empty" v-if="files.length === 0">
            <view class="empty-box">
              <image
                  style="width: 100%"
                  mode="widthFix"
                  src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/empty-icon.png"
              ></image>
              <view style="margin-top: 0.112rpx; text-align: center"
              >暂无文档</view
              >
            </view>
          </view>
        </view>
      </wd-card>
    </view>
  </view>
  <wd-gap height="2rem"></wd-gap>
  <wd-popup
    v-model="show"
    position="bottom"
    custom-style="height: 250px; z-index: 1000;"
    @close="show = false"
  >
    <view class="popup-close">
      <wd-icon
        @click="show = false"
        name="close-circle"
        size="24"
        color="#888"
      ></wd-icon>
    </view>
    <view class="popup-grid">
      <view @click="toRouter('/pages/pic-transform/index', 'type=pic&channel=16')" class="popup-grid_li">
        <image
            style="width: 85rpx"
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon1/pdf.png"
        ></image>
        <view style="margin-top: 0.6rem; font-size: 28rpx; color: #333333">转PDF</view>
      </view>

      <view class="popup-grid_li">
        <image
            @click="toRouter('/pages/camera/index?tab=13&from=tool')"
            style="width: 85rpx"
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon1/pintu.png"
        ></image>
        <view style="margin-top: 0.6rem; font-size: 28rpx; color: #333333">拼图</view>
      </view>

      <view @click="toRouter('/pages/pic-transform/index', 'type=pic&channel=17')" class="popup-grid_li">
        <image
            style="width: 85rpx"
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon1/ppt.png"
        ></image>
        <view style="margin-top: 0.6rem; font-size: 28rpx; color: #333333">转PPT</view>
      </view>

      <view @click="toRouter('/pages/pic-transform/index', 'type=pic&channel=14')" class="popup-grid_li">
        <image
            style="width: 85rpx"
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon1/word.png"
        ></image>
        <view style="margin-top: 0.6rem; font-size: 28rpx; color: #333333">转Word</view>
      </view>

      <view @click="toRouter('/pages/pic-transform/index', 'type=pic&channel=15')"  class="popup-grid_li">
        <image
          style="width: 85rpx"
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon1/excel.png"
        ></image>
        <view style="margin-top: 0.6rem; font-size: 28rpx; color: #333333">转Excel</view>
      </view>
    </view>
  </wd-popup>

  <wd-popup
    v-model="pdfShow"
    position="bottom"
    custom-style="height: 260px; z-index: 1000;"
    @close="pdfShow = false"
  >
    <view class="popup-close">
      <wd-icon
        @click="pdfShow = false"
        name="close-circle"
        size="24"
        color="#888"
      ></wd-icon>
    </view>
    <view class="popup-grid">
      <view class="popup-grid_li" @click="toRouter('/pages/pdf-transform/index', 'type=pdf&channel=pic')">
        <image
          style="width: 85rpx"
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon1/img.png"
        ></image>
        <view style="margin-top: 0.6rem; font-size: 28rpx; color: #333333">转图片</view>
      </view>

      <view class="popup-grid_li" @click="toRouter('/pages/pdf-transform/index', 'type=pdf&channel=excel')">
        <image
            style="width: 85rpx"
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon1/excel.png"
        ></image>
        <view style="margin-top: 0.6rem; font-size: 28rpx; color: #333333">转Excel</view>
      </view>

      <view class="popup-grid_li" @click="toRouter('/pages/pdf-transform/index', 'type=pdf&channel=longpic')">
        <image
          style="width: 85rpx"
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon1/longimg.png"
        ></image>
        <view style="margin-top: 0.6rem; font-size: 28rpx; color: #333333">转长图</view>
      </view>
      <view @click="toRouter('/pages/pdf-transform/index', 'type=pdf&channel=ppt')" class="popup-grid_li">
        <image
          style="width: 85rpx"
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon1/ppt.png"
        ></image>
        <view style="margin-top: 0.6rem; font-size: 28rpx; color: #333333">转PPT</view>
      </view>

      <view class="popup-grid_li" @click="toRouter('/pages/pdf-transform/index', 'type=pdf&channel=word')">
        <image
          style="width: 85rpx"
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon1/word.png"
        ></image>
        <view style="margin-top: 0.6rem; font-size: 28rpx; color: #333333">转Word</view>
      </view>
    </view>
  </wd-popup>
  <wd-message-box selector="wd-delete-box-slot"></wd-message-box>
  <wd-message-box selector="wd-add-box-slot">
    <view>
      <wd-input v-model="fileName" placeholder="请输入文件夹名称"></wd-input>
    </view>
  </wd-message-box>

  <wd-message-box selector="wd-edit-box-slot"></wd-message-box>
  <NavBar :index="1"></NavBar>
  <Share :show="shareShow"></Share>
</template>

<script setup>
import { ref } from "vue";
import NavBar from "@/section/a-navbar.vue";
import { toRouter, toSwich } from "@/hooks/utils";
import { deleteFile } from '../document/document'
import { useMessage } from '/node_modules/wot-design-uni'
import { onShow } from '@dcloudio/uni-app'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { shareShow, shareUrl, state, docUrl} from '@/section/share'
import Share from '@/section/share.vue'
import $http from '@/hooks/http'
const addMessage = useMessage('wd-add-box-slot')
const deleteMessage = useMessage('wd-delete-box-slot')
const editMessage = useMessage('wd-edit-box-slot')

const files = ref([]), tindex = ref(-1), currentItem = ref(null), fileUrl = ref(uni.getStorageSync('username'));
const show = ref(false), dictMitem = ref(null), fileName = ref('');
const pdfShow = ref(false),editValue = ref('');
let user = ref({})

let MenuButtonInfo = uni.getMenuButtonBoundingClientRect()
const headerTop = ref(MenuButtonInfo.top + MenuButtonInfo.height + 'px')

onShow(() => {
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
})

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})

onShow(() => {
  initFile()
})

// onShareAppMessage((res) => {
//   return {
//     title: "分享",
//     path: "/pages/preview/index?shareUrl=" + encodeURIComponent(shareUrl.value) + '&shareType=file',
//     imageUrl: shareUrl.value,
//   };
// })

const toShareFile = (item) => {
  uni.showLoading({
    title: '正在分享...'
  })

  let newFilePath = `${uni.env.USER_DATA_PATH}/${item.file_name}`

  console.log('newFilePath', newFilePath)

  uni.downloadFile({
    url: item.file_url,
    filePath: newFilePath,
    success: () => {
      uni.shareFileMessage({
        filePath: newFilePath,
        success() {
          tindex.value = -1
          console.log('文件转发成功');
        },
        fail(res) {
          console.log('文件转发失败', res);
        },
        complete() {
          uni.hideLoading();
        }
      });
    },
    fail(res) {
      console.log('文件下载失败', res);
      uni.hideLoading();
    }
  });
}

const initFile = () => {
  uni.showLoading({
    title: '正在加载'
  })

  $http.post('api/user/hdfs/file/file/list', {
    folder_id: 0
  }).then((res) => {
    files.value = res.data?.slice(0, 6);
  }).catch(() => {
    files.value = []
  }).finally(() => {
    uni.hideLoading()
  })
}

const toDelete = (item) => {
  deleteMessage.confirm({
    title: '提示',
    msg: '您要删除该文件吗?',
  }).then((type) => {
      type.action == 'confirm'
      ? deleteFile('api/user/hdfs/file/file/delete', {
            folder_id: 0,
            id: item.file_path_id
          }).then(() => {
            tindex.value = -1
            initFile()
      })
      :''
    })
    .catch(() => {
      console.log('点击了取消按钮')
    })
}

const toEdit = (item) => {
  editMessage
      .prompt({
        title: "请输入文件名",
        inputValue: item.file_name,
        inputPattern: !item.file_name.includes('.')
            ? /^(?!\s*$).+/
            : /^[^\\\/:*?"<>|\r\n]+$$/,
        inputError: "文件名格式不正确(文件需要后缀名)",
      })
      .then((resp) => {
        if (resp.action == "confirm") {
          tindex.value = -1

          if (!item.file_name.includes('.')) {
            $http.post('api/user/hdfs/file/folder/rename', {
              id: item.file_path_id,
              folder_name: resp.value
            }).then(() => {
              initFile()
            })
          } else {
            $http.post('api/user/hdfs/file/file/rename', {
              id: item.file_path_id,
              file_name: resp.value
            }).then(() => {
              initFile()
            })
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
};

const goPreview = (item) => {
  if( /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(item.file_name) ){
    toRouter('/pages/preview/index', `previewFileUrl=${encodeURIComponent(item.file_url)}&type=img&title=${item.file_name}`)
  } else {
    if (item.file_formmat === '.pdf' && uni.getDeviceInfo().platform === 'android') {
      let filename = item.file_url.split('/')[item.file_url.split('/').length - 1]
      let newFilePath = `${uni.env.USER_DATA_PATH}/${filename}`

      uni.downloadFile({
        url: item.file_url,
        filePath: newFilePath,
        success: (res) => {
          uni.openDocument({
            filePath: newFilePath,
            showMenu: true,
            success: (res) => {
              console.log("打开成功", res);
            },
            fail: (res) => {
              console.log("打开失败", res);
            },
          });
          console.log("下载成功", res);
        },
        fail: (res) => {
          console.log("下载失败", res);
        },
      });
    } else {
      toRouter('/pages/ai-view/index', 'url=' + encodeURIComponent(item.file_url))
    }
  }
}
</script>

<style lang="scss" scoped>
page {
}
.index-card {
  --wot-card-margin: 0;
}
.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}
.title {
  font-size: 36rpx;
  color: #8f8f94;
}
.index-top {
  background: #00D7AD;
  // padding: 0.8rem;
  --wot-card-margin: 0;
}
.search {
  display: flex;

  :deep(.wd-input) {
    flex: 1;
    height: 2.5rem;
    border-radius: 2rem;
    display: flex;
    padding-left: 0.5rem;
    align-items: center;
  }
}
.vip {
  display: flex;
  align-items: center;
  margin: 0 0 0 0.8rem;
}

.index-header {
  background: url("https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/header-bg.png") left top/100% auto no-repeat;
  color: #FFFFFF;
  position: relative;

  .index-title {
    padding-left: 40rpx;
    padding-bottom: 40rpx;
    display: flex;
    flex-direction: column;
    font-size: 34rpx;
    font-weight: bold;

    .hello-logo {
      margin-bottom: 10rpx;
    }
  }

  .user-info {
    padding-left: 40rpx;
    padding-bottom: 40rpx;
    display: flex;
    align-items: center;

    .header-logo {
      margin-right: 20rpx;
      flex-shrink: 0;
    }

    .user-detail {
      .user-name {
        display: flex;
        align-items: center;

        view {
          font-size: 36rpx;
          margin-right: 14rpx;
          margin-bottom: 10rpx;
          font-weight: bold;
        }

        image {
          width: 101rpx;
          margin-top: -10rpx;
        }
      }

      .tip {
        font-size: 28rpx;
      }
    }
  }
}

.index-content {
  border-top-left-radius: 10rpx;
  border-top-right-radius: 10rpx;
  position: relative;
  top: -8rpx;
  background: #F3F7F8;

  .box {
    padding: 52rpx 38rpx 0;

    .ad {
      display: flex;
      position: relative;

      .banner {
        width: 100%;
      }
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 0.6rem;
      margin-top: 0.112rpx;
    }
  }
}
.card-title {
  display: flex;
  padding: 10rpx 20rpx 0;

  .name {
    flex: 1;
    font-weight: bold;
    font-size: 1rem;
  }
}
.card-grid {
  display: flex;
  align-items: center;
  justify-content: space-between;

  > view {
    margin-bottom: 58rpx;
  }

  .card-grid_li {
    display: flex;
    justify-content: center;
    position: relative;

    .hot {
      position: absolute;
      top: 0;
      left: 6rpx;
      width: 48rpx;
    }
  }

  .span {
    display: flex;
    justify-content: center;
    font-size: 24rpx;
    margin-top: 22rpx;
    color: #1F1F1F;
  }
}
.card-content {
  display: flex;
  flex-direction: column;
  gap: 40rpx;

  .empty {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    .empty-box {
      width: 180px;
    }
  }

  .file-item {
    display: flex;
    align-items: center;

    .left {
      flex-shrink: 0;
      height: 140rpx;
      width: 140rpx;
      margin-right: 18rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      image {
        width: 100%;
        height: 100%;
        border-radius: 8rpx
      }

      .iconfont {
        font-size: 140rpx;
      }
    }

    .right {
      align-self: stretch;
      flex-grow: 1;
      display: flex;
      flex-direction: column;

      .filename {
        color: #1F1F1F;
        font-size: 28rpx;
        font-weight: bold;
      }

      .time {
        color: #9C9C9E;
        font-size: 22rpx;
        display: flex;
        align-items: center;

        image {
          width: 20rpx;
          margin-right: 12rpx
        }
      }
    }

    .doc-more {
      flex-shrink: 0;
    }
  }
}
.ad-right {
  position: relative;
  .vip-point {
    position: absolute;
    top: 0;
    right: 0;
  }
}
.popup-close {
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: flex-end;
  padding: 0 1rem;
}
.popup-grid {
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 40rpx;
  margin-top: 1rem;
}
.popup-grid_li {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.d-active {
  // background: rgba(247, 248, 252, 1);
  // border-radius: 8px;
  overflow: hidden;
  padding-bottom: 0.5rem;
}
.d-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  display: none;
}
.d-grid_li {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 0.8rem;
  color: rgba(51, 51, 51, 1);
}

.d-grid_li1 {
  height: 44rpx;
  border: 2rpx solid #cccccc;
  border-radius: 22rpx;
}

.d-active .d-grid {
  display: grid;
}
.doc-more{
  padding: 0.6rem;
}
</style>
