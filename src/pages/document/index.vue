<template>
  <view class="index-top">
    <view class="index-header"></view>
  </view>

  <view class="global-m" style="position: relative;">
    <view class="empty" v-if="!user.uid">
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
      </view>
    </view>

    <template v-else>
      <view class="header">
        <text class="title">我的文档</text>
        <image @click="showAddDicDialog = true" mode="widthFix" style="width: 70rpx" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/document/folder.png"/>
        <text style="flex-grow: 1"></text>
        <text @click="selectFile1" class="select">{{ isSelectFile ? '取消' : '选择' }}</text>
      </view>

      <!--<view style="margin-top: 1rem; text-align: center">最近文件</view>-->
      <view class="folder-list">
        <image
            @click="tobackDict"
            v-show="fileUrl.length > 0"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/my/back.png"
            style="width: 30px; height: 30px"
            mode=""
        />
        <view
            class="file-item"
            :class="{ 'd-active': item.id == tindex, lastFile: item.lastFile, file: item.file_formmat }"
            v-for="(item, index) in files"
            :key="index"
            @click="getNewFile(item)"
        >
          <view
              class="left"
              :style="{
          width: item.file_formmat ? '102rpx' : '90rpx',
          height: item.file_formmat ? '102rpx' : '90rpx',
        }"
          >
            <image
                v-if="
                            item.folder_name.includes('.') &&
                            /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(item.folder_name)
                          "
                mode="aspectFit"
                :src="item.file_url"
            />
            <wd-icon v-if="/\.(doc|docx)$/i.test(item.folder_name)" class-prefix="icon" custom-class="iconfont" name="word1" size="60" color="#0072FF"></wd-icon>
            <wd-icon v-else-if="/\.(xls|xlsx)$/i.test(item.folder_name)" class-prefix="icon" custom-class="iconfont" name="excel" size="60" color="#00C650"></wd-icon>
            <wd-icon v-else-if="/\.(ppt|pptx)$/i.test(item.folder_name)" class-prefix="icon" custom-class="iconfont" name="ppt" size="60" color="#FF3E4C"></wd-icon>
            <wd-icon v-else-if="/\.(pdf)$/i.test(item.folder_name)" class-prefix="icon" custom-class="iconfont" name="pdf" size="60" color="#FF3E4C"></wd-icon>

            <image
                v-if="!item.file_formmat"
                style="width: 30px; margin-left: 10rpx"
                mode="widthFix"
                src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/document/folder_icon.png"
            ></image>
          </view>

          <view class="right" :style="{ justifyContent: 'center', gap: '10rpx' }">
            <view class="filename">
              {{ item.folder_name }}
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
            <template v-if="!isSelectFile">
              <template v-if="item.file_formmat">
                <view class="more-dot" v-if="tindex === item.id"></view>
                <view class="more-dot1" v-else></view>
              </template>

              <template v-else>
                <view v-if="tindex === item.id" style="color: #CDF022; font-size: 24rpx; letter-spacing: 4rpx">
                  ...
                </view>

                <view v-else style="color: #030203; font-size: 24rpx; letter-spacing: 4rpx">
                  ...
                </view>
              </template>
            </template>

            <view class="detect-count" @click.stop="item.select = !item.select" v-else>
              <template v-if="item.file_formmat">
                <view class="more-dot" v-if="item.select"></view>
                <view class="more-dot1" v-else></view>
              </template>

              <template v-else>
                <view v-if="item.select" style="color: #CDF022; font-size: 24rpx; letter-spacing: 4rpx">
                  ...
                </view>

                <view v-else style="color: #030203; font-size: 24rpx; letter-spacing: 4rpx">
                  ...
                </view>
              </template>
            </view>
          </view>
        </view>

        <view class="empty" v-if="files.length === 0">
          <view class="empty-box">
            <view class="add-box">
              <view class="tip">暂无文档数据</view>
            </view>
          </view>
        </view>
      </view>
    </template>
  </view>

  <!--<view class="select-options">-->
  <!--  <image-->
  <!--      mode="widthFix"-->
  <!--      src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon14/01.png"-->
  <!--      @click="moveAll"-->
  <!--  />-->

  <!--  <image-->
  <!--      mode="widthFix"-->
  <!--      src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon14/02.png"-->
  <!--      @click="editAll"-->
  <!--  />-->

  <!--  <image-->
  <!--      mode="widthFix"-->
  <!--      src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon14/03.png"-->
  <!--      @click="shareAll"-->
  <!--  />-->

  <!--  <image-->
  <!--      mode="widthFix"-->
  <!--      src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon14/04.png"-->
  <!--      @click="deleteAll"-->
  <!--  />-->
  <!--</view>-->

  <view class="select-options" v-if="selectFile || isSelectFile">
    <view class="select-options-container" v-if="!showEditFileDialog && !showAddDicDialog && !showDeleteDialog && !moveShow">
      <view @click.stop="isSelectFile ? moveAll() : toMove(selectFile)" v-if="(selectFile && selectFile.file_formmat || isSelectFile)" class="select-option">
        <image
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/document/icon1.png"
        />

        <view>移动</view>
      </view>

      <view @click.stop="isSelectFile ? editAll() : (showEditFileDialog = true)" class="select-option">
        <image
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/document/icon2.png"
        />

        <view>编辑</view>
      </view>
      <view @click.stop="isSelectFile ? shareAll() : toShareFile(selectFile)" v-if="(selectFile && selectFile.file_formmat || isSelectFile)" class="select-option">
        <image
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/document/icon3.png"
        />

        <view>分享</view>
      </view>
      <view @click.stop="isSelectFile ? deleteAll() : (showDeleteDialog = true)" class="select-option">
        <image
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/document/icon4.png"
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
            @click="(selectFile.file_name = selectFile.file_formmat || '')"
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

  <wd-popup v-model="showAddDicDialog" @close="showAddDicDialog = false" custom-style="background: transparent">
    <view class="delete-dialog" style="background: #ffffff; border-radius: 30rpx;">
      <view class="tip">新建文件夹</view>

      <view class="input-box">
        <input type="text" placeholder="请输入文件夹名称" v-model="fileName" />
        <image
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/close.png"
            @click="fileName = ''"
        />
      </view>

      <view class="options">
        <image
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/btn1.png"
            @click="showAddDicDialog = false"
        />

        <image
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/index/btn2.png"
            @click="addDic()"
        />
      </view>
    </view>
  </wd-popup>

  <wd-message-box selector="wd-delete-box-slot"></wd-message-box>
  <wd-message-box selector="wd-add-box-slot">
    <view>
      <wd-input customClass="create-folder-input" v-model="fileName" placeholder="请输入文件夹名称"></wd-input>
    </view>
  </wd-message-box>
  <wd-gap height="3rem"></wd-gap>
  <NavBar :index="2" v-if="!isSelectFile"></NavBar>
  <wd-popup custom-class="move-class" v-model="moveShow">
    <Move
        v-if="moveShow"
        ref="moveRef"
        @update="onUpdate"
        :fileId="fileId"
    ></Move>
  </wd-popup>
  <wd-message-box selector="wd-edit-box-slot"></wd-message-box>
  <Share :show="shareShow"></Share>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import NavBar from '@/section/a-navbar.vue'
