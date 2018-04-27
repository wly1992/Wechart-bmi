// pages/page1/test.js
import * as echarts from '../../ec-canvas/echarts';
let chart = null;
let data;
const app = getApp()

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  data = wx.getStorageSync('recodeData');
  if (data === '' || data.length < 1) {
    return
  }
  var option = {
    grid:{
      top:'10%',
      bottom:'10%'
    },
    xAxis: {
      data: data.map(function (item) {
        return item[0];
      })
    },
    yAxis: {
      splitLine: {
        show: false
      },
      max: 40
    },
    // dataZoom: [{
    //   startValue: '2017-01-01'
    // }, {
    //   type: 'inside'
    // }],
    visualMap: {
      show: false,
      top: 10,
      right: 10,
      pieces: [{
        gt: 0,
        lte: 18.5,
        color: '#ffde33'
      }, {
        gt: 18.5,
        lte: 24,
        color: '#096'
      }, {
        gt: 24,
        lte: 28,
        color: '#ff9933'
      }, {
        gt: 28,
        lte: 30,
        color: '#cc0033'
      }, {
        gt: 30,
        color: '#7e0023'
      }],
      outOfRange: {
        color: '#999'
      }
    },
    series: {
      type: 'line',
      data: data.map(function (item) {
        return item[1];
      }),
      markLine: {
        silent: true,
        data: [{
          yAxis: 18.5
        }, {
          yAxis: 24
        }, {
          yAxis: 28
        }]
      }
    }
  };
  chart.setOption(option);
  return chart;
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    },
    weight: 0.0,
    newestTime:{
      year:'2018',
      month:'04',
      day:'08'
    },
    targetWeight: '--',
    massIndex: '--',
    noRecode: true,
    contrast: '--',
    plusOrminus: null,
  },
  changeWeight() {
    wx.navigateTo({
      url: '../setWeight/setWeight?weight=' + this.data.weight
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('targetWeight')!==''){
      let targetWeight = wx.getStorageSync('targetWeight').targetWeight;
      this.setData({
        targetWeight: targetWeight,
      })
    }

    this.init()
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

    if (wx.getStorageSync('targetWeight') !== '') {
      let targetWeight = wx.getStorageSync('targetWeight').targetWeight;
      this.setData({
        targetWeight: targetWeight,
      })
    }

    this.init()
    if (chart === null) return;
    data = wx.getStorageSync('recodeData');
    if (data === '' || data.length < 1) {
      chart.clear()
      return
    }
    this.review()
  },

  init(){
    let recodeData = wx.getStorageSync('recodeData');
    if (recodeData === '' || recodeData.length===0) {
      this.setData({
        noRecode: true,
        massIndex: '--',
      })
    } else {
      let lastDate = recodeData[recodeData.length - 1][0]
      this.setData({
        noRecode: false,
        newestTime: {
          year: lastDate.substring(0, 4),
          month: lastDate.substring(5, 7),
          day: lastDate.substring(8, 10)
        },
        weight: recodeData[recodeData.length - 1][2],
        massIndex: recodeData[recodeData.length - 1][1]
      })

      if (recodeData.length > 1) {
        let massIndex = recodeData[recodeData.length - 1][1];
        let preMassIndex = recodeData[recodeData.length - 2][1];
        let contrast = Math.abs(((massIndex - preMassIndex) / preMassIndex / 100 * 10000).toFixed(2));
        let plusOrminus = massIndex - preMassIndex;
        this.setData({
          contrast: contrast,
          plusOrminus: plusOrminus
        })
      }else{
        this.setData({
          contrast: '--',
          plusOrminus: null
        })
      }
    }
  },
  review(){
    var option = {
      grid: {
        top: '10%',
        bottom: '10%'
      },
      xAxis: {
        data: data.map(function (item) {
          return item[0];
        })
      },
      yAxis: {
        splitLine: {
          show: false
        },
        max: 40
      },
      // dataZoom: [{
      //   startValue: '2017-01-01'
      // }, {
      //   type: 'inside'
      // }],
      visualMap: {
        show: false,
        top: 10,
        right: 10,
        pieces: [{
          gt: 0,
          lte: 18.5,
          color: '#ffde33'
        }, {
          gt: 18.5,
          lte: 24,
          color: '#096'
        }, {
          gt: 24,
          lte: 28,
          color: '#ff9933'
        }, {
          gt: 28,
          lte: 30,
          color: '#cc0033'
        }, {
          gt: 30,
          color: '#7e0023'
        }],
        outOfRange: {
          color: '#999'
        }
      },
      series: {
        type: 'line',
        data: data.map(function (item) {
          return item[1];
        }),
        markLine: {
          silent: true,
          data: [{
            yAxis: 18.5
          }, {
            yAxis: 24
          }, {
            yAxis: 28
          }]
        }
      }
    };
    chart.setOption(option);
  },

  weekData(){
    if (chart === null) return;
    data = wx.getStorageSync('recodeData');
    if ( data.length > 6) {
      data = data.slice(-7)
      this.review()
    } else if (data.length > 2 && data.length < 7){
      this.review()
    }
  },

  monthData() {
    if (chart === null) return;
    data = wx.getStorageSync('recodeData');
    if (data.length > 29) {
      data = data.slice(-30)
      console.log(data)
      this.review()
    } else if (data.length > 2 && data.length < 30){
      this.review()
    }
  },

  onShareAppMessage: function (options) {
    var that = this;
    var shareObj = {
      title: "我的体重指数",       
      path: '/pages/massIndex/massIndex',        
      imgUrl: '',     
      success: function (res) {
      // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
        }
      },
      fail: function (res) {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
      complete: function(){
        // 转发结束之后的回调（转发成不成功都会执行）
      }
  　};
　　// 返回shareObj
　　return shareObj;
  }
})