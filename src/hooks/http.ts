import { toRouter } from './utils'

let baseApi = 'https://smapi.wiiken.cn/'
let hasShowLoginModal = false

const $http = {
  post: (url, data, config = {}) => {
    let token = uni.getStorageSync('toolsToken')

    if (!url.includes('http')) {
      url = baseApi + url
    }

    return new Promise((resolve, reject) => {
      uni.request({
        method: 'POST',
        withCredentials: true,
        url: url,
        data,
        dataType: 'json',
        header: {
          token
        },
        ...config,
        success: (res) => {
          if (res.statusCode !== 200) {
            uni.showToast({
              title: `接口异常：${res.statusCode}`,
              icon: 'none',
            })

            return reject(res.data)
          }

          if (config.responseType === 'blob') {
            resolve(res)
            return
          }

          if (res.data.code === 0 || res.data.Code === 0) {
            resolve(res.data)
          } else {
            if (res.data.Code !== -100) {
              if (!config.hiddenErrorMessage) {
                if (config.showErrorDialog) {
                  uni.showModal({
                    title: '提示',
                    content: res.data.msg || res.data.Msg,
                  })
                } else {
                  uni.showToast({
                    title: res.data.msg || res.data.Msg,
                    icon: 'none',
                    mask: true
                  })
                }
              }

              reject(res.data)
            } else {
              // 清除过期 token
              uni.removeStorageSync('toolsToken')

              if (!hasShowLoginModal && config.showLoginModal) {
                hasShowLoginModal = true

                uni.showModal({
                  title: '提示',
                  content: '您当前未登录或登录已失效，为了您有更好的体验，智映扫视需要您进行登录',
                  showCancel: true,
                  success: (res) => {
                    hasShowLoginModal = false

                    if (res.confirm) {
                      toRouter('/pages/login/index')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }

              reject(res.data)
            }
          }
        },
        fail: () => {
          if (!config.hiddenErrorMessage) {
            uni.showToast({
              title: '接口异常',
              icon: 'none',
              mask: true
            })
          }

          reject()
        }
      })
    })
  },

  get: (url, data, config = {}) => {
    let token = uni.getStorageSync('toolsToken')

    if (!url.includes('http')) {
      url = baseApi + url
    }

    return new Promise((resolve, reject) => {
      uni.request({
        method: 'GET',
        withCredentials: true,
        url: url,
        data,
        dataType: 'json',
        header: {
          token
        },
        ...config,
        success: (res) => {
          if (res.statusCode !== 200) {
            uni.showToast({
              title: `接口异常：${res.statusCode}`,
              icon: 'none',
            })

            return reject(res.data)
          }

          if (config.responseType === 'blob') {
            resolve(res)
            return
          }

          if (res.data.code === 0 || res.data.Code === 0) {
            resolve(res.data)
          } else {
            if (res.data.Code !== -100) {
              if (!config.hiddenErrorMessage) {
                if (config.showErrorDialog) {
                  uni.showModal({
                    title: '提示',
                    content: res.data.msg || res.data.Msg,
                  })
                } else {
                  uni.showToast({
                    title: res.data.msg || res.data.Msg,
                    icon: 'none',
                    mask: true
                  })
                }
              }

              reject(res.data)
            } else {
              // 清除过期 token
              uni.removeStorageSync('toolsToken')

              if (!hasShowLoginModal && config.showLoginModal) {
                hasShowLoginModal = true

                uni.showModal({
                  title: '提示',
                  content: '您当前未登录或登录已失效，为了您有更好的体验，智映扫视需要您进行登录',
                  showCancel: true,
                  success: (res) => {
                    hasShowLoginModal = false

                    if (res.confirm) {
                      toRouter('/pages/login/index')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }

              reject(res.data)
            }
          }
        },
        fail: () => {
          if (!config.hiddenErrorMessage) {
            uni.showToast({
              title: '接口异常',
              icon: 'none',
              mask: true
            })
          }

          reject()
        }
      })
    })
  },

  upload: (url, fileUrl, formData = {}, config = {}) => {
    let token = uni.getStorageSync('toolsToken')

    if (!url.includes('http')) {
      url = baseApi + url
    }

    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: url,
        name: "file",
        filePath: fileUrl,
        formData: formData,
        header: {
          token
        },
        ...config,
        success: (res) => {
          res.data = JSON.parse(res.data)

          if (res.data.code === 0 || res.data.Code === 0) {
            resolve(res.data)
          } else {
            if (res.data.Code !== -100) {
              if (!config.hiddenErrorMessage) {
                if (config.showErrorDialog) {
                  uni.showModal({
                    title: '提示',
                    content: res.data.msg || res.data.Msg,
                  })
                } else {
                  uni.showToast({
                    title: res.data.msg || res.data.Msg,
                    icon: 'none',
                    mask: true
                  })
                }
              }

              reject(res.data)
            } else {
              // 清除过期 token
              uni.removeStorageSync('toolsToken')

              if (!hasShowLoginModal && config.showLoginModal) {
                hasShowLoginModal = true

                uni.showModal({
                  title: '提示',
                  content: '您当前未登录或登录已失效，为了您有更好的体验，智映扫视需要您进行登录',
                  showCancel: true,
                  success: (res) => {
                    hasShowLoginModal = false

                    if (res.confirm) {
                      toRouter('/pages/login/index')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }

              reject(res.data)
            }
          }
        },
        fail: () => {
          if (!config.hiddenErrorMessage) {
            uni.showToast({
              title: '接口异常',
              icon: 'none',
              mask: true
            })
          }

          reject()
        }
      })
    })
  }
}

export default $http