import { shareShow, shareUrl, state } from '@/section/share'
import Share from '@/section/share.vue'
import { toRouter } from '@/hooks/utils'
import {
  onLoad,
  onPullDownRefresh,
  onShareAppMessage,
  onShow
} from '@dcloudio/uni-app'
import {
  initDictionary,
  deleteFile,
  toAddDict, moveShow
} from './document'
import { useMessage } from '/node_modules/wot-design-uni'
import $http from '@/hooks/http'
import Move from './move.vue'

const addMessage = useMessage('wd-add-box-slot')
const deleteMessage = useMessage('wd-delete-box-slot')
const editMessage = useMessage('wd-edit-box-slot')

const value = ref(0),
    tindex = ref(-1),
    files = ref([]),
    fileUrl = ref([]),
    currentItem = ref(null)
const fileName = ref('')
const options = ref([
  { label: '全部', value: 0 }
])
const fileId = ref('')
const key = ref(null)
let user = ref({})
const isSelectFile = ref(false)
let MenuButtonInfo = uni.getMenuButtonBoundingClientRect()
const headerTop = ref(MenuButtonInfo.top + MenuButtonInfo.height + 10 + 'px')

const lastFolderInfo = computed(() => {
  return fileUrl.value[fileUrl.value.length - 1] || {}
})

