<template>
	<view class="prelease">
		<cu-custom bgColor="uni-custom-header-color" :isBack="true">
			<block slot="backText" @tap="BackPage">返回</block>
			<block slot="content">预租房发布</block>
		</cu-custom>
		<view class="content">
				<view class="padding-top-sm" style="text-align: center;">预发布合租</view>
				<!-- 租房信息 -->
				<view class="title padding-left-lg padding-top-xl" style="padding-top: 30upx;">租房信息</view>
				<view class="roominfo">
					<form>
						<view class="cu-form-group">
							<view class="title">标题</view>
							<input placeholder="输入一个响亮的标题" v-model="form.title" name="input"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">所在地区</view>
							<view @tap="chooseCity" style="flex: 1;">
								{{region.label}}
							</view>
						</view>
						<view class="cu-form-group">
							<view class="title">预租房间数<text style="padding-left: 20upx;font-size: 28upx;color:rgb(124,125,121);">(默认一人一间房)</text></view>
							<picker @change="PickerChange" :value="index" :range="picker" range-key="label">
								<view class="picker">
									{{index>-1?picker[index].label:'请选择'}}
								</view>
							</picker>
						</view>
						<view class="cu-form-group align-start" style="border-bottom: 1rpx solid #eee;">
							<view class="title">个人描述</view>
							<textarea maxlength="200" :disabled="modalName!=null" @input="textareaBInput" placeholder="请输入描述"></textarea>
						</view>
					</form>
					<view class="padding-xl footer" @tap="formSubmitPre">
						<button class="cu-btn block bg-blue margin-tb-sm lg"> 发布</button>
					</view>
				</view>
			</view>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :isShowEmpty='isShowEmpty' :pickerValueDefault="cityPickerValue" @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
		<view class="cu-load load-modal" v-if="loadModal">
			<view class="cuIcon-emojifill text-orange"></view>
			<!-- <image src="/static/logo3.jpg" mode="aspectFit"></image> -->
			<view class="gray-text">保存中...</view>
		</view>
	</view>
</template>

<script>
	import {
	       mapState,  
	       mapMutations  
	   } from 'vuex'; 
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	export default {
		data() {
			return {
				loadModal: false,
				isShowEmpty: true,  // 是否展示不限
				form: {
					title: '',
					cotenant_type: 1,  // 1.预租房 2.合租房
					cotenant_description: ''
				},
				index: -1,
				picker: [
					{label: '请选择', value: ''},
					{label: '2户合租', value: 2},
					{label: '3户合租', value: 3},
					{label: '4户合租', value: 4},
					{label: '5户合租', value: 5}
				],
				modalName: null,
				region:{label:"请点击选择地址",value:[],cityCode:""},
				themeColor: '#007AFF',
				cityPickerValue: [1, 1, 0],
				cityPickerLabel: []
			}
		},
		components: {
			mpvueCityPicker
		},
		onLaunch: function() {
			uni.getSystemInfo({
			        success: function(e) {
			            // #ifndef MP
			            Vue.prototype.StatusBar = e.statusBarHeight;
			            if (e.platform == 'android') {
			                Vue.prototype.CustomBar = e.statusBarHeight + 50;
			            } else {
			                Vue.prototype.CustomBar = e.statusBarHeight + 45;
			            };
			            // #endif
			            // #ifdef MP-WEIXIN
			            Vue.prototype.StatusBar = e.statusBarHeight;
			            let custom = wx.getMenuButtonBoundingClientRect();
			            Vue.prototype.Custom = custom;
			            Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
			            // #endif       
			            // #ifdef MP-ALIPAY
			            Vue.prototype.StatusBar = e.statusBarHeight;
			            Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
			            // #endif
			        }
			    })
		},
		computed: {
		     ...mapState(['userInfo'])  
		},
		methods: {
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			PickerChange(e) {
				this.index = e.detail.value
			},
			textareaBInput(e) {
				this.form.cotenant_description = e.detail.value
			},
			onCancel(e) {
				console.log(e)
			},
			chooseCity() {
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				this.region = e;
				let arr = e.label.split('-')
				this.cityPickerValue = e.value;
				this.cityPickerLabel = arr
			},
			formSubmitPre: function(e) {
				if (!this.form.title) {
					uni.showToast({title: '标题不能为空', icon: 'none'});
					return false
				}
				if (this.region.label == '请点击选择地址') {
					uni.showToast({title: '请选择地址', icon: 'none'});
					return false
				}
				if (this.index < 1) {
					uni.showToast({title: '请选择房间数', icon: 'none'});
					return false
				}
				if (!this.form.cotenant_description) {
					uni.showToast({title: '个人描述不能为空', icon: 'none'});
					return false
				}
				this.loadModal = true
				let params = {
					title: this.form.title,
					province: this.cityPickerLabel[0],
					city: this.cityPickerLabel[1],
					district: this.cityPickerLabel[2],
					cotenant_type: this.form.cotenant_type,
					cotenant_count: this.picker[this.index].value,
					cotenant_description: this.form.cotenant_description
				}
				this.$api.publishRoom(params).then(res => {
					this.loadModal = false
					uni.showToast({title: '发布成功',icon:"success"});
					setTimeout(() => {
						uni.switchTab({
						    url: '/pages/rent/rent',
						    success: function(e) {
						        uni.setStorage({
						            key: 'hometype',
						            data: '2'
						        });
						    }
						});
					}, 500)
				}).catch(err => {
					this.loadModal = false
				})
			}
		}
	}
</script>

<style lang="scss">
	.prelease{
		.cu-form-group .title {
			min-width: calc(4em + 15px);
		}
		.footer{
			position: fixed;
			bottom: 0;
			width: 100%;
		}
		.cu-form-group{
			position: relative;
			// border-top: none;
			// border-bottom: 1rpx solid #eee;
			// margin-bottom: 38rpx;
			padding-top: 38rpx;
			.error-tip{
				position: absolute;
				left: 34rpx;
				bottom: -44rpx;
				color: $uni-color-error;
				z-index: 1;
				font-size: 24rpx;
			}
		}
	}
</style>
