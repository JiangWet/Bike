// pages/billing/billing.js
var myUtils = require('../../utils/myUtils.js')
Page({
  data:{
    hours: 0,
    minuters: 0,
    seconds: 0,
    bikeNo:"",
    rentTime:"",
    returnTime:"",
    timer:0,
    billing: "正在计费",
  },
// 页面加载
  onLoad:function(options){
    //获取并设置当前位置经纬度
    var that=this;
    wx.getLocation({
      success: function(res) {
        var longitude=res.longitude
        var latitude=res.latitude
        that.setData({
          log: longitude,
          lat: latitude
        })
      }
    })
    // 获取车牌号，设置定时器
    this.setData({
      bikeNo: options.number,
      timer: 0,
      rentTime:new Date()
    })
    // 初始化计时器
    let s = 0;
    let m = 0;
    let h = 0;
    // 计时开始
    this.timer= setInterval(() => {
      this.setData({
        seconds: s++
      })
      if(s == 60){
        s = 0;
        m++;
        setTimeout(() => {         
          this.setData({
            minuters: m
          });
        },1000)      
        if(m == 60){
          m = 0;
          h++
          setTimeout(() => {         
            this.setData({
              hours: h
            });
          },1000)
        }
      };
    },1000)  
  },
// 结束骑行，清除定时器
  endRide: function(){
    this.data.returnTime=new Date();
    clearInterval(this.timer);
    this.timer = "";
    //获取全局变量的数据
    var globalData=getApp().globalData;
    //获取手机号
    var phoneNum = myUtils.get("phoneNum");
    //获取姓名
    var name=myUtils.get("name");
    //单车ID
    var bikeNo=this.data.bikeNo;
    //租借时间
    var rentTime=this.data.rentTime;
    //归还时间
    var returnTime=this.data.returnTime;
    //消费金额
    var billings="2元";
    //经纬度
    var longitude=this.data.log;
    var latitude=this.data.lat;
    wx.request({
      url: 'http://localhost:8080/user/billing',
      method: 'POST',
      data: {
        phoneNum: phoneNum,
        name: name,
        status: 0,
        bikeNo:bikeNo,
        rentTime:rentTime,
        returnTime:returnTime,
        billings:billings,
        longitude:longitude,
        latitude:latitude,
      },
    })
    this.setData({
      billing: "本次骑行耗时",
      disabled: true
    })
  },
// 携带定时器内容回到地图
  moveToIndex: function(){
    
    // 如果定时器为空
    if(this.timer == ""){
      // 关闭计费页跳到地图
      wx.redirectTo({
        url: '../index/index'
      })
    // 保留计费页跳到地图
    }else{
      wx.request({
        //url: 'http://localhost:8080/user/billing',
        //method:"GET",
        data:{
         /* phoneNum:this.phoneNum,
          name:this.name,
          bikeNo:this.bikeNo,
          longitude:this.longitude,
          latitude:this.latitude,
          time:this.timer,
          billing:2*timer*/
        },
        success: function(res){
          wx.navigateTo({
            url: '../index/index?timer=' + this.timer
          })
        }
      })
    }
  }
})