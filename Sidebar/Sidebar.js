/* ============================================================
   SIDEBAR.JS — Toggle submenu, sidebar, role, dan PROFILE TOGGLE
   Semua pages guna file ni je untuk consistent behaviour.
   Letakkan: <script src="../Sidebar/Sidebar.js"></script>
   di bahagian bawah <body> setiap page.

   PROFILE TOGGLE (global):
   - Tekan icon profile di mana-mana page  -> buka Profile.html
     (URL page semasa disimpan dalam sessionStorage)
   - Tekan icon profile semasa DI Profile.html -> kembali ke
     page asal sebelum tu.
   PENTING: Jangan declare function toggleProfile() dalam
   mana-mana page JS lain — nanti override function global ni.
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

    /* ── INIT USER PROFILE (nama & initials kat header) ── */
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
                .map(function (word) { return word.charAt(0).toUpperCase(); })
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

    /* ── TOGGLE SIDEBAR (untuk mobile & menu button) ── */
    window.toggleSidebar = function () {
        var sidebar = document.getElementById('sidebar');
        var mainWrapper = document.getElementById('main-wrapper');
        var header = document.getElementById('header');

        if (sidebar) sidebar.classList.toggle('collapsed');
        if (mainWrapper) mainWrapper.classList.toggle('collapsed');
        if (header) header.classList.toggle('collapsed');
    };

    /* ============================================================
       GLOBAL PROFILE TOGGLE
       Dipanggil dari onclick="toggleProfile()" pada .user-profile
       di header SEMUA page (termasuk Profile.html sendiri).
       ============================================================ */
    window.toggleProfile = function () {
        // Kesan sama ada kita sedang berada di page Profile
        var isOnProfilePage = window.location.pathname
            .toLowerCase()
            .indexOf('/profile/profile.html') !== -1;

        if (isOnProfilePage) {
            // Tekan icon profile semasa DI Profile page -> kembali ke page asal
            var returnUrl = sessionStorage.getItem('profile_return_url');
            if (returnUrl) {
                window.location.href = returnUrl;
            } else {
                // Fallback kalau takde rekod (contoh: user buka Profile.html terus)
                window.location.href = '../Dashboard/Dashboard.html';
            }
        } else {
            // Simpan URL page semasa, kemudian pergi ke Profile page
            sessionStorage.setItem('profile_return_url', window.location.href);
            window.location.href = '../Profile/Profile.html';
        }
    };

    /* ── LOGOUT ── */
    window.logoutUser = function () {
        if (confirm('Are you sure you want to logout?')) {
            // Clear all storage
            localStorage.clear();
            sessionStorage.clear();

            // Redirect ke login page (CreateAccount.html berfungsi sebagai page login)
            window.location.href = '../Create-Account/CreateAccount.html';
        }
    };

    /* ── JALANKAN SELEPAS DOM SIAP ── */
    function init() {
        initSubmenu();
        initUserProfile();
        initRole();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();