<template>
	<view class="content">
		<view class="bg-gradual-blue padding" :style="[{paddingTop:CustomBar+ 'px'}]">
			<block v-if="weather.status =='ok'">
				<view class="flex justify-between align-start padding-top" @click="goTo">
					<view class="flex align-center">
						<view class="text-bold text-xl">
							{{weather.basic.parent_city}} <text v-if="weather.basic.parent_city != weather.basic.location">
								{{weather.basic.location}}</text>
							<text class="cuIcon-location"></text>
						</view>
						<view class='cu-tag  radius bg-cyan radius sm'>切换</view>
					</view>
					<view class="text-xs">{{weather.update.loc}}</view>
				</view>
				<view class="flex align-end">
					<view class="text-bold text-xsl text-shadow">
						{{weather.now.tmp}}°
					</view>
					<view class="padding-sm text-center">
						<view class="">
							<image style="width: 60upx;height: 60upx;" :src="'https://cdn.heweather.com/cond_icon/'+weather.now.cond_code+'.png'"></image>
						</view>
						<view class="">{{weather.now.cond_txt}}</view>
					</view>
					<view class="padding-sm">
						<text>{{weather.now.wind_dir}}</text>
						<text> {{weather.now.wind_sc}}级</text>
						<text class="padding-left-sm">湿度{{weather.now.hum}}%</text>
					</view>
				</view>
			</block>
			<block v-else>
				<view class="padding-top padding-bottom" @click="goTo">
					<view class="flex align-center">
						<view class="text-bold text-xl">
							{{city}}<text class="cuIcon-location"></text>
						</view>
						<view class='cu-tag  radius bg-cyan radius sm'>切换</view>
					</view>
					<view class="">暂无天气信息</view>
				</view>
			</block>
			<view class="flex align-center justify-between searchform bg-white solid shadow padding text-xl radius basis-sm"
			 :class="animation?'animation-shake':''">
				<input style="flex: 1;" @confirm="InputBlur" @focus="busList = ''" :adjust-position="false" :value="searchBus"
				 @input="searchBus = $event.detail.value" type="text" placeholder="搜索公交线路" confirm-type="search"></input>
				<view class="padding-left padding-right-sm" v-show="searchBus" @click="searchBus = busList ='' ">
					<text class="cuIcon-backdelete"></text>
				</view>
				<view class="padding-left solids-left" @click="InputBlur(searchBus)">
					<text v-if="!animationSearch" class="cuIcon-search text-bold text-blue"></text>
					<text v-else class="cuIcon-loading2 text-cyan"></text>
				</view>
			</view>
		</view>
		<view class="bg-white padding">
			<view class="grid text-center col-2">
				<view class="solids-right" @click="routePlan">
					<image class="grid-img" src="/static/1.png"></image>
					<view class="">路线规划</view>
				</view>
				<view class="" @click="goSubway">
					<image class="grid-img" src="/static/3.png"></image>
					<view class="">地铁图</view>
				</view>
				<!-- <view @click="chooseLocation">
					<image class="grid-img" src="/static/2.png"></image>
					<view class="">地图选点</view>
				</view> -->
			</view>
		</view>
		<view class="margin bg-white" v-if="History !='' && busList ==''">
			<view class="text-bold padding">历史线路</view>
			<view v-for="(item,index) in History" :key="index" @click="getHistory(item)" class="text-bold padding solid-bottom">
				<view class="flex justify-between">
					<view class="">
						<text class="cuIcon-titles text-cyan"></text> {{item.bus_staname}} 路
					</view>
					<view class="text-gray text-sm">
						终点站: {{item.bus_endstan}}
					</view>
				</view>
			</view>
		</view>
		<view class="margin bg-white" v-if="busList !=''">
			<view class="text-bold padding">搜索结果</view>
			<view v-for="(item,index) in busList" :key="index" @click="getDetail(item)" class="text-bold padding solid-bottom">
				<view class="flex justify-between">
					<view class="">
						<text class="cuIcon-titles text-yellow"></text> {{item.bus_staname}} 路
					</view>
					<view class="text-gray text-sm">
						终点站: {{item.bus_endstan}}
					</view>
				</view>
			</view>
		</view>
		<view class="text-center" v-else>
			<image src="../../static/bus.png" style="width: 100upx;height: 100upx;"></image>
		</view>
	</view>
