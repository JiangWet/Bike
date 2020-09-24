// pages/deposit/deposit.js
var myUtils = require("../../utils/myUtils.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  deposit:function(){
    var that = this;
    //获取用户的手机号
    var phoneNum = myUtils.get("phoneNum")
    wx.showModal({
      title:"提示",
      content:"是否进行充值?",
      //confirmText:'确认',
      success:function(res){
       // //模拟加载的动画
        if(res.confirm){                  
          wx.showLoading({
            title: '正在充值...',
            mask:true
          })
          //先调用微信小程序的支付接口

          // console.log(myUtils.get("phoneNum"))
         // var phoneNum=getApp().globalData.phoneNum;
          //如果成功，向后台发送请求，然后更新用户的押金
        wx.request({
          url: 'http://localhost:8080/user/deposit',
          //header:{'content-type':'application/x-www-form-urlencoded'},
          method:'POST',
          data:{
              phoneNum:phoneNum, 
              deposit:99,
              status:2
          },
          
          success:function(res){
            // 关闭充值中的加载对话框
            wx.hideLoading()
           // if(res.data){
              wx.navigateTo({
                url: '../identify/identify',
              })
              //将用户信息保存到手机存储卡
              getApp().globalData.deposit = deposit
              wx.setStorageSync("deposit",deposit)
              //更新用户的状态：交押金后，用户状态更新为2
              getApp().globalData.status = 2 
              //更新存储卡中的用户状态
              wx.setStorageSync("status",2)
            }
            
         // }
        })
       }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})