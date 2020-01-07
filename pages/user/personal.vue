<template>
	<view class="personal-page">
		<form>			
			<view class="cu-form-group padding-top-lg" style="padding-top: 70upx;">
				<view class="title">姓名</view>
				<input v-model="user_name" placeholder="请输入真实姓名" name="input" maxlength="50"></input>
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
			<view class="cu-form-group">
				<view class="title">学校名称</view>
				<input v-model="college" placeholder="请输入大学名称" name="input" maxlength="100"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">入学时间</view>
				<picker mode="date" :value="start_time" start="1900-01-01" end="2020-09-01" @change="startDateChange">
					<view class="picker">
						{{ start_time || '请选择'}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">毕业时间</view>
				<picker mode="date" :value="end_time" start="1900-01-01" end="2025-09-01" @change="endDateChange">
					<view class="picker">
						{{ end_time || '请选择'}}
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
	export default {
		data() {
			return {
				code: '',
				date: '',
				endDate: '',
				selected: [{name: '入学时间'}],
				user_name: '',
				sex: 1,
				college: '',
				start_time: '2016-08',
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
					}]
			}
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
			startDateChange(e) {
				this.start_time = e.detail.value
			},
			
			endDateChange(e) {
				this.end_time = e.detail.value
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
			saveUserInfo() {
				if (!this.user_name) {
					uni.showToast({
					    icon: 'none',
					    title: '请填写姓名'
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
				
				if (!this.college) {
					uni.showToast({
					    icon: 'none',
					    title: '请填写学校名称'
					});
					return;
				}
				
				if (!this.start_time) {
					uni.showToast({
					    icon: 'none',
					    title: '请选择入学时间'
					});
					return;
				}
				
				let endTime = ''
				if (this.end_time) {
					endTime = util.format(this.end_time)
				}
				
				this.$api.updateUserInfo({
					user_name:this.user_name,
					sex:this.sex,
					college:this.college,
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