</template>
<script>
	import citysArray from '../../utils/citys.js';
	const chooseLocation = requirePlugin('chooseLocation')
	export default {
		data() {
			return {
				animation: false,
				animationSearch: false,
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				cityArray: citysArray,
				dataList: [],
				city: '',
				cityid: '',
				busList: [],
				searchBus: '',
				fixed_top: false,
				weather: {},
				History: [],
				locationInfo: {},
				key: 'Q7VBZ-F6NW5-UTTIF-QFN5D-MYAHZ-NWBSZ', //使用在腾讯位置服务申请的key
				referer: '查查BUS' //调用插件的app的名称
			}
		},
		onShow() {
			const location = chooseLocation.getLocation();
			console.log('location', location)
			if (location) {
				//this.routePlan(location)
			}
		},
		onLoad(option) {
			var that = this
			let History = uni.getStorageSync('History')
			if (History) {
				that.History = History
			}
			console.log(option)
			if (option.city) {
				var ccitydetile = JSON.parse(option.city)
				that.city = ccitydetile.city
				that.cityid = ccitydetile.cityid
				that.getWeather(ccitydetile.city)
				return
			}
			if (that.cityid != '') {
				return
			}
			uni.authorize({
				scope: 'scope.userLocation',
				success() {
					uni.getLocation({
						type: 'gcj02',
						success: function(res) {
							that.locationInfo = res
							console.log('当前位置的经度：' + res.longitude);
							console.log('当前位置的纬度：' + res.latitude);
							that.getWeather(res.latitude + ',' + res.longitude)
							//that.getLocal(res.latitude,res.longitude)
						}
					});
				}
			})


		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '妈妈再也不用担心我错过公交车了！',
				imageUrl: '/static/sh2.jpg',
				path: '/pages/index/index'
			}
		},
		methods: {
			goTo() {
				uni.navigateTo({
					url: "../select_city/select_city?city=" + this.city
				})
			},
			chooseLocation() {
				let category = '公交车站,地铁站,火车站'
				let location = JSON.stringify({
					latitude: this.locationInfo.latitude,
					longitude: this.locationInfo.longitude
				});
				uni.navigateTo({
					url: 'plugin://chooseLocation/index?key=' + this.key + '&referer=' + this.referer + '&location=' + location +
						'&category=' + category
				});
			},
			goSubway() {
				let plugin = requirePlugin("subway");
				uni.navigateTo({
					url: 'plugin://subway/index?key=' + this.key + '&referer=' + this.referer
				});
			},
			routePlan(loca) {
				let plugin = requirePlugin('routePlan');
				let endPoint = JSON.stringify({ //终点
					'name': loca.name,
					latitude: loca.latitude || this.locationInfo.latitude,
					longitude: loca.longitude || this.locationInfo.longitude
				});
				uni.navigateTo({
					url: 'plugin://routePlan/index?key=' + this.key + '&referer=' + this.referer + '&endPoint=' + endPoint
				});
			},
			//获取天气
			getWeather(city) {
				let that = this
				let data = {
					url: 's6/weather/now',
					method: 'post'
				}
				let param = {
					location: city,
					key: '573a0b25ec3944e7b90833d324ae70a7'
				}
				that.$request.httpRequest(data, param, 2).then(res => {
					console.log(res.data)
					var weather = res.data.HeWeather6[0]
					if (weather.status == 'ok') {
						//that.city = weather.basic.parent_city+'市'
						if (that.cityid == '') {
							that.getCityid(weather.basic.parent_city + '市')
						}
						weather.update.loc = that.timeChangeover(weather.update.loc)
						that.weather = weather
					}
				}, error => {
					console.log(error)
				})
			},
			getCityid(name) {
				for (var i = 0; i < this.cityArray.length; i++) {
					for (var j = 0; j < this.cityArray[i].list.length; j++) {
						if (this.cityArray[i].list[j]["city"] == name) {
							console.log('cityid', this.cityArray[i].list[j].cityid)
							this.cityid = this.cityArray[i].list[j].cityid
						}
					}

				}
			},
			InputBlur(e) {
				console.log(e)

				if (this.cityid == '') {
					this.animation = true
					setTimeout(() => {
						this.animation = false;
					}, 500)
					uni.showModal({
						title: '提示',
						content: '无法获取当前定位',
						showCancel: false
					})
					return
				}
				var keywords = e.detail ? e.detail.value : e
				if (keywords == '') {
					this.animation = true
					setTimeout(() => {
						this.animation = false;
					}, 500)
					uni.showToast({
						title: '请输入线路',
						icon: 'none'
					})
					return
				}
				this.animationSearch = true
				setTimeout(() => {
					this.animationSearch = false;
				}, 500)
				this.getBusList(keywords)
			},
			getBusList(keywords) {
				uni.showLoading({
					title: '加载中'
				})
				var that = this
				let data = {
					url: 'rt_bus_luxian',
					method: 'post',
				}
				let param = {
					cityid: that.cityid,
					keywords: keywords
				}
				that.$request.httpTokenRequest(data, param).then(res => {
					uni.hideLoading()
					console.log(res.data)
					if (res.data.error_code == '003') {
						uni.showModal({
							title: '提示',
							content: res.data.error_msg,
							showCancel: false
						})
						return
					} else {
						that.busList = res.data.returl_list
					}
				}, error => {
					console.log(error)
				})
			},
			getDetail(item) {
				console.log(item)
				item.cityid = this.cityid
				var History = this.History
				if (History == '') {
					History[0] = item
					this.History = History
					uni.setStorageSync('History', History)
				} else {
					var exit = false
					for (var i = 0; i < History.length; i++) {
						if (item.bus_staname == History[i].bus_staname) {
							exit = false
							break;
						} else {
							exit = true
						}
					}
					if (exit) {
						History.unshift(item)
						History.splice(5, 1)
						this.History = History
						uni.setStorageSync('History', History)
					}
				}
				uni.navigateTo({
					url: "../Route/Route?bus_linenum=" + item.bus_linenum + "&bus_linestrid=" + item.bus_linestrid + "&bus_staname=" +
						item.bus_staname + "&cityid=" + this.cityid
				})
			},
			getHistory(item) {
				console.log(item)
				uni.navigateTo({
					url: "../Route/Route?bus_linenum=" + item.bus_linenum + "&bus_linestrid=" + item.bus_linestrid + "&bus_staname=" +
						item.bus_staname + "&cityid=" + item.cityid
				})
			},
			timeChangeover: function(time) {
				var result;
				var minute = 1000 * 60;
				var hour = minute * 60;
				var day = hour * 24;
				var halfamonth = day * 15;
				var month = day * 30;
				var now = new Date().getTime();
				if (time) {
					time = time.replace(/-/g, '/');
				}
				var dateTimeStamp = Date.parse(time);
				var diffValue = now - dateTimeStamp;
				if (diffValue < 0) {
					return;
				}
				var monthC = diffValue / month;
				var weekC = diffValue / (7 * day);
				var dayC = diffValue / day;
				var hourC = diffValue / hour;
				var minC = diffValue / minute;
				if (monthC >= 1) {
					if (monthC <= 12) {
						result = "" + parseInt(monthC) + "月前";
					} else {
						// result = "" + parseInt(monthC / 12) + "年前";
						result = formatTime(new Date(time));
					}
				} else if (weekC >= 1) {
					result = "" + parseInt(weekC) + "周前";
				} else if (dayC >= 1) {
					result = "" + parseInt(dayC) + "天前";
				} else if (hourC >= 1) {
					result = "" + parseInt(hourC) + "小时前";
				} else if (minC >= 1) {
					result = "" + parseInt(minC) + "分钟前";
				} else {
					result = "刚刚";
				}
				return result;
			},

		}
	}
</script>

<style>
	.center_box {
		margin-top: 100upx;
	}

	.grid-img {
		width: 64upx;
		height: 64upx;
	}
</style>
