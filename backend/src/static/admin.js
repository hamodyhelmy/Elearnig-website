// Global variables
let currentSection = 'dashboard';
let users = [];
let courses = [];
let enrollments = [];
let stats = {};

// Check admin access
async function checkAdminAccess() {
    try {
        const response = await fetch('/api/auth/admin-check');
        const data = await response.json();
        
        if (!data.is_admin) {
            document.getElementById('adminCheckModal').classList.remove('hidden');
            return false;
        }
        
        // Load initial data
        await loadDashboardData();
        return true;
    } catch (error) {
        console.error('Admin check failed:', error);
        document.getElementById('adminCheckModal').classList.remove('hidden');
        return false;
    }
}

// Notify main window about course changes
function notifyMainWindow() {
    try {
        // Try to notify parent window if opened as popup
        if (window.opener && !window.opener.closed) {
            window.opener.postMessage({ type: 'COURSES_UPDATED' }, '*');
        }
        
        // Also try to notify any other windows
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'COURSES_UPDATED' }, '*');
        }
    } catch (error) {
        console.log('Could not notify main window:', error);
    }
}

// Redirect to home page
function redirectToHome() {
    window.location.href = '/';
}

// Show section
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(el => el.classList.add('hidden'));
    
    // Remove active class from all nav items
    document.querySelectorAll('[id^="nav-"]').forEach(el => el.classList.remove('bg-blue-700'));
    
    // Show selected section
    document.getElementById(`${section}-section`).classList.remove('hidden');
    document.getElementById(`nav-${section}`).classList.add('bg-blue-700');
    
    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'users': 'User Management',
        'courses': 'Course Management',
        'enrollments': 'Enrollment Management'
    };
    document.getElementById('page-title').textContent = titles[section];
    
    currentSection = section;
    
    // Load section-specific data
    switch(section) {
        case 'users':
            loadUsers();
            break;
        case 'courses':
            loadCourses();
            break;
        case 'enrollments':
            loadEnrollments();
            break;
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        
        stats = data;
        
        // Update stats cards
        document.getElementById('total-users').textContent = data.total_users;
        document.getElementById('total-courses').textContent = data.total_courses;
        document.getElementById('total-enrollments').textContent = data.total_enrollments;
        document.getElementById('total-revenue').textContent = `$${data.total_revenue.toFixed(2)}`;
        
        // Update recent enrollments
        const recentContainer = document.getElementById('recent-enrollments');
        if (data.recent_enrollments && data.recent_enrollments.length > 0) {
            recentContainer.innerHTML = data.recent_enrollments.map(enrollment => `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                        <p class="font-medium text-gray-900">${enrollment.user?.username || 'Unknown User'}</p>
                        <p class="text-sm text-gray-500">${enrollment.course?.title || 'Unknown Course'}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm font-medium text-green-600">$${enrollment.course?.price || 0}</p>
                        <p class="text-xs text-gray-500">${new Date(enrollment.enrolled_at).toLocaleDateString()}</p>
                    </div>
                </div>
            `).join('');
        } else {
            recentContainer.innerHTML = '<p class="text-gray-500">No recent enrollments</p>';
        }
        
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

// Load users
async function loadUsers() {
    try {
        const response = await fetch('/api/admin/users');
        const data = await response.json();
        
        users = data.users;
        
        const tableBody = document.getElementById('users-table');
        tableBody.innerHTML = users.map(user => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                ${user.username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${user.username}</div>
                            ${user.is_admin ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Admin</span>' : ''}
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.email}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.enrollment_count}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(user.created_at).toLocaleDateString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ${!user.is_admin ? `
                        <button onclick="deleteUser(${user.id})" class="text-red-600 hover:text-red-900 transition-colors">
                            <i data-lucide="trash-2" class="h-4 w-4"></i>
                        </button>
                    ` : '<span class="text-gray-400">Protected</span>'}
                </td>
            </tr>
        `).join('');
        
        // Re-initialize Lucide icons
        lucide.createIcons();
        
    } catch (error) {
        console.error('Failed to load users:', error);
    }
}

// Load courses
async function loadCourses() {
    try {
        const response = await fetch('/api/admin/courses');
        const data = await response.json();
        
        courses = data.courses;
        
        const tableBody = document.getElementById('courses-table');
        tableBody.innerHTML = courses.map(course => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <img class="h-10 w-10 rounded object-cover" src="${course.image}" alt="${course.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyNkMyMyAyNiAyNS41IDIzLjUgMjUuNSAyMC41QzI1LjUgMTcuNSAyMyAxNSAyMCAxNUMxNyAxNSAxNC41IDE3LjUgMTQuNSAyMC41QzE0LjUgMjMuNSAxNyAyNiAyMCAyNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg=='">
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${course.title}</div>
                            <div class="text-sm text-gray-500">${course.instructor}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        ${course.category.replace('-', ' ')}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${course.level}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$${course.price}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${course.enrollment_count}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="deleteCourse(${course.id})" class="text-red-600 hover:text-red-900 transition-colors">
                        <i data-lucide="trash-2" class="h-4 w-4"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        // Re-initialize Lucide icons
        lucide.createIcons();
        
    } catch (error) {
        console.error('Failed to load courses:', error);
    }
}

// Load enrollments
async function loadEnrollments() {
    try {
        const response = await fetch('/api/admin/enrollments');
        const data = await response.json();
        
        enrollments = data.enrollments;
        
        const tableBody = document.getElementById('enrollments-table');
        tableBody.innerHTML = enrollments.map(enrollment => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${enrollment.user?.username || 'Unknown User'}</div>
                    <div class="text-sm text-gray-500">${enrollment.user?.email || 'No email'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${enrollment.course?.title || 'Unknown Course'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${enrollment.course?.instructor || 'Unknown'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$${enrollment.course?.price || 0}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(enrollment.enrolled_at).toLocaleDateString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="deleteEnrollment(${enrollment.id})" class="text-red-600 hover:text-red-900 transition-colors">
                        <i data-lucide="trash-2" class="h-4 w-4"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        // Re-initialize Lucide icons
        lucide.createIcons();
        
    } catch (error) {
        console.error('Failed to load enrollments:', error);
    }
}

// Delete user
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This will also remove all their enrollments.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadUsers();
            await loadDashboardData();
            showNotification('User deleted successfully', 'success');
        } else {
            const error = await response.json();
            showNotification(error.error || 'Failed to delete user', 'error');
        }
    } catch (error) {
        console.error('Failed to delete user:', error);
        showNotification('Failed to delete user', 'error');
    }
}

// Delete course
async function deleteCourse(courseId) {
    if (!confirm('Are you sure you want to delete this course? This will also remove all enrollments for this course.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/courses/${courseId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadCourses();
            await loadDashboardData();
            notifyMainWindow(); // Notify main window about course changes
            showNotification('Course deleted successfully', 'success');
        } else {
            const error = await response.json();
            showNotification(error.error || 'Failed to delete course', 'error');
        }
    } catch (error) {
        console.error('Failed to delete course:', error);
        showNotification('Failed to delete course', 'error');
    }
}

// Delete enrollment
async function deleteEnrollment(enrollmentId) {
    if (!confirm('Are you sure you want to remove this enrollment?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadEnrollments();
            await loadDashboardData();
            showNotification('Enrollment removed successfully', 'success');
        } else {
            const error = await response.json();
            showNotification(error.error || 'Failed to remove enrollment', 'error');
        }
    } catch (error) {
        console.error('Failed to remove enrollment:', error);
        showNotification('Failed to remove enrollment', 'error');
    }
}

// Show add course modal
function showAddCourseModal() {
    document.getElementById('addCourseModal').classList.remove('hidden');
}

// Hide add course modal
function hideAddCourseModal() {
    document.getElementById('addCourseModal').classList.add('hidden');
    document.getElementById('addCourseForm').reset();
}

// Add course form submission
document.getElementById('addCourseForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('courseTitle').value,
        instructor: document.getElementById('courseInstructor').value,
        description: document.getElementById('courseDescription').value,
        category: document.getElementById('courseCategory').value,
        level: document.getElementById('courseLevel').value,
        price: parseFloat(document.getElementById('coursePrice').value),
        duration: document.getElementById('courseDuration').value,
        image: document.getElementById('courseImage').value
    };
    
    try {
        const response = await fetch('/api/admin/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            hideAddCourseModal();
            await loadCourses();
            await loadDashboardData();
            notifyMainWindow(); // Notify main window about course changes
            showNotification('Course added successfully', 'success');
        } else {
            const error = await response.json();
            showNotification(error.error || 'Failed to add course', 'error');
        }
    } catch (error) {
        console.error('Failed to add course:', error);
        showNotification('Failed to add course', 'error');
    }
});

// Refresh data
async function refreshData() {
    await loadDashboardData();
    
    switch(currentSection) {
        case 'users':
            await loadUsers();
            break;
        case 'courses':
            await loadCourses();
            break;
        case 'enrollments':
            await loadEnrollments();
            break;
    }
    
    showNotification('Data refreshed successfully', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Set dashboard as active by default
    showSection('dashboard');
});

