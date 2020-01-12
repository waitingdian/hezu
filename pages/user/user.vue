<template>
	<view class="user-page">
		<!-- 头部 -->
		<cu-custom bgColor="uni-custom-header-color" :isBack="true">
			<block slot="content">我的信息</block>
		</cu-custom>
		<!-- 头像 -->
		<view class="user-info">
			<image class="avator" @tap="chooseImage2" :src="userForm.user_head ? `${userForm.user_head}?imageView2/1/w/200/h/200` : `${defaultAvator}?imageView2/1/w/200/h/200`"></image>
			<!-- <image class="avator" @tap="chooseImage2" :src=`${}`></image> -->
		
			<view class="name-wraper" v-show="isEdit">
				<text>{{ userInfo.name }}</text>
				<text @click="editUser" style="font-size: 36rpx;padding-left: 38rpx;cursor: pointer;" class="lg text-gray cuIcon-edit">
					<text style="font-size: 24rpx;" class="padding-left-xs">修改</text>
				</text>
				<!-- <button class="mini-btn edit-btn" type="text" size="mini">编辑</button> -->
			</view>
		</view>
		<form>
					
			<view class="cu-form-group margin-top">
				<view class="title">姓名</view>
				<input v-if="isEdit" v-model="userForm.name" placeholder="请输入姓名(不对外公开)" name="input" maxlength="50"></input>
				<view v-else>{{ userForm.name }}</view>
			</view>
			<view class="cu-form-group">
				<view class="title">昵称</view>
				<input v-if="isEdit" v-model="userForm.nick_name" placeholder="请输入姓名" name="input" maxlength="50"></input>
				<view v-else>{{ userForm.nick_name }}</view>
			</view>
	<!-- 		<view class="cu-form-group">
				<view class="title">手机号</view>
				<input v-if="isEdit" v-model="userForm.phone" maxlength="11" placeholder="请输入手机号" name="input"></input>
				<view v-else> {{ userForm.phone }} </view>
			</view> -->
			<view v-if="isEdit" class="cu-form-group sex-group" style="justify-content: flex-start;">
				<view class="title">性别</view>
				<radio-group @change="changeSex" class="biaoti" name="radio" v-model="userForm.sex" style="flex: 1;">
				    <label>
				        <radio value="1" checked="true" color="#ffa800" style="transform:scale(0.7)"/>男
				    </label>
				    <label>
				        <radio value="2" color="#ffa800" style="transform:scale(0.7)"/>女
				    </label>
				</radio-group>
				<!-- <switch class='switch-sex' @change="changeSex" :class="userForm.sex?'checked':''" :checked="userForm.sex?true:false"></switch> -->
			</view>
			<view v-else class="cu-form-group sex-group">
				<view class="title">性别</view>
				<view> {{ userForm.sex == 1 ? '男' : '女' }} </view>
			</view>
			<view class="cu-form-group">
				<view class="title">学校</view>
				<input v-if="isEdit" v-model="userForm.college" placeholder="请输入大学名称" name="input" maxlength="100"></input>
				<view v-else>{{ userForm.college }}</view>
			</view>
			<view class="cu-form-group">
				<view class="title">入学时间</view>
				<picker v-if="isEdit" fields="year" mode="date" :value="userForm.start_time" start="1900-01-01" end="2020-09-01" @change="startDateChange">
					<view class="picker">
						{{ userForm.start_time || '请选择'}}
					</view>
				</picker>
				<view v-else> {{ userForm.start_time }} </view>
			</view>
			<view class="cu-form-group">
				<view class="title">毕业时间</view>
				<picker v-if="isEdit" fields="year" mode="date" :value="userForm.end_time" start="1903-09-01" end="2025-09-01" @change="endDateChange">
					<view class="picker">
						{{ userForm.end_time || '请选择'}}
					</view>
				</picker>
				<view v-else> {{ userForm.end_time}} </view>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">兴趣爱好</view>
				<input v-if="isEdit" v-model="userForm.hobby" placeholder="输入爱好找到志同道合的人" name="input" maxlength="200"></input>
				<view v-else>{{ userForm.hobby }}</view>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">最高学历</view>
				<picker v-if="isEdit" @change="pickerChange" :value="index" :range="xueliList">
					<view class="picker">
						{{index>-1?xueliList[index]:'请选择'}}
					</view>
				</picker>
				<view v-else>{{ userForm.degree }}</view>
				<!-- <input v-if="isEdit" v-model="userForm.degree" placeholder="请输入最高学历" name="input"></input> -->
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">证件类型</view>
				<view v-if="!isEdit">
					{{ certificates == 1 ? '学生证' : '毕业证' }}
				</view>
				<view v-else>
					<view style="display: inline-block;"  @tap="certificates = 1">
						<view class="radio-btn" :class="{'active': certificates == 1}">
							<text class="lg text-gray cuIcon-check"></text>
						</view>
						<text>学生证</text>
					</view>
					<view style="display: inline-block;"  @tap="certificates = 2">
						<view class="radio-btn margin-left-sm" :class="{'active': certificates == 2}">
							<text class="lg text-gray cuIcon-check"></text>
						</view>
						<text>毕业证</text>
					</view>
				</view>
			</view>
		
			
			<!-- 学生证照片 -->
			<view v-show="certificates==1">
				<view class="cu-bar bg-white margin-top">
					<view class="action">
						学生证照片
						<view class="padding-left-sm" style="color:#007AFF;" @tap="showExample">上传示例</view>
					</view>
					<view class="action">
						{{imgList.length}}/1
					</view>
				</view>
				<view class="bg-white padding-bottom-sm"><text style="font-size: 24upx;padding-left: 20upx;color: rgb(198,198,198)">(校友合租不会泄露您的个人信息)</text></view>
				<view v-if="!isEdit" class="bg-white padding-bottom-sm">
					<view class="cu-avatar xl radius margin-left"
					 @tap="ViewImage"
					 v-for="(item,index) in imgList"
					 :key="index"
					 :style="{'background-image':`url(${item})`}">
					</view>
				</view>
				<view v-else class="cu-form-group">
					<view class="grid col-4 grid-square flex-sub">
						<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
						 <image :src="`${imgList[index]}?imageView2/1/w/300/h/300`" mode="aspectFill"></image>
							<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
								<text class='cuIcon-close'></text>
							</view>
						</view>
						<view class="solids" @tap="chooseImage" v-if="imgList.length<1">
							<text class='cuIcon-cameraadd'></text>
						</view>
					</view>
				</view>
			</view>

			<!-- 毕业证照片 -->
			<view v-show="certificates==2">
				<!-- 毕业证照片 -->
				<view class="cu-bar bg-white margin-top">
					<view class="action">
						毕业证照片
						<text style="font-size: 18upx;padding-left: 20upx;color: rgb(198,198,198)">(校友合租不会泄露您的个人信息)</text>
					</view>
					<view class="action">
						{{imgList1.length}}/1
					</view>
				</view>
				<view v-if="!isEdit" class="bg-white padding-bottom-sm">
					<view class="cu-avatar xl radius margin-left"
					 @tap="ViewImage1"
					 v-for="(item,index) in imgList1"
					 :key="index"
					 :style="{'background-image':`url(${item})`}">
					</view>
				</view>
				<view v-else class="cu-form-group">
					<view class="grid col-4 grid-square flex-sub">
						<view class="bg-img" v-for="(item,index) in imgList1" :key="index" @tap="ViewImage1" :data-url="imgList1[index]">
						 <image :src="`${imgList1[index]}?imageView2/1/w/300/h/300`" mode="aspectFill"></image>
							<view class="cu-tag bg-red" @tap.stop="DelImg1" :data-index="index">
								<text class='cuIcon-close'></text>
							</view>
						</view>
						<view class="solids" @tap="chooseImage1" v-if="imgList1.length<1">
							<text class='cuIcon-cameraadd'></text>
						</view>
					</view>
				</view>
			</view>
		
		
		</form>	
		
		<!-- 底部按钮 -->
		<view style="width: 92%;margin:0 auto;">
			<button v-if="isEdit" @tap="saveUserInfo" style="margin-top: 38upx;" type="primary">保 存</button>
			<button v-if="isEdit" @tap="cancelSave" style="margin-top: 28upx;">取 消</button>
			<button v-if="!isEdit" @tap="loginOut" style="margin-top: 28upx;">退出登录</button>
		</view>
	</view>
