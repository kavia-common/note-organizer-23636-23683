/**
 * PUBLIC_INTERFACE
 * NotesAPI provides typed methods to interact with the backend notes REST API.
 * Expected backend endpoints:
 *  - GET    /notes                     => list notes
 *  - POST   /notes                     => create note ({title, content, tags})
 *  - GET    /notes/:id                 => get note by id
 *  - PUT    /notes/:id                 => update note ({title, content, tags})
 *  - DELETE /notes/:id                 => delete note
 *
 * Note model example:
 * { id: string, title: string, content: string, tags: string[], createdAt: ISOString, updatedAt: ISOString }
 *
 * Env:
 *  - VITE_API_BASE_URL must point to backend base URL.
 */
export class NotesAPI {
  constructor({ baseUrl, onError } = {}) {
    this.baseUrl = (baseUrl || '').replace(/\/+$/, '');
    this.onError = onError || (() => {});
    if (!this.baseUrl) {
      console.warn('VITE_API_BASE_URL is not set. API calls will fail.');
    }
  }

  // PUBLIC_INTERFACE
  async listNotes() {
    /** Returns an array of notes. */
    return this._request('/notes', { method: 'GET' });
  }

  // PUBLIC_INTERFACE
  async getNote(id) {
    /** Returns a note by id. */
    return this._request(`/notes/${encodeURIComponent(id)}`, { method: 'GET' });
  }

  // PUBLIC_INTERFACE
  async createNote({ title, content, tags }) {
    /** Creates a note and returns it. */
    return this._request('/notes', {
      method: 'POST',
      body: { title, content, tags: tags || [] },
    });
  }

  // PUBLIC_INTERFACE
  async updateNote(id, { title, content, tags }) {
    /** Updates a note and returns it. */
    return this._request(`/notes/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: { title, content, tags: tags || [] },
    });
  }

  // PUBLIC_INTERFACE
  async deleteNote(id) {
    /** Deletes a note and returns a result. */
    return this._request(`/notes/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }

  async _request(path, { method = 'GET', body } = {}) {
    const url = `${this.baseUrl}${path}`;
    const headers = { 'Content-Type': 'application/json' };
    const init = {
      method,
      headers,
      mode: 'cors',
    };
    if (body !== undefined) init.body = JSON.stringify(body);

    let resp;
    try {
      resp = await fetch(url, init);
    } catch (e) {
      const msg = `Network error: ${e.message}`;
      this.onError(msg);
      throw new Error(msg);
    }

    if (!resp.ok) {
      let errMsg = `${resp.status} ${resp.statusText}`;
      try {
        const data = await resp.json();
        if (data && data.message) errMsg = data.message;
      } catch {
        // ignore
      }
      const msg = `API error: ${errMsg}`;
      this.onError(msg);
      throw new Error(msg);
    }

    if (resp.status === 204) return null;
    const ct = resp.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      return resp.json();
    }
    return resp.text();
  }
}
