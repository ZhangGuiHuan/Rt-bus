import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import cuCustom from './components/colorui/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

import request from './utils/request.js' ;
Vue.prototype.$request = request;

import QQMapWX from './utils/qqmap-wx-jssdk.js'

Vue.prototype.$QQMapWX = new QQMapWX({  key: 'Q7VBZ-F6NW5-UTTIF-QFN5D-MYAHZ-NWBSZ' //自己的key秘钥 http://lbs.qq.com/console/mykey.html 在这个网址申请
				    });


App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
