let todoItems = [];
let draggedItem = null;
let countdownSeconds = 0; // Initialize countdownSeconds to 0
let timerInterval; // Declare timerInterval

function updateDateTime() {
  const now = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = daysOfWeek[now.getDay()];
  const currentTime = now.toLocaleTimeString();
  const currentDate = now.toLocaleDateString();

  document.getElementById('day-of-week').textContent = dayOfWeek;
  document.getElementById('current-time').textContent = currentTime;
  document.getElementById('current-date').textContent = currentDate;
}

function startTimer() {
  if (countdownSeconds > 0) {
    document.getElementById('start-timer').disabled = true;
    document.getElementById('stop-timer').disabled = false;
    document.getElementById('reset-timer').disabled = false;
    document.getElementById('add-minute').disabled = true;
    document.getElementById('subtract-minute').disabled = true;

    timerInterval = setInterval(() => {
      countdownSeconds--;
      updateTimerDisplay();

      if (countdownSeconds === 0) {
        stopTimer();
        alert('Timer has finished!');
      }
    }, 1000);
  } else {
    alert('Please add minutes to the timer before starting.');
  }
}

function stopTimer() {
  document.getElementById('start-timer').disabled = false;
  document.getElementById('stop-timer').disabled = true;
  document.getElementById('reset-timer').disabled = false;
  document.getElementById('add-minute').disabled = false;
  document.getElementById('subtract-minute').disabled = false;
  clearInterval(timerInterval);
}

function resetTimer() {
  countdownSeconds = 0;
  updateTimerDisplay();
  document.getElementById('start-timer').disabled = countdownSeconds <= 0;
  document.getElementById('stop-timer').disabled = true;
  document.getElementById('reset-timer').disabled = true;
  document.getElementById('add-minute').disabled = false;
  document.getElementById('subtract-minute').disabled = false;
  clearInterval(timerInterval);
}

function addMinute() {
  countdownSeconds += 60;
  updateTimerDisplay();
  document.getElementById('start-timer').disabled = false;
}

function subtractMinute() {
  if (countdownSeconds >= 60) {
    countdownSeconds -= 60;
    updateTimerDisplay();
  }
}

function updateTimerDisplay() {
  const minutes = Math.floor(countdownSeconds / 60);
  const seconds = countdownSeconds % 60;
  const timerDisplay = `${padZero(minutes)}:${padZero(seconds)}`;
  document.getElementById('timer-display').textContent = timerDisplay;
}

function padZero(value) {
  return value.toString().padStart(2, '0');
}

function addTodoItem() {
  const todoInput = document.getElementById('todo-input');
  const todoText = todoInput.value.trim();

  if (todoText !== '') {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item');

    const todoTextInput = document.createElement('input');
    todoTextInput.type = 'text';
    todoTextInput.value = todoText;
    todoTextInput.readOnly = false;

    const completedCheckbox = document.createElement('input');
    completedCheckbox.type = 'checkbox';
    completedCheckbox.checked = false;

    todoItem.appendChild(todoTextInput);
    todoItem.appendChild(completedCheckbox);

    const todoItemObj = {
      element: todoItem,
      text: todoText,
      completed: completedCheckbox.checked
    };

    todoItems.push(todoItemObj);
    renderTodoList();

    todoInput.value = '';
  }
}

function renderTodoList() {
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = '';

  todoItems.forEach((item, index) => {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item');
    todoItem.draggable = true;

    const todoTextInput = document.createElement('input');
    todoTextInput.type = 'text';
    todoTextInput.value = item.text;
    todoTextInput.readOnly = false;
    todoTextInput.addEventListener('input', () => {
      item.text = todoTextInput.value;
    });

    const completedCheckbox = document.createElement('input');
    completedCheckbox.type = 'checkbox';
    completedCheckbox.checked = item.completed;
    completedCheckbox.addEventListener('change', () => {
      item.completed = completedCheckbox.checked;
      if (item.completed) {
        todoItems.splice(index, 1);
        renderTodoList();
      }
    });

    todoItem.appendChild(todoTextInput);
    todoItem.appendChild(completedCheckbox);

    todoList.appendChild(todoItem);

    todoItem.addEventListener('dragstart', dragStart);
    todoItem.addEventListener('dragover', dragOver);
    todoItem.addEventListener('drop', drop);
  });
}

function dragStart(e) {
  draggedItem = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function drop(e) {
  e.preventDefault();
  if (draggedItem !== this) {
    const todoList = document.getElementById('todo-list');
    const draggedIndex = Array.from(todoList.children).indexOf(draggedItem);
    const droppedIndex = Array.from(todoList.children).indexOf(this);

    todoItems.splice(droppedIndex, 0, todoItems.splice(draggedIndex, 1)[0]);

    renderTodoList();
  }
  draggedItem.classList.remove('dragging');
  draggedItem = null;
}

// Call the updateDateTime function initially
updateDateTime();

// Update the date and time every second
setInterval(updateDateTime, 1000);

// Add event listeners for the timer buttons
document.getElementById('start-timer').addEventListener('click', startTimer);
document.getElementById('stop-timer').addEventListener('click', stopTimer);
document.getElementById('reset-timer').addEventListener('click', resetTimer);
document.getElementById('add-minute').addEventListener('click', addMinute);
document.getElementById('subtract-minute').addEventListener('click', subtractMinute);
document.getElementById('add-todo').addEventListener('click', addTodoItem);