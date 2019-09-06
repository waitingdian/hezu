<template>
	<view class="rent-detail">
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
		<!--  -->
		<view class="container">
			<view class="content">
				<view class="title">标题标题标题标题标题标题标题标题标题标题</view>
				<view class="item">
					<text class="lable">团长:</text>
					{{ detailInfo.commander }}
				</view>
				<view class="item">
					<text class="lable">房间数:</text>
					{{ detailInfo.roomCount }}
				</view>
				<view class="item">
					<text class="lable">租房状态:</text>
					{{ detailInfo.roomStatus }}
				</view>
				<view class="item">
					<text class="lable">位置:</text>
					{{ detailInfo.position }}
				</view>
				<view class="title-desc">出租描述</view>
				<view class="describe">{{ detailInfo.describe }}</view>
				<view class="rent-list">
					<view class="rent-item" v-for="rent in detailInfo.renterList" :key="rent.id">
						<text>{{ rent.role }}</text>
						<text>{{ rent.name }}</text>
						<text>{{ rent.school }}</text>
						<text>{{ rent.describe }}</text>
					</view>
				</view>
			</view>
			<view class="footer">
				<button style="width: 42%;margin-right: 20upx;margin-left: 0;"
				 type="primary"
				 @tap="apply"
				 loading="applyLoading">申请加入
				 </button>
				<button style="width: 42%;margin-left: 0;margin-right: 0;">联系团长
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	
	//高德SDK
	import amap from '@/common/SDK/amap-wx.js';

	export default {

		data() {
			return {
				currentSwiper: 0,
				// 轮播图片
				swiperList: [
					{ id: 1, src: 'url1', img: '/static/img/1.jpg' },
					{ id: 2, src: 'url2', img: '/static/img/2.jpg' },
					{ id: 3, src: 'url3', img: '/static/img/3.jpg' }
				],
				detailInfo: {
					commander: '包鹏程',
					roomCount: 200,
					roomStatus: '正在出租',
					position: '上海市浦东新区',
					describe: '个人生活作息规律,喜欢唱歌,跳舞,喜欢我的可以申请加入',
					renterList: [
						{ id: 1, role: '团长1', name: '包鹏程',school: '交通大学',describe: '兴趣爱好'},
						{ id: 2, role: '团长2', name: '包鹏程',school: '交通大学',describe: '兴趣爱好'},
						{ id: 3, role: '团长3', name: '包鹏程',school: '交通大学',describe: '兴趣爱好'},
						{ id: 4, role: '团长4', name: '包鹏程',school: '交通大学',describe: '兴趣爱好'}
					]
				},
				applyLoading: false,
			};
		},
		onLoad() {
		},
		onPageScroll(e) {
		},
		methods: {
			// 申请加入
			apply() {
				uni.showModal({
					title: '温馨提示',
					content: '确定申请加入该预租团？',
					success: (res)=>{
						if (res.confirm) {
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
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
.rent-detail{
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
	// 详情
	.container{
		font-size: $uni-font-size-lg;
		.content{
			margin: 32upx auto 32upx;
			width: 92%;
			.item{
				padding-top: 12upx;
				.lable{
					padding-right: 20upx;
				}
			}
			.rent-list {
				text{
					padding-right: 20upx;
				}
				.rent-item{
					// padding: 6upx 0;
					line-height: 1.3;
				}
			}
			.describe{
				line-height: 1.3;
				padding: 10upx 0 20upx 0;
			}
		}
		.footer{
			margin: 10upx auto;
			width: 92%;
			display: flex;
			justify-content: flex-end;
		}
		.title{
			font-size: $uni-font-size-biglg;
		}
		.title-desc{
			line-height:  1.3;
			font-size: $uni-font-size-title;
			font-weight: 400;
			padding-top: 10upx;
		}
	}
}
</style>
