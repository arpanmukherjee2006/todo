// DOM elements
const currentTimeEl = document.getElementById('current-time');
const currentDateEl = document.getElementById('current-date');
const motivationQuoteEl = document.getElementById('motivation-quote');
const quoteAuthorEl = document.getElementById('quote-author');
const productiveMessageEl = document.getElementById('productive-message');
const themeToggleBtn = document.getElementById('theme-toggle');
const themePanel = document.getElementById('theme-panel');
const colorOptions = document.querySelectorAll('.color-option');
const customColorPicker = document.getElementById('custom-color');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('open-task-modal-btn');
const taskList = document.getElementById('task-list');
const addNoteBtn = document.getElementById('add-note-btn');
const notesList = document.getElementById('notes-list');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const addAiToolBtn = document.getElementById('add-ai-tool-btn');
const celebrationOverlay = document.getElementById('celebration-overlay');
const celebrationMessage = document.getElementById('celebration-message');
const celebrationSubmessage = document.getElementById('celebration-submessage');
const celebrationCloseBtn = document.getElementById('celebration-close-btn');
const darkModeToggle = document.getElementById('theme-toggle-checkbox');
const categoryFilter = document.getElementById('task-filter-category');
const priorityFilter = document.getElementById('task-filter-priority');
const sortTasksBy = document.getElementById('task-sort-option');
const taskModal = document.getElementById('task-modal');
const taskTitleInput = document.getElementById('modal-task-title');
const taskDescInput = document.getElementById('modal-task-description');
const taskCategory = document.getElementById('task-category');
const taskPriority = document.getElementById('task-priority');
const taskDueDate = document.getElementById('task-due-date');
const taskReminder = document.getElementById('task-reminder');
const saveTaskBtn = document.getElementById('save-task');
const cancelTaskBtn = document.getElementById('cancel-task');
const closeModalBtn = document.querySelector('.close-modal');
const body = document.body;

// Modal elements
const noteModal = document.getElementById('note-modal');
const noteTitleInput = document.getElementById('note-title');
const noteContentInput = document.getElementById('note-content');
const saveNoteBtn = document.getElementById('save-note-btn');
const cancelNoteBtn = document.getElementById('cancel-note-btn');
const aiToolModal = document.getElementById('ai-tool-modal');
const toolNameInput = document.getElementById('tool-name');
const toolUrlInput = document.getElementById('tool-url');
const toolDescInput = document.getElementById('tool-description');
const toolIconInput = document.getElementById('tool-icon');
const saveToolBtn = document.getElementById('save-tool-btn');
const cancelToolBtn = document.getElementById('cancel-tool-btn');

// Timer elements
const timerTabBtns = document.querySelectorAll('.timer-tab-btn');
const timerPanes = document.querySelectorAll('.timer-pane');
const startStopwatchBtn = document.getElementById('start-stopwatch');
const pauseStopwatchBtn = document.getElementById('pause-stopwatch');
const resetStopwatchBtn = document.getElementById('reset-stopwatch');
const lapBtn = document.getElementById('lap-btn');
const lapTimesList = document.getElementById('lap-times');
const stopwatchDisplay = document.querySelector('.stopwatch-display');
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const setTimerBtn = document.getElementById('set-timer-btn');
const startTimerBtn = document.getElementById('start-timer');
const pauseTimerBtn = document.getElementById('pause-timer');
const resetTimerBtn = document.getElementById('reset-timer');
const countdownDisplay = document.querySelector('.countdown-display');

// Variables
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let history = JSON.parse(localStorage.getItem('history')) || [];
let aiTools = [];

try {
    const savedApps = localStorage.getItem('apps');
    if (savedApps) {
        aiTools = JSON.parse(savedApps);
        if (!Array.isArray(aiTools)) {
            console.error("Saved apps is not an array, resetting");
            aiTools = [];
        }
    }
} catch (error) {
    console.error("Error loading apps from localStorage:", error);
    aiTools = [];
}

let themeColor = localStorage.getItem('themeColor') || '#1e90ff';
let stopwatchInterval;
let stopwatchTime = 0;
let stopwatchRunning = false;
let lapCount = 0;
let timerInterval;
let timerTime = 0;
let timerRunning = false;
let timerSet = false;
let editingTaskId = null;
let nextTaskId = (tasks.length > 0) ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
let draggedTask = null;

// History state for undo functionality
let deletedHistoryItems = [];
let lastDeletedItem = null;

// Motivational quotes
const quotes = [
    { quote: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { quote: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { quote: "Quality is not an act, it is a habit.", author: "Aristotle" },
    { quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
    { quote: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
    { quote: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
    { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" }
];

// Productivity messages
const productiveMessages = [
    "Morning is the best time to tackle difficult tasks!",
    "Breaking down tasks into smaller steps helps improve productivity!",
    "Remember to take short breaks every 25-30 minutes!",
    "Stay hydrated for better focus and concentration!",
    "Exercise boosts your energy and enhances productivity!",
    "Setting clear goals helps maintain motivation!",
    "Organize your workspace for better efficiency!",
    "Prioritize your most important tasks first!",
    "Limit multitasking to improve focus and quality!",
    "Celebrate your progress and achievements!"
];

// Celebration messages
const celebrationMessages = [
    { message: "Task Completed!", submessage: "Great job crossing this off your list!" },
    { message: "Mission Accomplished!", submessage: "You're making excellent progress!" },
    { message: "Task Finished!", submessage: "One step closer to your goals!" },
    { message: "Well Done!", submessage: "You're on a productivity streak!" },
    { message: "Success!", submessage: "Keep up the momentum!" },
    { message: "Task Complete!", submessage: "Your dedication is paying off!" },
    { message: "Achievement Unlocked!", submessage: "Keep moving forward!" },
    { message: "Fantastic Work!", submessage: "You're crushing your to-do list!" }
];

// Add new theme presets array
const themePresets = [
    { name: "Ocean Blue", color: "#1e90ff" },
    { name: "Forest Green", color: "#228B22" },
    { name: "Midnight Purple", color: "#483D8B" },
    { name: "Sunset Orange", color: "#FF4500" },
    { name: "Ruby Red", color: "#B22222" },
    { name: "Golden Amber", color: "#DAA520" }
];

// Apply saved theme color if exists
if (themeColor) {
    document.documentElement.style.setProperty('--primary-color', themeColor);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    renderTasks();
    setupEventListeners();
    initializeAITools();
    initializeTimers();
    renderNotes();
    renderHistory();
    initializeTheme();
    
    // Check for task reset at midnight
    checkForMidnightReset();
    setInterval(checkForMidnightReset, 60000);

    // Request notification permission
    if (Notification.permission !== 'denied' && Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
    
    console.log("App initialized successfully");
}

// Theme toggle functionality
document.querySelector('.toggle-label').addEventListener('click', function() {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
    localStorage.setItem('darkMode', !isDarkMode);
});

// Initialize theme
function initializeTheme() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
}

// Call initialize theme when page loads
initializeTheme();

// Convert hex color to RGB
function hexToRgb(hex) {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
}

// Setup event listeners
function setupEventListeners() {
    // Task controls
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', openTaskModal);
        console.log("Add task button listener attached");
    } else {
        console.log("Add task button not found");
    }
    
    // Close button listeners
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeTaskModal);
    }
    
    if (document.querySelector('.close-modal')) {
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    if (modal.id === 'task-modal') {
                        closeTaskModal();
                    } else if (modal.id === 'note-modal') {
                        closeNoteModal();
                    } else if (modal.id === 'ai-tool-modal') {
                        closeAiToolModal();
                    }
                }
            });
        });
    }
    
    if (saveTaskBtn) saveTaskBtn.addEventListener('click', saveTask);
    if (cancelTaskBtn) cancelTaskBtn.addEventListener('click', closeTaskModal);
    
    // Dark mode toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleDarkMode);
    }
    
    // Theme toggle button - using onclick to ensure it only has one event handler
    if (themeToggleBtn) {
        themeToggleBtn.onclick = function() {
            console.log("Theme toggle clicked");
            toggleThemePanel();
        };
        console.log("Theme toggle button listener attached");
    } else {
        console.log("Theme toggle button not found", themeToggleBtn);
    }
    
    // Filters and sorting
    if (categoryFilter) categoryFilter.addEventListener('change', filterTasks);
    if (priorityFilter) priorityFilter.addEventListener('change', filterTasks);
    if (sortTasksBy) sortTasksBy.addEventListener('change', sortTasks);
    
    // Tabs Navigation
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabName = this.dataset.tab;
                
                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to current button and pane
                this.classList.add('active');
                document.getElementById(`${tabName}-tab`).classList.add('active');
            });
        });
    }
    
    // Celebration close button
    if (celebrationCloseBtn) {
        document.getElementById('celebration-close-btn').addEventListener('click', function() {
            document.getElementById('celebration-overlay').style.display = 'none';
        });
    }

    // Also close celebration when clicking outside the content
    if (celebrationOverlay) {
        document.getElementById('celebration-overlay').addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    }
}

