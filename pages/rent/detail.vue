<template>
	<view class="rentdetail">
		<cu-custom bgColor="uni-custom-header-color" :isBack="true">
			<block slot="backText" @tap="BackPage">返回</block>
			<block slot="content" style="line-height: 100upx;">发布详情</block>
		</cu-custom>
		
		<view class="content padding-bottom-lg" v-show="detailInfo && detailInfo.id">
			<view class="content-title" v-if="detailInfo.cotenant_type == 1">预租房(组团)</view>
			<view class="content-title" v-if="detailInfo.cotenant_type == 2">合租房(组团)</view>
			<!-- 个人信息 -->
			<view class="label-title">团长信息</view>
			<view class="useringo">
				<view><text class="label">姓名:</text>	{{ detailInfo.leader }}</view>
				<view><text class="label">学校:</text>	{{ detailInfo.college }}</view>
				<view><text class="label">性别:</text>	{{ detailInfo.sex == 1 ? '男' : '女' }}</view>
				<!-- <view><text class="label">兴趣爱好:</text>	{{ detailInfo.sex }}</view> -->
				<view><text class="label">租房描述:</text>	{{ detailInfo.cotenant_description }}</view>
			</view>
			<!-- 团员信息 -->
			<view class="padding-top-sm">
				<view class="label-title" v-if="detailInfo && detailInfo.cotenant_list&& detailInfo.cotenant_list.length">团员信息</view>
				<view class="group-item-wraper padding-top-sm" v-for="(item,index) in detailInfo.cotenant_list" :key="index">
					<view class="useringo">
						<view><text class="label">昵称:</text>	{{ item.nick_name }}</view>
						<view><text class="label">学校:</text>	{{ item.college }}</view>
						<view><text class="label">性别:</text>	{{ item.sex == 1 ? '男' : '女' }}</view>
						<view><text class="label">毕业时间:</text>	{{ item.end_time || '暂无' }}</view>
						<view><text class="label">兴趣爱好:</text>	{{ item.interest }}</view>
						<view style="padding-bottom: 10px;">
							<text class="label">状态:</text>
							<view v-for="(status,index) in statusList"
								:key="index"
								v-if="item.status==status.value" 
								class='cu-tag margin-left-xs'
								:class="'line-' + status.class">{{status.label}}
							</view>
				
						</view>
						<!-- 1是我发布的 -->
						<view style="text-align: right;" v-if="activeTab && activeTab == 1">
							<button @tap="handleStatus(20, item.id)" v-if="item.status!=10" class="cu-btn line-grey margin-right-lg">拒绝</button>
							<button @tap="handleStatus(10, item.id)" v-if="item.status!=10" class="cu-btn bg-blue margin-right-lg">通过</button>
							<button @tap="goChat(item)" class="cu-btn line-blue margin-right-lg">聊一聊</button>
						</view>
						<!-- 2是我参与的 -->
						<view style="text-align: right;" v-if="activeTab && activeTab == 2 && item.status!=30">
							<button @tap="cancelJoin" v-if="item.user_id == userInfo.user_id" class="cu-btn gray-blue margin-right-lg">撤销</button>
						</view>
					</view>
				</view>
			</view>
			
			<view v-if="detailInfo.cotenant_type && detailInfo.cotenant_type ==2">
				<view class="label-title">租房信息</view>
				<view class="rent-info">
					<view>
						<text class="label">标题: </text>
						<text>{{detailInfo.title }}</text>
					</view>
					
					<view>
						<text class="label">地区: </text>
						<text>{{ detailInfo.province }}{{ detailInfo.city }}{{ detailInfo.district }}</text>
					</view>
					
					<view>
						<text class="label">预租房间数: </text>
						<text>{{ detailInfo.cotenant_count }} 间</text>
					</view>
					
					<view>
						<text class="label">预租房描述: </text>
						<text>{{ detailInfo.chamber_description }}</text>
					</view>
				</view>
			</view>
				
			<button v-if="activeTab && activeTab == 1"
			 class="cu-btn block line-blue margin-tb-sm lg"
			  style="margin-top: 60upx;"
			  @tap="doDismiss">解散该团</button>
		</view>
		
		<!-- 解散和组团 -->
		<view class="cu-modal" v-if="modalName=='DialogModal3'" :class="modalName=='DialogModal3'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content padding-top-sm">解散合租团</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="cu-form-group margin-top padding-xl margin-bottom" style="text-align: left;">
					<textarea maxlength="-1" @input="dismissTextareaAInput" placeholder="请输入解散理由,请确保已与其他成员沟通同意解散"></textarea>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-blue text-green" @tap="hideModal">取消</button>
						<button class="cu-btn bg-blue margin-left" :disabled="!dismissContent" @tap="doDismissAjax">确定</button>
		
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {
		        mapState,  
		        mapMutations  
		    } from 'vuex';  

	var util = require('@/common/util.js');
	export default {
		data() {
			return {
				loadModal:false,
				modalName: null,
				reportContent: '',
				dismissContent: '',
				detailInfo: {},
				statusList: [
					{ label: '待审核', value: 0, class: 'blue'},
					{ label: '通过', value: 10, class: 'green'},
					{ label: '未通过(拒绝)', value: 20, class: 'red'},
					{ label: '取消(退团)', value: 30, class: 'gray'}
				],
				dotStyle: false,
				userInfo: {},
				activeTab: null,
				id: ''
				
			}
		},
		onShow() {
			if (this.id) {
				this.getDetailInfo(this.id)
			}
		},
		onLoad(options) {
			this.id = options.id
			this.activeTab = options.activeTab
			this.getDetailInfo(this.id)
			uni.getStorage({
				key: 'userInfo',
				success: (res)=>{
					this.userInfo = JSON.parse(res.data);
					if ((!this.userInfo) || (!this.userInfo.user_id)) {
						this.$store.dispatch('getuserinfo')
					}
				}
			});
		},
		computed: {
		    ...mapState(['emptyRoomPic'])  
		},
		
		methods: {
			goChat(item) {
				uni.navigateTo({
					url: `/pages/chat/detail?id=${item.user_id}`
				});
			},
			cancelJoin() {
				uni.showModal({
					title: '提示',
					content: '确定撤销申请吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: response => {
						if (response.confirm) {
							this.$api.getCancelPersonal({id: this.detailInfo.id}).then(res => {
								uni.showToast({
									icon: 'success',
									title: '撤销成功'
								});
								this.getDetailInfo(this.id)
							}).catch(err => {
							})
						}
					}
				})
				
			},
				// 状态处理
			handleStatus (status,id){
				let params = {
					group_id: this.detailInfo.id,
					member_id: id,
					status: status
				}
				this.$api.getPersonalExamine(params).then(res => {
					uni.showToast({
						icon: 'success',
						title: '操作成功'
					});
					this.getDetailInfo(this.id)
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
			
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			
			getDetailInfo (id) {
				this.loadModal = true
				this.$api.getPersonalDetail({
					id: id,
				}).then(res => {
				   this.loadModal = false
				   res.data.cotenant_list  && res.data.cotenant_list.forEach((item) => {
					   if (item && item.end_time) {
						  item.end_time = util.format(item.end_time)
					   }
				   })
				   res.data.chamber_img_url = res.data.chamber_img_url || this.emptyRoomPic
				   res.data.imgUrlList = res.data.chamber_img_url.split(',')
				   res.data.created_time = util.getDate(res.data.created_time)
				   this.detailInfo = res.data
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
			},
			
			operation (){
				uni.showModal({
					title: '温馨提示',
					content: '是否同意该申请？',
					confirmText: '通过',
					cancelText: '拒绝',
					success: (res)=>{
						if (res.confirm) {
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});	
			}
		}
	}
</script>

<style lang="scss">
	.rentdetail{
		.cu-bar .content{
			height: 70upx;
			line-height: 70upx;
		}
		// color: $uni-text-color-grey;
		.content-title{
			font-size: 36upx;
			padding: 46upx 0 8upx;
			text-align: center;
		}
		.report-btn{
			color: $uni-text-color-grey;
		}
		.cu-tag{
			padding-top: 0;
		}
		.cu-tag[class*="line-"]::after {
		    border-radius: 4px;
		}
		.group-item-wraper{
			padding-bottom: 40upx;
			border-bottom: 1px solid #e8e8e8;
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
			.bg-shadeBottom{
				position: absolute;
				bottom: 0;
				width: 100%;
				background-color: transparent;
				padding: 0px 12px;
			}
		}
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
		.rent-info{
			view{
				padding: 6upx 0;
				.label{
					padding-right: 12upx;
				}
			}
		}
		.p-t-16{
			padding-top: 16upx;
		}
		.content{
			width: 92%;
			margin: 0 auto;
		}
		.label-title{
			// color: $uni-text-color-grey;
			padding-top: 26upx;
			font-size: $uni-font-size-lg;
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
	}
</style>
