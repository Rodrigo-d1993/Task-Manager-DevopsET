// window.API_BASE_URL se inyecta en tiempo de ejecución vía config.js
// (generado por entrypoint.sh a partir de la variable de entorno API_BASE_URL)
const API_URL = (window.API_BASE_URL || '') + '/api/tasks';

const form = document.getElementById('task-form');
const list = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

async function loadTasks() {
    try {
        let url = API_URL;
        if (currentFilter === 'pending') url += '?completed=false';
        if (currentFilter === 'completed') url += '?completed=true';

        const res = await fetch(url);
        const tasks = await res.json();
        renderTasks(tasks);
    } catch (err) {
        list.innerHTML = '<li>Error cargando tareas. ¿El backend está activo?</li>';
        console.error(err);
    }
}

function priorityLabel(priority) {
    return { LOW: 'Baja', MEDIUM: 'Media', HIGH: 'Alta' }[priority] || priority;
}

function renderTasks(tasks) {
    list.innerHTML = '';
    if (tasks.length === 0) {
        list.innerHTML = '<li class="empty">No hay tareas para mostrar</li>';
        return;
    }

    tasks.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        const dueDateHtml = task.dueDate
            ? `<span class="task-due">Vence: ${task.dueDate}</span>`
            : '';

        li.innerHTML = `
            <div>
                <span class="priority-badge priority-${task.priority.toLowerCase()}">${priorityLabel(task.priority)}</span>
                <span class="task-title">${escapeHtml(task.title)}</span>
                <span class="task-desc">${escapeHtml(task.description || '')}</span>
                ${dueDateHtml}
            </div>
            <div class="task-actions">
                <button title="Marcar completada" onclick="toggleTask(${task.id}, ${!task.completed}, '${escapeJs(task.title)}', '${escapeJs(task.description || '')}', '${task.priority}', '${task.dueDate || ''}')">✓</button>
                <button title="Eliminar" onclick="deleteTask(${task.id})">✕</button>
            </div>
        `;
        list.appendChild(li);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;
    const dueDate = document.getElementById('dueDate').value || null;

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, completed: false, priority, dueDate })
    });

    if (!res.ok) {
        const err = await res.json();
        alert('Error: ' + JSON.stringify(err.fields || err.error));
        return;
    }

    form.reset();
    document.getElementById('priority').value = 'MEDIUM';
    loadTasks();
});

async function toggleTask(id, completed, title, description, priority, dueDate) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, completed, priority, dueDate: dueDate || null })
    });
    loadTasks();
}

async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadTasks();
}

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        loadTasks();
    });
});

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function escapeJs(str) {
    return String(str).replace(/'/g, "\\'");
}

loadTasks();
