/* eslint-disable max-len */
import imageGalleryHTML from '../html/image-manager.html';
import HiddenTempEl from './utility';
import ImageContainer from './ImageContainer';
import BtnImgRemove from './BtnImgRemove';
import checkImgFile from './checkImgFile';
import createRequest from './createRequest';

export default class ImageManager {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.els = {
      imageManager: null,
      inputFile: null,
      inputOverlap: null,
      imageGallery: null,
    };

    this.selectors = {
      imageManager: '[data-widget="image-manager"]',
      inputFile: '[data-id="input-file"]',
      inputOverlap: '[data-id="input-overlap"]',
      imageGallery: '[data-id="image-gallery"]',
      imageContainer: '[data-id="image-container"]', // взят из класса ImageContainer
    };

    this.imagesDB = new Map();

    this.entity = {
      btnImgRemove: new BtnImgRemove(this.imagesDB),
    };

    // Контейнер с картинкой, на который в данный момент наведен курсор мыши.
    this.currImgContainerEL = null;
  }

  init() {
    let htEl = new HiddenTempEl(imageGalleryHTML).el;
    this.els.imageManager = htEl.querySelector(this.selectors.imageManager);

    this.els.inputFile = this.els.imageManager.querySelector(this.selectors.inputFile);

    this.els.inputFile.addEventListener('change', this.onInputFileChange.bind(this));

    this.els.inputOverlap = this.els.imageManager.querySelector(this.selectors.inputOverlap);
    this.els.inputOverlap.addEventListener('click', () => {
      this.els.inputFile.dispatchEvent(new MouseEvent('click'));
    });

    // Отменяем открытие файла в новой вкладке по умолчанию
    this.els.inputOverlap.addEventListener('dragover', (event) => event.preventDefault());

    this.els.inputOverlap.addEventListener('drop', async (event) => {
      event.preventDefault(); // Отменяем открытие файла в новой вкладке по умолчанию
      this.addImageToGallery(event.dataTransfer.files);
    });

    this.els.imageGallery = this.els.imageManager.querySelector(this.selectors.imageGallery);
    this.els.imageGallery.addEventListener('mouseover', this.onImageGalleryMouseover.bind(this));
    this.els.imageGallery.addEventListener('mouseout', this.onImageGalleryMouseout.bind(this));

    this.parentEl.append(this.els.imageManager);
    htEl.remove();
    htEl = null;
  }

  addImagesFromDB() {
    document.addEventListener('DOMContentLoaded', async () => {
      try {
        const getImagesData = await createRequest({ params: { action: 'getImagesData' } });
        if (!getImagesData.success) throw new Error(getImagesData.data);

        const { images } = getImagesData.data;

        // Если на сервере нет загруженных картинок, выходим.
        if (images.length === 0) return;

        for (const image of images) {
          const imageContainer = new ImageContainer(this.els.imageGallery);
          imageContainer.init(image);
          this.imagesDB.set(imageContainer.els.imageContainer, image);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Не удалось получить изображения с сервера.');
        // eslint-disable-next-line no-console
        console.error(e);
      }
    });
  }

  async onInputFileChange(event) {
    await this.addImageToGallery(event.target.files);
    // Очищаем value, чтобы событие onChange реагировало на добавление того же самого файла повторно.
    this.els.inputFile.value = '';
  }

  async addImageToGallery(files) {
    const result = checkImgFile(files);

    if (!result.success) {
      this.els.inputFile.value = '';
      throw new Error(result.data);
    }

    // Делаем POST запрос на сервер action=addImage
    const formData = new FormData();
    formData.set('action', 'addImage');
    formData.set('file', result.data);

    try {
      const addImage = await createRequest({ formData });
      if (!addImage.success) throw new Error(addImage.data);

      const imageContainer = new ImageContainer(this.els.imageGallery);
      imageContainer.init(addImage.data);
      this.imagesDB.set(imageContainer.els.imageContainer, addImage.data);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Не удалось сохранить изображение на сервере.');
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  onImageGalleryMouseover(event) {
    const closestImageContainerEl = event.target.closest(this.selectors.imageContainer);

    // Если курсор не находится над контейнером с картинкой, то выходим.
    if (!closestImageContainerEl) return;
    // Если текущий контейнер и контейнер, в котором возникло событие (mouseover) один и тот же,
    // значит событие возникло внутри текущего контейнера при переходе курсора между вложенными
    // элементами, выходим.
    if (this.currImgContainerEL === closestImageContainerEl) return;

    this.currImgContainerEL = closestImageContainerEl;
    this.entity.btnImgRemove.appendToDOM(this.currImgContainerEL);
  }

  onImageGalleryMouseout(event) {
    if (!this.currImgContainerEL) return;

    // Если событие (mouseout) сработало при переходе между вложенными элементами в контейнере с картинкой,
    // то выходим.
    if (event.relatedTarget.closest(this.selectors.imageContainer)) return;
    this.currImgContainerEL = null;
    this.entity.btnImgRemove.removeFromDOM();
  }
}
