var myUtils=require("../../utils/myUtils.js")
Page({
  data: {
    log: 0,
    lat: 0,
    controls:[],
    markers:[],
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     //获取定时器，用于判断是否已经在计费
     this.timer = options.timer;
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

        //查找单车
        findBikes(longitude,latitude,that)
      },
    })
    //设置地图控件的位置及大小，通过设备宽高定位
    wx.getSystemInfo({
      success: function(res) {
        var windowWidth=res.windowWidth;
        var windowHeight=res.windowHeight;
        that.setData({
          controls: [
            {
              id: 1,
              //控件（按钮）的背景图片
              iconPath: '/image/qrcode.png',
              //控件的相对页面的位置
              position: {
                width: 120,
                height: 60,
                left: windowWidth / 2 - 50,
                top: windowHeight - 100
              },
              //是否可点击
              clickable: true
            },
            {
              //定位按钮
              id:2,
              iconPath:'/image/img1.png',
              position:{
                width: 40,
                height: 40,
                left: 10,
                top: windowHeight - 60
              },
              //是否可点击
              clickable: true
            },
            {
                //中心点位置
                id:3,
                iconPath:'/image/location.png',
                position:{
                  width:20,
                  height:35,
                  left:windowWidth/2-12,
                  top:windowHeight/2-32
                },
                //是否可点击
              clickable: true
            },
            {
              //钱包按钮
              id:4,
              iconPath:'/image/pay.png',
              position: {
                width: 40,
                height: 40,
                left: windowWidth -45,
                top: windowHeight - 100
              },
              //是否可点击
              clickable:true
            },
            {
              //添加车辆
              id:5,
              iconPath:'/image/add.png',
              position: {
                width: 35,
                height: 35,
              },
              //是否可点击
              clickable: true
            },
            {
              //报修
              id:6,
              iconPath:'/image/warn.png',
              position: {
                width: 35,
                height: 35,
                left: windowWidth - 42,
                top: windowHeight - 55
              },
              //是否可点击
              clickable: true
            }
          ]
        })
      },
    })  
  },
  /**
   * 控件被点击事件
   */
  controltap:function(e){
    var that=this;
    var cid=e.controlId;
    switch(cid){
      //扫码按钮
      case 1:{
        var status=myUtils.get("status")
        //根据用户状态，跳转到对应的页面
        //如果是0，跳转到手机注册页面
        if(status==0){
        //跳转到手机注册页面
          wx.navigateTo({
            url: '../register/register',
          })
        }else if(status==1){
          //跳转到押金页面
          wx.navigateTo({
            url: '../deposit/deposit',
          })
        }
        else if(status==2){
          //跳转到身份认证页面
          wx.navigateTo({
            url: '../identify/identify',
          })
        }
        else{
          if(this.timer === "" || this.timer === undefined){
            // 没有在计费就扫码
            wx.scanCode({
              success: (res) => {
                // 正在获取密码通知
                wx.showLoading({
                  title: '正在获取密码',
                  mask: true
                })
                // 请求服务器获取密码和车号
                wx.request({
                  url: 'http://localhost:8080/user/scan',
                  data: {},
                  method: 'POST', 
                  success: function(res){
                    // 请求密码成功隐藏等待框
                    wx.hideLoading();
                    // 携带密码和车号跳转到密码页
                    wx.redirectTo({
                      //url: '../scanresult/scanresult?password=' + res.data.data.password + '&number=' + res.data.data.bikes.id,
                      url:'../scanresult/scanresult?password=1000 & number=10001',
                      success: function(res){
                        wx.showToast({
                          title: '获取密码成功',
                          duration: 1000
                        })
                      }
                    })           
                  }
                })
              }
            })
          // 当前已经在计费就回退到计费页
          }else{
            wx.navigateBack({
              delta: 1
            })
          }  
        }
        

        /*var status=myUtils.get("status")
        //根据用户状态，跳转到对应的页面
        //如果是0，跳转到手机注册页面
        if(status==0){
        //跳转到手机注册页面
          wx.navigateTo({
            url: '../register/register',
          })
        }else if(status==1){
          wx.navigateTo({
            url: '../deposit/deposit',
          })
        }
        else if(status==2){
          wx.navigateTo({
            url: '../identify/identify',
          })
        }*/
        break
      }
      //定位按钮
      case 2:{
        this.mapCtx.moveToLocation()
        break;
      }

      //个人中心
      case 4:{
        wx.navigateTo({
          //url: '../my/my',
          url: '../wallet/wallet',
        })

      }

      //添加车辆
      case 5:{
        //获取当前已有车辆
        //var bikes=that.data.markers;
        //获取到移动之后的位置的中心点
        this.mapCtx.getCenterLocation({
          success:function(res){
            var log=res.longitude;
            var lat=res.latitude;
            var billing="2/hour";
            var deposit=99;
            var producer="China";
            var color="red";
            var bikeNo=Math.floor(Math.random()*10000 + 10000);
            //var bikeNo=(Math.random().toString().substr(3,5) + Date.now()).toString(36);
            //发送请求：将添加的单车数据发送到后台（SpringBoot)
            wx.request({
              url: "http://localhost:8080/bike/add",
              data:{
                //longitude:log,
                //latitude:lat,
               bikeNo:bikeNo,
               location:[log,lat],
               color:color,
               billing:billing,
               deposit:deposit,
               producer:producer,
               status:0
              },
              method:'POST',
              success:function(res){
               // console.log(deposit)
                //查找单车，将单车显示在页面上
                findBikes(log,lat,that)

              }
            })
          }
        })
        break;
      }
      case 6:{
        wx.navigateTo({
          url: '../warn/warn'
        })
      }
      break;
      default: break;
    }
  },
  /**
   * 移动后地图视野发生变化触发的事件
   */
  regionchange:function(e){
    var that=this;
    //获取移动之后的位置
    var etype=e.type;
    if(etype=='end'){
      this.mapCtx.getCenterLocation({
        success:function(res){
          var log=res.longitude;
          var lat=res.latitude;
          findBikes(log,lat,that);
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady:function(){
    //创建map上下文
    this.mapCtx=wx.createMapContext('myMap')
  }
})

function findBikes(longitude,latitude,that){
  wx.request({
    url: 'http://localhost:8080/bike/findNear',
    method:"GET",
    data:{
      longitude:longitude,
      latitude:latitude
    },
    success:function(res){
      //console.log(res)
     var bikes=res.data.map((geoResult)=>{
       return {
         longitude:geoResult.content.location[0],
         latitude:geoResult.content.location[1],
         iconPath:"/image/bike.png",
         width:35,
         height:40,
        id:geoResult.content.id
       } 
     })
     //将Bike的数组set到当前页面的markers中
     that.setData({
       markers:bikes
     })
    }
  })
}
