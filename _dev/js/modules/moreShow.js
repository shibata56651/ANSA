export class moreShow {
  /**
   * @param  {Element} element rootとなる要素
   * @returns void
   */
  constructor(element = {}) {
    const defaultOptions = {
      activeClass: 'is-active',
      moreShowContents: 'js-more-show',
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
    // モーダル発火
    this.element.addEventListener('click', this.clickHandler.bind(this));
  }

  /**
   * @param  {object} event 発火ボタンのイベント
   */
  clickHandler() {
    const displayElm = this.element.closest(`.${this.o.moreShowContents}`);

    if (this.element.textContent === '閉じる') {
      this.element.textContent = 'もっと見る';
      displayElm.classList.remove(this.o.activeClass);
      return;
    }

    displayElm.classList.add(this.o.activeClass);
    this.element.textContent = '閉じる';
  }
}
