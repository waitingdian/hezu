<template>
	<view class="rent-page">
		<view class="tab-wrap">
			<view v-for="tab in navList" 
			:class="{'active': activeTab == tab.value}"
			:key="tab.value" 
			@tap="toggleTab(tab)">{{ tab.txt }}</view>
		</view>
<!-- 		<view class="tab-wrap">
			<view
			@tap="activeTab=2">1111{{activeTab}}</view>
		</view> -->
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="product-list">
				<view
					class="product"
					v-for="product in productList"
					:key="product.goods_id"
					@tap="toGoods(product)"
				>
					<image mode="widthFix" :src="product.photo_min"></image>
					<view class="right">
						<view class="name">{{ product.name }}</view>
						<view class="price">房间数:{{ product.roomCount }}</view>
						<view class="slogan">租房状态:{{ product.roomStatus }}</view>
					</view>
				</view>
			</view>
			<view class="loading-text">{{ loadingText }}</view>
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
				navList: [
					{txt: '我发布的',value: 0},
					{txt: '我参与的',value: 2}
				],
				activeTab: 0,
				loadingText: '正在加载...'
			}
		},
		computed: {  
		     ...mapState(['productList'])  
		},  
		methods: {
			toggleTab(tab) {
				this.activeTab = tab.value
			},
			toGoods () {
				if (this.activeTab) {
					uni.navigateTo({
						url:'/pages/release/rentdetail'
					})		
				} else {
					uni.navigateTo({
						url:'/pages/release/predetail'
					})
				}
				
			}
		},
		onLoad (){
			console.log(1111)
		}
	}
</script>

<style lang="scss">
	.rent-page{
		.tab-wrap{
			display: flex;
			margin-bottom:20upx;
			view{
				height: 80upx;
				line-height: 80upx;
				flex: 1;
				text-align: center;
				font-size: $font-base;
				&.active{
					color: $font-color-orange;
					border-bottom: 2upx solid $font-color-orange;
					// background-color: $font-color-orange;
				}
			}
		}
		// 列表数据
		// 列表数据
			.goods-list {
			// background-color: #f4f4f4;
			.title {
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 80upx;
				color: #f47825;
				font-size: 30upx;
				margin-top: 10upx;
				image {
					width: 30upx;
					height: 30upx;
				}
			}
			.loading-text {
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 60upx;
				color: #979797;
				font-size: 24upx;
			}
			.product-list {
				width: 92%;
				padding: 0 4% 3vw 4%;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				.product {
					width: 100%;
					display:flex;
					border-radius: 20upx;
					background-color: #fff;
					margin: 8upx 0 15upx 0;
					box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.1);
					image {
						width: 35%;
						border-radius: 20upx 20upx 0 0;
					}
					.right{
						width: 60%;
						padding: 0 2%;
						display: flex;
						flex-direction: column;
						justify-conten: space-around;
						.name {
							padding: 10upx 0;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							text-align: justify;
							overflow: hidden;
							font-size: $uni-font-size-lg;
						}
						.price {
							padding-top: 30upx;
							padding-bottom: 10upx;
							color: #e65339;
							font-size: 30upx;
							font-weight: 600;
						}
						.slogan {
							color: #807c87;
							font-size: 24upx;
						}
					}
				}
			}
		}
		
	}
</style>
