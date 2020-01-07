<template>
	<view class="chat-list-page">
		<cu-custom bgColor="uni-custom-header-color">
			<block slot="content">聊一聊</block>
		</cu-custom>
		<view class="cu-list menu-avatar">
			<view v-if="(!chatList) || (!chatList.length)" class="no-more-txt empty-page">暂时没有消息</view>
			<view class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''" v-for="(item,index) in chatList" :key="index" @tap="goDetail(item)">
				<view class="cu-avatar round lg" v-if="item.receive_user_head" :style="{'background-image':`url(${item.receive_user_head}?imageView2/1/w/200/h/200)`}"></view>
				<view class="cu-avatar round lg" v-else :style="{'background-image':`url(${defaultAvator}?imageView2/1/w/200/h/200)`}"></view>
				<view class="content">
					<view class="text-grey">{{ item.receive_user_name }}</view>
					<view class="text-gray text-sm chat-text-cut">
						<!-- <text class="cuIcon-infofill text-red  margin-right-xs"> -->
						</text> {{ item.last_content }}</view>
				</view>
				<view class="action">
					<view class="text-grey text-xs">{{ item.last_time }}</view>
					<!-- <view class="cu-tag round bg-grey sm">5</view> -->
				</view>
			</view>
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
				modalName: null,
				listTouchStart: 0,
				listTouchDirection: null,
				chatList: [],
				userInfo: {},
				defaultAvator: 'https://hudongmsite.oss-cn-hangzhou.aliyuncs.com/meeting/basicYrC5Sh1570383607306.png'
			}
		},
		onShow () {
			this.getchatList()
			let globalData = this.$options.globalData;
			if (!this.$options.globalData.goeasy) {
				console.log('show')
				this.initGoeasy()
			}
			this.$store.dispatch('getusermsg')
		},
		onHide () {
			if (this.$options.globalData.goeasy) {
				this.$options.globalData.goeasy = null
			}
		},
		onLoad () {
			this.getchatList()
			try {
				uni.getStorage({
					key: 'userInfo',
					success: (res)=>{
						this.userInfo = JSON.parse(res.data);
						if ((!this.userInfo) || (!this.userInfo.user_id)) {
							this.$store.dispatch('getuserinfo')
						}
					}
				});
			} catch (e) {
			}
			this.initGoeasy()
		},
		methods: {
			initGoeasy () {
				let globalData = this.$options.globalData;
				globalData.goeasy = new GoEasy({
					host: 'hangzhou.goeasy.io',
					appkey: 'BC-0a302f5f67764730b09e4be87bf06f0f',
					onConnected: function() {
						console.log('连接成功！')
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
						this.getchatList()
						//非自己的消息震动
						// uni.vibrateLong();
					}
				});
			},
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			goDetail(item) {
				uni.navigateTo({
					url: `/pages/chat/detail?id=${item.receive_user_id}`
				})
			},
			getchatList() {
				this.$api.getChatList().then(res => {
				   this.chatList = res.data
				}).catch(err => {
				})
			}
		}
	}
</script>

<style>
	.empty-page{
		margin-top: 30%;
		text-align: center;
		background-color: #fff;
		min-height: 100%vh;
	}
	.chat-list-page{
		background-color: #fff;
		min-height: 100vh;
	}
	.chat-text-cut{
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
</style>
