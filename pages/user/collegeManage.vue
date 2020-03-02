<template>
	<view class="content">
		<cu-custom bgColor="uni-custom-header-color" :isBack="true">
			<block slot="backText" @tap="BackPage">返回</block>
			<block slot="content" style="line-height: 100upx;">{{title}}</block>
		</cu-custom>
		<view class="row b-b">
			<text class="tit">大学名称</text>
			<picker @change="colegeChange" :value="colegeIndex" :range="collegeList" range-key="college_name">
				<view class="picker">
					{{colegeIndex>-1?collegeList[colegeIndex].college_name:'请选择'}}
				</view>
			</picker>
		</view>
		<view class="row b-b">
			<text class="tit">入学时间</text>
			<picker @change="startDateChange" :value="startIndex" :range="startDateList">
				<view class="picker">
					{{startIndex>-1?startDateList[startIndex]:'请选择'}}
				</view>
			</picker>
		</view>
		<view class="row b-b">
			<text class="tit">毕业时间</text>
			<picker @change="endDateChange" :value="endIndex" :range="endDateList">
				<view class="picker">
					{{endIndex>-1?endDateList[endIndex]:'请选择'}}
				</view>
			</picker>
		</view>
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="collegeData.is_default" color="#fa436a" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	var util = require('@/common/util.js')
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
	export default {
		data() {
			return {
				colegeIndex: -1,
				collegeData: {
					id:'',
					college_id: '',
					college_name: '',
					start_time: '',
					end_time: '',
					is_default: false
				},
				collegeList: [],
				startIndex: -1,
				startDateList: ['请选择','2000-09-01','2001-09-01','2002-09-01','2003-09-01',
				'2004-09-01','2005-09-01','2006-09-01','2007-09-01','2008-09-01',
				'2009-09-01','2010-09-01','2011-09-01','2012-09-01','2013-09-01',
				'2014-09-01','2015-09-01','2016-09-01','2017-09-01','2018-09-01',
				'2019-09-01','2020-09-01','2021-09-01','2022-09-01','2023-09-01'],
				endIndex: -1,
				endDateList: ['请选择','2000-06-01','2001-06-01','2002-06-01','2003-06-01',
				'2004-06-01','2005-06-01','2006-06-01','2007-06-01','2008-06-01',
				'2009-06-01','2010-06-01','2011-06-01','2012-06-01','2013-06-01',
				'2014-06-01','2015-06-01','2016-06-01','2017-06-01','2018-06-01',
				'2019-06-01','2020-06-01','2021-06-01','2022-06-01','2023-06-01',
				'2024-06-01','2025-06-01'],
				title: '',
				manageType:''
			}
		},
		onLoad(option){
			this.title = '新增我的学校';
			if(option.type==='edit'){
				this.title = '编辑我的学校'
				this.collegeData = JSON.parse(option.data)
				this.collegeData.id = JSON.parse(option.data).id
				this.collegeData.college_id = JSON.parse(option.data).college_id
			}
			this.manageType = option.type;
			this.getColleges();
			setTimeout(() =>{
			    this.initInfo();
			},1000);
		},
		methods: {
			getColleges(){
				this.$api.getColleges()
				.then(res => {
					console.log("返回的学校数据："+res.data)
					this.collegeList = res.data;
					console.log("接收的学校数据"+this.collegeList)
				})
			},
			initInfo() {
				// let hobby = []
				// let tempObj = JSON.parse(JSON.stringify(this.userInfo))
				if (this.collegeData.college_name) {
					this.collegeList.forEach((item,index) => {
						if (item.college_name == this.collegeData.college_name) {
							this.colegeIndex = index
						}
					})
				} else {
					this.colegeIndex = -1
				}
				console.log(this.colegeIndex);
				if (this.collegeData.start_time) {
					this.startDateList.forEach((item,index) => {
						if (item == this.collegeData.start_time) {
							this.startIndex = index
						}
					})
				} else {
					this.startIndex = -1
				}
				
				if (this.collegeData.end_time) {
					this.endDateList.forEach((item,index) => {
						if (item == this.collegeData.end_time) {
							this.endIndex = index
						}
					})
				} else {
					this.endIndex = -1
				}
			},
			switchChange(e){
				this.collegeData.is_default = e.detail.value;
			},
			
			colegeChange(e) {
				this.colegeIndex = e.detail.value
			},
			startDateChange(e) {
				this.startIndex = e.detail.value
				this.collegeData.start_time = this.startDateList[this.startIndex]
				
			},
			
			endDateChange(e) {
				this.endIndex = e.detail.value
				this.collegeData.end_time = this.endDateList[this.endIndex]
			},
			
			//提交
			confirm(){
				let data = this.collegeData;
				if(this.colegeIndex < 1){
					uni.showToast({
					    icon: 'none',
					    title: '请选择学校'
					});					
					return;
				}
				if(this.startIndex < 1){
					uni.showToast({
					    icon: 'none',
					    title: '请选择入学时间'
					});					
					return;
				}
				if(this.endIndex < 1){
					uni.showToast({
					    icon: 'none',
					    title: '请选择毕业时间'
					});					
					return;
				}
				let params = {
					id: this.collegeData.id,
					college_id: this.collegeList[this.colegeIndex].id,
					start_time: util.format(this.startDateList[this.startIndex]),
					end_time: util.format(this.endDateList[this.endIndex]),
					is_default: this.collegeData.is_default
				}
				
				if(this.manageType==='edit'){
					console.log("编辑大学信息")
					this.$api.updateUserColleges(params).then(res => {
						this.loadModal = false
						uni.showToast({title: '保存成功',icon:"success"});
					    setTimeout(function(){
							uni.navigateTo({url: '/pages/user/college'});
					    },500) 
					}).catch(err => {
						this.loadModal = false
					})
				} else {
					console.log("新增大学信息")
					this.$api.saveUserColleges(params).then(res => {
						this.loadModal = false
						uni.showToast({title: '新增成功',icon:"success"});
					    setTimeout(function(){
							uni.navigateTo({url: '/pages/user/college'});
					    },500) 
					}).catch(err => {
						this.loadModal = false
					})
				}
				
				// //this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
				// this.$api.prePage().refreshList(data, this.manageType);
				
				// this.$api.msg(`地址${this.manageType=='edit' ? '修改': '添加'}成功`);
				// setTimeout(()=>{
				// 	uni.navigateBack()
				// }, 800)
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
	page{
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 160upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
