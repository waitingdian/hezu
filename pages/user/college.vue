<template>
	<view class="content b-t">
		<cu-custom bgColor="uni-custom-header-color" :isBack="true">
			<block slot="backText" @tap="BackPage">返回</block>
			<block slot="content" style="line-height: 100upx;">我的学校</block>
		</cu-custom>
		<view class="example-body">
			<view class="example-box" v-for="(item, index) in collegeList" :key="index">
				<uni-card>
					<view class="wrapper">
						<view class="address-box">
							<text v-if="item.is_default" class="tag">默认</text>
							<text class="address">{{item.college_name}}</text>
						</view>
						<view class="u-box">
							<text>入学时间:{{item.start_time}}</text>
							</br>
							<text>毕业时间:{{item.end_time}}</text>
						</view>
					</view>
					<hr align=center color=	#D3D3D3 SIZE=1>
					<view style="float: right;">
						<!-- <text @click.stop="addCollege('edit', item)">编辑</text> -->
						<text @click="addCollege('edit', item)" style="font-size: 36rpx;padding-left: 38rpx;cursor: pointer;" class="lg text-gray cuIcon-edit">
							<text style="font-size: 24rpx;" class="padding-left-xs">修改</text>
						</text>
						<text @click="deleteCollege(item.id)" style="font-size: 36rpx;padding-left: 38rpx;cursor: pointer;" class="lg text-gray cuIcon-delete">
							<text style="font-size: 24rpx;" class="padding-left-xs">删除</text>
						</text>
					</view>
				</uni-card>
			</view>
		</view>
		<button class="add-btn" @click="addCollege('add')">新增学校</button>
	</view>
</template>

<script>
	var util = require('@/common/util.js');
	import uniCard from '@/components/uni-card/uni-card.vue'
	export default {
		components: {
			uniCard
		},
		data() {
			return {
				source: 0,
				collegeList: [],
			}
		},
		onLoad(option){
			console.log(option.source);
			this.getUserColleges();
			this.source = option.source;
		},
		methods: {
			addCollege(type, item){
				uni.navigateTo({
					url: `/pages/user/collegeManage?type=${type}&data=${JSON.stringify(item)}`
				})
			},
			deleteCollege(id){
				
				uni.showModal({
					title: '温馨提示',
					content: '确定删除学校吗？',
					confirmText: '确定',
					cancelText: '再想想',
					success: (res)=>{
						if (res.confirm) {
							this.$api.daleteUserColleges({
								id: id
							}).then(res => {
								this.getUserColleges();
							})
						} else if (res.cancel) {
						}
					}
				});	
			},
			//获取用户学校信息
			getUserColleges(){
				this.$api.getUserColleges()
				.then(res => {
					res.data.forEach((item) => {
						item.start_time = util.toStringDate(item.start_time);
						item.end_time = util.toStringDate(item.end_time);
					})
					this.collegeList = res.data;
					console.log(this.collegeList);
				})
			},
			//添加或修改成功之后回调
			refreshList(data, type){
				//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
				this.collegeList.unshift(data);
				
				console.log(data, type);
			},
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style lang='scss'>
	page{
		padding-bottom: 120upx;
	}
	.content{
		position: relative;
	}
	.list{
		display: flex;
		align-items: center;
		padding: 20upx 30upx;;
		background: #fff;
		position: relative;
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.address-box{
		display: flex;
		align-items: center;
		.tag{
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}
		.address{
			font-size: 30upx;
			color: $font-color-dark;
		}
	}
	.u-box{
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;
		.name{
			margin-right: 30upx;
		}
	}
	.icon-bianji{
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}
	
	.add-btn{
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		
	}
	.example-body {
		padding: 30upx;
		background: #fff
	}
	
	.example-body {
		padding: 30upx 0;
	}
	
	.example-box {
		margin-bottom: 30upx;
	}
	
	.example-box:last-child {
		margin-bottom: 0;
	}
</style>
