export class tab {
  /**
   * @param  {Element} element rootとなる要素
   * @returns void
   */
  constructor(element, roots, displayTarget = {}) {
    const defaultOptions = {
      activeClass: 'is-active',
      tabItem: displayTarget,
    };

    this.o = Object.assign(defaultOptions);
    this.element = element;
    this.roots = roots;
    this.tabItem = null;
    this.displayItem = null;
    this.content = document.getElementById(this.element.hash.substring(1));
    this.activeClass = this.o.activeClass;

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
  clickHandler(e) {
    e.preventDefault();

    if(this.element.classList.contains('js-tab-hook-02')) {
      this.displayItem = document.querySelectorAll(`.js-tab-news-items`);
    } else if(this.element.classList.contains('js-tab-hook')) {
      this.displayItem = document.querySelectorAll(`.js-tab-member-items`);
    }

    for (const item of this.roots) {
      item.parentNode.classList.remove(this.activeClass);
    }

    for (const item of this.displayItem) {
      item.classList.remove(this.activeClass);
    }

    const href = this.element.getAttribute('href').substring(1);
    this.tabItem = document.getElementById(href);

    this.element.parentNode.classList.add(this.activeClass);
    this.content.classList.add(this.activeClass);
    }
}
