// --- FUNGSI AUTO PROFILE & NAVIGATION CONTROL ---
function loadProfile() {
    const name = localStorage.getItem('reg_name');
    const role = localStorage.getItem('reg_role');
    const accountNav = document.getElementById('nav-account');
    
    if (name) {
        document.getElementById('user-fullname').innerText = name;
        document.getElementById('user-initial').innerText = name.trim().charAt(0).toUpperCase();
    }
    
    if (role) {
        document.getElementById('sidebar-role').innerText = role;
        
        // Sembunyikan Account jika bukan Penyelaras Intervensi
        if (role !== "Penyelaras Intervensi") {
            if (accountNav) accountNav.style.display = 'none';
        }
    }
}

function loadStudentData() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const students = JSON.parse(localStorage.getItem("students"));

    if (students && students[id]) {
        const s = students[id];
        document.getElementById("v_name").innerText = s.name || "N/A";
        document.getElementById("v_ic").innerText = s.ic || "N/A";
        document.getElementById("v_cls").innerText = s.cls || "N/A";
        document.getElementById("v_address").innerText = s.address || "N/A";
        document.getElementById("v_No").innerText = s.No || "N/A";
    } else {
        alert("Student record not found!");
        window.location.href = "studentList.html";
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('main-wrapper').classList.toggle('expanded');
}

function logoutUser() {
    if(confirm("Are you sure you want to logout?")) {
        localStorage.removeItem('isLoggedIn');
        window.location.href = "../create-account/CreateAccount.html";
    }
}

window.onload = function() {
    loadProfile();
    loadStudentData();
};