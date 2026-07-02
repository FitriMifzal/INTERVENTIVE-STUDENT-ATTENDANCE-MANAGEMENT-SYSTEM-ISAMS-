/* ============================================================
   SIDEBAR.JS — Toggle submenu, sidebar, dan user profile
   Semua pages guna file ni je untuk consistent styling
   Letakkan: <script src="../Sidebar/Sidebar.js"></script>
   di bahagian bawah <body> setiap page.
   ============================================================ */

(function () {

    /* ── INIT SUBMENU ── */
    function initSubmenu() {
        document.querySelectorAll('.nav-item[data-submenu]').forEach(function (btn) {
            var submenu = btn.nextElementSibling;
            if (!submenu || !submenu.classList.contains('submenu')) return;

            /* Auto-buka submenu kalau ada sub-item yang active */
            if (submenu.querySelector('.sub-nav-item.active')) {
                btn.classList.add('open');
            }

            /* Toggle bila button diklik */
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                btn.classList.toggle('open');
            });
        });
    }

    /* ── INIT USER PROFILE (Generate initials dari name) ── */
    function initUserProfile() {
        var userNameEl = document.getElementById('user-fullname');
        var userInitialEl = document.getElementById('user-initial');
        
        if (userNameEl && userInitialEl) {
            // Guna nama sebenar dari localStorage (disimpan masa login) jika ada,
            // kalau tidak fallback ke text yang dah ada dalam HTML.
            var storedName = localStorage.getItem('active_name');
            if (storedName) {
                userNameEl.textContent = storedName;
            }

            var userName = userNameEl.textContent.trim();
            
            // Generate initials dari name
            var initials = userName
                .split(' ')
                .map(function(word) { return word.charAt(0).toUpperCase(); })
                .join('')
                .substring(0, 2);
            
            // Set initial (fallback to ? jika empty)
            userInitialEl.textContent = initials || '?';
        }
    }

    /* ── INIT ROLE (set role-badge text & hide/show nav items ikut role) ── */
    function initRole() {
        // Ambil role yang disimpan masa login (lihat CreateAccount.js -> checkLogin()).
        // Value yang disimpan: "Teacher" atau "Penyelaras Intervensi"
        var role = localStorage.getItem('active_role') || 'Teacher';

        // ── Set text pada role-badge ──
        var roleBadgeEl = document.querySelector('.role-badge');
        if (roleBadgeEl) {
            roleBadgeEl.textContent = (role === 'Teacher') ? 'Subject Teacher' : role;
        }

        // ── Hide nav-item yang ada data-role tapi tak match current role ──
        // Contoh: <a class="nav-item" data-role="Penyelaras Intervensi">Account</a>
        // Nav-item yang TAKDE data-role akan sentiasa nampak untuk semua role.
        document.querySelectorAll('.nav-item[data-role]').forEach(function (item) {
            var allowedRole = item.getAttribute('data-role');
            if (allowedRole !== role) {
                item.style.display = 'none';
            } else {
                item.style.display = '';
            }
        });
    }

    /* ── LOAD PROFILE DATA ── */
    function loadProfileData() {
        var profID = document.getElementById('profID');
        var profIC = document.getElementById('profIC');
        var profName = document.getElementById('profName');
        var profEmail = document.getElementById('profEmail');
        var profPhone = document.getElementById('profPhone');

        if (profID) profID.value = localStorage.getItem('reg_id') || "N/A";
        if (profIC) profIC.value = localStorage.getItem('reg_ic') || "N/A";
        if (profName) profName.value = localStorage.getItem('reg_name') || "";
        if (profEmail) profEmail.value = localStorage.getItem('reg_email') || "";
        if (profPhone) profPhone.value = localStorage.getItem('reg_phone') || "";
    }

    /* ── ENABLE EDIT MODE ── */
    function enableEdit() {
        // Enable editable fields
        var editableInputs = document.querySelectorAll('.profile-input');
        editableInputs.forEach(function(input) {
            input.disabled = false;
            input.classList.add('editable');
        });

        // Toggle button visibility
        var btnEdit = document.getElementById('btn-edit');
        var btnBack = document.getElementById('btn-back');
        var btnSave = document.getElementById('btn-save');
        var btnCancel = document.getElementById('id-cancel');
        
        if (btnEdit) btnEdit.style.display = 'none';
        if (btnBack) btnBack.style.display = 'none';
        if (btnSave) btnSave.style.display = 'inline-block';
        if (btnCancel) btnCancel.style.display = 'inline-block';
    }

    /* ── DISABLE EDIT MODE ── */
    function disableEdit() {
        // Disable editable fields
        var editableInputs = document.querySelectorAll('.profile-input');
        editableInputs.forEach(function(input) {
            input.disabled = true;
            input.classList.remove('editable');
        });

        // Toggle button visibility
        var btnEdit = document.getElementById('btn-edit');
        var btnBack = document.getElementById('btn-back');
        var btnSave = document.getElementById('btn-save');
        var btnCancel = document.getElementById('id-cancel');
        
        if (btnEdit) btnEdit.style.display = 'inline-block';
        if (btnBack) btnBack.style.display = 'inline-block';
        if (btnSave) btnSave.style.display = 'none';
        if (btnCancel) btnCancel.style.display = 'none';
        
        // Reload data (reset changes)
        loadProfileData();
    }

    /* ── UPDATE PROFILE ── */
    function updateProfile() {
        // Get updated values
        var profName = document.getElementById('profName');
        var profEmail = document.getElementById('profEmail');
        var profPhone = document.getElementById('profPhone');
        
        if (!profName || !profEmail || !profPhone) {
            alert('Profile fields not found');
            return;
        }

        var name = profName.value.trim();
        var email = profEmail.value.trim();
        var phone = profPhone.value.trim();
        
        // Validation
        if (!name || !email || !phone) {
            alert('Please fill all required fields');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        if (!isValidPhone(phone)) {
            alert('Please enter a valid phone number');
            return;
        }

        // Save to localStorage
        localStorage.setItem('reg_name', name);
        localStorage.setItem('reg_email', email);
        localStorage.setItem('reg_phone', phone);
        localStorage.setItem('active_name', name);

        // Update header name
        var userNameEl = document.getElementById('user-fullname');
        if (userNameEl) {
            userNameEl.textContent = name;
            
            // Regenerate initials
            var initials = name
                .split(' ')
                .map(function(word) { return word.charAt(0).toUpperCase(); })
                .join('')
                .substring(0, 2);
            
            var userInitialEl = document.getElementById('user-initial');
            if (userInitialEl) {
                userInitialEl.textContent = initials || '?';
            }
        }

        // API call (optional - uncomment jika ada backend)
        // fetch('/api/profile/update', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         name: name,
        //         email: email,
        //         phone: phone
        //     })
        // }).then(function(res) {
        //     return res.json();
        // }).then(function(data) {
        //     if (data.success) {
        //         alert('Profile updated successfully!');
        //         disableEdit();
        //     } else {
        //         alert('Failed to update profile: ' + (data.message || 'Unknown error'));
        //     }
        // }).catch(function(err) {
        //     console.error('Error:', err);
        //     alert('Error updating profile');
        // });

        alert('Profile updated successfully!');
        disableEdit();
    }

    /* ── VALIDATION FUNCTIONS ── */
    function isValidEmail(email) {
        var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function isValidPhone(phone) {
        // Accept various phone formats: +6012345678, 0129876543, etc
        var regex = /^(\+?6?01[0-9]{8,9}|0[0-9]{9,10})$/;
        return regex.test(phone.replace(/[\s\-()]/g, ''));
    }

    /* ── TOGGLE SIDEBAR (untuk mobile & menu button) ── */
    window.toggleSidebar = function () {
        var sidebar = document.getElementById('sidebar');
        var mainWrapper = document.getElementById('main-wrapper');
        var header = document.getElementById('header');

        if (sidebar) sidebar.classList.toggle('collapsed');
        if (mainWrapper) mainWrapper.classList.toggle('collapsed');
        if (header) header.classList.toggle('collapsed');
    };

    /* ── TOGGLE PROFILE (untuk dashboard profile section) ── */
    window.toggleProfile = function () {
        var profileSection = document.getElementById('profile-section');
        var welcomeCard = document.getElementById('welcome-card');

        if (profileSection) {
            var isHidden = profileSection.style.display === 'none' || profileSection.style.display === '';
            profileSection.style.display = isHidden ? 'block' : 'none';
        }
        if (welcomeCard) {
            var isHidden = welcomeCard.style.display === 'none' || welcomeCard.style.display === '';
            welcomeCard.style.display = isHidden ? 'none' : 'block';
        }

        // Load profile data when showing
        if (profileSection && profileSection.style.display === 'block') {
            loadProfileData();
        }
    };

    /* ── LOGOUT ── */
    window.logoutUser = function () {
        if (confirm('Are you sure you want to logout?')) {
            // Clear all storage
            localStorage.clear();
            sessionStorage.clear();
            
            // Redirect ke login page
            window.location.href = '../login.html'; // Update path sesuai system
        }
    };

    /* ── MAKE FUNCTIONS GLOBAL FOR BUTTONS ── */
    window.enableEdit = enableEdit;
    window.disableEdit = disableEdit;
    window.updateProfile = updateProfile;
    window.loadProfileData = loadProfileData;

    /* ── JALANKAN SELEPAS DOM SIAP ── */
    function init() {
        initSubmenu();
        initUserProfile();
        initRole();
        
        // Auto-load profile data if profile section exists
        if (document.getElementById('profile-section')) {
            loadProfileData();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();