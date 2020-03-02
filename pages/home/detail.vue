<template>
	<view class="rentdetail">
		<!-- 头部 -->
		<cu-custom bgColor="uni-custom-header-color" :isBack="true">
			<block slot="backText" @tap="BackPage">返回</block>
			<block slot="content" style="line-height: 100upx;">详情</block>
			<block slot="right">
				<!--  #ifdef  APP-PLUS -->
				<view class="padding-right-lg report-btn" v-if="userInfo.user_id != detailInfo.leader_id" @tap="showModal" data-target="DialogModal1">举报</view>
			    <!--  #endif -->
				<!--  #ifdef  MP-WEIXIN -->
				<view class="report-btn" style="position: absolute;right: 214upx;top:95upx;" v-if="userInfo.user_id != detailInfo.leader_id" @tap="showModal" data-target="DialogModal1">举报</view>
				<!--  #endif -->
			</block>
			
		</cu-custom>
		
		<view class="content padding-bottom-lg" v-if="detailInfo&&detailInfo.id">
			
			<!-- 轮播图 -->
			<view class="card-wraper">
				<swiper class="screen-swiper" :class="dotStyle?'square-dot':'round-dot'" :indicator-dots="true" :circular="true"
				 :autoplay="true" interval="3000" duration="500">
					<swiper-item v-for="(item,index) in detailInfo.imgUrlList" :key="index" @tap="ViewImage">
						<image :src="`${item}?imageView2/1/w/800/h/434`" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
				<!-- <view class="cu-bar bg-shadeBottom"> <text class="text-cut">{{ detailInfo.title }}</text></view> -->
			</view>
			
			<!-- 团长信息 -->
			<view class="cu-bar detail-title"> <text class="text-cut">{{ detailInfo.title }}</text></view>
			<!-- <view class="label-title">团长信息</view> -->
			<view class="useringo">
				<view><text class="label">姓名:</text>	{{ detailInfo.leader }}</view>
				<view><text class="label">性别:</text>	{{ detailInfo.sex == 1 ? '男' : '女' }}</view>
				<view><text class="label">学校:</text>	{{ detailInfo.college }}</view>
				<view><text class="label">毕业时间:</text>	{{ detailInfo.end_time || '暂无' }}</view>
				<view><text class="label">房间数:</text>	{{ detailInfo.cotenant_count }}间</view>
				<view v-if="detailInfo.status=='0'"><text class="label" >租房状态:</text>	正在出租</view>
				<view v-if="detailInfo.status=='10'"><text class="label" >租房状态:</text>	租房完成</view>
				<view v-if="detailInfo.status=='20'"><text class="label" >租房状态:</text>	租房解散(取消)</view>
				<!-- 0:租房中; -->
				<!-- 10:租房完成; -->
				<!-- 20:租房解散(取消); -->
				<view><text class="label">地区:</text>{{ detailInfo.province }} {{ detailInfo.city }} {{ detailInfo.district }}</view>
				<view @click="openLocation"><text class="label">位置:</text><text class="lg text-gray cuIcon-location">{{ detailInfo.address_name }}</text></view>
				<view><text class="label" v-if="detailInfo.cotenant_description">个人描述:</text></view>
				<view class="desc-content" v-if="detailInfo.cotenant_description">{{ detailInfo.cotenant_description }}</view>
				<view><text class="label" v-if="detailInfo.chamber_description">租房描述:</text></view>
				<view class="desc-content" v-if="detailInfo.chamber_description">{{ detailInfo.chamber_description }}</view>
			</view>
			<!-- 团员信息 -->
			<view class="label-title" v-if="detailInfo.cotenant_list && detailInfo.cotenant_list.length">合租信息</view>
			<view class="rent-list margin-top-sm">
				<view class="rent-item header" v-if="detailInfo.cotenant_list && detailInfo.cotenant_list.length" style="color: #606266;margin-bottom: 0;">
					<!-- <text class="avator">头像</text> -->
					<text class="name">昵称</text>
					<text class="sex">性别</text>
					<text class="college">大学</text>
					<!-- <text class="endtime">毕业时间</text> -->
					<text class="hobby">兴趣爱好</text>
				</view>
				<view class="rent-item" v-for="rent in detailInfo.cotenant_list" :key="rent.id">
					<!-- <view class="cu-avatar radius margin-left" :style="background-image:url("userForm.user_head || defaultAvator");"></view> -->
					<!-- <view class="avator cu-avatar radius" :style="{'background-image':`url(${rent.user_head || defaultAvator})`,'border-radius': '100%'}"></view> -->
					<text class="name">{{ rent.nick_name }}</text>
					<text class="sex">{{ rent.sex == 1 ? '男' : '女' }}</text>
					<text class="college">{{ rent.college }}</text>
					<!-- <text class="endtime">{{ rent.end_time }}</text> -->
					<text class="hobby">{{ rent.interest }}</text>
				</view>
			</view>
			<view style="text-align: right;" class="padding-top-sm" v-if="userInfo.user_id != detailInfo.leader_id">
				<button class="cu-btn bg-blue margin-left" @tap="showModal" data-target="DialogModal2">申请加入</button>
				<button class="cu-btn margin-left" @tap="goChat">聊一聊</button>
			</view>	
			<view v-else style="text-align: right;" class="padding-top-sm">
				<button class="cu-btn line-blue margin-left" @tap="doDismiss">解散该团</button>
			</view>	
		</view>
		
		<!-- 举报模态框 -->
		<view v-if="modalName=='DialogModal1'">
			<view class="cu-modal" :class="modalName=='DialogModal1'?'show':''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content padding-top-sm">举报</view>
						<view class="action" @tap="hideModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="cu-form-group margin-top padding-xl margin-bottom" style="text-align: left;">
						<textarea maxlength="-1" @input="textareaAInput" placeholder="请输入举报内容"></textarea>
					</view>
					<view class="cu-bar bg-white justify-end">
						<view class="action">
							<button class="cu-btn line-blue text-green" @tap="hideModal">取消</button>
							<button class="cu-btn bg-blue margin-left" :disabled="!reportContent" @tap="reported">确定</button>
			
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 申请加入 -->
		<view class="cu-modal" v-if="modalName=='DialogModal2'" :class="modalName=='DialogModal2'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content padding-top-sm">申请加入</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					确定申请加入该组团?
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-blue text-green" @tap="hideModal">取消</button>
						<button class="cu-btn bg-blue margin-left" @tap="join">确定</button>
					</view>
				</view>
			</view>
		</view>
	
	</view>
