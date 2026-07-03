
(function () {

    /* ── INIT USER PROFILE ── */
    function initUserProfile() {
        var userNameEl = document.getElementById('user-fullname');
        var userInitialEl = document.getElementById('user-initial');

        if (userNameEl && userInitialEl) {
            var storedName = localStorage.getItem('active_name');
            if (storedName) {
                userNameEl.textContent = storedName;
            }

            var userName = userNameEl.textContent.trim();
            var initials = userName
                .split(' ')
                .map(function (word) { return word.charAt(0).toUpperCase(); })
                .join('')
                .substring(0, 2);

            userInitialEl.textContent = initials || '?';
        }
    }

    /* ── TOGGLE SIDEBAR ── */
    window.toggleSidebar = function () {
        var sidebar = document.getElementById('sidebar');
        var mainWrapper = document.getElementById('main-wrapper');
        var header = document.getElementById('header');

        if (sidebar) sidebar.classList.toggle('collapsed');
        if (mainWrapper) mainWrapper.classList.toggle('collapsed');
        if (header) header.classList.toggle('collapsed');
    };

    /* ── TOGGLE PROFILE ── */
    window.toggleProfile = function () {
        var isOnProfilePage = window.location.pathname
            .toLowerCase()
            .indexOf('/profile/profile.html') !== -1;

        if (isOnProfilePage) {
            var returnUrl = sessionStorage.getItem('profile_return_url');
            if (returnUrl) {
                window.location.href = returnUrl;
            } else {
                window.location.href = '../Dashboard/Dashboard.html';
            }
        } else {
            sessionStorage.setItem('profile_return_url', window.location.href);
            window.location.href = '../Profile/Profile.html';
        }
    };

    /* ── INIT ── */
    function init() {
        initUserProfile();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();