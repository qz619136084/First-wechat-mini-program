// pages/index/index.js
import request from "../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    recommendList: [],
    topList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let bannerListData = await request("/banner", { type: 2 });
    this.setData({
      bannerList: bannerListData.banners,
    });

    // 获取推荐歌单数据
    let recommendListData = await request("/personalized", { limit: 10 });
    this.setData({ recommendList: recommendListData.result });

    //获取排行榜数据
    let index = 0;
    let resultArr = [];
    while (index < 5) {
      let topListData = await request("/top/list", { idx: index++ });
      //splice(会修改原数组，可以对指定的数据进行增删改) slice(不会修改数组)
      let topListItem = {
        name: topListData.playlist.name,
        tracks: topListData.playlist.tracks.slice(0, 3),
      };
      resultArr.push(topListItem);
      //不需要等待五次请求全部结束才更新，用户体验较好，但是渲染次数更多（废性能）
      this.setData({
        topList: resultArr,
      });
    }
    //更新toplist的状态值, 放在此处更新会导致发送请求的过程中页面长时间白屏，用户体验差
    this.setData({
      topList: resultArr,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
