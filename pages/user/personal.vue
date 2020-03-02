<template>
	<view class="personal-page">
		<form>			
			<view class="cu-form-group padding-top-lg" style="padding-top: 70upx;">
				<view class="title">昵称</view>
				<input v-model="nick_name" placeholder="请输入昵称" name="input" maxlength="50"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">性别</view>
				<radio-group class="biaoti" name="radio" v-model="sex" style="flex: 1;">
				    <label>
				        <radio value="男" checked="true" color="#ffa800" style="transform:scale(0.7)"/>男
				    </label>
				    <label>
				        <radio value="女" color="#ffa800" style="transform:scale(0.7)"/>女
				    </label>
				</radio-group>
				<!-- <switch class='switch-sex' @change="changeSex" :class="sex?'checked':''" :checked="sex?true:false"></switch> -->
			</view>
			<!-- <view class="cu-form-group">
				<view class="title">学校名称</view>
				<input @click="getColleges" v-model="college" placeholder="请输入大学名称" name="input" maxlength="100"></input>
			</view> -->
			<view class="cu-form-group">
				<view class="title">大学名称</view>
				<picker @change="colegeChange" :value="colegeIndex" :range="collegeList" range-key="college_name">
					<view class="picker">
						{{colegeIndex>-1?collegeList[colegeIndex].college_name:'请选择'}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">入学时间</view>
				<!-- <picker mode="date" :value="start_time" start="1900-01-01" end="2020-09-01" @change="startDateChange">
					<view class="picker">
						{{ start_time || '请选择'}}
					</view>
				</picker> -->
				<picker @change="startDateChange" :value="startIndex" :range="startDateList">
					<view class="picker">
						{{startIndex>-1?startDateList[startIndex]:'请选择'}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">毕业时间</view>
				<!-- <picker mode="date" :value="end_time" start="1900-01-01" end="2025-09-01" @change="endDateChange">
					<view class="picker">
						{{ end_time || '请选择'}}
					</view>
				</picker> -->
				<picker @change="endDateChange" :value="endIndex" :range="endDateList">
					<view class="picker">
						{{endIndex>-1?endDateList[endIndex]:'请选择'}}
					</view>
				</picker>
			</view>
		</form>
		
		<view class="footer">
			<button style="width: 80%;" 
			 @click="saveUserInfo"
			 class="footer"
			 type="primary">完成</button>
		</view>
	</view>
</template>
<script>
	var util = require('@/common/util.js');
	import inputAutocomplete from '@/components/input-autocomplete/input-autocomplete.vue';
	export default {
		components: {
			inputAutocomplete
		},
		data() {
			return {
				code: '',
				date: '',
				endDate: '',
				selected: [{name: '入学时间'}],
				nick_name: '',
				sex: 1,
				colegeIndex: -1,
				collegeList: [],
				start_time: '',
				end_time: '',
				test: 'test',
				sexList: [{
						value: '1',
						name: '男'
					},
					{
						value: '2',
						name: '女',
						checked: 'true'
					}],
				startIndex: -1,
				startDateList: ['2000-09-01','2001-09-01','2002-09-01','2003-09-01',
				'2004-09-01','2005-09-01','2006-09-01','2007-09-01','2008-09-01',
				'2009-09-01','2010-09-01','2011-09-01','2012-09-01','2013-09-01',
				'2014-09-01','2015-09-01','2016-09-01','2017-09-01','2018-09-01',
				'2019-09-01','2020-09-01','2021-09-01','2022-09-01','2023-09-01'],
				endIndex: -1,
				endDateList: ['2000-06-01','2001-06-01','2002-06-01','2003-06-01',
				'2004-06-01','2005-06-01','2006-06-01','2007-06-01','2008-06-01',
				'2009-06-01','2010-06-01','2011-06-01','2012-06-01','2013-06-01',
				'2014-06-01','2015-06-01','2016-06-01','2017-06-01','2018-06-01',
				'2019-06-01','2020-06-01','2021-06-01','2022-06-01','2023-06-01',
				'2024-06-01','2025-06-01'],
			}
		},
		onLoad() {
			this.getColleges()
			this.isEdit = false
		},
		methods: {
			open() {
				this.$refs.calendar.open()
			},
			open2 () {
				this.$refs.calendar2.open()
			},
			change(e) {
				this.start_time = e.fulldate
			},
			confirm(e) {
				this.start_time = e.fulldate
			},
			change2(e) {
				this.end_time = e.fulldate
			},
			confirm2(e) {
				this.end_time = e.fulldate
			},
			colegeChange(e) {
				this.colegeIndex = e.detail.value
			},
			startDateChange(e) {
				this.startIndex = e.detail.value
				this.start_time = this.startDateList[this.startIndex]
				
			},
			
			endDateChange(e) {
				this.endIndex = e.detail.value
				this.end_time = this.endDateList[this.endIndex]
			},
			changeSex(e) {
				this.sex = e.detail.value
			},
			radioChange(evt) {
				for (let i = 0; i < this.sexList.length; i++) {
					if (this.sexList[i].value === evt.target.value) {
						this.sex = i;
						break;
					}
				}
			},
			
			getColleges(){
				this.$api.getColleges()
				.then(res => {
					this.collegeList = res.data;
				})
			},
			
			saveUserInfo() {
				if (!this.nick_name) {
					uni.showToast({
					    icon: 'none',
					    title: '请填写昵称'
					});
					return;
				}
				
				if (!this.sex) {
					uni.showToast({
					    icon: 'none',
					    title: '请选择性别'
					});
					return;
				}
				
				if (this.colegeIndex < 1) {
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
				
				let endTime = ''
				if (this.end_time) {
					endTime = util.format(this.end_time)
				}
				
				this.$api.updateUserInfo({
					nick_name:this.nick_name,
					sex:this.sex,
					college_id:this.collegeList[this.colegeIndex].id,
					start_time: util.format(this.start_time),
					end_time: endTime
				}).then(res => {
					uni.showToast({
					    icon: 'none',
					    title: '保存成功'
					});
					this.$store.dispatch('getuserinfo')
				   setTimeout(function(){
				   	uni.switchTab({
				   	    url: '/pages/home/home'
				   	});
				   },500) 
				   
				}).catch(err => {
				})
			}
		}
	}
</script>

<style>
	.list {
		display: flex;
		flex-direction: column;
		padding-top: 50upx;
		padding-left: 70upx;
		padding-right: 70upx;
	}
	.list-call{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 100upx;
		color: #333333;
		border-bottom: 1upx solid rgba(230,230,230,1);
		text-align: left;
	}
	.list-call .label{
		width: 40upx;
		height: 40upx;
	}
	.list-call .biaoti{
		flex: 1;
		text-align: left;
		font-size: 32upx;
		line-height: 100upx;
		margin-left: 16upx;
	}
	.personal-page .footer{
		margin: 200upx auto 10upx;
		width: 92%;
	}

</style>
