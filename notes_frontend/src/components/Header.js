import { logoSvg } from '../icons/logo';

/**
 * PUBLIC_INTERFACE
 * Header renders the top navigation bar with brand and actions.
 *
 * Params:
 *  - mountEl: HTMLElement where header is placed
 *  - options: { onRefresh: () => void }
 *
 * Returns: void
 */
export function Header(mountEl, { onRefresh } = {}) {
  mountEl.innerHTML = `
    <header class="app-header surface shadow-md">
      <div class="brand">
        ${logoSvg}
        <span class="brand-name">Ocean Notes</span>
      </div>
      <div class="header-actions">
        <button id="btn-refresh" class="btn btn-ghost">Refresh</button>
        <a href="https://v1.openapi.design/" class="btn btn-amber" target="_blank" rel="noreferrer">Docs</a>
      </div>
    </header>
  `;

  const refreshBtn = mountEl.querySelector('#btn-refresh');
  refreshBtn?.addEventListener('click', () => onRefresh && onRefresh());
}