// Toggle dark mode
function toggleDarkMode() {
    if (darkModeToggle.checked) {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        body.removeAttribute('data-theme');
        localStorage.setItem('darkMode', 'disabled');
    }
}

// Toggle theme panel
function toggleThemePanel() {
    const themePanel = document.getElementById('theme-panel');
    if (!themePanel) {
        console.error("Theme panel not found");
        return;
    }
    
    console.log("Toggling theme panel");
    themePanel.classList.toggle('active');
    
    // If panel is now active, render the presets
    if (themePanel.classList.contains('active')) {
        renderThemePresets();
    }
}

// Apply theme color
function applyThemeColor(color) {
    console.log("Applying theme color:", color);
    
    // Update primary color
    document.documentElement.style.setProperty('--primary-color', color);
    
    // Update RGB values for shadows and transparencies
    const rgb = hexToRgb(color);
    if (rgb) {
        document.documentElement.style.setProperty('--primary-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
    
    // Save to localStorage
    localStorage.setItem('themeColor', color);
    
    // Update custom color picker if it exists
    const customColorPicker = document.getElementById('custom-color');
    if (customColorPicker) {
        customColorPicker.value = color;
    }

    // Update theme button color
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.style.backgroundColor = color;
    }
}

// Utility Functions
function updateDateTime() {
    const now = new Date();
    
    // Update time in 12-hour format with AM/PM
    const hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert 0 to 12 for midnight
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    currentTimeEl.textContent = `${hours12}:${minutes}:${seconds} ${ampm}`;
    
    // Update date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateEl.textContent = now.toLocaleDateString('en-US', options);
}

function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteObj = quotes[randomIndex];
    motivationQuoteEl.textContent = `"${quoteObj.quote}"`;
    quoteAuthorEl.textContent = `- ${quoteObj.author}`;
}

function displayRandomProductiveMessage() {
    const randomIndex = Math.floor(Math.random() * productiveMessages.length);
    productiveMessageEl.textContent = productiveMessages[randomIndex];
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function saveHistory() {
    localStorage.setItem('history', JSON.stringify(history));
}

function saveAiTools() {
    try {
        localStorage.setItem('aiTools', JSON.stringify(aiTools));
        console.log('AI tools saved:', aiTools.length);
    } catch (error) {
        console.error('Error saving AI tools:', error);
    }
}

function formatTime(timeInMs) {
    const hours = Math.floor(timeInMs / 3600000).toString().padStart(2, '0');
    const minutes = Math.floor((timeInMs % 3600000) / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((timeInMs % 60000) / 1000).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// Show celebration animation for completed tasks
function showCelebration() {
    console.log("Showing celebration");
    const overlay = document.getElementById('celebration-overlay');
    if (!overlay) {
        console.error("Celebration overlay not found");
        return;
    }
    
    // Update celebration message
    const message = document.getElementById('celebration-message');
    const submessage = document.getElementById('celebration-submessage');
    
    // Random celebratory messages
    const messages = [
        "Task Completed!",
        "Great Job!",
        "Well Done!",
        "Mission Accomplished!",
        "Success!"
    ];
    
    const submessages = [
        "One step closer to your goals!",
        "Making progress, keep it up!",
        "You're on a roll today!",
        "Productivity champion!",
        "Great job crossing this off your list!"
    ];
    
    message.textContent = messages[Math.floor(Math.random() * messages.length)];
    submessage.textContent = submessages[Math.floor(Math.random() * submessages.length)];
    
    // Show overlay
    overlay.style.display = 'block';
    
    // Run confetti animation
    runConfetti();
    
    // Automatically hide after 5 seconds if not clicked
    setTimeout(() => {
        if (overlay.style.display === 'block') {
            overlay.style.display = 'none';
        }
    }, 5000);
}

function runConfetti() {
    confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#1e90ff', '#ff6b6b', '#28a745', '#ffc107', '#17a2b8'],
        disableForReducedMotion: true
    });
    
    // Multiple confetti bursts for a more dynamic effect
    setTimeout(() => {
        confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.5, x: 0.3 },
            colors: ['#ffd700', '#ff8c00'],
            disableForReducedMotion: true
        });
    }, 300);
    
    setTimeout(() => {
        confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.5, x: 0.7 },
            colors: ['#ff6b6b', '#28a745'],
            disableForReducedMotion: true
        });
    }, 500);
}

function checkForMidnightReset() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // If it's midnight (00:00)
    if (hours === 0 && minutes === 0) {
        // Move completed tasks to history
        const completedTasks = tasks.filter(task => task.completed);
        if (completedTasks.length > 0) {
            const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            completedTasks.forEach(task => {
                history.push({
                    id: Date.now() + Math.random().toString(16).slice(2),
                    text: task.text,
                    date: today
                });
            });
            saveHistory();
        }
        
        // Clear current tasks
        tasks = [];
        saveTasks();
        renderTasks();
    }
}

