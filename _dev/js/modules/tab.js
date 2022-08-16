export class tab {
  /**
   * @param  {Element} element rootとなる要素
   * @returns void
   */
  constructor(element, roots = {}) {
    const defaultOptions = {
      activeClass: 'is-active',
      tabItem: 'js-tab-item',
    };

    this.o = Object.assign(defaultOptions);
    this.element = element;
    this.roots = roots;
    this.tabItem = null;
    this.displayItem = document.querySelectorAll(`.${this.o.tabItem}`);
    this.content = document.getElementById(this.element.hash.substring(1));
    this.activeClass = this.o.activeClass;

    this.init();

    window.addEventListener('load', () => {
      this.loadHandler();
    });
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

  loadHandler() {
    const param = location.search.substring(1);
    const hooks = document.querySelectorAll('.js-tab-hook');
    const hookItems = document.querySelectorAll('.js-tab-item');

    if (param.indexOf('tab') === 0) {
      for (const item of this.roots) {
        item.parentNode.classList.remove(this.activeClass);
      }

      for (const item of this.displayItem) {
        item.classList.remove(this.activeClass);
      }
    }

    for (const hook of hooks) {
      if (hook.getAttribute('href') === `#${param}`) {
        hook.parentNode.classList.add(this.activeClass);
      }
    }

    for (const hookItem of hookItems) {
      if (hookItem.getAttribute('id') === `${param}`) {
        hookItem.classList.add(this.activeClass);
      }
    }
  }
}
