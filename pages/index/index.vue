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
				<input style="flex: 1;" @confirm="InputBlur" :adjust-position="false" :value="searchBus" @input="searchBus = $event.detail.value"
				 type="text" placeholder="搜索公交线路" confirm-type="search"></input>
				<view class="padding-left padding-right-sm" v-show="searchBus" @click="searchBus = ''">
					<text class="cuIcon-backdelete"></text>
				</view>
				<view class="padding-left solids-left" @click="InputBlur(searchBus)">
					<text v-if="!animationSearch" class="cuIcon-search text-bold text-blue"></text>
					<text v-else class="cuIcon-loading2 text-cyan"></text>
				</view>
			</view>
		</view>
		<view class="padding text-gray flex align-center flex-wrap">
			<view class="padding">搜索历史</view>
			<view v-for="(item,index) in searchList" :key="index" class="cu-tag radius bg-white text-gray" @click="getBusList(item)">{{item}}</view>
			<view class="padding-left" @click="reMove"><text class="cuIcon-delete"></text></view>
		</view>
		<view class="margin bg-white" v-if="History !=''">
			<view class="text-bold padding">历史线路</view>
			<view v-for="(item,index) in History" :key="index" @click="getDetail(item)" class="text-bold padding solid-bottom">
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
				searchList: [],
				weather: {},
				History: []
			}
		},
		onLoad(option) {
			var that = this
			let ss = uni.getStorageSync('searchList')
			let History = uni.getStorageSync('History')
			if (ss) {
				that.searchList = ss
			}
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
		onPageScroll: function(e) {
			// console.log(e.scrollTop);//{scrollTop:99}
			if (e.scrollTop > 280) {
				this.fixed_top = true
			} else {
				this.fixed_top = false
			}
		},
		methods: {
			goTo() {
				uni.navigateTo({
					url: "../select_city/select_city?city=" + this.city
				})
			},
			reMove() {
				this.searchList = []
				uni.removeStorageSync('searchList')
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
			// 获取当前地理位置
			/* getLocal(latitude, longitude) {
			    let that = this;
			    that.$QQMapWX.reverseGeocoder({
			      location: {
			        latitude: latitude,
			        longitude: longitude
			      },
			      success: function (res) {
			        console.log('resres',res);
					 that.city  = res.result.ad_info.city
					 that.getCityid(res.result.ad_info.city)
					 
			      },
			      fail: function (res) {
			        console.log(res);
			      },
			      complete: function (res) {
			        // console.log(res);
			      }
			    });
			  }, */
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
					}
					if (this.searchList != '' && this.searchList.indexOf(keywords) == -1) {
						this.searchList.push(keywords)
						uni.setStorageSync('searchList', this.searchList)
					} else if (this.searchList == '') {
						this.searchList[0] = keywords
						uni.setStorageSync('searchList', this.searchList)
					}
					that.busList = res.data.returl_list
				}, error => {
					console.log(error)
				})
			},
			getDetail(item) {
				console.log(item)
				if (this.History != '' && this.History.indexOf(item) == -1) {
					this.History.push(item)
					uni.setStorageSync('History', this.History)
				} else if (this.History == '') {
					this.History[0] = item
					uni.setStorageSync('History', this.History)
				}
				uni.navigateTo({
					url: "../Route/Route?bus_linenum=" + item.bus_linenum + "&bus_linestrid=" + item.bus_linestrid + "&bus_staname=" +
						item.bus_staname + "&cityid=" + this.cityid
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
</style>
