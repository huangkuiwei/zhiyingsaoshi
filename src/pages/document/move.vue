<template>
  <view class="move-box">
    <view class="d-flex-center" style="height: 40px; background: #efefef;">
      移动到
    </view>

    <view class="global-m">
      <view class="move-ul">
        <image
            @click="tobackDict"
            v-show="dictionary.parent.indexOf('/') >= 0"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/my/back.png"
            style="width:30px; height: 30px;"
        />

        <view class="move-li d-flex" v-for="(item,index) in dictionary.files" :key="index">
          <image
              style="width: 67rpx; margin-left: 24rpx"
              mode="widthFix"
              src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/document/folder_icon.png"
          />

          <view @click="toDictionary(item)" style="flex-grow: 1">{{ item.folder_name }}</view>

          <view @click="toCheck(item)" class="d-flex">
            <wd-checkbox :modelValue="item.check" checkedColor="#96F022"></wd-checkbox>
          </view>
        </view>
      </view>
    </view>
    <view class="move-btn global-m">
      <view class="flex-1">
        <image @click="moveFile" mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/document/btn1.png" />
      </view>
    </view>
  </view>
  <wd-toast></wd-toast>
</template>

<script setup>
import { ref, onMounted, computed, defineExpose } from 'vue'
import { moveShow } from './document'
import { useToast } from '/node_modules/wot-design-uni'
import $http from '@/hooks/http'

const emits = defineEmits(['update'])

const toast = useToast()
const dActive = ref('')
const dictionary = ref({
  files: [],
  parent: '0'
})

const props = defineProps({
  fileId: {
    type: [String, Array],
  }
})

onMounted(() => {
  initDictionary()
})

const parentId = computed(() => {
  return dictionary.value.parent.split('/')[dictionary.value.parent.split('/').length - 1]
})

const initDictionary = async () => {
  const res = await $http.post('api/user/hdfs/file/folder/list', {
    parent: parentId.value
  })

  res.data.forEach(item => {
    item.check = false
  })

  dictionary.value.files = res.data
}

const toCheck = (item) => {
  dictionary.value.files.map(v => v.check = false)
  item.check = true
  dActive.value = item.folder_name
}

const toDictionary = (item) => {
  dictionary.value.parent = dictionary.value.parent + '/' + item.id
  initDictionary()
}

const tobackDict = () => {
  dictionary.value.parent = dictionary.value.parent.split('/').slice(0, -1).join('/')
  initDictionary()
}

const moveFile = async () => {
  let folder = dictionary.value.files.find(v => v.check)

  if (folder) {
    if (Array.isArray(props.fileId)) {
      for (const item of props.fileId) {
        await $http.post('api/user/hdfs/file/file/move', {
          folder_id: folder.folder_path_id,
          id: item
        })

        moveShow.value = false
        emits('update')
      }
    } else {
      $http.post('api/user/hdfs/file/file/move', {
        folder_id: folder.folder_path_id,
        id: props.fileId
      }).then(() => {
        moveShow.value = false
        emits('update')
      })
    }
  } else {
    uni.showToast({
      title: '请选择文件夹',
      icon: 'none',
    })
  }
}

defineExpose({
  initDictionary
})
</script>

<style scoped lang="scss">
.move-box {
  width: 90vw;
  border-radius: 10px;
  position: relative;
}

.move-btn {
  display: flex;
  align-items: center;
}

.move-li {
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.move-ul {
  max-height: 40vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}
</style>