import { NotesAPI } from '../services/api';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { NoteList } from '../components/NoteList';
import { NoteEditor } from '../components/NoteEditor';
import { Toasts } from '../components/Toasts';

/**
 * PUBLIC_INTERFACE
 * createApp mounts the Notes application into a container element.
 * It sets up the layout (header, sidebar, list, editor) and wires REST API operations
 * to create, read, update, and delete notes.
 *
 * Parameters:
 *  - mountEl: HTMLElement where the app should be rendered.
 *
 * Returns:
 *  - void (renders UI and handles interactions).
 */
export function createApp(mountEl) {
  if (!mountEl) throw new Error('Mount element not found');

  // State
  let notes = [];
  let filteredNotes = [];
  let activeNote = null;
  let filters = { query: '', tag: 'All' };
  let isLoading = false;

  // Root structure
  mountEl.innerHTML = `
    <div class="app-root">
      <div id="app-header"></div>
      <div class="app-body">
        <aside id="app-sidebar" class="app-sidebar"></aside>
        <main class="app-main">
          <section class="main-top">
            <div class="actions">
              <button id="btn-new-note" class="btn btn-primary">
                + New Note
              </button>
            </div>
          </section>
          <section class="main-content">
            <div class="pane pane-left">
              <div id="note-list"></div>
            </div>
            <div class="pane pane-right">
              <div id="note-editor"></div>
            </div>
          </section>
        </main>
      </div>
      <div id="toasts"></div>
    </div>
  `;

  const headerEl = document.getElementById('app-header');
  const sidebarEl = document.getElementById('app-sidebar');
  const listEl = document.getElementById('note-list');
  const editorEl = document.getElementById('note-editor');
  const toastsEl = document.getElementById('toasts');
  const newBtn = document.getElementById('btn-new-note');

  // Components
  const toasts = new Toasts(toastsEl);
  Header(headerEl, {
    onRefresh: async () => {
      await loadNotes();
      toasts.info('Notes refreshed');
    },
  });

  Sidebar(sidebarEl, {
    filters,
    onFilterChange: (newFilters) => {
      filters = { ...filters, ...newFilters };
      applyFilters();
      renderList();
    },
  });

  const api = new NotesAPI({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    onError: (msg) => toasts.error(msg),
  });

  newBtn.addEventListener('click', () => {
    const draft = {
      id: null,
      title: '',
      content: '',
      tags: [],
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    activeNote = draft;
    renderEditor();
  });

  // Data operations
  async function loadNotes() {
    try {
      setLoading(true);
      notes = await api.listNotes();
      applyFilters();
      if (activeNote?.id) {
        activeNote = notes.find((n) => n.id === activeNote.id) || null;
      }
      renderList();
      renderEditor();
    } catch (e) {
      toasts.error(`Failed to load notes: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    const q = (filters.query || '').toLowerCase();
    const tag = filters.tag || 'All';
    filteredNotes = notes.filter((n) => {
      const matchesQuery =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q);
      const matchesTag =
        tag === 'All' || (n.tags || []).map((t) => t.toLowerCase()).includes(tag.toLowerCase());
      return matchesQuery && matchesTag;
    });
  }

  function setLoading(val) {
    isLoading = val;
    mountEl.classList.toggle('is-loading', isLoading);
  }

  function handleSelectNote(noteId) {
    activeNote = notes.find((n) => n.id === noteId) || null;
    renderEditor();
  }

  async function handleSaveNote(note) {
    try {
      setLoading(true);
      if (note.id) {
        const updated = await api.updateNote(note.id, note);
        notes = notes.map((n) => (n.id === updated.id ? updated : n));
        activeNote = updated;
        toasts.success('Note updated');
      } else {
        const created = await api.createNote(note);
        notes = [created, ...notes];
        activeNote = created;
        toasts.success('Note created');
      }
      applyFilters();
      renderList();
      renderEditor();
    } catch (e) {
      toasts.error(`Save failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteNote(noteId) {
    try {
      setLoading(true);
      await api.deleteNote(noteId);
      notes = notes.filter((n) => n.id !== noteId);
      if (activeNote?.id === noteId) activeNote = null;
      applyFilters();
      renderList();
      renderEditor();
      toasts.success('Note deleted');
    } catch (e) {
      toasts.error(`Delete failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Renderers
  function renderList() {
    NoteList(listEl, {
      notes: filteredNotes,
      activeId: activeNote?.id || null,
      onSelect: handleSelectNote,
      onDelete: handleDeleteNote,
    });
  }

  function renderEditor() {
    NoteEditor(editorEl, {
      note: activeNote,
      onSave: handleSaveNote,
    });
  }

  // Initial load
  loadNotes();
}
