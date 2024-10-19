class TodoApp {
    constructor() {
        this.todoList = document.getElementById('todo-list');
        this.todoForm = document.getElementById('todo-form');
        this.todoInput = document.getElementById('todo-input');
        this.todos = [];

        this.todoForm.addEventListener('submit', this.addTodo.bind(this));
        this.loadTodos();
        this.renderTodos();
    }

    addTodo(e) {
        e.preventDefault();
        const todoText = this.todoInput.value.trim();
        if (todoText) {
            const newTodo = {
                id: Date.now(),
                text: todoText,
                completed: false
            };
            this.todos.push(newTodo);
            this.saveTodos();
            this.renderTodos();
            this.todoInput.value = '';
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.renderTodos();
    }

    editTodo(id, newText) {
        const todoIndex = this.todos.findIndex(todo => todo.id === id);
        if (todoIndex !== -1) {
            this.todos[todoIndex].text = newText;
            this.saveTodos();
            this.renderTodos();
        }
    }

    toggleEditMode(todoItem) {
        todoItem.classList.toggle('editing');
        const editInput = todoItem.querySelector('.edit-input');
        const todoText = todoItem.querySelector('.todo-text');
        if (todoItem.classList.contains('editing')) {
            editInput.value = todoText.textContent;
            editInput.focus();
        }
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    loadTodos() {
        const storedTodos = localStorage.getItem('todos');
        this.todos = storedTodos ? JSON.parse(storedTodos) : [];
    }

    renderTodos() {
        this.todoList.innerHTML = '';
        this.todos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.className = 'todo-item';
            todoItem.innerHTML = `
              <span class="todo-text">${todo.text}</span>
              <input type="text" class="edit-input">
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
          `;

            const editBtn = todoItem.querySelector('.edit-btn');
            const deleteBtn = todoItem.querySelector('.delete-btn');
            const editInput = todoItem.querySelector('.edit-input');

            editBtn.addEventListener('click', () => {
                this.toggleEditMode(todoItem);
            });

            deleteBtn.addEventListener('click', () => {
                this.deleteTodo(todo.id);
            });

            editInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    this.editTodo(todo.id, editInput.value.trim());
                    this.toggleEditMode(todoItem);
                }
            });

            editInput.addEventListener('blur', () => {
                this.editTodo(todo.id, editInput.value.trim());
                this.toggleEditMode(todoItem);
            });

            this.todoList.appendChild(todoItem);
        });
    }
}

new TodoApp();