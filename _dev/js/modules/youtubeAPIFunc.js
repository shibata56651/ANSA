export class youtubeAPIFunc {
  /**
   * @param  {Element} elements rootとなる要素
   * @returns void
   */
  constructor(elements, liveElements = {}) {
    const defaultOptions = {
      activeClass: 'is-active',
      CHANNEL_ID_01: 'UCPt71Qf78TNlGfnchQDBBwg',
      CHANNEL_ID_02: 'UCqKexNL7YoueTlGSNZXoqPQ',
      CHANNEL_ID_03: 'UC0GErsdTh7BijpLG7Qd-gpQ',
      CHANNEL_ID_04: 'UCgunVdIAaXrmrpGTUlp5nOA',
      CHANNEL_ID_05: 'UC1CiTzTMaRQUIPdSkvSt29g',
      APIKEY: 'AIzaSyDpGvB-IA0WgEVBYrMdW-dl8zm4emzLYwE',
      ID: '',
      LIVESTATUS: '',
      statusFlg: false,
    };

    this.o = Object.assign(defaultOptions);
    this.elements = elements;
    this.liveElm = liveElements;
    this.elmCount = 0;
    this.liveRoot = document.createElement('ul'); //配信中ul
    this.liveRoot.classList.add('temporary-element');
    this.elements.appendChild(this.liveRoot);

    this.reservationRoot = document.createElement('ul'); //予約ul
    this.reservationRoot.classList.add('temporary-element');
    this.liveElm.appendChild(this.reservationRoot);
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
          break;

        case this.o.CHANNEL_ID_02:
          break;

        case this.o.CHANNEL_ID_03:
          break;

        case this.o.CHANNEL_ID_04:
          break;

        case this.o.CHANNEL_ID_05:
          break;
      }

      return await getYouTube("playlistItems", {
        part: "snippet",
        maxResults: 5,
        playlistId,
      })
    };

    const liveStatusFunc = (resolveItem, i) => {
      return getYouTube("videos", {
        part: "snippet",
        id: resolveItem.items[i].snippet.resourceId.videoId,
      })
    }

    const liveFunc = (resolveItem, i) => {
      return getYouTube("videos", {
        part: "liveStreamingDetails",
        id: resolveItem.items[i].snippet.resourceId.videoId,
      })
    }

    const liveStatus = (resolveItem, rootitems, i, detailcontent, livecontent, rootitemsLive) => {

      if (resolveItem.items[0].snippet) {
        if (resolveItem.items[0].snippet.liveBroadcastContent === 'upcoming') {
          this.elmCount += 1;
          this.reservationRoot.appendChild(rootitems);
          const movieRoot = document.createElement('div');
          movieRoot.classList.add('movie-content');
          rootitems.appendChild(movieRoot);
          rootitems.appendChild(detailcontent);

          if (this.elmCount === 1) {
            this.reservationRoot.classList.add('movie-list');
            this.reservationRoot.classList.add('movie-list--col1');
          } else if (this.elmCount === 2) {
            this.reservationRoot.classList.add('movie-list');
            this.reservationRoot.classList.remove('movie-list--col1');
            this.reservationRoot.classList.add('movie-list--col2');
          } else if (this.elmCount === 3) {
            this.reservationRoot.classList.add('movie-list');
            this.reservationRoot.classList.remove('movie-list--col2');
            this.reservationRoot.classList.add('movie-list--col3');
          } else if (this.elmCount === 4) {
            this.reservationRoot.classList.add('movie-list');
            this.reservationRoot.classList.remove('movie-list--col3');
            this.reservationRoot.classList.add('movie-list--col4');
          }

          movieRoot.innerHTML = `<div class="movie-content__items-img">
          <a href="https://www.youtube.com/watch?v=${resolveItem.items[0].id}">
          <img src="${resolveItem.items[0].snippet.thumbnails.maxres.url}">
          </a>
          </div>
        <p class="movie-content__items-channel">${resolveItem.items[0].snippet.channelTitle}</p>
        <p class="movie-content__items-text">${resolveItem.items[0].snippet.title}</p>`;
        } else if (resolveItem.items[0].snippet.liveBroadcastContent === 'live') {
          this.elmCount += 1;
          this.liveRoot.appendChild(rootitems);
          const liveRoot = document.createElement('div');
          livecontent.classList.add('movie-content__items');
          rootitems.appendChild(liveRoot);
          liveRoot.appendChild(detailcontent);

          if (this.elmCount === 1) {
            this.liveRoot.classList.add('movie-list');
            this.liveRoot.classList.add('movie-list--col1');
          } else if (this.elmCount === 2) {
            this.liveRoot.classList.add('movie-list');
            this.liveRoot.classList.remove('movie-list--col1');
            this.liveRoot.classList.add('movie-list--col2');
          } else if (this.elmCount === 3) {
            this.liveRoot.classList.add('movie-list');
            this.liveRoot.classList.remove('movie-list--col2');
            this.liveRoot.classList.add('movie-list--col3');
          } else if (this.elmCount === 4) {
            this.liveRoot.classList.add('movie-list');
            this.liveRoot.classList.remove('movie-list--col3');
            this.liveRoot.classList.add('movie-list--col4');
          }

          liveRoot.innerHTML = `<div class="live-content__items-img"><a href="https://www.youtube.com/watch?v=${resolveItem.items[0].id}"><img src="${resolveItem.items[0].snippet.thumbnails.maxres.url}"></a></div>
      <p class="live-content__items-channel">${resolveItem.items[0].snippet.channelTitle}</p>
      <p class="live-content__items-text">${resolveItem.items[0].snippet.title}</p>`;
        }

        // console.log(root)
      }
    }

    const liveDetailsFunc = (resolveItem, rootitems, i, detailcontent) => {
      const normalizeDateArry = resolveItem.items[0].liveStreamingDetails.scheduledStartTime.split('T');

      let normalizeDate = normalizeDateArry[0].split('-').join('/');
      let hour = Number(normalizeDateArry[1].split(':')[0]);
      let minit = Number(normalizeDateArry[1].split(':')[1]);
      const today = new Date();
      const year = String(today.getFullYear());
      const nowHour = String(today.getHours());
      const nowMinit = String(today.getMinutes());
      let month = today.getMonth() + 1;
      let day = today.getDate();

      if ((today.getMonth() + 1) <= 10) {
        month = String('0' + month);
      } else {
        month = String(month);
      }

      if (day <= 10) {
        day = String('0' + day);
      } else {
        day = String(day);
      }

      const sum = year + month + day + nowHour + nowMinit;
      Number(sum)
      hour = hour + 9;

      String(hour);

      if (minit === 0) {
        minit = '00';
      }

      String(minit);

      const liveTime = String(normalizeDateArry[0].split('-').join('')) + hour + minit;

      if (sum <= liveTime) {
        detailcontent.innerHTML = `<span class="details-content__items-scheduled-date">${normalizeDate}</span><span class="details-content__items-scheduled-time">${hour}:${minit}</span>`;
      }
    };

    const resolveFunc = (resolveItem) => {
      this.elmCount = 0;
      for (let i = 0; i < 10; i++) {
        const rootitems = document.createElement('li');
        const rootitemsLive = document.createElement('li');
        const livecontent = document.createElement('div');
        livecontent.classList.add('live-content');
        const detailcontent = document.createElement('p');
        detailcontent.classList.add('details-content');

        liveFunc(resolveItem, i).then(r => liveDetailsFunc(r, rootitems, i, detailcontent));
        liveStatusFunc(resolveItem, i).then(r => liveStatus(r, rootitems, i, detailcontent, rootitemsLive));
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

    // ANSA公式
    getVideos(this.o.CHANNEL_ID_05).then(r => resolveFunc(r));
  }
}