const selectFile = ref()
const showEditFileDialog = ref(false)
const showDeleteDialog = ref(false)
const showAddDicDialog = ref(false)

watchEffect(() => {
  files.value.forEach(item => {
    if (!item.file_name) {
      item.file_name = item.folder_name
    }
  })

  let lastFileIndex = files.value.findLastIndex(item => !item.file_formmat)

  if (lastFileIndex !== -1) {
    files.value[lastFileIndex].lastFile = true
  }

  let file = files.value.find(item => item.id === tindex.value)

  if (file) {
    selectFile.value = JSON.parse(JSON.stringify(file))
  } else {
    selectFile.value = undefined
  }
})

onLoad(() => {
  uni.startPullDownRefresh()

  initDictionary().then((res) => {
    res.forEach(item => {
      options.value.push({ label: item.folder_name, value: item.folder_path_id, ...item })
    })
  })
})

onShow(() => {
  tindex.value = -1
  fileUrl.value = []

  uni.showLoading({
    title: '正在加载'
  })

  initDictionary().then((data) => {
    $http.post('api/user/hdfs/file/file/list', {
      folder_id: key.value ? null : (lastFolderInfo.value.id || 0),
      key: key.value || null
    }).then((res) => {
      res.data = res.data.slice(0, 20)

      if (!key.value) {
        files.value = data.map(item => ({
          ...item,
          select: false,
        }))
      } else {
        files.value = []
      }

      res.data.forEach(item => {
        files.value.push({
          ...item,
          folder_name: item.file_name,
          select: false,
        })
      })
    }).finally(() => {
      uni.hideLoading()
    })
  }).catch(() => {
    uni.hideLoading()
  })

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

// onShareAppMessage((res) => {
//   return {
//     title: "分享",
//     path: "/pages/preview/index?shareUrl=" + encodeURIComponent(shareUrl.value) + "&shareType=file",
//     imageUrl: shareUrl.value,
//   };
// });

onPullDownRefresh(() => {
  initDictionary(lastFolderInfo.value.id).then((data) => {
    tindex.value = -1

    // if (!fileUrl.value.length) {
    $http.post('api/user/hdfs/file/file/list', {
      folder_id: key.value ? null : (lastFolderInfo.value.id || 0),
      key: key.value || null
    }).then((res) => {
      res.data = res.data.slice(0, 20)

      if (!key.value) {
        files.value = data.map(item => ({
          ...item,
          select: false,
        }))
      } else {
        files.value = []
      }

      res.data.forEach(item => {
        files.value.push({
          ...item,
          folder_name: item.file_name,
          select: false,
        })
      })
    })
    // }
  }).finally(() => {
    uni.stopPullDownRefresh()
  })
})

const onInput = () => {
  tindex.value = -1
  fileUrl.value = []

  uni.showLoading({
    title: '正在加载'
  })

  initDictionary().then((data) => {
    $http.post('api/user/hdfs/file/file/list', {
      folder_id: key.value ? null : (lastFolderInfo.value.id || 0),
      key: key.value || null
    }).then((res) => {
      res.data = res.data.slice(0, 20)

      if (!key.value) {
        files.value = data.map(item => ({
          ...item,
          select: false,
        }))
      } else {
        files.value = []
      }

      res.data.forEach(item => {
        files.value.push({
          ...item,
          folder_name: item.file_name,
          select: false,
        })
      })
    }).finally(() => {
      uni.hideLoading()
    })
  }).catch(() => {
    uni.hideLoading()
  })
}

const onChange = () => {
  tindex.value = -1
  fileUrl.value = []

  uni.showLoading({
    title: '正在加载'
  })

  initDictionary().then((data) => {
    $http.post('api/user/hdfs/file/file/list', {
      folder_id: key.value ? null : (lastFolderInfo.value.id || 0),
      key: key.value || null
    }).then((res) => {
      res.data = res.data.slice(0, 20)

      if (!key.value) {
        files.value = data.map(item => ({
          ...item,
          select: false,
        }))
      } else {
        files.value = []
      }

      res.data.forEach(item => {
        files.value.push({
          ...item,
          folder_name: item.file_name,
          select: false,
        })
      })
    }).finally(() => {
      uni.hideLoading()
    })
  }).catch(() => {
    uni.hideLoading()
  })
}

const onSelectChange = ($event) => {
  if ($event.value === 0) {
    tindex.value = -1
    fileUrl.value = []

    uni.showLoading({
      title: '正在加载'
    })

    initDictionary().then((data) => {
      $http.post('api/user/hdfs/file/file/list', {
        folder_id: key.value ? null : (lastFolderInfo.value.id || 0),
        key: key.value || null
      }).then((res) => {
        res.data = res.data.slice(0, 20)

        if (!key.value) {
          files.value = data.map(item => ({
            ...item,
            select: false,
          }))
        } else {
          files.value = []
        }

        res.data.forEach(item => {
          files.value.push({
            ...item,
            folder_name: item.file_name,
            select: false,
          })
        })
      }).finally(() => {
        uni.hideLoading()
      })
    }).catch(() => {
      uni.hideLoading()
    })
  } else {
    getNewFile($event.selectedItem)
  }
}

const toDelete = (item, confirm = true) => {
  deleteHandler(item)
}

const deleteHandler = (item) => {
  deleteFile(item.file_formmat ? 'api/user/hdfs/file/file/delete' : 'api/user/hdfs/file/folder/delete',
      item.file_formmat ? {
        folder_id: lastFolderInfo.value.id || 0,
        id: item.id
      } : {
        id: item.id
      }).then(() => {
    showDeleteDialog.value = false
    tindex.value = -1
    isSelectFile.value = false

    uni.showLoading({
      title: '正在加载'
    })

    initDictionary(lastFolderInfo.value.id).then((data) => {
      options.value = [{ label: '全部', value: 0 }]

      data.forEach(item => {
        options.value.push({ label: item.folder_name, value: item.folder_path_id, ...item })
      })

      // if (!fileUrl.value.length) {
      $http.post('api/user/hdfs/file/file/list', {
        folder_id: key.value ? null : (lastFolderInfo.value.id || 0),
        key: key.value || null
      }).then((res) => {
        res.data = res.data.slice(0, 20)

        if (!key.value) {
          files.value = data.map(item => ({
            ...item,
            select: false,
          }))
        } else {
          files.value = []
        }

        res.data.forEach(item => {
          files.value.push({
            ...item,
            folder_name: item.file_name,
            select: false,
          })
        })
      }).finally(() => {
        uni.hideLoading()
      })
      // }
    }).catch(() => {
      uni.hideLoading()
    })
  })
}

const getNewFile = (item) => {
  if (isSelectFile.value) {
    return
  }

  if (!item.file_formmat) {
    fileUrl.value.push(item)
    uni.showLoading({
      title: '正在加载'
    })

    initDictionary(lastFolderInfo.value.id).then((data) => {
      $http.post('api/user/hdfs/file/file/list', {
        folder_id: key.value ? null : (lastFolderInfo.value.id || 0),
        key: key.value || null
      }).then((res) => {
        res.data = res.data.slice(0, 20)

        if (!key.value) {
          files.value = data.map(item => ({
            ...item,
            select: false,
          }))
        } else {
          files.value = []
        }

        res.data.forEach(item => {
          files.value.push({
            ...item,
            folder_name: item.file_name,
            select: false,
          })
        })
      }).finally(() => {
        uni.hideLoading()
      })

      uni.hideToast()
      tindex.value = -1
    }).catch(() => {
      uni.hideLoading()
    })
  } else {
    if (/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(item.file_name)) {
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
                console.log('打开成功', res)
              },
              fail: (res) => {
                console.log('打开失败', res)
              }
            })
            console.log('下载成功', res)
          },
          fail: (res) => {
            console.log('下载失败', res)
          }
        })
      } else {
        toRouter('/pages/ai-view/index', 'url=' + encodeURIComponent(item.file_url))
      }
    }
  }
}

