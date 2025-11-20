<template>
  <view class="move-box">
    <view class="d-flex-center" style="height: 40px; background: #efefef;">
      选择移动的文件夹
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
          <view @click="toCheck(item)" class="d-flex">
            <wd-checkbox :modelValue="item.check"></wd-checkbox>
          </view>

          <view @click="toDictionary(item)" style="margin-left: 10px;">{{ item.folder_name }}</view>
        </view>
      </view>
    </view>
    <view class="move-btn global-m">
      <view @click="moveShow=false" class="flex-1">
        <wd-button block type="info">
          取消
        </wd-button>
      </view>
      <view style="width:20px;"></view>
      <view class="flex-1">
        <wd-button @click="moveFile" block>确定</wd-button>
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
  height: 30px;
}

.move-ul {
  max-height: 300px;
  overflow: auto;
}
</style>