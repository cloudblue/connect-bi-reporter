export const processEvent = (fn) => (event) => fn(...event.detail);
