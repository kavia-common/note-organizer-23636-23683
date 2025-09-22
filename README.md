# Ocean Notes - Frontend

A Vite-based frontend for creating, viewing, editing, and deleting notes. Styled with the Ocean Professional theme (blue primary #2563EB, amber accent #F59E0B), featuring a header, sidebar filters, and a main area with a note list and editor.

## Features
- List, create, update, delete notes (REST API)
- Search and tag filtering
- Keyboard shortcut: Ctrl/Cmd + S to save
- Toast notifications
- Ocean Professional styling with gradients, rounded corners, and subtle shadows

## Requirements
- Backend REST API that exposes:
  - GET    /notes
  - POST   /notes
  - GET    /notes/:id
  - PUT    /notes/:id
  - DELETE /notes/:id

Note object format:
```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "tags": ["string"],
  "createdAt": "ISOString",
  "updatedAt": "ISOString"
}
```

## Configuration
Copy `.env.example` to `.env` and set:
```
VITE_API_BASE_URL=http://localhost:8000
```

## Scripts
- `npm install`
- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run preview` - preview production build

## Structure
- `src/app/App.js` - application composition and state
- `src/services/api.js` - API client
- `src/components/*` - UI components
- `src/styles/*` - theme and app styles

## Extensibility
- Add additional filters by extending Sidebar and filter logic in App.js
- Add archiving/favorites by extending Note model and list/item visuals
- Replace API endpoints by updating `NotesAPI` baseUrl or methods
