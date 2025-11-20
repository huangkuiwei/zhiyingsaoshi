<template>
  <view class="index-top">
    <view class="index-header"></view>

    <view class="box">
      <!-- TODO 搜索功能 -->
      <view class="search-box">
        <input placeholder="输入文档、工具名称" placeholder-style="font-style: italic;" type="text" />
        <image class="icon" mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/search-icon.png"/>
      </view>

      <view class="tools1">
        <image @click="toRouter('/pages/camera/index', 'tab=6')" class="icon" mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/tool-icon1.png"/>
        <image @click="show = true" class="icon" mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/tool-icon2.png"/>
      </view>

      <view class="index-card">
        <view>
          <view class="card-grid">
            <view @click="toRouter('/pages/camera/index', 'tab=4')">
              <view class="card-grid_li">
                <wd-img
                    height="40"
                    mode="heightFix"
                    src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/icon1.png"
                ></wd-img>
              </view>
              <view class="span">证件扫描</view>
            </view>

            <view @click="toRouter('/pages/camera/index', 'tab=5')">
              <view class="card-grid_li">
                <wd-img
                    height="40"
                    mode="heightFix"
                    src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/icon2.png"
                ></wd-img>
              </view>
              <view class="span">文字提取</view>
            </view>

            <view @click="pdfShow = true">
              <view class="card-grid_li">
                <wd-img
                    height="40"
                    mode="heightFix"
                    src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/icon3.png"
                ></wd-img>
              </view>
              <view class="span">PDF转换</view>
            </view>

            <view @click="toRouter('/pages/camera/index', 'tab=9')">
              <view class="card-grid_li">
                <wd-img
                    height="40"
                    mode="heightFix"
                    src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/icon4.png"
                ></wd-img>
              </view>
              <view class="span">拍照翻译</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>

  <view class="index-content" style="position: relative; z-index: 10">
    <view class="file-list-wrapper">
      <view class="card-title1">
        <view class="tip">· 快速导入使用扫描 ·</view>

        <!-- TODO 文档导入、相册导入功能 -->
        <view class="options">
          <view class="option-item">
            <image class="icon" mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/icon5.png"/>
            <text>文档导入</text>
          </view>

          <view class="option-item">
            <image class="icon" mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/icon6.png"/>
            <text>相册导入</text>
          </view>
        </view>
      </view>

      <view v-if="files.length && user.uid" class="recent-title">最近文件</view>

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

          <view class="right" :style="{ justifyContent: 'center', gap: '12rpx' }">
            <view class="filename">
              {{ item.file_name }}
            </view>

            <view
                class="time"
                v-if="item.create_at"
            >
              <text>{{ item.create_at }}</text>
            </view>
          </view>

          <view
              @click.stop="(tindex = (tindex === item.id ? -1 : item.id)), (currentItem = (currentItem === item ? null : item))"
              class="doc-more"
          >
            <view class="more-dot" v-if="tindex === item.id"></view>
            <view class="more-dot1" v-else></view>
          </view>
        </view>

        <view class="empty" v-if="files.length === 0 || !user.uid">
          <view class="empty-box">
            <image
                class="empty-icon"
                mode="widthFix"
                src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/empty.png"
            />

            <view class="login-box" v-if="!user.uid">
              <view class="tip">登录扫描账号，查看账号内同步文档</view>
              <view class="login" @click="toRouter('/pages/login/index')">登录</view>
            </view>

            <view class="add-box" v-else>
              <view class="tip" style="margin-bottom: 43rpx">暂无记录，点击按钮开始扫描</view>
              <image
                  class="icon1"
                  mode="widthFix"
                  src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/icon7.png"
              />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>

  <view class="select-options" v-if="selectFile">
    <view class="select-options-container" v-if="!showEditFileDialog">
      <view @click.stop="showEditFileDialog = true" class="select-option">
        <image
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/icon9.png"
        />

        <view>编辑</view>
      </view>
      <view @click.stop="toShareFile(selectFile)" class="select-option">
        <image
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/icon10.png"
        />

        <view>分享</view>
      </view>
      <view @click.stop="showDeleteDialog = true" class="select-option">
        <image
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/icon11.png"
        />

        <view>删除</view>
      </view>
    </view>

    <view class="edit-file" v-if="showEditFileDialog">
      <view class="title">重命名</view>
      <view class="input-box">
        <input type="text" v-model="selectFile.file_name" />
        <image
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/close.png"
            @click="selectFile.file_name && (selectFile.file_name = selectFile.file_formmat)"
        />
      </view>
      <view class="options">
        <image
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/btn1.png"
            @click="showEditFileDialog = false"
        />

        <image
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/btn2.png"
            @click="toEdit(selectFile)"
        />
      </view>
    </view>
  </view>

  <wd-popup v-model="showDeleteDialog" @close="showDeleteDialog = false" custom-style="background: transparent">
    <view class="delete-dialog">
      <view class="tip">温馨提示</view>
      <view class="title">文档将被彻底删除，请再次确认是否删除</view>
      <view class="options">
        <image
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/btn1.png"
            @click="showDeleteDialog = false"
        />

        <image
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/btn2.png"
            @click="toDelete(selectFile)"
        />
      </view>
    </view>
  </wd-popup>

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
import { ref, watchEffect } from 'vue'
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
const showEditFileDialog = ref(false)
const showDeleteDialog = ref(false)

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

const selectFile = ref()

watchEffect(() => {
  let file = files.value.find(item => item.id === tindex.value)

  if (file) {
    selectFile.value = JSON.parse(JSON.stringify(file))
  } else {
    selectFile.value = undefined
  }
})

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
  uni.showLoading({
    title: '加载中',
    mask: true
  })

  deleteFile('api/user/hdfs/file/file/delete', {
    folder_id: 0,
    id: item.file_path_id
  }).then(() => {
    showDeleteDialog.value = false
    tindex.value = -1
    initFile()
  }).finally(() => {
    uni.hideLoading();
  })
}