const selectFile1 = () => {
  isSelectFile.value = !isSelectFile.value
  tindex.value = -1
}

const addDic = () => {
  if (!fileName.value) {
    uni.showToast({ title: '文件夹名称不能为空', icon: 'none' })
    return
  }
  toAddDict(lastFolderInfo.value.id, fileName.value).then(() => {
    showAddDicDialog.value = false
    fileName.value = ''
    tindex.value = -1
    isSelectFile.value = false
    uni.showLoading({
      title: '正在加载'
    })

    initDictionary(lastFolderInfo.value.id).then((data) => {
      // if (!fileUrl.value.length) {
      options.value = [{ label: '全部', value: 0 }]

      data.forEach(item => {
        options.value.push({ label: item.folder_name, value: item.folder_path_id, ...item })
      })

      $http.post('api/user/hdfs/file/file/list', {
        folder_id: key.value ? null : (lastFolderInfo.value.id || 0),
        key: key.value || null
      }).then((res) => {
        res.data = res.data.slice(0, 20)

        if (!key.value) {
          files.value = data.map(item => ({
            ...item,
            select: false,
          }))
        } else {
          files.value = []
        }

        res.data.forEach(item => {
          files.value.push({
            ...item,
            folder_name: item.file_name,
            select: false,
          })
        })
      }).finally(() => {
        uni.hideLoading()
      })
      // }
    }).catch(() => {
      uni.hideLoading()
    })
  })
}

