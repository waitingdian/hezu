<template>
	<view class="rent-page">
		<cu-custom bgColor="uni-custom-header-color">
			<block slot="content">我的合租</block>
		</cu-custom>
		
		<view class="tab-wrap">
			<view v-for="tab in navList" 
			:class="{'active': activeTab == tab.value}"
			:key="tab.value" 
			@tap="toggleTab(tab)">{{ tab.txt }}</view>
		</view>
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="product-list">
				<view
					class="product"
					v-for="(product,index) in productList"
					:key="index"
					@tap="toGoods(product.id)">
					<image mode="widthFix" :src="product.imgUrlList && product.imgUrlList[0] ? `${product.imgUrlList[0]}?imageView2/1/w/800/h/434` : emptyRoomPic"></image>
					<view class="right">
						<view class="name text-cut padding-top-xs">{{ product.title }}</view>
						<view class="info">租房类型: {{ product.cotenant_type == 1 ? '预防房' : '合租房' }}</view>
						<view class="info">房间数: {{ product.cotenant_count }}</view>
						<view class="info">租房状态:
							<view v-for="(status,index) in statusList"
								:key="index"
								v-if="product.status==status.value" 
								style="height: 40upx;"
								class='cu-tag margin-left-xs padding-left-xs padding-right-xs'
								:class="'line-' + status.class">{{status.label}}
							</view>
								<!-- :class="'line-' + status.class">{{status.label}}</view> -->
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="no-more-txt">没有更多了哦</view>
		<!-- <view class="loading-text" v-if="loadingText">{{ loadingText }}</view> -->
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
					{txt: '我发布的',value: 1},
					{txt: '我参与的',value: 2}
				],
				activeTab: 1,
				loadingText: '',
				productList: [],
				statusList: [
					{ label: '租房中', value: 0, class: 'blue'},
					{ label: '租房完成', value: 10, class: 'green'},
					{ label: '租房解散', value: 20, class: 'red'}
				]
			}
		},
		computed: {
		    ...mapState(['emptyRoomPic'])  
		},
		methods: {
			toggleTab(tab) {
				this.activeTab = tab.value
				this.getList()
			},
			
			toGoods (id) {
				let activeTab = this.activeTab
				uni.navigateTo({
					url: `/pages/rent/detail?id=${id}&activeTab=${activeTab}`
				})
			},
			
			getList () {
				this.loadingText = '正在加载...'
				this.$api.getPersonalList({
					role: this.activeTab
				}).then(res => {
					res.data.forEach((item) => {
						item.imgUrlList = item.chamber_img_url && item.chamber_img_url.split(',') || []
					})
				   this.productList = res.data
				   if (!this.productList.length) {
					   this.loadingText = '暂无更多数据'
				   } else {
					  this.loadingText = '' 
				   }
				}).catch(err => {
				})
			}
		},
		onLoad (options){
			if (options && options.activeTab) {
				this.activeTab == 2
				this.getList()
			} else {
				this.getList()
			}
		},
		
		onShow() {
			// this.activeTab = 1
			// this.getList()
			this.$store.dispatch('cleanunread', {type: 1})
			uni.getStorage({
			    key: 'renttype',
			    success: (res) => {
					if (res && res.data && res.data == 2) {
						this.activeTab == 2
						this.getList()
					} else {
						this.getList()
					}
			    },
				fail: () => {
					this.getList()
				}
			});
			this.$store.dispatch('getusermsg')
			this.$store.dispatch('cleanunread', {type: 1})
			// uni.setStorage({key: 'renttype', data: '1'});
		}
	}
</script>

<style lang="scss">
	.rent-page{
		background-color: #fff;
		min-height: 100vh;
		.cu-tag[class*="line-"]::after {
		    border-radius: 4px;
		}
		.loading-text {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #979797;
			padding: 30upx 0;
			font-size: 24upx;
			text-align: center;
		}
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
			.product-list {
				padding: 0 4% 8upx 4%;
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
					height: 200rpx;
					image {
						width: 38%;
						height: 94% !important;
						border-radius: 10upx;
						margin-top: 1%;
					}
					.right{
						width: 60%;
						padding: 0 2%;
						display: flex;
						flex-direction: column;
						justify-conten: space-around;
						uni-view{
							line-height:1.6;
						}
						.name {
							text-align: justify;
							overflow: hidden;
							font-size: $uni-font-size-lg;
							font-weight: 600;
							padding-bottom: 2upx;
						}
						.info {
							font-size: $uni-font-size-sm;
						}
					}
				}
			}
		}
		
	}
</style>
