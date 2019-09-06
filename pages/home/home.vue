<template>
	<div class="home-page">
		<view class="status" :style="{ opacity: afterHeaderOpacity }"></view>
		<view class="header">
			<!-- 头部-默认显示 -->
<!-- 			<view class="before" :style="{ opacity: 1 - afterHeaderOpacity, zIndex: beforeHeaderzIndex }">
				<view class="back"><view class="icon xiangqian" @tap="back" v-if="showBack"></view></view> 
				<view class="middle">首页</view>
				<view class="icon-btn">
					<view class="icon iconfont iconweizhi"></view>
					{{ city }}
				</view>
			</view> -->
			<!-- 头部-滚动渐变显示 -->
	<!-- 		<view class="after" :style="{ opacity: afterHeaderOpacity, zIndex: afterHeaderzIndex }">
				<view class="back" ><view class="icon xiangqian" @tap="back" v-if="showBack"></view></view>
				<view class="middle">
					<view v-for="(anchor,index) in anchorlist" :class="[selectAnchor==index ?'on':'']" :key="index" @tap="toAnchor(index)">{{anchor.name}}</view>
				</view>
				<view class="icon-btn">
					<view class="icon iconfont iconweizhi"></view>
					<view class="icon tongzhi" @tap="toMsg"></view>
				</view>
			</view> -->
		</view>
		<!-- 搜索框 -->
		<view class="input-box-wraper">
			<text class="release-text"  @tap="release">我要发布</text>
			<div class="center-input">
				<input
					placeholder-class="placeholder-class"
					placeholder="默认关键字"
					placeholder-style="color:#c0c0c0;"
					@tap="toSearch()"
				/>
				<view @click="clearKeyword"
				 class="clear-icon">×
				</view>
			</div>
			<!-- <icon type="clear" size="26"/> -->
			<button class="mini-btn search-btn" type="default" size="mini">搜索</button>
			<!-- <view class="icon search"></view> -->
		</view>
		<!-- tab -->
		<view class="tab-top-wraper">
			<view class="tab-item"
			@tap="toggleTab(item)"
			 v-for="item in tabBtnList" 
			 :class="{'active': activeTab == item.value}"
			 :key="item.value">
				{{ item.text }}
			</view>
		</view>
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
					<view class="content">
						<view class="container">
							<view class="name">{{ product.name }}</view>
							<view class="info">{{ product.area_order }} m² </view>
							<view class="address">{{ product.subway_station_info }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="loading-text">{{ loadingText }}</view>
		</view>

</view>
	</div>
</template>

<script>
	
	//高德SDK
	import amap from '@/common/SDK/amap-wx.js';

	export default {

		data() {
			return {
				activeTab: '1',
				tabBtnList: [
					{ text: '位置', value: '1' },
					{ text: '合租', value: '2' },
					{ text: '房间数', value: '3' },
				],
				//控制渐变标题栏的参数
				beforeHeaderzIndex: 11,//层级
				afterHeaderzIndex: 10,//层级
				beforeHeaderOpacity: 1,//不透明度
				afterHeaderOpacity: 0,//不透明度
				// #ifndef MP
				showBack:true,
				// #endif
				anchorlist:[],//导航条锚点
				selectAnchor:0,//选中锚点
				city: '上海',
				//猜你喜欢列表
				productList:[
				    {
				                                "id": "62490488",
				                                "house_id": "60394647",
				                                "type": 1,
				                                "name": "金铭福邸4居室-南卧",
				                                "price": ["//static8.ziroom.com/phoenix/pc/images/price/da4554c01a8c0563bf7fc106c3934722s.png", [7, 0, 6, 2]],
				                                "area": "17.3",
				                                "price_unit": "/月",
				                                "photo": "//img.ziroom.com/pic/house_images/g2m2/M00/43/74/CtgFCV04HEiAcHDGAAJ3x0Iyhhc512.jpg_C_240_180_Q100.jpg",
				                                "floor_total": "6",
				                                "floor": "4",
				                                "has_video": 1,
				                                "has_3d": 0,
				                                "sale_img": "",
				                                "type_text": "合租",
				                                "inv_id": "921903",
				                                "inv_no": "789424591",
				                                "code": "SHZRGY0819473048_01",
				                                "house_code": "SHZRGY0819473048",
				                                "turn": 0,
				                                "bedroom": 4,
				                                "parlor": 1,
				                                "resblock_id": "5011000014650",
				                                "resblock_name": "金铭福邸",
				                                "lng": 121.4176737,
				                                "lat": 31.01631551,
				                                "face": "南",
				                                "photo_webp": "//img.ziroom.com/pic/house_images/g2m2/M00/43/74/CtgFCV04HEiAcHDGAAJ3x0Iyhhc512.jpg_C_240_180_Q100.jpg",
				                                "photo_min": "//img.ziroom.com/pic/house_images/g2m2/M00/43/74/CtgFCV04HEiAcHDGAAJ3x0Iyhhc512.jpg_C_240_180_Q100.webp",
				                                "photo_min_webp": "//img.ziroom.com/pic/house_images/g2m2/M00/43/74/CtgFCV04HEiAcHDGAAJ3x0Iyhhc512.jpg_C_240_180_Q100.webp",
				                                "house_type": 1,
				                                "area_order": 17.3,
				                                "sort_score": 8.823,
				                                "air_qualified": 1,
				                                "air_quality": 2,
				                                "activity_marks": [],
				                                "is_ai_lock": 1,
				                                "can_sign_date": 1566576000,
				                                "can_sign_time": 1564884000,
				                                "can_reserve_time": 0,
				                                "can_sign_long": 1,
				                                "sale_status": 3,
				                                "stock_status": "201",
				                                "apartment_type": 1,
				                                "commute_info": "",
				                                "title_tag": 5,
				                                "intro_list": [{
				                                    "icon": "https://image.ziroom.com/g2m1/M00/66/71/ChAFB1vk_O6ASX5vAAAEQEpAQUE464.png",
				                                    "title": "空气质量已检测, 已空置24天",
				                                    "is_marked": 0
				                                }, {
				                                    "icon": "https://image.ziroom.com/g2m1/M00/67/9D/ChAFBlvk_PmAQNRIAAACNwPDlpM637.png",
				                                    "title": "预计2019-08-24可入住",
				                                    "is_marked": 0
				                                }],
				                                "tags": [{
				                                    "title": "深呼吸",
				                                    "bg_img": "https://image.ziroom.com/g2m1/M00/42/73/ChAFBlvW2J6AZtJtAAAfl2T06pY936.png"
				                                }, {
				                                    "title": "独立卫生间"
				                                }, {
				                                    "title": "拿铁4.0"
				                                }],
				                                "subway_station_info": "小区距5号线金平路站步行约176米",
				                                "source": "search"
				    },
				    {
				                                "id": "20022062",
				                                "house_id": "20004753",
				                                "type": 1,
				                                "name": "灵石小区3居室-南卧",
				                                "price": ["//static8.ziroom.com/phoenix/pc/images/price/da4554c01a8c0563bf7fc106c3934722s.png", [7, 0, 0, 2]],
				                                "area": "11.2",
				                                "price_unit": "/月",
				                                "photo": "//img.ziroom.com/pic/house_images/g2m2/M00/F2/F2/CtgFCF0oUzKAOhqnADJbmqvamuQ787.jpg_C_240_180_Q100.jpg",
				                                "floor_total": "6",
				                                "floor": "4",
				                                "has_video": 0,
				                                "has_3d": 0,
				                                "sale_img": "",
				                                "type_text": "合租",
				                                "inv_id": "70365",
				                                "inv_no": "670153905",
				                                "code": "SHPT69939018_03",
				                                "house_code": "SHPT69939018",
				                                "turn": 0,
				                                "bedroom": 3,
				                                "parlor": 1,
				                                "resblock_id": "5011000016972",
				                                "resblock_name": "灵石小区",
				                                "lng": 121.430187,
				                                "lat": 31.271704,
				                                "face": "南",
				                                "photo_webp": "//img.ziroom.com/pic/house_images/g2m2/M00/F2/F2/CtgFCF0oUzKAOhqnADJbmqvamuQ787.jpg_C_240_180_Q100.jpg",
				                                "photo_min": "//img.ziroom.com/pic/house_images/g2m2/M00/F2/F2/CtgFCF0oUzKAOhqnADJbmqvamuQ787.jpg_C_240_180_Q100.webp",
				                                "photo_min_webp": "//img.ziroom.com/pic/house_images/g2m2/M00/F2/F2/CtgFCF0oUzKAOhqnADJbmqvamuQ787.jpg_C_240_180_Q100.webp",
				                                "house_type": 1,
				                                "area_order": 11.2,
				                                "sort_score": 8.767,
				                                "air_qualified": 1,
				                                "air_quality": 0,
				                                "activity_marks": [],
				                                "is_ai_lock": 1,
				                                "can_sign_date": 1565971200,
				                                "can_sign_time": 1562995804,
				                                "can_reserve_time": 0,
				                                "can_sign_long": 1,
				                                "sale_status": 3,
				                                "stock_status": "201",
				                                "apartment_type": 1,
				                                "commute_info": "",
				                                "title_tag": 1,
				                                "intro_list": [],
				                                "tags": [{
				                                    "title": "离地铁近"
				                                }, {
				                                    "title": "非首次出租"
				                                }, {
				                                    "title": "木棉4.0"
				                                }],
				                                "subway_station_info": "小区距7号线新村路站步行约253米",
				                                "source": "search"
				                            },
				    {
				                                "id": "62428409",
				                                "house_id": "60384035",
				                                "type": 1,
				                                "name": "华高二村3居室-南卧",
				                                "price": ["//static8.ziroom.com/phoenix/pc/images/price/da4554c01a8c0563bf7fc106c3934722s.png", [7, 8, 8, 2]],
				                                "area": "11.5",
				                                "price_unit": "/月",
				                                "photo": "//img.ziroom.com/pic/house_images/g2m2/M00/BC/4E/CtgFCV0d8T2ACsZ1AAJ-tzX8ib4557.JPG_C_240_180_Q100.jpg",
				                                "floor_total": "6",
				                                "floor": "4",
				                                "has_video": 1,
				                                "has_3d": 0,
				                                "sale_img": "",
				                                "type_text": "合租",
				                                "inv_id": "900198",
				                                "inv_no": "787319206",
				                                "code": "SHZRGY0819462526_03",
				                                "house_code": "SHZRGY0819462526",
				                                "turn": 0,
				                                "bedroom": 3,
				                                "parlor": 1,
				                                "resblock_id": "5011000012924",
				                                "resblock_name": "华高二村",
				                                "lng": 121.623003,
				                                "lat": 31.286956,
				                                "face": "南",
				                                "photo_webp": "//img.ziroom.com/pic/house_images/g2m2/M00/BC/4E/CtgFCV0d8T2ACsZ1AAJ-tzX8ib4557.JPG_C_240_180_Q100.jpg",
				                                "photo_min": "//img.ziroom.com/pic/house_images/g2m2/M00/BC/4E/CtgFCV0d8T2ACsZ1AAJ-tzX8ib4557.JPG_C_240_180_Q100.webp",
				                                "photo_min_webp": "//img.ziroom.com/pic/house_images/g2m2/M00/BC/4E/CtgFCV0d8T2ACsZ1AAJ-tzX8ib4557.JPG_C_240_180_Q100.webp",
				                                "house_type": 1,
				                                "area_order": 11.5,
				                                "sort_score": 8.752,
				                                "air_qualified": 1,
				                                "air_quality": 2,
				                                "activity_marks": [],
				                                "is_ai_lock": 1,
				                                "can_sign_date": 1565971200,
				                                "can_sign_time": 1562376722,
				                                "can_reserve_time": 0,
				                                "can_sign_long": 1,
				                                "sale_status": 3,
				                                "stock_status": "201",
				                                "apartment_type": 1,
				                                "commute_info": "",
				                                "title_tag": 1,
				                                "intro_list": [{
				                                    "icon": "https://image.ziroom.com/g2m1/M00/66/71/ChAFB1vk_OSAA2ZBAAAEqwrFIBo493.png",
				                                    "title": "空气质量已检测, 空置已超过30天",
				                                    "is_marked": 0
				                                }],
				                                "tags": [{
				                                    "title": "深呼吸",
				                                    "bg_img": "https://image.ziroom.com/g2m1/M00/42/73/ChAFBlvW2J6AZtJtAAAfl2T06pY936.png"
				                                }, {
				                                    "title": "离地铁近"
				                                }, {
				                                    "title": "布丁4.0"
				                                }],
				                                "subway_station_info": "小区距12号线金京路站步行约342米",
				                                "source": "search"
				                            },
				    {
				                                "id": "62503563",
				                                "house_id": "60397013",
				                                "type": 1,
				                                "name": "浦发绿城浦三路2801弄3居室-南卧",
				                                "price": ["//static8.ziroom.com/phoenix/pc/images/price/da4554c01a8c0563bf7fc106c3934722s.png", [7, 0, 6, 2]],
				                                "area": "11.7",
				                                "price_unit": "/月",
				                                "photo": "//img.ziroom.com/pic/house_images/g2m2/M00/7D/F5/CtgFCF1EQaiAQf9HAB1gIpFKVZo968.jpg_C_240_180_Q100.jpg",
				                                "floor_total": "6",
				                                "floor": "5",
				                                "has_video": 1,
				                                "has_3d": 0,
				                                "sale_img": "",
				                                "type_text": "合租",
				                                "inv_id": "925982",
				                                "inv_no": "789820254",
				                                "code": "SHZRGY0819475326_03",
				                                "house_code": "SHZRGY0819475326",
				                                "turn": 0,
				                                "bedroom": 3,
				                                "parlor": 1,
				                                "resblock_id": "5011000013259",
				                                "resblock_name": "浦发绿城浦三路2801弄",
				                                "lng": 121.54476,
				                                "lat": 31.161379,
				                                "face": "南",
				                                "photo_webp": "//img.ziroom.com/pic/house_images/g2m2/M00/7D/F5/CtgFCF1EQaiAQf9HAB1gIpFKVZo968.jpg_C_240_180_Q100.jpg",
				                                "photo_min": "//img.ziroom.com/pic/house_images/g2m2/M00/7D/F5/CtgFCF1EQaiAQf9HAB1gIpFKVZo968.jpg_C_240_180_Q100.webp",
				                                "photo_min_webp": "//img.ziroom.com/pic/house_images/g2m2/M00/7D/F5/CtgFCF1EQaiAQf9HAB1gIpFKVZo968.jpg_C_240_180_Q100.webp",
				                                "house_type": 1,
				                                "area_order": 11.7,
				                                "sort_score": 8.751,
				                                "air_qualified": 1,
				                                "air_quality": 2,
				                                "activity_marks": [],
				                                "is_ai_lock": 1,
				                                "can_sign_date": 1567353600,
				                                "can_sign_time": 1565748000,
				                                "can_reserve_time": 0,
				                                "can_sign_long": 1,
				                                "sale_status": 3,
				                                "stock_status": "201",
				                                "apartment_type": 1,
				                                "commute_info": "",
				                                "title_tag": 5,
				                                "intro_list": [{
				                                    "icon": "https://image.ziroom.com/g2m1/M00/66/71/ChAFB1vk_O6ASX5vAAAEQEpAQUE464.png",
				                                    "title": "空气质量已检测, 已空置15天",
				                                    "is_marked": 0
				                                }, {
				                                    "icon": "https://image.ziroom.com/g2m1/M00/67/9D/ChAFBlvk_PmAQNRIAAACNwPDlpM637.png",
				                                    "title": "预计2019-09-02可入住",
				                                    "is_marked": 0
				                                }],
				                                "tags": [{
				                                    "title": "深呼吸",
				                                    "bg_img": "https://image.ziroom.com/g2m1/M00/42/73/ChAFBlvW2J6AZtJtAAAfl2T06pY936.png"
				                                }, {
				                                    "title": "离地铁近"
				                                }, {
				                                    "title": "米苏4.0"
				                                }],
				                                "subway_station_info": "小区距11号线浦三路站步行约647米",
				                                "source": "search"
				                            },
				    {
				                                "id": "62497262",
				                                "house_id": "60395887",
				                                "type": 1,
				                                "name": "华高二村3居室-南卧",
				                                "price": ["//static8.ziroom.com/phoenix/pc/images/price/da4554c01a8c0563bf7fc106c3934722s.png", [7, 8, 6, 2]],
				                                "area": "12.5",
				                                "price_unit": "/月",
				                                "photo": "//img.ziroom.com/pic/house_images/g2m2/M00/84/32/CtgFCV1FiKOAekiQAAJAg7dNX2A503.JPG_C_240_180_Q100.jpg",
				                                "floor_total": "6",
				                                "floor": "3",
				                                "has_video": 1,
				                                "has_3d": 1,
				                                "sale_img": "",
				                                "type_text": "合租",
				                                "inv_id": "924527",
				                                "inv_no": "789679119",
				                                "code": "SHZRGY0819474236_01",
				                                "house_code": "SHZRGY0819474236",
				                                "turn": 0,
				                                "bedroom": 3,
				                                "parlor": 1,
				                                "resblock_id": "5011000012924",
				                                "resblock_name": "华高二村",
				                                "lng": 121.623003,
				                                "lat": 31.286956,
				                                "face": "南",
				                                "photo_webp": "//img.ziroom.com/pic/house_images/g2m2/M00/84/32/CtgFCV1FiKOAekiQAAJAg7dNX2A503.JPG_C_240_180_Q100.jpg",
				                                "photo_min": "//img.ziroom.com/pic/house_images/g2m2/M00/84/32/CtgFCV1FiKOAekiQAAJAg7dNX2A503.JPG_C_240_180_Q100.webp",
				                                "photo_min_webp": "//img.ziroom.com/pic/house_images/g2m2/M00/84/32/CtgFCV1FiKOAekiQAAJAg7dNX2A503.JPG_C_240_180_Q100.webp",
				                                "house_type": 1,
				                                "area_order": 12.5,
				                                "sort_score": 8.723,
				                                "air_qualified": 1,
				                                "air_quality": 2,
				                                "activity_marks": [],
				                                "is_ai_lock": 1,
				                                "can_sign_date": 1567440000,
				                                "can_sign_time": 1565920800,
				                                "can_reserve_time": 0,
				                                "can_sign_long": 1,
				                                "sale_status": 3,
				                                "stock_status": "201",
				                                "apartment_type": 1,
				                                "commute_info": "",
				                                "title_tag": 5,
				                                "intro_list": [{
				                                    "icon": "https://image.ziroom.com/g2m1/M00/66/71/ChAFB1vk_O6ASX5vAAAEQEpAQUE464.png",
				                                    "title": "空气质量已检测, 已空置14天",
				                                    "is_marked": 0
				                                }, {
				                                    "icon": "https://image.ziroom.com/g2m1/M00/67/9D/ChAFBlvk_PmAQNRIAAACNwPDlpM637.png",
				                                    "title": "预计2019-09-03可入住",
				                                    "is_marked": 0
				                                }],
				                                "tags": [{
				                                    "title": "深呼吸",
				                                    "bg_img": "https://image.ziroom.com/g2m1/M00/42/73/ChAFBlvW2J6AZtJtAAAfl2T06pY936.png"
				                                }, {
				                                    "title": "离地铁近"
				                                }, {
				                                    "title": "拿铁4.0"
				                                }],
				                                "subway_station_info": "小区距12号线金京路站步行约342米",
				                                "source": "search"
				                            },
				    {
				                                "id": "62462347",
				                                "house_id": "60389834",
				                                "type": 1,
				                                "name": "金光小区3居室-南卧",
				                                "price": ["//static8.ziroom.com/phoenix/pc/images/price/da4554c01a8c0563bf7fc106c3934722s.png", [7, 8, 0, 2]],
				                                "area": "11.1",
				                                "price_unit": "/月",
				                                "photo": "//img.ziroom.com/pic/house_images/g2m2/M00/23/67/CtgFCF0xvc-ANYnEAA2s34yWTGk919.jpg_C_240_180_Q100.jpg",
				                                "floor_total": "6",
				                                "floor": "6",
				                                "has_video": 1,
				                                "has_3d": 0,
				                                "sale_img": "",
				                                "type_text": "合租",
				                                "inv_id": "912754",
				                                "inv_no": "788537138",
				                                "code": "SHZRGY0819468283_01",
				                                "house_code": "SHZRGY0819468283",
				                                "turn": 0,
				                                "bedroom": 3,
				                                "parlor": 1,
				                                "resblock_id": "5011000009612",
				                                "resblock_name": "金光小区",
				                                "lng": 121.519165,
				                                "lat": 31.15065,
				                                "face": "南",
				                                "photo_webp": "//img.ziroom.com/pic/house_images/g2m2/M00/23/67/CtgFCF0xvc-ANYnEAA2s34yWTGk919.jpg_C_240_180_Q100.jpg",
				                                "photo_min": "//img.ziroom.com/pic/house_images/g2m2/M00/23/67/CtgFCF0xvc-ANYnEAA2s34yWTGk919.jpg_C_240_180_Q100.webp",
				                                "photo_min_webp": "//img.ziroom.com/pic/house_images/g2m2/M00/23/67/CtgFCF0xvc-ANYnEAA2s34yWTGk919.jpg_C_240_180_Q100.webp",
				                                "house_type": 1,
				                                "area_order": 11.1,
				                                "sort_score": 8.694,
				                                "air_qualified": 1,
				                                "air_quality": 2,
				                                "activity_marks": [],
				                                "is_ai_lock": 1,
				                                "can_sign_date": 1566144000,
				                                "can_sign_time": 1564884000,
				                                "can_reserve_time": 0,
				                                "can_sign_long": 1,
				                                "sale_status": 3,
				                                "stock_status": "201",
				                                "apartment_type": 1,
				                                "commute_info": "",
				                                "title_tag": 5,
				                                "intro_list": [{
				                                    "icon": "https://image.ziroom.com/g2m1/M00/66/71/ChAFB1vk_O6ASX5vAAAEQEpAQUE464.png",
				                                    "title": "空气质量已检测, 已空置29天",
				                                    "is_marked": 0
				                                }, {
				                                    "icon": "https://image.ziroom.com/g2m1/M00/67/9D/ChAFBlvk_PmAQNRIAAACNwPDlpM637.png",
				                                    "title": "预计2019-08-19可入住",
				                                    "is_marked": 0
				                                }],
				                                "tags": [{
				                                    "title": "深呼吸",
				                                    "bg_img": "https://image.ziroom.com/g2m1/M00/42/73/ChAFBlvW2J6AZtJtAAAfl2T06pY936.png"
				                                }, {
				                                    "title": "离地铁近"
				                                }, {
				                                    "title": "拿铁4.0"
				                                }],
				                                "subway_station_info": "小区距11号线三林站步行约367米",
				                                "source": "search"
				                            },
				    {
				                                "id": "62505385",
				                                "house_id": "60397334",
				                                "type": 1,
				                                "name": "通河一村2居室-南卧",
				                                "price": ["//static8.ziroom.com/phoenix/pc/images/price/da4554c01a8c0563bf7fc106c3934722s.png", [7, 4, 8, 2]],
				                                "area": "14.5",
				                                "price_unit": "/月",
				                                "photo": "//img.ziroom.com/pic/house_images/g2m2/M00/96/2D/CtgFCF1JRiOAQewnAChHZg72XT8173.jpg_C_240_180_Q100.jpg",
				                                "floor_total": "6",
				                                "floor": "5",
				                                "has_video": 1,
				                                "has_3d": 0,
				                                "sale_img": "",
				                                "type_text": "合租",
				                                "inv_id": "929420",
				                                "inv_no": "790153740",
				                                "code": "SHZRGY0819475719_02",
				                                "house_code": "SHZRGY0819475719",
				                                "turn": 0,
				                                "bedroom": 2,
				                                "parlor": 1,
				                                "resblock_id": "5011000013627",
				                                "resblock_name": "通河一村",
				                                "lng": 121.455213,
				                                "lat": 31.34101,
				                                "face": "南",
				                                "photo_webp": "//img.ziroom.com/pic/house_images/g2m2/M00/96/2D/CtgFCF1JRiOAQewnAChHZg72XT8173.jpg_C_240_180_Q100.jpg",
				                                "photo_min": "//img.ziroom.com/pic/house_images/g2m2/M00/96/2D/CtgFCF1JRiOAQewnAChHZg72XT8173.jpg_C_240_180_Q100.webp",
				                                "photo_min_webp": "//img.ziroom.com/pic/house_images/g2m2/M00/96/2D/CtgFCF1JRiOAQewnAChHZg72XT8173.jpg_C_240_180_Q100.webp",
				                                "house_type": 1,
				                                "area_order": 14.5,
				                                "sort_score": 8.692,
				                                "air_qualified": 1,
				                                "air_quality": 2,
				                                "activity_marks": [],
				                                "is_ai_lock": 1,
				                                "can_sign_date": 1567699200,
				                                "can_sign_time": 1566007200,
				                                "can_reserve_time": 0,
				                                "can_sign_long": 1,
				                                "sale_status": 3,
				                                "stock_status": "201",
				                                "apartment_type": 1,
				                                "commute_info": "",
				                                "title_tag": 5,
				                                "intro_list": [{
				                                    "icon": "https://image.ziroom.com/g2m1/M00/66/71/ChAFB1vk_O6ASX5vAAAEQEpAQUE464.png",
				                                    "title": "空气质量已检测, 已空置11天",
				                                    "is_marked": 0
				                                }, {
				                                    "icon": "https://image.ziroom.com/g2m1/M00/67/9D/ChAFBlvk_PmAQNRIAAACNwPDlpM637.png",
				                                    "title": "预计2019-09-06可入住",
				                                    "is_marked": 0
				                                }],
				                                "tags": [{
				                                    "title": "深呼吸",
				                                    "bg_img": "https://image.ziroom.com/g2m1/M00/42/73/ChAFBlvW2J6AZtJtAAAfl2T06pY936.png"
				                                }, {
				                                    "title": "离地铁近"
				                                }, {
				                                    "title": "木棉4.0"
				                                }],
				                                "subway_station_info": "小区距1号线通河新村站步行约821米",
				                                "source": "search"
				                            },
				    {
				                                "id": "62490512",
				                                "house_id": "60394650",
				                                "type": 1,
				                                "name": "好世凤凰城4居室-南卧",
				                                "price": ["//static8.ziroom.com/phoenix/pc/images/price/da4554c01a8c0563bf7fc106c3934722s.png", [7, 0, 6, 2]],
				                                "area": "18.5",
				                                "price_unit": "/月",
				                                "photo": "//img.ziroom.com/pic/house_images/g2m2/M00/43/35/CtgFCV04Fd2AGQN0AANrfD3lAlw679.jpg_C_240_180_Q100.jpg",
				                                "floor_total": "7",
				                                "floor": "4",
				                                "has_video": 1,
				                                "has_3d": 0,
				                                "sale_img": "",
				                                "type_text": "合租",
				                                "inv_id": "921705",
				                                "inv_no": "789405385",
				                                "code": "SHZRGY0819473051_05",
				                                "house_code": "SHZRGY0819473051",
				                                "turn": 0,
				                                "bedroom": 4,
				                                "parlor": 1,
				                                "resblock_id": "5011000015536",
				                                "resblock_name": "好世凤凰城",
				                                "lng": 121.398349,
				                                "lat": 31.096778,
				                                "face": "南",
				                                "photo_webp": "//img.ziroom.com/pic/house_images/g2m2/M00/43/35/CtgFCV04Fd2AGQN0AANrfD3lAlw679.jpg_C_240_180_Q100.jpg",
				                                "photo_min": "//img.ziroom.com/pic/house_images/g2m2/M00/43/35/CtgFCV04Fd2AGQN0AANrfD3lAlw679.jpg_C_240_180_Q100.webp",
				                                "photo_min_webp": "//img.ziroom.com/pic/house_images/g2m2/M00/43/35/CtgFCV04Fd2AGQN0AANrfD3lAlw679.jpg_C_240_180_Q100.webp",
				                                "house_type": 1,
				                                "area_order": 18.5,
				                                "sort_score": 8.689,
				                                "air_qualified": 1,
				                                "air_quality": 2,
				                                "activity_marks": [],
				                                "is_ai_lock": 1,
				                                "can_sign_date": 1566576000,
				                                "can_sign_time": 1564884000,
				                                "can_reserve_time": 0,
				                                "can_sign_long": 1,
				                                "sale_status": 3,
				                                "stock_status": "201",
				                                "apartment_type": 1,
				                                "commute_info": "",
				                                "title_tag": 5,
				                                "intro_list": [{
				                                    "icon": "https://image.ziroom.com/g2m1/M00/66/71/ChAFB1vk_O6ASX5vAAAEQEpAQUE464.png",
				                                    "title": "空气质量已检测, 已空置24天",
				                                    "is_marked": 0
				                                }, {
				                                    "icon": "https://image.ziroom.com/g2m1/M00/67/9D/ChAFBlvk_PmAQNRIAAACNwPDlpM637.png",
				                                    "title": "预计2019-08-24可入住",
				                                    "is_marked": 0
				                                }],
				                                "tags": [{
				                                    "title": "深呼吸",
				                                    "bg_img": "https://image.ziroom.com/g2m1/M00/42/73/ChAFBlvW2J6AZtJtAAAfl2T06pY936.png"
				                                }, {
				                                    "title": "离地铁近"
				                                }, {
				                                    "title": "木棉4.0"
				                                }],
				                                "subway_station_info": "小区距5号线银都路站步行约416米",
				                                "source": "search"
				                            },
				    {
				                                "id": "62477580",
				                                "house_id": "60392484",
				                                "type": 1,
				                                "name": "上泰花苑3居室-南卧",
				                                "price": ["//static8.ziroom.com/phoenix/pc/images/price/da4554c01a8c0563bf7fc106c3934722s.png", [7, 9, 8, 2]],
				                                "area": "13",
				                                "price_unit": "/月",
				                                "photo": "//img.ziroom.com/pic/house_images/g2m2/M00/66/64/CtgFCV0_Ap-AI4dFAAIDx-yTEdI250.jpg_C_240_180_Q100.jpg",
				                                "floor_total": "6",
				                                "floor": "4",
				                                "has_video": 1,
				                                "has_3d": 0,
				                                "sale_img": "",
				                                "type_text": "合租",
				                                "inv_id": "917020",
				                                "inv_no": "788950940",
				                                "code": "SHZRGY0819470906_02",
				                                "house_code": "SHZRGY0819470906",
				                                "turn": 0,
				                                "bedroom": 3,
				                                "parlor": 1,
				                                "resblock_id": "5011000016184",
				                                "resblock_name": "上泰花苑",
				                                "lng": 121.57003,
				                                "lat": 31.253643,
				                                "face": "南",
				                                "photo_webp": "//img.ziroom.com/pic/house_images/g2m2/M00/66/64/CtgFCV0_Ap-AI4dFAAIDx-yTEdI250.jpg_C_240_180_Q100.jpg",
				                                "photo_min": "//img.ziroom.com/pic/house_images/g2m2/M00/66/64/CtgFCV0_Ap-AI4dFAAIDx-yTEdI250.jpg_C_240_180_Q100.webp",
				                                "photo_min_webp": "//img.ziroom.com/pic/house_images/g2m2/M00/66/64/CtgFCV0_Ap-AI4dFAAIDx-yTEdI250.jpg_C_240_180_Q100.webp",
				                                "house_type": 1,
				                                "area_order": 13,
				                                "sort_score": 8.65,
				                                "air_qualified": 1,
				                                "air_quality": 2,
				                                "activity_marks": [],
				                                "is_ai_lock": 1,
				                                "can_sign_date": 1567008000,
				                                "can_sign_time": 1565661600,
				                                "can_reserve_time": 0,
				                                "can_sign_long": 1,
				                                "sale_status": 3,
				                                "stock_status": "201",
				                                "apartment_type": 1,
				                                "commute_info": "",
				                                "title_tag": 5,
				                                "intro_list": [{
				                                    "icon": "https://image.ziroom.com/g2m1/M00/66/71/ChAFB1vk_O6ASX5vAAAEQEpAQUE464.png",
				                                    "title": "空气质量已检测, 已空置19天",
				                                    "is_marked": 0
				                                }, {
				                                    "icon": "https://image.ziroom.com/g2m1/M00/67/9D/ChAFBlvk_PmAQNRIAAACNwPDlpM637.png",
				                                    "title": "预计2019-08-29可入住",
				                                    "is_marked": 0
				                                }],
				                                "tags": [{
				                                    "title": "深呼吸",
				                                    "bg_img": "https://image.ziroom.com/g2m1/M00/42/73/ChAFBlvW2J6AZtJtAAAfl2T06pY936.png"
				                                }, {
				                                    "title": "离地铁近"
				                                }, {
				                                    "title": "拿铁4.0"
				                                }],
				                                "subway_station_info": "小区距6号线德平路站步行约281米",
				                                "source": "search"
				                            },
				    {
				                                "id": "62378489",
				                                "house_id": "60375531",
				                                "type": 1,
				                                "name": "绿地清猗园(威廉公馆)3居室-南卧",
				                                "price": ["//static8.ziroom.com/phoenix/pc/images/price/da4554c01a8c0563bf7fc106c3934722s.png", [7, 0, 6, 2]],
				                                "area": "11.5",
				                                "price_unit": "/月",
				                                "photo": "//img.ziroom.com/pic/house_images/g2m2/M00/62/95/CtgFCV0Mv_eAeOqRAAKJihzaYIU087.JPG_C_240_180_Q100.jpg",
				                                "floor_total": "20",
				                                "floor": "7",
				                                "has_video": 1,
				                                "has_3d": 0,
				                                "sale_img": "",
				                                "type_text": "合租",
				                                "inv_id": "884052",
				                                "inv_no": "785753044",
				                                "code": "SHZRGY0819453856_03",
				                                "house_code": "SHZRGY0819453856",
				                                "turn": 0,
				                                "bedroom": 3,
				                                "parlor": 1,
				                                "resblock_id": "5011000001988",
				                                "resblock_name": "绿地清猗园(威廉公馆)",
				                                "lng": 121.324209,
				                                "lat": 31.3033,
				                                "face": "南",
				                                "photo_webp": "//img.ziroom.com/pic/house_images/g2m2/M00/62/95/CtgFCV0Mv_eAeOqRAAKJihzaYIU087.JPG_C_240_180_Q100.jpg",
				                                "photo_min": "//img.ziroom.com/pic/house_images/g2m2/M00/62/95/CtgFCV0Mv_eAeOqRAAKJihzaYIU087.JPG_C_240_180_Q100.webp",
				                                "photo_min_webp": "//img.ziroom.com/pic/house_images/g2m2/M00/62/95/CtgFCV0Mv_eAeOqRAAKJihzaYIU087.JPG_C_240_180_Q100.webp",
				                                "house_type": 1,
				                                "area_order": 11.5,
				                                "sort_score": 8.647,
				                                "air_qualified": 1,
				                                "air_quality": 2,
				                                "activity_marks": [],
				                                "is_ai_lock": 1,
				                                "can_sign_date": 1565971200,
				                                "can_sign_time": 1563746462,
				                                "can_reserve_time": 0,
				                                "can_sign_long": 1,
				                                "sale_status": 3,
				                                "stock_status": "201",
				                                "apartment_type": 1,
				                                "commute_info": "",
				                                "title_tag": 1,
				                                "intro_list": [{
				                                    "icon": "https://image.ziroom.com/g2m1/M00/66/71/ChAFB1vk_OSAA2ZBAAAEqwrFIBo493.png",
				                                    "title": "空气质量已检测, 空置已超过30天",
				                                    "is_marked": 0
				                                }],
				                                "tags": [{
				                                    "title": "深呼吸",
				                                    "bg_img": "https://image.ziroom.com/g2m1/M00/42/73/ChAFBlvW2J6AZtJtAAAfl2T06pY936.png"
				                                }, {
				                                    "title": "离地铁近"
				                                }, {
				                                    "title": "木棉4.0"
				                                }],
				                                "subway_station_info": "小区距11号线南翔站步行约661米",
				                                "source": "search"
				                            }
				],
				loadingText: '正在加载...'
			};
		},
		onLoad() {
			// // #ifdef MP
			// //小程序隐藏返回按钮
			// this.showBack = false;
			// // #endif
			// this.amapPlugin = new amap.AMapWX({
			// 	//高德地图KEY，随时失效，请务必替换为自己的KEY，参考：http://ask.dcloud.net.cn/article/35070
			// 	key: '9ed923f211c10ddace864fd7309ebb71'
			// });
			// //定位地址
			// this.amapPlugin.getRegeo({
			// 	success: data => {
			// 		this.city = data[0].regeocodeData.addressComponent.city.replace(/市/g, ''); //把"市"去掉
			// 		// #ifdef APP-PLUS
			// 		this.nVueTitle.postMessage({type: 'location',city:this.city});
			// 		// #endif
			// 	}
			// });

		},
		onPageScroll(e) {
			//锚点切换
			// this.selectAnchor = e.scrollTop>=this.anchorlist[2].top?2:e.scrollTop>=this.anchorlist[1].top?1:0;
			// //导航栏渐变
			// let tmpY = 375;
			// e.scrollTop = e.scrollTop > tmpY ? 375 : e.scrollTop;
			// this.afterHeaderOpacity = e.scrollTop * (1 / tmpY);
			// this.beforeHeaderOpacity = 1 - this.afterHeaderOpacity;
			// //切换层级
			// this.beforeHeaderzIndex = e.scrollTop > 0 ? 10 : 11;
			// this.afterHeaderzIndex = e.scrollTop > 0 ? 11 : 10;
		},
		methods: {
			toggleTab (item) {
				this.activeTab = item.value
			},
			 
			toGoods () {
				uni.navigateTo({
					url:'/pages/rent/detail'
				})
			},
			release () {
				uni.showToast({title: '注册成功',icon:"success"});
				uni.navigateTo({
					url:'/pages/release/release'
				})
				
			},
			// 清空搜索
			clearKeyword (){
				
			},
			// 搜索
			toSearch () {
				
			},
			//跳转锚点
			toAnchor(index){
				this.selectAnchor = index;
				uni.pageScrollTo({scrollTop: this.anchorlist[index].top,duration: 200});
			},
			//消息列表
			toMsg(){
				uni.navigateTo({
					url:'../msg/msg'
				})
			}
		},
		// #ifndef MP
		// 标题栏input搜索框点击
		// onNavigationBarSearchInputClicked: async function(e) {
		// 	this.$api.msg('点击了搜索框');
		// },
		//点击导航栏 buttons 时触发
		// onNavigationBarButtonTap(e) {
		// 	const index = e.index;
		// 	if (index === 0) {
		// 		this.$api.msg('点击了扫描');
		// 	} else if (index === 1) {
		// 		// #ifdef APP-PLUS
		// 		const pages = getCurrentPages();
		// 		const page = pages[pages.length - 1];
		// 		const currentWebview = page.$getAppWebview();
		// 		currentWebview.hideTitleNViewButtonRedDot({
		// 			index
		// 		});
		// 		// #endif
		// 		uni.navigateTo({
		// 			url: '/pages/notice/notice'
		// 		})
		// 	}
		// }
		// #endif
	}
</script>

<style lang="scss">
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
				display: flex;
				width: 100%;
				border-radius: 20upx;
				background-color: #fff;
				margin: 0 0 15upx 0;
				padding-bottom: 16upx;
				box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.1);
				image {
					width: 38%;
					border-radius: 20upx 20upx 0 0;
				}
				.content{
					width: 58%;
					.container {
						width: 92%;
						padding: 10upx 4%;
					}
					.address{
						font-size: $uni-font-size-base;
					}
				}
				.name {
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					text-align: justify;
					overflow: hidden;
					font-size: 30upx;
				}
				.info {
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					padding: 10upx 0 10upx;
					font-size: $uni-font-size-lg;

					.price {
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

	// 切换tab
	.tab-top-wraper{
		display: flex;
		background-color: #fff;
		height: 80upx;
		line-height: 80upx;
		margin-bottom: 20upx;
		.tab-item{
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
	.input-box-wraper{
		display: flex;
		align-items: center;
		height: 84upx;
		margin-top: 100upx;
		background-color: #fff;
		.release-text{
			flex-shrink: 0;
			width: 160upx;
			font-size: $font-base;
			color: $font-color-orange;
			text-align: center;
		}
		.center-input{
			width: 100%;
			display: flex;
			background-color: #f5f5f5;
			border-radius: 24upx;
			uni-input{
				flex: 1;
				padding-left: 20upx;
				height: 60upx;
				line-height: 60upx;
				padding: 0 16upx;
				font-size: $font-base !important;
			}
			// .uni-input-input{
			// 	padding-left: 20upx;
			// 	padding: 0 16upx;
			// 	font-size: $font-base;
			// }
			// .clear-icon{
			// 	width: 52upx;
			// 	height: 60upx;
			// 	line-height: 60upx;
			// }
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
					font-size: 42upx;
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
</style>
