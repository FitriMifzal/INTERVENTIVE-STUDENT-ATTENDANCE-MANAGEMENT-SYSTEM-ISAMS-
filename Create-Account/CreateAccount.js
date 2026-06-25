function showRegistration() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('registration-section').style.display = 'block';
    document.getElementById('backBtn').style.display = 'block'; 
}

function showLogin() {
    document.getElementById('registration-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none'; 
}

function askConfirmation() { 
    const id = document.getElementById('regID').value.trim();
    const name = document.getElementById('regName').value.trim();
    const pass = document.getElementById('regPass').value;
    if(!id || !pass || !name) { 
        alert("Please fill in ID, Name and Password!"); 
        return; 
    }
    document.getElementById('confirmModal').style.display = 'block'; 
}

function processConfirm() {
    const id = document.getElementById('regID').value.trim();
    const ic = document.getElementById('regIC').value.trim();
    const name = document.getElementById('regName').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;
    
    // Simpan semua data ke localStorage
    localStorage.setItem('reg_id', id);
    localStorage.setItem('reg_ic', ic);
    localStorage.setItem('reg_name', name);
    localStorage.setItem('reg_phone', phone);
    localStorage.setItem('reg_email', email);
    localStorage.setItem('reg_pass', pass);
    
    alert("Account created successfully!");
    document.getElementById('confirmModal').style.display = 'none';
    showLogin();
}

// Menukar label input mengikut pilihan Radio Button
function handleRoleChange() {
    const selectedRole = document.querySelector('input[name="loginRole"]:checked').value;
    const loginIDLabel = document.getElementById('loginIDLabel');
    const loginIDInput = document.getElementById('loginID');

    if (selectedRole === "Penyelaras Intervensi") {
        loginIDLabel.textContent = "ID Number";
        loginIDInput.placeholder = "Enter your ID Number";
    } else {
        loginIDLabel.textContent = "IC Number";
        loginIDInput.placeholder = "Enter your IC Number";
    }
}

// ── BERUBAH: LOGIK IKON MATA IKUT KELIHATAN PASSWORD ──
function togglePasswordVisibility(inputId, buttonEl) {
    const passInput = document.getElementById(inputId);
    if (passInput.type === "password") {
        passInput.type = "text";
        // Bila password kelihatan (user nak tengok), paparkan ikon mata TERBUKA luas
        buttonEl.innerHTML = "&#128065;"; 
    } else {
        passInput.type = "password";
        // Bila password disembunyikan (taknak orang tengok/kembali ****), paparkan mata DIHALANG/TUTUP
        buttonEl.innerHTML = "👁️‍🗨️"; 
    }
}

function checkLogin() {
    const inputID = document.getElementById('loginID').value.trim();
    const inputPass = document.getElementById('loginPass').value;
    const selectedRole = document.querySelector('input[name="loginRole"]:checked').value;

    if (selectedRole === "Penyelaras Intervensi") {
        if (inputID.toUpperCase() === "ADMIN123" && inputPass === "PASSWORD123") {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('active_role', "Penyelaras Intervensi");
            localStorage.setItem('active_name', "Admin Penyelaras");
            window.location.href = "../Dashboard/Dashboard.html";
        } else { 
            alert("Invalid Admin Credentials!"); 
        }
    } else {
        const storedIC = localStorage.getItem('reg_ic');
        const storedPass = localStorage.getItem('reg_pass');
        const storedName = localStorage.getItem('reg_name');

        if (storedIC && inputID === storedIC && inputPass === storedPass) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('active_role', "Teacher");
            localStorage.setItem('active_name', storedName);
            window.location.href = "Dashboard.html"; 
        } else { 
            alert("Invalid Teacher Credentials!"); 
        }
    }
}

function processCancel() { 
    document.getElementById('confirmModal').style.display = 'none'; 
}