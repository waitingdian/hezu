<template>
	<view class="user-page">
		<!-- 头像 -->
		<view class="user-info">
			<image class="avator" mode="widthFix" :src="userInfo.avator"></image>
			<view class="name-wraper">
				<text>{{ userInfo.name }}</text>
				<button class="mini-btn edit-btn" type="text" size="mini">编辑</button>
			</view>
		</view>
		<!-- 轮播图 -->
		<view class="swiper">
			<view class="swiper-box">
				<swiper circular="true" autoplay="true" @change="swiperChange">
					<swiper-item v-for="swiper in swiperList" :key="swiper.id">
						<image :src="swiper.img" @tap="toSwiper(swiper)"></image>
					</swiper-item>
				</swiper>
				<view class="indicator">
					<view
						class="dots"
						v-for="(swiper, index) in swiperList"
						:class="[currentSwiper >= index ? 'on' : '']"
						:key="index"
					></view>
				</view>
			</view>
		</view>
		<!-- 个人中心 -->
		<view class="personal">
			<view style="color: #999;padding-top: 20upx;">个人信息</view>
			<view v-if="!isEdit" class="personal-wraper">
				<view>姓名: {{ userInfo.name }}</view>
				<view>手机号: {{ userInfo.phone }}</view>
				<view>性别: {{ userInfo.sex }}</view>
				<view>学校: {{ userInfo.school }}</view>
				<view>入学时间: {{ userInfo.joinTime }}</view>
				<view>毕业时间: {{ userInfo.graduationTime }}</view>
				<view>兴趣爱好:
					<text class="tag" v-for="(item,index) in userInfo.hobby" :key="index">
						{{ item }}
					</text>
				</view>
				<view>最高学历: {{ userInfo.education }}</view>
				<view>学生证照片: {{ userInfo.studentPhoto }}</view>
				<view>毕业证照片: {{ userInfo.graduationPhoto }}</view>
				<button @tap="editUser" style="margin-top: 38upx;" type="primary">编辑信息</button>
			</view>
			<view v-else class="personal-wraper">
				<view>
					<text>姓名:</text>
					<input class="uni-input" v-model="editUserInfo.name" maxlength="80" placeholder="请输入姓名" />
				</view>
				<view>
					<text>手机号:</text>
					<input class="uni-input" v-model="editUserInfo.phone" type="number" placeholder="请输入手机号" />
				</view>
				<view>
					<text>性别:</text>
					<label style="padding-right: 20upx;" class="radio"><radio @tap="editUserInfo.sex='男'" value="男" :checked="editUserInfo.sex=='男'" />男</label>
					<label class="radio"><radio @tap="editUserInfo.sex='女'" value="女" :checked="editUserInfo.sex=='女'"/>女</label>
				</view>
				<view>
					<text>学校: </text>
					<input class="uni-input" v-model="editUserInfo.school" maxlength="100" placeholder="请输入学校名称" /></view>
				<view>
					<text>入学时间: </text>
		<!-- 			  <uni-calendar 
						:date="editUserInfo.joinTime"
					    :insert="true"
					    :lunar="true" 
					    :disable-before="true" 
					    :start-date="'2019-3-2'"
					    :end-date="'2119-5-20'"
					    @change="change"
					     /> -->
				</view>
				<view>
					<text>毕业时间: </text>
		<!-- 			<uni-calendar
					  :date="editUserInfo.graduationTime"
					  :insert="true"
					  :lunar="true" 
					  :disable-before="true" 
					  :start-date="'2019-3-2'"
					  :end-date="'2119-5-20'"
					  @change="change"
					   /> -->
				</view>
				<view>
					<text>兴趣爱好: </text>
					<input class="uni-input" v-model="editUserInfo.hobby" maxlength="200" placeholder="请输入兴趣爱好,多个请用,隔开" />
				</view>
				<view>
					<text>最高学历:</text>
					<input class="uni-input" v-model="editUserInfo.education" maxlength="200" placeholder="请输入最高学历" />
				</view>
				<view>
					<text>学生证照片:</text>
					{{ editUserInfo.studentPhoto }}
				</view>
				<view>
					<text>毕业证照片:</text>
					 {{ editUserInfo.graduationPhoto }}
				</view>
				<button @tap="saveUserInfo" style="margin-top: 38upx;" type="primary">保 存</button>
				<button @tap="cancelSave" style="margin-top: 28upx;">取 消</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
	       mapState,  
	       mapMutations  
	   } from 'vuex'; 
	import {uniCalendar} from "@/components/uni-calendar/uni-calendar"
	export default {
		data() {
			return {
				title: 'Hello',
				editUserInfo: {
					name: '鲍鹏程',
					avator: 'http://cdn.duitang.com/uploads/item/201410/26/20141026191422_yEKyd.thumb.700_0.jpeg',
					phone: 17521272518,
					sex: '女',
					school: '清华大学',
					joinTime: '2016-08',
					graduationTime: '2019-06',
					hobby: ['唱歌', '跳舞', '敲代码'],
					education: '本科',
					studentPhoto: '',
					graduationPhoto: ''
				},
				currentSwiper: 0,
				// 轮播图片
				swiperList: [
					{ id: 1, src: 'url1', img: '/static/img/1.jpg' },
					{ id: 2, src: 'url2', img: '/static/img/2.jpg' },
					{ id: 3, src: 'url3', img: '/static/img/3.jpg' }
				],
				isEdit: false
			}
		},
		computed: {
		     ...mapState(['userInfo'])  
		},  
		 components: {
		        uniCalendar
		},
		onLoad() {

		},
		methods: {
			cancelSave(){
				this.$store.state.userInfo.hobby = this.userInfo.hobby.split(',')
				let tempObj = JSON.parse(JSON.stringify(this.userInfo))
				this.$store.state.userInfo = tempObj
				 this.isEdit = false
			},
			saveUserInfo() {
				this.editUserInfo.hobby = this.editUserInfo.hobby.split(',')
				let tempObj = JSON.parse(JSON.stringify(this.editUserInfo))
				this.$store.state.userInfo = this.editUserInfo
				this.isEdit = false
			},
			editUser() {
				this.$store.state.userInfo.hobby = this.userInfo.hobby.join(',')
				console.log(this.userInfo.hobby)
				let tempObj = JSON.parse(JSON.stringify(this.userInfo))
				this.editUserInfo = tempObj
				this.isEdit = true
			},
			//轮播图指示器
			swiperChange(event) {
				this.currentSwiper = event.detail.current;
			},
			//轮播图跳转
			toSwiper(e) {
				uni.showToast({ title: e.src, icon: 'none' });
			},
		}
	}
</script>

<style lang="scss">
	.user-page{
		.user-info {
			width: 92%;
			display: flex;
			margin: 0 auto;
			.avator{
				margin: 18upx 0 20upx 18upx;
				width: 25%;
				border-radius: 10000upx;
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
		// 轮播图
		.swiper {
			width: 100%;
			margin-top: 10upx;
			display: flex;
			justify-content: center;
			.swiper-box {
				width: 92%;
				height: 30.7vw;
		
				overflow: hidden;
				border-radius: 15upx;
				box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
				//兼容ios，微信小程序
				position: relative;
				z-index: 1;
				swiper {
					width: 100%;
					height: 30.7vw;
					swiper-item {
						image {
							width: 100%;
							height: 30.7vw;
						}
					}
				}
				.indicator {
					position: absolute;
					bottom: 20upx;
					// left: 20upx;
					left: 50%;
					transform: translateX(-50%);
					background-color: rgba(255, 255, 255, 0.4);
					width: 150upx;
					height: 5upx;
					border-radius: 3upx;
					overflow: hidden;
					display: flex;
					.dots {
						width: 0upx;
						background-color: rgba(255, 255, 255, 1);
						transition: all 0.3s ease-out;
						&.on {
							width: (100%/3);
						}
					}
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
