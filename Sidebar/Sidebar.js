/* ============================================================
   SIDEBAR.JS — Sidebar navigation & role management
   Header functions in Header.js
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

    /* ── INIT ROLE ── */
    function initRole() {
        var role = localStorage.getItem('active_role') || 'Teacher';

        var roleBadgeEl = document.querySelector('.role-badge');
        if (roleBadgeEl) {
            roleBadgeEl.textContent = (role === 'Teacher') ? 'Subject Teacher' : role;
        }

        document.querySelectorAll('.nav-item[data-role]').forEach(function (item) {
            var allowedRole = item.getAttribute('data-role');
            if (allowedRole !== role) {
                item.style.display = 'none';
            } else {
                item.style.display = '';
            }
        });

        document.querySelectorAll('.sub-nav-item[data-role]').forEach(function (item) {
        var allowedRole = item.getAttribute('data-role');
        if (allowedRole !== role) {
            item.style.display = 'none';  // HIDE kalau role tak match
        } else {
            item.style.display = '';
        }
    });
    }

    /* ── LOGOUT ── */
    window.logoutUser = function () {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '../Create-Account/CreateAccount.html';
        }
        else {
            return;

        }
    };

    /* ── INIT ── */
    function init() {
        initSubmenu();
        initRole();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();