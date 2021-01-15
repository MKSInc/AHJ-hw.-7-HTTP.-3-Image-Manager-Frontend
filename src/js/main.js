import ImageManager from './ImageManager';

const containerEl = document.getElementsByClassName('container')[0];

const imageManager = new ImageManager(containerEl);

imageManager.init();
