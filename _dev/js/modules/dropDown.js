export class dropDown {
    /**
     * @param  {Element} element rootとなる要素
     * @param  {Element} dropdownRoots rootsとなる要素（別のrootクリック時の非表示処理に使用する）
     * @param  {Element} closeBtn 閉じるボタンとなる要素
     * @returns void
     */
    constructor(element, dropdownRoots, closeBtn = {}) {
        this.element = element;
        this.closeBtn = closeBtn;
        this.dropdownRoots = dropdownRoots;
        this.targetElm = element.querySelector('.dropdown-text');
        this.targetContent = undefined;
        this.disableItem = undefined;
        this.siblingElm = undefined;
        this.closeElm = undefined;
        this.init();
    }
    /**
     * 初期化処理
     *
     * @returns void
     */
    init() {
      this.closeBtn.addEventListener('click', this.closeHandler.bind(this));
      this.element.addEventListener('click', this.clickHandler.bind(this));
    }

    /**
     * クリック時itemの中のコンテンツを表示する
     *
     * @param  {MouseEvent} e クリックした要素
     * @returns void
     */
    clickHandler(e) {
        const href = this.element.getAttribute('href');
        e.preventDefault();
        this.targetContent = document.getElementById(href.substring(1));

        if (this.element.parentNode.classList.contains('is-active')) {
            this.element.parentNode.classList.remove('is-active');
            this.targetContent.classList.add('is-closed');

            return;
        } else if (!this.element.parentNode.classList.contains('is-active')) {
        // 別のメガメニューテキストをクリックした際に、現在ついているカレントを外す
            for (const item of this.dropdownRoots) {
                if (item.parentNode.classList.contains('is-active')) {
                    item.parentNode.classList.remove('is-active');
                }
            }

            if (this.targetContent.classList.contains('is-closed')) {
                this.targetContent.classList.remove('is-closed');
            }
        }

        // is-active初期化
        if (this.element.parentNode.classList.contains('is-active')) {
            this.element.parentNode.classList.remove('is-active');
        }

        this.element.parentNode.classList.add('is-active');

        if (this.targetContent.classList.contains('is-closed')) {
            this.targetContent.classList.remove('is-closed');
        }
    }

        /**
     * 閉じるボタン押下時、表示している要素の表示処理
     *
     * @param  {MouseEvent} e クリックした要素
     */
    closeHandler(e) {
        this.closeElm = e.target.closest('.is-active');
        this.closeElm.classList.remove('is-active');
        this.targetContent.classList.add('is-closed');
    }
}
