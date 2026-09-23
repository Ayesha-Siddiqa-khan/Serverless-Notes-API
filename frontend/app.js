const API_URL_KEY = 'notes_api_url';
const DEFAULT_API_URL = 'https://yzaw3mylo9.execute-api.us-east-1.amazonaws.com';
let notes = [];
let editingId = null;

const apiUrlInput = document.getElementById('apiUrl');
const noteForm = document.getElementById('noteForm');
const formTitle = document.getElementById('formTitle');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const noteIdInput = document.getElementById('noteId');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const refreshBtn = document.getElementById('refreshBtn');
const notesContainer = document.getElementById('notesContainer');
const emptyState = document.getElementById('emptyState');
const loading = document.getElementById('loading');
const toast = document.getElementById('toast');

apiUrlInput.value = localStorage.getItem(API_URL_KEY) || DEFAULT_API_URL;
apiUrlInput.addEventListener('change', () => {
    localStorage.setItem(API_URL_KEY, apiUrlInput.value);
});

noteForm.addEventListener('submit', handleSubmit);
cancelBtn.addEventListener('click', resetForm);
refreshBtn.addEventListener('click', loadNotes);

function getApiUrl() {
    const url = apiUrlInput.value.trim().replace(/\/+$/, '');
    if (!url) {
        showToast('Please enter your API endpoint', 'error');
        return null;
    }
    return url;
}

async function handleSubmit(e) {
    e.preventDefault();
    const apiUrl = getApiUrl();
    if (!apiUrl) return;

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        showToast('Title and content are required', 'error');
        return;
    }

    submitBtn.disabled = true;

    try {
        if (editingId) {
            await updateNote(apiUrl, editingId, title, content);
        } else {
            await createNote(apiUrl, title, content);
        }
        resetForm();
        await loadNotes();
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        submitBtn.disabled = false;
    }
}

async function createNote(apiUrl, title, content) {
    const res = await fetch(`${apiUrl}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to create note (${res.status})`);
    }

    showToast('Note created!', 'success');
}

async function updateNote(apiUrl, id, title, content) {
    const res = await fetch(`${apiUrl}/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to update note (${res.status})`);
    }

    showToast('Note updated!', 'success');
}

async function deleteNote(id) {
    const apiUrl = getApiUrl();
    if (!apiUrl) return;

    if (!confirm('Delete this note?')) return;

    try {
        const res = await fetch(`${apiUrl}/notes/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete note');
        showToast('Note deleted', 'success');
        await loadNotes();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function editNote(id) {
    const note = notes.find(n => n.noteId === id);
    if (!note) return;

    editingId = id;
    formTitle.textContent = 'Edit Note';
    titleInput.value = note.title;
    contentInput.value = note.content;
    submitBtn.textContent = 'Update Note';
    cancelBtn.style.display = 'inline-flex';
    noteIdInput.value = id;

    titleInput.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    editingId = null;
    formTitle.textContent = 'New Note';
    noteForm.reset();
    submitBtn.textContent = 'Create Note';
    cancelBtn.style.display = 'none';
    noteIdInput.value = '';
}

async function loadNotes() {
    const apiUrl = getApiUrl();
    if (!apiUrl) return;

    loading.style.display = 'block';
    emptyState.style.display = 'none';
    notesContainer.innerHTML = '';
    notesContainer.appendChild(loading);

    try {
        const res = await fetch(`${apiUrl}/notes`);
        if (!res.ok) throw new Error('Failed to load notes');

        const data = await res.json();
        notes = data.notes || [];

        loading.style.display = 'none';

        const notesCountBadge = document.getElementById('notesCount');
        if (notesCountBadge) {
            notesCountBadge.textContent = `${notes.length} ${notes.length === 1 ? 'note' : 'notes'}`;
        }

        if (notes.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        notes.forEach(note => {
            notesContainer.appendChild(createNoteCard(note));
        });
    } catch (err) {
        loading.style.display = 'none';
        showToast(err.message, 'error');
        notesContainer.innerHTML = `<div class="empty-state"><h3>Could not load notes</h3><p>${err.message}</p></div>`;
    }
}

function createNoteCard(note) {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.innerHTML = `
        <div class="note-card-header">
            <h3>${escapeHtml(note.title)}</h3>
            <div class="note-card-actions">
                <button class="icon-btn edit" title="Edit" onclick="editNote('${note.noteId}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="icon-btn delete" title="Delete" onclick="deleteNote('${note.noteId}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
        <p>${escapeHtml(note.content)}</p>
        <div class="note-card-footer">${formatDate(note.createdAt)}</div>
    `;
    return card;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

loadNotes();
