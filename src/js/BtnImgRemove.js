import btnImgRemoveHTML from '../html/btn-img-remove.html';
import HiddenTempEl from './utility';
import createRequest from './createRequest';

export default class BtnImgRemove {
  constructor(imagesDB) {
    this.parentEl = null;
    this.els = {
      btnImgRemove: null,
    };

    this.selectors = {
      btnImgRemove: '[data-id="btn-img-remove"]',
    };

    this.imagesDB = imagesDB;

    this.init();
  }

  init() {
    let htEl = new HiddenTempEl(btnImgRemoveHTML).el;

    this.els.btnImgRemove = htEl.querySelector(this.selectors.btnImgRemove);
    this.els.btnImgRemove.addEventListener('click', this.onBtnImgRemoveClick.bind(this));

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

  async onBtnImgRemoveClick() {
    const image = this.imagesDB.get(this.parentEl);

    const formData = new FormData();
    formData.set('action', 'deleteImage');
    formData.set('imageFileName', image.imageFileName);

    try {
      const deleteImage = await createRequest({ formData });
      if (!deleteImage.success) throw new Error(deleteImage.data);

      this.imagesDB.delete(this.parentEl);
      this.parentEl.remove();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Не удалось удалить изображение на сервере.');
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }
}
