/* ============================================================
   DASHBOARD.JS — Dashboard specific functionality
   Profile functions now handled by Profile/Profile.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    // Update sessionStorage dengan URL page ni (untuk profile return)
    sessionStorage.setItem('profile_return_url', window.location.href);
    
    // Check if user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') { 
        window.location.href = "../Dashboard/Dashboard.html";
        return; 
    }
    
    // Dashboard-specific initialization
});