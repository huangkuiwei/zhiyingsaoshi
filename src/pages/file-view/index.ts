export const getFile = async (path) => {
  return await uni.request({
    url: '/api/image/file',
    method: 'POST',
    data: {
      filePath: path
    }
  })
}

export const toOssImage = async (url) => {
  return await uni.request({
    url: '/api/image/url',
    method: 'POST',
    data: {
      url: url,
      username: uni.getStorageSync('username')
    }
  })
}