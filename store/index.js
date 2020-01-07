import request from '@/common/request.js'
import api from '@/api/index.js'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({  
    state: {  
		statename: '',
		// emptyRoomPic: 'https://hudongmsite.oss-cn-hangzhou.aliyuncs.com/meeting/basicHd2r4N1570498528514.jpg',
		emptyRoomPic: 'http://qiniutest001.fensibox.com/cotenant_20191222_182857_47643',
		userInfo: {
		}
    },  
    mutations: {  	
		setUserInfo(state, data) {
			console.log('data', data)
			state.userInfo = data
		}
    },
	actions: {
		getuserinfo ({commit}) {
			api.getUserInfo().then(res => {
				uni.setStorageSync('userInfo', JSON.stringify(res.data));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
				commit('setUserInfo', res.data);
			}).catch(err => {
			})
		},
		
		getusermsg () {
			api.getInfo().then(res => {
				uni.setStorageSync('userMsg', JSON.stringify(res.data));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
				if (res.data && res.data.unread_group_count && res.data.unread_group_count > 0) {
					console.log('set小红点3333')
					uni.setTabBarBadge({
					  index: 1,
					  text: res.data.unread_group_count + ''
					})	
				}
			}).catch(err => {
			})
		},
		
		cleanunread({commit}, params) {
			api.cleanUnread(params).then(res => {
				uni.removeTabBarBadge({
				  index: 1
				})
			}).catch(err => {
			})
		}
	}
})  

export default store