</template>

<script>
	var util = require('@/common/util.js');
	import {
	        mapState,  
	        mapMutations  
	    } from 'vuex';  
	export default {
		data() {
			return {
				modalName: null,
				reportContent: '',
				dismissContent: '',
				detailInfo: {},
				dotStyle: false,
				userInfo: {},
				id: '',
				defaultAvator: 'https://hudongmsite.oss-cn-hangzhou.aliyuncs.com/meeting/basicYrC5Sh1570383607306.png'
			}
		},
		computed: {
		    ...mapState(['emptyRoomPic'])  
		},
		onLoad(options) {
			this.id = options.id
			this.getDetailInfo(this.id)
			uni.getStorage({
				key: 'userInfo',
				success: (res)=>{
					this.userInfo = JSON.parse(res.data);
				}
			});
		},
		methods: {
			ViewImage(e) {
				uni.previewImage({
					urls: this.detailInfo.imgUrlList,
					current: `${e.currentTarget.dataset.url}?imageView2/1/w/800/h/434`
				});
			},
			
			clear() {
				uni.clearStorageSync()
			},
		
			goChat() {
				this.$api.buildCommunication({
					receive_user_id: this.detailInfo.leader_id,
				}).then(res => {
					uni.navigateTo({
						url: `/pages/chat/detail?id=${this.detailInfo.leader_id}`
					});
				}).catch(err => {
				})
			},
			
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			
			hideModal(e) {
				this.modalName = null
			},
			
			textareaAInput(e) {
				this.reportContent = e.detail.value
			},
			
			reported() {
				this.$api.getGroupReported({
					id: this.detailInfo.id,
					content: this.reportContent
				}).then(res => {
					this.modalName = null
					 uni.showToast({
						 icon: 'none',
						 title: '举报成功,我们会尽快进行核实'
					 });
				}).catch(err => {
					this.modalName = null
				})
			},
			
			join() {
				this.$api.getGroupJoin({
					id: this.detailInfo.id
				}).then(res => {
					this.modalName = null
					 uni.showToast({
						 icon: 'success',
						 title: '加入成功'
					 });
					 uni.setStorage({
					     key: 'renttype',
					     data: '2',
					     success: function () {
					     }
					 });
					 setTimeout(() => {
						 uni.switchTab({
						     url: '/pages/rent/rent?activeTab=2'
						 });
					 }, 200)
					 
				}).catch(err => {
					this.modalName = null
				})
			},
			
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			
			getDetailInfo (id) {
				this.$api.getGroupDeatil({
					id: id,
				}).then(res => {
				   res.data.cotenant_list  && res.data.cotenant_list.forEach((item) => {
					  if (item && item.end_time) {
					  	 item.end_time = util.getDate(item.end_time)
					  }
				   })
				   res.data.chamber_img_url = res.data.chamber_img_url || this.emptyRoomPic
				   res.data.imgUrlList = res.data.chamber_img_url.split(',')
				   res.data.created_time = util.getDate(res.data.created_time)
				   this.detailInfo = res.data
				   res.data.end_time = util.getDate(res.data.end_time)
				   console.log(this.detailInfo)
				}).catch(err => {
				})
			},
			
			dismissTextareaAInput (e) {
				this.dismissContent = e.detail.value
			},
			
			doDismiss () {
				uni.showModal({
					title: '温馨提示',
					content: '请确保与其他成员沟通，同意解散租房团',
					confirmText: '确定',
					cancelText: '再想想',
					success: (res)=>{
						if (res.confirm) {
							this.doDismissAjax()
						} else if (res.cancel) {
						}
					}
				});	
			},
			
			openLocation: function (e) {
				console.log(e)
				var value = e.target.value
				uni.openLocation({
					longitude: Number(this.detailInfo.address_longitude),
					latitude: Number(this.detailInfo.address_latitude),
					name: this.detailInfo.address_name,
					address: this.detailInfo.address_detail
				})
			},
			
			doDismissAjax () {
				this.$api.getPersonaDismiss({
					id: this.detailInfo.id,
					dismissContent: this.dismissContent // 解散理由
				}).then(res => {
					uni.showToast({icon: 'none',title: '解散成功'});
					setTimeout(() => {
						uni.switchTab({
						    url: '/pages/home/home',
						    success: function(e) {
						     uni.setStorage({
						         key: 'hometype',
						         data: '2'
						     });
						    }
						});
					}, 500)
				}).catch(err => {
				})
			}
		}
	}