const tobackDict = () => {
  fileUrl.value.pop()

  uni.showLoading({
    title: '正在加载'
  })

  initDictionary(lastFolderInfo.value.id).then((data) => {
    // if (!fileUrl.value.length) {
    $http.post('api/user/hdfs/file/file/list', {
      folder_id: key.value ? null : (lastFolderInfo.value.id || 0),
      key: key.value || null
    }).then((res) => {
      res.data = res.data.slice(0, 20)

      if (!key.value) {
        files.value = data.map(item => ({
          ...item,
          select: false,
        }))
      } else {
        files.value = []
      }

      res.data.forEach(item => {
        files.value.push({
          ...item,
          folder_name: item.file_name,
          select: false,
        })
      })
    }).finally(() => {
      uni.hideLoading()
    })
    // }
  }).catch(() => {
    uni.hideLoading()
  })
}

const toMove = (item) => {
  moveShow.value = true

  if (Array.isArray(item)) {
    fileId.value = item.map(item => item.id)
  } else {
    fileId.value = item.id
  }
}

const onUpdate = () => {
  tindex.value = -1
  initDictionary(lastFolderInfo.value.id).then((data) => {
    // if (!fileUrl.value.length) {
    $http.post('api/user/hdfs/file/file/list', {
      folder_id: key.value ? null : (lastFolderInfo.value.id || 0),
      key: key.value || null
    }).then((res) => {
      res.data = res.data.slice(0, 20)

      if (!key.value) {
        files.value = data.map(item => ({
          ...item,
          select: false,
        }))
      } else {
        files.value = []
      }

      res.data.forEach(item => {
        files.value.push({
          ...item,
          folder_name: item.file_name,
          select: false,
        })
      })
    }).finally(() => {
      uni.hideLoading()
    })
    // }
  }).catch(() => {
    uni.hideLoading()
  })
}

