<!-- <script type="text/javascript" src="https://cdn.goeasy.io/goeasy.js"></script> -->
<script>
	
	import Vue from 'vue'
	export default {
		onLaunch: function() {
			uni.getSystemInfo({
			        success: function(e) {
			            // #ifndef MP
			            Vue.prototype.StatusBar = e.statusBarHeight;
			            if (e.platform == 'android') {
			                Vue.prototype.CustomBar = e.statusBarHeight + 50;
			            } else {
			                Vue.prototype.CustomBar = e.statusBarHeight + 45;
			            };
			            // #endif
			            // #ifdef MP-WEIXIN
			            Vue.prototype.StatusBar = e.statusBarHeight;
			            let custom = wx.getMenuButtonBoundingClientRect();
			            Vue.prototype.Custom = custom;
			            Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
			            // #endif       
			            // #ifdef MP-ALIPAY
			            Vue.prototype.StatusBar = e.statusBarHeight;
			            Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
			            // #endif
			        }
			    })
				
			this.$api.updateSys().then(res => {
				if (res.data.flag == 1) {
					uni.showModal({
						title: '版本升级',
						content: '您有新的版本要更新？',
						confirmText: '立即更新',
						cancelText: '下次再说',
						success: (res)=>{
							if (res.confirm) {
								plus.runtime.openURL(res.data.download_url)
							}
						}
					});	
				}
			}).catch(err => {
			})	
		
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "/static/iconfont/iconfont.css";
	@import '/common/uni.css';
	/* @import "at.alicdn.com/t/font_1320093_zn4aqyzytko.css"; */
	/* //at.alicdn.com/t/font_1320093_zn4aqyzytko.css */
	/* @import "/static/iconfont/font.scss"; */
	/* @import "/common/iconfont/iconfont.css"; */
	.uni-body {
		font-size: 28upx;
	}
</style>
