/**
 * PUBLIC_INTERFACE
 * NoteList renders a list of notes with selection and deletion.
 *
 * Params:
 *  - mountEl: HTMLElement
 *  - options: {
 *      notes: Note[],
 *      activeId: string | null,
 *      onSelect: (id: string) => void,
 *      onDelete: (id: string) => Promise<void>
 *    }
 */
export function NoteList(mountEl, { notes, activeId, onSelect, onDelete }) {
  if (!Array.isArray(notes)) notes = [];

  mountEl.innerHTML = `
    <div class="note-list surface shadow-sm">
      ${
        notes.length === 0
          ? `<div class="empty">No notes found. Create a new one.</div>`
          : notes
              .map(
                (n) => `
        <div class="note-item ${n.id === activeId ? 'active' : ''}" data-id="${n.id}">
          <div class="note-item-main" data-id="${n.id}">
            <div class="note-title">${escapeHtml(n.title || 'Untitled')}</div>
            <div class="note-meta">
              <div class="tags">${(n.tags || [])
                .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
                .join('')}</div>
              <div class="time">${formatDate(n.updatedAt || n.createdAt)}</div>
            </div>
          </div>
          <div class="note-item-actions">
            <button class="btn btn-danger btn-sm" data-action="delete" data-id="${n.id}">Delete</button>
          </div>
        </div>
      `
              )
              .join('')
      }
    </div>
  `;

  mountEl.querySelectorAll('.note-item-main').forEach((el) => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-id');
      onSelect && onSelect(id);
    });
  });

  mountEl.querySelectorAll('button[data-action="delete"]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      if (confirm('Delete this note?')) {
        await onDelete?.(id);
      }
    });
  });
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return '';
  }
}

function escapeHtml(str) {
  return (str || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
