import exp from 'constants';
import { ref } from 'vue'

export const fileTypes = ref([
  { name: '身份证', type: 1, url: 'https://yonganpicture.oss-cn-shenzhen.aliyuncs.com/icons/oss5.png' },
  { name: '银行卡', type: 2, url: 'https://yonganpicture.oss-cn-shenzhen.aliyuncs.com/icons/oss3.png' },
  { name: '户口页', type: 3, url: 'https://yonganpicture.oss-cn-shenzhen.aliyuncs.com/icons/oss2.png' },
  { name: '护照', type: 4, url: 'https://yonganpicture.oss-cn-shenzhen.aliyuncs.com/icons/oss3.png' },
  { name: '驾驶证', type: 5, url: 'https://yonganpicture.oss-cn-shenzhen.aliyuncs.com/icons/oss4.png' },
  { name: '证书', type: 6, url: 'https://yonganpicture.oss-cn-shenzhen.aliyuncs.com/icons/oss8.png' },
  { name: '执照', type: 7, url: 'https://yonganpicture.oss-cn-shenzhen.aliyuncs.com/icons/oss9.png' }

]);

export const ustate = ref(false)
export const tState = ref(true)
export const cerIndex = ref(1)
export const imgSrc = ref('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon2/icon1.png')
export const wState = ref(false)
export const fileSrc = ref('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/home/new/icon12/filetext.png')
export const fileTipName = ref('文字提取')
export const fileTip = ref('提取图片上的文字，可对识别的内容进行复制、编辑。')
export const fileText = ref('开始提取')
export const masterState = ref(false)

//身份证index
export const idcardIndex = ref(1)
//银行卡index
export const bankIndex = ref(1)
//户口index
export const hukouIndex = ref(1)
//驾驶证index
export const driverIndex = ref(1)
//拼图多张单张
export const pintuIndex = ref(1)

//遮罩
export const maskRef = ref(null)

export const localSet = ref({})

export const tab = ref(4)