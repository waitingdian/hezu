<template>
	<view class="chat-detail-page">
		<cu-custom bgColor="uni-custom-header-color" :isBack="true">
			<block slot="backText" @tap="BackPage">返回</block>
			<block slot="content">聊天</block>
		</cu-custom>
<!-- 		<cu-custom bgColor="uni-custom-header-color">
			<block slot="content">我的信息</block>
		</cu-custom> -->
		<view class="cu-chat" @tap="hideDrawer">
		  <scroll-view class="msg-list" scroll-y="true" :scroll-with-animation="scrollAnimation" :scroll-top="scrollTop" :scroll-into-view="scrollToView" upper-threshold="50">
			<view v-for="chat in chatDetail.chatMessageVMList">
				<view class="cu-item self" v-if="chat.type == 1">
					<view class="main">
						<view class="content bg-green shadow">
							<text>{{ chat.content }}</text>
						</view>
					</view>
					<view class="cu-avatar radius" v-if="chatDetail.send_user_head" :style="{'background-image':`url(${chatDetail.send_user_head}?imageView2/1/w/200/h/200)`}"></view>
					<view class="cu-avatar radius" v-else :style="{'background-image':`url(${defaultAvator}?imageView2/1/w/200/h/200)`}"></view>
					<view class="date">{{ chat.send_time }}</view>
				</view>
				<view class="cu-item" v-else>
					<view class="cu-avatar radius" @tap="goMyRent(chat.send_user_id)" v-if="chatDetail.receive_user_head" :style="{'background-image':`url(${chatDetail.receive_user_head}?imageView2/1/w/200/h/200)`}"></view>
					<view class="cu-avatar radius" @tap="goMyRent(chat.send_user_id)" v-else :style="{'background-image':`url(${defaultAvator}?imageView2/1/w/200/h/200)`}"></view>
					<view class="main">
						<view class="content shadow">
							<text>{{ chat.content }}</text>
						</view>
					</view>
					<view class="date ">{{ chat.send_time }}</view>
				</view>
			</view>
			
		  </scroll-view>
		</view>
		
		<view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
			<input class="solid-bottom" :adjust-position="false" v-model="sendContent" :focus="false" maxlength="300" :cursor-spacing="10"
			 @focus="InputFocus" @blur="InputBlur"></input>
			<button class="cu-btn bg-green shadow" @tap="sendMessage">发送</button>
		</view>

	</view>
</template>

