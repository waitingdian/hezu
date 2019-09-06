<template>
	<view class="prelease">
		<view class="content">
				<view class="p-t-16" style="text-align: center;">预租房(组团)</view>
				<!-- 个人信息 -->
				<view class="title">个人信息</view>
				<view class="useringo">
					<view><text class="label">姓名:</text>	{{ userInfo.name }}</view>
					<view><text class="label">学校:</text>	{{ userInfo.school }}</view>
					<view><text class="label">性别:</text>	{{ userInfo.sex }}</view>
				</view>
				<!-- 租房信息 -->
				<view class="title" style="padding-top: 30upx;">租房信息</view>
				<view class="roominfo">
					<form @reset="formReset">
					    <view class="uni-form-item">
					        <text class="label">标题</text>
					        <input class="uni-input" v-model="roomInfo.name" name="input" placeholder="输入一个响亮的标题" />
					    </view>
<!-- 					    <view class="uni-form-item">
					        <text class="label">省</text>
					        <view class="uni-list">
					            <view class="uni-list-cell">
					                <view class="uni-list-cell-db">
					                    <picker @change="bindPickerChange1" :value="index1" :range="array1">
					                        <view class="uni-input">{{array1[index1]}}</view>
					                    </picker>
					                </view>
					            </view>
					        </view>
							<text class="label" style="padding-left: 42upx;">市</text>
							<view class="uni-list">
							    <view class="uni-list-cell">
							        <view class="uni-list-cell-db">
							            <picker @change="bindPickerChange2" :value="index2" :range="array2">
							                <view class="uni-input">{{array2[index2]}}</view>
							            </picker>
							        </view>
							    </view>
							</view>
							<text class="label" style="padding-left: 42upx;">区</text>
							<view class="uni-list">
							    <view class="uni-list-cell">
							        <view class="uni-list-cell-db">
							            <picker @change="bindPickerChange3" :value="index3" :range="array3">
							                <view class="uni-input">{{array3[index3]}}</view>
							            </picker>
							        </view>
							    </view>
							</view>
					    </view> -->
						<view class="uni-form-item">
						    <text class="label">合租户型</text>
							<input class="uni-input"
							 v-model="roomInfo.roomCount"
							 name="input"
							 placeholder="请输入房间数" />
						</view>
						<!-- class="uni-form-item" -->
						<view>
							<view style="display: inline-block;">
								<text class="label">房间描述</text>
							</view>
							<view style="display: inline-block;height: 200upx;padding: 16upx;">
								<textarea @blur="bindTextAreaBlur" placeholder="请输入房间描述" auto-height />
							</view>
						</view>
						<view class="uni-form-item">
						    <text class="label">房间图片</text>
							<button style="margin-left: 0;" 
							size="mini" @click="upload">上传文件</button>
						</view>
						<view class="uni-form-item p-t-16">
						    <text class="label">房间视频</text>
							<button style="margin-left: 0;"
							size="mini" @tap="uploadImg">上传文件</button>
						</view>
						<view class="uni-btn-v" style="margin-top: 46upx;">
							<button type="primary" formType="submit" @tap="formSubmitRent">发布</button>
					        <!-- <button formType="submit">Submit</button> -->
					        <!-- <button type="default" formType="reset">Reset</button> -->
					    </view>
					</form>
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
			uploadImg () {
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function (res) {
						console.log(JSON.stringify(res.tempFilePaths));
					}
				});	
			},
			upload (){
			   _self = this;
			   uni.chooseImage({
			    count: 1,
			    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			    sourceType: ['album'], //从相册选择
			    success: function (res) {
			     const tempFilePaths = res.tempFilePaths;
			     const uploadTask = uni.uploadFile({
			      url : 'https://demo.hcoder.net/index.php?c=uperTest',
			      filePath: tempFilePaths[0],
			      name: 'file',
			      formData: {
			       'user': 'test'
			      },
			      success: function (uploadFileRes) {
			       console.log(uploadFileRes.data);
			      }
			     });
			 
			     uploadTask.onProgressUpdate(function (res) {
			      _self.percent = res.progress;
			      console.log('上传进度' + res.progress);
			      console.log('已经上传的数据长度' + res.totalBytesSent);
			      console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
			     });
			    },
			    error : function(e){
			     console.log(e);
			    }
			   });
			  },
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
			formSubmitRent: function(e) {
				this.$store.commit('addProductList', this.roomInfo)
				uni.showToast({title: '发布成功',icon:"success"});
				setTimeout(() => {
					uni.navigateBack()
				}, 200)
				// console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
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
	.prelease{
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
				padding-right: 20upx;
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
				// color: $uni-text-color-grey;
				padding-right: 28upx;
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
