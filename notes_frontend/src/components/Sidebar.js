/**
 * PUBLIC_INTERFACE
 * Sidebar renders search and tag filtering.
 *
 * Params:
 *  - mountEl: HTMLElement
 *  - options: {
 *      filters: { query: string, tag: string },
 *      onFilterChange: (filters) => void
 *    }
 */
export function Sidebar(mountEl, { filters, onFilterChange }) {
  let tagOptions = ['All', 'Work', 'Personal', 'Ideas', 'Todo'];

  function render() {
    mountEl.innerHTML = `
      <div class="sidebar-content surface shadow-sm">
        <div class="sidebar-section">
          <label class="label">Search</label>
          <input id="search-input" class="input" type="text" placeholder="Search notes..." value="${escapeHtml(
            filters.query || ''
          )}" />
        </div>
        <div class="sidebar-section">
          <label class="label">Tag</label>
          <select id="tag-select" class="select">
            ${tagOptions
              .map(
                (t) =>
                  `<option value="${t}" ${String(filters.tag || 'All') === t ? 'selected' : ''}>${t}</option>`
              )
              .join('')}
          </select>
        </div>
        <div class="sidebar-section hint">
          <p class="muted">Tip: Use comma-separated tags in the editor.</p>
        </div>
      </div>
    `;

    const searchEl = mountEl.querySelector('#search-input');
    const tagEl = mountEl.querySelector('#tag-select');

    searchEl.addEventListener('input', (e) => {
      onFilterChange({ query: e.target.value });
    });
    tagEl.addEventListener('change', (e) => {
      onFilterChange({ tag: e.target.value });
    });
  }

  render();
}

function escapeHtml(str) {
  return (str || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
