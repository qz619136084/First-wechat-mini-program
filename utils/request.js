/* 发送ajax请求 */
import config from "./config";
export default (url, data = {}, method = "GET") => {
  return new Promise((resolve, reject) => {
    wx.request({
      // ES6 对象的简写方式，属性和值变量同名的，属性可以省略。本来应为--> url:url
      url: config.host + url,
      data,
      method,
      header: {
        cookie: wx.getStorageSync("cookies")
          ? wx
              .getStorageSync("cookies")
              .find((item) => item.indexOf("MUSIC_U") > -1)
          : "",
      },
      success: (res) => {
        // console.log("请求成功： ", res);
        if (data.isLogin) {
          wx.setStorage({
            key: "cookies",
            data: res.cookies,
          });
        }
        resolve(res.data); //修改promise的状态为成功状态
      },
      fail: (err) => {
        // console.log("请求失败： ", err);
        reject(err); //修改promise的状态为失败状态
      },
    });
  });
};
