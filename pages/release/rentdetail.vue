<template>
	<view class="rentdetail">
		<view class="content">
				<view class="p-t-16" style="text-align: center;padding-top: 40upx;">预租房(组团)</view>
				<!-- 个人信息 -->
				<view class="title">团长信息</view>
				<view class="useringo">
					<view><text class="label">姓名:</text>	{{ userInfo.name }}</view>
					<view><text class="label">学校:</text>	{{ userInfo.school }}</view>
					<view><text class="label">性别:</text>	{{ userInfo.sex }}</view>
					<view><text class="label">个人描述:</text>	{{ userInfo.describe }}</view>
				</view>
				<!-- 租房信息 -->
				<view class="title" style="padding-top: 30upx;padding-bottom: 20upx;">团员信息</view>
				<view class="table-item">
					<text>小红</text>
					<text>北大</text>
					<text>做饭</text>
					<text>待审核</text>
					<!-- <text @tap="operation" class="operation">操作</text> -->
				</view>
				<view class="table-item" style="border-bottom: 1px solid #ccc;">
					<text>小红</text>
					<text>北大</text>
					<text>做饭</text>
					<text>已通过</text>
					<!-- <text @tap="operation" class="operation">操作</text> -->
				</view>
				
				<view class="title" style="padding-top: 30upx;padding-bottom: 20upx;">租房信息</view>
				<view class="rent-info">
					<view>
						<text class="label">标题: </text>
						<text>超大独卫招租</text>
					</view>
					
					<view>
						<text class="label">地区: </text>
						<text>上海市宝山区</text>
					</view>
					
					<view>
						<text class="label">预租房间数: </text>
						<text>2 间</text>
					</view>
					
					<view>
						<text class="label">预租房描述: </text>
						<text>房间很大 有独立阳台独立卫生间</text>
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
	export default {
		data() {
			return {
				roomInfo: {
					name: '',
					province: '',
					city: '',
					area: '',
					roomCount: '',
					describe: ''
				},
				index1: 0,
				index2: 0,
				index3: 0,
				array1: ['上海', '北京', '深圳', '郑州'],
				array2: ['上海', '美国', '巴西', '日本'],
				array3: ['浦东', '浦西', '巴西', '日本']
			}
		},
		computed: {
		     ...mapState(['userInfo'])  
		},
		methods: {
			bindPickerChange1: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
			    this.index1 = e.target.value
			},
			bindPickerChange2: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
			    this.index2 = e.target.value
			},
			bindPickerChange3: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
			    this.index3 = e.target.value
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
			},
			formReset: function(e) {
			    console.log('清空数据')
			},
			bindTextAreaBlur: function (e) {
			    console.log(e.detail.value)
			}
		}
	}
</script>

<style lang="scss">
	.rentdetail{
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
		.title{
			color: $uni-text-color-grey;
		}
		.useringo{
			view{
				padding-top: 12upx;
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
