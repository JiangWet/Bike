// pages/wallet/wallet.js
Page({
  data:{
    overage: 0,
    ticket: 0,
    message:"99元，押金退还",
    flag:1
  },
// 页面加载
  onLoad:function(options){
     wx.setNavigationBarTitle({
       title: '我的钱包'
     })
  },
// 页面加载完成，更新本地存储的overage
  onReady:function(){
     wx.getStorage({
      key: 'overage',
      success: (res) => {
        this.setData({
          overage: res.data.overage
        })
      }
    })
  },
// 页面显示完成，获取本地存储的overage
  onShow:function(){
    wx.getStorage({
      key: 'overage',
      success: (res) => {
        this.setData({
          overage: res.data.overage
        })
      }
    }) 
  },
// 余额说明
  overageDesc: function(){
    wx.showModal({
      title: "",
      content: "余额可用于骑行付费",
      showCancel: false,
      confirmText: "我知道了",
    })
  },
// 跳转到充值页面
  movetoCharge: function(){
    // 关闭当前页面，跳转到指定页面，返回时将不会回到当前页面
    wx.redirectTo({
      url: '../charge/charge'
    })
  },
// 用车券
  showTicket: function(){
    wx.showModal({
      title: "",
      content: "您暂无用车券！",
      showCancel: false,
      confirmText: "确定",
    })
  },
// 押金退还
  showDeposit: function(){  
    if(this.data.flag==1){
      wx.showModal({
        title: "",
        content: "押金会立即退回，退款后，您将不能使用共享单车，确认要进行此退款吗？",
        cancelText: "继续使用",
        cancelColor: "#b9dd08",
        confirmText: "押金退款",
        confirmColor: "#ccc",
      success: (res) => {
        if(res.confirm){
          var flag=0;
          wx.showToast({
            title: "退款成功",
            icon: "success",
            duration: 2000,
          }),
          this.setData({
            message:"未交押金",
            flag:0
          })
        }                
         //更新用户的状态：已实名未交押金，用户状态更新为1
         getApp().globalData.status = 1
         //更新存储卡中的用户状态
         wx.setStorageSync("status",1)
      }   
    })
  }
  else{
    wx.showModal({
      title: "",
      content: "是否支付押金？",
      cancelText: "否",
      cancelColor: "#b9dd08",
      confirmText: "是",
      confirmColor: "#ccc",
    success: (res) => {
      if(res.confirm){
        wx.showToast({
          title: "支付成功",
          icon: "success",
          duration: 2000,
        }),
        this.setData({
          message:"99元，押金退还",
          flag:1
        })
      }
       //更新用户的状态：交押金后，用户状态更新为3
       getApp().globalData.status = 3
       //更新存储卡中的用户状态
       wx.setStorageSync("status",3)
    }   
  })
  }
},
// 关于Bike
  showInvcode: function(){
    wx.showModal({
      title: "共享单车",
      content: "微信服务号：Bike,网址：my.bike.com",
      showCancel: false,
      confirmText: "My Bike"
    })
  }
})