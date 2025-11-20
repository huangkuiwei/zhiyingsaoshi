import { log } from "console";

export const url = 'https://yonganpicture.oss-cn-shenzhen.aliyuncs.com/';
export const upload = () => {
  
}

export const listByDate = () => {
  return uni.request({
    url: '/api/oss/list/pic?username=' + uni.getStorageSync('username'),
    method: 'GET'
  })
}

export const listByDatePdf = () => {
  return uni.request({
    url: '/api/oss/list/pdf?username=' + uni.getStorageSync('username'),
    method: 'GET'
  })
}

export const transformPics = async (files) => {
  
  let imgs = [];
  files.map( v => {
    v.files.map( item => {
      item.check ? imgs.push(url + item.url): ''
    } )
  } )
  console.log(imgs.length)
  if( imgs.length == 0 ){
    return uni.showToast({icon:'none',title: '图片不能为空'})
  }
  uni.showToast({
    title: '正在转换',
    icon: 'loading',
    duration: 2000
  })
  const res = await uni.request({
    url: '/api/image/longimg',
    method: 'POST',
    data: {
      username: uni.getStorageSync('username'),
      urls: imgs
    }
  })
  return res;
}