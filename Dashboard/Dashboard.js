window.onload = function() {
    if (localStorage.getItem('isLoggedIn') !== 'true') { 
        window.location.href = "login.html"; 
        return; 
    }
    updateHeaderInfo();
    loadProfileData();
};

function updateHeaderInfo() {
    const role = localStorage.getItem('active_role');
    const name = localStorage.getItem('active_name');
    
    document.getElementById('display-role').innerText = role || "Teacher";
    document.getElementById('status-text').innerText = role || "Teacher";
    document.getElementById('user-fullname').innerText = name || "User";
    document.getElementById('welcome-msg').innerText = "Welcome, " + (name || "User");
    document.getElementById('user-initial').innerText = name ? name.charAt(0).toUpperCase() : "?";
    
    if (role === "Penyelaras Intervensi") {
        document.getElementById('nav-teacher-account').style.display = 'flex';
    }
}

function loadProfileData() {
    document.getElementById('profID').value = localStorage.getItem('reg_id') || "N/A";
    document.getElementById('profIC').value = localStorage.getItem('reg_ic') || "N/A";
    document.getElementById('profName').value = localStorage.getItem('reg_name') || "";
    document.getElementById('profEmail').value = localStorage.getItem('reg_email') || "";
    document.getElementById('profPhone').value = localStorage.getItem('reg_phone') || "";
}

function toggleProfile() {
    const ps = document.getElementById('profile-section');
    const wc = document.getElementById('welcome-card');
    
    if (ps.style.display === 'none' || ps.style.display === '') {
        ps.style.display = 'block'; 
        wc.style.display = 'none';
        loadProfileData(); 
        disableEdit();
    } else { 
        ps.style.display = 'none'; 
        wc.style.display = 'block'; 
    }
}

function enableEdit() {
    document.querySelectorAll('.profile-input').forEach(input => { 
        input.disabled = false; 
        input.classList.add('editable'); 
    });
    document.getElementById('btn-edit').style.display = 'none';
    document.getElementById('btn-back').style.display = 'none';
    document.getElementById('btn-save').style.display = 'block';
    document.getElementById('id-cancel').style.display = 'block';
}

function disableEdit() {
    document.querySelectorAll('.profile-input').forEach(input => { 
        input.disabled = true; 
        input.classList.remove('editable'); 
    });
    document.getElementById('btn-edit').style.display = 'block';
    document.getElementById('btn-back').style.display = 'block';
    document.getElementById('btn-save').style.display = 'none';
    document.getElementById('id-cancel').style.display = 'none';
    loadProfileData();
}

function updateProfile() {
    const name = document.getElementById('profName').value;
    localStorage.setItem('active_name', name);
    localStorage.setItem('reg_name', name);
    localStorage.setItem('reg_email', document.getElementById('profEmail').value);
    localStorage.setItem('reg_phone', document.getElementById('profPhone').value);
    
    alert("Profile updated!");
    updateHeaderInfo(); 
    disableEdit();
}

function logout() { 
    localStorage.clear(); 
    window.location.href = "../create-account/CreateAccount.html"; 
}