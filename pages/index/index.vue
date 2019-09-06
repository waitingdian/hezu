<template>
	<view class="content">
		<view class="text-area">
			<text class="title">{{title}}</text>here111~
		</view>
		<navigator url="/pages/index/index" hover-class="navigator-hover">
                    <button type="default">跳转到新页面1</button>
                </navigator>
                <navigator url="/pages/list/index" redirect hover-class="other-navigator-hover">
                    <button type="default">在当前页打开2</button>
        </navigator>
		<navigator url="/pages/shophome/index" redirect hover-class="other-navigator-hover">
		            <button type="default">shophome</button>
		</navigator>
		<navigator url="/pages/login" redirect hover-class="other-navigator-hover">
		            <button type="default">登录</button>
		</navigator>
		<navigator url="/pages/home/home" redirect hover-class="other-navigator-hover">
		            <button type="default">home11</button>
		</navigator>
		<button type="default" @click="goHome">home22</button>
		<navigator url="/pages/homecity/homecity" hover-class="other-navigator-hover">
		            <button type="default">homecity</button>
		</navigator>
		<navigator url="/pages/user/setting/setting" hover-class="other-navigator-hover">
		            <button type="default">设置</button>
		</navigator>
		<navigator url="/pages/tabBar/cart/cart" hover-class="other-navigator-hover">
		            <button type="default">购物车</button>
		</navigator>
		<view class="" @tap="toSetting">
			viwewwwww
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
			goHome () {
				uni.navigateTo({
					url:'/pages/home/home'
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50upx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
