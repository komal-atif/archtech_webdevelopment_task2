let tempTasks = [];
let currentList = null;
const themes = ['theme-pink', 'theme-lavender', 'theme-peach', 'theme-mint', 'theme-sky', 'theme-rose', 'theme-lilac'];
const decorations = ['💖', '✨', '🌸', '💕', '🎀', '🌟', '💗', '🦋', '🌺', '💐'];

// Add task to temporary list
function addTempTask() {
    const input = document.getElementById('taskInput');
    const task = input.value.trim();
    
    if (task) {
        tempTasks.push(task);
        input.value = '';
        renderTempTasks();
    }
}

// Enter key to add task
document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTempTask();
});

// Render temporary tasks
function renderTempTasks() {
    const container = document.getElementById('tempTasksList');
    container.innerHTML = tempTasks.map((task, index) => `
        <div class="temp-task-item">
            <span>${task}</span>
            <button class="remove-temp-btn" onclick="removeTempTask(${index})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// Remove from temp list
function removeTempTask(index) {
    tempTasks.splice(index, 1);
    renderTempTasks();
}

// Create To-Do List
function createTodoList() {
    const listName = document.getElementById('listName').value.trim() || 'My To-Do List';
    
    if (tempTasks.length === 0) {
        alert('⚠️ Please add at least one task!');
        return;
    }

    currentList = {
        id: Date.now(),
        name: listName,
        tasks: tempTasks.map(task => ({ text: task, completed: false })),
        theme: themes[Math.floor(Math.random() * themes.length)],
        decorations: Array.from({length: 6}, () => decorations[Math.floor(Math.random() * decorations.length)]),
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };

    renderTodoBoard();
    
    // Clear inputs
    document.getElementById('listName').value = '';
    tempTasks = [];
    renderTempTasks();
}

// Render To-Do Board with random theme and decorations
function renderTodoBoard() {
    const board = document.getElementById('todoBoard');
    board.className = `todo-board ${currentList.theme}`;

    // Create floating decorations
    const floatingDecorations = currentList.decorations.map((deco, i) => {
        const positions = [
            { top: '5%', left: '3%', delay: '0s' },
            { top: '8%', right: '5%', delay: '2s' },
            { bottom: '15%', left: '8%', delay: '4s' },
            { bottom: '10%', right: '8%', delay: '1s' },
            { top: '45%', left: '2%', delay: '3s' },
            { top: '55%', right: '3%', delay: '5s' }
        ];
        const pos = positions[i];
        return `<div class="floating-board-element" style="top: ${pos.top || 'auto'}; right: ${pos.right || 'auto'}; bottom: ${pos.bottom || 'auto'}; left: ${pos.left || 'auto'}; animation-delay: ${pos.delay};">${deco}</div>`;
    }).join('');

    // Main decorations
    const mainDecorations = [
        { top: '10px', right: '15px' },
        { bottom: '10px', left: '15px' },
    ].map(pos => `
        <div class="board-decoration" style="top: ${pos.top || 'auto'}; right: ${pos.right || 'auto'}; bottom: ${pos.bottom || 'auto'}; left: ${pos.left || 'auto'};">
            ${currentList.decorations[0]}
        </div>
    `).join('');

    board.innerHTML = `
        ${mainDecorations}
        ${floatingDecorations}
        
        <div class="board-header">
            <div class="board-title">${currentList.name}</div>
            <div class="board-date"><i class="far fa-calendar"></i> ${currentList.date}</div>
        </div>

        <div class="tasks-container">
            ${currentList.tasks.length === 0 ? '<div class="empty-state"><i class="fas fa-clipboard-list"></i><h2>No tasks yet!</h2><p>Add some tasks to get started.</p></div>' : currentList.tasks.map((task, index) => `
                <div class="task-item">
                    <input type="checkbox" class="task-checkbox" 
                           ${task.completed ? 'checked' : ''} 
                           onchange="toggleTask(${index})">
                    <span class="task-text ${task.completed ? 'completed' : ''}">
                        ${task.text}
                    </span>
                    <div class="task-actions">
                        <button class="task-btn edit-btn" onclick="editTask(${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="task-btn delete-btn" onclick="deleteTask(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="board-footer">
            <button class="footer-btn save-btn" onclick="saveList()">
                <i class="fas fa-save"></i> Save List
            </button>
            <button class="footer-btn share-btn" onclick="shareListAsImage()">
                <i class="fas fa-share-alt"></i> Share Image
            </button>
        </div>
    `;
}

// Toggle task completion
function toggleTask(index) {
    currentList.tasks[index].completed = !currentList.tasks[index].completed;
    renderTodoBoard();
}

// Edit task
function editTask(index) {
    const newText = prompt('✏️ Edit task:', currentList.tasks[index].text);
    if (newText && newText.trim()) {
        currentList.tasks[index].text = newText.trim();
        renderTodoBoard();
    }
}

// Delete task
function deleteTask(index) {
    if (confirm('🗑️ Delete this task?')) {
        currentList.tasks.splice(index, 1);
        renderTodoBoard();
    }
}

// Save list
function saveList() {
    const savedLists = JSON.parse(localStorage.getItem('todoLists') || '[]');
    const existingIndex = savedLists.findIndex(list => list.id === currentList.id);
    
    if (existingIndex !== -1) {
        savedLists[existingIndex] = currentList;
    } else {
        savedLists.push(currentList);
    }
    
    localStorage.setItem('todoLists', JSON.stringify(savedLists));
    
    // Success animation
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
    btn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = 'linear-gradient(135deg, #c44bdb, #ff8ab4)';
    }, 1500);
}

// Open saved lists modal
function openSavedLists() {
    const modal = document.getElementById('savedListsModal');
    const container = document.getElementById('savedListsContainer');
    const savedLists = JSON.parse(localStorage.getItem('todoLists') || '[]');
    
    if (savedLists.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #ccc; padding: 40px; font-size: 1.1rem;">📭 No saved lists yet!</p>';
    } else {
        container.innerHTML = savedLists.map((list) => `
            <div class="saved-list-item" onclick="loadList(${list.id})">
                <button class="delete-saved-btn" onclick="event.stopPropagation(); deleteSavedList(${list.id})">
                    <i class="fas fa-trash"></i>
                </button>
                <h3><i class="fas fa-list-check"></i> ${list.name}</h3>
                <p><i class="fas fa-tasks"></i> ${list.tasks.length} tasks • <i class="far fa-calendar"></i> ${list.date}</p>
            </div>
        `).join('');
    }
    
    modal.classList.add('active');
}

// Close saved lists modal
function closeSavedLists() {
    document.getElementById('savedListsModal').classList.remove('active');
}

// Load saved list
function loadList(id) {
    const savedLists = JSON.parse(localStorage.getItem('todoLists') || '[]');
    currentList = savedLists.find(list => list.id === id);
    
    if (currentList) {
        renderTodoBoard();
        closeSavedLists();
    }
}

// Delete saved list
function deleteSavedList(id) {
    if (confirm('🗑️ Delete this saved list permanently?')) {
        let savedLists = JSON.parse(localStorage.getItem('todoLists') || '[]');
        savedLists = savedLists.filter(list => list.id !== id);
        localStorage.setItem('todoLists', JSON.stringify(savedLists));
        
        // If deleted list is currently displayed, clear it
        if (currentList && currentList.id === id) {
            currentList = null;
            document.getElementById('todoBoard').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h2>Your To-Do List Will Appear Here</h2>
                    <p>Start by adding tasks on the left!</p>
                </div>
            `;
        }
        
        openSavedLists();
    }
}

// Share list as image (Optimized for WhatsApp sharing)
async function shareListAsImage() {
    if (!currentList || currentList.tasks.length === 0) {
        alert('Please create a list with tasks first!');
        return;
    }
    
    try {
        // Create a temporary container for capturing
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'fixed';
        tempContainer.style.top = '-9999px';
        tempContainer.style.left = '-9999px';
        tempContainer.style.width = '800px';
        tempContainer.style.background = '#fff';
        tempContainer.style.borderRadius = '30px';
        tempContainer.style.boxShadow = '0 25px 70px rgba(196, 75, 219, 0.25)';
        tempContainer.style.overflow = 'hidden';
        
        // Get the current theme gradient
        const board = document.getElementById('todoBoard');
        const currentTheme = board.classList[1] || 'theme-pink';
        const themeGradients = {
            'theme-pink': 'linear-gradient(135deg, #ffd4f0 0%, #ffe5f8 100%)',
            'theme-lavender': 'linear-gradient(135deg, #e5d4ff 0%, #f0e5ff 100%)',
            'theme-peach': 'linear-gradient(135deg, #ffd9e5 0%, #ffe8f0 100%)',
            'theme-mint': 'linear-gradient(135deg, #d4ffe5 0%, #e5fff0 100%)',
            'theme-sky': 'linear-gradient(135deg, #d4e5ff 0%, #e5f0ff 100%)',
            'theme-rose': 'linear-gradient(135deg, #ffe0f0 0%, #ffebf5 100%)',
            'theme-lilac': 'linear-gradient(135deg, #e8d4ff 0%, #f3e5ff 100%)'
        };
        
        const gradient = themeGradients[currentTheme] || themeGradients['theme-pink'];
        
        // Create the list content
        const tasksHTML = currentList.tasks.map((task, index) => `
            <div style="
                background: rgba(255, 255, 255, 0.9);
                border: 2px solid rgba(196, 75, 219, 0.2);
                border-radius: 18px;
                padding: 18px 20px;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 12px;
            ">
                <div style="
                    width: 22px;
                    height: 22px;
                    border: 2px solid ${task.completed ? '#c44bdb' : '#ccc'};
                    border-radius: 5px;
                    background: ${task.completed ? '#c44bdb' : 'transparent'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 12px;
                ">
                    ${task.completed ? '✓' : ''}
                </div>
                <span style="
                    flex: 1;
                    font-size: 1.1rem;
                    color: ${task.completed ? '#999' : '#333'};
                    ${task.completed ? 'text-decoration: line-through;' : ''}
                ">
                    ${task.text}
                </span>
            </div>
        `).join('');
        
        tempContainer.innerHTML = `
            <div style="
                background: ${gradient};
                padding: 35px;
                height: 100%;
                min-height: 600px;
                display: flex;
                flex-direction: column;
            ">
                <div style="
                    text-align: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 3px dashed rgba(196, 75, 219, 0.3);
                ">
                    <h1 style="
                        font-size: 2.2rem;
                        font-weight: 800;
                        background: linear-gradient(135deg, #c44bdb, #ff6b9d);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin-bottom: 8px;
                    ">
                        ${currentList.name}
                    </h1>
                    <p style="
                        color: #999;
                        font-size: 1rem;
                        font-weight: 500;
                    ">
                        <i class="far fa-calendar"></i> ${currentList.date}
                    </p>
                </div>
                
                <div style="
                    flex: 1;
                    overflow-y: auto;
                    padding: 10px 5px;
                    margin-bottom: 20px;
                ">
                    ${tasksHTML}
                </div>
                
                <div style="
                    text-align: center;
                    padding-top: 20px;
                    border-top: 3px dashed rgba(196, 75, 219, 0.2);
                    color: #666;
                    font-size: 0.85rem;
                ">
                    <p style="margin-bottom: 5px;">✨ Created with Pink To-Do List ✨</p>
                    <p>📱 Perfect for sharing on WhatsApp!</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(tempContainer);
        
        // Wait for rendering
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const canvas = await html2canvas(tempContainer, {
            backgroundColor: null,
            scale: 2,
            logging: false,
            useCORS: true,
            width: 800,
            height: tempContainer.scrollHeight,
            windowWidth: 800,
            windowHeight: tempContainer.scrollHeight
        });
        
        document.body.removeChild(tempContainer);
        
        // Convert to blob and create download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${currentList.name.replace(/\s+/g, '-')}-todo-list.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            // Success message
            alert('✅ Image downloaded successfully! You can now share it on WhatsApp or any other platform. The image contains all your tasks with the same beautiful design!');
        }, 'image/png', 1.0);
        
    } catch (err) {
        console.error('Error creating image:', err);
        alert('❌ Error creating image. Please try again or check the console for details.');
    }
}

// Close modal when clicking outside
document.getElementById('savedListsModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeSavedLists();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved lists
    const savedLists = JSON.parse(localStorage.getItem('todoLists') || '[]');
    if (savedLists.length > 0) {
        console.log(`${savedLists.length} saved lists found.`);
    }
});