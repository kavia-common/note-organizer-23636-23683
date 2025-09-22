/**
 * PUBLIC_INTERFACE
 * NoteEditor renders the editable view of a note with title, tags, and content.
 *
 * Params:
 *  - mountEl: HTMLElement
 *  - options: {
 *      note: Note | null,
 *      onSave: (noteDraft) => Promise<void>
 *    }
 */
export function NoteEditor(mountEl, { note, onSave }) {
  if (!note) {
    mountEl.innerHTML = `
      <div class="note-editor empty surface">
        <div class="placeholder">
          Select a note from the list or create a new one.
        </div>
      </div>
    `;
    return;
  }

  const tagsStr = (note.tags || []).join(', ');

  mountEl.innerHTML = `
    <div class="note-editor surface shadow-sm">
      <div class="form-row">
        <input id="title" class="input input-lg" type="text" placeholder="Title" value="${escapeHtml(
          note.title || ''
        )}" />
      </div>
      <div class="form-row">
        <input id="tags" class="input" type="text" placeholder="Tags (comma separated)" value="${escapeHtml(
          tagsStr
        )}" />
      </div>
      <div class="form-row">
        <textarea id="content" class="textarea" placeholder="Start typing...">${escapeHtml(
          note.content || ''
        )}</textarea>
      </div>
      <div class="editor-actions">
        <button id="btn-save" class="btn btn-primary">Save</button>
      </div>
    </div>
  `;

  const titleEl = mountEl.querySelector('#title');
  const tagsEl = mountEl.querySelector('#tags');
  const contentEl = mountEl.querySelector('#content');
  const saveBtn = mountEl.querySelector('#btn-save');

  function parseTags(str) {
    return (str || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  async function handleSave() {
    const draft = {
      id: note.id || null,
      title: titleEl.value.trim(),
      tags: parseTags(tagsEl.value),
      content: contentEl.value,
    };
    await onSave?.(draft);
  }

  saveBtn.addEventListener('click', handleSave);

  // Ctrl/Cmd + S to save
  function onKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      handleSave();
    }
  }
  window.addEventListener('keydown', onKeyDown);

  // Cleanup listeners when re-rendered
  const cleanup = () => window.removeEventListener('keydown', onKeyDown);
  // Expose cleanup for parent (not used directly here but kept for extensibility)
  mountEl._cleanup = cleanup;
}

function escapeHtml(str) {
  return (str || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
