import "./init";
import { swiper } from './modules/swiper';
import { fade } from './modules/fade';
import { SmoothScroll } from './modules/SmoothScroll';
import { tab } from './modules/tab';
import { moreShow } from './modules/moreShow';
import { headertoggle } from './modules/headertoggle';
import { toggle } from './modules/toggle';
import { jsonGetData } from './modules/jsonGetData';
import { xmlGetData } from './modules/xmlGetData';
import { mvAnimation } from './modules/mvAnimation';
import { youtubeAPIFunc } from "./modules/youtubeAPIFunc";
import "@babel/polyfill";
import "scroll-behavior-polyfill";

((win, doc) => {
  const HTML = document.documentElement;
  const { body } = doc;

  const swiperTopRoot = doc.querySelector('.js-swiper-recommend');

  if (swiperTopRoot) {
    new swiper(swiperTopRoot, {
      timer: false,
      swiperOptions: {
        loop: true,
        loopFillGroupWithBlank: true,
        slidesPerView: 3,
        spaceBetween: 45,
        slidesPerGroup: 3,
        speed: 1000,
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 0,
            slidesPerGroup: 1,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
            slidesPerGroup: 3,
          },
          1024: {
            spaceBetween: 45,
          },
        },
        pagination: {
          el: '.js-carousel-pagination',
          type: 'bullets',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        a11y: {
          prevSlideMessage: '\u524D\u3078', // 前へ
          nextSlideMessage: '\u6B21\u3078', // 次へ
        },
      },
    });
  }

  const swiperTopAboutRoot = doc.querySelector('.js-swiper-about');

  if (swiperTopAboutRoot) {
      new swiper(swiperTopAboutRoot, {
      timer: false,
      swiperOptions: {
        loop: true,
        loopFillGroupWithBlank: true,
        slidesPerView: 'auto',
        spaceBetween: 20,
        slidesPerGroup: 1,
        speed: 1000,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.js-carousel-pagination',
          type: 'bullets',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        a11y: {
          prevSlideMessage: '\u524D\u3078', // 前へ
          nextSlideMessage: '\u6B21\u3078', // 次へ
        },
      },
    });
  }

  // アンカーリンク
  const anchorLinks = doc.querySelectorAll('a[href^="#anc-"], a[href="#top"]');
  const urlHash = doc.location.hash;

  for (const item of anchorLinks) {
    new SmoothScroll(item, urlHash);
  }

  // PCheaderトグル
  const headerToggleRoots = doc.querySelectorAll('.js-header-menu-items');

    if (headerToggleRoots.length) {
      for (const item of headerToggleRoots) {
        new headertoggle(item, headerToggleRoots);
      }
    }

  const modalRoots = doc.querySelectorAll('.js-modal-hook');

  if (modalRoots) {
      const modalClose = doc.querySelectorAll('.js-modal-close');
      const modalContent = doc.querySelectorAll('.js-modal-content');
      const newOverlay = doc.createElement('div');
      const FOCUS_ELEM = 'a, input, button, option';
      const FOCUS_ALL_ELEM = doc.querySelectorAll(FOCUS_ELEM);
      const OVERLAY_ID = 'js-modal-overlay';
      const ACTIVE_CLASS = 'is-active';
      let youtube;
      let targetContent = null;
      let topElm = null;
      let activeModalId = '';

      newOverlay.id = OVERLAY_ID;
      doc.body.appendChild(newOverlay);

      const modalOverlay = doc.getElementById(OVERLAY_ID);

      // tabindexの付与処理
      const setTabindex = () => {
          FOCUS_ALL_ELEM.forEach((elem) => {
              const saveTabindex = elem.getAttribute('tabindex');

              if (saveTabindex) {
                  elem.setAttribute('data-tabindex', saveTabindex);
              }
              elem.tabIndex = -1;
          });
      };

      // tabindexの削除処理
      const removeTabIndex = () => {
          FOCUS_ALL_ELEM.forEach((elem) => {
              const saveDataTabindex = elem.getAttribute('data-tabindex');

              if (saveDataTabindex) {
                  elem.tabIndex = saveDataTabindex;
                  elem.removeAttribute('data-tabindex');

                  return;
              }

              elem.removeAttribute('tabindex');
          });
      };

      // モーダル消去
      const removeModal = () => {
          const targetHook = doc.querySelector(`[href="#${activeModalId}"]`);

          document.body.classList.remove('is-modal-fixed');
          document.body.style.top = '';
          window.scrollTo(0, topElm);

          removeTabIndex();
          modalContent.forEach((modalItem) => {
              if (modalItem.classList.contains(ACTIVE_CLASS)) {
                  modalItem.classList.remove(ACTIVE_CLASS);
                  modalOverlay.classList.remove(ACTIVE_CLASS);
              }
          });

          // モーダル消去時youtube再生を停止する
          if (youtube) {
              youtube.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
          }
          targetHook.focus(); // フックにフォーカスを戻す
      };

      // escキーイベント
      /**
       * @param  {object} event ESCキーのイベント
       */
      const escKeyEvent = (event) => {
          modalContent.forEach((modalItem) => {
              if (modalItem.classList.contains(ACTIVE_CLASS)) {
                  const keyEvent = event.key;

                  if (keyEvent === 'Escape' || keyEvent === 'Esc') {
                      removeModal();
                  }
              }
          });
      };

      /**
       * @param  {object} targetElm 押下したa要素のhref属性と一致するid持つ要素
       */
      const activeModal = (targetElm) => {
          const modalFocusItems = targetElm.querySelectorAll(FOCUS_ELEM);

          modalOverlay.classList.add(ACTIVE_CLASS);
          targetElm.classList.add(ACTIVE_CLASS);
          setTabindex();

          // 背景固定
          document.body.classList.add('is-modal-fixed');
          document.body.style.top = `-${topElm}px`;
          modalFocusItems.forEach((modalFocusItem) => {
              modalFocusItem.tabIndex = 0;
          });
      };

      // モーダル発火
      modalRoots.forEach((root) => {
          root.addEventListener('click', (e) => {
              const href = root.getAttribute('href');

              targetContent = doc.getElementById(href.substring(1));
              topElm = window.pageYOffset;

              // youtube動画がある場合、youtube APIを有効
              if (targetContent.querySelector('.lyt-movie-a > .lyt-movie-inner > iframe')) {
                  youtube = targetContent.querySelector('.lyt-movie-a > .lyt-movie-inner > iframe');
                  const dataSrcFlg = youtube.hasAttribute('data-src');
                  if (dataSrcFlg && !youtube.src) {
                      youtube.src = youtube.dataset.src;
                  }

                  const srcAttr = dataSrcFlg ? 'data-src' : 'src';
                  let srcTxt = youtube.getAttribute(srcAttr);
                  const separator = srcTxt.indexOf('?') !== -1 ? '&' : '?';

                  if (srcTxt.indexOf('enablejsapi=1') === -1) {
                      srcTxt += `${separator}enablejsapi=1`;

                      youtube.setAttribute(srcAttr, srcTxt);
                  }
              }

              activeModalId = targetContent.id;
              e.preventDefault();
              activeModal(targetContent);
          });
      });

      // closeボタン押下時
      modalClose.forEach((closeItem) => {
          closeItem.addEventListener('click', () => {
              removeModal();
          });
      });

      // オーバーレイクリック時
      modalOverlay.addEventListener('click', removeModal);

      // escキー押下時のキーイベント
      win.addEventListener('keyup', escKeyEvent);
  }

  const tabRoots = doc.querySelectorAll('.js-tab-hook');
  const tabRoots2 = doc.querySelectorAll('.js-tab-hook-02');
  let displayTarget = null;

  if (tabRoots.length) {
    displayTarget = 'js-tab-news-items';
    for (const item of tabRoots) {
      new tab(item, tabRoots, displayTarget);
    }
  }

  if (tabRoots2.length) {
    displayTarget = 'js-tab-member-items';
    for (const item of tabRoots2) {
      new tab(item, tabRoots2, displayTarget);
    }
  }

  const moreShowRoots = doc.querySelectorAll('.js-show-btn');

  if (moreShowRoots) {
    for (const item of moreShowRoots) {
      new moreShow(item);
    }
  }

  const targets = doc.querySelectorAll('.js-history-animations');
  const wrapTarget = doc.querySelector('.box-history');

  if (targets.length) {
    addEventListener('scroll', () => {
      if (scrollY >= 200) {
        wrapTarget.classList.add('is-animation');
        let i = 0;

        const setAnimation = setInterval(() => {
          if (targets.length > i) {
            targets[i].classList.add('is-fade');
            i++;
          } else {
            clearInterval(setAnimation);
          }
        }, 200);
      }
    })
  }

  const loadingRoot = doc.querySelector('.js-loading');

  if (loadingRoot) {
    win.addEventListener('load', () => {
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
        if (baseCounting <= imgCounting) {
          // リアルタイムで読み込んでいるパーセントを取得
          current = Math.floor(baseCounting / images.length * 100);
          // リアルタイムで読み込まれるゲージ部分を反映させる
          loadingGauge.style.width = Math.floor(gaugeWidth / 100 * current) + '%';
          baseCounting += 1;
          // 全て読み込んだ時
          if (baseCounting === images.length - 20) {
            setTimeout(function () {
              // ローディング画面全体の非表示
              loadingRoot.classList.add('is-load');
              // ローディングの終了
              clearInterval(nowLoading);
              const loadedScreen = document.createElement('span');
              loadedScreen.classList.add('js-screen');
              document.body.appendChild(loadedScreen);
            }, 300);
          }
        }
      }, 50);
    });
  }

  const fadeRoots = doc.querySelectorAll('.js-fade-roots');

  if (fadeRoots) {
    for (const item of fadeRoots) {
      new fade(item);
    }
  }

  const toggleRoots = doc.querySelectorAll('.js-toggle-roots');

  if (toggleRoots.length) {
    for (const item of toggleRoots) {
      const togglejudge = item.dataset.toggleJudge;
      new toggle(item, toggleRoots, togglejudge);
    }
  }

  const cardItems = doc.querySelectorAll('.js-card-animation');

  if (cardItems) {
    win.addEventListener('load', () => {
      let i = 0;

      const setAnimation = setInterval(() => {
        if (cardItems.length > i) {
          cardItems[i].classList.add('is-animation');
          i++;
        } else {
          clearInterval(setAnimation);
        }
      }, 200)
    })
  }

  const jsonRoots = doc.getElementById('json-area');

  if (jsonRoots) {
    new jsonGetData(jsonRoots);
  }

  const xmlRoots = doc.querySelectorAll('.js-data-content');

  if (xmlRoots.length) {
    let num = 0;

    for (const item of xmlRoots) {
      num += 1;
      new xmlGetData(item, num);
    }
  }

    // アンカーリンク
    const animationRoot = doc.querySelector('.mv__animation-wrap');
  
    if (animationRoot) {
      new mvAnimation(animationRoot);
    }

    const youtubeAPIRoot = doc.getElementById('js-youtube-root');
    const youtubeAPIRootLive = doc.getElementById('live');

    if (youtubeAPIRoot) {
      new youtubeAPIFunc(youtubeAPIRoot, youtubeAPIRootLive);
    }

})(window, document);
