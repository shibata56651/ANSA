export class headertoggle {
  /**
   * @param  {Element} element rootとなる要素
   * @param  {Element} toggleRoots aタグ
   * @returns void
   */
  constructor(element, toggleRoots = {}) {
    const defaultOptions = {
      activeClass: 'is-active',
      closeClass: 'is-close',
      toggleHeight: 0,
      closeStyle: 'height: 0;',
    };

    this.o = Object.assign(defaultOptions);
    this.element = element;
    this.toggleRoots = toggleRoots;
    this.targetContent = undefined;
    this.toggleId = '';
    this.toggleFlg = true;
    this.init();
  }
  /**
   * 初期化処理
   *
   * @returns void
   */
  init() {
    this.element.addEventListener('click', this.clickHandler.bind(this));
  }

    /**
   * トグル機能
   *
   * @param  {MouseEvent} e クリックした要素
   * @returns void
   */
  clickHandler(e) {
    e.preventDefault();
    const href = this.element.getAttribute('aria-controls');
    this.targetContent = document.getElementById(href);
    this.toggleId = this.targetContent.id;

    if (this.element.classList.contains(this.o.activeClass)) {

      this.targetContent.style = this.openStyle;

      setTimeout(() => {
        this.targetContent.style = this.o.closeStyle;
      }, 10);

      setTimeout(() => {
        this.element.classList.remove(this.o.activeClass);
        this.closeHandler();
      }, 400);

      return;
    } else if (!this.element.classList.contains(this.o.activeClass)) {

      // 別のメガメニューテキストをクリックした際に、現在ついているカレントを外す
      for (const item of this.toggleRoots) {
        const targetContent = item.parentNode.querySelector('.header-menu-contents');
        if (item.classList.contains(this.o.activeClass)) {
          item.classList.remove(this.o.activeClass);
          targetContent.style = '';
        }
      }

      this.element.classList.add(this.o.activeClass);
      this.o.toggleHeight = this.targetContent.offsetHeight;
      this.targetContent.style = this.o.closeStyle;
      this.openStyle = `height: ${this.o.toggleHeight}px;`;

      // 更新されたDOMをoffsetHeightで再度読みに行く。
      this.targetContent.offsetHeight;
      this.targetContent.style = this.openStyle;

      setTimeout(() => {
        this.closeHandler();
      }, 300)
    }
  }

  closeHandler() {
    this.targetContent.style = '';
  }
}
