import imageContainerHTML from '../html/image-container.html';
import HiddenTempEl from './utility';

export default class ImageContainer {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.els = {
      imageContainer: null,
      image: null,
      imageTitle: null,
    };

    this.selectors = {
      imageContainer: '[data-id="image-container"]',
      image: '[data-id="image"]',
      imageTitle: '[data-id="image-title"]',
    };
  }

  init(imageFile) {
    let htEl = new HiddenTempEl(imageContainerHTML).el;

    this.els.imageContainer = htEl.querySelector(this.selectors.imageContainer);

    this.els.image = this.els.imageContainer.querySelector(this.selectors.image);
    this.els.image.src = URL.createObjectURL(imageFile);
    // После загрузки картинки, удаляем blob объект из памяти.
    this.els.image.addEventListener('load', () => URL.revokeObjectURL(this.els.image.src));

    this.els.imageTitle = this.els.imageContainer.querySelector(this.selectors.imageTitle);
    this.els.imageTitle.textContent = imageFile.name;

    this.parentEl.append(this.els.imageContainer);

    htEl.remove();
    htEl = null;
  }
}
