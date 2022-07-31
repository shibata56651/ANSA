export class load {
  /**
   * @param  {Element} element rootとなる要素
   * @param  {Element} toggleRoots .js-toggle-roots
   * @returns void
   */
  constructor(element = {}) {
    const defaultOptions = {
      animationClass: 'is-animation',
      activeClass: 'is-active',
      closeClass: 'is-close',
      toggleHeight: 0,
      closeStyle: 'height: 0;',
    };

    this.o = Object.assign(defaultOptions);
    this.element = element;
    this.init();
  }
  /**
   * 初期化処理
   *
   * @returns void
   */
  init() {
    window.addEventListener('load', this.loadHandler.bind(this));
  }

  /**
 * トグル機能
 *
 * @param  {MouseEvent} e クリックした要素
 * @returns void
 */
  loadHandler(e) {
    // ローディング画面
    const images = document.getElementsByTagName('img'); // ページ内のimgタグを取得
    const loadingGauge = document.querySelector('.js-load-indicator'); // リアルタイムで読み込まれるゲージ部分
    let imgCounting = 0;
    let baseCounting = 0;
    const gaugeWidth = 100; // ゲージの全体幅
    let current;

    // 画像の読み込み
    for (let i = 0; i < images.length; i++) {
      const img = new Image(); // 新たなimg要素を作成
      // 画像読み込み完了したとき
      img.onload = function () {
        imgCounting += 1;
      }
      // 画像読み込み失敗したとき
      img.onerror = function () {
        imgCounting += 1;
      }
      img.src = images[i].src; // ソースのパスを設定
    };

    // setIntervalを使って一定時間ごとに処理を繰り返す
    const nowLoading = setInterval(() => {
      // baseCountingがimgCountingより大きくならない条件の場合に処理を実行させる。2回目以降にページを読み込んだ時に画像の読み込み履歴が残っている関係で、ローディング画面の表示が速く終わってしまうため、その対策として条件をつけている。
      if (baseCounting <= imgCounting) {
        // リアルタイムで読み込んでいるパーセントを取得
        current = Math.floor(baseCounting / images.length * 100);
        // リアルタイムで読み込まれるゲージ部分を反映させる
        loadingGauge.style.width = Math.floor(gaugeWidth / 100 * current) + '%';
        baseCounting += 1;

        // 全て読み込んだ時
        if (baseCounting === images.length) {
          setTimeout(function () {
            // ローディング画面全体の非表示
            loadingRoot.classList.add('is-load');
            const loadedScreen = document.createElement('span');
            loadedScreen.classList.add('js-screen');
            document.body.appendChild(loadedScreen);
            // ローディングの終了
            clearInterval(nowLoading);
          }, 300);
        }
      }
    }, 50);

    nowLoading();
  }
}
