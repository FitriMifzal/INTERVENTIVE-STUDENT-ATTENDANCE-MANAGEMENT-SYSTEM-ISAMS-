/* ============================================================
   DASHBOARD.JS — Dashboard specific functionality
   Profile functions now handled by Profile/Profile.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    sessionStorage.setItem('profile_return_url', window.location.href);
    if (localStorage.getItem('isLoggedIn') !== 'true') { 
        window.location.href = "../Dashboard/Dashboard.html"; 
        return; 
    }

    document.addEventListener('DOMContentLoaded', function () {
    // Update sessionStorage dengan Dashboard URL sekarang
    sessionStorage.setItem('profile_return_url', window.location.href);
    
    // Check if user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') { 
        window.location.href = "../login.html"; 
        return; 
    }
    
    // Dashboard-specific initialization
});
    
    // Dashboard-specific initialization
    // Profile data loading is now handled by Profile/Profile.js
});