// Render Functions
function renderTasks() {
    taskList.innerHTML = '';
    
    const categoryValue = categoryFilter ? categoryFilter.value : 'all';
    const priorityValue = priorityFilter ? priorityFilter.value : 'all';
    
    const filteredTasks = tasks.filter(task => {
        // Apply category filter
        if (categoryValue !== 'all' && task.category !== categoryValue) {
            return false;
        }
        
        // Apply priority filter
        if (priorityValue !== 'all' && task.priority !== priorityValue) {
            return false;
        }
        
        return true;
    });
    
    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-task-message';
        emptyMessage.textContent = 'No tasks found. Add a new task!';
        taskList.appendChild(emptyMessage);
        return;
    }
    
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
    
    // Setup drag and drop after rendering
    setupDragAndDrop();
}

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = `task-item priority-${task.priority} category-${task.category}`;
    taskElement.dataset.id = task.id;
    taskElement.draggable = true;
    
    // Add classes for completed tasks
    if (task.completed) {
        taskElement.classList.add('completed');
    }
    
    // Create task HTML structure
    taskElement.innerHTML = `
        <div class="drag-handle"><i class="fas fa-grip-lines"></i></div>
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <div class="task-content">
            <div class="task-header">
                <h3 class="task-title ${task.completed ? 'completed-task' : ''}">${task.title}</h3>
                ${task.dueDate ? `<span class="task-due-date ${isOverdue(task) ? 'overdue' : ''}">
                    <i class="far fa-calendar-alt"></i> ${formatDueDate(task.dueDate)}
                </span>` : ''}
            </div>
            ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
            <div class="task-footer">
                <div class="task-meta">
                    <span class="task-priority ${task.priority}">
                        <i class="fas fa-flag"></i> ${capitalizeFirst(task.priority)}
                    </span>
                    <span class="task-category">
                        <i class="fas fa-tag"></i> ${capitalizeFirst(task.category)}
                    </span>
                </div>
                <div class="task-actions">
                    <button class="task-edit"><i class="fas fa-edit"></i></button>
                    <button class="task-delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    const checkbox = taskElement.querySelector('.task-checkbox');
    checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));
    
    const editBtn = taskElement.querySelector('.task-edit');
    editBtn.addEventListener('click', () => editTask(task.id));
    
    const deleteBtn = taskElement.querySelector('.task-delete');
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    // Drag and drop events
    taskElement.addEventListener('dragstart', handleDragStart);
    taskElement.addEventListener('dragend', handleDragEnd);
    taskElement.addEventListener('dragover', handleDragOver);
    taskElement.addEventListener('dragenter', handleDragEnter);
    taskElement.addEventListener('dragleave', handleDragLeave);
    taskElement.addEventListener('drop', handleDrop);
    
    return taskElement;
}

function renderNotes() {
    notesList.innerHTML = '';
    
    // Sort notes by date, newest first
    const sortedNotes = notes.sort((a, b) => b.timestamp - a.timestamp);
    
    sortedNotes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');
        noteCard.dataset.id = note.id;
        
        const noteTitle = document.createElement('h3');
        noteTitle.classList.add('note-title');
        noteTitle.textContent = note.title;
        
        const noteContent = document.createElement('div');
        noteContent.classList.add('note-content');
        noteContent.textContent = note.content;
        
        const noteFooter = document.createElement('div');
        noteFooter.classList.add('note-footer');
        
        const noteDate = document.createElement('div');
        noteDate.classList.add('note-date');
        noteDate.textContent = formatNoteDate(note.timestamp);
        
        const noteActions = document.createElement('div');
        noteActions.classList.add('note-actions');
        
        const editBtn = document.createElement('button');
        editBtn.classList.add('note-edit');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('note-delete');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        
        noteActions.appendChild(editBtn);
        noteActions.appendChild(deleteBtn);
        
        noteFooter.appendChild(noteDate);
        noteFooter.appendChild(noteActions);
        
        noteCard.appendChild(noteTitle);
        noteCard.appendChild(noteContent);
        noteCard.appendChild(noteFooter);
        
        notesList.appendChild(noteCard);
        
        // Event listeners
        editBtn.addEventListener('click', () => editNote(note.id));
        deleteBtn.addEventListener('click', () => deleteNote(note.id));
    });
}

function formatNoteDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
        return 'Yesterday at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
        return date.toLocaleDateString([], { weekday: 'long' }) + ' at ' + 
               date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' at ' +
               date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

function editNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    noteTitleInput.value = note.title;
    noteContentInput.value = note.content;
    noteModal.dataset.editId = noteId;
    
    // Update modal title
    const modalTitle = noteModal.querySelector('h3');
    if (modalTitle) modalTitle.textContent = 'Edit Note';
    
    openNoteModal();
}

function deleteNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    if (confirm(`Are you sure you want to delete the note "${note.title}"?`)) {
        notes = notes.filter(n => n.id !== noteId);
        saveNotes();
        renderNotes();
        showNotification('Note deleted successfully', 'warning');
    }
}

// Add Note
addNoteBtn.addEventListener('click', function(e) {
    e.preventDefault(); // Prevent default form submission
    openNoteModal();
});

function openNoteModal() {
    noteModal.style.display = 'block';
    // Trigger reflow
    noteModal.offsetHeight;
    noteModal.classList.add('show');
    noteTitleInput.focus();
}

function closeNoteModal() {
    noteModal.classList.remove('show');
    setTimeout(() => {
        noteModal.style.display = 'none';
        noteTitleInput.value = '';
        noteContentInput.value = '';
        delete noteModal.dataset.editId;
        
        // Reset modal title
        const modalTitle = noteModal.querySelector('h3');
        if (modalTitle) modalTitle.textContent = 'Add New Note';
    }, 300); // Match the transition duration
}

// Update save note functionality
saveNoteBtn.addEventListener('click', function() {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    
    if (!title || !content) {
        showNotification('Please fill in both title and content', 'warning');
        return;
    }
    
    const editId = noteModal.dataset.editId;
    
    if (editId) {
        // Update existing note
        const noteIndex = notes.findIndex(n => n.id === editId);
        if (noteIndex !== -1) {
            notes[noteIndex] = {
                ...notes[noteIndex],
                title,
                content,
                lastEdited: Date.now()
            };
            showNotification('Note updated successfully', 'success');
        }
    } else {
        // Create new note
        const newNote = {
            id: Date.now().toString() + Math.random().toString(16).slice(2),
            title,
            content,
            timestamp: Date.now(),
            lastEdited: null
        };
        notes.push(newNote);
        showNotification('Note created successfully', 'success');
    }
    
    saveNotes();
    renderNotes();
    closeNoteModal();
});

// Update cancel button functionality
cancelNoteBtn.addEventListener('click', closeNoteModal);

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeTaskModal();
    }
    
    if (e.target === noteModal) {
        closeNoteModal();
    }
    
    if (e.target === aiToolModal) {
        aiToolModal.style.display = 'none';
    }
    
    if (e.target === celebrationOverlay) {
        celebrationOverlay.style.display = 'none';
    }
    
    // Close theme panel when clicking outside of it or the toggle button
    if (themePanel && !themePanel.contains(e.target) && e.target !== themeToggleBtn) {
        themePanel.classList.remove('active');
    }
});

function renderHistory() {
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.classList.add('empty-history-message');
        emptyMessage.innerHTML = `
            <i class="fas fa-history"></i>
            <p>No history items yet</p>
            <p class="sub-text">Completed tasks will appear here</p>
        `;
        historyList.appendChild(emptyMessage);
        return;
    }

    // Add bulk selection controls
    const bulkControls = document.createElement('div');
    bulkControls.classList.add('history-bulk-controls');
    bulkControls.innerHTML = `
        <div class="bulk-select">
            <input type="checkbox" id="select-all-history" class="bulk-checkbox">
            <label for="select-all-history">Select All</label>
        </div>
        <button id="bulk-delete-btn" class="bulk-delete-btn" disabled>
            <i class="fas fa-trash"></i> Delete Selected
        </button>
    `;
    historyList.appendChild(bulkControls);

    // Add sorting controls
    const sortControls = document.createElement('div');
    sortControls.classList.add('history-sort-controls');
    sortControls.innerHTML = `
        <select id="history-sort">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">Alphabetical</option>
        </select>
    `;
    historyList.appendChild(sortControls);

    // Create container for history items
    const historyItemsContainer = document.createElement('div');
    historyItemsContainer.classList.add('history-items-container');
    
    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.dataset.id = item.id;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('history-item-checkbox');
        
        const historyDate = document.createElement('div');
        historyDate.classList.add('history-date');
        historyDate.textContent = formatHistoryDate(item.date);
        
        const historyText = document.createElement('div');
        historyText.classList.add('history-text');
        historyText.textContent = item.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('history-delete');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        
        historyItem.appendChild(checkbox);
        historyItem.appendChild(historyDate);
        historyItem.appendChild(historyText);
        historyItem.appendChild(deleteBtn);
        historyItemsContainer.appendChild(historyItem);
        
        // Event listeners
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            deleteHistoryItem(item.id);
        });
        
        checkbox.addEventListener('change', function() {
            updateBulkDeleteButton();
        });
    });
    
    historyList.appendChild(historyItemsContainer);
    
    // Setup event listeners for bulk controls
    const selectAllCheckbox = document.getElementById('select-all-history');
    const bulkDeleteBtn = document.getElementById('bulk-delete-btn');
    const sortSelect = document.getElementById('history-sort');
    
    selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.history-item-checkbox');
        checkboxes.forEach(checkbox => checkbox.checked = this.checked);
        updateBulkDeleteButton();
    });
    
    bulkDeleteBtn.addEventListener('click', function() {
        const selectedItems = document.querySelectorAll('.history-item-checkbox:checked');
        if (selectedItems.length === 0) return;
        
        if (confirm(`Are you sure you want to delete ${selectedItems.length} selected items?`)) {
            const itemsToDelete = Array.from(selectedItems).map(checkbox => 
                checkbox.closest('.history-item').dataset.id
            );
            deleteMultipleHistoryItems(itemsToDelete);
        }
    });
    
    sortSelect.addEventListener('change', function() {
        sortHistory(this.value);
    });
}

function formatHistoryDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
        return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
        return `${date.toLocaleDateString([], { weekday: 'long' })} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
        return date.toLocaleDateString([], { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

function deleteHistoryItem(id) {
    const itemToDelete = history.find(h => h.id === id);
    if (!itemToDelete) return;
    
    if (confirm(`Are you sure you want to delete this history item: "${itemToDelete.text}"?`)) {
        // Store for undo
        lastDeletedItem = itemToDelete;
        deletedHistoryItems.push(itemToDelete);
        
        // Remove from history
        history = history.filter(h => h.id !== id);
        saveHistory();
        renderHistory();
        
        // Show notification with undo button
        showNotificationWithUndo('History item deleted', () => {
            // Undo deletion
            history.push(lastDeletedItem);
            deletedHistoryItems = deletedHistoryItems.filter(h => h.id !== lastDeletedItem.id);
            lastDeletedItem = null;
            saveHistory();
            renderHistory();
            showNotification('History item restored', 'success');
        });
    }
}

function deleteMultipleHistoryItems(ids) {
    // Store for undo
    const itemsToDelete = history.filter(h => ids.includes(h.id));
    deletedHistoryItems.push(...itemsToDelete);
    
    // Remove from history
    history = history.filter(h => !ids.includes(h.id));
    saveHistory();
    renderHistory();
    
    // Show notification with undo button
    showNotificationWithUndo(`${ids.length} items deleted`, () => {
        // Undo deletion
        history.push(...itemsToDelete);
        deletedHistoryItems = deletedHistoryItems.filter(h => !ids.includes(h.id));
        saveHistory();
        renderHistory();
        showNotification('Items restored', 'success');
    });
}

function updateBulkDeleteButton() {
    const bulkDeleteBtn = document.getElementById('bulk-delete-btn');
    const selectedItems = document.querySelectorAll('.history-item-checkbox:checked');
    bulkDeleteBtn.disabled = selectedItems.length === 0;
}

function sortHistory(sortBy) {
    switch(sortBy) {
        case 'newest':
            history.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            history.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'alphabetical':
            history.sort((a, b) => a.text.localeCompare(b.text));
            break;
    }
    renderHistory();
}

function showNotificationWithUndo(message, undoCallback) {
    const notification = document.createElement('div');
    notification.classList.add('notification', 'notification-warning');
    
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-exclamation-circle');
    
    const text = document.createElement('span');
    text.textContent = message;
    
    const undoBtn = document.createElement('button');
    undoBtn.classList.add('undo-btn');
    undoBtn.innerHTML = '<i class="fas fa-undo"></i> Undo';
    
    const closeBtn = document.createElement('i');
    closeBtn.classList.add('fas', 'fa-times', 'notification-close');
    
    notification.appendChild(icon);
    notification.appendChild(text);
    notification.appendChild(undoBtn);
    notification.appendChild(closeBtn);
    
    document.body.appendChild(notification);
    
    // Show animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-hide after 5 seconds
    const hideTimeout = setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Undo button functionality
    undoBtn.addEventListener('click', function() {
        clearTimeout(hideTimeout);
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
        undoCallback();
    });
    
    // Close button functionality
    closeBtn.addEventListener('click', function() {
        clearTimeout(hideTimeout);
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Update clear history functionality
clearHistoryBtn.addEventListener('click', function() {
    if (history.length === 0) {
        showNotification('No history items to clear', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
        // Store current history for potential recovery
        const clearedItems = [...history];
        
        // Clear history
        history = [];
        saveHistory();
        renderHistory();
        
        // Show notification with recovery option
        showNotificationWithUndo('All history cleared', () => {
            history = clearedItems;
            saveHistory();
            renderHistory();
            showNotification('History restored', 'success');
        });
    }
});

// Render AI Tools
function renderAITools(tools) {
    console.log('Rendering AI tools');
    const container = document.querySelector('.ai-tools-container');
    if (!container) {
        console.error('AI tools container not found');
        return;
    }
    
    container.innerHTML = '';
    
    // Get default tools only
    const defaultTools = getDefaultAITools();
    
    // Render each tool
    defaultTools.forEach(tool => {
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card';
        toolCard.dataset.id = tool.id;
        
        // Create icon container
        const iconContainer = document.createElement('div');
        iconContainer.className = 'tool-icon-container';
        
        // Create icon image with better error handling
        const iconImg = document.createElement('img');
        iconImg.alt = tool.name;
        iconImg.src = tool.icon;
        iconImg.className = 'tool-icon';
        
        // Add fallback for missing images
        iconImg.onerror = function() {
            console.warn(`Failed to load icon for ${tool.name}, using fallback`);
            // Create fallback with first letter of tool name
            const letter = tool.name.charAt(0);
            const colors = {
                'ChatGPT': '#74AA9C',
                'Perplexity AI': '#A466FF',
                'Claude AI': '#E1E1E1',
                'Google Gemini': '#4285F4',
                'Microsoft Copilot': '#00A67E',
                'DeepSeek': '#1B1C25'
            };
            const bgColor = colors[tool.name] || '#' + Math.floor(Math.random()*16777215).toString(16);
            const textColor = tool.name === 'Claude AI' ? '#666666' : 'white';
            
            this.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="${bgColor.replace('#', '%23')}"/><text x="50" y="70" font-family="Arial" font-weight="bold" font-size="60" text-anchor="middle" fill="${textColor}">${letter}</text></svg>`;
        };
        
        iconContainer.appendChild(iconImg);
        
        // Create tool content
        const nameEl = document.createElement('h3');
        nameEl.textContent = tool.name;
        
        const descEl = document.createElement('p');
        descEl.textContent = tool.description;
        
        // Create actions container
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'tool-actions';
        
        // Create open link
        const openLink = document.createElement('a');
        openLink.href = tool.url;
        openLink.target = '_blank';
        openLink.className = 'tool-link';
        openLink.textContent = 'Open';
        
        // Append button to actions
        actionsContainer.appendChild(openLink);
        
        // Append all elements to card
        toolCard.appendChild(iconContainer);
        toolCard.appendChild(nameEl);
        toolCard.appendChild(descEl);
        toolCard.appendChild(actionsContainer);
        
        // Add the finished card to container
        container.appendChild(toolCard);
    });
}

// Get Default AI Tools
function getDefaultAITools() {
    return [
        {
            id: 'chatgpt',
            name: 'ChatGPT',
            description: 'Powerful AI assistant for text generation and conversation',
            icon: 'images/logos/chatgpt logo.webp',
            url: 'https://chat.openai.com'
        },
        {
            id: 'perplexity',
            name: 'Perplexity AI',
            description: 'AI-powered search engine with accurate, cited information',
            icon: 'images/logos/perplexity logo.webp',
            url: 'https://www.perplexity.ai'
        },
        {
            id: 'claude',
            name: 'Claude AI',
            description: 'Anthropic\'s helpful and harmless AI assistant',
            icon: 'images/logos/claude logo.webp',
            url: 'https://claude.ai'
        },
        {
            id: 'gemini',
            name: 'Google Gemini',
            description: 'Google\'s AI assistant for creative and analytical tasks',
            icon: 'images/logos/google gemini logo.webp',
            url: 'https://gemini.google.com'
        },
        {
            id: 'copilot',
            name: 'Microsoft Copilot',
            description: 'Microsoft\'s AI assistant with Bing integration',
            icon: 'images/logos/microsoft_copilot-logo.webp',
            url: 'https://copilot.microsoft.com'
        },
        {
            id: 'deepseek',
            name: 'DeepSeek',
            description: 'Advanced AI tools for complex problem-solving',
            icon: 'images/logos/deepseek-logo.webp',
            url: 'https://chat.deepseek.com'
        }
    ];
}

// Setup AI Tools Event Listeners
function setupAIToolsListeners() {
    // We've removed the custom tools functionality, so this function is simpler now
    console.log('Setting up AI tools listeners');
}

// Initialize AI Tools
function initializeAITools() {
    console.log('Initializing AI tools');
    renderAITools();
    setupAIToolsListeners();
}

// Custom Color Picker
customColorPicker.addEventListener('input', function() {
    const color = this.value;
    document.documentElement.style.setProperty('--primary-color', color);
    localStorage.setItem('themeColor', color);
});

// Tabs Navigation
tabButtons.forEach(button => {
    button.addEventListener('click', function() {
        const tabName = this.dataset.tab;
        
        // Remove active class from all buttons and panes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add active class to current button and pane
        this.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

// Timer Tabs Navigation
timerTabBtns.forEach(button => {
    button.addEventListener('click', function() {
        const tabName = this.dataset.timerTab;
        
        // Remove active class from all buttons and panes
        timerTabBtns.forEach(btn => btn.classList.remove('active'));
        timerPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add active class to current button and pane
        this.classList.add('active');
        document.getElementById(`${tabName}-pane`).classList.add('active');
    });
});

// Add Task
addTaskBtn.addEventListener('click', function() {
    openTaskModal();
});

function openTaskModal() {
    // Reset modal fields
    taskTitleInput.value = '';
    taskDescInput.value = '';
    taskDueDate.value = '';
    taskPriority.value = 'medium';
    taskCategory.value = 'other';
    taskReminder.checked = false;
    
    // Change modal title for new task
    document.querySelector('#task-modal h3').textContent = 'Create New Task';
    editingTaskId = null;
    
    // Open modal
    taskModal.style.display = 'block';
    taskTitleInput.focus();
}

// Edit task
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Set form values
    taskTitleInput.value = task.title;
    taskDescInput.value = task.description || '';
    taskPriority.value = task.priority;
    taskCategory.value = task.category;
    taskDueDate.value = task.dueDate ? formatDateTimeForInput(task.dueDate) : '';
    taskReminder.checked = task.reminder || false;
    
    // Change modal title for editing
    document.querySelector('#task-modal h3').textContent = 'Edit Task';
    editingTaskId = taskId;
    
    // Open modal
    taskModal.style.display = 'block';
    taskTitleInput.focus();
}

// Close task modal
function closeTaskModal() {
    taskModal.style.display = 'none';
    // Reset form fields
    taskTitleInput.value = '';
    taskDescInput.value = '';
    taskDueDate.value = '';
    taskPriority.value = 'medium';
    taskCategory.value = 'other';
    taskReminder.checked = false;
    editingTaskId = null;
}

// Save task (new or edited)
function saveTask() {
    const title = taskTitleInput.value.trim();
    if (!title) {
        alert('Please enter a task title');
        return;
    }
    
    const taskData = {
        id: editingTaskId || Date.now(), // Use existing ID or create a new one
        title,
        description: taskDescInput.value.trim(),
        priority: taskPriority.value,
        category: taskCategory.value,
        dueDate: taskDueDate.value || null,
        reminder: taskReminder.checked,
        completed: editingTaskId ? (tasks.find(t => t.id === editingTaskId)?.completed || false) : false,
        dateCreated: new Date().toISOString()
    };
    
    if (editingTaskId) {
        // Update existing task
        const index = tasks.findIndex(t => t.id === editingTaskId);
        if (index !== -1) {
            tasks[index] = taskData;
        }
    } else {
        // Add new task
        tasks.push(taskData);
        nextTaskId++;
    }
    
    // Save and render
    console.log("Saving task:", taskData);
    saveTasks();
    closeTaskModal();
    renderTasks();
    
    // Show notification instead of celebration when adding a task
    if (!editingTaskId) {
        showNotification('Task added successfully!', 'success');
    } else {
        showNotification('Task updated successfully!', 'success');
    }
}

// Toggle task completion
function toggleTaskCompletion(taskId) {
    console.log(`Toggling completion for task: ${taskId}`);
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        console.error(`Task with ID ${taskId} not found`);
        return;
    }
    
    task.completed = !task.completed;
    
    if (task.completed) {
        // Add to history when task is completed
        const historyItem = {
            id: Date.now(),
            text: `Completed: ${task.title}`,
            date: new Date().toISOString()
        };
        
        history.push(historyItem);
        saveHistory();
        renderHistory();
        
        // Show celebration animation
        setTimeout(() => {
            showCelebration();
        }, 300); // Small delay to ensure the UI updates first
    }
    
    saveTasks();
    renderTasks();
    
    return task.completed;
}

// Delete task
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    }
}

// Drag and Drop event handlers
function handleDragStart(e) {
    draggedTask = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    document.querySelectorAll('.task-item').forEach(task => {
        task.classList.remove('drag-over');
    });
    draggedTask = null;
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.stopPropagation();
    
    if (draggedTask !== this) {
        // Get positions in the tasks array
        const allTasks = Array.from(document.querySelectorAll('.task-item'));
        const draggedIndex = allTasks.indexOf(draggedTask);
        const dropIndex = allTasks.indexOf(this);
        
        // Get the actual task IDs
        const draggedId = parseInt(draggedTask.dataset.id);
        const dropId = parseInt(this.dataset.id);
        
        // Find their indexes in the tasks array
        const draggedTaskIndex = tasks.findIndex(t => t.id === draggedId);
        const dropTaskIndex = tasks.findIndex(t => t.id === dropId);
        
        if (draggedTaskIndex !== -1 && dropTaskIndex !== -1) {
            // Remove the dragged task from its position
            const [taskToMove] = tasks.splice(draggedTaskIndex, 1);
            
            // Insert at the new position
            tasks.splice(dropTaskIndex, 0, taskToMove);
            
            // Save and re-render
            saveTasks();
            renderTasks();
        }
    }
    
    return false;
}

// Filter and sort tasks
function filterTasks() {
    renderTasks();
}

function sortTasks() {
    const sortBy = sortTasksBy.value;
    
    tasks.sort((a, b) => {
        switch(sortBy) {
            case 'created':
                return a.id - b.id;
            case 'due-date':
                // Sort by due date (null dates at the end)
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            case 'priority':
                // Sort by priority (high -> medium -> low)
                const priorityValues = { high: 3, medium: 2, low: 1 };
                return priorityValues[b.priority] - priorityValues[a.priority];
            case 'category':
                // Sort alphabetically by category
                return a.category.localeCompare(b.category);
            default:
                return a.id - b.id;
        }
    });
    
    renderTasks();
}

// Helper functions
function isOverdue(task) {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
}

function formatDueDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    if (isToday) {
        return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (isTomorrow) {
        return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
        return date.toLocaleString([], { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit'
        });
    }
}

function formatDateTimeForInput(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Timer Functionality
function initializeTimers() {
    console.log('Initializing timers');
    setupTimerTabs();
    initializePomodoro();
    initializeStopwatch();
    initializeCountdown();
}

// Setup Timer Tabs
function setupTimerTabs() {
    const timerTabBtns = document.querySelectorAll('.timer-tab-btn');
    
    timerTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            timerTabBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding timer pane
            const timerType = this.dataset.timerTab;
            const timerPanes = document.querySelectorAll('.timer-pane');
            
            timerPanes.forEach(pane => {
                pane.classList.remove('active');
            });
            
            document.getElementById(`${timerType}-pane`).classList.add('active');
        });
    });
}

// Pomodoro Timer
function initializePomodoro() {
    let pomodoroTimer;
    let pomodoroRunning = false;
    let pomodoroSeconds = 25 * 60; // 25 minutes
    let currentMode = 'focus';
    let cycleCount = 0;
    
    const startBtn = document.getElementById('start-pomodoro');
    const pauseBtn = document.getElementById('pause-pomodoro');
    const resetBtn = document.getElementById('reset-pomodoro');
    const timerDisplay = document.getElementById('pomodoro-display');
    const modeDisplay = document.getElementById('pomodoro-mode');
    const timerProgress = document.getElementById('pomodoro-progress');
    const timerCircle = document.querySelector('#pomodoro-pane .timer-circle');
    
    const focusDurationInput = document.getElementById('focus-duration');
    const breakDurationInput = document.getElementById('break-duration');
    const longBreakDurationInput = document.getElementById('long-break-duration');
    const cyclesInput = document.getElementById('pomodoro-cycles');
    
    function updatePomodoroDisplay() {
        if (!timerDisplay) return;
        
        const minutes = Math.floor(pomodoroSeconds / 60);
        const seconds = pomodoroSeconds % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        let totalSeconds = currentMode === 'focus' 
            ? focusDurationInput.value * 60 
            : (currentMode === 'break' ? breakDurationInput.value * 60 : longBreakDurationInput.value * 60);
        
        if (timerProgress) {
            const percentComplete = ((totalSeconds - pomodoroSeconds) / totalSeconds) * 100;
            
            // Set color based on mode
            if (currentMode === 'focus') {
                timerProgress.style.background = `conic-gradient(
                    var(--primary-color) ${percentComplete}%, 
                    rgba(var(--primary-color-rgb), 0.1) ${percentComplete}%
                )`;
                modeDisplay.style.color = 'var(--primary-color)';
            } else if (currentMode === 'break') {
                timerProgress.style.background = `conic-gradient(
                    var(--success-color) ${percentComplete}%, 
                    rgba(40, 167, 69, 0.1) ${percentComplete}%
                )`;
                modeDisplay.style.color = 'var(--success-color)';
            } else { // long break
                timerProgress.style.background = `conic-gradient(
                    var(--info-color) ${percentComplete}%, 
                    rgba(23, 162, 184, 0.1) ${percentComplete}%
                )`;
                modeDisplay.style.color = 'var(--info-color)';
            }
        }
    }
    
    function resetPomodoro() {
        pomodoroRunning = false;
        clearInterval(pomodoroTimer);
        currentMode = 'focus';
        pomodoroSeconds = parseInt(focusDurationInput.value) * 60;
        updatePomodoroDisplay();
        if (modeDisplay) modeDisplay.textContent = 'Focus';
        toggleTimerActiveState(false, timerCircle);
    }
    
    function switchPomodoroMode() {
        cycleCount++;
        
        if (currentMode === 'focus') {
            if (cycleCount % parseInt(cyclesInput.value) === 0) {
                currentMode = 'longBreak';
                pomodoroSeconds = parseInt(longBreakDurationInput.value) * 60;
                if (modeDisplay) modeDisplay.textContent = 'Long Break';
            } else {
                currentMode = 'break';
                pomodoroSeconds = parseInt(breakDurationInput.value) * 60;
                if (modeDisplay) modeDisplay.textContent = 'Break';
            }
        } else {
            currentMode = 'focus';
            pomodoroSeconds = parseInt(focusDurationInput.value) * 60;
            if (modeDisplay) modeDisplay.textContent = 'Focus';
        }
        
        updatePomodoroDisplay();
        playTimerCompleteSound();
        showNotification(`${currentMode === 'focus' ? 'Focus time' : 'Break time'} started!`, 'info');
    }
    
    function updatePomodoro() {
        if (pomodoroSeconds > 0) {
            pomodoroSeconds--;
            updatePomodoroDisplay();
        } else {
            switchPomodoroMode();
        }
    }
    
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            if (!pomodoroRunning) {
                pomodoroRunning = true;
                pomodoroTimer = setInterval(updatePomodoro, 1000);
                toggleTimerActiveState(true, timerCircle);
            }
        });
    }
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', function() {
            pomodoroRunning = false;
            clearInterval(pomodoroTimer);
            toggleTimerActiveState(false, timerCircle);
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetPomodoro);
    }
    
    // Initialize with UI update
    resetPomodoro();
    
    // Add event listeners to update display when inputs change
    if (focusDurationInput) focusDurationInput.addEventListener('change', resetPomodoro);
    if (breakDurationInput) breakDurationInput.addEventListener('change', resetPomodoro);
    if (longBreakDurationInput) longBreakDurationInput.addEventListener('change', resetPomodoro);
    if (cyclesInput) cyclesInput.addEventListener('change', resetPomodoro);
}

// Stopwatch
function initializeStopwatch() {
    let stopwatchTimer;
    let stopwatchRunning = false;
    let stopwatchTime = 0;
    let lapCount = 0;
    
    const startBtn = document.getElementById('start-stopwatch');
    const pauseBtn = document.getElementById('pause-stopwatch');
    const resetBtn = document.getElementById('reset-stopwatch');
    const lapBtn = document.getElementById('lap-stopwatch');
    const display = document.getElementById('stopwatch-display');
    const lapTimesEl = document.getElementById('lap-times');
    const timerCircle = document.querySelector('#stopwatch-pane .timer-circle');
    
    function updateStopwatchDisplay() {
        if (!display) return;
        
        const hours = Math.floor(stopwatchTime / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((stopwatchTime % 3600) / 60).toString().padStart(2, '0');
        const seconds = Math.floor(stopwatchTime % 60).toString().padStart(2, '0');
        display.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    function resetStopwatch() {
        stopwatchRunning = false;
        clearInterval(stopwatchTimer);
        stopwatchTime = 0;
        lapCount = 0;
        updateStopwatchDisplay();
        if (lapTimesEl) lapTimesEl.innerHTML = '';
        toggleTimerActiveState(false, timerCircle);
    }
    
    function recordLap() {
        if (!lapTimesEl) return;
        
        lapCount++;
        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        
        const hours = Math.floor(stopwatchTime / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((stopwatchTime % 3600) / 60).toString().padStart(2, '0');
        const seconds = Math.floor(stopwatchTime % 60).toString().padStart(2, '0');
        
        lapItem.innerHTML = `
            <span class="lap-number">Lap ${lapCount}</span>
            <span class="lap-time">${hours}:${minutes}:${seconds}</span>
        `;
        
        lapTimesEl.prepend(lapItem);
    }
    
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            if (!stopwatchRunning) {
                stopwatchRunning = true;
                const startTime = Date.now() - (stopwatchTime * 1000);
                
                stopwatchTimer = setInterval(function() {
                    stopwatchTime = Math.floor((Date.now() - startTime) / 1000);
                    updateStopwatchDisplay();
                }, 100); // Update more frequently for smoother display
                
                toggleTimerActiveState(true, timerCircle);
            }
        });
    }
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', function() {
            stopwatchRunning = false;
            clearInterval(stopwatchTimer);
            toggleTimerActiveState(false, timerCircle);
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetStopwatch);
    }
    
    if (lapBtn) {
        lapBtn.addEventListener('click', recordLap);
    }
    
    // Initialize
    resetStopwatch();
}

// Countdown Timer
function initializeCountdown() {
    let countdownTimer;
    let countdownRunning = false;
    let countdownSeconds = 0;
    let totalCountdownSeconds = 0;
    
    const startBtn = document.getElementById('start-timer');
    const pauseBtn = document.getElementById('pause-timer');
    const resetBtn = document.getElementById('reset-timer');
    const display = document.getElementById('countdown-display');
    const timerProgress = document.getElementById('countdown-progress');
    const timerCircle = document.querySelector('#countdown-pane .timer-circle');
    
    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    
    function updateCountdownDisplay() {
        if (!display) return;
        
        const hours = Math.floor(countdownSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((countdownSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = Math.floor(countdownSeconds % 60).toString().padStart(2, '0');
        display.textContent = `${hours}:${minutes}:${seconds}`;
        
        if (timerProgress && totalCountdownSeconds > 0) {
            const percentComplete = ((totalCountdownSeconds - countdownSeconds) / totalCountdownSeconds) * 100;
            
            // Change color based on remaining time
            if (countdownSeconds < totalCountdownSeconds * 0.25) {
                // Last 25% - red
                timerProgress.style.background = `conic-gradient(
                    var(--danger-color) ${percentComplete}%, 
                    rgba(220, 53, 69, 0.1) ${percentComplete}%
                )`;
            } else if (countdownSeconds < totalCountdownSeconds * 0.5) {
                // 25%-50% - orange
                timerProgress.style.background = `conic-gradient(
                    var(--warning-color) ${percentComplete}%, 
                    rgba(255, 193, 7, 0.1) ${percentComplete}%
                )`;
            } else {
                // First 50% - blue
                timerProgress.style.background = `conic-gradient(
                    var(--primary-color) ${percentComplete}%, 
                    rgba(var(--primary-color-rgb), 0.1) ${percentComplete}%
                )`;
            }
        }
    }
    
    function resetCountdown() {
        countdownRunning = false;
        clearInterval(countdownTimer);
        countdownSeconds = 0;
        totalCountdownSeconds = 0;
        updateCountdownDisplay();
        
        // Reset inputs
        if (hoursInput) hoursInput.value = '0';
        if (minutesInput) minutesInput.value = '0';
        if (secondsInput) secondsInput.value = '0';
        
        // Reset progress
        if (timerProgress) {
            timerProgress.style.background = `conic-gradient(
                var(--primary-color) 0%, 
                rgba(var(--primary-color-rgb), 0.1) 0%
            )`;
        }
        
        toggleTimerActiveState(false, timerCircle);
    }
    
    function setCountdown() {
        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;
        const seconds = parseInt(secondsInput.value) || 0;
        
        countdownSeconds = (hours * 3600) + (minutes * 60) + seconds;
        totalCountdownSeconds = countdownSeconds;
        
        if (countdownSeconds <= 0) {
            showNotification('Please set a time greater than zero', 'warning');
            return false;
        }
        
        updateCountdownDisplay();
        return true;
    }
    
    function updateCountdown() {
        if (countdownSeconds > 0) {
            countdownSeconds--;
            updateCountdownDisplay();
            
            // Alert when 30 seconds remaining
            if (countdownSeconds === 30) {
                showNotification('30 seconds remaining', 'warning');
            }
        } else {
            countdownRunning = false;
            clearInterval(countdownTimer);
            playTimerCompleteSound();
            showNotification('Timer finished!', 'success');
            toggleTimerActiveState(false, timerCircle);
        }
    }
    
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            if (!countdownRunning) {
                if (countdownSeconds <= 0 && !setCountdown()) {
                    return;
                }
                
                countdownRunning = true;
                countdownTimer = setInterval(updateCountdown, 1000);
                toggleTimerActiveState(true, timerCircle);
            }
        });
    }
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', function() {
            countdownRunning = false;
            clearInterval(countdownTimer);
            toggleTimerActiveState(false, timerCircle);
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetCountdown);
    }
    
    // Initialize
    updateCountdownDisplay();
    
    // Add event listeners to inputs for immediate visual feedback
    if (hoursInput) hoursInput.addEventListener('input', function() {
        if (countdownRunning) return;
        setCountdown();
    });
    
    if (minutesInput) minutesInput.addEventListener('input', function() {
        if (countdownRunning) return;
        setCountdown();
    });
    
    if (secondsInput) secondsInput.addEventListener('input', function() {
        if (countdownRunning) return;
        setCountdown();
    });
}

// Helper function to toggle active state animation
function toggleTimerActiveState(isActive, timerCircle) {
    if (!timerCircle) return;
    
    if (isActive) {
        timerCircle.classList.add('timer-active');
    } else {
        timerCircle.classList.remove('timer-active');
    }
}

// Play timer complete sound
function playTimerCompleteSound() {
    try {
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3');
        audio.volume = 0.7; // Set volume to 70%
        audio.play().catch(e => console.log('Error playing sound:', e));
    } catch (error) {
        console.error('Unable to play sound:', error);
    }
}

// Render theme presets
function renderThemePresets() {
    console.log("Rendering theme presets");
    const themePanel = document.getElementById('theme-panel');
    if (!themePanel) {
        console.error("Theme panel not found");
        return;
    }

    // Create container for presets
    const presetsContainer = document.createElement('div');
    presetsContainer.className = 'theme-presets';

    // Add preset buttons
    themePresets.forEach(preset => {
        const presetButton = document.createElement('div');
        presetButton.className = 'theme-preset';
        presetButton.innerHTML = `
            <div class="preset-color" style="background-color: ${preset.color}"></div>
            <span class="preset-name">${preset.name}</span>
        `;

        presetButton.addEventListener('click', () => {
            applyThemeColor(preset.color);
            showNotification(`Theme changed to ${preset.name}`, 'success');
            themePanel.classList.remove('active');
        });

        presetsContainer.appendChild(presetButton);
    });

    // Create custom color picker container
    const customColorContainer = document.createElement('div');
    customColorContainer.className = 'custom-color-container';
    customColorContainer.innerHTML = `
        <label>Custom Color</label>
        <input type="color" id="custom-color" value="${localStorage.getItem('themeColor') || '#1e90ff'}">
    `;

    // Add event listener to custom color picker
    const customColorPicker = customColorContainer.querySelector('#custom-color');
    if (customColorPicker) {
        customColorPicker.addEventListener('input', function() {
            applyThemeColor(this.value);
            showNotification('Custom theme color applied', 'success');
        });
    }

    // Clear existing content and add new elements
    themePanel.innerHTML = '';
    themePanel.appendChild(presetsContainer);
    themePanel.appendChild(customColorContainer);
}

// Close AI Tool modal
function closeAiToolModal() {
    aiToolModal.style.display = 'none';
    // Reset form fields
    toolNameInput.value = '';
    toolUrlInput.value = '';
    toolDescInput.value = '';
    toolIconInput.value = '';
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    
    const icon = document.createElement('i');
    icon.classList.add('fas');
    
    // Set icon based on notification type
    switch(type) {
        case 'success':
            icon.classList.add('fa-check-circle');
            break;
        case 'warning':
            icon.classList.add('fa-exclamation-circle');
            break;
        case 'error':
            icon.classList.add('fa-times-circle');
            break;
        default:
            icon.classList.add('fa-info-circle');
    }
    
    const text = document.createElement('span');
    text.textContent = message;
    
    const closeBtn = document.createElement('i');
    closeBtn.classList.add('fas', 'fa-times', 'notification-close');
    
    notification.appendChild(icon);
    notification.appendChild(text);
    notification.appendChild(closeBtn);
    
    // Add to container
    const container = document.getElementById('notification-container');
    if (container) {
        container.appendChild(notification);
    } else {
        document.body.appendChild(notification);
    }
    
    // Show animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-hide after 5 seconds
    const hideTimeout = setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Close button functionality
    closeBtn.addEventListener('click', function() {
        clearTimeout(hideTimeout);
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Initialize new features
    initializeAITools();
    initializeTimers();
    
    // ... existing code ...
}); 