<script>

	import GoEasy from '@/common/SDK/goeasy-1.0.0.beta.js';
	export default {
		globalData: {
			goeasy: null  
		}, 
		data() {
			return {
				InputBottom: 0,
				userInfo: {},
				chatDetail: {},
				sendContent: '',
				scrollTop: 0,
				scrollAnimation:false,
				recordTis:"手指上滑 取消发送",
				recording: false,
				// 抽屉参数
				popupLayerClass:'',
				scrollToView:'',
				id: '',
				defaultAvator: 'https://hudongmsite.oss-cn-hangzhou.aliyuncs.com/meeting/basicYrC5Sh1570383607306.png'
			};
		},
		onLoad(options) {
			this.id = options.id
			this.getMessageFn(this.id)
			uni.getStorage({
				key: 'userInfo',
				success: (res)=>{
					this.userInfo = JSON.parse(res.data);
					if ((!this.userInfo) || (!this.userInfo.user_id)) {
						this.$store.dispatch('getuserinfo')
					}
				}
			});
			
			this.initGoeasy()
			
		},
		
		onShow(){
			this.scrollTop = 9999999;
			let globalData = this.$options.globalData;
			if (!this.$options.globalData.goeasy) {
				this.initGoeasy()
			}
		},
		
		onHide () {
			if (this.$options.globalData.goeasy) {
				this.$options.globalData.goeasy = null
			}
		},
		methods: {
			initGoeasy () {
				let globalData = this.$options.globalData;
				globalData.goeasy = new GoEasy({
					host: 'hangzhou.goeasy.io',
					appkey: 'BC-0a302f5f67764730b09e4be87bf06f0f',
					onConnected: function() {
						// console.log('连接成功！')
					},
					onDisconnected: function() {
						console.log('连接断开！')
					},
					onConnectFailed: function(error) {
						console.log('连接失败或错误！')
					}
				});
				
				globalData.goeasy.subscribe({
					channel: this.userInfo.user_id,
					onMessage: (message) => {
						//收到消息的第一行，打出日志，以这个时间作为检查的标准
						this.getMessageFn(this.id)
						//非自己的消息震动
						uni.vibrateLong();
					}
				});
			},
			
			goMyRent(id){
				this.$api.getGroupId({
					userId: id
				}).then(res => {
					if (res.data && res.data.group_id) {
						
						uni.showModal({
							title: '提示',
							content: '是否跳转至参团详情？',
							cancelText: '取消',
							confirmText: '确定',
							success: response => {
								if (response.confirm) {
									uni.navigateTo({
										url: `/pages/home/detail?id=${res.data.group_id}`
									})
									// url: `/pages/home/detail?id=${id}`
									// /pages/rent/detail?id=639796069192138752&activeTab=1
								}
							}
						})
						
					} else {
						
					}
					console.log('========', res)
				}).catch(err => {
				})
			},
		
			// 打开抽屉
			openDrawer(){
				this.popupLayerClass = 'showLayer';
			},
			// 隐藏抽屉
			hideDrawer(){
				this.popupLayerClass = '';
				setTimeout(()=>{
					this.hideMore = true;
					this.hideEmoji = true;
				},150);
			},
			//获取焦点，如果不是选表情ing,则关闭抽屉
			textareaFocus(){
				if(this.popupLayerClass=='showLayer' && this.hideMore == false){
					this.hideDrawer();
				}
			},
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			sendMessage() {
				if (!this.sendContent) {
					return false
				}
				this.$api.sendChat({
					receive_user_id: this.id,
					content: this.sendContent
				}).then(res => {
					this.sendContent = ''
					this.getMessageFn(this.id)
				}).catch(err => {
				})
			},
			getMessageFn(id) {
				this.$api.getMessage({
					receive_user_id: id
				}).then(res => {
				   res.data.chatMessageVMList.forEach((item) => {
					   if (item.send_user_id == this.userInfo.user_id) {
						   // 自己发送的
 						   item.type = 1
					   } else {
						   item.type = 2
					   }
				   })
				   this.chatDetail = res.data
				   // 滚动到底部
				   this.$nextTick(function() {
				   	//进入页面滚动到底部
				   	this.scrollTop = this.scrollTop + 1
				   	this.$nextTick(function() {
				   		this.scrollAnimation = true;
				   	});
				   	
				   });
				}).catch(err => {
				})
			},
			InputFocus(e) {
				// uni.showToast({
				//     icon: 'none',
				//     title: 'InputFocus'
				// });
				// console.log(e.detail.height)
				let inputHeight = e.detail.height
				// #ifdef APP-PLUS
				console.log(plus.screen.resolutionHeight)
				console.log(plus.android.invoke(plus.android.currentWebview(),"getHeight"))
				console.log(plus.navigator.getStatusbarHeight())
				// #endif
				// #ifdef H5 || MP-WEIXIN	
				// #endif
				// this.InputBottom = 80
				this.InputBottom = e.detail.height
			},
			InputBlur(e) {
				this.InputBottom = 0
			},
			discard(){
				return;
			}
		}
	}
</script>

<style>
	.chat-detail-page{
		/* background-color: #f5f5f5; */
		min-height: 100vh;
	}
	page{
	  padding-bottom: 110upx;
	}
	.msg-list{
		position: absolute;
		top: 80px;
		bottom: 100upx;
	}
</style>
