import { ref } from 'vue'
import $http from '../../hooks/http'

export const moveShow = ref(false)
export const editShow = ref(false)

export const initDictionary = async (parentId = 0) => {
  const res = await $http.post('api/user/hdfs/file/folder/list', {
    parent: parentId
  })

  return res.data
}

export const deleteFile = async (apiUrl, data) => {
  return $http.post(apiUrl, data)
}

export const toAddDict = (parentId = 0, folder_name) => {
  return $http.post('api/user/hdfs/file/folder/create', {
    parent: parentId,
    folder_name
  })
}