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
        // Sembunyikan Nav Account jika bukan Penyelaras Intervensi
        if (role !== "Penyelaras Intervensi") {
            if (accountNav) accountNav.style.display = 'none';
        }
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('main-wrapper').classList.toggle('expanded');
}

function saveStudent() {
    const name = document.getElementById("name").value;
    const ic = document.getElementById("ic").value;
    const cls = document.getElementById("cls").value;
    const addr = document.getElementById("address").value;
    const No = document.getElementById("No").value;

    if (!name || !ic || !cls || !addr || !No) {
        alert("Error: Please fill in all student details before saving.");
        return;
    }
    if (ic.length != 12 || isNaN(ic)) {
    alert("Error: IC Number must contain exactly 12 digits.");
    return;
    }

    let students = JSON.parse(localStorage.getItem("students")) || [];
    students.push({ name, ic, cls, address: addr, No});
    localStorage.setItem("students", JSON.stringify(students));
    alert("Student profile created successfully!");
    window.location.href = "studentList.html";
}

function logoutUser() {
    if(confirm("Are you sure you want to logout?")) {
        localStorage.removeItem('isLoggedIn');
        window.location.href = "../create-account/CreateAccount.html";
    }
}

window.onload = loadProfile;