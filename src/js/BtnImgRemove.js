import btnImgRemoveHTML from '../html/btn-img-remove.html';
import HiddenTempEl from './utility';

export default class BtnImgRemove {
  constructor() {
    this.parentEl = null;
    this.els = {
      btnImgRemove: null,
    };

    this.selectors = {
      btnImgRemove: '[data-id="btn-img-remove"]',
    };

    this.init();
  }

  init() {
    let htEl = new HiddenTempEl(btnImgRemoveHTML).el;

    this.els.btnImgRemove = htEl.querySelector(this.selectors.btnImgRemove);
    this.els.btnImgRemove.addEventListener('click', () => this.parentEl.remove());

    htEl.remove();
    htEl = null;
  }

  appendToDOM(parentEl) {
    this.parentEl = parentEl;
    this.parentEl.append(this.els.btnImgRemove);
  }

  removeFromDOM() {
    this.parentEl = null;
    this.els.btnImgRemove.remove();
  }
}
