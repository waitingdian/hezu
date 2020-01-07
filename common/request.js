import urlConfig from './config.js'
var util = require('@/common/util.js');

const request = {}
const headers = {}

request.globalRequest = (url, method, data, power) => {
	var Authorization;
	try {
		var value = uni.getStorageSync('Authentication');
		Authorization = 'Bearer ' + value
	} catch (e) {
		    // error
	}
	if (Authorization) {
		headers.Authorization = Authorization.replace(/\"/g, "")
	}
    return uni.request({
        url: urlConfig + url,
        method,
        data: data,
        dataType: 'json',
        header: headers
    }).then(res => {
		res = res[1]
		if (res && res.data.code == 200) {
			if(url && url.indexOf('/login') != -1){
				let authentication = res.header['Authentication-Info'] || res.header['authentication-info']
				uni.setStorageSync('Authentication', JSON.stringify(authentication));
				var value = uni.getStorageSync('Authentication');
			}
			return res.data
		} else {
			 throw res.data
		}
    }).catch(parmas => {
　　　　　　switch (parmas.code) {
　　　　　　　　case 401:
　　　　　　　　　　uni.clearStorageSync()
				  let curPage = util.getCurPage();
				  if (curPage.indexOf('/pages/login') == -1){
					uni.clearStorageSync('跳转了哦')
					uni.reLaunch({
						url: '/pages/login'
					})
				  } 
　　　　　　　　　　break
　　			  case 405:
　　　　　　　　　　uni.clearStorageSync()
				  uni.reLaunch({
				  	url: '/pages/login'
				  })
　　　　　　　　　　break
　　　　　　　　default:
				uni.showToast({
					icon: 'none',
					title: parmas.msg
				});
　　　　　　　　　　return Promise.reject()
　　　　　　　　　　break
　　　　　　}
　　})
 } 

export default request