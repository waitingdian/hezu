import Vue from 'vue'
import App from './App'
import store from './store'  

import request from './common/request.js'
import api from './api/index.js'
import url from './common/config.js'
import cuCustom from './colorui/components/cu-custom.vue'

Vue.prototype.$store = store  
Vue.prototype.$request = request
Vue.prototype.$api = api
Vue.prototype.$url = url
Vue.config.productionTip = false
Vue.component('cu-custom',cuCustom)
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
