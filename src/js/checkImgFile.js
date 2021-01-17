export default function checkImgFile(files) {
  const result = {
    success: false,
    data: 'Неожиданная ошибка при выборе файла.',
  };

  const file = files[0];

  if (!file) result.data = 'Выбранный файл не обнаружен.';
  else if (file.size > 1024000) result.data = `Размер файла не должен превышать 1024 000 байт. Размер этого файла ${file.size} байт.`;
  else if (!file.size) result.data = 'Размер файла 0 байт.';
  else if (!file.type.startsWith('image')) result.data = 'Не верный формат файла.';
  else {
    result.success = true;
    result.data = file;
  }

  return result;
}
