class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.sortOrder = 'date';
        this.theme = this.getInitialTheme();
        this.init();
    }

    getInitialTheme() {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
    }

    init() {
        this.setTheme(this.theme);
        this.bindEvents();
        this.render();
        this.updateStats();
        this.watchSystemTheme();
    }

    watchSystemTheme() {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        if (!media.addEventListener) {
            // Safari fallback
            media.addListener((e) => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
            return;
        }
        media.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    bindEvents() {
        document.getElementById('todo-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        document.getElementById('clear-completed').addEventListener('click', () => {
            this.clearCompleted();
        });

        document.getElementById('sort-btn').addEventListener('click', () => {
            this.toggleSort();
        });

        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        document.getElementById('search-input').addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.render();
        });

        document.getElementById('clear-search').addEventListener('click', () => {
            document.getElementById('search-input').value = '';
            this.searchQuery = '';
            this.render();
        });

        document.getElementById('todo-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                document.getElementById('todo-input').focus();
            }
        });
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const themeToggle = document.getElementById('theme-toggle');
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    addTodo() {
        const input = document.getElementById('todo-input');
        const prioritySelect = document.getElementById('priority-select');
        const dueDateInput = document.getElementById('due-date');
        const text = input.value.trim();
        const priority = prioritySelect.value;
        const dueDate = dueDateInput.value;
        if (text) {
            const todo = {
                id: Date.now(),
                text,
                completed: false,
                priority,
                dueDate: dueDate || null,
                createdAt: new Date().toISOString()
            };
            this.todos.unshift(todo);
            this.saveToStorage();
            this.render();
            this.updateStats();
            input.value = '';
            dueDateInput.value = '';
            input.focus();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveToStorage();
        this.render();
        this.updateStats();
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
        this.saveToStorage();
        this.render();
        this.updateStats();
    }

    clearCompleted() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.saveToStorage();
        this.render();
        this.updateStats();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            const isActive = btn.dataset.filter === filter;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        this.render();
    }

    toggleSort() {
        const sortBtn = document.getElementById('sort-btn');
        const sortOptions = ['date', 'priority', 'dueDate'];
        const currentIndex = sortOptions.indexOf(this.sortOrder);
        this.sortOrder = sortOptions[(currentIndex + 1) % sortOptions.length];
        sortBtn.innerHTML = `<i class="fas fa-sort"></i> ${this.sortOrder.charAt(0).toUpperCase() + this.sortOrder.slice(1)}`;
        this.render();
    }

    getFilteredAndSortedTodos() {
        let filteredTodos = this.todos;
        if (this.searchQuery) {
            filteredTodos = filteredTodos.filter(todo => todo.text.toLowerCase().includes(this.searchQuery));
        }
        switch (this.currentFilter) {
            case 'active':
                filteredTodos = filteredTodos.filter(todo => !todo.completed);
                break;
            case 'completed':
                filteredTodos = filteredTodos.filter(todo => todo.completed);
                break;
            case 'overdue':
                filteredTodos = filteredTodos.filter(todo => this.isOverdue(todo));
                break;
        }
        filteredTodos.sort((a, b) => {
            switch (this.sortOrder) {
                case 'priority': {
                    const order = { high: 3, medium: 2, low: 1 };
                    return order[b.priority] - order[a.priority];
                }
                case 'dueDate':
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });
        return filteredTodos;
    }

    isOverdue(todo) {
        if (!todo.dueDate || todo.completed) return false;
        return new Date(todo.dueDate) < new Date().setHours(0, 0, 0, 0);
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
        return date.toLocaleDateString();
    }

    render() {
        const todoList = document.getElementById('todo-list');
        const emptyState = document.getElementById('empty-state');
        const clearSearchBtn = document.getElementById('clear-search');
        const filteredTodos = this.getFilteredAndSortedTodos();
        clearSearchBtn.style.display = this.searchQuery ? 'block' : 'none';
        if (filteredTodos.length === 0) {
            todoList.innerHTML = '';
            emptyState.classList.add('show');
        } else {
            emptyState.classList.remove('show');
            todoList.innerHTML = filteredTodos.map(todo => this.createTodoElement(todo)).join('');
        }
        this.bindTodoEvents();
    }

    createTodoElement(todo) {
        const isOverdue = this.isOverdue(todo);
        const overdueClass = isOverdue ? 'overdue' : '';
        const dueDateText = todo.dueDate ? this.formatDate(todo.dueDate) : '';
        return `
            <li class="todo-item priority-${todo.priority} ${overdueClass}" data-id="${todo.id}">
                <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" data-id="${todo.id}"></div>
                <div class="todo-content">
                    <span class="todo-text ${todo.completed ? 'completed' : ''}">${this.escapeHtml(todo.text)}</span>
                    <div class="todo-meta">
                        <span class="priority-badge ${todo.priority}">${todo.priority}</span>
                        ${dueDateText ? `<span class="due-date ${isOverdue ? 'overdue' : ''}"><i class="fas fa-calendar"></i> ${dueDateText}</span>` : ''}
                    </div>
                </div>
                <div class="todo-actions">
                    <button class="todo-delete" data-id="${todo.id}" aria-label="Delete todo"><i class="fas fa-trash"></i></button>
                </div>
            </li>`;
    }

    bindTodoEvents() {
        document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.toggleTodo(id);
            });
        });
        document.querySelectorAll('.todo-delete').forEach(deleteBtn => {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(e.target.closest('.todo-delete').dataset.id);
                this.deleteTodo(id);
            });
        });
        document.querySelectorAll('.todo-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.todo-delete') && !e.target.closest('.todo-checkbox')) {
                    const id = parseInt(item.dataset.id);
                    this.toggleTodo(id);
                }
            });
        });
    }

    updateStats() {
        const activeCount = this.todos.filter(todo => !todo.completed).length;
        const completedCount = this.todos.filter(todo => todo.completed).length;
        const overdueCount = this.todos.filter(todo => this.isOverdue(todo)).length;
        document.getElementById('todo-count').textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
        const clearBtn = document.getElementById('clear-completed');
        clearBtn.style.display = completedCount > 0 ? 'inline' : 'none';
        const overdueBtn = document.querySelector('[data-filter="overdue"]');
        overdueBtn.textContent = overdueCount > 0 ? `Overdue (${overdueCount})` : 'Overdue';
    }

    saveToStorage() { localStorage.setItem('todos', JSON.stringify(this.todos)); }

    escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

document.addEventListener('DOMContentLoaded', () => { new TodoApp(); });

if (!localStorage.getItem('todos')) {
    const sampleTodos = [
        { id: 1, text: 'Welcome to your enhanced Todo List!', completed: false, priority: 'high', dueDate: null, createdAt: new Date().toISOString() },
        { id: 2, text: 'Click the checkbox to mark as complete', completed: true, priority: 'medium', dueDate: null, createdAt: new Date().toISOString() },
        { id: 3, text: 'Use the filters to view different todo states', completed: false, priority: 'low', dueDate: null, createdAt: new Date().toISOString() },
        { id: 4, text: 'Try the dark mode toggle in the top right', completed: false, priority: 'medium', dueDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0], createdAt: new Date().toISOString() }
    ];
    localStorage.setItem('todos', JSON.stringify(sampleTodos));
}
