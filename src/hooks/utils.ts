export const toRouter = (url, params) => {
  params ? url = url + '?' + params : ''
  uni.navigateTo({
    url,
  })
}

export const toSwich = (url) => {
  uni.switchTab({
    url
  })
}

export const uploadBase64 = (toast, base64) => {
  uni.request({
    url: '/api/oss/uploadBase64ToOSS',
    method: 'POST',
    data: {
      username: uni.getStorageSync('username'),
      base64: base64
    },
    success: () => {
      toast.close()
      toast.success('上传成功')
    }
  })
}

export const goView = (shareUrl) => {
  uni.downloadFile({
    url: shareUrl,
    success: (res) => {
      uni.openDocument({
        filePath: res.tempFilePath,
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
};