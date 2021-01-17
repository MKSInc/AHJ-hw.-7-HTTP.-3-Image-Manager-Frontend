/* eslint-disable max-len */
function getURLParams(params) {
  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    urlParams.set(key, `${value}`);
  }
  return `/?${urlParams}`;
}

/**
 * Функция отправляет запрос на основе переданных параметров.
 * Обрабатывает только один из параметров 'params' или 'formData'.
 * Если передан 'params', то будет сформирован GET запрос.
 * Если 'formData', то POST.
 *
 * @param params - параметры GET запроса, которые будут помещены в дресную строку.
 * @param formData - тело POST запроса.
 * @returns Возвращает промисс с ответом в виде объекта: { success, result }
 */
export default function createRequest({ params, formData }) {
  return new Promise((resolve, reject) => {
    // Если переданы и 'params' и 'formData' либо не передан ни один из них, тогда - ошибка
    if ((params && formData) || (!params && !formData)) {
      reject(new Error(
        'createRequest method takes only one argument: { params } or { formData } !\n'
        + 'You send:\n'
        + `params: ${params}\n`
        + `formData: ${formData}`,
      ));
      return;
    }

    // const URL = 'http://localhost:3000/server.js';
    const URL = 'https://ahj-7-3-image-manager.herokuapp.com/server.js';
    const xhr = new XMLHttpRequest();

    let method = 'GET';
    let urlParams = '';

    if (params) urlParams = getURLParams(params);
    else if (formData) method = 'POST';

    xhr.open(method, URL + urlParams);

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          // Преобразуем json в объект. Так как дата стала строкой, преобразуем ее обратно в тип Data.
          const data = JSON.parse(xhr.response);
          resolve(data);
        } catch (e) {
          reject(e);
        }
      } else reject(new Error(`${xhr.status}: ${xhr.responseText}`));
    });

    xhr.addEventListener('error', () => reject(new Error('Connection error!')));

    xhr.send(formData);
  });
}
