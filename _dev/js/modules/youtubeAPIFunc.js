export class youtubeAPIFunc {
  /**
   * @param  {Element} elements rootとなる要素
   * @returns void
   */
  constructor(elements = {}) {
    const defaultOptions = {
      activeClass: 'is-active',
      CHANNEL_ID: 'UC53UDnhAAYwvNO7j_2Ju1cQ',
      APIKEY: 'AIzaSyDuKNkg0X_nwgg-9Yb2bH3JEDC2djGvNFc',
      LIVESTATUS: '',
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
    const API_KEY = "AIzaSyDuKNkg0X_nwgg-9Yb2bH3JEDC2djGvNFc";

const getYouTube = async (api, query, cooldown = 3000) => {
  await new Promise((r) => setTimeout(r, cooldown));
  return await (
    await fetch(`https://www.googleapis.com/youtube/v3/${api}${Object.entries(query).reduce((p, [k, v]) => `${p}&${k}=${v}`, `?key=${API_KEY}`)}`)
  ).json();
};

const getVideos = async (channelId) => {
  const playlistId = (
    await getYouTube("channels", {
      part: "contentDetails",
      id: channelId,
    })
  ).items[0].contentDetails.relatedPlaylists.uploads;
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

const liveStatus = (resolveItem) => {
  console.log(resolveItem);
    if (resolveItem.items[0].snippet.liveBroadcastContent === 'none') {
      this.o.LIVESTATUS = '<span class="live-status">アーカイブ済み</span>';
    } else if (resolveItem.items[0].snippet.liveBroadcastContent === 'live') {
      this.o.LIVESTATUS = `<span class="live-status--live">LIVE</span>`;
    } else if (resolveItem.items[0].snippet.liveBroadcastContent === 'upcoming') {
      this.o.LIVESTATUS = `<span class="live-status--upcoming">配信予定</span>`;
    }
}

const resolveFunc = (resolveItem) => {
  // console.log(resolveItem)
  const root = document.createElement('ul');
  this.elements.appendChild(root);

  for (let i=0;i < 5; i++) {
    const rootitems = document.createElement('li');
    root.appendChild(rootitems);

    liveStatusFunc(resolveItem, i).then(r => liveStatus(r), rootitems.innerHTML = `<div class="items"><div class="items__img"><a href="https://www.youtube.com/watch?v=${resolveItem.items[i].id.videoId}"><img style="width:30%" src="${resolveItem.items[i].snippet.thumbnails.high.url}"></a></div>
    <div class="items__text">${resolveItem.items[i].snippet.title}</div>
    ${this.o.LIVESTATUS}
    </div>`);
  }
}

getVideos("UCqKexNL7YoueTlGSNZXoqPQ").then(r => resolveFunc(r));
// getLiveVideos("UC53UDnhAAYwvNO7j_2Ju1cQ").then(r => resolveFunc(r));
  }
}
