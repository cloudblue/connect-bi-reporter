import { filesize } from 'filesize';

export const debounce = (callback, wait = 200) => {
  let timeoutId = null;

  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};

export const getFileSize = (bytes = 0, options = {}) =>
  filesize(bytes, {
    base: 2,
    locale: 'en',
    standard: 'jedec',
    ...options,
  });

export const downloader = (url, name = '') => {
  const link = document.createElement('a');
  document.body.appendChild(link);

  link.href = url;

  if (name) link.download = name;
  else link.rel = 'noopener noreferrer';

  link.click();
  document.body.removeChild(link);
};
