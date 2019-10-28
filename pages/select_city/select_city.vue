<template>
	<view>
	<!-- 	<cu-custom bgColor="bg-white" :city="chooesCity" :isBack="true"><block slot="backText">返回</block>
			<block slot="content">当前城市:{{current}}</block>
		</cu-custom> -->
		<view class="select-city-wrap">
			  <view class="select-city" >
			    <scroll-view :scroll-into-view="listCurID" :scroll-y="true" :scroll-with-animation="true" :style="{height:windowHeight}">
			       <view class="content">
			         <view class="section" id="Top">
			           <view class="city-title">当前城市</view>
			           <view class="city-list">
			             <view class="city-item active">{{current}}</view>
			           </view>
			         </view>
			         <view class="section" id="hot" v-if="hotCitys.length">
			           <view class="city-title">热门城市</view>
			           <view class="city-list">
			             <view class="city-item" :class="{active: current === city.city}" v-for="(city, i) in hotCitys" :key="i" @click="onSelect(city)">{{city.city}}</view>
			           </view>
			         </view>
			         <view class="section" :id="item.letter" v-for="item in citys" :key="item.letter">
			           <view class="letter">{{item.letter}}</view>
			           <view class="city-list">
			             <view class="city-item" :class="{active: current === city.city}" v-for="(city,itemIndex) in item.list" :key="itemIndex" @click="onSelect(city)">{{city.city}}</view>
			           </view>
			         </view>
			       </view>
			     </scroll-view>
			   </view>
			 <view class="indexBar">
			 	<view class="indexBar-box" @touchstart="tStart" @touchend="tEnd">
			 		<view class="indexBar-item" @touchstart="getCur($event,'Top')" @touchend="setCur">#</view>
			 		<view class="indexBar-item" v-for="(item,index) in citys" :key="index" :id="index" @touchstart="getCur" @touchend="setCur"> {{item.letter}}</view>
			 	</view>
			 </view>
			  <!--选择显示-->
			  <view v-show="!hidden" class="indexToast">
			  	{{listCur}}
			  </view>
		</view>
	</view>
</template>

<script>
  import citys from '@/utils/citys.js'
  export default {
    data() {
      return {
		  StatusBar: this.StatusBar,
		  CustomBar: this.CustomBar,
	    citys: citys,
		hidden: true,
		windowHeight: '',
		listCurID: '',
		list: [],
		listCur: 'A',  
		chooesCity:'', 
        hotCitys: [{
			    "cityid": "85",
			    "city": "广州市"
			},
			{
			    "cityid": "60",
			    "city": "深圳市"
			},
			{
			    "cityid": "80",
			    "city": "上海市"
			},
			{
			    "cityid": "73",
			    "city": "北京市"
			},
			{
			    "cityid": "107",
			    "city": "长沙市"
			},
			{
			    "cityid": "55",
			    "city": "成都市"
			},
			{
			    "cityid": "52",
			    "city": "重庆市"
			},
			{
			    "cityid": "82",
			    "city": "厦门市"
			},
		],
        current: '未选择'
      }
    },
	onLoad(option) {
		this.current = option.city
		 this.getSystemInfo()
	},
    methods: {
	getSystemInfo() {
	  uni.getSystemInfo().then(res => {
	    let [error, data] = res
	    this.windowHeight = `${data.windowHeight}px`
	  })
	},
	 //获取文字信息
	 getSystemInfo() {
	   uni.getSystemInfo().then(res => {
	     let [error, data] = res
	     this.windowHeight = `${data.windowHeight}px`
	   })
	 },
	 getCur(e,key) {
	   console.log('获取文字信息',e.target.id,key)
	 	this.hidden = false;
		if(key){
			this.listCur = 'Top'
			return
		}
		console.log('获取文字信息',e.target.id)
	 	this.listCur = this.citys[e.target.id].letter;
	 },
	 setCur(e) {
	 	this.hidden = true;
	 	//this.listCur = this.listCur
	 },
	 //滑动选择Item
	 /* tMove(e) {
		// console.log('获取文字信息',e)
	 	let y = e.touches[0].clientY,
	 		offsettop = this.boxTop,
	 		that = this;
	 	//判断选择区域,只有在选择区才会生效
	 	if (y > offsettop) {
	 		let num = parseInt((y - offsettop) / 20);
			console.log(num)
	 		this.listCur = that.citys[num].letter
	 	};
	 }, */
	 //触发全部开始选择
	 tStart() {
	 	this.hidden = false
	 },
	 
	 //触发结束选择
	 tEnd() {
	 	this.hidden = true;
	 	this.listCurID = this.listCur
	 },
      onSelect(city) {
        console.log(city)
		this.chooesCity = JSON.stringify(city)
		this.current = city.city
		var that = this
		uni.showModal({
			title:'提示',
			content:'已选:'+city.city,
			success(res) {
			   if (res.confirm) {
			       uni.redirectTo({
			       	url: '../index/index?city='+JSON.stringify(city)
			       });    
			   }
			}
		})
      }
    }
  }
</script>

<style lang="scss" scoped>
	
	.indexes {
		position: relative;
	}

	.indexBar {
		position: fixed;
		right: 0px;
		bottom: 20px;
		padding: 20upx 20upx 20upx 60upx;
		display: flex;
		align-items: center;
	}

	.indexBar .indexBar-box {
		width: 40upx;
		height: auto;
		background: #fff;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
		border-radius: 10upx;
	}

	.indexBar-item {
		flex: 1;
		width: 40upx;
		height: 50upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24upx;
		color: #888;
	}

	movable-view.indexBar-item {
		width: 40upx;
		height: 40upx;
		z-index: 9;
		position: relative;
	}

	movable-view.indexBar-item::before {
		content: "";
		display: block;
		position: absolute;
		left: 0;
		top: 10upx;
		height: 20upx;
		width: 4upx;
		background-color: #f37b1d;
	}

	.indexToast {
		position: fixed;
		top: 0;
		right: 80upx;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
		margin: auto;
		color: #fff;
		line-height: 100upx;
		text-align: center;
		font-size: 48upx;
	}
	.select-city-wrap {
	  position: relative;
	  padding: 0 30upx;
	  background-color: #fff;
	}
	.select-city {
	  .index {
	    position: absolute;
	    right: 0;
	    bottom: 20upx;
	    z-index: 999;
	    color: #2f9bfe;
	    font-size: 32upx;
	    .index-item {
	      width: 40upx;
	      height: 42upx;
	      line-height: 42upx;
	      text-align: center;
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
	      .city-item {
	        height: 55upx;
	        margin-right: 36upx;
	        margin-bottom: 28upx;
	        line-height: 55upx;
	        text-align: center;
	        border: 1px solid #dcdcdc;
	        border-radius: 6upx;
			  padding: 0 10upx;
	        color: #999;
	        font-size: 28upx;
	        &.active {
	          background-color: #d5ebff;
	          border-color: #d5ebff;
	          color: #2f9bfe;
	        }
	      }
	    }
	  }
	}
</style>
