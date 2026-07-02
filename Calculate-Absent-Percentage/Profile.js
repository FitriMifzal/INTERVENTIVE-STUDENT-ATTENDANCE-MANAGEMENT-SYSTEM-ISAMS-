/* ============================================================
   PROFILE.JS — Profile page logic
   Version: Flexible - Ready for Database Connection
   Data source: localStorage (staging) → Database (production)
   ============================================================ */

// ============================================================
// CONFIGURATION - Ubah sini bila nak connect database
// ============================================================
const PROFILE_CONFIG = {
    // Data source: 'localStorage' atau 'api'
    dataSource: 'localStorage',
    
    // API endpoints (untuk database connection nanti)
    api: {
        getProfile: '/api/profile/get',
        updateProfile: '/api/profile/update',
        changePassword: '/api/profile/change-password'
    }
};

// ============================================================
// STATE MANAGEMENT
// ============================================================
let profileData = {
    id: '',
    ic: '',
    name: '',
    email: '',
    phone: '',
    role: ''
};

let isEditing = false;

// ============================================================
// PAGE INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = "../login.html";
        return;
    }

    // Load profile data
    loadProfileData();
    updateUI();
});

// ============================================================
// DATA LOADING - FLEXIBLE (localStorage OR API)
// ============================================================
function loadProfileData() {
    if (PROFILE_CONFIG.dataSource === 'api') {
        // === DATABASE MODE ===
        fetchProfileFromAPI();
    } else {
        // === LOCAL STORAGE MODE (STAGING) ===
        loadProfileFromLocalStorage();
    }
}

// --- LOCAL STORAGE MODE (Staging) ---
function loadProfileFromLocalStorage() {
    profileData = {
        id: localStorage.getItem('reg_id') || 'N/A',
        ic: localStorage.getItem('reg_ic') || 'N/A',
        name: localStorage.getItem('reg_name') || 'User Name',
        email: localStorage.getItem('reg_email') || '',
        phone: localStorage.getItem('reg_phone') || '',
        role: localStorage.getItem('reg_role') || 'Subject Teacher'
    };
    
    renderProfile();
    updateUI();
}

// --- API MODE (Production - Ready to use) ---
function fetchProfileFromAPI() {
    // Show loading state
    showLoading(true);
    
    fetch(PROFILE_CONFIG.api.getProfile, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + (localStorage.getItem('token') || ''),
            'Content-Type': 'application/json'
        }
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }
        return response.json();
    })
    .then(function(data) {
        if (data.success) {
            profileData = {
                id: data.data.id || 'N/A',
                ic: data.data.ic || 'N/A',
                name: data.data.name || 'User Name',
                email: data.data.email || '',
                phone: data.data.phone || '',
                role: data.data.role || 'Subject Teacher'
            };
            
            renderProfile();
            updateUI();
            
            // Also sync to localStorage for caching
            syncToLocalStorage(profileData);
        } else {
            throw new Error(data.message || 'Failed to load profile');
        }
    })
    .catch(function(error) {
        console.error('Error loading profile:', error);
        // Fallback to localStorage if API fails
        loadProfileFromLocalStorage();
        showToast('Using cached profile data');
    })
    .finally(function() {
        showLoading(false);
    });
}

// ============================================================
// SYNC FUNCTIONS
// ============================================================
function syncToLocalStorage(data) {
    localStorage.setItem('reg_id', data.id);
    localStorage.setItem('reg_ic', data.ic);
    localStorage.setItem('reg_name', data.name);
    localStorage.setItem('reg_email', data.email);
    localStorage.setItem('reg_phone', data.phone);
    localStorage.setItem('active_name', data.name);
    localStorage.setItem('reg_role', data.role);
}

