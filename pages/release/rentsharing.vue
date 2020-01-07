<template>
	<view class="prelease">
		<cu-custom bgColor="uni-custom-header-color" :isBack="true">
			<block slot="backText" @tap="BackPage">返回</block>
			<block slot="content">合租房发布</block>
		</cu-custom>
		<view class="content">
				<view class="padding-top-sm" style="text-align: center;">找室友</view>
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
							<view class="title">合租数<text style="padding-left: 20upx;font-size: 28upx;color:rgb(124,125,121);">(默认一人一间房)</text></view>
							<picker @change="PickerChange" :value="index" :range="picker" range-key="label">
								<view class="picker">
									{{index>-1?picker[index].label:'请选择'}}
								</view>
							</picker>
						</view>
						<view class="cu-form-group align-start">
							<view class="title">个人描述</view>
							<textarea maxlength="200" :disabled="modalName!=null" @input="textareaAInput" placeholder="请输入描述"></textarea>
						</view>
						<view class="cu-form-group align-start" style="border-bottom: 1rpx solid #eee;">
							<view class="title">房间描述</view>
							<textarea maxlength="200" :disabled="modalName!=null" @input="textareaBInput" placeholder="请补充小区名称，楼层，价位，厨房，卫生间，阳台等信息"></textarea>
						</view>
						<!-- 学生证照片 -->
						<view class="cu-bar bg-white margin-top">
							<view class="action">
								房间图片
								<text style="font-size: 18upx;padding-left: 20upx;color: rgb(198,198,198)"></text>
							</view>
							<view class="action">
								{{imgList.length}}/{{ limit }}
							</view>
						</view>
						<view class="cu-form-group">
							<view class="grid col-4 grid-square flex-sub">
								<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
								 <image :src="`${imgList[index]}?imageView2/1/w/300/h/300`" mode="aspectFill"></image>
									<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
										<text class='cuIcon-close'></text>
									</view>
								</view>
								<view class="solids" @tap="chooseImage" v-if="imgList.length<limit">
									<text class='cuIcon-cameraadd'></text>
								</view>
							</view>
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
	const qiniuUploader = require("@/components/qiniu-wxapp-sdk/sdk/qiniuUploader");
	export default {
		data() {
			return {
				loadModal: false,
				isShowEmpty: false,
				form: {
					title: '',
					cotenant_type: 2,  // 1.预租房 2.合租房
					cotenant_description: '',  // 个人描述
					chamber_description: ''	  // 租房描述
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
				cityPickerValue: [0, 0, 1],
				cityPickerLabel: [],
				imgList: [],
				limit: 9
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
			chooseImage: function() {
				uni.chooseImage({
					count: this.limit,
					sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'],
					success: (res) => {
						var filePaths = res.tempFilePaths;
						var uploadCount = 0
						if (this.imgList.length + filePaths.length > this.limit) {
						    uploadCount = this.limit - this.imgList.length
							filePaths = filePaths.slice(0,uploadCount)
							uni.showToast({title: `最多上传${this.limit}张照片`,icon:"success"});
						}
						filePaths.forEach((filePath) => {
							console.log('222222', filePath)
							this.$api.getQnToken().then(res => {
								qiniuUploader.upload(filePath, resp => {
									this.imgList.push(`http://${resp.imageURL}`)
								}, error => {
								}, {
									region: 'SCN',
									domain: 'qiniutest001.fensibox.com',
									key: res.data.key,
									uptoken: res.data.uptoken,
								});
							}).catch(err => {})
						})
					},
					fail: (err) => {
						console.log('chooseImage fail', err)
					}
				})
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '提示',
					content: '确定要删除吗？',
					cancelText: '再看看',
					confirmText: '删除',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			PickerChange(e) {
				this.index = e.detail.value
			},
			textareaAInput(e) {
				this.form.cotenant_description = e.detail.value
			},
			textareaBInput(e) {
				this.form.chamber_description = e.detail.value
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
				this.loadModal = true
				let params = {
					title: this.form.title,
					province: this.cityPickerLabel[0],
					city: this.cityPickerLabel[1],
					district: this.cityPickerLabel[2],
					cotenant_type: this.form.cotenant_type,
					cotenant_count: this.picker[this.index].value,
					cotenant_description: this.form.cotenant_description,
					chamber_description: this.form.chamber_description,
					chamber_img_url: this.imgList.join()
				}
				this.$api.publishRoom(params).then(res => {
					this.loadModal = false
					uni.showToast({title: '发布成功',icon:"success"});
				    setTimeout(function(){
						uni.switchTab({url: '/pages/rent/rent'});
				    },500) 
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
			// position: fixed;
			// bottom: 0;
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
