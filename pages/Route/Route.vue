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
					<view class="text-gray" v-else>有{{busDetail.buses.length}}辆车</view>
				</view>
			</view>
			<view class="flex padding" :class="busDetail.stations.length<8?'justify-center':''" style="overflow-x: scroll;width:100%">
				<view class="text-black" v-for="(item,index) in busDetail.stations" :key="index" @click="selectBus(index)">
					<view style="height: 80upx;">
						<view v-if="item.bus">
							<view v-if="item.distance != 0 " class="text-xs text-gray next">{{item.distance}}米<text class="cuIcon-right"></text></view>
							<view v-else class="text-xs text-red">已到站</view>
							<image class="car" :class="item.distance != 0 ? 'next':''" src="/static/car.png"></image>
						</view>
					</view>
					<view v-if="index==0" class="staname1 text-bold padding-top">{{item.bus_staname}}</view>
					<view v-else-if="index == busDetail.stations.length-1" :class="select==index?'text-yellow':''" class="staname2 text-bold padding-top">{{item.bus_staname}}</view>
					<view v-else class="staname text-bold padding-top" :class="select==index?'text-yellow':''" >{{item.bus_staname}}</view>
				</view>
			</view>
		</view>
		<view class="text-center" v-else style="margin-top: 300upx;">
			<image src="../../static/bus.png" style="width: 200upx;height: 200upx;"></image>
		</view>
		<view class="cu-tabbar-height"></view>
		<view class="cu-bar tabbar bg-white text-blue text-bold shadow foot">
			<view class="action" @click="getDetail">
				<view class="cuIcon-cu-image">
					<text class="cuIcon-refresh"></text>
				</view>
				<view>刷新</view>
			</view>
			<view class="action" @click="getOtherLine">
				<view class="cuIcon-cu-image">
					<text class="cuIcon-order"></text>
				</view>
				<view>换向</view>
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
				select:false
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
					var busDetail = res.data.returl_list
					for (var i = 0; i < busDetail.stations.length; i++) {
						for (var j = 0; j < busDetail.buses.length; j++) {
							if (busDetail.buses[j].dis_stat - 1 == i) {
								busDetail.stations[i].bus = true
								busDetail.stations[i].distance = busDetail.buses[j].distance
							}
						}
					}
					this.busDetail = busDetail
				}, error => {
					console.log(error)
				})
			},
			selectBus(index){
				this.select = index
			}
		}
	}
</script>

<style>
	.car {
		width: 32upx;
		height: 32upx;
	}
	.next{
		margin-left: -40upx;
	}
	.staname {
		border-top: 10upx solid #F0AD4E;
		writing-mode: vertical-lr;
		text-align: center;
		width: 90upx;
	}
  
	.staname::after {
		content: "";
		width: 20upx;
		height: 20upx;
		position: relative;
		top: -45upx;
		right: 30upx;
		border-radius: 50%;
		display: block;
		box-sizing: border-box;
		background: white;
		border: 5upx solid #F0AD4E;
	}
	.staname1{
		border-top: 10upx solid #F0AD4E;
		writing-mode: vertical-lr;
		text-align: center;
		width: 90upx;
	}
	.staname1::after {
		content: "";
		width: 30upx;
		height: 30upx;
		position: relative;
		top: -50upx;
		right: 43upx;
		border-radius: 50%;
		display: block;
		box-sizing: border-box;
		background: white;
		border: 5upx solid #4CD964;
	}
	.staname2{
		border-top: 10upx solid #FFFFFF;
		writing-mode: vertical-lr;
		text-align: center;
		width: 90upx;
	}
	.staname2::after {
		content: "";
		width: 30upx;
		height: 30upx;
		position: relative;
		top: -50upx;
		right: 43upx;
		border-radius: 50%;
		display: block;
		box-sizing: border-box;
		background: white;
		border: 5upx solid #DD514C;
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
