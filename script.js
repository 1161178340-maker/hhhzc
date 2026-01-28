class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.updateStats();
    }

    bindEvents() {
        document.getElementById('add-btn').addEventListener('click', () => this.addTask());
        document.getElementById('task-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        document.getElementById('clear-completed').addEventListener('click', () => this.clearCompleted());
        document.getElementById('clear-all').addEventListener('click', () => this.clearAll());
    }

    addTask() {
        const input = document.getElementById('task-input');
        const text = input.value.trim();
        
        if (text === '') {
            this.showMessage('请输入任务内容', 'error');
            return;
        }

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        input.value = '';
        this.saveToLocalStorage();
        this.render();
        this.updateStats();
        this.showMessage('任务添加成功', 'success');
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveToLocalStorage();
            this.render();
            this.updateStats();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveToLocalStorage();
        this.render();
        this.updateStats();
        this.showMessage('任务已删除', 'info');
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.render();
    }

    clearCompleted() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        if (completedCount === 0) {
            this.showMessage('没有已完成的任务', 'info');
            return;
        }

        if (confirm(`确定要删除 ${completedCount} 个已完成的任务吗？`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveToLocalStorage();
            this.render();
            this.updateStats();
            this.showMessage(`已删除 ${completedCount} 个已完成的任务`, 'success');
        }
    }

    clearAll() {
        if (this.tasks.length === 0) {
            this.showMessage('没有任务可以清除', 'info');
            return;
        }

        if (confirm('确定要删除所有任务吗？此操作不可撤销！')) {
            this.tasks = [];
            this.saveToLocalStorage();
            this.render();
            this.updateStats();
            this.showMessage('所有任务已清除', 'success');
        }
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(t => !t.completed);
            case 'completed':
                return this.tasks.filter(t => t.completed);
            default:
                return this.tasks;
        }
    }

    render() {
        const taskList = document.getElementById('task-list');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            taskList.innerHTML = `
                <div class="empty-state">
                    <h3>${this.getEmptyStateMessage()}</h3>
                    <p>${this.getEmptyStateDescription()}</p>
                </div>
            `;
            return;
        }

        taskList.innerHTML = filteredTasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="app.toggleTask(${task.id})">
                    ${task.completed ? '✓' : ''}
                </div>
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <button class="task-delete" onclick="app.deleteTask(${task.id})" title="删除任务">
                    ×
                </button>
            </li>
        `).join('');
    }

    getEmptyStateMessage() {
        switch (this.currentFilter) {
            case 'active':
                return '没有待完成的任务';
            case 'completed':
                return '没有已完成的任务';
            default:
                return '还没有任务';
        }
    }

    getEmptyStateDescription() {
        switch (this.currentFilter) {
            case 'active':
                return '所有任务都已完成！';
            case 'completed':
                return '开始完成一些任务吧！';
            default:
                return '使用上方的输入框添加第一个任务';
        }
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        
        document.getElementById('total-tasks').textContent = `总任务: ${total}`;
        document.getElementById('completed-tasks').textContent = `已完成: ${completed}`;
    }

    saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        const bgColor = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3'
        }[type] || '#666';
        
        messageDiv.style.backgroundColor = bgColor;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .message {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
`;
document.head.appendChild(style);

new TodoApp();