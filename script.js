'use strict';

const STORAGE_TASKS = 'daymark.tasks.v1';
const STORAGE_THEME = 'daymark.theme.v1';
const $ = (id) => document.getElementById(id);

const sampleTasks = [
  { id: 'starter-1', text: 'Plan the week ahead', completed: true },
  { id: 'starter-2', text: 'Make progress on your next big idea', completed: false },
  { id: 'starter-3', text: 'Take a moment to recharge', completed: false },
];

function readTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_TASKS);
    if (raw === null) return sampleTasks.map((task) => ({ ...task }));
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((task) => task && typeof task.id === 'string' && typeof task.text === 'string' && typeof task.completed === 'boolean').map((task) => ({ id: task.id, text: task.text.slice(0, 140), completed: task.completed }));
  } catch { return []; }
}

let tasks = readTasks();
let filter = 'all';

function saveTasks() {
  try { localStorage.setItem(STORAGE_TASKS, JSON.stringify(tasks)); }
  catch { /* Browsers may disable storage; the in-memory app still works. */ }
}

function render() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const active = total - completed;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  $('totalCount').textContent = String(total);
  $('activeCount').textContent = String(active);
  $('completedCount').textContent = String(completed);
  $('headingCount').textContent = String(total);
  $('allTabCount').textContent = String(total);
  $('progressValue').textContent = `${percent}%`;
  $('progressFill').style.width = `${percent}%`;
  $('progressBar').setAttribute('aria-valuenow', String(percent));
  $('progressDescription').textContent = total === 0 ? 'Add your first task to get started.' : active === 0 ? 'Beautiful work. You finished everything!' : `${completed} of ${total} tasks complete. You've got this!`;
  $('clearCompleted').hidden = completed === 0;

  const shown = tasks.filter((task) => filter === 'all' || (filter === 'completed' ? task.completed : !task.completed));
  $('taskViewLabel').textContent = `${shown.length} ${shown.length === 1 ? 'task' : 'tasks'}`;
  const list = $('taskList');
  list.replaceChildren();
  for (const task of shown) {
    const li = document.createElement('li');
    li.className = `task-item${task.completed ? ' is-complete' : ''}`;
    const label = document.createElement('label');
    label.className = 'task-label';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `${task.completed ? 'Mark incomplete' : 'Complete'}: ${task.text}`);
    checkbox.addEventListener('change', () => { tasks = tasks.map((item) => item.id === task.id ? { ...item, completed: checkbox.checked } : item); saveTasks(); render(); });
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;
    label.append(checkbox, span);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'delete-task';
    remove.setAttribute('aria-label', `Delete task: ${task.text}`);
    remove.title = 'Delete task';
    remove.textContent = '×';
    remove.addEventListener('click', () => { tasks = tasks.filter((item) => item.id !== task.id); saveTasks(); render(); });
    li.append(label, remove);
    list.append(li);
  }
  const empty = shown.length === 0;
  $('emptyState').hidden = !empty;
  if (empty) {
    const states = {
      all: ['A fresh start', "Add a task above and let's get moving."],
      active: ['All caught up!', 'No unfinished tasks. Enjoy your breathing room.'],
      completed: ['No wins yet', 'Finish a task and it will show up here.'],
    };
    [$('emptyTitle').textContent, $('emptyDescription').textContent] = states[filter];
  }
  document.querySelectorAll('[data-filter]').forEach((button) => {
    const selected = button.dataset.filter === filter;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

$('taskForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = $('taskInput');
  const text = input.value.trim();
  if (!text) return;
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  tasks.unshift({ id, text, completed: false });
  filter = 'all';
  saveTasks();
  render();
  input.value = '';
  input.focus();
});

document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => { filter = button.dataset.filter; render(); }));
$('clearCompleted').addEventListener('click', () => { tasks = tasks.filter((task) => !task.completed); saveTasks(); render(); });

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $('themeIcon').textContent = theme === 'dark' ? '☀' : '☾';
  $('themeLabel').textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  $('themeToggle').setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#10141e' : '#f6f7fb';
  try { localStorage.setItem(STORAGE_THEME, theme); } catch { /* Optional persistence. */ }
}
let savedTheme = 'light';
try { if (localStorage.getItem(STORAGE_THEME) === 'dark') savedTheme = 'dark'; } catch { /* Ignore disabled storage. */ }
setTheme(savedTheme);
$('themeToggle').addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
$('dateLabel').textContent = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date());
$('year').textContent = String(new Date().getFullYear());
render();
