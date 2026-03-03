// Users array - starts empty, backend will populate this later
let users = [];

let currentPage = 1;
let rowsPerPage = 10;
let filteredUsers = [...users];

// Sidebar Toggle
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');

    if (sidebar && sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }
}

// Navigation - Initialize after DOM is ready
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    if (navItems.length === 0 || contentSections.length === 0) {
        console.warn('Navigation elements not found');
        return;
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Hide all sections
            contentSections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show selected section
            const sectionName = item.getAttribute('data-section');
            const targetSection = document.getElementById(`${sectionName}-section`);
            if (targetSection) {
                targetSection.style.display = 'block';
            } else {
                console.warn(`Section not found: ${sectionName}-section`);
            }
        });
    });
}

// Password Toggle
function initializePasswordToggle() {
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');

    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
}

// Initialize User Table
// function initializeUserTable() {
//     renderUserTable();
// }

// Render User Table
// function renderUserTable() {
//     const tbody = document.getElementById('userTableBody');
//     if (!tbody) return;
    
//     const start = (currentPage - 1) * rowsPerPage;
//     const end = start + rowsPerPage;
//     const pageUsers = filteredUsers.slice(start, end);
    
//     tbody.innerHTML = '';
    
//     pageUsers.forEach((user, index) => {
//         const row = document.createElement('tr');
//         const userNumber = start + index + 1;
        
//         row.innerHTML = `
//             <td>${userNumber}</td>
//             <td>
//                 <div class="profile-cell">
//                     <div class="profile-avatar">
//                         <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff&size=128" alt="${user.name}">
//                     </div>
//                     <span class="profile-name">${user.name}</span>
//                 </div>
//             </td>
//             <td>${user.email}</td>
//             <td><span class="role-badge">${user.role}</span></td>
//             <td>
//                 <div class="action-buttons">
//                     <button class="btn-edit" onclick="editUser(${user.id})">
//                         <i class="fas fa-pencil-alt"></i>
//                         Edit
//                     </button>
//                     <button class="btn-delete" onclick="deleteUser(${user.id})">
//                         <i class="fas fa-trash"></i>
//                         Delete
//                     </button>
//                 </div>
//             </td>
//         `;
        
//         tbody.appendChild(row);
//     });
    
//     updatePagination();
// }

// Update Pagination
function updatePagination() {
    const totalItems = filteredUsers.length;

    let start = 0;
    let end = 0;

    if (totalItems > 0) {
        start = (currentPage - 1) * rowsPerPage + 1;
        end = Math.min(currentPage * rowsPerPage, totalItems);
    }

    const paginationText = document.getElementById('paginationText');
    if (paginationText) {
        paginationText.textContent = `${start}-${end} of ${totalItems} items`;
    }
    
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    if (nextBtn) {
        const totalPages = Math.ceil(totalItems / rowsPerPage);
        nextBtn.disabled = currentPage >= totalPages;
    }
}

// Change Page
function changePage(direction) {
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderUserTable();
    }
}

// Change Rows Per Page
function changeRowsPerPage() {
    const select = document.getElementById('rowsPerPage');
    if (select) {
        rowsPerPage = parseInt(select.value);
        currentPage = 1;
        renderUserTable();
    }
}

// Filter Users
function filterUsers() {
    const searchInput = document.getElementById('searchUser');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredUsers = [...users];
    } else {
        filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.role.toString().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    renderUserTable();
}

// Show Create User Section
function showCreateUser() {
    navItems.forEach(nav => nav.classList.remove('active'));
    contentSections.forEach(section => section.style.display = 'none');
    
    const createUserNav = document.querySelector('[data-section="create-user"]');
    const createUserSection = document.getElementById('create-user-section');
    
    if (createUserNav) createUserNav.classList.add('active');
    if (createUserSection) createUserSection.style.display = 'block';
}

// Edit User
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        alert(`Edit user: ${user.name}\nThis functionality can be implemented to open an edit modal or form.`);
        // You can implement edit functionality here
    }
}

// Delete User
function deleteUser(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            users = users.filter(u => u.id !== userId);
            filteredUsers = filteredUsers.filter(u => u.id !== userId);
            renderUserTable();
        }
    }
}

// Form Submission
// const createUserForm = document.getElementById('createUserForm');
// if (createUserForm) {
//     createUserForm.addEventListener('submit', (e) => {
//         e.preventDefault();
        
//         const formData = new FormData(createUserForm);
//         const username = formData.get('username');
//         const email = formData.get('email');
//         const designation = formData.get('designation');
        
//         // Create new user object
//         const newUser = {
//             id: users.length + 1,
//             name: username,
//             email: email,
//             role: designation
//         };
        
//         // Add to users array
//         users.push(newUser);
//         filteredUsers = [...users];
        
//         // Reset form
//         createUserForm.reset();
        
//         // Switch to manage users section
//         showManageUsers();
        
//         // Show success message
//         alert('User created successfully!');
//     });
// }

// Show Manage Users Section
function showManageUsers() {
    navItems.forEach(nav => nav.classList.remove('active'));
    contentSections.forEach(section => section.style.display = 'none');
    
    const manageUsersNav = document.querySelector('[data-section="manage-users"]');
    const manageUsersSection = document.getElementById('manage-users-section');
    
    if (manageUsersNav) manageUsersNav.classList.add('active');
    if (manageUsersSection) {
        manageUsersSection.style.display = 'block';
        renderUserTable();
    }
}

// Toggle Select All
function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.row-checkbox');
    
    if (selectAll) {
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAll.checked;
            toggleRowSelection(checkbox);
        });
    }
}

// Toggle Row Selection
function toggleRowSelection(checkbox) {
    const row = checkbox.closest('tr');
    if (checkbox.checked) {
        row.classList.add('selected');
    } else {
        row.classList.remove('selected');
        // Uncheck select all if this row is unchecked
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.checked = false;
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    initializeNavigation();
    initializePasswordToggle();
    // initializeUserTable();
});
