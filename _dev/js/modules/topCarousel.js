export class topCarousel {
  /**
   * @param  {Element} elements rootとなる要素
   * @returns void
   */
  constructor(elements = {}) {
    const defaultOptions = {
      activeClass: 'is-active',
      changeClass: 'is-changing',
      pauseClass: 'is-pause',
      count: 0,
    };

    this.o = Object.assign(defaultOptions);
    this.elements = elements;
    this.carouselBtn = document.querySelector('.js-carousel-mv-btn');
    this.timer;
    this.init();
  }
  /**
   * 初期化処理
   *
   * @returns void
   */
  init() {
    window.addEventListener('load', this.fadeAnimationHandler.bind(this));
    this.carouselBtn.addEventListener('click', this.btnHandler.bind(this))
  }

  /**
   * ページロード時にスライドショーを再生する
   *
   * @returns void
   */
  fadeAnimationHandler() {
    this.timer = setInterval(() => {
      if (this.elements[this.o.count].classList.contains('js-last-item')) {
        this.elements[this.o.count].classList.add(this.o.activeClass);
        this.o.count = 0;

        for(const item of this.elements) {
          item.classList.remove(this.o.activeClass);
          item.classList.remove(this.o.changeClass);
        }

        return;
      }

      this.elements[this.o.count].classList.add(this.o.changeClass);
      this.elements[this.o.count + 1].classList.add(this.o.activeClass);

      this.o.count += 1;
    }, 4000);
  }

    /**
   * 一時停止ボタンが押された際にスライドショーを停止する
   *
   * @returns void
   */
  btnHandler() {
    if (this.carouselBtn.textContent === '一時停止') {
      for(const item of this.elements) {
        item.style = 'animation-play-state: paused;';
      }

      clearInterval(this.timer);
      this.carouselBtn.textContent = '再生';
      this.carouselBtn.classList.add(this.o.pauseClass);

      return;
    } else if (this.carouselBtn.textContent === '再生') {
      for(const item of this.elements) {
        item.style = '';
      }

      this.fadeAnimationHandler();
      this.carouselBtn.textContent = '一時停止';
      this.carouselBtn.classList.remove(this.o.pauseClass);
    }
  }
}
