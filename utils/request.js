const baseUrl = 'https://zhangguihuan.xyz/RT-Bus/'
const baseUrl2 = 'https://free-api.heweather.net/'
const httpRequest = (opts, data,type) => {
    let httpDefaultOpts = {
        url: (type==2 ? baseUrl2:baseUrl)+opts.url,
        data: data,
        method: opts.method,
        header: opts.method == 'get' ? {
        'X-Requested-With': 'XMLHttpRequest',
        "Accept": "application/json",
        "Content-Type": "application/json; charset=UTF-8"
    } : {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
        dataType: 'json',
    }
    let promise = new Promise(function(resolve, reject) {
        uni.request(httpDefaultOpts).then(
            (res) => {
                resolve(res[1])
            }
        ).catch(
            (response) => {
                reject(response)
            }
        )
    })
    return promise
};
//带Token请求
const httpTokenRequest = (opts, data) => {
	//let token = uni.getStorageSync("token")
	//data.token = token
    //此token是登录成功后后台返回保存在storage中的
    let httpDefaultOpts = {
        url: baseUrl+opts.url,
        data: data,
        method: opts.method,
        header: opts.method == 'get' ? {
        'X-Requested-With': 'XMLHttpRequest',
        "Accept": "application/json",
        "Content-Type": "application/json; charset=UTF-8"
    } : {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
        dataType: 'json',
    }
    let promise = new Promise(function(resolve, reject) {
        uni.request(httpDefaultOpts).then(
            (res) => {
                resolve(res[1])
            }
        ).catch(
            (response) => {
                reject(response)
            }
        )
    })
    return promise
};

export default {
	    baseUrl,
		httpRequest,
		httpTokenRequest,
}



 /*
 使用方法(局部引入)
 import request from '@/components/utils/request.js';
 
   let data={
   url: '/api/device/add',
   method: 'post'
     };
     let param={
          xxx:"xxx",
          xxx:"xxx"
         };
     request.httpTokenRequest(data, param).then(res => {
      console.log(res.data);
       //打印请求返回的数据
   },error => {console.log(error);})    */