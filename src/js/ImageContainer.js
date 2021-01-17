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

  init({ imageFileName, imageName }) {
    let htEl = new HiddenTempEl(imageContainerHTML).el;

    this.els.imageContainer = htEl.querySelector(this.selectors.imageContainer);

    this.els.image = this.els.imageContainer.querySelector(this.selectors.image);
    this.els.image.src = `img/${imageFileName}`;

    this.els.imageTitle = this.els.imageContainer.querySelector(this.selectors.imageTitle);
    this.els.imageTitle.textContent = imageName;

    this.parentEl.append(this.els.imageContainer);

    htEl.remove();
    htEl = null;
  }
}