const toEdit = (item) => {
  uni.showLoading({
    title: '加载中',
    mask: true
  })

  if (!item.file_formmat) {
    $http.post('api/user/hdfs/file/folder/rename', {
      id: item.id,
      folder_name: selectFile.value.file_name
    }).then(() => {
      tindex.value = -1
      showEditFileDialog.value = false
      isSelectFile.value = false

      uni.showLoading({
        title: '正在加载'
      })

      initDictionary(lastFolderInfo.value.id).then((data) => {
        // if (!fileUrl.value.length) {
        $http.post('api/user/hdfs/file/file/list', {
          folder_id: key.value ? null : (lastFolderInfo.value.id || 0),
          key: key.value || null
        }).then((res) => {
          res.data = res.data.slice(0, 20)

          if (!key.value) {
            files.value = data.map(item => ({
              ...item,
              select: false,
            }))
          } else {
            files.value = []
          }

          res.data.forEach(item => {
            files.value.push({
              ...item,
              folder_name: item.file_name,
              select: false,
            })
          })
        }).finally(() => {
          uni.hideLoading()
        })
        // }
      }).catch(() => {
        uni.hideLoading()
      })
    }).finally(() => {
      uni.hideLoading();
    })
  } else {
    $http.post('api/user/hdfs/file/file/rename', {
      id: item.id,
      file_name: selectFile.value.file_name
    }).then(() => {
      tindex.value = -1
      showEditFileDialog.value = false
      isSelectFile.value = false

      uni.showLoading({
        title: '正在加载'
      })

      initDictionary(lastFolderInfo.value.id).then((data) => {
        // if (!fileUrl.value.length) {
        $http.post('api/user/hdfs/file/file/list', {
          folder_id: key.value ? null : (lastFolderInfo.value.id || 0),
          key: key.value || null
        }).then((res) => {
          res.data = res.data.slice(0, 20)

          if (!key.value) {
            files.value = data.map(item => ({
              ...item,
              select: false,
            }))
          } else {
            files.value = []
          }

          res.data.forEach(item => {
            files.value.push({
              ...item,
              folder_name: item.file_name,
              select: false,
            })
          })
        }).finally(() => {
          uni.hideLoading()
        })
        // }
      }).catch(() => {
        uni.hideLoading()
      })
    }).finally(() => {
      uni.hideLoading();
    })
  }
}

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/share2.jpg',
    path: '/pages/index/index',
  }
})


const toShareFile = (item) => {
  uni.showLoading({
    title: '正在分享...'
  })

  let newFilePath = `${uni.env.USER_DATA_PATH}/${item.folder_name}`

  uni.downloadFile({
    url: item.file_url,
    filePath: newFilePath,
    success: () => {
      uni.shareFileMessage({
        filePath: newFilePath,
        success() {
          tindex.value = -1
          showEditFileDialog.value = false
          isSelectFile.value = false
          console.log('文件转发成功')
        },
        fail(res) {
          console.log('文件转发失败', res)
        },
        complete() {
          uni.hideLoading()
        }
      })
    },
    fail(res) {
      console.log('文件下载失败', res)
      uni.hideLoading()
    }
  })
}

const moveAll = () => {
  let select = files.value.filter(item => item.select)

  if (!select.length) {
    uni.showToast({
      title: '请选择文件',
      icon: 'none',
    })

    return
  }

  if (select.find(item => !item.file_formmat)) {
    uni.showToast({
      title: '文件夹不支持移动',
      icon: 'none',
    })

    return
  }

  toMove(select)
}

