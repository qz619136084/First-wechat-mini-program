// pages/video/video.js
import request from "../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId: "" /* 导航标识 */,
    videoList: [], //视频列表数据
    videoId: "", //视频id标识
    videoUpdateTime: [], //记录video播放时长
    isTriggered: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getVideoGroupListData();
  },

  /* 获取导航数据 */
  async getVideoGroupListData() {
    let videoGroupListData = await request("/video/group/list");
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      navId: videoGroupListData.data[0].id,
    });
    this.getVideoList(this.data.navId);
  },
  // 获取列表数据
  async getVideoList(navId) {
    let videoListData = await request("/video/group", { id: navId });
    //关闭消息提示框
    wx.hideLoading();
    let index = 0;
    let videoList = videoListData.datas.map((item) => {
      item.id = index++;
      return item;
    });
    this.setData({
      videoList,
      isTriggered: false,
    });
  },

  /* 点击切换导航的回调 */
  changeNav(event) {
    // let navId = event.currentTarget.id;
    let navId = event.currentTarget.dataset.id;
    //通过id向event传参的时候如果传的是number，会自动转换成string
    this.setData({ navId, videoList: "" });
    //显示正在加载
    wx.showLoading({
      title: "正在加载",
    });
    //动态获取当前导航对应的视频数据
    this.getVideoList(this.data.navId);
  },

  /* 点击播放、继续播放的回调 */
  handlePlay(event) {
    let vid = event.currentTarget.id;
    //关闭上一个播放的视频
    //this.vid !== vid && this.videoContext && this.videoContext.stop();
    //this.vid = vid;
    //更新data中的videoId的状态数据
    this.setData({ videoId: vid });
    //创建控制video标签的实例对象
    this.videoContext = wx.createVideoContext(vid);
    //判断当前的视频之前是否有播放过，是否有播放记录，如果有，跳转至指定播放位置
    let { videoUpdateTime } = this.data;
    let videoItem = videoUpdateTime.find((item) => item.vid === vid);
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime);
    }
    this.videoContext.play();
  },

  /* 监听视频播放进度的回调 */
  handleTimeUpdate(event) {
    console.log(event);
    let videoTimeObj = {
      vid: event.currentTarget.id,
      currentTime: event.detail.currentTime,
    };
    let { videoUpdateTime } = this.data;
    let videoItem = videoUpdateTime.find(
      (item) => item.vid === videoTimeObj.vid
    );
    if (videoItem) {
      //之前有
      videoItem.currentTime = videoTimeObj.currentTime;
    } else {
      //之前没有
      videoUpdateTime.push(videoTimeObj);
    }
  },
  /* 视频播放结束调用的回调 */
  handleEnded(event) {
    //移除记录播放时长数组中当前视频的对象
    let { videoUpdateTime } = this.data;

    videoUpdateTime.splice(
      videoUpdateTime.findIndex((item) => item.vid === event.currentTarget.id),
      1
    );
    this.setData({ videoUpdateTime });
  },
  //自定义下拉刷新的回调
  handleRefersher() {
    console.log("scroll-view下拉刷新");
    //再次发请求获取视频列表数据
    this.getVideoList(this.data.navId);
  },
  //自定义上拉的回调
  handleToLower() {
    console.log("scroll-view 上拉触底");
    //数据分页：1、后端分页， 2、前端分页
    console.log("发送请求 || 在前端截取最新数据，追加到视频列表的后方");
    console.log("网易云暂时没有提供分页api");
    console.log("用固定数据模拟上拉加载效果");
    let newVideoList = [
      {
        alg: "onlineHotGroup",
        extAlg: null,
        data: {
          alg: "onlineHotGroup",
          scm: "1.music-video-timeline.video_timeline.video.181017.-295043608",
          threadId: "R_VI_62_2ECFBFC02440C7BF84BC83AF637ACE4E",
          coverUrl:
            "https://p2.music.126.net/gax3FlvmFsYYsXcVOsG3_Q==/109951165353772705.jpg",
          height: 360,
          width: 480,
          title: "这才是王杰原来的声音，为杰哥祈祷，声音早日康复。",
          description: "这才是王杰原来的声音，为杰哥祈祷，声音早日康复。",
          commentCount: 746,
          shareCount: 1527,
          resolutions: [
            {
              resolution: 240,
              size: 6958433,
            },
          ],
          creator: {
            defaultAvatar: false,
            province: 330000,
            authStatus: 1,
            followed: false,
            avatarUrl:
              "http://p1.music.126.net/NyE3ZaBBa4q1uTRycso9jQ==/109951164200929365.jpg",
            accountStatus: 0,
            gender: 1,
            city: 330100,
            birthday: 644770800000,
            userId: 74474,
            userType: 4,
            nickname: "葱_music",
            signature: "音乐一窍不通，仅是喜欢。",
            description: "",
            detailDescription: "",
            avatarImgId: 109951164200929360,
            backgroundImgId: 109951163339122270,
            backgroundUrl:
              "http://p1.music.126.net/C7sUbNgRxYvgDVOSA8ZcjQ==/109951163339122274.jpg",
            authority: 0,
            mutual: false,
            expertTags: null,
            experts: {
              1: "音乐视频达人",
              2: "生活图文达人",
            },
            djStatus: 10,
            vipType: 11,
            remarkName: null,
            avatarImgIdStr: "109951164200929365",
            backgroundImgIdStr: "109951163339122274",
          },
          urlInfo: {
            id: "2ECFBFC02440C7BF84BC83AF637ACE4E",
            url:
              "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/knmcgDqK_128092819_sd.mp4?ts=1653402626&rid=3CE44C35BD8ABE1396EF75BB18AC0DF2&rl=3&rs=FghuJFROxVeaMlODhmKuLmoauPPzqJMi&sign=b4aaf78b293bec0555e2f28b9c74e63f&ext=2pC2n00JeHoGwaq9Chze9St7hF5AxIk95wo7CPfRy2wfts46dCy1929h8awMb7mp%2FLrbRSbp69FtPwJq%2BfbhShkufD2xG12W1hvHZpZp%2FGor2SMyGhvsJVLnCMJ%2FhPUxJ5hmtrQBW7wgQ72ZCepm6SfT%2FdurBUNDL0JHXb%2FAa6mbsYu29ttWKsMGrCGzRZPETDiEcRjUbo7dkBDBajmT3TglBKu6B2uEwKT6GWeyzbDrDCti%2FijUzyG3kk4J2gom",
            size: 6958433,
            validityTime: 1200,
            needPay: false,
            payInfo: null,
            r: 240,
          },
          videoGroup: [
            {
              id: 58100,
              name: "现场",
              alg: null,
            },
            {
              id: 59101,
              name: "华语现场",
              alg: null,
            },
            {
              id: 57108,
              name: "流行现场",
              alg: null,
            },
            {
              id: 1100,
              name: "音乐现场",
              alg: null,
            },
            {
              id: 5100,
              name: "音乐",
              alg: null,
            },
            {
              id: 16201,
              name: "温暖",
              alg: null,
            },
          ],
          previewUrl: null,
          previewDurationms: 0,
          hasRelatedGameAd: false,
          markTypes: [109],
          relateSong: [
            {
              name: "祈祷",
              id: 301947,
              pst: 0,
              t: 0,
              ar: [
                {
                  id: 9657,
                  name: "王韵婵",
                  tns: [],
                  alias: [],
                },
                {
                  id: 5358,
                  name: "王杰",
                  tns: [],
                  alias: [],
                },
              ],
              alia: [],
              pop: 100,
              st: 0,
              rt: "",
              fee: 8,
              v: 20,
              crbt: null,
              cf: "",
              al: {
                id: 29911,
                name: "祈祷",
                picUrl:
                  "http://p3.music.126.net/Cxe8i6l2TePK9Fb4rrsC_A==/109951163611525216.jpg",
                tns: [],
                pic_str: "109951163611525216",
                pic: 109951163611525220,
              },
              dt: 270333,
              h: {
                br: 320000,
                fid: 0,
                size: 10815782,
                vd: 17526,
              },
              m: {
                br: 192000,
                fid: 0,
                size: 6489487,
                vd: 20141,
              },
              l: {
                br: 128000,
                fid: 0,
                size: 4326339,
                vd: 21825,
              },
              a: null,
              cd: "1",
              no: 7,
              rtUrl: null,
              ftype: 0,
              rtUrls: [],
              djId: 0,
              copyright: 1,
              s_id: 0,
              rtype: 0,
              rurl: null,
              mst: 9,
              cp: 7002,
              mv: 5309077,
              publishTime: 752083200000,
              privilege: {
                id: 301947,
                fee: 8,
                payed: 1,
                st: 0,
                pl: 999000,
                dl: 999000,
                sp: 7,
                cp: 1,
                subp: 1,
                cs: false,
                maxbr: 999000,
                fl: 128000,
                toast: false,
                flag: 256,
                preSell: false,
              },
            },
          ],
          relatedInfo: null,
          videoUserLiveInfo: null,
          vid: "2ECFBFC02440C7BF84BC83AF637ACE4E",
          durationms: 73165,
          playTime: 1579764,
          praisedCount: 8674,
          praised: false,
          subscribed: false,
        },
      },
      {
        alg: "onlineHotGroup",
        extAlg: null,
        data: {
          alg: "onlineHotGroup",
          scm: "1.music-video-timeline.video_timeline.video.181017.-295043608",
          threadId: "R_VI_62_2ECFBFC02440C7BF84BC83AF637ACE4E",
          coverUrl:
            "https://p2.music.126.net/gax3FlvmFsYYsXcVOsG3_Q==/109951165353772705.jpg",
          height: 360,
          width: 480,
          title: "这才是王杰原来的声音，为杰哥祈祷，声音早日康复。",
          description: "这才是王杰原来的声音，为杰哥祈祷，声音早日康复。",
          commentCount: 746,
          shareCount: 1527,
          resolutions: [
            {
              resolution: 240,
              size: 6958433,
            },
          ],
          creator: {
            defaultAvatar: false,
            province: 330000,
            authStatus: 1,
            followed: false,
            avatarUrl:
              "http://p1.music.126.net/NyE3ZaBBa4q1uTRycso9jQ==/109951164200929365.jpg",
            accountStatus: 0,
            gender: 1,
            city: 330100,
            birthday: 644770800000,
            userId: 74474,
            userType: 4,
            nickname: "葱_music",
            signature: "音乐一窍不通，仅是喜欢。",
            description: "",
            detailDescription: "",
            avatarImgId: 109951164200929360,
            backgroundImgId: 109951163339122270,
            backgroundUrl:
              "http://p1.music.126.net/C7sUbNgRxYvgDVOSA8ZcjQ==/109951163339122274.jpg",
            authority: 0,
            mutual: false,
            expertTags: null,
            experts: {
              1: "音乐视频达人",
              2: "生活图文达人",
            },
            djStatus: 10,
            vipType: 11,
            remarkName: null,
            avatarImgIdStr: "109951164200929365",
            backgroundImgIdStr: "109951163339122274",
          },
          urlInfo: {
            id: "2ECFBFC02440C7BF84BC83AF637ACE4E",
            url:
              "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/knmcgDqK_128092819_sd.mp4?ts=1653402626&rid=3CE44C35BD8ABE1396EF75BB18AC0DF2&rl=3&rs=FghuJFROxVeaMlODhmKuLmoauPPzqJMi&sign=b4aaf78b293bec0555e2f28b9c74e63f&ext=2pC2n00JeHoGwaq9Chze9St7hF5AxIk95wo7CPfRy2wfts46dCy1929h8awMb7mp%2FLrbRSbp69FtPwJq%2BfbhShkufD2xG12W1hvHZpZp%2FGor2SMyGhvsJVLnCMJ%2FhPUxJ5hmtrQBW7wgQ72ZCepm6SfT%2FdurBUNDL0JHXb%2FAa6mbsYu29ttWKsMGrCGzRZPETDiEcRjUbo7dkBDBajmT3TglBKu6B2uEwKT6GWeyzbDrDCti%2FijUzyG3kk4J2gom",
            size: 6958433,
            validityTime: 1200,
            needPay: false,
            payInfo: null,
            r: 240,
          },
          videoGroup: [
            {
              id: 58100,
              name: "现场",
              alg: null,
            },
            {
              id: 59101,
              name: "华语现场",
              alg: null,
            },
            {
              id: 57108,
              name: "流行现场",
              alg: null,
            },
            {
              id: 1100,
              name: "音乐现场",
              alg: null,
            },
            {
              id: 5100,
              name: "音乐",
              alg: null,
            },
            {
              id: 16201,
              name: "温暖",
              alg: null,
            },
          ],
          previewUrl: null,
          previewDurationms: 0,
          hasRelatedGameAd: false,
          markTypes: [109],
          relateSong: [
            {
              name: "祈祷",
              id: 301947,
              pst: 0,
              t: 0,
              ar: [
                {
                  id: 9657,
                  name: "王韵婵",
                  tns: [],
                  alias: [],
                },
                {
                  id: 5358,
                  name: "王杰",
                  tns: [],
                  alias: [],
                },
              ],
              alia: [],
              pop: 100,
              st: 0,
              rt: "",
              fee: 8,
              v: 20,
              crbt: null,
              cf: "",
              al: {
                id: 29911,
                name: "祈祷",
                picUrl:
                  "http://p3.music.126.net/Cxe8i6l2TePK9Fb4rrsC_A==/109951163611525216.jpg",
                tns: [],
                pic_str: "109951163611525216",
                pic: 109951163611525220,
              },
              dt: 270333,
              h: {
                br: 320000,
                fid: 0,
                size: 10815782,
                vd: 17526,
              },
              m: {
                br: 192000,
                fid: 0,
                size: 6489487,
                vd: 20141,
              },
              l: {
                br: 128000,
                fid: 0,
                size: 4326339,
                vd: 21825,
              },
              a: null,
              cd: "1",
              no: 7,
              rtUrl: null,
              ftype: 0,
              rtUrls: [],
              djId: 0,
              copyright: 1,
              s_id: 0,
              rtype: 0,
              rurl: null,
              mst: 9,
              cp: 7002,
              mv: 5309077,
              publishTime: 752083200000,
              privilege: {
                id: 301947,
                fee: 8,
                payed: 1,
                st: 0,
                pl: 999000,
                dl: 999000,
                sp: 7,
                cp: 1,
                subp: 1,
                cs: false,
                maxbr: 999000,
                fl: 128000,
                toast: false,
                flag: 256,
                preSell: false,
              },
            },
          ],
          relatedInfo: null,
          videoUserLiveInfo: null,
          vid: "2ECFBFC02440C7BF84BC83AF637ACE4E",
          durationms: 73165,
          playTime: 1579764,
          praisedCount: 8674,
          praised: false,
          subscribed: false,
        },
      },
      {
        alg: "onlineHotGroup",
        extAlg: null,
        data: {
          alg: "onlineHotGroup",
          scm: "1.music-video-timeline.video_timeline.video.181017.-295043608",
          threadId: "R_VI_62_2ECFBFC02440C7BF84BC83AF637ACE4E",
          coverUrl:
            "https://p2.music.126.net/gax3FlvmFsYYsXcVOsG3_Q==/109951165353772705.jpg",
          height: 360,
          width: 480,
          title: "这才是王杰原来的声音，为杰哥祈祷，声音早日康复。",
          description: "这才是王杰原来的声音，为杰哥祈祷，声音早日康复。",
          commentCount: 746,
          shareCount: 1527,
          resolutions: [
            {
              resolution: 240,
              size: 6958433,
            },
          ],
          creator: {
            defaultAvatar: false,
            province: 330000,
            authStatus: 1,
            followed: false,
            avatarUrl:
              "http://p1.music.126.net/NyE3ZaBBa4q1uTRycso9jQ==/109951164200929365.jpg",
            accountStatus: 0,
            gender: 1,
            city: 330100,
            birthday: 644770800000,
            userId: 74474,
            userType: 4,
            nickname: "葱_music",
            signature: "音乐一窍不通，仅是喜欢。",
            description: "",
            detailDescription: "",
            avatarImgId: 109951164200929360,
            backgroundImgId: 109951163339122270,
            backgroundUrl:
              "http://p1.music.126.net/C7sUbNgRxYvgDVOSA8ZcjQ==/109951163339122274.jpg",
            authority: 0,
            mutual: false,
            expertTags: null,
            experts: {
              1: "音乐视频达人",
              2: "生活图文达人",
            },
            djStatus: 10,
            vipType: 11,
            remarkName: null,
            avatarImgIdStr: "109951164200929365",
            backgroundImgIdStr: "109951163339122274",
          },
          urlInfo: {
            id: "2ECFBFC02440C7BF84BC83AF637ACE4E",
            url:
              "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/knmcgDqK_128092819_sd.mp4?ts=1653402626&rid=3CE44C35BD8ABE1396EF75BB18AC0DF2&rl=3&rs=FghuJFROxVeaMlODhmKuLmoauPPzqJMi&sign=b4aaf78b293bec0555e2f28b9c74e63f&ext=2pC2n00JeHoGwaq9Chze9St7hF5AxIk95wo7CPfRy2wfts46dCy1929h8awMb7mp%2FLrbRSbp69FtPwJq%2BfbhShkufD2xG12W1hvHZpZp%2FGor2SMyGhvsJVLnCMJ%2FhPUxJ5hmtrQBW7wgQ72ZCepm6SfT%2FdurBUNDL0JHXb%2FAa6mbsYu29ttWKsMGrCGzRZPETDiEcRjUbo7dkBDBajmT3TglBKu6B2uEwKT6GWeyzbDrDCti%2FijUzyG3kk4J2gom",
            size: 6958433,
            validityTime: 1200,
            needPay: false,
            payInfo: null,
            r: 240,
          },
          videoGroup: [
            {
              id: 58100,
              name: "现场",
              alg: null,
            },
            {
              id: 59101,
              name: "华语现场",
              alg: null,
            },
            {
              id: 57108,
              name: "流行现场",
              alg: null,
            },
            {
              id: 1100,
              name: "音乐现场",
              alg: null,
            },
            {
              id: 5100,
              name: "音乐",
              alg: null,
            },
            {
              id: 16201,
              name: "温暖",
              alg: null,
            },
          ],
          previewUrl: null,
          previewDurationms: 0,
          hasRelatedGameAd: false,
          markTypes: [109],
          relateSong: [
            {
              name: "祈祷",
              id: 301947,
              pst: 0,
              t: 0,
              ar: [
                {
                  id: 9657,
                  name: "王韵婵",
                  tns: [],
                  alias: [],
                },
                {
                  id: 5358,
                  name: "王杰",
                  tns: [],
                  alias: [],
                },
              ],
              alia: [],
              pop: 100,
              st: 0,
              rt: "",
              fee: 8,
              v: 20,
              crbt: null,
              cf: "",
              al: {
                id: 29911,
                name: "祈祷",
                picUrl:
                  "http://p3.music.126.net/Cxe8i6l2TePK9Fb4rrsC_A==/109951163611525216.jpg",
                tns: [],
                pic_str: "109951163611525216",
                pic: 109951163611525220,
              },
              dt: 270333,
              h: {
                br: 320000,
                fid: 0,
                size: 10815782,
                vd: 17526,
              },
              m: {
                br: 192000,
                fid: 0,
                size: 6489487,
                vd: 20141,
              },
              l: {
                br: 128000,
                fid: 0,
                size: 4326339,
                vd: 21825,
              },
              a: null,
              cd: "1",
              no: 7,
              rtUrl: null,
              ftype: 0,
              rtUrls: [],
              djId: 0,
              copyright: 1,
              s_id: 0,
              rtype: 0,
              rurl: null,
              mst: 9,
              cp: 7002,
              mv: 5309077,
              publishTime: 752083200000,
              privilege: {
                id: 301947,
                fee: 8,
                payed: 1,
                st: 0,
                pl: 999000,
                dl: 999000,
                sp: 7,
                cp: 1,
                subp: 1,
                cs: false,
                maxbr: 999000,
                fl: 128000,
                toast: false,
                flag: 256,
                preSell: false,
              },
            },
          ],
          relatedInfo: null,
          videoUserLiveInfo: null,
          vid: "2ECFBFC02440C7BF84BC83AF637ACE4E",
          durationms: 73165,
          playTime: 1579764,
          praisedCount: 8674,
          praised: false,
          subscribed: false,
        },
      },
      {
        alg: "onlineHotGroup",
        extAlg: null,
        data: {
          alg: "onlineHotGroup",
          scm: "1.music-video-timeline.video_timeline.video.181017.-295043608",
          threadId: "R_VI_62_2ECFBFC02440C7BF84BC83AF637ACE4E",
          coverUrl:
            "https://p2.music.126.net/gax3FlvmFsYYsXcVOsG3_Q==/109951165353772705.jpg",
          height: 360,
          width: 480,
          title: "这才是王杰原来的声音，为杰哥祈祷，声音早日康复。",
          description: "这才是王杰原来的声音，为杰哥祈祷，声音早日康复。",
          commentCount: 746,
          shareCount: 1527,
          resolutions: [
            {
              resolution: 240,
              size: 6958433,
            },
          ],
          creator: {
            defaultAvatar: false,
            province: 330000,
            authStatus: 1,
            followed: false,
            avatarUrl:
              "http://p1.music.126.net/NyE3ZaBBa4q1uTRycso9jQ==/109951164200929365.jpg",
            accountStatus: 0,
            gender: 1,
            city: 330100,
            birthday: 644770800000,
            userId: 74474,
            userType: 4,
            nickname: "葱_music",
            signature: "音乐一窍不通，仅是喜欢。",
            description: "",
            detailDescription: "",
            avatarImgId: 109951164200929360,
            backgroundImgId: 109951163339122270,
            backgroundUrl:
              "http://p1.music.126.net/C7sUbNgRxYvgDVOSA8ZcjQ==/109951163339122274.jpg",
            authority: 0,
            mutual: false,
            expertTags: null,
            experts: {
              1: "音乐视频达人",
              2: "生活图文达人",
            },
            djStatus: 10,
            vipType: 11,
            remarkName: null,
            avatarImgIdStr: "109951164200929365",
            backgroundImgIdStr: "109951163339122274",
          },
          urlInfo: {
            id: "2ECFBFC02440C7BF84BC83AF637ACE4E",
            url:
              "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/knmcgDqK_128092819_sd.mp4?ts=1653402626&rid=3CE44C35BD8ABE1396EF75BB18AC0DF2&rl=3&rs=FghuJFROxVeaMlODhmKuLmoauPPzqJMi&sign=b4aaf78b293bec0555e2f28b9c74e63f&ext=2pC2n00JeHoGwaq9Chze9St7hF5AxIk95wo7CPfRy2wfts46dCy1929h8awMb7mp%2FLrbRSbp69FtPwJq%2BfbhShkufD2xG12W1hvHZpZp%2FGor2SMyGhvsJVLnCMJ%2FhPUxJ5hmtrQBW7wgQ72ZCepm6SfT%2FdurBUNDL0JHXb%2FAa6mbsYu29ttWKsMGrCGzRZPETDiEcRjUbo7dkBDBajmT3TglBKu6B2uEwKT6GWeyzbDrDCti%2FijUzyG3kk4J2gom",
            size: 6958433,
            validityTime: 1200,
            needPay: false,
            payInfo: null,
            r: 240,
          },
          videoGroup: [
            {
              id: 58100,
              name: "现场",
              alg: null,
            },
            {
              id: 59101,
              name: "华语现场",
              alg: null,
            },
            {
              id: 57108,
              name: "流行现场",
              alg: null,
            },
            {
              id: 1100,
              name: "音乐现场",
              alg: null,
            },
            {
              id: 5100,
              name: "音乐",
              alg: null,
            },
            {
              id: 16201,
              name: "温暖",
              alg: null,
            },
          ],
          previewUrl: null,
          previewDurationms: 0,
          hasRelatedGameAd: false,
          markTypes: [109],
          relateSong: [
            {
              name: "祈祷",
              id: 301947,
              pst: 0,
              t: 0,
              ar: [
                {
                  id: 9657,
                  name: "王韵婵",
                  tns: [],
                  alias: [],
                },
                {
                  id: 5358,
                  name: "王杰",
                  tns: [],
                  alias: [],
                },
              ],
              alia: [],
              pop: 100,
              st: 0,
              rt: "",
              fee: 8,
              v: 20,
              crbt: null,
              cf: "",
              al: {
                id: 29911,
                name: "祈祷",
                picUrl:
                  "http://p3.music.126.net/Cxe8i6l2TePK9Fb4rrsC_A==/109951163611525216.jpg",
                tns: [],
                pic_str: "109951163611525216",
                pic: 109951163611525220,
              },
              dt: 270333,
              h: {
                br: 320000,
                fid: 0,
                size: 10815782,
                vd: 17526,
              },
              m: {
                br: 192000,
                fid: 0,
                size: 6489487,
                vd: 20141,
              },
              l: {
                br: 128000,
                fid: 0,
                size: 4326339,
                vd: 21825,
              },
              a: null,
              cd: "1",
              no: 7,
              rtUrl: null,
              ftype: 0,
              rtUrls: [],
              djId: 0,
              copyright: 1,
              s_id: 0,
              rtype: 0,
              rurl: null,
              mst: 9,
              cp: 7002,
              mv: 5309077,
              publishTime: 752083200000,
              privilege: {
                id: 301947,
                fee: 8,
                payed: 1,
                st: 0,
                pl: 999000,
                dl: 999000,
                sp: 7,
                cp: 1,
                subp: 1,
                cs: false,
                maxbr: 999000,
                fl: 128000,
                toast: false,
                flag: 256,
                preSell: false,
              },
            },
          ],
          relatedInfo: null,
          videoUserLiveInfo: null,
          vid: "2ECFBFC02440C7BF84BC83AF637ACE4E",
          durationms: 73165,
          playTime: 1579764,
          praisedCount: 8674,
          praised: false,
          subscribed: false,
        },
      },
      {
        alg: "onlineHotGroup",
        extAlg: null,
        data: {
          alg: "onlineHotGroup",
          scm: "1.music-video-timeline.video_timeline.video.181017.-295043608",
          threadId: "R_VI_62_2ECFBFC02440C7BF84BC83AF637ACE4E",
          coverUrl:
            "https://p2.music.126.net/gax3FlvmFsYYsXcVOsG3_Q==/109951165353772705.jpg",
          height: 360,
          width: 480,
          title: "这才是王杰原来的声音，为杰哥祈祷，声音早日康复。",
          description: "这才是王杰原来的声音，为杰哥祈祷，声音早日康复。",
          commentCount: 746,
          shareCount: 1527,
          resolutions: [
            {
              resolution: 240,
              size: 6958433,
            },
          ],
          creator: {
            defaultAvatar: false,
            province: 330000,
            authStatus: 1,
            followed: false,
            avatarUrl:
              "http://p1.music.126.net/NyE3ZaBBa4q1uTRycso9jQ==/109951164200929365.jpg",
            accountStatus: 0,
            gender: 1,
            city: 330100,
            birthday: 644770800000,
            userId: 74474,
            userType: 4,
            nickname: "葱_music",
            signature: "音乐一窍不通，仅是喜欢。",
            description: "",
            detailDescription: "",
            avatarImgId: 109951164200929360,
            backgroundImgId: 109951163339122270,
            backgroundUrl:
              "http://p1.music.126.net/C7sUbNgRxYvgDVOSA8ZcjQ==/109951163339122274.jpg",
            authority: 0,
            mutual: false,
            expertTags: null,
            experts: {
              1: "音乐视频达人",
              2: "生活图文达人",
            },
            djStatus: 10,
            vipType: 11,
            remarkName: null,
            avatarImgIdStr: "109951164200929365",
            backgroundImgIdStr: "109951163339122274",
          },
          urlInfo: {
            id: "2ECFBFC02440C7BF84BC83AF637ACE4E",
            url:
              "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/knmcgDqK_128092819_sd.mp4?ts=1653402626&rid=3CE44C35BD8ABE1396EF75BB18AC0DF2&rl=3&rs=FghuJFROxVeaMlODhmKuLmoauPPzqJMi&sign=b4aaf78b293bec0555e2f28b9c74e63f&ext=2pC2n00JeHoGwaq9Chze9St7hF5AxIk95wo7CPfRy2wfts46dCy1929h8awMb7mp%2FLrbRSbp69FtPwJq%2BfbhShkufD2xG12W1hvHZpZp%2FGor2SMyGhvsJVLnCMJ%2FhPUxJ5hmtrQBW7wgQ72ZCepm6SfT%2FdurBUNDL0JHXb%2FAa6mbsYu29ttWKsMGrCGzRZPETDiEcRjUbo7dkBDBajmT3TglBKu6B2uEwKT6GWeyzbDrDCti%2FijUzyG3kk4J2gom",
            size: 6958433,
            validityTime: 1200,
            needPay: false,
            payInfo: null,
            r: 240,
          },
          videoGroup: [
            {
              id: 58100,
              name: "现场",
              alg: null,
            },
            {
              id: 59101,
              name: "华语现场",
              alg: null,
            },
            {
              id: 57108,
              name: "流行现场",
              alg: null,
            },
            {
              id: 1100,
              name: "音乐现场",
              alg: null,
            },
            {
              id: 5100,
              name: "音乐",
              alg: null,
            },
            {
              id: 16201,
              name: "温暖",
              alg: null,
            },
          ],
          previewUrl: null,
          previewDurationms: 0,
          hasRelatedGameAd: false,
          markTypes: [109],
          relateSong: [
            {
              name: "祈祷",
              id: 301947,
              pst: 0,
              t: 0,
              ar: [
                {
                  id: 9657,
                  name: "王韵婵",
                  tns: [],
                  alias: [],
                },
                {
                  id: 5358,
                  name: "王杰",
                  tns: [],
                  alias: [],
                },
              ],
              alia: [],
              pop: 100,
              st: 0,
              rt: "",
              fee: 8,
              v: 20,
              crbt: null,
              cf: "",
              al: {
                id: 29911,
                name: "祈祷",
                picUrl:
                  "http://p3.music.126.net/Cxe8i6l2TePK9Fb4rrsC_A==/109951163611525216.jpg",
                tns: [],
                pic_str: "109951163611525216",
                pic: 109951163611525220,
              },
              dt: 270333,
              h: {
                br: 320000,
                fid: 0,
                size: 10815782,
                vd: 17526,
              },
              m: {
                br: 192000,
                fid: 0,
                size: 6489487,
                vd: 20141,
              },
              l: {
                br: 128000,
                fid: 0,
                size: 4326339,
                vd: 21825,
              },
              a: null,
              cd: "1",
              no: 7,
              rtUrl: null,
              ftype: 0,
              rtUrls: [],
              djId: 0,
              copyright: 1,
              s_id: 0,
              rtype: 0,
              rurl: null,
              mst: 9,
              cp: 7002,
              mv: 5309077,
              publishTime: 752083200000,
              privilege: {
                id: 301947,
                fee: 8,
                payed: 1,
                st: 0,
                pl: 999000,
                dl: 999000,
                sp: 7,
                cp: 1,
                subp: 1,
                cs: false,
                maxbr: 999000,
                fl: 128000,
                toast: false,
                flag: 256,
                preSell: false,
              },
            },
          ],
          relatedInfo: null,
          videoUserLiveInfo: null,
          vid: "2ECFBFC02440C7BF84BC83AF637ACE4E",
          durationms: 73165,
          playTime: 1579764,
          praisedCount: 8674,
          praised: false,
          subscribed: false,
        },
      },
      {
        alg: "onlineHotGroup",
        extAlg: null,
        data: {
          alg: "onlineHotGroup",
          scm: "1.music-video-timeline.video_timeline.video.181017.-295043608",
          threadId: "R_VI_62_2ECFBFC02440C7BF84BC83AF637ACE4E",
          coverUrl:
            "https://p2.music.126.net/gax3FlvmFsYYsXcVOsG3_Q==/109951165353772705.jpg",
          height: 360,
          width: 480,
          title: "这才是王杰原来的声音，为杰哥祈祷，声音早日康复。",
          description: "这才是王杰原来的声音，为杰哥祈祷，声音早日康复。",
          commentCount: 746,
          shareCount: 1527,
          resolutions: [
            {
              resolution: 240,
              size: 6958433,
            },
          ],
          creator: {
            defaultAvatar: false,
            province: 330000,
            authStatus: 1,
            followed: false,
            avatarUrl:
              "http://p1.music.126.net/NyE3ZaBBa4q1uTRycso9jQ==/109951164200929365.jpg",
            accountStatus: 0,
            gender: 1,
            city: 330100,
            birthday: 644770800000,
            userId: 74474,
            userType: 4,
            nickname: "葱_music",
            signature: "音乐一窍不通，仅是喜欢。",
            description: "",
            detailDescription: "",
            avatarImgId: 109951164200929360,
            backgroundImgId: 109951163339122270,
            backgroundUrl:
              "http://p1.music.126.net/C7sUbNgRxYvgDVOSA8ZcjQ==/109951163339122274.jpg",
            authority: 0,
            mutual: false,
            expertTags: null,
            experts: {
              1: "音乐视频达人",
              2: "生活图文达人",
            },
            djStatus: 10,
            vipType: 11,
            remarkName: null,
            avatarImgIdStr: "109951164200929365",
            backgroundImgIdStr: "109951163339122274",
          },
          urlInfo: {
            id: "2ECFBFC02440C7BF84BC83AF637ACE4E",
            url:
              "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/knmcgDqK_128092819_sd.mp4?ts=1653402626&rid=3CE44C35BD8ABE1396EF75BB18AC0DF2&rl=3&rs=FghuJFROxVeaMlODhmKuLmoauPPzqJMi&sign=b4aaf78b293bec0555e2f28b9c74e63f&ext=2pC2n00JeHoGwaq9Chze9St7hF5AxIk95wo7CPfRy2wfts46dCy1929h8awMb7mp%2FLrbRSbp69FtPwJq%2BfbhShkufD2xG12W1hvHZpZp%2FGor2SMyGhvsJVLnCMJ%2FhPUxJ5hmtrQBW7wgQ72ZCepm6SfT%2FdurBUNDL0JHXb%2FAa6mbsYu29ttWKsMGrCGzRZPETDiEcRjUbo7dkBDBajmT3TglBKu6B2uEwKT6GWeyzbDrDCti%2FijUzyG3kk4J2gom",
            size: 6958433,
            validityTime: 1200,
            needPay: false,
            payInfo: null,
            r: 240,
          },
          videoGroup: [
            {
              id: 58100,
              name: "现场",
              alg: null,
            },
            {
              id: 59101,
              name: "华语现场",
              alg: null,
            },
            {
              id: 57108,
              name: "流行现场",
              alg: null,
            },
            {
              id: 1100,
              name: "音乐现场",
              alg: null,
            },
            {
              id: 5100,
              name: "音乐",
              alg: null,
            },
            {
              id: 16201,
              name: "温暖",
              alg: null,
            },
          ],
          previewUrl: null,
          previewDurationms: 0,
          hasRelatedGameAd: false,
          markTypes: [109],
          relateSong: [
            {
              name: "祈祷",
              id: 301947,
              pst: 0,
              t: 0,
              ar: [
                {
                  id: 9657,
                  name: "王韵婵",
                  tns: [],
                  alias: [],
                },
                {
                  id: 5358,
                  name: "王杰",
                  tns: [],
                  alias: [],
                },
              ],
              alia: [],
              pop: 100,
              st: 0,
              rt: "",
              fee: 8,
              v: 20,
              crbt: null,
              cf: "",
              al: {
                id: 29911,
                name: "祈祷",
                picUrl:
                  "http://p3.music.126.net/Cxe8i6l2TePK9Fb4rrsC_A==/109951163611525216.jpg",
                tns: [],
                pic_str: "109951163611525216",
                pic: 109951163611525220,
              },
              dt: 270333,
              h: {
                br: 320000,
                fid: 0,
                size: 10815782,
                vd: 17526,
              },
              m: {
                br: 192000,
                fid: 0,
                size: 6489487,
                vd: 20141,
              },
              l: {
                br: 128000,
                fid: 0,
                size: 4326339,
                vd: 21825,
              },
              a: null,
              cd: "1",
              no: 7,
              rtUrl: null,
              ftype: 0,
              rtUrls: [],
              djId: 0,
              copyright: 1,
              s_id: 0,
              rtype: 0,
              rurl: null,
              mst: 9,
              cp: 7002,
              mv: 5309077,
              publishTime: 752083200000,
              privilege: {
                id: 301947,
                fee: 8,
                payed: 1,
                st: 0,
                pl: 999000,
                dl: 999000,
                sp: 7,
                cp: 1,
                subp: 1,
                cs: false,
                maxbr: 999000,
                fl: 128000,
                toast: false,
                flag: 256,
                preSell: false,
              },
            },
          ],
          relatedInfo: null,
          videoUserLiveInfo: null,
          vid: "2ECFBFC02440C7BF84BC83AF637ACE4E",
          durationms: 73165,
          playTime: 1579764,
          praisedCount: 8674,
          praised: false,
          subscribed: false,
        },
      },
      {
        alg: "onlineHotGroup",
        extAlg: null,
        data: {
          alg: "onlineHotGroup",
          scm: "1.music-video-timeline.video_timeline.video.181017.-295043608",
          threadId: "R_VI_62_2ECFBFC02440C7BF84BC83AF637ACE4E",
          coverUrl:
            "https://p2.music.126.net/gax3FlvmFsYYsXcVOsG3_Q==/109951165353772705.jpg",
          height: 360,
          width: 480,
          title: "这才是王杰原来的声音，为杰哥祈祷，声音早日康复。",
          description: "这才是王杰原来的声音，为杰哥祈祷，声音早日康复。",
          commentCount: 746,
          shareCount: 1527,
          resolutions: [
            {
              resolution: 240,
              size: 6958433,
            },
          ],
          creator: {
            defaultAvatar: false,
            province: 330000,
            authStatus: 1,
            followed: false,
            avatarUrl:
              "http://p1.music.126.net/NyE3ZaBBa4q1uTRycso9jQ==/109951164200929365.jpg",
            accountStatus: 0,
            gender: 1,
            city: 330100,
            birthday: 644770800000,
            userId: 74474,
            userType: 4,
            nickname: "葱_music",
            signature: "音乐一窍不通，仅是喜欢。",
            description: "",
            detailDescription: "",
            avatarImgId: 109951164200929360,
            backgroundImgId: 109951163339122270,
            backgroundUrl:
              "http://p1.music.126.net/C7sUbNgRxYvgDVOSA8ZcjQ==/109951163339122274.jpg",
            authority: 0,
            mutual: false,
            expertTags: null,
            experts: {
              1: "音乐视频达人",
              2: "生活图文达人",
            },
            djStatus: 10,
            vipType: 11,
            remarkName: null,
            avatarImgIdStr: "109951164200929365",
            backgroundImgIdStr: "109951163339122274",
          },
          urlInfo: {
            id: "2ECFBFC02440C7BF84BC83AF637ACE4E",
            url:
              "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/knmcgDqK_128092819_sd.mp4?ts=1653402626&rid=3CE44C35BD8ABE1396EF75BB18AC0DF2&rl=3&rs=FghuJFROxVeaMlODhmKuLmoauPPzqJMi&sign=b4aaf78b293bec0555e2f28b9c74e63f&ext=2pC2n00JeHoGwaq9Chze9St7hF5AxIk95wo7CPfRy2wfts46dCy1929h8awMb7mp%2FLrbRSbp69FtPwJq%2BfbhShkufD2xG12W1hvHZpZp%2FGor2SMyGhvsJVLnCMJ%2FhPUxJ5hmtrQBW7wgQ72ZCepm6SfT%2FdurBUNDL0JHXb%2FAa6mbsYu29ttWKsMGrCGzRZPETDiEcRjUbo7dkBDBajmT3TglBKu6B2uEwKT6GWeyzbDrDCti%2FijUzyG3kk4J2gom",
            size: 6958433,
            validityTime: 1200,
            needPay: false,
            payInfo: null,
            r: 240,
          },
          videoGroup: [
            {
              id: 58100,
              name: "现场",
              alg: null,
            },
            {
              id: 59101,
              name: "华语现场",
              alg: null,
            },
            {
              id: 57108,
              name: "流行现场",
              alg: null,
            },
            {
              id: 1100,
              name: "音乐现场",
              alg: null,
            },
            {
              id: 5100,
              name: "音乐",
              alg: null,
            },
            {
              id: 16201,
              name: "温暖",
              alg: null,
            },
          ],
          previewUrl: null,
          previewDurationms: 0,
          hasRelatedGameAd: false,
          markTypes: [109],
          relateSong: [
            {
              name: "祈祷",
              id: 301947,
              pst: 0,
              t: 0,
              ar: [
                {
                  id: 9657,
                  name: "王韵婵",
                  tns: [],
                  alias: [],
                },
                {
                  id: 5358,
                  name: "王杰",
                  tns: [],
                  alias: [],
                },
              ],
              alia: [],
              pop: 100,
              st: 0,
              rt: "",
              fee: 8,
              v: 20,
              crbt: null,
              cf: "",
              al: {
                id: 29911,
                name: "祈祷",
                picUrl:
                  "http://p3.music.126.net/Cxe8i6l2TePK9Fb4rrsC_A==/109951163611525216.jpg",
                tns: [],
                pic_str: "109951163611525216",
                pic: 109951163611525220,
              },
              dt: 270333,
              h: {
                br: 320000,
                fid: 0,
                size: 10815782,
                vd: 17526,
              },
              m: {
                br: 192000,
                fid: 0,
                size: 6489487,
                vd: 20141,
              },
              l: {
                br: 128000,
                fid: 0,
                size: 4326339,
                vd: 21825,
              },
              a: null,
              cd: "1",
              no: 7,
              rtUrl: null,
              ftype: 0,
              rtUrls: [],
              djId: 0,
              copyright: 1,
              s_id: 0,
              rtype: 0,
              rurl: null,
              mst: 9,
              cp: 7002,
              mv: 5309077,
              publishTime: 752083200000,
              privilege: {
                id: 301947,
                fee: 8,
                payed: 1,
                st: 0,
                pl: 999000,
                dl: 999000,
                sp: 7,
                cp: 1,
                subp: 1,
                cs: false,
                maxbr: 999000,
                fl: 128000,
                toast: false,
                flag: 256,
                preSell: false,
              },
            },
          ],
          relatedInfo: null,
          videoUserLiveInfo: null,
          vid: "2ECFBFC02440C7BF84BC83AF637ACE4E",
          durationms: 73165,
          playTime: 1579764,
          praisedCount: 8674,
          praised: false,
          subscribed: false,
        },
      },
      {
        alg: "onlineHotGroup",
        extAlg: null,
        data: {
          alg: "onlineHotGroup",
          scm: "1.music-video-timeline.video_timeline.video.181017.-295043608",
          threadId: "R_VI_62_2ECFBFC02440C7BF84BC83AF637ACE4E",
          coverUrl:
            "https://p2.music.126.net/gax3FlvmFsYYsXcVOsG3_Q==/109951165353772705.jpg",
          height: 360,
          width: 480,
          title: "这才是王杰原来的声音，为杰哥祈祷，声音早日康复。",
          description: "这才是王杰原来的声音，为杰哥祈祷，声音早日康复。",
          commentCount: 746,
          shareCount: 1527,
          resolutions: [
            {
              resolution: 240,
              size: 6958433,
            },
          ],
          creator: {
            defaultAvatar: false,
            province: 330000,
            authStatus: 1,
            followed: false,
            avatarUrl:
              "http://p1.music.126.net/NyE3ZaBBa4q1uTRycso9jQ==/109951164200929365.jpg",
            accountStatus: 0,
            gender: 1,
            city: 330100,
            birthday: 644770800000,
            userId: 74474,
            userType: 4,
            nickname: "葱_music",
            signature: "音乐一窍不通，仅是喜欢。",
            description: "",
            detailDescription: "",
            avatarImgId: 109951164200929360,
            backgroundImgId: 109951163339122270,
            backgroundUrl:
              "http://p1.music.126.net/C7sUbNgRxYvgDVOSA8ZcjQ==/109951163339122274.jpg",
            authority: 0,
            mutual: false,
            expertTags: null,
            experts: {
              1: "音乐视频达人",
              2: "生活图文达人",
            },
            djStatus: 10,
            vipType: 11,
            remarkName: null,
            avatarImgIdStr: "109951164200929365",
            backgroundImgIdStr: "109951163339122274",
          },
          urlInfo: {
            id: "2ECFBFC02440C7BF84BC83AF637ACE4E",
            url:
              "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/knmcgDqK_128092819_sd.mp4?ts=1653402626&rid=3CE44C35BD8ABE1396EF75BB18AC0DF2&rl=3&rs=FghuJFROxVeaMlODhmKuLmoauPPzqJMi&sign=b4aaf78b293bec0555e2f28b9c74e63f&ext=2pC2n00JeHoGwaq9Chze9St7hF5AxIk95wo7CPfRy2wfts46dCy1929h8awMb7mp%2FLrbRSbp69FtPwJq%2BfbhShkufD2xG12W1hvHZpZp%2FGor2SMyGhvsJVLnCMJ%2FhPUxJ5hmtrQBW7wgQ72ZCepm6SfT%2FdurBUNDL0JHXb%2FAa6mbsYu29ttWKsMGrCGzRZPETDiEcRjUbo7dkBDBajmT3TglBKu6B2uEwKT6GWeyzbDrDCti%2FijUzyG3kk4J2gom",
            size: 6958433,
            validityTime: 1200,
            needPay: false,
            payInfo: null,
            r: 240,
          },
          videoGroup: [
            {
              id: 58100,
              name: "现场",
              alg: null,
            },
            {
              id: 59101,
              name: "华语现场",
              alg: null,
            },
            {
              id: 57108,
              name: "流行现场",
              alg: null,
            },
            {
              id: 1100,
              name: "音乐现场",
              alg: null,
            },
            {
              id: 5100,
              name: "音乐",
              alg: null,
            },
            {
              id: 16201,
              name: "温暖",
              alg: null,
            },
          ],
          previewUrl: null,
          previewDurationms: 0,
          hasRelatedGameAd: false,
          markTypes: [109],
          relateSong: [
            {
              name: "祈祷",
              id: 301947,
              pst: 0,
              t: 0,
              ar: [
                {
                  id: 9657,
                  name: "王韵婵",
                  tns: [],
                  alias: [],
                },
                {
                  id: 5358,
                  name: "王杰",
                  tns: [],
                  alias: [],
                },
              ],
              alia: [],
              pop: 100,
              st: 0,
              rt: "",
              fee: 8,
              v: 20,
              crbt: null,
              cf: "",
              al: {
                id: 29911,
                name: "祈祷",
                picUrl:
                  "http://p3.music.126.net/Cxe8i6l2TePK9Fb4rrsC_A==/109951163611525216.jpg",
                tns: [],
                pic_str: "109951163611525216",
                pic: 109951163611525220,
              },
              dt: 270333,
              h: {
                br: 320000,
                fid: 0,
                size: 10815782,
                vd: 17526,
              },
              m: {
                br: 192000,
                fid: 0,
                size: 6489487,
                vd: 20141,
              },
              l: {
                br: 128000,
                fid: 0,
                size: 4326339,
                vd: 21825,
              },
              a: null,
              cd: "1",
              no: 7,
              rtUrl: null,
              ftype: 0,
              rtUrls: [],
              djId: 0,
              copyright: 1,
              s_id: 0,
              rtype: 0,
              rurl: null,
              mst: 9,
              cp: 7002,
              mv: 5309077,
              publishTime: 752083200000,
              privilege: {
                id: 301947,
                fee: 8,
                payed: 1,
                st: 0,
                pl: 999000,
                dl: 999000,
                sp: 7,
                cp: 1,
                subp: 1,
                cs: false,
                maxbr: 999000,
                fl: 128000,
                toast: false,
                flag: 256,
                preSell: false,
              },
            },
          ],
          relatedInfo: null,
          videoUserLiveInfo: null,
          vid: "2ECFBFC02440C7BF84BC83AF637ACE4E",
          durationms: 73165,
          playTime: 1579764,
          praisedCount: 8674,
          praised: false,
          subscribed: false,
        },
      },
    ];
    let videoList = this.data.videoList;
    videoList.push(...newVideoList);
    this.setData({ videoList });
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
  onPullDownRefresh() {
    console.log("页面下拉刷新");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log("页面上拉处理");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage({ from }) {
    console.log(from);
    if (from === "button") {
      return {
        title: "来自button的转发",
        path: "/pages/video/video",
        imageUrl: "/static/images/nvsheng.jpg",
      };
    } else {
      return {
        title: "来自menu的转发",
        path: "/pages/video/video",
        imageUrl: "/static/images/nvsheng.jpg",
      };
    }
  },
});
