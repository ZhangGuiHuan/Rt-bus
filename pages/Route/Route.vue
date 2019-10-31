<template>
	<view>
		<view class="bg-white" v-if="busDetail != ''">
			<view class="padding">
				<view class="flex justify-between padding-bottom">
					<view class="text-bold text-xl"><text class="cuIcon-titles text-yellow"></text>{{busDetail.lineinfo.bus_staname}}路</view>
					<view class="text-gray">{{busDetail.lineinfo.fir_time}} 至 {{busDetail.lineinfo.end_time}}</view>
				</view>
				<view class="padding-bottom">起始站:{{busDetail.lineinfo.sta_sta}}</view>
				<view class="padding-bottom">终点站:{{busDetail.lineinfo.end_sta}}</view>
				<view class="flex justify-between">
					<view>票价:{{busDetail.lineinfo.bus_money || '2~5元'}}</view>
					<view class="text-gray" v-if="busDetail.buses ==''">暂未发车</view>
					<view class="text-gray" v-else>目前有{{busDetail.buses.length}}辆车在该线路上</view>
				</view>
			</view>
			<view class="flex padding-bottom padding-top justify-center" style="overflow-x: scroll;">
				<view class="text-black" v-for="(item,index) in busDetail.stations" :key="index">
					<!-- <view class="flex" v-for="(it,key) in busDetail.buses" :key="key">
						<block v-if="it.dis_stat-1 == index">
							<image class="car" src="/static/car.png"></image>
							<view v-if="it.distance != 0 " class="text-sm text-gray">(距离下一站还有{{it.distance}}米)</view>
							<view v-else-if="it.distance == 0 " class="text-red">已到:{{item.bus_staname}}</view>
						</block>
					</view> -->
						<view class="staname text-bold padding-top">{{item.bus_staname}}</view>
				</view>
			</view>
		</view>
		<view class="text-center" v-else style="margin-top: 300upx;">
			<image src="../../static/bus.png" style="width: 200upx;height: 200upx;"></image>
		</view>
		<view class="cu-tabbar-height"></view>
		<view class="cu-bar tabbar bg-white text-yellow shadow foot">
			<view class="action" @click="getDetail">
				<view class="cuIcon-cu-image">
					<text class="cuIcon-refresh"></text>
				</view>
				<view class="text-yellow">刷新</view>
			</view>
			<view class="action" @click="getOtherLine">
				<view class="cuIcon-cu-image">
					<text class="cuIcon-order"></text>
				</view>
				<view class="">换向</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bus_num: {},
				cityid: -1,
				busDetail: [],
			}
		},
		onLoad(option) {
			console.log(option.item)
			this.bus_num.bus_linenum = option.bus_linenum
			this.bus_num.bus_linestrid = option.bus_linestrid
			this.bus_num.bus_staname = option.bus_staname
			this.cityid = option.cityid
			this.getDetail()
		},
		methods: {
			getOtherLine() {
				this.bus_num.bus_linestrid = this.busDetail.lineinfo.other_lineid
				this.getDetail()
			},
			//详细详细信息
			getDetail(other_lineid) {
				uni.showLoading({
					title: '加载中'
				})
				let data = {
					url: 'rt_bus_rt',
					method: 'post'
				}
				let bus_num = this.bus_num
				let param = {
					cityid: this.cityid,
					bus_linenum: bus_num.bus_linenum,
					bus_linestrid: bus_num.bus_linestrid,
					bus_staname: bus_num.bus_staname
				}
				this.$request.httpTokenRequest(data, param).then(res => {
					uni.hideLoading()
					console.log(res.data)
					this.searchBus = true
					this.busDetail = res.data.returl_list
				}, error => {
					console.log(error)
				})
			}
		}
	}
</script>

<style>
	.car {
		width: 32upx;
		height: 32upx;
		margin-right: 10upx;
	}

	.staname {
		border-top: 5px solid #F0AD4E;
		writing-mode: vertical-lr;
		text-align: center;
		width: 90upx;
	}
	.staname::after{
		content: "";
		width: 10upx;
		height: 10upx;
		position: relative;
		top: -40upx;
		right: 30upx;
		border-radius: 50%;
		display: block;
		background: white;
		border: 2px solid #F0AD4E;
	}
	.staname_icon {
		width: 20upx;
		height: 10upx;
		position: absolute;
		left: 60upx;
		border-top-right-radius: 5upx;
		border-bottom-right-radius: 5upx;
		content: "";
		background: #F0AD4E;
	}
</style>