const editAll = () => {
  let select = files.value.filter(item => item.select)

  if (!select.length) {
    uni.showToast({
      title: '请选择文件',
      icon: 'none',
    })

    return
  }

  if (select.length !== 1) {
    uni.showToast({
      title: '只能选择一个文件',
      icon: 'none',
    })

    return
  }

  // toEdit(select[0])
  tindex.value = select[0].id
  showEditFileDialog.value = true
}

const shareAll = () => {
  let select = files.value.filter(item => item.select)

  if (!select.length) {
    uni.showToast({
      title: '请选择文件',
      icon: 'none',
    })

    return
  }

  if (select.length !== 1) {
    uni.showToast({
      title: '只能选择一个文件',
      icon: 'none',
    })

    return
  }

  if (select.find(item => !item.file_formmat)) {
    uni.showToast({
      title: '文件夹不支持分享',
      icon: 'none',
    })

    return
  }

  toShareFile(select[0])
}

const deleteAll = () => {
  let select = files.value.filter(item => item.select)

  if (!select.length) {
    uni.showToast({
      title: '请选择文件',
      icon: 'none',
    })

    return
  }

  select.forEach(item => {
    toDelete(item, false)
  })
}
</script>
<style>
page {
  padding-bottom: 200rpx;
  --wot-drop-menu-fs: 1rem;
}

.wd-input__suffix {
  padding-right: 20rpx;
}

.document-drop-menu .wd-drop-menu__list {
  background: none !important;
  color: #ffffff;
  font-size: 40rpx;
}

.search-document .wd-input {
  border-radius: 8rpx;
  width: 350rpx;
  height: 66rpx;
}
</style>
<style scoped lang="scss">
.index-top {
  background: #F7F7F7 linear-gradient(228deg, #D5F1FD 0%, #D5F5C2 33%, #D6F985 100%) left top/100% 513rpx no-repeat;
}

.index-header {
  height: 180rpx;
}

.folder-list {
  .lastFile {
    border-bottom: 2rpx solid #E7E7E7;
  }
}

.file-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;

  &.file {
  }

  .left {
    flex-shrink: 0;
    margin-right: 18rpx;
    display: flex;
    align-items: center;
    // justify-content: center;

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
    position: relative;
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

.navbar {
  display: flex;
  align-items: center;
}

.icons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 1rem;
  margin-left: 50px;
}

.doc-cell {
  --wot-cell-padding: 0;
  --wot-cell-title-fs: 1rem;
  --wot-cell-label-fs: 0.8rem;
}

.doc-more {
  display: flex;
  align-items: center;
}

.d-active {
}

.folder {
  position: absolute;
  bottom: -46rpx;
  right: 0;
  width: 50%;
  grid-template-columns: repeat(2, 1fr) !important;
}

.d-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
  display: none;
}

.d-grid-3 {
  grid-template-columns: repeat(3, 1fr);
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

.global-m {
  padding: 20rpx 30rpx 80rpx;

  .header {
    display: flex;
    align-items: center;
    padding-bottom: 15rpx;

    .title {
      font-weight: 500;
      font-size: 36rpx;
      color: #000000;
      margin-right: 33rpx;
    }

    image {
     width: 55rpx;
      flex-shrink: 0;
    }

    .select {
      width: 109rpx;
      height: 46rpx;
      background: #EEEEEE;
      border-radius: 23rpx;
      font-size: 30rpx;
      color: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .folder-list {
    background: #ffffff;
    border-radius: 10rpx;
    padding: 10rpx 20rpx 10rpx;
  }
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
    padding: 65rpx 20rpx 50rpx;
    display: flex;
    align-items: center;
    justify-content: space-around;

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

  .input-box {
    height: 80rpx;
    background: #F3F3F3;
    border-radius: 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 25rpx;
    margin-bottom: 58rpx;
    box-sizing: border-box;
    width: 100%;

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

.empty {
  display: flex;
  align-items: center;
  justify-content: center;

  .empty-box {
    width: 100%;
    padding: 50rpx 0;
    box-sizing: border-box;
    background: #ffffff;
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
</style>