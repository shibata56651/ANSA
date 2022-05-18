import { TAB_INDEX_ELEMENTS } from '../utility/config'

const FOCUS_ALL_ELEM = document.querySelectorAll(TAB_INDEX_ELEMENTS.FOCUS_ELEMENT);
const headerFocusElem = document.querySelector('.header-contents');

if (headerFocusElem) {
  const HEADER_FOCUS_ALL_ELEM = headerFocusElem.querySelectorAll(TAB_INDEX_ELEMENTS.FOCUS_ELEMENT);
}

const SWIPER_FOCUS_PAGINATION = document.getElementById('js-carousel-pagination');
let paginationTime = undefined;
/**
 * Tabindexを付与する処理
 */
export const setTabIndex = (spMenuFlg, targetElems) => {
  if (SWIPER_FOCUS_PAGINATION) {
    paginationTime = setInterval(() => {
      for (const elem of SWIPER_FOCUS_PAGINATION.children) {
        const saveTabindex = elem.getAttribute('tabindex');

        if (saveTabindex) {
          elem.setAttribute('data-tabindex', saveTabindex);
        }
        elem.tabIndex = -1;
      }
    }, 50);
  }

  if (FOCUS_ALL_ELEM) {
    for (const elem of FOCUS_ALL_ELEM) {
      const saveTabindex = elem.getAttribute('tabindex');

      if (saveTabindex) {
        elem.setAttribute('data-tabindex', saveTabindex);
      }
      elem.tabIndex = -1;

      if (spMenuFlg) {
        for (const item of targetElems) {
          item.tabIndex = 0;
        }

        for (const item of HEADER_FOCUS_ALL_ELEM) {
          item.tabIndex = 0;
        }
      }
    }
  }
};


/**
 * Tabindexを削除する処理
 */
export const removeTabIndex = () => {
  if (SWIPER_FOCUS_PAGINATION) {
    clearInterval(paginationTime);
    for (const elem of SWIPER_FOCUS_PAGINATION.children) {
      const saveDataTabindex = elem.getAttribute('data-tabindex');

      if (saveDataTabindex) {
        elem.tabIndex = saveDataTabindex;
        elem.removeAttribute('data-tabindex');

        continue;
      }

      elem.removeAttribute('tabindex');
    }
  }

  if (FOCUS_ALL_ELEM) {
    for (const elem of FOCUS_ALL_ELEM) {
      const saveDataTabindex = elem.getAttribute('data-tabindex');

      if (saveDataTabindex) {
        elem.tabIndex = saveDataTabindex;
        elem.removeAttribute('data-tabindex');

        continue;
      }

      elem.removeAttribute('tabindex');
    }
  }
};