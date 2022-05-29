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
      CHANNEL_ID_04: 'UCgunVdIAaXrmrpGTUlp5nOA-gpQ',
      APIKEY: 'AIzaSyDuKNkg0X_nwgg-9Yb2bH3JEDC2djGvNFc',
      LIVESTATUS: '',
      JUDGEMENBER: '',
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

  switch (channelId) {
    case this.o.CHANNEL_ID_01:
      console.log('o1')
      break;

      case this.o.CHANNEL_ID_02:
        console.log('o2')
        break;

      case this.o.CHANNEL_ID_03:
        console.log('o3')
      break;

      case this.o.CHANNEL_ID_04:
        console.log('o4')
      break;
  }

  return await getYouTube("playlistItems", {
    part: "snippet",
    maxResults: 50,
    playlistId,
  })
};

const liveStatusFunc = (resolveItem, i) => {
  return getYouTube("videos", {
    part: "snippet",
    id: resolveItem.items[i].snippet.resourceId.videoId,
  })
}

const liveStatus = (resolveItem, rootitems) => {
  console.log(resolveItem);
    if (resolveItem.items[0].snippet.liveBroadcastContent === 'none') {
      this.o.LIVESTATUS = '<span class="live-status">アーカイブ済み</span>';
    } else if (resolveItem.items[0].snippet.liveBroadcastContent === 'live') {
      this.o.LIVESTATUS = `<span class="live-status--live">LIVE</span>`;
    } else if (resolveItem.items[0].snippet.liveBroadcastContent === 'upcoming') {
      this.o.LIVESTATUS = `<span class="live-status--upcoming">配信予定</span>`;
    }

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
    root.appendChild(rootitems);

    liveStatusFunc(resolveItem, i).then(r => liveStatus(r, rootitems));
  }
}
getVideos(this.o.CHANNEL_ID_02).then(r => resolveFunc(r));
// べー
getVideos(this.o.CHANNEL_ID_01).then(r => resolveFunc(r));

// ライラさん
getVideos(this.o.CHANNEL_ID_02).then(r => resolveFunc(r));

// なごみさん
// getVideos(this.o.CHANNEL_ID_03).then(r => resolveFunc(r, this.o.JUDGEMENBER='03'));

// ろろぬさん
// getVideos(this.o.CHANNEL_ID_04).then(r => resolveFunc(r, this.o.JUDGEMENBER='04'));
  }
}