const toEdit = (item) => {
  uni.showLoading({
    title: '加载中',
    mask: true
  })

  if (!item.file_name.includes('.')) {
    $http.post('api/user/hdfs/file/folder/rename', {
      id: item.file_path_id,
      folder_name: selectFile.value.file_name
    }).then(() => {
      tindex.value = -1
      showEditFileDialog.value = false
      initFile()
    }).finally(() => {
      uni.hideLoading();
    })
  } else {
    $http.post('api/user/hdfs/file/file/rename', {
      id: item.file_path_id,
      file_name: selectFile.value.file_name
    }).then(() => {
      tindex.value = -1
      showEditFileDialog.value = false
      initFile()
    }).finally(() => {
      uni.hideLoading();
    })
  }
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

<style lang="scss">
page {
  background: #F7F7F7 url("https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/bg.png") left top/100% auto no-repeat;
  padding-bottom: 200rpx;
}
</style>

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
  height: 403rpx;
}

.box {
  padding: 0 30rpx;

  .search-box {
    padding: 0 15rpx 0 43rpx;
    height: 100rpx;
    background: #FFFFFF;
    border-radius: 50rpx;
    border: 5rpx solid #000000;
    display: flex;
    align-items: center;
    margin-bottom: 26rpx;

    input {
      height: 100%;
      flex-grow: 1;
    }

    .icon {
      flex-shrink: 0;
      width: 129rpx;
    }
  }

  .tools1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 34rpx;

    image {
      width: 332rpx;
    }
  }
}

.index-content {
  background: #FFFFFF;
  border-radius: 30rpx;
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
  padding: 0 33rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;

  > view {
    margin-bottom: 53rpx;
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
    margin-top: 22rpx;
    font-size: 26rpx;
    color: #000000;
  }
}

.file-list-wrapper {
  background: #FFFFFF;
  border-radius: 30rpx;
  padding: 23rpx 50rpx;

  .card-title1 {
    padding-bottom: 26rpx;
    border-bottom: 2rpx solid #E7E7E7;

    .tip {
      text-align: center;
      font-size: 18rpx;
      color: #000000;
      margin-bottom: 35rpx;
    }

    .options {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .option-item {
        width: 315rpx;
        height: 73rpx;
        background: #FFFFFF;
        border-radius: 15rpx;
        border: 2rpx solid #E5E5E5;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24rpx;

        image {
          width: 22rpx;
        }

        text {
          font-size: 23rpx;
          color: #000000;
        }
      }
    }
  }

  .recent-title {
    font-weight: 500;
    font-size: 36rpx;
    color: #000000;
    padding: 30rpx 0;
  }

  .card-content {
    display: flex;
    flex-direction: column;
    gap: 40rpx;

    .empty {
      padding: 80rpx 0;
      display: flex;
      align-items: center;
      justify-content: center;
      .empty-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .empty-icon {
          width: 245rpx;
        }
      }

      .login-box, .add-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .tip {
          font-size: 22rpx;
          color: #656565;
          margin-bottom: 25rpx;
        }

        .login {
          width: 157rpx;
          height: 55rpx;
          background: #333333;
          border-radius: 15rpx;
          font-weight: 500;
          font-size: 21rpx;
          color: #CDF022;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon1 {
          width: 37rpx;
        }
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

        .more-dot {
          width: 27rpx;
          height: 27rpx;
          background: #96F022;
          border-radius: 50%;
          border: 2rpx solid #000000;
        }

        .more-dot1 {
          width: 27rpx;
          height: 27rpx;
          background: #FFFFFF;
          border-radius: 50%;
          border: 2rpx solid #D3D3D3;
        }
      }
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
  // overflow: hidden;
  // padding-bottom: 0.5rem;
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

.select-options {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  box-shadow: 1rpx -13rpx 15rpx 1rpx rgba(144,144,144,0.08);
  border-radius: 50rpx 50rpx 0rpx 0rpx;
  z-index: 99999;

  .select-options-container {
    padding: 65rpx 80rpx 50rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .select-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10rpx;

      image {
        width: 80rpx;
        height: auto;
      }

      view {
        font-size: 26rpx;
        color: #000000;
      }
    }
  }

  .edit-file {
    padding: 30rpx 56rpx 50rpx;
    display: flex;
    flex-direction: column;

    .title {
      font-weight: 500;
      font-size: 36rpx;
      color: #000000;
      margin-bottom: 34rpx;
    }

    .input-box {
      height: 80rpx;
      background: #F3F3F3;
      border-radius: 10rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 25rpx;
      margin-bottom: 58rpx;

      input {
        flex-grow: 1;
      }

      image {
        padding-left: 20rpx;
        width: 28rpx;
        height: auto;
      }
    }

    .options {
      display: flex;
      align-items: center;
      justify-content: space-between;

      image {
        width: 300rpx;
        height:  auto;
      }
    }
  }
}

.delete-dialog {
  width: 621rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: url("https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/bg2.png") left top/100% 100% no-repeat;
  padding: 30rpx 43rpx;
  box-sizing: border-box;

  .tip {
    font-weight: 600;
    font-size: 39rpx;
    color: #000000;
    margin-bottom: 43rpx;
  }

  .title {
    font-size: 35rpx;
    color: #000000;
    line-height: 56rpx;
    margin-bottom: 45rpx;
  }

  .options {
    align-self: stretch;
    display: flex;
    align-items: center;
    justify-content: space-between;

    image {
      width: 247rpx;
      height: auto;
    }
  }
}
</style>
