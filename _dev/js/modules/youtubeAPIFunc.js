export class youtubeAPIFunc {
  /**
   * @param  {Element} elements rootとなる要素
   * @returns void
   */
  constructor(elements = {}) {
    const defaultOptions = {
      activeClass: 'is-active',
      CHANNEL_ID_01: 'UCPt71Qf78TNlGfnchQDBBwg',
      CHANNEL_ID_02: 'UCqKexNL7YoueTlGSNZXoqPQ',
      CHANNEL_ID_03: 'UC0GErsdTh7BijpLG7Qd-gpQ',
      CHANNEL_ID_04: 'UCgunVdIAaXrmrpGTUlp5nOA',
      APIKEY: 'AIzaSyDuKNkg0X_nwgg-9Yb2bH3JEDC2djGvNFc',
      LIVESTATUS: '',
      statusFlg: false,
    };

    this.o = Object.assign(defaultOptions);
    this.elements = elements;
    this.liveElm = document.getElementById('live');
    this.init();
  }
  /**
   * 初期化処理
   *
   * @returns void
   */
  init() {
    window.addEventListener('load', this.onJSClientLoad.bind(this));
  }

  /**
   * ページロード時にスライドショーを再生する
   *
   * @returns void
   */

  /* APIロード */
  onJSClientLoad() {
const getYouTube = async (api, query, cooldown = 300) => {
  await new Promise((r) => setTimeout(r, cooldown));
  return await (
    await fetch(`https://www.googleapis.com/youtube/v3/${api}${Object.entries(query).reduce((p, [k, v]) => `${p}&${k}=${v}`, `?key=${this.o.APIKEY}`)}`)
  ).json();
};

const getVideos = async (channelId) => {
  const playlistId = (
    await getYouTube("channels", {
      part: "contentDetails",
      id: channelId,
    })
  ).items[0].contentDetails.relatedPlaylists.uploads;

  const playlistIdId = (
    await getYouTube("playlistItems", {
      part: "liveStreamingDetails",
      id: channelId,
    })
  ).items[0];

  switch (channelId) {
    case this.o.CHANNEL_ID_01:
      break;

    case this.o.CHANNEL_ID_02:
      break;

    case this.o.CHANNEL_ID_03:
      break;

    case this.o.CHANNEL_ID_04:
      break;
  }

  return await getYouTube("playlistItems", {
    part: "snippet",
    maxResults: 50,
    playlistId,
    playlistIdId,
  })
};

// const liveStatusFunc = (resolveItem, i, status) => {
//   console.log(this.o.statusFlg)
//   if (!this.o.statusFlg) {
//     status = "snippet";
//     this.o.statusFlg = true;
//   } else if (this.o.statusFlg) {
//     status = "liveStreamingDetails";
//     this.o.statusFlg = false;
//   }

//   return getYouTube("videos", {
//     part: status,
//     id: resolveItem.items[i].snippet.resourceId.videoId,
//   })
// }

const liveStatus = (resolveItem, rootitems, status) => {
  // if (status === 'snippet') {
  //   if (resolveItem.items[0].snippet.liveBroadcastContent === 'none') {
  //     this.o.LIVESTATUS = '<span class="live-status">アーカイブ済み</span>';
  //   } else if (resolveItem.items[0].snippet.liveBroadcastContent === 'live') {
  //     this.o.LIVESTATUS = `<span class="live-status--live">LIVE</span>`;
  //   } else if (resolveItem.items[0].snippet.liveBroadcastContent === 'upcoming') {
  //     this.o.LIVESTATUS = `<span class="live-status--upcoming">配信予定</span>`;
  //   }
  // }

  rootitems.innerHTML = `<div class="items"><div class="items__img"><a href="https://www.youtube.com/watch?v=${resolveItem.items[0].id}"><img style="width:30%" src="${resolveItem.items[0].snippet.thumbnails.high.url}"></a></div>
  <div class="items__text">${resolveItem.items[0].snippet.title}</div>
  ${this.o.LIVESTATUS}
  </div>`
}

const resolveFunc = (resolveItem) => {
  const root = document.createElement('ul');
  this.elements.appendChild(root);

  for (let i=0;i < 5; i++) {
    const rootitems = document.createElement('li');
    let status = "snippet";
    root.appendChild(rootitems);

    liveStatusFunc(resolveItem, i, "snippet").then(r => liveStatus(r, rootitems, "snippet"));
    // liveStatusFunc(resolveItem, i, "liveStreamingDetails").then(r => liveStatus(r, rootitems, "liveStreamingDetails"));
  }
}

// べー
getVideos(this.o.CHANNEL_ID_01).then(r => resolveFunc(r));

// ライラさん
getVideos(this.o.CHANNEL_ID_02).then(r => resolveFunc(r));

// なごみさん
getVideos(this.o.CHANNEL_ID_03).then(r => resolveFunc(r));

// ろろぬさん
getVideos(this.o.CHANNEL_ID_04).then(r => resolveFunc(r));
  }
}