</template>

<script>
	// 可以删除
	var util = require('@/common/util.js');
	const qiniuUploader = require("@/common/SDK/qiniuUploader.js");
	export default {
		data() {
			return {
				userForm: {
					name: '',
					user_head: '',
					avator: '',
					phone: '',
					sex: 1,
					school: 1,
					start_time: '2016-08',
					end_time: '',
					hobby: "",
					education: '',
					studentPhoto: '',
					graduationPhoto: ''
				},
				defaultAvator: 'https://hudongmsite.oss-cn-hangzhou.aliyuncs.com/meeting/basicYrC5Sh1570383607306.png',
				userInfo: {},
				isEdit: false,
				imgList: [],
				imgList1: [],
				imgList2: [],
				index: -1,
				xueliList: ['专科', '本科', '硕士', '博士'],
				certificates: 1
			}
		},
		onLoad() {
			this.getUserInfo()
			this.isEdit = false
		},
		onShow() {
			if (!this.isEdit) {
				this.getUserInfo()
			}
		},
		methods: {
			showExample() {
				uni.previewImage({
					urls: ['http://qiniutest001.fensibox.com/cotenant_20191219_190935_26742'],
					current: 'http://qiniutest001.fensibox.com/cotenant_20191219_190935_26742'
				});
			},
			
			pickerChange (e) {
				this.index = e.detail.value
				this.userForm.degree = this.xueliList[this.index]
			},
			
			loginOut() {
				uni.showModal({
					title: '提示',
					content: '确定退出吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
						  uni.showToast({
						      icon: 'none',
						      title: '退出成功'
						  });
						  uni.removeStorage({
						      key: 'Authentication',
						      success: function (res) {
						      }
						  });
						  setTimeout(function(){
							uni.reLaunch({
						  		url: '/pages/login'
						  	})
						  },300) 
						}
					}
				})
				
			},
			changeSex(e) {
				this.userForm.sex = e.detail.value
			},
			
			startDateChange(e) {
				this.userForm.start_time = e.detail.value
			},
			
			endDateChange(e) {
				this.userForm.end_time = e.detail.value
			},
			
			chooseImage: function() {
				console.log('chooseImagechooseImage')
				uni.chooseImage({
					count: 1,
					sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'],
					success: (res) => {
						console.log('successsuccesssuccess')
						var filePath = res.tempFilePaths[0];
						this.$api.getQnToken().then(res => {
							qiniuUploader.upload(filePath, resp => {
								console.log(666)
								console.log(resp.imageURL)
								this.imgList.push(`http://${resp.imageURL}`)
								console.log(9999)
								console.log(this.imgList[0])
							}, error => {
							}, {
								region: 'SCN',
								domain: 'qiniutest001.fensibox.com',
								key: res.data.key,
								uptoken: res.data.uptoken,
							});
						}).catch(err => {})
					},
					fail: (err) => {
						console.log('chooseImage fail', err)
					}
				})
			},
			
			chooseImage1: function() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'],
					success: (res) => {
						var filePath = res.tempFilePaths[0];
						console.log('filePath', filePath)
						this.$api.getQnToken().then(res => {
							qiniuUploader.upload(filePath, resp => {
								this.imgList1.push(`http://${resp.imageURL}`)
							}, error => {
							}, {
								region: 'SCN',
								domain: 'qiniutest001.fensibox.com',
								key: res.data.key,
								uptoken: res.data.uptoken,
							});
						}).catch(err => {})
					},
					fail: (err) => {
						console.log('chooseImage fail', err)
					}
				})
			},
			
			chooseImage2: function() {
				if (!this.isEdit) {
					return false
				}
				uni.chooseImage({
					count: 1,
					sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'],
					success: (res) => {
						var filePath = res.tempFilePaths[0];
						this.$api.getQnToken().then(res => {
							qiniuUploader.upload(filePath, resp => {
								this.userForm.user_head =`http://${resp.imageURL}`
							}, error => {
							}, {
								region: 'SCN',
								domain: 'qiniutest001.fensibox.com',
								key: res.data.key,
								uptoken: res.data.uptoken,
							});
						}).catch(err => {})
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
			
			ViewImage1(e) {
				uni.previewImage({
					urls: this.imgList1,
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
			
			DelImg1(e) {
				uni.showModal({
					title: '提示',
					content: '确定要删除吗？',
					cancelText: '再看看',
					confirmText: '删除',
					success: res => {
						if (res.confirm) {
							this.imgList1.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			
			DelImg2(e) {
				uni.showModal({
					title: '提示',
					content: '确定要删除吗？',
					cancelText: '再看看',
					confirmText: '删除',
					success: res => {
						if (res.confirm) {
							this.imgList2.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			
			cancelSave(){
				this.isEdit = false
				this.getUserInfo()
			},
			
			saveUserInfo() {
				this.saveUserInfoAjax()
			},
			
			saveUserInfoAjax() {
				if (!this.userForm.nick_name) {
					uni.showToast({
					    icon: 'none',
					    title: '昵称不能为空'
					});
					return;
				}
				if (!this.userForm.name) {
					uni.showToast({
					    icon: 'none',
					    title: '姓名不能为空'
					});
					return;
				}
				if (!this.userForm.college) {
					uni.showToast({
					    icon: 'none',
					    title: '学校不能为空'
					});
					return;
				}
				
				let end_time = ''
				if (this.userForm.end_time) {
					end_time = util.format(this.userForm.end_time)
				}
				let params = {
					nick_name: this.userForm.nick_name,  // 昵称	string	无	N
					user_name: this.userForm.name,  // 真实姓名	string	无	Y
					user_head: this.userForm.user_head,
					sex: this.userForm.sex,  // 性别	Integer	1：男 2:女	Y
					college: this.userForm.college,  // 大学	string	无	Y
					degree: this.xueliList[this.index],  // 最高学历	string	无	N
					start_time: util.format(this.userForm.start_time),  //	入学时间	string	yyyy-MM-dd hh:mm:ss	Y
					end_time: end_time,  // 毕业时间	string	yyyy-MM-dd hh:mm:ss	N
					id_card_url: this.imgList[0] || '',  // 学生证	string	上传地址	N
					diploma_url: this.imgList1[0] || '',  // 毕业证	string	上传地址	N
					interest: this.userForm.hobby,  // 兴趣爱好	string	无	N
					mobile: ''
				}
				this.$api.updateUserInfo(params).then(res => {
					uni.showToast({
					    icon: 'none',
					    title: '保存成功'
					});
					this.isEdit = false
				}).catch(err => {
				})
			},
		
			editUser() {
				// let hobby = []
				// let tempObj = JSON.parse(JSON.stringify(this.userInfo))
				if (this.userForm.degree) {
					this.xueliList.forEach((item,index) => {
						if (item == this.userForm.degree) {
							this.index = index
						}
					})
				} else {
					this.index = -1
				}
				this.isEdit = true
			},
			
			getUserInfo () {
				this.$api.getUserInfo().then(res => {
	
					this.userForm.nick_name = res.data.nick_name;  // 昵称	string	无	N
					this.userForm.name = res.data.user_name;  // 真实姓名	string	无	Y	
					this.userForm.user_head	= res.data.user_head,
					this.userForm.sex = res.data.sex;  // 性别	Integer	1：男 2:女	Y					
					this.userForm.college = res.data.college;  // 大学	string	无	Y					
					this.userForm.degree = res.data.degree;  // 最高学历	string	无	N					
					this.userForm.start_time = res.data.start_time;  //	入学时间	string	yyyy-MM-dd hh:mm:ss	Y					
					this.userForm.start_time = util.toStringDate(res.data.start_time);  //	入学时间	string	yyyy-MM-dd hh:mm:ss	Y					
					this.userForm.end_time = util.toStringDate(res.data.end_time);  // 毕业时间	string	yyyy-MM-dd hh:mm:ss	N					
					this.imgList = res.data.id_card_url && res.data.id_card_url.split() || [];  // 学生证	string	上传地址	N
					this.imgList1 = res.data.diploma_url && res.data.diploma_url.split() || []; // 毕业证	string	上传地址	N
					this.userForm.hobby = res.data.interest;  // 兴趣爱好	string
					if (res.data.id_card_url) {
						this.certificates = 1
					} else if (res.data.diploma_url) {
						this.certificates = 2
					}
				}).catch(err => {
					this.userForm = {
						name: '',
						user_head: '',
						avator: '',
						phone: '',
						sex: 1,
						school: 1,
						start_time: '2016-08',
						end_time: '',
						hobby: "",
						education: '',
						studentPhoto: '',
						graduationPhoto: ''
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.user-page{
		padding-bottom: 50rpx;
		.radio-btn{
			display: inline-block;
			width: 50upx;
			height: 50upx;
			line-height: 50upx;
			text-align: center;
			border: 1px solid #007AFF;
			border-radius: 100%;
			vertical-align: middle;
			.cuIcon-check{
				color: transparent;
			}
			&.active{
				.cuIcon-check {
					color: #007AFF;
				}
			}
		}
		.user-info {
			width: 92%;
			display: flex;
			margin: 0 auto;
			.avator{
				margin: 18upx 0 20upx 18upx;
				width: 160upx;
				border-radius: 10000upx;
				height: 160upx;
			}
			.name-wraper{
				display: flex;
				// flex-direction: column;
				align-items: center;
				width: 58%;
				padding: 4% 10px;
				.edit-btn{
				}
			}
		}
		.personal {
			width: 92%;
			margin: 0 auto;
			view{
				padding-top: 8upx;
			}
			.tag{
				color: #ffa800;
				padding: 6upx 16upx;
				border: 1px solid #ffa800;
				border-radius: 8upx;
				margin: 0 12upx;
				font-size: $uni-font-size-base;
			}
			.uni-input{
				// font-size: 18.75px;;
				display: inline-block;
				vertical-align: middle;
				// width: 60%;
			}
			text{
				display: inline-block;
				vertical-align: middle;
				padding-right: 12upx;;
			}
		}
	}
</style>
