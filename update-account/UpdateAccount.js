window.onload = function() {
    if (localStorage.getItem('isLoggedIn') !== 'true') { window.location.href = "login.html"; return; }
    updateHeaderInfo();
    loadProfileData();
};

function updateHeaderInfo() {
    const role = localStorage.getItem('active_role');
    const name = localStorage.getItem('active_name');
    document.getElementById('display-role').innerText = role || "Teacher";
    document.getElementById('user-fullname').innerText = name || "User";
    document.getElementById('user-initial').innerText = name ? name.charAt(0).toUpperCase() : "?";
    if (role === "Penyelaras Intervensi") document.getElementById('nav-teacher-account').style.display = 'flex';
}

function loadProfileData() {
    document.getElementById('profID').value = localStorage.getItem('reg_id') || "N/A";
    document.getElementById('profIC').value = localStorage.getItem('reg_ic') || "N/A";
    document.getElementById('profName').value = localStorage.getItem('reg_name') || "";
    document.getElementById('profEmail').value = localStorage.getItem('reg_email') || "";
    document.getElementById('profPhone').value = localStorage.getItem('reg_phone') || "";
}

function updateProfile() {
    const name = document.getElementById('profName').value;
    localStorage.setItem('active_name', name);
    localStorage.setItem('reg_name', name);
    localStorage.setItem('reg_email', document.getElementById('profEmail').value);
    localStorage.setItem('reg_phone', document.getElementById('profPhone').value);
    alert("Profile updated!");
    
    // Selepas berjaya kemas kini, bawa pengguna kembali ke halaman viewaccount.html
    window.location.href = "viewaccount.html";
}

function logout() { localStorage.clear(); window.location.href = "../create-account/CreateAccount.html"; }