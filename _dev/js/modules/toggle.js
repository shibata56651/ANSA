export class toggle {
  /**
   * @param  {Element} element rootとなる要素
   * @param  {Element} toggleRoots .js-toggle-roots
   * @returns void
   */
  constructor(element, toggleRoots, toggleJudge = {}) {
    const defaultOptions = {
      animationClass: 'is-animation',
      activeClass: 'is-active',
      closeClass: 'is-close',
      toggleHeight: 0,
      closeStyle: 'height: 0;',
    };

    this.o = Object.assign(defaultOptions);
    this.element = element;
    this.elementItem = this.element.querySelector('.js-toggle-item');
    this.elementBtn = this.element.querySelector('.js-toggle-btn');
    this.toggleRoots = toggleRoots;
    this.toggleJudge = toggleJudge;
    this.targetContent = undefined;
    this.fixedItem = undefined;
    this.toggleId = '';
    this.init();
  }
  /**
   * 初期化処理
   *
   * @returns void
   */
  init() {
    this.elementItem.addEventListener('click', this.clickHandler.bind(this));

    if (this.elementBtn) {
      this.elementBtn.addEventListener('click', this.clickHandler.bind(this));
    }
  }

  /**
 * トグル機能
 *
 * @param  {MouseEvent} e クリックした要素
 * @returns void
 */
  clickHandler(e) {
    e.preventDefault();
    const href = this.elementItem.getAttribute('href').substring(1);
    this.targetContent = document.getElementById(href);
    this.toggleId = this.targetContent.id;

    if (this.toggleJudge === 'business') {
      if (this.elementItem.classList.contains(this.o.activeClass)) {
        this.targetContent.style = this.openStyle;

        setTimeout(() => {
          this.targetContent.style = this.o.closeStyle;
        }, 10);

        setTimeout(() => {
          this.elementItem.classList.remove(this.o.activeClass);
          this.elementItem.classList.remove(this.o.animationClass);
          this.elementItem.style = 'display: block';
          this.closeHandler();
        }, 400);
        return;
      } else if (!this.elementItem.classList.contains(this.o.activeClass)) {

        // 別のメガメニューテキストをクリックした際に、現在ついているカレントを外す
        for (const item of this.toggleRoots) {
          if (item.classList.contains(this.o.animationClass)) {
            item.classList.remove(this.o.animationClass);
            item.style = '';
          }

          if (item.classList.contains(this.o.activeClass)) {
            item.classList.remove(this.o.activeClass);
            item.style = '';
          }
        }

        this.elementItem.classList.add(this.o.animationClass);

        setTimeout(() => {
          this.elementItem.style = 'display: none';
        }, 250)

        setTimeout(() => {
          this.elementItem.classList.add(this.o.activeClass);

          this.o.toggleHeight = this.targetContent.offsetHeight;
          this.targetContent.style = this.o.closeStyle;

          this.fixedItem = this.targetContent.querySelector('.js-toggle-content');
          this.fixedItem.style = 'position: absolute;bottom: 0;width: 100%;';

          this.openStyle = `height: ${this.o.toggleHeight}px;`;

          // 更新されたDOMをoffsetHeightで再度読みに行く。
          this.targetContent.offsetHeight;
          this.targetContent.style = this.openStyle;

          setTimeout(() => {
            this.closeHandler();
            this.fixedItem.style = '';
          }, 300)
        }, 250)
      }
    } else {
      if (this.element.classList.contains(this.o.activeClass)) {
        this.targetContent.style = this.openStyle;

        setTimeout(() => {
          this.targetContent.style = this.o.closeStyle;
        }, 10);

        setTimeout(() => {
          this.element.classList.remove(this.o.activeClass);
          this.element.classList.remove(this.o.animationClass);
          this.closeHandler();
        }, 400);

          this.openStyle = `height: ${this.o.toggleHeight}px;`;

        return;
      } else if (!this.element.classList.contains(this.o.activeClass)) {
        // 別のメガメニューテキストをクリックした際に、現在ついているカレントを外す

        setTimeout(() => {
          this.element.classList.add(this.o.activeClass);

          this.o.toggleHeight = this.targetContent.offsetHeight + 10;
          this.targetContent.style = this.o.closeStyle;
          this.openStyle = `height: ${this.o.toggleHeight}px;`;

          // 更新されたDOMをoffsetHeightで再度読みに行く。
          this.targetContent.offsetHeight;
          this.targetContent.style = this.openStyle;
        }, 50)
      }
    }
  }

  closeHandler() {
    this.targetContent.style = '';
  }
}
