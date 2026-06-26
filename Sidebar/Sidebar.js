/* ============================================================
   sidebar.js — Toggle submenu untuk KVDSMZ
   Letak: <script src="../Sidebar/sidebar.js"></script>
   di bahagian bawah <body> setiap page.
   ============================================================ */

(function () {

    function init() {
        /* Cari semua nav-item yang ada attribute data-submenu */
        document.querySelectorAll('.nav-item[data-submenu]').forEach(function (btn) {

            /* Ambil submenu yang terus selepas button */
            var submenu = btn.nextElementSibling;
            if (!submenu || !submenu.classList.contains('submenu')) return;

            /* Auto-buka submenu kalau ada sub-item yang active (halaman semasa) */
            if (submenu.querySelector('.sub-nav-item.active')) {
                btn.classList.add('open');
            }

            /* Toggle bila button diklik */
            btn.addEventListener('click', function () {
                btn.classList.toggle('open');
            });
        });
    }

    /* Jalankan selepas DOM siap */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();