// ============================================================
// RENDER FUNCTIONS
// ============================================================
function renderProfile() {
    // Fill form fields
    setValue('profName', profileData.name);
    setValue('profID', profileData.id);
    setValue('profIC', profileData.ic);
    setValue('profEmail', profileData.email);
    setValue('profPhone', profileData.phone);
    setValue('profRole', profileData.role);

    // Update display fields
    document.getElementById('profileDisplayName').textContent = profileData.name;
    document.getElementById('profileDisplayRole').textContent = profileData.role;
    document.getElementById('profileDisplayID').textContent = profileData.id;

    // Update header
    var userNameEl = document.getElementById('user-fullname');
    if (userNameEl) {
        userNameEl.textContent = profileData.name;
    }

    // Update avatar
    updateAvatar(profileData.name);
}

function updateUI() {
    // Reset edit mode
    if (isEditing) {
        disableEdit();
    }
}

function setValue(elementId, value) {
    var el = document.getElementById(elementId);
    if (el) el.value = value || '';
}

// ============================================================
// AVATAR FUNCTIONS
// ============================================================
function updateAvatar(name) {
    var initials = getInitials(name);
    
    var avatarEl = document.getElementById('profileAvatar');
    if (avatarEl) {
        avatarEl.textContent = initials || '?';
    }

    var headerInitial = document.getElementById('user-initial');
    if (headerInitial) {
        headerInitial.textContent = initials || '?';
    }
}

function getInitials(name) {
    if (!name) return '?';
    return name
        .split(' ')
        .map(function(word) { 
            return word.charAt(0).toUpperCase(); 
        })
        .join('')
        .substring(0, 2);
}

// ============================================================
// EDIT MODE FUNCTIONS
// ============================================================
function enableEdit() {
    isEditing = true;
    
    var editableInputs = document.querySelectorAll('.profile-input');
    editableInputs.forEach(function(input) {
        input.disabled = false;
        input.classList.add('editable');
    });

    toggleButtons('edit', false);
    toggleButtons('back', false);
    toggleButtons('save', true);
    toggleButtons('cancel', true);
}

function disableEdit() {
    isEditing = false;
    
    var editableInputs = document.querySelectorAll('.profile-input');
    editableInputs.forEach(function(input) {
        input.disabled = true;
        input.classList.remove('editable');
    });

    toggleButtons('edit', true);
    toggleButtons('back', true);
    toggleButtons('save', false);
    toggleButtons('cancel', false);
    
    // Reload data (reset changes)
    loadProfileData();
}

function toggleButtons(buttonId, show) {
    var btnMap = {
        'edit': 'btn-edit-profile',
        'back': 'btn-back-profile',
        'save': 'btn-save-profile',
        'cancel': 'btn-cancel-profile'
    };
    
    var el = document.getElementById(btnMap[buttonId]);
    if (el) {
        el.style.display = show ? 'inline-flex' : 'none';
    }
}

// ============================================================
// UPDATE PROFILE - Flexible (localStorage OR API)
// ============================================================
function updateProfile() {
    // Get updated values
    var name = getValue('profName');
    var email = getValue('profEmail');
    var phone = getValue('profPhone');
    
    // Validation
    if (!validateProfile(name, email, phone)) {
        return;
    }

    // Update local profileData
    profileData.name = name;
    profileData.email = email;
    profileData.phone = phone;

    if (PROFILE_CONFIG.dataSource === 'api') {
        // === DATABASE MODE ===
        updateProfileToAPI(profileData);
    } else {
        // === LOCAL STORAGE MODE (Staging) ===
        updateProfileToLocalStorage(profileData);
    }
}

// --- LOCAL STORAGE MODE (Staging) ---
function updateProfileToLocalStorage(data) {
    // Save to localStorage
    localStorage.setItem('reg_name', data.name);
    localStorage.setItem('reg_email', data.email);
    localStorage.setItem('reg_phone', data.phone);
    localStorage.setItem('active_name', data.name);

    // Update display
    document.getElementById('profileDisplayName').textContent = data.name;
    
    // Update header
    var userNameEl = document.getElementById('user-fullname');
    if (userNameEl) {
        userNameEl.textContent = data.name;
    }
    
    // Update avatar
    updateAvatar(data.name);

    showToast('Profile updated successfully');
    disableEdit();
}

