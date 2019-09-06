<template>
	<view>
		<view style="margin-top: 110upx;text-align: center;">选择任务类型</view>
		<button style="width: 42%;margin: 80upx auto;"
		 @tap="goPrelease"
		 type="primary">预租房(组团)
		</button>
		<button style="width: 38%;margin: 60upx auto;"
		 @tap="goRentsharing"
		 type="primary">合租房
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
			// 发布预租房
			goPrelease() {
				uni.navigateTo({
					url:'/pages/release/prelease'
				})
			},
			// 发布合租房
			goRentsharing() {
				uni.navigateTo({
					url:'/pages/release/rentsharing'
				})
			},
		}
	}
</script>

<style>

</style>
