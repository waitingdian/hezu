<template>
	<view>
		<cu-custom bgColor="uni-custom-header-color" :isBack="true">
			<block slot="backText" @tap="BackPage">返回</block>
			<block slot="content">发布</block>
		</cu-custom>
		<view style="margin-top: 110upx;text-align: center;font-size: 28rpx;">选择任务类型</view>
		<button style="width: 48%;margin: 80upx auto;font-size: 38rpx;"
		 @tap="goPrelease"
		 type="primary">我无房<text class="padding-left-xs" style="font-size: 26rpx;">(预发布合租)</text>
		</button>
		<button style="width: 48%;margin: 60upx auto;font-size: 38rpx;"
		 @tap="goRentsharing"
		 type="primary">我有房<text class="padding-left-xs" style="font-size: 26rpx;">(招室友)</text>
		</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 发布预租房
			goPrelease() {
				uni.navigateTo({
					url:'/pages/release/prelease'
				})
			},
			// 发布合租房
			goRentsharing() {
				uni.navigateTo({
					// url:'/pages/release/prelease1'
					url:'/pages/release/rentsharing'
				})
			},
		}
	}
</script>

<style>

</style>
