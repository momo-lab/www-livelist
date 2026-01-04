// vitest.setup.ts
import '@testing-library/jest-dom';

// JSDOMで未定義のPointerEvent関連のAPIをポリフィルする
// @see https://github.com/testing-library/user-event/issues/1132
if (!window.HTMLElement.prototype.hasPointerCapture) {
  window.HTMLElement.prototype.hasPointerCapture = () => false;
}
if (!window.HTMLElement.prototype.releasePointerCapture) {
  window.HTMLElement.prototype.releasePointerCapture = () => {};
}

// JSDOMで未定義のscrollIntoViewをポリフィルする
// @see https://github.com/jsdom/jsdom/issues/1695
if (!window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = () => {};
}
