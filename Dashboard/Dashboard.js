/* ============================================================
   DASHBOARD.JS — Dashboard specific functionality
   Profile functions now handled by Profile/Profile.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') { 
        window.location.href = "../login.html"; 
        return; 
    }
    
    // Dashboard-specific initialization
    // Profile data loading is now handled by Profile/Profile.js
});