</script>

<style lang="scss">
	.rentdetail{
		background-color: #fff;
		min-height: 100vh;
		padding-bottom: 30upx;
		.detail-title{
			min-height: 30upx;
			line-height: 1;
			padding: 36upx 0 12upx;
			font-size: $uni-font-size-biglg;
		}
		.desc-content{
			position: relative;
			background-color: #f5f5f5;
			margin-top: 30upx;
			padding: 10upx 20upx;
			// &:before{
			// 	position: absolute;
			// 	left: 30px;
			// 	top: 0px;
			// 	margin-left: 0;
			// 	content: "";
			// 	border: 10px solid transparent;
			// 	border-bottom-color: #fff;
			// }
			&:after{
				position: absolute;
				left: 24px;
				top: -30upx;
				margin-left: 0;
				content: "";
				border: 8px solid transparent;
				border-bottom-color: #F5F5F5;
			}
		}
		.cu-bar .content{
			height: 70upx;
			line-height: 70upx;
		}
		.report-btn{
			color: $uni-text-color-grey;
		}
		.rent-list {
			// border-top: 1upx solid #ccc;
			// border-left: 1upx solid #ccc;
			// padding-left: 10upx;
			// text-align: center;
			text{
				// padding-right: 16upx ;
				padding:0 8upx;
				box-sizing: border-box;
				// border-left: 1upx solid #ccc;
			}
			.rent-item{
				line-height: 64upx;
				display:flex;
				background-color: #e7e7e7;
				margin-bottom: 20upx;
				box-sizing: border-box;
				border: 1upx solid #e7e7e7;
				&.header{
					// text-align: center;
				}
				// .avator{
				// 	width: 10%;
				// }
				.name{
					width: 25%;
				}
				.sex{
					width: 12%;
				}
				.college{
					width: 25%;
				}
				// .endtime{
				// 	width: 25%;
				// }
				.hobby{
					width: 38%;
				}
				text{
					flex-shrink: 0;
					// padding: 0 36upx 0 4upx;
					// border-right: 1upx solid #ccc;
					// border-bottom: 1upx solid #ccc;
				}
			}
		}
		.cu-tag{
			padding-top: 0;
		}
		.cu-tag[class*="line-"]::after {
		    border-radius: 4px;
		}
		.group-item-wraper{
			padding-bottom: 30upx;
			border-bottom: 1px solid #f5f5f5;
		}
		.card-wraper{
			position: relative;
			.cu-tag{
				position: absolute;
				top: 6upx;
				right: 6upx;
			}
			uni-image{
				height: 100%;
			}
		}
		// ------------------
		.table-item{
			display: flex;
			// border: 1px solid #ccc;
			border-top: 1px solid #ccc;
			border-left: 1px solid #ccc;
			text{
				padding: 16upx 0;
				flex: 1;
				border-right: 1px solid #ccc;
				// border-bottom: 1px solid #ccc;
				text-align: center;
			}
			.operation{
				color:#4399FC;
				text-decoration: underline;
			}
		}

	
		.content{
			width: 92%;
			margin: 0 auto;
		}
		.label-title{
			// color: $uni-text-color-grey;
			font-size: $uni-font-size-lg;
			padding-top: 26upx;
		}
		.useringo{
			>view{
				padding-top: 12upx;
				&:first-child{
					padding-top: 6upx;
				}
			}
			.label{
				color: #333333;
				// color: $uni-text-color-grey;
				padding-right: 14upx
			}
		}
		
		.roominfo{
			.uni-form-item{
				display: flex;
				height: 70upx;
				line-height: 70upx;
				line-height: 70upx;
			}
			.label{
				color: #333333;
				padding: 14upx 20upx 14upx 0;
				// color: $uni-text-color-grey;
			}
			input{
				height: 70upx;
				line-height: 70upx;
				line-height: 70upx;
			}
			textarea{
				height: 280upx;
			}
		}
	}
</style>