// --- API MODE (Production - Ready to use) ---
function updateProfileToAPI(data) {
    showLoading(true);
    
    fetch(PROFILE_CONFIG.api.updateProfile, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + (localStorage.getItem('token') || ''),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone
        })
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        return response.json();
    })
    .then(function(result) {
        if (result.success) {
            // Sync to localStorage
            syncToLocalStorage(data);
            
            // Update display
            document.getElementById('profileDisplayName').textContent = data.name;
            var userNameEl = document.getElementById('user-fullname');
            if (userNameEl) {
                userNameEl.textContent = data.name;
            }
            updateAvatar(data.name);

            showToast('Profile updated successfully');
            disableEdit();
        } else {
            throw new Error(result.message || 'Update failed');
        }
    })
    .catch(function(error) {
        console.error('Error updating profile:', error);
        showToast('Failed to update profile: ' + error.message);
    })
    .finally(function() {
        showLoading(false);
    });
}

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================
function validateProfile(name, email, phone) {
    if (!name || !email || !phone) {
        showToast('Please fill all required fields');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address');
        return false;
    }
    
    if (!isValidPhone(phone)) {
        showToast('Please enter a valid phone number');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function isValidPhone(phone) {
    var regex = /^(\+?6?01[0-9]{8,9}|0[0-9]{9,10})$/;
    return regex.test(phone.replace(/[\s\-()]/g, ''));
}

// ============================================================
// CHANGE PASSWORD (Ready for database)
// ============================================================
function changePassword(oldPassword, newPassword, confirmPassword) {
    if (!oldPassword || !newPassword || !confirmPassword) {
        showToast('Please fill all password fields');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showToast('New passwords do not match');
        return;
    }
    
    if (newPassword.length < 6) {
        showToast('Password must be at least 6 characters');
        return;
    }
    
    if (PROFILE_CONFIG.dataSource === 'api') {
        // Database mode
        fetch(PROFILE_CONFIG.api.changePassword, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || ''),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                oldPassword: oldPassword,
                newPassword: newPassword
            })
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Failed to change password');
            }
            return response.json();
        })
        .then(function(result) {
            if (result.success) {
                showToast('Password changed successfully');
                closeModal('passwordModal');
            } else {
                throw new Error(result.message || 'Password change failed');
            }
        })
        .catch(function(error) {
            console.error('Error changing password:', error);
            showToast('Failed to change password: ' + error.message);
        });
    } else {
        // Local storage mode (staging)
        localStorage.setItem('reg_password', newPassword);
        showToast('Password changed successfully');
        closeModal('passwordModal');
    }
}

// ============================================================
// TOAST / NOTIFICATION
// ============================================================
function showToast(message) {
    var toast = document.getElementById('toast');
    if (!toast) {
        // Create toast if not exists
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================================
// LOADING STATE
// ============================================================
function showLoading(show) {
    var loader = document.getElementById('loadingOverlay');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loadingOverlay';
        loader.className = 'loading-overlay';
        loader.innerHTML = '<div class="loader-spinner"></div>';
        document.body.appendChild(loader);
    }
    loader.style.display = show ? 'flex' : 'none';
}

// ============================================================
// MODAL FUNCTIONS
// ============================================================
function openModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// ============================================================
// NAVIGATION
// ============================================================
function goBack() {
    window.history.back();
}

function confirmLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear all storage
        localStorage.clear();
        sessionStorage.clear();
        
        // If using API, call logout endpoint
        if (PROFILE_CONFIG.dataSource === 'api') {
            fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
                }
            }).catch(function() {});
        }
        
        window.location.href = '../login.html';
    }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================
function getValue(elementId) {
    var el = document.getElementById(elementId);
    return el ? el.value.trim() : '';
}

// ============================================================
// EXPOSE FUNCTIONS TO GLOBAL (for HTML onclick)
// ============================================================
window.enableEdit = enableEdit;
window.disableEdit = disableEdit;
window.updateProfile = updateProfile;
window.loadProfileData = loadProfileData;
window.goBack = goBack;
window.confirmLogout = confirmLogout;
window.openModal = openModal;
window.closeModal = closeModal;
window.changePassword = changePassword;