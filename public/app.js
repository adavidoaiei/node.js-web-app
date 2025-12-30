// DOM Elements
const usersList = document.getElementById('usersList');
const addUserForm = document.getElementById('addUserForm');
const editUserForm = document.getElementById('editUserForm');
const editModal = document.getElementById('editModal');

// Load users when page loads
document.addEventListener('DOMContentLoaded', loadUsers);

// Add event listeners
addUserForm.addEventListener('submit', handleAddUser);
editUserForm.addEventListener('submit', handleEditUser);

// Load all users
async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        showError('Failed to load users');
    }
}

// Display users in the list
function displayUsers(users) {
    usersList.innerHTML = users.map(user => `
        <div class="user-card">
            <div class="user-info">
                <strong>${user.name}</strong><br>
                ${user.email}
            </div>
            <div class="user-actions">
                <button class="btn" onclick="openEditModal(${user.id}, '${user.name}', '${user.email}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteUser(${user.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Handle adding a new user
async function handleAddUser(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email }),
        });

        if (!response.ok) {
            alert(response.message);
            throw new Error('Failed to add user');
        }

        addUserForm.reset();
        loadUsers();
    } catch (error) {
        alert(error.message);
        showError('Failed to add user');
    }
}

// Open edit modal
function openEditModal(id, name, email) {
    document.getElementById('editUserId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editEmail').value = email;
    editModal.style.display = 'block';
}

// Close edit modal
function closeModal() {
    editModal.style.display = 'none';
}

// Handle editing a user
async function handleEditUser(e) {
    e.preventDefault();
    const id = document.getElementById('editUserId').value;
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;

    try {
        const response = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email }),
        });

        if (!response.ok) {
            throw new Error('Failed to update user');
        }

        closeModal();
        loadUsers();
    } catch (error) {
        showError('Failed to update user');
    }
}

// Delete a user
async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    try {
        const response = await fetch(`/api/users/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete user');
        }

        loadUsers();
    } catch (error) {
        showError('Failed to delete user');
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(errorDiv, container.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}
