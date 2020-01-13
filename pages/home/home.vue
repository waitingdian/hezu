<template>
	<view class="home-page">
		<cu-custom bgColor="uni-custom-header-color">
			<block slot="content">首页</block>
			
			<block slot="right">
				<!--  #ifdef  APP-PLUS -->
				<view class="icon-btn" style="position: absolute;right: 20px;top:76upx;color: #000000;" @tap="toggleSelectCity">
					<text class="cuIcon-locationfill lg text-gray padding-right-xs" ></text>
					{{ city }}
				</view>
				<!--  #endif -->
				<!--  #ifdef  MP-WEIXIN -->
				<view class="icon-btn" style="position: absolute;right: 204upx;top:85upx;color: #000000;" @tap="toggleSelectCity">
					<text class="cuIcon-locationfill lg text-gray padding-right-xs" ></text>
					{{ city }}
				</view>
				<!--  #endif -->
			</block>
			
		</cu-custom>
	
		<!-- 搜索框 -->
		<view class="input-box-wraper">
			<text class="release-text"  @tap="release">我要发布</text>
			<view class="center-input">
				<input
					placeholder-class="placeholder-class"
					placeholder="请输入大学名称"
					placeholder-style="color:#c0c0c0;"
					v-model="searchParams.college"
				/>
				<view @tap="clearKeyword" class="clear-icon">×</view>
			</view>
			<button @tap="getGroupList" class="cu-btn round lines-blue search-btn">搜索</button>
		</view>
		<!-- tab -->
		<view class="tab-top-wraper">
			<view class="tab-item"
			@tap="toggleTab(item)"
			 v-for="item in tabBtnList" 
			 :class="{'active': activeTab == item.value || item.checked}"
			 :key="item.value">
				{{ item.text }}
				<text v-if="activeTab == item.value" class="cuIcon-triangleupfill lg text-gray"></text>
				<text v-else class="cuIcon-triangledownfill lg text-gray"></text>
				<!-- <text class="lg text-gray" :class="{activeTab == item.value ? '': ''}"></text> -->
				<!-- <view style='display: inline-block;' class="icon iconfont iconxiaosanjiaodown" :class="{'rotate':activeTab == item.value}"></view> -->
			</view>
			
			<view class="position-model" v-show='activeTab == 1'>
				<view class="content">
					<view class="container">
						<view class="list">
							<view class="item" @tap="chooseEmptyProvince" :class="{'active': !activeProvince}">不限</view>
							<view class="item" @tap="chooseProvince(province,index)" v-for="(province,index) in provinceDataList" :class="{'active': activeProvince == province.label}" :key="index">{{ province.label }}</view>
						</view>
						<view class="list">
							<view class="item" @tap="chooseEmptyCity" :class="{'active': !activeCity}">不限</view>
							<view class="item" @tap="chooseCity(city,index)" v-for="(city,index) in cityDataList" :class="{'active': activeCity == city.label}" :key="index">{{ city.label }}</view>
						</view>
						<view class="list">
							<view class="item" @tap="chooseEmptyArea" :class="{'active': !activeArea}">不限</view>
							<view class="item" @tap="chooseArea(area,index)" v-for="(area,index) in areaDataList" :class="{'active': activeArea == area.label}" :key="index">{{ area.label }}</view>
						</view>
					</view>
				</view>
				<view class="position-footer-wraper">
					<button style="margin-right: 20upx;" class="mini-btn" size="mini" formType="submit" @tap="cancelPosition">取消</button>
					<button class="mini-btn" type="primary" size="mini" formType="submit" @tap="confirmPosition">确认</button>
				</view>
			</view>
			
			<view class="type-wraper tab-top-content" v-show='activeTab == 2'>
				<view>合租</view>
				<view class="tab-bot-content">
					<view v-for="item in rentTypeList" :key="item.value" :class="{checked: cotenantType == item.value}">
						<text @tap="changeRentType(item.value)">
							{{ item.name }}
						</text>
					</view>
				</view>
				<view style="text-align: right;">
					<button style="margin-right: 20upx;" class="mini-btn" size="mini" formType="submit" @tap="cancelType">取消</button>
					<button class="mini-btn" type="primary" size="mini" formType="submit" @tap="confirmType">确认</button>
				</view>
			</view>
			
			<view class="type-wraper tab-top-content" v-show='activeTab == 3'>
				<view>合租数</view>
				<view class="tab-bot-content">
					<view v-for="item in roomCountList" :key="item.value" :class="{checked: cotenantCount == item.value}">
						<text @tap="changeRentCount(item.value)">
							{{ item.name }}
						</text>
					</view>
				</view>
				<view style="text-align: right;">
					<button style="margin-right: 20upx;" class="mini-btn" size="mini" formType="submit" @tap="cancelCount">取消</button>
					<button class="mini-btn" type="primary" size="mini" formType="submit" @tap="confirmCount">确认</button>
				</view>
			</view>
		
			<view class="choose-city-wrap" v-show="showSelectCity">
				<view class="content-wrap">
					<view class="select-city">
						<scroll-view :scroll-into-view="scrollIntoId" :scroll-y="true" :scroll-with-animation="true" :style="{height:windowHeight}">
						  <view class="content padding-top-sm">
						    <view class="section" id="current">
						      <view class="city-title">当前城市
								<text style="color:#007AFF;" class="padding-left-lg" @tap="reloadPosition">重新获取</text>
							  </view>
						      <view class="city-list">
						        <view class="city-item">{{current}}</view>
						      </view>
						    </view>
						    <view class="section" id="hot" v-if="hotCitys.length">
						      <view class="city-title">热门城市</view>
						      <view class="city-list">
						        <view class="city-item" :class="{active: current === city}" v-for="(city, i) in hotCitys" :key="i" @click="onSelect(city)">{{city}}</view>
						      </view>
						    </view>
							<view class="city-footer">
								<button style="margin-right: 40upx;" class="mini-btn" size="mini" formType="submit" @tap="cancelSelectCity">取消</button>
								<button class="mini-btn" type="primary" size="mini" formType="submit" @tap="confirmSelectCity">确认</button>
							</view>
						  </view>
						</scroll-view>
					  </view>
				</view>
			</view>
		</view>
		
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="product-list">
				<view
					class="product"
					v-for="(product,index) in productList"
					:key="index"
					@tap="toGoods(product)">
					<!-- :src="`${item}?imageView2/1/w/800/h/434`" -->
					<image :src="product.imgUrlList && product.imgUrlList[0] ? `${product.imgUrlList[0]}?imageView2/1/w/800/h/434` : emptyRoomPic"></image>
					<view class="content">
						<view class="container">
							<view class="name text-cut">{{ product.title }}</view>
							<view class="info padding-top-xs">团长: {{ product.leader }} </view>
							<view class="info">房间数: {{ product.cotenant_count }} </view>
							<view class="info">租房类型: {{ product.cotenant_type == 1 ? '预租房' : '合租房' }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="no-more-txt">没有更多了哦</view>
			<!-- <view class="loading-text">{{ loadingText }}</view> -->
		</view>
		</view>
	</view>
</template>

<script>
	
	//高德SDK
	import amap from '@/common/SDK/amap-wx.js';
	import provinceData from '@/components/mpvue-citypicker/city-data/province.js';
	import cityData from '@/components/mpvue-citypicker/city-data/city.js';
	import areaData from '@/components/mpvue-citypicker/city-data/area.js';
	import {  
	        mapState,  
	        mapMutations  
	    } from 'vuex';  
	
	export default {

		data() {
			return {
				loadModal: false,
				activeTab: '0',
				nVueTitle:null,
				provinceDataList: [],
				cityDataList: [],
				areaDataList: [],
				activeProvince: '上海市',
				activeCity: '',
				activeArea: '',
				pickerValueDefault: [0,0,0],
				tabBtnList: [
					{ text: '位置', value: '1' , checked: false},
					{ text: '合租', value: '2', checked: false },
					{ text: '房间数', value: '3', checked: false },
				],
				city: '上海市',
				searchParams: {
					college: '',
					cotenant_type: '',
					province: '',
					city: '',
					district: '',
					cotenant_count: ''
				},
				cotenantType: '',
				cotenantCount: '',
				rentTypeList: [
					{name: '不限', value: ''},
					{name: '预租', value: 1},
					{name: '合租', value: 2},
				],
				roomCountList: [
					{name: '不限', value: ''},
					{name: '2户合租', value: 2},
					{name: '3户合租', value: 3},
					{name: '4户合租', value: 4},
					{name: '5户合租', value: 5}
				],
				//精选列表
				productList: [],
				loadingText: '',
				showSelectCity: false,
				hotCitys: ['上海市', '北京市', '广州市', '深圳市', '杭州市', '天津市', '武汉市', '重庆市', '成都市', '苏州市', '苏州市', '南京市', '荆州市'],
				value: '杭州',
				windowHeight: '',
				scrollIntoId: 'F',
				current: this.city,
				tempCurrentCity: ''
			};
		},
		
		computed: {  
		    ...mapState(['emptyRoomPic'])  
		},
		
		onLoad() {
			this.getSystemInfo()
			this.init()
			this.amapPlugin = new amap.AMapWX({
				//高德地图KEY，随时失效，请务必替换为自己的KEY，参考：http://ask.dcloud.net.cn/article/35070
				key: '7c235a9ac4e25e482614c6b8eac6fd8e'
			});
			
			this.initPosition()
			// let curPage = this.getCurPage();
			//在微信小程序或是app中，通过curPage.options；如果是H5，则需要curPage.$route.query（H5中的curPage.options为undefined，所以刚好就不需要条件编译了）
			// let curParam = curPage.options || curPage.$route.query;
		},
	
		onShow() {
			this.getGroupList()
			this.$store.dispatch('getusermsg')
			// uni.getStorage({
			//     key: 'hometype',
			//     success: (res) => {
			// 		if (res.data == 2) {
			// 			this.getGroupList()
			// 		}
			//     }
			// });
			// uni.setStorage({key: 'hometype', data: '1'});
		},
		
		watch: {
			'searchParams.province' (newVal) {
				this.tabBtnList[0].checked = !!newVal
			},
			'searchParams.cotenant_type' (newVal) {
				this.tabBtnList[1].checked = !!newVal
			},
			'searchParams.cotenant_count' (newVal) {
				this.tabBtnList[2].checked = !!newVal
			}
		},
		methods: {
			reloadPosition() {
				this.initPosition()
			},
			
			initPosition () {
				//定位地址
				this.amapPlugin.getRegeo({
					success: data => {
						if (typeof data[0].regeocodeData.addressComponent.city == 'string') {
							this.city = data[0].regeocodeData.addressComponent.city; 
							this.activeCity = data[0].regeocodeData.addressComponent.city
						} else if (typeof data[0].regeocodeData.addressComponent.province == 'string') {
							this.city = data[0].regeocodeData.addressComponent.province; 
							this.activeProvince = data[0].regeocodeData.addressComponent.province
						} else {
							this.city = '上海市';
							this.activeProvince = '上海市'
						}
						this.searchParams.province = this.activeCity || this.activeProvince
						// #ifdef APP-PLUS
						// this.nVueTitle.postMessage({type: 'location',city:this.city});
						// #endif
						this.getGroupList()
					},
					fail: err => {
						this.getGroupList()
						console.log(err)
					}
				});
				this.current = this.city
			},
			
			getSystemInfo() {
			  uni.getSystemInfo().then(res => {
			    let [error, data] = res
			    this.windowHeight = `${data.windowHeight}px`
			  })
			},
			
			
			scrollTo(letter) {
			  this.scrollIntoId = letter === '#' ? 'current' : letter
			},
			
			toggleSelectCity () {
				this.showSelectCity = true
			},
			
			confirmSelectCity () {
				this.searchParams.province = ''
				this.searchParams.district = ''
				this.searchParams.city = this.current
				this.activeProvince = ''
				this.activeCity = ''
				this.activeArea = ''
				this.showSelectCity = false
				this.city = this.current
				this.getGroupList()
			},
			cancelSelectCity () {
				this.showSelectCity = false
				this.getGroupList()
			},
			onSelect(city) {
			  this.current = city
			},
			getCurPage(){
			    let pages = getCurrentPages();
			    let curPage = pages[pages.length-1];
			    return curPage
			},
			init() {
				this.provinceDataList = provinceData;
				this.cityDataList = cityData[this.pickerValueDefault[0]];
				this.areaDataList = areaData[this.pickerValueDefault[0]][this.pickerValueDefault[1]];
				this.pickerValue = this.pickerValueDefault;
			},
			
			confirmPosition() {
				this.searchParams.province = this.activeProvince
				this.searchParams.city = this.activeCity
				this.searchParams.district = this.activeArea
				this.activeTab = '0'
				this.city = this.current
				// this.city = this.activeCity
				this.getGroupList()
			},
			
			cancelPosition() {
				this.activeTab = '0'
			},
			
			chooseEmptyProvince() {
				this.activeProvince = ''
				this.activeCity = ''
				this.activeArea = ''
				this.cityDataList = []
				this.areaDataList = []
			},
			
			chooseEmptyCity () {
				this.activeCity = ''
				this.activeArea = ''
				this.areaDataList = []
			},
			
			chooseEmptyArea () {
				this.activeArea = ''
			},
			
			chooseProvince(value,index) {
				this.activeProvince = value.label
				this.pickerValueDefault[0] = index
				this.cityDataList = cityData[this.pickerValueDefault[0]];
				this.areaDataList = areaData[this.pickerValueDefault[0]][this.pickerValueDefault[1]];
			},
			
			chooseCity(value,index) {
				this.activeCity = value.label
				this.pickerValueDefault[1] = index
				this.areaDataList = areaData[this.pickerValueDefault[0]][this.pickerValueDefault[1]];
			},
			
			chooseArea(value,index) {
				this.activeArea = value.label
				this.pickerValueDefault[2] = index
			},
			
			clearKeyword() {
				this.searchParams.college = ''
				this.getGroupList()
				
				
			},
			
			toggleTab (item) {
				this.activeTab = item.value
			},
			 
			toGoods (item) {
				uni.navigateTo({
					url: `/pages/home/detail?id=${item.id}`
				})
			},
			
			release () {
				uni.navigateTo({
					url:'/pages/release/release'
				})
				
			},
			
			cancelType() {
				this.cotenantType = this.searchParams.cotenant_type
				this.activeTab = '0'
			}, 
			
			cancelCount() {
				this.cotenantCount = this.searchParams.cotenant_count
				this.activeTab = '0'
			}, 
			
			confirmType() {
				this.searchParams.cotenant_type = this.cotenantType
				this.getGroupList()
			},
			
			confirmCount() {
				this.searchParams.cotenant_count = this.cotenantCount
				this.getGroupList()
			},
			
			changeRentType(value) {
				this.cotenantType = value
			},
			
			changeRentCount(value) {
				this.cotenantCount = value
			},
			
			getGroupList () {
				this.activeTab = '0'
				// this.loadModal = true
				let params = {}
				if (this.searchParams.college) {
					params.college = this.searchParams.college
				}
				if (this.searchParams.cotenant_type) {
					params.cotenantType = this.searchParams.cotenant_type
				}
				if (this.searchParams.province) {
					params.province = this.searchParams.province
				}
				if (this.searchParams.city) {
					params.city = this.searchParams.city
				}
				if (this.searchParams.district) {
					params.district = this.searchParams.district
				}
				params.cotenantCount = this.searchParams.cotenant_count
				this.loadingText = '正在加载...'
				console.log(params)
				this.$api.getGroupList(params).then(res => {
					this.loadModal = false
					res.data.forEach((item) => {
						item.imgUrlList = item.chamber_img_url && item.chamber_img_url.split(',') || []
					})
					this.productList = res.data
					if (!res.data.length) {
						this.loadingText = '暂无更多数据'
					} else {
						this.loadingText = ''
					}
				}).catch(err => {
					this.loadModal = false
					this.loadingText = ''
				})
			}
		}
	}
</script>

<style lang="scss">
	.home-page{
		background-color: #fff;
		min-height: 100vh;
	}
	.choose-city-wrap{
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.3);
		z-index: 999;
		.content-wrap{
			padding: 0 2%;
			width: 100%;
			background-color: #fff;
			.select-city {
				padding-top: 80px;
				background-color: #fff;
				padding-bottom: 100px;
				.content{
					padding-bottom: 120px;
					.city-footer{
						position: fixed;
						width: 100%;
						bottom: 0;
						padding: 20upx 56upx 4upx;
						text-align: right;
						background-color: #fff;
					}
				}
			  .index {
			    position: absolute;
			    top: 120px;
				right: 0;
			    bottom: 20upx;
			    z-index: 999;
			    color: #2f9bfe;
			    font-size: 32upx;
			    .index-item {
			      width: 40upx;
			      height: 42upx;
			      line-height: 42upx;
				  padding-right: 10rpx;
			      text-align: center;
				  color: #ccc;
				  &.active{
					  color: #2f9bfe;
				  }
			    }
			  }
			  .section {
			    margin-bottom: 19upx;
			    .city-title {
			      color: #333;
			      font-size: 28upx;
			      margin-bottom: 28upx;
			    }
			    .letter {
			      width: 44upx;
			      height: 44upx;
			      color: #fff;
			      border-radius: 100%;
			      background-color: #2f9bfe;
			      font-size: 28upx;
			      line-height: 44upx;
			      text-align: center;
			      margin-bottom: 30upx;
			    }
			    .city-list {
			      display: flex;
			      flex-wrap: wrap;
				  padding-left: 30upx;
			      .city-item {
			        width: 190upx;
			        height: 55upx;
			        margin-right: 36upx;
			        margin-bottom: 28upx;
			        line-height: 55upx;
			        text-align: center;
			        border: 1px solid #dcdcdc;
			        border-radius: 6upx;
			        color: #999;
			        font-size: 28upx;
			        &.active {
			          background-color: #d5ebff;
			          border-color: #2f9bfe;
			          color: #2f9bfe;
			        }
			      }
			    }
			  }
			}
		}
	}
	.position-model{
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.3);
		z-index: 999;
		.content{
			// position: absolute;
			// top: 80upx;
			margin-top: 218upx;
			width: 100%;
			height: 62%;
			background-color: #fff;
			padding-top: 12upx;
			padding-bottom: 22upx;
			.container{
				display: flex;
				height: 100%;
				.list{
					flex: 1;
					overflow-y: scroll;
					border-right: 1upx solid #F5F5F5;
					.item{
						height: 70upx;
						line-height: 70upx;
						padding-left: 36upx;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
						&.active{
							background-color: $font-color-orange;
							color: #fff;
						}
					}
				}
			}
		}
		.position-footer-wraper{
			text-align: right;
			padding: 24upx;
			background-color: #fff;
		}
	}
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
			padding: 0 4% 3vw 4%;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.product {
				display: flex;
				width: 100%;
				border-radius: 20upx;
				background-color: #fff;
				margin: 0 0 15upx 0;
				padding-bottom: 16upx;
				box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.1);
				image {
					width: 38%;
					height: 92%;
					border-radius: 10upx;
					margin-top: 2%;
				}
				.content{
					width: 58%;
					.container {
						width: 92%;
						padding: 10upx 4%;
					}
				}
				.name {
					text-align: justify;
					overflow: hidden;
					font-size: $uni-font-size-lg;
					font-weight: 600;
				}
				.info {
					font-size: $uni-font-size-sm;
				}
			}
		}
	}

	// 切换tab
	.tab-top-wraper{
		position: relative;
		display: flex;
		background-color: #fff;
		height: 40px;
		line-height: 40upx;
		margin-bottom: 20upx;
		.tab-top-content{
			position: absolute;
			left: 0;
			top: 80upx;
			width: 100%;
			min-height: 100upx;
			padding: 20upx 40upx 40upx;
			background-color: #fff;
			z-index: 999;
			box-sizing: border-box;
		}
		.tab-bot-content{
		   display: flex;
		   flex-wrap: wrap;
		   view{
			   &.checked text{
			   			   color: $font-color-orange;
			   			   border: 1upx solid $font-color-orange;
			   }
		    // display: in;
		    width: 33%;
		    text-align: left;
		    height: 60upx;
		    line-height: 60upx;
			margin-bottom: 30upx;
		    text{
		     padding: 10upx 30upx;
		     border: 1upx solid #f5f5f5;
			 border-radius: 6upx;
		    }
		   }
		  }
		
		.tab-item{
			flex: 1;
			text-align: center;
			font-size: $font-base;
			line-height: 80upx;
			&.active{
				color: $font-color-orange;
				border-bottom: 2upx solid $font-color-orange;
				// background-color: $font-color-orange;
				.rotate {
					transform: rotate(180deg);
				}
			}
		}
	}
	.input-box-wraper{
		display: flex;
		align-items: center;
		height: 36px;
		background-color: #fff;
		.release-text{
			flex-shrink: 0;
			width: 160upx;
			font-size: $font-base;
			color: $font-color-orange;
			text-align: center;
		}
		.center-input{
			position: relative;
			width: 60%;
			background-color: #f5f5f5;
			border-radius: 24upx;
			height: 30px;
			line-height: 30px;
			uni-input{
				padding-left: 15upx;
				padding-right: 52upx;
				display: inline-block;
				height: 30px;
				font-size: $font-base !important;
			}
			// .uni-input-input{
			// 	// padding-left: 20upx;
			// 	padding: 0 4%;
			// 	font-size: $font-base;
			// }
			.clear-icon{
				position: absolute;
				top: 0;
				right: 0px;
				width: 70upx;
				height: 60upx;
				font-size: 32upx;
				line-height: 32px;
				color: #c0c0c0;
				text-align: center;
				z-index: 6;
			}
		}
		.search-btn{
			flex-shrink: 0;
			width: 150upx;
			margin:0 10upx;
		}
	}
	page {
		background: #f5f5f5;
	}
	.m-t{
		margin-top: 16upx;
	}
	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */
		background-color: #f1f1f1;
		transition: opacity 0.05s linear;
	}
	.header {
		width: 100%;
		height: 100upx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		// z-index: 10;
		// background-color: #ccc;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */
		.before,
		.after {
			width: 92%;
			padding: 0 4%;
			height: 100upx;
			display: flex;
			align-items: center;
			position: fixed;
			top: 0;
			/*  #ifdef  APP-PLUS  */
				top: var(--status-bar-height);
			/*  #endif  */
			transition: opacity 0.05s linear;
			.back {
				width: 125upx;
				height: 60upx;
				flex-shrink: 0;
				.icon {
					margin-left: -10%;
					width: 60upx;
					height: 60upx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 42upx;
				}
			}
			.middle {
				width: 100%;
				text-align: center;
			}
			.icon-btn {
				width: 150upx;
				height: 60upx;
				flex-shrink: 0;
				display: flex;
				font-size: $font-sm+2upx;
				line-height: 60upx;
				.icon {
					&:first-child{
						margin-right: 5upx;
					}
					width: 60upx;
					height: 60upx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 50upx;
				}
			}
		}
		.before {
			.back {
				.icon {
					// color: #fff;
					// background-color: rgba(0, 0, 0, 0.2);
					border-radius: 100%;
				}
			}
			.icon-btn {
				.icon {
					// color: #fff;
					// background-color: rgba(0, 0, 0, 0.2);
					border-radius: 100%;
					
				}
			}
		}
		.after {
			background-color: #f1f1f1;
			.back {
				.icon {
					color: #666;
				}
			}
			.icon-btn {
				.icon {
					color: #666;
				}
			}
			.middle {
				font-size: 32upx;
				height: 90upx;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 7%;
				view {
					width: (100%/3);
					padding: 0 3%;
					margin: 0 3%;
					display: flex;
					justify-content: center;
					align-items: center;
					&.on {
						margin-bottom: -4upx;
						color: #f47952;
						border-bottom: solid 4upx #f47952;
					}
				}
			}
		}
	}

	.input-box11 {
		width: 100%;
		height: 60upx;
		background-color: #f5f5f5;
		border-radius: 30upx;
		position: relative;
		display: flex;
		align-items: center;
		.icon {
			display: flex;
			align-items: center;
			position: absolute;
			top: 0;
			right: 0;
			width: 60upx;
			height: 60upx;
			font-size: 34upx;
			color: #c0c0c0;
		}
		input {
			padding-left: 28upx;
			height: 28upx;
			font-size: 28upx;
		}
	}


	/* 猜你喜欢 */
	.guess-section{
		display:flex;
		flex-wrap:wrap;
		padding: 0 30upx;
		background: #fff;
		.guess-item{
			display:flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;
			&:nth-child(2n+1){
				margin-right: 4%;
			}
		}
		.image-wrapper{
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
		.title{
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}
		.price{
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
		}
	}
	.top-xsj{
		display: inline-block;
		width: 0;
		height: 0;
		padding-left: 10upx; 
		// content: ""; 
		border:10upx solid transparent; 
		border:10upx solid rgba(0,0,0,0.6);
		border-left-color: #ff0000;
	}

</style>
