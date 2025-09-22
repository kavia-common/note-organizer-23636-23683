/**
 * PUBLIC_INTERFACE
 * Toasts provides transient notifications rendered inside a container element.
 *
 * Usage:
 *  const toasts = new Toasts(containerEl);
 *  toasts.success('Saved');
 *  toasts.error('Oops');
 *  toasts.info('Hello');
 */
export class Toasts {
  constructor(containerEl) {
    this.containerEl = containerEl;
    this.containerEl.classList.add('toasts-container');
  }

  // PUBLIC_INTERFACE
  success(msg) {
    /** Show a success toast. */
    this._show(msg, 'success');
  }

  // PUBLIC_INTERFACE
  error(msg) {
    /** Show an error toast. */
    this._show(msg, 'error');
  }

  // PUBLIC_INTERFACE
  info(msg) {
    /** Show an info toast. */
    this._show(msg, 'info');
  }

  _show(message, kind = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${kind}`;
    toast.textContent = message;
    this.containerEl.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));
    setTimeout(() => this._hide(toast), 3500);
  }

  _hide(toast) {
    toast.classList.remove('visible');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 250);
  }
}
