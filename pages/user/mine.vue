<template>
	<view class="user-page">
		<!-- 头部 -->
		<cu-custom bgColor="uni-custom-header-color" :isBack="true">
			<block slot="content">我的信息</block>
		</cu-custom>
		<!-- 头像 -->
		<view class="user-info">
			<image class="avator" :src="userInfo.user_head ? `${userInfo.user_head}?imageView2/1/w/200/h/200` : `${defaultAvator}?imageView2/1/w/200/h/200`"></image>
			<view class="name-wraper">
				<text>{{ userInfo.user_name }}</text>
			</view>
		</view>
		<view class="cu-list menu" style="margin-top: 30upx">
			<view class="cu-item" @tap="goUserSetting">
				<view class="content content-arrow">
					<text class="text-grey">个人信息</text>
				</view>
			</view>
			<view class="cu-item"  @tap="clear">
				<view class="content content-arrow">
					<text class="text-grey">清除缓存</text>
				</view>
			</view>
			<view class="cu-item" @tap="showModal" data-target="DialogModal1">
				<view class="content content-arrow">
					<!-- <image src="/static/logo.png" class="png" mode="aspectFit"></image> -->
					<text class="text-grey">意见反馈</text>
				</view>
			</view>
			
			<!-- 用户建议反馈模态框 -->
			<view class="cu-modal" :class="modalName=='DialogModal1'?'show':''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content padding-top-sm">用户建议反馈</view>
						<view class="action" @tap="hideModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="cu-form-group margin-top padding-xl margin-bottom" style="text-align: left;">
						<textarea maxlength="-1" @input="textareaAInput" placeholder="请输入您想反馈的内容"></textarea>
					</view>
					<view class="cu-bar bg-white justify-end">
						<view class="action">
							<button class="cu-btn line-blue text-green" @tap="hideModal">取消</button>
							<button class="cu-btn bg-blue margin-left" :disabled="!content" @tap="submit">确定</button>
			
						</view>
					</view>
				</view>
			</view>
			
			<view class="cu-item" @tap="about">
				<view class="content content-arrow">
					<text class="text-grey">关于校友合租</text>
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	// 可以删除
	var util = require('@/common/util.js');
	const qiniuUploader = require("@/components/qiniu-wxapp-sdk/sdk/qiniuUploader");
	export default {
		data() {
			return {
				userForm: {
					name: '',
					user_head: '',
					avator: '',
					phone: '',
					sex: 1,
					school: 1,
					start_time: '2016-08',
					end_time: '',
					hobby: "",
					education: '',
					studentPhoto: '',
					graduationPhoto: ''
				},
				defaultAvator: 'https://hudongmsite.oss-cn-hangzhou.aliyuncs.com/meeting/basicYrC5Sh1570383607306.png',
				userInfo: {},
				isEdit: false,
				imgList: [],
				imgList1: [],
				imgList2: [],
				index: -1,
				xueliList: ['专科', '本科', '硕士', '博士'],
				certificates: 1,
				content: '',
				modalName: null
			}
		},
		onLoad() {
			this.getUserInfo()
			this.isEdit = false
		},
		onShow() {
			if (!this.isEdit) {
				this.getUserInfo()
			}
			this.$store.dispatch('getusermsg')
		},
		methods: {
			goUserSetting() {
				uni.navigateTo({
					url: '/pages/user/user'
				});
			},
			
			getUserInfo () {
				this.$api.getUserInfo().then(res => {
	                this.userInfo = res.data
				}).catch(err => {
				})
			},
			
			about(){
				uni.navigateTo({
					url: '/pages/user/about'
				});
			},
			
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			
			hideModal(e) {
				this.modalName = null
			},
			
			clear(){
				uni.showModal({
					title: '提示',
					content: '确定清除缓存吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							setTimeout(function(){
								uni.showToast({
									 icon: 'none',
									 title: '清除成功~'
								});
							},300) 
						}
					}
				})
			},
			
			submit() {
				this.$api.proposalReported({
					proposal_type: 1,
					content: this.content
				}).then(res => {
					this.modalName = null
					 uni.showToast({
						 icon: 'none',
						 title: '提交成功,感谢您的反馈~'
					 });
				}).catch(err => {
					this.modalName = null
				})
			},
			
			textareaAInput(e) {
				this.content = e.detail.value
			},
			
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style lang="scss">
	.user-page{
		padding-bottom: 50rpx;
		.cu-item .content-arrow:after{
			font-family: cuIcon;
			display: block;
			content: "\E6A3";
			position: absolute;
			font-size: 14px;
			color: #8799a3;
			width: 25px;
			text-align: center;
			top: 16px;
			bottom: 0;
			right: 10px;
			margin: auto;
		}
		.user-info {
			width: 92%;
			display: flex;
			margin: 0 auto;
			.avator{
				margin: 18upx 0 20upx 18upx;
				width: 160upx;
				border-radius: 10000upx;
				height: 160upx;
			}
			.name-wraper{
				display: flex;
				// flex-direction: column;
				align-items: center;
				width: 58%;
				padding: 4% 20px;
				font-size: 30upx;
			}
		}
	}
</style>
