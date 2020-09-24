// pages/warn/warn.js
const AV = require('../../utils/av-weapp-min.js'); 
var myUtils = require('../../utils/myUtils.js')
Page({
  data:{
    log:0,
    lat:0,
    // 故障车周围环境图路径数组
    picUrls: [],
    // 故障车编号和备注
    inputValue: {
      num: -1,
      desc: "故障"
    },
    // 故障类型数组
    checkboxValue: [],
    // 选取图片提示
    actionText: "拍照/相册",
    // 提交按钮的背景色，未勾选类型时无颜色
    btnBgc: "",
    // 复选框的value，此处预定义，然后循环渲染到页面
    itemsValue: [
      {
        checked: false,
        value: "私锁私用",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "车牌缺损",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "轮胎坏了",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "车锁坏了",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "违规乱停",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "密码不对",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "刹车坏了",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "其他故障",
        color: "#b9dd08"
      }
    ]
  },
  /*checkboxChange:function(e){
    console.log(e.detail.value.checkboxValue)
  },*/
  
// 页面加载
  onLoad:function(options){
    wx.setNavigationBarTitle({
      title: '报障维修'
    })
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
  },
// 勾选故障类型，获取类型值存入checkboxValue
  checkboxChange: function(e){
    let _values = e.detail.value;
    if(_values.length == 0){
      this.setData({
        btnBgc: ""
      })
    }else{
      this.setData({
        checkboxValue: _values,
        btnBgc: "#b9dd08"
      })
    }   
  },
// 输入单车编号，存入inputValue
  numberChange: function(e){
    this.setData({
      inputValue: {
        num: e.detail.value,
        desc: this.data.inputValue.desc
      }
    })
  },
// 输入备注，存入inputValue
  descChange: function(e){
    this.setData({
      inputValue: {
        num: this.data.inputValue.num,
        desc: e.detail.value
      }
    })
  },
// 提交到服务器
  formSubmit: function(e){
    //获取全局变量的数据
    var globalData=getApp().globalData;
    //获取手机号
    var phoneNum = myUtils.get("phoneNum");
    //单车ID
    var bikeNo=this.data.inputValue.num;
    //报修信息
    var repairMsg= this.data.checkboxValue;
    //图片
    var image=this.data.picUrls;
    //备注
    var desc=this.data.inputValue.desc;
    //经纬度
    var longitude=this.data.log;
    var latitude=this.data.lat;
    if(this.data.picUrls.length > 0 || this.data.checkboxValue.length> 0){   
      wx.request({
        url: 'http://localhost:8080/bikeRepair/warn',
        data: {
          // picUrls: this.data.picUrls,
          // inputValue: this.data.inputValue,
          // checkboxValue: this.data.checkboxValue
          phoneNum:phoneNum,
          status:-1,
          regDate:new Date(),
          repairMsg:repairMsg,
          image:image,
          bikeNo:bikeNo,
          longitude:longitude,
          latitude:latitude,
          desc:desc
        },
        method: 'POST', // POST
        // header: {}, // 设置请求的 header
        success: function(res){
          console.log(bikeNo)
          console.log(image)
          console.log(repairMsg)
          console.log(phoneNum)
          console.log(longitude)
          console.log(latitude)
          console.log(desc)
          if(res.data){
            wx.showToast({
              //title: res.data.data.msg,
              icon: 'success',
              duration: 2000
            })
          }
          else{
            wx.showModal({//用户信息保存失败
              title: '提示',
              content: '服务端错误，请稍后再试',
            })
          }
        }
      })
    }else{
      wx.showModal({
        title: "请填写反馈信息",
        content: '请先填写反馈信息！',
        confirmText: "继续填写",
        cancelText: "不填写",
        success: (res) => {
          if(res.confirm){
            // 继续填
          }else{
            console.log("back")
            wx.navigateBack({
              delta: 1 // 回退前 delta(默认为1) 页面
            })
          }
        }
      })
    }
    
  },
// 选择故障车周围环境图 拍照或选择相册
  bindCamera: function(){
    wx.chooseImage({
      count: 4, 
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'], 
      success: (res) => {
        let tfps = res.tempFilePaths;
        let _picUrls = this.data.picUrls;
        for(let item of tfps){
          _picUrls.push(item);
          this.setData({
            picUrls: _picUrls,
            actionText: "+"
          });
        };
        var tempFilePath = res.tempFilePaths[0];
        new AV.File('pictrue', {
          blob: {
            uri: tempFilePath,
          },
        }).save().then(
          file => console.log(file.url())
        ).catch(console.error);
      }
    })
  },
// 删除选择的故障车周围环境图
  delPic: function(e){
    let index = e.target.dataset.index;
    let _picUrls = this.data.picUrls;
    _picUrls.splice(index,1);
    this.setData({
      picUrls: _picUrls
    })
  }
})