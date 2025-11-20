import {
	createSSRApp
} from "vue";
import App from "./App.vue";
// const towxml = require("./wxcomponents/towxml/index")
import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue';
import uniPopupDialog from '@dcloudio/uni-ui/lib/uni-popup-dialog/uni-popup-dialog.vue';
import uniTransition from '@dcloudio/uni-ui/lib/uni-transition/uni-transition.vue';
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'


export function createApp() {
	const app = createSSRApp(App);
	app.config.globalProperties.$ossUrl = 'https://yonganpicture.oss-cn-shenzhen.aliyuncs.com/';
	app.config.globalProperties.$viewUrl = 'https://file.wiiken.cn/onlinePreview?url=';
	app.config.globalProperties.$picsUrl = 'https://file.wiiken.cn/picturesPreview?urls=';
	app.component('uni-popup', uniPopup);
	app.component('uni-popup-dialog', uniPopupDialog);
	app.component('uni-transition', uniTransition);
	app.component('uni-icons', uniIcons);
	// app.config.globalProperties.$towxml = towxml
	return {
		app,
	};
}
